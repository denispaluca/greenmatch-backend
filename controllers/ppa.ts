import { RequestHandler } from "express";
import * as PPAService from "../services/ppa";
import { PPA } from "../types/ppa";
import { parseSingleDuration } from "../utils/duration";
import * as BadRequest from "../errors/badRequest";
import { RequestWithUserId } from "../types/auth";

export const list: RequestHandler = async (req: RequestWithUserId, res) => {
  const { powerplantId } = req.query;
  const { userId, role } = req;
  if (!userId || !role) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "No user loged in",
    });
  }

  try {
    const ppas = await PPAService.list(
      userId,
      role,
      typeof powerplantId === "string" ? powerplantId : undefined
    );

    return res.status(200).json(ppas);
  } catch (err: any) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: err?.message,
    });
  }
};

export const buy: RequestHandler = async (req: RequestWithUserId, res) => {
  const { userId, role } = req;
  if (!userId) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "No user loged in",
    });
  }

  if (role !== "buyer") {
    return res.status(401).json({
      error: "Unauthorized",
      message: "User is not a buyer",
    });
  }

  const { powerplantId, duration, amount } = req.body;
  const dur = parseSingleDuration(duration);
  if (!dur) {
    return BadRequest.bodyPropertyMissing(res, "duration");
  }

  if (!amount || !Number.isInteger(amount) || amount < 0) {
    return BadRequest.bodyPropertyMissing(res, "amount");
  }

  if (!powerplantId) {
    return BadRequest.bodyPropertyMissing(res, "power plant id");
  }

  try {
    const ppa = await PPAService.buy(userId, req.body);
    return res.status(201).json(ppa);
  } catch (err: any) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: err?.message,
    });
  }
};

export const get: RequestHandler = async (req: RequestWithUserId, res) => {
  const { userId, role } = req;
  if (!userId || !role) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "No user loged in",
    });
  }

  const { id } = req.params;
  try {
    let ppa = await PPAService.get(id, userId, role);
    if (!ppa) {
      res.status(404).json({
        error: "Not Found",
        message: `Could not find PPA with id ${id}`,
      });
    }

    res.status(200).json(ppa);
  } catch (err: any) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: err?.message,
    });
  }
};

export const cancel: RequestHandler = async (req: RequestWithUserId, res) => {
  if (!req.userId) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "No user loged in",
    });
  }

  try {
    await PPAService.cancel(req.params.id, req.userId);
  } catch (err: any) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: err?.message,
    });
  }
};
