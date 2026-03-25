'use client';

import { motion } from 'framer-motion';
import { Zap, ShoppingCart, ArrowRight, Shield, Globe, Cpu, Users } from 'lucide-react';
import Link from 'next/link';
import PageTemplate from '../components/PageTemplate';

export default function BnplPage() {
  const vendors = ["iStore Africa", "Samsung Store", "Shoprite Mall", "Jumia Ghana", "Konga Nigeria", "Decathlon Africa"];

  return (
    <PageTemplate 
      title="Split Your" 
      gradientTitle="Payments"
      subtitle="Experience financial freedom with our integrated Buy Now Pay Later partners. Split your bill, not your dreams."
      noCard={true}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem', paddingBottom: '8rem' }}>
        
        {/* Story Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '8rem', alignItems: 'center' }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}
          >
            <div>
              <span className="section-label">Retail Expansion</span>
              <h2 style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '2.5rem', letterSpacing: '-0.04em', lineHeight: 1 }}>Experience <br/> <span className="gradient-text italic">Financial Freedom</span> At Every Store.</h2>
              <p style={{ color: 'var(--muted)', fontSize: '1.25rem', lineHeight: 1.8, marginBottom: '3.5rem', fontWeight: 500 }}>
                Boost your purchasing power with our integrated BNPL partners across major retail categories. No hidden fees. Just seamless split payments across 4 major African markets.
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', padding: '2rem', background: 'rgba(0,0,0,0.02)', borderRadius: '32px', border: '1px solid var(--card-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                   <Zap size={24} />
                </div>
                <p style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>Instant POS Approval</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                   <Shield size={24} />
                </div>
                <p style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>Zero Interest on selected</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--muted)' }}>Integrated Retail Partners</p>
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {vendors.map((v, idx) => (
                    <div key={idx} className="glass-card" style={{ padding: '0.75rem 1.5rem', fontSize: '0.8rem', fontWeight: 800, borderRadius: '50px', background: 'rgba(0,0,0,0.03)', border: '1px solid var(--card-border)' }}>{v}</div>
                  ))}
               </div>
            </div>
          </motion.div>

          {/* Visual Floating Mock UI */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ position: 'relative' }}
          >
             <div className="glass-card" style={{ padding: '0.75rem', borderRadius: '44px', boxShadow: 'var(--shadow-lg), var(--shadow-glow)' }}>
                <div style={{ background: 'var(--foreground)', height: '550px', borderRadius: '38px', overflow: 'hidden', padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                   <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, var(--primary-glow), transparent)', opacity: 0.3 }}></div>
                   
                   <ShoppingCart size={120} style={{ color: 'var(--primary)', marginBottom: '3rem', opacity: 0.8 }} />
                   <h3 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '2rem', textAlign: 'center', color: 'white', lineHeight: 1.1 }}>Your Next Purchase <br/>Is <span className="gradient-text italic">Ready.</span></h3>
                   <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', fontSize: '1.2rem', maxWidth: '350px', margin: '0 auto 4rem', fontWeight: 500 }}>Split your bill into 3, 6 or 12 easy monthly installments at zero risk to the merchant.</p>
                   
                   <Link href="/get-started" className="btn btn-primary" style={{ background: 'white', color: 'black', width: '100%', padding: '1.5rem', fontSize: '1.1rem' }}>Deploy BNPL Credit Now <ArrowRight size={20} style={{ marginLeft: '1rem' }} /></Link>
                </div>
             </div>
             
             {/* Floating Info */}
             <div className="glass-card" style={{ position: 'absolute', bottom: '10%', right: '-10%', padding: '1.5rem 2rem', display: 'flex', gap: '1rem', alignItems: 'center', background: 'white', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-lg)' }}>
                <Cpu size={24} className="text-primary" />
                <div>
                   <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', opacity: 0.6, letterSpacing: '0.1em' }}>Market Adoption</p>
                   <p style={{ fontSize: '1rem', fontWeight: 900 }}>40% ⬆ Year-over-Year</p>
                </div>
             </div>
          </motion.div>
        </div>

        {/* Closing CTA Box */}
        <section style={{ paddingTop: '4rem' }}>
           <div className="glass-card" style={{ padding: '6rem 4rem', borderRadius: '40px', background: 'rgba(0,0,0,0.02)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '2.5rem' }}>
                 <Users size={32} />
              </div>
              <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>Ready to Scale With <span className="gradient-text italic">BNPL?</span></h2>
              <p style={{ color: 'var(--muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 4.5rem', fontWeight: 500 }}>Join the thousands of African consumers and merchants scaling their commerce with our unified split-payment search engine.</p>
              <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                 <Link href="/get-started" className="btn btn-primary" style={{ padding: '1.25rem 3.5rem', fontSize: '1.1rem' }}>Apply for Checkout Credit</Link>
                 <Link href="/contact" className="btn btn-secondary" style={{ padding: '1.25rem 3.5rem', fontSize: '1.1rem' }}>Merchant Partnership</Link>
              </div>
           </div>
        </section>
      </div>
    </PageTemplate>
  );
}
