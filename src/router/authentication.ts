import express from "express";

import { login, register } from "../controllers/authentication";
import { isAuthenticated, isOwner } from "../middlewares";
import { getCurrentUser, getUser } from "../controllers/users";

export default (router: express.Router) => {
  router.post("/auth/register", register);
  router.post("/auth/login", login);
  router.get("/auth/authenticate", isAuthenticated, getCurrentUser);
};
