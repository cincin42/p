import { useNavigate } from "react-router-dom";
import AppointmentForm from "../components/AppointmentForm";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import { useAuth } from "../context/AuthContext";
import { httpsCallable } from "firebase/functions";

// ⭐ Import db and functions from your firebase.js file
import { db, functions } from "../firebase";

export default function Appointment() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAppointmentSubmit = async (data) => {
    if (!user) return alert("You must be logged in to book an appointment.");

    // 1. Save appointment to Firestore
    const docRef = await addDoc(collection(db, "appointments"), {
      userId: user.uid,
      service: data.service,
      date: data.date,
      time: data.time,
      createdAt: serverTimestamp(),
    });

    console.log("Appointment saved:", docRef.id);

    // 2. Call Mailgun email function
    const sendEmail = httpsCallable(functions, "sendAppointmentEmail");

    await sendEmail({
      email: user.email,
      name: user.displayName || "Customer",
      date: data.date,
      time: data.time,
    });

    // 3. Redirect to confirmation page
    navigate("/confirmation");
  };

  return (
    <div className="p-6">
      <AppointmentForm onSubmit={handleAppointmentSubmit} />
    </div>
  );
}