'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Drawer, IconButton } from '@mui/material';
import { 
  useAdminGetApplicationsQuery, 
  useAdminReviewApplicationMutation 
} from '@/lib/redux/api/applicationApi';
import { 
  useGetTransactionsQuery, 
  useCreateTransactionMutation 
} from '@/lib/redux/api/transactionApi';
import { 
  useGetInstitutionsQuery,
  useUpdateInstitutionMutation
} from '@/lib/redux/api/productApi';
import {
  useGetAuditLogsQuery
} from '@/lib/redux/api/auditApi';
import AdminShell, { C, F } from '../components/AdminShell';
import { 
  AccountBalanceRounded,
  CheckCircleRounded,
  SettingsSuggestRounded,
  SyncAltRounded,
  TrendingUpRounded,
  LocalAtmRounded,
  SecurityRounded,
  HourglassEmptyRounded,
  AssessmentRounded,
  CloseRounded,
  SpeedRounded,
  SaveRounded,
  CloudDoneRounded,
  DnsRounded,
  HistoryRounded,
  SearchRounded,
  OpenInNewRounded,
  AssignmentRounded
} from '@mui/icons-material';

export default function BankIntegrationPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'applications' | 'disburse' | 'ledger' | 'logs' | 'config'>('applications');
  const [isMobile, setIsMobile] = useState(false);

  // Search & Filter within applications
  const [searchQuery, setSearchQuery] = useState('');
  const [appFilter, setAppFilter] = useState('all');

  // Core Connection Configurations Form State
  const [apiUrl, setApiUrl] = useState('https://api.sim-bank.resolvebridge.com/v1');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [autoDisburse, setAutoDisburse] = useState(false);
  const [repaymentFreq, setRepaymentFreq] = useState<'weekly' | 'monthly' | 'annually'>('monthly');
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Ping Testing Simulator
  const [pingStatus, setPingStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [pingLatency, setPingLatency] = useState(0);

  // Settle Payment Drawer
  const [selectedRepayApp, setSelectedRepayApp] = useState<any>(null);
  const [repayAmount, setRepayAmount] = useState<number>(0);
  const [repayMethod, setRepayMethod] = useState('Mobile Money');
  const [isSettleLoading, setIsSettleLoading] = useState(false);

  // Underwriting Decision Drawer
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // RTK Queries & Mutations
  const { data: appsResponse, isLoading: appsLoading, refetch: refetchApps } = useAdminGetApplicationsQuery(undefined);
  const { data: txResponse, isLoading: txLoading, refetch: refetchTx } = useGetTransactionsQuery(undefined);
  const { data: instResponse, refetch: refetchInst } = useGetInstitutionsQuery();
  const { data: auditResponse, isLoading: auditLoading, refetch: refetchAudits } = useGetAuditLogsQuery();
  
  const [reviewApplication, { isLoading: isReviewing }] = useAdminReviewApplicationMutation();
  const [createTransaction] = useCreateTransactionMutation();
  const [updateInstitution] = useUpdateInstitutionMutation();

  useEffect(() => {
    setMounted(true);
    const stored = sessionStorage.getItem('rb_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      
      // Auto-load previously saved core integration configs if present
      if (parsed.institutionId && instResponse?.data) {
        const inst = instResponse.data.find((i: any) => i._id === parsed.institutionId);
        if (inst) {
          setApiUrl(inst.coreBankingApiUrl || 'https://api.sim-bank.resolvebridge.com/v1');
          setWebhookSecret(inst.coreBankingWebhookSecret || '');
          setAuthToken(inst.coreBankingAuthToken || '');
          setAutoDisburse(inst.coreBankingAutoDisburse || false);
          setRepaymentFreq(inst.interestRepaymentFrequency || 'monthly');
        }
      }
    }
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [instResponse]);

  if (!mounted) return null;

  const rawApplications = appsResponse?.data || [];
  const rawTransactions = txResponse?.data?.items || [];
  const rawAuditLogs = auditResponse?.data || [];

  // Multi-tenant check: Filter records owned by this partner institution
  const myInstitutionId = user?.institutionId;
  const isSuperAdmin = user?.role === 'SuperAdmin' || user?.role === 'Admin';

  const myApplications = rawApplications.filter((app: any) => {
    if (isSuperAdmin) return true;
    const prod = app.productId;
    return prod && prod.institutionId && prod.institutionId._id === myInstitutionId;
  });

  const myTransactions = rawTransactions.filter((tx: any) => {
    if (isSuperAdmin) return true;
    return tx.institutionId === myInstitutionId;
  });

  // Approved Pipeline (Awaiting Disbursement)
  const approvedApps = myApplications.filter((a: any) => a.status === 'Approved');
  
  // Active Disbursed Accounts
  const activeCreditApps = myApplications.filter((a: any) => a.status === 'Disbursed' || a.status === 'Completed');

  // Search filtered applications (For Applications tab)
  const filteredApps = myApplications.filter((app: any) => {
    const fullName = `${app.userId?.firstName || ''} ${app.userId?.lastName || ''}`.toLowerCase();
    const email = (app.userId?.email || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = fullName.includes(query) || email.includes(query);
    const matchesStatus = appFilter === 'all' ? true : app.status === appFilter;
    return matchesSearch && matchesStatus;
  });

  // Ping Testing Core Bank Endpoint
  const handlePingTest = () => {
    setPingStatus('testing');
    setTimeout(() => {
      if (apiUrl.startsWith('https://')) {
        setPingStatus('success');
        setPingLatency(Math.floor(Math.random() * 45) + 12);
      } else {
        setPingStatus('failed');
      }
    }, 1200);
  };

  // Save Settings
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myInstitutionId) {
      toast.error('Cannot save configuration: Account is not bound to a partner institution profile.');
      return;
    }

    setIsSavingConfig(true);
    try {
      const res = await updateInstitution({
        id: myInstitutionId,
        body: {
          coreBankingApiUrl: apiUrl,
          coreBankingWebhookSecret: webhookSecret,
          coreBankingAuthToken: authToken,
          coreBankingAutoDisburse: autoDisburse,
          interestRepaymentFrequency: repaymentFreq
        }
      }).unwrap();

      if (res.success) {
        toast.success('Core banking parameters whitelisted and whitelabeled!');
        refetchInst();
      } else {
        toast.error(res.message || 'Configuration failed');
      }
    } catch (err: any) {
      toast.error(err.data?.message || 'Error occurred while saving configurations');
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Underwrite application decision review
  const handleReview = async (appId: string, status: string) => {
    try {
      const payload: any = { id: appId, status };
      if (status === 'Rejected') {
        if (!rejectionReason.trim()) {
          toast.error('Rejection reason is required');
          return;
        }
        payload.rejectionReason = rejectionReason;
      }

      const res = await reviewApplication(payload).unwrap();
      if (res.success) {
        toast.success(`Application state successfully changed to "${status}"`);
        setSelectedApp(null);
        setRejectionReason('');
        refetchApps();
        refetchAudits();
      } else {
        toast.error(res.message || 'Decision submission failed');
      }
    } catch (err: any) {
      toast.error(err.data?.message || 'Error executing decision update');
    }
  };

  // Disburse Funds Trigger
  const handleExecuteDisbursement = async (app: any) => {
    try {
      toast.loading('Contacting Core Banking Node...', { id: 'disburse' });
      
      // Step 1: Elevate Application Status to Disbursed
      const res = await reviewApplication({ id: app._id, status: 'Disbursed' }).unwrap();
      
      if (res.success) {
        toast.success('Capital successfully disbursed to customer wallet!', { id: 'disburse' });
        refetchApps();
        refetchTx();
        refetchAudits();
      } else {
        toast.error(res.message || 'Underwriting disburse rejected', { id: 'disburse' });
      }
    } catch (err: any) {
      toast.error(err.data?.message || 'Connection failure to Core Banking Node', { id: 'disburse' });
    }
  };

  // Settle Repayment Handler
  const handleSettleRepayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRepayApp || repayAmount <= 0) return;

    setIsSettleLoading(true);
    try {
      // 1. Submit Settle payment transaction log
      const resTx = await createTransaction({
        userId: selectedRepayApp.userId._id,
        applicationId: selectedRepayApp._id,
        institutionId: selectedRepayApp.productId.institutionId._id,
        description: `Installment Settle - ${repayMethod}`,
        amount: repayAmount,
        type: 'debit',
        category: selectedRepayApp.productId.productType || 'Loan',
        status: 'Completed'
      }).unwrap();

      if (resTx.success) {
        toast.success(`Received GHS ${repayAmount.toLocaleString()} payment successfully!`);
        
        // 2. Check if total payments matches or exceeds total due
        const product = selectedRepayApp.productId;
        const interestRate = product?.interestRate || 0;
        const totalDue = selectedRepayApp.amount * (1 + interestRate);

        const matchingTxs = rawTransactions.filter((tx: any) => tx.applicationId === selectedRepayApp._id);
        const paymentsMade = matchingTxs
          .filter((tx: any) => tx.type === 'debit')
          .reduce((sum: number, tx: any) => sum + Math.abs(tx.amount || 0), 0) + repayAmount;

        // If outstanding balance is <= 0, mark loan status as "Completed"
        if (paymentsMade >= totalDue) {
          await reviewApplication({ id: selectedRepayApp._id, status: 'Completed' }).unwrap();
          toast.success('Congratulations! The credit facility has been fully settled!');
        }

        setSelectedRepayApp(null);
        setRepayAmount(0);
        refetchApps();
        refetchTx();
        refetchAudits();
      } else {
        toast.error(resTx.message || 'Repayment logging failed');
      }
    } catch (err: any) {
      toast.error(err.data?.message || 'Error occurred while saving repayments');
    } finally {
      setIsSettleLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return C.emerald;
      case 'Disbursed': return C.blueLight;
      case 'Pending': return C.amber;
      case 'UnderReview': return C.purple;
      case 'Rejected': return C.red;
      default: return C.textMuted;
    }
  };

  // Calculate dynamic metrics for this specific bank
  const totalDisbursed = activeCreditApps.reduce((sum: number, a: any) => sum + (a.amount || 0), 0);
  const activePipeline = approvedApps.length;

  const totalRepayments = myTransactions
    .filter((tx: any) => tx.type === 'debit')
    .reduce((sum: number, tx: any) => sum + Math.abs(tx.amount || 0), 0);

  const recoveryRate = totalDisbursed > 0 ? (totalRepayments / totalDisbursed) * 100 : 100;

  return (
    <AdminShell>
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        
        {/* Upper Dashboard Header */}
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row', 
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'flex-start' : 'center', 
          gap: isMobile ? 16 : 24,
          marginBottom: 36 
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: isMobile ? 26 : 32, fontWeight: 300, color: C.text, fontFamily: F.serif }}>
              Core Banking Node & Underwriting Desk
            </h1>
            <p style={{ margin: '8px 0 0', fontSize: 13, color: C.textSub }}>
              Decision pending credit lines, initiate capital disbursals, monitor active ledgers, and manage connections.
            </p>
          </div>
          <div style={{ 
            display: 'flex', 
            gap: 10, 
            flexWrap: 'wrap',
            width: isMobile ? '100%' : 'auto'
          }}>
            {[
              { id: 'applications', label: 'Loan Applications' },
              { id: 'disburse', label: 'Disbursal Pipeline' },
              { id: 'ledger', label: 'Credit Ledger' },
              { id: 'logs', label: 'Ecosystem Logs' },
              { id: 'config', label: 'Node Whitelists' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  background: activeTab === tab.id ? C.bluePale : C.surface,
                  color: activeTab === tab.id ? C.blueLight : C.textSub,
                  border: `1px solid ${activeTab === tab.id ? C.blue + '30' : C.border}`,
                  borderRadius: 10, padding: '10px 18px', fontSize: 12.5, fontWeight: 700,
                  cursor: 'pointer', transition: '0.2s',
                  flex: isMobile ? '1 1 calc(50% - 8px)' : 'none',
                  textAlign: 'center'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Capital & Performance Telemetry Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 40 }}>
          
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Disbursed Capital</span>
              <div style={{ color: C.blueLight }}><LocalAtmRounded sx={{ fontSize: 18 }} /></div>
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 400, color: C.text }}>GH₵ {totalDisbursed.toLocaleString()}</h3>
            <span style={{ fontSize: 11, color: C.textMuted }}>Accumulated active loans & limits</span>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Pipeline Awaiting Disbursal</span>
              <div style={{ color: C.amber }}><HourglassEmptyRounded sx={{ fontSize: 18 }} /></div>
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 400, color: C.text }}>{activePipeline} Accounts</h3>
            <span style={{ fontSize: 11, color: C.textMuted }}>Approved files ready for transfer</span>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Collections Recovered</span>
              <div style={{ color: C.emerald }}><TrendingUpRounded sx={{ fontSize: 18 }} /></div>
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 400, color: C.text }}>GH₵ {totalRepayments.toLocaleString()}</h3>
            <span style={{ fontSize: 11, color: C.textMuted }}>Settle transaction volume</span>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Net Capital Recovery Ratio</span>
              <div style={{ color: C.purple }}><AssessmentRounded sx={{ fontSize: 18 }} /></div>
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 400, color: C.text }}>{recoveryRate.toFixed(1)}%</h3>
            <span style={{ fontSize: 11, color: C.textMuted }}>Disbursal-to-Repayments index</span>
          </div>

        </div>

        {/* ─── TAB VIEWPORTS ─────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          
          {/* Tab 1: Financing Applications */}
          {activeTab === 'applications' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, overflow: 'hidden' }}
            >
              <div style={{ padding: 24, borderBottom: `1px solid ${C.border}`, display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 260, maxWidth: 400 }}>
                  <input 
                    placeholder="Search applicant name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ 
                      width: '100%', padding: '10px 16px 10px 38px', borderRadius: 10, border: `1px solid ${C.border}`, 
                      background: C.bg, fontSize: 13, outline: 'none', color: C.text 
                    }}
                  />
                  <SearchRounded sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: C.textMuted }} />
                </div>

                <div style={{ display: 'flex', gap: 6 }}>
                  {[
                    { label: 'All', value: 'all' },
                    { label: 'Pending', value: 'Pending' },
                    { label: 'Under Review', value: 'UnderReview' },
                    { label: 'Approved', value: 'Approved' },
                    { label: 'Rejected', value: 'Rejected' }
                  ].map(f => (
                    <button 
                      key={f.value}
                      onClick={() => setAppFilter(f.value)}
                      style={{ 
                        background: appFilter === f.value ? C.bluePale : 'transparent', 
                        color: appFilter === f.value ? C.blueLight : C.textSub,
                        border: appFilter === f.value ? `1px solid ${C.blue}30` : '1px solid transparent',
                        borderRadius: 8, padding: '6px 12px', fontSize: 11.5, fontWeight: 700, cursor: 'pointer'
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {appsLoading ? (
                <div style={{ padding: 60, textAlign: 'center', color: C.textSub }}>Syncing applications desk...</div>
              ) : filteredApps.length === 0 ? (
                <div style={{ padding: 80, textAlign: 'center' }}>
                  <AssignmentRounded sx={{ fontSize: 44, color: C.textMuted, mb: 2 }} />
                  <h4 style={{ margin: 0, fontSize: 15, color: C.text }}>Applications Registry Clear</h4>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: C.textMuted }}>No loan applications matched the query status.</p>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.01)' }}>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Borrower</th>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Financing Product</th>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Facility Size</th>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Risk (KYC)</th>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Status</th>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApps.map((app: any) => (
                      <tr 
                        key={app._id} 
                        style={{ borderBottom: `1px solid ${C.border}`, transition: '0.2s', cursor: 'pointer' }}
                        onClick={() => setSelectedApp(app)}
                      >
                        <td style={{ padding: '18px 24px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: 13.5, fontWeight: 700, color: C.text }}>{app.userId?.firstName} {app.userId?.lastName}</span>
                            <span style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{app.userId?.email}</span>
                          </div>
                        </td>
                        <td style={{ padding: '18px 24px' }}>
                          <span style={{ fontSize: 13, color: C.textSub }}>{app.productId?.name}</span>
                        </td>
                        <td style={{ padding: '18px 24px' }}>
                          <span style={{ fontSize: 13.5, fontWeight: 700, color: C.text }}>GH₵ {app.amount?.toLocaleString()}</span>
                          <span style={{ fontSize: 10.5, color: C.textMuted, marginLeft: 4 }}>/{app.tenureMonths}m</span>
                        </td>
                        <td style={{ padding: '18px 24px' }}>
                          <span style={{ 
                            fontSize: 9.5, fontWeight: 900,
                            background: app.userId?.kycStatus === 'Verified' ? C.emeraldPale : C.amberPale,
                            color: app.userId?.kycStatus === 'Verified' ? C.emerald : C.amber,
                            padding: '3px 6px', borderRadius: 4
                          }}>
                            {app.userId?.kycStatus || 'Pending'}
                          </span>
                        </td>
                        <td style={{ padding: '18px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: getStatusColor(app.status) }} />
                            <span style={{ fontSize: 12.5, fontWeight: 700, color: getStatusColor(app.status) }}>{app.status}</span>
                          </div>
                        </td>
                        <td style={{ padding: '18px 24px', textAlign: 'right' }}>
                          <button 
                            style={{ 
                              background: 'none', border: 'none', color: C.blueLight, cursor: 'pointer',
                              display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 750
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedApp(app);
                            }}
                          >
                            Decision <OpenInNewRounded sx={{ fontSize: 13 }} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </motion.div>
          )}

          {/* Tab 2: Disbursal Pipeline */}
          {activeTab === 'disburse' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, overflow: 'hidden' }}
            >
              <div style={{ padding: 24, borderBottom: `1px solid ${C.border}` }}>
                <h3 style={{ margin: 0, fontSize: 16, color: C.text, fontFamily: F.heading }}>Approved Underwriting Queue</h3>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: C.textMuted }}>Disburse approved loans directly to Momo / Bank account registers.</p>
              </div>

              {appsLoading ? (
                <div style={{ padding: 60, textAlign: 'center', color: C.textSub }}>Querying pipeline...</div>
              ) : approvedApps.length === 0 ? (
                <div style={{ padding: 80, textAlign: 'center' }}>
                  <CloudDoneRounded sx={{ fontSize: 48, color: C.textMuted, marginBottom: 2 }} />
                  <h4 style={{ margin: 0, fontSize: 15, color: C.text, fontWeight: 700 }}>Disbursal Queue Clear</h4>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: C.textMuted }}>No approved applications are awaiting core capital transfer.</p>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.01)' }}>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Borrower Details</th>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Product Detail</th>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Requested Capital</th>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>File Date</th>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', textAlign: 'right' }}>Transfer Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedApps.map((app: any) => (
                      <tr key={app._id} style={{ borderBottom: `1px solid ${C.border}`, transition: '0.2s' }}>
                        <td style={{ padding: '20px 24px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{app.userId?.firstName} {app.userId?.lastName}</span>
                            <span style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{app.userId?.email} • {app.userId?.phoneNumber}</span>
                          </div>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                          <span style={{ fontSize: 13, color: C.textSub }}>{app.productId?.name || 'Lending facility'}</span>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>GH₵ {app.amount?.toLocaleString()}</span>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                          <span style={{ fontSize: 12.5, color: C.textMuted }}>{new Date(app.submittedAt).toLocaleDateString()}</span>
                        </td>
                        <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                          <button
                            onClick={() => handleExecuteDisbursement(app)}
                            style={{
                              background: C.blue, color: '#fff', border: 'none', borderRadius: 8,
                              padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: '0.2s'
                            }}
                          >
                            Execute Transfer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </motion.div>
          )}

          {/* Tab 3: Credit Ledger */}
          {activeTab === 'ledger' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, overflow: 'hidden' }}
            >
              <div style={{ padding: 24, borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, color: C.text, fontFamily: F.heading }}>Outstanding Credit Ledger</h3>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: C.textMuted }}>Double-entry installment schedule tracking and cash settlements.</p>
                </div>
                <button
                  onClick={() => { refetchApps(); refetchTx(); }}
                  style={{
                    background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 8,
                    padding: '6px 12px', fontSize: 11, color: C.textSub, cursor: 'pointer'
                  }}
                >
                  Sync Schedules
                </button>
              </div>

              {appsLoading || txLoading ? (
                <div style={{ padding: 60, textAlign: 'center', color: C.textSub }}>Syncing balance registers...</div>
              ) : activeCreditApps.length === 0 ? (
                <div style={{ padding: 80, textAlign: 'center' }}>
                  <HistoryRounded sx={{ fontSize: 48, color: C.textMuted, marginBottom: 2 }} />
                  <h4 style={{ margin: 0, fontSize: 15, color: C.text, fontWeight: 700 }}>Ledger Empty</h4>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: C.textMuted }}>No active accounts are disbursed under your institution portfolio.</p>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.01)' }}>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Account Profile</th>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Facility Limit</th>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>repaid balance</th>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Outstanding Facility</th>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Account Status</th>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', textAlign: 'right' }}>Settle Ledger</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeCreditApps.map((app: any) => {
                      const product = app.productId;
                      const interestRate = product?.interestRate || 0;
                      const totalPayable = app.amount * (1 + interestRate);

                      // Calculate sum of repayment transactions (type = 'debit')
                      const appTxs = rawTransactions.filter((t: any) => t.applicationId === app._id);
                      const totalPaid = appTxs
                        .filter((t: any) => t.type === 'debit')
                        .reduce((sum: number, t: any) => sum + Math.abs(t.amount || 0), 0);

                      const outstanding = Math.max(0, totalPayable - totalPaid);

                      return (
                        <tr key={app._id} style={{ borderBottom: `1px solid ${C.border}`, transition: '0.2s' }}>
                          <td style={{ padding: '20px 24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{app.userId?.firstName} {app.userId?.lastName}</span>
                              <span style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{product?.name || 'Product'} • {app.tenureMonths}m Tenure</span>
                            </div>
                          </td>
                          <td style={{ padding: '20px 24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>GH₵ {app.amount?.toLocaleString()}</span>
                              <span style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>Payable: GHS {totalPayable.toLocaleString()}</span>
                            </div>
                          </td>
                          <td style={{ padding: '20px 24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: 14, fontWeight: 600, color: C.emerald }}>GH₵ {totalPaid.toLocaleString()}</span>
                              <div style={{ width: 100, height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 10, marginTop: 6, overflow: 'hidden' }}>
                                <div style={{ width: `${Math.min(100, (totalPaid / totalPayable) * 100)}%`, height: '100%', background: C.emerald, borderRadius: 10 }} />
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '20px 24px' }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: outstanding > 0 ? C.amber : C.textMuted }}>
                              GH₵ {outstanding.toLocaleString()}
                            </span>
                          </td>
                          <td style={{ padding: '20px 24px' }}>
                            <span style={{
                              fontSize: 10, fontWeight: 800,
                              background: app.status === 'Completed' ? C.emeraldPale : C.bluePale,
                              color: app.status === 'Completed' ? C.emerald : C.blueLight,
                              padding: '4px 8px', borderRadius: 4
                            }}>
                              {app.status === 'Completed' ? '✓ SETTLED' : '• ACTIVE DUEL'}
                            </span>
                          </td>
                          <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                            {app.status !== 'Completed' ? (
                              <button
                                onClick={() => {
                                  setSelectedRepayApp(app);
                                  setRepayAmount(Math.round(totalPayable / app.tenureMonths));
                                }}
                                style={{
                                  background: 'transparent', color: C.blueLight, border: `1px solid ${C.blue}40`,
                                  borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700,
                                  cursor: 'pointer', transition: '0.2s'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = C.bluePale; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                              >
                                Record Payment
                              </button>
                            ) : (
                              <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 600 }}>Closed</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </motion.div>
          )}

          {/* Tab 4: Ecosystem Logs */}
          {activeTab === 'logs' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, overflow: 'hidden' }}
            >
              <div style={{ padding: 24, borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, color: C.text, fontFamily: F.heading }}>Audit Telemetry Logs</h3>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: C.textMuted }}>Immutable ledger logging every banking operational action, underwriting decision, and fund transfer.</p>
                </div>
                <button
                  onClick={() => refetchAudits()}
                  style={{
                    background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 8,
                    padding: '6px 12px', fontSize: 11, color: C.textSub, cursor: 'pointer'
                  }}
                >
                  Refresh Logs
                </button>
              </div>

              {auditLoading ? (
                <div style={{ padding: 60, textAlign: 'center', color: C.textSub }}>Syncing compliance ledger...</div>
              ) : rawAuditLogs.length === 0 ? (
                <div style={{ padding: 80, textAlign: 'center' }}>
                  <SecurityRounded sx={{ fontSize: 48, color: C.textMuted, marginBottom: 2 }} />
                  <h4 style={{ margin: 0, fontSize: 15, color: C.text, fontWeight: 700 }}>Telemetry Stream Clear</h4>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: C.textMuted }}>No audit events are currently captured under your node.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.01)' }}>
                        <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Timestamp</th>
                        <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Operator</th>
                        <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Event Action</th>
                        <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Telemetry Details</th>
                        <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Metadata</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rawAuditLogs.map((log: any) => (
                        <tr key={log._id} style={{ borderBottom: `1px solid ${C.border}` }}>
                          <td style={{ padding: '16px 24px' }}>
                            <span style={{ fontSize: 12.5, color: C.textMuted }}>
                              {new Date(log.createdAt).toLocaleString()}
                            </span>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
                                {log.adminId?.firstName} {log.adminId?.lastName}
                              </span>
                              <span style={{ fontSize: 10.5, color: C.textMuted }}>
                                {log.adminId?.role}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <span style={{ 
                              fontSize: 10, fontWeight: 900, 
                              background: log.action.includes('Reject') ? C.redPale : C.bluePale,
                              color: log.action.includes('Reject') ? C.red : C.blueLight,
                              padding: '4px 8px', borderRadius: 4, textTransform: 'uppercase'
                            }}>
                              {log.action}
                            </span>
                          </td>
                          <td style={{ padding: '16px 24px', maxWidth: 350 }}>
                            <span style={{ fontSize: 13, color: C.textSub, lineHeight: 1.4 }}>
                              {log.details}
                            </span>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, fontFamily: 'monospace', fontSize: 10.5, color: C.textMuted }}>
                              <span>IP: {log.ipAddress || 'unknown'}</span>
                              <span style={{ fontSize: 8.5 }}>UA: {log.userAgent?.substring(0, 25) || 'node-agent'}...</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* Tab 5: Node Whitelists */}
          {activeTab === 'config' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 32 }}
            >
              {/* Form Block */}
              <form onSubmit={handleSaveConfig} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, padding: 36 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                  <SettingsSuggestRounded sx={{ color: C.blueLight }} />
                  <h3 style={{ margin: 0, fontSize: 18, color: C.text, fontFamily: F.heading }}>Core Banking Endpoint Whitelists</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: C.textSub }}>CORE BANKING API NODE URL</label>
                    <input
                      type="url"
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      placeholder="https://core-api.bank.com/v1"
                      required
                      style={{ padding: '12px 14px', borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, color: C.text, outline: 'none', fontSize: 13 }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: C.textSub }}>WEBHOOK HANDLER CALL SECRET</label>
                    <input
                      type="password"
                      value={webhookSecret}
                      onChange={(e) => setWebhookSecret(e.target.value)}
                      placeholder="••••••••••••••••••••••••"
                      style={{ padding: '12px 14px', borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, color: C.text, outline: 'none', fontSize: 13 }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: C.textSub }}>AUTHORIZATION ACCESS HEADER TOKEN</label>
                    <input
                      type="password"
                      value={authToken}
                      onChange={(e) => setAuthToken(e.target.value)}
                      placeholder="Bearer token..."
                      style={{ padding: '12px 14px', borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, color: C.text, outline: 'none', fontSize: 13 }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: C.textSub }}>INTEREST REPAYMENT INTERVAL</label>
                    <select
                      value={repaymentFreq}
                      onChange={(e: any) => setRepaymentFreq(e.target.value)}
                      style={{ padding: '12px 14px', borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, color: C.text, outline: 'none', fontSize: 13, cursor: 'pointer' }}
                    >
                      <option value="weekly">Weekly Accumulation</option>
                      <option value="monthly">Monthly Settle Repay</option>
                      <option value="annually">Annual Billing</option>
                    </select>
                  </div>
                </div>

                <div style={{ border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, marginBottom: 28, background: 'rgba(255,255,255,0.01)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.text, display: 'block' }}>Auto-Disburse Core Funds</span>
                      <span style={{ fontSize: 11, color: C.textMuted }}>Instantly disburse funds to MoMo wallet once Super Admin approves files.</span>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 22, cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={autoDisburse} 
                        onChange={(e) => setAutoDisburse(e.target.checked)}
                        style={{ opacity: 0, width: 0, height: 0 }} 
                      />
                      <span style={{
                        position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: autoDisburse ? C.emerald : '#374151', transition: '0.3s', borderRadius: 34
                      }}>
                        <span style={{
                          position: 'absolute', content: '""', height: 16, width: 16, left: autoDisburse ? 24 : 4, bottom: 3,
                          backgroundColor: '#fff', transition: '0.3s', borderRadius: '50%'
                        }} />
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSavingConfig}
                  style={{
                    width: '100%', padding: '14px', borderRadius: 12, background: C.blue, color: '#fff',
                    border: 'none', cursor: isSavingConfig ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: '0.2s'
                  }}
                >
                  <SaveRounded /> {isSavingConfig ? 'Whitelisting parameters...' : 'Persist Integration Parameters'}
                </button>
              </form>

              {/* Core Telemetry Health Terminal */}
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                    <DnsRounded sx={{ color: C.purple }} />
                    <h3 style={{ margin: 0, fontSize: 16, color: C.text, fontFamily: F.heading }}>Dynamic Banking Telemetry</h3>
                  </div>

                  <div style={{ background: '#070a13', border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, fontFamily: 'monospace', fontSize: 12, color: '#38bdf8' }}>
                    <p style={{ margin: '0 0 8px', color: '#64748b' }}>// SIMULATOR STACK NODE PING</p>
                    <p style={{ margin: '0 0 6px' }}><span style={{ color: '#818cf8' }}>GET</span> {apiUrl || '...'}</p>
                    {pingStatus === 'testing' && (
                      <p style={{ margin: 0, color: C.amber }}>• Querying simulated endpoints...</p>
                    )}
                    {pingStatus === 'success' && (
                      <>
                        <p style={{ margin: '0 0 6px', color: C.emerald }}>✓ RESPONSE SUCCESS (HTTP 200 OK)</p>
                        <p style={{ margin: '0 0 6px' }}><span style={{ color: '#a78bfa' }}>Network latency: {pingLatency}ms</span></p>
                        <p style={{ margin: 0 }}>Active Node Handshake whitelisted!</p>
                      </>
                    )}
                    {pingStatus === 'failed' && (
                      <p style={{ margin: 0, color: C.red }}>⚠️ NODE OFFLINE: HTTPS connection whitelisting failed.</p>
                    )}
                    {pingStatus === 'idle' && (
                      <p style={{ margin: 0, color: C.textMuted }}>• Ready for administrative heartbeat test.</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handlePingTest}
                  disabled={pingStatus === 'testing'}
                  style={{
                    width: '100%', padding: '12px', borderRadius: 10, background: 'transparent',
                    color: C.purple, border: `1px solid ${C.purple}40`, cursor: 'pointer', fontSize: 12.5,
                    fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    marginTop: 24, transition: '0.2s'
                  }}
                >
                  <SyncAltRounded sx={{ fontSize: 18 }} /> Heartbeat Node Query Check
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* ─── DRAWERS ────────────────────────────────────────────────────────── */}

        {/* Underwriting Decision drawer modal */}
        <Drawer
          anchor="right"
          open={!!selectedApp}
          onClose={() => {
            setSelectedApp(null);
            setRejectionReason('');
          }}
          PaperProps={{
            sx: { width: '100%', maxWidth: 460, background: '#0a0d17', borderLeft: `1px solid ${C.border}`, padding: 32, boxSizing: 'border-box' }
          }}
        >
          {selectedApp && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', color: '#fff' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                  <div>
                    <span style={{ fontSize: 9.5, fontWeight: 900, color: C.blueLight, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Underwriting desk</span>
                    <h3 style={{ margin: '4px 0 0', fontSize: 17, color: C.text, fontFamily: F.heading, fontWeight: 700 }}>Decision Panel</h3>
                  </div>
                  <IconButton onClick={() => { setSelectedApp(null); setRejectionReason(''); }} sx={{ color: C.textSub }}><CloseRounded /></IconButton>
                </div>

                <div style={{ border: `1px solid ${C.border}`, borderRadius: 16, padding: 18, marginBottom: 24, background: 'rgba(255,255,255,0.01)' }}>
                  <span style={{ fontSize: 10, color: C.textMuted, fontWeight: 800, textTransform: 'uppercase' }}>Borrower Info</span>
                  <h4 style={{ margin: '4px 0 2px', fontSize: 15, color: C.text }}>{selectedApp.userId?.firstName} {selectedApp.userId?.lastName}</h4>
                  <p style={{ margin: 0, fontSize: 11.5, color: C.textSub }}>{selectedApp.userId?.email}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: 8 }}>
                    <span style={{ fontSize: 12.5, color: C.textSub }}>Product Class:</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: C.text }}>{selectedApp.productId?.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: 8 }}>
                    <span style={{ fontSize: 12.5, color: C.textSub }}>Principal Borrowed:</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: C.blueLight }}>GH₵ {selectedApp.amount?.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: 8 }}>
                    <span style={{ fontSize: 12.5, color: C.textSub }}>Requested Tenure:</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: C.text }}>{selectedApp.tenureMonths} Months</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12.5, color: C.textSub }}>Current State:</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: getStatusColor(selectedApp.status) }}>{selectedApp.status}</span>
                  </div>
                </div>

                {/* Decision Actions */}
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20, marginTop: 24 }}>
                  {selectedApp.status === 'Pending' && (
                    <button 
                      onClick={() => handleReview(selectedApp._id, 'UnderReview')}
                      disabled={isReviewing}
                      style={{ 
                        width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: C.purple,
                        color: '#fff', fontWeight: 800, fontSize: 12.5, cursor: 'pointer', marginBottom: 12
                      }}
                    >
                      Initiate Underwriting Review
                    </button>
                  )}

                  {(selectedApp.status === 'Pending' || selectedApp.status === 'UnderReview') && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <button 
                        onClick={() => handleReview(selectedApp._id, 'Approved')}
                        disabled={isReviewing}
                        style={{ 
                          width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: C.emerald,
                          color: '#fff', fontWeight: 800, fontSize: 12.5, cursor: 'pointer'
                        }}
                      >
                        Approve Application
                      </button>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                        <span style={{ fontSize: 11, color: C.textSub, fontWeight: 700 }}>REJECTION EXPLANATORY (IF REJECTED)</span>
                        <input
                          type="text"
                          placeholder="Applicant debt-to-income ratio exceeded ceiling..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          style={{ padding: '10px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: '#fff', fontSize: 12, outline: 'none' }}
                        />
                        <button 
                          onClick={() => handleReview(selectedApp._id, 'Rejected')}
                          disabled={isReviewing}
                          style={{ 
                            width: '100%', padding: '12px', borderRadius: 10, border: `1.5px solid ${C.red}`, background: 'transparent',
                            color: C.red, fontWeight: 800, fontSize: 12.5, cursor: 'pointer'
                          }}
                        >
                          Reject Application
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedApp.status === 'Approved' && (
                    <button 
                      onClick={() => handleExecuteDisbursement(selectedApp)}
                      style={{ 
                        width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: C.blue,
                        color: '#fff', fontWeight: 800, fontSize: 12.5, cursor: 'pointer'
                      }}
                    >
                      Disburse Core Capital
                    </button>
                  )}

                  {(selectedApp.status === 'Completed' || selectedApp.status === 'Rejected' || selectedApp.status === 'Disbursed') && (
                    <div style={{ textAlign: 'center', padding: '16px 0', border: `1.5px dashed ${C.borderStrong}`, borderRadius: 10 }}>
                      <p style={{ margin: 0, fontSize: 12.5, color: C.textSub }}>This application is in stage ({selectedApp.status}).</p>
                      <p style={{ margin: '4px 0 0', fontSize: 11, color: C.textMuted }}>Review options are locked.</p>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20, fontSize: 11.5, color: C.textMuted, display: 'flex', alignItems: 'center', gap: 8 }}>
                <SecurityRounded sx={{ fontSize: 14, color: C.emerald }} /> Immutable underwriting decisions audited under the compliance ledger.
              </div>
            </div>
          )}
        </Drawer>

        {/* Modal Drawer: Settle Installment Repayment */}
        <Drawer
          anchor="right"
          open={!!selectedRepayApp}
          onClose={() => setSelectedRepayApp(null)}
          PaperProps={{
            style: { width: '100%', maxWidth: 440, background: '#0a0d17', borderLeft: `1px solid ${C.border}`, padding: 32, boxSizing: 'border-box' }
          }}
        >
          {selectedRepayApp && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', color: '#fff' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                  <h3 style={{ margin: 0, fontSize: 18, color: C.text, fontFamily: F.heading, fontWeight: 700 }}>Record Facility Payment</h3>
                  <IconButton onClick={() => setSelectedRepayApp(null)} style={{ color: C.textMuted }}><CloseRounded /></IconButton>
                </div>

                <div style={{ border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, marginBottom: 28, background: 'rgba(255,255,255,0.01)' }}>
                  <span style={{ fontSize: 10, color: C.textMuted, fontWeight: 800, textTransform: 'uppercase' }}>Borrower Info</span>
                  <h4 style={{ margin: '6px 0 2px', fontSize: 15, color: C.text }}>{selectedRepayApp.userId?.firstName} {selectedRepayApp.userId?.lastName}</h4>
                  <p style={{ margin: 0, fontSize: 12, color: C.textMuted }}>{selectedRepayApp.productId?.name}</p>
                </div>

                <form onSubmit={handleSettleRepayment} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: C.textSub }}>REPAYMENT VALUE (GHS)</label>
                    <input
                      type="number"
                      value={repayAmount}
                      onChange={(e) => setRepayAmount(Number(e.target.value))}
                      required
                      min={1}
                      style={{ padding: '12px 14px', borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, color: C.text, outline: 'none', fontSize: 13 }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: C.textSub }}>SETTLEMENT CHANNEL</label>
                    <select
                      value={repayMethod}
                      onChange={(e) => setRepayMethod(e.target.value)}
                      style={{ padding: '12px 14px', borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, color: C.text, outline: 'none', fontSize: 13, cursor: 'pointer' }}
                    >
                      <option value="Mobile Money">Mobile Money (MTN / Telecel / AT)</option>
                      <option value="Bank Wire">Bank Wire Transfer</option>
                      <option value="Cash Counter">Cash / Branch Payment</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSettleLoading}
                    style={{
                      width: '100%', padding: '14px', borderRadius: 10, background: C.emerald, color: '#fff',
                      border: 'none', cursor: isSettleLoading ? 'not-allowed' : 'pointer', fontSize: 13.5,
                      fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      marginTop: 12, transition: '0.2s'
                    }}
                  >
                    {isSettleLoading ? 'Syncing ledger...' : 'Post Settle Repayment'}
                  </button>
                </form>
              </div>

              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20, fontSize: 11.5, color: C.textMuted, display: 'flex', alignItems: 'center', gap: 8 }}>
                <SecurityRounded sx={{ fontSize: 14, color: C.emerald }} /> Secure ledger settlement is audited under the compliance ledger.
              </div>
            </div>
          )}
        </Drawer>

      </div>
    </AdminShell>
  );
}
