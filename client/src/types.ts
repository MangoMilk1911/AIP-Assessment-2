import { ValidationError } from "express-validator";

/**
 * Server Error Response
 */
export interface ErrorResponse {
  type: "api" | "validation";
  status: "error";
  statusCode: number;
  message?: string;
  errors?: ValidationError[];
}
