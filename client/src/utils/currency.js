/**
 * Formats a number as Indian Rupee currency (INR, ₹).
 * Follows the Indian numbering system (e.g., ₹1,00,000.00).
 *
 * @param {number} amount - The amount in INR
 * @returns {string} Formatted INR currency string
 */
export const formatINR = (amount = 0) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount)
}

export const CURRENCY_SYMBOL = '₹'
export const CURRENCY_CODE = 'INR'
