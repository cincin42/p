import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white text-center py-4 mt-10">
      <div className="max-w-6xl mx-auto">
        <p className="text-sm">
          © {new Date().getFullYear()} CD Heavy Equipment Services. All rights reserved.
        </p>
      </div>
      <div className="justify-center m-auto">
        <Link to="/about" className="text-sm text-gray-400 hover:text-gray-200 transition">
          About Us
        </Link>
      
      </div>
    </footer>
  );
}