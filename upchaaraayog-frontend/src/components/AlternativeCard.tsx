interface AlternativeCardProps {
    name: string;
    strength: string;
    form: string;
    originalPrice: number;
    currentPrice: number;
    savings: string;
}

export default function AlternativeCard({
                                            name,
                                            strength,
                                            form,
                                            originalPrice,
                                            currentPrice,
                                            savings,
                                        }: AlternativeCardProps) {
    return (
        <article
            className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-transparent hover:border-primary/20 hover:shadow-[0_32px_48px_rgba(45,52,51,0.06)] transition-all flex flex-col md:flex-row gap-8 items-center group">
            <div
                className="w-full md:w-32 h-32 flex-shrink-0 bg-surface-container rounded-xl flex items-center justify-center">
        <span
            className="material-symbols-outlined text-4xl text-outline-variant group-hover:scale-110 transition-transform">
          pill
        </span>
            </div>

            <div className="flex-grow space-y-4 w-full">
                <div className="flex flex-wrap items-center gap-3">
                    <h4 className="text-xl font-headline font-extrabold text-on-surface group-hover:text-primary transition-colors">
                        {name}
                    </h4>
                    {/*<span className="bg-primary-container text-on-primary-container text-[10px] font-bold pl-1 pr-2 py-1 rounded-full flex items-center gap-1 uppercase tracking-widest shadow-sm">*/}
                    {/*  <span className="material-symbols-outlined text-[5px]" style={{ fontVariationSettings: "'FILL' 1" }}>*/}
                    {/*    check_circle*/}
                    {/*  </span>*/}
                    {/*  Same Salt*/}
                    {/*</span>*/}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/60 mb-1">Strength</p>
                        <p className="font-bold text-on-surface">{strength}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/60 mb-1">Form</p>
                        <p className="font-bold text-on-surface">{form}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/60 mb-1">Savings</p>
                        <p className="font-extrabold text-primary">{savings}</p>
                    </div>
                </div>
            </div>

            <div
                className="w-full md:w-auto flex flex-col items-center md:items-end gap-4 min-w-[140px] border-t md:border-t-0 md:border-l border-outline-variant/10 pt-4 md:pt-0 md:pl-8">
                <div className="text-center md:text-right">
                    <p className="text-sm text-on-surface-variant line-through opacity-40 font-medium">₹{originalPrice.toFixed(2)}</p>
                    <p className="text-3xl font-headline font-black text-on-surface">₹{currentPrice.toFixed(2)}</p>
                </div>
                {/*<div className="flex flex-col gap-2 w-full">*/}
                {/*  <button */}
                {/*    type="button" */}
                {/*    className="bg-primary hover:bg-primary-dim text-on-primary px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 whitespace-nowrap"*/}
                {/*  >*/}
                {/*    Check Availability*/}
                {/*  </button>*/}
                {/*  <button */}
                {/*    type="button" */}
                {/*    className="text-primary text-sm font-bold flex items-center justify-center gap-1 hover:text-primary-dim transition-colors group/btn"*/}
                {/*  >*/}
                {/*    View Details*/}
                {/*    <span className="material-symbols-outlined text-sm transition-transform group-hover/btn:translate-x-1">arrow_forward</span>*/}
                {/*  </button>*/}
                {/*</div>*/}
            </div>
        </article>
    );
}
