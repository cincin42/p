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
import ChangePassword from "../pages/account/ChangePassword";


const sendVerification = async () => {
  try {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
      return { success : true}
    }
    return { success: false, 
      message: "No user is currently logged in. Please log in to send a verification email."
    }
  } catch (error) {
    if(error.code === "auth/too-many-requests") {
      return {
        success: false,
        message: "Too many requests. Please try again later."
      };
    }
    return {
      success: false,
      message: "Could not send verification email. Please try again later."
    }
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
      name,
      email,
  
            role: "user",
      createdAt: new Date(),
    });
    await sendEmailVerification(userCred.user);
  };

  // LOGIN
  const login = async (email, password, rememberMe) => {
  try {
    //Set persistence Before login
    await setPersistence(
      auth,
      rememberMe ? browserLocalPersistence : browserSessionPersistence
    );

    //Now perform the actual login
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Login Error:", error.code);

    if (
      error.code === "auth/user-not-found" ||
      error.code === "auth/invalid-credential"
    ) {
      return {
        success: false,
        reason: "no-user",
        message: "Email or password does not match our records."
      };
    }

    return {
      success: false,
      reason: "other",
      message: error.message
    };
  }
};

  // LOGOUT
  const logout = () => signOut(auth);

  // LISTEN FOR AUTH CHANGES + LOAD USER PROFILE
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await currentUser.reload(); // 🔥 force refresh from Firebase
      }
      setUser(auth.currentUser);
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