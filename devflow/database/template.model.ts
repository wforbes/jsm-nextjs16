/* // used as a template for new models
import { model, models, Types, Schema, Document } from "mongoose";

export interface IModel {}
export interface IModelDocument extends IModel, Document {}

const ModelSchema = new Schema<IModel>({}, { timestamps: true });

const Model = models?.model || model<IModel>("Model", ModelSchema);

export default Model;
*/
