import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function CompleteService() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);

  const [mechanic, setMechanic] = useState("");
  const [description, setDescription] = useState("");
  const [laborCost, setLaborCost] = useState(0);
  const [tax, setTax] = useState(0);

  const [parts, setParts] = useState([
    { name: "", cost: 0 }
  ]);

  // Load appointment
  useEffect(() => {
    const load = async () => {
      const ref = doc(db, "appointments", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setAppointment(snap.data());
      }

      setLoading(false);
    };

    load();
  }, [id]);

  const addPart = () => {
    setParts([...parts, { name: "", cost: 0 }]);
  };

  const updatePart = (index, field, value) => {
    const updated = [...parts];
    updated[index][field] = value;
    setParts(updated);
  };

  const removePart = (index) => {
    setParts(parts.filter((_, i) => i !== index));
  };

  const calculatePartsTotal = () =>
    parts.reduce((sum, p) => sum + Number(p.cost || 0), 0);

  const calculateTotal = () =>
    Number(laborCost) + calculatePartsTotal() + Number(tax);

  const handleSave = async () => {
    const ref = doc(db, "appointments", id);

    await updateDoc(ref, {
      mechanic,
      description,
      laborCost: Number(laborCost),
      tax: Number(tax),
      parts,
      totalCost: calculateTotal()
    });

    alert("Service completed and saved.");
    navigate("/admin");
  };

  if (loading) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Complete Service</h1>

      <div className="bg-gray-900 p-6 rounded-lg shadow-md space-y-4">

        <p><strong>Service:</strong> {appointment.service}</p>
        <p><strong>Date:</strong> {appointment.date}</p>
        <p><strong>Time:</strong> {appointment.time}</p>

        {/* Mechanic */}
        <label className="block">
          Mechanic Assigned
          <input
            className="w-full p-2 mt-1 bg-gray-800 rounded"
            value={mechanic}
            onChange={(e) => setMechanic(e.target.value)}
          />
        </label>

        {/* Description */}
        <label className="block">
          Work Description
          <textarea
            className="w-full p-2 mt-1 bg-gray-800 rounded"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        {/* Parts */}
        <div>
          <h3 className="font-semibold mb-2">Parts Used</h3>

          {parts.map((part, index) => (
            <div key={index} className="flex gap-4 mb-2">
              <input
                placeholder="Part name"
                className="flex-1 p-2 bg-gray-800 rounded"
                value={part.name}
                onChange={(e) => updatePart(index, "name", e.target.value)}
              />

              <input
                placeholder="Cost"
                type="number"
                className="w-32 p-2 bg-gray-800 rounded"
                value={part.cost}
                onChange={(e) => updatePart(index, "cost", e.target.value)}
              />

              <button
                onClick={() => removePart(index)}
                className="text-red-400"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            onClick={addPart}
            className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500 mt-2"
          >
            Add Part
          </button>
        </div>

        {/* Costs */}
        <label className="block">
          Labor Cost
          <input
            type="number"
            className="w-full p-2 mt-1 bg-gray-800 rounded"
            value={laborCost}
            onChange={(e) => setLaborCost(e.target.value)}
          />
        </label>

        <label className="block">
          Tax
          <input
            type="number"
            className="w-full p-2 mt-1 bg-gray-800 rounded"
            value={tax}
            onChange={(e) => setTax(e.target.value)}
          />
        </label>

        <p className="text-lg font-bold mt-4">
          Total Cost: ${calculateTotal().toFixed(2)}
        </p>

        <button
          onClick={handleSave}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-500 w-full mt-4"
        >
          Save Completed Service
        </button>
      </div>
    </div>
  );
}