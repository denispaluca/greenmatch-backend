import * as mongoose from 'mongoose';

interface User {
  username: string;
  password: string;
  role: string;
}

// Define the user schema
const UserSchema = new mongoose.Schema<User>({
  username: {
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
    enum: ["member", "admin"],
    // if not specified the role "member" is chosen
    default: "member"
  }
});

UserSchema.set("versionKey", false);

// Export the User model
const UserModel = mongoose.model("User", UserSchema);

export default UserModel;