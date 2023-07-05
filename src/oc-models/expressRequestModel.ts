import mongoose from "mongoose";
import { OCModels } from "@failean/shared-types";
import { ocDB } from "../dbConnection";

const expressRequestModel = new mongoose.Schema(
  {
    stringified: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export function getExpressRequestModel() {
  if (!ocDB) {
    throw new Error("Database not initialized");
  }
  return ocDB.model<OCModels.ExpressRequest>(
    "ExpressRequest",
    expressRequestModel
  );
}
