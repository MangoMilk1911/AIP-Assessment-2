import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";
import { Timestamp } from ".";

export interface Contributor {
  userId: string;
  displayName: string;
  photoURL?: string;
  rewards: Map<string, number>;
}

export interface IRequest extends Document, Timestamp {
  title: string;
  contributors: Contributor[];
  description: string;
  evidence?: Buffer;
  recipient?: Pick<IUser, "_id" | "displayName" | "photoURL">;
}

export default mongoose.model<IRequest>(
  "Request",
  new Schema(
    {
      title: {
        type: String,
        required: true,
      },
      contributors: [
        new Schema(
          {
            userId: String,
            displayName: String,
            photoURL: String,
            rewards: {
              type: Map,
              of: Number,
            },
          },
          {
            _id: false,
          }
        ),
      ],
      description: {
        type: String,
        required: true,
      },
      evidence: {
        type: Buffer,
      },
      recipient: {
        type: new Schema({
          _id: String,
          displayName: String,
          photoURL: String,
        }),
      },
    },
    { timestamps: true }
  )
);
