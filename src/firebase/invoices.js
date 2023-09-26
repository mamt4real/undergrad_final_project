import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore/lite'
import devData from '../devdata/data'
import { db, devEnv } from './_config'
import { getAll } from './crud'

/**
 * This File Define functions specicif to invoices
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
