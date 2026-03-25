'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  ArrowRight,
  Info,
  CheckCircle,
  PieChart
} from 'lucide-react';
import PageTemplate from '../components/PageTemplate';
import Link from 'next/link';

export default function LoanCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(10000);
  const [interestRate, setInterestRate] = useState(12);
  const [loanTerm, setLoanTerm] = useState(12);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  useEffect(() => {
    const r = interestRate / 100 / 12;
    const n = loanTerm;
    const p = loanAmount;
    
    if (r === 0) {
      setMonthlyPayment(p / n);
      setTotalPayment(p);
      setTotalInterest(0);
    } else {
      const x = Math.pow(1 + r, n);
      const monthly = (p * x * r) / (x - 1);
      setMonthlyPayment(monthly);
      setTotalPayment(monthly * n);
      setTotalInterest((monthly * n) - p);
    }
  }, [loanAmount, interestRate, loanTerm]);

  return (
    <PageTemplate 
      title="Financial" 
      gradientTitle="Intelligence"
      subtitle="Calculate your repayment profile with precision. Africa's most transparent loan planning engine."
      noCard={true}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem', paddingBottom: '8rem' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', alignItems: 'start' }}>
          
          {/* Controls */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-card"
            style={{ padding: '4rem', borderRadius: '40px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--card-border)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '3.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calculator size={24} />
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Loan Parameters</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {/* Amount */}
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>Loan Amount (USD)</label>
                     <span style={{ fontSize: '1.25rem', fontWeight: 900 }}>${loanAmount.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1000" 
                    max="500000" 
                    step="1000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    style={{ width: '100%', height: '6px', borderRadius: '10px', background: 'var(--card-border)', appearance: 'none', cursor: 'pointer' }}
                  />
               </div>

               {/* Interest */}
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>Annual Interest Rate (%)</label>
                     <span style={{ fontSize: '1.25rem', fontWeight: 900 }}>{interestRate}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="45" 
                    step="0.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    style={{ width: '100%', height: '6px', borderRadius: '10px', background: 'var(--card-border)', appearance: 'none', cursor: 'pointer' }}
                  />
               </div>

               {/* Term */}
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>Loan Term (Months)</label>
                     <span style={{ fontSize: '1.25rem', fontWeight: 900 }}>{loanTerm} Months</span>
                  </div>
                  <input 
                    type="range" 
                    min="3" 
                    max="60" 
                    step="3"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    style={{ width: '100%', height: '6px', borderRadius: '10px', background: 'var(--card-border)', appearance: 'none', cursor: 'pointer' }}
                  />
               </div>
            </div>

            <div style={{ marginTop: '4rem', padding: '1.5rem', borderRadius: '20px', background: 'rgba(0,0,0,0.02)', display: 'flex', gap: '1rem', alignItems: 'start' }}>
               <Info size={20} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.25rem' }} />
               <p style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 500, lineHeight: 1.5 }}>Estimates provided are for informational purposes only. Actual rates depend on your credit profile and lender eligibility.</p>
            </div>
          </motion.div>

          {/* Results Area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
             <div className="glass-card" style={{ padding: '5rem 4rem', borderRadius: '48px', background: 'var(--foreground)', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, var(--primary-glow), transparent)', opacity: 0.3 }}></div>
                
                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                   <p style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--primary)', marginBottom: '1.5rem' }}>Estimated Monthly Payback</p>
                   <h3 style={{ fontSize: '5rem', fontWeight: 900, marginBottom: '4rem', letterSpacing: '-0.04em' }}>${monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}<span style={{ fontSize: '1.5rem', opacity: 0.5, fontWeight: 500 }}>/mo</span></h3>
                   
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '3rem 2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div>
                         <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5, marginBottom: '0.5rem' }}>Total Principal</p>
                         <p style={{ fontSize: '1.5rem', fontWeight: 900 }}>${loanAmount.toLocaleString()}</p>
                      </div>
                      <div>
                         <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5, marginBottom: '0.5rem' }}>Accumulated Interest</p>
                         <p style={{ fontSize: '1.5rem', fontWeight: 900 }}>${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                      </div>
                   </div>

                   <p style={{ marginTop: '4rem', fontSize: '1.1rem', fontWeight: 500, opacity: 0.7 }}>Total Repayment: <span style={{ fontWeight: 900, color: 'white' }}>${totalPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></p>
                </div>
             </div>

             <div className="glass-card" style={{ padding: '3rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Next Steps</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                   <Link href="/get-started" className="btn btn-primary" style={{ width: '100%', padding: '1.25rem' }}>Lock In This Rate <ArrowRight size={20} style={{ marginLeft: '1rem' }} /></Link>
                   <Link href="/solutions" className="btn btn-secondary" style={{ width: '100%', padding: '1.25rem' }}>Compare Other Lenders</Link>
                </div>
             </div>
          </motion.div>
        </div>

        {/* Insight Section */}
        <section>
          <div className="glass-card" style={{ padding: '6rem 4rem', borderRadius: '48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '4rem', alignItems: 'center' }}>
             <div>
                <span className="section-label">Smart Repayment</span>
                <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem' }}>Why Transparency <span className="gradient-text italic">Matters.</span></h2>
                <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: 1.7, fontWeight: 500 }}>Hidden fees and compound interest traps are common in fragmented markets. ResolveBridge ensures you see the full picture before committing to any institutional capital.</p>
             </div>
             
             <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                {[
                  { icon: CheckCircle, title: "Zero Hidden Fees", desc: "No origination or processing traps in our search." },
                  { icon: TrendingUp, title: "Early Repayment Scaling", desc: "Reduce total interest with flexible schedules." },
                  { icon: PieChart, title: "Risk-Based Optimization", desc: "Our engine finds the best APR for your specific KYC profile." }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '0.25rem' }}>{item.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 500 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </section>
      </div>
    </PageTemplate>
  );
}
