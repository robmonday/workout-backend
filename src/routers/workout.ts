import app, { Request, Response } from "express";
import db from "../db";
const workoutRouter = app.Router();

workoutRouter.get("/", async (req: Request, res: Response) => {
  const workouts = await db.workout.findMany({
    include: {
      workoutType: { select: { name: true } },
    },
  });
  res.json(workouts);
});

workoutRouter.get("/type", async (req: Request, res: Response) => {
  const workouts = await db.workoutType.findMany({
    select: { id: true, name: true },
  });
  res.json(workouts);
});

workoutRouter.post("/", async (req: Request, res: Response) => {
  const user = await db.user.findFirst({});
  if (!user) {
    res.json({
      message: "unable to create workout because unable to identify user",
    });
  }
  const workout = await db.workout.create({
    data: { ...req.body, userId: user?.id },
    include: {
      workoutType: { select: { name: true } },
    },
  });
  res.json(workout);
});

workoutRouter.delete("/", async (req: Request, res: Response) => {
  const workout = await db.workout.delete({
    where: { id: req.body.id },
    include: {
      workoutType: { select: { name: true } },
    },
  });
  res.json(workout);
});

export default workoutRouter;
