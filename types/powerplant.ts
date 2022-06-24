
export enum EnergyType {
  Wind = 'wind',
  Hydro = 'hydro',
  Solar = 'solar'
}

export type PPADuration = 5 | 10 | 15;

export interface PowerPlantCreate {
  name: string;
  energyType: EnergyType;
  location: string;
}

export interface PowerPlantUpdate {
  live?: boolean;
  capacity?: number;
  availableCapacity?: number;
  durations?: PPADuration[];
}

export interface PowerPlant extends PowerPlantCreate, PowerPlantUpdate {
  supplierId: string;
}