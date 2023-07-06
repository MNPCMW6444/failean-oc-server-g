import mongoose from "mongoose";
import { OCModels } from "@failean/shared-types";
import { ocDB } from "../../../dbConnection";

const promptPriceModel = new mongoose.Schema(
  {
    openAICallReqUUID: {
      type: String,
      require: true,
    },
    promptName: {
      type: String,
      require: true,
    },
    forAVGPriceInOpenAITokens: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

export function getPromptPriceModel() {
  if (!ocDB) {
    throw new Error("Database not initialized");
  }
  return ocDB.model<OCModels.Data.Prompts.PromptPrice>(
    "promptPrice",
    promptPriceModel
  );
}
