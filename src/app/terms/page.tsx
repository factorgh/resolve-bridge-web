'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, ShieldCheck, Zap, Globe, Lock } from 'lucide-react';
import Link from 'next/link';
import PageTemplate from '../components/PageTemplate';

export default function TermsPage() {
  const sections = [
    { title: "Platform Architecture", description: "ResolveBridge is a financial search engine. We match you with lenders and insurers, but the final agreement is between you and the institution." },
    { title: "Identity Protocols", description: "All users must undergo KYC verification. Providing false information will result in immediate termination of access to our services." },
    { title: "Settlement Terms", description: "All payments made through our integrated services (including BNPL installment payments) are governed by the respective partner's terms." },
    { title: "Intellectual Property", description: "All content, including tools, graphics, and algorithms in ResolveBridge is the exclusive property of Resolve Group." }
  ];

  return (
    <PageTemplate 
      title="Terms of" 
      gradientTitle="Service"
      subtitle="The digital agreement that governs the ResolveBridge ecosystem and ensures a transparent financial landscape."
      noCard={true}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem', paddingBottom: '8rem' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2rem' }}>
           {sections.map((s, idx) => (
             <motion.div 
               key={idx} 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: idx * 0.1, duration: 0.8 }}
               className="glass-card" 
               style={{ padding: '4.5rem', borderRadius: '40px', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', gap: '2rem' }}
             >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                   <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--foreground)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.9rem' }}>{idx + 1}</div>
                   <h3 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.02em' }}>{s.title}</h3>
                </div>
                <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: 1.7, fontWeight: 500 }}>{s.description}</p>
             </motion.div>
           ))}
        </div>

        {/* Binding Box */}
        <section>
           <div className="glass-card" style={{ padding: '8rem 4rem', borderRadius: '48px', background: 'var(--foreground)', color: 'white', position: 'relative', overflow: 'hidden', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="ambient-glow" style={{ top: '-40%', left: '-20%', opacity: 0.2 }}></div>
              <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
                 <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(37, 99, 235, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', margin: '0 auto 3.5rem' }}>
                    <ShieldCheck size={48} />
                 </div>
                 <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '2.5rem', letterSpacing: '-0.04em', lineHeight: 1 }}>By continuing, you agree to the <span className="gradient-text italic">Bridge Protocol.</span></h2>
                 <p style={{ opacity: 0.7, fontSize: '1.25rem', lineHeight: 1.8, marginBottom: '4.5rem', fontWeight: 500 }}>This agreement is binding and ensures a safe, transparent, and fair environment for all financial operations within the ResolveBridge ecosystem.</p>
                 
                 <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                    <Link href="/get-started" className="btn btn-primary" style={{ padding: '1.5rem 4rem', fontSize: '1.1rem' }}>Accept & Get Started</Link>
                    <Link href="/" className="btn btn-secondary" style={{ padding: '1.5rem 4rem', fontSize: '1.1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>Cancel</Link>
                 </div>

                 <p style={{ marginTop: '5rem', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.4 }}>Version Control: RB-2026.03.25</p>
              </div>
           </div>
        </section>

        {/* Legal Footer Info */}
        <section style={{ textAlign: 'center' }}>
           <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
              {[
                { icon: Lock, label: "Encrypted Agreement" },
                { icon: Globe, label: "Multi-Jurisdiction Valid" },
                { icon: Zap, label: "Instant Digital Signature" }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--muted)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                   <item.icon size={18} className="text-primary" /> {item.label}
                </div>
              ))}
           </div>
        </section>
      </div>
    </PageTemplate>
  );
}
