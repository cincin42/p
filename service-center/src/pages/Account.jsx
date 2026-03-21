import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function Account() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (!user) return;

    const loadAppointments = async () => {
      const q = query(
        collection(db, "appointments"),
        where("userId", "==", user.uid)
      );

      const snap = await getDocs(q);
      setAppointments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    loadAppointments();
  }, [user]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Appointments</h2>

      {appointments.length === 0 && (
        <p>No appointments yet.</p>
      )}

      {appointments.map(a => (
        <div key={a.id} className="border p-3 mb-3 rounded">
          <p><strong>Service:</strong> {a.service}</p>
          <p><strong>Date:</strong> {a.date}</p>
          <p><strong>Time:</strong> {a.time}</p>
        </div>
      ))}
    </div>
  );
}
