import * as mongoose from 'mongoose';
import { PowerPlant } from '../types/powerplant';

// Define the user schema
const PowerPlantSchema = new mongoose.Schema<PowerPlant>({
  supplierId: {
    type: String,
    required: true
  },
  energyType: {
    type: String,
    enum: ['wind', 'hydro', 'solar']
  },
  location: {
    type: String,
    required: true
  },
  live: Boolean,
  capacity: Number,
  availableCapacity: Number,
  durations: Array
});

PowerPlantSchema.set("versionKey", false);

// Export the User model
const PowerPlantModel = mongoose.model("User", PowerPlantSchema);

export default PowerPlantModel;