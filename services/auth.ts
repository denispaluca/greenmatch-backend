import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/user";
import {Company} from "../types/auth";

export const login = async (username: string, 
  password: string, 
  loginType: string): Promise<string | null> => {
  // get the user form the database
  let user = await UserModel.findOne({
    username,
  });

  if (!user) return null;

  // check if the loginType is valid
  if(user.role.toLowerCase() !== loginType.toLowerCase()) return null;

  // check if the password is valid
  const isPasswordValid = bcrypt.compareSync(
    password,
    user.password
  );
    if (!isPasswordValid) return null;


  const token = jwt.sign(
    { _id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET || "secret",
    {
      expiresIn: 86400, // expires in 24 hours
    }
  );

  return token;
}

export const register = async (
  username: string, 
  password: string, 
  iban: string,
  company: Company, 
  ): Promise<string | null> => {
  // hash the password before storing it in the database
  const hashedPassword = bcrypt.hashSync(password, 8);

  // create a user object
  const user = {
    username: username,
    password: hashedPassword,
    role: "buyer",
    company: company,
    iban: iban,
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

  return token;
}
