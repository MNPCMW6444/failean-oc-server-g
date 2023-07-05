import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";
import cookieParser from "cookie-parser";
import logRouter from "./routers/log/logRouter";
import readRouter from "./routers/read/readRouter";
import { connectToDBs } from "./dbConnection";

dotenv.config();

const app = express();
const port = process.env.PORT || 6777;
app.use(cookieParser());

connectToDBs();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

export const ocClientDomain =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5998"
    : "https://oc.failean.com";

export const clientDomain =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5999"
    : "https://dev.failean.com";

export const ocServerDomain =
  process.env.NODE_ENV === "development"
    ? "http://localhost:6777"
    : "https://tstocserver.failean.com";

app.use(
  cors({
    origin: [clientDomain, ocClientDomain, ocServerDomain],
    credentials: true,
  })
);

app.listen(port, () => console.log(`Server started on port: ${port}`));

app.get("/areyoualive", (_, res) => {
  res.json({ answer: "yes", version: process.env.npm_package_version });
});

app.use("/log", logRouter);
app.use("/read", readRouter);
