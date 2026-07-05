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
import AdminShell, { C, F } from '../components/AdminShell';
import { 
  VerifiedUserRounded,
  CloseRounded,
  SecurityRounded,
  LocalActivityRounded,
  EmergencyShareRounded,
  LocalAtmRounded,
  HealthAndSafetyRounded,
  GavelRounded,
  CheckCircleRounded,
  CancelRounded,
  HistoryRounded,
  BoltRounded,
  AssignmentTurnedInRounded
} from '@mui/icons-material';

// Define standard claim types
interface MockClaim {
  id: string;
  borrowerName: string;
  email: string;
  productName: string;
  incidentType: string;
  requestedPayout: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Settled';
  filedDate: string;
  applicationId: string;
}

export default function InsuranceIntegrationPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'policies' | 'claims' | 'ledger'>('policies');

  // Actuarial claim state simulation (stored in state & session storage to persist mock test runs)
  const [claimsList, setClaimsList] = useState<MockClaim[]>([]);
  
  // Custom Incident Filer state
  const [isFilingClaim, setIsFilingClaim] = useState(false);
  const [targetAppId, setTargetAppId] = useState('');
  const [incidentDescription, setIncidentDescription] = useState('Collateral hardware damage / theft of protected BNPL device');
  const [payoutRequestVal, setPayoutRequestVal] = useState(1200);

  // Claim Process Drawer
  const [selectedClaim, setSelectedClaim] = useState<MockClaim | null>(null);
  const [settledPayoutAmount, setSettledPayoutAmount] = useState<number>(0);
  const [isClaimProcessing, setIsClaimProcessing] = useState(false);

  // RTK Queries & Mutations
  const { data: appsResponse, isLoading: appsLoading, refetch: refetchApps } = useAdminGetApplicationsQuery(undefined);
  const { data: txResponse, isLoading: txLoading, refetch: refetchTx } = useGetTransactionsQuery(undefined);
  
  const [reviewApplication] = useAdminReviewApplicationMutation();
  const [createTransaction] = useCreateTransactionMutation();

  useEffect(() => {
    setMounted(true);
    const stored = sessionStorage.getItem('rb_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }

    // Load claim simulations if stored in sessionStorage to keep data intact across route changes
    const storedClaims = sessionStorage.getItem('rb_mock_claims');
    if (storedClaims) {
      setClaimsList(JSON.parse(storedClaims));
    } else {
      // Seed some default insurance claims for a stellar demonstration out-of-the-box!
      const initialClaims: MockClaim[] = [
        {
          id: 'CLAIM-7241',
          borrowerName: 'Kwame Mensah',
          email: 'kwame@ghana.com',
          productName: 'Device BNPL Protection Plus',
          incidentType: 'Severe hardware failure & accidental screen smash',
          requestedPayout: 850,
          status: 'Pending',
          filedDate: new Date(Date.now() - 36 * 3600 * 1000).toLocaleDateString(),
          applicationId: 'MOCK-APP-1'
        },
        {
          id: 'CLAIM-1940',
          borrowerName: 'Abena Osei',
          email: 'abena@gmail.com',
          productName: 'BNPL Job-Loss Shield',
          incidentType: 'Temporary redundancy / layoff verification from Employer',
          requestedPayout: 1800,
          status: 'Settled',
          filedDate: new Date(Date.now() - 5 * 24 * 3600 * 1000).toLocaleDateString(),
          applicationId: 'MOCK-APP-2'
        }
      ];
      setClaimsList(initialClaims);
      sessionStorage.setItem('rb_mock_claims', JSON.stringify(initialClaims));
    }
  }, []);

  if (!mounted) return null;

  const rawApplications = appsResponse?.data || [];
  const rawTransactions = txResponse?.data?.items || [];

  // Scoped Tenant filter
  const myInstitutionId = user?.institutionId;
  const isSuperAdmin = user?.role === 'SuperAdmin' || user?.role === 'Admin';

  const myApplications = rawApplications.filter((app: any) => {
    if (isSuperAdmin) return true;
    const prod = app.productId;
    return prod && prod.institutionId && prod.institutionId._id === myInstitutionId;
  });

  // Filter ONLY insurance products/applications
  const myInsuranceApps = myApplications.filter((a: any) => {
    const prod = a.productId;
    return prod && (prod.productType === 'Insurance' || prod.name?.toLowerCase().includes('protect') || prod.name?.toLowerCase().includes('shield'));
  });

  // Split into active policies (Disbursed/Completed) and pending enrollments (Approved/Pending)
  const activePolicies = myInsuranceApps.filter((a: any) => a.status === 'Disbursed' || a.status === 'Completed');
  const policyQueue = myInsuranceApps.filter((a: any) => a.status === 'Approved');

  // Trigger simulated emergency claim filing
  const handleFileIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAppId) {
      toast.error('Please select an active policy to file against.');
      return;
    }

    const app = activePolicies.find((a: any) => a._id === targetAppId);
    if (!app) return;

    const newClaim: MockClaim = {
      id: `CLAIM-${Math.floor(1000 + Math.random() * 9000)}`,
      borrowerName: `${app.userId?.firstName} ${app.userId?.lastName}`,
      email: app.userId?.email || 'customer@resolvebridge.com',
      productName: app.productId?.name || 'BNPL Insurance Protection',
      incidentType: incidentDescription,
      requestedPayout: payoutRequestVal,
      status: 'Pending',
      filedDate: new Date().toLocaleDateString(),
      applicationId: targetAppId
    };

    const updated = [newClaim, ...claimsList];
    setClaimsList(updated);
    sessionStorage.setItem('rb_mock_claims', JSON.stringify(updated));
    
    setIsFilingClaim(false);
    setIncidentDescription('Collateral hardware damage / theft of protected BNPL device');
    setPayoutRequestVal(1200);
    setActiveTab('claims');
    toast.success('Simulated emergency claim incident logged successfully!');
  };

  // Claim processing settlement (Approve/Reject)
  const handleProcessClaim = async (decision: 'Approved' | 'Rejected') => {
    if (!selectedClaim) return;
    setIsClaimProcessing(true);

    try {
      if (decision === 'Approved') {
        const app = activePolicies.find((a: any) => a._id === selectedClaim.applicationId);
        
        // Log custom debit transaction as the payout settlement on the ledger
        await createTransaction({
          userId: app?.userId?._id || 'SYSTEM',
          applicationId: selectedClaim.applicationId,
          institutionId: app?.productId?.institutionId?._id || myInstitutionId,
          description: `Insurance Claim Settle: ${selectedClaim.incidentType.substring(0, 30)}...`,
          amount: settledPayoutAmount,
          type: 'credit', // credit type on ledger transfers money to user/merchant
          category: 'Insurance',
          status: 'Completed'
        }).unwrap();

        toast.success(`Claim approved! GHS ${settledPayoutAmount.toLocaleString()} claim settlement logged on double-entry ledger.`);
      } else {
        toast.error('Insurance claim review processed: REJECTED');
      }

      // Update mock claims database
      const updated = claimsList.map(c => {
        if (c.id === selectedClaim.id) {
          return { ...c, status: decision === 'Approved' ? 'Settled' as const : 'Rejected' as const, requestedPayout: settledPayoutAmount || c.requestedPayout };
        }
        return c;
      });

      setClaimsList(updated);
      sessionStorage.setItem('rb_mock_claims', JSON.stringify(updated));
      setSelectedClaim(null);
      refetchTx();
    } catch (err: any) {
      toast.error(err.data?.message || 'Error executing claim decision');
    } finally {
      setIsClaimProcessing(false);
    }
  };

  // Activate Pending Policy Enrollments
  const handleActivatePolicy = async (appId: string) => {
    try {
      toast.loading('Activating customer policy coverage...', { id: 'policy' });
      const res = await reviewApplication({ id: appId, status: 'Disbursed' }).unwrap();
      if (res.success) {
        toast.success('Insurance policy active! Coverage terms generated and signed.', { id: 'policy' });
        refetchApps();
      }
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to enroll policy', { id: 'policy' });
    }
  };

  // Actuarial analytics indicators
  const grossPremiums = activePolicies.reduce((sum: number, a: any) => sum + (a.amount || 0), 0);
  const settledClaimsTotal = claimsList
    .filter((c: any) => c.status === 'Settled')
    .reduce((sum: number, c: any) => sum + c.requestedPayout, 0);

  const lossRatio = grossPremiums > 0 ? (settledClaimsTotal / grossPremiums) * 100 : 0;

  return (
    <AdminShell>
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        
        {/* Upper Dashboard Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 300, color: C.text, fontFamily: F.serif }}>
              Insurance Policy & Claims Console
            </h1>
            <p style={{ margin: '8px 0 0', fontSize: 13, color: C.textSub }}>
              Process emergency underwriting claims, enroll newly approved policyholders, and evaluate risk index metrics.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {['policies', 'claims', 'ledger'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                style={{
                  background: activeTab === tab ? C.bluePale : C.surface,
                  color: activeTab === tab ? C.blueLight : C.textSub,
                  border: `1px solid ${activeTab === tab ? C.blue + '30' : C.border}`,
                  borderRadius: 10, padding: '10px 18px', fontSize: 12.5, fontWeight: 700,
                  cursor: 'pointer', transition: '0.2s'
                }}
              >
                {tab === 'policies' ? 'Active Policies' : tab === 'claims' ? 'Claims Queue' : 'Actuarial Ledger'}
              </button>
            ))}
            <button
              onClick={() => setIsFilingClaim(true)}
              style={{
                background: C.emeraldPale, color: C.emerald, border: `1px solid ${C.emerald}30`,
                borderRadius: 10, padding: '10px 18px', fontSize: 12.5, fontWeight: 800,
                cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: 8
              }}
            >
              <EmergencyShareRounded sx={{ fontSize: 16 }} /> File Incident
            </button>
          </div>
        </div>

        {/* Dynamic Actuarial Indicators */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 40 }}>
          
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Active Policies</span>
              <div style={{ color: C.blueLight }}><HealthAndSafetyRounded sx={{ fontSize: 18 }} /></div>
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 400, color: C.text }}>{activePolicies.length} Coverages</h3>
            <span style={{ fontSize: 11, color: C.textMuted }}>Total active premium schedules</span>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Premium Underwritten</span>
              <div style={{ color: C.emerald }}><LocalAtmRounded sx={{ fontSize: 18 }} /></div>
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 400, color: C.text }}>GH₵ {grossPremiums.toLocaleString()}</h3>
            <span style={{ fontSize: 11, color: C.textMuted }}>Accumulated gross policy coverage sizes</span>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Claims Settled Payout</span>
              <div style={{ color: C.red }}><GavelRounded sx={{ fontSize: 18 }} /></div>
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 400, color: C.text }}>GH₵ {settledClaimsTotal.toLocaleString()}</h3>
            <span style={{ fontSize: 11, color: C.textMuted }}>Total emergency loss payouts issued</span>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Ecosystem Loss Ratio</span>
              <div style={{ color: C.purple }}><SecurityRounded sx={{ fontSize: 18 }} /></div>
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 400, color: C.text }}>{lossRatio.toFixed(1)}%</h3>
            <span style={{ fontSize: 11, color: C.textMuted }}>Net risk profile ratio (Target &lt; 40%)</span>
          </div>

        </div>

        {/* Tab 1: Policies and Enrollments Queue */}
        <AnimatePresence mode="wait">
          {activeTab === 'policies' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              
              {/* Enrollment Queue */}
              {policyQueue.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ background: 'rgba(59, 130, 246, 0.02)', border: `1px dashed ${C.blue}40`, borderRadius: 24, overflow: 'hidden' }}
                >
                  <div style={{ padding: '20px 24px', borderBottom: `1px dashed ${C.blue}40`, background: `${C.bluePale}40` }}>
                    <h3 style={{ margin: 0, fontSize: 15, color: C.blueLight, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <LocalActivityRounded /> Pending Policy Enrollments Queue
                    </h3>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <tbody>
                      {policyQueue.map((queueApp: any) => (
                        <tr key={queueApp._id} style={{ borderBottom: `1px solid ${C.border}` }}>
                          <td style={{ padding: '16px 24px' }}>
                            <span style={{ fontSize: 13.5, fontWeight: 700, color: C.text }}>{queueApp.userId?.firstName} {queueApp.userId?.lastName}</span>
                            <span style={{ fontSize: 11, color: C.textMuted, marginLeft: 12 }}>{queueApp.productId?.name}</span>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <span style={{ fontSize: 13, color: C.textSub }}>Monthly Premium: GHS {queueApp.amount?.toLocaleString()}</span>
                          </td>
                          <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                            <button
                              onClick={() => handleActivatePolicy(queueApp._id)}
                              style={{
                                background: C.blue, color: '#fff', border: 'none', borderRadius: 8,
                                padding: '6px 12px', fontSize: 11.5, fontWeight: 800, cursor: 'pointer'
                              }}
                            >
                              Issue Policy Coverage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}

              {/* Active policies List */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, overflow: 'hidden' }}
              >
                <div style={{ padding: 24, borderBottom: `1px solid ${C.border}` }}>
                  <h3 style={{ margin: 0, fontSize: 16, color: C.text, fontFamily: F.heading }}>Active Coverage Policies</h3>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: C.textMuted }}>Verified individuals with currently active premium coverage.</p>
                </div>

                {appsLoading ? (
                  <div style={{ padding: 60, textAlign: 'center', color: C.textSub }}>Syncing policies...</div>
                ) : activePolicies.length === 0 ? (
                  <div style={{ padding: 80, textAlign: 'center' }}>
                    <HealthAndSafetyRounded sx={{ fontSize: 48, color: C.textMuted, marginBottom: 2 }} />
                    <h4 style={{ margin: 0, fontSize: 15, color: C.text, fontWeight: 700 }}>Coverage Database Clear</h4>
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: C.textMuted }}>No active policy certificates exist under your underwriting scope.</p>
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.01)' }}>
                        <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Insured Customer</th>
                        <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Coverage Terms</th>
                        <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Premium Value</th>
                        <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Certificate Status</th>
                        <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', textAlign: 'right' }}>Date Certified</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activePolicies.map((policy: any) => (
                        <tr key={policy._id} style={{ borderBottom: `1px solid ${C.border}` }}>
                          <td style={{ padding: '20px 24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{policy.userId?.firstName} {policy.userId?.lastName}</span>
                              <span style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{policy.userId?.email}</span>
                            </div>
                          </td>
                          <td style={{ padding: '20px 24px' }}>
                            <span style={{ fontSize: 13, color: C.textSub }}>{policy.productId?.name}</span>
                          </td>
                          <td style={{ padding: '20px 24px' }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>GH₵ {policy.amount?.toLocaleString()}</span>
                            <span style={{ fontSize: 10, color: C.textMuted, marginLeft: 4 }}>/monthly</span>
                          </td>
                          <td style={{ padding: '20px 24px' }}>
                            <span style={{
                              fontSize: 10, fontWeight: 800,
                              background: C.emeraldPale, color: C.emerald,
                              padding: '4px 8px', borderRadius: 4
                            }}>
                              ACTIVE POLICY
                            </span>
                          </td>
                          <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                            <span style={{ fontSize: 12.5, color: C.textSub }}>{new Date(policy.submittedAt).toLocaleDateString()}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </motion.div>
            </div>
          )}

          {/* Tab 2: Claims Review and Settlement */}
          {activeTab === 'claims' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, overflow: 'hidden' }}
            >
              <div style={{ padding: 24, borderBottom: `1px solid ${C.border}` }}>
                <h3 style={{ margin: 0, fontSize: 16, color: C.text, fontFamily: F.heading }}>Emergency Claims Review Desk</h3>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: C.textMuted }}>Verify damage certificates and execute platform-wide loss claims settlements.</p>
              </div>

              {claimsList.length === 0 ? (
                <div style={{ padding: 80, textAlign: 'center' }}>
                  <AssignmentTurnedInRounded sx={{ fontSize: 48, color: C.textMuted, marginBottom: 2 }} />
                  <h4 style={{ margin: 0, fontSize: 15, color: C.text, fontWeight: 700 }}>Claims Queue Empty</h4>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: C.textMuted }}>No active client claims incidents are logged under your review profile.</p>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.01)' }}>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Claim Reference</th>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Claimant</th>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Incident Category</th>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Payout Estimate</th>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Review Status</th>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claimsList.map((claim) => (
                      <tr key={claim.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: '20px 24px' }}>
                          <span style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 700, color: C.blueLight }}>{claim.id}</span>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{claim.borrowerName}</span>
                            <span style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{claim.email}</span>
                          </div>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: 13, color: C.textSub }}>{claim.incidentType}</span>
                            <span style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>Covered by: {claim.productName}</span>
                          </div>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>GH₵ {claim.requestedPayout.toLocaleString()}</span>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                          <span style={{
                            fontSize: 10.5, fontWeight: 800,
                            background: claim.status === 'Settled' ? C.emeraldPale : claim.status === 'Rejected' ? C.redPale : C.amberPale,
                            color: claim.status === 'Settled' ? C.emerald : claim.status === 'Rejected' ? C.red : C.amber,
                            padding: '4px 8px', borderRadius: 4
                          }}>
                            {claim.status === 'Settled' ? '✓ SETTLED' : claim.status.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                          {claim.status === 'Pending' ? (
                            <button
                              onClick={() => {
                                setSelectedClaim(claim);
                                setSettledPayoutAmount(claim.requestedPayout);
                              }}
                              style={{
                                background: C.bluePale, color: C.blueLight, border: `1px solid ${C.blue}40`,
                                borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 800, cursor: 'pointer'
                              }}
                            >
                              Process Settlement
                            </button>
                          ) : (
                            <span style={{ fontSize: 12, color: C.textMuted }}>Closed {claim.filedDate}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </motion.div>
          )}

          {/* Tab 3: Actuarial Ledger */}
          {activeTab === 'ledger' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, overflow: 'hidden' }}
            >
              <div style={{ padding: 24, borderBottom: `1px solid ${C.border}` }}>
                <h3 style={{ margin: 0, fontSize: 16, color: C.text, fontFamily: F.heading }}>Actuarial Loss Settlement Registry</h3>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: C.textMuted }}>Audit ledger payouts issued to users for claims emergency mitigation.</p>
              </div>

              {txLoading ? (
                <div style={{ padding: 60, textAlign: 'center', color: C.textSub }}>Syncing claims settlements...</div>
              ) : rawTransactions.filter((t: any) => t.category === 'Insurance').length === 0 ? (
                <div style={{ padding: 80, textAlign: 'center' }}>
                  <HistoryRounded sx={{ fontSize: 48, color: C.textMuted, marginBottom: 2 }} />
                  <h4 style={{ margin: 0, fontSize: 15, color: C.text, fontWeight: 700 }}>Settlement Ledger Empty</h4>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: C.textMuted }}>No claims ledger payouts have been triggered on this tenant.</p>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.01)' }}>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Transaction Reference</th>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Description</th>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Payout Value</th>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Audit Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rawTransactions
                      .filter((t: any) => t.category === 'Insurance')
                      .map((tx: any) => (
                        <tr key={tx.id || tx._id} style={{ borderBottom: `1px solid ${C.border}` }}>
                          <td style={{ padding: '20px 24px' }}>
                            <span style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 700, color: C.blueLight }}>
                              {tx.reference || tx._id?.substring(0, 8).toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '20px 24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: 13.5, color: C.text }}>{tx.desc || tx.description}</span>
                              <span style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>Logged date: {tx.date || new Date(tx.createdAt).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td style={{ padding: '20px 24px' }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: C.emerald }}>
                              +GHS {Math.abs(tx.amount || 0).toLocaleString()}
                            </span>
                          </td>
                          <td style={{ padding: '20px 24px' }}>
                            <span style={{
                              fontSize: 10.5, fontWeight: 800,
                              background: C.emeraldPale, color: C.emerald,
                              padding: '4px 8px', borderRadius: 4
                            }}>
                              {tx.status || 'Completed'}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Drawer: Process Settlement Claims */}
        <Drawer
          anchor="right"
          open={!!selectedClaim}
          onClose={() => setSelectedClaim(null)}
          PaperProps={{
            style: { width: '100%', maxWidth: 440, background: C.surface, borderLeft: `1px solid ${C.border}`, padding: 32, boxSizing: 'border-box' }
          }}
        >
          {selectedClaim && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', color: C.text }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                  <h3 style={{ margin: 0, fontSize: 18, color: C.text, fontFamily: F.heading, fontWeight: 700 }}>Review Emergency Claim</h3>
                  <IconButton onClick={() => setSelectedClaim(null)} style={{ color: C.textMuted }}><CloseRounded /></IconButton>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, marginBottom: 28, background: 'rgba(255,255,255,0.01)' }}>
                  <div>
                    <span style={{ fontSize: 10, color: C.textMuted, fontWeight: 800, textTransform: 'uppercase' }}>Insured Claimant</span>
                    <h4 style={{ margin: '4px 0 0', fontSize: 14.5, color: C.text }}>{selectedClaim.borrowerName}</h4>
                  </div>
                  <div>
                    <span style={{ fontSize: 10, color: C.textMuted, fontWeight: 800, textTransform: 'uppercase' }}>Incident Verification</span>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: C.textSub, lineHeight: '1.4' }}>{selectedClaim.incidentType}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: 10, color: C.textMuted, fontWeight: 800, textTransform: 'uppercase' }}>Coverage Policy Enrolled</span>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: C.textSub }}>{selectedClaim.productName}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
                  <label style={{ fontSize: 11, fontWeight: 800, color: C.textSub }}>APPROVE SETTLED PAYOUT AMOUNT (GHS)</label>
                  <input
                    type="number"
                    value={settledPayoutAmount}
                    onChange={(e) => setSettledPayoutAmount(Number(e.target.value))}
                    required
                    min={1}
                    style={{ padding: '12px 14px', borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, color: C.text, outline: 'none', fontSize: 13 }}
                  />
                  <span style={{ fontSize: 10.5, color: C.textMuted }}>Maximum coverage payout cap: GHS {selectedClaim.requestedPayout.toLocaleString()}</span>
                </div>

                <div style={{ display: 'flex', gap: 16 }}>
                  <button
                    onClick={() => handleProcessClaim('Approved')}
                    disabled={isClaimProcessing}
                    style={{
                      flex: 1, padding: '14px', borderRadius: 10, background: C.emerald, color: '#fff',
                      border: 'none', cursor: isClaimProcessing ? 'not-allowed' : 'pointer', fontSize: 13,
                      fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                    }}
                  >
                    <CheckCircleRounded sx={{ fontSize: 16 }} /> Approve Payout
                  </button>
                  <button
                    onClick={() => handleProcessClaim('Rejected')}
                    disabled={isClaimProcessing}
                    style={{
                      flex: 1, padding: '14px', borderRadius: 10, background: 'rgba(239, 68, 68, 0.1)', color: C.red,
                      border: `1px solid ${C.red}30`, cursor: isClaimProcessing ? 'not-allowed' : 'pointer', fontSize: 13,
                      fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                    }}
                  >
                    <CancelRounded sx={{ fontSize: 16 }} /> Reject
                  </button>
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20, fontSize: 11.5, color: C.textMuted, display: 'flex', alignItems: 'center', gap: 8 }}>
                <SecurityRounded sx={{ fontSize: 14, color: C.emerald }} /> Claims process decisions are logged directly in platform audit trails.
              </div>
            </div>
          )}
        </Drawer>

        {/* Modal Drawer: Simulated Emergency Incident Filer */}
        <Drawer
          anchor="right"
          open={isFilingClaim}
          onClose={() => setIsFilingClaim(false)}
          PaperProps={{
            style: { width: '100%', maxWidth: 440, background: C.surface, borderLeft: `1px solid ${C.border}`, padding: 32, boxSizing: 'border-box' }
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', color: C.text }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <h3 style={{ margin: 0, fontSize: 18, color: C.text, fontFamily: F.heading, fontWeight: 700 }}>Simulate Claims Incident</h3>
                <IconButton onClick={() => setIsFilingClaim(false)} style={{ color: C.textMuted }}><CloseRounded /></IconButton>
              </div>

              <p style={{ fontSize: 12.5, color: C.textMuted, marginBottom: 24, lineHeight: '1.4' }}>
                Filing an incident triggers an immediate customer coverage evaluation review under the claims supervisor queue.
              </p>

              <form onSubmit={handleFileIncident} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 11, fontWeight: 800, color: C.textSub }}>SELECT ACTIVE COVERAGE POLICY</label>
                  <select
                    value={targetAppId}
                    onChange={(e) => setTargetAppId(e.target.value)}
                    required
                    style={{ padding: '12px 14px', borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, color: C.text, outline: 'none', fontSize: 13, cursor: 'pointer' }}
                  >
                    <option value="">-- Choose active policy --</option>
                    {activePolicies.map((p: any) => (
                      <option key={p._id} value={p._id}>
                        {p.userId?.firstName} {p.userId?.lastName} ({p.productId?.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 11, fontWeight: 800, color: C.textSub }}>INCIDENT CLAIM VALUE (GHS)</label>
                  <input
                    type="number"
                    value={payoutRequestVal}
                    onChange={(e) => setPayoutRequestVal(Number(e.target.value))}
                    required
                    min={1}
                    style={{ padding: '12px 14px', borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, color: C.text, outline: 'none', fontSize: 13 }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 11, fontWeight: 800, color: C.textSub }}>INCIDENT REASON & DESCRIPTION</label>
                  <textarea
                    value={incidentDescription}
                    onChange={(e) => setIncidentDescription(e.target.value)}
                    required
                    style={{ padding: '12px 14px', borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, color: C.text, outline: 'none', fontSize: 13, height: 100, resize: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%', padding: '14px', borderRadius: 10, background: C.blue, color: '#fff',
                    border: 'none', fontSize: 13.5, fontWeight: 700, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 8, marginTop: 12, transition: '0.2s'
                  }}
                >
                  <BoltRounded /> Log Claim File Simulation
                </button>

              </form>
            </div>

            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20, fontSize: 11.5, color: C.textMuted, display: 'flex', alignItems: 'center', gap: 8 }}>
              <SecurityRounded sx={{ fontSize: 14, color: C.blueLight }} /> Incidents must conform to whitelisted product coverage templates.
            </div>
          </div>
        </Drawer>

      </div>
    </AdminShell>
  );
}
