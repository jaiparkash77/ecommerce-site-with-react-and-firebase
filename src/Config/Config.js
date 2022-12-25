// import firebase from 'firebase'
// import 'firebase/auth'
// import 'firebase/firestore'
// import 'firebase/storage'

// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyBTuAJzJ-fd6SSg-R39JecEfGa1TjM0SIw",
//     authDomain: "ecommerce-app-with-react-16dff.firebaseapp.com",
//     projectId: "ecommerce-app-with-react-16dff",
//     storageBucket: "ecommerce-app-with-react-16dff.appspot.com",
//     messagingSenderId: "799760077550",
//     appId: "1:799760077550:web:8fdcfc97707ded1b7b59ff",
//     measurementId: "G-79T84PQHWF"
//   };

// firebase.initializeApp(firebaseConfig);

// const auth = firebase.auth();
// const fs = firebase.firestore();
// const storage = firebase.storage();

// export {auth,fs,storage}

import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBTuAJzJ-fd6SSg-R39JecEfGa1TjM0SIw",
  authDomain: "ecommerce-app-with-react-16dff.firebaseapp.com",
  projectId: "ecommerce-app-with-react-16dff",
  storageBucket: "ecommerce-app-with-react-16dff.appspot.com",
  messagingSenderId: "799760077550",
  appId: "1:799760077550:web:8fdcfc97707ded1b7b59ff",
  measurementId: "G-79T84PQHWF"
};

// Initialize Firebase with a default Firebase project
initializeApp(firebaseConfig);


// Use the shorthand notation to access the default project's Firebase services
const auth = getAuth();
const storage = getStorage();
const fs = getFirestore();

export {auth,fs,storage}

// https://firebase.google.com/docs/web/learn-more#available-libraries