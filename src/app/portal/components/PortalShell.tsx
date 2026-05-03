'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Drawer, Box, Typography, IconButton, CircularProgress as MUICircularProgress } from '@mui/material';
import { 
  CloseRounded, 
  NotificationsRounded, 
  HistoryRounded, 
  BoltRounded, 
  AssignmentLateRounded, 
  AssessmentRounded, 
  VerifiedRounded,
  AccountCircleRounded,
  SecurityRounded,
  SupportAgentRounded,
  ExitToAppRounded
} from '@mui/icons-material';

/* ─── Design tokens ──────────────────────────────────────────────────────── */
export const C = {
  bg: '#f0f2f8',
  surface: '#ffffff',
  border: 'rgba(20,30,70,0.07)',
  borderStrong: 'rgba(20,30,70,0.15)',
  text: '#0d1b3e',
  textSub: '#5c6b8a',
  textMuted: '#9aa5bf',
  blue: '#2051e5',
  blueLight: '#4f78ff',
  bluePale: 'rgba(32,81,229,0.08)',
  green: '#00b67a',
  greenPale: 'rgba(0,182,122,0.08)',
  emerald: '#10b981',
  emeraldLight: '#34d399',
  emeraldPale: 'rgba(16,185,129,0.1)',
  red: '#ef4444',
  redPale: 'rgba(239,68,68,0.08)',
  purple: '#7c3aed',
  purplePale: 'rgba(124,58,237,0.08)',
  amber: '#f59e0b',
  amberPale: 'rgba(245,158,11,0.08)',
  sidebar: '#0b1630',
  sidebarActive: 'rgba(64,100,255,0.18)',
  sidebarText: 'rgba(255,255,255,0.55)',
  sidebarHover: 'rgba(255,255,255,0.06)',
};

export const F = {
  heading: "'Plus Jakarta Sans', system-ui, sans-serif",
  body: "'Inter', system-ui, sans-serif",
  serif: "'Lora', serif",
};

export const FONT_LINK = `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,700&family=Inter:wght@400;500;600;700&family=Lora:wght@400;700&display=swap`;

/* ─── Nav definition ─────────────────────────────────────────────────────── */
export const NAV = [
  {
    id: 'dashboard', label: 'Overview', href: '/portal',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  },
  {
    id: 'marketplace', label: 'Marketplace', href: '/portal/marketplace',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  },
  {
    id: 'loans', label: 'Portfolio', href: '/portal/statement',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  },
  {
    id: 'calculator', label: 'Calculators', href: '/portal/calculator',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="16" y2="18"/></svg>,
  },
  {
    id: 'documents', label: 'Vault', href: '/portal/documents',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  },
  {
    id: 'settings', label: 'Settings', href: '/portal/settings',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  },
];

/* ─── Shell Core ─────────────────────────────────────────────────────────── */

