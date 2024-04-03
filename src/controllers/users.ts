import express from "express";

import { getUsers, deleteUserByID, getUserByID, RoleType } from "../db/users";
import { authentication, random } from "../helpers";
import { get } from "lodash";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers(); // Call getUsers function to fetch all users

    return res.status(200).json(users); // Return the users as JSON response
  } catch (error) {
    console.log(error);
    return res.sendStatus(500); // Internal Server Error if something goes wrong
  }
};

export const getUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    const selectedUser = await getUserByID(id);

    return res.status(200).json(selectedUser); // Return the users as JSON response
  } catch (error) {
    console.log(error);
    return res.sendStatus(500); // Internal Server Error if something goes wrong
  }
};

export const getCurrentUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const currentUserId = get(req, "identity._id") as string;
    const selectedUser = await getUserByID(currentUserId);

    return res.status(200).json(selectedUser); // Return the users as JSON response
  } catch (error) {
    console.log(error);
    return res.sendStatus(500); // Internal Server Error if something goes wrong
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteUserByID(id); // Call deleteUserByID function to delete user by ID

    if (!deletedUser) {
      return res.status(404).send("User not found"); // Send 404 if user with given ID not found
    }

    return res.status(200).json(deletedUser); // Return the deleted user as JSON response
  } catch (error) {
    console.log(error);
    return res.sendStatus(500); // Internal Server Error if something goes wrong
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { username, email, authentication, profile } = req.body;

    const user = await getUserByID(id);

    if (!user) {
      return res.sendStatus(404); // Not Found if user doesn't exist
    }
    // Validate if the role is a valid RoleType
    if (authentication?.role) {
      if (!Object.values(RoleType).includes(authentication.role)) {
        return res.status(400).json({ error: "Invalid role" }); // Bad Request if role is not a valid RoleType
      }
      //update role
      user.authentication.role = authentication.role;
    }

    if (username) {
      user.username = username;
    }

    if (email) {
      user.email = email;
    }

    // Update personal data fields if provided
    if (profile) {
      Object.assign(user.profile, profile);
    }

    await user.save();

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500); // Internal Server Error
  }
};

export const updateUserProfile = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { profile } = req.body;

    const user = await getUserByID(id);

    if (!user) {
      return res.sendStatus(404); // Not Found if user doesn't exist
    }

    // Update personal data fields if provided
    if (profile) {
      Object.assign(user.profile, profile);
    }

    await user.save();

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500); // Internal Server Error
  }
};

export const updateRole = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const id = req.params.id;
    const { role } = req.body;

    const user = await getUserByID(id);

    if (!user) {
      return res.sendStatus(404); // Not Found if user doesn't exist
    }

    // Validate if the role is a valid RoleType
    if (!Object.values(RoleType).includes(role)) {
      return res.status(400).json({ error: "Invalid role" }); // Bad Request if role is not a valid RoleType
    }

    //update role
    user.authentication.role = role;

    await user.save();

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500); // Internal Server Error
  }
};

export const updatePassword = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const id = req.params.id;
    const { password, newPassword } = req.body;

    if (!password || !newPassword) {
      return res.sendStatus(400); // Bad Request: Missing required fields
    }

    const user = await getUserByID(id);
    if (!user) {
      return res.sendStatus(404); // Not Found if user doesn't exist
    }

    const salt = random();

    Object.assign(user.authentication, {
      salt: salt,
      password: authentication(salt, newPassword),
    });

    await user.save();

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500); // Internal Server Error
  }
};
