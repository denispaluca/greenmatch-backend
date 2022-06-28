import { SingleDuration } from "../types/offer";
import { PPADurations } from "../types/powerplant";
import { parseNum } from "./number";

export const hasOneDuration = (durations?: PPADurations): boolean => {
  if (!durations) return false;

  return durations.five || durations.ten || durations.fifteen;
}

export const fromSingle = (duration?: SingleDuration): Partial<PPADurations> | null => {
  switch (duration) {
    case 5:
      return { five: true }
    case 10:
      return { ten: true }
    case 15:
      return { fifteen: true }
    default:
      return null;
  }
}

export const parseSingleDuration = (str?: any): SingleDuration | undefined => {
  const num = parseNum(str);
  if (!num || (num !== 5 && num !== 10 && num !== 15)) return undefined;

  return num;
}