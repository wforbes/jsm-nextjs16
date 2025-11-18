"use server";

import Question, { IQuestionDocument } from "@/database/question.model";
import action from "../handlers/action";
import handleError from "../handlers/error";
import {
	AskQuestionSchema,
	EditQuestionSchema,
	GetQuestionSchema,
	PaginatedSearchParamsSchema,
} from "../validations";
import mongoose, { FilterQuery } from "mongoose";
import Tag, { ITagDocument } from "@/database/tag.model";
import TagQuestion from "@/database/tag-question.model";

const REMOVE_ORPHAN_TAGS_ON_EDIT = true;

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
			//  or if we do find it, we increment the question count
			const existingTag = await Tag.findOneAndUpdate(
				{
					name: { $regex: new RegExp(`^${tag}$`, "i") },
				},
				{ $setOnInsert: { name: tag }, $inc: { questions: 1 } },
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

export async function editQuestion(
	params: EditQuestionParams
): Promise<ActionResponse<IQuestionDocument>> {
	const validationResult = await action({
		params,
		schema: EditQuestionSchema,
		authorize: true,
	});

	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}

	const { title, content, tags, questionId } = validationResult.params!;
	const userId = validationResult?.session?.user?.id;

	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		const question = await Question.findById(questionId).populate("tags");
		if (!question) {
			throw new Error("Question not found.");
		}
		// TODO: allow admins to edit any question
		if (question.author.toString() !== userId) {
			throw new Error("Unauthorized.");
		}

		if (question.title !== title || question.content !== content) {
			question.title = title;
			question.content = content;
			await question.save({ session });
		}

		const tagsToAdd = tags.filter(
			(tag) =>
				!question.tags.some((t: ITagDocument) =>
					t.name.toLowerCase().includes(tag.toLowerCase())
				)
		);
		const tagsToRemove = question.tags.filter(
			(tag: ITagDocument) =>
				!tags.some((t) => t.toLowerCase() === tag.name.toLowerCase())
		);

		const newTagDocuments = [];

		if (tagsToAdd.length > 0) {
			for (const tag of tagsToAdd) {
				const existingTag = await Tag.findOneAndUpdate(
					{
						name: { $regex: `^${tag}$`, $options: "i" },
					},
					{ $setOnInsert: { name: tag }, $inc: { questions: 1 } },
					{ new: true, upsert: true, session }
				);
				if (existingTag) {
					newTagDocuments.push({
						tag: existingTag._id,
						question: questionId,
					});
					question.tags.push(existingTag._id);
				}
			}
		}

		if (tagsToRemove.length > 0) {
			const tagIdsToRemove = tagsToRemove.map(
				(tag: ITagDocument) => tag._id
			);

			await Tag.updateMany(
				{ _id: { $in: tagIdsToRemove } },
				{ $inc: { questions: -1 } },
				{ session }
			);

			if (REMOVE_ORPHAN_TAGS_ON_EDIT) {
				await Tag.deleteMany(
					{ _id: { $in: tagIdsToRemove }, questions: 0 },
					{ session }
				);
			}

			await TagQuestion.deleteMany(
				{ tag: { $in: tagIdsToRemove }, question: questionId },
				{ session }
			);

			question.tags = question.tags.filter(
				(tag: mongoose.Types.ObjectId) =>
					!tagIdsToRemove.some((id: mongoose.Types.ObjectId) =>
						id.equals(tag._id)
					)
			);
		}
		if (newTagDocuments.length > 0) {
			await TagQuestion.insertMany(newTagDocuments, { session });
		}
		await question.save({ session });
		await session.commitTransaction();
		return {
			success: true,
			data: JSON.parse(JSON.stringify(question)),
		};
	} catch (error) {
		await session.abortTransaction();
		return handleError(error as Error) as ErrorResponse;
	}
}

export async function getQuestion(
	params: GetQuestionParams
): Promise<ActionResponse<Question>> {
	const validationResult = await action({
		params,
		schema: GetQuestionSchema,
		authorize: true,
	});

	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}

	const { questionId } = validationResult.params!;

	try {
		const question = await Question.findById(questionId).populate("tags");
		if (!question) {
			throw new Error("Question not found.");
		}
		return {
			success: true,
			data: JSON.parse(JSON.stringify(question)),
		};
	} catch (error) {
		return handleError(error as Error) as ErrorResponse;
	}
}

export async function getQuestions(
	params: PaginatedSearchParams
): Promise<ActionResponse<{ questions: Question[]; isNext: boolean }>> {
	const validationResult = await action({
		params,
		schema: PaginatedSearchParamsSchema,
	});
	if (validationResult instanceof Error) {
		return handleError(validationResult) as ErrorResponse;
	}
	const { page = 1, pageSize = 10, query, filter } = validationResult.params!;
	const skip = (Number(page) - 1) * pageSize; // calculate how many documents to skip
	const limit = Number(pageSize);

	const filterQuery: FilterQuery<typeof Question> = {};
	// TODO: implement recommended logic
	if (filter === "recommended")
		return { success: true, data: { questions: [], isNext: false } };

	if (query) {
		filterQuery.$or = [
			{ title: { $regex: new RegExp(query, "i") } },
			{ content: { $regex: new RegExp(query, "i") } },
		];
	}

	let sortCriteria = {};
	switch (filter) {
		case "newest":
			sortCriteria = { createdAt: -1 };
			break;
		case "unanswered":
			filterQuery.answers = 0;
			sortCriteria = { createdAt: -1 };
			break;
		case "popular":
			sortCriteria = { upvotes: -1 };
			break;
		default:
			sortCriteria = { createdAt: -1 };
			break;
	}

	try {
		const totalQuestions = await Question.countDocuments(filterQuery);
		const questions = await Question.find(filterQuery)
			.populate("tags", "name")
			.populate("author", "name image")
			.lean() // convert to plain JS objects, easier to work with
			.sort(sortCriteria)
			.skip(skip)
			.limit(limit); // fetch one extra document to check if there's a next page
		// Determine if there's a next page
		const isNext = totalQuestions > skip + questions.length;
		return {
			success: true,
			data: { questions: JSON.parse(JSON.stringify(questions)), isNext },
		};
	} catch (error) {
		return handleError(error as Error) as ErrorResponse;
	}
}
