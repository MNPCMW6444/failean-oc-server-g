import express from "express";
import { getSignInReqModel } from "../../oc-models/auth/signinReqModel";
import { getInvalidPromptModel } from "../../oc-models/data/prompts/invalidPromptModel";
import { getRestRequestModel } from "../../oc-models/restRequestModel";

const router = express.Router();

router.post("/logReq", async (req, res) => {
  const restRequestModel = getRestRequestModel();
  await new restRequestModel({ ...req.body }).save();
  return res.status(200).send();
});

router.post("/logSignin", async (req, res) => {
  const signInReqModel = getSignInReqModel();
  await new signInReqModel({ ...req.body }).save();
  return res.status(200).send();
});

router.post("/logInvalidPrompt", async (req, res) => {
  const invalidPromptModel = getInvalidPromptModel();
  await new invalidPromptModel({ ...req.body }).save();
  return res.status(200).send();
});

export default router;
