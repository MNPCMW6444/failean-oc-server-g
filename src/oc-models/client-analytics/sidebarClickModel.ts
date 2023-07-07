import mongoose from "mongoose";
import { OCModels } from "@failean/shared-types";
import { ocDB } from "../../dbConnection";

const sidebarClickModel = new mongoose.Schema(
  {
    route: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export function getSidebarClickModel() {
  if (!ocDB) {
    throw new Error("Database not initialized");
  }
  return ocDB.model<OCModels.ClientAnalytics.SidebarClick>(
    "sidebarClick",
    sidebarClickModel
  );
}
