import ServiceCard from "../components/ServiceCard";

export default function Services() {
  const services = [
    {
      title: "Diagnostics: CAT, Cummins, OBD2",
      description: "Comprehensive diagnostics for all major heavy equipment brands.",
      price: 99,
    },
    {
      title: "Heavy/Medium Duty Trucks",
      description: "Expert maintenance and repair for heavy and medium duty trucks.",
      price: 149,
    },
    {
      title: "Automobile Service",
      description: "Full-service maintenance and repair for cars and light trucks.",
      price: 79,  
    },
    {
      title: "Farm Equipment Repair",
      description: "Specialized repair services for agricultural machinery.",
      price: 129,
    },
    {
      title: "Heavy Equipment Repair",
      description: "Skilled repair services for all types of heavy equipment.",
      price: 199,
    },
    {
      title: "Engine Repair, Rebuild,and Replacement",
      description: "Complete engine services including repair, rebuild, and replacement.",
      price: 499,
      
    },
    {
      title: "Emergency Roadside Assistance",
      description: "Breakdown assistance for heavy equipment and trucks, available 24/7.",
      price: 199,
    },
    {
      title: "Traffic Control",
      description: "Professional traffic control services for construction sites and events.",
      price: 149,
    }, 
    {
      title: "DOT Inspections",
      description: "Certified DOT inspections to keep your vehicles compliant and safe.",
      price: 89,  
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