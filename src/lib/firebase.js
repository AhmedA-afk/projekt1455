import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCTgM-PfYqE-Jr8MLp5oMKw4ZXEgBAVOhk",
    authDomain: "projekct1455.firebaseapp.com",
    projectId: "projekct1455",
    storageBucket: "projekct1455.firebasestorage.app",
    messagingSenderId: "640785496092",
    appId: "1:640785496092:web:8719a8b6f05ae25eaf07d9",
    measurementId: "G-CDDM8QJKNQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
