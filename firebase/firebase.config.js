// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import {
//     REACT_APP_apiKey,
//     REACT_APP_authDomain,
//     REACT_APP_projectId,
//     REACT_APP_storageBucket,
//     REACT_APP_messagingSenderId,
//     REACT_APP_appId
// } from '@env'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyARNaRGQEwhcVgdpgMrZf6Qb_T0GsxkFus",
    authDomain: "toon-tab.firebaseapp.com",
    projectId: "toon-tab",
    storageBucket: "toon-tab.appspot.com",
    messagingSenderId: "854081646260",
    appId: "1:854081646260:web:855d8da73e1122cd9631e1"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;