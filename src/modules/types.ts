import { Request } from "express";
import { User } from "@prisma/client";

export type RequestPlus = Request & {
  token?: string;
  user?: any;
};

export type UserInfo = Pick<
  User,
  "id" | "firstName" | "lastName" | "email" | "emailConfirmed"
>;

export enum MET {
  SWIMMING = 5,
  RUNNING = 7,
  WALKING = 4,
}
