export const formatNumberWithCommas = (num, decimalPlaces = 2) => {
  if (num === null || num === undefined || num === "") return "0";

  const number = typeof num === "string" ? parseFloat(num) : num;

  if (isNaN(number)) return "0";

  return number.toLocaleString(undefined, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
};

export default formatNumberWithCommas;
