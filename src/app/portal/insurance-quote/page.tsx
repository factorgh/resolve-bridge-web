'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import PortalShell, { C, F } from '../components/PortalShell';

const INSURANCE_TYPES = [
  { id: 'health', label: 'Health Insurance', desc: 'Individual & family cover, hospitalisation, outpatient', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, color: C.green, pale: C.greenPale },
  { id: 'life', label: 'Life Insurance', desc: 'Term life, whole life, and investment-linked plans', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, color: C.blue, pale: C.bluePale },
  { id: 'auto', label: 'Auto Insurance', desc: 'Comprehensive, third-party, and fleet cover', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, color: C.amber, pale: C.amberPale },
  { id: 'property', label: 'Property Insurance', desc: 'Home and commercial property protection', icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, color: C.purple, pale: C.purplePale },
];

const PROVIDERS = ['Prudential Life', 'Enterprise Group', 'SIC Insurance', 'Star Assurance', 'Phoenix Insurance', 'Hollard Insurance'];
const FREQUENCY = ['Monthly', 'Quarterly', 'Semi-Annually', 'Annually'];

interface QuoteForm {
  type: string; dob: string; gender: string; smoker: string;
  dependants: string; coverAmount: string; frequency: string; provider: string;
}

function StepDot({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? C.green : active ? C.blue : 'transparent', border: `2px solid ${done ? C.green : active ? C.blue : C.border}`, color: done ? '#fff' : active ? '#fff' : C.textMuted, fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
        {done ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> : active ? '●' : '○'}
      </div>
      <span style={{ fontSize: 12, fontWeight: active ? 700 : 500, color: active ? C.text : C.textMuted, whiteSpace: 'nowrap', fontFamily: F.body }}>{label}</span>
    </div>
  );
}

