import express from "express";
const axios = require("axios");
require("dotenv").config();

const STEAM_API_KEY = process.env.STEAM_API_KEY;

export const getSpecialOffers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const response = await axios.get(
      "https://store.steampowered.com/api/featuredcategories/"
    );

    const { specials } = response.data;

    return res.status(200).json(specials.items); // Return the users as JSON response
  } catch (error) {
    console.log(error);
    return res.sendStatus(500); // Internal Server Error if something goes wrong
  }
};

export const getNewReleases = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const response = await axios.get(
      "https://store.steampowered.com/api/featuredcategories/"
    );

    const { new_releases } = response.data;

    return res.status(200).json(new_releases.items); // Return the users as JSON response
  } catch (error) {
    console.log(error);
    return res.sendStatus(500); // Internal Server Error if something goes wrong
  }
};
