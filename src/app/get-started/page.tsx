'use client';

import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  User, 
  Mail, 
  Lock, 
  ShieldCheck,
  Check,
  Globe,
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function GetStartedPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const steps = [
    { title: "Financial Identity", description: "Seamlessly build your digital profile to unlock Africa's leading financial services." },
    { title: "Algorithmic Matching", description: "Our AI identifies the exact products where you meet institutional risk criteria." },
    { title: "Direct Disbursement", description: "Secure funding, insurance, or elite automotive assets with a single digital handshake." }
  ];

  return (
    <main className="internal-page min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white" style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* Visual Side */}
      <section style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden', background: 'var(--foreground)', color: 'white', padding: '6rem' }} className="hidden lg:flex">
         <div className="ambient-glow" style={{ top: '-10%', left: '-10%', opacity: 0.3 }}></div>
         <div className="ambient-glow" style={{ bottom: '-20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, var(--secondary-glow) 0%, transparent 70%)', opacity: 0.2 }}></div>
         
         <div style={{ position: 'relative', zIndex: 10, maxWidth: '500px' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', marginBottom: '6rem', color: 'white', fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.04em' }}>
               <img src="/resolve_icon.png" alt="Resolve" style={{ height: '40px', width: 'auto' }} />
               <span>Resolve<span className="gradient-text italic">Bridge</span></span>
            </Link>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 0.95, marginBottom: '2.5rem', letterSpacing: '-0.06em' }}
            >
              Start Your Financial Journey with <span className="gradient-text italic">Confidence.</span>
            </motion.h1>
            
            <p style={{ fontSize: '1.25rem', opacity: 0.6, marginBottom: '6rem', fontWeight: 500, lineHeight: 1.7 }}>
               Join thousands of visionaries scaling their financial footprint across the continent with Africa's premier search engine.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
               {steps.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: '2rem' }}>
                     <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 900, flexShrink: 0 }}>
                        {i + 1}
                     </div>
                     <div>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>{s.title}</h4>
                        <p style={{ opacity: 0.5, fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.6 }}>{s.description}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
         
         {/* Floating Globe Ornament */}
         <Globe size={400} style={{ position: 'absolute', bottom: '-10%', left: '-10%', opacity: 0.03, color: 'white' }} />
      </section>

      {/* Form Side */}
      <section style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '4rem', position: 'relative' }}>
         <div style={{ position: 'absolute', top: '3rem', left: '3rem' }}>
            <Link href="/" style={{ color: 'var(--muted)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="hover-primary">
               <ChevronLeft size={16} /> Back to Search
            </Link>
         </div>

         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           style={{ width: '100%', maxWidth: '420px' }}
         >
            <div style={{ marginBottom: '4.5rem' }}>
               <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.04em' }}>Create Free <span className="gradient-text italic">Account</span></h2>
               <p style={{ color: 'var(--muted)', fontWeight: 500, fontSize: '1.1rem' }}>Match with premium financial products in under 2 minutes.</p>
            </div>

            <form style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                     <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--muted)' }}>First Name</label>
                     <div style={{ position: 'relative' }}>
                        <User size={16} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                        <input 
                           type="text" 
                           placeholder="John"
                           style={{ width: '100%', padding: '1.25rem 1.25rem 1.25rem 3.5rem', borderRadius: '16px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.02)', outline: 'none', fontWeight: 500 }}
                        />
                     </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                     <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--muted)' }}>Last Name</label>
                     <div style={{ position: 'relative' }}>
                        <User size={16} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                        <input 
                           type="text" 
                           placeholder="Doe"
                           style={{ width: '100%', padding: '1.25rem 1.25rem 1.25rem 3.5rem', borderRadius: '16px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.02)', outline: 'none', fontWeight: 500 }}
                        />
                     </div>
                  </div>
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--muted)' }}>Work Email Address</label>
                  <div style={{ position: 'relative' }}>
                     <Mail size={16} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                     <input 
                        type="email" 
                        placeholder="john@example.com"
                        style={{ width: '100%', padding: '1.25rem 1.25rem 1.25rem 3.5rem', borderRadius: '16px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.02)', outline: 'none', fontWeight: 500 }}
                     />
                  </div>
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--muted)' }}>Secure Password</label>
                  <div style={{ position: 'relative' }}>
                     <Lock size={16} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                     <input 
                        type="password" 
                        placeholder="••••••••"
                        style={{ width: '100%', padding: '1.25rem 1.25rem 1.25rem 3.5rem', borderRadius: '16px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.02)', outline: 'none', fontWeight: 500 }}
                     />
                  </div>
               </div>

               <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '6px', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'var(--primary)', color: 'white', flexShrink: 0 }}>
                     <Check size={14} />
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 500, lineHeight: 1.5 }}>
                     I agree to the <Link href="/terms" style={{ fontWeight: 800, color: 'var(--foreground)' }}>Terms of Service</Link> and <Link href="/privacy" style={{ fontWeight: 800, color: 'var(--foreground)' }}>Privacy Policy</Link>.
                  </p>
               </div>

               <button className="btn btn-primary" style={{ padding: '1.5rem', fontSize: '1.1rem', borderRadius: '20px', marginTop: '1rem' }}>
                  Initialize Account <ArrowRight size={20} style={{ marginLeft: '1rem' }} />
               </button>

               <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 500 }}>Already a member? <Link href="/login" style={{ fontWeight: 800, color: 'var(--primary)' }}>Secure Sign In</Link></p>
               </div>
            </form>
         </motion.div>
         
         <div style={{ position: 'absolute', bottom: '3rem', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', opacity: 0.5, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck size={14} style={{ color: '#16a34a' }} /> Bank-Grade Encryption Protocol V.4.0
         </div>
      </section>
    </main>
  );
}
