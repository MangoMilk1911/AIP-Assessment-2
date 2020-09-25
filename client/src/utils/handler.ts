import withDatabase from "middleware/database";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import errorHandler from "./errorHandler";

const createHandler = () => {
  const handler = nextConnect<NextApiRequest, NextApiResponse>({
    onError: errorHandler,
  });

  // Apply global middleware
  handler.use(withDatabase);

  return handler;
};

export default createHandler;
