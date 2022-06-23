import { RequestHandler } from "express";
import * as PowerPlantService from '../services/powerplant';

export const create: RequestHandler = async (req, res) => {
  const { location, energyType } = req.body;
  if (!location) {
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body must contain a location property",
    });
  }

  if (!energyType) {
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body must contain an energy type property",
    });
  }

  try {
    const newPowerPlant = await PowerPlantService.create(
      {
        location,
        energyType
      },
      (req as any).supplierId
    );

    res.status(201).json(newPowerPlant);
  } catch (err: any) {
    if (err?.code == 11000) {
      return res.status(400).json({
        error: "User exists",
        message: err?.message,
      });
    }

    return res.status(500).json({
      error: "Internal server error",
      message: err?.message,
    });
  }
}

const list: RequestHandler = async (req, res) => {
  try {
    const powerplants = await PowerPlantService.list((req as any).supplierId);
    return res.status(200).json(powerplants);
  } catch (err: any) {
    return res.status(500).json({
      error: "Internal server error",
      message: err?.message,
    });
  }
}

const get: RequestHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      error: "Bad Request",
      message: "The request parameters must contain an id property",
    });
  }
  try {
    const powerplant = await PowerPlantService.get(id, (req as any).supplierId);
    if (!powerplant) {
      return res.status(404).json({
        error: "Powerplant Not Found",
        message: "Power Plant doesn't exist",
      });
    }

    res.status(200).json(powerplant);
  } catch (err: any) {
    return res.status(404).json({
      error: "Powerplant Not Found",
      message: err?.message,
    });
  }
}