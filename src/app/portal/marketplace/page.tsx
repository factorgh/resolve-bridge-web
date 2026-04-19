'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import PortalShell, { C, F } from '../components/PortalShell';

/* ─── Product Models ─────────────────────────────────────────────────────── */

const CATEGORIES = [
  { id: 'loan', label: 'Loans', icon: '🏦' },
  { id: 'insurance', label: 'Insurance', icon: '🛡️' },
  { id: 'bnpl', label: 'Shop Now', icon: '🛒' },
];

const PRODUCTS = {
  loan: [
    { id: 'l1', provider: 'Stanbic Bank', name: 'Personal Loan', rate: '22% p.a', minScore: 650, trust: 98, perks: ['No collateral', 'Quick approval'], logo: '/stanbic_logo.png' },
    { id: 'l2', provider: 'Absa Ghana', name: 'FlexiLoan', rate: '19.5% p.a', minScore: 720, trust: 96, perks: ['Switch & Save', 'Interest rebate'], logo: '/absa_logo.png' },
    { id: 'l3', provider: 'Fidelity Bank', name: 'Smart Credit', rate: '24% p.a', minScore: 600, trust: 94, perks: ['Same-day funding'], logo: '/fidelity_logo.png' },
  ],
  insurance: [
    { id: 'i1', provider: 'Enterprise', name: 'Comprehensive Auto', rate: 'GH₵ 85/mo', minScore: 0, trust: 99, perks: ['Free tracking', 'Roadside assist'], logo: '/resolve_icon.png' },
    { id: 'i2', provider: 'Old Mutual', name: 'Premium Life', rate: 'GH₵ 120/mo', minScore: 0, trust: 97, perks: ['Cash back', 'Family cover'], logo: '/old_mutual_logo.png' },
  ],
  bnpl: [
    { id: 'b1', provider: 'Kredete', name: 'Electronics Plan', rate: '0% Interest', minScore: 680, trust: 92, perks: ['3-month split'], logo: '/kredete_logo.png' },
  ]
};

/* ─── Marketplace Component ────────────────────────────────────────────── */

