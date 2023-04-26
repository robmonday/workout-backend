import app, { Request, Response } from "express";
const emailRouter = app.Router();
import db from "../modules/db";

import { RequestPlus, UserInfo } from "../modules/types";
import { emailConfirm } from "../modules/emails";
import { createEmailConfirmToken } from "../modules/auth";
import jwt from "jsonwebtoken";

// send confirmation email to the user
emailRouter.post("/emailconfirm", async (req: RequestPlus, res: Response) => {
  try {
    const emailConfirmToken = await createEmailConfirmToken(req.body);
    const emailSentSuccessMessage = await emailConfirm(
      req.body.email,
      req.body,
      emailConfirmToken
    );
    res.json(emailSentSuccessMessage ? { sucess: true } : { sucess: false });
  } catch (e) {
    res.status(400).json(e);
  }
});

// authenticate emailConfirmToken (after user has received email and clicked link)
emailRouter.get("/emailconfirm", async (req: RequestPlus, res: Response) => {
  try {
    const { emailConfirmToken } = req.query;
    if (
      !process.env.JWT_SECRET ||
      !emailConfirmToken ||
      typeof emailConfirmToken !== "string"
    ) {
      throw new Error("Unable to create token.");
    }
    try {
      const user = jwt.verify(
        emailConfirmToken,
        process.env.JWT_SECRET
      ) as UserInfo;
      const updatedUser = await db.user.update({
        where: { id: user.id },
        data: { emailConfirmed: true },
      });
      console.log("updatedUser", updatedUser);

      const updatedNotificationSummary = await db.notification.updateMany({
        where: { userId: user.id, open: true, buttonUrl: "/emailconfirm" },
        data: { open: false },
      });

      res.status(200).json({
        authenticated: true,
        user: updatedUser,
      });
    } catch {
      // console.log(
      //   "Unable to confirm email because token does not authenticate."
      // );
      res.status(200).json({ authenticated: false });
    }
  } catch (e) {
    res.status(400).json(e);
  }
});

export default emailRouter;
