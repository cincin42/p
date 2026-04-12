import { useNavigate, useLocation } from "react-router-dom";
import AppointmentForm from "../components/AppointmentForm";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import { useAuth } from "../context/AuthContext";
import { httpsCallable } from "firebase/functions";

// ⭐ Import db and functions from firebase.js (already region-bound)
import { db, functions } from "../firebase";

export default function Appointment() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Read ?service= from URL
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const preselectedService = params.get("service") || "";

  //Keep stateful so parent & form can update the selected service
  const [service, setService] = useState(preselectedService);

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
      <AppointmentForm
        onSubmit={handleAppointmentSubmit}
        preselectedService={service}
        onServiceChange={setService}
      />
    </div>
  );
}