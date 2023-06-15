import express from "express";
import userModel from "../../models/auth/userModel";
import bcrypt from "bcrypt";
import jsonwebtoken, { JwtPayload } from "jsonwebtoken";
import RequestForAccount from "../../models/auth/requestForAccountModal";
import {
  passreset,
  signupreq,
} from "../../../content/email-templates/authEmails";
import RequestForPassChange from "../../models/auth/requestForPassChangeModal";
import zxcvbn from "zxcvbn";
import { sendEmail } from "../../util/emailUtil";
import { v4 as keyv4 } from "uuid";
import ideaModel from "../../models/data/ideaModel";
import { clientDomain } from "../../../index";

const router = express.Router();
const MIN_PASSWORD_STRENGTH = 3;

router.post("/signupreq", async (req, res) => {
  try {
    const { email, idea } = req.body;
    if (!email)
      return res.status(400).json({
        clientError: "The email is missing",
      });
    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        clientError: "An account with this email already exists",
      });

    const key = keyv4();

    await new RequestForAccount({
      email,
      key,
      idea,
    }).save();

    const url = `${clientDomain}/register?key=${key}`;

    const { subject, body } = signupreq(url);

    sendEmail(email, subject, body)
      .then(() => console.log("sent registration email"))
      .catch((err) => console.error(err));

    res.json({ result: "email successfully sent to " + email });
  } catch (err) {
    console.error(err);
    res.json({ result: "email successfully sent to " });

    res.status(500).json({
      serverError:
        "Unexpected error occurred in the server" + JSON.stringify(err),
    });
  }
});

router.post("/signupfin", async (req, res) => {
  try {
    const { key, fullname, password, passwordagain } = req.body;
    if (!key || !fullname || !password || !passwordagain)
      return res.status(400).json({
        clientError: "At least one of the fields are missing",
      });

    const existingSignupRequest = await RequestForAccount.findOne({ key });
    if (!existingSignupRequest) {
      return res
        .status(400)
        .json({ clientError: "Invalid or expired signup link" });
    }

    const MIN_PASSWORD_STRENGTH = 3;

    const passwordStrength = zxcvbn(password);

    if (passwordStrength.score < MIN_PASSWORD_STRENGTH)
      return res.status(400).json({
        clientError:
          "Password isn't strong enough, the value is" + passwordStrength.score,
      });
    if (password !== passwordagain)
      return res.status(400).json({
        clientError: "Passwords doesn't match",
      });
    const existingUser = await userModel.findOne({
      email: existingSignupRequest.email,
    });
    if (existingUser)
      return res.status(400).json({
        clientError: "An account with this email already exists",
      });
    if (!existingSignupRequest)
      return res.status(400).json({
        clientError: "The key is wrong",
      });
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const savedUser = await new userModel({
      email: existingSignupRequest.email,
      name: fullname,
      passwordHash,
    }).save();

    try {
      await new ideaModel({
        owner: savedUser._id,
        idea: existingSignupRequest.idea,
      }).save();
    } catch (err) {}

    const token = jsonwebtoken.sign(
      {
        id: savedUser._id,
      },
      process.env.JWT_SECRET as string
    );
    res
      .cookie("jsonwebtoken", token, {
        httpOnly: true,
        sameSite:
          process.env.NODE_ENV === "development"
            ? "lax"
            : process.env.NODE_ENV === "production" && "none",
        secure:
          process.env.NODE_ENV === "development"
            ? false
            : process.env.NODE_ENV === "production" && true,
      })
      .send();
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ serverError: "Unexpected error occurred in the server" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      res.status(400).json({ clientError: "Wrong email or password" });

    const existingUser = await userModel.findOne({ email });
    if (!existingUser)
      return res.status(401).json({
        clientError: "Wrong email or password",
      });

    const correctPassword = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );

    if (!correctPassword)
      return res.status(401).json({
        clientError: "Wrong email or password",
      });

    const token = jsonwebtoken.sign(
      {
        id: existingUser._id,
      },
      process.env.JWT_SECRET as string
    );

    res
      .cookie("jsonwebtoken", token, {
        httpOnly: true,
        sameSite:
          process.env.NODE_ENV === "development"
            ? "lax"
            : process.env.NODE_ENV === "production" && "none",
        secure:
          process.env.NODE_ENV === "development"
            ? false
            : process.env.NODE_ENV === "production" && true,
      })
      .send();
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ serverError: "Unexpected error occurred in the server" });
  }
});

