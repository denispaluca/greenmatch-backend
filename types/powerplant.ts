
export enum EnergyType {
  Wind = 'wind',
  Hydro = 'hydro',
  Solar = 'solar'
}

export type PPADuration = 5 | 10 | 15;

export interface PowerPlantCreation {
  energyType: EnergyType;
  location: string;
}

export interface PowerPlant extends PowerPlantCreation {
  supplierId: string;
  live?: boolean;
  capacity?: number;
  availableCapacity?: number;
  durations?: PPADuration[];
}