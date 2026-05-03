'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import PortalShell, { C, F } from '../components/PortalShell';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

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
  // 1. Loan Config
  loanType: string; amount: string; term: string; purpose: string; lender: string;
  
  // 2. Personal Details
  title: string; firstName: string; lastName: string; dob: string; maritalStatus: string; 
  gender: string; dependants: string; nationality: string;
  residentialAddress: string; landmark: string; city: string; mmda: string;
  phone: string; email: string;

  // 3. Bank & Credit
  hasAccountWithLender: string; branch: string; accountNumber: string; yearsWithBank: string;
  existingLoan: string;
  
  // 4. Work Details
  employment: string; employer: string; yearsWithEmployer: string; workAddress: string; 
  occupation: string; sector: string; staffNo: string; ssnitNo: string;
  positionType: string; monthlyIncome: string; netSalary: string;

  // 5. Referees
  ref1Name: string; ref1Relation: string; ref1Phone: string;
  ref2Name: string; ref2Relation: string; ref2Phone: string;

  // 6. Non-Ghanaian
  arrivalDate: string; visaNo: string; visaExpiry: string; permitNo: string;
}

const isMobileStyle = (isMobile: boolean) => ({
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'row',
  gap: isMobile ? 12 : 20
});

/* ─── Step Indicator ─────────────────────────────────────────────────────── */
function StepIndicator({ steps, current, isMobile }: { steps: string[]; current: number; isMobile: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: isMobile ? 24 : 36 }}>
      {steps.map((label, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: isMobile ? 28 : 32, height: isMobile ? 28 : 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: i < current ? C.green : i === current ? C.blue : 'transparent',
              border: `2px solid ${i < current ? C.green : i === current ? C.blue : C.border}`,
              color: i <= current ? '#fff' : C.textMuted,
              fontSize: isMobile ? 10 : 12, fontWeight: 800, flexShrink: 0, transition: 'all 0.3s', fontFamily: F.heading,
            }}>
              {i < current
                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                : i + 1}
            </div>
            {!isMobile && <span style={{ fontSize: 12.5, fontWeight: i === current ? 700 : 500, color: i === current ? C.text : C.textMuted, whiteSpace: 'nowrap', fontFamily: F.body }}>{label}</span>}
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: 1, height: 2, background: i < current ? C.green : C.border, margin: isMobile ? '0 8px' : '0 14px', borderRadius: 99, transition: 'background 0.3s' }} />
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
    loanType: '', amount: '', term: '24', purpose: '', lender: '',
    title: '', firstName: '', lastName: '', dob: '', maritalStatus: '',
    gender: '', dependants: '', nationality: 'Ghanaian',
    residentialAddress: '', landmark: '', city: '', mmda: '',
    phone: '', email: '',
    hasAccountWithLender: 'No', branch: '', accountNumber: '', yearsWithBank: '',
    existingLoan: 'No',
    employment: '', employer: '', yearsWithEmployer: '', workAddress: '',
    occupation: '', sector: '', staffNo: '', ssnitNo: '',
    positionType: 'Permanent', monthlyIncome: '', netSalary: '',
    ref1Name: '', ref1Relation: '', ref1Phone: '',
    ref2Name: '', ref2Relation: '', ref2Phone: '',
    arrivalDate: '', visaNo: '', visaExpiry: '', permitNo: '',
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Universal Bridge: Pre-fill from Session/Onboarding
    const stored = sessionStorage.getItem('rb_user');
    if (stored) {
      const u = JSON.parse(stored);
      setForm(f => ({
        ...f,
        firstName: u.firstName || u.name?.split(' ')[0] || '',
        lastName: u.lastName || u.name?.split(' ')[1] || '',
        phone: u.phone || u.phoneNumber || '',
        dob: u.dateOfBirth?.split('T')[0] || '',
        residentialAddress: u.residentialAddress || '',
        city: u.city || '',
        mmda: u.mmda || '',
        landmark: u.landmark || '',
        occupation: u.occupation || '',
        ssnitNo: u.ssnitNo || '',
        employment: u.employmentStatus || '',
        monthlyIncome: u.monthlyIncome || ''
      }));
    }
    
    // Check if we came from Marketplace with a specific lender
    const params = new URLSearchParams(window.location.search);
    const preLender = params.get('lender');
    if (preLender) setForm(f => ({ ...f, lender: decodeURIComponent(preLender) }));
  }, []);

  const set = (key: keyof FormData) => (v: string | undefined) => setForm(f => ({ ...f, [key]: v || '' }));

  const steps = ['Product', 'Personal', 'Financials', 'Employment', 'Referees', 'Vault', 'Review'];

  const canNext = () => {
    if (step === 0) return !!form.loanType;
    if (step === 1) return !!form.firstName && !!form.lastName && !!form.phone;
    if (step === 2) return !!form.lender && !!form.amount;
    if (step === 3) return !!form.employment && !!form.monthlyIncome;
    if (step === 4) return !!form.ref1Name && !!form.ref1Phone;
    if (step === 5) return true; // Vault is usually optional or soft-gate
    return true;
  };

  const handleSubmit = async () => {
    await new Promise(r => setTimeout(r, 1800));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <PortalShell title="Apply for Loan" backHref="/portal" backLabel="Dashboard">
        <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center', padding: isMobile ? '40px 20px' : '60px 0' }}>
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
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: isMobile ? '16px' : '20px 24px', marginBottom: 28, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '12px' : '12px 24px', textAlign: 'left' }}>
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
          <button onClick={() => router.push('/portal')} style={{ background: `linear-gradient(135deg, ${C.blue}, ${C.blueLight})`, border: 'none', borderRadius: 14, padding: '14px 32px', color: '#fff', fontSize: 14, fontWeight: 800, fontFamily: F.heading, cursor: 'pointer', boxShadow: `0 6px 20px ${C.blue}44`, width: isMobile ? '100%' : 'auto' }}>
            Back to Dashboard
          </button>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell title="Apply for Loan" backHref="/portal" backLabel="Dashboard">
      <div style={{ maxWidth: 760, margin: '0 auto', padding: isMobile ? '0 0 100px' : 0 }}>
        <div style={{ marginBottom: isMobile ? 32 : 28 }}>
           <h1 style={{ margin: '0 0 6px', fontSize: isMobile ? 24 : 26, fontWeight: 900, color: C.text, fontFamily: F.heading, letterSpacing: '-0.04em' }}>Apply for a Loan</h1>
           <p style={{ margin: 0, fontSize: isMobile ? 13 : 14, color: C.textMuted }}>Compare rates from {LENDERS.length}+ verified lenders and get funded fast.</p>
        </div>

        <StepIndicator steps={steps} current={step} isMobile={isMobile} />

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>

            {/* Step 0 – Loan Type */}
            {step === 0 && (
              <div>
                <div style={{ 
                  background: `linear-gradient(135deg, ${C.bluePale}, #fff)`, 
                  padding: '16px 24px', 
                  borderRadius: 20, 
                  border: `1.5px solid ${C.blue}33`,
                  marginBottom: 32,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16
                }}>
                   <div style={{ width: 44, height: 44, borderRadius: '50%', background: C.blue, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                   </div>
                   <div>
                      <p style={{ margin: 0, fontSize: 15, fontWeight: 900, color: C.text, fontFamily: F.heading }}>Check your rate in 2 minutes</p>
                      <p style={{ margin: 0, fontSize: 13, color: C.textSub }}>Get personalized offers with **no impact on your credit score**.</p>
                   </div>
                </div>

                <p style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: C.text, fontFamily: F.heading }}>What type of loan are you looking for?</p>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 12 : 14 }}>
                  {LOAN_TYPES.map(lt => (
                    <button key={lt.id} onClick={() => set('loanType')(lt.id)}
                      style={{ background: form.loanType === lt.id ? lt.pale : '#fff', border: `2px solid ${form.loanType === lt.id ? lt.color : C.border}`, borderRadius: 18, padding: isMobile ? '18px' : '22px 24px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', boxShadow: form.loanType === lt.id ? `0 4px 20px ${lt.color}22` : 'none' }}
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
            {step === 1 && (
              <div style={{ background: '#fff', borderRadius: 22, padding: isMobile ? '24px' : '32px', border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 28 }}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.5fr 1.5fr', gap: 20 }}>
                   <Field label="Title">
                      <Select value={form.title} onChange={set('title')} options={['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Rev.']} />
                   </Field>
                   <Field label="First Name">
                      <Input value={form.firstName} onChange={set('firstName')} placeholder="John" />
                   </Field>
                   <Field label="Last Name">
                      <Input value={form.lastName} onChange={set('lastName')} placeholder="Doe" />
                   </Field>
                </div>
                <Field label="Phone Number">
                  <PhoneInput international defaultCountry="GH" value={form.phone} onChange={set('phone')} className="w-full h-[46px] border border-slate-200 rounded-xl px-4 text-sm bg-white" />
                </Field>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 20 }}>
                   <Field label="Date of Birth">
                      <Input value={form.dob} onChange={set('dob')} type="date" />
                   </Field>
                   <Field label="Marital Status">
                      <Select value={form.maritalStatus} onChange={set('maritalStatus')} options={['Single', 'Married', 'Divorced', 'Widowed']} />
                   </Field>
                   <Field label="Gender">
                      <Select value={form.gender} onChange={set('gender')} options={['Male', 'Female', 'Other']} />
                   </Field>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
                   <Field label="Nationality">
                      <Select value={form.nationality} onChange={set('nationality')} options={['Ghanaian', 'Nigerian', 'Kenyan', 'British', 'American', 'Other']} />
                   </Field>
                   <Field label="No. of Dependants">
                      <Input value={form.dependants} onChange={set('dependants')} type="number" placeholder="0" />
                   </Field>
                </div>
                {form.nationality !== 'Ghanaian' && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ border: `1.5px solid ${C.amber}33`, background: `${C.amber}08`, padding: 24, borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
                     <p style={{ margin: 0, fontSize: 12, fontWeight: 900, color: C.amber, textTransform: 'uppercase', letterSpacing: '0.05em' }}>International Applicant Details</p>
                     <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
                        <Field label="Arrival Date in Ghana">
                           <Input value={form.arrivalDate} onChange={set('arrivalDate')} type="date" />
                        </Field>
                        <Field label="Visa / Permit Number">
                           <Input value={form.visaNo} onChange={set('visaNo')} placeholder="GHA-0000000" />
                        </Field>
                     </div>
                     <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
                        <Field label="Visa Expiry Date">
                           <Input value={form.visaExpiry} onChange={set('visaExpiry')} type="date" />
                        </Field>
                        <Field label="Resident Permit No.">
                           <Input value={form.permitNo} onChange={set('permitNo')} placeholder="P-000000" />
                        </Field>
                     </div>
                  </motion.div>
                )}
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
                   <h3 style={{ fontSize: 13, fontWeight: 800, color: C.textSub, marginBottom: 20, textTransform: 'uppercase' }}>Residential Address</h3>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      <Field label="Street / House Number">
                         <Input value={form.residentialAddress} onChange={set('residentialAddress')} placeholder="e.g. House No. 12, Independence Ave" />
                      </Field>
                      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
                         <Field label="City">
                            <Input value={form.city} onChange={set('city')} placeholder="Accra" />
                         </Field>
                         <Field label="Nearest Landmark">
                            <Input value={form.landmark} onChange={set('landmark')} placeholder="e.g. Near Jubilee House" />
                         </Field>
                      </div>
                      <Field label="MMDA (District Assembly)">
                         <Input value={form.mmda} onChange={set('mmda')} placeholder="e.g. Accra Metropolitan Assembly" />
                      </Field>
                   </div>
                </div>
              </div>
            )}

            {/* Step 2 – Financial Profile */}
            {step === 2 && (
              <div style={{ background: '#fff', borderRadius: 22, padding: isMobile ? '24px' : '32px', border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 28 }}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr', gap: 20 }}>
                   <Field label="Preferred Lender">
                      <Select value={form.lender} onChange={set('lender')} options={LENDERS} />
                   </Field>
                   <Field label="Account with Lender?">
                      <Select value={form.hasAccountWithLender} onChange={set('hasAccountWithLender')} options={['Yes', 'No']} />
                   </Field>
                </div>
                {form.hasAccountWithLender === 'Yes' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
                     <Field label="Branch Name">
                        <Input value={form.branch} onChange={set('branch')} placeholder="e.g. Ridge Branch" />
                     </Field>
                     <Field label="Account Number">
                        <Input value={form.accountNumber} onChange={set('accountNumber')} placeholder="000000000000" />
                     </Field>
                  </motion.div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: 20 }}>
                   <Field label="Loan Amount (GH₵)">
                      <Input value={form.amount} onChange={set('amount')} prefix="GH₵" placeholder="10,000" />
                   </Field>
                   <Field label="Repayment Term">
                      <Select value={form.term} onChange={set('term')} options={['12', '24', '36', '48', '60'].map(v => v + ' months')} />
                   </Field>
                </div>
                <Field label="Purpose of Loan">
                   <Select value={form.purpose} onChange={set('purpose')} options={PURPOSES} />
                </Field>
              </div>
            )}

            {/* Step 3 – Employment Details */}
            {step === 3 && (
              <div style={{ background: '#fff', borderRadius: 22, padding: isMobile ? '24px' : '32px', border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 28 }}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: 20 }}>
                   <Field label="Employment Status">
                      <Select value={form.employment} onChange={set('employment')} options={EMPLOYMENT} />
                   </Field>
                   <Field label="Position Type">
                      <Select value={form.positionType} onChange={set('positionType')} options={['Permanent', 'Contract', 'Temporary']} />
                   </Field>
                </div>
                <Field label="Current Employer Name">
                   <Input value={form.employer} onChange={set('employer')} placeholder="e.g. MTN Ghana" />
                </Field>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
                   <Field label="Occupation">
                      <Input value={form.occupation} onChange={set('occupation')} placeholder="e.g. Software Engineer" />
                   </Field>
                   <Field label="No. of Years Employed">
                      <Input value={form.yearsWithEmployer} onChange={set('yearsWithEmployer')} type="number" placeholder="2" />
                   </Field>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
                   <Field label="Monthly Net Income (GH₵)">
                      <Input value={form.monthlyIncome} onChange={set('monthlyIncome')} prefix="GH₵" placeholder="5,000" />
                   </Field>
                   <Field label="SSNIT Number">
                      <Input value={form.ssnitNo} onChange={set('ssnitNo')} placeholder="E000000000000" />
                   </Field>
                </div>
              </div>
            )}

            {/* Step 4 – Referees */}
            {step === 4 && (
              <div style={{ background: '#fff', borderRadius: 22, padding: isMobile ? '24px' : '32px', border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 28 }}>
                 <div>
                    <h3 style={{ fontSize: 13, fontWeight: 800, color: C.textSub, marginBottom: 20, textTransform: 'uppercase' }}>Referee 1 (Relative / Next of Kin)</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                       <Field label="Full Name">
                          <Input value={form.ref1Name} onChange={set('ref1Name')} placeholder="e.g. Mary Doe" />
                       </Field>
                       <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
                          <Field label="Relationship">
                             <Input value={form.ref1Relation} onChange={set('ref1Relation')} placeholder="e.g. Sister" />
                          </Field>
                          <Field label="Phone Number">
                            <PhoneInput international defaultCountry="GH" value={form.ref1Phone} onChange={set('ref1Phone')} className="w-full h-[46px] border border-slate-200 rounded-xl px-4 text-sm bg-white" />
                          </Field>
                       </div>
                    </div>
                 </div>
                 <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, marginTop: 8 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 800, color: C.textSub, marginBottom: 20, textTransform: 'uppercase' }}>Referee 2 (Non-Relative)</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                       <Field label="Full Name">
                          <Input value={form.ref2Name} onChange={set('ref2Name')} placeholder="e.g. Kwame Mensah" />
                       </Field>
                       <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
                          <Field label="Relationship">
                             <Input value={form.ref2Relation} onChange={set('ref2Relation')} placeholder="e.g. Colleague" />
                          </Field>
                          <Field label="Phone Number">
                            <PhoneInput international defaultCountry="GH" value={form.ref2Phone} onChange={set('ref2Phone')} className="w-full h-[46px] border border-slate-200 rounded-xl px-4 text-sm bg-white" />
                          </Field>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {/* Step 5 – Digital Vault */}
            {step === 5 && (
              <div style={{ background: '#fff', borderRadius: 22, padding: isMobile ? '24px' : '32px', border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 28 }}>
                <div>
                   <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 900, color: C.text, fontFamily: F.heading }}>The Resolve Digital Vault</p>
                   <p style={{ margin: '0 0 24px', fontSize: 13, color: C.textMuted }}>Upload your bank-required documents once. We handle the submission.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
                    {[
                     { l: 'Ghana Card', i: '🪪' },
                     { l: '3 Months Payslips', i: '📄' },
                     { l: 'Utility Bill', i: '🏘️' },
                     { l: 'Bank Statement', i: '🏦' },
                     { l: 'Undertaking Letter', i: '📜', help: 'Required for salaried loans' },
                     { l: 'Passport Picture', i: '📸' }
                   ].map(doc => (
                    <div key={doc.l} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label style={{ fontSize: 10, fontWeight: 900, color: C.textSub, textTransform: 'uppercase' }}>{doc.l}</label>
                          {doc.l === 'Undertaking Letter' && <button style={{ background: 'none', border: 'none', color: C.blue, fontSize: 9, fontWeight: 800, cursor: 'pointer' }}>Get Template ↓</button>}
                       </div>
                       <div style={{ border: `2px dashed ${C.border}`, borderRadius: 16, padding: 20, textAlign: 'center', background: '#f8fafc', cursor: 'pointer' }}>
                          <span style={{ fontSize: 20 }}>{doc.i}</span>
                       </div>
                    </div>
                   ))}
                </div>

                <div style={{ padding: '16px 20px', borderRadius: 16, background: C.emeraldLight, border: `1px solid ${C.emerald}22`, display: 'flex', gap: 12, alignItems: 'center' }}>
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.emerald} strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                   <p style={{ margin: 0, fontSize: 12, color: C.emerald, fontWeight: 700 }}>Documents are encrypted and will only be shared with {form.lender || 'your chosen lender'}.</p>
                </div>
              </div>
            )}
            {/* Step 6 – Review */}
            {step === 6 && (
              <div style={{ background: '#fff', borderRadius: 22, padding: isMobile ? '24px' : '32px', border: `1px solid ${C.border}` }}>
                <p style={{ margin: '0 0 22px', fontSize: 15, fontWeight: 800, color: C.text, fontFamily: F.heading }}>Review your application</p>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '8px' : '12px 32px' }}>
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
              style={{ flex: isMobile ? 1 : 'none', padding: '13px 32px', background: canNext() ? `linear-gradient(135deg, ${C.blue}, ${C.blueLight})` : C.border, border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 800, color: '#fff', cursor: canNext() ? 'pointer' : 'not-allowed', fontFamily: F.heading, boxShadow: canNext() ? `0 6px 20px ${C.blue}44` : 'none', transition: 'all 0.2s' }}
            >
              Continue →
            </button>
          ) : (
            <SubmitButton onClick={handleSubmit} isMobile={isMobile} />
          )}
        </div>
      </div>
    </PortalShell>
  );
}

function SubmitButton({ onClick, isMobile }: { onClick: () => void; isMobile: boolean }) {
  const [loading, setLoading] = useState(false);
  return (
    <button onClick={async () => { setLoading(true); await onClick(); }}
      disabled={loading}
      style={{ flex: isMobile ? 1 : 'none', padding: '13px 32px', background: loading ? C.textMuted : `linear-gradient(135deg, ${C.green}, #34d399)`, border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 800, color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: F.heading, boxShadow: loading ? 'none' : `0 6px 20px ${C.green}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}
    >
      {loading && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }} style={{ width: 16, height: 16, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />}
      {loading ? 'Submitting…' : 'Submit Application ✓'}
    </button>
  );
}