router.post("/updatename", async (req, res) => {
  try {
    const token = req.cookies.jsonwebtoken;
    const { name } = req.body;
    if (!token) return res.status(401).json({ clientMessage: "Unauthorized" });
    const validatedUser = jsonwebtoken.verify(
      token,
      process.env.JWT_SECRET as string
    );
    const userId = (validatedUser as JwtPayload).id;
    const user = await userModel.findById(userId);
    if (user) user.name = name;
    await user?.save();
    res.json(user);
  } catch (err) {
    return res.status(401).json({ errorMessage: "Unauthorized." });
  }
});

router.post("/updatepassword", async (req, res) => {
  try {
    const token = req.cookies.jsonwebtoken;
    const { password } = req.body;
    const passwordStrength = zxcvbn(password);
    if (passwordStrength.score < MIN_PASSWORD_STRENGTH)
      return res.status(400).json({
        clientError:
          "Password isn't strong enough, the value is" + passwordStrength.score,
      });
    if (!token) return res.status(401).json({ clientMessage: "Unauthorized" });
    const validatedUser = jsonwebtoken.verify(
      token,
      process.env.JWT_SECRET as string
    );
    const userId = (validatedUser as JwtPayload).id;
    const user = await userModel.findById(userId);
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    if (user) user.passwordHash = passwordHash;
    await user?.save();
    res.json(user);
  } catch (err) {
    return res.status(401).json({ errorMessage: "Unauthorized." });
  }
});

router.get("/signout", async (req, res) => {
  try {
    res
      .cookie("jsonwebtoken", "", {
        httpOnly: true,
        sameSite:
          process.env.NODE_ENV === "development"
            ? "lax"
            : process.env.NODE_ENV === "production" && "none",
        secure:
          process.env.NODE_ENV === "development"
            ? false
            : process.env.NODE_ENV === "production" && true,
        expires: new Date(0),
      })
      .send();
  } catch (err) {
    return res
      .status(500)
      .json({ errorMessage: "Server Error nichal todo api" });
  }
});

router.post("/passresreq", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({
        clientError: "The email is missing",
      });
    const existingUser = await userModel.findOne({ email });
    if (!existingUser)
      return res.status(400).json({
        clientError: "An account with this email couldn't been found",
      });

    const key = keyv4();

    await new RequestForPassChange({
      email,
      key,
    }).save();

    const url = `${clientDomain}/reset?key=${key}`;

    const { subject, body } = passreset(url);

    sendEmail(email, subject, body)
      .then(() => console.log("sent password reset email"))
      .catch((err) => console.error(err));

    res.json({ result: "email successfully sent to " + email });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ serverError: "Unexpected error occurred in the server" });
  }
});

router.post("/passresfin", async (req, res) => {
  try {
    const { email, key, password, passwordagain } = req.body;
    if (!email || !key || !password || !passwordagain)
      return res.status(400).json({
        clientError: "At least one of the fields are missing",
      });

    const existingPassChangeReq = await RequestForPassChange.findOne({ key });
    if (!existingPassChangeReq || existingPassChangeReq.email !== email) {
      return res
        .status(400)
        .json({ clientError: "Invalid or expired pass-reset link" });
    }

    const passwordStrength = zxcvbn(password);

    if (passwordStrength.score < MIN_PASSWORD_STRENGTH)
      return res.status(400).json({
        clientError:
          "Password isn't strong enough, the value is" + passwordStrength.score,
      });
    if (password !== passwordagain)
      return res.status(400).json({
        clientError: "Passwords doesn't match",
      });
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const user = (await userModel.find({ email }))[0];
    user.passwordHash = passwordHash;
    await user.save();
    res.json({ changed: "yes" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ serverError: "Unexpected error occurred in the server" });
  }
});

router.post("/updaten", async (req, res) => {
  try {
    const { notifications, newsletter } = req.body;
    if (
      (notifications !== true && notifications !== false) ||
      (newsletter !== true && newsletter !== false)
    )
      return res.status(400).json({
        clientError: "At least one of the fields are missing",
      });

    const token = req.cookies.jsonwebtoken;
    if (!token) return res.status(401).json({ clientMessage: "Unauthorized" });
    const validatedUser = jsonwebtoken.verify(
      token,
      process.env.JWT_SECRET as string
    );
    const userId = (validatedUser as JwtPayload).id;
    const user = (await userModel.find({ userId }))[0];
    await user.save();
    res.json({ changed: "yes" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ serverError: "Unexpected error occurred in the server" });
  }
});

router.get("/signedin", async (req, res) => {
  try {
    const token = req.cookies.jsonwebtoken;
    if (!token) return res.status(401).json({ clientMessage: "Unauthorized" });
    const validatedUser = jsonwebtoken.verify(
      token,
      process.env.JWT_SECRET as string
    );
    const userId = (validatedUser as JwtPayload).id;
    res.json(await userModel.findById(userId));
  } catch (err) {
    return res.status(401).json({ errorMessage: "Unauthorized." });
  }
});

export default router;
