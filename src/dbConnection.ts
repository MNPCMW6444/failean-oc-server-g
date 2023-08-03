import mongoose, { ConnectOptions } from "mongoose";

export let ocDB: mongoose.Connection | null = null;
export let safeDB: mongoose.Connection | null = null;

export const connectToDBs = async () => {
  try {
    ocDB = await mongoose.createConnection(
      `mongodb://localhost:27017/failean-tst?ssl=true`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        tls: true,
      } as ConnectOptions
    );

    safeDB = await mongoose.createConnection(
      `mongodb+srv://michael:qQbl9i98Ar2IM934@cluster0.ynbmgmg.mongodb.net/failean-oc-tst?retryWrites=true&w=majority`,
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
