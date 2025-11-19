"use server";

import mongoose from "mongoose";
import action from "../handlers/action";
import handleError from "../handlers/error";
import Answer, { IAnswerDocument } from "@/database/answer.model";
import { AnswerServerSchema } from "../validations";
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
