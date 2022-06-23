import PowerPlantModel from "../models/powerplant";
import { PowerPlant, PowerPlantCreation } from "../types/powerplant";

export const create = (powerplant: PowerPlantCreation, supplierId: string) => {
  return PowerPlantModel.create({
    supplierId,
    location: powerplant.location,
    energyType: powerplant.energyType
  })
}

export const list = () => {
  return PowerPlantModel.find({});
}

export const get = (id: string) => {
  return PowerPlantModel.findById(id);
}