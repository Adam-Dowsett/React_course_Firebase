// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAayBY2ZbPsxrKUg0Y3O5vsEHvntw9V_U8",
  authDomain: "reactcoursefirebaseproject.firebaseapp.com",
  projectId: "reactcoursefirebaseproject",
  storageBucket: "reactcoursefirebaseproject.appspot.com",
  messagingSenderId: "404966308683",
  appId: "1:404966308683:web:f47bf1f848f7abb41746ce"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);