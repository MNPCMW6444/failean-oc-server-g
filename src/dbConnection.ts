import mongoose, { ConnectOptions } from "mongoose";
import { discoverService } from "./AWSDiscovery";

export let ocDB: mongoose.Connection | null = null;
export let safeDB: mongoose.Connection | null = null;

export const connectToDBs = async () => {
  const mongoIp = await discoverService("us-east-1", {
    NamespaceName: "dev",
    ServiceName: "mongo-s",
    MaxResults: 10,
  });

  try {
    ocDB = await mongoose.createConnection(
      `mongodb://${mongoIp}:27017/failean-oc-tst?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions
    );

    safeDB = await mongoose.createConnection(
      `mongodb://${mongoIp}:27017/failean-tst?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions
    );

    console.log("connected to main-mongo and oc-mongo");
  } catch (e) {
    console.error(e);
    setTimeout(connectToDBs, 180000);
  }
};
