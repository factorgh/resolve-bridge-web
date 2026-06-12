'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import PortalShell, { C, F } from '../components/PortalShell';
import { useGetProductsQuery } from '@/lib/redux/api/productApi';
import { useCreateApplicationMutation } from '@/lib/redux/api/applicationApi';
import { useGetMeQuery } from '@/lib/redux/api/userApi';
import { toast } from 'react-hot-toast';
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
  HistoryRounded,
  ErrorOutlineRounded
} from '@mui/icons-material';
import { Drawer, Box, Typography, IconButton } from '@mui/material';
import EmptyState from '../components/EmptyState';

/* ─── Components ─────────────────────────────────────────────────────────── */

const ProductLogo = ({ logoUrl, name, size = 64, borderRadius = 20 }: { logoUrl?: string, name: string, size?: number, borderRadius?: number }) => {
  const [error, setError] = useState(!logoUrl);
  
  if (error || !logoUrl) {
    const initials = name ? name.trim().charAt(0).toUpperCase() : '?';
    const colors = ['#2051e5', '#10b981', '#7c3aed', '#ef4444', '#f59e0b', '#ec4899'];
    const charCodeSum = name ? name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) : 0;
    const color = colors[charCodeSum % colors.length];
    
    return (
      <div style={{
        width: size,
        height: size,
        borderRadius: borderRadius,
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: Math.round(size * 0.42),
        fontWeight: 900,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        flexShrink: 0,
        fontFamily: F.heading
      }}>
        {initials}
      </div>
    );
  }
  
  return (
    <div style={{ 
      width: size, height: size, background: '#f8fafc', borderRadius: borderRadius, 
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      padding: Math.round(size * 0.18), border: `1px solid ${C.border}`, flexShrink: 0,
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
    }}>
      <img 
        src={logoUrl} 
        alt={name} 
        onError={() => setError(true)}
        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
      />
    </div>
  );
};

