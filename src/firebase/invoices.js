import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore/lite'
import devData from '../devdata/data'
import { db, devEnv } from './_config'
import { getAll, updateOne } from './crud'

/**
 * This File Define functions specific to invoices
 */

/**
 * Retrieve invoices within a given date range
 * @param {string | Date} from start date
 * @param {string | Date} to end date
 * @returns {object[]} list of Invoices
 */

export const getDateRangedInvoices = async (from, to) => {
  if (!(from instanceof Date)) from = new Date(from)
  if (!(to instanceof Date)) to = new Date(to)

  if (devEnv) {
    return devData.filter(
      (sale) =>
        sale.invoiceDate.getTime() >= from.getTime() &&
        sale.invoiceDate.getTime() <= to.getTime()
    )
  }

  from.setHours(0, 0, 0, 0)
  to.setHours(23, 59, 59, 0)

  const q = query(
    collection(db, 'invoices'),
    where('invoiceDate', '>=', from),
    where('invoiceDate', '<=', to),
    orderBy('invoiceDate', 'desc')
  )
  const docsSnapshot = await getDocs(q)
  const invoices = []
  docsSnapshot.forEach((doc) =>
    invoices.push({
      ...doc.data(),
      id: doc.id,
    })
  )
  return invoices
}

/**
 * Retrieves all Invoices in this year
 * @returns {object[]}
 */
export const getThisYearInvoices = async () => {
  if (devEnv) return devData
  const year = new Date().getFullYear()
  const dayOne = `${year}-01-01`
  const lastDay = `${year}-12-31`
  return getDateRangedInvoices(dayOne, lastDay)
}

/**
 * Returns all Sales for todays date
 * @returns {object[]}
 */
export const getTodaysSales = async () => {
  const d = new Date().toLocaleString('default', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const params = d.split('/').reverse()
  const today = params.join('-')
  params[2] = parseInt(params[2]) + 1
  params[2] = params[2] > 9 ? params[2] : '0' + params[2]
  const tomorrow = params.join('-')
  return getDateRangedInvoices(today, tomorrow)
}

/**
 * @author MAHADI
 * @dateCreated 24/09/2023
 *
 * Retrieves an Invoice by Customer's phone number
 * @param {string} phone customer phone number
 * @returns {object}
 */
export const getInvoiceByPhone = async (phone) => {
  if (devEnv) {
    const invoices = await getAll('invoices')
    return invoices.find((i) => i.clientPhone === phone)
  }
  const q = query(collection(db, 'invoices'), where('clientPhone', '==', phone))
  const docsSnapshot = await getDocs(q)
  const invoices = []
  docsSnapshot.forEach((doc) =>
    invoices.push({
      ...doc.data(),
      id: doc.id,
    })
  )
  return invoices
}

/**
 * @author MAHADI
 * @dateCreated 01/10/2023
 *
 * Updates Invoices with null zakat years
 * (Invoices created in the interval between end of a year and creating a new year)
 *
 * @param {string} yearId
 */
export const updateNullYearInvoices = async (yearId) => {
  if (devEnv) {
    const invoices = await getAll('invoices')
    invoices.forEach((inv) => {
      if (inv.zakatYearID === 'null') inv.zakatYearID = yearId
    })
    return
  }
  const q = query(
    collection(db, 'invoices'),
    where('zakatYearID', '==', 'null')
  )
  const docsSnapshot = await getDocs(q)
  const updates = []
  docsSnapshot.forEach((doc) =>
    updates.push(updateOne('invoices', { id: doc.id, zakatYearID: yearId }))
  )
  await Promise.all(updates)
}
