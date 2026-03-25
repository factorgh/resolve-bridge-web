'use client';

import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Shield, 
  Search, 
  CreditCard, 
  Globe, 
  Zap, 
  CheckCircle,
  Users,
  LineChart,
  Target,
  BarChart3,
  Lock,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <main className="landing-page" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background Ambience */}
      <div className="ambient-glow" style={{ top: '-10%', left: '-10%', transform: 'scale(1.5)', opacity: 0.2 }}></div>
      <div className="ambient-glow" style={{ bottom: '10%', right: '-10%', transform: 'scale(1.2)', background: 'radial-gradient(circle, var(--secondary-glow) 0%, transparent 70%)', opacity: 0.15 }}></div>

      {/* Hero Section */}
      <header className="hero-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '10rem', paddingBottom: '6rem' }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1.25rem', borderRadius: '50px', background: 'rgba(0,0,0,0.03)', border: '1px solid var(--card-border)', marginBottom: '3rem', fontSize: '0.85rem', fontWeight: '700' }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }}></div>
              Secure & Verified Financial Services Across Africa
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
              style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 0.95, marginBottom: '2.5rem' }}
            >
              The Next Frontier of <br/>
              <span className="gradient-text italic">Financial Search</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
              style={{ fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', color: 'var(--muted)', maxWidth: '750px', margin: '0 auto 4rem', fontWeight: '500' }}
            >
              Bridging the gap between Africa's top financial institutions and 400M+ consumers. Loans, Insurance, and BNPL, all searched and secured in one place.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <Link href="/get-started" className="btn btn-primary" style={{ padding: '1.25rem 3rem', fontSize: '1.1rem' }}>
                Start Searching <ArrowRight size={20} style={{ marginLeft: '0.75rem' }} />
              </Link>
              <Link href="/solutions" className="btn btn-secondary" style={{ padding: '1.25rem 3rem', fontSize: '1.1rem' }}>
                Explore Services
              </Link>
            </motion.div>
          </div>

          {/* Floating Visual Elements */}
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.8, ease: [0.23, 1, 0.32, 1] }}
            style={{ marginTop: '8rem', width: '100%', maxWidth: '1100px', margin: '8rem auto 0' }}
          >
            <div className="glass-card" style={{ padding: '0.75rem', overflow: 'hidden', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.15)' }}>
               <div style={{ background: 'var(--background)', borderRadius: '24px', overflow: 'hidden', height: '500px', position: 'relative' }}>
                  {/* Mock UI Content */}
                  <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                           <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,0,0,0.03)' }}></div>
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              <div style={{ width: '100px', height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '20px' }}></div>
                              <div style={{ width: '60px', height: '8px', background: 'rgba(0,0,0,0.03)', borderRadius: '20px' }}></div>
                           </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                           <div style={{ width: '80px', height: '32px', borderRadius: '8px', background: 'var(--foreground)', opacity: 0.05 }}></div>
                           <div style={{ width: '40px', height: '32px', borderRadius: '8px', background: 'var(--primary)', opacity: 0.1 }}></div>
                        </div>
                     </div>

                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', flex: 1 }}>
                        {[1, 2, 3].map((item) => (
                           <div key={item} style={{ border: '1px solid var(--card-border)', borderRadius: '20px', padding: '1.5rem', opacity: item === 2 ? 1 : 0.6, transform: item === 2 ? 'scale(1.05)' : 'scale(1)', boxShadow: item === 2 ? '0 20px 40px -10px rgba(0,0,0,0.1)' : 'none' }}>
                               <div style={{ width: '32px', height: '32px', background: item === 2 ? 'var(--primary)' : 'rgba(0,0,0,0.05)', borderRadius: '8px', marginBottom: '1.5rem' }}></div>
                               <div style={{ width: '80%', height: '12px', background: 'rgba(0,0,0,0.1)', borderRadius: '20px', marginBottom: '1rem' }}></div>
                               <div style={{ width: '50%', height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '20px', marginBottom: '2rem' }}></div>
                               <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                                 <div style={{ flex: 1, height: '32px', background: 'rgba(0,0,0,0.03)', borderRadius: '6px' }}></div>
                               </div>
                           </div>
                        ))}
                     </div>
                  </div>
                  {/* Ambient Light Over UI */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '300px', height: '300px', background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)', opacity: 0.2, pointerEvents: 'none' }}></div>
               </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Trust Ticker / Stats */}
      <section style={{ borderTop: '1px solid var(--card-border)', borderBottom: '1px solid var(--card-border)', padding: '4rem 0', background: 'rgba(0,0,0,0.01)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', textAlign: 'center' }}>
            <div>
              <h3 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.25rem' }}>4 <span className="gradient-text">Countries</span></h3>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>Ghana • Nigeria • Kenya • SA</p>
            </div>
            <div>
              <h3 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.25rem' }}>50+</h3>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>Banks & Lenders</p>
            </div>
            <div>
              <h3 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.25rem' }}>$15M+</h3>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>Facilitated Funding</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features - The "Marketable" Part */}
      <section style={{ padding: '10rem 0' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', marginBottom: '6rem' }}>
            <span className="section-label">Engine Capabilities</span>
            <h2 style={{ fontSize: '3.5rem', maxWidth: '600px' }}>Powered by Intelligence, Built for <span className="gradient-text">Scale</span></h2>
            <p style={{ color: 'var(--muted)', fontSize: '1.25rem', marginTop: '1.5rem' }}>Our platform isn't just a list; it's a dynamic ecosystem syncing real-time data from across Africa's financial landscape.</p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}
          >
            {[
              { icon: <Search />, title: "Hyper-Personalized Matching", desc: "No generic lists. Our AI analyzes your history and goals to suggest financial products you'll actually qualify for.", color: "blue" },
              { icon: <Lock />, title: "Bank-Grade Verification", desc: "Built-in KYC and AML compliance for rapid approval across West and East Africa's regulatory zones.", color: "purple" },
              { icon: <Zap />, title: "Instant Approval SDK", desc: "Merchants can integrate our entire marketplace into their own app in less than 2 hours using our developer-first API.", color: "orange" },
            ].map((feature, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="glass-card" style={{ padding: '3rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: idx === 1 ? 'var(--secondary)' : 'var(--primary)' }}>
                   {feature.icon}
                </div>
                <div>
                   <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{feature.title}</h3>
                   <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Solutions Story-telling Section */}
      <section style={{ background: 'var(--foreground)', color: 'var(--background)', padding: '10rem 0', position: 'relative', overflow: 'hidden' }}>
        <div className="ambient-glow" style={{ top: '0', right: '0', opacity: 0.1 }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8rem', alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}>
               <h2 style={{ fontSize: '4.5rem', lineHeight: 1, marginBottom: '2.5rem' }}>One Search. <br/><span className="gradient-text italic">Infinite Reach.</span></h2>
               <p style={{ fontSize: '1.25rem', opacity: 0.7, marginBottom: '3.5rem', maxWidth: '500px' }}>Stop jumping between websites. We aggregate the finest financial products from top-tier institutions so you can decide with clarity.</p>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '4rem' }}>
                  {[
                    "SME Growth & Working Capital",
                    "Retail BNPL Integrations",
                    "Modular Insurance Packages",
                    "Cross-border Merchant Payments"
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <CheckCircle size={18} className="text-primary" style={{ color: 'var(--primary)' }} />
                      <span style={{ fontWeight: 700 }}>{item}</span>
                    </div>
                  ))}
               </div>
               
               <Link href="/solutions" className="btn btn-primary" style={{ background: 'white', color: 'black' }}>
                 Explore Solutions <ArrowRight size={20} style={{ marginLeft: '1rem' }} />
               </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }} viewport={{ once: true }} style={{ position: 'relative' }}>
               <div className="glass-card" style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <img src="/hero-image.png" alt="Marketplace" style={{ width: '100%', borderRadius: '24px', filter: 'brightness(1.1)' }} />
               </div>
               {/* Floating Badges */}
               <div className="glass-card" style={{ position: 'absolute', top: '10%', right: '-10%', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Users size={24} className="text-primary" />
                  <div style={{ color: 'white' }}>
                    <p style={{ fontSize: '0.7rem', opacity: 0.6 }}>Active Users</p>
                    <p style={{ fontSize: '1rem', fontWeight: 900 }}>400k+</p>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dynamic CTA */}
      <section style={{ padding: '12rem 0' }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="glass-card" 
            style={{ padding: '8rem 4rem', textAlign: 'center', background: 'radial-gradient(circle at center, var(--primary-glow) 0%, transparent 100%), var(--foreground)', color: 'white', position: 'relative', overflow: 'hidden' }}
          >
             <div style={{ position: 'relative', zIndex: 1 }}>
               <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', maxWidth: '900px', margin: '0 auto 2rem' }}>The Future of African Finance is <span className="gradient-text italic">ResolveBridge.</span></h2>
               <p style={{ fontSize: '1.25rem', opacity: 0.7, maxWidth: '600px', margin: '0 auto 4rem' }}>Join the thousands of forward-thinking Africans scaling their financial future with our search engine.</p>
               <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link href="/get-started" className="btn btn-primary lg" style={{ background: 'white', color: 'black' }}>Apply Now</Link>
                  <Link href="/contact" className="btn btn-secondary lg" style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>Consult Sales</Link>
               </div>
             </div>
             {/* Abstract light rays */}
             <div style={{ position: 'absolute', top: '-50%', left: '50%', width: '1px', height: '200%', background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent)', transform: 'rotate(45deg)', opacity: 0.5 }}></div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
