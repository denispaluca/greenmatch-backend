export const parseNum = (str?: any) => {
  if (!str) return undefined;
  const num = Number(str);

  if (isNaN(num)) return undefined;

  return num;
}