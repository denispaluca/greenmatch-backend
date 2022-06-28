
export enum EnergyType {
  Wind = 'wind',
  Hydro = 'hydro',
  Solar = 'solar'
}

export interface PPADurations {
  five: boolean;
  ten: boolean;
  fifteen: boolean;
}

export interface PowerPlantCreate {
  name: string;
  energyType: EnergyType;
  location: string;
}

export interface PowerPlantUpdate {
  name?: string;
  live?: boolean;
  capacity?: number;
  durations?: PPADurations;
  price?: number;
}

export interface PowerPlant extends PowerPlantCreate, Required<PowerPlantUpdate> {
  supplierId: string;
  availableCapacity: number;
}