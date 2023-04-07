import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export type RequestPlus = Request & {
  token?: string;
  user?: any;
};

export const tokenExtractor = (
  req: RequestPlus,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.get("Authorization");
  if (!authorization) {
    console.log("No token provided");
    next();
    // } else if (authorization.substring(1, 8).toLowerCase() !== "bearer ") {
    //   throw new Error("Token provided, but its not a valid bearer token");
  } else {
    req.token = authorization.substring(8);
    console.log("req.token:", req.token);
    next();
  }
};

export const protect = async (
  req: RequestPlus,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("Unable to verify token.");
    } else if (!req.token) {
      throw new Error("No token provided to protect()");
    }
    req.user = jwt.verify(req.token, process.env.JWT_SECRET);
    console.log("req.user:", req.user);
    next();
  } catch (e) {
    if (e instanceof Error) res.status(401).json(e.message);
  }
};
