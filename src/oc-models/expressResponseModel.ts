import mongoose from "mongoose";
import { OCModels } from "@failean/shared-types";
import { ocDB } from "../dbConnection";

const expressResponseModel = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true,
    },
    stringifiedRes: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export function getExpressResponseModel() {
  if (!ocDB) {
    throw new Error("Database not initialized");
  }
  return ocDB.model<OCModels.ExpressResponse>(
    "ExpressResponse",
    expressResponseModel
  );
}
