import { MongoError } from "mongodb";

export interface UniqueFieldMongoError extends MongoError {
  keyValue: {
    [val: string]: string;
  };
}
