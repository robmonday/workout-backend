import app, { Request, Response } from "express";
const notificationRouter = app.Router();

import db, { knownDbError } from "../db";
import { emailConfirm } from "../emails";

notificationRouter.get("/open", async (req: Request, res: Response) => {
  const openNotifications = await db.notification.findMany({
    where: { open: true },
  });
  res.json(openNotifications);
});

export default notificationRouter;
