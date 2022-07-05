import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/user";
import { Company } from "../types/auth";
import dotenv from 'dotenv';

// load stripe
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_SK);

export const login = async (email: string,
  password: string,
  loginType: string): Promise<string | null> => {
  // get the user form the database
  let user = await UserModel.findOne({
    email,
  });

  if (!user) return null;

  // check if the loginType is valid
  if (user.role.toLowerCase() !== loginType.toLowerCase()) return null;

  // check if the password is valid
  const isPasswordValid = bcrypt.compareSync(
    password,
    user.password
  );
  if (!isPasswordValid) return null;


  const token = jwt.sign(
    { _id: user._id, username: user.email, role: user.role },
    process.env.JWT_SECRET || "secret",
    {
      expiresIn: 86400, // expires in 24 hours
    }
  );

  return token;
}

export const register = async (
  email: string,
  password: string,
  iban: string,
  company: Company,
): Promise<string | null> => {
  // hash the password before storing it in the database
  const hashedPassword = bcrypt.hashSync(password, 8);

  // stripe: create customer
  const customer = await stripe.customers.create({
    'email': email,
    'name': company.name,
  });

  // create a user object
  const user = {
    email: email,
    password: hashedPassword,
    role: "buyer",
    company: company,
    iban: iban,
    stripeCustId: customer.id
  };

  // create the user in the database
  let retUser = await UserModel.create(user);

  // if user is registered without errors
  // create a token
  const token = jwt.sign(
    {
      _id: retUser._id,
      username: retUser.email,
      role: retUser.role,
    },
    process.env.JWT_SECRET || "secret",
    {
      expiresIn: 86400, // expires in 24 hours
    }
  );

  return token;
}
