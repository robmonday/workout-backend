import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { User } from "@prisma/client";

//helper function
// comparing plain text password submitted to hash stored in DB
export const comparePassword = (password: string, hash: string) => {
  return bcrypt.compare(password, hash); // returns a promise
};

//helper function
export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 5);
};

// converting an object to a string to create token (using secret)
export const createJWT = (user: User) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Unable to create token.");
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET
  );
  return token;
};

export type RequestWithUser = Request & {
  user: string | jwt.JwtPayload;
};

// receive token convert it back to object (using secret)
// this middleware function can sit in front of any route that must be authenticated
export const protect = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  // gets authorization header from a request
  const bearer = req.headers.authorization;

  // if there is no header, request cannot proceed
  if (!bearer) {
    res.status(401);
    res.json({ message: "not authorized" });
    return; // returning instead of calling next() stops request from proceeding to its route function
  }

  const [, token] = bearer.split(" ");

  if (!token) {
    res.status(401);
    res.json({ message: "not authorized" });
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("Unable to verify token.");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log(payload);
    req.user = payload; // saving extracted user object into request object
    next();
  } catch (e) {
    console.error(e);
    res.status(401);
    res.json({ message: "token not valid" });
    return;
  }
};
