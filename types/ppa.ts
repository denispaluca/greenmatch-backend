import { SingleDuration } from "./offer";

export interface PPAQuery {
  buyerId?: string;
  supplierId?: string;
  powerplantId?: string;
}

export interface PPABuy {
  powerplantId: string;
  duration: SingleDuration;
  amount: number;
  stripePaymentMethod: string;
}

/**
 * @typedef PPA - Power Purchase Agreement
 */
export interface PPA extends Required<PPAQuery>, PPABuy {
  price: number;
  startDate: Date;
  canceled: boolean;
  stripePriceId: string;
}