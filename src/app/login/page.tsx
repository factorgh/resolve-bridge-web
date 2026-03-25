'use client';

import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Mail, 
  Lock, 
  ShieldCheck,
  ChevronLeft,
  Globe
} from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="internal-page min-h-screen flex items-center justify-center py-20 bg-white" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="ambient-glow" style={{ top: '-10%', left: '-10%', opacity: 0.2 }}></div>
      <div className="ambient-glow" style={{ bottom: '-10%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, var(--secondary-glow) 0%, transparent 70%)', opacity: 0.15 }}></div>
      
      <div className="container" style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="glass-card"
          style={{ maxWidth: '460px', width: '100%', padding: '5rem', borderRadius: '48px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--card-border)' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.04em' }}>
               <img src="/resolve_icon.png" alt="Resolve" style={{ height: '36px', width: 'auto' }} />
               <span>Resolve<span className="gradient-text italic">Bridge</span></span>
            </Link>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.04em' }}>Welcome <span className="gradient-text italic">Back</span></h1>
            <p style={{ color: 'var(--muted)', fontWeight: 500, fontSize: '1rem' }}>Sign in to manage your financial portfolio.</p>
          </div>

          <form style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--muted)' }}>Email Address</label>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--muted)' }}>Secret Password</label>
                   <Link href="/forgot-password" style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)' }}>Forgot Identity?</Link>
                </div>
                <div style={{ position: 'relative' }}>
                   <Lock size={16} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                   <input 
                     type="password" 
                     placeholder="••••••••"
                     style={{ width: '100%', padding: '1.25rem 1.25rem 1.25rem 3.5rem', borderRadius: '16px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.02)', outline: 'none', fontWeight: 500 }}
                   />
                </div>
             </div>

             <button className="btn btn-primary" style={{ padding: '1.5rem', fontSize: '1.1rem', borderRadius: '20px', marginTop: '1rem' }}>
                Secure Sign In <ArrowRight size={20} style={{ marginLeft: '1rem' }} />
             </button>

             <div style={{ position: 'relative', textAlign: 'center', margin: '1rem 0' }}>
                <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', background: 'var(--card-border)' }}></div>
                <span style={{ position: 'relative', background: 'white', padding: '0 1rem', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.1em' }}>OR CONTINUE WITH</span>
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button type="button" className="btn btn-secondary" style={{ padding: '1rem', borderRadius: '14px', fontSize: '0.85rem' }}>
                   <Globe size={18} style={{ marginRight: '0.75rem' }} /> Google
                </button>
                <button type="button" className="btn btn-secondary" style={{ padding: '1rem', borderRadius: '14px', fontSize: '0.85rem' }}>
                   <Globe size={18} style={{ marginRight: '0.75rem' }} /> Github
                </button>
             </div>

             <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 500 }}>New to the Bridge? <Link href="/get-started" style={{ fontWeight: 800, color: 'var(--primary)' }}>Initialize Account</Link></p>
             </div>
          </form>
          
          <div style={{ marginTop: '4rem', paddingTop: '2.5rem', borderTop: '1px solid var(--card-border)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', opacity: 0.5 }}>
            <ShieldCheck size={14} style={{ color: '#16a34a' }} /> Persistent Encryption Profile Active
          </div>
        </motion.div>
      </div>
    </main>
  );
}
