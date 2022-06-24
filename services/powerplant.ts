import PowerPlantModel from "../models/powerplant";
import { PowerPlantCreate, PowerPlantUpdate } from "../types/powerplant";

export const create = async (powerplant: PowerPlantCreate, supplierId: string) => {
  const { location, energyType, name } = powerplant;
  return (await PowerPlantModel.create({
    supplierId,
    location,
    energyType,
    name
  })).toObject()
}

export const list = (supplierId: string) => {
  return PowerPlantModel.find({
    supplierId
  }).lean();
}

export const get = (id: string, supplierId: string) => {
  return PowerPlantModel.findOne({ _id: id, supplierId }).lean();
}

export const update = async (id: string, supplierId: string, update: PowerPlantUpdate) => {
  const powerplant = await PowerPlantModel.findOneAndUpdate(
    { _id: id, supplierId },
    update,
    {
      new: true,
      omitUndefined: true
    }
  ).lean();

  return powerplant;
}

export const remove = (id: string, supplierId: string) => {
  return PowerPlantModel.findOneAndDelete({
    _id: id,
    supplierId
  });
}