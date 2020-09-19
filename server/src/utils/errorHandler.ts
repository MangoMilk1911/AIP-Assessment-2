import type { Request, Response, NextFunction } from "express";
import { Result as ValidationResult, ValidationError } from "express-validator";
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
  type: "api" | "validation";
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
  // Expected Custom Api Error
  if (err instanceof ApiError) {
    const { statusCode, message } = err;
    return res.status(statusCode).json({
      status: "error",
      type: "api",
      statusCode,
      message,
    } as ErrorResponse);
  }

  // Validation Error
  if ((err as Object).hasOwnProperty("throw")) {
    return res.status(400).json({
      status: "error",
      type: "validation",
      statusCode: 400,
      errors: ((err as unknown) as ValidationResult<ValidationError>).array(),
    } as ErrorResponse);
  }

  // If Unkown Error
  logger.error(err.stack);
  res.sendStatus(500);
};

export default errorHandler;
