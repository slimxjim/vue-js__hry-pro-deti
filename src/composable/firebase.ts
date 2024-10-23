// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: 'AIzaSyDLQOFm-d1uuaYKN_ZH5F5oc2T1JIe2-0c',
  authDomain: 'vuejs-tom-hry.firebaseapp.com',
  projectId: 'vuejs-tom-hry',
  storageBucket: 'vuejs-tom-hry.appspot.com',
  messagingSenderId: '675601069632',
  appId: '1:675601069632:web:aceef8c38f0954a17ed1a5',
  measurementId: 'G-3MXXETX332'
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)