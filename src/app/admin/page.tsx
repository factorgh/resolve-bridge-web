'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Drawer, IconButton } from '@mui/material';
import AdminShell, { C, F } from './components/AdminShell';
import { 
  useAdminGetApplicationsQuery, 
  useAdminReviewApplicationMutation 
} from '@/lib/redux/api/applicationApi';
import { 
  Speed, 
  AssignmentTurnedInRounded, 
  AccountBalanceWalletRounded, 
  HourglassEmptyRounded,
  ShieldRounded,
  OpenInNewRounded,
  CloseRounded
} from '@mui/icons-material';

export default function AdminConsolePage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  // Fetch real applications through our newly built multi-tenant API
  const { data: appsResponse, isLoading: appsLoading, refetch } = useAdminGetApplicationsQuery(
    activeFilter !== 'all' ? { status: activeFilter } : undefined
  );
  
  const [reviewApplication, { isLoading: isReviewing }] = useAdminReviewApplicationMutation();

  useEffect(() => {
    setMounted(true);
    const stored = sessionStorage.getItem('rb_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return null;

  const applications = appsResponse?.data || [];

  // Calculate high-fidelity metrics based on real database records
  const totalCount = applications.length;
  const pendingCount = applications.filter((a: any) => a.status === 'Pending').length;
  const approvedCount = applications.filter((a: any) => a.status === 'Approved').length;
  const disbursedCount = applications.filter((a: any) => a.status === 'Disbursed').length;
  const underReviewCount = applications.filter((a: any) => a.status === 'UnderReview').length;

  const totalVolume = applications
    .filter((a: any) => a.status === 'Disbursed' || a.status === 'Approved')
    .reduce((sum: number, a: any) => sum + (a.amount || 0), 0);

  // Process Quick Status Elevations
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
        toast.success(`Application successfully marked as "${status}"`);
        setSelectedApp(null);
        setRejectionReason('');
        refetch();
      } else {
        toast.error(res.message || 'Underwriting update failed');
      }
    } catch (err: any) {
      toast.error(err.data?.message || 'Error occurred during review execution');
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

  return (
    <AdminShell>
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        
        {/* Welcome Section */}
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
              {user?.institutionId ? 'Institution Underwriting Desk' : 'Global Platform Console'}
            </h1>
            <p style={{ margin: '8px 0 0', fontSize: 13, color: C.textSub }}>
              Authorized: <span style={{ color: C.blueLight, fontWeight: 700 }}>{user?.firstName} {user?.lastName}</span> ({user?.role})
            </p>
          </div>
          <button 
            onClick={() => refetch()}
            style={{ 
              background: C.surface, color: C.blueLight, border: `1px solid ${C.border}`, borderRadius: 10,
              padding: '10px 18px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', transition: '0.2s',
              width: isMobile ? '100%' : 'auto', textAlign: 'center'
            }}
          >
            Sync Pipeline
          </button>
        </div>

        {/* Live Multi-Tenant KPI Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 40 }}>
          
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Pipeline Portfolio</span>
              <div style={{ color: C.blueLight }}><Speed sx={{ fontSize: 18 }} /></div>
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 400, color: C.text }}>{totalCount}</h3>
            <span style={{ fontSize: 11, color: C.textMuted }}>Applications across active products</span>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Pending Decision</span>
              <div style={{ color: C.amber }}><HourglassEmptyRounded sx={{ fontSize: 18 }} /></div>
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 400, color: C.text }}>{pendingCount + underReviewCount}</h3>
            <span style={{ fontSize: 11, color: C.amber }}>Awaiting risk underwriting check</span>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Capital Allocated</span>
              <div style={{ color: C.emerald }}><AccountBalanceWalletRounded sx={{ fontSize: 18 }} /></div>
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 400, color: C.text }}>GH₵ {totalVolume.toLocaleString()}</h3>
            <span style={{ fontSize: 11, color: C.emerald }}>Approved or disbursed loans</span>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Ledger Status</span>
              <div style={{ color: C.purple }}><AssignmentTurnedInRounded sx={{ fontSize: 18 }} /></div>
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 400, color: C.text }}>{disbursedCount} / {approvedCount + disbursedCount}</h3>
            <span style={{ fontSize: 11, color: C.textMuted }}>Disbursed out of total approved</span>
          </div>

        </div>

        {/* Content Section */}
        <div style={{ background: C.surface, borderRadius: 24, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          
          {/* Filters Bar */}
          <div style={{ 
            padding: '20px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center', 
            flexWrap: 'wrap', gap: 16
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[
                { label: 'All Operations', value: 'all' },
                { label: 'Pending Queue', value: 'Pending' },
                { label: 'Under Review', value: 'UnderReview' },
                { label: 'Approved Tiers', value: 'Approved' },
                { label: 'Disbursed Loans', value: 'Disbursed' },
                { label: 'Rejected Vaults', value: 'Rejected' },
              ].map(f => {
                const active = activeFilter === f.value;
                return (
                  <button 
                    key={f.value}
                    onClick={() => setActiveFilter(f.value)}
                    style={{ 
                      background: active ? C.bluePale : 'transparent', 
                      color: active ? C.blueLight : C.textSub,
                      border: active ? `1px solid ${C.blue}30` : '1px solid transparent',
                      borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: '0.15s'
                    }}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
            <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 700 }}>
              Live Telemetry: {applications.length} Records Found
            </span>
          </div>

          {/* Table Area */}
          <div style={{ overflowX: 'auto' }}>
            {appsLoading ? (
              <div style={{ padding: '60px 0', textAlign: 'center' }}>
                <p style={{ color: C.textSub, fontSize: 14 }}>Decrypting underwriting logs...</p>
              </div>
            ) : applications.length === 0 ? (
              <div style={{ padding: '80px 0', textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>📂</div>
                <p style={{ color: C.textSub, fontSize: 14, fontWeight: 600 }}>No applications found in this pipeline.</p>
                <p style={{ color: C.textMuted, fontSize: 12, marginTop: 4 }}>New applications will appear here in real-time.</p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.01)' }}>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Applicant</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Product Details</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Financing Volume</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>KYC Context</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Status</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app: any) => {
                    const applicant = app.userId;
                    const product = app.productId;
                    const institution = product?.institutionId;
                    
                    return (
                      <tr 
                        key={app._id} 
                        style={{ borderBottom: `1px solid ${C.border}`, transition: '0.2s', cursor: 'pointer' }}
                        onClick={() => setSelectedApp(app)}
                      >
                        <td style={{ padding: '20px 24px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
                              {applicant?.firstName} {applicant?.lastName}
                            </span>
                            <span style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>
                              {applicant?.email} • {applicant?.phoneNumber}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: 13, color: C.text }}>{product?.name || 'Resolve Product'}</span>
                            <span style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>
                              {institution?.name || 'Institution Scope'}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>
                              GH₵ {app.amount?.toLocaleString()}
                            </span>
                            <span style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>
                              Tenure: {app.tenureMonths} Months
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                          <span style={{ 
                            fontSize: 10, fontWeight: 800, 
                            background: applicant?.kycStatus === 'Verified' ? C.emeraldPale : C.amberPale,
                            color: applicant?.kycStatus === 'Verified' ? C.emerald : C.amber,
                            padding: '4px 8px', borderRadius: 4
                          }}>
                            KYC: {applicant?.kycStatus || 'Pending'}
                          </span>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: getStatusColor(app.status) }} />
                            <span style={{ fontSize: 13, fontWeight: 700, color: getStatusColor(app.status) }}>
                              {app.status}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                          <button 
                            style={{ 
                              background: 'none', border: 'none', color: C.blueLight, cursor: 'pointer',
                              display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 700
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedApp(app);
                            }}
                          >
                            Underwrite <OpenInNewRounded sx={{ fontSize: 14 }} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      {/* Underwriting Verification Slide Drawer */}
      <Drawer
        anchor="right"
        open={!!selectedApp}
        onClose={() => {
          setSelectedApp(null);
          setRejectionReason('');
        }}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 500,
            background: C.surface,
            borderLeft: `1px solid ${C.border}`,
            boxShadow: '-20px 0 60px rgba(0,0,0,0.7)',
            color: C.text,
            p: 0
          }
        }}
      >
        {selectedApp && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            
            {/* Header */}
            <div style={{ padding: 24, borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 9.5, fontWeight: 900, color: C.blueLight, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Underwriting desk</span>
                <h3 style={{ margin: '4px 0 0', fontSize: 18, color: C.text, fontFamily: F.heading }}>Decision Panel</h3>
              </div>
              <IconButton 
                onClick={() => { setSelectedApp(null); setRejectionReason(''); }}
                sx={{ color: C.textSub, width: 34, height: 34 }}
              >
                <CloseRounded sx={{ fontSize: 18 }} />
              </IconButton>
            </div>

            {/* Body */}
            <div style={{ flex: 1, padding: 32, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
              
              {/* Applicant Card */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
                <p style={{ margin: '0 0 12px', fontSize: 10, fontWeight: 900, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Applicant Details</p>
                <h4 style={{ margin: '0 0 4px', fontSize: 16, color: C.text }}>
                  {selectedApp.userId?.firstName} {selectedApp.userId?.lastName}
                </h4>
                <p style={{ margin: '0 0 16px', fontSize: 12.5, color: C.textSub }}>{selectedApp.userId?.email}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                  <div>
                    <span style={{ fontSize: 10, color: C.textMuted }}>EMPLOYER</span>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: C.textSub }}>{selectedApp.userId?.profile?.employer || 'Not Provided'}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: 10, color: C.textMuted }}>MONTHLY INCOME</span>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: C.emerald }}>GH₵ {selectedApp.userId?.profile?.monthlyIncome?.toLocaleString() || 'Not Provided'}</p>
                  </div>
                </div>
              </div>

              {/* Financing Terms */}
              <div>
                <p style={{ margin: '0 0 16px', fontSize: 10, fontWeight: 900, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Requested Financing Terms</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: 10 }}>
                    <span style={{ fontSize: 13, color: C.textSub }}>Financial Product</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{selectedApp.productId?.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: 10 }}>
                    <span style={{ fontSize: 13, color: C.textSub }}>Partner Provider</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{selectedApp.productId?.institutionId?.name || 'Institution Scope'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: 10 }}>
                    <span style={{ fontSize: 13, color: C.textSub }}>Requested Capital</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.blueLight }}>GH₵ {selectedApp.amount?.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: 10 }}>
                    <span style={{ fontSize: 13, color: C.textSub }}>Requested Tenure</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{selectedApp.tenureMonths} Months</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, color: C.textSub }}>Current State</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: getStatusColor(selectedApp.status) }}>{selectedApp.status}</span>
                  </div>
                </div>
              </div>

              {/* Decisive Actions */}
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24 }}>
                <p style={{ margin: '0 0 16px', fontSize: 10, fontWeight: 900, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Execute Operational Actions</p>
                
                {selectedApp.status === 'Pending' && (
                  <button 
                    onClick={() => handleReview(selectedApp._id, 'UnderReview')}
                    disabled={isReviewing}
                    style={{ 
                      width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: C.purple,
                      color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer', marginBottom: 12
                    }}
                  >
                    Initiate Underwriting Review
                  </button>
                )}

                {(selectedApp.status === 'Pending' || selectedApp.status === 'UnderReview') && (
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button 
                      onClick={() => handleReview(selectedApp._id, 'Approved')}
                      disabled={isReviewing}
                      style={{ 
                        flex: 1, padding: '14px', borderRadius: 12, border: 'none', background: C.emerald,
                        color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer'
                      }}
                    >
                      Approve Application
                    </button>
                    
                    <button 
                      onClick={() => {
                        const reason = prompt('Please enter rejection reason:');
                        if (reason) {
                          setRejectionReason(reason);
                          handleReview(selectedApp._id, 'Rejected');
                        }
                      }}
                      disabled={isReviewing}
                      style={{ 
                        flex: 1, padding: '14px', borderRadius: 12, border: `1.5px solid ${C.red}`, background: 'transparent',
                        color: C.red, fontWeight: 800, fontSize: 13, cursor: 'pointer'
                      }}
                    >
                      Reject Application
                    </button>
                  </div>
                )}

                {selectedApp.status === 'Approved' && (
                  <button 
                    onClick={() => handleReview(selectedApp._id, 'Disbursed')}
                    disabled={isReviewing}
                    style={{ 
                      width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: C.blue,
                      color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                    }}
                  >
                    <ShieldRounded sx={{ fontSize: 16 }} /> Disburse Capital & Log Ledger
                  </button>
                )}

                {selectedApp.status === 'Disbursed' && (
                  <button 
                    onClick={() => handleReview(selectedApp._id, 'Completed')}
                    disabled={isReviewing}
                    style={{ 
                      width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: C.emerald,
                      color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer'
                    }}
                  >
                    Mark as Completed / Settled
                  </button>
                )}

                {(selectedApp.status === 'Completed' || selectedApp.status === 'Rejected' || selectedApp.status === 'Cancelled') && (
                  <div style={{ textAlign: 'center', padding: '16px 0', border: `1.5px dashed ${C.borderStrong}`, borderRadius: 12 }}>
                    <p style={{ margin: 0, fontSize: 13, color: C.textSub }}>This application is closed ({selectedApp.status}).</p>
                    <p style={{ margin: '4px 0 0', fontSize: 11, color: C.textMuted }}>No further actions are permitted on this lifecycle.</p>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}
      </Drawer>

    </AdminShell>
  );
}
