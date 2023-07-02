import { WhiteModels } from "@failean/shared-types";
import { requestForAccountModel } from "@failean/mongo-models";
import { safeDB } from "../../index";

export default safeDB.model<WhiteModels.Auth.WhiteRequestForAccount>(
  "requestForAccount",
  requestForAccountModel
);
