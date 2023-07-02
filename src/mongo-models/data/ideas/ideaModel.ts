import { WhiteModels } from "@failean/shared-types";
import { ideaModel } from "@failean/mongo-models";
import { safeDB } from "../../../index";

export default safeDB.model<WhiteModels.Data.Ideas.WhiteIdea>(
  "idea",
  ideaModel
);
