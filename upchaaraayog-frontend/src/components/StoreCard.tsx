"use client";

import {KendraStore} from "@/store/types";
import {openInMaps} from "@/utils/mapUtils";

export default function StoreCard({name, kendraCode, status, address, state, district, pincode}: KendraStore) {
    const handleGetDirections = () => {
        openInMaps(`${name} jan aushadhi kendra, kendracode=${kendraCode}, ${address}, ${district}, ${state}, ${pincode}`);
    };

    console.log(`${name} jan aushadhi kendra, kendracode=${kendraCode}, ${address}, ${district}, ${state}, ${pincode}`);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "Open":
            case "Likely open":
                return "bg-emerald-500/10 text-emerald-600 border-emerald-500/30";
            case "Likely closed":
                return "bg-amber-500/10 text-amber-600 border-amber-500/30";
            case "Closed":
                return "bg-rose-500/10 text-rose-600 border-rose-500/30";
            default:
                return "bg-slate-500/10 text-slate-500 border-slate-500/20";
        }
    };

    return (
        <article
            className="max-w-[700px] w-full bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 hover:shadow-sm transition hover:bg-primary-container/10 active:bg-primary-container/10">

            <div className="flex gap-3">

                {/* Icon */}
                <div className="h-10 w-10 rounded-md bg-primary-container/30 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-2xl"
                          style={{fontVariationSettings: "'FILL' 1"}}> medical_services</span>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1">

                    {/* Title + Status */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-on-surface text-base leading-tight">
                                {name}
                            </h3>
                            <p className="text-sm text-on-surface-variant mt-2 mb-2 font-bold">
                                {kendraCode}
                            </p>
                        </div>

                        <span className={`text-xs font-medium px-2 py-1 rounded-md ${getStatusStyles(status)}`}>
          {status}
        </span>
                    </div>

                    {/* Address */}
                    <p className="text-sm text-on-surface-variant leading-snug">
                        {address}, {district}, {state} {pincode}
                    </p>

                    {/* Location */}
                    <p className="text-sm text-on-surface-variant">

                    </p>

                </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
                <button
                    onClick={handleGetDirections}
                    className="flex-1 py-2 rounded-md bg-primary text-on-primary text-sm font-medium hover:opacity-90 active:scale-95 transition flex items-center justify-center gap-1.5 hover:cursor-pointer"
                >
                    <span className="material-symbols-outlined text-[18px]">directions</span>
                    Directions
                </button>
            </div>

        </article>
    );
}
