import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MUIRegistry from "./components/MUIRegistry";

export const metadata: Metadata = {
  title: "ResolveBridge | Africa's Financial Search Engine",
  description: "Connect with the best loans, BNPL, and insurance providers in Ghana, Nigeria, Kenya and beyond. Bridging the gap for a better financial future.",
  metadataBase: new URL('https://resolvebridge.com'),
  keywords: ["Africa", "finance", "search engine", "loans", "insurance", "BNPL", "Ghana", "Nigeria", "Kenya"],
  icons: {
    icon: "/resolve_icon.png",
    shortcut: "/resolve_icon.png",
    apple: "/resolve_icon.png",
  },
  openGraph: {
    title: 'ResolveBridge | Africa\'s Financial Search Engine',
    description: 'Empowering Africans with accessible financial services.',
    images: ['/og-image.jpg'],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <MUIRegistry>
          <div className="grid-bg"></div>
          <Navbar />
          {children}
          <Footer />
        </MUIRegistry>
      </body>
    </html>
  );
}
