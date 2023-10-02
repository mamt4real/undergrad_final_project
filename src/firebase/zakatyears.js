import { collection, getDocs, query, where } from 'firebase/firestore/lite'
import { db, devEnv, goldApiDotIoApiKey } from './_config'
import { createOne, getAll, updateOne } from './crud'
import { ZakatYear, Invoice } from '../models'
import { getCurrentAssetsValue } from './products'
import axios from 'axios'
import { convertUsdToNaira } from '../utils/helpers'
import { cleanDate, oneDay, oneMonth } from '../utils/dateFunctions'
import { updateNullYearInvoices } from './invoices'

/**
 * @author MAHADI
 * @dateCreated 28/09/2023
 *
 * Get The Active Zakata Year
 * @returns {Promise<ZakatYear>}
 */
export const getActiveYear = async () => {
  if (devEnv) {
    const invoices = await getAll('zakatyears')
    return invoices.find((i) => i.status === 'active')
  }
  const q = query(collection(db, 'zakatyears'), where('status', '==', 'active'))
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
 * @author MAHADI
 * @dateCreated 28/09/2023
 *
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
 * @author MAHADI
 * @dateCreated 28/09/2023
 *
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
 * @author MAHADI
 * @dateCreated 28/09/2023
 *
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

/**
 * @author MAHADI
 * @dateCreated 01/01/2023
 *
 * Terminates a Year and Initialize a new One
 * @param {ZakatYear} year The active Year to terminate
 * @param {number} netAssets Net Assets for the Year
 *
 * @returns {Pomise<ZakatYear>} new ZakatYear
 */
export const terminateZakatYear = async (year, netAssets) => {
  const currentNisaab = await getCurrentNisaabRate()
  const amountDue = (1 / 40) * netAssets

  let updateData = {
    id: year.id,
    closingBalance: netAssets,
    closingNisab: currentNisaab,
    status: 'inactive',
  }
  if (currentNisaab <= netAssets)
    updateData = { ...updateData, amountDue, paymentStatus: 'not-paid' }
  else
    updateData = {
      ...updateData,
      paymentStatus: 'not-applicable',
      amountDue: 0,
    }
  // Next Year will start from end of this year with two days head start
  const beginDate = new Date(cleanDate(year.endDate).getTime() + 2 * oneDay)
  const endDate = new Date(beginDate.getTime() + 12 * oneMonth)
  const newYear = {
    // Next Year would start with the netAsset after deducting the due amount
    openingBalance: netAssets - amountDue,
    nisab: currentNisaab,
    beginDate,
    endDate,
    status: 'active',
    paymentStatus: 'not-paid',
  }

  await updateOne('zakatyears', updateData)
  const data = await createOne('zakatyears', newYear)
  // Update all invoices created in the range before this call to point to this year
  await updateNullYearInvoices(data.id)
  return data
}

/**
 * Mark Year amount status as paid
 * @param {string} yearId id of the year
 * @returns {Promise<ZakatYear>}
 */
export const markYearAsPaid = async (yearId) => {
  return updateOne('zakatyears', {
    id: yearId,
    paymentStatus: 'paid',
    datePaid: new Date(),
  })
}

/**
 * Initialize an Active Year at the initial deployment of the application
 * @returns {Promise<ZakatYear>}
 */
export const initializeActiveYear = async () => {
  return createOne('zakatyears', {
    openingBalance: await getCurrentAssetsValue(),
    nisab: await getCurrentNisaabRate(),
    beginDate: new Date(),
    endDate: new Date(Date.now() + 12 * oneMonth),
    status: 'active',
    paymentStatus: 'not-paid',
  })
}
