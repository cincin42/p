export default function ServiceCard({ title, description, price }) {
    return (
        <div
      className="
        bg-white rounded-xl shadow-md p-6 cursor-pointer
        transform transition-all duration-300
        hover:-translate-y-2 hover:shadow-xl hover:scale-[1.03]
        hover:shadow-red-300/40
      "
    >
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>

      <p className="text-red-600 font-semibold text-lg">
        ${price}
      </p>
    </div>

    )
}