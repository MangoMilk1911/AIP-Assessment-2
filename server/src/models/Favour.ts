import mongoose, { Document, Schema } from "mongoose";
import { Timestamp } from "./types";
import { EmbeddedUser, EmbeddedUserSchema } from "./User";

export type Reward = Map<string, number>;

export interface IFavour extends Document, Timestamp {
  creator: EmbeddedUser;
  debtor: EmbeddedUser;
  recipient: EmbeddedUser;
  rewards: Reward[];
  initialEvidence?: Buffer;
  evidence?: Buffer;
}

export default mongoose.model<IFavour>(
  "Favour",
  new Schema({
    creator: EmbeddedUserSchema,
    debtor: EmbeddedUserSchema,
    recipient: EmbeddedUserSchema,
    rewards: {
      type: Map,
      of: Number,
    },
    evidence: {
      type: Buffer,
    },
    initialEvidence: {
      type: Buffer,
    },
  })
);
