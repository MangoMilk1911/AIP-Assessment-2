import mongoose, { Schema, Document } from "mongoose";
import { Timestamp } from "./types";

// ==================== User Model ====================

export interface IUser extends Document, Timestamp {
  _id: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

const User = mongoose.model<IUser>(
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

// ==================== Embedded User ====================

export type EmbeddedUser = Pick<
  IUser,
  "_id" | "email" | "displayName" | "photoURL"
>;

export const EmbeddedUserSchema = new Schema({
  _id: String,
  email: String,
  displayName: String,
  photoURL: String,
});

export default User;
