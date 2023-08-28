import devData, { users, products } from '../devdata/data'
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore/lite'
import { uid } from 'uid'
import { db, devEnv } from './_config'

/**
 * This file Defgines the crud operations for collections
 */

/**
 * Retrieve all documents from a collection
 * @param {"invoices" | "users" | "products" | "zakatyears"} colname
 * @returns
 */
export const getAll = async (colname) => {
  if (devEnv) {
    switch (colname) {
      case 'invoices':
        return devData
      case 'users':
        return users
      case 'products':
        return products
      case 'zakatyears':
        return []
      default:
        return []
    }
  }
  const docsRef = collection(db, colname)
  const docsSnapshot = await getDocs(docsRef)
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
 * Retrieve one document by its id from a colection
 * @param {"invoices" | "users" | "products" | "zakatyears"} colname
 * @param {string} id Id of the object to retrieve
 * @returns {object}
 */
export const getOne = async (colname, id) => {
  if (devEnv) {
    return devData.find((x) => x.id === id)
  }
  const docRef = doc(db, colname, id)
  const docSnapshot = await getDoc(docRef)
  return { ...docSnapshot?.data(), id: docSnapshot?.id }
}

/**
 * Creates a new Document in a given collection
 * @param {"invoices" | "users" | "products" | "zakatyears"} colname Name of the Collection
 * @param {object} data Data to create the document with
 * @returns
 */
export const createOne = async (colname, data) => {
  if (devEnv) {
    const newDoc = { ...data, id: uid() }
    return newDoc
  }
  const colRef = collection(db, colname)
  const newDocRef = await addDoc(colRef, data)
  const newDoc = await getDoc(newDocRef)
  return { ...newDoc.data(), id: newDoc.id }
}

/**
 * Updates a Document using its id in a given collection
 * @param {"invoices" | "users" | "products" | "zakatyears"} colname Name of the Collection
 * @param {object} docData Data to update the document with
 * @returns {object}
 */
export const updateOne = async (colname, docData) => {
  if (devEnv) {
    let data
    switch (colname) {
      case 'invoices':
        data = devData
        break
      case 'products':
        data = products
        break
      default:
        data = []
    }
    const index = data.findIndex((x) => x.id === docData.id)
    if (index > -1) {
      data[index] = { ...data[index], ...docData }
      return data[index]
    }
    return
  }
  const docRef = doc(db, colname, docData.id)
  await updateDoc(docRef, docData, { merge: true })
  const updated = await getDoc(docRef)
  return { id: updated.id, ...updated.data() }
}

/**
 * Deletes a Document in a given collection using its id
 * @param {"invoices" | "users" | "products" | "zakatyears"} colname Name of the Collection
 * @param {string} id ID of the document to delete
 * @returns
 */
export const deleteOne = async (colname, id) => {
  if (devEnv) {
    const index = devData.findIndex((x) => x.id === id)
    devData.splice(index, 1)
    return
  }
  const docRef = doc(db, colname, id)
  await deleteDoc(docRef)
}
