import { WhiteModels } from "@failean/shared-types";
import { userModel } from "@failean/mongo-models";
import { safeDB } from "../../index";

export default safeDB.model<WhiteModels.Auth.WhiteUser>("user", userModel);
