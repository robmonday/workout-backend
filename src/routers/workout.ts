import app, { Request, Response, NextFunction } from "express";
import db from "../db";
const workoutRouter = app.Router();

workoutRouter.get("/", async (req: Request, res: Response) => {
  const workouts = await db.workout.findMany({});
  res.json(workouts);
});

export default workoutRouter;
