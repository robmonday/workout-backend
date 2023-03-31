import { Prisma } from "@prisma/client";
import app, { Request, Response } from "express";
import db, { knownDbError } from "../db";
const workoutRouter = app.Router();

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

workoutRouter.get("/", async (req: Request, res: Response) => {
  try {
    if (req.query.hasOwnProperty("groupBy")) {
      const groupedworkouts = await db.workout.groupBy({
        by: [req.query.groupBy as any],
        _count: true,
        orderBy: { _count: { location: "desc" } },
      });
      res.json(groupedworkouts);
    } else {
      const workouts = await db.workout.findMany({
        include: {
          workoutType: { select: { name: true } },
        },
      });

      res.json(workouts);
    }
  } catch (e) {
    asyncErrorHandler(e, res);
  }
});

workoutRouter.get("/timeseries", async (req: Request, res, Response) => {
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

workoutRouter.get("/type", async (req: Request, res: Response) => {
  try {
    const workouts = await db.workoutType.findMany({
      select: { id: true, name: true },
    });
    res.json(workouts);
  } catch (e) {
    asyncErrorHandler(e, res);
  }
});

workoutRouter.post("/", async (req: Request, res: Response) => {
  try {
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
  } catch (e) {
    asyncErrorHandler(e, res);
  }
});

workoutRouter.put("/", async (req: Request, res: Response) => {
  try {
    const user = await db.user.findFirst({});
    if (!user) {
      res.json({
        message: "unable to update workout because unable to identify user",
      });
    }
    const workout = await db.workout.update({
      where: {
        id: req.body.id,
      },
      data: { ...req.body, userId: user?.id },
      include: {
        workoutType: { select: { name: true } },
      },
    });
    res.json(workout);
  } catch (e) {
    asyncErrorHandler(e, res);
  }
});

workoutRouter.delete("/", async (req: Request, res: Response) => {
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

export default workoutRouter;
