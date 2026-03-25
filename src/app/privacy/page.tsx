'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, ArrowLeft, Globe, Zap, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import PageTemplate from '../components/PageTemplate';

export default function PrivacyPage() {
  const sections = [
    { icon: Lock, title: "Data Architecture", content: "We use 256-bit AES encryption to protect your financial and personal data at all times. Our systems are audited by third-party security firms regularly." },
    { icon: Eye, title: "Radical Transparency", content: "We only collect data that is strictly necessary for matching you with financial products. We never sell your data to third parties without explicit consent." },
    { icon: Globe, title: "Global Compliance", content: "We comply with GDPR and local data protection regulations in Ghana, Nigeria, Kenya, and South Africa to ensure cross-border security." }
  ];

  return (
    <PageTemplate 
      title="Privacy" 
      gradientTitle="Architecture"
      subtitle="Your data is your most valuable asset. Our commitment is to protect it with institutional-grade security protocols."
      noCard={true}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem', paddingBottom: '8rem' }}>
        
        <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {sections.map((s, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.8 }}
                  className="glass-card" 
                  style={{ padding: '4rem', borderRadius: '32px', display: 'flex', gap: '3rem', alignItems: 'center', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--card-border)' }}
                >
                   <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0, boxShadow: 'var(--shadow-md)' }}>
                      <s.icon size={40} />
                   </div>
                   <div>
                      <h3 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em' }}>{s.title}</h3>
                      <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: 1.7, fontWeight: 500 }}>{s.content}</p>
                   </div>
                </motion.div>
              ))}
           </div>

           <motion.div 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             style={{ marginTop: '6rem', padding: '4rem', borderRadius: '40px', background: 'var(--foreground)', color: 'white', position: 'relative', overflow: 'hidden' }}
           >
              <div className="ambient-glow" style={{ top: '-40%', right: '-20%', opacity: 0.2 }}></div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(37, 99, 235, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                       <Zap size={20} />
                    </div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Resolution & Updates</h4>
                 </div>
                 <p style={{ opacity: 0.7, fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2rem', fontWeight: 500 }}>
                    This policy was last updated on March 25, 2026. We may update this policy as our services evolve and to comply with new regulations. Continued use of ResolveBridge after an update constitutes acceptance of the modified policy.
                 </p>
                 <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '2rem' }}></div>
                 <p style={{ opacity: 0.9, fontSize: '1rem', fontWeight: 600 }}>
                    For any privacy-related inquiries, contact our Data Protection Officer: <br/>
                    <span className="gradient-text italic" style={{ fontSize: '1.25rem', fontWeight: 900 }}>privacy@resolvebridge.com</span>
                 </p>
              </div>
           </motion.div>
        </div>

        {/* Closing Action */}
        <section style={{ textAlign: 'center', paddingTop: '4rem' }}>
           <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center', color: 'var(--muted)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <CheckCircle size={16} style={{ color: '#16a34a' }} /> ISO/IEC 27001 Certified Environment
           </div>
        </section>
      </div>
    </PageTemplate>
  );
}
