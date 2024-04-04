import express from "express";
import { getNewReleases, getSpecialOffers } from "../controllers/steam";

export default (router: express.Router) => {
  router.get("/steam/special_offers", getSpecialOffers);
  router.get("/steam/new_releases", getNewReleases);
};