export default function InsuranceQuotePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [quoted, setQuoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<QuoteForm>({ type: '', dob: '1990-06-15', gender: 'Male', smoker: 'No', dependants: '1', coverAmount: '200000', frequency: 'Monthly', provider: '' });

  const set = (k: keyof QuoteForm) => (v: string) => setForm(f => ({ ...f, [k]: v }));
  const type = INSURANCE_TYPES.find(t => t.id === form.type);

  // Estimated premium calculation
  const age = form.dob ? new Date().getFullYear() - new Date(form.dob).getFullYear() : 30;
  const base = Number(form.coverAmount) * 0.0025;
  const ageAdj = age > 40 ? 1.3 : age > 50 ? 1.6 : 1;
  const smokerAdj = form.smoker === 'Yes' ? 1.4 : 1;
  const monthly = Math.round(base * ageAdj * smokerAdj);
  const annual = monthly * 11;

  const handleGetQuote = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setQuoted(true);
    setStep(3);
  };

  return (
    <PortalShell title="Insurance Quote" backHref="/portal" backLabel="Dashboard">
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 900, color: C.text, fontFamily: F.heading, letterSpacing: '-0.04em' }}>Get an Insurance Quote</h1>
          <p style={{ margin: 0, fontSize: 14, color: C.textMuted }}>Instant quotes from {PROVIDERS.length} verified insurers across Africa.</p>
        </div>

        {/* Step dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 32 }}>
          {['Cover Type', 'Your Details', 'Preferences', 'Your Quote'].map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < 3 ? 1 : 'none' }}>
              <StepDot active={step === i} done={step > i} label={label} />
              {i < 3 && <div style={{ flex: 1, height: 2, background: step > i ? C.green : C.border, margin: '0 12px', borderRadius: 99, transition: 'background 0.3s' }} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>

            {/* Step 0 – Type */}
            {step === 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {INSURANCE_TYPES.map(it => (
                  <button key={it.id} onClick={() => { set('type')(it.id); setStep(1); }}
                    style={{ background: form.type === it.id ? it.pale : '#fff', border: `2px solid ${form.type === it.id ? it.color : C.border}`, borderRadius: 20, padding: '24px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.22s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = it.color; e.currentTarget.style.boxShadow = `0 4px 20px ${it.color}22`; }}
                    onMouseLeave={e => { if (form.type !== it.id) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; } }}
                  >
                    <div style={{ width: 52, height: 52, borderRadius: 15, background: it.pale, display: 'flex', alignItems: 'center', justifyContent: 'center', color: it.color, marginBottom: 16 }}>{it.icon}</div>
                    <p style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 800, color: C.text, fontFamily: F.heading, letterSpacing: '-0.02em' }}>{it.label}</p>
                    <p style={{ margin: 0, fontSize: 12.5, color: C.textMuted, lineHeight: 1.55 }}>{it.desc}</p>
                  </button>
                ))}
              </div>
            )}

            {/* Step 1 – Details */}
            {step === 1 && (
              <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 22, padding: '32px', display: 'flex', flexDirection: 'column', gap: 22 }}>
                {type && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: type.pale, borderRadius: 14, marginBottom: 4 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: type.pale, display: 'flex', alignItems: 'center', justifyContent: 'center', color: type.color }}>{type.icon}</div>
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: C.text, fontFamily: F.heading }}>{type.label}</p>
                      <p style={{ margin: 0, fontSize: 12, color: C.textMuted }}>{type.desc}</p>
                    </div>
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.09em', fontFamily: F.body }}>Date of Birth</label>
                    <input type="date" value={form.dob} onChange={e => set('dob')(e.target.value)} style={{ padding: '12px 14px', border: `1.5px solid ${C.border}`, borderRadius: 12, fontSize: 14, fontFamily: F.body, background: '#fff', color: C.text, outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.09em', fontFamily: F.body }}>Gender</label>
                    <div style={{ display: 'flex', gap: 10 }}>
                      {['Male', 'Female'].map(g => (
                        <button key={g} onClick={() => set('gender')(g)} style={{ flex: 1, padding: '12px', border: `2px solid ${form.gender === g ? C.blue : C.border}`, borderRadius: 12, background: form.gender === g ? C.bluePale : '#fff', color: form.gender === g ? C.blue : C.textSub, fontWeight: 700, fontSize: 13.5, cursor: 'pointer', fontFamily: F.body, transition: 'all 0.18s' }}>{g}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.09em', fontFamily: F.body }}>Do you smoke?</label>
                    <div style={{ display: 'flex', gap: 10 }}>
                      {['No', 'Yes'].map(s => (
                        <button key={s} onClick={() => set('smoker')(s)} style={{ flex: 1, padding: '12px', border: `2px solid ${form.smoker === s ? C.blue : C.border}`, borderRadius: 12, background: form.smoker === s ? C.bluePale : '#fff', color: form.smoker === s ? C.blue : C.textSub, fontWeight: 700, fontSize: 13.5, cursor: 'pointer', fontFamily: F.body, transition: 'all 0.18s' }}>{s}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.09em', fontFamily: F.body }}>Dependants</label>
                    <select value={form.dependants} onChange={e => set('dependants')(e.target.value)} style={{ padding: '12px 14px', border: `1.5px solid ${C.border}`, borderRadius: 12, fontSize: 14, fontFamily: F.body, background: '#fff', color: C.text, outline: 'none' }}>
                      {['0', '1', '2', '3', '4', '5+'].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <button onClick={() => setStep(0)} style={{ padding: '13px 24px', background: '#fff', border: `1.5px solid ${C.border}`, borderRadius: 14, fontSize: 14, fontWeight: 700, color: C.textSub, cursor: 'pointer', fontFamily: F.body }}>← Back</button>
                  <button onClick={() => setStep(2)} style={{ padding: '13px 32px', background: `linear-gradient(135deg, ${C.blue}, ${C.blueLight})`, border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 800, color: '#fff', cursor: 'pointer', fontFamily: F.heading, boxShadow: `0 6px 20px ${C.blue}44` }}>Continue →</button>
                </div>
              </div>
            )}

            {/* Step 2 – Preferences */}
            {step === 2 && (
              <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 22, padding: '32px', display: 'flex', flexDirection: 'column', gap: 22 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.09em', fontFamily: F.body }}>Cover Amount (GH₵)</label>
                  <input type="range" min={50000} max={1000000} step={25000} value={form.coverAmount} onChange={e => set('coverAmount')(e.target.value)} style={{ width: '100%', accentColor: C.blue }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: C.textMuted }}>GH₵ 50,000</span>
                    <span style={{ fontSize: 18, fontWeight: 900, color: C.blue, fontFamily: F.heading, letterSpacing: '-0.03em' }}>GH₵ {Number(form.coverAmount).toLocaleString()}</span>
                    <span style={{ fontSize: 12, color: C.textMuted }}>GH₵ 1,000,000</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.09em', fontFamily: F.body }}>Payment Frequency</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {FREQUENCY.map(f => (
                        <button key={f} onClick={() => set('frequency')(f)} style={{ padding: '10px 8px', border: `2px solid ${form.frequency === f ? C.blue : C.border}`, borderRadius: 10, background: form.frequency === f ? C.bluePale : '#fff', color: form.frequency === f ? C.blue : C.textSub, fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: F.body, transition: 'all 0.18s' }}>{f}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.09em', fontFamily: F.body }}>Preferred Provider</label>
                    <select value={form.provider} onChange={e => set('provider')(e.target.value)} style={{ padding: '12px 14px', border: `1.5px solid ${C.border}`, borderRadius: 12, fontSize: 14, fontFamily: F.body, background: '#fff', color: form.provider ? C.text : C.textMuted, outline: 'none', marginBottom: 8 }}>
                      <option value="">Any provider</option>
                      {PROVIDERS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <p style={{ margin: 0, fontSize: 11.5, color: C.textMuted }}>Leave blank for best offer</p>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <button onClick={() => setStep(1)} style={{ padding: '13px 24px', background: '#fff', border: `1.5px solid ${C.border}`, borderRadius: 14, fontSize: 14, fontWeight: 700, color: C.textSub, cursor: 'pointer', fontFamily: F.body }}>← Back</button>
                  <button onClick={handleGetQuote} disabled={loading}
                    style={{ padding: '13px 32px', background: loading ? C.textMuted : `linear-gradient(135deg, ${C.green}, #34d399)`, border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 800, color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: F.heading, boxShadow: loading ? 'none' : `0 6px 20px ${C.green}44`, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {loading ? (<><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }} style={{ width: 16, height: 16, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />Calculating…</>) : 'Get My Quote →'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 – Quote result */}
            {step === 3 && quoted && type && (
              <div>
                <div style={{ background: `linear-gradient(135deg, ${type.color}15, ${type.color}05)`, border: `1px solid ${type.color}33`, borderRadius: 22, padding: '28px 32px', marginBottom: 20, textAlign: 'center' }}>
                  <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: type.color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Your Estimated Premium</p>
                  <p style={{ margin: '0 0 4px', fontSize: 48, fontWeight: 900, color: C.text, fontFamily: F.heading, letterSpacing: '-0.05em' }}>GH₵ {monthly.toLocaleString()}</p>
                  <p style={{ margin: '0 0 18px', fontSize: 14, color: C.textMuted }}>per month · GH₵ {annual.toLocaleString()} per year</p>
                  <div style={{ display: 'inline-flex', gap: 16, background: '#fff', padding: '12px 20px', borderRadius: 14, border: `1px solid ${C.border}` }}>
                    {[
                      { label: 'Cover Amount', value: `GH₵ ${Number(form.coverAmount).toLocaleString()}` },
                      { label: 'Age', value: `${age} years` },
                      { label: 'Type', value: type.label },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ textAlign: 'center' }}>
                        <p style={{ margin: '0 0 2px', fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
                        <p style={{ margin: 0, fontSize: 13.5, fontWeight: 800, color: C.text, fontFamily: F.heading }}>{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <p style={{ margin: '0 0 14px', fontSize: 13.5, fontWeight: 700, color: C.textSub, fontFamily: F.heading }}>Available plans from {PROVIDERS.length} insurers</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                  {PROVIDERS.slice(0, 4).map((prov, i) => (
                    <div key={prov} style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 42, height: 42, borderRadius: 12, background: type.pale, display: 'flex', alignItems: 'center', justifyContent: 'center', color: type.color, fontSize: 20 }}>🏢</div>
                        <div>
                          <p style={{ margin: '0 0 3px', fontSize: 14, fontWeight: 800, color: C.text, fontFamily: F.heading }}>{prov}</p>
                          <p style={{ margin: 0, fontSize: 12, color: C.textMuted }}>AA-rated · Est. 1985 · Over 250k policyholders</p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: '0 0 3px', fontSize: 18, fontWeight: 900, color: type.color, fontFamily: F.heading }}>GH₵ {(monthly + i * 15).toLocaleString()}/mo</p>
                        <button style={{ background: type.pale, border: `1px solid ${type.color}33`, borderRadius: 8, padding: '5px 14px', fontSize: 12, fontWeight: 700, color: type.color, cursor: 'pointer', fontFamily: F.body }}>Select Plan</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => { setStep(0); setQuoted(false); setForm(f => ({ ...f, type: '' })); }} style={{ flex: 1, padding: '13px', background: '#fff', border: `1.5px solid ${C.border}`, borderRadius: 14, fontSize: 14, fontWeight: 700, color: C.textSub, cursor: 'pointer', fontFamily: F.body }}>Start Over</button>
                  <button onClick={() => router.push('/portal')} style={{ flex: 1, padding: '13px', background: `linear-gradient(135deg, ${C.blue}, ${C.blueLight})`, border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 800, color: '#fff', cursor: 'pointer', fontFamily: F.heading, boxShadow: `0 6px 20px ${C.blue}44` }}>Back to Dashboard</button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </PortalShell>
  );
}
