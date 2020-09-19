import type { Request, Response, NextFunction } from "express";
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
 * Custom error handling middleware to catch expected errors or
 * return a default 500 error message if unkown
 */
// prettier-ignore
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    const { statusCode, message } = err;
    return res.status(statusCode).json({
      status: "error",
      statusCode,
      message
    });
  }

  // If unkown error
  logger.error(err.stack)
  res.sendStatus(500);
};

export default errorHandler;
