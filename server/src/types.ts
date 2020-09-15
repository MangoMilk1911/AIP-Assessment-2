import { MongoError } from "mongodb";

export interface BetterMongoError extends MongoError {
  keyValue: {
    [val: string]: string;
  };
}
