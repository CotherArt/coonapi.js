import express from "express";
import { get, merge } from "lodash";
const jwt = require("jsonwebtoken");

require("dotenv").config();

import { RoleType, getUserByID } from "../db/users";
const secretKey = process.env.SECRET;

/**
 * Middleware to check if the user is authenticated.
 *
 * @param req - The request object from the client.
 * @param res - The response object to send back the reply to the client.
 * @param next - The next function to pass control to the next middleware.
 */
export async function isAuthenticated(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    // Retrieve the session token from the cookies sent with the request.
    // const sessionToken = req.cookies["COTHER-AUTH"];

    const token = req.headers["authorization"];

    if (!token) {
      return res.status(403).json({ error: "Token is required" });
    }

    const myToken = token.split(" ")[1];

    jwt.verify(myToken, secretKey, async (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      }
      const userId = decoded.userId;
      // Use the session token to retrieve the corresponding user's information.
      const existingUser = await getUserByID(userId);

      // If no user is associated with the session token, respond with a 401 Unauthorized status.
      if (!existingUser) {
        return res.sendStatus(401); // Unauthorized: Invalid session token
      }

      // If the user exists, merge their information into the request object.
      // This allows subsequent middleware and route handlers to access the user's information.
      merge(req, { identity: existingUser });

      // If the user is authenticated, proceed to the next middleware in the stack.
      return next();
    });
  } catch (error) {
    // If an error occurs during the execution of the above code, log the error to the console.
    console.log(error);
    // Send a 500 Internal Server Error status code as the response.
    return res.sendStatus(500);
  }
}

/**
 * Define an asynchronous function 'isOwner' that checks if the current user is the owner of a resource.
 *
 * @param req - The request object from the client.
 * @param res - The response object to send back the reply to the client.
 * @param next - The next function to pass control to the next middleware.
 */
export async function isOwner(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    // Destructure the 'id' parameter from the request parameters.
    const { id } = req.params;

    // Retrieve the current user's ID from the request object, assuming it's stored under 'identity._id'.
    // The 'get' function is not defined in this snippet, but it's assumed to be a helper function to safely access nested properties.
    const currentUserId = get(req, "identity._id") as string;

    // Check if the current user ID is not present.
    if (!currentUserId) {
      // If not, send a 400 Bad Request status code as the response.
      return res.sendStatus(400);
    }

    // Check if the current user ID does not match the ID from the request parameters.
    if (currentUserId != id) {
      // If they don't match, send a 403 Forbidden status code as the response.
      return res.sendStatus(403);
    }

    // If the current user ID matches the ID from the request parameters, call the 'next' function
    // to pass control to the next middleware in the stack.
    next();
  } catch (error) {
    // If an error occurs during the execution of the above code, log the error to the console.
    console.log(error);
    // Send a 500 Internal Server Error status code as the response.
    return res.sendStatus(500);
  }
}

/**
 * Export the isAdmin middleware function for use in other parts of the application.
 *
 * @param req - The request object from the client.
 * @param res - The response object to send back the reply to the client.
 * @param next - The next function to pass control to the next middleware.
 */
export function isAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    // Attempt to retrieve the admin status from the request object.
    // The path 'identity.authentication.admin' is where the admin status is expected to be found.
    const role = get(req, "identity.authentication.role") as RoleType;

    // If the admin property is not set or falsy, the user is not an admin.
    if (role !== RoleType.Administrator) {
      // Send a 403 Forbidden response and do not proceed to the next middleware.
      return res.sendStatus(403);
    }

    // If the admin property is truthy, the user is an admin, so proceed to the next middleware.
    next();
  } catch (error) {
    // If an error occurs during the execution of the middleware, log the error.
    console.log(error);
    // Send a 500 Internal Server Error response to the client.
    return res.sendStatus(500);
  }
}
