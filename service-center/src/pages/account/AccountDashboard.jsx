import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();


  const handleLogout = async () => {
    if(!window.confirm("Are you sure you want to log out?")) return;
    try{
      await logout();
      navigate("/");
    } catch (error) {
      console.log("Logout failed:", error);
      //shows error message to user
      alert("Logout failed. Please try again.");  
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>

      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg space-y-8">

        {/* Personal Info */}
        <section>
         <div className="text-white text-lg font-bold">
           <h1  className="text-white text-lg font-bold">{user.name}</h1>
          </div>
          <button
            onClick={() => navigate("/account/personal-info")}
            className="mt-3 bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
          >
           Personal Information
          </button>
        </section>

        {/* Previous Services */}
        <section>
          
          <button
            onClick={() => navigate("/account/history")}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
          >
            Service History
          </button>
        </section>

        {/* Upcoming Appointments */}
        <section>
          
          <button
            onClick={() => navigate("/account/upcoming")}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
          >
             Upcoming Appointments
          </button>
        </section>

        {/* Change Password */}
        <section>
          
          <button
            onClick={() => navigate("/account/password")}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
          >
            Change Password
          </button>
        </section>

        {/* Logout */}
        <section className="pt-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-500"
          >
            Logout
          </button>
        </section>

      </div>
    </div>
  );
}