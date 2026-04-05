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
      className="fixed top-0 w-full z-50 bg-white border-b border-gray-100 h-16 sm:h-20"
      aria-label="Main Navigation"
    >
      <div className="flex justify-between items-center px-6 h-full max-w-7xl mx-auto">
        <Link 
          href="/" 
          className="text-xl sm:text-2xl font-bold text-primary hover:opacity-80 transition-opacity whitespace-nowrap"
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
              className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden">
          <button 
            type="button"
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors z-50 relative"
            aria-label={isOpen ? "Close Mobile Menu" : "Open Mobile Menu"}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="material-symbols-outlined text-2xl">
              {isOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-white z-40 transition-all duration-300 md:hidden flex items-center justify-center ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-y-[-10px]"
        }`}
      >
        <div className="flex flex-col items-center justify-center w-full gap-8 px-6 text-center">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href}
              className="text-2xl font-bold text-gray-900 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          
          <Link 
            href="/"
            className="mt-4 text-gray-500 font-medium text-sm tracking-widest uppercase"
            onClick={() => setIsOpen(false)}
          >
            Home Page
          </Link>
        </div>
      </div>
    </nav>
  );
}
