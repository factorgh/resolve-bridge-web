'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import PortalShell, { C, F } from '../components/PortalShell';
import { 
  LocalOfferRounded, 
  VerifiedUserRounded, 
  SearchRounded, 
  FilterListRounded,
  AccountBalanceRounded,
  ShieldRounded,
  ShoppingCartRounded,
  TrendingUpRounded,
  StarRounded,
  InfoOutlined,
  GridViewRounded,
  ViewStreamRounded,
  CloseRounded,
  VerifiedRounded,
  HistoryRounded
} from '@mui/icons-material';
import { Drawer, Box, Typography, IconButton } from '@mui/material';

/* ─── Mock Data for Real-World Feel ───────────────────────────────────────── */

const FALLBACK_PRODUCTS = [
  { id: 'p1', name: 'Elite Personal Loan', provider: 'Stanbic Bank', cat: 'loan', rate: 12.5, trust: 98, match: 96, logo: '/stanbic_logo.png', tag: 'Best Match', desc: 'Pre-approved for your salary tier' },
  { id: 'p2', name: 'Comprehensive Auto+', provider: 'Enterprise', cat: 'insurance', rate: 85, rateSuffix: '/mo', trust: 94, match: 92, logo: '/resolve_icon.png', tag: 'Fast Issue', desc: 'Instant policy generation' },
  { id: 'p3', name: 'Tech BNPL Plan', provider: 'Kredete', cat: 'bnpl', rate: 0, trust: 92, match: 89, logo: '/kredete_logo.png', tag: 'Zero Interest', desc: 'Buy now, pay over 6 months' },
  { id: 'p4', name: 'Business Growth Fund', provider: 'Fidelity Bank', cat: 'loan', rate: 14.2, trust: 96, match: 85, logo: '/resolve_icon.png', tag: 'SME Choice', desc: 'Flexible capital for expansion' },
  { id: 'p5', name: 'Health Secure Gold', provider: 'Star Assurance', cat: 'insurance', rate: 120, rateSuffix: '/mo', trust: 95, match: 88, logo: '/resolve_icon.png', tag: 'Premium', desc: 'Top-tier family coverage' },
  { id: 'p6', name: 'Home Reno Credit', provider: 'Absa Bank', cat: 'loan', rate: 11.8, trust: 97, match: 84, logo: '/resolve_icon.png', tag: 'Low Rate', desc: 'Transform your living space' },
];

/* ─── Components ─────────────────────────────────────────────────────────── */

