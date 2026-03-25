'use client';

import { motion } from 'framer-motion';
import { Shield, CheckCircle, ArrowRight, HeartPulse, Car, Globe, Ship, Zap } from 'lucide-react';
import Link from 'next/link';
import PageTemplate from '../components/PageTemplate';

export default function InsurancePage() {
  const insuranceTypes = [
    { icon: Car, title: "Automotive & Fleet", description: "Comprehensive coverage for your vehicles and commercial fleets across 4 markets.", color: "var(--primary)" },
    { icon: HeartPulse, title: "Health & Life", description: "Secure your future with affordable family and team health coverage options.", color: "var(--secondary)" },
    { icon: Ship, title: "Transport & Logistics", description: "Specialized coverage for high-value assets and goods in transit internationally.", color: "#10b981" },
    { icon: Globe, title: "Travel Protection", description: "Global travel insurance with direct payouts and local emergency support.", color: "#f59e0b" }
  ];

  return (
    <PageTemplate 
      title="Uncompromising" 
      gradientTitle="Protection"
      subtitle="One search engine. Infinite insurance possibilities. Secure your assets and health with Africa's most trusted partners."
      noCard={true}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem', paddingBottom: '8rem' }}>
        
        {/* Insurance Grid */}
        <section>
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 6rem' }}>
             <span className="section-label">Coverage Modules</span>
             <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>Asset & Health <span className="gradient-text italic">Protection</span></h2>
             <p style={{ color: 'var(--muted)', fontSize: '1.15rem', fontWeight: 500 }}>Comprehensive coverage options tailored for the African continent's unique business and personal environments.</p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}
          >
            {insuranceTypes.map((t, idx) => (
              <motion.div 
                key={idx} 
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                }}
                className="glass-card" 
                style={{ padding: '3.5rem 2.5rem', borderRadius: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', boxShadow: 'var(--shadow-md)' }}
              >
                <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.color }}>
                  <t.icon size={32} />
                </div>
                <div>
                   <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem' }}>{t.title}</h3>
                   <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.7, fontWeight: 500 }}>{t.description}</p>
                </div>
                <Link href="/get-started" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', borderRadius: '50px', fontSize: '0.85rem' }}>
                  Get Quote <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA Section */}
        <section style={{ paddingTop: '4rem' }}>
           <div className="glass-card" style={{ padding: '8rem 4rem', borderRadius: '48px', background: 'linear-gradient(135deg, var(--foreground), #1e293b)', color: 'white', position: 'relative', overflow: 'hidden' }}>
              <div className="ambient-glow" style={{ top: '-30%', left: '-10%', opacity: 0.2 }}></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '6rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                 <div>
                    <h2 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '2.5rem', letterSpacing: '-0.04em', lineHeight: 1 }}>Secure Your <br/> <span className="gradient-text italic">Dreams</span> Today.</h2>
                    <p style={{ opacity: 0.7, fontSize: '1.25rem', lineHeight: 1.8, marginBottom: '4rem', fontWeight: 500 }}>Don't wait for the unexpected. Our integrated marketplace allows you to compare and procure the best insurance products in under 5 minutes.</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                       {[
                         "Verified Insurers Only",
                         "Instant Quote Generation",
                         "Direct Digitized Claim Support",
                         "Multi-Market Regulatory Compliance"
                       ].map((item, i) => (
                         <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                           <Shield className="text-primary" size={20} />
                           <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>{item}</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                 >
                    <div className="glass-card" style={{ padding: '6rem 4rem', background: 'white', border: 'none', textAlign: 'center', borderRadius: '40px', boxShadow: 'var(--shadow-lg)' }}>
                       <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', margin: '0 auto 3rem' }}>
                          <Shield size={50} />
                       </div>
                       <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1.5rem', color: 'var(--foreground)' }}>Uncompromising <br/> Security Profile.</h3>
                       <p style={{ color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3.5rem' }}>Get a comprehensive quote across 50+ partners instantly.</p>
                       <Link href="/get-started" className="btn btn-primary" style={{ width: '100%', padding: '1.5rem', fontSize: '1.1rem' }}>Get Insurance Quote <ArrowRight size={20} style={{ marginLeft: '1rem' }} /></Link>
                    </div>
                 </motion.div>
              </div>
           </div>
        </section>

        {/* Closing Action */}
        <section style={{ textAlign: 'center', paddingTop: '6rem' }}>
           <div className="glass-card" style={{ padding: '6rem 2rem', background: 'rgba(0,0,0,0.02)', borderRadius: '40px', border: '1px solid var(--card-border)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', margin: '0 auto 2.5rem' }}>
                 <Zap size={32} />
              </div>
              <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem' }}>Protect What <span className="gradient-text italic">Matters.</span></h2>
              <p style={{ color: 'var(--muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 4rem', fontWeight: 500 }}>Join thousands of Africans scaling their financial future with complete insurance security.</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                 <Link href="/get-started" className="btn btn-primary" style={{ padding: '1.25rem 3rem' }}>Search Insurance Now</Link>
                 <Link href="/contact" className="btn btn-secondary" style={{ padding: '1.25rem 3rem' }}>Contact Insurance Agent</Link>
              </div>
           </div>
        </section>
      </div>
    </PageTemplate>
  );
}
