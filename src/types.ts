import { Request } from "express";

export type RequestPlus = Request & {
  token?: string;
  user?: any;
};
