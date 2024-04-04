import express from "express";

import { deleteUser, updateUser } from "../controllers/users";
import { isAdmin, isAuthenticated } from "../middlewares";

export default (router: express.Router) => {
  router.patch("/admin/users/:id", isAuthenticated, isAdmin, updateUser);
  router.delete("/admin/users/:id", isAuthenticated, isAdmin, deleteUser);
};
