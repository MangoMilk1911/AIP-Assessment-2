import type { Request, Response, NextFunction } from "express";
import { Result as ValidationResult, ValidationError } from "express-validator";
import { MongoError } from "mongodb";
import logger from "./logger";

/**
 * Custom Error for handling any expected api errors
 */
export class ApiError extends Error {
  public readonly statusCode;

  /**
   * @param statusCode The HTTP Status Code of the response e.g. (400, 401, etc.)
   * @param message The message to be sent in the response
   */
  constructor(statusCode: number, message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
  }
}

/**
 * Custom format for errors returned from the server
 */
interface ErrorResponse {
  type: "api" | "validation" | "database";
  status: "error";
  statusCode: number;
  message?: string;
  errors?: ValidationError[];
}

/**
 * Custom error handling middleware to catch expected errors or
 * return a default 500 error message if unknown
 */
const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
   * Expected Api Errors
   */
  if (err instanceof ApiError) {
    const { statusCode, message } = err;
    return res.status(statusCode).json({
      type: "api",
      status: "error",
      statusCode,
      message,
    } as ErrorResponse);
  }

  /**
   * Validation Errors
   */
  if ((err as Object).hasOwnProperty("throw")) {
    return res.status(400).json({
      type: "validation",
      status: "error",
      statusCode: 400,
      errors: ((err as unknown) as ValidationResult<ValidationError>).array(),
    } as ErrorResponse);
  }

  /**
   * Mongo Errors
   */
  if (err instanceof MongoError) {
    // Duplicate key error
    if (err.code === 11000) {
      // Find the collection & create a singular
      const [collection] = err.message.match(/(?<=database\.)((\w+))/g)!;
      const singular =
        collection.charAt(0).toUpperCase() + collection.slice(1, -1);

      // Find the affected key
      const key = Object.keys((err as any).keyValue)[0];

      // Construct error message
      const message = `${singular} with that ${key} already exists in database.`;

      return res.status(400).json({
        type: "database",
        status: "error",
        statusCode: 400,
        message,
      } as ErrorResponse);
    }
  }

  // If Unkown Error
  logger.error(err.stack);
  res.sendStatus(500);
};

export default errorHandler;
