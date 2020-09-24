import { auth } from "../utils/firebase";
import type { Request, Response, NextFunction } from "express";

// Typings for custom req.userId on express requests
declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const isAuthed = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.sendStatus(401);
  }

  try {
    const tokenPayload = await auth.verifyIdToken(accessToken);
    req.userId = tokenPayload.sub;
    next();
  } catch (error) {
    // Invalid access token
    res.sendStatus(403);
  }
};

export default isAuthed;
