import mongoose, { Document, Schema } from "mongoose";
import { EmbeddedUser, Timestamp } from "./types";
import { IUser } from "./User";

export type Reward = {
  name: string;
  amount: number;
};

export interface IFeature extends Document, Timestamp {
  creator: EmbeddedUser;
  debtor: EmbeddedUser;
  recipient: EmbeddedUser;
  rewards: Reward[];
  initialEvidence?: Buffer;
  evidence?: Buffer;
}

export default mongoose.model<IUser>(
  "Favour",
  new Schema({
    debtor: [],
    recipient: {},
    rewards: {},
    evidence: {},
  })
);
