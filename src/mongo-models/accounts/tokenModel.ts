import { WhiteModels } from "@failean/shared-types";
import { tokenModel } from "@failean/mongo-models";
import { safeDB } from "../../index";
export default safeDB.model<WhiteModels.Accounts.WhiteToken>(
  "token",
  tokenModel
);
