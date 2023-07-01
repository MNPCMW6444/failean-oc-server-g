import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 6777;
app.use(cookieParser());

let ocDBStatus = false;
let safeDBStatus = false;

export let ocDB: mongoose.Connection, safeDB: mongoose.Connection;

const connectToDBs = async () => {
  try {
    ocDB = await mongoose.createConnection("" + process.env.OC, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    safeDB = await mongoose.createConnection("" + process.env.SAFE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    ocDBStatus = true;
    safeDBStatus = true;
  } catch (e) {
    console.error(e);
    ocDBStatus = false;
    safeDBStatus = false;
  }

  if (!ocDBStatus || !safeDBStatus) setTimeout(connectToDBs, 180000);
  else console.log("connected to main-mongo and oc-mongo");
};

connectToDBs();

app.use(express.json());

export const clientDomain =
  process.env.NODE_ENV === "development"
    ? ["http://localhost:5998", "http://localhost:5999"]
    : ["https://oc.failean.com", "https://dev.failean.com"];

app.use(
  cors({
    origin: clientDomain,
    credentials: true,
  })
);

app.listen(port, () => console.log(`Server started on port: ${port}`));

app.get("/areyoualive", (_, res) => {
  res.json({ answer: "yes", version: process.env.npm_package_version });
});
