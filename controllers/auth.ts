"use strict";
import UserModel from "../models/user";
import type { Request, Response } from 'express';
import { RequestWithUserId } from "../types/auth";
import * as AuthService from '../services/auth';

export const login = async (req: Request, res: Response) => {
  // check if the body of the request contains all necessary properties
  const { username, password, loginType } = req.body;
  if (!password)
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body must contain a password property",
    });

  if (!username)
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body must contain a username property",
    });

  if(!loginType)
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body must contain a loginType property",
    });

  // handle the request
  try {
    // if user is found and password is valid
    // create a token
    const token = await AuthService.login(username, password, loginType);
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
  const { 
    username, 
    password, 
    iban, 
    company,
  } = req.body;
  if (!password)
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body must contain a password property",
    });

  if (!username)
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body must contain a username property",
    });

  if(!iban)
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body must contain an iban property",
    });

  const { name: companyName, 
    country: companyCountry, 
    website: companyWebsite, 
    hrb: companyHrb } = company;

  console.log(company);
  console.log(companyName);
  console.log(companyCountry);
  console.log(companyWebsite);
  console.log(companyHrb);

  if(!companyName || !companyCountry || !companyWebsite || !companyHrb){
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body must contain all company properties",
    });
  }

  // handle the request
  try {
    const token = await AuthService.register(username, password, iban, company);
    // return generated token
    res.status(200).json({
      token,
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
    let user = await UserModel.findById(req.userId);

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
