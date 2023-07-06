import mongoose from "mongoose";
import { OCModels } from "@failean/shared-types";
import { ocDB } from "../../dbConnection";

const signinReqModel = new mongoose.Schema(
  {
    reqUUID: {
      type: String,
      required: true,
    },
    successfull: {
      type: Boolean,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export function getSignInReqModel() {
  if (!ocDB) {
    throw new Error("Database not initialized");
  }
  return ocDB.model<OCModels.Auth.SigninReq>("signinReq", signinReqModel);
}