export default function MarketplacePage() {
  const [activeCat, setActiveCat] = useState('loan');
  const [userScore] = useState(700); // Mock score from dashboard
  const [search, setSearch] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filtered = (PRODUCTS[activeCat as keyof typeof PRODUCTS] || []).filter(p => 
    p.provider.toLowerCase().includes(search.toLowerCase()) || 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PortalShell title="Marketplace" backHref="/portal">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 16px 120px' : '0 24px 80px' }}>
        
        {/* Header Section */}
        <div style={{ marginBottom: isMobile ? 32 : 56, marginTop: isMobile ? 12 : 0 }}>
           <h1 style={{ margin: '0 0 8px', fontSize: isMobile ? 26 : 40, fontWeight: 900, color: C.text, fontFamily: F.heading, letterSpacing: '-0.04em' }}>Marketplace</h1>
           <p style={{ margin: 0, fontSize: isMobile ? 14 : 16, color: C.textMuted, lineHeight: 1.5 }}>Universal access to premium financial products across Africa.</p>
        </div>

        {/* Filters & Search Row */}
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', gap: isMobile ? 24 : 32, marginBottom: isMobile ? 32 : 56 }}>
           <div style={{ 
             display: 'flex', 
             background: '#f1f5f9',
             padding: 4,
             borderRadius: 14,
             gap: 4, 
             flex: isMobile ? 'none' : 1
           }}>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat.id} 
                  onClick={() => setActiveCat(cat.id)}
                  style={{
                    flex: 1,
                    padding: isMobile ? '10px 12px' : '12px 20px', borderRadius: 10, border: 'none', 
                    background: activeCat === cat.id ? '#fff' : 'transparent',
                    color: activeCat === cat.id ? C.blue : C.textSub,
                    fontWeight: 700, fontSize: isMobile ? 13 : 14, cursor: 'pointer', transition: '0.2s',
                    whiteSpace: 'nowrap', boxShadow: activeCat === cat.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                  }}
                >
                  <span style={{ fontSize: isMobile ? 16 : 18 }}>{cat.icon}</span> {!isMobile && cat.label}
                </button>
              ))}
           </div>
           
           <div style={{ position: 'relative', flex: isMobile ? 'none' : 2 }}>
              <input 
                type="text" 
                placeholder="Search providers or products..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%', padding: isMobile ? '14px 16px 14px 44px' : '16px 20px 16px 52px', borderRadius: 16, border: `1.5px solid ${C.border}`,
                  fontSize: 15, outline: 'none', background: '#fff', color: C.text, boxSizing: 'border-box', transition: 'border-color 0.2s'
                }} 
                onFocus={e => e.currentTarget.style.borderColor = C.blue}
                onBlur={e => e.currentTarget.style.borderColor = C.border}
              />
              <svg style={{ position: 'absolute', left: isMobile ? 16 : 20, top: '50%', transform: 'translateY(-50%)', color: C.textSub }} width={isMobile ? 18 : 20} height={isMobile ? 18 : 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
           </div>
        </div>

        {/* Results Matrix */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? '100%' : '340px'}, 1fr))`, gap: isMobile ? 16 : 28 }}>
           <AnimatePresence mode="popLayout">
              {filtered.map((prod, idx) => {
                const isQualified = prod.minScore === 0 || userScore >= prod.minScore;
                
                return (
                  <motion.div 
                    key={prod.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: isMobile ? 0 : -8 }}
                    transition={{ delay: idx * 0.05 }}
                    style={{ 
                      background: '#fff', 
                      borderRadius: 28, 
                      border: `1px solid ${C.border}`, 
                      padding: isMobile ? 24 : 32, 
                      position: 'relative', 
                      display: 'flex', 
                      flexDirection: 'column',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                      transition: 'box-shadow 0.3s'
                    }}
                  >
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                        <div>
                           <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                              <span style={{ fontSize: 13, fontWeight: 800, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{prod.provider}</span>
                              {prod.trust > 95 && <svg width="14" height="14" viewBox="0 0 24 24" fill={C.blue} style={{ opacity: 0.8 }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}
                           </div>
                           <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: C.text, fontFamily: F.heading, letterSpacing: '-0.02em' }}>{prod.name}</p>
                        </div>
                        <div style={{ width: 48, height: 48, background: '#f8fafc', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8, border: `1px solid ${C.border}` }}>
                           <img src={prod.logo} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        </div>
                     </div>

                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28, background: '#f8fafc', padding: 16, borderRadius: 16 }}>
                        <div>
                           <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Starting From</p>
                           <p style={{ margin: 0, fontSize: 16, fontWeight: 900, color: C.blueLight }}>{prod.rate}</p>
                        </div>
                        <div>
                           <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Trust Score</p>
                           <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <div style={{ flex: 1, height: 4, background: C.border, borderRadius: 2 }}>
                                 <div style={{ width: `${prod.trust}%`, height: '100%', background: C.blue, borderRadius: 2 }} />
                              </div>
                              <span style={{ fontSize: 13, fontWeight: 800, color: C.text }}>{prod.trust}%</span>
                           </div>
                        </div>
                     </div>

                     <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                        {prod.perks.map((p, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: C.textSub, fontWeight: 500 }}>
                             <div style={{ width: 18, height: 18, borderRadius: '50%', background: C.blueLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.blueLight} strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>
                             </div>
                             {p}
                          </div>
                        ))}
                     </div>

                     <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', gap: 16, marginTop: 'auto' }}>
                        <Link 
                          href={`/portal/apply-${activeCat}?provider=${encodeURIComponent(prod.provider)}`} 
                          style={{ 
                            flex: 1, textDecoration: 'none', background: isQualified ? C.sidebar : C.border, color: '#fff', 
                            padding: '14px 20px', borderRadius: 14, fontSize: 14, fontWeight: 800, textAlign: 'center',
                            boxShadow: isQualified ? '0 10px 20px rgba(13,27,62,0.1)' : 'none', transition: 'all 0.2s',
                            cursor: isQualified ? 'pointer' : 'not-allowed'
                          }}
                        >
                           {isQualified ? 'Apply Now' : 'Not Qualified'}
                        </Link>
                        {!isQualified && (
                          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: C.textMuted, textAlign: 'center' }}>Requires {prod.minScore} Score</p>
                        )}
                     </div>
                  </motion.div>
                );
              })}
           </AnimatePresence>
        </div>

        {/* Advisory Footer */}
        {activeCat === 'loan' && (
           <div style={{ marginTop: 64, padding: isMobile ? 24 : 40, borderRadius: 32, background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', border: `1px solid ${C.border}`, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>🚀</div>
              <h3 style={{ margin: '0 0 12px', fontSize: isMobile ? 20 : 24, fontWeight: 900, color: C.text, fontFamily: F.heading }}>Optimize your rates</h3>
              <p style={{ margin: '0 0 28px', fontSize: 15, color: C.textSub, lineHeight: 1.6, maxWidth: 600, marginInline: 'auto' }}>Improve your **Financial Health Index** to 750 to unlock rates as low as **17.5% p.a**.</p>
              <button style={{ background: C.sidebar, border: 'none', color: '#fff', padding: '14px 32px', borderRadius: 14, fontSize: 14, fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>Start Health Roadmap</button>
           </div>
        )}

      </div>
    </PortalShell>
  );
}
