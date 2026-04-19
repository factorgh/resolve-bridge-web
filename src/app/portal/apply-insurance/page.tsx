'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import PortalShell, { C, F } from '../components/PortalShell';

/* ─── Insurance Models ────────────────────────────────────────────────────── */

const CATEGORIES = [
  { id: 'auto', label: 'Auto Insurance', icon: '🚗', desc: 'Secure your vehicle against theft and accidents.' },
  { id: 'life', label: 'Life Assurance', icon: '👤', desc: 'Provide a financial safety net for your family.' },
  { id: 'health', label: 'Health Cover', icon: '🏥', desc: 'Comprehensive medical coverage at top hospitals.' },
];

/* ─── Page Implementation ────────────────────────────────────────────────── */

export default function ApplyInsurancePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [coverage, setCoverage] = useState('auto');
  const [form, setForm] = useState({
    provider: '',
    planType: 'comprehensive',
    value: '',
    beneficiary: '',
    phone: '',
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem('rb_user');
    if (stored) {
      const u = JSON.parse(stored);
      setForm(f => ({ ...f, beneficiary: u.name || '', phone: u.phone || '' }));
    }
    
    const params = new URLSearchParams(window.location.search);
    const preProvider = params.get('provider');
    if (preProvider) setForm(f => ({ ...f, provider: decodeURIComponent(preProvider) }));
  }, []);

  const steps = ['Select Risk', 'Asset Details', 'Quote Review'];

  const handleSubmit = async () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <PortalShell title="Shield Confirmed" backHref="/portal">
        <div style={{ maxWidth: 520, margin: isMobile ? '40px auto' : '60px auto', textAlign: 'center', padding: '0 20px' }}>
           <div style={{ width: 80, height: 80, borderRadius: '50%', background: C.greenPale, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
           </div>
           <h2 style={{ fontSize: isMobile ? 22 : 24, fontWeight: 800, color: C.text, fontFamily: F.heading }}>Policy Application Active</h2>
           <p style={{ color: C.textSub, fontSize: isMobile ? 14 : 15, lineHeight: 1.6, marginBottom: 32 }}>Your application for **{form.provider}** has been transmitted. An agent will contact you for site inspection within 24 hours.</p>
           <button onClick={() => router.push('/portal')} style={{ background: C.sidebar, color: '#fff', border: 'none', borderRadius: 12, padding: '14px 32px', fontWeight: 700, cursor: 'pointer', width: isMobile ? '100%' : 'auto' }}>Return to Overview</button>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell title="Insurance Bridge" backHref="/portal/marketplace">
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        
        {/* Step Indicator */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 44 }}>
           {steps.map((s, i) => (
             <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? C.blue : C.border }} />
           ))}
        </div>

        <AnimatePresence mode="wait">
           {step === 0 && (
             <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 24 }}>What are we protecting today?</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                   {CATEGORIES.map(cat => (
                     <button key={cat.id} onClick={() => { setCoverage(cat.id); setStep(1); }} style={{ 
                       background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, textAlign: 'left', cursor: 'pointer', display: 'flex', gap: 20, alignItems: 'center', transition: '0.2s'
                     }} onMouseEnter={e => e.currentTarget.style.borderColor = C.blue}>
                        <div style={{ fontSize: 32 }}>{cat.icon}</div>
                        <div>
                           <p style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 800, color: C.text }}>{cat.label}</p>
                           <p style={{ margin: 0, fontSize: 13, color: C.textSub }}>{cat.desc}</p>
                        </div>
                     </button>
                   ))}
                </div>
             </motion.div>
           )}

           {step === 1 && (
             <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                 <h2 style={{ fontSize: isMobile ? 20 : 22, fontWeight: 800, color: C.text, marginBottom: 8 }}>Details for {CATEGORIES.find(c => c.id === coverage)?.label}</h2>
                 <p style={{ color: C.textSub, fontSize: isMobile ? 14 : 15, marginBottom: 32 }}>Tell us about the asset you want to cover with **{form.provider || 'Resolve Shield'}**.</p>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 20, background: '#fff', padding: isMobile ? 24 : 32, borderRadius: 24, border: `1px solid ${C.border}` }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                       <label style={{ fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Estimated Asset Value (GH₵)</label>
                       <input type="number" value={form.value} onChange={e => setForm({...form, value: e.target.value})} placeholder="e.g. 150,000" style={{ padding: 14, borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 15 }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                       <label style={{ fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Primary Beneficiary</label>
                       <input type="text" value={form.beneficiary} onChange={e => setForm({...form, beneficiary: e.target.value})} style={{ padding: 14, borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 15 }} />
                    </div>
                    <button onClick={() => setStep(2)} style={{ marginTop: 12, background: C.sidebar, color: '#fff', border: 'none', borderRadius: 12, height: 50, fontWeight: 700, cursor: 'pointer' }}>Continue to Quote →</button>
                 </div>
             </motion.div>
           )}

           {step === 2 && (
             <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                 <h2 style={{ fontSize: isMobile ? 20 : 22, fontWeight: 800, color: C.text, marginBottom: 24 }}>Review Quote</h2>
                 <div style={{ background: C.sidebar, borderRadius: 24, padding: isMobile ? '32px 24px' : 40, color: '#fff', marginBottom: 28 }}>
                    <p style={{ margin: '0 0 8px', fontSize: 14, opacity: 0.6 }}>Estimated Monthly Premium</p>
                    <p style={{ margin: '0 0 32px', fontSize: isMobile ? 32 : 44, fontWeight: 400 }}>GH₵ {Math.round(Number(form.value) * 0.003).toLocaleString()}</p>
                    
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 12 : 20 }}>
                       <div>
                          <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 800, opacity: 0.4, textTransform: 'uppercase' }}>Provider</p>
                          <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{form.provider || 'Institutional Partner'}</p>
                       </div>
                       <div>
                          <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 800, opacity: 0.4, textTransform: 'uppercase' }}>Coverage</p>
                          <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>GH₵ {Number(form.value).toLocaleString()}</p>
                       </div>
                    </div>
                 </div>

                <div style={{ display: 'flex', gap: 16 }}>
                   <button onClick={() => setStep(1)} style={{ flex: 1, padding: 16, borderRadius: 12, border: `1.5px solid ${C.border}`, fontWeight: 700, cursor: 'pointer', background: '#fff' }}>Edit Details</button>
                   <button onClick={handleSubmit} style={{ flex: 2, padding: 16, borderRadius: 12, border: 'none', background: C.green, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Apply for Policy ✓</button>
                </div>
             </motion.div>
           )}
        </AnimatePresence>

      </div>
    </PortalShell>
  );
}
