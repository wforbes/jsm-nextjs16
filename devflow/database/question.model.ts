import { model, models, Types, Schema } from "mongoose";

export interface IQuestion {
	author: Types.ObjectId;
	title: string;
	content: string;
	tags: Types.ObjectId[];
	views: number;
	upvotes: number;
	downvotes: number;
	answers: Types.ObjectId[];
}

const QuestionSchema = new Schema(
	{
		author: { type: Schema.Types.ObjectId, ref: "User", required: true },
		title: { type: String, required: true },
		content: { type: String, required: true },
		tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
		views: { type: Number, default: 0 },
		upvotes: { type: Number, default: 0 },
		downvotes: { type: Number, default: 0 },
		answers: { type: [Schema.Types.ObjectId], ref: "Answer", default: [] },
	},
	{ timestamps: true }
);

const Question =
	models?.question || model<IQuestion>("Question", QuestionSchema);

export default Question;
