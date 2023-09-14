import mongoose, { ConnectOptions } from "mongoose";
import * as process from "process";

export let ocDB: mongoose.Connection | null = null;
export let safeDB: mongoose.Connection | null = null;

export const connectToDBs = async () => {


  try {
    console.log("Trying to connect safemain and oc mongodbs...");
    ocDB = await mongoose.createConnection(
      process.env.MONGOOC+"",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions
    );

    ocDB.on("error", console.error.bind(console, "connection error:"));
    ocDB.once("open", function () {
      // we're connected!
      console.log("oc DB connected successfully");
    });
    safeDB = await mongoose.createConnection(
        process.env.MONGO+"",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions
    );

    safeDB.on("error", console.error.bind(console, "connection error:"));
    safeDB.once("open", function () {
      // we're connected!
      console.log("safe main DB connected successfully");
    });
  } catch (e) {
    console.error(e);
    setTimeout(connectToDBs, 180000);
  }
};
