import { model, models, Types, Schema } from "mongoose";

export interface ITagQuestion {
	tagId: Types.ObjectId;
	questionId: Types.ObjectId;
}

const TagQuestionSchema = new Schema(
	{
		tagId: { type: Schema.Types.ObjectId, ref: "Tag", required: true },
		questionId: {
			type: Schema.Types.ObjectId,
			ref: "Question",
			required: true,
		},
	},
	{ timestamps: true }
);

const TagQuestion =
	models?.TagQuestion ||
	model<ITagQuestion>("TagQuestion", TagQuestionSchema);

export default TagQuestion;
