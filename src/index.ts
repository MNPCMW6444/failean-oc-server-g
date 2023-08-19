import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import basicAuth from "express-basic-auth";
import logRouter from "./routers/log/logRouter";
import readRouter from "./routers/read/readRouter";
import { connectToDBs } from "./dbConnection";

dotenv.config();

const app = express();
const port = 6777;
app.use(cookieParser());

connectToDBs();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

export const ocClientDomain =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5998"
    : `https://${
        process.env.WHITE_ENV === "dev" ? "tst" : process.env.WHITE_ENV
      }oc.failean.com`;

export const clientDomain =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5999"
    : `https://${
        process.env.WHITE_ENV
          ? process.env.WHITE_ENV + "."
          : process.env.WHITE_ENV
      }.failean.com`;

export const mainServerDomain =
  process.env.NODE_ENV === "development"
    ? "http://localhost:6555"
    : `https://${process.env.WHITE_ENV}mainserver.failean.com`;

app.use(
  cors({
    origin: [ocClientDomain, clientDomain, mainServerDomain],
    credentials: true,
  })
);


app.use((req, res, next) => {
    if (req.path === '/areyoualive') {
        return next();
    }

    const credentials = basicAuth(req as any) as any;
    if (credentials && credentials.name === "client" && credentials.pass === process.env.OCPASS + "xx") {
        return next();
    }

    res.setHeader('WWW-Authenticate', 'Basic realm="example"');
    res.status(401).send('Authentication required');
});




app.listen(port as any, "0.0.0.0", () =>
  console.log(`Server started on port: ${port}`)
);

app.get("/areyoualive", (_, res) => {
  res.json({ answer: "yes", version: process.env.npm_package_version });
});

app.use("/log", logRouter);
app.use("/read", readRouter);
