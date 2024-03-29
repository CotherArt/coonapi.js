import express from "express";
require("dotenv").config();

import { createUser, getUserByEmail, getUserByUsername } from "../db/users";
import { authentication, random } from "../helpers";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.sendStatus(400); // Bad Request: Missing required fields
    }

    const existingMail = await getUserByEmail(email);
    if (existingMail) {
      return res.status(409).json({ error: "El email ya existe" }); // Conflict: User already exists
    }

    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ error: "El usuario ya existe" }); // Conflict: User already exists
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(201).json(user); // Created: User registered successfully
  } catch (error) {
    console.log(error);
    return res.sendStatus(500); // Internal Server Error
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400); // Bad Request: Missing required fields
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      return res.status(404).json({ error: "El usuario no se encuentra" }); // Not Found: User not found
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password !== expectedHash) {
      return res.status(403).json({ error: "Credenciales inválidas" }); // Forbidden: Invalid credentials
    }

    const salt = random();
    const sessionToken = authentication(salt, user._id.toString());

    user.authentication.sessionToken = sessionToken;

    await user.save();

    const DOMAIN = process.env.DOMAIN;
    res.cookie("COTHER-AUTH", user.authentication.sessionToken, {
      domain: DOMAIN,
      path: "/",
    });

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500); // Internal Server Error
  }
};
