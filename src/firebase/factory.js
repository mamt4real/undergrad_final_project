import Invoices from '../devdata/data'
import { cleanDate } from '../utils/dateFunctions'

/**
 * gets the monthname of a date
 * @param {Date} dt
 * @returns {String} short month name 0f dt
 */
const month = (dt) => {
  if (!(dt instanceof Date)) {
    dt = new Date(dt)
    if (dt === 'Invalid Date') dt = new Date()
  }
  return dt.toLocaleString('default', { month: 'short' })
}

const sortedMonths = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

/**
 * Groups an Array of Objects by a value
 * @param {[Object]} data The data Array
 * @param {(obj)=>String} key The function to group elements by it
 * Accepts an object and returned its group
 * @returns {Object} map with keys as groups and values as Array of group members
 */
const groupBy = (data, key) => {
  const grouped = {}
  for (let sale of data) {
    const m = key(sale)
    if (grouped.hasOwnProperty(m)) grouped[m].push(sale)
    else grouped[m] = [sale]
  }
  return grouped
}

/**
 * unwind Invoices by there itemList
 * @param {(typeof Invoices)} invoices List of invoices
 * @returns {[Object]} list of unwind invoice
 */
export const transformInvoices = (invoices) => {
  const transformed = []

  invoices.forEach((inv) => {
    inv.invoiceItemList.forEach((item, i) => {
      transformed.push({
        id: inv.id + i,
        userID: inv.userID,
        zakatYearID: inv.zakatYearID,
        date: cleanDate(inv.invoiceDate),
        ...item,
      })
    })
  })
  return transformed
}

export const userSales = (transformed) => {}

/**
 * Returns sales grouped by months
 * @param {Array} transformed
 */
export const monthlySales = (transformed) => {
  const monthlyGroups = groupBy(transformed, (obj) => month(obj.date))

  const temp = []
  for (const month of sortedMonths) {
    const val = monthlyGroups.hasOwnProperty(month) ? monthlyGroups[month] : []
    temp.push({
      name: month,
      amt:
        Math.round(
          val.reduce((subtotal, sale) => subtotal + sale.total, 0) * 100
        ) / 100,
    })
  }
  return temp
}

export const engineCount = (transformed) => {
  const engineGroups = groupBy(transformed, (obj) => obj.itemName)
  const temp = []
  for (const [key, val] of Object.entries(engineGroups)) {
    temp.push({
      name: key,
      value: val.reduce((subquan, sale) => subquan + parseInt(sale.qty), 0),
      amt: val.reduce((subtotal, sale) => subtotal + sale.total, 0),
    })
  }
  return temp
}

export const salesByUser = (transformed, users) => {
  const userGroups = groupBy(transformed, (obj) => obj.userID)
  const temp = []
  for (const [key, val] of Object.entries(userGroups)) {
    temp.push({
      userID: key,
      amt: val.reduce((subtotal, sale) => subtotal + sale.total, 0),
      name: users?.find((u) => u.id === key)?.name,
    })
  }
  return temp
}
