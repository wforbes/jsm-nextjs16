import { model, models, ObjectId, Schema } from "mongoose";

export interface IAccount {
	_id: string;
	userId: ObjectId;
	name: string;
	image: string;
	password: string;
	provider: string;
	providerAccountId: string;
}

const AccountSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		name: { type: String, required: true },
		image: { type: String, required: true },
		password: { type: String, required: true },
		provider: { type: String, required: true },
		providerAccountId: { type: String, required: true },
	},
	{ timestamps: true }
);

const Account = models?.account || model<IAccount>("Account", AccountSchema);

export default Account;
