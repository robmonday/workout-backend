import app, { Request, Response, NextFunction } from "express";
const userRouter = app.Router();

import db, { knownDbError } from "../db";
import { comparePassword, createJWT, hashPassword } from "../modules/auth";
import { emailConfirm } from "../emails";

userRouter.get("/", async (req, res) => {
  // const users = await db.user.findMany({});
  // res.status(200).json(users);
  res.status(401).json({ message: "nope" });
});

userRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    const hashedPassword = await hashPassword(req.body.password);
    const user = await db.user.create({
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
      },
    });
    const emailConfirmToken = createJWT(user);
    emailConfirm(user.email, user, emailConfirmToken);
    res.json(user);
  } catch (e) {
    if (e instanceof knownDbError && e.code === "P2025") {
      res.status(409).json({
        message: "Record to delete does not exist.",
      });
    } else if (e instanceof Error) {
      res.status(400).json(e);
    }
  }
});

userRouter.post("/login", async (req: Request, res: Response) => {
  const user = await db.user.findUnique({ where: { email: req.body.email } });
  // console.log("user", user);

  if (!user) {
    res.status(401).json({
      serverError: true,
      message: "Invalid email and password combination",
    });
    return;
  }

  const isValid = await comparePassword(req.body.password, user.password);

  if (!isValid) {
    res.status(401).json({
      serverError: true,
      message: "Invalid email and password combination",
    });
    return;
  }

  const token = createJWT(user);
  // console.log("token", token);

  res.status(200).json({
    token,
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  });
});

export default userRouter;
