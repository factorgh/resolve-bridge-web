'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import PortalShell, { C, F } from '../components/PortalShell';

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const LOAN_TYPES = [
  { id: 'personal', label: 'Personal Loan', desc: 'For personal expenses, travel, education', max: 'Up to GH₵ 50,000', rate: 'From 18% p.a.', term: 'Up to 60 months', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, color: C.blue, pale: C.bluePale },
  { id: 'business', label: 'Business Loan', desc: 'SME capital, inventory, expansion', max: 'Up to GH₵ 250,000', rate: 'From 21% p.a.', term: 'Up to 84 months', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>, color: C.purple, pale: C.purplePale },
  { id: 'auto', label: 'Auto Loan', desc: 'New or used vehicle financing', max: 'Up to GH₵ 120,000', rate: 'From 16% p.a.', term: 'Up to 60 months', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, color: C.green, pale: C.greenPale },
  { id: 'mortgage', label: 'Mortgage', desc: 'Buy, build or refinance your home', max: 'Up to GH₵ 800,000', rate: 'From 22% p.a.', term: 'Up to 20 years', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, color: C.amber, pale: C.amberPale },
];

const LENDERS = ['Absa Bank Ghana', 'Fidelity Bank', 'CAL Bank', 'GCB Bank', 'Ecobank Ghana', 'Zenith Bank', 'Access Bank'];
const PURPOSES = ['Debt Consolidation', 'Home Improvement', 'Medical Expenses', 'Education', 'Business Capital', 'Equipment Purchase', 'Land / Property', 'Vehicle Purchase', 'Travel', 'Other'];
const EMPLOYMENT = ['Employed (Salaried)', 'Self-Employed', 'Business Owner', 'Government Employee', 'Contractor / Freelancer', 'Retired'];

interface FormData {
  loanType: string; amount: string; term: string; purpose: string;
  firstName: string; lastName: string; phone: string; employment: string;
  employer: string; monthlyIncome: string; lender: string;
}

