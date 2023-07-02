import { WhiteModels } from "@failean/shared-types";
import { taskModel } from "@failean/mongo-models";
import { safeDB } from "../../../index";

export default safeDB.model<WhiteModels.Data.Prompts.WhiteTask>(
  "task",
  taskModel
);
