import express from "express";

import {
  deleteUser,
  getAllUsers,
  getUser,
  updatePassword,
  updateRole,
  updateUserProfile,
} from "../controllers/users";
import { isAdmin, isAuthenticated, isOwner } from "../middlewares";

export default (router: express.Router) => {
  router.get("/users", isAuthenticated, isAdmin, getAllUsers);
  router.get("/users/:id", isAuthenticated, isAdmin, getUser);
  router.delete("/users/:id", isAuthenticated, isOwner, deleteUser);
  router.patch("/users/:id", isAuthenticated, isOwner, updateUserProfile);
  router.patch("/users/:id/role", isAuthenticated, isAdmin, updateRole);
  router.patch("/users/:id/password", isAuthenticated, isOwner, updatePassword);
};
