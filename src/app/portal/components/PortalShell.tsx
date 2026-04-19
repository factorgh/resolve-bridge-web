'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

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
  indigo: '#6366f1',
  indigoPale: 'rgba(99,102,241,0.08)',
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
        setReady(true); 
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

  if (!ready || !user) {
    return (
      <div style={{ height: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bg }}>
         <motion.div 
           animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
           transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
           style={{ background: '#fff', padding: 12, borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }}
         >
            <img src="/images/resolve_logo.png" style={{ height: 32 }} alt="Loading..." />
         </motion.div>
      </div>
    );
  }

  const sidebarW = isMobile ? 0 : (collapsed ? 68 : 240);
  const activeNavItem = NAV.find(n => pathname === n.href || (n.href !== '/portal' && pathname.startsWith(n.href)));

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: F.body, display: 'flex' }}>
       <link href={FONT_LINK} rel="stylesheet" />
       
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
            
            <nav style={{ flex: 1, padding: '10px' }}>
               {NAV.map(n => {
                 const active = activeNavItem?.id === n.id;
                 return (
                   <button key={n.id} onClick={() => router.push(n.href)} style={{
                     width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: active ? C.sidebarActive : 'transparent',
                     color: active ? '#fff' : C.sidebarText, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: '0.2s'
                   }}>
                      {n.icon}
                      {!collapsed && <span style={{ fontWeight: 600, fontSize: 13.5 }}>{n.label}</span>}
                   </button>
                 );
               })}
            </nav>

            <div style={{ padding: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
               <button onClick={logout} style={{ width: '100%', padding: 10, background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>Sign Out</button>
            </div>
         </aside>
       )}

       {/* WhatsApp Style Mobile Bottom Tab Bar */}
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
                  width: '20%', padding: '10px 0', cursor: 'pointer'
                }}>
                   {/* WhatsApp Active Pill Indicator */}
                   <div style={{
                     width: isMobile ? 50 : 56, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                     background: active ? C.bluePale : 'transparent', color: active ? C.blue : C.textSub,
                     transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', marginBottom: 4
                   }}>
                      <div style={{ transform: active ? 'scale(1.1)' : 'scale(1)', transition: '0.2s' }}>{n.icon}</div>
                   </div>
                   <span style={{ 
                     fontSize: 10, fontWeight: active ? 800 : 500, color: active ? C.text : C.textMuted 
                   }}>{n.label}</span>
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
             
             <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button 
                  onClick={() => setNotifOpen(true)}
                  style={{ 
                    position: 'relative', width: 36, height: 36, borderRadius: 10, border: `1px solid ${C.border}`, 
                    background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    transition: '0.2s', padding: 0
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = C.blue}
                  onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
                >
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                   <span style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: '50%', background: C.red, border: '2px solid #fff' }} />
                </button>

                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #2051e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13 }}>
                   {user?.name?.charAt(0) || 'U'}
                </div>
             </div>

             {/* Notifications Modal Overlay */}
             <AnimatePresence>
                {notifOpen && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      onClick={() => setNotifOpen(false)}
                      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(13,27,62,0.4)', backdropFilter: 'blur(4px)' }}
                    />
                    <motion.div 
                      initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                      style={{ 
                        position: 'fixed', right: 0, top: 0, bottom: 0, width: isMobile ? '100%' : 380, 
                        background: '#fff', zIndex: 1001, boxShadow: '-10px 0 40px rgba(0,0,0,0.1)', overflowY: 'auto'
                      }}
                    >
                       <div style={{ padding: 24, borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
                          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, fontFamily: F.heading }}>Intelligence Feed</h2>
                          <button onClick={() => setNotifOpen(false)} style={{ background: C.bg, border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontWeight: 900 }}>✕</button>
                       </div>

                       <div style={{ padding: 12 }}>
                          {[
                            { id: 1, title: 'Loan Milestone Confirmed', desc: 'Stanbic Bank has confirmed your Personal Loan package details.', time: '12m ago', icon: '🏦', color: C.bluePale },
                            { id: 2, title: 'New Marketplace Match', desc: 'Enterprise has issued a new quote for your Auto Insurance request.', time: '2h ago', icon: '⚡', color: C.greenPale },
                            { id: 3, title: 'Action Required', desc: 'Documentation needed for your Fidelity Bank enrollment.', time: '5h ago', icon: '📄', color: C.redPale },
                            { id: 4, title: 'Portfolio Update', desc: 'Monthly statement for April 2026 is now available for download.', time: '1d ago', icon: '📊', color: C.bluePale },
                            { id: 5, title: 'Eligibility Verified', desc: 'Kredete has updated your credit limit for the BNPL electronics tier.', time: '2d ago', icon: '✅', color: C.greenPale }
                          ].map((n, i) => (
                            <motion.div 
                              key={n.id}
                              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                              style={{ 
                                padding: 16, borderRadius: 16, marginBottom: 8, background: '#fff', border: `1px solid ${C.border}`,
                                cursor: 'pointer', transition: '0.2s'
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                            >
                               <div style={{ display: 'flex', gap: 12 }}>
                                  <div style={{ width: 40, height: 40, borderRadius: 10, background: n.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                                     {n.icon}
                                  </div>
                                  <div style={{ minWidth: 0 }}>
                                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                                        <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: C.text }}>{n.title}</p>
                                        <span style={{ fontSize: 10, color: C.textMuted }}>{n.time}</span>
                                     </div>
                                     <p style={{ margin: 0, fontSize: 12, color: C.textSub, lineHeight: 1.4 }}>{n.desc}</p>
                                  </div>
                               </div>
                            </motion.div>
                          ))}
                       </div>
                    </motion.div>
                  </>
                )}
             </AnimatePresence>
          </header>

          <div style={{ padding: isMobile ? '24px 20px 100px' : '40px 32px' }}>
             {subtitle && (
               <div style={{ marginBottom: 32 }}>
                  <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 800, color: C.text }}>{title}</h1>
                  <p style={{ margin: 0, fontSize: 14, color: C.textMuted }}>{subtitle}</p>
               </div>
             )}
             {children}
          </div>
       </main>
    </div>
  );
}
