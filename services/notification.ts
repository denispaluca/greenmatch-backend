import NotificationModel from "../models/notification";

export const list = async (userId: string) => {
  const notifications = await NotificationModel.find({
    buyerId: userId,
    read: false,
  }).lean();
  return notifications;
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