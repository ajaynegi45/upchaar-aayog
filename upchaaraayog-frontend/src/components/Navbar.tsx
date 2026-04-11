"use client";

import Link from "next/link";
import {useState} from "react";
import Image from "next/image";
import favicon from "../favicon.svg";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        {href: "/jan-aushadhi-kendra", label: "Jan Aushadhi"},
        {href: "/pmjay-hospital", label: "PMJAY Hospital"},
        // {href: "/generic-medicine", label: "Medicine"},
    ];

    return (
        <nav
            className="fixed top-0 w-full z-50 bg-white border-b border-gray-100 h-16 sm:h-20 md:bg-white/30 md:backdrop-blur-md md:border-white/20"
            aria-label="Main Navigation"
        >
            <div className="relative flex justify-between items-center px-2 md:px-6 h-full max-w-7xl mx-auto">
                <Link
                    href="/"
                    className="flex items-center gap-3 hover:opacity-80 z-[60] cursor-pointer pl-0 pt-1 pr-1 pb-1"
                    onClick={() => setIsOpen(false)}
                >
                    <Image src={favicon} alt="Upchaar Aayog" width={32} height={32}/>
                    <span className="text-xl sm:text-2xl font-bold text-[#016b5f] whitespace-nowrap">
                        Upchaar Aayog
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex gap-8 items-center">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-md font-semibold text-gray-700 hover:text-primary transition-colors p-2"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Mobile Toggle Button */}
                <div className="md:hidden relative z-[70]">
                    <button
                        type="button"
                        className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label={isOpen ? "Close Mobile Menu" : "Open Mobile Menu"}
                        onClick={() => setIsOpen(!isOpen)}
                        aria-expanded={isOpen}
                        aria-controls="mobile-menu"
                    >
            <span className="material-symbols-outlined text-2xl">
              {isOpen ? "close" : "menu"}
            </span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                id="mobile-menu"
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
