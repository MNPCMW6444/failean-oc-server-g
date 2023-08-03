import mongoose, { ConnectOptions } from "mongoose";

export let ocDB: mongoose.Connection | null = null;
export let safeDB: mongoose.Connection | null = null;

export const connectToDBs = async () => {
  try {
    ocDB = await mongoose.createConnection(
      `mongodb://127.0.0.1:27017/failean-oc-tst?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        tls: true,
      } as ConnectOptions
    );

    safeDB = await mongoose.createConnection(
      `mongodb://127.0.0.1:27017/failean-tst?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        tls: true,
      } as ConnectOptions
    );

    console.log("connected to main-mongo and oc-mongo");
  } catch (e) {
    console.error(e);
    setTimeout(connectToDBs, 180000);
  }
};
