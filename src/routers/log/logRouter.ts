import express from "express";
import { getSignInReqModel } from "../../oc-models/auth/signinReqModel";

const router = express.Router();

router.post("/logSignin", async (req, res) => {
  const SignInReqModel = getSignInReqModel();
  console.log(req.body);
  await new SignInReqModel({ ...req.body }).save();
  return res.status(200).send();
});

export default router;
