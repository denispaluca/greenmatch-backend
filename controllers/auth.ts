"use strict";
import UserModel from "../models/user";
import type { Request, Response } from 'express';
import { RequestWithUserId } from "../types/auth";
import * as AuthService from '../services/auth';
import dotenv from 'dotenv';

// load stripe
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_SK);

export const login = async (req: Request, res: Response) => {
  // check if the body of the request contains all necessary properties
  const { email, password, loginType } = req.body;
  if (!password)
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body must contain a password property",
    });

  if (!email)
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body must contain a email property",
    });

  if (!loginType)
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body must contain a loginType property",
    });

  // handle the request
  try {
    // if user is found and password is valid
    // create a token
    const token = await AuthService.login(email, password, loginType);
    if (!token) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid email or password",
      });
    }
    return res.status(200).cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      path: '/',
      sameSite: 'strict',
    }).send("Successful login.")

  } catch (err: any) {
    return res.status(404).json({
      error: "User Not Found",
      message: err.message,
    });
  }
};

export const register = async (req: Request, res: Response) => {
  const {
    email,
    password,
    iban,
    company,
  } = req.body;
  if (!password)
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body must contain a password property",
    });

  if (!email)
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body must contain a email property",
    });

  if (!iban)
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body must contain an iban property",
    });

  const { name: companyName,
    country: companyCountry,
    website: companyWebsite,
    hrb: companyHrb } = company;

  console.log(company);

  if (!companyName || !companyCountry || !companyWebsite || !companyHrb) {
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body must contain all company properties",
    });
  }

  // handle the request
  try {
    const token = await AuthService.register(email, password, iban, company);
    // return generated token
    return res.status(200).cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      path: '/',
      sameSite: 'strict',
    }).send("Successful registration.")
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

/* 
* A SetupIntent guides you through the process of setting up and saving a customer's payment credentials for future payments. 
* For example, you could use a SetupIntent to set up and save your customer's card without immediately collecting a payment. 
* Later, you can use PaymentIntents to drive the payment flow. 
*/
export const setupIntent = async (req: RequestWithUserId, res: Response) => {
  try {
    // get own user name from database
    let user = await UserModel.findById(req.userId);

    if (!user)
      return res.status(404).json({
        error: "Not Found",
        message: `User not found`,
      });

    const setupIntent = await stripe.setupIntents.create({
      payment_method_types: ['sepa_debit'],
      customer: user.stripeCustId,
    });
    return res.status(200).json(setupIntent);
  } catch (err: any) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
};

export const logout = (req: Request, res: Response) => {
  return res.clearCookie('token').status(200).send("Successful logout.")
};
