import { RequestHandler } from "express";
import * as PPAService from '../services/ppa';
import { PPA } from "../types/ppa";
import { parseSingleDuration } from "../utils/duration";
import * as BadRequest from '../errors/badRequest';

export const list: RequestHandler = async (req, res) => {
  const { powerplantId } = req.query;
  try {
    const ppas = await PPAService.list({
      supplierId: (req as any).supplierId,
      buyerId: (req as any).buyerId,
      powerplantId: typeof powerplantId === 'string' ? powerplantId : undefined
    });

    return res.status(200).json(ppas);
  } catch (err: any) {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err?.message
    })
  }
}

export const buy: RequestHandler = async (req, res) => {
  const { powerplantId, duration, amount } = req.body;
  const dur = parseSingleDuration(duration);
  if (!dur) {
    return BadRequest.bodyPropertyMissing(res, 'duration');
  }

  if (!amount || !Number.isInteger(amount) || amount < 0) {
    return BadRequest.bodyPropertyMissing(res, 'amount');
  }

  if (!powerplantId) {
    return BadRequest.bodyPropertyMissing(res, 'power plant id');
  }

  try {
    const ppa = await PPAService.buy((req as any).buyerId, req.body);
    return res.status(201).json(ppa);
  } catch (err: any) {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err?.message
    })
  }
}

export const get: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { supplierId, buyerId } = (req as any);
  try {
    let ppa: PPA | null = supplierId ? await PPAService.get(id, {
      supplierId,
    }) : null;

    if (!ppa && buyerId) {
      ppa = await PPAService.get(id, {
        buyerId,
      })
    }

    if (!ppa) {
      res.status(404).json({
        error: 'Not Found',
        message: `Could not find PPA with id ${id}`
      })
    }

    res.status(200).json(ppa);
  } catch (err: any) {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err?.message
    })
  }

}

export const cancel: RequestHandler = async (req, res) => {
  try {
    await PPAService.cancel(req.params.id, (req as any).supplierId);
  } catch (err: any) {
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err?.message
    })
  }
}

