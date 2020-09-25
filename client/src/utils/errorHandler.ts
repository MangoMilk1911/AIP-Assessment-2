import type { ErrorHandler } from "next-connect";
import { Result as ValidationResult, ValidationError } from "express-validator";
import { NextApiRequest, NextApiResponse } from "next";
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
export interface ErrorResponse {
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
const errorHandler: ErrorHandler<
  NextApiRequest | any,
  NextApiResponse | any
> = (err, req, res, next) => {
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

  // If Unkown Error
  logger.error(err.stack);
  res.status(500).send("Something went wrong.");
};

export default errorHandler;
