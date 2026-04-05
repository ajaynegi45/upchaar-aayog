import MedicineSearch from "@/components/MedicineSearch";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-24 md:pt-32 md:pb-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-container/30 to-secondary-container/20 -z-10" />
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-headline text-4xl md:text-6xl font-extrabold text-on-surface leading-[1.1] tracking-tight mb-6">
            Find Affordable Treatment
          </h1>
          <h1 className="font-headline text-4xl md:text-6xl font-extrabold text-on-surface leading-[1.1] tracking-tight mb-6">
            Near You — <span className="text-[#016b5f] italic">Instantly</span>
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant mb-12 max-w-2xl mx-auto leading-relaxed">
            Locate nearby Jan Aushadhi Kendra for low-cost medicines and
            hospitals where treatment may be free.
          </p>

          <div className="relative max-w-2xl mx-auto mb-8">
            <div className="hidden md:flex items-center  bg-surface-container-lowest rounded-xl shadow-[0_32px_48px_rgba(45,52,51,0.04)] pl-3 pr-2 py-1"> 

              <span className="material-symbols-outlined text-outline mr-2" aria-hidden="true">search</span>

              <input
                  className="w-full bg-transparent py-4 text-base text-on-surface placeholder:text-outline-variant border-none focus:outline-none focus:ring-0"
                  placeholder="Search nearby Jan Aushadhi Kendra"
                  type="text"
                  aria-label="Search Jan Aushadhi Kendra"
              />

              <Link href="/jan-aushadhi-kendra" className="hidden md:block bg-primary text-on-primary px-6 py-3 rounded-lg font-bold whitespace-nowrap hover:bg-primary-dim transition-all shadow-sm active:scale-95 cursor-pointer">
                Find Kendra
              </Link> 
            </div>

            <Link href="/jan-aushadhi-kendra" className="md:hidden mt-1 bg-primary text-on-primary px-10 py-3 md:px-15 md:py-4 md:text-lg  rounded-lg font-bold whitespace-nowrap hover:bg-primary-dim transition-all shadow-sm cursor-pointer">
              Find Kendra
            </Link>
          </div>
          <div className="flex items-start justify-center gap-2 text-on-surface-variant/70 text-sm font-medium ">
            <span
              className="material-symbols-outlined text-primary scale-75"
              style={{ fontVariationSettings: '"FILL" 1' }}
              aria-hidden="true"
            >
              verified_user
            </span>
            Based on Jan Aushadhi and Ayushman Bharat data
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="px-6 py-24 max-w-7xl mx-auto" aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">Our Core Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <article className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg transition-shadow border-b-4 border-primary/10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-on-primary-container text-3xl" aria-hidden="true">
                medication
              </span>
            </div>
            <h3 className="font-headline text-xl font-bold mb-3 text-on-surface">
              Low-Cost Medicines Nearby
            </h3>
            <p className="text-on-surface-variant leading-relaxed">
              Find Jan Aushadhi stores where medicines cost much less.
            </p>
          </article>
          
          <article className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg transition-shadow border-b-4 border-secondary/10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-secondary-container rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-on-secondary-container text-3xl" aria-hidden="true">
                volunteer_activism
              </span>
            </div>
            <h3 className="font-headline text-xl font-bold mb-3 text-on-surface">
              Free Treatment (If Eligible)
            </h3>
            <p className="text-on-surface-variant leading-relaxed">
              Locate hospitals where treatment may be free under a government scheme.
            </p>
          </article>

          <article className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg transition-shadow border-b-4 border-primary/10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-tertiary-fixed-dim rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-on-tertiary-fixed text-3xl" aria-hidden="true">
                search_insights
              </span>
            </div>
            <h3 className="font-headline text-xl font-bold mb-3 text-on-surface">
              Know Cheaper Medicine Options
            </h3>
            <p className="text-on-surface-variant leading-relaxed">
              Check if your prescribed medicine has a lower-cost alternative with the same effect.
            </p>
          </article>
        </div>
      </section>

      {/* Info Sections */}
      <section className="py-24 px-6 max-w-7xl mx-auto space-y-32">

        {/* Ayushman Bharat */}
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
            <span className="inline-block px-4 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-wider mb-6">
              Ayushman Bharat
            </span>
            <h2 className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface mb-6">
              Free Treatment up to ₹5 Lakh
            </h2>
            <p className="text-lg text-on-surface-variant leading-relaxed mb-8">
              The Pradhan Mantri Jan Arogya Yojana (PM-JAY) provides free
              healthcare coverage for secondary and tertiary hospitalization.
              Eligible families can access cashless treatment across thousands
              of empanelled hospitals.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span
                  className="material-symbols-outlined text-secondary"
                  style={{ fontVariationSettings: '"FILL" 1' }}
                  aria-hidden="true"
                >
                  check_circle
                </span>
                <span className="text-on-surface-variant">
                  Covers pre-existing illnesses from day one
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className="material-symbols-outlined text-secondary"
                  style={{ fontVariationSettings: '"FILL" 1' }}
                  aria-hidden="true"
                >
                  check_circle
                </span>
                <span className="text-on-surface-variant">
                  Cashless and paperless access to services
                </span>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-2xl">
            <img
              className="w-full h-[400px] object-cover"
              alt="Ayushman Bharat hospital interior"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjoZRqATRJjWAXTPB3OrI0SNutSjFX0gkQtFfg70HQPIokbtsD2pNHdW0E4VG6hB39xjCtmkJHSvq7hITNJftln51vVSC0kq1x8mnttyUqe254k9bAWUNug70AtEd358S2AQzjFSQKCMrjjIWG4h6rQ3gCoh262cWgFmDRNj7cvZoHg150Vw7DqB8u-hxlDVXYXi26pIf_snzPFZ56CeTDCVFvBEz2miz5mXVUCq0-3fzuFd56nUlx6gjamMObL8AOa2oV30TaUNE"
            />
          </div>
        </div>

        {/* Jan Aushadhi */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-16">
          <div className="w-full md:w-1/2">
            <span className="inline-block px-4 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-bold uppercase tracking-wider mb-6">
              Jan Aushadhi
            </span>
            <h2 className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface mb-6">
              Medicines at Lower Prices
            </h2>
            <p className="text-lg text-on-surface-variant leading-relaxed mb-8">
              Generic medicines are chemically identical to branded ones but
              cost significantly less. Jan Aushadhi stores ensure you get
              high-quality, safe treatment without the heavy brand premium.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontVariationSettings: '"FILL" 1' }}
                  aria-hidden="true"
                >
                  health_and_safety
                </span>
                <span className="text-on-surface-variant">
                  Quality tested at NABL accredited labs
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontVariationSettings: '"FILL" 1' }}
                  aria-hidden="true"
                >
                  health_and_safety
                </span>
                <span className="text-on-surface-variant">
                  Up to 50-90% cheaper than branded drugs
                </span>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-2xl">
            <img
              className="w-full h-[400px] object-cover"
              alt="Jan Aushadhi generic medicines"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAm3AwLGXZAHDI6KySimHS46wTm2wPDv5VkDjZqwdR0TufZ2hpxeLHwjebqKWotBw0QST4kRrLzq2kwJZb4tw-doxAsmWdsCVXEA0micfka9_QMBtjFEVYW2ippMBMOZddAB4p6vEOnfHBV7JNBpkJVvSuBi4BSMLc08o9Sy50sUznFmxGXZJd2WpshaDhKq7Cx6YbY71UDPRUJrPHFdFX5h41eQuz39gVNJvrPb-nsdAsfDJD746wJTa4v2FPy8SKNg3aJkSG2Ikw"
            />
          </div>
        </div>
      </section>

      {/* Doctor / Pharmacist Section */}
      <section className="bg-surface-container py-20 px-6">
        <div className="max-w-4xl mx-auto bg-surface-container-lowest rounded-2xl p-8 md:p-12 shadow-[0_32px_48px_rgba(45,52,51,0.04)] text-center">
          <h3 className="font-headline text-2xl font-bold mb-2">
            For Doctors &amp; Pharmacists
          </h3>
          <p className="text-on-surface-variant mb-8">
            Quickly find generic equivalents for branded prescriptions.
          </p>
          <MedicineSearch />
          <p className="mt-4 text-xs text-outline">
            Powered by the PMBI Generic Medicine Database
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-headline text-3xl md:text-5xl font-extrabold mb-8 text-on-surface leading-tight">
            No one should skip treatment because of cost.
          </h2>
          <button className="bg-primary hover:bg-primary-dim text-on-primary text-xl px-12 py-5 rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl active:scale-95 focus:ring-4 focus:ring-primary/20">
            Find Nearby Centres
          </button>
          <p className="mt-8 text-on-surface-variant/60 font-medium">
            Helping millions access dignified healthcare every day.
          </p>
        </div>
      </section>

      {/* Floating Action Button */}
      <button 
        className="fixed bottom-8 right-8 bg-primary text-on-primary w-14 h-14 rounded-full flex items-center justify-center shadow-2xl z-40 hover:scale-110 active:scale-90 transition-transform focus:ring-4 focus:ring-primary/40"
        aria-label="View on Map"
        type="button"
      >
        <span className="material-symbols-outlined">map</span>
      </button>
    </>
  );
}
