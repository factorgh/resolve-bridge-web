'use client';

import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, ArrowRight, Shield, Zap, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import PageTemplate from '../components/PageTemplate';

export default function LoansPage() {
  const benefits = [
    "Competitive Interest Rates",
    "Flexible 12-36 Month Terms",
    "No Collateral for Small Business",
    "Instant Digital Disbursement",
    "Automated Repayments",
    "Credit Limit Re-evaluation"
  ];

  return (
    <PageTemplate 
      title="Institutional" 
      gradientTitle="Capital"
      subtitle="Access world-class credit solutions for SMEs and individuals, powered by Africa's most transparent search engine."
      noCard={true}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10rem', paddingBottom: '8rem' }}>
        
        {/* Main Content Split */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '6rem', alignItems: 'center' }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            <div className="glass-card" style={{ padding: '6rem 4rem', background: 'var(--foreground)', color: 'white', borderRadius: '40px', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-lg), var(--shadow-glow)' }}>
              <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, var(--primary-glow), transparent)', opacity: 0.3 }}></div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                 <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '3rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <CreditCard size={32} />
                 </div>
                 <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '2rem', letterSpacing: '-0.04em' }}>Business & Personal <span className="gradient-text italic">Credit</span></h2>
                 <p style={{ opacity: 0.7, fontSize: '1.2rem', lineHeight: 1.8, marginBottom: '3.5rem', fontWeight: 500 }}>Whether you're scaling an SME or managing personal finances, our integrated lender network ensures you get the most competitive rates in West and East Africa.</p>
                 
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '4rem' }}>
                    {benefits.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <CheckCircle size={10} className="text-primary" />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item}</span>
                      </div>
                    ))}
                 </div>

                 <Link href="/get-started" className="btn btn-primary" style={{ background: 'white', color: 'black', width: '100%', padding: '1.5rem', fontSize: '1.1rem' }}>
                    Apply for Funding Now <ArrowRight size={20} style={{ marginLeft: '1rem' }} />
                 </Link>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}
          >
             <div>
                <span className="section-label">Lender Hub</span>
                <h3 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>Bridging the Capital Gap Across <span className="gradient-text italic">Africa.</span></h3>
                <p style={{ color: 'var(--muted)', fontSize: '1.2rem', lineHeight: 1.8, fontWeight: 500 }}>ResolveBridge leverages advanced matching algorithms to connect you with lenders that actually understand your risk profile. No more endless paperwork or generic loan offers.</p>
             </div>

             <div className="glass-card" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', gap: '2.5rem', borderRadius: '32px' }}>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                   <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      <TrendingUp size={28} />
                   </div>
                   <div>
                      <p style={{ fontSize: '1.75rem', fontWeight: 900 }}>2.5% <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--muted)' }}>Avg. Monthly</span></p>
                      <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>Lowest Market Interest Rate</p>
                   </div>
                </div>
                <div style={{ height: '1px', background: 'var(--card-border)' }}></div>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                   <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      <Zap size={28} />
                   </div>
                   <div>
                      <p style={{ fontSize: '1.75rem', fontWeight: 900 }}>24hr <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--muted)' }}>Disbursement</span></p>
                      <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>Standard Payout Time</p>
                   </div>
                </div>
                <div style={{ height: '1px', background: 'var(--card-border)' }}></div>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                   <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      <Shield size={28} />
                   </div>
                   <div>
                      <p style={{ fontSize: '1.75rem', fontWeight: 900 }}>Secure <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--muted)' }}>Search</span></p>
                      <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>Bank-Grade Data Protection</p>
                   </div>
                </div>
             </div>
          </motion.div>
        </div>

        {/* Closing Scale Action */}
        <section style={{ textAlign: 'center', paddingTop: '4rem' }}>
           <div className="glass-card" style={{ padding: '6rem 2rem', background: 'rgba(0,0,0,0.02)', borderRadius: '40px', border: '1px solid var(--card-border)' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem' }}>Ready to <span className="gradient-text italic">Fund Your Growth?</span></h2>
              <p style={{ color: 'var(--muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 4rem', fontWeight: 500 }}>Join thousands of African businesses scaling their dreams with ResolveBridge capital solutions.</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                 <Link href="/get-started" className="btn btn-primary" style={{ padding: '1.25rem 3rem' }}>Launch Free Search</Link>
                 <Link href="/contact" className="btn btn-secondary" style={{ padding: '1.25rem 3rem' }}>Contact Capital Expert</Link>
              </div>
           </div>
        </section>
      </div>
    </PageTemplate>
  );
}
