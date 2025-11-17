"use server";

import Question from "@/database/question.model";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { AskQuestionSchema } from "../validations";
import mongoose from "mongoose";
import Tag from "@/database/tag.model";
import TagQuestion from "@/database/tag-question.model";

export async function createQuestion(
	params: CreateQuestionParams
): Promise<ActionResponse<Question>> {
	const validationResult = await action({
		params,
		schema: AskQuestionSchema,
		authorize: true,
	});

	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}

	const { title, content, tags } = validationResult.params!;
	const userId = validationResult?.session?.user?.id;

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const [question] = await Question.create(
			[
				{
					title,
					content,
					author: userId,
				},
			],
			{ session }
		);

		if (!question) {
			throw new Error("Failed to create question.");
		}

		const tagIds: mongoose.Types.ObjectId[] = [];
		const tagQuestionDocs = [];
		for (const tag of tags) {
			// search for a tag of the specific name
			//  if we dont find it, we insert a new one
			//  or if we do find it, we increment the questionCount
			const existingTag = await Tag.findOneAndUpdate(
				{
					name: { $regex: new RegExp(`^${tag}$`, "i") },
				},
				{ $setOnInsert: { name: tag }, $inc: { questionCount: 1 } },
				{ new: true, upsert: true, session }
			);
			tagIds.push(existingTag!._id);
			tagQuestionDocs.push({
				tag: existingTag!._id,
				question: question._id,
			});
		}
		await TagQuestion.insertMany(tagQuestionDocs, { session });
		await Question.findByIdAndUpdate(
			question._id,
			{ $push: { tags: { $each: tagIds } } },
			{ session }
		);

		await session.commitTransaction();

		return {
			success: true,
			data: JSON.parse(JSON.stringify(question)),
		};
	} catch (error) {
		await session.abortTransaction();
		return handleError(error as Error) as ErrorResponse;
	} finally {
		await session.endSession();
	}
}
