import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import basicAuth from "express-basic-auth";
import logRouter from "./routers/log/logRouter";
import readRouter from "./routers/read/readRouter";
import { connectToDBs } from "./dbConnection";
import { getExpressRequestModel } from "./oc-models/expressRequestModel";

dotenv.config();

const app = express();
const port = process.env.PORT || 6777;
app.use(cookieParser());

connectToDBs() /* .then(() => {
  try {
    let startDate = new Date("2023-07-08T15:00:00.000Z");
    let endDate = new Date("2023-07-08T16:00:00.000Z");

    getExpressRequestModel()
      .find({
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      })
      .then((x) => {
        x.map(({ stringifiedReq }) => {
          let requestObj = JSON.parse(stringifiedReq);

          let xForwardedFor = requestObj.headers["x-forwarded-for"];

          let ipAddresses = xForwardedFor.split(", ");

          let clientIP = ipAddresses[0];

          console.log(clientIP);

          //console.log(JSON.parse(stringifiedReq));
        });
        console.log("finished");
      });
  } catch (e) {
    console.log(e);
  }
}) */;

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

app.use(
  basicAuth({
    users: { client: process.env.OCPASS + "xx" },
    challenge: true,
  })
);

app.listen(port, () => console.log(`Server started on port: ${port}`));

app.get("/areyoualive", (_, res) => {
  res.json({ answer: "yes", version: process.env.npm_package_version });
});

app.use("/log", logRouter);
app.use("/read", readRouter);
