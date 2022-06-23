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

    res.status(200).json({
      id: newPowerPlant._id
    })
  } catch (err: any) {
    if (err.code == 11000) {
      return res.status(400).json({
        error: "User exists",
        message: err.message,
      });
    }

    return res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
}

const list: RequestHandler = async (req, res) => {

}

const get: RequestHandler = async (req, res) => {

}