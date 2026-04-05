import { openInMaps } from "@/utils/mapUtils";

interface HospitalCardProps {
  name: string;
  distance: string;
  description: string;
  specialties: string[];
  isAyushmanEligible?: boolean;
}

export default function HospitalCard({
  name,
  distance,
  description,
  specialties,
  isAyushmanEligible = true,
}: HospitalCardProps) {
  const handleGetDirections = () => {
    openInMaps(name);
  };
  return (
    <article className="bg-surface-container-lowest p-8 rounded-2xl transition-all duration-300 group shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-transparent hover:border-secondary-container/50 hover:shadow-[0_32px_48px_rgba(45,52,51,0.04)] hover:-translate-y-1">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
        <div className="flex flex-col gap-1">

          <h2 className="text-2xl font-headline font-extrabold text-on-surface group-hover:text-secondary transition-colors">
            {name}
          </h2>
          {/*<p className="text-on-surface-variant text-sm mt-1 font-medium italic">*/}
          {/*  {description}*/}
          {/*</p>*/}
        </div>
          <span className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap shadow-sm">
            {distance}
          </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {specialties.map((specialty, index) => (
          <span
            key={index}
            className="text-[11px] font-bold bg-surface-container px-3 py-1.5 rounded-lg text-on-tertiary-container uppercase tracking-wider"
          >
            {specialty}
          </span>
        ))}
      </div>

      {/*<div className="flex items-center gap-6 mb-8 border-t border-b border-surface-container-low py-4">*/}
      {/*  <div className="flex items-center gap-2 text-[10px] font-bold text-primary/80 uppercase tracking-[0.1em]">*/}
      {/*    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>*/}
      {/*      verified*/}
      {/*    </span>*/}
      {/*    Government approved*/}
      {/*  </div>*/}
      {/*  <div className="flex items-center gap-2 text-[10px] font-bold text-primary/80 uppercase tracking-[0.1em]">*/}
      {/*    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>*/}
      {/*      location_on*/}
      {/*    </span>*/}
      {/*    Verified location*/}
      {/*  </div>*/}
      {/*</div>*/}

      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
        <button
          type="button"
          onClick={handleGetDirections}
          className="py-4 bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-all hover:shadow-md hover:cursor-pointer"
        >
          Get Directions
        </button>
        {/*<button*/}
        {/*  type="button"*/}
        {/*  className="py-4 bg-secondary-container text-on-secondary-container rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-all hover:bg-secondary-fixed-dim"*/}
        {/*>*/}
        {/*  View Hospital Details*/}
        {/*</button>*/}
      </div>
    </article>
  );
}
