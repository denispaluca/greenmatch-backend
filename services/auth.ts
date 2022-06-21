import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/user";

export const login = async (username: string, password: string) => {
  // get the user form the database
  let user = await UserModel.findOne({
    username
  });

  if (!user) return null;

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