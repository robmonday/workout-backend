import app, { Request, Response } from "express";
const notificationRouter = app.Router();

import db, { knownDbError } from "../modules/db";

import { RequestPlus, tokenExtractor, protect } from "../modules/middleware";

notificationRouter.get("/open", async (req: RequestPlus, res: Response) => {
  const userId = req.user.id;

  const openNotifications = await db.notification.findMany({
    where: { open: true, userId },
  });
  res.json(openNotifications);
});

notificationRouter.put("/open", async (req: RequestPlus, res: Response) => {
  const { id } = req.body;
  const updatedNotification = await db.notification.update({
    where: { id },
    data: { open: false },
  });
  res.json(updatedNotification);
});

notificationRouter.post("/", async (req: RequestPlus, res: Response) => {
  const userId = req.user.id;
  try {
    const newNotification = await db.notification.create({
      data: { ...req.body, userId },
    });
    res.json(newNotification);
  } catch (e) {
    res.status(400).json(e);
  }
});

export default notificationRouter;
