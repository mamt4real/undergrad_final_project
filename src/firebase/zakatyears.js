import { collection, getDocs, query, where } from 'firebase/firestore/lite'
import { db, devEnv } from './_config'
import { getAll } from './crud'

/**
 * Get The Active Zakata Year
 * @returns
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
