import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-container-low border-t border-on-surface/5 py-16">
      <div className="max-w-7xl mx-auto px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
        <div className="space-y-4">
          <div className="font-headline font-semibold text-primary text-xl">
            Upchaar Aayog
          </div>
          <p className="text-slate-500 max-w-xs leading-relaxed">
            Making essential healthcare and medicines accessible to every
            citizen through transparency and data.
          </p>
        </div>

        <nav aria-label="Footer Navigation">
          <ul className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm font-body">
            <li>
              <Link href="/privacy" className="text-slate-500 hover:text-primary transition-all">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-slate-500 hover:text-primary transition-all">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-slate-500 hover:text-primary transition-all">
                Contact Support
              </Link>
            </li>
            <li>
              <Link href="/transparency" className="text-slate-500 hover:text-primary transition-all">
                Data Transparency
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-12 mt-12 pt-8 border-t border-on-surface/5 text-center md:text-left">
        <p className="text-slate-400 text-sm">
          © {currentYear} Upchaar Aayog. Based on government data.
        </p>
      </div>
    </footer>
  );
}
