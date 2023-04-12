import app, { Request, Response } from "express";
const badgeRouter = app.Router();

import { RequestPlus } from "../modules/types";
import db from "../modules/db";

badgeRouter.get("/", async (req: RequestPlus, res: Response) => {
  // console.log(req.query);
  const userId = req.user.id;

  if (req.query.gallery === "true") {
    const badges = await db.badge.findMany({});
    console.log(badges);
    res.json(badgeGallery);
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

const badgeGallery = [
  {
    id: "ca6d475e-13f7-4d89-8afc-ac179ddaaa90",
    type: "Fastest Mile Run in Town",
    notes: "",
    userId: "gallery",
  },
  {
    id: "09bfe1c9-3af9-479a-b459-15aa726f78dd",
    type: "Social Butterfly (most friends)",
    notes: "",
    userId: "gallery",
  },
  {
    id: "905373da-22c3-46e7-b376-6c69c754d51c",
    type: "Weight Loss Record!",
    notes: "",
    userId: "gallery",
  },
  {
    id: "0574d16f-7d4d-4528-a2df-717aea76acc7",
    type: "Early Bird",
    notes: "",
    userId: "gallery",
  },
  {
    id: "08e84b6d-b040-4367-8323-940be91ae5e0",
    type: "Cross Trainier",
    notes: "",
    userId: "gallery",
  },
  {
    id: "8a8d6b30-31dc-41ec-b73d-2c0447bc9181",
    type: "Most Improved",
    notes: "",
    userId: "gallery",
  },
  {
    id: "6a6cb41c-4e96-4e60-b5bd-6a86315e61f7",
    type: "One Week Streak!",
    notes: "",
    userId: "gallery",
  },
  {
    id: "bbba208f-27dd-4504-819f-09eedd036956",
    type: "Super Star!",
    notes: "",
    userId: "gallery",
  },
  {
    id: "24c81904-5cd8-44c3-bd1f-f139d70f8711",
    type: "New Kid on the Block",
    notes: "",
    userId: "gallery",
  },
];

export default badgeRouter;
