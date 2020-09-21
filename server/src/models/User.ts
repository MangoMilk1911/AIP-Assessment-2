import mongoose, { Schema, Document } from "mongoose";
import { Timestamp } from ".";

export interface IUser extends Document, Timestamp {
  _id: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export default mongoose.model<IUser>(
  "User",
  new Schema(
    {
      _id: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
      },
      displayName: {
        type: String,
        required: true,
        trim: true,
      },
      photoURL: {
        type: String,
        trim: true,
      },
    },
    { timestamps: true }
  )
);
