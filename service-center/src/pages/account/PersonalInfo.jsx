import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function PersonalInfo() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [fieldValue, setFieldValue] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadProfile = async () => {
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (!cancelled && snap.exists()) {
          setProfile(snap.data());
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  const startEditing = (field) => {
    setEditingField(field);
    setFieldValue(profile?.[field] || "");
  };

  const cancelEditing = () => {
    setEditingField(null);
    setFieldValue("");
  };

  const saveField = async () => {
    if (!editingField) return;
    try {
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, { [editingField]: fieldValue });
      setProfile((p) => ({ ...p, [editingField]: fieldValue }));
      setEditingField(null);
    } catch (err) {
      console.error("Failed to save field:", err);
      alert("Failed to save. Check console for details.");
    }
  };

  if (loading) return <p className="text-white p-6">Loading...</p>;
  if (!profile) return <p className="text-white p-6">No profile found.</p>;

  const fields = [
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "zip", label: "Zip Code" }
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Personal Information</h1>

      <div className="bg-gray-900 p-6 rounded-lg shadow-md space-y-6">
        {fields.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between border-b border-gray-700 pb-3">
            <div>
              <p className="text-sm text-gray-400">{label}</p>

              {editingField === key ? (
                <input
                  className="mt-1 p-2 bg-gray-800 rounded w-64"
                  value={fieldValue}
                  onChange={(e) => setFieldValue(e.target.value)}
                />
              ) : (
                <p className="text-lg">{profile[key] || "Not provided"}</p>
              )}
            </div>

            {editingField === key ? (
              <div className="flex gap-2">
                <button
                  onClick={saveField}
                  className="bg-green-600 px-3 py-1 rounded hover:bg-green-500"
                >
                  Save
                </button>

                <button
                  onClick={cancelEditing}
                  className="bg-gray-600 px-3 py-1 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => startEditing(key)}
                className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500"
              >
                Edit
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}