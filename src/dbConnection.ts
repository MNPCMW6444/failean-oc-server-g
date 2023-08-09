import mongoose, { ConnectOptions } from "mongoose";
import { discoverService } from "./AWSDiscovery";

export let ocDB: mongoose.Connection | null = null;
export let safeDB: mongoose.Connection | null = null;

export const connectToDBs = async () => {
  const mongoIp = await discoverService("us-east-1", {
    NamespaceName: "tst",
    ServiceName: "mongo",
    MaxResults: 10,
  });

  try {
    console.log("Trying to connect safemain and oc mongodbs...");
    ocDB = await mongoose.createConnection(
      `mongodb://${mongoIp}:27017/failean-oc-tst?retryWrites=true&w=majority`,
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
      `mongodb://${mongoIp}:27017/failean-tst?retryWrites=true&w=majority`,
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
