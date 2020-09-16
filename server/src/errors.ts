import { MongoError } from "mongodb";

/**
 * @description **MONGO ERROR CODE(S): 11000**
 *
 * Custom error for when a duplicate value on a unique field exists
 * when creating a document
 *
 * `keyValue` will contain the [field] and its value
 * @example { username: "johnny" }
 */
export class UniqueFieldMongoError extends MongoError {
  public readonly keyValue!: {
    [duplicatedField: string]: string;
  };
}

export class RepeatPasswordError extends Error {
  constructor() {
    super("Passwords do not match.");
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = RepeatPasswordError.name;
  }
}
