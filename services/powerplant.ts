import PowerPlantModel from "../models/powerplant";
import { PowerPlantCreate } from "../types/powerplant";

export const create = async (powerplant: PowerPlantCreate, supplierId: string) => {
  return (await PowerPlantModel.create({
    supplierId,
    location: powerplant.location,
    energyType: powerplant.energyType
  })).toObject()
}

export const list = (supplierId: string) => {
  return PowerPlantModel.find({
    supplierId
  }).lean();
}

export const get = (id: string, supplierId: string) => {
  return PowerPlantModel.findById(id).lean();
}