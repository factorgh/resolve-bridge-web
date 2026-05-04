'use client';

import Link from 'next/link';
import { Mail, MapPin, ArrowRight } from 'lucide-react';

// Using consistent SVG paths for brand icons since Lucide doesn't support them
const SOCIAL_LINKS = [
  { 
    name: 'LinkedIn', 
    href: '#', 
    path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" 
  },
  { 
    name: 'X (Twitter)', 
    href: '#', 
    path: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" 
  },
  { 
    name: 'Instagram', 
    href: '#', 
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" 
  }
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#020617] pt-24 pb-12 text-slate-300">
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          
          <div className="lg:col-span-4 flex flex-col space-y-8">
            <Link href="/" className="transition-opacity hover:opacity-80">
              <img 
                src="/images/resolve_logo.png" 
                alt="ResolveBridge" 
                className="h-10 w-auto object-contain brightness-0 invert" 
              />
            </Link>
            <p className="max-w-sm text-lg font-medium leading-relaxed text-slate-400">
              The institutional financial engine bridging the credit gap across Africa through <span className="text-white font-semibold">intelligent tech.</span>
            </p>
            
            {/* Hand-coded SVG Socials for brand consistency */}
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:border-blue-500/50 hover:bg-blue-500/10"
                >
                  <svg 
                    role="img" 
                    viewBox="0 0 24 24" 
                    className="h-5 w-5 fill-slate-400 group-hover:fill-blue-400 transition-colors"
                  >
                    <path d={social.path} />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Marketplace</h4>
              <ul className="space-y-4">
                <FooterLink href="/loans">Credit & Loans</FooterLink>
                <FooterLink href="/bnpl">BNPL Plans</FooterLink>
                <FooterLink href="/insurance">Insurance Hub</FooterLink>
                <FooterLink href="/resolve-vehicles">Resolve Vehicles</FooterLink>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Organization</h4>
              <ul className="space-y-4">
                <FooterLink href="/about">Our Mission</FooterLink>
                <FooterLink href="/features">Integrations</FooterLink>
                <FooterLink href="/contact">Join Network</FooterLink>
                <FooterLink href="/privacy">Legal Policy</FooterLink>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Newsletter</h4>
            <p className="text-sm text-slate-500">Get institutional insights delivered to your inbox.</p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-4 pr-12 text-sm outline-none transition-all focus:border-blue-500/50"
              />
              <button className="absolute right-2 top-1.5 rounded-md bg-blue-600 p-1.5 text-white transition-transform hover:scale-105 active:scale-95">
                <ArrowRight size={16} />
              </button>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-3 text-slate-400">
                <Mail size={16} className="text-blue-500" />
                <span className="text-sm font-semibold text-white">support@resolvebridge.com</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span className="text-sm font-semibold text-white">0249709299 / 0246219871</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-blue-500 mt-1" />
                <span className="text-sm leading-tight">Airport City Business Park,<br />Accra, Ghana</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
            © {new Date().getFullYear()} ResolveBridge Global. Built for the future of Africa.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link 
        href={href} 
        className="group flex items-center text-sm font-medium text-slate-400 transition-colors hover:text-white"
      >
        <span className="h-[1px] w-0 bg-blue-500 transition-all duration-300 group-hover:mr-2 group-hover:w-3" />
        {children}
      </Link>
    </li>
  );
}