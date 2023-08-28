import {
  collection,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from 'firebase/firestore/lite'
import { products } from '../devdata/data'
import { db, devEnv } from './_config'

/**
 * This file defines specific functions related to products collection
 */

/**
 * Check whether a product already exists in the system
 * @param {string} productName Name of the Product
 * @returns {boolean}
 */
export const productExists = async (productName) => {
  if (devEnv) {
    return products.find((e) => e.name === productName)
  }
  const q = query(collection(db, 'products'), where('name', '==', productName))
  const found = await getDocs(q)
  return found.size > 0
}

/**
 * Update quantities of products after an invoice is paid
 * @param {{itemName:string, qty:number}[]} items list of items bought
 */

export const updateProductQuantities = async (items) => {
  if (devEnv) {
    items.forEach((it) => {
      const e = products.find((e) => e.name === it.itemName)
      if (e) {
        e.quantity -= it.qty
      }
    })
    return
  }

  const updates = []
  items.forEach((item) => {
    const q = query(
      collection(db, 'products'),
      where('name', '==', item.itemName)
    )
    const update = { quantity: increment(-Number(item.qty)) }
    updates.push(updateDoc(q, update))
  })
  await Promise.all(updates)
}
