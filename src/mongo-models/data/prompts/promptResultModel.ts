import { WhiteModels } from "@failean/shared-types";
import { promptResultModel } from "@failean/mongo-models";
import { safeDB } from "../../../index";

export default safeDB.model<WhiteModels.Data.Prompts.WhitePromptResult>(
  "promptResult",
  promptResultModel
);