export default function PortalShell({
  children, title, subtitle, backHref, backLabel,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<any>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);

  const LOADING_STEPS = [
    "Establishing Secure Handshake...",
    "Verifying Institutional Vault...",
    "Synchronizing Verified Credentials...",
    "Finalizing Security Protocol..."
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    
    const stored = sessionStorage.getItem('rb_user');
    if (!stored) { 
      router.replace('/login'); 
    } else { 
      try {
        setUser(JSON.parse(stored)); 
        
        // Custom Page Loader Sequence
        let step = 0;
        const interval = setInterval(() => {
           if (step < LOADING_STEPS.length - 1) {
              step++;
              setLoadingStep(step);
           } else {
              clearInterval(interval);
              setTimeout(() => {
                 setIsInitialLoading(false);
                 setReady(true);
              }, 400);
           }
        }, 300);

      } catch (e) {
        console.error('Session corruption detected', e);
        sessionStorage.removeItem('rb_user');
        router.replace('/login');
      }
    }

    return () => window.removeEventListener('resize', handleResize);
  }, [router]);

  const logout = useCallback(() => {
    sessionStorage.removeItem('rb_user');
    router.push('/login');
  }, [router]);

  const sidebarW = isMobile ? 0 : (collapsed ? 68 : 240);
  const activeNavItem = NAV.find(n => pathname === n.href || (n.href !== '/portal' && pathname.startsWith(n.href)));

  if (!user && !isInitialLoading) return null; // Fallback for auth redirect

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: F.body, display: 'flex' }}>
       <link href={FONT_LINK} rel="stylesheet" />
       
       {/* Immersive Initial Loader Modal */}
       <AnimatePresence>
          {isInitialLoading && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              style={{ 
                position: 'fixed', inset: 0, zIndex: 9999, 
                background: 'rgba(255, 255, 255, 0.3)', 
                backdropFilter: 'blur(12px)',
                display: 'flex', 
                alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden'
              }}
            >
               {/* Animated Institutional Orbs */}
               <motion.div 
                 animate={{ 
                   x: [0, 100, -100, 0],
                   y: [0, -50, 50, 0],
                   scale: [1, 1.2, 0.8, 1]
                 }}
                 transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                 style={{ position: 'absolute', top: '10%', left: '10%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(32,81,229,0.08), transparent 70%)', filter: 'blur(60px)' }} 
               />
               <motion.div 
                 animate={{ 
                   x: [0, -150, 150, 0],
                   y: [0, 100, -100, 0],
                   scale: [1, 0.7, 1.3, 1]
                 }}
                 transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                 style={{ position: 'absolute', bottom: '10%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(124,58,237,0.06), transparent 70%)', filter: 'blur(80px)' }} 
               />

               <motion.div 
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}
               >
                  {/* Ultra Modern Icon Container */}
                  <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto 48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     
                     {/* Scanning Laser Effect */}
                     <motion.div 
                       animate={{ top: ['15%', '85%', '15%'] }}
                       transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                       style={{ 
                         position: 'absolute', left: '15%', right: '15%', height: 2, 
                         background: `linear-gradient(90deg, transparent, ${C.blue}, transparent)`, 
                         zIndex: 2, boxShadow: `0 0 15px ${C.blue}`, opacity: 0.6
                       }}
                     />

                     <motion.div 
                       animate={{ scale: [1, 1.02, 1] }}
                       transition={{ duration: 4, repeat: Infinity }}
                       style={{ 
                         width: 80, height: 80, background: '#fff', borderRadius: 28, 
                         display: 'flex', alignItems: 'center', justifyContent: 'center', 
                         zIndex: 1, border: `1px solid ${C.border}`, padding: '20px'
                       }}
                     >
                        <img src="/images/resolve_logo.png" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} alt="Resolve" />
                     </motion.div>
                  </div>

                  {/* Modern Stepper Progress */}
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 32 }}>
                     {LOADING_STEPS.map((_, i) => (
                       <motion.div 
                         key={i}
                         animate={{ 
                           width: loadingStep === i ? 32 : 8,
                           background: loadingStep >= i ? C.blue : 'rgba(0,0,0,0.05)'
                         }}
                         style={{ height: 4, borderRadius: 2 }}
                       />
                     ))}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={loadingStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                       <p style={{ 
                         margin: '0 0 4px', fontSize: 11, fontWeight: 900, 
                         color: C.blue, textTransform: 'uppercase', 
                         letterSpacing: '0.2em', fontFamily: F.heading 
                       }}>
                         Security Protocol Active
                       </p>
                       <p style={{ 
                         margin: 0, fontSize: 14, fontWeight: 700, 
                         color: C.textSub, opacity: 0.8 
                       }}>
                         {LOADING_STEPS[loadingStep]}
                       </p>
                    </motion.div>
                  </AnimatePresence>
               </motion.div>
            </motion.div>
          )}
       </AnimatePresence>

       {/* Desktop Sidebar */}
       {!isMobile && (
         <aside style={{
           width: sidebarW, height: '100vh', background: C.sidebar, position: 'fixed', left: 0, top: 0, zIndex: 100,
           display: 'flex', flexDirection: 'column', transition: '0.2s cubic-bezier(0.2, 0, 0, 1)', overflow: 'hidden'
         }}>
            <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
               <div style={{ background: '#fff', padding: 6, borderRadius: 8 }}><img src="/images/resolve_logo.png" style={{ height: 20 }} /></div>
               {!collapsed && <span style={{ fontWeight: 800, color: '#fff', fontSize: 16 }}>ResolveBridge</span>}
            </div>
            
            <div style={{ flex: 1, padding: '10px' }}>
               {NAV.map(n => {
                 const active = activeNavItem?.id === n.id;
                 return (
                   <button key={n.id} onClick={() => router.push(n.href)} style={{
                     width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: active ? C.sidebarActive : 'transparent',
                     color: active ? '#fff' : C.sidebarText, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: '0.2s',
                     marginBottom: 4
                   }}>
                      {n.icon}
                      {!collapsed && <span style={{ fontWeight: 600, fontSize: 13.5 }}>{n.label}</span>}
                   </button>
                 );
               })}
            </div>

            {!collapsed && (
              <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 14, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trust & Security</p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div title="Verified by Ghana Card" style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>🇬🇭</div>
                    <div title="SSL Secure" style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.emerald }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                    <div title="No Hidden Fees" style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.amber }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ padding: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
               <button onClick={logout} style={{ width: '100%', padding: 10, background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>Sign Out</button>
            </div>
         </aside>
       )}

       {/* Mobile Bottom Tab Bar */}
       {isMobile && (
         <nav style={{
           position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, height: 80,
           background: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(20px)',
           borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-around', alignItems: 'center',
           boxShadow: '0 -4px 30px rgba(0,0,0,0.04)'
         }}>
            {NAV.map(n => {
              const active = activeNavItem?.id === n.id;
              return (
                <button key={n.id} onClick={() => router.push(n.href)} style={{
                  background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center',
                  width: `${100 / NAV.length}%`, padding: '10px 0', cursor: 'pointer'
                }}>
                   <div style={{
                     width: 50, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                     background: active ? C.bluePale : 'transparent', color: active ? C.blue : C.textSub,
                     transition: '0.25s cubic-bezier(0.4, 0, 0.2, 1)', marginBottom: 4
                   }}>
                      {n.icon}
                   </div>
                   <span style={{ fontSize: 10, fontWeight: active ? 800 : 500, color: active ? C.text : C.textMuted }}>{n.label}</span>
                </button>
              );
            })}
         </nav>
       )}

       {/* Main Content Area */}
       <main style={{ flex: 1, marginLeft: sidebarW, minHeight: '100vh', transition: '0.2s' }}>
          {/* Topbar */}
          <header style={{ 
            height: 64, position: 'sticky', top: 0, zIndex: 80, background: 'rgba(240,242,248,0.9)', backdropFilter: 'blur(16px)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '0 20px' : '0 32px', borderBottom: `1px solid ${C.border}`
          }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {backHref ? (
                   <Link href={backHref} style={{ color: C.textSub, textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>← {backLabel || 'Back'}</Link>
                ) : (
                   <span style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{activeNavItem?.label || 'Portal'}</span>
                )}
             </div>
             
             <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
                <button 
                  onClick={() => { setNotifOpen(true); setSelectedNotif(null); setProfileOpen(false); }}
                  style={{ 
                    position: 'relative', width: 40, height: 40, borderRadius: 12, border: `1px solid ${C.border}`, 
                    background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    transition: '0.2s', padding: 0
                  }}
                >
                   <NotificationsRounded sx={{ fontSize: 18, color: C.text }} />
                   <span style={{ position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: '50%', background: C.red, border: '2px solid #fff' }} />
                </button>

                <div style={{ width: 1, height: 24, background: C.border, margin: '0 4px' }} />

                <button 
                  onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: 10, padding: '4px 4px 4px 12px', 
                    borderRadius: 14, border: `1px solid ${profileOpen ? C.blue : C.border}`, 
                    background: '#fff', cursor: 'pointer', transition: '0.2s'
                  }}
                >
                   {!isMobile && (
                     <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: C.text }}>{user?.name || 'User'}</p>
                        <p style={{ margin: 0, fontSize: 10, color: C.textMuted, fontWeight: 700 }}>Personal Account</p>
                     </div>
                   )}
                   <div style={{ 
                     width: 32, height: 32, borderRadius: 10, 
                     background: 'linear-gradient(135deg, #2051e5, #7c3aed)', 
                     display: 'flex', alignItems: 'center', justifyContent: 'center', 
                     color: '#fff', fontWeight: 900, fontSize: 12, position: 'relative' 
                   }}>
                      {user?.name?.charAt(0) || 'U'}
                      <div style={{ position: 'absolute', bottom: -2, right: -2, width: 10, height: 10, background: C.emerald, border: '2px solid #fff', borderRadius: '50%' }} />
                   </div>
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                   {profileOpen && (
                     <>
                       <motion.div 
                         initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                         onClick={() => setProfileOpen(false)}
                         style={{ position: 'fixed', inset: 0, zIndex: 90 }}
                       />
                       <motion.div 
                         initial={{ opacity: 0, y: 10, scale: 0.95 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         exit={{ opacity: 0, y: 10, scale: 0.95 }}
                         style={{ 
                           position: 'absolute', top: 'calc(100% + 12px)', right: 0, width: 240, 
                           background: '#fff', borderRadius: 20, padding: 8, zIndex: 100,
                           boxShadow: '0 20px 50px rgba(13,27,62,0.15)', border: `1px solid ${C.border}`
                         }}
                       >
                          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}`, marginBottom: 4 }}>
                             <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: C.text }}>{user?.name}</p>
                             <p style={{ margin: 0, fontSize: 12, color: C.textMuted, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
                          </div>
                          
                          {[
                            { label: 'My Profile', icon: <AccountCircleRounded sx={{ fontSize: 18 }} />, href: '/portal/settings' },
                            { label: 'Security', icon: <SecurityRounded sx={{ fontSize: 18 }} />, href: '/portal/settings' },
                            { label: 'Direct Support', icon: <SupportAgentRounded sx={{ fontSize: 18 }} />, href: '/portal/marketplace' },
                          ].map(item => (
                            <button 
                              key={item.label}
                              onClick={() => { router.push(item.href); setProfileOpen(false); }}
                              style={{ 
                                width: '100%', padding: '10px 12px', borderRadius: 10, border: 'none', 
                                background: 'transparent', display: 'flex', alignItems: 'center', gap: 10, 
                                cursor: 'pointer', transition: '0.2s', color: C.textSub, fontWeight: 700, fontSize: 13
                              }}
                            >
                               {item.icon}
                               {item.label}
                            </button>
                          ))}

                          <div style={{ height: 1, background: C.border, margin: '4px 0' }} />
                          
                          <button 
                            onClick={logout}
                            style={{ 
                              width: '100%', padding: '10px 12px', borderRadius: 10, border: 'none', 
                              background: 'transparent', display: 'flex', alignItems: 'center', gap: 10, 
                              cursor: 'pointer', transition: '0.2s', color: C.red, fontWeight: 800, fontSize: 13
                            }}
                          >
                             <ExitToAppRounded sx={{ fontSize: 18 }} />
                             Sign Out
                          </button>
                       </motion.div>
                     </>
                   )}
                </AnimatePresence>
             </div>
          </header>

          <Drawer 
            anchor="right" 
            open={notifOpen} 
            onClose={() => setNotifOpen(false)}
            PaperProps={{
              sx: { 
                width: isMobile ? '100%' : (selectedNotif ? 840 : 420), 
                background: 'rgba(255,255,255,0.95)', 
                backdropFilter: 'blur(24px)',
                borderLeft: `1px solid ${C.border}`,
                boxShadow: '-20px 0 60px rgba(13,27,62,0.1)',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }
            }}
          >
             <Box sx={{ height: '100%', display: 'flex', overflow: 'hidden' }}>
                
                {/* Master List Column */}
                <Box sx={{ 
                  width: isMobile && selectedNotif ? 0 : 420, 
                  height: '100%', display: 'flex', flexDirection: 'column', 
                  borderRight: selectedNotif && !isMobile ? `1px solid ${C.border}` : 'none',
                  transition: 'width 0.3s'
                }}>
                    {/* Drawer Header */}
                    <Box sx={{ p: 3, borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <Box>
                          <Typography sx={{ fontSize: 18, fontWeight: 900, fontFamily: F.heading, color: C.text, lineHeight: 1.2 }}>Intelligence Feed</Typography>
                          <Typography sx={{ fontSize: 10, color: C.textMuted, fontWeight: 800, letterSpacing: '0.05em' }}>VERIFIED INSTITUTIONAL SIGNALS</Typography>
                       </Box>
                       <IconButton onClick={() => setNotifOpen(false)} sx={{ width: 36, height: 36 }}><CloseRounded sx={{ fontSize: 20 }} /></IconButton>
                    </Box>

                    {/* Search Bar */}
                    <Box sx={{ p: 2, background: 'rgba(0,0,0,0.01)', borderBottom: `1px solid ${C.border}` }}>
                       <div style={{ position: 'relative' }}>
                          <input 
                            placeholder="Search signals..."
                            style={{ width: '100%', padding: '10px 16px 10px 36px', borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff', fontSize: 13, outline: 'none', color: C.text }}
                          />
                          <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, color: C.textMuted }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                       </div>
                    </Box>

                    <Box sx={{ flex: 1, overflowY: 'auto' }}>
                       {[
                         { id: 1, title: 'Loan Milestone Confirmed', desc: 'Stanbic Bank has confirmed your Personal Loan package details.', time: '12m ago', icon: <HistoryRounded sx={{ fontSize: 18 }} />, color: C.blue, unread: true },
                         { id: 2, title: 'New Marketplace Match', desc: 'Enterprise has issued a new quote for your Auto Insurance request.', time: '2h ago', icon: <BoltRounded sx={{ fontSize: 18 }} />, color: C.emerald, unread: true },
                         { id: 3, title: 'Action Required', desc: 'Documentation needed for your Fidelity Bank enrollment.', time: '5h ago', icon: <AssignmentLateRounded sx={{ fontSize: 18 }} />, color: C.red, unread: true },
                       ].map((n) => (
                         <Box key={n.id} onClick={() => setSelectedNotif(n)} sx={{ 
                           p: '20px 24px', display: 'flex', gap: 16, borderBottom: `1px solid ${C.border}`, 
                           background: selectedNotif?.id === n.id ? C.bluePale : (n.unread ? 'rgba(32,81,229,0.02)' : 'transparent'),
                           cursor: 'pointer', transition: '0.2s',
                           '&:hover': { background: selectedNotif?.id === n.id ? C.bluePale : 'rgba(0,0,0,0.02)' }
                         }}>
                            <Box sx={{ width: 36, height: 36, borderRadius: 10, background: `${n.color}10`, color: n.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                               {n.icon}
                            </Box>
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
                                  <Typography sx={{ fontSize: 14, fontWeight: 800, color: C.text }}>{n.title}</Typography>
                                  <Typography sx={{ fontSize: 10, color: C.textMuted, fontWeight: 700 }}>{n.time}</Typography>
                               </Box>
                               <Typography sx={{ fontSize: 12.5, color: C.textSub, lineHeight: 1.4 }}>{n.desc}</Typography>
                            </Box>
                         </Box>
                       ))}
                    </Box>

                    <Box sx={{ p: 2.5, borderTop: `1px solid ${C.border}`, display: 'flex', gap: 1.5 }}>
                       <button 
                        onClick={() => { router.push('/portal/settings'); setNotifOpen(false); }}
                        style={{ flex: 1, padding: '12px', borderRadius: 14, border: `1.5px solid ${C.border}`, background: '#fff', color: C.text, fontWeight: 800, fontSize: 13, cursor: 'pointer', transition: '0.2s' }}
                       >
                         Settings
                       </button>
                       <button 
                        onClick={() => setNotifOpen(false)}
                        style={{ flex: 2, padding: '12px', borderRadius: 14, border: 'none', background: C.text, color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer', transition: '0.2s' }}
                       >
                         Mark All as Read
                       </button>
                    </Box>
                </Box>

                {/* Detail View Column */}
                <AnimatePresence>
                   {selectedNotif && (
                     <motion.div 
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, x: 20 }}
                       style={{ flex: 1, height: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}
                     >
                        <Box sx={{ p: 3, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 2 }}>
                           {isMobile && <IconButton onClick={() => setSelectedNotif(null)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg></IconButton>}
                           <Box>
                              <Typography sx={{ fontSize: 14, fontWeight: 800, color: C.text }}>Signal Details</Typography>
                              <Typography sx={{ fontSize: 9, color: C.textMuted, fontWeight: 900, letterSpacing: '0.1em' }}>INSTITUTIONAL METADATA</Typography>
                           </Box>
                           {!isMobile && <IconButton onClick={() => setSelectedNotif(null)} sx={{ ml: 'auto', width: 36, height: 36 }}><CloseRounded sx={{ fontSize: 18 }} /></IconButton>}
                        </Box>

                        <Box sx={{ p: isMobile ? 4 : 6, flex: 1, overflowY: 'auto' }}>
                           <Box sx={{ mb: 6 }}>
                              <Box sx={{ 
                                width: 52, height: 52, borderRadius: 14, 
                                background: `${selectedNotif.color}10`, color: selectedNotif.color, 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 
                              }}>
                                 {selectedNotif.icon}
                              </Box>
                              <Typography sx={{ fontSize: 24, fontWeight: 900, color: C.text, mb: 1, fontFamily: F.heading, letterSpacing: '-0.02em' }}>{selectedNotif.title}</Typography>
                              <Typography sx={{ fontSize: 13, color: C.textMuted, fontWeight: 700 }}>Signal verified {selectedNotif.time}</Typography>
                           </Box>

                           <Box sx={{ mb: 6 }}>
                              <Typography sx={{ fontSize: 15, color: C.textSub, lineHeight: 1.8, fontWeight: 500 }}>
                                 {selectedNotif.desc} This institutional update has been processed through Resolve's proprietary compliance handshake.
                              </Typography>
                              <Box sx={{ mt: 4, p: '14px 20px', borderRadius: 12, background: 'rgba(16,185,129,0.05)', border: `1px solid ${C.emerald}20`, display: 'inline-flex', gap: 1.5, alignItems: 'center' }}>
                                 <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.emerald }} />
                                 <Typography sx={{ fontSize: 12, fontWeight: 800, color: C.emerald, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Verified Institutional Signal</Typography>
                              </Box>
                           </Box>

                           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                              <Typography sx={{ fontSize: 10, fontWeight: 900, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1 }}>Recommended Actions</Typography>
                              <button 
                                onClick={() => { router.push('/portal/marketplace'); setNotifOpen(false); }}
                                style={{ width: '100%', padding: '16px', borderRadius: 18, border: 'none', background: C.text, color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer', transition: '0.2s', boxShadow: '0 4px 12px rgba(13,27,62,0.1)' }}
                              >
                                Review Activity in Marketplace
                              </button>
                              <button 
                                onClick={() => setSelectedNotif(null)}
                                style={{ width: '100%', padding: '16px', borderRadius: 18, border: `1.5px solid ${C.border}`, background: '#fff', color: C.text, fontWeight: 800, fontSize: 13, cursor: 'pointer', transition: '0.2s' }}
                              >
                                Dismiss Signal
                              </button>
                           </Box>
                        </Box>
                     </motion.div>
                   )}
                </AnimatePresence>
             </Box>
          </Drawer>

          <div style={{ padding: isMobile ? '24px 20px 100px' : '40px 32px' }}>
             {children}
          </div>
       </main>
    </div>
  );
}
