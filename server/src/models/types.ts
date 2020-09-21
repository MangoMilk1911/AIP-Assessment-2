import { IUser } from "./User";

export interface Timestamp {
  createdAt?: Date;
  updatedAt?: Date;
}

export type EmbeddedUser = Pick<
  IUser,
  "_id" | "displayName" | "email" | "photoURL"
>;

export type Reward = Map<string, number>;
