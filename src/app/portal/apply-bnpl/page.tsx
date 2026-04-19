'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import PortalShell, { C, F } from '../components/PortalShell';

/* ─── BNPL Page Implementation ─────────────────────────────────────────── */

export default function ApplyBNPLPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    merchant: '',
    item: '',
    price: '',
    months: '3',
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const preMerchant = params.get('provider');
    if (preMerchant) setForm(f => ({ ...f, merchant: decodeURIComponent(preMerchant) }));
  }, []);

  const steps = ['Cart Details', 'Repayment Plan', 'Agreement'];

  const handleSubmit = async () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <PortalShell title="Purchase Authorized" backHref="/portal">
        <div style={{ maxWidth: 520, margin: isMobile ? '40px auto' : '60px auto', textAlign: 'center', padding: '0 20px' }}>
           <div style={{ width: 80, height: 80, borderRadius: '50%', background: C.bluePale, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="3"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
           </div>
           <h2 style={{ fontSize: isMobile ? 22 : 24, fontWeight: 800, color: C.text, fontFamily: F.heading }}>Instalment Plan Activated</h2>
           <p style={{ color: C.textSub, fontSize: isMobile ? 14 : 15, lineHeight: 1.6, marginBottom: 32 }}>Your purchase at **{form.merchant}** for the **{form.item}** has been approved. Your virtual card is ready for checkout.</p>
           <button onClick={() => router.push('/portal')} style={{ background: C.sidebar, color: '#fff', border: 'none', borderRadius: 12, padding: '14px 32px', fontWeight: 700, cursor: 'pointer', width: isMobile ? '100%' : 'auto' }}>Return to Overview</button>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell title="BNPL Execute" backHref="/portal/marketplace">
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
                <h2 style={{ fontSize: isMobile ? 20 : 22, fontWeight: 800, color: C.text, marginBottom: 8 }}>What are we buying?</h2>
                <p style={{ color: C.textSub, fontSize: isMobile ? 14 : 15, marginBottom: 32 }}>Enter the details from your merchant cart.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, background: '#fff', padding: isMobile ? 24 : 32, borderRadius: 24, border: `1px solid ${C.border}` }}>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <label style={{ fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Merchant Name</label>
                      <input type="text" value={form.merchant} onChange={e => setForm({...form, merchant: e.target.value})} placeholder="e.g. Electroland, Kredete" style={{ padding: 14, borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 15 }} />
                   </div>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <label style={{ fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Item Name / SKU</label>
                      <input type="text" value={form.item} onChange={e => setForm({...form, item: e.target.value})} placeholder="e.g. iPhone 15 Pro, Samsung Fridge" style={{ padding: 14, borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 15 }} />
                   </div>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <label style={{ fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Cart Value (GH₵)</label>
                      <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="0.00" style={{ padding: 14, borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 15 }} />
                   </div>
                   <button onClick={() => setStep(1)} disabled={!form.price || !form.item} style={{ marginTop: 12, background: C.sidebar, color: '#fff', border: 'none', borderRadius: 12, height: 50, fontWeight: 700, cursor: 'pointer', opacity: (!form.price || !form.item) ? 0.5 : 1 }}>Select Plan →</button>
                </div>
             </motion.div>
           )}

           {step === 1 && (
             <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 style={{ fontSize: isMobile ? 20 : 22, fontWeight: 800, color: C.text, marginBottom: 8 }}>Choose Split Plan</h2>
                <p style={{ color: C.textSub, fontSize: isMobile ? 14 : 15, marginBottom: 32 }}>Select how you'd like to split the **GH₵ {Number(form.price).toLocaleString()}** payment.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
                   {['3', '6', '12'].map(m => (
                     <button key={m} onClick={() => setForm({...form, months: m})} style={{ 
                       padding: '24px 16px', borderRadius: 18, border: `2.5px solid ${form.months === m ? C.blue : C.border}`,
                       background: form.months === m ? C.bluePale : '#fff', color: C.text, cursor: 'pointer', transition: '0.2s'
                     }}>
                        <p style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 800 }}>{m}</p>
                        <p style={{ margin: 0, fontSize: 11, color: C.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Months</p>
                     </button>
                   ))}
                </div>

                <div style={{ background: '#f8fafc', padding: 28, borderRadius: 20, border: `1px solid ${C.border}`, marginBottom: 28 }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ fontSize: 14, color: C.textSub }}>Monthly Payment</span>
                      <span style={{ fontSize: 16, fontWeight: 800, color: C.text }}>GH₵ {Math.round(Number(form.price) / Number(form.months)).toLocaleString()}</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 14, color: C.textSub }}>Interest Rate</span>
                      <span style={{ fontSize: 16, fontWeight: 800, color: C.green }}>0% APR (Introductory)</span>
                   </div>
                </div>

                <button onClick={() => setStep(2)} style={{ width: '100%', padding: 16, borderRadius: 12, border: 'none', background: C.sidebar, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Review Agreement →</button>
             </motion.div>
           )}

           {step === 2 && (
             <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 style={{ fontSize: isMobile ? 20 : 22, fontWeight: 800, color: C.text, marginBottom: 24 }}>Final Verification</h2>
                <div style={{ background: '#fff', borderRadius: 24, border: `1px solid ${C.border}`, padding: isMobile ? '24px' : '32px', marginBottom: 28 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                      <div style={{ width: 44, height: 44, background: C.bluePale, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🛒</div>
                      <div>
                         <p style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>{form.merchant}</p>
                         <p style={{ margin: 0, fontSize: 12, color: C.textMuted }}>{form.item}</p>
                      </div>
                   </div>
                   <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.6, margin: 0 }}>By confirming, you authorize ResolveBridge to deduct **GH₵ {Math.round(Number(form.price) / Number(form.months)).toLocaleString()}** monthly from your linked bank account for {form.months} months.</p>
                </div>

                <div style={{ display: 'flex', gap: 16 }}>
                   <button onClick={() => setStep(1)} style={{ flex: 1, padding: 16, borderRadius: 12, border: `1.5px solid ${C.border}`, fontWeight: 700, cursor: 'pointer', background: '#fff' }}>Back</button>
                   <button onClick={handleSubmit} style={{ flex: 2, padding: 16, borderRadius: 12, border: 'none', background: C.blue, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Confirm Purchase ✓</button>
                </div>
             </motion.div>
           )}
        </AnimatePresence>

      </div>
    </PortalShell>
  );
}
