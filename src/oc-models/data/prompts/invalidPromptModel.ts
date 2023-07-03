import mongoose from "mongoose";
import { OCModels } from "@failean/shared-types";
import { ocDB } from "../../../dbConnection";

const invalidPromptModel = new mongoose.Schema(
  {
    stringifiedReq: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    promptName: {
      type: String,
      required: true,
    },
    ideaId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export function getInvalidPromptModel() {
  if (!ocDB) {
    throw new Error("Database not initialized");
  }
  return ocDB.model<OCModels.Data.InvalidPrompt>(
    "invalidPrompt",
    invalidPromptModel
  );
}
