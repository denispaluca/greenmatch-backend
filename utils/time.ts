export const startOfNextMonth = (): Date => {
  const date = new Date();
  const a = new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 1))
  return a;
}

export const getEndDate = (duration: number): Date => {
  const date = new Date();
  return new Date(date.getFullYear() + duration, date.getMonth() + 1, 0);
};