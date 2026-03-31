import Link from "next/link";

interface StoreCardProps {
  name: string;
  distance: string;
  status: "Open" | "Closed" | "Likely open" | "Closing soon" | "Open now";
  address: string;
  isLowCost?: boolean;
}

export default function StoreCard({ name, distance, status, address, isLowCost = true }: StoreCardProps) {
    const getStatusStyles = (status: string) => {
      switch (status) {
        case "Open":
        case "Open now":
          return "bg-emerald-500/10 text-emerald-600 border-emerald-500/30";
        case "Closing soon":
          return "bg-amber-500/10 text-amber-600 border-amber-500/30";
        case "Closed":
          return "bg-rose-500/10 text-rose-600 border-rose-500/30";
        default:
          return "bg-slate-500/10 text-slate-500 border-slate-500/20";
      }
  };

  return (
    <article className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-outline-variant/10 group transition-all hover:bg-surface-container-low hover:shadow-md">
      <div className="flex gap-4">
        <div className="h-12 w-12 rounded-lg bg-primary-container/30 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            medical_services
          </span>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-headline font-semibold text-lg text-on-surface">{name}</h3>
              <p className="text-sm text-on-surface-variant font-medium">{address}</p>
            </div>
            {/*<span className="text-primary font-bold text-sm whitespace-nowrap">{distance}</span>*/}
              <span className="px-3 py-1 rounded bg-secondary-container text-on-secondary-container text-[10px] rounded-xl whitespace-nowrap font-bold uppercase tracking-widest shadow-sm ">
                {distance}
              </span>
          </div>
          
          {/*<div className="mt-4 flex items-center gap-4">*/}
          {/*  <div className="flex items-center gap-1.5" aria-label={`Status: ${status}`}>*/}
          {/*    <span className={`w-2 h-2 rounded-full ${getStatusStyles(status)}`}></span>*/}
          {/*    <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{status}</span>*/}
          {/*  </div>*/}
          {/*  /!*{isLowCost && (*!/*/}
          {/*  /!*  <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-widest shadow-sm">*!/*/}
          {/*  /!*    Low Cost*!/*/}
          {/*  /!*  </span>*!/*/}
          {/*  /!*)}*!/*/}
          {/*</div>*/}
          
          <div className="mt-6 flex gap-3">
            <button 
              type="button" 
              className="flex-1 py-2.5 rounded-lg bg-gradient-to-br from-primary to-primary-dim text-on-primary text-sm hover:cursor-pointer font-bold flex items-center justify-center gap-2 transition-all hover:shadow-md active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px] ">directions</span>
              Get Directions
            </button>
            <div className={`px-4 py-2.5 rounded-lg border ${getStatusStyles(status)} border-outline-variant/30  text-sm font-bold hover:bg-white hover:text-primary-dim transition-colors`}>
              {status}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
