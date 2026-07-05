'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import PortalShell, { C, F } from '../components/PortalShell';

export default function CalculatorPage() {
  const router = useRouter();
  const [amount, setAmount] = useState(10000);
  const [term, setTerm] = useState(24);
  const [rate, setRate] = useState(2);
  const [rateType, setRateType] = useState('monthly'); // 'monthly' or 'yearly'
  const [isMobile, setIsMobile] = useState(false);
  
  const [amountStr, setAmountStr] = useState("10000");
  const [termStr, setTermStr] = useState("24");
  const [rateStr, setRateStr] = useState("2");

  const [isCalculating, setIsCalculating] = useState(false);
  const calcTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsCalculating(true);
    if (calcTimeoutRef.current) {
      clearTimeout(calcTimeoutRef.current);
    }
    calcTimeoutRef.current = setTimeout(() => {
      setIsCalculating(false);
    }, 250);

    return () => {
      if (calcTimeoutRef.current) {
        clearTimeout(calcTimeoutRef.current);
      }
    };
  }, [amount, term, rate, rateType]);

  const logMin = 1000;
  const logMax = 1000000000; // 1 Billion limit (effectively Infinity for sliders)
  const amountToPos = (amt: number) => {
    if (amt <= logMin) return 0;
    return (Math.log(amt / logMin) / Math.log(logMax / logMin)) * 100;
  };
  const posToAmount = (pos: number) => {
    const val = logMin * Math.pow(logMax / logMin, pos / 100);
    if (val < 10000) return Math.round(val / 1000) * 1000;
    if (val < 100000) return Math.round(val / 5000) * 5000;
    if (val < 1000000) return Math.round(val / 50000) * 50000;
    return Math.round(val / 1000000) * 1000000;
  };

  const handleAmountChange = (valStr: string) => {
    setAmountStr(valStr);
    const parsed = parseFloat(valStr);
    if (!isNaN(parsed)) {
      const clamped = Math.max(0, parsed);
      setAmount(clamped);
    }
  };

  const handleAmountBlur = () => {
    let parsed = parseFloat(amountStr);
    if (isNaN(parsed)) {
      parsed = 1000;
    }
    const clamped = Math.max(1000, parsed);
    setAmount(clamped);
    setAmountStr(clamped.toString());
  };

  const handleTermChange = (valStr: string) => {
    setTermStr(valStr);
    const parsed = parseInt(valStr);
    if (!isNaN(parsed)) {
      const clamped = Math.max(0, Math.min(84, parsed));
      setTerm(clamped);
    }
  };

  const handleTermBlur = () => {
    let parsed = parseInt(termStr);
    if (isNaN(parsed)) {
      parsed = 24;
    }
    const clamped = Math.max(6, Math.min(84, parsed));
    setTerm(clamped);
    setTermStr(clamped.toString());
  };

  const handleRateChange = (valStr: string) => {
    setRateStr(valStr);
    const parsed = parseFloat(valStr);
    if (!isNaN(parsed)) {
      const isYearly = rateType === 'yearly';
      const clamped = Math.max(0, Math.min(isYearly ? 48 : 15, parsed));
      setRate(clamped);
    }
  };

  const handleRateBlur = () => {
    let parsed = parseFloat(rateStr);
    const isYearly = rateType === 'yearly';
    if (isNaN(parsed)) {
      parsed = isYearly ? 18 : 2;
    }
    const clamped = Math.max(isYearly ? 5 : 0.5, Math.min(isYearly ? 48 : 15, parsed));
    setRate(clamped);
    setRateStr(clamped.toString());
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Flat Rate Calculation
  const monthlyRate = rateType === 'yearly' ? (rate / 100 / 12) : (rate / 100);
  const monthlyPayment = term > 0 ? (amount / term) + (amount * monthlyRate) : 0;
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
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-bg {
          background: linear-gradient(90deg, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.08) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
          display: inline-block;
          border-radius: 4px;
        }
        .shimmer-bg-dark {
          background: linear-gradient(90deg, rgba(15,23,42,0.08) 25%, rgba(15,23,42,0.15) 50%, rgba(15,23,42,0.08) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
          display: inline-block;
          border-radius: 4px;
        }
      `}</style>
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
               <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Loan Amount</label>
               <div style={{ 
                 display: 'flex', 
                 alignItems: 'center', 
                 gap: 12, 
                 background: '#f8fafc', 
                 border: `1px solid ${C.borderStrong}`, 
                 borderRadius: 16, 
                 padding: '12px 20px', 
                 marginBottom: 16 
               }}>
                  <span style={{ fontSize: 20, fontWeight: 900, color: C.textSub, fontFamily: F.heading }}>GH₵</span>
                  <input 
                    type="number" 
                    value={amountStr} 
                    onChange={e => handleAmountChange(e.target.value)}
                    onBlur={handleAmountBlur}
                    style={{ 
                      flex: 1, border: 'none', background: 'none', fontSize: 24, fontWeight: 900, 
                      color: C.blue, outline: 'none', fontFamily: F.heading, width: '100%' 
                    }}
                  />
               </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="0.01" 
                  value={amountToPos(amount)} 
                  onChange={e => {
                    const amt = posToAmount(parseFloat(e.target.value));
                    setAmount(amt);
                    setAmountStr(amt.toString());
                  }}
                  style={{ width: '100%', accentColor: C.blue, height: 6, borderRadius: 3, cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, fontWeight: 700, color: C.textMuted }}>
                   <span>GH₵ 1,000</span>
                   <span>Infinity</span>
                </div>
            </div>

            <div style={{ marginBottom: 32 }}>
               <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Repayment Term</label>
               <div style={{ 
                 display: 'flex', 
                 alignItems: 'center', 
                 gap: 12, 
                 background: '#f8fafc', 
                 border: `1px solid ${C.borderStrong}`, 
                 borderRadius: 16, 
                 padding: '12px 20px', 
                 marginBottom: 16 
               }}>
                  <input 
                    type="number" 
                    value={termStr} 
                    onChange={e => handleTermChange(e.target.value)}
                    onBlur={handleTermBlur}
                    style={{ 
                      flex: 1, border: 'none', background: 'none', fontSize: 24, fontWeight: 900, 
                      color: C.blue, outline: 'none', fontFamily: F.heading, width: '100%' 
                    }}
                  />
                  <span style={{ fontSize: 16, fontWeight: 700, color: C.textSub }}>Months</span>
               </div>
               <input 
                 type="range" min="6" max="84" step="6" value={term} 
                 onChange={e => {
                   const val = Number(e.target.value);
                   setTerm(val);
                   setTermStr(val.toString());
                 }}
                 style={{ width: '100%', accentColor: C.blue, height: 6, borderRadius: 3, cursor: 'pointer' }}
               />
               <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, fontWeight: 700, color: C.textMuted }}>
                  <span>6 Mo</span>
                  <span>84 Mo</span>
               </div>
            </div>

             <div style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                   <label style={{ fontSize: 11, fontWeight: 900, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Expected Interest Rate (Flat)</label>
                   <span style={{ fontSize: 12, fontWeight: 700, color: C.emerald, background: C.emeraldPale, padding: '3px 8px', borderRadius: 6 }}>Market Avg</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12, 
                  background: '#f8fafc', 
                  border: `1px solid ${C.borderStrong}`, 
                  borderRadius: 16, 
                  padding: '12px 20px', 
                  marginBottom: 16 
                }}>
                   <input 
                     type="number" 
                     step="0.1"
                     value={rateStr} 
                     onChange={e => handleRateChange(e.target.value)}
                     onBlur={handleRateBlur}
                     style={{ 
                       flex: 1, border: 'none', background: 'none', fontSize: 24, fontWeight: 900, 
                       color: C.blue, outline: 'none', fontFamily: F.heading, width: '100%' 
                     }}
                   />
                   <select
                     value={rateType}
                     onChange={e => {
                       const nextType = e.target.value;
                       setRateType(nextType);
                       const nextRate = nextType === 'yearly' 
                         ? Math.min(36, Math.max(10, rate)) 
                         : Math.min(10, Math.max(1, rate));
                       setRate(nextRate);
                       setRateStr(nextRate.toString());
                     }}
                     style={{
                       border: 'none',
                       background: 'none',
                       fontSize: 16,
                       fontWeight: 900,
                       color: C.textSub,
                       outline: 'none',
                       cursor: 'pointer',
                       fontFamily: F.heading
                     }}
                   >
                     <option value="monthly">% / Month</option>
                     <option value="yearly">% p.a. (Yearly)</option>
                   </select>
                </div>
                <input 
                  type="range" 
                  min={rateType === 'yearly' ? 10 : 1} 
                  max={rateType === 'yearly' ? 36 : 10} 
                  step={rateType === 'yearly' ? 0.5 : 0.1} 
                  value={rate} 
                  onChange={e => {
                    const val = Number(e.target.value);
                    setRate(val);
                    setRateStr(val.toString());
                  }}
                  style={{ width: '100%', accentColor: C.blue, height: 6, borderRadius: 3, cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, fontWeight: 700, color: C.textMuted }}>
                   <span>{rateType === 'yearly' ? '10%' : '1%'}</span>
                   <span>{rateType === 'yearly' ? '36%' : '10%'}</span>
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
                  <h2 style={{ margin: '0 0 40px', fontSize: 56, fontWeight: 900, fontFamily: F.heading, letterSpacing: '-0.03em', minHeight: 68, display: 'flex', alignItems: 'center' }}>
                     {isCalculating ? (
                       <span className="shimmer-bg" style={{ width: 180, height: 48 }} />
                     ) : (
                       <>GH₵ {Math.round(monthlyPayment).toLocaleString()}</>
                     )}
                  </h2>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, padding: '32px 0', borderTop: '1.5px solid rgba(255,255,255,0.1)' }}>
                     <div>
                        <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 900, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Weekly Repayment</p>
                        <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#fff', minHeight: 28, display: 'flex', alignItems: 'center' }}>
                          {isCalculating ? (
                            <span className="shimmer-bg" style={{ width: 100, height: 20 }} />
                          ) : (
                            <>GH₵ {Math.round(weeklyPayment).toLocaleString()}</>
                          )}
                        </p>
                     </div>
                     <div>
                        <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 900, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Daily Repayment</p>
                        <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#fff', minHeight: 28, display: 'flex', alignItems: 'center' }}>
                          {isCalculating ? (
                            <span className="shimmer-bg" style={{ width: 80, height: 20 }} />
                          ) : (
                            <>GH₵ {Math.round(dailyPayment).toLocaleString()}</>
                          )}
                        </p>
                     </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, padding: '32px 0', borderTop: '1.5px solid rgba(255,255,255,0.1)' }}>
                     <div>
                        <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 900, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Interest</p>
                        <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'rgba(255,255,255,0.9)', minHeight: 24, display: 'flex', alignItems: 'center' }}>
                          {isCalculating ? (
                            <span className="shimmer-bg" style={{ width: 110, height: 16 }} />
                          ) : (
                            <>GH₵ {Math.round(totalInterest).toLocaleString()}</>
                          )}
                        </p>
                     </div>
                     <div>
                        <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 900, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Repayable</p>
                        <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'rgba(255,255,255,0.9)', minHeight: 24, display: 'flex', alignItems: 'center' }}>
                          {isCalculating ? (
                            <span className="shimmer-bg" style={{ width: 110, height: 16 }} />
                          ) : (
                            <>GH₵ {Math.round(totalRepayable).toLocaleString()}</>
                          )}
                        </p>
                     </div>
                  </div>
               </div>
            </div>

             {term > 12 && (
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
                     <p style={{ margin: 0, fontSize: 12, color: C.textSub, minHeight: 18, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                        By shortening your term to **12 months**, you could save{" "}
                        {isCalculating ? (
                          <span className="shimmer-bg-dark" style={{ width: 70, height: 14 }} />
                        ) : (
                          <strong>GH₵ {Math.round(totalInterest - (12 * amount * monthlyRate)).toLocaleString()}</strong>
                        )}{" "}
                        in interest.
                     </p>
                  </div>
               </div>
             )}

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
