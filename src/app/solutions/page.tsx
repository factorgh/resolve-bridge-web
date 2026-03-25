'use client';

import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Zap, 
  Shield, 
  Globe, 
  ArrowRight,
  CheckCircle,
  Users,
  Target,
  BarChart3,
  Cpu
} from 'lucide-react';
import Link from 'next/link';
import PageTemplate from '../components/PageTemplate';

const solutions = [
  {
    title: "Credit & Loans",
    subtitle: "Flexible SME and Individual Financing",
    icon: <CreditCard className="text-blue-500" />,
    description: "Access tailored credit solutions for small businesses and individuals. Whether you're scaling operations or managing everyday expenses, we bridge the funding gap.",
    features: ["Business Expansion Loans", "Personal Working Capital", "Flexible Repayment Plans", "Low Interest Rates"],
    highlight: "+150% growth for SME partners",
    gradient: "from-blue-500/10 to-transparent"
  },
  {
    title: "Buy Now Pay Later (BNPL)",
    subtitle: "Revolutionizing Retail Payments",
    icon: <Zap className="text-orange-500" />,
    description: "Integrate flexible payment options into your business or shop with ease. Give your customers the power to pay over time while you get paid upfront.",
    features: ["Instant POS Integrations", "12-month installment plans", "No hidden fee structure", "Zero risk for merchants"],
    highlight: "2.4x higher conversion rate",
    gradient: "from-orange-500/10 to-transparent"
  },
  {
    title: "Insurance Coverage",
    subtitle: "Protecting What Matters Most",
    icon: <Shield className="text-purple-500" />,
    description: "From auto to health, get comprehensive coverage through our network of top-tier insurance partners across 4 African markets.",
    features: ["Vehicle & Asset protection", "Health and Life plans", "Seamless claim processing", "Multiple provider matching"],
    highlight: "98% customer satisfaction score",
    gradient: "from-purple-500/10 to-transparent"
  },
  {
    title: "Merchant Payments",
    subtitle: "Secure & Frictionless Transactions",
    icon: <Globe className="text-emerald-500" />,
    description: "Empower your business with our robust payment solutions, including integrated escrow services to ensure trust between buyers and sellers.",
    features: ["International settlement", "Secure Escrow service", "Fraud detection & prevention", "Real-time payout dashboard"],
    highlight: "Zero-fraud transaction record",
    gradient: "from-emerald-500/10 to-transparent"
  }
];

export default function SolutionsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { x: -30, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.7 }
    }
  };

  return (
    <PageTemplate 
      title="Integrated" 
      gradientTitle="Marketplace"
      subtitle="A suite of tailor-made financial modules designed to solve the most pressing challenges for African businesses and consumers."
      noCard={true}
    >
      <div className="internal-content-wrapper" style={{ paddingBottom: '8rem' }}>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          style={{ display: 'flex', flexDirection: 'column', gap: '10rem' }}
        >
          {solutions.map((solution, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants} 
              style={{ 
                display: 'flex', 
                flexDirection: idx % 2 === 1 ? 'row-reverse' : 'row', 
                gap: '6rem', 
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ flex: '1', minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ padding: '1rem', borderRadius: '16px', background: 'rgba(0,0,0,0.03)', border: '1px solid var(--card-border)' }}>
                    {solution.icon}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>Module 0{idx + 1}</span>
                </div>
                
                <div style={{ gap: '0.75rem', display: 'flex', flexDirection: 'column' }}>
                  <h2 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-0.04em' }}>{solution.title}</h2>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: '800' }} className="gradient-text italic">{solution.subtitle}</h3>
                </div>

                <p style={{ color: 'var(--muted)', fontSize: '1.15rem', lineHeight: '1.8', maxWidth: '500px', fontWeight: '500' }}>
                  {solution.description}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', marginTop: '1rem' }}>
                  {solution.features.map((feature, fidx) => (
                    <div key={fidx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                        <CheckCircle size={12} />
                      </div>
                      <span style={{ fontSize: '0.95rem', fontWeight: '700' }}>{feature}</span>
                    </div>
                  ))}
                </div>

                <div style={{ paddingTop: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                  <Link href="/get-started" className="btn btn-primary" style={{ padding: '1.25rem 2.5rem' }}>Deploy Solution <ArrowRight size={18} style={{ marginLeft: '0.75rem' }} /></Link>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', fontWeight: '900', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    <Target size={18} />
                    {solution.highlight}
                  </div>
                </div>
              </div>

              {/* Solution Abstract Art */}
              <div style={{ flex: '1', minWidth: '320px' }}>
                <div className="glass-card" style={{ padding: '4rem', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', borderRadius: '32px', boxShadow: 'var(--shadow-lg)' }}>
                  <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', background: 'radial-gradient(circle at center, var(--primary-glow), transparent)', opacity: '0.15' }}></div>
                  <div style={{ textAlign: 'center', width: '100%', gap: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: '1' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '24px', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '1rem', boxShadow: 'var(--shadow-md)' }}>
                      {solution.icon}
                    </div>
                    <div style={{ height: '10px', width: '220px', background: 'rgba(0,0,0,0.06)', borderRadius: '20px' }}></div>
                    <div style={{ height: '10px', width: '140px', background: 'rgba(0,0,0,0.03)', borderRadius: '20px' }}></div>
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                       <div style={{ width: '50px', height: '20px', background: 'var(--primary)', opacity: '0.2', borderRadius: '6px' }}></div>
                       <div style={{ width: '80px', height: '20px', background: 'rgba(0,0,0,0.04)', borderRadius: '6px' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Closing Global Scaling */}
        <div className="glass-card" style={{ marginTop: '12rem', padding: '8rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, #020617, #1e293b)', color: 'white', borderRadius: '40px', overflow: 'hidden', position: 'relative' }}>
           <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, var(--primary-glow), transparent)', opacity: '0.3' }}></div>
           <div style={{ position: 'relative', zIndex: '1' }}>
             <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', margin: '0 auto 2.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
               <Cpu size={40} />
             </div>
             <h2 style={{ fontSize: '4rem', fontWeight: '900', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>Scale Your Deployment <span className="gradient-text italic">Globally</span></h2>
             <p style={{ maxWidth: '650px', margin: '0 auto 4rem', color: 'rgba(255,255,255,0.6)', fontSize: '1.25rem', fontWeight: '500' }}>Join thousands of forward-thinking businesses and individuals scaling their financial future with our enterprise-grade marketplace solutions.</p>
             <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <Link href="/get-started" className="btn btn-primary" style={{ background: 'white', color: 'black', padding: '1.25rem 3rem' }}>Start Scaling Now</Link>
                <Link href="/contact" className="btn btn-secondary" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '1.25rem 3rem' }}>Talk to Sales Expert</Link>
             </div>
           </div>
        </div>
      </div>
    </PageTemplate>
  );
}
