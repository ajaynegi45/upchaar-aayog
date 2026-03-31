import type { Metadata } from "next";
import HospitalCard from "@/components/HospitalCard";

export const metadata: Metadata = {
  title: "Ayushman Care | Find Hospitals Near You",
  description: "Locate Ayushman Bharat empanelled hospitals for free treatment. Access quality healthcare near you instantly.",
  openGraph: {
    title: "Ayushman Care | Find Hospitals Near You",
    description: "Find free treatment and Ayushman Bharat hospitals nearby.",
  },
};

export default function HospitalPage() {
  const hospitals = [
    {
      name: "City General Hospital",
      distance: "2.5 km away",
      description: "Provides comprehensive treatment under Ayushman Bharat scheme",
      specialties: ["General Surgery", "Medicine", "Emergency"],
      isAyushmanEligible: true,
    },
    {
      name: "Metro Medicare Hospital",
      distance: "4.1 km away",
      description: "Specialized care available under the PMJAY scheme",
      specialties: ["Cardiology", "Pediatrics", "Orthopedics"],
      isAyushmanEligible: true,
    },
    {
      name: "Sanjeevani Care Centre",
      distance: "5.8 km away",
      description: "Providing accessible healthcare to all eligible beneficiaries",
      specialties: ["Internal Medicine", "Gynaecology"],
      isAyushmanEligible: true,
    },
  ];

  return (
    <main className="max-w-3xl mx-auto px-6 pt-8 pb-24">
      {/* Header Section */}
      <div className="mb-12 text-center" aria-labelledby="hospital-title">
        <h1 
          id="hospital-title"
          className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface leading-tight tracking-tight mb-4"
        >
          Ayushman Bharat <span className="text-primary-dark italic">Hospitals</span> Near You
        </h1>
        <p className="text-lg text-on-surface-variant font-medium mb-8">
          Find hospitals where eligible patients can receive free treatment
        </p>
        
        <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
          <div className="flex items-center gap-3 bg-surface-container-low px-6 py-4 rounded-xl w-full md:w-auto min-w-[320px] border border-on-surface/5 shadow-sm">
            <span className="material-symbols-outlined text-primary" aria-hidden="true">location_on</span>
            <span className="font-bold text-on-surface">Rohini, Delhi</span>
            <button type="button" className="ml-auto text-sm font-bold text-primary hover:underline hover:text-primary-dim transition-all">
              Change Location
            </button>
          </div>
          <nav className="flex gap-3 w-full md:w-auto" aria-label="Filters">
            <button 
              type="button"
              className="flex-1 px-4 py-4 bg-primary text-on-primary rounded-xl font-bold text-sm shadow-md hover:bg-primary-dim active:scale-95 transition-all outline-none focus:ring-4 focus:ring-primary/20"
            >
              Nearest
            </button>
            <button 
              type="button"
              className="flex-1 px-4 py-4 bg-surface-container-highest whitespace-nowrap text-on-surface-variant rounded-xl font-bold text-sm hover:bg-surface-container-high transition-all outline-none focus:ring-4 focus:ring-on-surface/10"
            >
              All Hospitals
            </button>
          </nav>
        </div>
      </div>

      {/* Important Info Banner */}
      <section 
        className="bg-secondary-container/40 p-6 rounded-2xl flex gap-4 items-start mb-12 border border-secondary-container/30 shadow-inner"
        aria-label="Important Information"
      >
        <span className="material-symbols-outlined text-on-secondary-container text-2xl mt-0.5" aria-hidden="true">
          info
        </span>
        <p className="text-sm md:text-base leading-relaxed text-on-secondary-container font-bold">
          Treatment may be free under Ayushman Bharat if you are eligible. Check eligibility at the hospital helpdesk with your PMJAY card.
        </p>
      </section>

      {/* Hospital List */}
      <section className="space-y-8" aria-label="Hospital listings">
        <h2 className="sr-only">Available Hospitals</h2>
        {hospitals.map((hospital, index) => (
          <HospitalCard key={index} {...hospital} />
        ))}
      </section>

      {/* Pagination / Load More */}
      <div className="mt-12 text-center">
        <button 
          type="button"
          className="px-12 py-4 bg-surface-container-low text-on-surface font-bold rounded-xl border border-outline-variant/20 hover:bg-surface-container hover:shadow-sm transition-all active:scale-95"
        >
          Load More Hospitals
        </button>
      </div>
    </main>
  );
}
