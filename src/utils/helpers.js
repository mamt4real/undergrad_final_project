// import { cleanDate } from "./dateFunctions"
import { XEApiID, XEApiKey, devEnv } from '../firebase/_config'
import { ZakatYear } from '../models'
import { cleanDate } from './dateFunctions'
import axios from 'axios'

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

/**
 * Gets The Year Range of a Zakat Year in the form
 * mm/yyyy - mm/yyyy
 * @param {ZakatYear} year
 * @returns {string} Year Range
 */
export const getYearRange = (year) => {
  if (!year) return ''
  const start = cleanDate(year.beginDate)
  const stop = cleanDate(year.endDate)
  return `${toNDigits(
    start.getMonth() + 1,
    2
  )}/${start.getFullYear()} - ${toNDigits(
    stop.getMonth() + 1,
    2
  )}/${stop.getFullYear()}`
}

/**
 * Converts Usd To Naira Using the XE api
 * @param {number} usd the amount of usd
 * @returns {Promise<number>} equivalent of usd in naira
 */
export const convertUsdToNaira = async (usd) => {
  if (devEnv) {
    return usd * 875
  }
  const url = `https://xecdapi.xe.com/v1/convert_from.csv/?from=USD&to=NGN&amount=${usd}`
  const response = await axios({
    url,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    auth: {
      username: XEApiID,
      password: XEApiKey,
    },
  })
  return Number(response.data.split(',').slice(-1)[0])
}
