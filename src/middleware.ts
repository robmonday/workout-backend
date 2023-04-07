import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { RequestPlus } from "./types";

export const tokenExtractor = (
  req: RequestPlus,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.get("Authorization");
  console.log("authorization", req.get("Authorization"));
  if (!authorization) {
    console.log("No token provided");
    next();
  } else {
    req.token = authorization.split(" ")[1];
    console.log("req.token from tokenExtractor:", req.token);
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
    console.log("req.token from protect", req.token);
    console.log("process.env.JWT_SECRET", process.env.JWT_SECRET);
    req.user = jwt.verify(req.token, process.env.JWT_SECRET);
    console.log("req.user:", req.user);
    next();
  } catch (e) {
    console.error(e);
    res.status(401).json({ message: "token not valid" });
    return;
  }
};
export { RequestPlus };
