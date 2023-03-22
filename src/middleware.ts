import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

type RequestWithUser = Request & {
  userObj?: string | JwtPayload;
};

export const tokenExtractor = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Unable to verify token.");
  }

  const authorization = req.get("authorization");
  if (
    process.env.JWT_SECRET &&
    authorization &&
    authorization.toLowerCase().startsWith("bearer ")
  ) {
    try {
      req.userObj = jwt.verify(
        authorization.substring(7),
        process.env.JWT_SECRET
      );
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
    // } else {
    //   return res.status(401).json({ error: "token missing" });
  }

  next();
};
