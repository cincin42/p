// src/pages/account/PersonalInfo.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import PersonalInfoForm from "../../components/PersonalInfoForm";

// Import validation helpers from the shared module
import {
  normalizePhone,
  normalizeState,
  isValidEmail,
  isValidPhone,
  isValidZip,
  isValidState,
} from "../../lib/validation";

export default function PersonalInfo() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadProfile = async () => {
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (!cancelled) {
          if (snap.exists()) setProfile(snap.data());
          else setProfile(null);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        if (!cancelled) setLoadError(err?.message || String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  // onSave receives normalized payload from the form; re-validate here before writing
  const handleSave = async (payload) => {
    if (!user?.uid) throw new Error("Not authenticated");

    // Normalize
    const phoneDigits = normalizePhone(payload.phone);
    const stateUpper = normalizeState(payload.state);

    // Server-side validation (throw structured errors so the form can map them)
    if (!isValidEmail(payload.email)) throw { field: "email", message: "Invalid email." };
    if (!isValidPhone(phoneDigits)) throw { field: "phone", message: "Phone must be 10 digits." };
    if (!isValidZip(payload.zip)) throw { field: "zip", message: "ZIP must be 5 digits." };
    if (!isValidState(stateUpper)) throw { field: "state", message: "Invalid state." };

    const toSave = { ...payload, phone: phoneDigits, state: stateUpper };

    // Persist
    const ref = doc(db, "users", user.uid);
    await updateDoc(ref, toSave);

    // Update local UI state
    setProfile((p) => ({ ...p, ...toSave }));
  };

  if (loading) return <p className="text-white p-6">Loading...</p>;

  if (loadError) {
    return (
      <div className="p-6 text-red-300">
        <h2 className="text-lg font-semibold">Error loading profile</h2>
        <pre className="whitespace-pre-wrap">{loadError}</pre>
        <p>Check the browser console and server logs for the full stack trace.</p>
      </div>
    );
  }

  if (!profile) return <p className="text-white p-6">No profile found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Personal Information</h1>
      <PersonalInfoForm initialProfile={profile} onSave={handleSave} />
    </div>
  );
}