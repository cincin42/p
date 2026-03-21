import { useState } from "react";

export default function AppointmentForm({ onSubmit }) {
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // Temporary hard-coded services (replace with Firestore later)
  const services = [
    { id: 1, name: "Oil Change" },
    { id: 2, name: "Brake Inspection" },
    { id: 3, name: "Tire Rotation" },
  ];

  // Temporary time slots (replace with availability logic later)
  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const appointmentData = {
      service,
      date,
      time,
    };

    onSubmit(appointmentData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded shadow"
    >
      <h2 className="text-2xl font-bold mb-4">Schedule Appointment</h2>

      {/* Service Selection */}
      <label className="block mb-2 font-semibold">Service</label>
      <select
        className="border p-2 w-full mb-4"
        value={service}
        onChange={(e) => setService(e.target.value)}
        required
      >
        <option value="">Select a service</option>
        {services.map((s) => (
          <option key={s.id} value={s.name}>
            {s.name}
          </option>
        ))}
      </select>

      {/* Date Selection */}
      <label className="block mb-2 font-semibold">Date</label>
      <input
        type="date"
        className="border p-2 w-full mb-4"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      {/* Time Selection */}
      <label className="block mb-2 font-semibold">Time</label>
      <select
        className="border p-2 w-full mb-4"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
      >
        <option value="">Select a time</option>
        {timeSlots.map((slot) => (
          <option key={slot} value={slot}>
            {slot}
          </option>
        ))}
      </select>

      <button className="bg-blue-600 text-white p-2 w-full rounded">
        Book Appointment
      </button>
    </form>
  );
}