const ProductCard = ({ prod, viewMode, onInstantApply }: { prod: any, viewMode: 'grid' | 'list', onInstantApply: (prod: any) => void }) => {
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
        <ProductLogo logoUrl={prod.logo} name={prod.provider || prod.name} size={64} borderRadius={20} />
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
        <button 
          onClick={() => onInstantApply(prod)}
          style={{ 
            textDecoration: 'none', background: C.text, color: '#fff', border: 'none',
            padding: '16px', borderRadius: 16, fontSize: 14, fontWeight: 800,
            flex: 2, textAlign: 'center', transition: '0.2s', cursor: 'pointer'
          }}
        >
          Instant Apply
        </button>
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

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const providerParam = searchParams.get('provider');
  
  const [activeCat, setActiveCat] = useState('loan');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobile, setIsMobile] = useState(false);
  const [sortBy, setSortBy] = useState('trust');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [instantApplyProduct, setInstantApplyProduct] = useState<any>(null);
  const [applyAmount, setApplyAmount] = useState<number>(1000);
  const [applyTenure, setApplyTenure] = useState<number>(6);
  const [createApplication, { isLoading: isSubmitting }] = useCreateApplicationMutation();
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [paymentFrequency, setPaymentFrequency] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  const { data: userData } = useGetMeQuery();

  const rateNum = instantApplyProduct ? (Number(String(instantApplyProduct.rate).replace(/[^0-9.]/g, '')) || 10) : 10;
  const ratePercent = rateNum / 100;
  const totalInterest = applyAmount * ratePercent * (applyTenure / 12);
  const totalRepayment = applyAmount + totalInterest;

  const monthlyVal = Math.round(totalRepayment / applyTenure);
  const weeklyVal = Math.round(totalRepayment / (applyTenure * 4.33));
  const dailyVal = Math.round(totalRepayment / (applyTenure * 30.42));

  const handleInstantApplyStart = (p: any) => {
    setInstantApplyProduct(p);
    setApplyAmount(p.minAmount || 1000);
    setApplyTenure(p.minTenureMonths || 6);
    setApplicationSuccess(false);
    setPaymentFrequency('monthly');
  };

  const handleConfirmSubmit = async () => {
    if (!instantApplyProduct) return;
    
    try {
      const cleanAmount = Number(applyAmount);
      const cleanTerm = Number(applyTenure);
      const user = userData?.data;
      
      const payload = {
        productId: instantApplyProduct.id || instantApplyProduct._id,
        amount: cleanAmount,
        tenureMonths: cleanTerm,
        applicationData: {
          personal: {
            title: user?.title || 'Mr.',
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            phone: user?.phoneNumber || user?.phone || '',
            email: user?.email || '',
            dob: user?.dob || '',
            nationality: user?.nationality || 'Ghanaian',
            residentialAddress: user?.residentialAddress || 'Accra',
            city: user?.city || 'Accra'
          },
          financial: {
            hasAccountWithLender: 'No',
            existingLoan: 'No',
            preferredFrequency: paymentFrequency,
            calculatedDues: paymentFrequency === 'daily' ? dailyVal : paymentFrequency === 'weekly' ? weeklyVal : monthlyVal
          },
          employment: {
            employment: user?.employmentStatus || 'Employed (Salaried)',
            employer: user?.employer || 'Ecosystem Company',
            occupation: user?.occupation || 'Professional',
            monthlyIncome: user?.monthlyIncome || '5000'
          },
          referees: [
            { name: 'Ecosystem Reference 1', relation: 'Contact', phone: '0244123456' },
            { name: 'Ecosystem Reference 2', relation: 'Contact', phone: '0244123457' }
          ]
        }
      };

      const result = await createApplication(payload).unwrap();
      if (result?.success) {
        const requiresPayment = result.data?.requiresPayment || result.requiresPayment;
        const url = result.data?.authorizationUrl || result.authorizationUrl;
        if (requiresPayment && url) {
          toast.success("Redirecting to Paystack secure checkout to settle connection fee...");
          setTimeout(() => {
            window.location.href = url;
          }, 1500);
        } else {
          setApplicationSuccess(true);
          toast.success("Application submitted successfully!");
        }
      }
    } catch (err: any) {
      console.error('Failed to submit application instantly:', err);
      toast.error(err?.data?.message || 'Verification failure: could not submit your instant application.');
    }
  };

  useEffect(() => {
    if (providerParam) {
      setSearch(providerParam);
    }
    const payment = searchParams.get('payment');
    if (payment === 'success') {
      toast.success('Connection fee payment completed successfully! Application is now formally submitted.');
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (payment === 'failed') {
      toast.error('Connection fee payment failed or was cancelled.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [providerParam, searchParams]);
  const [filters, setFilters] = useState({
    providers: [] as string[],
    precision: 75
  });

  const { data: apiData, isLoading, isError } = useGetProductsQuery({ 
    productType: activeCat, 
    searchTerm: search,
    providerType: filters.providers
  });

  const products = useMemo(() => {
    if (apiData?.success && apiData?.data) {
      return apiData.data;
    }
    return []; 
  }, [apiData]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Global bridge for component-to-page communication
    (window as any).openProductDetails = (prod: any) => setSelectedProduct(prod);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredProducts = useMemo(() => {
    const base = [...products];
    return base.sort((a: any, b: any) => {
      if (sortBy === 'rate') return a.rate - b.rate;
      return b.trust - a.trust;
    });
  }, [products, sortBy]);

  return (
    <PortalShell title="Marketplace" backHref="/portal">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 16px 100px' : '0 24px 100px' }}>
        
        {/* Transparent Banner */}


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
        <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start' }}>
           {/* Results Grid - Now Full Width */}
           <div style={{ flex: 1 }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: viewMode === 'grid' ? `repeat(auto-fill, minmax(${isMobile ? '100%' : '320px'}, 1fr))` : '1fr', 
                gap: 24 
              }}>
                 {filteredProducts.map(prod => (
                   <ProductCard 
                     key={prod.id} 
                     prod={prod} 
                     viewMode={viewMode} 
                     onInstantApply={handleInstantApplyStart} 
                   />
                 ))}
              </div>

              {filteredProducts.length === 0 && !isLoading && (
                <EmptyState 
                  title="No Products Found" 
                  description="We couldn't find any financial products matching your current filters. Try adjusting your search term or exploring another category."
                  icon={<ErrorOutlineRounded sx={{ fontSize: 48, opacity: 0.2 }} />}
                />
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
             <Box sx={{ p: { xs: 3, sm: 5 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: { xs: 4, sm: 6 } }}>
                   <Box sx={{ display: 'flex', gap: { xs: 2, sm: 3 }, alignItems: 'center', flex: 1, mr: 2 }}>
                      <ProductLogo logoUrl={selectedProduct.logo} name={selectedProduct.provider || selectedProduct.name} size={isMobile ? 56 : 72} borderRadius={16} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                         <Typography variant="overline" sx={{ fontWeight: 900, color: C.blue, letterSpacing: '0.1em', display: 'block', mb: 0.5, fontSize: { xs: 10, sm: 12 } }}>{selectedProduct.provider}</Typography>
                         <Typography variant="h4" sx={{ fontWeight: 900, fontFamily: F.heading, fontSize: { xs: '20px', sm: '28px' }, lineHeight: 1.25, overflowWrap: 'break-word', wordBreak: 'break-word' }}>{selectedProduct.name}</Typography>
                      </Box>
                   </Box>
                   <IconButton onClick={() => setSelectedProduct(null)} sx={{ background: '#f1f5f9', flexShrink: 0 }}><CloseRounded /></IconButton>
                </Box>

                <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
                   <Box sx={{ mb: { xs: 4, sm: 6 }, pb: { xs: 3, sm: 4 }, borderBottom: `1px solid ${C.border}` }}>
                      <Typography sx={{ fontSize: 11, fontWeight: 900, color: C.textMuted, mb: 1.5, letterSpacing: '0.05em' }}>OFFERING OVERVIEW</Typography>
                      <Box sx={{ display: 'flex', gap: { xs: 4, sm: 6 }, alignItems: 'center' }}>
                         <Box>
                            <Typography sx={{ fontSize: { xs: '20px', sm: '24px' }, fontWeight: 900, color: C.text }}>{selectedProduct.rate}{selectedProduct.rateSuffix || '%'}</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: C.textSub, fontSize: { xs: '11px', sm: '12px' } }}>Interest Rate</Typography>
                         </Box>
                         <Box sx={{ width: '1px', height: 32, background: C.border }} />
                         <Box>
                            <Typography sx={{ fontSize: { xs: '20px', sm: '24px' }, fontWeight: 900, color: C.emerald }}>{selectedProduct.match}%</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: C.textSub, fontSize: { xs: '11px', sm: '12px' } }}>Trust Match</Typography>
                         </Box>
                      </Box>
                   </Box>

                   <Typography variant="h6" sx={{ fontWeight: 900, mb: { xs: 2, sm: 3 }, fontSize: { xs: '16px', sm: '20px' } }}>Institutional Features</Typography>
                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 }, mb: { xs: 4, sm: 6 } }}>
                      {[
                        { label: 'Instant Eligibility', val: 'Verified via Vault Hub', icon: <VerifiedRounded sx={{ color: C.emerald, fontSize: 20 }} /> },
                        { label: 'Processing Time', val: '< 24 Institutional Hours', icon: <HistoryRounded sx={{ color: C.blue, fontSize: 20 }} /> },
                        { label: 'Transparency', val: 'No hidden origination fees', icon: <ShieldRounded sx={{ color: C.purple, fontSize: 20 }} /> },
                      ].map(item => (
                        <Box key={item.label} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                           <Box sx={{ mt: 0.5, display: 'flex' }}>{item.icon}</Box>
                           <Box>
                              <Typography sx={{ fontSize: { xs: 13, sm: 14 }, fontWeight: 900, color: C.text }}>{item.label}</Typography>
                              <Typography sx={{ fontSize: { xs: 12, sm: 13 }, color: C.textSub }}>{item.val}</Typography>
                           </Box>
                        </Box>
                      ))}
                   </Box>

                   <Typography sx={{ color: C.textSub, lineHeight: 1.8, fontSize: { xs: 13, sm: 14 } }}>
                      {selectedProduct.desc}. This premium offering from {selectedProduct.provider} is specifically optimized for ResolveBridge users with a verified financial history. Terms are subject to final institutional review.
                   </Typography>
                </Box>

                <Box sx={{ pt: { xs: 3, sm: 4 }, borderTop: `1px solid ${C.border}`, display: 'flex', gap: 2, flexDirection: isMobile ? 'column' : 'row' }}>
                   <button 
                      onClick={() => {
                        handleInstantApplyStart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      style={{ 
                        flex: 1, padding: isMobile ? '16px' : '20px', borderRadius: 16, border: 'none', 
                        background: C.text, color: '#fff', fontWeight: 900, fontSize: isMobile ? 14 : 15, cursor: 'pointer' 
                      }}
                    >
                      Instant Apply
                    </button>
                    <Link href={`/portal/apply-${selectedProduct.cat?.toLowerCase()}?productId=${selectedProduct.id}&lender=${encodeURIComponent(selectedProduct.provider)}`} style={{ flex: 1, textDecoration: 'none' }}>
                       <button style={{ width: '100%', padding: isMobile ? '16px' : '20px', borderRadius: 16, border: `2px solid ${C.border}`, background: '#fff', color: C.textSub, fontWeight: 900, fontSize: isMobile ? 14 : 15, cursor: 'pointer' }}>Standard Application</button>
                    </Link>
                </Box>
             </Box>
            )}
         </Drawer>
 
        {/* Filter Settings Drawer */}
        <Drawer 
          anchor="right" 
          open={showFilters} 
          onClose={() => setShowFilters(false)}
          PaperProps={{
            sx: { 
              width: isMobile ? '100%' : 400, 
              background: '#fff',
              borderLeft: `1px solid ${C.border}`,
              boxShadow: '-20px 0 60px rgba(13,27,62,0.1)'
            }
          }}
        >
          <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900, fontFamily: F.heading }}>Refine Results</Typography>
                <Typography variant="caption" sx={{ fontWeight: 800, color: C.textMuted, letterSpacing: '0.05em' }}>MARKETPLACE FILTERS</Typography>
              </Box>
              <IconButton onClick={() => setShowFilters(false)} sx={{ background: '#f1f5f9' }}><CloseRounded /></IconButton>
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              <Box sx={{ mb: 6 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 900, color: C.textSub, mb: 3, letterSpacing: '0.1em' }}>PROVIDER TYPE</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {['Tier 1 Banks', 'Digital Lenders', 'Private Insurers', 'BNPL Providers'].map(t => (
                    <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 15, fontWeight: 700, color: C.text, cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={filters.providers.includes(t)}
                        onChange={(e) => {
                          const next = e.target.checked 
                            ? [...filters.providers, t] 
                            : filters.providers.filter(p => p !== t);
                          setFilters({ ...filters, providers: next });
                        }}
                        style={{ width: 20, height: 20, accentColor: C.blue }} 
                      /> {t}
                    </label>
                  ))}
                </Box>
              </Box>

              <Box sx={{ mb: 6 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 900, color: C.textSub, mb: 3, letterSpacing: '0.1em' }}>MATCH PRECISION</Typography>
                <input 
                  type="range" min="0" max="100" 
                  value={filters.precision} 
                  onChange={(e) => setFilters({ ...filters, precision: parseInt(e.target.value) })}
                  style={{ width: '100%', accentColor: C.blue, cursor: 'pointer' }} 
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5 }}>
                   <Typography sx={{ fontSize: 11, fontWeight: 800, color: C.textMuted }}>Generic</Typography>
                   <Typography sx={{ fontSize: 11, fontWeight: 800, color: C.blue }}>{filters.precision}% Precise</Typography>
                </Box>
              </Box>

              <Box sx={{ p: 3, borderRadius: 24, background: `linear-gradient(135deg, ${C.blue}08, ${C.purple}08)`, border: `1px solid ${C.blue}15` }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1.5 }}>
                  <TrendingUpRounded sx={{ color: C.blue }} />
                  <Typography sx={{ fontWeight: 900, fontSize: 14, color: C.text }}>Smart Suggestion</Typography>
                </Box>
                <Typography sx={{ fontSize: 13, color: C.textSub, lineHeight: 1.6 }}>
                  Higher precision filters products based on your specific vault history and credit profile.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ pt: 4, borderTop: `1px solid ${C.border}`, display: 'flex', gap: 2 }}>
              <button 
                onClick={() => setFilters({ providers: [], precision: 75 })}
                style={{ flex: 1, padding: '16px', borderRadius: 16, border: `2px solid ${C.border}`, background: '#fff', color: C.text, fontWeight: 800, fontSize: 14, cursor: 'pointer' }}
              >
                Reset
              </button>
              <button 
                onClick={() => setShowFilters(false)}
                style={{ flex: 1.5, padding: '16px', borderRadius: 16, border: 'none', background: C.text, color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}
              >
                Apply Filters
              </button>
            </Box>
          </Box>
        </Drawer>

        {/* Instant Apply Modal */}
        <AnimatePresence>
          {instantApplyProduct && (
            <div style={{ 
              position: 'fixed', 
              inset: 0, 
              zIndex: 1100, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: isMobile ? 0 : 24 
            }}>
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => { if (!isSubmitting && !applicationSuccess) setInstantApplyProduct(null); }} 
                style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(12px)' }} 
              />

              {/* Modal Container */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 30 }}
                transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: 620,
                  background: 'rgba(255, 255, 255, 0.98)',
                  borderRadius: isMobile ? 0 : 36,
                  boxShadow: '0 30px 70px rgba(13,27,62,0.18), inset 0 1px 0 rgba(255,255,255,0.6)',
                  border: `1px solid ${C.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  maxHeight: isMobile ? '100%' : '90vh',
                  zIndex: 1101,
                }}
              >
                {applicationSuccess ? (
                  /* Animated Success Splash */
                  <div style={{ padding: 48, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                      style={{ 
                        width: 96, 
                        height: 96, 
                        borderRadius: '50%', 
                        background: '#e6f4ea', 
                        border: `3px solid ${C.emerald}`, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}
                    >
                      <motion.svg 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
                        width="44" 
                        height="44" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke={C.emerald} 
                        strokeWidth="3.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"/>
                      </motion.svg>
                    </motion.div>
                    
                    <div>
                      <h2 style={{ margin: '0 0 10px', fontSize: 26, fontWeight: 900, color: C.text, fontFamily: F.heading, letterSpacing: '-0.04em' }}>Application Pre-Approved!</h2>
                      <p style={{ margin: '0 auto', fontSize: 15, color: C.textSub, lineHeight: 1.6, maxWidth: 400 }}>
                        Your instant application has been verified by the Resolve secure vault, and submitted to <strong style={{ color: C.text }}>{instantApplyProduct.provider}</strong> for final approval and payout.
                      </p>
                    </div>

                    <div style={{ 
                      background: '#f8fafc', 
                      border: `1.5px solid ${C.border}`, 
                      borderRadius: 24, 
                      padding: 24, 
                      width: '100%', 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: 16, 
                      textAlign: 'left' 
                    }}>
                      <div>
                        <p style={{ margin: '0 0 2px', fontSize: 10, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Facility Provider</p>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: C.text }}>{instantApplyProduct.provider}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 2px', fontSize: 10, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plan Frequency</p>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: C.blue, textTransform: 'capitalize' }}>{paymentFrequency} plan dues</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 2px', fontSize: 10, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Requested Size</p>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: C.emerald }}>GH₵ {Number(applyAmount).toLocaleString()}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 2px', fontSize: 10, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Matched Dues</p>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: C.text }}>
                          GH₵ {paymentFrequency === 'daily' ? dailyVal : paymentFrequency === 'weekly' ? weeklyVal : monthlyVal} / {paymentFrequency === 'daily' ? 'day' : paymentFrequency === 'weekly' ? 'week' : 'mo'}
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setInstantApplyProduct(null);
                        setApplicationSuccess(false);
                      }} 
                      style={{ 
                        width: '100%', 
                        background: C.text, 
                        color: '#fff', 
                        border: 'none', 
                        padding: '18px', 
                        borderRadius: 16, 
                        fontSize: 15, 
                        fontWeight: 900, 
                        cursor: 'pointer', 
                        transition: '0.2s',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    >
                      Done & Return to Marketplace
                    </button>
                  </div>
                ) : (
                  /* Standard Confirmation View */
                  <>
                    {/* Header */}
                    <div style={{ 
                      padding: '24px 32px', 
                      borderBottom: `1px solid ${C.border}`, 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center' 
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ 
                          width: 44, 
                          height: 44, 
                          background: '#f8fafc', 
                          borderRadius: 12, 
                          border: `1px solid ${C.border}`, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          padding: 6 
                        }}>
                          <img src={instantApplyProduct.logo} alt="" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                        </div>
                        <div>
                          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: C.text, fontFamily: F.heading }}>Instant Apply</h3>
                          <span style={{ fontSize: 11, fontWeight: 800, color: C.textSub }}>{instantApplyProduct.provider} • {instantApplyProduct.name}</span>
                        </div>
                      </div>
                      
                      <button 
                        disabled={isSubmitting}
                        onClick={() => setInstantApplyProduct(null)} 
                        style={{ 
                          background: '#f1f5f9', 
                          border: 'none', 
                          width: 32, 
                          height: 32, 
                          borderRadius: '50%', 
                          cursor: isSubmitting ? 'not-allowed' : 'pointer', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}
                      >
                        <CloseRounded sx={{ fontSize: 18, color: C.textSub }} />
                      </button>
                    </div>

                    {/* Content Body */}
                    <div style={{ padding: '32px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
                      
                      {/* Section 1: Pre-verified KYC Details */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                          <span style={{ fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pre-Verified KYC Details</span>
                          <span style={{ 
                            fontSize: 10, 
                            fontWeight: 900, 
                            color: C.emerald, 
                            background: C.emeraldLight, 
                            padding: '4px 10px', 
                            borderRadius: 12,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4
                          }}>
                            <VerifiedRounded sx={{ fontSize: 12 }} /> Verified Vault Profile
                          </span>
                        </div>
                        
                        <div style={{ 
                          background: 'linear-gradient(135deg, rgba(0, 134, 82, 0.02) 0%, rgba(32, 81, 229, 0.02) 100%)', 
                          border: `1px solid rgba(0, 134, 82, 0.15)`, 
                          borderRadius: 22, 
                          padding: 20,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 12,
                          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.01)'
                        }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
                            <div>
                              <p style={{ margin: '0 0 2px', fontSize: 10, color: C.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Full Name</p>
                              <p style={{ margin: 0, fontWeight: 800, color: C.text }}>
                                {userData?.data?.firstName ? `${userData.data.firstName} ${userData.data.lastName || ''}` : 'Ecosystem Customer'}
                              </p>
                            </div>
                            <div>
                              <p style={{ margin: '0 0 2px', fontSize: 10, color: C.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Identity Document</p>
                              <p style={{ margin: 0, fontWeight: 800, color: C.text }}>Ghana Card (Linked)</p>
                            </div>
                            <div>
                              <p style={{ margin: '0 0 2px', fontSize: 10, color: C.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Phone Number</p>
                              <p style={{ margin: 0, fontWeight: 800, color: C.text }}>
                                {userData?.data?.phoneNumber || userData?.data?.phone || '—'}
                              </p>
                            </div>
                            <div>
                              <p style={{ margin: '0 0 2px', fontSize: 10, color: C.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Linked Email</p>
                              <p style={{ margin: 0, fontWeight: 800, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {userData?.data?.email || '—'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Customization Sliders */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customize Offer terms</span>
                        
                        {/* Amount Slider */}
                        <div style={{ background: '#f8fafc', border: `1px solid ${C.border}`, padding: 20, borderRadius: 20 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <span style={{ fontSize: 13, fontWeight: 800, color: C.textSub }}>Requested Amount</span>
                            <span style={{ fontSize: 20, fontWeight: 900, color: C.blue, fontFamily: F.heading }}>GH₵ {Number(applyAmount).toLocaleString()}</span>
                          </div>
                          <input 
                            type="range"
                            min={instantApplyProduct.minAmount || 500}
                            max={instantApplyProduct.maxAmount || 50000}
                            step={100}
                            value={applyAmount}
                            onChange={(e) => setApplyAmount(Number(e.target.value))}
                            style={{ width: '100%', accentColor: C.blue, cursor: 'pointer' }}
                          />
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, fontWeight: 700, color: C.textMuted }}>
                            <span>GH₵ {Number(instantApplyProduct.minAmount || 500).toLocaleString()}</span>
                            <span>GH₵ {Number(instantApplyProduct.maxAmount || 50000).toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Tenure Slider */}
                        <div style={{ background: '#f8fafc', border: `1px solid ${C.border}`, padding: 20, borderRadius: 20 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <span style={{ fontSize: 13, fontWeight: 800, color: C.textSub }}>Repayment Tenure</span>
                            <span style={{ fontSize: 20, fontWeight: 900, color: C.blue, fontFamily: F.heading }}>{applyTenure} Months</span>
                          </div>
                          <input 
                            type="range"
                            min={instantApplyProduct.minTenureMonths || 3}
                            max={instantApplyProduct.maxTenureMonths || 36}
                            step={1}
                            value={applyTenure}
                            onChange={(e) => setApplyTenure(Number(e.target.value))}
                            style={{ width: '100%', accentColor: C.blue, cursor: 'pointer' }}
                          />
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, fontWeight: 700, color: C.textMuted }}>
                            <span>{instantApplyProduct.minTenureMonths || 3} Mos</span>
                            <span>{instantApplyProduct.maxTenureMonths || 36} Mos</span>
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Repayment Frequency Selector & Calculations */}
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 12 }}>Select Preferred Payment Plan</span>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
                          {[
                            { id: 'daily', label: 'Daily Dues', val: dailyVal, suffix: '/ day', tag: 'Micro-plan' },
                            { id: 'weekly', label: 'Weekly Dues', val: weeklyVal, suffix: '/ week', tag: 'Flexi-plan' },
                            { id: 'monthly', label: 'Monthly Dues', val: monthlyVal, suffix: '/ month', tag: 'Standard' }
                          ].map(plan => {
                            const isSelected = paymentFrequency === plan.id;
                            return (
                              <motion.div
                                key={plan.id}
                                whileHover={{ y: -3, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setPaymentFrequency(plan.id as any)}
                                style={{
                                  background: isSelected ? 'rgba(32, 81, 229, 0.04)' : '#fff',
                                  border: `2px solid ${isSelected ? C.blue : C.border}`,
                                  borderRadius: 20,
                                  padding: '16px 12px',
                                  textAlign: 'center',
                                  cursor: 'pointer',
                                  boxShadow: isSelected ? '0 10px 25px rgba(32, 81, 229, 0.08)' : '0 4px 12px rgba(0,0,0,0.02)',
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                <span style={{ 
                                  fontSize: 8.5, 
                                  fontWeight: 900, 
                                  background: isSelected ? C.blue : '#f1f5f9', 
                                  color: isSelected ? '#fff' : C.textSub, 
                                  padding: '3px 8px', 
                                  borderRadius: 8,
                                  textTransform: 'uppercase',
                                  display: 'inline-block',
                                  marginBottom: 8
                                }}>
                                  {plan.tag}
                                </span>
                                <p style={{ margin: '0 0 2px', fontSize: 12.5, fontWeight: 800, color: C.textSub }}>{plan.label}</p>
                                <p style={{ margin: 0, fontSize: 16.5, fontWeight: 900, color: isSelected ? C.blue : C.text }}>
                                  GHS {plan.val}
                                </p>
                                <span style={{ fontSize: 9.5, color: C.textMuted }}>{plan.suffix}</span>
                              </motion.div>
                            );
                          })}
                        </div>

                        {/* Recalculated Breakdown Details */}
                        <div style={{ 
                          background: `linear-gradient(135deg, ${C.sidebar} 0%, #1e293b 100%)`, 
                          borderRadius: 26, 
                          padding: 24,
                          color: '#fff',
                          boxShadow: '0 20px 40px rgba(15,23,42,0.12)'
                        }}>
                          <span style={{ fontSize: 10, fontWeight: 900, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Real-time Breakdown</span>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 12, marginBottom: 20 }}>
                            <div>
                              <span style={{ fontSize: 32, fontWeight: 900, fontFamily: F.heading }}>
                                GH₵ {paymentFrequency === 'daily' ? dailyVal : paymentFrequency === 'weekly' ? weeklyVal : monthlyVal}
                              </span>
                              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginLeft: 6 }}>/ {paymentFrequency === 'daily' ? 'day' : paymentFrequency === 'weekly' ? 'week' : 'month'}</span>
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 800, color: C.emerald }}>
                              {instantApplyProduct.rate}% APR Rate
                            </span>
                          </div>

                          <div style={{ 
                            borderTop: '1px solid rgba(255,255,255,0.1)', 
                            paddingTop: 16,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10,
                            fontSize: 12,
                            color: 'rgba(255,255,255,0.7)'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>Principal Value</span>
                              <span style={{ fontWeight: 800, color: '#fff' }}>GH₵ {Number(applyAmount).toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>Total Simple Interest</span>
                              <span style={{ fontWeight: 800, color: '#fff' }}>
                                GH₵ {Math.round(totalInterest).toLocaleString()}
                              </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: 10 }}>
                              <span style={{ color: '#fff', fontWeight: 800 }}>Total Repayment Payable</span>
                              <span style={{ fontWeight: 900, color: C.emerald, fontSize: 13 }}>
                                GH₵ {Math.round(totalRepayment).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Info Warning */}
                      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <InfoOutlined sx={{ fontSize: 18, color: C.blue, mt: 0.2 }} />
                        <p style={{ margin: 0, fontSize: 11, color: C.textSub, lineHeight: 1.5 }}>
                          By clicking "Confirm & Submit", you authorize ResolveBridge to submit your pre-verified vault information directly to {instantApplyProduct.provider} to fast-track your approval.
                        </p>
                      </div>

                    </div>

                    {/* Footer Buttons */}
                    <div style={{ 
                      padding: '24px 32px', 
                      borderTop: `1px solid ${C.border}`, 
                      display: 'flex', 
                      gap: 16,
                      background: '#f8fafc'
                    }}>
                      <button 
                        disabled={isSubmitting}
                        onClick={() => setInstantApplyProduct(null)} 
                        style={{ 
                          flex: 1, 
                          padding: '16px', 
                          borderRadius: 16, 
                          border: `2px solid ${C.border}`, 
                          background: '#fff', 
                          color: C.textSub, 
                          fontWeight: 800, 
                          fontSize: 14, 
                          cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          transition: '0.2s'
                        }}
                      >
                        Cancel
                      </button>
                      <button 
                        disabled={isSubmitting}
                        onClick={handleConfirmSubmit} 
                        style={{ 
                          flex: 1.5, 
                          padding: '16px', 
                          borderRadius: 16, 
                          border: 'none', 
                          background: C.text, 
                          color: '#fff', 
                          fontWeight: 800, 
                          fontSize: 14, 
                          cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 10,
                          transition: '0.2s',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <span>Confirm & Submit</span>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
              
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}
        </AnimatePresence>

        <div style={{ display: isMobile ? 'block' : 'none', height: 100 }} />
      </div>
    </PortalShell>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: 16, color: '#475569', fontWeight: 600 }}>Loading marketplace...</p>
      </div>
    }>
      <MarketplaceContent />
    </Suspense>
  );
}
