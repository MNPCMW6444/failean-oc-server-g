import mongoose from "mongoose";
import { OCModels } from "@failean/shared-types";
import { ocDB } from "../../../dbConnection";

const openAICallModel = new mongoose.Schema(
  {
    reqUUID: {
      type: String,
      required: true,
    },
    stringifiedParams: {
      type: String,
      required: true,
    },
    stringifiedCompletion: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export function getOpenAICallModel() {
  if (!ocDB) {
    throw new Error("Database not initialized");
  }
  return ocDB.model<OCModels.Data.Prompts.OpenAICall>(
    "openAICall",
    openAICallModel
  );
}
