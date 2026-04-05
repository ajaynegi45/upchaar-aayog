"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/jan-aushadhi-kendra", label: "Jan Aushadhi" },
    { href: "/pmjay-hospital", label: "PMJAY Hospital" },
    { href: "/generic-medicine", label: "Medicine" },
  ];

  return (
    <nav 
      className="fixed top-0 w-full z-50 glass-nav shadow-[0_32px_48px_rgba(45,52,51,0.04)]"
      aria-label="Main Navigation"
    >
      <div className="flex justify-between items-center px-8 h-20 max-w-7xl mx-auto font-headline tracking-tight">
        <Link 
          href="/" 
          className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity"
          onClick={() => setIsOpen(false)}
        >
          Upchaar Aayog
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href}
              className="text-primary hover:border-b-2 border-primary pb-1 font-semibold hover:text-primary-dim transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden">
          <button 
            type="button"
            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors z-50 relative"
            aria-label={isOpen ? "Close Mobile Menu" : "Open Mobile Menu"}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="material-symbols-outlined text-3xl">
              {isOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-surface/95 backdrop-blur-xl z-40 transition-all duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-y-[-10px]"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 px-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href}
              className="text-3xl font-headline font-black text-primary hover:text-primary-dim transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          
          <Link 
            href="/"
            className="mt-8 text-on-surface-variant font-bold text-sm tracking-widest uppercase opacity-60"
            onClick={() => setIsOpen(false)}
          >
            Home Page
          </Link>
        </div>
      </div>
    </nav>
  );
}
