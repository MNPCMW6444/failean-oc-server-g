import mongoose from "mongoose";
import { OCModels } from "@failean/shared-types";
import { ocDB } from "../../dbConnection";

const pageRenderModel = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export function getPageRenderModel() {
  if (!ocDB) {
    throw new Error("Database not initialized");
  }
  return ocDB.model<OCModels.ClientAnalytics.PageRedner>(
    "pageRender",
    pageRenderModel
  );
}
