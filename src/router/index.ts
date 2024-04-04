import express from "express";

import authentication from "./authentication";
import users from "./users";
import admin from "./admin";
import steam from "./steam";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  admin(router);
  steam(router);
  return router;
};
