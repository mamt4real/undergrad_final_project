// import { cleanDate } from "./dateFunctions"

/**
 * @author MAHADI
 * @dateCreated 26/09/2023
 *
 * @description Converts a number to certain digits Left padded with Zero
 *
 * @param {number} value The number to convert
 * @param {number} digits Number of Digits to convert it to
 * @returns {string} value in digits length
 */
export const toNDigits = (value, digits) => {
  return String(value).padStart(digits, '0')
}
