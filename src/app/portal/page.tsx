'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import PortalShell from './components/PortalShell';

/* ─── Dashboard Sub-component ─────────────────────────────────────────── */

function Dashboard({ user, onCardClick, isMobile, activeTab, setActiveTab }: any) {
  const router = useRouter();
  const firstName = user?.name?.split(' ')[0] || 'User';

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
    red: '#ef4444',
    purple: '#7c3aed',
    purplePale: 'rgba(124,58,237,0.08)'
  };

  const F = {
    heading: "'Plus Jakarta Sans', system-ui, sans-serif",
    body: "'Inter', sans-serif",
    serif: "'Playfair Display', serif",
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ 
        display: 'flex', flexDirection: isMobile ? 'column' : 'row', 
        justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', 
        marginBottom: isMobile ? 32 : 44, gap: isMobile ? 24 : 0 
      }}>
         <div>
            <h1 style={{ margin: 0, fontSize: isMobile ? 28 : 42, fontWeight: 400, color: C.text, fontFamily: F.serif }}>
               {user ? `Good afternoon, ${firstName}` : 'Welcome back'}
            </h1>
            <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
               {['Overview', 'Performance'].map((t) => {
                 const active = activeTab === t.toLowerCase();
                 return (
                   <button 
                     key={t} 
                     onClick={() => setActiveTab(t.toLowerCase())}
                     style={{ 
                       background: 'none', border: 'none', padding: '0 0 8px 0', fontSize: 13, fontWeight: 700, 
                       color: active ? C.emerald : C.textMuted, 
                       borderBottom: active ? `2px solid ${C.emerald}` : 'none',
                       cursor: 'pointer', transition: '0.2s'
                     }}
                   >
                     {t}
                   </button>
                 );
               })}
            </div>
         </div>
         <button 
           onClick={() => router.push('/portal/apply-loan')}
           style={{ minWidth: isMobile ? '100%' : 180, height: 48, background: C.emerald, border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,134,82,0.2)' }}
         >
           Apply for Loan
         </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' ? (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 340px', gap: isMobile ? 32 : 48 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
              
              {/* Health Index Hero */}
              <motion.div whileHover={{ y: -4 }} style={{ background: '#fff', borderRadius: 24, border: `1px solid ${C.border}`, padding: isMobile ? 24 : 40, boxShadow: '0 4px 30px rgba(0,0,0,0.03)', cursor: 'pointer' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.emerald, boxShadow: `0 0 10px ${C.emerald}` }} />
                          <span style={{ fontSize: 11, fontWeight: 700, color: C.textSub, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Financial Health Index</span>
                       </div>
                       <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                          <span style={{ fontSize: isMobile ? 56 : 84, fontWeight: 400, color: C.text, fontFamily: F.heading, letterSpacing: '-0.04em' }}>70</span>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                             <span style={{ fontSize: 28, color: C.textMuted, lineHeight: 1 }}>/ 100</span>
                          </div>
                       </div>
                    </div>
                    <div style={{ width: isMobile ? 120 : 200, height: isMobile ? 65 : 100 }}>
                       <svg width="100%" height="100%" viewBox="0 0 100 55">
                          <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="#f1f5f9" strokeWidth="6" strokeLinecap="round" />
                          <motion.path 
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 0.7 }}
                            transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
                            d="M10,50 A40,40 0 0,1 78,16" fill="none" stroke={C.emerald} strokeWidth="8" strokeLinecap="round" 
                          />
                       </svg>
                    </div>
                 </div>
                 <div style={{ marginTop: 32, paddingTop: 32, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ margin: 0, fontSize: 13.5, color: C.textSub }}>You are eligible for <span style={{ color: C.blue, fontWeight: 700 }}>3 premium institutional offers</span>.</p>
                    <button onClick={() => router.push('/portal/marketplace')} style={{ background: '#f8fafc', border: `1.5px solid ${C.borderStrong}`, borderRadius: 10, padding: '8px 16px', fontSize: 12.5, fontWeight: 700, color: C.text, cursor: 'pointer' }}>View Marketplace</button>
                 </div>
              </motion.div>

              {/* Quick Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 20 }}>
                 {[
                   { l: 'Cash Flow', v: 'GH₵ 21.19', d: 'Available now', action: 'cashflow' },
                   { l: 'Net Worth', v: 'GH₵ 41,619', d: '+2.4% vs Mar' },
                   { l: 'Credit Score', v: '818', d: 'Secure Link' }
                 ].map((stat, idx) => (
                    <motion.div 
                      key={stat.l} 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                      whileHover={{ y: -4, boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}
                      onClick={() => stat.action === 'cashflow' && onCardClick('cashflow')} 
                      style={{ background: '#fff', borderRadius: 20, border: `1px solid ${C.border}`, padding: 24, cursor: 'pointer', transition: '0.2s' }}
                    >
                       <p style={{ margin: '0 0 16px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.l}</p>
                       <p style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 400, color: C.text }}>{stat.v}</p>
                       <span style={{ fontSize: 11, fontWeight: 700, color: C.emerald }}>{stat.d}</span>
                    </motion.div>
                 ))}
              </div>

              {/* Advisory Intelligence */}
              <div>
                  <h3 style={{ margin: '0 0 20px', fontSize: 13, fontWeight: 800, color: C.textSub, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Advisory Intelligence</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: 20 }}>
                     <motion.div whileHover={{ scale: 1.01 }} onClick={() => router.push('/portal/documents')} style={{ background: '#fff', borderRadius: 24, border: `2.5px dashed ${C.borderStrong}`, padding: 28, cursor: 'pointer' }}>
                        <p style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 800, color: C.text, fontFamily: F.serif }}>Unlock a 5.2% better loan rate</p>
                        <p style={{ margin: '0 0 24px', fontSize: 13.5, color: C.textSub, lineHeight: 1.5 }}>Complete your **Employment Verification** in the Vault to unlock specialist rates.</p>
                        <button style={{ background: '#0d1b3e', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 12, fontWeight: 700 }}>Go to Vault</button>
                     </motion.div>
                     <motion.div whileHover={{ scale: 1.01 }} onClick={() => router.push('/portal/marketplace?type=insurance')} style={{ background: C.emeraldLight, borderRadius: 24, padding: 28, cursor: 'pointer' }}>
                        <p style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 800, color: C.text, fontFamily: F.serif }}>Insurance Savings</p>
                        <p style={{ margin: 0, fontSize: 13, color: C.textSub }}>You could save **GH₵ 120/mo** by switching to Resolve Health.</p>
                     </motion.div>
                  </div>
              </div>
            </div>

            {/* Recommendations Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
               <motion.div 
                 initial={{ x: 20, opacity: 0 }} 
                 animate={{ x: 0, opacity: 1 }} 
                 style={{ background: '#fff', borderRadius: 24, border: `1px solid ${C.border}`, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}
               >
                  <h3 style={{ margin: '0 0 24px', fontSize: 18, fontWeight: 900, color: C.text, fontFamily: F.heading }}>Daily Matches</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                     {[
                       { id: 'l1', provider: 'Stanbic Bank', name: 'Personal Loan', rate: '22% p.a', logo: '/stanbic_logo.png', cat: 'loan' },
                       { id: 'i1', provider: 'Enterprise', name: 'Auto Premium', rate: 'GH₵ 85/mo', logo: '/resolve_icon.png', cat: 'insurance' },
                       { id: 'b1', provider: 'Kredete', name: 'Shop Now Pay Later', rate: '0% Interest', logo: '/kredete_logo.png', cat: 'bnpl' }
                     ].map((item, idx) => (
                       <motion.div 
                         key={item.id}
                         whileHover={{ x: 4 }}
                         onClick={() => router.push(`/portal/apply-${item.cat}?provider=${encodeURIComponent(item.provider)}`)}
                         style={{ 
                           display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', 
                           borderBottom: idx === 2 ? 'none' : `1px solid ${C.border}`, 
                           cursor: 'pointer' 
                         }}
                       >
                          <div style={{ width: 40, height: 40, borderRadius: 12, background: '#fff', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 4 }}>
                             <img src={item.logo} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                             <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: C.text }}>{item.provider}</p>
                             <p style={{ margin: 0, fontSize: 11, color: C.textMuted }}>{item.name}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                             <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: C.emerald }}>{item.rate}</p>
                             <span style={{ fontSize: 9, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Qualified</span>
                          </div>
                       </motion.div>
                     ))}
                  </div>
                  <button 
                    onClick={() => router.push('/portal/marketplace')}
                    style={{ 
                      width: '100%', marginTop: 24, padding: '12px', borderRadius: 12, border: `1.5px solid ${C.purplePale}`, 
                      background: 'transparent', color: C.blue, fontSize: 12, fontWeight: 800, cursor: 'pointer', transition: '0.2s' 
                    }}
                    onMouseOver={e => e.currentTarget.style.background = C.purplePale}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  >
                     Explore Marketplace →
                  </button>
               </motion.div>

               {/* Institutional Badge */}
               <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 transition={{ delay: 0.8 }}
                 style={{ background: C.emeraldLight, padding: 24, borderRadius: 20, display: 'flex', alignItems: 'center', gap: 12 }}
               >
                  <div style={{ fontSize: 24 }}>✨</div>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: C.emerald, lineHeight: 1.4 }}>Your institutional ranking is in the **Top 5%** of early adopters.</p>
               </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="performance"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 32 }}
          >
             <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: 32 }}>
                
                {/* Credit Velocity Chart */}
                <div style={{ background: '#fff', borderRadius: 24, border: `1px solid ${C.border}`, padding: 32 }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: C.text, fontFamily: F.heading }}>Credit Velocity</h3>
                      <div style={{ display: 'flex', gap: 8 }}>
                         {['6m', '1y'].map(t => <span key={t} style={{ fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 4, background: t === '6m' ? C.emeraldLight : 'transparent', color: t === '6m' ? C.blue : C.textMuted }}>{t}</span>)}
                      </div>
                   </div>
                   <div style={{ height: 200, width: '100%', position: 'relative' }}>
                      <svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none">
                         <motion.path 
                           initial={{ pathLength: 0 }}
                           animate={{ pathLength: 1 }}
                           transition={{ duration: 2, ease: "easeInOut" }}
                           d="M0,80 L50,75 L100,50 L150,60 L200,30 L250,35 L300,10 L400,5" 
                           fill="none" stroke={C.blue} strokeWidth="3" 
                         />
                      </svg>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                         {['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'].map(m => <span key={m} style={{ fontSize: 10, fontWeight: 700, color: C.textMuted }}>{m}</span>)}
                      </div>
                   </div>
                </div>

                {/* Score Breakdown */}
                <div style={{ background: '#fff', borderRadius: 24, border: `1px solid ${C.border}`, padding: 32 }}>
                   <h3 style={{ margin: '0 0 24px', fontSize: 18, fontWeight: 900, color: C.text, fontFamily: F.heading }}>Health Factors</h3>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      {[
                        { l: 'Payment History', v: 'Exceptional', c: C.emerald },
                        { l: 'Credit Age', v: 'Good', c: C.blue },
                        { l: 'Inquiries', v: 'Excellent', c: C.emerald },
                      ].map(f => (
                        <div key={f.l}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                              <span style={{ fontSize: 12, color: C.textSub }}>{f.l}</span>
                              <span style={{ fontSize: 12, fontWeight: 800, color: f.c }}>{f.v}</span>
                           </div>
                           <div style={{ height: 4, background: '#f1f5f9', borderRadius: 2 }} />
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             <div style={{ background: C.purple, borderRadius: 24, padding: isMobile ? 32 : 48, color: '#fff', textAlign: 'center' }}>
                <div style={{ maxWidth: 600, marginInline: 'auto' }}>
                   <h3 style={{ margin: '0 0 16px', fontSize: isMobile ? 24 : 32, fontWeight: 300, fontFamily: F.serif }}>The Path to 850</h3>
                   <p style={{ margin: '0 0 32px', fontSize: 14.5, opacity: 0.7, lineHeight: 1.6 }}>By maintaining your current spending patterns for **3 more months**, ResolveBridge predicts your Score will reach the **Institutional Tier (820+)**.</p>
                   <button style={{ background: C.blue, color: '#fff', border: 'none', borderRadius: 12, padding: '14px 32px', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>View Advanced Insights</button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main Portal Controller ───────────────────────────────────────────── */

export default function PortalPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
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

  if (!mounted) return null;

  return (
    <PortalShell title="Command Center" subtitle="Institutional Financial Intelligence">
       <Dashboard 
         user={user} 
         onCardClick={() => setCashFlowOpen(true)} 
         isMobile={isMobile} 
         activeTab={activeTab}
         setActiveTab={setActiveTab}
       />
       
       <AnimatePresence>
          {cashFlowOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? 0 : 40 }}>
               <div onClick={() => setCashFlowOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(13,27,62,0.9)', backdropFilter: 'blur(10px)' }} />
               <motion.div initial={{ y: isMobile ? '100%' : 80 }} animate={{ y: 0 }} exit={{ y: isMobile ? '100%' : 80 }} 
                 style={{ position: 'relative', width: '100%', maxWidth: isMobile ? '100%' : 1200, height: isMobile ? '100%' : '85vh', background: '#fff', borderRadius: isMobile ? 0 : 24, overflowY: 'auto', padding: isMobile ? 24 : 60, fontFamily: 'sans-serif' }}
               >
                  <button onClick={() => setCashFlowOpen(false)} style={{ marginBottom: 32, fontSize: 15, fontWeight: 700, color: '#2051e5', border: 'none', background: 'none', cursor: 'pointer' }}>← Done</button>
                  <h2 style={{ fontSize: 36, marginBottom: 48 }}>Cash flow profile</h2>
                  <div style={{ height: 320, background: '#f8fafc', borderRadius: 20, border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Analytical Visualization Pending</div>
               </motion.div>
            </motion.div>
          )}
       </AnimatePresence>
    </PortalShell>
  );
}
