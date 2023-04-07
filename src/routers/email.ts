import app, { Request, Response } from "express";
const emailRouter = app.Router();

import { RequestPlus } from "../types";
import { emailConfirm } from "../emails";

emailRouter.post("/emailConfirm", async (req: RequestPlus, res: Response) => {
  try {
    const successMessage = await emailConfirm(req.body.email, req.body);
    res.send(successMessage);
  } catch (e) {
    res.status(400).json(e);
  }
});

export default emailRouter;
