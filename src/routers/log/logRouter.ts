import express from "express";
import { getSignInReqModel } from "../../oc-models/auth/signinReqModel";
import { getInvalidPromptModel } from "../../oc-models/data/prompts/invalidPromptModel";
import { getExpressRequestModel } from "../../oc-models/expressRequestModel";
import { getPromptPriceModel } from "../../oc-models/data/prompts/promptPriceModel";
import { getExpressResponseModel } from "../../oc-models/expressResponseModel";
import { getOpenAICallModel } from "../../oc-models/data/prompts/openAICallModel";
import { getSidebarClickModel } from "../../oc-models/client-analytics/sidebarClickModel";
import { getPageRenderModel } from "../../oc-models/client-analytics/pageRenderModel";

const router = express.Router();

router.post("/logExpressRequest", async (req, res) => {
  try {
    const expressRequestModel = getExpressRequestModel();
    await new expressRequestModel({ ...req.body }).save();
    return res.status(200).send();
  } catch (e) {
    console.log("failed to log logExpressRequest");
    return res.status(200).send();
  }
});

router.post("/logExpressResponse", async (req, res) => {
  try {
    const expressResponseModel = getExpressResponseModel();
    await new expressResponseModel({ ...req.body }).save();
    return res.status(200).send();
  } catch (e) {
    console.log("failed to log logExpressResponse");
    return res.status(200).send();
  }
});

router.post("/logOpenAICall", async (req, res) => {
  try {
    const openAiCallModel = getOpenAICallModel();
    await new openAiCallModel({ ...req.body }).save();
    return res.status(200).send();
  } catch (e) {
    console.log("failed to log logExpressResponse");
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
    return res.status(200).send();
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

router.post("/logSidebar", async (req, res) => {
  try {
    const sidebarClickModel = getSidebarClickModel();
    await new sidebarClickModel({ ...req.body }).save();
  } catch (e) {
    console.log("failed to log logSidebar");
    return res.status(200).send();
  }
});

router.post("/logPage", async (req, res) => {
  try {
    const pageRenderModel = getPageRenderModel();
    await new pageRenderModel({ ...req.body }).save();
  } catch (e) {
    console.log("failed to log logPage: ");
    return res.status(200).send();
  }
});

export default router;
