import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import { tokenExtractor } from "./middleware";
import { protect } from "./modules/auth";

import router from "./routers/router";
import userRouter from "./routers/user";
import workoutRouter from "./routers/workout";
import badgeRouter from "./routers/badge";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // puts query strings into an object

// app.get("/", (req, res, next) => {
//   setTimeout(() => {
//     next(new Error("here is an async error"));
//   }, 2000);
// });

app.get("/hello", (req: Request, res: Response) => {
  res.status(200);
  res.json({ message: "hello" });
});

app.use("/api/user", userRouter);

app.use("/api/workout", workoutRouter); // need to add tokenExtractor and protect to validate tokens
app.use("/api/badge", badgeRouter); // need to add tokenExtractor and protect to validate tokens

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
