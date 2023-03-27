import app, { Request, Response } from "express";
import db from "../db";
const badgeRouter = app.Router();

badgeRouter.get("/", async (req: Request, res: Response) => {
  const user = await db.user.findFirst({});
  if (!user) {
    res.json({
      message: "unable to get badges because unable to identify user",
    });
  } else {
    const badges = await db.badge.findMany({ where: { userId: user.id } });
    res.json(badges);
  }
});

export default badgeRouter;
