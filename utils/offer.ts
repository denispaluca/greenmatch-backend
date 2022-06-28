import { EnergyOptions, OfferQuery } from "../types/offer";
import { parseSingleDuration } from "./duration";
import { parseNum } from "./number";


const parseEnergy = (str?: any): EnergyOptions | undefined => {
  if (!str) return undefined;

  try {
    const parsed = JSON.parse(str);
    if (!parsed) return undefined;

    const energyOpts: EnergyOptions = {
      wind: parsed.wind || false,
      hydro: parsed.hydro || false,
      solar: parsed.solar || false
    };

    return energyOpts;
  } catch {
    return undefined;
  }
}


export const parseQuery = (query: qs.ParsedQs): OfferQuery => {
  const { duration, energyTypes, availableCapacity, priceEnd, priceStart } = query;
  const result: OfferQuery = {
    availableCapacity: parseNum(availableCapacity),
    priceEnd: parseNum(priceEnd),
    priceStart: parseNum(priceStart),
    duration: parseSingleDuration(duration),
    energyTypes: parseEnergy(energyTypes)
  };

  return result;
}