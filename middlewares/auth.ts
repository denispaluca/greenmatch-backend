"use strict";

import { ErrorRequestHandler, NextFunction, Response, RequestHandler } from "express";
import jwt from "jsonwebtoken";


import { RequestWithUserId } from "../types/auth";

export const checkAuthentication = (req: RequestWithUserId, res: Response, next: NextFunction) => {
    // check header or url parameters or post parameters for token
    let token = req.headers.authorization;

    if (!token)
        return res.status(401).send({
            error: "Unauthorized",
            message: "No token provided in the request",
        });

    // verifies secret and checks exp
    jwt.verify(token, process.env.JwtSecret || 'secret', (err, decoded) => {
        if (err) {
            return res.status(401).send({
                error: "Unauthorized",
                message: "Failed to authenticate token.",
            });
        }

        // if everything is good, save to request for use in other routes
        if (typeof decoded === "object") {
            req.userId = decoded._id;
        }
        next();
    });
};

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500);
    res.render("error", { error: err });
};
