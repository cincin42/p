

import React from "react";
import AppointmentPage from "./components/AppointmentPage";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Schedule an Appointment
        </h1>
        <AppointmentPage />
      </div>
    </div>
  );
}

export default App;
