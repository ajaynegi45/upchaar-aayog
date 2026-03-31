import MedicineSearch from "@/components/MedicineSearch";

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
            <div className="flex items-center bg-surface-container-lowest rounded-xl shadow-[0_32px_48px_rgba(45,52,51,0.04)] pl-3 pr-2 py-1">

              <span className="material-symbols-outlined text-outline mr-2" aria-hidden="true">search</span>

              <input
                  className="w-full bg-transparent py-4 text-base text-on-surface placeholder:text-outline-variant border-none focus:outline-none focus:ring-0"
                  placeholder="Search nearby Jan Aushadhi Kendra"
                  type="text"
                  aria-label="Search Jan Aushadhi Kendra"
              />

              <button className="hidden md:block bg-primary text-on-primary px-6 py-3 rounded-lg font-bold whitespace-nowrap hover:bg-primary-dim transition-all shadow-sm active:scale-95 cursor-pointer">
                Find Kendra
              </button>
            </div>

            <button className="md:hidden w-full mt-3 bg-primary text-on-primary px-6 py-2 rounded-lg font-bold whitespace-nowrap hover:bg-primary-dim transition-all shadow-sm cursor-pointer">
              Find Kendra
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 text-on-surface-variant/70 text-sm font-medium">
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

      {/* Centres Near You */}
      <section className="bg-surface-container-low py-24 px-6" aria-labelledby="centres-heading">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 id="centres-heading" className="font-headline text-3xl font-extrabold text-on-surface">
                Centres Near You
              </h2>
              <p className="text-on-surface-variant">
                Nearest options based on your location
              </p>
            </div>
            <nav className="flex flex-wrap gap-2" aria-label="Centre type filter">
              <button className="px-4 py-2 bg-primary text-on-primary rounded-full text-sm font-semibold shadow-sm focus:ring-2 focus:ring-primary focus:ring-offset-2">
                All
              </button>
              <button className="px-4 py-2 bg-surface-container-highest text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-colors rounded-full text-sm font-medium focus:ring-2 focus:ring-primary focus:ring-offset-2">
                Low-Cost Medicines
              </button>
              <button className="px-4 py-2 bg-surface-container-highest text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container transition-colors rounded-full text-sm font-medium focus:ring-2 focus:ring-primary focus:ring-offset-2">
                Free Treatment
              </button>
            </nav>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              {/* Card 1: Jan Aushadhi */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-primary/5 bg-gradient-to-r from-primary-container/5 to-transparent">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-primary-container" aria-hidden="true">
                        local_pharmacy
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-on-surface text-lg">
                          Jan Aushadhi Kendra
                        </h4>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded">
                          Low Cost
                        </span>
                      </div>
                      <p className="text-primary font-bold text-sm mb-1">
                        1.2 km away
                      </p>
                      <p className="text-on-surface-variant text-sm">
                        Low-cost medicines available
                      </p>
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-2">
                    <button className="flex-1 sm:flex-none px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-lg hover:bg-primary-dim transition-colors">
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2: Hospital */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-secondary/5 bg-gradient-to-r from-secondary-container/5 to-transparent">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-secondary-container rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-secondary-container" aria-hidden="true">
                        local_hospital
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-on-surface text-lg">
                          Hospital (Ayushman)
                        </h4>
                        <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider rounded">
                          Free Treatment
                        </span>
                      </div>

                      <p className="text-on-surface-variant text-sm">
                        Free treatment (if eligible)
                      </p>
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-2 justify-center">
                    <p className="text-secondary font-bold text-sm mb-1">
                      2.5 km away
                    </p>
                    <button className="flex-1 sm:flex-none px-4 py-2 bg-secondary text-on-secondary text-xs font-bold rounded-lg hover:bg-secondary-dim transition-colors">
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Image container with ARIA role */}
            <div 
              className="rounded-2xl overflow-hidden shadow-xl aspect-square md:aspect-video lg:aspect-square relative group border border-on-surface/5"
              role="img" 
              aria-label="Map showing nearby Jan Aushadhi and Hospital centres in New Delhi"
            >
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Map interface with digital markers"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaCf6AL2qZ1KDuGPcqXbbEsJ1JviVdXPUprEAV6s9XcaKTv1wEGGoQLqkzmqDqBzXitu9ss7PcbXHpCS9_QH12OZVhqDeUDKDjdld9jXt51EF9k2sedwWZJojBG48-9C_PDtojLDhP_N8f-iqtUfFw3ZikbtrXp9LVGmfVa5l8J4XxTRaH_1X2s0QJalp8okxSc9vu5kwT6ak4HvSPJM5PHfRWiV5d-GBV1Tk-BfeHD6gq3eLHL0_uYEt9YBoN_k2ZH9649ETj84A"
              />
              <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
              <div className="absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur-md p-3 rounded-lg shadow-lg">
                <span className="material-symbols-outlined text-primary" aria-hidden="true">
                  my_location
                </span>
              </div>
            </div>
          </div>
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
