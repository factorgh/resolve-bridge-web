'use client';

import { motion } from 'framer-motion';
import { 
  Search, 
  Shield, 
  Globe, 
  Zap, 
  CheckCircle, 
  LineChart, 
  ArrowRight,
  Database,
  Layers,
  Smartphone,
  Calculator
} from 'lucide-react';
import Link from 'next/link';
import PageTemplate from '../components/PageTemplate';

export default function FeaturesPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const mainFeatures = [
    {
      icon: <Search className="text-blue-500" />,
      title: "Smart Matching",
      description: "Proprietary AI engine that analyzes borrower profiles against real-time bank criteria to find the perfect fit with localized risk scoring and automated pre-approval."
    },
    {
      icon: <Shield className="text-purple-500" />,
      title: "Bank-Grade KYC",
      description: "Our biometric identity verification system integrates with local authorities in Ghana, Nigeria, Kenya and South Africa for instant cross-border database checks."
    },
    {
      icon: <Globe className="text-green-500" />,
      title: "Pan-African Infrastructure",
      description: "Operate across 4 major African economies from a single integrated dashboard with multi-currency support and local regulatory compliance baked-in."
    }
  ];

  const techFeatures = [
    { icon: <Calculator className="text-secondary" />, title: "Loan Calculator", desc: "Integrated repayment engine that allows you to calculate exact payloads and interest weights before applying." },
    { icon: <Database />, title: "Secure Escrow", desc: "Transactions are held in a secure, audited environment until all contractual conditions are met for full peace of mind." },
    { icon: <LineChart />, title: "Deep Analytics", desc: "Gain real-time insights into market trends and application performance with our robust merchant reporting dashboard." },
    { icon: <Layers />, title: "Modular SDKs", desc: "Embed our entire financial marketplace directly into your existing app or website with just a few lines of clean code." },
    { icon: <Smartphone />, title: "Mobile Optimized", desc: "A fluid experience across all devices, ensuring that your financial services are accessible even on light data connections." },
    { icon: <CheckCircle />, title: "Global Compliance", desc: "PCI-DSS, GDPR, and local financial standards compliance are handled by our platform automatically for your safety." }
  ];

  return (
    <PageTemplate 
      title="Platform" 
      gradientTitle="Capabilities"
      subtitle="Discover the advanced technology driving the future of financial inclusion across the African continent."
      noCard={true}
    >
      <div className="internal-content-wrapper" style={{ paddingBottom: '5rem' }}>
        {/* Features Selection Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '8rem' }}>
          {mainFeatures.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={itemVariants}
              className="glass-card"
              style={{ padding: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%', borderRadius: '32px', boxShadow: 'var(--shadow-lg)' }}
            >
              <div style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(0,0,0,0.03)', width: 'fit-content', color: 'var(--primary)' }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '900' }}>{feature.title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: '1.7' }}>{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Technical Details Grid */}
        <div className="tech-section" style={{ borderTop: '1px solid var(--card-border)', paddingTop: '6rem', marginTop: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ maxWidth: '600px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)' }}>Technical Superiority</span>
              <h2 className="section-title" style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Built for Global Scaling</h2>
              <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>Sophisticated engineering designed to handle millions of transactions with ease.</p>
            </div>
            <Link href="/get-started" className="btn btn-primary">Start Building <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} /></Link>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', borderRadius: '24px', overflow: 'hidden' }}
          >
            {techFeatures.map((tech, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                style={{ background: 'var(--background)', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
              >
                <div style={{ color: 'var(--primary)' }}>{tech.icon}</div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: '700' }}>{tech.title}</h4>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>{tech.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Status Callout - Pure CSS Design */}
        <div className="glass-card" style={{ marginTop: '8rem', padding: '4rem 2rem', textAlign: 'center', background: 'radial-gradient(circle at top right, rgba(37, 99, 235, 0.05), transparent)' }}>
           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1.25rem', borderRadius: '50px', background: 'rgba(0,0,0,0.03)', border: '1px solid var(--card-border)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
              Platform Network Live
           </div>
           <h2 className="section-title" style={{ maxWidth: '800px', margin: '0 auto 1.5rem' }}>A Marketplace That <span className="gradient-text italic">Never Sleeps</span></h2>
           <p style={{ color: 'var(--muted)', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto 3rem' }}>Our 99.99% uptime ensures that your business stays operational 24/7 across every time zone in our network.</p>
           
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--foreground)' }}>99.9%</div>
                <div style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.1em' }}>Uptime</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--foreground)' }}>50+</div>
                <div style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.1em' }}>Partners</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--foreground)' }}>0.8s</div>
                <div style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.1em' }}>Match Time</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--foreground)' }}>Instant</div>
                <div style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.1em' }}>KYC Speed</div>
              </div>
           </div>
        </div>

        {/* CTA Footer */}
        <div style={{ marginTop: '8rem', textAlign: 'center' }}>
          <h2 className="text-4xl font-extrabold mb-6">Ready to scale with us?</h2>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '3rem' }}>
             <Link href="/get-started" className="btn btn-primary lg">Launch Marketplace</Link>
             <Link href="/contact" className="btn btn-secondary lg">Architectural Consultation</Link>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
