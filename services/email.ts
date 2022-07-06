import UserModel from "../models/user";

// Checks db for user entry with email
export const checkUser = async (email: string): Promise<boolean> => {
    // ToDo: Change filter paramter from email to updated collection scheme
    let users = await UserModel.find({ email: email }).lean();
    return users.length === 0
}