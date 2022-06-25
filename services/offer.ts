import { PipelineStage } from "mongoose";
import PowerPlantModel from "../models/powerplant";
import UserModel from "../models/user";
import { Offer } from "../types/offer";
import { PowerPlantUpdate } from "../types/powerplant";
import mongoose from "mongoose";

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

export const list = (supplierId: string) => {

  return PowerPlantModel.find({
    supplierId
  }).lean();
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
