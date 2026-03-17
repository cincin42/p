import React, { useState } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const timeSlots = [
    "9:00", "9:30", "10:00", "10:30", "11:00", "11:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"
];

export default function AppointmentPage() {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [name , setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        if (!date || !time || !name || !email) {
            setMessage('Please fill in all fields');
            return;
        }
          try {
      setLoading(true);

      const q = query(
        collection(db, "appointments"),
        where("date", "==", date),
        where("time", "==", time)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setMessage("This time slot is already booked. Please choose another.");
        setLoading(false);
        return;
      }

      await addDoc(collection(db, "appointments"), {
        userName: name,
        email,
        date,
        time,
        status: "confirmed",
        createdAt: serverTimestamp(),
      });

      setMessage("Appointment booked! Check your email for confirmation.");
      setDate("");
      setTime("");
      setName("");
      setEmail("");
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <input
          type="date"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Time</label>
        <select
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        >
          <option value="">Select a time</option>
          {timeSlots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Booking..." : "Book Appointment"}
      </button>

      {message && (
        <p className="text-center text-sm mt-2">
          {message}
        </p>
      )}
    </form>
  );
}
