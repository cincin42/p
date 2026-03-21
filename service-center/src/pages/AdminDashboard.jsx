import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "appointments"));
      setAppointments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    load();
  }, []);


  useEffect(() => {
    const loadUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    loadUsers();
  }, []);

  const promote = async (id) => {
    await updateDoc(doc(db, "users", id), { role: "admin" });
    setUsers(users.map(u => u.id === id ? { ...u, role: "admin" } : u));
  };

  const demote = async (id) => {
    await updateDoc(doc(db, "users", id), { role: "user" });
    setUsers(users.map(u => u.id === id ? { ...u, role: "user" } : u));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2 flex gap-2">
                {u.role !== "admin" && (
                  <button
                    onClick={() => promote(u.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Promote
                  </button>
                )}
                {u.role === "admin" && (
                  <button
                    onClick={() => demote(u.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Demote
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      
      {/*Admin Appointment Management */}
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <h2 className="text-xl font-semibold mb-4">All Appointments</h2>

          {appointments.map(a => (
        <div key={a.id} className="border p-3 mb-3 rounded">
          <p><strong>User:</strong> {a.userId}</p>
          <p><strong>Service:</strong> {a.service}</p>
          <p><strong>Date:</strong> {a.date}</p>
          <p><strong>Time:</strong> {a.time}</p>
        </div>
        ))}
      </div>

    </div>
  );
}