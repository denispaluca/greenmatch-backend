import * as mongoose from 'mongoose';
import { Offer } from '../types/offer';

// Define the user schema
const OfferSchema = new mongoose.Schema<Offer>({
  supplierId: {
    type: String,
    required: true
  },
  supplierName: {
    type: String,
    required: true
  },
  powerplantId: {
    type: String,
    required: true
  },
  powerplantName: {
    type: String,
    required: true
  },
  energyType: {
    type: String,
    enum: ['wind', 'hydro', 'solar'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  live: {
    type: Boolean,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  availableCapacity: {
    type: Number,
    required: true
  },
  durations: {
    type: Array,
    required: true
  }
});

OfferSchema.set("versionKey", false);

// Export the User model
const OfferModel = mongoose.model("Offer", OfferSchema);

export default OfferModel;