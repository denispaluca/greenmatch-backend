import type { Request, Response } from "express";
import * as UserService from '../services/username';
import * as MailService from '../services/mailer';


export const checkAvailability = async (req: Request, res: Response) => {

    const email = req.params.id

    if (!email)
    return res.status(400).json({
      error: "Bad Request",
      message: "URL has to contain email",
    });
  
    try {
    // filter for email in userdb
    const result = await UserService.checkUser(email)
    return res.status(200).json({
      available: result,
    });

  } catch (err: any) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
};
