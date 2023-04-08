import app, { Request, Response } from "express";
const badgeRouter = app.Router();

import { RequestPlus } from "../types";
import db from "../db";

badgeRouter.get("/", async (req: RequestPlus, res: Response) => {
  const userId = req.user.id;
  if (!userId) {
    res.json({
      message: "unable to get badges because unable to identify user",
    });
  } else {
    const badges = await db.badge.findMany({ where: { userId } });
    res.json(badges);
  }
});

badgeRouter.post("/", async (req: RequestPlus, res: Response) => {
  const userId = req.user.id;
  const newBadge = await db.badge.create({
    data: { ...req.body, userId },
  });
  res.json(newBadge);
});

export default badgeRouter;
