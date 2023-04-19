import app, { Request, Response } from "express";
const reactionRouter = app.Router();

import { RequestPlus } from "../modules/types";

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

reactionRouter.get("/", async (req: RequestPlus, res: Response) => {
  try {
    const reactions = await db.reaction.findMany({});
    res.json(reactions);
  } catch (e) {
    asyncErrorHandler(e, res);
  }
});

reactionRouter.post("/", async (req: RequestPlus, res: Response) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      res.json({
        message: "unable to create reaction because unable to identify user",
      });
    }
    const reactionToRemove = await db.reaction.deleteMany({
      where: {
        userId,
        workoutId: req.body.workoutId,
      },
    });
    // console.log("Removed", reactionToRemove);
    const reactionToAdd = await db.reaction.create({
      data: { ...req.body, userId, workoutId: req.body.workoutId },
    });
    // console.log("Added", reactionToAdd);
    res.json(reactionToAdd);
  } catch (e) {
    asyncErrorHandler(e, res);
  }
});

export default reactionRouter;
