'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Drawer, IconButton, Button } from '@mui/material';
import AdminShell, { C, F } from '../components/AdminShell';
import { 
  useAdminGetPendingDocumentsQuery, 
  useAdminVerifyDocumentMutation 
} from '@/lib/redux/api/documentApi';
import { 
  CloseRounded, 
  CheckCircleRounded, 
  CancelRounded,
  FolderOpenRounded,
  BadgeRounded,
  CalendarMonthRounded,
  ShieldMoonRounded
} from '@mui/icons-material';

export default function AdminKycPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  const { data: docResponse, isLoading: docLoading, isFetching: docFetching, refetch } = useAdminGetPendingDocumentsQuery();
  const [verifyDocument, { isLoading: isMutating }] = useAdminVerifyDocumentMutation();

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return null;

  const documents = docResponse?.data || [];

  // Filter counters
  const totalCount = documents.length;
  const pendingCount = documents.filter((d: any) => !d.isVerified).length;
  const verifiedCount = documents.filter((d: any) => d.isVerified).length;

  const handleVerify = async (docId: string, isVerified: boolean) => {
    try {
      const res = await verifyDocument({ id: docId, isVerified }).unwrap();
      if (res.success) {
        toast.success(
          isVerified 
            ? 'Document approved! Customer KYC tier elevated.' 
            : 'Document rejected. Customer status marked as Pending.'
        );
        setSelectedDoc(null);
        refetch();
      } else {
        toast.error(res.message || 'Verification update failed');
      }
    } catch (err: any) {
      toast.error(err.data?.message || 'Error executing document verification');
    }
  };

  return (
    <AdminShell>
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        
        {/* Title Context */}
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
              KYC & Document Vault Desk
            </h1>
            <p style={{ margin: '8px 0 0', fontSize: 13, color: C.textSub }}>
              Process identity verifications, payslips, and compliance checks securely.
            </p>
          </div>
          <button 
            onClick={() => refetch()}
            disabled={docFetching}
            style={{ 
              background: C.surface, color: C.blueLight, border: `1px solid ${C.border}`, borderRadius: 10,
              padding: '10px 18px', fontSize: 12.5, fontWeight: 700, cursor: docFetching ? 'not-allowed' : 'pointer', transition: '0.2s',
              width: isMobile ? '100%' : 'auto', textAlign: 'center'
            }}
          >
            {docFetching ? 'Refreshing...' : 'Refresh Vault'}
          </button>
        </div>

        {/* Dynamic Counters */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 40 }}>
          
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Document Logs</span>
              <div style={{ color: C.blueLight }}><FolderOpenRounded sx={{ fontSize: 18 }} /></div>
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 400, color: C.text }}>{totalCount}</h3>
            <span style={{ fontSize: 11, color: C.textMuted }}>Total uploads securely decrypted</span>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Awaiting Review</span>
              <div style={{ color: C.amber }}><BadgeRounded sx={{ fontSize: 18 }} /></div>
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 400, color: C.text }}>{pendingCount}</h3>
            <span style={{ fontSize: 11, color: C.amber }}>Requires administrative review</span>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Verified Credentials</span>
              <div style={{ color: C.emerald }}><CheckCircleRounded sx={{ fontSize: 18 }} /></div>
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 400, color: C.text }}>{verifiedCount}</h3>
            <span style={{ fontSize: 11, color: C.emerald }}>Successfully verified identity tokens</span>
          </div>

        </div>

        {/* Documents Ledger */}
        <div style={{ background: C.surface, borderRadius: 24, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          
          <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: C.text }}>Verification Queue</span>
            <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 700 }}>IMMUTABLE DOCUMENTS REGISTER</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            {docLoading ? (
              <div style={{ padding: '60px 0', textAlign: 'center' }}>
                <p style={{ color: C.textSub, fontSize: 14 }}>Decrypting secure vaults...</p>
              </div>
            ) : documents.length === 0 ? (
              <div style={{ padding: '80px 0', textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🛡️</div>
                <p style={{ color: C.textSub, fontSize: 14, fontWeight: 600 }}>Compliance queue is clear.</p>
                <p style={{ color: C.textMuted, fontSize: 12, marginTop: 4 }}>No documents are currently submitted.</p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.01)' }}>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Customer</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Document Identity</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Identification Code</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Upload History</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Status</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc: any) => {
                    const customer = doc.userId;
                    
                    return (
                      <tr 
                        key={doc._id} 
                        style={{ borderBottom: `1px solid ${C.border}`, transition: '0.2s', cursor: 'pointer' }}
                        onClick={() => setSelectedDoc(doc)}
                      >
                        <td style={{ padding: '20px 24px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
                              {customer?.firstName} {customer?.lastName}
                            </span>
                            <span style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>
                              {customer?.email}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
                            {doc.type}
                          </span>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                          <span style={{ fontSize: 13, fontFamily: 'monospace', color: C.blueLight }}>
                            {doc.documentNumber || 'N/A'}
                          </span>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: 12.5, color: C.textSub }}>
                              Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                            </span>
                            <span style={{ fontSize: 10.5, color: C.textMuted, marginTop: 3 }}>
                              Expiry: {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : 'No Limit'}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                          <span style={{ 
                            fontSize: 10.5, fontWeight: 800, 
                            background: doc.isVerified ? C.emeraldPale : C.amberPale,
                            color: doc.isVerified ? C.emerald : C.amber,
                            padding: '4px 8px', borderRadius: 4
                          }}>
                            {doc.isVerified ? 'Verified' : 'Pending Review'}
                          </span>
                        </td>
                        <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                          <button 
                            style={{ 
                              background: 'none', border: 'none', color: C.blueLight, cursor: 'pointer',
                              fontSize: 12.5, fontWeight: 700
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDoc(doc);
                            }}
                          >
                            Underwrite Document
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

      {/* KYC Verification Drawer */}
      <Drawer
        anchor="right"
        open={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 480,
            background: C.surface,
            borderLeft: `1px solid ${C.border}`,
            boxShadow: '-20px 0 60px rgba(0,0,0,0.7)',
            color: C.text,
            p: 0
          }
        }}
      >
        {selectedDoc && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            
            {/* Header */}
            <div style={{ padding: 24, borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 9.5, fontWeight: 900, color: C.blueLight, letterSpacing: '0.06em', textTransform: 'uppercase' }}>COMPLIANCE DESK</span>
                <h3 style={{ margin: '4px 0 0', fontSize: 18, color: C.text, fontFamily: F.heading }}>KYC Verification</h3>
              </div>
              <IconButton 
                onClick={() => setSelectedDoc(null)}
                sx={{ color: C.textSub, width: 34, height: 34 }}
              >
                <CloseRounded sx={{ fontSize: 18 }} />
              </IconButton>
            </div>

            {/* Body */}
            <div style={{ flex: 1, padding: 32, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
              
              {/* Profile Card */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
                <p style={{ margin: '0 0 12px', fontSize: 10, fontWeight: 900, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Customer Profile</p>
                <h4 style={{ margin: '0 0 4px', fontSize: 16, color: C.text }}>
                  {selectedDoc.userId?.firstName} {selectedDoc.userId?.lastName}
                </h4>
                <p style={{ margin: '0 0 16px', fontSize: 12.5, color: C.textSub }}>{selectedDoc.userId?.email}</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: C.textMuted }}>PHONE NUMBER</span>
                    <span style={{ fontSize: 12, color: C.textSub }}>{selectedDoc.userId?.phoneNumber}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: C.textMuted }}>CURRENT KYC LEVEL</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: selectedDoc.userId?.kycStatus === 'Verified' ? C.emerald : C.amber }}>
                      {selectedDoc.userId?.kycStatus || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Document Overview */}
              <div>
                <p style={{ margin: '0 0 16px', fontSize: 10, fontWeight: 900, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Document Specifics</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: 10 }}>
                    <span style={{ fontSize: 13, color: C.textSub }}>Credential Type</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{selectedDoc.type}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: 10 }}>
                    <span style={{ fontSize: 13, color: C.textSub }}>ID / Serial Code</span>
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: C.blueLight }}>{selectedDoc.documentNumber || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: 10 }}>
                    <span style={{ fontSize: 13, color: C.textSub }}>Uploaded Date</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{new Date(selectedDoc.uploadedAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, color: C.textSub }}>Expiry Limitation</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{selectedDoc.expiryDate ? new Date(selectedDoc.expiryDate).toLocaleDateString() : 'None'}</span>
                  </div>
                </div>
              </div>

              {/* Document Preview Display */}
              <div>
                <p style={{ margin: '0 0 12px', fontSize: 10, fontWeight: 900, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Vault Preview</p>
                <div style={{ 
                  height: 180, background: 'rgba(255,255,255,0.02)', border: `1px dashed ${C.borderStrong}`, 
                  borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 
                }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
                  <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: C.textSub }}>Secure Ghana Card Image</p>
                  <a 
                    href={selectedDoc.documentUrl} target="_blank" rel="noreferrer"
                    style={{ fontSize: 11, color: C.blueLight, marginTop: 8, textDecoration: 'none', fontWeight: 600 }}
                  >
                    Open Decrypted Attachment ↗
                  </a>
                </div>
              </div>

              {/* Action Decision */}
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24 }}>
                <p style={{ margin: '0 0 16px', fontSize: 10, fontWeight: 900, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Execute Operations</p>
                
                {!selectedDoc.isVerified ? (
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button 
                      onClick={() => handleVerify(selectedDoc._id, true)}
                      disabled={isMutating}
                      style={{ 
                        flex: 1, padding: '14px', borderRadius: 12, border: 'none', background: C.emerald,
                        color: '#fff', fontWeight: 800, fontSize: 13, cursor: isMutating ? 'not-allowed' : 'pointer',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8
                      }}
                    >
                      <CheckCircleRounded sx={{ fontSize: 16 }} /> {isMutating ? 'Approving...' : 'Approve KYC'}
                    </button>
                    
                    <button 
                      onClick={() => handleVerify(selectedDoc._id, false)}
                      disabled={isMutating}
                      style={{ 
                        flex: 1, padding: '14px', borderRadius: 12, border: `1.5px solid ${C.red}`, background: 'transparent',
                        color: C.red, fontWeight: 800, fontSize: 13, cursor: isMutating ? 'not-allowed' : 'pointer',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8
                      }}
                    >
                      <CancelRounded sx={{ fontSize: 16 }} /> {isMutating ? 'Rejecting...' : 'Reject'}
                    </button>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '16px', border: `1.5px dashed ${C.border}`, borderRadius: 12, background: 'rgba(16,185,129,0.02)' }}>
                    <p style={{ margin: 0, fontSize: 13, color: C.emerald, fontWeight: 700 }}>✓ Verified Compliance Document</p>
                    <p style={{ margin: '4px 0 0', fontSize: 11, color: C.textMuted }}>Identity credentials have been cryptographically sealed.</p>
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
