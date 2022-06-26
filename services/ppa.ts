import PowerPlantModel from "../models/powerplant";
import PPAModel from "../models/ppa"
import { PPABuy, PPAQuery } from "../types/ppa"
import { startOfNextMonth } from "../utils/time";

export const list = ({ supplierId, buyerId, powerplantId }: PPAQuery) => {
  return PPAModel.find({
    supplierId,
    buyerId,
    powerplantId
  }).lean();
}

export const get = (id: string, { supplierId, buyerId }: PPAQuery) => {
  return PPAModel.findOne({
    _id: id,
    supplierId,
    buyerId
  }).lean();
}

export const cancel = (id: string, supplierId: string) => {
  return PPAModel.findOneAndUpdate(
    {
      _id: id,
      supplierId,
    },
    {
      canceled: true
    },
    {
      new: true
    }
  ).lean();
}

const durationMap = {
  5: { 'duration.five': true },
  10: { 'duration.ten': true },
  15: { 'duration.fifteen': true }
}
export const buy = async (buyerId: string, buyOrder: PPABuy) => {
  const { powerplantId, amount, duration } = buyOrder;


  const powerplant = await PowerPlantModel.findOneAndUpdate(
    {
      _id: powerplantId,
      live: true,
      availableCapacity: { $gte: amount },
      ...durationMap[duration]
    },
    {
      $inc: { availableCapacity: amount }
    },
    {
      new: true
    }
  ).lean();

  if (!powerplant) {
    throw Error('Could update the Power Plant');
  }

  const ppa = await PPAModel.create({
    buyerId,
    ...buyOrder,
    supplierId: powerplant.supplierId,
    price: powerplant.price,
    startDate: startOfNextMonth()
  });

  return ppa.toObject();
}

