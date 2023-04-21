import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import { tokenExtractor, protect } from "./modules/middleware";

import userRouter from "./routers/user";
import workoutRouter from "./routers/workout";
import badgeRouter from "./routers/badge";
import notificationRouter from "./routers/notification";
import emailRouter from "./routers/email";
import reactionRouter from "./routers/reaction";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // puts query strings into an object

app.use(express.static("assets"));

// app.get("/", (req, res, next) => {
//   setTimeout(() => {
//     next(new Error("here is an async error"));
//   }, 2000);
// });

app.use(tokenExtractor);

app.get("/hello", (req: Request, res: Response) => {
  res.status(200);
  res.json({ message: "hello" });
});

app.use("/api/user", userRouter); // protect is applied at router level

app.use("/api/workout", protect, workoutRouter);
app.use("/api/reaction", protect, reactionRouter);
app.use("/api/badge", protect, badgeRouter);
app.use("/api/notification", protect, notificationRouter);
app.use("/api/email", protect, emailRouter);

// this is only for sync errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.type === "auth") {
    res.status(401).json({ message: "unauthorized" });
  } else if (err.type === "input") {
    res.status(400).json({ message: "invalid input" });
  } else {
    res.status(500).json({ message: err.message });
  }
});

export default app;
