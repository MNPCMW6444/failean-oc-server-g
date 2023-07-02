import mongoose, { ConnectOptions } from "mongoose";

export let ocDB: mongoose.Connection | null = null;
export let safeDB: mongoose.Connection | null = null;

export const connectToDBs = async () => {
  try {
    ocDB = await mongoose.createConnection("" + process.env.OC, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    safeDB = await mongoose.createConnection("" + process.env.SAFE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    console.log("connected to main-mongo and oc-mongo");
  } catch (e) {
    console.error(e);
    setTimeout(connectToDBs, 180000);
  }
};
