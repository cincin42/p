import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const { user, logout } = useAuth();

  // Create initials for avatar
  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "U";

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Company Name */}
        <h1 className="text-xl font-bold tracking-wide">
          CD Heavy Equipment Services
        </h1>

        {/* Hamburger Button (Mobile) */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-lg">
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>

          {/* Admin Dashboard Link */}
          {user?.role === "admin" && (
            <Link to="/admin">Admin Dashboard</Link>
          )}

          {/* If logged in → show avatar + dropdown */}
          {(user && user.emailVeriffied ) ? (
            
            <div className="relative">
              <div>
                <Link to="/appointment">Appointment</Link>
              </div>

              <div
                className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => setDropdown(!dropdown)}
              >
                <span className="font-bold">{initials}</span>
              </div>

              {dropdown && (
                <div className="absolute right-0 mt-3 bg-gray-800 rounded shadow-lg w-40 p-3">
                  <Link
                    to="/account"
                    className="block py-2 hover:text-red-400"
                    onClick={() => setDropdown(false)}
                  >
                    Account
                  </Link>

                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="block py-2 hover:text-red-400"
                      onClick={() => setDropdown(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="block w-full text-left py-2 hover:text-red-400"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">Sign In</Link>
              <Link to="/register">Create Account</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="md:hidden mt-3 flex flex-col gap-4 bg-gray-800 p-4 rounded">
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/services" onClick={() => setOpen(false)}>Services</Link>
          <Link to="/appointment" onClick={() => setOpen(false)}>Appointment</Link>

          {user?.role === "admin" && (
            <Link to="/admin" onClick={() => setOpen(false)}>Admin Dashboard</Link>
          )}

          {user ? (
            <>
              <Link to="/account" onClick={() => setOpen(false)}>Account</Link>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>Sign In</Link>
              <Link to="/register" onClick={() => setOpen(false)}>Create Account</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}