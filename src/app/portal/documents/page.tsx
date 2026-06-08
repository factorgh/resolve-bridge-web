'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PortalShell, { C, F } from '../components/PortalShell';
import { 
  CloudUploadRounded, 
  ShieldRounded, 
  VerifiedUserRounded, 
  MoreVertRounded,
  FolderSpecialRounded,
  InsertDriveFileRounded,
  CloseRounded,
  FolderOpenRounded,
  DeleteOutlineRounded,
  WarningRounded,
  CheckCircleOutlineRounded,
  LockRounded,
  ArrowForwardRounded
} from '@mui/icons-material';
import { useGetDocumentsQuery, useUploadDocumentMutation, useUploadFileRawMutation, useDeleteDocumentMutation } from '@/lib/redux/api/documentApi';
import { useGetApplicationsQuery } from '@/lib/redux/api/applicationApi';
import EmptyState from '../components/EmptyState';

/* ─── Types & Constants ────────────────────────────────────────────────────── */

const DOC_CATEGORIES = [
  { id: 'identity', label: 'Identity & KYC', icon: <VerifiedUserRounded />, desc: 'National ID, Passport, Driver License' },
  { id: 'finance', label: 'Financial Proofs', icon: <InsertDriveFileRounded />, desc: 'Bank Statements, Pay Stubs, Tax Returns' },
  { id: 'assets', label: 'Asset Ownership', icon: <FolderSpecialRounded />, desc: 'Vehicle Title, Property Deed, Stock Portfolio' },
];

/* ─── Main Component ────────────────────────────────────────────────────── */

