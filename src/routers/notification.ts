import app, { Request, Response } from "express";
const notificationRouter = app.Router();

import db, { knownDbError } from "../db";

import { RequestPlus, tokenExtractor, protect } from "../middleware";

notificationRouter.get("/open", async (req: Request, res: Response) => {
  const openNotifications = await db.notification.findMany({
    where: { open: true },
  });
  res.json(openNotifications);
});

notificationRouter.put("/open", async (req: Request, res: Response) => {
  const { id } = req.body;
  const updatedNotification = await db.notification.update({
    where: { id },
    data: { open: false },
  });
  res.json(updatedNotification);
});

notificationRouter.post(
  "/",
  tokenExtractor,
  protect,
  async (req: RequestPlus, res: Response) => {
    try {
      const newNotification = await db.notification.create({
        data: { ...req.body, userId: req.user.id },
      });
      res.json(newNotification);
    } catch (e) {
      res.status(400).json(e);
    }
  }
);

export default notificationRouter;
