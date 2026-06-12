'use client';

import { useState, useEffect, useMemo } from 'react';
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
  FilterListRounded,
  SearchRounded,
  ChatBubbleOutlineRounded
} from '@mui/icons-material';
import { useGetApplicationsQuery } from '@/lib/redux/api/applicationApi';
import { useGetTransactionsQuery } from '@/lib/redux/api/transactionApi';
import EmptyState from '../components/EmptyState';
import { AddRounded, AccountBalanceWalletRounded } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { IconButton } from '@mui/material';

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

/* ─── Mock Data ─────────────────────────────────────────────────────────── */
// Mock data removed. Using live API integration for both Applications and Transactions.

export default function StatementPage() {
  const router = useRouter();
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
  const [searchTerm, setSearchTerm] = useState('');

  // Report Preview States
  const [previewReportType, setPreviewReportType] = useState<string | null>(null);
  const [previewStartDate, setPreviewStartDate] = useState('');
  const [previewEndDate, setPreviewEndDate] = useState('');
  const [previewPage, setPreviewPage] = useState(0);
  const [previewRowsPerPage, setPreviewRowsPerPage] = useState(10);
  const [previewSearch, setPreviewSearch] = useState('');

  const { data: apiData, isLoading } = useGetApplicationsQuery();
  const { data: txData, isLoading: txLoading } = useGetTransactionsQuery();

  const applications = useMemo(() => {
    return apiData?.success ? apiData.data : [];
  }, [apiData]);

  const transactions = useMemo(() => {
    return txData?.success ? txData.data : [];
  }, [txData]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleExport = (type: string, format: string, customData?: any[]) => {
    let dataToExport: any[] = customData || [];
    let filename = `ResolveBridge_${type}_${new Date().toISOString().split('T')[0]}`;

    if (!customData) {
      if (type === 'all') {
        dataToExport = transactions;
      } else if (type === 'loans') {
        dataToExport = transactions.filter((t: any) => t.cat === 'Loan');
      } else if (type === 'insurance') {
        dataToExport = transactions.filter((t: any) => t.cat === 'Insurance');
      } else {
        dataToExport = applications;
      }
    }

    if (dataToExport.length === 0) {
      alert('No data available to export.');
      return;
    }

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      const headers = Object.keys(dataToExport[0] || {}).join(',');
      const rows = dataToExport.map(item => 
        Object.values(item).map(v => typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : v).join(',')
      );
      const csvContent = [headers, ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      window.print();
    }
  };

  const filteredApps = useMemo(() => {
    return applications.filter((app: any) => {
      const statusMatch = filters.status === 'all' || 
                         (filters.status === 'Alert' ? !!app.alert : app.status === filters.status);
      const typeMatch = filters.type === 'all' || app.type === filters.type;
      const searchMatch = !searchTerm || app.provider.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         app.product.toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && typeMatch && searchMatch;
    });
  }, [applications, filters, searchTerm]);

  const filteredTxs = useMemo(() => {
    return transactions.filter((tx: any) => {
      const typeMatch = filters.type === 'all' || tx.cat === filters.type || (filters.type === 'Loan' && tx.cat === 'Loan') || (filters.type === 'Insurance' && tx.cat === 'Insurance');
      return typeMatch;
    });
  }, [transactions, filters]);

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
          <div style={{ display: isMobile ? 'none' : 'flex', gap: 12, paddingRight: 12 }}>
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
                      <option value="PaymentPending">Payment Pending</option>
                      <option value="Pending">Pending Review</option>
                      <option value="UnderReview">Under Review</option>
                      <option value="Approved">Approved</option>
                      <option value="Disbursed">Disbursed</option>
                      <option value="Completed">Completed</option>
                      <option value="Rejected">Rejected</option>
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
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            >
               {/* Search Bar for Scalability */}
               <div style={{ position: 'relative', marginBottom: 12 }}>
                  <input 
                    type="text" placeholder="Search applications..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    style={{ 
                      width: '100%', padding: '14px 16px 14px 44px', borderRadius: 16, border: `1.5px solid ${C.border}`, 
                      outline: 'none', fontSize: 14, background: '#fff' 
                    }}
                  />
                  <SearchRounded sx={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: C.textMuted, fontSize: 20 }} />
               </div>

               {filteredApps.map((app: any, idx: number) => (
                 <motion.div 
                   key={app.id} 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: idx * 0.05 }}
                   onClick={() => setSelectedApp(app)}
                   style={{ 
                     background: '#fff', 
                     border: `1px solid ${C.border}`, 
                     borderRadius: 20, 
                     padding: '16px 24px', 
                     display: 'flex', 
                     alignItems: 'center', 
                     gap: 24, 
                     cursor: 'pointer', 
                     transition: '0.2s',
                     position: 'relative',
                     overflow: 'hidden'
                   }}
                   whileHover={{ borderColor: C.blue, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}
                 >
                    {/* Compact Logo */}
                    <div style={{ 
                      width: 48, height: 48, borderRadius: 14, 
                      background: '#f8fafc', border: `1px solid ${C.border}`, 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      padding: 6, flexShrink: 0
                    }}>
                       <img src={app.logo} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>

                    {/* Basic Info */}
                    <div style={{ flex: 2, minWidth: 0 }}>
                       <h4 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: C.text, fontFamily: F.heading, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.provider}</h4>
                       <p style={{ margin: 0, fontSize: 12, color: C.textSub }}>{app.product} • <span style={{ fontWeight: 800, color: C.text }}>{app.amount}</span></p>
                    </div>

                    {/* Progress - Compact */}
                    <div style={{ display: isMobile ? 'none' : 'flex', flex: 1.5, alignItems: 'center', gap: 12 }}>
                       <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${app.progress}%`, height: '100%', background: app.color, borderRadius: 3 }} />
                       </div>
                       <span style={{ fontSize: 11, fontWeight: 900, color: C.textSub, width: 30 }}>{app.progress}%</span>
                    </div>

                    {/* Status Badge */}
                    <div style={{ 
                      padding: '6px 12px', borderRadius: 10, 
                      background: (app.status === 'Approved' || app.status === 'Disbursed' || app.status === 'Completed')
                        ? `${C.emerald}10`
                        : (app.status === 'Pending' || app.status === 'UnderReview')
                          ? `${C.blue}10`
                          : app.status === 'PaymentPending'
                            ? `${C.amber}10`
                            : app.status === 'Cancelled'
                              ? '#f1f5f9'
                              : `${C.red}10`,
                      color: (app.status === 'Approved' || app.status === 'Disbursed' || app.status === 'Completed')
                        ? C.emerald
                        : (app.status === 'Pending' || app.status === 'UnderReview')
                          ? C.blue
                          : app.status === 'PaymentPending'
                            ? C.amber
                            : app.status === 'Cancelled'
                              ? C.textSub
                              : C.red,
                      fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em',
                      minWidth: 80, textAlign: 'center'
                    }}>
                       {app.status === 'UnderReview' ? 'Under Review' : app.status === 'PaymentPending' ? 'Payment Pending' : app.status}
                    </div>

                    <IconButton 
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent opening details modal
                        window.dispatchEvent(new CustomEvent('open-chat', { 
                          detail: { 
                            prefill: `Hello, I would like to make an enquiry about my application for the product "${app.product}" with ${app.provider}.` 
                          } 
                        }));
                      }}
                      sx={{ color: C.blue, '&:hover': { background: `${C.blue}14` } }}
                      title="Enquire from Partner"
                    >
                       <ChatBubbleOutlineRounded sx={{ fontSize: 18 }} />
                    </IconButton>

                    <ArrowForwardIosRounded sx={{ color: C.border, fontSize: 14 }} />
                 </motion.div>
               ))}

               {filteredApps.length === 0 && !isLoading && (
                 <EmptyState 
                   title="No Active Activity" 
                   description="You haven't applied for any institutional products yet. Explore the marketplace to find the best matches for your profile."
                   icon={<AddRounded sx={{ fontSize: 48, opacity: 0.2 }} />}
                   actionLabel="Go to Marketplace"
                   onAction={() => router.push('/portal/marketplace')}
                 />
               )}
            </motion.div>
          ) : view === 'txs' ? (
            <motion.div 
              key="txs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            >
               {filteredTxs.length > 0 ? (
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
                          {filteredTxs.map((tx: any, idx: number) => (
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
                                  <p style={{ margin: 0, fontSize: 11, color: C.textMuted }}>REF: {tx.reference}</p>
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
               ) : (
                 <EmptyState 
                   title="No Transactions" 
                   description="Your financial history is empty. Once you start using institutional services, your history will appear here."
                   icon={<AccountBalanceWalletRounded sx={{ fontSize: 48, opacity: 0.2 }} />}
                 />
               )}
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
                       <button
                      onClick={() => {
                        setPreviewReportType(type.id);
                        setPreviewPage(0);
                        setPreviewStartDate('');
                        setPreviewEndDate('');
                        setPreviewSearch('');
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: 14,
                        border: 'none',
                        background: C.text,
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        transition: 'all 0.2s',
                        marginTop: 'auto'
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                      👁️ View Report
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', marginTop: 12 }}>
                       {FORMATS.map(f => (
                          <button 
                            key={f.id}
                            onClick={() => handleExport(type.id, f.id)}
                            style={{ 
                              flex: 1, padding: '10px', borderRadius: 12, border: `1.5px solid ${C.border}`, 
                              background: '#fff', fontSize: 11, fontWeight: 800, cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.color = C.blue; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text; }}
                          >
                             <FileDownloadRounded sx={{ fontSize: 14 }} />
                             {f.label}
                          </button>
                       ))}
                    </div>
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
                   
                   {/* Rejection/Alert Banner */}
                    {selectedApp.status === 'Rejected' && (
                      <div style={{ 
                        background: `${C.red}10`, 
                        border: `1.5px solid ${C.red}33`, 
                        padding: '16px 20px', 
                        borderRadius: 16, 
                        marginBottom: 32,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12
                      }}>
                         <ErrorRounded sx={{ color: C.red, fontSize: 20, flexShrink: 0, marginTop: '2px' }} />
                         <div>
                            <h5 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: C.red }}>Application Rejected</h5>
                            <p style={{ margin: '4px 0 0', fontSize: 13, color: C.red, opacity: 0.8, lineHeight: 1.5 }}>
                               {selectedApp.rejectionReason || 'No feedback was provided by the institution.'}
                            </p>
                         </div>
                      </div>
                    )}

                    {selectedApp.status === 'Cancelled' && (
                      <div style={{ 
                        background: '#f1f5f9', 
                        border: `1.5px solid ${C.border}`, 
                        padding: '16px 20px', 
                        borderRadius: 16, 
                        marginBottom: 32,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12
                      }}>
                         <ErrorRounded sx={{ color: C.textSub, fontSize: 20, flexShrink: 0, marginTop: '2px' }} />
                         <div>
                            <h5 style={{ margin: 0, fontSize: 14, fontWeight: 900, color: C.text }}>Application Cancelled</h5>
                            <p style={{ margin: '4px 0 0', fontSize: 13, color: C.textSub, lineHeight: 1.5 }}>
                               This application has been cancelled.
                            </p>
                         </div>
                      </div>
                    )}

                   {/* Pulse / Timeline */}
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                      <h4 style={{ margin: 0, fontSize: 14, fontWeight: 900, textTransform: 'uppercase', color: C.text, letterSpacing: '0.05em' }}>Application Pulse</h4>
                      <span style={{ fontSize: 12, fontWeight: 800, color: selectedApp.color }}>{selectedApp.progress}% Complete</span>
                   </div>
                   
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                      {selectedApp.steps.map((step: any, idx: number) => {
                         const isPending = step.date === 'Pending';
                         const isInProgress = step.date === 'In Progress';
                         const isCancelled = step.date === 'Cancelled';
                         const isRejected = selectedApp.status === 'Rejected' && step.label === 'Approval';
                         const isCompleted = !isPending && !isInProgress && !isCancelled && !isRejected;
                         const last = idx === selectedApp.steps.length - 1;
                         
                         let nodeBg = '#fff';
                         let nodeBorder = C.border;
                         let nodeIcon = null;
                         
                         if (isCompleted) {
                           nodeBg = C.emerald;
                           nodeBorder = C.emerald;
                           nodeIcon = <CheckCircleRounded sx={{ fontSize: 16, color: '#fff' }} />;
                         } else if (isRejected) {
                           nodeBg = C.red;
                           nodeBorder = C.red;
                           nodeIcon = <ErrorRounded sx={{ fontSize: 16, color: '#fff' }} />;
                         } else if (isInProgress) {
                           nodeBg = '#fff';
                           nodeBorder = C.blue;
                           nodeIcon = <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.blue }} />;
                         } else if (isCancelled) {
                           nodeBg = '#f1f5f9';
                           nodeBorder = C.textMuted;
                           nodeIcon = <span style={{ fontSize: 10, color: C.textMuted, fontWeight: 900 }}>✕</span>;
                         } else {
                           nodeBg = '#fff';
                           nodeBorder = C.border;
                         }

                         return (
                           <div key={step.label} style={{ display: 'flex', gap: 24, minHeight: 80 }}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                 <motion.div 
                                   initial={false}
                                   animate={{ 
                                     background: nodeBg,
                                     borderColor: nodeBorder,
                                     scale: isInProgress ? 1.2 : 1
                                   }}
                                   style={{ 
                                     width: 24, height: 24, borderRadius: '50%', 
                                     border: '3px solid',
                                     zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                   }}
                                 >
                                    {nodeIcon}
                                 </motion.div>
                                 {!last && (
                                   <div style={{ 
                                     width: 2, flex: 1, 
                                     background: isCompleted ? C.emerald : `dashed 2px ${C.border}`,
                                     borderLeft: isCompleted ? 'none' : `2px dashed ${C.border}`,
                                     margin: '4px 0' 
                                   }} />
                                 )}
                              </div>
                              <div style={{ paddingBottom: 32, flex: 1 }}>
                                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                    <p style={{ margin: 0, fontSize: 16, fontWeight: 900, color: isCompleted || isInProgress || isRejected ? C.text : C.textSub }}>{step.label}</p>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: C.textMuted }}>{step.date}</span>
                                 </div>
                                 <p style={{ margin: 0, fontSize: 13, color: isCompleted || isInProgress || isRejected ? (isRejected ? C.red : C.textSub) : C.textMuted, lineHeight: 1.6 }}>
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

        {/* Report Preview Modal with Date Filtering, Search, and Pagination */}
        <AnimatePresence>
          {previewReportType && (() => {
            const reportTypeObj = STATEMENT_TYPES.find(t => t.id === previewReportType);
            const reportName = reportTypeObj ? reportTypeObj.label : 'Financial Report';
            
            // Get raw data for report
            let rawData: any[] = [];
            if (previewReportType === 'all') {
              rawData = transactions;
            } else if (previewReportType === 'loans') {
              rawData = transactions.filter((t: any) => t.cat === 'Loan');
            } else if (previewReportType === 'insurance') {
              rawData = transactions.filter((t: any) => t.cat === 'Insurance');
            } else {
              rawData = applications;
            }

            // 1. Filter by keyword search query
            let filtered = rawData.filter((item: any) => {
              if (!previewSearch.trim()) return true;
              const term = previewSearch.toLowerCase().trim();
              if (previewReportType === 'credit') {
                return (item.provider?.toLowerCase().includes(term) || item.product?.toLowerCase().includes(term));
              } else {
                return (item.desc?.toLowerCase().includes(term) || item.reference?.toLowerCase().includes(term));
              }
            });

            // 2. Filter by date range
            filtered = filtered.filter((item: any) => {
              if (!item.date) return true;
              const itemTime = new Date(item.date).getTime();
              
              if (previewStartDate) {
                const startTime = new Date(previewStartDate).getTime();
                if (itemTime < startTime) return false;
              }
              if (previewEndDate) {
                // Set end date to end of the day
                const endTime = new Date(previewEndDate).setHours(23, 59, 59, 999);
                if (itemTime > endTime) return false;
              }
              return true;
            });

            // 3. Paginate filtered data
            const totalItems = filtered.length;
            const totalPages = Math.ceil(totalItems / previewRowsPerPage);
            const paginated = filtered.slice(previewPage * previewRowsPerPage, (previewPage + 1) * previewRowsPerPage);

            return (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? 0 : 20 }}
              >
                <div onClick={() => setPreviewReportType(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(10,30,43,0.85)', backdropFilter: 'blur(12px)' }} />
                <motion.div 
                  initial={{ scale: 0.95, y: 30, opacity: 0 }} 
                  animate={{ scale: 1, y: 0, opacity: 1 }} 
                  exit={{ scale: 0.95, y: 30, opacity: 0 }}
                  style={{ 
                    position: 'relative', width: '100%', maxWidth: 900, height: isMobile ? '100%' : '80vh', 
                    background: '#fff', borderRadius: isMobile ? 0 : 24, overflow: 'hidden', display: 'flex', flexDirection: 'column',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.18)'
                  }}
                >
                  {/* Modal Header */}
                  <div style={{ padding: '24px 32px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, fontFamily: F.heading }}>{reportName} Preview</h3>
                      <p style={{ margin: '4px 0 0', fontSize: 12, color: C.textSub }}>Review data, apply date range filters, and export.</p>
                    </div>
                    <button 
                      onClick={() => setPreviewReportType(null)} 
                      style={{ background: '#e2e8f0', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 12 }}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Filter Toolbar */}
                  <div style={{ padding: '16px 32px', borderBottom: `1px solid ${C.border}`, background: '#fff', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                      {/* Start Date */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>From</span>
                        <input
                          type="date"
                          value={previewStartDate}
                          onChange={(e) => {
                            setPreviewStartDate(e.target.value);
                            setPreviewPage(0); // Reset page on filter change
                          }}
                          style={{ padding: '8px 12px', borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 12, outline: 'none', background: '#f8fafc', fontWeight: 700 }}
                        />
                      </div>

                      {/* End Date */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>To</span>
                        <input
                          type="date"
                          value={previewEndDate}
                          onChange={(e) => {
                            setPreviewEndDate(e.target.value);
                            setPreviewPage(0); // Reset page on filter change
                          }}
                          style={{ padding: '8px 12px', borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 12, outline: 'none', background: '#f8fafc', fontWeight: 700 }}
                        />
                      </div>

                      {/* Text Search */}
                      <div style={{ position: 'relative', width: 200 }}>
                        <input
                          type="text"
                          value={previewSearch}
                          onChange={(e) => {
                            setPreviewSearch(e.target.value);
                            setPreviewPage(0); // Reset page on search change
                          }}
                          placeholder="Search this report..."
                          style={{
                            width: '100%',
                            padding: '8px 12px 8px 32px',
                            borderRadius: 10,
                            border: `1px solid ${C.border}`,
                            fontSize: 12,
                            outline: 'none',
                            background: '#f8fafc',
                          }}
                        />
                        <SearchRounded sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.textMuted, fontSize: 16 }} />
                      </div>
                    </div>

                    {/* Export Actions inside Modal (Downloads only filtered data!) */}
                    <div style={{ display: 'flex', gap: 8 }}>
                      {FORMATS.map(f => (
                        <button 
                          key={f.id}
                          onClick={() => handleExport(previewReportType, f.id, filtered)}
                          style={{ 
                            padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${C.border}`, 
                            background: '#fff', fontSize: 11, fontWeight: 800, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 6, transition: '0.2s'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.color = C.blue; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text; }}
                        >
                          <FileDownloadRounded sx={{ fontSize: 14 }} />
                          Export {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tabular Preview */}
                  <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(0,0,0,0.01)' }}>
                    {paginated.length > 0 ? (
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: `1px solid ${C.border}`, background: '#f8fafc', position: 'sticky', top: 0, zIndex: 1 }}>
                            {previewReportType === 'credit' ? (
                              <>
                                <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 900, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Submission Date</th>
                                <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 900, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Institution</th>
                                <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 900, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product</th>
                                <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 900, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</th>
                                <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 900, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Progress</th>
                                <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 900, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Status</th>
                              </>
                            ) : (
                              <>
                                <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 900, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                                <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 900, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</th>
                                <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 900, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reference</th>
                                <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 900, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</th>
                                <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 900, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 900, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Amount</th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {paginated.map((item: any, idx: number) => (
                            <tr 
                              key={item.id} 
                              style={{ 
                                borderBottom: `1px solid ${C.border}`, 
                                background: '#fff',
                                transition: '0.15s'
                              }}
                            >
                              {previewReportType === 'credit' ? (
                                <>
                                  <td style={{ padding: '16px 24px', fontSize: 13, color: C.textMuted }}>{item.date}</td>
                                  <td style={{ padding: '16px 24px', fontSize: 13, fontWeight: 700, color: C.text }}>{item.provider}</td>
                                  <td style={{ padding: '16px 24px', fontSize: 13, color: C.textSub }}>{item.product}</td>
                                  <td style={{ padding: '16px 24px', fontSize: 13, fontWeight: 800, color: C.text }}>{item.amount}</td>
                                  <td style={{ padding: '16px 24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                      <div style={{ width: 60, height: 4, background: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
                                        <div style={{ width: `${item.progress}%`, height: '100%', background: item.color }} />
                                      </div>
                                      <span style={{ fontSize: 10, fontWeight: 700, color: C.textSub }}>{item.progress}%</span>
                                    </div>
                                  </td>
                                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                    <span style={{ 
                                      padding: '4px 8px', borderRadius: 6, fontSize: 10, fontWeight: 900,
                                      background: item.status === 'Approved' ? `${C.emerald}10` : item.status === 'Pending' ? `${C.blue}10` : `${C.red}10`,
                                      color: item.status === 'Approved' ? C.emerald : item.status === 'Pending' ? C.blue : C.red,
                                    }}>
                                      {item.status}
                                    </span>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td style={{ padding: '16px 24px', fontSize: 13, color: C.textMuted }}>{item.date}</td>
                                  <td style={{ padding: '16px 24px', fontSize: 13, fontWeight: 700, color: C.text }}>{item.desc}</td>
                                  <td style={{ padding: '16px 24px', fontSize: 12, color: C.textMuted, fontFamily: 'monospace' }}>{item.reference}</td>
                                  <td style={{ padding: '16px 24px' }}>
                                    <span style={{ padding: '3px 8px', borderRadius: 6, background: '#f1f5f9', color: C.textSub, fontSize: 11, fontWeight: 700 }}>{item.cat}</span>
                                  </td>
                                  <td style={{ padding: '16px 24px' }}>
                                    <span style={{ 
                                      padding: '3px 8px', borderRadius: 12, fontSize: 10, fontWeight: 900,
                                      background: item.status === 'Completed' ? `${C.emerald}10` : item.status === 'Failed' ? `${C.red}10` : `${C.blue}10`,
                                      color: item.status === 'Completed' ? C.emerald : item.status === 'Failed' ? C.red : C.blue,
                                    }}>
                                      {item.status}
                                    </span>
                                  </td>
                                  <td style={{ padding: '16px 24px', textAlign: 'right', fontSize: 13, fontWeight: 900, color: item.type === 'credit' ? C.emerald : C.text, fontFamily: F.heading }}>
                                    {item.amount.toLocaleString()} GHS
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div style={{ padding: 60, textAlign: 'center', opacity: 0.6 }}>
                        <ReceiptLongRounded sx={{ fontSize: 40, color: C.textMuted, marginBottom: 2 }} />
                        <h4 style={{ margin: '0 0 4px', color: C.text }}>No Matching Records</h4>
                        <p style={{ margin: 0, fontSize: 12.5, color: C.textSub }}>Try adjusting your search query or date range filters.</p>
                      </div>
                    )}
                  </div>

                  {/* Pagination Footer */}
                  <div style={{ padding: '16px 32px', borderTop: `1px solid ${C.border}`, display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 12, color: C.textSub }}>
                        Showing {totalItems === 0 ? 0 : previewPage * previewRowsPerPage + 1} to {Math.min((previewPage + 1) * previewRowsPerPage, totalItems)} of {totalItems} entries
                      </span>
                      <select
                        value={previewRowsPerPage}
                        onChange={(e) => {
                          setPreviewRowsPerPage(Number(e.target.value));
                          setPreviewPage(0);
                        }}
                        style={{ padding: '4px 8px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12, outline: 'none', background: '#fff', fontWeight: 700 }}
                      >
                        <option value={5}>5 per page</option>
                        <option value={10}>10 per page</option>
                        <option value={20}>20 per page</option>
                        <option value={50}>50 per page</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        disabled={previewPage === 0}
                        onClick={() => setPreviewPage(p => Math.max(0, p - 1))}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 10,
                          border: `1.5px solid ${C.border}`,
                          background: '#fff',
                          fontSize: 12,
                          fontWeight: 800,
                          cursor: previewPage === 0 ? 'default' : 'pointer',
                          opacity: previewPage === 0 ? 0.5 : 1,
                          transition: '0.2s'
                        }}
                      >
                        Previous
                      </button>
                      <button
                        disabled={previewPage >= totalPages - 1}
                        onClick={() => setPreviewPage(p => Math.min(totalPages - 1, p + 1))}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 10,
                          border: `1.5px solid ${C.border}`,
                          background: '#fff',
                          fontSize: 12,
                          fontWeight: 800,
                          cursor: previewPage >= totalPages - 1 ? 'default' : 'pointer',
                          opacity: previewPage >= totalPages - 1 ? 0.5 : 1,
                          transition: '0.2s'
                        }}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>
    </PortalShell>
  );
}
