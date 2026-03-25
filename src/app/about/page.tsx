'use client';

import { motion } from 'framer-motion';
import { 
  Users, 
  MapPin, 
  Target, 
  Award, 
  Globe, 
  Shield, 
  ArrowRight,
  TrendingUp,
  Heart,
  BarChart2,
  Cpu,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import PageTemplate from '../components/PageTemplate';

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8 }
    }
  };

  const principles = [
    {
      icon: <Target />,
      title: "Our Mission",
      desc: "To democratize financial access across Africa by providing a single, verified, and transparent search engine for all financial products.",
      color: "var(--primary)"
    },
    {
      icon: <Heart />,
      title: "Impact First",
      desc: "Every line of code we write is focused on solving the real-world financial friction experienced by millions of Africans daily.",
      color: "#f43f5e"
    },
    {
      icon: <Shield />,
      title: "Unwavering Trust",
      desc: "We operate with bank-grade security and absolute transparency, ensuring our users' data and trust are never compromised.",
      color: "var(--secondary)"
    }
  ];

  return (
    <PageTemplate 
      title="Our Global" 
      gradientTitle="Mission"
      subtitle="We are Africa's premier financial search engine, bridging the gap between individuals, businesses, and the capital they need to thrive."
      noCard={true}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem', paddingBottom: '8rem' }}>
        
        {/* Story Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '6rem', alignItems: 'center' }}>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
          >
            <div>
              <span className="section-label">Institutional Growth</span>
              <h2 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                Driving Economic <span className="gradient-text italic">Expansion</span> Through Technology
              </h2>
            </div>
            
            <div style={{ color: 'var(--muted)', fontSize: '1.2rem', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1.5rem', fontWeight: 500 }}>
              <p>
                Founded with a vision to eliminate the silos in the African financial landscape, ResolveBridge has grown into a powerful ecosystem that empowers consumers and merchants alike.
              </p>
              <p>
                We noticed that while financial products existed, they were often fragmented and difficult to access. Our platform fixes this by aggregating the best offers in real-time.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '2rem', background: 'rgba(0,0,0,0.02)', borderRadius: '24px', border: '1px solid var(--card-border)' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--foreground)' }}>50+</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>Bank Partners</div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--foreground)' }}>4+</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>Primary Markets</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            style={{ position: 'relative' }}
          >
             <div className="glass-card" style={{ padding: '0.5rem', borderRadius: '40px', overflow: 'hidden', boxShadow: 'var(--shadow-lg), var(--shadow-glow)' }}>
                <div style={{ background: 'var(--foreground)', height: '500px', borderRadius: '34px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, var(--primary-glow), transparent)', opacity: 0.4 }}></div>
                   <Globe size={240} style={{ color: 'rgba(255,255,255,0.03)', position: 'absolute' }} />
                   
                   <div style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                      <div className="glass-card" style={{ padding: '2rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', width: '160px', transform: 'translateY(30px)' }}>
                         <TrendingUp className="text-primary" style={{ marginBottom: '1rem' }} />
                         <p style={{ color: 'white', fontWeight: 800 }}>Growth</p>
                      </div>
                      <div className="glass-card" style={{ padding: '2rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', width: '160px', transform: 'translateY(-30px)' }}>
                         <BarChart2 style={{ color: 'var(--secondary)', marginBottom: '1rem' }} />
                         <p style={{ color: 'white', fontWeight: 800 }}>Analytics</p>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        </div>

        {/* Principles Section */}
        <section style={{ paddingTop: '8rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 6rem' }}>
             <span className="section-label">Our DNA</span>
             <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>Fundamental Principles</h2>
             <p style={{ color: 'var(--muted)', fontSize: '1.15rem', fontWeight: 500 }}>The underlying values that guide our architecture and every partner relationship we build.</p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}
          >
            {principles.map((p, idx) => (
              <motion.div key={idx} variants={itemVariants} className="glass-card" style={{ padding: '3.5rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '2rem', boxShadow: 'var(--shadow-md)' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.color }}>
                  {p.icon}
                </div>
                <div>
                   <h3 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '1rem' }}>{p.title}</h3>
                   <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.7, fontWeight: 500 }}>{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Presence Section */}
        <section style={{ paddingTop: '6rem' }}>
          <div className="glass-card" style={{ padding: '6rem 4rem', borderRadius: '40px', background: 'linear-gradient(135deg, var(--foreground), #1e293b)', color: 'white', position: 'relative', overflow: 'hidden' }}>
             <div className="ambient-glow" style={{ top: '-40%', right: '-20%', opacity: 0.2 }}></div>
             <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                   <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem' }}>Pan-African Digital Presence</h2>
                   <p style={{ opacity: 0.7, maxWidth: '600px', margin: '0 auto', fontSize: '1.2rem' }}>Operating across the continent's most dynamic economies to drive inclusion.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', textAlign: 'center' }}>
                  {[
                    { name: "Ghana", city: "Accra Global HQ", icon: <MapPin size={24} /> },
                    { name: "Nigeria", city: "Lagos Growth Hub", icon: <Zap size={24} /> },
                    { name: "Kenya", city: "Nairobi Tech Office", icon: <Cpu size={24} /> },
                    { name: "South Africa", city: "JHB Financial Unit", icon: <Shield size={24} /> }
                  ].map((market, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                       <div style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>{market.icon}</div>
                       <h4 style={{ fontSize: '1.5rem', fontWeight: 900 }}>{market.name}</h4>
                       <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.6 }}>{market.city}</span>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </section>

        {/* Final CTA */}
        <section style={{ textAlign: 'center', paddingTop: '8rem', paddingBottom: '4rem' }}>
           <motion.div 
             initial={{ opacity: 0, y: 30 }} 
             whileInView={{ opacity: 1, y: 0 }} 
             viewport={{ once: true }}
             transition={{ duration: 1 }}
           >
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 30px var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', margin: '0 auto 3rem' }}>
                 <Users size={32} />
              </div>
              <h2 style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '2rem', letterSpacing: '-0.04em' }}>Join the Financial <span className="gradient-text italic">Revolution</span></h2>
              <p style={{ color: 'var(--muted)', fontSize: '1.35rem', maxWidth: '700px', margin: '0 auto 4rem', fontWeight: 500 }}>
                 Whether you're a potential partner, a customer, or talent looking to make an impact, we'd love to have you bridge the gap with us.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                 <Link href="/get-started" className="btn btn-primary" style={{ padding: '1.25rem 3.5rem', fontSize: '1.1rem' }}>Get Started Today</Link>
                 <Link href="/contact" className="btn btn-secondary" style={{ padding: '1.25rem 3.5rem', fontSize: '1.1rem' }}>Talk to an Architect</Link>
              </div>
           </motion.div>
        </section>
      </div>
    </PageTemplate>
  );
}
