import Link from "next/link";

export default function Navbar() {
  return (
    <nav 
      className="fixed top-0 w-full z-50 glass-nav shadow-[0_32px_48px_rgba(45,52,51,0.04)]"
      aria-label="Main Navigation"
    >
      <div className="flex justify-between items-center px-8 h-20 max-w-7xl mx-auto font-headline tracking-tight">
        <Link href="/" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
          Upchaar Aayog
        </Link>
        
        <div className="hidden md:flex gap-8 items-center">
          <Link 
            href="/jan-aushadhi-kendra"
            className="text-primary hover:border-b-2 border-primary pb-1 font-semibold hover:text-primary-dim transition-colors"
          >
            Jan Aushadhi
          </Link>

          <Link
              href="/pmjay-hospital"
              className="text-primary hover:border-b-2 border-primary pb-1 font-semibold hover:text-primary-dim transition-colors"
          >
            PMJAY Hospital
          </Link>

          <Link
              href="/generic-medicine"
              className="text-primary hover:border-b-2 border-primary pb-1 font-semibold hover:text-primary-dim transition-colors"
          >
            Medicine
          </Link>

          {/*<button */}
          {/*  type="button"*/}
          {/*  className="bg-primary hover:bg-primary-dim text-white px-6 py-2 rounded-lg font-semibold transition-all active:scale-95 shadow-sm hover:shadow-md hover:cursor-pointer"*/}
          {/*>*/}
          {/*  About Us*/}
          {/*</button>*/}
        </div>

        <div className="md:hidden">
          <button 
            type="button"
            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
            aria-label="Open Mobile Menu"
          >
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
