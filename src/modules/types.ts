import { Request } from "express";

export type RequestPlus = Request & {
  token?: string;
  user?: any;
};

export enum MET {
  SWIMMING = 5,
  RUNNING = 7,
  WALKING = 4,
}
