import app, { Request, Response, NextFunction } from "express";
import db from "../db";
const workoutRouter = app.Router();

workoutRouter.get("/", async (req: Request, res: Response) => {
  const workouts = await db.workout.findMany({});
  res.json(workouts);
});

workoutRouter.post("/", async (req: Request, res: Response) => {
  const workout = await db.workout.create({
    data: req.body,
  });
  res.json(workout);
});

workoutRouter.delete("/", async (req: Request, res: Response) => {
  const workout = await db.workout.delete({ where: { id: req.body.id } });
  res.json(workout);
});

export default workoutRouter;
