'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PortalShell, { C, F } from '../components/PortalShell';
import { 
  CloudUploadRounded, 
  ShieldRounded, 
  VerifiedUserRounded, 
  MoreVertRounded,
  FolderSpecialRounded,
  InsertDriveFileRounded,
  ErrorOutlineRounded,
  CheckCircleRounded,
  InfoOutlined,
  CloseRounded
} from '@mui/icons-material';

/* ─── Types & Constants ────────────────────────────────────────────────────── */

const DOC_CATEGORIES = [
  { id: 'identity', label: 'Identity & KYC', icon: <VerifiedUserRounded />, desc: 'National ID, Passport, Driver License' },
  { id: 'finance', label: 'Financial Proofs', icon: <InsertDriveFileRounded />, desc: 'Bank Statements, Pay Stubs, Tax Returns' },
  { id: 'assets', label: 'Asset Ownership', icon: <FolderSpecialRounded />, desc: 'Vehicle Title, Property Deed, Stock Portfolio' },
];

const INITIAL_DOCS = [
  { id: 'd1', name: 'National ID (Ghana Card)', cat: 'identity', status: 'Verified', date: 'Jan 12, 2026', expiry: 'Jan 2031', size: '1.2 MB' },
  { id: 'd2', name: 'Utility Bill - ECG (April)', cat: 'identity', status: 'Pending', date: 'Apr 17, 2026', expiry: 'N/A', size: '2.4 MB' },
  { id: 'd3', name: 'Absa Bank Statement (Q1)', cat: 'finance', status: 'Verified', date: 'Apr 02, 2026', expiry: 'Oct 2026', size: '3.8 MB' },
  { id: 'd4', name: 'Vehicle Registration - Land Rover', cat: 'assets', status: 'Expired', date: 'Feb 28, 2025', expiry: 'Feb 2026', size: '1.1 MB' },
];

/* ─── Main Component ────────────────────────────────────────────────────── */

