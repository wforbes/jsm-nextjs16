"use server";

import mongoose from "mongoose";
import action from "../handlers/action";
import handleError from "../handlers/error";
import Answer, { IAnswerDocument } from "@/database/answer.model";
import { AnswerServerSchema, GetAnswersSchema } from "../validations";
import { Question } from "@/database";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/routes";

export async function createAnswer(
	params: CreateAnswerParams
): Promise<ActionResponse<IAnswerDocument>> {
	const validationResult = await action({
		params,
		schema: AnswerServerSchema,
		authorize: true,
	});

	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}

	const { questionId, content } = validationResult.params!;
	const userId = validationResult?.session?.user?.id;

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const question = await Question.findById(questionId);
		if (!question) {
			throw new Error("Question not found.");
		}

		const [newAnswer] = await Answer.create(
			[
				{
					content,
					question: questionId,
					author: userId,
				},
			],
			{ session }
		);

		question.answers += 1;

		await question.save({ session });
		await session.commitTransaction();

		revalidatePath(ROUTES.QUESTION(questionId));
		return {
			success: true,
			data: JSON.parse(JSON.stringify(newAnswer)),
		};
	} catch (error) {
		await session.abortTransaction();
		throw error;
	} finally {
		await session.endSession();
	}
}

export async function getAnswers(params: GetAnswersParams): Promise<
	ActionResponse<{
		answers: Answer[];
		isNext: boolean;
		totalAnswers: number;
	}>
> {
	const validationResult = await action({
		params,
		schema: GetAnswersSchema,
	});

	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}

	const {
		questionId,
		page = 1,
		pageSize = 10,
		filter,
	} = validationResult.params!;
	const skip = (Number(page) - 1) * pageSize;
	const limit = Number(pageSize);

	let sortCriteria = {};
	switch (filter) {
		case "newest":
			sortCriteria = { createdAt: -1 };
			break;
		case "oldest":
			sortCriteria = { createdAt: 1 };
			break;
		case "popular":
			sortCriteria = { upvotes: -1 };
			break;
		default:
			sortCriteria = { createdAt: -1 };
			break;
	}

	try {
		const totalAnswers = await Answer.countDocuments({
			question: questionId,
		});
		const answers = await Answer.find({ question: questionId })
			.populate("author", "_id name image")
			.sort(sortCriteria)
			.skip(skip)
			.limit(limit);

		const isNext = totalAnswers > skip + answers.length;
		return {
			success: true,
			data: {
				answers: JSON.parse(JSON.stringify(answers)),
				isNext,
				totalAnswers,
			},
		};
	} catch (error) {
		return handleError(error as Error) as ErrorResponse;
	}
}
