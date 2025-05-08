/**
 * Return ellipsis of a given string
 * @param {string} text
 * @param {number} size
 */
const ellipsis = (text, size) => {
  return `${text.split(' ').slice(0, size).join(' ')}...`;
};

function capitalize(s)
{
    return String(s?.[0])?.toUpperCase() + String(s)?.slice(1);
}

/**
 * Formats a number with comma separators for thousands
 * @param {number|string} num - The number to format
 * @param {number} [decimalPlaces=2] - Number of decimal places to show
 * @returns {string} Formatted number string with commas
 */
export const formatNumberWithCommas = (num, decimalPlaces = 2) => {
  if (num === null || num === undefined || num === '') return '0';
  
  const number = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(number)) return '0';
  
  return number.toLocaleString(undefined, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  });
};

export default formatNumberWithCommas;
export { ellipsis, capitalize };
