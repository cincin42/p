import { useState, useEffect } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";


export default function AppointmentForm({ onSubmit, preselectedService }) {
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // ⭐ Set the service when preselectedService changes
  useEffect(() => {
    if (preselectedService) {
      setService(preselectedService);
    }
  }, [preselectedService]);

  // Temporary hard-coded services
  const services = [
    { id: 1, name: "Oil Change" },
    { id: 2, name: "Brake Inspection" },
    { id: 3, name: "Tire Rotation" },
  ];

  // All possible time slots
  const allTimeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
  ];

  const [availableTimes, setAvailableTimes] = useState(allTimeSlots);

  // ⭐ Availability logic — runs when date changes
  useEffect(() => {
  const loadAvailability = async () => {
    if (!date) return;

    const getAvailableTimes = httpsCallable(functions, "getAvailableTimes");
    const result = await getAvailableTimes({ date });

    const bookedTimes = result.data.bookedTimes;

    const openTimes = allTimeSlots.filter(
      (slot) => !bookedTimes.includes(slot)
    );

    setAvailableTimes(openTimes);
  };

  loadAvailability();

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [date]);


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
      className="max-w-md mx-auto p-6 rounded shadow"
    >
      <h2 className="text-2xl font-bold mb-4">Schedule Appointment</h2>

      {/* Service Selection */}
      <label className="block mb-2 font-semibold">Service</label>
      <select
        className="border p-2 w-full mb-4 bg-blue-600"
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
        className="border p-2 w-full mb-2 bg-blue-600"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      {/* Time Selection */}
      <label className="block mb- font-semibold">Time</label>
      <select
        className="border p-2 w-full mb-4 bg-blue-600"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
      >
        <option value="">Select a time</option>
        {availableTimes.map((slot) => (
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