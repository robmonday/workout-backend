import app, { Request, Response } from "express";
const badgeRouter = app.Router();

import { RequestPlus } from "../modules/types";
import db from "../modules/db";

badgeRouter.get("/", async (req: RequestPlus, res: Response) => {
  console.log(req.query);
  const userId = req.user.id;

  if (req.query.gallery === "true") {
    const badges = await db.badge.findMany({});
    res.json(badges);
  } else if (!userId) {
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
