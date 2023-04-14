import app, { Request, Response } from "express";
const userRouter = app.Router();

import db, { knownDbError } from "../modules/db";
import { tokenExtractor, protect, RequestPlus } from "../modules/middleware";

import { comparePassword, createJWT, hashPassword } from "../modules/auth";
import { seedWorkouts } from "../modules/seedWorkouts";

userRouter.get("/", protect, async (req, res) => {
  const limit = Number(req.query.limit);
  let users;
  if (isNaN(limit)) {
    users = await db.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        city: true,
        state: true,
      },
    });
  } else {
    users = await db.user.findMany({
      take: limit,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        city: true,
        state: true,
      },
    });
  }
  res.status(200).json(users);
});

userRouter.get("/:id", protect, async (req: RequestPlus, res: Response) => {
  const id = req.params.id;
  const user = await db.user.findUniqueOrThrow({ where: { id } });
  res.json(user);
});

// Do not protect this route.  Users who are signing up are not authenticated.
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
    // console.log("user created", user);
    const emailConfirmNotify = await db.notification.create({
      data: {
        message: "Please take a moment to confirm your email address.",
        buttonUrl: "/emailconfirm",
        userId: user.id,
        dismissable: false,
      },
    });
    const welcomeNotify = await db.notification.create({
      data: {
        message: "Welcome to the Workout App!  We are glad you are here.",
        userId: user.id,
      },
    });
    const newKidInTownBadge = await db.badge.create({
      data: {
        type: "New Kid on the Block",
        notes: "Generated when user created an account",
        userId: user.id,
      },
    });
    const badgeNotify = await db.notification.create({
      data: {
        message: "Your got your first badge!",
        buttonUrl: "/badges",
        userId: user.id,
      },
    });
    seedWorkouts(user.id);
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

// Do not protect this route.  Users who are logging in are not authenticated.
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
    userObj: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      emailConfirmed: user.emailConfirmed,
    },
    token,
  });
});

userRouter.put("/", protect, async (req: RequestPlus, res: Response) => {
  // console.log("req.body", JSON.stringify(req.body));

  const updatedUserObj = await db.user.update({
    data: { ...req.body, confirmEmail: undefined },
    where: { id: req.user.id },
  });
  // console.log("updatedUserObj", updatedUserObj);

  const response = { ...updatedUserObj, password: undefined };
  res.json(response);
});

export default userRouter;
