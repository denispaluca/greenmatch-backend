import { PowerPlant } from "./powerplant";


export interface Offer extends Omit<PowerPlant, 'name'> {
  supplierName: string;
  supplierWebsite: string;
  powerplantId: string;
  powerplantName: string;
}