'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/* ─── Font injection ─────────────────────────────────────────────────────── */
const FONT_LINK = `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,700&family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;700&display=swap`;

/* ─── Design tokens ──────────────────────────────────────────────────────── */
const C = {
  bg: '#f8fafc', 
  surface: '#ffffff',
  border: 'rgba(13,27,62,0.08)',
  borderStrong: 'rgba(13,27,62,0.12)',
  text: '#0d1b3e',
  textSub: '#475569',
  textMuted: '#94a3b8',
  blue: '#2051e5',
  emerald: '#008652', 
  emeraldLight: '#e6f3ef',
  sidebar: '#0d1b3e',
  sidebarActive: 'rgba(0,134,82,0.15)',
  red: '#ef4444'
};

const F = {
  heading: "'Plus Jakarta Sans', system-ui, sans-serif",
  body: "'Inter', sans-serif",
  serif: "'Playfair Display', serif",
};

/* ─── Types & Nav ────────────────────────────────────────────────────────── */
interface User { name: string; email: string }

const NAV = [
  { id: 'dashboard', label: 'Overview', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { id: 'loans', label: 'My Loans', icon: 'M17 9V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2' },
  { id: 'insurance', label: 'Insurance', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
  { id: 'bnpl', label: 'BNPL', icon: 'M3 3h18v18H3z' },
  { id: 'documents', label: 'Documents', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' },
  { id: 'settings', label: 'Settings', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' },
];

/* ─── Sidebar (Desktop Only) ────────────────────────────────────────────── */

function Sidebar({ active, onNav, collapsed, onLogout }: any) {
  return (
    <aside style={{
      width: collapsed ? 80 : 256, height: '100vh', background: C.sidebar, 
      position: 'fixed', left: 0, top: 0, zIndex: 60, transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'none', flexDirection: 'column', color: '#fff', overflow: 'hidden'
    }} className="portal-sidebar">
      <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <div style={{ background: '#fff', padding: 6, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <img src="/resolve_icon.png" alt="Logo" style={{ width: 28, height: 28 }} />
        </div>
        {!collapsed && <span style={{ fontWeight: 800, fontSize: 19, fontFamily: F.heading }}>Resolve</span>}
      </div>

      <nav style={{ flex: 1, padding: '0 16px' }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => onNav(n.id)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', marginBottom: 6,
            borderRadius: 12, border: 'none', background: active === n.id ? C.sidebarActive : 'transparent',
            color: active === n.id ? '#4ade80' : 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: '0.2s',
            textAlign: 'left'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={n.icon}/></svg>
            {!collapsed && <span style={{ fontSize: 14, fontWeight: 600 }}>{n.label}</span>}
          </button>
        ))}
      </nav>

      <div style={{ padding: 24, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={onLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, border: 'none', background: 'none', color: 'rgba(255,255,255,0.4)', padding: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

/* ─── Bottom Tab (Mobile Only) ─────────────────────────────────────────── */

function BottomTab({ active, onNav }: any) {
  const mobileNav = NAV.filter(n => ['dashboard', 'loans', 'insurance', 'settings'].includes(n.id));
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, height: 72,
      background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)',
      borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0 10px'
    }} className="portal-mobile-only">
      {mobileNav.map(n => (
        <button key={n.id} onClick={() => onNav(n.id)} style={{
          background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          color: active === n.id ? C.emerald : C.textMuted, cursor: 'pointer', transition: '0.2s'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d={n.icon}/></svg>
          <span style={{ fontSize: 10, fontWeight: 700 }}>{n.label.split(' ')[0]}</span>
        </button>
      ))}
    </nav>
  );
}

/* ─── Dashboard ──────────────────────────────────────────────────────────── */

function Dashboard({ user, onCardClick, isMobile }: { user: User | null; onCardClick: (t: string) => void; isMobile: boolean }) {
  const firstName = user?.name?.split(' ')[0] || 'User';
  
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '24px 20px 100px' : '48px 40px' }}>
      
      {/* Header */}
      <div style={{ 
        display: 'flex', flexDirection: isMobile ? 'column' : 'row', 
        justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', 
        marginBottom: isMobile ? 32 : 44, gap: isMobile ? 24 : 0 
      }}>
         <div>
            <h1 style={{ margin: 0, fontSize: isMobile ? 28 : 42, fontWeight: 400, color: C.text, fontFamily: F.serif }}>
               {user ? `Good afternoon, ${firstName}` : 'Loading your account...'}
            </h1>
            <div style={{ display: 'flex', gap: 20, marginTop: 16 }}>
               {['Overview', 'History'].map((t, i) => (
                 <button key={i} style={{ background: 'none', border: 'none', padding: '0 0 8px 0', fontSize: 13, fontWeight: 700, color: i === 0 ? C.emerald : C.textMuted, borderBottom: i === 0 ? `2px solid ${C.emerald}` : 'none' }}>{t}</button>
               ))}
            </div>
         </div>
         <div style={{ display: 'flex', gap: 12, width: isMobile ? '100%' : 'auto' }}>
            <button style={{ flex: 1, minWidth: isMobile ? 0 : 160, height: 48, background: C.emerald, border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Apply for loan</button>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 320px', gap: isMobile ? 32 : 48 }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 32 : 48 }}>
          
          {/* Hero Card: Financial Health Index */}
          <div style={{ background: '#fff', borderRadius: 24, border: `1px solid ${C.border}`, padding: isMobile ? 24 : 40, boxShadow: '0 4px 30px rgba(0,0,0,0.03)', position: 'relative' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.emerald, boxShadow: `0 0 10px ${C.emerald}` }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: C.textSub, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Financial Health Index</span>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                      <span style={{ fontSize: isMobile ? 56 : 84, fontWeight: 400, color: C.text, fontFamily: F.heading, letterSpacing: '-0.04em' }}>70</span>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                         <span style={{ fontSize: 28, color: C.textMuted, lineHeight: 1 }}>/ 100</span>
                         <span style={{ fontSize: 12, fontWeight: 700, color: C.emerald, marginTop: 4 }}>+4 PTS THIS MONTH</span>
                      </div>
                   </div>
                </div>
                
                {/* Premium Gauge Instrument */}
                <div style={{ width: isMobile ? 120 : 220, height: isMobile ? 65 : 110, position: 'relative' }}>
                   <svg width="100%" height="100%" viewBox="0 0 100 55">
                      <defs>
                         <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#008652" />
                         </linearGradient>
                      </defs>
                      {/* Background Track */}
                      <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="#f1f5f9" strokeWidth="6" strokeLinecap="round" />
                      {/* Active Path */}
                      <path d="M10,50 A40,40 0 0,1 78,16" fill="none" stroke="url(#gaugeGradient)" strokeWidth="8" strokeLinecap="round" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,134,82,0.2))' }} />
                   </svg>
                   <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: C.textSub }}>OPTIMAL</span>
                   </div>
                </div>
             </div>
             
             <div style={{ marginTop: 32, paddingTop: 32, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ margin: 0, fontSize: 14, color: C.textSub, fontWeight: 500, maxWidth: isMobile ? '60%' : 'auto' }}>
                   You've unlocked <span style={{ color: C.blue, fontWeight: 700 }}>3 premium credit cards</span> with this score.
                </p>
                <button style={{ 
                  background: C.bg, border: `1px solid ${C.borderStrong}`, borderRadius: 12, 
                  padding: '10px 20px', fontSize: 13, fontWeight: 700, color: C.text, 
                  cursor: 'pointer', transition: '0.2s' 
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = C.emerald}
                  onMouseLeave={e => e.currentTarget.style.borderColor = C.borderStrong}
                >Improve Score ↗</button>
             </div>
          </div>

          {/* Quick Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 20 }}>
             {['Cash Flow', 'Net Worth', 'Credit Score'].map((l, i) => (
                <div key={l} onClick={() => onCardClick(l.toLowerCase().replace(' ', ''))} style={{ background: '#fff', borderRadius: 16, border: `1px solid ${C.border}`, padding: 24, cursor: 'pointer' }}>
                   <p style={{ margin: '0 0 16px', fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase' }}>{l}</p>
                   <p style={{ margin: 0, fontSize: 22, color: C.text }}>{i === 2 ? '818' : i === 1 ? 'GH₵ 41,619' : 'GH₵ 21.19'}</p>
                   {i === 2 && <div style={{ height: 4, background: 'linear-gradient(90deg, #ef4444, #008652)', borderRadius: 2, marginTop: 16 }} />}
                </div>
             ))}
          </div>
        </div>

        {/* Wealth Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
           <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${C.border}`, padding: 28 }}>
              <h3 style={{ margin: '0 0 24px', fontSize: 17, fontFamily: F.serif }}>Wealth Center</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                 {[
                   { l: 'Savings', v: 'GH₵ 12,400', c: C.emerald },
                   { l: 'Investments', v: 'GH₵ 15,000', c: C.blue },
                   { l: 'Total Debt', v: 'GH₵ 8,250', c: C.red }
                 ].map(item => (
                   <div key={item.l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                      <span style={{ color: C.textSub }}>{item.l}</span>
                      <span style={{ fontWeight: 800, color: item.c }}>{item.v}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

const baseline = 'baseline'; // Fix for scope error in Dashboard

/* ─── Main Portal Component ────────────────────────────────────────────── */

export default function PortalPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [cashFlowOpen, setCashFlowOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);

    const stored = sessionStorage.getItem('rb_user');
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      router.replace('/login');
    }

    return () => window.removeEventListener('resize', handleResize);
  }, [router]);

  const handleLogout = () => { sessionStorage.removeItem('rb_user'); router.push('/login'); };
  const sidebarW = isMobile ? 0 : (collapsed ? 80 : 256);

  // Still render the skeleton/frame to avoid hydration flickering
  if (!mounted) return null;

  return (
    <>
      <link href={FONT_LINK} rel="stylesheet" />
      <style>{`
        .portal-sidebar { display: none; }
        .portal-mobile-only { display: flex; }
        @media (min-width: 1024px) { 
          .portal-sidebar { display: flex !important; }
          .portal-mobile-only { display: none !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: C.bg, fontFamily: F.body }}>
        
        <Sidebar collapsed={collapsed} active={activeSection} onNav={setActiveSection} onLogout={handleLogout} />
        <BottomTab active={activeSection} onNav={setActiveSection} />

        <main style={{ marginLeft: sidebarW, transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
           
           <header style={{ 
             position: 'sticky', top: 0, zIndex: 50, height: 80, background: 'rgba(248, 250, 252, 0.8)', 
             backdropFilter: 'blur(16px)', borderBottom: `1px solid ${C.border}`, display: 'flex', 
             alignItems: 'center', padding: isMobile ? '0 24px' : '0 48px', justifyContent: 'space-between' 
           }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.textMuted, letterSpacing: '0.05em', display: isMobile ? 'none' : 'block' }}>
                 RESOLVE / <span style={{ color: C.text }}>{activeSection.toUpperCase()}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                 {!isMobile && <p style={{ margin: 0, fontSize: 13, color: C.textSub, fontWeight: 600 }}>Need help? <Link href="/contact" style={{ color: C.blue }}>Specialist</Link></p>}
                 <div style={{ width: 44, height: 44, borderRadius: 12, background: C.sidebar, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800 }}>
                    {user ? user.name.charAt(0) : '?'}
                 </div>
              </div>
           </header>

           <AnimatePresence mode="wait">
             <motion.div key={activeSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                {activeSection === 'dashboard' ? (
                  <Dashboard user={user} onCardClick={(t: string) => t === 'cashflow' && setCashFlowOpen(true)} isMobile={isMobile} />
                ) : (
                  <div style={{ padding: isMobile ? 40 : 100, textAlign: 'center' }}>
                     <h2 style={{ fontSize: 24, color: C.text, fontFamily: F.serif }}>{NAV.find(n => n.id === activeSection)?.label} Under Construction</h2>
                     <button onClick={() => setActiveSection('dashboard')} style={{ color: C.blue, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, marginTop: 24, fontSize: 14 }}>← Return to Overview</button>
                  </div>
                )}
             </motion.div>
           </AnimatePresence>
        </main>

        <AnimatePresence>
           {cashFlowOpen && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? 0 : 40 }}>
                <div onClick={() => setCashFlowOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(13,27,62,0.9)', backdropFilter: 'blur(10px)' }} />
                <motion.div initial={{ y: isMobile ? '100%' : 80 }} animate={{ y: 0 }} exit={{ y: isMobile ? '100%' : 80 }} 
                  style={{ position: 'relative', width: '100%', maxWidth: isMobile ? '100%' : 1200, height: isMobile ? '100%' : '85vh', background: '#fff', borderRadius: isMobile ? 0 : 24, overflowY: 'auto', padding: isMobile ? 24 : 60 }}
                >
                   <button onClick={() => setCashFlowOpen(false)} style={{ marginBottom: 32, fontSize: 15, fontWeight: 700, color: C.blue, border: 'none', background: 'none', cursor: 'pointer' }}>← Done</button>
                   <h2 style={{ fontSize: 36, fontFamily: F.serif, marginBottom: 48 }}>Cash flow profile</h2>
                   <div style={{ height: 320, background: '#f8fafc', borderRadius: 20, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textSub }}>Analytical Visualization Pending</div>
                </motion.div>
             </motion.div>
           )}
        </AnimatePresence>

      </div>
    </>
  );
}
