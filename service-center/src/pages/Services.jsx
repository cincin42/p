import ServiceCard from "../components/ServiceCard";

export default function Services() {
  const services = [
    {
      title: "Oil Change",
      description: "Full synthetic oil change with filter replacement.",
      price: 89,
    },
    {
      title: "Brake Inspection",
      description: "Complete brake system check and safety evaluation.",
      price: 49,
    },
    {
      title: "Tire Rotation",
      description: "Front-to-back tire rotation for even wear.",
      price: 29,
    },
    {
      title: "Hydraulic Repair",
      description: "Professional hydraulic diagnostics and repair.",
      price: 199,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Our Services
      </h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
        {services.map((s) => (
          <ServiceCard
            key={s.title}
            title={s.title}
            description={s.description}
            price={s.price}
          />
        ))}
      </div>
    </div>
  );
}