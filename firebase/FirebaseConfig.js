// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMl818S0fblvZijsObs8N69wWGmPoYwOc",
  authDomain: "score-test-4e44a.firebaseapp.com",
  databaseURL: "https://score-test-4e44a-default-rtdb.firebaseio.com",
  projectId: "score-test-4e44a",
  storageBucket: "score-test-4e44a.firebasestorage.app",
  messagingSenderId: "697011093115",
  appId: "1:697011093115:web:193101ad11e9d355432cde"
};

// Editing this file with fast refresh will reinitialize the app on every refresh, let's not do that
const firebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);