import { Request } from "express";

export type RequestPlus = Request & {
  token?: string;
  user?: any;
};

export enum MET {
  SWIMMING = 8,
  RUNNING = 14,
  WALKING = 11,
}
