import mongoose, { Document, Schema } from "mongoose";
import { Timestamp } from "./types";
import { EmbeddedUser, EmbeddedUserSchema } from "./User";

export interface Contributor {
  user: EmbeddedUser;
  rewards: Map<string, number>;
}

export interface IRequest extends Document, Timestamp {
  title: string;
  contributors: Contributor[];
  description: string;
  evidence?: Buffer;
  recipient?: EmbeddedUser;
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
            user: EmbeddedUserSchema,
            rewards: {
              type: Map,
              of: Number,
            },
          },
          { _id: false }
        ),
      ],
      description: {
        type: String,
        required: true,
      },
      evidence: {
        type: Buffer,
      },
      recipient: EmbeddedUserSchema,
    },
    { timestamps: true }
  )
);
