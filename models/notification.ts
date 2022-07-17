import * as mongoose from 'mongoose';

interface Notification {
  supplierName: string;
  ppaId: string;
  buyerId: string;
  cancellationDate: Date;
  read: boolean;
}

// Define the user schema
const NotificationSchema = new mongoose.Schema<Notification>({
  supplierName: {
    type: String,
    required: true,
    immutable: true
  },
  ppaId: {
    type: String,
    required: true,
    immutable: true,
    unique: true
  },
  buyerId: {
    type: String,
    required: true,
    immutable: true
  },
  cancellationDate: {
    type: Date,
    required: true,
    immutable: true
  },
  read: {
    type: Boolean,
    default: false,
  }
});

NotificationSchema.set("versionKey", false);

// Export the User model
const NotificationModel = mongoose.model("User", NotificationSchema);

export default NotificationModel;
