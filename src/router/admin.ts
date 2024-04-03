import express from "express";

import { updateUser } from "../controllers/users";
import { isAdmin, isAuthenticated } from "../middlewares";

export default (router: express.Router) => {
  router.patch("/admin/user/:id", isAuthenticated, isAdmin, updateUser);
};
