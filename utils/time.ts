export const startOfNextMonth = (): Date => {
  const date = new Date();

  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

export const getEndDate = (duration: number): Date => {
  const date = new Date();
  return new Date(date.getFullYear() + duration, date.getMonth() + 1, 0);
};