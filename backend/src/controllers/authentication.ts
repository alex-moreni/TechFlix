import express from "express";
import { random, auth } from "../helpers/crypto";
import { getUserByEmail, createUser } from "../models/user";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ Error: "Check if the request body is valid." });
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      return res.status(400).json({ Error: "This user does not exist." });
    }

    const expectedHash = auth(password, user.authentication.salt);

    if (user.authentication.password != expectedHash) {
      return res.status(403).json({ Error: "Incorrect password." });
    }

    const salt = random();

    user.authentication.sessionToken = auth(salt, user._id.toString());

    await user.save();

    res.cookie("TECHFLIX-AUTH", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ Error: "Check if the request body is valid." });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        Error: "Check if the email already exists in the database.",
      });
    }

    //  Create a new user in the database.
    const salt = random();

    const user = await createUser({
      username,
      email,
      role: "user",
      authentication: {
        password: auth(password, salt),
        salt,
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};
