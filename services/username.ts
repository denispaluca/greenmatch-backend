import UserModel from "../models/user";

// Checks db for user entry with email
export const checkUser = async (email :string) :  Promise<boolean> => {
    // ToDo: Change filter paramter from username to updated collection scheme
    let users = await UserModel.find({ username: email });
    return users.length === 0
}