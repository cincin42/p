import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="w-full">

      {/* ⭐ HERO SECTION */}
      <section
        className="relative h-[70vh] w-full bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1581091870627-3b5c6f8b8f3e?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-6 max-w-3xl">
          <h1 className="text-5xl font-extrabold drop-shadow-lg">
            Heavy Equipment Service You Can Trust
          </h1>

          <p className="mt-4 text-lg opacity-90">
            Reliable maintenance, expert repairs, and fast scheduling for all your heavy equipment needs.
          </p>

          <Link
            to="/appointment"
            className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 transition px-8 py-3 rounded text-lg font-semibold shadow-lg"
          >
            Schedule an Appointment
          </Link>
        </div>
      </section>

      {/* ⭐ OPTIONAL CONTENT BELOW HERO */}
      <div className="p-10 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
        <p className="text-gray-700 text-lg">
          We provide top-tier heavy equipment maintenance and repair services with fast turnaround times and unmatched expertise.
        </p>

        <div className="mt-10">
          <Link
            to="/services"
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded hover:bg-gray-700 transition"
          >
            View Our Services
          </Link>
        </div>
      </div>
    </div>
  );
}
