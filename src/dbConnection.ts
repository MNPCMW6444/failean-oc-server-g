import mongoose, { ConnectOptions } from "mongoose";

export let ocDB: mongoose.Connection | null = null;
export let safeDB: mongoose.Connection | null = null;

export const connectToDBs = async () => {
  try {
    ocDB = await mongoose.createConnection(
      `mongodb://${process.env.OC_USER}:${process.env.OC_PASS}@${process.env.OC_HOST}:${process.env.OC_PORT}/x?ssl=true`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        tls: true,
      } as ConnectOptions
    );

    safeDB = await mongoose.createConnection(
      `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/x?ssl=true`,
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
