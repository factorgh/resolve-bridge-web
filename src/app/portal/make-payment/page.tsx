'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import PortalShell, { C, F } from '../components/PortalShell';

const LOANS = [
  { id: 'LN-2024-0891', type: 'Personal Loan', lender: 'Absa Bank Ghana', remaining: 6450, monthlyDue: 850, dueDate: '30 Apr 2026', color: C.blue, pale: C.bluePale },
  { id: 'LN-2024-0342', type: 'Business Loan', lender: 'Fidelity Bank', remaining: 11800, monthlyDue: 1240, dueDate: '15 May 2026', color: C.purple, pale: C.purplePale },
];

const PAYMENT_METHODS = [
  { id: 'momo', label: 'Mobile Money', sub: 'MTN, Vodafone, AirtelTigo', icon: '📱', last4: '3947' },
  { id: 'bank', label: 'Bank Transfer', sub: 'Direct bank debit', icon: '🏦', last4: '8821' },
  { id: 'card', label: 'Debit Card', sub: 'Visa / Mastercard', icon: '💳', last4: '4242' },
];

type Stage = 'select' | 'amount' | 'method' | 'confirm' | 'success';

export default function MakePaymentPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('select');
  const [selectedLoan, setSelectedLoan] = useState<typeof LOANS[0] | null>(null);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [ref] = useState(`PAY-${Date.now().toString().slice(-8)}`);

  const amountNum = Number(amount) || 0;
  const selected = PAYMENT_METHODS.find(m => m.id === method);

  const handlePay = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setStage('success');
  };

  if (stage === 'success') {
    return (
      <PortalShell title="Make a Payment" backHref="/portal" backLabel="Dashboard">
        <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center', paddingTop: 60 }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}
            style={{ width: 88, height: 88, borderRadius: '50%', background: C.greenPale, border: `3px solid ${C.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </motion.div>
          <h2 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 900, color: C.text, fontFamily: F.heading, letterSpacing: '-0.04em' }}>Payment Successful!</h2>
          <p style={{ margin: '0 0 6px', fontSize: 32, fontWeight: 900, color: C.green, fontFamily: F.heading, letterSpacing: '-0.05em' }}>GH₵ {amountNum.toLocaleString()}</p>
          <p style={{ margin: '0 0 28px', fontSize: 13.5, color: C.textMuted }}>Paid to {selectedLoan?.lender} · Ref: <strong style={{ color: C.text, fontFamily: F.heading }}>{ref}</strong></p>
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: '20px 24px', marginBottom: 28, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Loan', value: selectedLoan?.type },
              { label: 'Amount Paid', value: `GH₵ ${amountNum.toLocaleString()}` },
              { label: 'Method', value: selected?.label },
              { label: 'Date', value: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
              { label: 'Status', value: 'Confirmed ✓' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: 10 }}>
                <span style={{ fontSize: 12.5, color: C.textMuted }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: label === 'Status' ? C.green : C.text, fontFamily: F.heading }}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => { setStage('select'); setAmount(''); setMethod(''); setSelectedLoan(null); }}
              style={{ flex: 1, padding: '13px', background: '#fff', border: `1.5px solid ${C.border}`, borderRadius: 14, fontSize: 14, fontWeight: 700, color: C.textSub, cursor: 'pointer', fontFamily: F.body }}>
              Make Another
            </button>
            <button onClick={() => router.push('/portal')}
              style={{ flex: 1, padding: '13px', background: `linear-gradient(135deg, ${C.blue}, ${C.blueLight})`, border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 800, color: '#fff', cursor: 'pointer', fontFamily: F.heading, boxShadow: `0 6px 20px ${C.blue}44` }}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell title="Make a Payment" backHref="/portal" backLabel="Dashboard">
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 900, color: C.text, fontFamily: F.heading, letterSpacing: '-0.04em' }}>Make a Payment</h1>
          <p style={{ margin: 0, fontSize: 14, color: C.textMuted }}>Pay down your active loan balances quickly and securely.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={stage} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.22 }}>

            {/* Select Loan */}
            {stage === 'select' && (
              <div>
                <p style={{ margin: '0 0 18px', fontSize: 13.5, fontWeight: 700, color: C.textSub, fontFamily: F.heading }}>Select a loan to pay</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {LOANS.map(loan => (
                    <button key={loan.id} onClick={() => { setSelectedLoan(loan); setAmount(loan.monthlyDue.toString()); setStage('amount'); }}
                      style={{ background: '#fff', border: `2px solid ${C.border}`, borderRadius: 20, padding: '22px 26px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.22s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = loan.color; e.currentTarget.style.boxShadow = `0 4px 20px ${loan.color}22`; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                        <div>
                          <span style={{ fontSize: 10, fontWeight: 800, color: loan.color, background: loan.pale, padding: '3px 8px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: F.body }}>ACTIVE</span>
                          <p style={{ margin: '8px 0 3px', fontSize: 17, fontWeight: 800, color: C.text, fontFamily: F.heading, letterSpacing: '-0.03em' }}>{loan.type}</p>
                          <p style={{ margin: 0, fontSize: 13, color: C.textMuted }}>{loan.lender} · {loan.id}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ margin: '0 0 3px', fontSize: 22, fontWeight: 900, color: C.text, fontFamily: F.heading, letterSpacing: '-0.04em' }}>GH₵ {loan.remaining.toLocaleString()}</p>
                          <p style={{ margin: 0, fontSize: 12, color: C.textMuted }}>outstanding</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', background: loan.pale, borderRadius: 12, padding: '12px 16px' }}>
                        <div>
                          <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 700, color: loan.color, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Monthly Due</p>
                          <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: C.text, fontFamily: F.heading }}>GH₵ {loan.monthlyDue.toLocaleString()}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 700, color: loan.color, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Due Date</p>
                          <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: C.text, fontFamily: F.heading }}>{loan.dueDate}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Enter Amount */}
            {stage === 'amount' && selectedLoan && (
              <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 22, padding: '32px' }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 28, padding: '14px 18px', background: selectedLoan.pale, borderRadius: 14 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 2px', fontSize: 12, fontWeight: 700, color: selectedLoan.color, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{selectedLoan.type}</p>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.text, fontFamily: F.heading }}>{selectedLoan.lender}</p>
                  </div>
                  <p style={{ margin: 0, fontSize: 18, fontWeight: 900, color: C.text, fontFamily: F.heading }}>GH₵ {selectedLoan.remaining.toLocaleString()} remaining</p>
                </div>

                <p style={{ margin: '0 0 8px', fontSize: 13.5, fontWeight: 700, color: C.textSub, fontFamily: F.heading }}>How much would you like to pay?</p>
                <div style={{ fontSize: 48, fontWeight: 900, color: C.text, fontFamily: F.heading, letterSpacing: '-0.05em', textAlign: 'center', margin: '20px 0' }}>
                  GH₵ <input
                    value={amount} onChange={e => setAmount(e.target.value)}
                    type="number"
                    style={{ fontSize: 48, fontWeight: 900, color: C.blue, fontFamily: F.heading, letterSpacing: '-0.05em', border: 'none', borderBottom: `3px solid ${C.blue}`, outline: 'none', background: 'transparent', textAlign: 'center', width: 200 }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
                  {[selectedLoan.monthlyDue, Math.round(selectedLoan.remaining / 2), selectedLoan.remaining].map((amt, i) => (
                    <button key={i} onClick={() => setAmount(amt.toString())}
                      style={{ padding: '8px 16px', background: Number(amount) === amt ? selectedLoan.pale : '#f8fafc', border: `1.5px solid ${Number(amount) === amt ? selectedLoan.color : C.border}`, borderRadius: 10, fontSize: 13, fontWeight: 700, color: Number(amount) === amt ? selectedLoan.color : C.textSub, cursor: 'pointer', fontFamily: F.body, transition: 'all 0.2s' }}>
                      {i === 0 ? 'Monthly due' : i === 1 ? 'Half balance' : 'Full balance'}
                      <br /><span style={{ fontSize: 12 }}>GH₵ {amt.toLocaleString()}</span>
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <button onClick={() => setStage('select')} style={{ padding: '13px 24px', background: '#fff', border: `1.5px solid ${C.border}`, borderRadius: 14, fontSize: 14, fontWeight: 700, color: C.textSub, cursor: 'pointer', fontFamily: F.body }}>← Back</button>
                  <button onClick={() => setStage('method')} disabled={!amountNum || amountNum > selectedLoan.remaining}
                    style={{ padding: '13px 32px', background: amountNum && amountNum <= selectedLoan.remaining ? `linear-gradient(135deg, ${C.blue}, ${C.blueLight})` : C.border, border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 800, color: '#fff', cursor: amountNum ? 'pointer' : 'not-allowed', fontFamily: F.heading, boxShadow: amountNum ? `0 6px 20px ${C.blue}44` : 'none' }}>
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Payment Method */}
            {stage === 'method' && (
              <div>
                <p style={{ margin: '0 0 18px', fontSize: 13.5, fontWeight: 700, color: C.textSub, fontFamily: F.heading }}>Choose a payment method</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                  {PAYMENT_METHODS.map(pm => (
                    <button key={pm.id} onClick={() => setMethod(pm.id)}
                      style={{ background: '#fff', border: `2px solid ${method === pm.id ? C.blue : C.border}`, borderRadius: 16, padding: '18px 22px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 16, transition: 'all 0.2s', boxShadow: method === pm.id ? `0 4px 16px ${C.blue}22` : 'none' }}
                    >
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: method === pm.id ? C.bluePale : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, transition: 'background 0.2s' }}>{pm.icon}</div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 2px', fontSize: 15, fontWeight: 700, color: C.text, fontFamily: F.heading }}>{pm.label}</p>
                        <p style={{ margin: 0, fontSize: 12.5, color: C.textMuted }}>{pm.sub} · ****{pm.last4}</p>
                      </div>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${method === pm.id ? C.blue : C.border}`, background: method === pm.id ? C.blue : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                        {method === pm.id && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button onClick={() => setStage('amount')} style={{ padding: '13px 24px', background: '#fff', border: `1.5px solid ${C.border}`, borderRadius: 14, fontSize: 14, fontWeight: 700, color: C.textSub, cursor: 'pointer', fontFamily: F.body }}>← Back</button>
                  <button onClick={() => setStage('confirm')} disabled={!method}
                    style={{ padding: '13px 32px', background: method ? `linear-gradient(135deg, ${C.blue}, ${C.blueLight})` : C.border, border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 800, color: '#fff', cursor: method ? 'pointer' : 'not-allowed', fontFamily: F.heading, boxShadow: method ? `0 6px 20px ${C.blue}44` : 'none' }}>
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Confirm */}
            {stage === 'confirm' && selectedLoan && (
              <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 22, padding: '32px' }}>
                <p style={{ margin: '0 0 22px', fontSize: 15, fontWeight: 800, color: C.text, fontFamily: F.heading }}>Confirm your payment</p>
                <div style={{ textAlign: 'center', padding: '24px', background: C.bg, borderRadius: 16, marginBottom: 24 }}>
                  <p style={{ margin: '0 0 4px', fontSize: 14, color: C.textMuted }}>You are paying</p>
                  <p style={{ margin: '0 0 4px', fontSize: 40, fontWeight: 900, color: C.text, fontFamily: F.heading, letterSpacing: '-0.05em' }}>GH₵ {amountNum.toLocaleString()}</p>
                  <p style={{ margin: 0, fontSize: 14, color: C.textMuted }}>to {selectedLoan.lender} via {selected?.label}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[
                    { label: 'Loan', value: selectedLoan.type },
                    { label: 'Reference', value: ref },
                    { label: 'New Balance', value: `GH₵ ${(selectedLoan.remaining - amountNum).toLocaleString()}` },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, padding: '12px 0' }}>
                      <span style={{ fontSize: 13, color: C.textMuted }}>{label}</span>
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: C.text, fontFamily: F.heading }}>{value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
                  <button onClick={() => setStage('method')} style={{ flex: 1, padding: '14px', background: '#fff', border: `1.5px solid ${C.border}`, borderRadius: 14, fontSize: 14, fontWeight: 700, color: C.textSub, cursor: 'pointer', fontFamily: F.body }}>← Back</button>
                  <button onClick={handlePay} disabled={loading}
                    style={{ flex: 2, padding: '14px', background: loading ? C.textMuted : `linear-gradient(135deg, ${C.green}, #34d399)`, border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 800, color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: F.heading, boxShadow: loading ? 'none' : `0 6px 20px ${C.green}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    {loading ? (<><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }} style={{ width: 16, height: 16, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />Processing…</>) : 'Confirm & Pay →'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </PortalShell>
  );
}
