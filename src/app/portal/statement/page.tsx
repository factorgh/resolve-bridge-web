'use client';

import { useState, useEffect } from 'react';
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

const APPLICATIONS = [
  { 
    id: 'app1', type: 'Loan', provider: 'Stanbic Bank', product: 'Personal Loan', 
    amount: 'GH₵ 12,000', status: 'Reviewing', progress: 45, date: 'Apr 16, 2026',
    logo: '/stanbic_logo.png', 
    steps: [
      { label: 'Submitted', date: 'Apr 16, 2026', desc: 'Package confirmed by Stanbic' },
      { label: 'Reviewing', date: 'In Progress', desc: 'Credit assessment handshake' },
      { label: 'Offer', date: 'Est. Apr 20', desc: 'Institutional contract generation' },
      { label: 'Funded', date: 'Est. Apr 22', desc: 'Final execution & disbursement' }
    ]
  },
  { 
    id: 'app2', type: 'Insurance', provider: 'Enterprise', product: 'Auto Premium', 
    amount: 'GH₵ 85/mo', status: 'Action Required', progress: 20, date: 'Apr 15, 2026',
    logo: '/resolve_icon.png',
    alert: 'Missing ID',
    steps: [
      { label: 'Bid Received', date: 'Apr 15, 2026', desc: 'Enterprise quote matched' },
      { label: 'Documentation', date: 'Action Needed', desc: 'Missing National Id verification' },
      { label: 'Policy Issued', date: 'Waiting...', desc: 'Pending KYC resolution' },
      { label: 'Active', date: 'Final Phase', desc: 'Institutional coverage activation' }
    ]
  },
  { 
    id: 'app3', type: 'BNPL', provider: 'Kredete', product: 'Electronics Plan', 
    amount: 'GH₵ 4,200', status: 'Approved', progress: 75, date: 'Apr 12, 2026',
    logo: '/kredete_logo.png',
    steps: [
      { label: 'Eligibility', date: 'Apr 12, 2026', desc: 'Credit limit authorized' },
      { label: 'Review', date: 'Apr 13, 2026', desc: 'Product matching successful' },
      { label: 'Approval', date: 'Apr 14, 2026', desc: 'Kredete signature confirmed' },
      { label: 'Disbursed', date: 'Est. Apr 18', desc: 'Terminal payment handshake' }
    ]
  }
];

