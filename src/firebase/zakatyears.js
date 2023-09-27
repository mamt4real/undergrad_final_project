import { collection, getDocs, query, where } from 'firebase/firestore/lite'
import { db, devEnv, goldApiDotIoApiKey } from './_config'
import { getAll } from './crud'
import { ZakatYear, Invoice } from '../models'
import { getCurrentAssetsValue } from './products'
import axios from 'axios'
import { convertNairaToUsd, convertUsdToNaira } from '../utils/helpers'

/**
 * Get The Active Zakata Year
 * @returns {ZakatYear}
 */
export const getActiveYear = async () => {
  if (devEnv) {
    const invoices = await getAll('zakatyears')
    return invoices.find((i) => i.status === 'active')
  }
  const q = query(collection(db, 'invoices'), where('status', '==', 'active'))
  const docsSnapshot = await getDocs(q)
  const years = []
  docsSnapshot.forEach((doc) =>
    years.push({
      ...doc.data(),
      id: doc.id,
    })
  )
  return years.length ? years[0] : null
}

/**
 * Retrieve All invoices in particular zaka
 * @param {string} id zakat year id
 * @returns {Promise<Invoice[]>}
 */
export const getZakatYearsInvoices = async (id) => {
  let invoices = []

  if (devEnv) {
    invoices = (await getAll('invoices')).filter(
      (inv) => inv.zakatYearID === id && !inv.invoiceDraft
    )
  } else {
    const q = query(collection(db, 'invoices'), where('zakatYearID', '==', id))
    const docsSnapshot = await getDocs(q)
    docsSnapshot.forEach((doc) =>
      invoices.push({
        ...doc.data(),
        id: doc.id,
      })
    )
  }

  return invoices
}

/**
 * Gets the Total Sales falling within the specified Year
 * @param {string} id
 * @returns {Promise<number>} Total Sales within the Year
 */
export const getZakatYearsSales = async (id) => {
  const invoices = await getZakatYearsInvoices(id)
  const sale = invoices.reduce(
    (subtotal, inv) => subtotal + inv.invoiceTotal,
    0
  )
  return sale
}

/**
 * Give an Estimate of amount Due for a given Zakat Year
 * @param {ZakatYear} year The Year to calculate for
 * @returns {Promise<number>} Estimated Amount
 */
export const getEstimatedAmountDue = async (year) => {
  let sales = await getZakatYearsSales(year.id)

  // Estimated 25% of Sales lost due to miscalleneous
  sales *= 0.75

  // Remove Opening Balance of The Year
  sales -= year.openingBalance

  // Add The Current Value of assets in stock
  sales += await getCurrentAssetsValue()

  // Calculate Legal (1/40)
  const due = Math.ceil(sales * (1 / 40))

  return due
}

/**
 * Returns The Current Nisaab in Naira
 * @returns {Promise<number>}
 */
export const getCurrentNisaabRate = async () => {
  if (devEnv) {
    const rand = Math.random() * 100_000
    const det = Math.random()
    return 4_000_000 + rand * (det < 0.5 ? -1 : 1)
  }
  const response = await axios({
    url: 'https://www.goldapi.io/api/XAU/USD',
    method: 'get',

    headers: {
      'x-access-token': goldApiDotIoApiKey,
      'Content-Type': 'application/json',
    },
  })
  // Get Price In Ounce
  const oneOunceUsdPrice = response.data.price

  // Nisaab of Gold is 2.73295 ounces
  const nisaabInUsd = 2.73295 * oneOunceUsdPrice
  const nisaabInNaira = await convertUsdToNaira(nisaabInUsd)

  return nisaabInNaira
}
