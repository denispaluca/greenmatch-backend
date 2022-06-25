import { PowerPlant } from "./powerplant";


export interface Offer extends PowerPlant {
  supplierName: string;
  supplierWebsite: string;
}