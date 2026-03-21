export default function Home() {
  return (
    <div className="p-6 text-center max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold mt-10">
        Welcome to CD Heavy Equipment Services
      </h2>

      <p className="mt-4 text-lg text-gray-700">
        Professional heavy equipment maintenance, repair, and service scheduling made easy.
      </p>

      <div className="mt-10">
        <img
          src="https://images.unsplash.com/photo-1581091870627-3a5c6a7b8f1d"
          alt="Heavy Equipment"
          className="rounded-lg shadow-lg mx-auto"
        />
      </div>
    </div>
  );
}
