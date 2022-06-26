import PowerPlantModel from "../models/powerplant";
import PPAModel from "../models/ppa"
import { PPABuy, PPAQuery } from "../types/ppa"
import { startOfNextMonth } from "../utils/time";

const removeUndefined = (q: PPAQuery) => JSON.parse(JSON.stringify(q)) as PPAQuery;

export const list = (query: PPAQuery) => {
  return PPAModel.find(removeUndefined(query)).lean();
}

export const get = (id: string, query: PPAQuery) => {
  return PPAModel.findOne({
    _id: id,
    ...removeUndefined(query)
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
  5: { 'durations.five': true },
  10: { 'durations.ten': true },
  15: { 'durations.fifteen': true }
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
      $inc: { availableCapacity: -amount }
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

