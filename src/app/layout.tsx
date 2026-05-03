import type { Metadata } from "next";
import "./globals.css";
import MUIRegistry from "./components/MUIRegistry";
import ConditionalLayout from "./components/ConditionalLayout";
import StoreProvider from "./StoreProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "ResolveBridge | Africa's Financial Search Engine",
  description: "Connect with the best loans, BNPL, and insurance providers in Ghana, Nigeria, Kenya and beyond. Bridging the gap for a better financial future.",
  metadataBase: new URL('https://resolvebridge.com'),
  manifest: "/manifest.json",
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
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0d1b3e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        <MUIRegistry>
          <StoreProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
            <Toaster position="top-right" reverseOrder={false} />
          </StoreProvider>
        </MUIRegistry>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                  // Unregister service worker in development to avoid 404 errors on reload
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for(let registration of registrations) {
                      registration.unregister();
                    }
                  });
                } else {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').then(function(registration) {
                      console.log('SW registered: ', registration);
                    }, function(err) {
                      console.log('SW registration failed: ', err);
                    });
                  });
                }
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
