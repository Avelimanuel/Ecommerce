import { Router } from "express";
import { UserModel } from "../models/user";
import { UserErrors } from "../errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

const secret = "mysecret";

router.get("/profiles", async (req, res) => {
  try {
    const profiles = await UserModel.find({}).sort({ createdAt: -1 });
    return res.status(200).json(profiles);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username });
    if (user) {
      return res.status(400).json({ user: UserErrors.USERNAME_ALREADY_EXISTS });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ username, password: hashedPassword });
    await newUser.save();
    res.status(200).json({ message: "User Created Successfully" });
    console.log("User Registered Successfully..")
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ type: UserErrors.NO_USER_FOUND });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ type: UserErrors.WRONG_CREDENTIALS });
    }

    //creating a jwt token

    const token = jwt.sign({ id: user._id }, secret);
    res.json({ token, id: user._id, name: user.username, pass: user.password });
  } catch (error) {
    console.log(error);
  }
});

//This function will be used to verify the jwt tokens.
export const verifyTokens = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    jwt.verifyTokens(authHeader, secret, (error) => {
      if (error) {
        return res.sendStatus(403);
      }
      next();
    });
  }

  return res.sendStatus(401);
};

export { router as userRouter };
