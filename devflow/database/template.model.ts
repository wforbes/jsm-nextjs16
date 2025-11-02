import { model, models, Types, Schema } from "mongoose";

export interface IModel {}

const ModelSchema = new Schema({}, { timestamps: true });

const Model = models?.model || model<IModel>("Model", ModelSchema);

export default Model;
