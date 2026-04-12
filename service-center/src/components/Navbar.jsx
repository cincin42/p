import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;

  const isVerified = user && user.emailVerified;
  const isAdmin = isVerified && user.role === "admin";

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "U";

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        <h1 className="text-xl font-bold tracking-wide">
          CD Heavy Equipment Services
        </h1>

        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        <div className="hidden md:flex items-center gap-6 text-lg">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/services">Services</Link>

          {isVerified && <Link to="/appointment">Schedule</Link>}
          {isAdmin && <Link to="/admin">Admin Dashboard</Link>}

          {isVerified ? (
            <div
              className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center cursor-pointer"
              onClick={() => navigate("/account")}
            >
              <span className="font-bold">{initials}</span>
            </div>
          ) : (
            <>
              <Link to="/login">Sign In</Link>
              <Link to="/register">Create Account</Link>
            </>
          )}
        </div>
      </div>

      {open && (
        <div className="md:hidden mt-3 flex flex-col gap-4 bg-gray-800 p-4 rounded">
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
          <Link to="/services" onClick={() => setOpen(false)}>Services</Link>

          {isVerified && (
            <Link to="/appointment" onClick={() => setOpen(false)}>Schedule</Link>
          )}

          {isAdmin && (
            <Link to="/admin" onClick={() => setOpen(false)}>Admin Dashboard</Link>
          )}

          {isVerified ? (
            <Link to="/account" onClick={() => setOpen(false)}>Account</Link>
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