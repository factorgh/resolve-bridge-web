'use client';

import Link from 'next/link';
import { Globe, Users, Shield, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="container footer-container" style={{ paddingBottom: '4rem' }}>
        <div className="footer-brand">
          <Link href="/" className="footer-logo" style={{ fontSize: '1.75rem', fontWeight: '900', display: 'block', marginBottom: '1.5rem' }}>
            Resolve<span className="gradient-text italic">Bridge</span>
          </Link>
          <p className="footer-desc" style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '2.5rem' }}>
            The most comprehensive financial search engine across Africa. Bridging the gap for a better financial future through transparency and technology.
          </p>
          <div className="social-links" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <a href="#" className="social-icon"><Globe size={18} /></a>
            <a href="#" className="social-icon"><Users size={18} /></a>
            <a href="#" className="social-icon"><Shield size={18} /></a>
          </div>
        </div>

        <div className="footer-links" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', flex: '1' }}>
          <div className="footer-col">
            <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--foreground)' }}>Hub Modules</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href="/loans" style={{ fontSize: '0.875rem', color: 'var(--muted)', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}>Credit & Loans</Link>
              <Link href="/bnpl" style={{ fontSize: '0.875rem', color: 'var(--muted)', transition: 'color 0.2s' }}>BNPL Installments</Link>
              <Link href="/insurance" style={{ fontSize: '0.875rem', color: 'var(--muted)', transition: 'color 0.2s' }}>Insurance Marketplace</Link>
              <Link href="/resolve-vehicles" style={{ fontSize: '0.875rem', color: 'var(--muted)', transition: 'color 0.2s' }}>Resolve Vehicles</Link>
            </div>
          </div>
          <div className="footer-col">
            <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--foreground)' }}>Organization</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href="/about" style={{ fontSize: '0.875rem', color: 'var(--muted)', transition: 'color 0.2s' }}>Our Mission</Link>
              <Link href="/features" style={{ fontSize: '0.875rem', color: 'var(--muted)', transition: 'color 0.2s' }}>Platform Features</Link>
              <Link href="/contact" style={{ fontSize: '0.875rem', color: 'var(--muted)', transition: 'color 0.2s' }}>Join Our Team</Link>
              <Link href="/privacy" style={{ fontSize: '0.875rem', color: 'var(--muted)', transition: 'color 0.2s' }}>Privacy Commitments</Link>
            </div>
          </div>
          <div className="footer-col">
            <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--foreground)' }}>Connect</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--muted)', fontSize: '0.875rem' }}><Mail size={16} /> support@resolvebridge.com</div>
              <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--muted)', fontSize: '0.875rem' }}><Phone size={16} /> +233 24 000 0000</div>
              <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--muted)', fontSize: '0.875rem', lineHeight: '1.4' }}><MapPin size={16} /> Airport City, Accra, Ghana</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom" style={{ borderTop: '1px solid var(--card-border)', paddingTop: '3rem', textAlign: 'center', background: 'var(--background)', position: 'relative', zIndex: '10' }}>
         <p style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>© {new Date().getFullYear()} ResolveBridge Global. Built for Pan-African Expansion.</p>
      </div>

      <style jsx>{`
        .social-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.03);
          border: 1px solid var(--card-border);
          color: var(--muted);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .social-icon:hover {
          background: var(--primary);
          color: white;
          transform: translateY(-4px);
          box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2);
          border-color: var(--primary);
        }
      `}</style>
    </footer>
  );
}
