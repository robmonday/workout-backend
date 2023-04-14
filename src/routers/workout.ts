import app, { Request, Response } from "express";
const workoutRouter = app.Router();

import { RequestPlus } from "../modules/types";

import { Prisma } from "@prisma/client";
import db, { knownDbError } from "../modules/db";

const asyncErrorHandler = (e: any, res: Response) => {
  console.error(e);
  if (e instanceof knownDbError && e.code === "P2003") {
    res.status(409).json({
      message: "Foreign key error",
    });
  } else if (e instanceof Error) {
    res.status(400).json(e);
  }
};

workoutRouter.get("/", async (req: RequestPlus, res: Response) => {
  const userId = req.user.id;
  try {
    if (req.query.hasOwnProperty("groupBy")) {
      const groupedworkouts = await db.workout.groupBy({
        by: [req.query.groupBy as any],
        where: { userId },
        _count: true,
        orderBy: { _count: { location: "desc" } },
      });
      res.json(groupedworkouts);
    } else {
      const workouts = await db.workout.findMany({
        where: { userId },
        include: {
          workoutType: { select: { name: true, id: true } },
        },
      });

      res.json(workouts);
    }
  } catch (e) {
    asyncErrorHandler(e, res);
  }
});

workoutRouter.get("/timeseries", async (req: RequestPlus, res: Response) => {
  try {
    const result1 = await db.$queryRaw(
      Prisma.sql`with table1 as (select generate_series( date_trunc('day', now()) - '29 days'::interval, date_trunc('day', now()), '1 day'::interval )::timestamp as day), table2 as (select date_trunc('day', start) as day_w_null, * from "Workout"), table3 as (select * from table1 left join table2 on table1.day = table2.day_w_null) select *, extract (epoch from ( coalesce("end", now()) - coalesce("start" , now()) )) as seconds from table3 order by day;`
    );
    const result2 = result1;
    res.json(result2);
  } catch (e) {
    asyncErrorHandler(e, res);
  }
});

workoutRouter.get("/averages", async (req: RequestPlus, res: Response) => {
  const userId = req.user.id;

  const workAvgs = await db.workout.groupBy({
    by: ["workoutTypeId"],
    where: { userId },
    _avg: { steps: true, calories: true, distance: true },
  });
  const workTypes = await db.workoutType.findMany({});

  const outputObj = workAvgs.map((a) => {
    const workType = workTypes.find((t) => t.id === a.workoutTypeId);

    return {
      workoutName: workType?.name,
      steps: a._avg.steps,
      calories: a._avg.calories,
      distance: a._avg.distance,
    };
  });

  res.json(outputObj);
});

workoutRouter.get("/leaderboard", async (req: RequestPlus, res: Response) => {
  const date = new Date();
  const result = await db.workout.groupBy({
    where: { start: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    by: ["userId"],
    _sum: { steps: true, calories: true, distance: true },
    orderBy: {
      _sum: { steps: "desc" },
    },
  });
  res.json(result);
});

workoutRouter.get("/type", async (req: RequestPlus, res: Response) => {
  try {
    const workouts = await db.workoutType.findMany({});
    res.json(workouts);
  } catch (e) {
    asyncErrorHandler(e, res);
  }
});

workoutRouter.post("/", async (req: RequestPlus, res: Response) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      res.json({
        message: "unable to create workout because unable to identify user",
      });
    }
    const workout = await db.workout.create({
      data: { ...req.body, userId },
      include: {
        workoutType: { select: { name: true } },
      },
    });
    res.json(workout);
  } catch (e) {
    asyncErrorHandler(e, res);
  }
});

workoutRouter.put("/", async (req: RequestPlus, res: Response) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      res.json({
        message: "unable to update workout because unable to identify user",
      });
    }
    const workout = await db.workout.update({
      where: {
        id: req.body.id,
      },
      data: { ...req.body, userId },
      include: {
        workoutType: { select: { name: true } },
      },
    });
    res.json(workout);
  } catch (e) {
    asyncErrorHandler(e, res);
  }
});

workoutRouter.delete("/", async (req: RequestPlus, res: Response) => {
  try {
    const workout = await db.workout.delete({
      where: { id: req.body.id },
      include: {
        workoutType: { select: { name: true } },
      },
    });
    res.json(workout);
  } catch (e) {
    asyncErrorHandler(e, res);
  }
});

workoutRouter.delete("/seed", async (req: RequestPlus, res: Response) => {
  try {
    const workout = await db.workout.deleteMany({
      where: { userId: req.body.id, seed: true },
    });
    res.json(workout);
  } catch (e) {
    asyncErrorHandler(e, res);
  }
});

export default workoutRouter;