export default function StatementPage() {
  const [view, setView] = useState<'apps' | 'reports'>('apps');
  const [stType, setStType] = useState('');
  const [format, setFormat] = useState('pdf');
  const [range, setRange] = useState<string | number>(-30);
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const [preview, setPreview] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const dateRange = range === 'custom' ? { from: customFrom, to: customTo } : getDateRange(range as string | number);

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 2200));
    setGenerating(false);
    setDone(true);
  };

  const fileName = `ResolveBridge_${stType || 'Statement'}_${format.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.${format === 'json' ? 'json' : format === 'csv' ? 'csv' : 'pdf'}`;

  return (
    <PortalShell title="Portfolio" backHref="/portal" backLabel="Dashboard">
      <div style={{ maxWidth: 880, margin: '0 auto', padding: isMobile ? '0 0 100px' : 0 }}>
        
        {/* Hub Header & Tabs */}
        <div style={{ marginBottom: 32 }}>
           <h1 style={{ margin: '0 0 20px', fontSize: isMobile ? 28 : 32, fontWeight: 900, color: C.text, fontFamily: F.heading, letterSpacing: '-0.04em' }}>
             {view === 'apps' ? 'Active Activity' : 'Financial Reports'}
           </h1>
           
           <div style={{ display: 'flex', gap: 8, background: '#f1f5f9', padding: 4, borderRadius: 14, width: 'fit-content' }}>
              {[
                { id: 'apps', label: 'Active Applications' },
                { id: 'reports', label: 'Reports & History' }
              ].map(t => (
                <button 
                  key={t.id}
                  onClick={() => setView(t.id as any)}
                  style={{ 
                    padding: '8px 20px', borderRadius: 10, border: 'none', 
                    background: view === t.id ? '#fff' : 'transparent', 
                    color: view === t.id ? C.text : C.textMuted,
                    fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: '0.2s',
                    boxShadow: view === t.id ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  {t.label}
                </button>
              ))}
           </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'apps' ? (
            <motion.div 
              key="apps" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: 12 
              }}
            >
               {APPLICATIONS.map((app) => (
                 <motion.div 
                   key={app.id} 
                   whileHover={{ x: 4, background: '#f8fafc' }}
                   onClick={() => setSelectedApp(app)}
                   style={{ 
                     background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, 
                     padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                     gap: 20, cursor: 'pointer', transition: 'all 0.2s'
                   }}
                 >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1.5 }}>
                       <div style={{ width: 40, height: 40, borderRadius: 10, background: '#fff', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 5, flexShrink: 0 }}>
                          <img src={app.logo} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                       </div>
                       <div style={{ minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: C.text, fontFamily: F.heading }}>{app.provider}</p>
                          <p style={{ margin: 0, fontSize: 12, color: C.textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.product}</p>
                       </div>
                    </div>

                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                       <div style={{ position: 'relative', width: 48, height: 48 }}>
                          <svg width="48" height="48" viewBox="0 0 70 70">
                             <circle cx="35" cy="35" r="30" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                             <motion.circle 
                               cx="35" cy="35" r="30" fill="none" 
                               stroke={app.alert ? C.red : C.greenPale} 
                               strokeWidth="8" strokeLinecap="round"
                               initial={{ pathLength: 0 }}
                               animate={{ pathLength: app.progress / 100 }}
                               transition={{ duration: 1.5, ease: "circOut" }}
                               style={{ rotate: -90, transformOrigin: '50% 50%' }}
                             />
                          </svg>
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             <span style={{ fontSize: 11, fontWeight: 900, color: C.text, fontFamily: F.heading }}>{app.progress}%</span>
                          </div>
                       </div>
                    </div>

                    <div style={{ textAlign: 'right', flex: 1 }}>
                       <span style={{ 
                         display: 'inline-block', padding: '4px 10px', borderRadius: 20, fontSize: 9.5, fontWeight: 900, 
                         background: app.alert ? C.redPale : app.status === 'Approved' ? C.emeraldLight : C.bluePale, 
                         color: app.alert ? C.red : app.status === 'Approved' ? C.emerald : C.blue,
                         textTransform: 'uppercase', letterSpacing: '0.04em'
                       }}>
                          {app.alert || app.status}
                       </span>
                       <p style={{ margin: '4px 0 0', fontSize: 10, fontWeight: 800, color: C.textMuted }}>Applied {app.date}</p>
                    </div>
                 </motion.div>
               ))}

               {APPLICATIONS.length === 0 && (
                 <div style={{ textAlign: 'center', padding: '100px 40px', background: '#fff', borderRadius: 24, border: `1px solid ${C.border}` }}>
                   <p style={{ fontSize: 48, margin: '0 0 20px' }}>📁</p>
                   <h2 style={{ margin: 0, fontSize: 20, fontFamily: F.heading }}>No active requests</h2>
                   <p style={{ color: C.textMuted, fontSize: 14 }}>Explore the marketplace to start your institutional journey.</p>
                 </div>
               )}
            </motion.div>
          ) : (
            <motion.div 
              key="reports" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr', gap: isMobile ? 32 : 24, alignItems: 'start' }}
            >

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
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 22, padding: '24px 26px', position: isMobile ? 'relative' : 'sticky', top: isMobile ? 0 : 90 }}>
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
           </motion.div>
         )}
        </AnimatePresence>

        <AnimatePresence>
           {selectedApp && (
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? 0 : 40 }}
             >
                <div onClick={() => setSelectedApp(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(13,27,62,0.85)', backdropFilter: 'blur(8px)' }} />
                <motion.div 
                  initial={{ y: isMobile ? '100%' : 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: isMobile ? '100%' : 40, opacity: 0 }}
                  style={{ 
                    position: 'relative', width: '100%', maxWidth: 500, background: '#fff', 
                    borderRadius: isMobile ? '24px 24px 0 0' : 24, padding: 32, maxHeight: isMobile ? '90vh' : 'auto', 
                    overflowY: 'auto' 
                  }}
                >
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                         <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f8fafc', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 6 }}>
                            <img src={selectedApp.logo} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                         </div>
                         <div>
                            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, fontFamily: F.heading }}>{selectedApp.product}</h3>
                            <p style={{ margin: 0, fontSize: 13, color: C.textSub }}>{selectedApp.provider}</p>
                         </div>
                      </div>
                      <button onClick={() => setSelectedApp(null)} style={{ background: C.bg, border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer' }}>✕</button>
                   </div>

                   <div style={{ background: C.bg, padding: 20, borderRadius: 16, marginBottom: 32 }}>
                      <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Current Balance / Limit</p>
                      <p style={{ margin: 0, fontSize: 24, fontWeight: 300, color: C.text }}>{selectedApp.amount}</p>
                   </div>

                   <h4 style={{ margin: '0 0 24px', fontSize: 13, fontWeight: 900, textTransform: 'uppercase', color: C.text, letterSpacing: '0.05em' }}>Application Pulse</h4>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                      {selectedApp.steps.map((step: any, idx: number) => {
                        const currentIdx = Math.floor((selectedApp.progress / 100) * (selectedApp.steps.length - 1));
                        const active = idx <= currentIdx;
                        const last = idx === selectedApp.steps.length - 1;
                        return (
                          <div key={step.label} style={{ display: 'flex', gap: 20, minHeight: 70 }}>
                             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ 
                                  width: 26, height: 26, borderRadius: '50%', 
                                  background: active ? C.emerald : C.text, 
                                  border: `6px solid ${active ? C.emeraldLight : '#e2e8f0'}`, 
                                  zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  boxShadow: active ? `0 0 15px ${C.emerald}33` : 'none'
                                }}>
                                   {active && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                                </div>
                                {!last && <div style={{ width: 3, flex: 1, background: active ? C.emerald : C.text, margin: '-4px 0' }} />}
                             </div>
                             <div style={{ paddingBottom: 28, flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                   <p style={{ margin: 0, fontSize: 15, fontWeight: 900, color: C.text }}>{step.label}</p>
                                   <span style={{ 
                                     fontSize: 10, fontWeight: 1000, 
                                     color: C.text, 
                                     background: '#fff', 
                                     padding: '4px 10px', borderRadius: 8,
                                     border: `1.5px solid ${C.text}`,
                                     textTransform: 'uppercase'
                                   }}>
                                      {step.date}
                                   </span>
                                </div>
                                <p style={{ margin: 0, fontSize: 12.5, fontWeight: active ? 600 : 500, color: active ? C.text : C.textMuted, lineHeight: 1.5 }}>
                                   {step.desc}
                                </p>
                             </div>
                          </div>
                        );
                      })}
                   </div>

                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                      <button style={{ padding: '14px', borderRadius: 12, border: `1.5px solid ${C.border}`, background: '#fff', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>View Terms</button>
                      <button style={{ padding: '14px', borderRadius: 12, border: 'none', background: C.blue, color: '#fff', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>Support</button>
                   </div>
                </motion.div>
             </motion.div>
           )}
        </AnimatePresence>
      </div>
    </PortalShell>
  );
}
