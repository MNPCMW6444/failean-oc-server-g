import express from "express";
import { getSignInReqModel } from "../../oc-models/auth/signinReqModel";

const router = express.Router();

router.post("/logSignin", async (req, res) => {
  const SignInReqModel = getSignInReqModel();
  await new SignInReqModel({ ...req.body }).save();
  return res.status(200).send();
});

router.post("/logInvalidPrompt", async (req, res) => {
  const SignInReqModel = getSignInReqModel();
  await new SignInReqModel({ ...req.body }).save();
  return res.status(200).send();
});

export default router;
