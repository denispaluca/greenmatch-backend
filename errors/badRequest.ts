import { Response } from "express"

export const badRequest = (res: Response, message: string) =>
  res.status(400).json({
    error: 'Bad Request',
    message
  });

export const bodyPropertyMissing = (res: Response, property: string) =>
  badRequest(res, `The request body must contain a ${property} property`);

export const noRoute = (res: Response) =>
  badRequest(res, `The request has no route parameter`);