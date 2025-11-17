import { model, models, Types, Schema, Document } from "mongoose";

export interface IInteraction {
	user: Types.ObjectId;
	action: string;
	actionId: Types.ObjectId;
	actionType: "question" | "answer";
}
export interface IInteractionDocument extends IInteraction, Document {}

const InteractionSchema = new Schema<IInteraction>(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		action: { type: String, required: true },
		actionId: { type: Schema.Types.ObjectId, required: true }, // question/answer/user/etc
		actionType: {
			type: String,
			enum: ["question", "answer"],
			required: true,
		},
	},
	{ timestamps: true }
);

const Interaction =
	models?.Interaction ||
	model<IInteraction>("Interaction", InteractionSchema);

export default Interaction;
