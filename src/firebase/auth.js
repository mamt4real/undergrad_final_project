import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth'
import { auth, db, devEnv } from './_config'
import { uid } from 'uid'
import { users } from '../devdata/data'
import { doc, getDoc, setDoc } from 'firebase/firestore/lite'
import { getOne } from './crud'

/**
 * This file defines all authentication functions in the firebase
 */

/**
 * Creates / Signsup A new User into the System
 * @param {string} email email of the new user
 * @param {string} password password for the new user
 * @param {string} name name of the new user
 * @param {"admin" | "user"} role role of the new user
 * @returns {Promise<[object, string]>}
 */
export const createUser = async (email, password, name, role = 'user') => {
  if (devEnv) {
    const newUser = {
      id: uid(),
      email,
      name,
      password,
      role,
    }
    users.push(newUser)
    return [newUser, 'User Created Successfully']
  }
  try {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    if (userCredentials) {
      const authUser = userCredentials.user
      await setDoc(doc(db, 'users', authUser.uid), {
        displayName: authUser.displayName,
        email: authUser.email,
        image: authUser.photoURL,
        phone: authUser.phoneNumber,
        name,
        role,
      })
      const user = await getOne('users', authUser.uid)
      return [user, 'User Created Successfully']
    } else {
      return [null, 'Something went wrong!']
    }
  } catch (err) {
    return [null, `${err.code}: ${err.message}`]
  }
}

/**
 * Login a user into the system
 * @param {string} email email of the user
 * @param {string} password password of the user
 * @returns {[object, string]} signed in user
 */

export const signIn = async (email, password) => {
  try {
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    // console.log(userCredentials)
    if (userCredentials) {
      const authUser = userCredentials.user
      // console.log(authUser.uid)
      const userSnapshot = await getDoc(doc(db, 'users', authUser.uid))
      // console.log(userSnapshot.data())

      return [
        {
          id: userSnapshot.id,
          ...userSnapshot.data(),
        },
        'Login Successfully',
      ]
    } else {
      return [null, 'Something went wrong!']
    }
  } catch (err) {
    console.log(err.message)
    return [null, err.code]
  }
}

/**
 * Logs the user out of the system
 */
export const logOut = async () => {
  await signOut(auth)
}

/**
 * Updates a user's password
 * @param {string} oldpass old passwsor of the user
 * @param {string} newPass new password of the user
 * @param {object} user current logged in user
 * @returns
 */
export const updateUserPassword = async (oldpass, newPass, user) => {
  if (devEnv) {
    const current = users.find((u) => u.id === user.id)
    if (current.password !== oldpass) return [null, 'Invalid Passsword']
    current.password = newPass
    return [current, 'Password Changed Successfully']
  }
  try {
    const current = auth.currentUser
    const creadential = EmailAuthProvider.credential(current.email, oldpass)
    const userCredential = await reauthenticateWithCredential(
      current,
      creadential
    )
    if (!userCredential) {
      return [null, 'Invalid Passwsord']
    }
    await updatePassword(current, newPass)
    return [current, 'Password changed successfully']
  } catch (error) {
    console.log(error)
    return [null, error.message?.split('auth/')[1].strip(')')]
  }
}

/**
 * A listenere for auth state change in the system
 */
export const userChanged = (fn) => onAuthStateChanged(auth, fn)
