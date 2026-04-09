"use client";

import {Hospital} from "@/store/types";
import {useState} from "react";

export default function HospitalCard(hospital: Hospital) {
    const {
        name,
        state,
        district,
        contactNumber,
        hospitalType,
        specialityNames,
        schemeNames,
        schemeCodes,
    } = hospital;

    const displaySchemes = schemeCodes?.length ? schemeCodes : schemeNames;

    const [showAllSpecialities, setShowAllSpecialities] = useState(false);

    const DEFAULT_VISIBLE_SPECIALITIES = 5;
    const hasMoreSpecialities = specialityNames.length > DEFAULT_VISIBLE_SPECIALITIES;

    const visibleSpecialities = showAllSpecialities
        ? specialityNames
        : specialityNames.slice(0, DEFAULT_VISIBLE_SPECIALITIES);

    return (
        <article
            className="bg-surface p-4 md:p-6 rounded-lg md:rounded-xl transition-all duration-300 border border-outline-variant/15 hover:border-primary/20 hover:shadow-lg flex flex-col justify-between h-full group">
            <div className="flex flex-col gap-4">


                <div className="space-y-1">


                    {/* Hospital Name */}
                    <h2 className="text-xl md:text-2xl mt-3 font-black text-on-surface leading-tight tracking-tight group-hover:text-primary transition-colors">
                        {name}
                    </h2>

                    <div className="flex flex-col gap-2 mt-3">
                        <div className="flex items-center gap-2 text-on-surface-variant font-medium text-sm">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            <span className="leading-none">{district}, {state}</span>
                        </div>
                        {contactNumber ? (
                            <div className="flex items-center gap-2 text-on-surface-variant font-medium text-sm">
                                <span className="material-symbols-outlined text-sm">call</span>
                                <span className="leading-none">{contactNumber}</span>
                            </div>
                        ) : (
                            <div
                                className="flex items-center gap-2 text-on-surface-variant/50 font-medium text-sm italic">
                                <span className="material-symbols-outlined text-[18px]">phone_disabled</span>
                                <span className="leading-none">No contact available</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Header Info */}
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Hospital Type */}
                    {hospitalType && (
                        <span className="px-2 py-0.5 bg-surface-container-high text-on-surface-variant text-[10px] font-bold rounded-md uppercase tracking-wider whitespace-nowrap">
                                {hospitalType.replace(/_/g, " ")} Hospital
                            </span>
                    )}
                    {/* Schemes */}
                    {displaySchemes?.map((scheme) => (
                        <span key={scheme} className="px-2 py-0.5 bg-primary-container text-on-primary-container text-[10px] font-bold uppercase tracking-wider rounded-md whitespace-nowrap">
                                {scheme}
                            </span>
                    ))}
                </div>

                {/* Specialities Section */}
                {specialityNames.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-outline-variant/10">
                        <h3 className="text-[10px] font-black text-on-surface-variant/60 uppercase tracking-widest mb-2">Available
                            Specialities</h3>
                        <div className="flex flex-wrap items-center gap-1.5">
                            {visibleSpecialities.map((spec) => (
                                <span
                                    key={spec}
                                    className="px-2 py-1 bg-surface-container-lowest text-on-surface-variant text-[11px] font-bold rounded-md border border-outline-variant/30"
                                >
                                    {spec.length > 30 ? spec.substring(0, 30) + '...' : spec}
                                </span>
                            ))}

                            {hasMoreSpecialities && (
                                <button
                                    type="button"
                                    onClick={() => setShowAllSpecialities(!showAllSpecialities)}
                                    className="px-2 py-1 text-primary text-[11px] font-bold hover:underline cursor-pointer rounded-md bg-primary/5"
                                >
                                    {showAllSpecialities ? "Show Less" : `+${specialityNames.length - DEFAULT_VISIBLE_SPECIALITIES} More`}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}
