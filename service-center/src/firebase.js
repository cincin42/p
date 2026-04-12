
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyDBmpkVo07_cozQ7LSEvptemZawDwXovoI",
  authDomain: "cdservicecenter23.firebaseapp.com",
  projectId: "cdservicecenter23",
  storageBucket: "cdservicecenter23.firebasestorage.app",
  messagingSenderId: "196475482541",
  appId: "1:196475482541:web:c312046e469e08caf3b124"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// ⭐ Add this
export const functions = getFunctions(app, "us-central1");

export { app }