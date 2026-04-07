import { Hospital } from "@/store/types";
import { openInMaps } from "@/utils/mapUtils";

export default function HospitalCard(hospital: Hospital) {
  const {
    name,
    state,
    district,
    contactNumber,
    hospitalType,
    specialityNames,
    schemeNames,
    hasConvergence
  } = hospital;

  const handleGetDirections = () => {
    openInMaps(`${name}, ${district}, ${state}`);
  };

  const handleCall = () => {
    if (contactNumber) {
      window.location.href = `tel:${contactNumber}`;
    }
  };

  return (
    <article className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl transition-all duration-500 group border border-outline-variant/10 hover:border-primary/20 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col gap-6">
        {/* Top Section: Badges and Type */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {schemeNames.map((scheme) => (
              <span
                key={scheme}
                className="px-3 py-1 bg-primary-container text-on-primary-container text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm"
              >
                {scheme}
              </span>
            ))}
            {hasConvergence && (
              <span className="px-3 py-1 bg-tertiary-container text-on-tertiary-container text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">handshake</span>
                Convergence
              </span>
            )}
          </div>
          {hospitalType && (
            <span className="px-4 py-1.5 bg-surface-container-high text-on-surface-variant text-[11px] font-bold rounded-lg border border-outline-variant/20">
              {hospitalType}
            </span>
          )}
        </div>

        {/* Header Info */}
        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-headline font-black text-on-surface leading-tight tracking-tight group-hover:text-primary transition-colors">
            {name}
          </h2>
          
          <div className="flex flex-wrap gap-y-3 gap-x-6">
            <div className="flex items-center gap-2 text-on-surface-variant font-bold text-sm">
              <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
              {district}, {state}
            </div>
            {contactNumber && (
              <div className="flex items-center gap-2 text-on-surface-variant font-bold text-sm">
                <span className="material-symbols-outlined text-primary text-[20px]">call</span>
                {contactNumber}
              </div>
            )}
          </div>
        </div>

        {/* Specialities Section */}
        {specialityNames.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-outline-variant/10">
            <h3 className="text-[11px] font-black text-on-surface-variant/50 uppercase tracking-[0.2em]">Available Specialities</h3>
            <div className="flex flex-wrap gap-2">
              {specialityNames.slice(0, 8).map((spec) => (
                <span
                  key={spec}
                  className="px-3 py-1.5 bg-surface text-on-surface-variant text-[12px] font-bold rounded-xl border border-outline-variant/30 hover:bg-primary/5 hover:border-primary/30 transition-all"
                >
                  {spec}
                </span>
              ))}
              {specialityNames.length > 8 && (
                <span className="px-3 py-1.5 text-on-surface-variant/60 text-[12px] font-bold">
                  +{specialityNames.length - 8} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <button
            type="button"
            onClick={handleGetDirections}
            className="flex items-center justify-center gap-2 py-4 bg-primary text-on-primary rounded-2xl font-black text-sm shadow-lg shadow-primary/20 hover:bg-primary-dark active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">directions</span>
            Get Directions
          </button>
          {contactNumber ? (
            <button
              type="button"
              onClick={handleCall}
              className="flex items-center justify-center gap-2 py-4 bg-surface-container-high text-on-surface rounded-2xl font-black text-sm border border-outline-variant/30 hover:bg-surface-container-highest active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">call</span>
              Call Now
            </button>
          ) : (
            <div className="flex items-center justify-center py-4 bg-surface-container-low text-on-surface-variant/40 rounded-2xl font-bold text-sm border border-dashed border-outline-variant/20 italic">
              No contact available
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
