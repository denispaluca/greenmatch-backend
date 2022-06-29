import { EnergyType, PowerPlant } from "./powerplant";


export interface Offer extends PowerPlant {
  supplierName: string;
  supplierWebsite: string;
  supplierImageUrl: string;
}

export type SingleDuration = 5 | 10 | 15;

export type EnergyOptions = Record<EnergyType, boolean>;

export interface OfferQuery {
  duration?: SingleDuration;
  priceStart?: number;
  priceEnd?: number;
  energyTypes?: EnergyOptions;
  availableCapacity?: number;
}