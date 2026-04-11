import type {Metadata} from "next";
import {Inter, Manrope} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// https://boneyard.vercel.app/overview
import "../bones/registry";
// import BonesRegistryLoader from "@/components/BonesRegistryLoader";


const manrope = Manrope({
    variable: "--font-manrope",
    subsets: ["latin"],
    weight: ["400", "600", "700", "800"],
});

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
    title: "Upchaar Aayog | Find Affordable Healthcare",
    description:
        "Locate nearby Jan Aushadhi stores for low-cost medicines and hospitals where treatment may be free under Ayushman Bharat. Empowering citizens through health transparency.",
    keywords: ["Jan Aushadhi", "Ayushman Bharat", "Affordable Medicine", "Generic Medicine", "Free Treatment India"],
    authors: [{name: "Upchaar Aayog Team"}],
    openGraph: {
        title: "Upchaar Aayog | Find Affordable Healthcare",
        description: "Locate nearby Jan Aushadhi stores for low-cost medicines and hospitals where treatment may be free.",
        type: "website",
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
        <head>
            <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
            <link
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                rel="stylesheet"/>
        </head>
        <body className="bg-surface text-on-surface antialiased min-h-screen flex flex-col">
        {/*<BonesRegistryLoader/>*/}
        <Navbar/>
        <main className="grow pt-20">
            {children}
        </main>
        <Footer/>
        </body>
        </html>
    );
}
