// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAr9LdOX2kuu-e4J5Vjas6a8ZN-PjYYtjI",
  authDomain: "inventory-managment-fd630.firebaseapp.com",
  projectId: "inventory-managment-fd630",
  storageBucket: "inventory-managment-fd630.appspot.com",
  messagingSenderId: "1040411765212",
  appId: "1:1040411765212:web:28b39630fae71bf498c719",
  measurementId: "G-YTV4LR2FW4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
