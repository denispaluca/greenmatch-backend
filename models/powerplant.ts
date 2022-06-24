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
  live: Boolean,
  capacity: Number,
  availableCapacity: Number,
  durations: Array,
  price: Number
});

PowerPlantSchema.set("versionKey", false);

// Export the User model
const PowerPlantModel = mongoose.model("PowerPlant", PowerPlantSchema);

export default PowerPlantModel;