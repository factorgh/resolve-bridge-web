'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PortalShell, { C, F } from '../components/PortalShell';
import { 
  HistoryRounded, 
  ReceiptLongRounded, 
  ArrowForwardIosRounded,
  CheckCircleRounded,
  ErrorRounded,
  PendingRounded,
  AccountBalanceRounded,
  ShieldRounded,
  LocalActivityRounded,
  FileDownloadRounded,
  FilterListRounded
} from '@mui/icons-material';

const STATEMENT_TYPES = [
  { id: 'all', label: 'All Transactions', desc: 'Complete financial history', icon: <ReceiptLongRounded /> },
  { id: 'loans', label: 'Loan Statements', desc: 'Schedules & interest', icon: <AccountBalanceRounded /> },
  { id: 'insurance', label: 'Insurance Records', desc: 'Policies & premiums', icon: <ShieldRounded /> },
  { id: 'credit', label: 'Credit Report', desc: 'Factors & breakdown', icon: <LocalActivityRounded /> },
];

const FORMATS = [
  { id: 'pdf', label: 'PDF', icon: '📄' },
  { id: 'csv', label: 'CSV', icon: '📊' },
  { id: 'json', label: 'JSON', icon: '⚙️' },
];

const APPLICATIONS = [
  { 
    id: 'app1', type: 'Loan', provider: 'Stanbic Bank', product: 'Personal Loan', 
    amount: 'GH₵ 12,000', status: 'Reviewing', progress: 45, date: 'Apr 16, 2026',
    logo: '/stanbic_logo.png', 
    color: '#0033aa',
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
    color: '#e11d48',
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
    color: '#10b981',
    steps: [
      { label: 'Eligibility', date: 'Apr 12, 2026', desc: 'Credit limit authorized' },
      { label: 'Review', date: 'Apr 13, 2026', desc: 'Product matching successful' },
      { label: 'Approval', date: 'Apr 14, 2026', desc: 'Kredete signature confirmed' },
      { label: 'Disbursed', date: 'Est. Apr 18', desc: 'Terminal payment handshake' }
    ]
  }
];

const MOCK_TRANSACTIONS = [
  { id: 'tx1', date: 'Apr 14, 2026', desc: 'Stanbic Loan Repayment', amount: '−GH₵ 850.00', status: 'Completed', type: 'debit', cat: 'Loan' },
  { id: 'tx2', date: 'Apr 10, 2026', desc: 'Enterprise Auto Premium', amount: '−GH₵ 320.00', status: 'Completed', type: 'debit', cat: 'Insurance' },
  { id: 'tx3', date: 'Apr 1, 2026', desc: 'Salary Credit - GOG', amount: '+GH₵ 5,200.00', status: 'Completed', type: 'credit', cat: 'Income' },
  { id: 'tx4', date: 'Mar 28, 2026', desc: 'Kredete BNPL Installment', amount: '−GH₵ 450.00', status: 'Pending', type: 'debit', cat: 'BNPL' },
  { id: 'tx5', date: 'Mar 25, 2026', desc: 'Interest Rebate - Savings', amount: '+GH₵ 85.20', status: 'Completed', type: 'credit', cat: 'Adjustment' },
  { id: 'tx6', date: 'Mar 1, 2026', desc: 'Salary Credit - GOG', amount: '+GH₵ 5,200.00', status: 'Completed', type: 'credit', cat: 'Income' },
  { id: 'tx7', date: 'Feb 14, 2026', desc: 'Stanbic Loan Repayment', amount: '−GH₵ 850.00', status: 'Failed', type: 'debit', cat: 'Loan' },
];

