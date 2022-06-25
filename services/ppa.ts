import PowerPlantModel from "../models/powerplant";
import PPAModel from "../models/ppa"
import { PPABuy, PPAQuery } from "../types/ppa"

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
export const buy = async (buyerId: string, buyOrder: PPABuy) => {
  const { powerplantId, amount } = buyOrder;
  const powerplant = await PowerPlantModel.findOneAndUpdate(
    {
      _id: powerplantId,
      live: true,
      availableCapacity: { $gte: amount }
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

