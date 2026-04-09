import type {Metadata} from "next";
import AlternativeCard from "@/components/AlternativeCard";

export const metadata: Metadata = {
    title: "Medicine Comparison | Upchaar Aayog",
    description: "Compare branded medicines with high-quality generic alternatives. Save up to 90% on healthcare costs with salt-based matching.",
    openGraph: {
        title: "Medicine Comparison | Upchaar Aayog",
        description: "Find affordable medicine alternatives based on composition matching.",
    },
};

export default function MedicinePage() {
    const alternatives = [
        {
            name: "Generic Paracetamol",
            strength: "500mg", // Fixed strength from HTML if needed, but let's use 500mg
            form: "Tablet",
            originalPrice: 30.00,
            currentPrice: 10.00,
            savings: "66% lower price",
        },
        {
            name: "Dolo-500",
            strength: "500mg",
            form: "Tablet",
            originalPrice: 30.00,
            currentPrice: 15.00,
            savings: "50% lower price",
        },
    ];

    return (
        <main className="max-w-[1300px] mx-auto px-6 pt-12 pb-24">
            {/* Hero Header */}
            <header className="mb-16" aria-labelledby="medicine-title">
                <h1
                    id="medicine-title"
                    className="font-headline text-5xl md:text-6xl font-black tracking-tight text-on-surface mb-6"
                >
                    Medicine <span className="text-primary-dark italic">Comparison</span>
                </h1>
                <p className="text-on-surface-variant text-xl max-w-2xl font-medium leading-relaxed">
                    Optimizing healthcare costs through transparent salt-based pharmaceutical alternatives.
                </p>
            </header>

            {/* Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Left Column: Reference Selection (Sticky) */}
                <aside className="lg:col-span-4 lg:sticky lg:top-28">
                    <section
                        className="bg-surface-container-low rounded-2xl p-10 border-l-8 border-primary shadow-inner"
                        aria-labelledby="selection-title"
                    >
                        <div className="flex items-center gap-2 mb-8">
              <span className="material-symbols-outlined text-primary text-2xl"
                    style={{fontVariationSettings: "'FILL' 1"}} aria-hidden="true">
                bookmark
              </span>
                            <h2 id="selection-title"
                                className="font-headline font-black uppercase tracking-[0.2em] text-xs text-primary">
                                Your Selection
                            </h2>
                        </div>

                        <div className="space-y-8">
                            <div className="border-b border-outline-variant/20 pb-6">
                                <h3 className="text-4xl font-headline font-black text-on-surface mb-1">Crocin</h3>
                                <p className="text-on-surface-variant font-bold text-sm uppercase tracking-widest opacity-70">Branded
                                    Medicine</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-1">
                                    <span
                                        className="text-on-surface-variant font-bold text-xs uppercase tracking-wider">Composition</span>
                                    <span className="font-black text-on-surface">Paracetamol 500mg</span>
                                </div>
                                <div className="flex justify-between items-center py-1">
                                    <span
                                        className="text-on-surface-variant font-bold text-xs uppercase tracking-wider">Form</span>
                                    <span className="font-black text-on-surface">Tablet</span>
                                </div>
                                <div
                                    className="flex justify-between items-center pt-6 border-t border-outline-variant/10">
                                    <span
                                        className="text-on-surface-variant font-bold text-xs uppercase tracking-wider">MRP <span
                                        className="text-[10px] opacity-50">(Incl. taxes)</span></span>
                                    <span className="text-3xl font-headline font-black text-on-surface">₹30.00</span>
                                </div>
                            </div>

                            <div className="relative h-56 w-full rounded-2xl overflow-hidden group shadow-2xl">
                                <img
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    alt="Branded medicine Crocin packaging"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCL6Ktt468CgRtGfE3bmjV3iOVnKOtRwHDcf1OdkbJYOkJm6CmX_uHEiyhPh7sjhiWDZk1pT2l01vGOGUnfi9KtD1Bi9I5-jin7NohRSwXgupUzlIKCcL2zZuIfkNsEZDnrglH2--LW3shsibKsrkDxzw3NYXNU4qHV-tjPqqX5nwWBY6IF0zfyZY8ff5A5ggYTLtMB1gPz9__SDpuoJz0DD8rtOVOy6k-2p2Abr98Zfr3YgZ-XY5LnWg6N0oRjEPjuvDMMuvNSeW4"
                                />
                                <div
                                    className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors"/>
                            </div>
                        </div>
                    </section>
                </aside>

                {/* Right Column: Alternatives List */}
                <section className="lg:col-span-8 space-y-8" aria-labelledby="alternatives-title">
                    <div className="mb-10 px-2">
                        <h2 id="alternatives-title"
                            className="font-headline text-3xl font-black text-on-surface mb-2">Lower-Cost
                            Alternatives</h2>
                        <p className="text-on-surface-variant font-medium text-lg">Medicines with similar composition
                            that may cost less</p>
                    </div>

                    <div className="space-y-6">
                        {alternatives.map((alt, index) => (
                            <AlternativeCard key={index} {...alt} strength={index === 0 ? "500mg" : alt.strength}/>
                        ))}

                        {/* Educational Callout */}
                        <div
                            className="bg-secondary-container/30 border border-secondary/10 rounded-2xl p-8 flex items-start gap-6 shadow-inner"
                            role="note"
                        >
                            <span className="material-symbols-outlined text-secondary text-4xl"
                                  aria-hidden="true">info</span>
                            <div>
                                <h3 className="font-headline font-black text-on-secondary-container mb-2 text-xl tracking-tight">Did
                                    you know?</h3>
                                <p className="text-on-secondary-container font-medium leading-relaxed opacity-90">
                                    Generic medicines undergo the same rigorous quality checks by regulatory authorities
                                    as branded ones. They contain the identical active pharmaceutical ingredients
                                    (APIs).
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Safety Disclaimer Section */}
            <section className="mt-32 pt-16 border-t border-surface-container-high" aria-labelledby="disclaimer-title">
                <div
                    className="bg-surface-container rounded-3xl p-10 md:p-16 flex flex-col md:flex-row gap-12 items-start shadow-sm border border-outline-variant/5">
                    <div className="bg-error-container/20 p-5 rounded-2xl shadow-inner">
                        <span className="material-symbols-outlined text-error text-4xl" aria-hidden="true">gavel</span>
                    </div>
                    <div className="flex-1">
                        <h2 id="disclaimer-title" className="text-2xl font-headline font-black mb-4">Safety
                            Disclaimer</h2>
                        <p className="text-on-surface-variant leading-relaxed font-medium text-lg mb-8 opacity-80">
                            This information is for reference only. Results are based on composition matching and may
                            not always be exact.
                            Doctors should verify before prescribing, and patients should consult a healthcare
                            professional before
                            making any changes to their medication regimen. Upchaar Aayog does not provide medical
                            advice or prescriptions.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            {["Information Only", "Verified Composition", "Expert Consultation Required"].map((tag) => (
                                <span key={tag}
                                      className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-surface-container-lowest px-4 py-2 rounded-lg shadow-sm">
                  {tag}
                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
