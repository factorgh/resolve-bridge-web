'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PortalShell, { C, F } from '../components/PortalShell';

/* ─── Document Logic ─────────────────────────────────────────────────────── */

const DOC_CATEGORIES = [
  { id: 'identity', label: 'Identity & KYC', icon: '🪪' },
  { id: 'finance', label: 'Financial Proofs', icon: '📄' },
  { id: 'assets', label: 'Asset Ownership', icon: '🏠' },
];

const INITIAL_DOCS = [
  { id: 'd1', name: 'National ID (Front)', cat: 'identity', status: 'verified', date: 'Jan 12, 2026', size: '1.2 MB' },
  { id: 'd2', name: 'Utility Bill / Residence', cat: 'identity', status: 'pending', date: 'Apr 17, 2026', size: '2.4 MB' },
  { id: 'd3', name: 'March Bank Statement', cat: 'finance', status: 'verified', date: 'Apr 02, 2026', size: '3.8 MB' },
  { id: 'd4', name: 'Latest Paystub (Absa)', cat: 'finance', status: 'expired', date: 'Feb 28, 2025', size: '840 KB' },
];

/* ─── Vault Component ────────────────────────────────────────────────────── */

export default function DocumentsPage() {
  const [docs, setDocs] = useState(INITIAL_DOCS);
  const [activeCat, setActiveCat] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filtered = docs.filter(d => activeCat === 'all' || d.cat === activeCat);

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setDocs(prev => [{
        id: Math.random().toString(),
        name: 'New Document Upload',
        cat: 'finance',
        status: 'pending',
        date: new Date().toLocaleDateString(),
        size: '1.1 MB'
      }, ...prev]);
      setUploading(false);
    }, 2000);
  };

  return (
    <PortalShell title="Document Vault" backHref="/portal">
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: isMobile ? '0 20px 80px' : '0 20px 80px' }}>
        
        {/* Header Section */}
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'flex-start' : 'flex-end', 
          marginBottom: 44,
          gap: isMobile ? 24 : 0
        }}>
           <div>
              <h1 style={{ margin: '0 0 8px', fontSize: 32, fontWeight: 800, color: C.text, fontFamily: F.serif }}>Your Secure Vault</h1>
              <p style={{ margin: 0, fontSize: 15, color: C.textMuted }}>Manage your institutional credentials and financial proofs.</p>
           </div>
           <button 
             onClick={handleUpload}
             disabled={uploading}
             style={{
               width: isMobile ? '100%' : 'auto',
               background: C.sidebar, color: '#fff', border: 'none', borderRadius: 12, 
               padding: '14px 28px', fontSize: 14, fontWeight: 700, cursor: uploading ? 'not-allowed' : 'pointer',
               display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: '0.2s'
             }}
           >
             {uploading ? (
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
             ) : (
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
             )}
             {uploading ? 'Processing...' : 'Upload New'}
           </button>
        </div>

        {/* Security Warning */}
        <div style={{ background: '#f8fafc', padding: '16px 24px', borderRadius: 16, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
           <div style={{ background: '#fff', color: C.blue, padding: 8, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
           </div>
           <p style={{ margin: 0, fontSize: 13, color: C.textSub, fontWeight: 500 }}>
             ResolveBridge uses **Bank-Grade 256-bit encryption** to protect your sensitive data. Your documents are only shared with partner institutions upon your explicit application.
           </p>
        </div>

        {/* Categories Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '3fr 1fr', gap: 40 }}>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', gap: 12, borderBottom: `1px solid ${C.border}`, paddingBottom: 16 }}>
                 <button onClick={() => setActiveCat('all')} style={{ background: 'none', border: 'none', padding: '0 4px 12px', fontSize: 14, fontWeight: 700, color: activeCat === 'all' ? C.sidebar : C.textMuted, borderBottom: activeCat === 'all' ? `2px solid ${C.sidebar}` : 'none', cursor: 'pointer' }}>All Documents</button>
                 {DOC_CATEGORIES.map(cat => (
                   <button key={cat.id} onClick={() => setActiveCat(cat.id)} style={{ background: 'none', border: 'none', padding: '0 4px 12px', fontSize: 14, fontWeight: 700, color: activeCat === cat.id ? C.sidebar : C.textMuted, borderBottom: activeCat === cat.id ? `2px solid ${C.sidebar}` : 'none', cursor: 'pointer' }}>{cat.label}</button>
                 ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                 <AnimatePresence mode="popLayout">
                    {filtered.map(doc => (
                      <motion.div 
                        key={doc.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        style={{ background: '#fff', borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden' }}
                      >
                         <div style={{ 
                            display: 'flex', 
                            flexDirection: isMobile ? 'column' : 'row',
                            justifyContent: 'space-between', 
                            alignItems: isMobile ? 'flex-start' : 'center', 
                            padding: '20px 24px', 
                            gap: isMobile ? 16 : 0
                         }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                               <div style={{ width: 44, height: 44, background: '#f8fafc', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                                  {DOC_CATEGORIES.find(c => c.id === doc.cat)?.icon || '📄'}
                               </div>
                               <div>
                                  <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: C.text }}>{doc.name}</p>
                                  <p style={{ margin: 0, fontSize: 12, color: C.textMuted }}>{doc.date} • {doc.size}</p>
                               </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 24, width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'space-between' : 'flex-end' }}>
                               <div style={{ 
                                  padding: '4px 12px', borderRadius: 8, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em',
                                  background: doc.status === 'verified' ? C.emeraldLight : doc.status === 'expired' ? '#fee2e2' : '#fef9c3',
                                  color: doc.status === 'verified' ? C.emerald : doc.status === 'expired' ? '#ef4444' : '#eab308'
                               }}>
                                  {doc.status}
                               </div>
                               <button style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer' }}>
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                               </button>
                            </div>
                         </div>
                      </motion.div>
                    ))}
                 </AnimatePresence>
              </div>
           </div>

           {/* Vault Analytics Sidebar */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ background: C.sidebar, borderRadius: 24, padding: 32, color: '#fff' }}>
                 <p style={{ margin: '0 0 16px', fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Vault Health</p>
                 <p style={{ margin: '0 0 8px', fontSize: 44, fontWeight: 400, fontFamily: F.heading }}>82%</p>
                 <p style={{ margin: '0 0 24px', fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>Your identity verification is almost complete. Complete **Residence Proof** to reach 100%.</p>
                 <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
                    <div style={{ width: '82%', height: '100%', background: C.emerald, borderRadius: 3 }} />
                 </div>
              </div>

              <div style={{ background: '#fff', borderRadius: 24, border: `1px solid ${C.border}`, padding: 28 }}>
                 <p style={{ margin: '0 0 20px', fontSize: 14, fontWeight: 800, color: C.text, fontFamily: F.serif }}>Connected Bridge</p>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {[
                      { l: 'Absa Loan App', v: 'Active' },
                      { l: 'TransUnion Live', v: 'Synced' }
                    ].map(item => (
                      <div key={item.l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                         <span style={{ color: C.textSub }}>{item.l}</span>
                         <span style={{ fontWeight: 800, color: C.emerald }}>{item.v}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

        </div>

      </div>
    </PortalShell>
  );
}
