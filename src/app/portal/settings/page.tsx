'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import PortalShell, { C, F } from '../components/PortalShell';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{name: string, email: string} | null>(null);
  const [activeTab, setActiveTab] = useState('profile');

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem('rb_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleDeleteAccount = () => {
    if (confirm('Are you absolutely sure? This will permanently delete your financial roadmap, vault documents, and application history. This action cannot be undone.')) {
      sessionStorage.clear();
      router.push('/login');
    }
  };

  const menuItems = [
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
    { id: 'danger', label: 'Danger Zone', color: C.red },
  ];

  return (
    <PortalShell title="Settings" backHref="/portal">
      <div style={{ maxWidth: 900, margin: '0 auto', padding: isMobile ? '0 16px 100px' : '0 20px 80px' }}>
        
        <div style={{ marginBottom: isMobile ? 32 : 44, marginTop: isMobile ? 12 : 0 }}>
           <h1 style={{ margin: '0 0 8px', fontSize: isMobile ? 26 : 32, fontWeight: 900, color: C.text, fontFamily: F.heading }}>Settings</h1>
           <p style={{ margin: 0, fontSize: isMobile ? 14 : 15, color: C.textSub }}>Manage your institutional identity and security protocols.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '240px 1fr', gap: isMobile ? 32 : 48 }}>
           
           {/* Navigation */}
           <div style={{ 
             display: 'flex', 
             flexDirection: isMobile ? 'row' : 'column', 
             gap: 8,
             overflowX: isMobile ? 'auto' : 'visible',
             paddingBottom: isMobile ? 8 : 0,
             margin: isMobile ? '0 -16px' : 0,
             paddingLeft: isMobile ? 16 : 0
           }}>
              {menuItems.map(t => (
                <button 
                  key={t.id} 
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    padding: isMobile ? '10px 18px' : '12px 16px', borderRadius: 12, border: 'none', 
                    background: activeTab === t.id ? (t.color ? `${C.red}10` : C.bluePale) : 'transparent',
                    color: activeTab === t.id ? (t.color || C.blue) : C.textSub, 
                    textAlign: isMobile ? 'center' : 'left', 
                    fontWeight: 800, fontSize: 13.5, cursor: 'pointer', transition: '0.2s',
                    whiteSpace: 'nowrap',
                    flex: isMobile ? 'none' : 'none'
                  }}
                >
                  {t.label}
                </button>
              ))}
           </div>

           {/* Content */}
           <div style={{ background: '#fff', borderRadius: 28, border: `1px solid ${C.border}`, padding: isMobile ? 24 : 40, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              
              <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                  <motion.div key="prof" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                     <h2 style={{ fontSize: 20, fontWeight: 900, color: C.text, marginBottom: 32, fontFamily: F.heading }}>Profile Management</h2>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                           <label style={{ fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
                           <input type="text" defaultValue={user?.name} style={{ padding: '14px 16px', borderRadius: 14, border: `1.5px solid ${C.border}`, fontSize: 15, width: '100%', boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                           <label style={{ fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
                           <input type="email" defaultValue={user?.email} style={{ padding: '14px 16px', borderRadius: 14, border: `1.5px solid ${C.border}`, fontSize: 15, width: '100%', boxSizing: 'border-box' }} />
                        </div>
                        <button style={{ background: C.sidebar, color: '#fff', border: 'none', borderRadius: 14, padding: '16px', fontWeight: 800, marginTop: 12, cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>Update Profile ✓</button>
                     </div>
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div key="sec" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                     <h2 style={{ fontSize: 20, fontWeight: 900, color: C.text, marginBottom: 32, fontFamily: F.heading }}>Security Controls</h2>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <div style={{ flex: 1 }}>
                              <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 800, color: C.text }}>Two-Factor Auth</p>
                              <p style={{ margin: 0, fontSize: 13, color: C.textMuted, lineHeight: 1.4 }}>Verification for sensitive handshakes.</p>
                           </div>
                           <div style={{ width: 44, height: 24, background: C.border, borderRadius: 12, position: 'relative', cursor: 'pointer' }}>
                              <div style={{ position: 'absolute', right: 2, top: 2, width: 20, height: 20, background: '#fff', borderRadius: '50%' }} />
                           </div>
                        </div>
                        <div style={{ padding: 24, background: '#f8fafc', borderRadius: 20, border: `1px solid ${C.border}` }}>
                           <p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 800 }}>Institutional Privacy</p>
                           <p style={{ margin: 0, fontSize: 12, color: C.textSub, lineHeight: 1.6 }}>Your financial health data is encrypted and only shared with verified lenders during active applications.</p>
                        </div>
                     </div>
                  </motion.div>
                )}

                {activeTab === 'danger' && (
                  <motion.div key="dang" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                     <h2 style={{ fontSize: 20, fontWeight: 900, color: C.red, marginBottom: 12, fontFamily: F.heading }}>Danger Zone</h2>
                     <p style={{ color: C.textSub, fontSize: 14, lineHeight: 1.6, marginBottom: 32 }}>Actions here are permanent. Deleting your account will wipe all verified documents from your vault.</p>
                     
                     <div style={{ border: `1.5px solid ${C.red}33`, padding: 28, borderRadius: 20, background: `${C.red}05` }}>
                        <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 800, color: C.text }}>Delete Account</p>
                        <p style={{ margin: '0 0 24px', fontSize: 13, color: C.textMuted }}>Permanently remove your data from ResolveBridge.</p>
                        <button 
                          onClick={handleDeleteAccount}
                          style={{ width: isMobile ? '100%' : 'auto', background: C.red, color: '#fff', border: 'none', borderRadius: 12, padding: '14px 28px', fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: `0 6px 20px ${C.red}44` }}
                        >
                          Permanently Delete Account
                        </button>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>

           </div>

        </div>

      </div>
    </PortalShell>
  );
}
