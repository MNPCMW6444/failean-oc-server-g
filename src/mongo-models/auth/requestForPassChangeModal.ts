import { WhiteModels } from "@failean/shared-types";
import { requestForPassChangeModel } from "@failean/mongo-models";
import { safeDB } from "../../index";

export default safeDB.model<WhiteModels.Auth.WhiteRequestForPassChange>(
  "requestForPassChange",
  requestForPassChangeModel
);
