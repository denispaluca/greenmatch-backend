import mongoose from 'mongoose';
import { PPA } from '../types/ppa';

// Define the PPA schema
const PPASchema = new mongoose.Schema<PPA>({
  supplierId: {
    type: String,
    required: true,
    index: true,
    immutable: true
  },
  buyerId: {
    type: String,
    required: true,
    index: true,
    immutable: true
  },
  powerplantId: {
    type: String,
    required: true,
    index: true,
    immutable: true
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    immutable: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
    immutable: true
  },
  startDate: {
    type: Date,
    required: true,
    immutable: true
  },
  duration: {
    type: Number,
    enum: [5, 10, 15],
    required: true,
    immutable: true
  },
  canceled: {
    type: Boolean,
    default: false
  },
  stripePriceId: {
    type: String,
    immutable: true
  },
  stripePaymentMethod: {
    type: String,
    immutable: true
  }
});

PPASchema.set("versionKey", false);

// Export the PPA model
const PPAModel = mongoose.model("PPA", PPASchema);

export default PPAModel;