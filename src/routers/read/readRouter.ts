import express from "express";
import { getSignInReqModel } from "../../oc-models/auth/signinReqModel";
import { getInvalidPromptModel } from "../../oc-models/data/prompts/invalidPromptModel";
import { getPromptPriceModel } from "../../oc-models/data/prompts/promptPriceModel";
import { getOpenAICallModel } from "../../oc-models/data/prompts/openAICallModel";
import { OCModels } from "@failean/shared-types";
import { CreateChatCompletionResponse } from "openai";
import { getUserModel } from "../../mongo-models/auth/userModel";
import { getTokenModel } from "../../mongo-models/accounts/tokenModel";
import { getIdeaModel } from "../../mongo-models/data/ideas/ideaModel";

const router = express.Router();

router.get("/usersWhoLoggedInLastDay", async (_, res) => {
  const signInReqModel = getSignInReqModel();
  const signins = await signInReqModel.find();
  const lastDay = signins.filter(
    ({ time }) => time.getTime() > new Date().getTime() - 24 * 60 * 60 * 1000
  );
  return res.status(200).json({ total: lastDay.length, details: lastDay });
});

router.get("/invalidPromptEvents", async (_, res) =>
  res.status(200).json({ events: await getInvalidPromptModel().find() })
);

router.post("/avgPriceForPrompt", async (req, res) => {
  const prices = await getPromptPriceModel().find({ avg: req.body.promptName });
  let avg = 0;
  prices.forEach(({ priceInOpenAITokensForAVG }) => {
    avg += priceInOpenAITokensForAVG;
  });
  return res.status(200).json({ avg });
});

router.get("/numberOfOpenAITokensWeUsed", async (_, res) => {
  const openAICallModel = getOpenAICallModel();
  const total = await openAICallModel.find();
  const completions: CreateChatCompletionResponse[] = total.map(
    (doc): OCModels.Data.Prompts.OpenAICall =>
      JSON.parse(doc.stringifiedCompletion)
  ) as any;
  let sum = 0;
  completions.forEach(
    (completion) => (sum += completion.usage?.total_tokens || 0)
  );
  return res.status(200).json({ sum });
});

router.get("/users", async (_, res) =>
  res.status(200).json({ users: await getUserModel().find() })
);

router.get("/tokens", async (_, res) =>
  res.status(200).json({ tokens: await getTokenModel().find() })
);

router.get("/ideas", async (_, res) =>
  res.status(200).json({ ideas: await getIdeaModel().find() })
);

router.get("/avgIdeasPerUser", async (_, res) =>
  res.status(200).json({
    avg:
      (await getIdeaModel().find()).length /
      (await getUserModel().find()).length,
  })
);

router.get("/userWithMostIdeas", async (_, res) => {
  const ideas = await getIdeaModel().find();
  const users = await getUserModel().find();
  let max = 0;
  let userID = "";
  users.forEach(({ _id }) => {
    const hisIdeas = ideas.filter(({ owner }) => owner === _id);
    if (hisIdeas.length > max) {
      max = hisIdeas.length;
      userID = _id;
    }
  });
  return res
    .status(200)
    .json({ max, user: users.find(({ _id }) => _id === userID) });
});

router.get("/usersWithZeroIdeas", async (_, res) => {
  const ideas = await getIdeaModel().find();
  return res.status(200).json({
    usersWithZero: (await getUserModel().find()).filter(
      ({ _id }) => ideas.filter(({ owner }) => owner === _id).length === 0
    ),
  });
});

router.get("/usersWithOneIdeas", async (_, res) => {
  const ideas = await getIdeaModel().find();
  return res.status(200).json({
    usersWithOne: (await getUserModel().find()).filter(
      ({ _id }) => ideas.filter(({ owner }) => owner === _id).length === 1
    ),
  });
});

/*כמות התוקנים שהשתמשו לנו
זמינות שרת אחוזי שמישות 
לחיצות על הסייד בר
התראות על יוזרים שלא השתמשו 72 שעות 
טעות בהזנת סיסמא יותר מ3 פעמים בשעה
כמות שאנשים שהריצו את
כמות השינויים 
לתעד כל run all
כמות הטוקנים הממוצעים להצגה של רעיון שלם 
ֿכמות השינויים לפרומטים פר יוזר 



סקר - הייתי רוצה להשתמש בgpt 4, הייתי רוצה שהמידע שלי ישלח למשקיעים, הייתי מזין את הpai key



לפתח פרומט סיכום לרעיון עם רול ביקרותי 
טמפרטורה לפרומט */

export default router;
