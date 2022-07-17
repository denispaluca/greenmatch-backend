import type { RequestHandler } from "express";
import type { RequestWithUserId } from "../types/auth";
import * as NotificationService from "../services/notification";

export const list: RequestHandler = (req: RequestWithUserId, res) => {
  if (req.role !== 'buyer' || !req.userId) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Only buyers can access this endpoint'
    });
  }

  try {
    const notifications = NotificationService.list(req.userId);
    return res.status(200).json(notifications);
  } catch (error: any) {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error?.message
    });
  }
}


export const read: RequestHandler = (req: RequestWithUserId, res) => {
  if (req.role !== 'buyer' || !req.userId) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Only buyers can access this endpoint'
    });
  }

  try {
    const notification = NotificationService.read(req.userId, req.params.id);
    return res.status(200).json(notification);
  } catch (error: any) {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error?.message
    });
  }
}