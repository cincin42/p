import { useEffect, useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase"; // use your initialized functions export

export default function AppointmentForm({
  onSubmit,
  preselectedService = "",
  onServiceChange // <- parent should pass setService
}) {
  const [service, setService] = useState(preselectedService);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    setService(preselectedService);
  }, [preselectedService]);

  const handleServiceChange = (value) => {
    setService(value);
    if (typeof onServiceChange === "function") {
      onServiceChange(value);
    }
  };

  // Temporary hard-coded services
  const services = [
    { id: 1, name: "Diagnostics: CAT, Cummins, OBD2", duration: 90 },
    { id: 2, name: "Heavy/Medium Duty Trucks", duration: 180 },
    { id: 3, name: "Automobile Service", duration: 60 },
    { id: 4, name: "Farm Equipment Repair", duration: 120 },
    { id: 5, name: "Heavy Equipment Repair", duration: 240 },
    { id: 6, name: "Engine Repair, Rebuild,and Replacement", duration: 480 },
    { id: 7, name: "Emergency Roadside Assistance", duration: 120 },
    { id: 8, name: "Traffic Control", duration: 60 },
    { id: 9, name: "DOT Inspections", duration: 90 },
  ];

  const selectedService = services.find((s) => s.name === service);
  const duration = selectedService?.duration || 60;

  // All possible time slots
  const allTimeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"];
  const [availableTimes, setAvailableTimes] = useState(allTimeSlots);

  // Availability logic — runs when date changes
  useEffect(() => {
    const loadAvailability = async () => {
      if (!date) {
        setAvailableTimes(allTimeSlots);
        return;
      }

      try {
        const getAvailableTimes = httpsCallable(functions, "getAvailableTimes");
        const result = await getAvailableTimes({ date });
        const bookedTimes = Array.isArray(result?.data?.bookedTimes) ? result.data.bookedTimes : [];
        const openTimes = allTimeSlots.filter((slot) => !bookedTimes.includes(slot));
        setAvailableTimes(openTimes);
      } catch (error) {
        console.error("Error loading availability:", error);
        // fallback to all slots on error
        setAvailableTimes(allTimeSlots);
      }
    };

    loadAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ service, date, time });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Schedule Appointment</h2>

      {/* Service Selection */}
      <label className="block mb-2 font-semibold">
        Service
        <select
          className="border p-2 w-full mb-4 bg-blue-600"
          value={service}
          onChange={(e) => handleServiceChange(e.target.value)}
          required
        >
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </label>

      {/* Date Selection */}
      <label className="block mb-2 font-semibold">
        Date
        <input
          type="date"
          className="border p-2 w-full mb-4 bg-blue-600"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </label>

      {/* Time Selection */}
      <label className="block mb-2 font-semibold">
        Time
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
      </label>

      <button className="bg-blue-600 text-white p-2 w-full rounded">Book Appointment</button>
    </form>
  );
}