'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import PortalShell, { C, F } from '../components/PortalShell';

export default function CalculatorPage() {
  const router = useRouter();
  const [amount, setAmount] = useState(10000);
  const [term, setTerm] = useState(24);
  const [rate, setRate] = useState(18);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Simple PMT calculation
  const monthlyRate = rate / 100 / 12;
  const monthlyPayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
  const totalRepayable = monthlyPayment * term;
  const totalInterest = totalRepayable - amount;

  // Payment breakdowns
  const weeklyPayment = (monthlyPayment * 12) / 52;
  const dailyPayment = (monthlyPayment * 12) / 365;

  return (
    <PortalShell 
      title="Loan Calculator" 
      subtitle="Estimate your monthly payments and find the best terms for your budget."
    >
      <div style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: 100 }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', 
          gap: 40,
          alignItems: 'start'
        }}>
          
          {/* Inputs */}
          <div style={{ 
            background: '#fff', 
            borderRadius: 32, 
            padding: isMobile ? 24 : 40, 
            border: `1px solid ${C.border}`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
          }}>
            <div style={{ marginBottom: 32 }}>
               <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Loan Amount (GH₵)</label>
               <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                  <span style={{ fontSize: 24, fontWeight: 900, color: C.text, fontFamily: F.heading }}>GH₵</span>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={e => setAmount(Number(e.target.value))}
                    style={{ 
                      flex: 1, border: 'none', background: 'none', fontSize: 32, fontWeight: 900, 
                      color: C.blue, outline: 'none', fontFamily: F.heading, width: '100%' 
                    }}
                  />
               </div>
               <input 
                 type="range" min="1000" max="250000" step="1000" value={amount} 
                 onChange={e => setAmount(Number(e.target.value))}
                 style={{ width: '100%', accentColor: C.blue, height: 6, borderRadius: 3, cursor: 'pointer' }}
               />
               <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, fontWeight: 700, color: C.textMuted }}>
                  <span>GH₵ 1,000</span>
                  <span>GH₵ 250,000</span>
               </div>
            </div>

            <div style={{ marginBottom: 32 }}>
               <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Repayment Term (Months)</label>
               <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                  <span style={{ fontSize: 32, fontWeight: 900, color: C.text, fontFamily: F.heading }}>{term}</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: C.textSub }}>Months</span>
               </div>
               <input 
                 type="range" min="6" max="84" step="6" value={term} 
                 onChange={e => setTerm(Number(e.target.value))}
                 style={{ width: '100%', accentColor: C.blue, height: 6, borderRadius: 3, cursor: 'pointer' }}
               />
               <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, fontWeight: 700, color: C.textMuted }}>
                  <span>6 Mo</span>
                  <span>84 Mo</span>
               </div>
            </div>

            <div style={{ marginBottom: 0 }}>
               <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Expected Interest Rate (% p.a)</label>
               <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                  <span style={{ fontSize: 32, fontWeight: 900, color: C.text, fontFamily: F.heading }}>{rate}%</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.emerald, background: C.emeraldPale, padding: '4px 8px', borderRadius: 8 }}>Market Avg</span>
               </div>
               <input 
                 type="range" min="10" max="36" step="0.5" value={rate} 
                 onChange={e => setRate(Number(e.target.value))}
                 style={{ width: '100%', accentColor: C.blue, height: 6, borderRadius: 3, cursor: 'pointer' }}
               />
               <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, fontWeight: 700, color: C.textMuted }}>
                  <span>10%</span>
                  <span>36%</span>
               </div>
            </div>
          </div>

          {/* Results Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ 
              background: `linear-gradient(135deg, ${C.blue} 0%, ${C.blueLight} 100%)`, 
              borderRadius: 32, 
              padding: isMobile ? 32 : 48, 
              color: '#fff',
              boxShadow: `0 24px 60px ${C.blue}33`,
              position: 'relative',
              overflow: 'hidden'
            }}>
               <div style={{ position: 'absolute', top: -40, right: -40, width: 220, height: 220, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
               <div style={{ position: 'relative', zIndex: 1 }}>
                  <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 900, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Estimated Monthly Payment</p>
                  <h2 style={{ margin: '0 0 40px', fontSize: 56, fontWeight: 900, fontFamily: F.heading, letterSpacing: '-0.03em' }}>GH₵ {Math.round(monthlyPayment).toLocaleString()}</h2>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, padding: '32px 0', borderTop: '1.5px solid rgba(255,255,255,0.1)' }}>
                     <div>
                        <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 900, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Weekly Repayment</p>
                        <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#fff' }}>GH₵ {Math.round(weeklyPayment).toLocaleString()}</p>
                     </div>
                     <div>
                        <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 900, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Daily Repayment</p>
                        <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#fff' }}>GH₵ {Math.round(dailyPayment).toLocaleString()}</p>
                     </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, padding: '32px 0', borderTop: '1.5px solid rgba(255,255,255,0.1)' }}>
                     <div>
                        <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 900, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Interest</p>
                        <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'rgba(255,255,255,0.9)' }}>GH₵ {Math.round(totalInterest).toLocaleString()}</p>
                     </div>
                     <div>
                        <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 900, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Repayable</p>
                        <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'rgba(255,255,255,0.9)' }}>GH₵ {Math.round(totalRepayable).toLocaleString()}</p>
                     </div>
                  </div>
               </div>
            </div>

            <div style={{ 
              background: '#fff', 
              borderRadius: 24, 
              padding: 24, 
              border: `1px solid ${C.border}`,
              display: 'flex',
              alignItems: 'center',
              gap: 16
            }}>
               <div style={{ width: 44, height: 44, borderRadius: 12, background: C.emeraldPale, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>💡</div>
               <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 800, color: C.text }}>Pro Tip</p>
                  <p style={{ margin: 0, fontSize: 12, color: C.textSub }}>By shortening your term to **12 months**, you could save **GH₵ {Math.round(totalInterest - ((amount * (rate/100/12)) / (1 - Math.pow(1 + (rate/100/12), -12))) * 12).toLocaleString()}** in interest.</p>
               </div>
            </div>

            <button 
              onClick={() => router.push(`/portal/marketplace?cat=loan`)}
              style={{ 
                background: C.text, border: 'none', color: '#fff', padding: '20px', borderRadius: 20, 
                fontSize: 15, fontWeight: 800, cursor: 'pointer', transition: '0.3s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
               View Real Offers in Marketplace →
            </button>
          </div>
        </div>

        {/* Comparison Section */}
        <div style={{ marginTop: 80 }}>
           <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: C.text, fontFamily: F.heading }}>Why use our Calculator?</h2>
              <p style={{ color: C.textSub, fontSize: 16 }}>Transparent results with zero hidden fees, built for the Ghanaian market.</p>
           </div>

           <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 32 }}>
              {[
                { title: 'Market Accuracy', desc: 'Our rates are synced with 15+ local lenders in Ghana.', icon: '🎯' },
                { title: 'Zero Credit Impact', desc: 'Estimate your monthly budget without hitting your score.', icon: '🛡️' },
                { title: 'Hidden Fee Detector', desc: 'We show you the total repayable, not just the base rate.', icon: '🔍' }
              ].map(f => (
                <div key={f.title} style={{ padding: 32, borderRadius: 24, border: `1px solid ${C.border}`, background: '#fff' }}>
                   <div style={{ fontSize: 32, marginBottom: 20 }}>{f.icon}</div>
                   <h3 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 900, color: C.text }}>{f.title}</h3>
                   <p style={{ margin: 0, color: C.textSub, fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </PortalShell>
  );
}
