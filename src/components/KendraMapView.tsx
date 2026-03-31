"use client";

import { useState } from "react";

export default function KendraMapView() {
  const [zoom, setZoom] = useState(1);

  return (
    <section 
      className="w-full h-full min-h-[500px] bg-surface-container relative rounded-2xl overflow-hidden shadow-inner group border border-outline-variant/10"
      aria-label="Map View"
    >
      {/* Mock Map Background */}
      <div className="absolute inset-0 bg-slate-200/40"></div>
      <img 
        alt="Map background showing Delhi streets" 
        className="w-full h-full object-cover grayscale opacity-25 transition-transform duration-700 group-hover:scale-105" 
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhAnC26dp9Dwe6VIGmMzjb-l22sfX7PfObC65lGcLhueicELvAAFmyoblHAnUda9AsrkHTJZ2neWXd4deIIOit3G6XIMrcegkqLKJUpRtN7mASE63cGHY03WyjhKT866MsiORb4m4OLXveOr1dQgzjzRJRZZ9evEDI4J0T6UMwctn-6ijT3YRceJRnw7Pk9EClshZZ8wLu98qbEWh3MWdlqDlPe65HPRTBCZrx7-ewcnto0lDjVICdvK4r2q1SaPg4xuXDSIUDEeg"
      />
      
      {/* Map UI Interaction Points (Static for now) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* User Location */}
        <div className="relative pointer-events-auto cursor-help">
          <div className="absolute -inset-4 bg-primary/20 rounded-full animate-pulse"></div>
          <div className="relative bg-primary text-white p-1 rounded-full border-2 border-white shadow-xl">
            <span className="material-symbols-outlined text-sm">person</span>
          </div>
        </div>
        
        {/* Pins */}
        <div className="absolute top-[35%] left-[45%] group/pin cursor-pointer pointer-events-auto">
          <div className="relative bg-white p-1.5 rounded-t-full rounded-br-full shadow-lg border-2 border-primary rotate-[-45deg] transition-all hover:scale-110 hover:-translate-y-1">
            <div className="rotate-[45deg] bg-primary p-1 rounded-full shadow-sm">
              <span className="material-symbols-outlined text-white text-[12px]">medical_services</span>
            </div>
          </div>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-on-surface text-surface text-[10px] font-bold px-2 py-1 rounded shadow-xl opacity-0 translate-y-2 group-hover/pin:opacity-100 group-hover/pin:translate-y-0 transition-all whitespace-nowrap">
            0.8km Kendra
          </div>
        </div>

        <div className="absolute bottom-[40%] right-[30%] group/pin cursor-pointer pointer-events-auto">
          <div className="relative bg-white p-1.5 rounded-t-full rounded-br-full shadow-lg border-2 border-primary rotate-[-45deg] transition-all hover:scale-110 hover:-translate-y-1">
            <div className="rotate-[45deg] bg-primary p-1 rounded-full shadow-sm">
              <span className="material-symbols-outlined text-white text-[12px]">local_pharmacy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2">
        <button 
          className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center text-on-surface hover:bg-white active:scale-95 transition-all"
          onClick={() => setZoom(z => z + 1)}
          aria-label="Zoom in"
          type="button"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
        <button 
          className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center text-on-surface hover:bg-white active:scale-95 transition-all"
          onClick={() => setZoom(z => z - 1)}
          aria-label="Zoom out"
          type="button"
        >
          <span className="material-symbols-outlined">remove</span>
        </button>
      </div>
      
      <div className="absolute top-6 right-6">
        <button 
          type="button"
          className="bg-white/90 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-sm font-bold text-primary hover:bg-white active:scale-95 transition-all group/btn"
        >
          <span className="material-symbols-outlined text-[18px] group-hover/btn:animate-spin-slow">my_location</span>
          Recenter
        </button>
      </div>
    </section>
  );
}
