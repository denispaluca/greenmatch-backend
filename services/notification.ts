import UserModel from "../models/user";
import NotificationModel from "../models/notification";
import type { PPA } from "../types/ppa";
import { Types } from "mongoose";
import { emitNotification } from "./socket";

export const list = async (userId: string) => {
  const notifications = await NotificationModel.find({
    buyerId: userId,
    read: false,
  }).lean();
  return notifications;
}

export const create = async (ppa: PPA & { _id: Types.ObjectId; }) => {
  const supplier = await UserModel.findOne({ _id: ppa.supplierId, role: "supplier" }).lean();
  if (!supplier) {
    throw new Error("Supplier not found");
  }

  const notification = await NotificationModel.create({
    buyerId: ppa.buyerId,
    supplierName: supplier.company.name,
    ppaId: ppa._id.toString(),
    cancellationDate: new Date(),
  });

  const notificationObject = notification.toObject();
  emitNotification(ppa.buyerId, notificationObject);
  return notificationObject;
}

export const read = async (userId: string, notificationId: string) => {
  const notification = await NotificationModel.findOneAndUpdate(
    {
      _id: notificationId,
      buyerId: userId,
    },
    {
      read: true,
    },
    {
      new: true,
    }
  ).lean();
  return notification;
}