export default function DocumentsPage() {
  const [docs, setDocs] = useState(INITIAL_DOCS);
  const [activeCat, setActiveCat] = useState('all');
  const [isMobile, setIsMobile] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Upload State
  const [uploading, setUploading] = useState(false);
  const [uploadData, setUploadData] = useState({ name: '', cat: 'identity' });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filtered = docs.filter(d => activeCat === 'all' || d.cat === activeCat);

  const handleSimulatedUpload = () => {
    if (!uploadData.name) return;
    setUploading(true);
    setTimeout(() => {
      const newDoc = {
        id: Math.random().toString(36).substr(2, 9),
        name: uploadData.name,
        cat: uploadData.cat,
        status: 'Pending',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        expiry: 'N/A',
        size: '1.4 MB'
      };
      setDocs([newDoc, ...docs]);
      setUploading(false);
      setShowUploadModal(false);
      setUploadData({ name: '', cat: 'identity' });
    }, 2000);
  };

  return (
    <PortalShell title="Secure Vault" subtitle="Institutional-grade encrypted storage for your financial credentials.">
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: isMobile ? '0 16px 100px' : '0 24px 100px' }}>
        
        {/* Modern Header Navigation Hub */}
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
                  background: activeCat === t.id ? C.text : 'transparent', 
                  color: activeCat === t.id ? '#fff' : C.textSub,
                  fontSize: 13, 
                  fontWeight: 800, 
                  cursor: 'pointer', 
                  transition: 'all 0.3s ease',
                  fontFamily: F.heading,
                  whiteSpace: 'nowrap'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setShowUploadModal(true)}
            style={{ 
              background: C.blue, color: '#fff', border: 'none', borderRadius: 16, 
              padding: '12px 24px', fontSize: 13, fontWeight: 900, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 10, transition: '0.2s',
              boxShadow: `0 4px 12px ${C.blue}33`
            }}
          >
            <CloudUploadRounded sx={{ fontSize: 18 }} />
            {!isMobile && 'Upload New'}
          </button>
        </div>

        {/* Security Assurance Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            background: `linear-gradient(90deg, #f8fafc 0%, #fff 100%)`, 
            padding: '20px 24px', borderRadius: 20, border: `1px solid ${C.border}`, 
            display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 
          }}
        >
           <div style={{ width: 44, height: 44, borderRadius: 12, background: `${C.blue}10`, color: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldRounded />
           </div>
           <div>
              <p style={{ margin: 0, fontSize: 13, color: C.text, fontWeight: 700 }}>256-bit AES Encryption Active</p>
              <p style={{ margin: 0, fontSize: 11, color: C.textSub }}>Your documents are zero-knowledge encrypted. Only you and authorized institutions can view them.</p>
           </div>
        </motion.div>

        {/* Documents Grid / Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 340px', gap: 32, alignItems: 'start' }}>
           
           {/* Document List */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <AnimatePresence mode="popLayout">
                 {filtered.map((doc, idx) => (
                   <motion.div 
                     key={doc.id}
                     layout
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     transition={{ delay: idx * 0.05 }}
                     whileHover={{ y: -2, boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}
                     style={{ 
                       background: '#fff', borderRadius: 24, border: `1px solid ${C.border}`, 
                       padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20, 
                       position: 'relative', cursor: 'pointer' 
                     }}
                   >
                      <div style={{ 
                        width: 54, height: 54, borderRadius: 18, 
                        background: '#f8fafc', border: `1px solid ${C.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textSub
                      }}>
                         {DOC_CATEGORIES.find(c => c.id === doc.cat)?.icon || <InsertDriveFileRounded />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <p style={{ margin: 0, fontSize: 15, fontWeight: 900, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</p>
                            <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: C.textMuted, background: '#f1f5f9', padding: '0 4px', borderRadius: 4 }}>{doc.cat}</span>
                         </div>
                         <div style={{ display: 'flex', gap: 16, fontSize: 11, color: C.textMuted, fontWeight: 700 }}>
                            <span>Uploaded {doc.date}</span>
                            <span>Exp: {doc.expiry}</span>
                            <span>{doc.size}</span>
                         </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                         <div style={{ 
                           padding: '6px 14px', borderRadius: 12, fontSize: 11, fontWeight: 900,
                           background: doc.status === 'Verified' ? `${C.emerald}10` : doc.status === 'Expired' ? `${C.red}10` : `${C.blue}10`,
                           color: doc.status === 'Verified' ? C.emerald : doc.status === 'Expired' ? C.red : C.blue,
                         }}>
                            {doc.status}
                         </div>
                         <button style={{ background: 'none', border: 'none', color: C.border, cursor: 'pointer' }}><MoreVertRounded /></button>
                      </div>
                   </motion.div>
                 ))}
              </AnimatePresence>
           </div>

           {/* Stats Sidebar */}
           {!isMobile && (
             <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ 
                  background: C.sidebar, borderRadius: 32, padding: 32, color: '#fff',
                  position: 'relative', overflow: 'hidden'
                }}>
                   <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
                   <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                      <VerifiedUserRounded sx={{ fontSize: 18, color: C.emerald }} />
                      <span style={{ fontSize: 12, fontWeight: 800, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Vault Integrity</span>
                   </div>
                   <h2 style={{ margin: '0 0 8px', fontSize: 44, fontWeight: 900, fontFamily: F.heading }}>82%</h2>
                   <p style={{ margin: '0 0 24px', fontSize: 13, opacity: 0.7, lineHeight: 1.6 }}>Complete your **Residence Proof** to reach 100% eligibility for high-limit loans.</p>
                   <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
                      <motion.div 
                        initial={{ width: 0 }} animate={{ width: '82%' }}
                        style={{ height: '100%', background: C.emerald, borderRadius: 3 }} 
                      />
                   </div>
                </div>

                <div style={{ background: '#fff', borderRadius: 32, border: `1px solid ${C.border}`, padding: 32 }}>
                   <h3 style={{ margin: '0 0 24px', fontSize: 16, fontWeight: 900, fontFamily: F.heading }}>Connected Handshakes</h3>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      {[
                        { label: 'Absa Loan Application', status: 'Active Sync', color: C.emerald },
                        { label: 'TransUnion Ghana', status: 'Live Bridge', color: C.blue },
                        { label: 'Enterprise Insurance', status: 'Disconnected', color: C.red },
                      ].map(bridge => (
                        <div key={bridge.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <div>
                              <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: C.text }}>{bridge.label}</p>
                              <p style={{ margin: 0, fontSize: 11, color: bridge.color, fontWeight: 800 }}>{bridge.status}</p>
                           </div>
                           <div style={{ width: 8, height: 8, borderRadius: '50%', background: bridge.color }} />
                        </div>
                      ))}
                   </div>
                   <button style={{ marginTop: 32, width: '100%', padding: '16px', borderRadius: 16, border: `1.5px solid ${C.border}`, background: 'none', fontSize: 13, fontWeight: 800, cursor: 'pointer', transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}>Manage Connections</button>
                </div>
             </div>
           )}
        </div>

        {/* Upload Modal Overlay */}
        <AnimatePresence>
           {showUploadModal && (
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
             >
                <div onClick={() => setShowUploadModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(10,30,43,0.85)', backdropFilter: 'blur(12px)' }} />
                <motion.div 
                  initial={{ y: 50, opacity: 0, scale: 0.95 }} 
                  animate={{ y: 0, opacity: 1, scale: 1 }} 
                  exit={{ y: 50, opacity: 0, scale: 0.95 }}
                  style={{ 
                    position: 'relative', width: '100%', maxWidth: 500, background: '#fff', 
                    borderRadius: 32, padding: 40, boxShadow: '0 40px 100px rgba(0,0,0,0.3)'
                  }}
                >
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                      <h3 style={{ margin: 0, fontSize: 24, fontWeight: 900, fontFamily: F.heading }}>Vault Upload</h3>
                      <button onClick={() => setShowUploadModal(false)} style={{ width: 40, height: 40, borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <CloseRounded />
                      </button>
                   </div>

                   {/* Drag & Drop Simulation Area */}
                   <div style={{ 
                     border: `2px dashed ${C.border}`, borderRadius: 24, padding: 40, textAlign: 'center', 
                     background: '#f8fafc', marginBottom: 32, cursor: 'pointer'
                   }}>
                      <CloudUploadRounded sx={{ fontSize: 48, color: C.blue, opacity: 0.5, marginBottom: 16 }} />
                      <p style={{ margin: 0, fontSize: 15, fontWeight: 900, color: C.text }}>Select or Drop File</p>
                      <p style={{ margin: 0, fontSize: 12, color: C.textMuted }}>PDF, PNG, JPG (Max 10MB)</p>
                   </div>

                   <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                      <div>
                         <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 900, color: C.textSub, textTransform: 'uppercase' }}>Document Title</p>
                         <input 
                           type="text" 
                           value={uploadData.name}
                           onChange={(e) => setUploadData({...uploadData, name: e.target.value})}
                           placeholder="e.g. Ghana Card - Front"
                           style={{ width: '100%', padding: '16px', borderRadius: 14, border: `1.5px solid ${C.border}`, outline: 'none', fontSize: 14, fontFamily: F.body, boxSizing: 'border-box' }}
                         />
                      </div>

                      <div>
                         <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 900, color: C.textSub, textTransform: 'uppercase' }}>Category</p>
                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            {DOC_CATEGORIES.map(cat => (
                              <button 
                                key={cat.id}
                                onClick={() => setUploadData({...uploadData, cat: cat.id})}
                                style={{ 
                                  padding: '12px', borderRadius: 14, border: `1.5px solid ${uploadData.cat === cat.id ? C.blue : C.border}`,
                                  background: uploadData.cat === cat.id ? `${C.blue}05` : '#fff',
                                  color: uploadData.cat === cat.id ? C.blue : C.textSub,
                                  fontSize: 12, fontWeight: 800, cursor: 'pointer', transition: '0.2s',
                                  textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10
                                }}
                              >
                                {cat.icon}
                                {cat.label}
                              </button>
                            ))}
                         </div>
                      </div>

                      <button 
                        disabled={!uploadData.name || uploading}
                        onClick={handleSimulatedUpload}
                        style={{ 
                          marginTop: 8, padding: '18px', borderRadius: 18, border: 'none', 
                          background: C.text, color: '#fff', fontSize: 14, fontWeight: 900, 
                          cursor: (uploadData.name && !uploading) ? 'pointer' : 'not-allowed', 
                          opacity: (uploadData.name && !uploading) ? 1 : 0.5,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12
                        }}
                      >
                         {uploading && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: 18, height: 18, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />}
                         {uploading ? 'Encrypting & Syncing...' : 'Securely Upload Document'}
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
