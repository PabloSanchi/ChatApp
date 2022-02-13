import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCH22JP8c16Bsxi4C6jZSJDXZLVq7iG8Xg",
  authDomain: "whatsappclone-be7c5.firebaseapp.com",
  projectId: "whatsappclone-be7c5",
  storageBucket: "whatsappclone-be7c5.appspot.com",
  messagingSenderId: "172918426826",
  appId: "1:172918426826:web:14c577d3eec8981557b833"
};

getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore();
const auth = getAuth();
const provider = new GoogleAuthProvider();

export { db, auth, provider, signInWithPopup };