const ProductCard = ({ prod, viewMode }: { prod: any, viewMode: 'grid' | 'list' }) => {
  const isList = viewMode === 'list';
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}
      style={{
        background: '#fff',
        borderRadius: 32,
        border: `1px solid ${C.border}`,
        padding: isList ? '24px 32px' : '32px',
        display: 'flex',
        flexDirection: isList ? 'row' : 'column',
        alignItems: isList ? 'center' : 'stretch',
        gap: isList ? 32 : 24,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Premium Tag */}
      {prod.tag && (
        <div style={{ 
          position: 'absolute', top: 0, right: 0, 
          background: `linear-gradient(135deg, ${C.blue} 0%, ${C.blueLight} 100%)`,
          color: '#fff', padding: '6px 16px', borderRadius: '0 0 0 20px',
          fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em'
        }}>
          {prod.tag}
        </div>
      )}

      {/* Identity Area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ 
          width: 64, height: 64, background: '#f8fafc', borderRadius: 20, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          padding: 12, border: `1px solid ${C.border}`, flexShrink: 0,
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
        }}>
          <img src={prod.logo} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 800, color: C.textSub, textTransform: 'uppercase' }}>{prod.provider}</p>
          <h4 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: C.text, fontFamily: F.heading }}>{prod.name}</h4>
        </div>
      </div>

      {/* Info Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 20, border: `1px solid ${C.border}` }}>
           <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>
              {prod.cat === 'loan' ? 'APR' : prod.cat === 'insurance' ? 'Premium' : 'Interest'}
           </p>
           <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: C.blue }}>{prod.rate}{prod.rateSuffix || '%'}</p>
        </div>
        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 20, border: `1px solid ${C.border}` }}>
           <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Trust Match</p>
           <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <StarRounded sx={{ fontSize: 18, color: C.amber }} />
              <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: C.text }}>{prod.match}%</p>
           </div>
        </div>
      </div>

      {!isList && (
        <p style={{ margin: 0, fontSize: 13, color: C.textSub, lineHeight: 1.6 }}>{prod.desc}</p>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, marginTop: isList ? 0 : 'auto' }}>
        <Link href={`/portal/apply-${prod.cat}`} style={{ 
          textDecoration: 'none', background: C.text, color: '#fff', 
          padding: '16px', borderRadius: 16, fontSize: 14, fontWeight: 800,
          flex: 2, textAlign: 'center', transition: '0.2s'
        }}>
          Instant Apply
        </Link>
        <button 
          onClick={() => (window as any).openProductDetails(prod)}
          style={{ 
            flex: 1, background: '#fff', border: `2px solid ${C.border}`, 
            color: C.textSub, padding: '16px', borderRadius: 16, 
            fontSize: 14, fontWeight: 800, cursor: 'pointer' 
          }}
        >
          Details
        </button>
      </div>
    </motion.div>
  );
};

export default function MarketplacePage() {
  const [activeCat, setActiveCat] = useState('loan');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('trust');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) setShowFilters(false);
      else setShowFilters(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Global bridge for component-to-page communication
    (window as any).openProductDetails = (prod: any) => setSelectedProduct(prod);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredProducts = useMemo(() => {
    return FALLBACK_PRODUCTS.filter(p => {
      const catMatch = activeCat === 'all' || p.cat === activeCat;
      const searchMatch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.provider.toLowerCase().includes(search.toLowerCase());
      return catMatch && searchMatch;
    }).sort((a, b) => {
      if (sortBy === 'rate') return a.rate - b.rate;
      return b.trust - a.trust;
    });
  }, [activeCat, search, sortBy]);

  return (
    <PortalShell title="Marketplace" backHref="/portal">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 16px 100px' : '0 24px 100px' }}>
        
        {/* Transparent Banner */}
        <div style={{ 
          background: `${C.emerald}08`, padding: '12px 24px', borderRadius: 16, border: `1px solid ${C.emerald}22`,
          marginBottom: 40, display: 'flex', alignItems: 'center', gap: 12, color: C.emerald
        }}>
           <VerifiedUserRounded sx={{ fontSize: 18 }} />
           <p style={{ margin: 0, fontSize: 12, fontWeight: 700 }}>
             <strong style={{ textTransform: 'uppercase', marginRight: 8 }}>Transparency Protocol:</strong> 
             Zero borrower fees. We are compensated by institutional partners to ensure your lowest rate.
           </p>
        </div>

        {/* Discovery Hub Header */}
        <div style={{ marginBottom: 48 }}>
           <h1 style={{ margin: '0 0 12px', fontSize: isMobile ? 32 : 44, fontWeight: 900, color: C.text, fontFamily: F.heading }}>Marketplace Hub</h1>
           <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {[
                { id: 'loan', label: 'Lending', icon: <AccountBalanceRounded sx={{ fontSize: 18 }} /> },
                { id: 'insurance', label: 'Insurance', icon: <ShieldRounded sx={{ fontSize: 18 }} /> },
                { id: 'bnpl', label: 'Shop Now', icon: <ShoppingCartRounded sx={{ fontSize: 18 }} /> },
              ].map(cat => (
                <button 
                  key={cat.id} 
                  onClick={() => setActiveCat(cat.id)}
                  style={{ 
                    padding: '14px 24px', borderRadius: 20, border: 'none', 
                    background: activeCat === cat.id ? C.text : '#fff', 
                    color: activeCat === cat.id ? '#fff' : C.textSub,
                    boxShadow: activeCat === cat.id ? `0 10px 20px rgba(0,0,0,0.1)` : `0 4px 12px rgba(0,0,0,0.03)`,
                    fontSize: 14, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', transition: '0.2s'
                  }}
                >
                   {cat.icon}
                   {cat.label}
                </button>
              ))}
           </div>
        </div>

        {/* Modern Search & Tool Area */}
        <div style={{ 
          display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 16, marginBottom: 48,
          position: 'sticky', top: 80, zIndex: 100, background: 'rgba(240,242,248,0.9)', backdropFilter: 'blur(16px)', padding: '12px 0'
        }}>
           <div style={{ position: 'relative', flex: 1 }}>
              <input 
                type="text" placeholder="Search institutional products..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ 
                  width: '100%', padding: '16px 20px 16px 52px', borderRadius: 20, border: `2px solid ${C.border}`, 
                  outline: 'none', fontSize: 15, fontFamily: F.body, background: '#fff', boxSizing: 'border-box'
                }}
              />
              <SearchRounded sx={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: C.textMuted }} />
           </div>

           <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ background: '#fff', padding: 4, borderRadius: 16, border: `2px solid ${C.border}`, display: 'flex', gap: 4 }}>
                 <button onClick={() => setViewMode('grid')} style={{ width: 44, height: 44, borderRadius: 12, border: 'none', background: viewMode === 'grid' ? C.bg : 'transparent', color: viewMode === 'grid' ? C.text : C.textMuted, cursor: 'pointer' }}><GridViewRounded /></button>
                 <button onClick={() => setViewMode('list')} style={{ width: 44, height: 44, borderRadius: 12, border: 'none', background: viewMode === 'list' ? C.bg : 'transparent', color: viewMode === 'list' ? C.text : C.textMuted, cursor: 'pointer' }}><ViewStreamRounded /></button>
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                style={{ 
                  padding: '0 24px', borderRadius: 16, border: `2px solid ${C.border}`, background: showFilters ? C.text : '#fff', color: showFilters ? '#fff' : C.text, 
                  fontSize: 14, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' 
                }}
              >
                 <FilterListRounded sx={{ fontSize: 18 }} />
                 Filters
              </button>
           </div>
        </div>

        {/* Main Workspace */}
        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
           {/* Refined Sidebar */}
           <AnimatePresence>
             {showFilters && (
               <motion.aside 
                 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                 style={{ 
                   width: isMobile ? '100%' : 280, 
                   position: isMobile ? 'fixed' : 'sticky', top: 180, left: 0, zIndex: 1000,
                   background: isMobile ? '#fff' : 'transparent', padding: isMobile ? 32 : 0, 
                   height: isMobile ? '100vh' : 'auto', overflowY: 'auto'
                 }}
               >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                     <div>
                        <h3 style={{ margin: '0 0 20px', fontSize: 13, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.textSub }}>Provider Type</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                           {['Tier 1 Banks', 'Digital Lenders', 'Private Insurers', 'BNPL Providers'].map(t => (
                             <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, fontWeight: 700, color: C.text, cursor: 'pointer' }}>
                                <input type="checkbox" defaultChecked style={{ width: 18, height: 18, accentColor: C.blue }} /> {t}
                             </label>
                           ))}
                        </div>
                     </div>

                     <div>
                        <h3 style={{ margin: '0 0 20px', fontSize: 13, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.textSub }}>Match Precision</h3>
                        <input type="range" min="0" max="100" defaultValue="75" style={{ width: '100%', accentColor: C.blue }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 11, fontWeight: 800, color: C.textMuted }}>
                           <span>Any Match</span>
                           <span>High Match</span>
                        </div>
                     </div>

                     <div style={{ background: `linear-gradient(135deg, ${C.blue}, ${C.purple})`, borderRadius: 24, padding: 24, color: '#fff' }}>
                        <TrendingUpRounded sx={{ fontSize: 24, marginBottom: 12 }} />
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 800, marginBottom: 8 }}>Elite Access</p>
                        <p style={{ margin: 0, fontSize: 12, opacity: 0.8, lineHeight: 1.5 }}>Your credit score is in the top 10%. You qualify for **Elite Tier** interest rates.</p>
                     </div>
                  </div>
               </motion.aside>
             )}
           </AnimatePresence>

           {/* Results Grid */}
           <div style={{ flex: 1 }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: viewMode === 'grid' ? `repeat(auto-fill, minmax(${isMobile ? '100%' : '320px'}, 1fr))` : '1fr', 
                gap: 24 
              }}>
                 {filteredProducts.map(prod => (
                   <ProductCard key={prod.id} prod={prod} viewMode={viewMode} />
                 ))}
              </div>

              {filteredProducts.length === 0 && (
                <div style={{ padding: 80, textAlign: 'center', background: '#fff', borderRadius: 32, border: `1px solid ${C.border}` }}>
                   <InfoOutlined sx={{ fontSize: 48, color: C.textMuted, marginBottom: 16 }} />
                   <h3 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 900 }}>No exact matches</h3>
                   <p style={{ margin: 0, color: C.textMuted }}>Try adjusting your search or category filters.</p>
                </div>
              )}
           </div>
        </div>

        {/* AI Concierge CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ 
            marginTop: 80, padding: 64, borderRadius: 40, 
            background: `linear-gradient(135deg, ${C.sidebar} 0%, #1e293b 100%)`, 
            color: '#fff', textAlign: 'center', position: 'relative', overflow: 'hidden' 
          }}
        >
           <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />
           <h3 style={{ margin: '0 0 16px', fontSize: 32, fontWeight: 900, fontFamily: F.heading }}>Personalized Negotiation?</h3>
           <p style={{ margin: '0 auto 32px', fontSize: 18, color: 'rgba(255,255,255,0.6)', maxWidth: 600 }}>Our AI concierge can negotiate custom terms directly with institutions based on your vault history.</p>
           <button style={{ 
             background: '#fff', color: C.sidebar, border: 'none', 
             padding: '18px 40px', borderRadius: 20, fontSize: 15, 
             fontWeight: 900, cursor: 'pointer', transition: '0.2s'
           }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}>
              Request AI Concierge
           </button>
        </motion.div>

        {/* Product Details Drawer */}
        <Drawer 
          anchor="right" 
          open={!!selectedProduct} 
          onClose={() => setSelectedProduct(null)}
          PaperProps={{
            sx: { 
              width: isMobile ? '100%' : 540, 
              background: '#fff',
              borderLeft: `1px solid ${C.border}`,
              boxShadow: '-20px 0 60px rgba(13,27,62,0.1)'
            }
          }}
        >
           {selectedProduct && (
             <Box sx={{ p: 5, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 6 }}>
                   <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                      <Box sx={{ width: 80, height: 80, borderRadius: 24, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                         <img src={selectedProduct.logo} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                      </Box>
                      <Box>
                         <Typography variant="overline" sx={{ fontWeight: 900, color: C.blue, letterSpacing: '0.1em' }}>{selectedProduct.provider}</Typography>
                         <Typography variant="h4" sx={{ fontWeight: 900, fontFamily: F.heading }}>{selectedProduct.name}</Typography>
                      </Box>
                   </Box>
                   <IconButton onClick={() => setSelectedProduct(null)} sx={{ background: '#f1f5f9' }}><CloseRounded /></IconButton>
                </Box>

                <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
                   <Box sx={{ mb: 6, pb: 4, borderBottom: `1px solid ${C.border}` }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 900, color: C.textMuted, mb: 1, letterSpacing: '0.05em' }}>OFFERING OVERVIEW</Typography>
                      <Box sx={{ display: 'flex', gap: 6 }}>
                         <Box>
                            <Typography sx={{ fontSize: 24, fontWeight: 900, color: C.text }}>{selectedProduct.rate}{selectedProduct.rateSuffix || '%'}</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: C.textSub }}>Interest Rate</Typography>
                         </Box>
                         <Box sx={{ width: 1, height: 40, background: C.border, alignSelf: 'center' }} />
                         <Box>
                            <Typography sx={{ fontSize: 24, fontWeight: 900, color: C.emerald }}>{selectedProduct.match}%</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: C.textSub }}>Trust Match</Typography>
                         </Box>
                      </Box>
                   </Box>

                   <Typography variant="h6" sx={{ fontWeight: 900, mb: 3 }}>Institutional Features</Typography>
                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 6 }}>
                      {[
                        { label: 'Instant Eligibility', val: 'Verified via Vault Hub', icon: <VerifiedRounded sx={{ color: C.emerald, fontSize: 20 }} /> },
                        { label: 'Processing Time', val: '< 24 Institutional Hours', icon: <HistoryRounded sx={{ color: C.blue, fontSize: 20 }} /> },
                        { label: 'Transparency', val: 'No hidden origination fees', icon: <ShieldRounded sx={{ color: C.purple, fontSize: 20 }} /> },
                      ].map(item => (
                        <Box key={item.label} sx={{ display: 'flex', gap: 2.5 }}>
                           <Box sx={{ mt: 0.5 }}>{item.icon}</Box>
                           <Box>
                              <Typography sx={{ fontSize: 14, fontWeight: 900, color: C.text }}>{item.label}</Typography>
                              <Typography sx={{ fontSize: 13, color: C.textSub }}>{item.val}</Typography>
                           </Box>
                        </Box>
                      ))}
                   </Box>

                   <Typography sx={{ color: C.textSub, lineHeight: 1.8, fontSize: 14 }}>
                      {selectedProduct.desc}. This premium offering from {selectedProduct.provider} is specifically optimized for ResolveBridge users with a verified financial history. Terms are subject to final institutional review.
                   </Typography>
                </Box>

                <Box sx={{ pt: 4, borderTop: `1px solid ${C.border}`, display: 'flex', gap: 2 }}>
                   <Link href={`/portal/apply-${selectedProduct.cat}`} style={{ flex: 1, textDecoration: 'none' }}>
                      <button style={{ width: '100%', padding: '20px', borderRadius: 20, border: 'none', background: C.text, color: '#fff', fontWeight: 900, fontSize: 15, cursor: 'pointer' }}>Apply for this Product</button>
                   </Link>
                </Box>
             </Box>
           )}
        </Drawer>

        {isMobile && <div style={{ height: 100 }} />}
      </div>
    </PortalShell>
  );
}
