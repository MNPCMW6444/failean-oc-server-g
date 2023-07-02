import mongoose from "mongoose";
import { ocDB } from "../index";
import { OCModels } from "@failean/shared-types";

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

export default ocDB.model<OCModels.RestRequest>(
  "restRequest",
  restRequestModel
);
