import express from "express";
import { getSignInReqModel } from "../../oc-models/auth/signinReqModel";
import { getInvalidPromptModel } from "../../oc-models/data/prompts/invalidPromptModel";
import { getPromptPriceModel } from "../../oc-models/data/prompts/promptPriceModel";

const router = express.Router();

router.get("/usersWhoLoggedInLastDay", async (_, res) => {
  const signInReqModel = getSignInReqModel();
  const signins = await signInReqModel.find();
  const lastDay = signins.filter(
    ({ time }) => time.getTime() > new Date().getTime() - 24 * 60 * 60 * 1000
  );
  return res.status(200).json({ total: lastDay.length, details: lastDay });
});

router.get("/invalidPromptEvents", async (_, res) => {
  const invalidPromptModel = getInvalidPromptModel();
  return res.status(200).json({ events: await invalidPromptModel.find() });
});

router.post("/getAVGPriceForPrompt", async (req, res) => {
  const { promptName } = req.body;
  const promptPriceModel = getPromptPriceModel();
  const prices = await promptPriceModel.find({ promptName });
  let avg = 0;
  prices.forEach(({ forAVGPriceInOpenAITokens }) => {
    avg += forAVGPriceInOpenAITokens;
  });
  return res.status(200).json({ avg });
});
/*
כמות הטוקנים ששילמנו לopen ai
כמות התוקנים שהשתמשו לנו
כל המידע על יוזרים 
כל המידע על תוקנים 
זמינות שרת אחוזי שמישות 
לחיצות על הסייד בר
התראות על יוזרים שלא השתמשו 72 שעות 
טעות בהזנת סיסמא יותר מ3 פעמים בשעה
כמות הרעיונות 
כמות הרעיונות הממוצע ליוזר
כמות רעיונות מקסימלית ליוזר 
כמות שאנשים שהריצו את
כמות השינויים 
לתעד כל run all
כמות הטוקנים הממוצעים להצגה של רעיון שלם 
ֿכמות השינויים לפרומטים פר יוזר 



סקר - הייתי רוצה להשתמש בgpt 4, הייתי רוצה שהמידע שלי ישלח למשקיעים, הייתי מזין את הpai key



לפתח פרומט סיכום לרעיון עם רול ביקרותי 
טמפרטורה לפרומט */

export default router;
