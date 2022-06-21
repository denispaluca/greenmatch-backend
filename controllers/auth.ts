"use strict";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from "../models/user";
import type { Request, Response } from 'express';
import { RequestWithUserId } from "../types/auth";
import * as AuthService from '../services/auth';

export const login = async (req: Request, res: Response) => {
  // check if the body of the request contains all necessary properties
  if (!Object.prototype.hasOwnProperty.call(req.body, "password"))
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body must contain a password property",
    });

  if (!Object.prototype.hasOwnProperty.call(req.body, "username"))
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body must contain a username property",
    });

  // handle the request
  try {
    // if user is found and password is valid
    // create a token
    const token = await AuthService.login(req.body.username, req.body.password);
    if (!token) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid username or password",
      });
    }
    return res.status(200).json({
      token,
    });
  } catch (err: any) {
    return res.status(404).json({
      error: "User Not Found",
      message: err.message,
    });
  }
};

export const register = async (req: Request, res: Response) => {
  // check if the body of the request contains all necessary properties
  if (!Object.prototype.hasOwnProperty.call(req.body, "password"))
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body must contain a password property",
    });

  if (!Object.prototype.hasOwnProperty.call(req.body, "username"))
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body must contain a username property",
    });

  // handle the request
  try {
    // hash the password before storing it in the database
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    // create a user object
    const user = {
      username: req.body.username,
      password: hashedPassword,
      role: req.body.isAdmin ? "admin" : "member",
    };

    // create the user in the database
    let retUser = await UserModel.create(user);

    // if user is registered without errors
    // create a token
    const token = jwt.sign(
      {
        _id: retUser._id,
        username: retUser.username,
        role: retUser.role,
      },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: 86400, // expires in 24 hours
      }
    );

    // return generated token
    res.status(200).json({
      token: token,
    });
  } catch (err: any) {
    if (err.code == 11000) {
      return res.status(400).json({
        error: "User exists",
        message: err.message,
      });
    } else {
      return res.status(500).json({
        error: "Internal server error",
        message: err.message,
      });
    }
  }
};

export const me = async (req: RequestWithUserId, res: Response) => {
  try {
    // get own user name from database
    let user = await UserModel.findById(req.userId)
      .select("username")
      .exec();

    if (!user)
      return res.status(404).json({
        error: "Not Found",
        message: `User not found`,
      });

    return res.status(200).json(user);
  } catch (err: any) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
};

export const logout = (req: RequestWithUserId, res: Response) => {
  res.status(200).send({ token: null });
};