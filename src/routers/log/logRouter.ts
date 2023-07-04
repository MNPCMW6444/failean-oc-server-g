import express from "express";
import { getSignInReqModel } from "../../oc-models/auth/signinReqModel";
import { getInvalidPromptModel } from "../../oc-models/data/prompts/invalidPromptModel";
import { getRestRequestModel } from "../../oc-models/restRequestModel";
import { getPromptPriceModel } from "../../oc-models/data/prompts/promptPriceModel";

const router = express.Router();

router.post("/logReq", async (req, res) => {
  try {
    const restRequestModel = getRestRequestModel();
    await new restRequestModel({ ...req.body }).save();
    return res.status(200).send();
  } catch (e) {
    console.log("failed to log logReq");
    return res.status(200).send();
  }
});

router.post("/logSignin", async (req, res) => {
  try {
    const signInReqModel = getSignInReqModel();
    await new signInReqModel({ ...req.body }).save();
    return res.status(200).send();
  } catch (e) {
    console.log("failed to log logSignin");
    return res.status(200).send();
  }
});

router.post("/logInvalidPrompt", async (req, res) => {
  try {
    const invalidPromptModel = getInvalidPromptModel();
    await new invalidPromptModel({ ...req.body }).save();
  } catch (e) {
    console.log("failed to log logInvalidPrompt");
    return res.status(200).send();
  }
});

router.post("/logPromptPrice", async (req, res) => {
  try {
    const promptPriceModel = getPromptPriceModel();
    await new promptPriceModel({ ...req.body }).save();
  } catch (e) {
    console.log("failed to log logPromptPrice");
    return res.status(200).send();
  }
});

export default router;
