import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { UserInfo } from "./types";

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
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  return token;
};

export const createEmailConfirmToken = (userInfo: UserInfo) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Unable to create token.");
  }

  const emailConfirmToken = jwt.sign(userInfo, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return emailConfirmToken;
};
