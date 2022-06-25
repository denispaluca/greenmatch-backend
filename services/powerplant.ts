import PowerPlantModel from "../models/powerplant";
import { PowerPlantCreate, PowerPlantUpdate } from "../types/powerplant";
import * as DurationUtils from "../utils/duration";

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
  const powerplant = await PowerPlantModel.findOne({ _id: id, supplierId });
  if (!powerplant) {
    throw new Error("Powerplant not found");
  }

  const { name, price, durations, capacity, live } = update;

  if (name) {
    powerplant.name = name;
  }

  if (price) {
    if (price < 0) {
      throw new Error("Price cannot be negative");
    }

    if (price === 0 && (live !== false || powerplant.live === true)) {
      throw new Error("Price cannot be zero if powerplant is online");
    }

    powerplant.price = price;
  }

  if (durations) {
    powerplant.durations = {
      five: durations.five || false,
      ten: durations.ten || false,
      fifteen: durations.fifteen || false
    }
  }

  if (capacity || capacity === 0) {
    const capacityDif = capacity - powerplant.capacity;
    if (powerplant.availableCapacity === 0 && capacityDif < 0) {
      throw new Error("Cannot reduce capacity when there is no available capacity");
    }

    powerplant.capacity = capacity;
    powerplant.availableCapacity = powerplant.availableCapacity + capacityDif;
  }

  if (live) {
    if (powerplant.price === 0) {
      throw new Error('Cannot bring powerplant online with price 0');
    }

    if (!DurationUtils.hasOneDuration(powerplant.durations)) {
      throw new Error('Cannot bring powerplant online with no available durations');
    }

    powerplant.live = live;
  }

  if (live === false) {
    powerplant.live = false;
  }

  return (await powerplant.save()).toObject();
}

export const remove = (id: string, supplierId: string) => {
  return PowerPlantModel.findOneAndDelete({
    _id: id,
    supplierId
  });
}