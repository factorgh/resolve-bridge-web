'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import PortalShell from './components/PortalShell';
import { useGetDashboardMetricsQuery, useGetNewsArticlesQuery } from '@/lib/redux/api/userApi';

/* ─── Dashboard Sub-component ─────────────────────────────────────────── */

function Dashboard({ user, onCardClick, isMobile, activeTab, setActiveTab }: any) {
  const router = useRouter();
  const firstName = user?.firstName || user?.name?.split(' ')[0] || 'User';
  const { data: metricsResponse, isLoading: metricsLoading } = useGetDashboardMetricsQuery();
  const { data: newsResponse, isLoading: newsLoading } = useGetNewsArticlesQuery();
  
  const metrics = metricsResponse?.data;
  const articles = newsResponse?.data || [];

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

  /* ─── Promo & Blog Logic ─────────────────────────────────────────── */
  const PROMOS = [
    { id: 1, tag: 'EXCLUSIVE', title: '0% Interest BNPL', desc: 'Upgrade your home office today with our new tech financing partnership.', btn: 'Explore Tech Loans', color: `linear-gradient(135deg, ${C.blue}, ${C.purple})`, shadow: C.blue },
    { id: 2, tag: 'NEW', title: 'Instant Health Quote', desc: 'Get covered in 60 seconds with Enterprise Resolve Health premiums.', btn: 'Get Quote', color: `linear-gradient(135deg, ${C.emerald}, ${C.blue})`, shadow: C.emerald },
    { id: 3, tag: 'LIMITED', title: 'Stanbic High-Yield', desc: 'Unlock 14% p.a on your savings when you link your account today.', btn: 'Link Account', color: `linear-gradient(135deg, ${C.purple}, ${C.red})`, shadow: C.purple },
  ];

  const BLOG_POSTS = [
    { 
      id: 1, title: 'The state of lending in Ghana 2026', tag: 'Market Report', time: '5m read', icon: '📈', 
      content: 'As of 2026, Ghana has seen a 40% increase in digital lending adoption. Institutional lenders are now prioritizing alternative credit scoring models that factor in mobile money velocity and utility payment history.',
      url: 'https://resolvebridge.com/news/state-of-lending-2026'
    },
    { 
      id: 2, title: 'How to boost your score by 50 points', tag: 'Expert Tips', time: '3m read', icon: '⚡', 
      content: 'The fastest way to improve your Resolve Health Index is to maintain a utilization rate below 30% on your Kredete BNPL lines and ensure all mobile money repayments are made 2 days before the due date.',
      url: 'https://resolvebridge.com/edu/boost-your-score'
    },
    { 
      id: 3, title: 'Understanding mobile money repayments', tag: 'Guide', time: '4m read', icon: '📱', 
      content: 'ResolveBridge now supports automated direct debits from MTN MoMo and Vodafone Cash. This integration ensures you never miss a payment, even when you are offline.',
      url: 'https://resolvebridge.com/guides/momo-repayments'
    }
  ];

  const [promoIdx, setPromoIdx] = useState(0);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);

  const isLoading = metricsLoading || newsLoading;

  useEffect(() => {
    const timer = setInterval(() => {
      setPromoIdx(prev => (prev + 1) % PROMOS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [PROMOS.length]);

  if (isLoading) {
    return (
      <div style={{ maxWidth: 1100, margin: '0 auto', opacity: 0.8 }}>
         <div style={{ height: 44, width: 300, background: '#f1f5f9', borderRadius: 12, marginBottom: 40, animation: 'pulse 2s infinite' }} />
         <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 380px', gap: 48 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
               <div style={{ height: 300, background: '#f1f5f9', borderRadius: 32, animation: 'pulse 2s infinite' }} />
               <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 20 }}>
                  {[1,2,3].map(i => <div key={i} style={{ height: 120, background: '#f1f5f9', borderRadius: 24, animation: 'pulse 2s infinite' }} />)}
               </div>
            </div>
            <div style={{ height: 500, background: '#f1f5f9', borderRadius: 32, animation: 'pulse 2s infinite' }} />
         </div>
         <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      </div>
    );
  }

  if (metricsResponse?.success === false) {
    return (
      <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center', padding: '100px 20px' }}>
         <div style={{ fontSize: 48, marginBottom: 24 }}>🛡️</div>
         <h2 style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 12 }}>Unable to load intelligence</h2>
         <p style={{ color: C.textSub, marginBottom: 32 }}>We're having trouble connecting to your Resolve ID. Please try refreshing.</p>
         <button onClick={() => window.location.reload()} style={{ background: C.blue, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>Refresh Dashboard</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      
      {/* Blog Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? 0 : 24 }}>
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedBlog(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(13,27,62,0.6)', backdropFilter: 'blur(8px)' }} />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
               style={{ 
                 position: 'relative', width: '100%', maxWidth: 540, background: '#fff', borderRadius: isMobile ? 0 : 32, overflow: 'hidden',
                 boxShadow: '0 30px 60px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column'
               }}
             >
                <div style={{ padding: 40 }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                      <span style={{ fontSize: 11, fontWeight: 900, color: C.blue, background: C.purplePale, padding: '6px 12px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{selectedBlog.tag}</span>
                      <button onClick={() => setSelectedBlog(null)} style={{ background: '#f1f5f9', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontWeight: 900 }}>✕</button>
                   </div>
                   <h2 style={{ margin: '0 0 16px', fontSize: 24, fontWeight: 900, color: C.text, fontFamily: F.heading, lineHeight: 1.2 }}>{selectedBlog.title}</h2>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, color: C.textMuted, fontSize: 13, fontWeight: 600 }}>
                      <span>{selectedBlog.icon} Resolve Intelligence</span>
                      <span>•</span>
                      <span>{selectedBlog.readingTimeMinutes}m read</span>
                   </div>
                   <p style={{ margin: '0 0 40px', fontSize: 16, color: C.textSub, lineHeight: 1.8, fontFamily: F.body }}>{selectedBlog.content}</p>
                   <div style={{ display: 'flex', gap: 12 }}>
                      <a href={selectedBlog.externalUrl} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textDecoration: 'none', background: C.text, color: '#fff', padding: '16px', borderRadius: 16, textAlign: 'center', fontWeight: 800, fontSize: 14, transition: '0.2s' }}>Read Full Article ↗</a>
                      <button onClick={() => setSelectedBlog(null)} style={{ flex: 1, background: '#f1f5f9', color: C.textSub, border: 'none', padding: '16px', borderRadius: 16, fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>Close</button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
      
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
           style={{ minWidth: isMobile ? '100%' : 180, height: 48, background: C.text, border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer', boxShadow: '0 4px 14px rgba(13,27,62,0.1)' }}
         >
           Apply for Loan
         </button>
      </div>

       {/* Trust & Simplicity Banner */}
       <div style={{ 
         background: '#fff', 
         padding: '10px 20px', 
         borderRadius: 14, 
         border: `1.5px solid ${C.border}`,
         marginBottom: 32,
         display: 'flex',
         alignItems: 'center',
         gap: 20,
         overflow: 'hidden'
       }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
             <div style={{ width: 24, height: 24, borderRadius: '50%', background: C.emeraldLight, color: C.emerald, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>✓</div>
             <span style={{ fontSize: 11, fontWeight: 800, color: C.textSub, textTransform: 'uppercase' }}>Zero Borrower Fees</span>
          </div>
          <div style={{ width: 1, height: 16, background: C.border }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
             <div style={{ width: 24, height: 24, borderRadius: '50%', background: C.emeraldLight, color: C.emerald, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>✓</div>
             <span style={{ fontSize: 11, fontWeight: 800, color: C.textSub, textTransform: 'uppercase' }}>GH Card Verified</span>
          </div>
          <div style={{ width: 1, height: 16, background: C.border }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
             <div style={{ width: 24, height: 24, borderRadius: '50%', background: C.emeraldLight, color: C.emerald, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>✓</div>
             <span style={{ fontSize: 11, fontWeight: 800, color: C.textSub, textTransform: 'uppercase' }}>Secure Process</span>
          </div>
       </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' ? (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? '1fr' : '1fr 380px', 
              gap: isMobile ? 32 : 48,
              alignItems: 'start'
            }}>
              
              {/* Left Column: Core Stats */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                
                <motion.div whileHover={{ y: -4 }} style={{ background: '#fff', borderRadius: 32, border: `1px solid ${C.border}`, padding: isMobile ? 24 : 40, boxShadow: '0 4px 30px rgba(0,0,0,0.03)', cursor: 'pointer' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                         <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.emerald, boxShadow: `0 0 10px ${C.emerald}` }} />
                            <span style={{ fontSize: 11, fontWeight: 700, color: C.textSub, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Financial Health Index</span>
                         </div>
                         <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                            <span style={{ fontSize: isMobile ? 56 : 72, fontWeight: 400, color: C.text, fontFamily: F.heading, letterSpacing: '-0.04em' }}>{metrics?.healthIndex || 0}</span>
                            <span style={{ fontSize: 24, color: C.textMuted }}>/ 100</span>
                         </div>
                      </div>
                      <div style={{ width: isMobile ? 100 : 160, height: isMobile ? 55 : 80 }}>
                         <svg width="100%" height="100%" viewBox="0 0 100 55">
                            <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="#f1f5f9" strokeWidth="6" strokeLinecap="round" />
                            <motion.path 
                              initial={{ pathLength: 0 }} 
                              animate={{ pathLength: (metrics?.healthIndex || 0) / 100 }} 
                              transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
                              d="M10,50 A40,40 0 0,1 90,50" 
                              fill="none" stroke={C.emerald} strokeWidth="8" strokeLinecap="round" 
                            />
                         </svg>
                      </div>
                   </div>
                   <div style={{ marginTop: 32, paddingTop: 32, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ margin: 0, fontSize: 13.5, color: C.textSub }}>{metrics?.healthIndexMessage || 'Finding institutional offers...'}</p>
                      <button onClick={() => router.push('/portal/marketplace')} style={{ background: C.text, border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 12.5, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Compare Real Offers</button>
                   </div>
                </motion.div>

                {/* Quick Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 20 }}>
                   {[
                     { l: 'Cash Flow', v: `GH₵ ${metrics?.cashFlow || '0.00'}`, d: 'Available now', action: 'cashflow' },
                     { l: 'Net Worth', v: `GH₵ ${metrics?.netWorth?.toLocaleString() || '0'}`, d: '+2.4% vs Mar' },
                     { l: 'Credit Score', v: metrics?.creditScore || '---', d: 'Secure Link' }
                   ].map((stat, idx) => (
                      <motion.div 
                        key={stat.l} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + idx * 0.05 }}
                        whileHover={{ y: -4, boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}
                        onClick={() => stat.action === 'cashflow' && onCardClick('cashflow')} 
                        style={{ background: '#fff', borderRadius: 24, border: `1px solid ${C.border}`, padding: 24, cursor: 'pointer', transition: '0.2s' }}
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
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 20 }}>
                       <motion.div whileHover={{ scale: 1.01 }} onClick={() => router.push('/portal/documents')} style={{ background: '#fff', borderRadius: 24, border: `2.5px dashed ${C.borderStrong}`, padding: 24, cursor: 'pointer' }}>
                          <p style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 800, color: C.text, fontFamily: F.serif }}>Unlock a 5.2% better rate</p>
                          <p style={{ margin: '0 0 16px', fontSize: 12, color: C.textSub, lineHeight: 1.4 }}>Complete **Employment Verification** to unlock specialist rates.</p>
                          <button style={{ background: '#0d1b3e', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 11, fontWeight: 700 }}>Go to Vault</button>
                       </motion.div>
                       <motion.div whileHover={{ scale: 1.01 }} onClick={() => router.push('/portal/calculator')} style={{ background: '#fff', borderRadius: 24, border: `1px solid ${C.border}`, padding: 24, cursor: 'pointer' }}>
                          <p style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 800, color: C.text, fontFamily: F.serif }}>Loan Calculator</p>
                          <p style={{ margin: '0 0 16px', fontSize: 12, color: C.textSub, lineHeight: 1.4 }}>Estimate your monthly payments before you apply.</p>
                          <button style={{ background: C.blue, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 11, fontWeight: 700 }}>Calculate Now</button>
                       </motion.div>
                       <motion.div whileHover={{ scale: 1.01 }} onClick={() => router.push('/portal/marketplace?type=insurance')} style={{ background: '#fff', borderRadius: 24, border: `1px solid ${C.border}`, padding: 24, cursor: 'pointer' }}>
                          <p style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 800, color: C.text, fontFamily: F.serif }}>Insurance Savings</p>
                          <p style={{ margin: 0, fontSize: 12, color: C.textSub }}>Save **GH₵ 120/mo** by switching to Resolve Health.</p>
                       </motion.div>
                    </div>
                </div>
              </div>

              {/* Right Column: Promos & News */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                 
                 {/* Promo Carousel */}
                 <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                       <h3 style={{ margin: 0, fontSize: 12, fontWeight: 900, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Featured Opportunities</h3>
                       <div style={{ display: 'flex', gap: 4 }}>
                          {PROMOS.map((_, i) => (
                             <div key={i} style={{ width: 12, height: 4, borderRadius: 2, background: i === promoIdx ? C.blue : C.border, transition: '0.3s' }} />
                          ))}
                       </div>
                    </div>
                    
                    <div style={{ height: 220, position: 'relative' }}>
                       <AnimatePresence mode="wait">
                          <motion.div 
                            key={promoIdx}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: 'circOut' }}
                            whileHover={{ scale: 1.01 }}
                            style={{ 
                              position: 'absolute', inset: 0,
                              background: PROMOS[promoIdx].color, 
                              borderRadius: 28, padding: 32, color: '#fff', boxShadow: `0 20px 40px ${PROMOS[promoIdx].shadow}44`,
                              overflow: 'hidden', cursor: 'pointer'
                            }}
                          >
                             <span style={{ fontSize: 10, fontWeight: 900, background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: 20, marginBottom: 16, display: 'inline-block', textTransform: 'uppercase' }}>{PROMOS[promoIdx].tag}</span>
                             <h4 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 900, fontFamily: F.heading }}>{PROMOS[promoIdx].title}</h4>
                             <p style={{ margin: '0 0 24px', fontSize: 13, opacity: 0.8, lineHeight: 1.4, maxWidth: '80%' }}>{PROMOS[promoIdx].desc}</p>
                             <button style={{ background: '#fff', color: PROMOS[promoIdx].shadow, border: 'none', borderRadius: 12, padding: '10px 20px', fontSize: 12, fontWeight: 800 }}>{PROMOS[promoIdx].btn}</button>
                          </motion.div>
                       </AnimatePresence>
                    </div>
                    <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                       {articles && articles.length > 0 ? (
                         articles.slice(0, 3).map((blog: any) => (
                          <motion.div 
                            key={blog.id}
                            whileHover={{ x: 6, background: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}
                            onClick={() => setSelectedBlog(blog)}
                            style={{ 
                              padding: 16, borderRadius: 20, border: `1px solid ${C.border}`, 
                              display: 'flex', gap: 16, alignItems: 'center', cursor: 'pointer', transition: '0.2s',
                              background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(10px)'
                            }}
                          >
                             <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fff', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                                {blog.icon}
                             </div>
                             <div style={{ flex: 1 }}>
                                <span style={{ fontSize: 9, fontWeight: 800, color: C.blue, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{blog.tag}</span>
                                <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 800, color: C.text, lineHeight: 1.3 }}>{blog.title}</p>
                             </div>
                          </motion.div>
                         ))
                       ) : (
                         <div style={{ textAlign: 'start', padding: '20px 0' }}>
                            <img src="/customer/empty-news.png" alt="No news" style={{ width: '100%', maxWidth: 300, marginBottom: 16, opacity: 0.8 }} />
                            <p style={{ fontSize: 13, color: C.textSub, fontWeight: 600 }}>Stay tuned for market intelligence.</p>
                         </div>
                       )}
                    </div>
                  </div>
                  {/* Institutional Verification Badge */}
                  <div style={{ background: C.emeraldLight, padding: 24, borderRadius: 24, display: 'flex', alignItems: 'center', gap: 12, border: `1px solid ${C.emerald}22` }}>
                     <div style={{ fontSize: 24 }}>🛡️</div>
                     <div>
                        <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: C.emerald }}>Grade A Security</p>
                        <p style={{ margin: 0, fontSize: 11, color: C.textSub }}>Your data is protected by 256-bit encryption.</p>
                     </div>
                  </div>
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
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr', gap: 32 }}>
                   {/* Velocity Chart */}
                   <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ background: '#fff', borderRadius: 32, border: `1px solid ${C.border}`, padding: 32 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                         <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: C.text, fontFamily: F.heading }}>Credit Velocity</h3>
                         <div style={{ display: 'flex', background: C.bg, borderRadius: 8, padding: 4 }}>
                            {['6m', '1y'].map(t => <button key={t} style={{ border: 'none', background: t === '6m' ? '#fff' : 'transparent', padding: '4px 12px', fontSize: 10, fontWeight: 800, color: t === '6m' ? C.blue : C.textMuted, borderRadius: 6, boxShadow: t === '6m' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>{t}</button>)}
                         </div>
                      </div>
                      <div style={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: isMobile ? 8 : 16, paddingBottom: 24 }}>
                         {metrics?.velocityData && metrics.velocityData.length > 0 ? (
                            metrics.velocityData.map((d: any, i: number) => (
                               <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                                  <motion.div 
                                    initial={{ height: 0 }} animate={{ height: `${d.value}%` }} transition={{ delay: i * 0.1, duration: 1, ease: 'circOut' }}
                                    style={{ width: '100%', background: `linear-gradient(to top, ${C.blue}, ${C.blue}88)`, borderRadius: '4px 4px 2px 2px' }} 
                                  />
                                  <span style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase' }}>{d.label}</span>
                               </div>
                            ))
                         ) : (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, height: '100%' }}>
                               <div style={{ fontSize: 32, opacity: 0.3 }}>📊</div>
                               <p style={{ margin: 0, fontSize: 13, color: C.textMuted, fontWeight: 600 }}>Velocity data arriving soon</p>
                            </div>
                         )}
                      </div>
                   </motion.div>

                   {/* Health Factors */}
                   <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ background: '#fff', borderRadius: 32, border: `1px solid ${C.border}`, padding: 32 }}>
                      <h3 style={{ margin: '0 0 32px', fontSize: 16, fontWeight: 800, color: C.text, fontFamily: F.heading }}>Health Factors</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                         {metrics?.healthFactors && metrics.healthFactors.length > 0 ? (
                            metrics.healthFactors.map((f: any) => (
                               <div key={f.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: 13, fontWeight: 700, color: C.textSub }}>{f.name}</span>
                                  <span style={{ fontSize: 12, fontWeight: 800, color: f.color }}>{f.status}</span>
                               </div>
                            ))
                         ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, paddingTop: 20, paddingBottom: 20 }}>
                               <div style={{ fontSize: 32, opacity: 0.3 }}>🛡️</div>
                               <p style={{ margin: 0, fontSize: 13, color: C.textMuted, fontWeight: 600, textAlign: 'center' }}>Connect your first account to view health factors.</p>
                            </div>
                         )}
                      </div>
                   </motion.div>
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
       <div style={{ position: 'relative' }}>
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
       </div>
    </PortalShell>
  );
}
