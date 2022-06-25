import type { PipelineStage } from "mongoose";
import mongoose from "mongoose";
import PowerPlantModel from "../models/powerplant";
import UserModel from "../models/user";
import type { Offer, OfferQuery } from "../types/offer";
import { EnergyType, PowerPlantUpdate } from "../types/powerplant";

const lookupPipeline: PipelineStage[] = [
  {
    $lookup: {
      from: UserModel.collection.name,
      as: "fromSupplier",
      let: { "searchId": { $toObjectId: "$supplierId" } },
      pipeline: [
        { $match: { "$expr": [{ "_id": "$$searchId" }] } },
        { $project: { supplierName: '$username', supplierWebsite: '$website' } }
      ]
    }
  },
  {
    $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$fromSupplier", 0] }, "$$ROOT"] } }
  },
  { $project: { fromSupplier: 0 } }
]

export const list = async (query: OfferQuery) => {
  const { duration, energyTypes, availableCapacity, priceEnd, priceStart } = query;
  const matchExtra: any = {};

  if (energyTypes) {
    const orClauses = []
    if (energyTypes.wind) orClauses.push({ energyType: EnergyType.Wind });
    if (energyTypes.hydro) orClauses.push({ energyType: EnergyType.Hydro });
    if (energyTypes.solar) orClauses.push({ energyType: EnergyType.Solar });

    if (orClauses.length > 0) matchExtra.$or = orClauses;
  }

  if (availableCapacity) {
    matchExtra.availableCapacity = { $gte: availableCapacity }
  }

  const priceClause: any = {};
  if (priceStart) {
    priceClause.$gte = priceStart;
  }

  if (priceEnd) {
    priceClause.$lte = priceEnd;
  }

  if (Object.keys(priceClause).length !== 0) {
    matchExtra.price = priceClause;
  }

  switch (duration) {
    case 5:
      matchExtra["durations.five"] = true;
      break;
    case 10:
      matchExtra["durations.ten"] = true;
      break;
    case 15:
      matchExtra["durations.fifteen"] = true;
      break;
    default:
      break;
  }

  const offers: Offer[] = await PowerPlantModel.aggregate([
    {
      $match: {
        live: true,
        ...matchExtra
      }
    },
    ...lookupPipeline
  ]);

  return offers;
}

export const get = async (id: string) => {
  const offer: Offer[] = await PowerPlantModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
        live: true
      }
    },
    ...lookupPipeline
  ]);

  return offer[0];
}

export const buy = async (id: string, supplierId: string, update: PowerPlantUpdate) => {
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
