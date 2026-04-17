'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PortalShell, { C, F } from '../components/PortalShell';

const STATEMENT_TYPES = [
  { id: 'all', label: 'All Transactions', desc: 'Complete record of credits, debits, and adjustments', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> },
  { id: 'loans', label: 'Loan Statements', desc: 'Repayment schedule, outstanding balances, interest paid', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
  { id: 'insurance', label: 'Insurance Records', desc: 'Policy details, premium history, claim records', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { id: 'credit', label: 'Credit Report', desc: 'Credit score history, enquiries and factors breakdown', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
];

const FORMATS = [
  { id: 'pdf', label: 'PDF', desc: 'Best for printing & sharing', icon: '📄' },
  { id: 'csv', label: 'CSV / Excel', desc: 'Best for data analysis', icon: '📊' },
  { id: 'json', label: 'JSON Data', desc: 'Best for developers', icon: '{ }' },
];

const PRESET_RANGES = [
  { label: 'Last 30 days', from: -30 },
  { label: 'Last 3 months', from: -90 },
  { label: 'Last 6 months', from: -180 },
  { label: 'This year', from: 'year' },
  { label: 'Last year', from: 'lastyear' },
  { label: 'Custom', from: 'custom' },
];

const MOCK_TRANSACTIONS = [
  { date: 'Apr 14, 2026', desc: 'Loan Repayment', amount: '−GH₵ 850', type: 'debit', cat: 'Loan' },
  { date: 'Apr 10, 2026', desc: 'Insurance Premium', amount: '−GH₵ 320', type: 'debit', cat: 'Insurance' },
  { date: 'Apr 1, 2026', desc: 'Salary Credit', amount: '+GH₵ 5,200', type: 'credit', cat: 'Income' },
  { date: 'Mar 28, 2026', desc: 'BNPL Installment', amount: '−GH₵ 450', type: 'debit', cat: 'BNPL' },
  { date: 'Mar 25, 2026', desc: 'Interest Rebate', amount: '+GH₵ 85', type: 'credit', cat: 'Adjustment' },
  { date: 'Mar 1, 2026', desc: 'Salary Credit', amount: '+GH₵ 5,200', type: 'credit', cat: 'Income' },
  { date: 'Mar 14, 2026', desc: 'Loan Repayment', amount: '−GH₵ 850', type: 'debit', cat: 'Loan' },
  { date: 'Mar 10, 2026', desc: 'Insurance Premium', amount: '−GH₵ 320', type: 'debit', cat: 'Insurance' },
];

function getDateRange(preset: string | number) {
  const now = new Date();
  if (typeof preset === 'number') {
    const from = new Date(now);
    from.setDate(from.getDate() + preset);
    return { from: from.toLocaleDateString('en-GB'), to: now.toLocaleDateString('en-GB') };
  }
  if (preset === 'year') return { from: `1 Jan ${now.getFullYear()}`, to: now.toLocaleDateString('en-GB') };
  if (preset === 'lastyear') return { from: `1 Jan ${now.getFullYear() - 1}`, to: `31 Dec ${now.getFullYear() - 1}` };
  return { from: '', to: '' };
}

export default function StatementPage() {
  const [stType, setStType] = useState('');
  const [format, setFormat] = useState('pdf');
  const [range, setRange] = useState<string | number>(-30);
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const [preview, setPreview] = useState(false);

  const dateRange = range === 'custom' ? { from: customFrom, to: customTo } : getDateRange(range as string | number);

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 2200));
    setGenerating(false);
    setDone(true);
  };

  const fileName = `ResolveBridge_${stType || 'Statement'}_${format.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.${format === 'json' ? 'json' : format === 'csv' ? 'csv' : 'pdf'}`;

  return (
    <PortalShell title="Statements" backHref="/portal" backLabel="Dashboard">
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 900, color: C.text, fontFamily: F.heading, letterSpacing: '-0.04em' }}>Download Statement</h1>
          <p style={{ margin: 0, fontSize: 14, color: C.textMuted }}>Configure and export your financial records in seconds.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, alignItems: 'start' }}>

          {/* Left: config */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Statement Type */}
            <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 22, padding: '24px 26px' }}>
              <p style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 800, color: C.text, fontFamily: F.heading, letterSpacing: '-0.02em' }}>Statement Type</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {STATEMENT_TYPES.map(st => (
                  <button key={st.id} onClick={() => setStType(st.id)}
                    style={{ background: stType === st.id ? C.bluePale : '#f8fafc', border: `2px solid ${stType === st.id ? C.blue : C.border}`, borderRadius: 14, padding: '14px 16px', cursor: 'pointer', textAlign: 'left', gap: 10, display: 'flex', flexDirection: 'column', transition: 'all 0.18s' }}
                    onMouseEnter={e => { if (stType !== st.id) { e.currentTarget.style.borderColor = C.blue + '88'; e.currentTarget.style.background = C.bluePale + '55'; } }}
                    onMouseLeave={e => { if (stType !== st.id) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = '#f8fafc'; } }}
                  >
                    <div style={{ color: stType === st.id ? C.blue : C.textSub }}>{st.icon}</div>
                    <div>
                      <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 800, color: stType === st.id ? C.blue : C.text, fontFamily: F.heading }}>{st.label}</p>
                      <p style={{ margin: 0, fontSize: 11, color: C.textMuted, lineHeight: 1.4 }}>{st.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 22, padding: '24px 26px' }}>
              <p style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 800, color: C.text, fontFamily: F.heading, letterSpacing: '-0.02em' }}>Date Range</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: range === 'custom' ? 16 : 0 }}>
                {PRESET_RANGES.map(pr => (
                  <button key={String(pr.from)} onClick={() => setRange(pr.from)}
                    style={{ padding: '8px 14px', border: `2px solid ${range === pr.from ? C.blue : C.border}`, borderRadius: 10, background: range === pr.from ? C.bluePale : '#f8fafc', color: range === pr.from ? C.blue : C.textSub, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: F.body, transition: 'all 0.18s' }}>
                    {pr.label}
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {range === 'custom' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, overflow: 'hidden', paddingTop: 4 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 6 }}>From</label>
                      <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 13.5, fontFamily: F.body, background: '#fff', color: C.text, outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 6 }}>To</label>
                      <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 13.5, fontFamily: F.body, background: '#fff', color: C.text, outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Format */}
            <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 22, padding: '24px 26px' }}>
              <p style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 800, color: C.text, fontFamily: F.heading, letterSpacing: '-0.02em' }}>Export Format</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {FORMATS.map(f => (
                  <button key={f.id} onClick={() => setFormat(f.id)}
                    style={{ flex: 1, padding: '14px 12px', border: `2px solid ${format === f.id ? C.blue : C.border}`, borderRadius: 14, background: format === f.id ? C.bluePale : '#f8fafc', cursor: 'pointer', textAlign: 'center', transition: 'all 0.18s' }}
                    onMouseEnter={e => { if (format !== f.id) e.currentTarget.style.borderColor = C.blue + '66'; }}
                    onMouseLeave={e => { if (format !== f.id) e.currentTarget.style.borderColor = C.border; }}
                  >
                    <p style={{ margin: '0 0 4px', fontSize: 20 }}>{f.icon}</p>
                    <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 800, color: format === f.id ? C.blue : C.text, fontFamily: F.heading }}>{f.label}</p>
                    <p style={{ margin: 0, fontSize: 11, color: C.textMuted, lineHeight: 1.4 }}>{f.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <button onClick={done ? () => setDone(false) : handleGenerate}
              disabled={generating || (!stType && !done)}
              style={{ padding: '16px 32px', background: done ? `linear-gradient(135deg, ${C.green}, #34d399)` : !stType ? C.border : generating ? C.textMuted : `linear-gradient(135deg, ${C.blue}, ${C.blueLight})`, border: 'none', borderRadius: 16, fontSize: 15, fontWeight: 800, color: '#fff', cursor: (!stType && !done) || generating ? 'not-allowed' : 'pointer', fontFamily: F.heading, boxShadow: (!stType && !done) || generating ? 'none' : `0 8px 24px ${done ? C.green : C.blue}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.3s' }}
            >
              {generating ? (
                <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }} style={{ width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />Generating Statement…</>
              ) : done ? (
                <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Download {fileName.split('.').pop()?.toUpperCase()}</>
              ) : (
                <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Generate Statement</>
              )}
            </button>
          </div>

          {/* Right: Preview */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 22, padding: '24px 26px', position: 'sticky', top: 90 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: C.text, fontFamily: F.heading }}>Preview</p>
              <button onClick={() => setPreview(v => !v)} style={{ fontSize: 12, fontWeight: 700, color: C.blue, background: C.bluePale, border: 'none', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontFamily: F.body }}>
                {preview ? 'Hide' : 'Show'} Data
              </button>
            </div>

            {/* Summary box */}
            <div style={{ background: C.bg, borderRadius: 14, padding: '16px', marginBottom: 16 }}>
              {[
                { label: 'Type', value: STATEMENT_TYPES.find(s => s.id === stType)?.label ?? 'Not selected' },
                { label: 'Period', value: range === 'custom' ? `${customFrom || '—'} → ${customTo || '—'}` : PRESET_RANGES.find(r => r.from === range)?.label ?? '—' },
                { label: 'Format', value: FORMATS.find(f => f.id === format)?.label ?? '—' },
                { label: 'File', value: stType ? fileName : '—' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, paddingBottom: 10, borderBottom: `1px solid ${C.border}`, marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: C.textMuted, flexShrink: 0 }}>{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.text, textAlign: 'right', fontFamily: F.heading, wordBreak: 'break-all' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Mini transaction preview */}
            <AnimatePresence>
              {preview && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                  <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.09em' }}>Sample Transactions</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {MOCK_TRANSACTIONS.slice(0, 5).map((tx, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', borderRadius: 9, background: '#f8fafc', gap: 8 }}>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ margin: '0 0 1px', fontSize: 12, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.desc}</p>
                          <p style={{ margin: 0, fontSize: 10.5, color: C.textMuted }}>{tx.date} · {tx.cat}</p>
                        </div>
                        <span style={{ fontSize: 12.5, fontWeight: 800, color: tx.type === 'credit' ? C.green : C.text, flexShrink: 0, fontFamily: F.heading }}>{tx.amount}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {done && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                style={{ marginTop: 16, padding: '14px', background: C.greenPale, border: `1px solid ${C.green}33`, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <div>
                  <p style={{ margin: '0 0 1px', fontSize: 12.5, fontWeight: 700, color: C.green }}>Ready to download</p>
                  <p style={{ margin: 0, fontSize: 11, color: C.textMuted }}>{fileName}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