/* ─── Step Indicator ─────────────────────────────────────────────────────── */
function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 36 }}>
      {steps.map((label, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: i < current ? C.green : i === current ? C.blue : 'transparent',
              border: `2px solid ${i < current ? C.green : i === current ? C.blue : C.border}`,
              color: i <= current ? '#fff' : C.textMuted,
              fontSize: 12, fontWeight: 800, flexShrink: 0, transition: 'all 0.3s', fontFamily: F.heading,
            }}>
              {i < current
                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                : i + 1}
            </div>
            <span style={{ fontSize: 12.5, fontWeight: i === current ? 700 : 500, color: i === current ? C.text : C.textMuted, whiteSpace: 'nowrap', fontFamily: F.body }}>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: 1, height: 2, background: i < current ? C.green : C.border, margin: '0 14px', borderRadius: 99, transition: 'background 0.3s' }} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Field ──────────────────────────────────────────────────────────────── */
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.09em', fontFamily: F.body }}>{label}</label>
      {children}
      {hint && <p style={{ margin: 0, fontSize: 11.5, color: C.textMuted }}>{hint}</p>}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text', prefix }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string; prefix?: string }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {prefix && <span style={{ position: 'absolute', left: 14, fontSize: 13.5, fontWeight: 700, color: C.textSub, fontFamily: F.body, zIndex: 1 }}>{prefix}</span>}
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', padding: `12px 14px 12px ${prefix ? '50px' : '14px'}`, border: `1.5px solid ${C.border}`, borderRadius: 12, fontSize: 14, fontFamily: F.body, background: '#fff', color: C.text, outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box' }}
        onFocus={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.bluePale}`; }}
        onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; }}
      />
    </div>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ width: '100%', padding: '12px 14px', border: `1.5px solid ${C.border}`, borderRadius: 12, fontSize: 14, fontFamily: F.body, background: '#fff', color: value ? C.text : C.textMuted, outline: 'none', cursor: 'pointer', appearance: 'none' }}
    >
      <option value="">Select…</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function ApplyLoanPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>({
    loanType: '', amount: '', term: '24', purpose: '',
    firstName: 'Kwame', lastName: 'Asante', phone: '+233 24 000 0000',
    employment: '', employer: '', monthlyIncome: '', lender: '',
  });

  const set = (key: keyof FormData) => (v: string) => setForm(f => ({ ...f, [key]: v }));

  const steps = ['Loan Type', 'Loan Details', 'Your Info', 'Review'];

  const canNext = () => {
    if (step === 0) return !!form.loanType;
    if (step === 1) return !!form.amount && !!form.purpose && !!form.lender;
    if (step === 2) return !!form.employment && !!form.monthlyIncome;
    return true;
  };

  const handleSubmit = async () => {
    await new Promise(r => setTimeout(r, 1800));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <PortalShell title="Apply for Loan" backHref="/portal" backLabel="Dashboard">
        <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center', paddingTop: 60 }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}
            style={{ width: 80, height: 80, borderRadius: '50%', background: C.greenPale, border: `3px solid ${C.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </motion.div>
          <h2 style={{ margin: '0 0 10px', fontSize: 24, fontWeight: 900, color: C.text, fontFamily: F.heading, letterSpacing: '-0.04em' }}>Application Submitted!</h2>
          <p style={{ margin: '0 0 8px', fontSize: 14.5, color: C.textMuted, lineHeight: 1.7 }}>
            Your {LOAN_TYPES.find(l => l.id === form.loanType)?.label} application of <strong style={{ color: C.text }}>GH₵ {Number(form.amount).toLocaleString()}</strong> has been sent to <strong style={{ color: C.text }}>{form.lender}</strong>.
          </p>
          <p style={{ margin: '0 0 32px', fontSize: 13.5, color: C.textMuted }}>Reference: <strong style={{ color: C.blue, fontFamily: F.heading }}>APP-{Date.now().toString().slice(-8)}</strong></p>
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '20px 24px', marginBottom: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', textAlign: 'left' }}>
            {[
              { label: 'Loan Type', value: LOAN_TYPES.find(l => l.id === form.loanType)?.label ?? '' },
              { label: 'Amount', value: `GH₵ ${Number(form.amount).toLocaleString()}` },
              { label: 'Lender', value: form.lender },
              { label: 'Term', value: `${form.term} months` },
              { label: 'Purpose', value: form.purpose },
              { label: 'Status', value: 'Under Review' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
                <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: label === 'Status' ? C.amber : C.text, fontFamily: F.heading }}>{value}</p>
              </div>
            ))}
          </div>
          <button onClick={() => router.push('/portal')} style={{ background: `linear-gradient(135deg, ${C.blue}, ${C.blueLight})`, border: 'none', borderRadius: 14, padding: '14px 32px', color: '#fff', fontSize: 14, fontWeight: 800, fontFamily: F.heading, cursor: 'pointer', boxShadow: `0 6px 20px ${C.blue}44` }}>
            Back to Dashboard
          </button>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell title="Apply for Loan" backHref="/portal" backLabel="Dashboard">
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 900, color: C.text, fontFamily: F.heading, letterSpacing: '-0.04em' }}>Apply for a Loan</h1>
          <p style={{ margin: 0, fontSize: 14, color: C.textMuted }}>Compare rates from {LENDERS.length}+ verified lenders and get funded fast.</p>
        </div>

        <StepIndicator steps={steps} current={step} />

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>

            {/* Step 0 – Loan Type */}
            {step === 0 && (
              <div>
                <p style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: C.text, fontFamily: F.heading }}>What type of loan are you looking for?</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {LOAN_TYPES.map(lt => (
                    <button key={lt.id} onClick={() => set('loanType')(lt.id)}
                      style={{ background: form.loanType === lt.id ? lt.pale : '#fff', border: `2px solid ${form.loanType === lt.id ? lt.color : C.border}`, borderRadius: 18, padding: '22px 24px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', boxShadow: form.loanType === lt.id ? `0 4px 20px ${lt.color}22` : 'none' }}
                    >
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: lt.pale, display: 'flex', alignItems: 'center', justifyContent: 'center', color: lt.color, marginBottom: 14 }}>{lt.icon}</div>
                      <p style={{ margin: '0 0 4px', fontSize: 15.5, fontWeight: 800, color: C.text, fontFamily: F.heading, letterSpacing: '-0.02em' }}>{lt.label}</p>
                      <p style={{ margin: '0 0 14px', fontSize: 12.5, color: C.textMuted, lineHeight: 1.5 }}>{lt.desc}</p>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {[lt.max, lt.rate, lt.term].map(tag => (
                          <span key={tag} style={{ fontSize: 11, fontWeight: 700, color: lt.color, background: lt.pale, padding: '3px 8px', borderRadius: 6 }}>{tag}</span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1 – Loan Details */}
            {step === 1 && (
              <div style={{ background: '#fff', borderRadius: 22, padding: '32px', border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 22 }}>
                <Field label="Loan Amount (GH₵)" hint="Enter the amount you need">
                  <Input value={form.amount} onChange={set('amount')} placeholder="e.g. 15,000" type="number" prefix="GH₵" />
                </Field>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <Field label="Repayment Term">
                    <Select value={form.term} onChange={set('term')} options={['6', '12', '18', '24', '36', '48', '60', '72', '84'].map(v => v + ' months')} />
                  </Field>
                  <Field label="Preferred Lender">
                    <Select value={form.lender} onChange={set('lender')} options={LENDERS} />
                  </Field>
                </div>

                <Field label="Loan Purpose">
                  <Select value={form.purpose} onChange={set('purpose')} options={PURPOSES} />
                </Field>

                {/* Estimate */}
                {form.amount && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    style={{ background: C.bluePale, border: `1px solid ${C.blue}22`, borderRadius: 14, padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}
                  >
                    {[
                      { label: 'Est. Monthly', value: `GH₵ ${Math.round(Number(form.amount) * 0.045).toLocaleString()}` },
                      { label: 'Total Repayable', value: `GH₵ ${Math.round(Number(form.amount) * 1.25).toLocaleString()}` },
                      { label: 'Interest Rate', value: LOAN_TYPES.find(l => l.id === form.loanType)?.rate ?? '—' },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p style={{ margin: '0 0 3px', fontSize: 11, fontWeight: 700, color: C.blue, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
                        <p style={{ margin: 0, fontSize: 18, fontWeight: 900, color: C.text, fontFamily: F.heading, letterSpacing: '-0.03em' }}>{value}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            )}

            {/* Step 2 – Your Info */}
            {step === 2 && (
              <div style={{ background: '#fff', borderRadius: 22, padding: '32px', border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 22 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <Field label="First Name">
                    <Input value={form.firstName} onChange={set('firstName')} placeholder="Kwame" />
                  </Field>
                  <Field label="Last Name">
                    <Input value={form.lastName} onChange={set('lastName')} placeholder="Asante" />
                  </Field>
                </div>
                <Field label="Phone Number">
                  <Input value={form.phone} onChange={set('phone')} placeholder="+233 24 000 0000" />
                </Field>
                <Field label="Employment Status">
                  <Select value={form.employment} onChange={set('employment')} options={EMPLOYMENT} />
                </Field>
                <Field label="Employer / Business Name">
                  <Input value={form.employer} onChange={set('employer')} placeholder="Company or business name" />
                </Field>
                <Field label="Monthly Net Income (GH₵)" hint="Your take-home income after taxes">
                  <Input value={form.monthlyIncome} onChange={set('monthlyIncome')} type="number" prefix="GH₵" placeholder="e.g. 5,200" />
                </Field>
              </div>
            )}

            {/* Step 3 – Review */}
            {step === 3 && (
              <div style={{ background: '#fff', borderRadius: 22, padding: '32px', border: `1px solid ${C.border}` }}>
                <p style={{ margin: '0 0 22px', fontSize: 15, fontWeight: 800, color: C.text, fontFamily: F.heading }}>Review your application</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 32px' }}>
                  {[
                    { label: 'Loan Type', value: LOAN_TYPES.find(l => l.id === form.loanType)?.label ?? '' },
                    { label: 'Amount', value: `GH₵ ${Number(form.amount).toLocaleString()}` },
                    { label: 'Lender', value: form.lender },
                    { label: 'Term', value: `${form.term} months` },
                    { label: 'Purpose', value: form.purpose },
                    { label: 'Employment', value: form.employment },
                    { label: 'Employer', value: form.employer || '—' },
                    { label: 'Monthly Income', value: `GH₵ ${Number(form.monthlyIncome).toLocaleString()}` },
                    { label: 'Applicant', value: `${form.firstName} ${form.lastName}` },
                    { label: 'Phone', value: form.phone },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ borderBottom: `1px solid ${C.border}`, padding: '10px 0' }}>
                      <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.text, fontFamily: F.heading }}>{value}</p>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 22, padding: '14px 18px', background: C.amberPale, border: `1px solid ${C.amber}33`, borderRadius: 12, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <p style={{ margin: 0, fontSize: 12.5, color: C.textSub, lineHeight: 1.6 }}>By submitting you consent to a soft credit check. This will not affect your credit score.</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
          <button onClick={() => step > 0 ? setStep(s => s - 1) : router.push('/portal')}
            style={{ padding: '13px 24px', background: '#fff', border: `1.5px solid ${C.border}`, borderRadius: 14, fontSize: 14, fontWeight: 700, color: C.textSub, cursor: 'pointer', fontFamily: F.body, transition: 'all 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.color = C.blue; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSub; }}
          >
            {step === 0 ? '← Cancel' : '← Back'}
          </button>

          {step < steps.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
              style={{ padding: '13px 32px', background: canNext() ? `linear-gradient(135deg, ${C.blue}, ${C.blueLight})` : C.border, border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 800, color: '#fff', cursor: canNext() ? 'pointer' : 'not-allowed', fontFamily: F.heading, boxShadow: canNext() ? `0 6px 20px ${C.blue}44` : 'none', transition: 'all 0.2s' }}
            >
              Continue →
            </button>
          ) : (
            <SubmitButton onClick={handleSubmit} />
          )}
        </div>
      </div>
    </PortalShell>
  );
}

function SubmitButton({ onClick }: { onClick: () => void }) {
  const [loading, setLoading] = useState(false);
  return (
    <button onClick={async () => { setLoading(true); await onClick(); }}
      disabled={loading}
      style={{ padding: '13px 32px', background: loading ? C.textMuted : `linear-gradient(135deg, ${C.green}, #34d399)`, border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 800, color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: F.heading, boxShadow: loading ? 'none' : `0 6px 20px ${C.green}44`, display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}
    >
      {loading && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }} style={{ width: 16, height: 16, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />}
      {loading ? 'Submitting…' : 'Submit Application ✓'}
    </button>
  );
}
