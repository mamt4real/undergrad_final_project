/**
 * One Day in milliseconds
 */
export const oneDay = 1000 * 60 * 60 * 24

/**
 * One Month in milleseconds
 */
export const oneMonth = oneDay * 30

/**
 * Formats a Date to dd-MMM-YY
 * @param {any} dateObj
 * @returns
 */
export const toDdMmmYy = (dateObj) => {
  const date = cleanDate(dateObj)

  return date.toLocaleDateString('en-us', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

/**
 * Make sure a date variable is a date
 * @param {any} date
 * @returns {Date}
 */

export const cleanDate = (date) => {
  if (typeof date === Date) return date
  if (!(date instanceof Date)) {
    if (date?.hasOwnProperty('seconds'))
      date = new Date(date?.seconds * 1000 + date?.nanoseconds / 1000000)
    else date = new Date(date)
    if (date === 'Invalid Date') date = new Date()
  }
  return date
}

/**
 * Find the absolute Difference in days between two dates
 * @param {any} from start date
 * @param {any} to end date
 * @returns {number} difference in days
 */
export const dayDifference = (from, to) => {
  from = cleanDate(from)
  to = cleanDate(to)
  return Math.abs(Math.ceil((to.getTime() - from.getTime()) / oneDay))
}
