import express from "express";

import authentication from "./authentication";
import users from "./users";
import admin from "./admin";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  admin(router);
  return router;
};