export default function StatementPage() {
  const [view, setView] = useState<'apps' | 'reports' | 'txs'>('apps');
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewingContract, setViewingContract] = useState(false);
  const [contactingSupport, setContactingSupport] = useState(false);
  const [supportMsg, setSupportMsg] = useState('');
  const [msgSent, setMsgSent] = useState(false);
  const [filters, setFilters] = useState({
    date: 'all',
    status: 'all',
    type: 'all'
  });
  const [tempFilters, setTempFilters] = useState(filters);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredApps = APPLICATIONS.filter(app => {
    const statusMatch = filters.status === 'all' || 
                       (filters.status === 'Alert' ? !!app.alert : app.status === filters.status);
    const typeMatch = filters.type === 'all' || app.type === filters.type;
    return statusMatch && typeMatch;
  });

  const filteredTxs = MOCK_TRANSACTIONS.filter(tx => {
    // Basic date filtering logic (mocking actual date objects)
    const typeMatch = filters.type === 'all' || tx.cat === filters.type || (filters.type === 'Loan' && tx.cat === 'Loan') || (filters.type === 'Insurance' && tx.cat === 'Insurance');
    // Note: In a real app, we'd use dayjs or date-fns here. 
    // For mock data, we'll just simulate the 'all' filter as we don't have real timestamps.
    return typeMatch;
  });

  return (
    <PortalShell title="Portfolio Hub" subtitle="Monitor your active institutional applications and financial history.">
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: isMobile ? '0 16px 120px' : '0 24px' }}>
        
        {/* Modern Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 40,
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(10px)',
          padding: '8px',
          borderRadius: 24,
          border: `1px solid ${C.border}`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { id: 'apps', label: 'Active Activity', icon: <LocalActivityRounded sx={{ fontSize: 18 }} /> },
              { id: 'txs', label: 'Transactions', icon: <ReceiptLongRounded sx={{ fontSize: 18 }} /> },
              { id: 'reports', label: 'Reports & History', icon: <HistoryRounded sx={{ fontSize: 18 }} /> }
            ].map(t => (
              <button 
                key={t.id}
                onClick={() => setView(t.id as any)}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 24px', 
                  borderRadius: 18, 
                  border: 'none', 
                  background: view === t.id ? C.text : 'transparent', 
                  color: view === t.id ? '#fff' : C.textSub,
                  fontSize: 13, 
                  fontWeight: 800, 
                  cursor: 'pointer', 
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontFamily: F.heading
                }}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
          {!isMobile && (
            <div style={{ display: 'flex', gap: 12, paddingRight: 12 }}>
               <button 
                 onClick={() => setShowFilters(!showFilters)}
                 style={{ 
                   background: showFilters ? `${C.blue}10` : 'none', 
                   border: 'none', 
                   color: showFilters ? C.blue : C.textSub, 
                   cursor: 'pointer',
                   width: 40, height: 40, borderRadius: 12,
                   display: 'flex', alignItems: 'center', justifyContent: 'center',
                   transition: '0.2s'
                 }}
               >
                 <FilterListRounded />
               </button>
            </div>
          )}
        </div>

        {/* Animated Filter Bar */}
        <AnimatePresence>
          {showFilters && (view === 'apps' || view === 'txs') && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ 
                background: '#fff', 
                border: `1px solid ${C.border}`, 
                borderRadius: 24, 
                padding: '20px 24px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 24,
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
              }}>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 800, color: C.textSub, textTransform: 'uppercase' }}>Date Range</p>
                  <select 
                    value={tempFilters.date}
                    onChange={(e) => setTempFilters({...tempFilters, date: e.target.value})}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 13, fontWeight: 700, background: '#f8fafc' }}
                  >
                    <option value="all">All Time</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 90 Days</option>
                    <option value="365">Last 1 Year</option>
                  </select>
                </div>
                
                {view === 'apps' && (
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 800, color: C.textSub, textTransform: 'uppercase' }}>Status</p>
                    <select 
                      value={tempFilters.status}
                      onChange={(e) => setTempFilters({...tempFilters, status: e.target.value})}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 13, fontWeight: 700, background: '#f8fafc' }}
                    >
                      <option value="all">All Statuses</option>
                      <option value="Approved">Approved</option>
                      <option value="Reviewing">Reviewing</option>
                      <option value="Alert">Action Required</option>
                    </select>
                  </div>
                )}

                <div style={{ flex: 1, minWidth: 160 }}>
                  <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 800, color: C.textSub, textTransform: 'uppercase' }}>{view === 'txs' ? 'Category' : 'Type'}</p>
                  <select 
                    value={tempFilters.type}
                    onChange={(e) => setTempFilters({...tempFilters, type: e.target.value})}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 13, fontWeight: 700, background: '#f8fafc' }}
                  >
                    <option value="all">All {view === 'txs' ? 'Categories' : 'Types'}</option>
                    <option value="Loan">Loans</option>
                    <option value="Insurance">Insurance</option>
                    <option value="BNPL">BNPL</option>
                    {view === 'txs' && <option value="Income">Income</option>}
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
                   <button 
                     onClick={() => setFilters(tempFilters)}
                     style={{ 
                       padding: '10px 24px', borderRadius: 12, border: 'none', 
                       background: C.text, 
                       color: '#fff', fontSize: 13, fontWeight: 800, cursor: 'pointer',
                       boxShadow: `0 4px 12px rgba(0,0,0,0.1)`,
                       transition: '0.2s'
                     }}
                   >
                     Apply
                   </button>
                   <button 
                     onClick={() => {
                       const reset = { date: 'all', status: 'all', type: 'all' };
                       setTempFilters(reset);
                       setFilters(reset);
                     }}
                     style={{ padding: '10px 20px', borderRadius: 12, border: 'none', background: '#f1f5f9', color: C.text, fontSize: 13, fontWeight: 800, cursor: 'pointer' }}
                   >
                     Reset
                   </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {view === 'apps' ? (
            <motion.div 
              key="apps" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}
            >
               {filteredApps.map((app, idx) => (
                 <motion.div 
                   key={app.id} 
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.1 }}
                   whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}
                   onClick={() => setSelectedApp(app)}
                   style={{ 
                     background: '#fff', 
                     border: `1px solid ${C.border}`, 
                     borderRadius: 28, 
                     padding: '24px 32px', 
                     display: 'flex', 
                     alignItems: 'center', 
                     gap: 32, 
                     cursor: 'pointer', 
                     transition: 'all 0.3s ease',
                     position: 'relative',
                     overflow: 'hidden'
                   }}
                 >
                    {/* Status Glow Decoration */}
                    <div style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      width: 6, 
                      height: '100%', 
                      background: app.alert ? C.red : app.status === 'Approved' ? C.emerald : C.blue 
                    }} />

                    {/* Logo & Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: 1.5 }}>
                       <div style={{ 
                         width: 64, height: 64, borderRadius: 20, 
                         background: '#fff', border: `1px solid ${C.border}`, 
                         display: 'flex', alignItems: 'center', justifyContent: 'center', 
                         padding: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' 
                       }}>
                          <img src={app.logo} alt="Provider" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                       </div>
                       <div style={{ minWidth: 0 }}>
                          <p style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 900, color: C.text, fontFamily: F.heading }}>{app.provider}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                             <span style={{ fontSize: 10, fontWeight: 900, color: C.textMuted, background: '#f1f5f9', padding: '2px 8px', borderRadius: 6, textTransform: 'uppercase' }}>{app.type}</span>
                             <p style={{ margin: 0, fontSize: 13, color: C.textSub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.product}</p>
                          </div>
                       </div>
                    </div>

                    {/* Progress Visual */}
                    {!isMobile && (
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, padding: '0 20px' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 11, fontWeight: 900, color: C.textSub, textTransform: 'uppercase' }}>Progress</span>
                            <span style={{ fontSize: 13, fontWeight: 900, color: C.text }}>{app.progress}%</span>
                         </div>
                         <div style={{ width: '100%', height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${app.progress}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              style={{ 
                                height: '100%', 
                                background: `linear-gradient(90deg, ${app.color} 0%, ${app.color}cc 100%)`,
                                borderRadius: 4
                              }}
                            />
                         </div>
                      </div>
                    )}

                    {/* Status & Action */}
                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 24 }}>
                       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <div style={{ 
                            display: 'flex', alignItems: 'center', gap: 6, 
                            padding: '6px 14px', borderRadius: 12,
                            background: app.alert ? `${C.red}10` : app.status === 'Approved' ? `${C.emerald}10` : `${C.blue}10`,
                            color: app.alert ? C.red : app.status === 'Approved' ? C.emerald : C.blue,
                            marginBottom: 4
                          }}>
                             {app.alert ? <ErrorRounded sx={{ fontSize: 14 }} /> : app.status === 'Approved' ? <CheckCircleRounded sx={{ fontSize: 14 }} /> : <PendingRounded sx={{ fontSize: 14 }} />}
                             <span style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{app.alert || app.status}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: C.textMuted }}>Applied {app.date}</p>
                       </div>
                       <ArrowForwardIosRounded sx={{ color: C.border, fontSize: 16 }} />
                    </div>
                 </motion.div>
               ))}
            </motion.div>
          ) : view === 'txs' ? (
            <motion.div 
              key="txs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            >
               <div style={{ 
                 background: '#fff', border: `1px solid ${C.border}`, borderRadius: 32, overflow: 'hidden',
                 boxShadow: '0 4px 24px rgba(0,0,0,0.02)'
               }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                     <thead>
                        <tr style={{ borderBottom: `1px solid ${C.border}`, background: '#f8fafc' }}>
                           <th style={{ padding: '20px 24px', fontSize: 11, fontWeight: 900, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Date</th>
                           <th style={{ padding: '20px 24px', fontSize: 11, fontWeight: 900, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Description</th>
                           <th style={{ padding: '20px 24px', fontSize: 11, fontWeight: 900, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Category</th>
                           <th style={{ padding: '20px 24px', fontSize: 11, fontWeight: 900, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</th>
                           <th style={{ padding: '20px 24px', fontSize: 11, fontWeight: 900, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>Amount</th>
                        </tr>
                     </thead>
                     <tbody>
                        {filteredTxs.map((tx, idx) => (
                          <motion.tr 
                            key={tx.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            style={{ borderBottom: idx === filteredTxs.length - 1 ? 'none' : `1px solid ${C.border}`, transition: '0.2s' }}
                          >
                             <td style={{ padding: '20px 24px', fontSize: 13, color: C.textMuted }}>{tx.date}</td>
                             <td style={{ padding: '20px 24px' }}>
                                <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: C.text }}>{tx.desc}</p>
                                <p style={{ margin: 0, fontSize: 11, color: C.textMuted }}>REF: {tx.id.toUpperCase()}</p>
                             </td>
                             <td style={{ padding: '20px 24px' }}>
                                <span style={{ padding: '4px 10px', borderRadius: 8, background: '#f1f5f9', color: C.textSub, fontSize: 11, fontWeight: 800 }}>{tx.cat}</span>
                             </td>
                             <td style={{ padding: '20px 24px' }}>
                                <div style={{ 
                                  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20,
                                  background: tx.status === 'Completed' ? `${C.emerald}15` : tx.status === 'Failed' ? `${C.red}15` : `${C.blue}15`,
                                  color: tx.status === 'Completed' ? C.emerald : tx.status === 'Failed' ? C.red : C.blue,
                                  fontSize: 11, fontWeight: 900
                                }}>
                                   <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
                                   {tx.status}
                                </div>
                             </td>
                             <td style={{ padding: '20px 24px', textAlign: 'right', fontSize: 15, fontWeight: 900, color: tx.type === 'credit' ? C.emerald : C.text, fontFamily: F.heading }}>
                                {tx.amount}
                             </td>
                          </motion.tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </motion.div>
          ) : (
            <motion.div 
              key="reports" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
              style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 24 }}
            >
               {STATEMENT_TYPES.map((type, i) => (
                 <motion.div 
                   key={type.id}
                   whileHover={{ y: -8 }}
                   style={{ 
                     background: '#fff', border: `1px solid ${C.border}`, borderRadius: 32, padding: 32,
                     display: 'flex', flexDirection: 'column', gap: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                   }}
                 >
                    <div style={{ width: 56, height: 56, borderRadius: 18, background: `${C.blue}10`, color: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       {type.icon}
                    </div>
                    <div>
                       <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 900, fontFamily: F.heading }}>{type.label}</h3>
                       <p style={{ margin: 0, fontSize: 13, color: C.textSub, lineHeight: 1.6 }}>{type.desc}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto', paddingTop: 12 }}>
                       {FORMATS.map(f => (
                         <button 
                           key={f.id}
                           style={{ 
                             flex: 1, padding: '12px', borderRadius: 14, border: `1.5px solid ${C.border}`, 
                             background: '#fff', fontSize: 12, fontWeight: 800, cursor: 'pointer',
                             display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                             transition: 'all 0.2s'
                           }}
                           onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.color = C.blue; }}
                           onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text; }}
                         >
                            <FileDownloadRounded sx={{ fontSize: 16 }} />
                            {f.label}
                         </button>
                       ))}
                    </div>
                 </motion.div>
               ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Slide-over / Modal for Application Details */}
        <AnimatePresence>
           {selectedApp && (
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? 0 : 24 }}
             >
                <div onClick={() => setSelectedApp(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(10,30,43,0.8)', backdropFilter: 'blur(12px)' }} />
                <motion.div 
                  initial={{ x: isMobile ? 0 : 100, y: isMobile ? 100 : 0, opacity: 0 }} 
                  animate={{ x: 0, y: 0, opacity: 1 }} 
                  exit={{ x: isMobile ? 0 : 100, y: isMobile ? 100 : 0, opacity: 0 }}
                  style={{ 
                    position: 'relative', width: '100%', maxWidth: 540, background: '#fff', 
                    borderRadius: isMobile ? '32px 32px 0 0' : 32, padding: 40, maxHeight: isMobile ? '95vh' : '85vh', 
                    overflowY: 'auto', boxShadow: '0 40px 100px rgba(0,0,0,0.2)'
                  }}
                >
                   {/* Modal Header */}
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                         <div style={{ width: 56, height: 56, borderRadius: 16, background: '#fff', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8 }}>
                            <img src={selectedApp.logo} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                         </div>
                         <div>
                            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, fontFamily: F.heading }}>{selectedApp.product}</h3>
                            <p style={{ margin: 0, fontSize: 14, color: C.textSub }}>{selectedApp.provider}</p>
                         </div>
                      </div>
                      <button onClick={() => setSelectedApp(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>✕</button>
                   </div>

                   {/* Value Overview */}
                   <div style={{ 
                     background: `linear-gradient(135deg, ${C.text} 0%, #1e293b 100%)`, 
                     padding: 32, borderRadius: 24, marginBottom: 40, color: '#fff',
                     position: 'relative', overflow: 'hidden'
                   }}>
                      <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
                      <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 800, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Requested Amount</p>
                      <p style={{ margin: 0, fontSize: 32, fontWeight: 900, fontFamily: F.heading }}>{selectedApp.amount}</p>
                   </div>

                   {/* Pulse / Timeline */}
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                      <h4 style={{ margin: 0, fontSize: 14, fontWeight: 900, textTransform: 'uppercase', color: C.text, letterSpacing: '0.05em' }}>Application Pulse</h4>
                      <span style={{ fontSize: 12, fontWeight: 800, color: selectedApp.color }}>{selectedApp.progress}% Complete</span>
                   </div>
                   
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                      {selectedApp.steps.map((step: any, idx: number) => {
                        const currentStepIdx = Math.floor((selectedApp.progress / 100) * (selectedApp.steps.length));
                        const active = idx < currentStepIdx;
                        const isCurrent = idx === currentStepIdx;
                        const last = idx === selectedApp.steps.length - 1;
                        
                        return (
                          <div key={step.label} style={{ display: 'flex', gap: 24, minHeight: 80 }}>
                             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <motion.div 
                                  initial={false}
                                  animate={{ 
                                    background: active ? C.emerald : isCurrent ? '#fff' : '#fff',
                                    borderColor: active ? C.emerald : isCurrent ? C.blue : C.border,
                                    scale: isCurrent ? 1.2 : 1
                                  }}
                                  style={{ 
                                    width: 24, height: 24, borderRadius: '50%', 
                                    border: '3px solid',
                                    zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                  }}
                                >
                                   {active && <CheckCircleRounded sx={{ fontSize: 16, color: '#fff' }} />}
                                   {isCurrent && <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.blue }} />}
                                </motion.div>
                                {!last && (
                                  <div style={{ 
                                    width: 2, flex: 1, 
                                    background: active ? C.emerald : `dashed 2px ${C.border}`,
                                    borderLeft: active ? 'none' : `2px dashed ${C.border}`,
                                    margin: '4px 0' 
                                  }} />
                                )}
                             </div>
                             <div style={{ paddingBottom: 32, flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                   <p style={{ margin: 0, fontSize: 16, fontWeight: 900, color: active || isCurrent ? C.text : C.textSub }}>{step.label}</p>
                                   <span style={{ fontSize: 11, fontWeight: 700, color: C.textMuted }}>{step.date}</span>
                                </div>
                                <p style={{ margin: 0, fontSize: 13, color: active || isCurrent ? C.textSub : C.textMuted, lineHeight: 1.6 }}>
                                   {step.desc}
                                </p>
                             </div>
                          </div>
                        );
                      })}
                   </div>

                   {/* Footer Actions */}
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 12 }}>
                      <button 
                        onClick={() => setViewingContract(true)}
                        style={{ padding: '16px', borderRadius: 16, border: `2px solid ${C.border}`, background: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', transition: '0.2s' }} 
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      >
                        View Contract
                      </button>
                      <button 
                        onClick={() => setContactingSupport(true)}
                        style={{ padding: '16px', borderRadius: 16, border: 'none', background: C.text, color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', transition: '0.2s' }} 
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                      >
                        Contact Support
                      </button>
                   </div>
                </motion.div>
             </motion.div>
           )}
        </AnimatePresence>

        {/* Contract Viewer Modal */}
        <AnimatePresence>
           {viewingContract && selectedApp && (
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? 0 : 20 }}
             >
                <div onClick={() => setViewingContract(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)' }} />
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                  style={{ 
                    position: 'relative', width: '100%', maxWidth: 800, height: isMobile ? '100%' : '90vh', 
                    background: '#fff', borderRadius: isMobile ? 0 : 24, overflow: 'hidden', display: 'flex', flexDirection: 'column' 
                  }}
                >
                   <div style={{ padding: '20px 32px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                      <div>
                         <h4 style={{ margin: 0, fontSize: 16, fontWeight: 900 }}>{selectedApp.product} Agreement</h4>
                         <p style={{ margin: 0, fontSize: 11, color: C.textMuted }}>REF: RB-{selectedApp.id.toUpperCase()}-2026</p>
                      </div>
                      <div style={{ display: 'flex', gap: 12 }}>
                         <button style={{ padding: '8px 16px', borderRadius: 10, border: 'none', background: C.blue, color: '#fff', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>Download PDF</button>
                         <button onClick={() => setViewingContract(false)} style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: '#fff', cursor: 'pointer' }}>✕</button>
                      </div>
                   </div>
                   <div style={{ flex: 1, overflowY: 'auto', padding: '60px 80px', fontFamily: 'serif', color: '#1a1a1a', lineHeight: 1.8 }}>
                      <div style={{ textAlign: 'center', marginBottom: 40 }}>
                         <img src="/resolve_icon.png" style={{ width: 40, marginBottom: 20 }} />
                         <h2 style={{ margin: 0, fontSize: 24, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Institutional Service Agreement</h2>
                      </div>
                      <p>This agreement is made on <strong>{selectedApp.date}</strong> between <strong>ResolveBridge Platform</strong> (hereinafter referred to as "the Intermediary") and the applicant (hereinafter referred to as "the Client") regarding the <strong>{selectedApp.product}</strong> offered by <strong>{selectedApp.provider}</strong>.</p>
                      
                      <h3 style={{ fontSize: 14, textTransform: 'uppercase', marginTop: 32 }}>1. Scope of Service</h3>
                      <p>ResolveBridge facilitates the digital handshake between the Client and {selectedApp.provider}. All documentation provided has been verified through Resolve’s proprietary KYC engine.</p>
                      
                      <h3 style={{ fontSize: 14, textTransform: 'uppercase', marginTop: 32 }}>2. Financial Terms</h3>
                      <p>The requested facility amount of <strong>{selectedApp.amount}</strong> is subject to final institutional audit. Interest rates and repayment schedules are governed by {selectedApp.provider}'s standard operating procedures as outlined in the attached schedule.</p>
                      
                      <div style={{ marginTop: 60, padding: 32, border: '1px solid #eee', background: '#fcfcfc', textAlign: 'center' }}>
                         <p style={{ margin: 0, color: '#aaa', fontSize: 12 }}>[ Digital Signature Confirmed via ResolveBridge Auth ]</p>
                         <p style={{ margin: '10px 0 0', fontFamily: 'cursive', fontSize: 20 }}>Electronic Handshake Verified</p>
                      </div>
                   </div>
                </motion.div>
             </motion.div>
           )}
        </AnimatePresence>

        {/* Contact Support Modal */}
        <AnimatePresence>
           {contactingSupport && selectedApp && (
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
             >
                <div onClick={() => { setContactingSupport(false); setMsgSent(false); }} style={{ position: 'absolute', inset: 0, background: 'rgba(10,30,43,0.8)', backdropFilter: 'blur(12px)' }} />
                <motion.div 
                  initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
                  style={{ position: 'relative', width: '100%', maxWidth: 440, background: '#fff', borderRadius: 24, padding: 32 }}
                >
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>Support for {selectedApp.provider}</h3>
                      <button onClick={() => { setContactingSupport(false); setMsgSent(false); }} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>✕</button>
                   </div>

                   {msgSent ? (
                     <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{ width: 64, height: 64, borderRadius: '50%', background: C.emeraldLight, color: C.emerald, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                           <CheckCircleRounded sx={{ fontSize: 32 }} />
                        </div>
                        <h4 style={{ margin: '0 0 8px' }}>Message Sent!</h4>
                        <p style={{ margin: 0, fontSize: 13, color: C.textSub }}>Our support agents and {selectedApp.provider} have been notified. We will get back to you within 2 hours.</p>
                        <button onClick={() => { setContactingSupport(false); setMsgSent(false); }} style={{ marginTop: 24, width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: C.text, color: '#fff', fontWeight: 800, cursor: 'pointer' }}>Close</button>
                     </div>
                   ) : (
                     <>
                        <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: 12, marginBottom: 20, fontSize: 12, color: C.textSub, border: `1px solid ${C.border}` }}>
                           <strong>Topic:</strong> {selectedApp.product} Application Issue
                        </div>
                        <textarea 
                          value={supportMsg}
                          onChange={(e) => setSupportMsg(e.target.value)}
                          placeholder="Tell us what's happening..."
                          style={{ width: '100%', height: 120, padding: 16, borderRadius: 12, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, fontFamily: F.body, resize: 'none', boxSizing: 'border-box' }}
                        />
                        <button 
                          disabled={!supportMsg.trim()}
                          onClick={() => {
                            setMsgSent(true);
                            setSupportMsg('');
                          }}
                          style={{ marginTop: 24, width: '100%', padding: '16px', borderRadius: 12, border: 'none', background: C.blue, color: '#fff', fontSize: 14, fontWeight: 800, cursor: supportMsg.trim() ? 'pointer' : 'not-allowed', opacity: supportMsg.trim() ? 1 : 0.5 }}
                        >
                          Send Message
                        </button>
                     </>
                   )}
                </motion.div>
             </motion.div>
           )}
        </AnimatePresence>
      </div>
    </PortalShell>
  );
}