export default function DocumentsPage() {
  const { data: apiData, isLoading } = useGetDocumentsQuery();
  const { data: appData, isLoading: appsLoading } = useGetApplicationsQuery();
  const [uploadDocument, { isLoading: isUploading }] = useUploadDocumentMutation();
  const [uploadFileRaw, { isLoading: isUploadingFile }] = useUploadFileRawMutation();
  const [deleteDocument, { isLoading: isDeleting }] = useDeleteDocumentMutation();
  
  const [activeCat, setActiveCat] = useState('all');
  const [isMobile, setIsMobile] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadData, setUploadData] = useState({ name: '', cat: 'identity' });
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Menu & Deletion Popups
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [deleteConfirmDoc, setDeleteConfirmDoc] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const docs = apiData?.success ? apiData.data : [];
  const applications = appData?.success ? appData.data : [];

  // Derive handshakes from live applications
  const handshakes = applications.slice(0, 3).map((app: any) => ({
    label: app.product,
    status: (app.status === 'Approved' || app.status === 'Disbursed' || app.status === 'Completed')
      ? 'Active Sync'
      : (app.status === 'Pending' || app.status === 'UnderReview')
        ? 'In Review'
        : app.status === 'PaymentPending'
          ? 'Payment Pending'
          : 'Live Bridge',
    color: (app.status === 'Approved' || app.status === 'Disbursed' || app.status === 'Completed')
      ? C.emerald
      : (app.status === 'Pending' || app.status === 'UnderReview')
        ? C.amber
        : app.status === 'PaymentPending'
          ? C.blue
          : C.textSub
  }));

  // Add default if none
  if (handshakes.length === 0 && !appsLoading) {
    handshakes.push({ label: 'Credit Registry', status: 'Ready to Sync', color: C.textSub });
  }

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filtered = docs.filter((d: any) => {
    if (activeCat === 'all') return true;
    return d.type?.toLowerCase() === activeCat || d.cat === activeCat;
  });

  // Calculate completion / trust score progress
  const hasIdentity = docs.some((d: any) => d.type?.toLowerCase() === 'identity' || d.name?.toLowerCase().includes('identity') || d.name?.toLowerCase().includes('card') || d.name?.toLowerCase().includes('passport'));
  const hasFinance = docs.some((d: any) => d.type?.toLowerCase() === 'finance' || d.name?.toLowerCase().includes('statement') || d.name?.toLowerCase().includes('bill'));
  const hasAssets = docs.some((d: any) => d.type?.toLowerCase() === 'assets' || d.name?.toLowerCase().includes('title') || d.name?.toLowerCase().includes('deed'));
  
  let completionPercentage = 0;
  if (hasIdentity) completionPercentage += 40;
  if (hasFinance) completionPercentage += 40;
  if (hasAssets) completionPercentage += 20;

  const handleCloseModal = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
    setUploadData({ name: '', cat: 'identity' });
    setUploadError(null);
  };

  const handleFileChange = (file: File) => {
    setUploadError(null);
    
    // File validations
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Unsupported file type. Please upload a PDF, PNG, or JPG.');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB
      setUploadError('File exceeds the 10MB size limit.');
      return;
    }

    setSelectedFile(file);
    if (!uploadData.name) {
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      setUploadData(prev => ({ ...prev, name: baseName }));
    }
  };

  const handleActualUpload = async () => {
    if (!uploadData.name || !selectedFile) return;
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // 1. Upload raw file to backend -> R2
      const uploadRes = await uploadFileRaw(formData).unwrap();
      
      if (!uploadRes.success || !uploadRes.data?.url) {
        throw new Error(uploadRes.message || 'File upload to storage failed');
      }

      const fileUrl = uploadRes.data.url;

      // 2. Register document metadata
      await uploadDocument({
        type: uploadData.name,
        documentUrl: fileUrl,
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)) // Mock expiry 5 years out
      }).unwrap();
      
      handleCloseModal();
    } catch (err: any) {
      console.error('Upload failed:', err);
      setUploadError(err.data?.message || err.error || err.message || 'Failed to upload document. Please try again.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmDoc) return;
    setDeletingId(deleteConfirmDoc.id);
    try {
      await deleteDocument(deleteConfirmDoc.id).unwrap();
      setDeleteConfirmDoc(null);
    } catch (err: any) {
      console.error("Failed to delete document:", err);
      alert(err.data?.message || err.error || err.message || "Failed to delete document.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <PortalShell title="Secure Vault" subtitle="Institutional-grade encrypted storage for your financial credentials.">
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: isMobile ? '0 16px 100px' : '0 24px 100px' }}>
        
        {/* Modern Header Navigation Hub with Glassmorphism */}
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'stretch' : 'center',
          marginBottom: 40,
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(20px)',
          padding: '10px',
          borderRadius: 28,
          border: `1px solid ${C.border}`,
          boxShadow: '0 8px 32px rgba(13,27,62,0.03)',
          gap: isMobile ? 12 : 0
        }}>
          <div style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: isMobile ? 4 : 0 }}>
            {[
              { id: 'all', label: 'All Files' },
              ...DOC_CATEGORIES
            ].map(t => (
              <button 
                key={t.id}
                onClick={() => setActiveCat(t.id)}
                style={{ 
                  padding: '12px 20px', 
                  borderRadius: 18, 
                  border: 'none', 
                  background: activeCat === t.id ? C.sidebar : 'transparent', 
                  color: activeCat === t.id ? '#fff' : C.textSub,
                  fontSize: 13, 
                  fontWeight: 800, 
                  cursor: 'pointer', 
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontFamily: F.heading,
                  whiteSpace: 'nowrap',
                  boxShadow: activeCat === t.id ? '0 4px 12px rgba(11,22,48,0.15)' : 'none'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setShowUploadModal(true)}
            style={{ 
              background: `linear-gradient(135deg, ${C.blue}, ${C.blueLight})`, 
              color: '#fff', 
              border: 'none', 
              borderRadius: 20, 
              padding: '14px 28px', 
              fontSize: 13, 
              fontWeight: 800, 
              cursor: 'pointer',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: 10, 
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: `0 8px 24px ${C.blue}30`,
              fontFamily: F.heading
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <CloudUploadRounded sx={{ fontSize: 18 }} />
            <span>Upload New Credentials</span>
          </button>
        </div>

        {/* Security Assurance Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            background: `linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)`, 
            padding: '24px', 
            borderRadius: 24, 
            border: `1px solid ${C.border}`, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 20, 
            marginBottom: 40,
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
          }}
        >
           <div style={{ 
             width: 48, 
             height: 48, 
             borderRadius: 16, 
             background: `${C.emerald}10`, 
             color: C.emerald, 
             display: 'flex', 
             alignItems: 'center', 
             justifyContent: 'center',
             flexShrink: 0
           }}>
              <LockRounded sx={{ fontSize: 24 }} />
           </div>
           <div>
              <p style={{ margin: '0 0 4px', fontSize: 14, color: C.text, fontWeight: 800, fontFamily: F.heading }}>AES 256 Cryptographic Vault Active</p>
              <p style={{ margin: 0, fontSize: 12, color: C.textSub, lineHeight: 1.5 }}>Your documents are encrypted prior to sync. Neither third-party agencies nor staff members can inspect files without verified explicit permission handshake keys.</p>
           </div>
        </motion.div>

        {/* Documents Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 340px', gap: 32, alignItems: 'start' }}>
           
           {/* Document List */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <AnimatePresence mode="popLayout">
                 {filtered.length > 0 ? filtered.map((doc: any, idx: number) => (
                    <motion.div 
                      key={doc.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
                      style={{ 
                        background: '#fff', 
                        borderRadius: 24, 
                        border: `1px solid ${C.border}`, 
                        padding: '24px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 20, 
                        position: 'relative',
                        boxShadow: '0 4px 20px rgba(13,27,62,0.01)',
                        opacity: deletingId === doc.id ? 0.6 : 1
                      }}
                    >
                      {/* Document Type Icon Container */}
                      <div style={{ 
                        width: 56, 
                        height: 56, 
                        borderRadius: 18, 
                        background: doc.type?.toLowerCase() === 'finance' ? `${C.blue}08` :
                                    doc.type?.toLowerCase() === 'assets' ? `${C.purple}08` : `${C.emerald}08`,
                        color: doc.type?.toLowerCase() === 'finance' ? C.blue :
                               doc.type?.toLowerCase() === 'assets' ? C.purple : C.emerald,
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                         {DOC_CATEGORIES.find(c => c.id === doc.type?.toLowerCase())?.icon || <InsertDriveFileRounded />}
                      </div>

                      {/* File Details */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <p style={{ 
                              margin: 0, 
                              fontSize: 15, 
                              fontWeight: 800, 
                              color: C.text, 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              whiteSpace: 'nowrap',
                              fontFamily: F.heading 
                            }}>{doc.name}</p>
                            <span style={{ 
                              fontSize: 10, 
                              fontWeight: 800, 
                              textTransform: 'uppercase', 
                              color: doc.type?.toLowerCase() === 'finance' ? C.blue :
                                     doc.type?.toLowerCase() === 'assets' ? C.purple : C.emerald, 
                              background: doc.type?.toLowerCase() === 'finance' ? `${C.blue}08` :
                                          doc.type?.toLowerCase() === 'assets' ? `${C.purple}08` : `${C.emerald}08`, 
                              padding: '2px 8px', 
                              borderRadius: 6,
                              fontFamily: F.heading
                            }}>
                              {doc.type}
                            </span>
                         </div>
                         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', fontSize: 11, color: C.textMuted, fontWeight: 700 }}>
                            <span>Uploaded {doc.uploaded}</span>
                            <span>•</span>
                            <span>Expiry: {doc.expiry}</span>
                            <span>•</span>
                            <span>{doc.size}</span>
                         </div>
                      </div>

                      {/* Right Hand Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                         {/* Status Indicator */}
                         <div style={{ 
                           padding: '6px 14px', 
                           borderRadius: 12, 
                           fontSize: 11, 
                           fontWeight: 800,
                           display: 'flex',
                           alignItems: 'center',
                           gap: 6,
                           background: doc.status === 'Verified' ? `${C.emerald}08` : doc.status === 'Expired' ? `${C.red}08` : `${C.blue}08`,
                           color: doc.status === 'Verified' ? C.emerald : doc.status === 'Expired' ? C.red : C.blue,
                           fontFamily: F.heading
                         }}>
                            {doc.status === 'Verified' ? (
                              <CheckCircleOutlineRounded sx={{ fontSize: 14 }} />
                            ) : doc.status === 'Expired' ? (
                              <WarningRounded sx={{ fontSize: 14 }} />
                            ) : (
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.blue, display: 'inline-block' }} />
                            )}
                            {doc.status}
                         </div>

                         {/* Action Menu Trigger */}
                         <div style={{ position: 'relative' }}>
                            <button 
                              disabled={deletingId === doc.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(activeMenuId === doc.id ? null : doc.id);
                              }}
                              style={{ 
                                background: activeMenuId === doc.id ? 'rgba(0,0,0,0.03)' : 'none', 
                                border: 'none', 
                                color: C.textSub, 
                                cursor: 'pointer', 
                                padding: 8,
                                borderRadius: 10,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                              }}
                            >
                              <MoreVertRounded />
                            </button>
                            
                            <AnimatePresence>
                              {activeMenuId === doc.id && (
                                <>
                                  <div 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveMenuId(null);
                                    }}
                                    style={{ position: 'fixed', inset: 0, zIndex: 10 }}
                                  />
                                  <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    style={{
                                      position: 'absolute',
                                      right: 0,
                                      top: '100%',
                                      background: '#fff',
                                      borderRadius: 16,
                                      border: `1px solid ${C.border}`,
                                      boxShadow: '0 12px 30px rgba(13,27,62,0.12)',
                                      padding: 8,
                                      zIndex: 20,
                                      minWidth: 150
                                    }}
                                  >
                                    {/* Action items inside popup */}
                                    <button
                                      onClick={() => {
                                        if (doc.url) {
                                          window.open(doc.url, '_blank');
                                        }
                                        setActiveMenuId(null);
                                      }}
                                      style={{
                                        width: '100%',
                                        padding: '10px 14px',
                                        borderRadius: 10,
                                        border: 'none',
                                        background: 'transparent',
                                        color: C.textSub,
                                        fontSize: 12.5,
                                        fontWeight: 700,
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        transition: 'background 0.2s',
                                        fontFamily: F.heading
                                      }}
                                      onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                      <FolderOpenRounded sx={{ fontSize: 16 }} />
                                      View Document
                                    </button>
                                    
                                    <div style={{ height: 1, background: C.border, margin: '6px 0' }} />

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteConfirmDoc(doc);
                                        setActiveMenuId(null);
                                      }}
                                      style={{
                                        width: '100%',
                                        padding: '10px 14px',
                                        borderRadius: 10,
                                        border: 'none',
                                        background: 'transparent',
                                        color: C.red,
                                        fontSize: 12.5,
                                        fontWeight: 700,
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        transition: 'background 0.2s',
                                        fontFamily: F.heading
                                      }}
                                      onMouseEnter={(e) => e.currentTarget.style.background = C.redPale}
                                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                      <DeleteOutlineRounded sx={{ fontSize: 16 }} />
                                      Delete File
                                    </button>
                                  </motion.div>
                                </>
                              )}
                            </AnimatePresence>
                         </div>
                      </div>
                    </motion.div>
                 )) : !isLoading && (
                    <EmptyState 
                       title="Vault is Empty" 
                       description="You haven't uploaded any documents yet. Start by uploading your ID or financial statements to increase your trust score."
                       icon={<FolderOpenRounded sx={{ fontSize: 48, opacity: 0.2 }} />}
                       actionLabel="Upload First Document"
                       onAction={() => setShowUploadModal(true)}
                    />
                 )}
              </AnimatePresence>
           </div>

           {/* Stats Sidebar */}
           {!isMobile && (
             <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Vault Integrity Score */}
                <div style={{ 
                  background: C.sidebar, 
                  borderRadius: 32, 
                  padding: 32, 
                  color: '#fff',
                  position: 'relative', 
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(11,22,48,0.2)'
                }}>
                   <div style={{ position: 'absolute', top: -35, right: -35, width: 150, height: 150, background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />
                   <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                      <VerifiedUserRounded sx={{ fontSize: 18, color: C.emerald }} />
                      <span style={{ fontSize: 12, fontWeight: 800, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: F.heading }}>Trust Index</span>
                   </div>
                   <h2 style={{ margin: '0 0 8px', fontSize: 44, fontWeight: 900, fontFamily: F.heading, letterSpacing: '-0.02em' }}>{completionPercentage}%</h2>
                   <p style={{ margin: '0 0 24px', fontSize: 13, opacity: 0.7, lineHeight: 1.6 }}>
                     {completionPercentage === 100 
                       ? "Congratulations! Your credentials vault is fully complete and compliant."
                       : "Complete remaining document modules to reach 100% eligibility for premium bank products."}
                   </p>
                   
                   {/* Progress Tracker bar */}
                   <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, marginBottom: 20 }}>
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${completionPercentage}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        style={{ height: '100%', background: C.emerald, borderRadius: 3 }} 
                      />
                   </div>
                   
                   {/* Verification items Checklist */}
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12, opacity: 0.9 }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: hasIdentity ? '#fff' : 'rgba(255,255,255,0.45)' }}>
                       <span style={{ width: 6, height: 6, borderRadius: '50%', background: hasIdentity ? C.emerald : 'rgba(255,255,255,0.25)' }} />
                       <span>Identity Proof (Ghana Card / Passport)</span>
                     </div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: hasFinance ? '#fff' : 'rgba(255,255,255,0.45)' }}>
                       <span style={{ width: 6, height: 6, borderRadius: '50%', background: hasFinance ? C.emerald : 'rgba(255,255,255,0.25)' }} />
                       <span>Financial Statement (Utility / Bank Statement)</span>
                     </div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: hasAssets ? '#fff' : 'rgba(255,255,255,0.45)' }}>
                       <span style={{ width: 6, height: 6, borderRadius: '50%', background: hasAssets ? C.emerald : 'rgba(255,255,255,0.25)' }} />
                       <span>Assets Registration (Optional Portfolio)</span>
                     </div>
                   </div>
                </div>

                {/* Connected Handshakes */}
                <div style={{ background: '#fff', borderRadius: 32, border: `1px solid ${C.border}`, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
                   <h3 style={{ margin: '0 0 24px', fontSize: 16, fontWeight: 800, fontFamily: F.heading, color: C.text }}>Connected Handshakes</h3>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      {handshakes.map((bridge: any, index: number) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <div>
                              <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: C.text, fontFamily: F.heading }}>{bridge.label}</p>
                              <p style={{ margin: 0, fontSize: 11, color: bridge.color, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
                                {bridge.status === 'Active Sync' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.emerald, display: 'inline-block', boxShadow: `0 0 8px ${C.emerald}` }} />}
                                {bridge.status}
                              </p>
                           </div>
                           <div style={{ width: 8, height: 8, borderRadius: '50%', background: bridge.color }} />
                        </div>
                      ))}
                   </div>
                </div>
             </div>
           )}
        </div>

        {/* Custom Deletion Confirmation Modal Overlay */}
        <AnimatePresence>
           {deleteConfirmDoc && (
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               style={{ 
                 position: 'fixed', 
                 inset: 0, 
                 zIndex: 2000, 
                 display: 'flex', 
                 alignItems: 'center', 
                 justifyContent: 'center', 
                 padding: 20 
               }}
             >
                {/* Backdrop Blur */}
                <div 
                  onClick={() => !deletingId && setDeleteConfirmDoc(null)} 
                  style={{ position: 'absolute', inset: 0, background: 'rgba(10,30,43,0.7)', backdropFilter: 'blur(16px)' }} 
                />
                
                {/* Dialog Content */}
                <motion.div 
                  initial={{ y: 30, opacity: 0, scale: 0.95 }} 
                  animate={{ y: 0, opacity: 1, scale: 1 }} 
                  exit={{ y: 30, opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  style={{ 
                    position: 'relative', 
                    width: '100%', 
                    maxWidth: 440, 
                    background: '#fff', 
                    borderRadius: 28, 
                    padding: 36, 
                    boxShadow: '0 30px 80px rgba(13,27,62,0.25)',
                    border: '1px solid rgba(239,68,68,0.1)'
                  }}
                >
                   <div style={{ textAlign: 'center', marginBottom: 24 }}>
                      <div style={{ 
                        width: 56, 
                        height: 56, 
                        borderRadius: '50%', 
                        background: C.redPale, 
                        color: C.red, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                        boxShadow: '0 8px 20px rgba(239,68,68,0.1)'
                      }}>
                         <WarningRounded sx={{ fontSize: 28 }} />
                      </div>
                      <h3 style={{ margin: '0 0 8px', fontSize: 19, fontWeight: 900, fontFamily: F.heading, color: C.text }}>Confirm Document Deletion</h3>
                      <p style={{ margin: 0, fontSize: 13, color: C.textSub, lineHeight: 1.5 }}>
                        Are you sure you want to permanently delete <strong>"{deleteConfirmDoc.name}"</strong>?
                      </p>
                   </div>
                   
                   {/* Compliance Warning banner */}
                   <div style={{ 
                     background: '#fffbeb', 
                     border: '1px solid #fef3c7', 
                     borderRadius: 16, 
                     padding: '12px 16px', 
                     marginBottom: 28,
                     display: 'flex',
                     gap: 10,
                     alignItems: 'flex-start'
                   }}>
                      <ShieldRounded sx={{ color: '#d97706', fontSize: 16, mt: '2px' }} />
                      <span style={{ fontSize: 11.5, color: '#b45309', fontWeight: 600, lineHeight: 1.4 }}>
                        Deleting this file will purge it from Cloudflare R2 and reset your Underwriting compliance status back to <strong>Pending</strong>.
                      </span>
                   </div>

                   <div style={{ display: 'flex', gap: 12 }}>
                      <button 
                        disabled={!!deletingId}
                        onClick={() => setDeleteConfirmDoc(null)}
                        style={{ 
                          flex: 1,
                          padding: '14px', 
                          borderRadius: 16, 
                          border: `1.5px solid ${C.border}`,
                          background: '#fff', 
                          color: C.textSub, 
                          fontSize: 13, 
                          fontWeight: 800, 
                          cursor: 'pointer', 
                          transition: '0.2s',
                          fontFamily: F.heading
                        }}
                      >
                         Cancel
                      </button>
                      <button 
                        disabled={!!deletingId}
                        onClick={handleConfirmDelete}
                        style={{ 
                          flex: 1.5,
                          padding: '14px', 
                          borderRadius: 16, 
                          border: 'none', 
                          background: C.red, 
                          color: '#fff', 
                          fontSize: 13, 
                          fontWeight: 800, 
                          cursor: !!deletingId ? 'not-allowed' : 'pointer', 
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          boxShadow: `0 8px 20px ${C.red}25`,
                          fontFamily: F.heading
                        }}
                        onMouseEnter={e => { if(!deletingId) e.currentTarget.style.background = '#dc2626'; }}
                        onMouseLeave={e => { if(!deletingId) e.currentTarget.style.background = C.red; }}
                      >
                         {deletingId ? (
                           <>
                             <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: 14, height: 14, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                             <span>Deleting...</span>
                           </>
                         ) : (
                           <span>Permanently Delete</span>
                         )}
                      </button>
                   </div>
                </motion.div>
             </motion.div>
           )}
        </AnimatePresence>

        {/* Upload Modal Overlay */}
        <AnimatePresence>
           {showUploadModal && (
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
             >
                <div onClick={handleCloseModal} style={{ position: 'absolute', inset: 0, background: 'rgba(10,30,43,0.8)', backdropFilter: 'blur(16px)' }} />
                <motion.div 
                  initial={{ y: 50, opacity: 0, scale: 0.95 }} 
                  animate={{ y: 0, opacity: 1, scale: 1 }} 
                  exit={{ y: 50, opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  style={{ 
                    position: 'relative', 
                    width: '100%', 
                    maxWidth: 500, 
                    background: '#fff', 
                    borderRadius: 32, 
                    padding: 40, 
                    boxShadow: '0 40px 100px rgba(13,27,62,0.2)'
                  }}
                >
                   {/* Modal Header */}
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: 22, fontWeight: 900, fontFamily: F.heading, color: C.text }}>Vault Upload Node</h3>
                        <p style={{ margin: '4px 0 0', fontSize: 12, color: C.textMuted }}>Securely upload documents for compliance verification.</p>
                      </div>
                      <button onClick={handleCloseModal} style={{ width: 40, height: 40, borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}>
                         <CloseRounded />
                      </button>
                   </div>

                   {/* Hidden File Input */}
                   <input 
                     type="file"
                     ref={fileInputRef}
                     onChange={(e) => {
                       const file = e.target.files?.[0];
                       if (file) handleFileChange(file);
                     }}
                     style={{ display: 'none' }}
                     accept=".pdf,.png,.jpg,.jpeg"
                   />

                   {/* Drag & Drop Upload Zone */}
                   <div 
                     onClick={() => !isUploading && !isUploadingFile && fileInputRef.current?.click()}
                     onDragOver={(e) => {
                       e.preventDefault();
                       e.stopPropagation();
                       setIsDragOver(true);
                     }}
                     onDragLeave={() => setIsDragOver(false)}
                     onDrop={(e) => {
                       e.preventDefault();
                       e.stopPropagation();
                       setIsDragOver(false);
                       if (isUploading || isUploadingFile) return;
                       const file = e.dataTransfer.files?.[0];
                       if (file) handleFileChange(file);
                     }}
                     style={{ 
                       border: selectedFile ? `2px solid ${C.blue}` : isDragOver ? `2px dashed ${C.blue}` : `2px dashed ${C.border}`, 
                       borderRadius: 24, 
                       padding: '36px 20px', 
                       textAlign: 'center', 
                       background: selectedFile ? `${C.blue}03` : isDragOver ? '#f0f4ff' : '#f8fafc', 
                       marginBottom: 24, 
                       cursor: (isUploading || isUploadingFile) ? 'not-allowed' : 'pointer',
                       transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                     }}
                   >
                      <CloudUploadRounded sx={{ 
                        fontSize: 48, 
                        color: selectedFile ? C.blue : isDragOver ? C.blue : C.textMuted, 
                        opacity: selectedFile ? 1 : 0.6, 
                        marginBottom: 16 
                      }} />
                      
                      {selectedFile ? (
                        <>
                          <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 800, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedFile.name}</p>
                          <p style={{ margin: 0, fontSize: 11, color: C.textSub, fontWeight: 700 }}>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Click to replace file</p>
                        </>
                      ) : (
                        <>
                          <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 800, color: C.text }}>Select or drop document file</p>
                          <p style={{ margin: 0, fontSize: 11, color: C.textMuted, fontWeight: 700 }}>PDF, PNG, JPG (Max 10MB limit)</p>
                        </>
                      )}
                   </div>

                   {/* Validation Errors */}
                   {uploadError && (
                     <div style={{ 
                       background: C.redPale, 
                       border: `1px solid rgba(239,68,68,0.1)`, 
                       borderRadius: 14, 
                       padding: '12px 16px', 
                       marginBottom: 24, 
                       fontSize: 12, 
                       color: C.red, 
                       fontWeight: 700 
                     }}>
                       {uploadError}
                     </div>
                   )}

                   {/* Metadata Entries */}
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                      <div>
                         <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 800, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: F.heading }}>Document Title</p>
                         <input 
                           type="text" 
                           disabled={isUploading || isUploadingFile}
                           value={uploadData.name}
                           onChange={(e) => setUploadData({...uploadData, name: e.target.value})}
                           placeholder="e.g. Ghana Card - Front"
                           style={{ 
                             width: '100%', 
                             padding: '16px', 
                             borderRadius: 16, 
                             border: `1.5px solid ${C.border}`, 
                             outline: 'none', 
                             fontSize: 14, 
                             fontFamily: F.body, 
                             boxSizing: 'border-box',
                             transition: 'border 0.2s',
                             color: C.text
                           }}
                           onFocus={(e) => e.target.style.borderColor = C.blue}
                           onBlur={(e) => e.target.style.borderColor = C.border}
                         />
                      </div>

                      <div>
                         <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 800, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: F.heading }}>Category</p>
                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            {DOC_CATEGORIES.map(cat => (
                              <button 
                                key={cat.id}
                                disabled={isUploading || isUploadingFile}
                                onClick={() => setUploadData({...uploadData, cat: cat.id})}
                                style={{ 
                                  padding: '12px 16px', 
                                  borderRadius: 16, 
                                  border: `1.5px solid ${uploadData.cat === cat.id ? C.blue : C.border}`,
                                  background: uploadData.cat === cat.id ? `${C.blue}03` : '#fff',
                                  color: uploadData.cat === cat.id ? C.blue : C.textSub,
                                  fontSize: 12.5, 
                                  fontWeight: 800, 
                                  cursor: (isUploading || isUploadingFile) ? 'not-allowed' : 'pointer', 
                                  transition: 'all 0.2s',
                                  textAlign: 'left', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: 10,
                                  fontFamily: F.heading
                                }}
                              >
                                <span style={{ color: uploadData.cat === cat.id ? C.blue : C.textMuted }}>{cat.icon}</span>
                                {cat.label}
                              </button>
                            ))}
                         </div>
                      </div>

                      {/* Main Action Button */}
                      <button 
                        disabled={!uploadData.name || !selectedFile || isUploading || isUploadingFile}
                        onClick={handleActualUpload}
                        style={{ 
                          marginTop: 8, 
                          padding: '16px', 
                          borderRadius: 16, 
                          border: 'none', 
                          background: `linear-gradient(135deg, ${C.sidebar}, #1f2937)`, 
                          color: '#fff', 
                          fontSize: 13, 
                          fontWeight: 800, 
                          cursor: (uploadData.name && selectedFile && !isUploading && !isUploadingFile) ? 'pointer' : 'not-allowed', 
                          opacity: (uploadData.name && selectedFile && !isUploading && !isUploadingFile) ? 1 : 0.5,
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: 12,
                          boxShadow: '0 8px 24px rgba(11,22,48,0.15)',
                          fontFamily: F.heading
                        }}
                      >
                         {(isUploading || isUploadingFile) && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: 14, height: 14, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />}
                         {(isUploading || isUploadingFile) ? 'Syncing Credentials...' : 'Register Secure Document'}
                      </button>
                   </div>
                </motion.div>
             </motion.div>
           )}
        </AnimatePresence>

      </div>
    </PortalShell>
  );
}
