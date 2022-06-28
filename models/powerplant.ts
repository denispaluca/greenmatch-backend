import * as mongoose from 'mongoose';
import { PowerPlant } from '../types/powerplant';

// Define the user schema
const PowerPlantSchema = new mongoose.Schema<PowerPlant>({
  name: {
    type: String,
    required: true
  },
  supplierId: {
    type: String,
    required: true,
    immutable: true
  },
  energyType: {
    type: String,
    enum: ['wind', 'hydro', 'solar'],
    required: true,
    immutable: true
  },
  location: {
    type: String,
    required: true,
    immutable: true
  },
  capacity: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  availableCapacity: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  durations: {
    type: {
      five: Boolean,
      ten: Boolean,
      fifteen: Boolean
    },
    required: true,
    default: {
      five: false,
      ten: false,
      fifteen: false
    }
  },
  price: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  live: {
    type: Boolean,
    default: false
  },
});

PowerPlantSchema.set("versionKey", false);

// Export the User model
const PowerPlantModel = mongoose.model("PowerPlant", PowerPlantSchema);

export default PowerPlantModel;