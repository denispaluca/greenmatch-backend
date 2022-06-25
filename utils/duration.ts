import { PPADurations } from "../types/powerplant";

export const hasOneDuration = (durations?: PPADurations): boolean => {
  if (!durations) return false;

  return durations.five || durations.ten || durations.fifteen;
}