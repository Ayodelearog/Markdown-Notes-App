// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4kJ8CSK-3ewFt7SxxIawUxclYwAQJFB0",
  authDomain: "react-notes-54b45.firebaseapp.com",
  projectId: "react-notes-54b45",
  storageBucket: "react-notes-54b45.appspot.com",
  messagingSenderId: "72714153834",
  appId: "1:72714153834:web:d73b01f4ef134d77a5bf13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export  const notesCollection = collection(db, 'notes')
