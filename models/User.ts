import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
}

const UserSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 30 },
});

export default (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);
