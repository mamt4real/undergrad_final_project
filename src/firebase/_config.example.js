import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore/lite'

import { getAuth } from 'firebase/auth'

/**
 * Firebase Configueration Details
 */
const firebaseConfig = {
  apiKey: 'sample_key',
  authDomain: 'sample_domain',
  projectId: 'project_name',
  storageBucket: 'bucket_address',
  messagingSenderId: 'messaging_id',
  appId: 'appplication_arn',
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)

/**
 * Firestore DB Object
 */
export const db = getFirestore(firebaseApp)

/**
 * Firebase Authentication Object
 */
export const auth = getAuth(firebaseApp)

/**
 * Determines if the app is at development environment
 *
 */
export const devEnv = true

/**
 * The Apikey for https://www.goldapi.io
 */
export const goldApiDotIoApiKey = 'goldapi-apikey'

export const XEApiID = 'xe_api_id'
export const XEApiKey = 'xe_api_key'
