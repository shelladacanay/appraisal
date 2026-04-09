import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCDPUqXlqP4WElbgW2nHHijOlCSbmpKqFc",
  authDomain: "gso-appraisal.firebaseapp.com",
  projectId: "gso-appraisal",
  storageBucket: "gso-appraisal.firebasestorage.app",
  messagingSenderId: "84142656968",
  appId: "1:84142656968:web:9136ef9134c15d4f6b44fd"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
