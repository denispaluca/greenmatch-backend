import { RequestHandler } from "express";
import * as PowerPlantService from "../services/powerplant";
import * as BadRequest from "../errors/badRequest";
import { PowerPlantCreate } from "../types/powerplant";
import { RequestWithUserId } from "../types/auth";

export const create: RequestHandler = async (req: RequestWithUserId, res) => {
  if (!req.role || req.role !== "supplier" || !req.userId) {
    return res.status(401).json({
      error: "Wrong Auth",
      message: "User is not supplier",
    });
  }

  const requiredProperties: (keyof PowerPlantCreate)[] = [
    "location",
    "energyType",
    "name",
  ];

  for (const prop of requiredProperties)
    if (!req.body[prop]) return BadRequest.bodyPropertyMissing(res, prop);


  const { location, energyType, name } = req.body;
  try {
    const newPowerPlant = await PowerPlantService.create(
      {
        location,
        energyType,
        name,
      },
      req.userId
    );

    return res.status(201).json(newPowerPlant);
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
};

export const list: RequestHandler = async (req: RequestWithUserId, res) => {
  if (!req.role || req.role !== "supplier" || !req.userId) {
    return res.status(401).json({
      error: "Wrong Auth",
      message: "User is not supplier",
    });
  }
  try {
    const powerplants = await PowerPlantService.list(req.userId);
    return res.status(200).json(powerplants);
  } catch (err: any) {
    return res.status(500).json({
      error: "Internal server error",
      message: err?.message,
    });
  }
};

export const get: RequestHandler = async (req: RequestWithUserId, res) => {
  if (!req.role || req.role !== "supplier" || !req.userId) {
    return res.status(401).json({
      error: "Wrong Auth",
      message: "User is not supplier",
    });
  }

  const { id } = req.params;
  if (!id) {
    return BadRequest.noRoute(res);
  }
  try {
    const powerplant = await PowerPlantService.get(id, req.userId);
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
};

export const update: RequestHandler = async (req: RequestWithUserId, res) => {
  if (!req.role || req.role !== "supplier" || !req.userId) {
    return res.status(401).json({
      error: "Wrong Auth",
      message: "User is not supplier",
    });
  }

  const { id } = req.params;
  const update = req.body;
  try {
    const updatedPowerPlant = await PowerPlantService.update(
      id,
      req.userId,
      update
    );
    if (!updatedPowerPlant) {
      return res.status(404).json({
        error: "Powerplant Not Found",
        message: "Power Plant doesn't exist",
      });
    }

    return res.status(200).json(updatedPowerPlant);
  } catch (err: any) {
    return res.status(404).json({
      error: "Powerplant Not Found",
      message: err?.message,
    });
  }
};

export const remove: RequestHandler = async (req: RequestWithUserId, res) => {
  if (!req.role || req.role !== "supplier" || !req.userId) {
    return res.status(401).json({
      error: "Wrong Auth",
      message: "User is not supplier",
    });
  }

  const { id } = req.params;
  try {
    const deletedPowerPlant = await PowerPlantService.remove(id, req.userId);
    if (!deletedPowerPlant) {
      return res.status(404).json({
        error: "Powerplant Not Found",
        message: "Power Plant doesn't exist",
      });
    }
    return res.status(204).send();
  } catch (err: any) {
    return res.status(404).json({
      error: "Powerplant Not Found",
      message: err?.message,
    });
  }
};
