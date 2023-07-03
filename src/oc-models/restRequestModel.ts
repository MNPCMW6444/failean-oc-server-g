import mongoose from "mongoose";
import { OCModels } from "@failean/shared-types";
import { ocDB } from "../dbConnection";

const restRequestModel = new mongoose.Schema(
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

export function getRestRequestModel() {
  if (!ocDB) {
    throw new Error("Database not initialized");
  }
  return ocDB.model<OCModels.RestRequest>("restRequest", restRequestModel);
}
