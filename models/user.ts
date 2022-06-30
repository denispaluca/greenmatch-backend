import * as mongoose from 'mongoose';
import {Company} from '../types/auth';

interface User {
  email: string;
  password: string;
  role: string;
  iban: string;
  company: Company;
}

// Define the user schema
const UserSchema = new mongoose.Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // role of the user, used for rights management
  role: {
    type: String,
    // role can only take the values "member" and "admin"
    enum: ["supplier", "buyer"],
    // if not specified the role "member" is chosen
    default: "supplier"
  },
  iban: {
    type: String,
    required: true,
    unique: true
  },
  company: new mongoose.Schema<Company>({
    country: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    website: {
      type: String,
      required: true,
    },
    hrb: {
      type: String,
      required: true,
      unique: true,
    },
    imageURL: {
      type: String,
    },
  }),
});

UserSchema.set("versionKey", false);

// Export the User model
const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
