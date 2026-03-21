import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { googleProvider } from "../firebase";
import { sendEmailVerification } from "firebase/auth";

const sendVerification = async () => {
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser);
  }
};


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // loading state

  // REGISTER
  const register = async (name, email, password) => {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Create Firestore profile
    await setDoc(doc(db, "users", userCred.user.uid), {
      email,
      role: "user",
      createdAt: new Date(),
    });
    await sendEmailVerification(userCred.user);
  };

  // LOGIN
  const login = async (email, password, rememberMe) => {
    setLoading(true);

    await setPersistence(
      auth,
      rememberMe ? browserLocalPersistence : browserSessionPersistence
    );

    await signInWithEmailAndPassword(auth, email, password);
  };

  // LOGOUT
  const logout = () => signOut(auth);

  // LISTEN FOR AUTH CHANGES + LOAD USER PROFILE
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const ref = doc(db, "users", firebaseUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          ...snap.data(), // includes name + role
        });
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);
  const googleLogin = async () => {
  setLoading(true);

  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Check if Firestore profile exists
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    // Create profile for first‑time Google users
    await setDoc(ref, {
      name: user.displayName,
      email: user.email,
      role: "user", // default role
      createdAt: new Date(),
    });
  }

  setLoading(false);
};

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, googleLogin, logout, sendVerification }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}