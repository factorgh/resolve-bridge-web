'use client';

import { motion, AnimatePresence } from 'framer-motion';
import NewsSlider from './components/NewsSlider';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Stack,
  Divider,
  Card,
  useMediaQuery,
  alpha,
  Tabs,
  Tab,
  Avatar,
  Slider,
} from '@mui/material';
import {
  ArrowForwardRounded,
  BoltRounded as ZapRounded,
  VerifiedUserRounded,
  AccountBalanceWalletRounded,
  SecurityRounded,
  DirectionsCarRounded as CarIcon,
  HomeRounded as HomeIcon,
  BusinessRounded as BusinessIcon,
  MonetizationOnRounded as MoneyIcon,
  ScoreRounded as ScoreIcon,
  TrendingUpRounded as ChartIcon,
  SavingsRounded as SavingsIcon,
  SupportAgentRounded as SupportIcon,
  ChevronRightRounded,
  CalculateRounded,
  StarRounded,
  MenuBookRounded,
  HelpOutlineRounded
} from '@mui/icons-material';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { C, F } from './portal/components/PortalShell';
import AiSearchModal from './components/AiSearchModal';

const HERO_TABS = [
  {
    id: 'personal',
    label: 'Personal Loans',
    icon: <MoneyIcon sx={{ fontSize: 22 }} />,
    title: 'Find the right',
    highlight: 'Personal Loan Rate',
    desc: 'Consolidate debt or fund major life purchases. We bring institutional lenders directly to your dashboard.',
    cta: 'Compare Rates',
  },
  {
    id: 'equity',
    label: 'Home Equity',
    icon: <HomeIcon sx={{ fontSize: 22 }} />,
    title: "Unlock your home's",
    highlight: 'Equity Potential',
    desc: 'Leverage your property assets to secure large-scale liquidity for your next major investment.',
    cta: 'Check Equity Rates',
  },
  {
    id: 'business',
    label: 'Business Credit',
    icon: <BusinessIcon sx={{ fontSize: 22 }} />,
    title: 'Scale your enterprise with',
    highlight: 'Verified Capital',
    desc: 'Access institutional credit lines tailored for African SMEs. Growth capital on your terms.',
    cta: 'Get Business Rates',
  },
  {
    id: 'vehicles',
    label: 'Vehicle Finance',
    icon: <CarIcon sx={{ fontSize: 22 }} />,
    title: 'Drive away with the best',
    highlight: 'Auto Loan Rate',
    desc: 'Financing for personal use or logistics fleets. Compare verified rates across regional banks.',
    cta: 'Browse Auto Rates',
  },
  {
    id: 'score',
    label: 'Credit Monitoring',
    icon: <ScoreIcon sx={{ fontSize: 22 }} />,
    title: 'Monitor your',
    highlight: 'Institutional Score',
    desc: 'Get your credit profile verified and receive institutional-grade insights into your borrowing power.',
    cta: 'Check My Score',
  },
];

const RATES = [
  {
    label: 'Mortgage',
    rate: '6.15%',
    accent: '#10b981',
    tagBg: '#d1fae5',
    tagColor: '#065f46',
    details: '15 yr fixed',
    detailsLabel: 'Term',
    loan: '$150,000',
    loanLabel: 'Loan value',
    href: '/loans/mortgage',
  },
  {
    label: 'Business Credit',
    rate: '6.52%',
    accent: '#f59e0b',
    tagBg: '#fef3c7',
    tagColor: '#92400e',
    details: 'Revolving line',
    detailsLabel: 'Type',
    loan: '$100,000',
    loanLabel: 'Credit limit',
    href: '/loans/business',
  },
  {
    label: 'Personal Loans',
    rate: '6.66%',
    accent: '#3b82f6',
    tagBg: '#eff6ff',
    tagColor: '#1e40af',
    details: '3 yr fixed',
    detailsLabel: 'Term',
    loan: '$20,000',
    loanLabel: 'Loan amount',
    href: '/loans/personal',
  },
  {
    label: 'Vehicle Finance',
    rate: '7.36%',
    accent: '#e11d48',
    tagBg: '#fff1f2',
    tagColor: '#9f1239',
    details: '5 yr fixed',
    detailsLabel: 'Term',
    loan: '$35,000',
    loanLabel: 'Loan amount',
    href: '/loans/auto',
  },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [heroSearchText, setHeroSearchText] = useState('');
  const isMobile = useMediaQuery('(max-width:900px)');

  useEffect(() => {
    setMounted(true);
  }, []);

  const [calcAmount, setCalcAmount] = useState(10000);
  const [calcRate, setCalcRate] = useState(18);
  const [calcTerm, setCalcTerm] = useState(24);

  const { monthly, weekly, daily } = useMemo(() => {
    const r = calcRate / 100 / 12;
    const n = calcTerm;
    const p = calcAmount;
    const m = (p * r) / (1 - Math.pow(1 + r, -n));
    const annual = m * 12;
    return { monthly: m, weekly: annual / 52, daily: annual / 365 };
  }, [calcAmount, calcRate, calcTerm]);

  if (!mounted) return null;

  const CalculatorInputs = () => (
    <Stack spacing={4}>
      <Box>
        <Stack direction="row" justifyContent="space-between" mb={2}>
          <Typography sx={{ fontSize: '11px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Loan Amount</Typography>
          <Typography sx={{ fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>GH₵ {calcAmount.toLocaleString()}</Typography>
        </Stack>
        <Slider 
          value={calcAmount} min={1000} max={250000} step={1000} 
          onChange={(_, v) => setCalcAmount(v as number)}
          sx={{ color: '#10b981', '& .MuiSlider-thumb': { backgroundColor: '#fff', border: '4px solid currentColor' } }}
        />
      </Box>
      <Box>
        <Stack direction="row" justifyContent="space-between" mb={2}>
          <Typography sx={{ fontSize: '11px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Interest Rate (% p.a)</Typography>
          <Typography sx={{ fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>{calcRate}%</Typography>
        </Stack>
        <Slider 
          value={calcRate} min={10} max={36} step={0.5} 
          onChange={(_, v) => setCalcRate(v as number)}
          sx={{ color: '#10b981', '& .MuiSlider-thumb': { backgroundColor: '#fff', border: '4px solid currentColor' } }}
        />
      </Box>
      <Box>
        <Stack direction="row" justifyContent="space-between" mb={2}>
          <Typography sx={{ fontSize: '11px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Period (Months)</Typography>
          <Typography sx={{ fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>{calcTerm} Mo</Typography>
        </Stack>
        <Slider 
          value={calcTerm} min={6} max={84} step={6} 
          onChange={(_, v) => setCalcTerm(v as number)}
          sx={{ color: '#10b981', '& .MuiSlider-thumb': { backgroundColor: '#fff', border: '4px solid currentColor' } }}
        />
      </Box>
    </Stack>
  );

  const CalculatorResults = () => (
    <Box sx={{ position: 'relative', zIndex: 1 }}>
      <Typography sx={{ fontSize: '11px', fontWeight: 900, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.15em', mb: 1 }}>Estimated Monthly</Typography>
      <Typography sx={{ fontSize: '42px', fontWeight: 900, color: '#fff', mb: 4, letterSpacing: '-0.04em' }}>GH₵ {Math.round(monthly).toLocaleString()}</Typography>
      
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 4 }} />
      
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>Weekly Breakdown</Typography>
          <Typography sx={{ fontSize: '18px', fontWeight: 900, color: '#10b981' }}>GH₵ {Math.round(weekly).toLocaleString()}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>Daily Commitment</Typography>
          <Typography sx={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>GH₵ {Math.round(daily).toLocaleString()}</Typography>
        </Stack>
      </Stack>
      
      <Button 
        component={Link} href="/get-started"
        fullWidth sx={{ mt: 5, py: 2, borderRadius: '14px', background: '#10b981', color: '#fff', fontWeight: 900, fontSize: '13px', textTransform: 'none', '&:hover': { background: '#059669' } }}
      >
        Lock in this rate
      </Button>
    </Box>
  );

  const currentTab = HERO_TABS[activeTab];

  return (

    <main style={{ minHeight: '100vh', background: '#fff', overflowX: 'hidden' }}>
      {/* Global keyframes + fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes rb-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(0.78)} }
        @keyframes rb-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes rb-float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(10px)} }
        .rb-prod-card { transition: all 0.3s cubic-bezier(0.22,1,0.36,1) !important; }
        .rb-prod-card:hover { transform: translateY(-8px) !important; box-shadow: 0 32px 64px rgba(0,0,0,0.12) !important; border-color: rgba(16,185,129,0.4) !important; }
        .rb-prod-card:hover .rb-prod-arrow { opacity: 1 !important; transform: translateX(4px) !important; color: #10b981 !important; }
        .rb-search-input { caret-color: #10b981; }
        .rb-search-bar:focus-within { border-color: rgba(16,185,129,0.5) !important; box-shadow: 0 0 0 4px rgba(16,185,129,0.10) !important; }
      `}</style>

      {/* ══ HERO SECTION (INTEGRATED PRODUCT PATTERN) ═══════════════════════ */}
      <Box component="section" sx={{
        position: 'relative',
        background: '#04080f',
        pt: { xs: 8, md: 16},
        pb: { xs: 8, md: 16 },
        overflow: 'hidden',
        borderBottom: '1px solid rgba(0,0,0,0.05)'
      }}>
        {/* Subtle Decorative Atmosphere */}
        <Box sx={{ position: 'absolute', top: '-10%', left: '10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ maxWidth: 850, mx: 'auto', textAlign: 'center', mb: { xs: 8, md: 12 } }}>
            {/* Main Headline */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <Typography variant="h1" sx={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 900,
                color: '#fff',
                fontSize: { xs: '2.6rem', sm: '3.6rem', md: '4.8rem' },
                lineHeight: 0.95,
                letterSpacing: '-0.05em',
                mb: 3
              }}>
                Find the best loan,<br />
                <Box component="span" sx={{
                  background: 'linear-gradient(130deg, #10b981 0%, #059669 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>Not just a loan.</Box>
              </Typography>
            </motion.div>

            {/* Subheadline */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
              <Typography sx={{
                fontFamily: "'Inter', sans-serif",
                fontSize: { xs: '1rem', md: '1.15rem' },
                color: '#64748b',
                fontWeight: 500,
                lineHeight: 1.6,
                mb: 4,
                maxWidth: 600,
                mx: 'auto'
              }}>
                Instantly compare verified rates from Africa's top 50+ lenders. Transparent, secure, and institutional-grade credit planning.
              </Typography>
            </motion.div>

            {/* AI Search Bar (Light Mode) */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <Box className="rb-search-bar" sx={{
                maxWidth: 600, mx: 'auto',
                background: '#fff',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                border: '1.5px solid rgba(0,0,0,0.08)',
                borderRadius: '24px',
                display: 'flex', alignItems: 'center', p: 1, gap: 1,
                transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              }}>
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2, px: 2 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  <input
                    className="rb-search-input"
                    placeholder='e.g. "personal loan under 15%"'
                    value={heroSearchText}
                    onChange={(e) => setHeroSearchText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsAiModalOpen(true)}
                    style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '14.5px', color: '#050d1a', fontFamily: "'Inter', sans-serif", width: '100%' }}
                  />
                </Box>
                <Box onClick={() => setIsAiModalOpen(true)} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '18px', px: 3.5, py: 1.75, cursor: 'pointer', transition: 'all 0.2s', '&:hover': { transform: 'scale(0.97)', opacity: 0.9 } }}>
                  <Typography sx={{ fontSize: '13.5px', fontWeight: 900, color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif", whiteSpace: 'nowrap' }}>Resolve AI</Typography>
                </Box>
              </Box>
            </motion.div>
          </Box>

          {/* Integrated Product Strip */}
  
          {/* trust strip (Hero Footer) */}
  
        </Container>
      </Box>

              <Box sx={{ 
            position: 'relative', zIndex: 10, 
            mx: 'auto', maxWidth: 1200, px: { xs: 2, md: 4 }, py: { xs: 4, md: 6 },
            background: '#10b981ff',
            border: '1.5px solid rgba(0,0,0,0.04)',
            boxShadow: '0 40px 100px -20px rgba(0,0,0,0.08), 0 20px 40px -15px rgba(0,0,0,0.03)',
            borderRadius: '14px',
            mt: { xs: -2, md: -12 }
          }}>
            <Grid container spacing={{ xs: 2, md: 2.5 }}>
              {[
                { label: 'Personal Loans', desc: 'Consolidate debt or fund major life purchases — compare 20+ lenders.', href: '/loans/personal', tag: 'Popular', stat: 'From 14%', icon: <MoneyIcon sx={{ fontSize: 32, color: '#1e293b' }} /> },
                { label: 'Business Credit', desc: 'Growth capital and revolving lines for African SMEs and enterprises.', href: '/loans/business', tag: 'Business', stat: 'Up to GH₵ 1M', icon: <BusinessIcon sx={{ fontSize: 32, color: '#1e293b' }} /> },
                { label: 'Insurance', desc: 'Health, life, auto and property cover — instant quotes from top providers.', href: '/insurance', tag: 'Instant', stat: '6 Categories', icon: <SecurityRounded sx={{ fontSize: 32, color: '#1e293b' }} /> },
                { label: 'Vehicle Finance', desc: 'New and used car financing from verified regional bank partners.', href: '/loans/auto', tag: '48hr Approval', stat: 'From 16%', icon: <CarIcon sx={{ fontSize: 32, color: '#1e293b' }} /> },
                { label: 'Home Equity', desc: "Unlock your property's value for major investments or renovations.", href: '/mortgages', tag: 'High Value', stat: 'Up to GH₵ 2M', icon: <HomeIcon sx={{ fontSize: 32, color: '#1e293b' }} /> },
                { label: 'Free Credit Score', desc: 'Institutional-grade credit check with personalized insights.', href: '/credit', tag: 'Free', stat: 'Instant', icon: <ScoreIcon sx={{ fontSize: 32, color: '#1e293b' }} /> },
                { label: 'Savings & Investments', desc: 'High-yield savings and fixed deposit accounts across 15+ banks.', href: '/savings', tag: 'High Yield', stat: 'Up to 22%', icon: <SavingsIcon sx={{ fontSize: 32, color: '#1e293b' }} /> },
                { label: 'Buy Now, Pay Later', desc: `Flexible installment plans from Ghana's leading BNPL providers.`, href: '/bnpl', tag: '0% Interest', stat: 'Intro offers', icon: <AccountBalanceWalletRounded sx={{ fontSize: 32, color: '#1e293b' }} /> },
              ].map((p, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={p.label}>
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }} style={{ height: '100%' }}>
                    <Link href={p.href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                      <Box className="rb-prod-card" sx={{ 
                        background: '#fff', border: '1.5px solid rgba(0,0,0,0.06)', borderRadius: '24px', 
                        p: { xs: 3, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column', 
                        alignItems: 'center', textAlign: 'center', gap: 2.5,
                        cursor: 'pointer', position: 'relative', overflow: 'hidden', 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)' 
                      }}>
                        {/* Top Right Arrow indicator */}
                        <Box className="rb-prod-arrow" sx={{ position: 'absolute', top: 18, right: 18, opacity: 0.3, transition: 'all 0.3s' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                        </Box>

                        {/* Minimal Skeleton Icon */}
                        <Box sx={{ 
                          width: 48, height: 48, borderRadius: '50%', background: 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', 
                          flexShrink: 0, mb: 0.5
                        }}>{p.icon}</Box>

                        <Box>
                          <Typography sx={{ 
                            fontSize: '17px', fontWeight: 900, color: '#0f172a', 
                            letterSpacing: '-0.025em', fontFamily: "'Plus Jakarta Sans', sans-serif", 
                            mb: 1 
                          }}>{p.label}</Typography>
                          <Typography sx={{ 
                            fontSize: '13px', color: '#64748b', fontWeight: 500, 
                            fontFamily: "'Inter', sans-serif", lineHeight: 1.5 
                          }}>{p.desc}</Typography>
                        </Box>
                      </Box>
                    </Link>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>


      {/* ── INSTANT CALCULATOR SECTION ──────────────────────────── */}
      <Box component="section" sx={{ py: { xs: 12, md: 20 }, background: '#fcfdfe', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <Container maxWidth="xl">
          <Grid container spacing={{ xs: 8, lg: 12 }} alignItems="center">
            {/* Text Side */}
            <Grid size={{ xs: 12, lg: 5 }}>
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                <Typography sx={{ fontSize: '12px', fontWeight: 900, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.2em', mb: 2 }}>Instant Transparency</Typography>
                <Typography variant="h2" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900, fontSize: { xs: '2.4rem', md: '3.6rem' }, color: '#050d1a', letterSpacing: '-0.04em', lineHeight: 1.1, mb: 3 }}>
                  Calculate your <span style={{ color: '#10b981' }}>repayment power</span> in seconds.
                </Typography>
                <Typography sx={{ fontSize: '18px', color: '#64748b', fontWeight: 500, lineHeight: 1.6, mb: 6, maxWidth: 500 }}>
                  Institutional-grade estimates for any loan size. No credit impact, no hidden fees — just pure financial intelligence.
                </Typography>
                
                <Stack spacing={4}>
                  {[
                    { title: 'Granular Breakdowns', desc: 'See exactly what you owe monthly, weekly, and even daily.' },
                    { title: 'Institutional Rates', desc: 'Synced with current market averages from 50+ lenders.' }
                  ].map((f, i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 2.5 }}>
                      <Box sx={{ width: 24, height: 24, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.5 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '16px', fontWeight: 800, color: '#050d1a', mb: 0.5 }}>{f.title}</Typography>
                        <Typography sx={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>{f.desc}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </motion.div>
            </Grid>

            {/* Calculator Side */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                <Box sx={{ 
                  background: '#fff', borderRadius: '48px', p: { xs: 4, md: 8 }, 
                  boxShadow: '0 40px 100px -20px rgba(0,0,0,0.08)', border: '1.5px solid rgba(0,0,0,0.04)',
                  display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 8
                }}>
                  {/* Inputs */}
                  <Box>
                    <CalculatorInputs />
                  </Box>

                  {/* Results Pane */}
                  <Box sx={{ 
                    background: '#020617', borderRadius: '32px', p: 5, color: '#fff',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(2,6,23,0.3)'
                  }}>
                    <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'rgba(16,185,129,0.1)', borderRadius: '50%', blur: '40px' }} />
                    <CalculatorResults />
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── NEWS SLIDER ─────────────────────────────────────────── */}
      <NewsSlider />

      {/* ── 4. Why Trust Section (matching screenshot) ────────────────── */}
      <section className="py-24 md:py-36 bg-white">
        <Container maxWidth="xl">
          <Typography
            variant="h2"
            className="text-3xl md:text-5xl font-black text-slate-900 text-center mb-24 tracking-tight "
          >
            Why do millions of Africans trust ResolveBridge?
          </Typography>

          <Grid container spacing={8} alignItems="center">
            {/* Left: Overlapping Mobile */}
            <Grid size={{ xs: 12, lg: 6 }} className="relative flex justify-center pb-20 lg:pb-0 mt-20">
              <Box className="relative w-full max-w-[500px]">
                <motion.div
                  initial={{ opacity: 0, x: -50, rotate: -10 }}
                  whileInView={{ opacity: 1, x: 0, rotate: -5 }}
                  viewport={{ once: true }}
                  className="absolute top-0 left-0 w-[65%] z-10"
                >
                  <img
                    src="/images/mobile_apply.png"
                    alt="Mobile App"
                    className="w-full h-auto rounded-[32px] shadow-2xl border-4 border-[#0a1e2b]"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 50, rotate: 10 }}
                  whileInView={{ opacity: 1, x: 100, rotate: 5 }}
                  viewport={{ once: true }}
                  className="relative w-[65%] z-20 top-20"
                >
                  <img
                    src="/images/mobile_compare.png"
                    alt="Comparison View"
                    className="w-full h-auto rounded-[32px] shadow-2xl border-4 border-[#0a1e2b]"
                  />
                </motion.div>
              </Box>
            </Grid>

            {/* Right: Points */}
            <Grid size={{ xs: 12, lg: 6 }} className="px-4 md:px-12 mt-20">
              <Stack spacing={8}>
                {[
                  {
                    title: 'Security',
                    desc: 'Instead of sharing sensitive financial information with multiple institutions, fill out one simple, encrypted form in minutes.',
                  },
                  {
                    title: 'Institutional Reach',
                    desc: 'Directly compare pre-qualified offers from our network of 50+ regional and international banks competing for your interest.',
                  },
                  {
                    title: 'Continuous Support',
                    desc: 'We provide ongoing monitoring with institutional-grade credit insights and personalized recommendations to maximize your capital power.',
                  },
                ].map((point, i) => (
                  <Stack key={i} direction="row" spacing={4} alignItems="flex-start">
                    <Box className="w-12 h-12 rounded-full border-2 border-emerald-500 text-emerald-500 flex items-center justify-center font-black text-xl shrink-0 mt-1">
                      {i + 1}
                    </Box>
                    <Stack spacing={1}>
                      <Typography className="text-2xl font-black text-slate-800 tracking-tight leading-none uppercase">
                        {point.title}
                      </Typography>
                      <Typography className="text-slate-500 text-lg font-medium leading-relaxed max-w-lg">
                        {point.desc}
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
              <Box className="mt-16">
                <Link
                  href="/about"
                  className="flex items-center gap-2 text-emerald-600 font-black text-lg hover:gap-4 transition-all uppercase tracking-widest"
                >
                  Learn More <ChevronRightRounded />
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* ── 5. Featured Rates ────────────────────────────────────── */}
         <section className="bg-[#f8fafc] py-20 md:py-28 border-y border-slate-100">
      <Container maxWidth="xl">
 
        {/* Header */}
        <Box className="flex  gap-5 mb-14 px-1">
       
          {/* Right: section title */}
          <Typography
            variant="h2"
            className="text-3xl md:text-[40px] font-black text-slate-900 tracking-tight leading-tight text-left sm:text-right"
            sx={{ fontFamily: "'Syne', sans-serif", letterSpacing: '-0.04em' }}
          >
            Featured rates on our network
          </Typography>
        </Box>
 
        {/* Rate Cards */}
        <Grid container spacing={2.5} className="mb-5">
          {RATES.map((rate) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={rate.label}>
              <Link href={rate.href} className="block h-full no-underline">
                <Card
                  className="h-full rounded-2xl border border-slate-100 shadow-none bg-white group transition-all duration-250 hover:-translate-y-1"
                  sx={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: 'none',
                    '&:hover': {
                      borderColor: '#cbd5e1',
                      boxShadow: '0 12px 32px rgba(0,0,0,0.07)',
                    },
                  }}
                >
                  {/* Top accent bar */}
                  <Box sx={{ height: 3, backgroundColor: rate.accent }} />
 
                  <Box className="p-7 flex flex-col h-full">
                    {/* Category tag */}
                    <Box
                      className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full mb-5"
                      sx={{ backgroundColor: rate.tagBg }}
                    >
                      <Box
                        sx={{
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          backgroundColor: rate.accent,
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        className="text-[11px] font-black uppercase tracking-wider leading-none"
                        sx={{ color: rate.tagColor }}
                      >
                        {rate.label}
                      </Typography>
                    </Box>
 
                    {/* APR label */}
                    <Typography className="text-[10.5px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                      APR rates as low as
                    </Typography>
 
                    {/* Rate */}
                    <Typography
                      className="text-slate-900 leading-none mb-6"
                      sx={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 'clamp(40px, 5vw, 52px)',
                        fontWeight: 800,
                        letterSpacing: '-0.05em',
                      }}
                    >
                      {rate.rate}
                    </Typography>
 
                    {/* Details */}
                    <Box
                      className="mt-auto pt-5 border-t border-slate-100"
                      sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                    >
                      <Box className="flex items-center justify-between">
                        <Typography className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                          {rate.detailsLabel}
                        </Typography>
                        <Typography className="text-[12px] font-bold text-slate-600">
                          {rate.details}
                        </Typography>
                      </Box>
                      <Box className="flex items-center justify-between">
                        <Typography className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                          {rate.loanLabel}
                        </Typography>
                        <Typography className="text-[12px] font-bold text-slate-600">
                          {rate.loan}
                        </Typography>
                      </Box>
                    </Box>
 
                    {/* CTA */}
                    <Button
                      variant="contained"
                      disableElevation
                      fullWidth
                      endIcon={<ArrowForwardRounded sx={{ fontSize: '14px !important' }} />}
                      className="mt-6"
                      sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '13px',
                        backgroundColor: '#0a1e2b',
                        color: '#fff',
                        borderRadius: '10px',
                        py: 1.25,
                        boxShadow: 'none',
                        '&:hover': {
                          backgroundColor: rate.accent,
                          boxShadow: 'none',
                        },
                        transition: 'background-color 0.2s',
                      }}
                    >
                      Compare rates
                    </Button>
                  </Box>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
 
        {/* Disclaimer */}
        <Typography className="text-center text-[11.5px] font-medium text-slate-400 mt-10 px-4 italic max-w-2xl mx-auto leading-relaxed">
          Rates above may change at lender discretion and may not be available at the time of loan
          commitment or lock-in.
        </Typography>
      </Container>
    </section>

      {/* ── 6. Tools Journey Section (matching screenshot) ─────────── */}
      <section className="py-24 md:py-36 bg-white overflow-hidden">
        <Container maxWidth="xl">
           <Typography variant="h2" className="text-3xl md:text-5xl font-black text-slate-900 mb-16 tracking-tight">
             Tools to start your financial journey
           </Typography>
           
           <Box className="bg-emerald-500 rounded-[20px] p-8 md:p-16 relative min-h-[500px] mt-10">
              {/* Abstract decorative elements */}
              <div className="absolute top-0 right-0 w-[500px] h-full bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1),_transparent)] pointer-events-none" />
              
              <Grid container spacing={6} alignItems="center">
                 {/* Left: Tools Grid */}
                 <Grid size={{ xs: 12, lg: 7 }}>
                    <Grid container spacing={3}>
                       {[
                         { 
                           title: 'Loan Comparisons', 
                           desc: 'Comparing to find your lowest rate could save you millions.', 
                           icon: <HomeIcon className="text-emerald-500" />, 
                           link: 'Compare Rates',
                           href: '/portal/marketplace'
                         },
                         { 
                           title: 'Ratings & Reviews', 
                           desc: 'Read real verified audits about the lenders on our network.', 
                           icon: <StarRounded className="text-emerald-500" />, 
                           link: 'Read lender audits',
                           href: '/reviews'
                         },
                         { 
                           title: 'Liquidity Calculator', 
                           desc: 'Calculate your borrowing power across African markets.', 
                           icon: <CalculateRounded className="text-emerald-500" />, 
                           link: 'Use Calculator',
                           href: '/portal/calculator'
                         },
                         { 
                           title: 'Credit Discovery', 
                           desc: 'Instant access to your institutional credit score and profile.', 
                           icon: <ScoreIcon className="text-emerald-500" />, 
                           link: 'Explore credit score',
                           href: '/credit'
                         },
                       ].map((tool, i) => (
                         <Grid size={{ xs: 12, sm: 6 }} key={i}>
                            <Card className="rounded-3xl p-8 h-full shadow-none border-none flex flex-col gap-4 group relative overflow-hidden">
                               <Box className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-2 z-10">
                                  {tool.icon}
                               </Box>
                               <Typography className="text-[18px] font-black text-slate-900 tracking-tight leading-none uppercase z-10">{tool.title}</Typography>
                               <Typography className="text-slate-500 text-[13px] font-medium leading-relaxed leading-snug z-10">
                                  {tool.desc}
                               </Typography>
                               <Link href={tool.href} style={{ textDecoration: 'none', zIndex: 10, marginTop: 'auto' }}>
                                 <Button
                                   variant="contained"
                                   disableElevation
                                   fullWidth
                                   endIcon={<ArrowForwardRounded sx={{ fontSize: '14px !important', padding:"20px" }} />}
                                   className="mt-6"
                                   sx={{
                                     textTransform: 'none',
                                     fontWeight: 700,
                                     fontSize: '13px',
                                     backgroundColor: '#0a1e2b',
                                     color: '#fff',
                                     borderRadius: '20px',
                                     py: 1.25,
                                     boxShadow: 'none',
                                     '&:hover': {
                                       backgroundColor: '#10b981',
                                       boxShadow: '0 8px 24px rgba(16,185,129,0.25)',
                                     },
                                     transition: 'all 0.2s',
                                   }}
                                 >
                                   {tool.link}
                                 </Button>
                               </Link>
                            </Card>
                         </Grid>
                       ))}
                    </Grid>
                 </Grid>
                 
                 {/* Right: Persona Visuals */}
                 <Grid size={{ xs: 12, lg: 5 }} className="relative flex justify-center lg:justify-end">
                    <Box className="relative w-full max-w-[420px]">
                       <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8 }}
                          className="relative z-10"
                       >
                          <img 
                            src="/images/hero_persona.png" 
                            alt="The Resolve Expert" 
                            className="w-full h-auto drop-shadow-2xl" 
                          />
                       </motion.div>
                       
                       {/* Floating Credit Score UI */}
                       <motion.div
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                          className="absolute top-[20%] -right-[15%] md:-right-[10%] bg-white rounded-full p-4 md:p-6 shadow-2xl z-20 border border-slate-100 flex items-center gap-4"
                       >
                          <Typography className="text-3xl font-black text-slate-800">785</Typography>
                          <Box className="w-[100px] h-2 bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 w-[85%]" />
                          </Box>
                       </motion.div>
                       
                       {/* Floating Savings Badge */}
                       <motion.div
                          animate={{ y: [0, 8, 0] }}
                          transition={{ duration: 4, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
                          className="absolute bottom-[10%] -left-[10%] bg-[#0f172a] rounded-2xl p-4 md:p-6 shadow-2xl z-30 border border-white/10"
                       >
                          <Typography className="text-white text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">We Found Value!</Typography>
                          <Typography className="text-emerald-400 text-2xl font-black tracking-tighter">$1,250+</Typography>
                       </motion.div>
                    </Box>
                 </Grid>
              </Grid>
           </Box>
        </Container>
      </section>

      {/* ── 7. ResolveBridge Vault (matching screenshot) ───────────── */}
      <section className="py-24 md:py-36 bg-[#fcfdfe] overflow-hidden border-b border-slate-100">
        <Container maxWidth="xl">
          <Grid container spacing={12} alignItems="center">
             {/* Left: Dynamic Dashboard Preview */}
             <Grid size={{ xs: 12, lg: 6 }}>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="relative group pr-4 md:pr-12"
                >
                   {/* Background circular glow */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
                   
                   <Box className="relative z-10 transition-transform duration-700 group-hover:scale-[1.02]">
                      <img 
                        src="/images/hero_dashboard.png" 
                        alt="ResolveBridge Vault Dashboard" 
                        className="w-full h-auto drop-shadow-[0_32px_64px_rgba(0,0,0,0.12)] rounded-[32px] border border-slate-100" 
                      />
                      
                      {/* Sub-card 1: Value Found */}
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -right-4 md:-right-8 top-[15%] bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col gap-2 min-w-[200px]"
                      >
                         <Typography className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Credit Health</Typography>
                         <Typography className="text-xl font-bold text-slate-900 leading-tight">Save by paying less interest</Typography>
                         <Typography className="text-[12px] text-slate-400 font-medium">Your credit factors have declined. Find out more and fix them.</Typography>
                      </motion.div>
                   </Box>
                </motion.div>
             </Grid>

             {/* Right: Content & Benefits */}
             <Grid size={{ xs: 12, lg: 6 }}>
                <Box className="max-w-xl">
                   <Typography 
                      variant="h2" 
                      className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]"
                      sx={{ fontFamily: "'Syne', sans-serif" }}
                   >
                      Introducing ResolveBridge <span className="text-emerald-500 italic">Vault</span>, where your capital grows
                   </Typography>
                   <Typography className="text-slate-500 text-lg font-medium mb-10 leading-relaxed max-w-md">
                      Grow your financial confidence with a free institutional Vault account:
                   </Typography>

                   <Stack spacing={4}>
                      {[
                        { 
                          title: 'Nurture your credit score', 
                          desc: 'Simple, verified steps developed just for your institutional profile.' 
                        },
                        { 
                          title: 'Dig into personalized guidance', 
                          desc: 'Precision analytics to help you make smarter, high-impact financial decisions.' 
                        },
                        { 
                          title: 'Get customized institutional offers', 
                          desc: 'Unlock exclusive rates for mortgages, SME loans, credit lines, and more.' 
                        },
                      ].map((benefit, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                          className="flex items-start gap-4 group"
                        >
                           <Box className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-500 shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                              <VerifiedUserRounded sx={{ fontSize: 20 }} />
                           </Box>
                           <Box>
                              <Typography className="text-xl font-black text-slate-900 mb-1 tracking-tight" sx={{ fontFamily: "'Syne', sans-serif" }}>
                                 {benefit.title}
                              </Typography>
                              <Typography className="text-slate-500 font-medium leading-normal">
                                 {benefit.desc}
                              </Typography>
                           </Box>
                        </motion.div>
                      ))}
                   </Stack>

                   <Box className="mt-14">
                      <Button
                        component={Link}
                        href="/login"
                        variant="contained"
                        disableElevation
                        sx={{ 
                          textTransform: 'none', 
                          borderRadius: '12px',
                          backgroundColor: '#10b981',
                          color: '#fff',
                          px: 6,
                          py: 2,
                          fontSize: '16px',
                          fontWeight: 700,
                          '&:hover': { backgroundColor: '#059669' }
                        }}
                      >
                        Create My Free Vault Account
                      </Button>
                   </Box>
                </Box>
             </Grid>
          </Grid>
        </Container>
      </section>

      {/* ── 8. Stats ─────────────────────────────────────────────── */}
{/* ── Stats ─────────────────────────────────────────────── */}
      <Box className="bg-[#0a1e2b] py-20 md:py-24">
        <Container maxWidth="xl">

          {/* Section header row */}
          <Box className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-14">
            <Box className="flex items-center gap-2.5">
              <Box className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Typography className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">
                Live platform metrics
              </Typography>
            </Box>
            <Typography
              variant="h3"
              className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight text-left sm:text-right"
              sx={{ fontFamily: "'Syne', sans-serif", letterSpacing: '-0.03em' }}
            >
              Trusted across{' '}
              <em className="italic text-emerald-400">the continent.</em>
            </Typography>
          </Box>

          {/* Stats grid */}
          <Grid container spacing={0.5}>
            {[
              {
                val: '400',
                suffix: 'K+',
                label: 'Verified Residents',
                desc: 'Individuals and businesses matched to institutional lenders.',
                fill: 72,
              },
              {
                val: '$85',
                suffix: 'M+',
                label: 'Continental Flow',
                desc: 'Capital deployed across African markets through our network.',
                fill: 85,
              },
              {
                val: '4.2',
                suffix: 's',
                label: 'Match Latency',
                desc: 'Average time to surface your best verified rate offer.',
                fill: 42,
              },
              {
                val: '50',
                suffix: '+',
                label: 'Verified Lenders',
                desc: 'Institutional partners live on the ResolveBridge network.',
                fill: 50,
              },
            ].map((s, i) => (
              <Grid size={{ xs: 6, md: 3 }} key={i}>
                <motion.div
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
                  className="relative h-full rounded-2xl p-8 md:p-10 cursor-default overflow-hidden group"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                >
                  {/* Number */}
                  <Typography
                    className="leading-none mb-2"
                    sx={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 'clamp(38px, 4vw, 54px)',
                      fontWeight: 800,
                      color: '#fff',
                      letterSpacing: '-0.05em',
                      lineHeight: 1,
                    }}
                  >
                    {s.val}
                    <span style={{ color: '#10b981' }}>{s.suffix}</span>
                  </Typography>

                  {/* Label */}
                  <Typography className="text-[10.5px] font-black uppercase tracking-[0.18em] text-white/35 mb-4">
                    {s.label}
                  </Typography>

                  {/* Description */}
                  <Typography className="text-[13px] text-white/25 leading-relaxed font-medium hidden md:block">
                    {s.desc}
                  </Typography>

                  {/* Bottom accent bar — appears on hover */}
                  <Box
                    className="absolute bottom-0 left-0 h-[2px] bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    sx={{ width: `${s.fill}%` }}
                  />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      {/* ── 8. Process Engine ────────────────────────────────────── */}
   {/* ── 9. What does ResolveBridge do? (matching screenshot) ─── */}
      {/* ── 9. Professional Institutional Section ─────────────────── */}
      <section className="py-24 md:py-40 bg-white relative overflow-hidden">
        {/* Subtle background element */}
        <Box sx={{ position: 'absolute', top: '10%', right: '-5%', width: '40%', height: '60%', background: 'radial-gradient(circle, rgba(16,185,129,0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />
        
        <Container maxWidth="xl">
          <Grid container spacing={{ xs: 8, lg: 12 }} alignItems="center">
             {/* Left: Content */}
             <Grid size={{ xs: 12, lg: 6.5 }}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <Box className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
                    <Box className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <Typography className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600">
                      Our Institutional Mandate
                    </Typography>
                  </Box>

                  <Typography 
                    variant="h2" 
                    sx={{ 
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 900,
                      fontSize: { xs: '2.2rem', md: '3.5rem' },
                      lineHeight: 1.1,
                      letterSpacing: '-0.04em',
                      color: '#050d1a',
                      mb: 4
                    }}
                  >
                    The Transparency Layer for <br />
                    <span className="text-emerald-500">African Lending.</span>
                  </Typography>

                  <Typography className="text-slate-500 text-lg font-medium mb-12 leading-relaxed max-w-xl">
                    ResolveBridge bridges the gap between ambitious businesses and 50+ institutional lenders. We provide the verification infrastructure that ensures every match is fast, transparent, and built on trust.
                  </Typography>

                  {/* Value Props */}
                  <Stack spacing={4}>
                    {[
                      { 
                        title: 'Verified Institutional Network', 
                        desc: 'Every lender on our platform undergoes a rigorous institutional vetting process for liquidity and transparency.',
                        icon: <BusinessIcon sx={{ fontSize: 28 }} />
                      },
                      { 
                        title: 'Algorithmic Matching Engine', 
                        desc: 'Our proprietary Resolve AI instantly calculates the best rate for your specific profile across hundreds of variants.',
                        icon: <ZapRounded sx={{ fontSize: 28 }} />
                      },
                      { 
                        title: 'Mandate-First Communication', 
                        desc: 'We replace opaque processes with clear, firm mandates. No more guessing, just standardized fulfillment.',
                        icon: <SecurityRounded sx={{ fontSize: 28 }} />
                      }
                    ].map((item, i) => (
                      <Box key={i} className="flex gap-6 items-start">
                        <Box className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center flex-shrink-0 text-emerald-500">
                          {item.icon}
                        </Box>
                        <Box>
                          <Typography className="text-lg font-black text-slate-900 mb-1 leading-tight">
                            {item.title}
                          </Typography>
                          <Typography className="text-slate-500 text-sm font-medium leading-relaxed max-w-md">
                            {item.desc}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>

                  <Box className="mt-14">
                    <Button
                      variant="contained"
                      disableElevation
                      endIcon={<ArrowForwardRounded />}
                      sx={{
                        background: '#0a1e2b',
                        borderRadius: '12px',
                        px: 4,
                        py: 1.8,
                        fontSize: '14px',
                        fontWeight: 800,
                        textTransform: 'none',
                        '&:hover': { background: '#050d1a' }
                      }}
                    >
                      Explore the Network
                    </Button>
                  </Box>
                </motion.div>
             </Grid>

             {/* Right: Network Viz */}
             <Grid size={{ xs: 12, lg: 5.5 }} className="relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="relative"
                >
                  <Box sx={{ position: 'relative', zIndex: 10 }}>
                    <img 
                      src="/images/network_viz.png" 
                      alt="Digital Financial Network" 
                      style={{ 
                        width: '100%', 
                        height: 'auto', 
                        borderRadius: '32px', 
                        boxShadow: '0 40px 80px rgba(0,0,0,0.12)',
                        border: '1px solid rgba(0,0,0,0.05)'
                      }} 
                    />
                    
                    {/* Floating Info Card */}
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ 
                        position: 'absolute', 
                        bottom: '20px', 
                        left: '-30px', 
                        background: '#fff', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '20px', 
                        padding: '16px 20px', 
                        boxShadow: '0 20px 48px rgba(0,0,0,0.1)',
                        zIndex: 20
                      }}
                    >
                      <Typography sx={{ fontSize: '10px', fontWeight: 900, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 0.5 }}>Network Active</Typography>
                      <Typography sx={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>Live Verification</Typography>
                    </motion.div>
                  </Box>

                  {/* Decorative background element */}
                  <Box sx={{ position: 'absolute', top: '-20px', right: '-20px', width: '100%', height: '100%', border: '2px solid #f1f5f9', borderRadius: '32px', zIndex: 0 }} />
                </motion.div>
             </Grid>
          </Grid>
        </Container>
      </section>

      {/* ── 10. Expert Insights (matching screenshot) ────────────── */}
      <section className="py-24 md:py-32 bg-white">
        <Container maxWidth="xl">
          <Typography 
            variant="h2" 
            className="text-3xl md:text-5xl font-black text-slate-900 mb-16 tracking-tight"
            sx={{ fontFamily: "'Syne', sans-serif" }}
          >
            From our experts
          </Typography>

          <Grid container spacing={6}>
             {[
               { 
                 category: 'SME CAPITAL', 
                 title: 'Scaling your business with institutional credit lines', 
                 img: '/images/experts/sme.png' 
               },
               { 
                 category: 'MORTGAGES', 
                 title: 'The future of home ownership in West Africa: 2026 Trends', 
                 img: '/images/experts/mortgage.png' 
               },
               { 
                 category: 'BEST PERSONAL LOANS', 
                 title: 'How to structure debt for long-term capital growth', 
                 img: '/images/experts/personal.png' 
               },
               { 
                 category: 'CAR INSURANCE', 
                 title: 'Average cost of commercial vehicle protection in 2026', 
                 img: '/images/experts/auto.png' 
               },
               { 
                 category: 'CREDIT HEALTH', 
                 title: 'Understanding your institutional credit profile today', 
                 img: '/images/experts/credit.png' 
               },
               { 
                 category: 'MARKET INTEL', 
                 title: 'Continental liquidity trends: A deep dive into regional flux', 
                 img: '/images/experts/market.png' 
               },
             ].map((article, i) => (
               <Grid size={{ xs: 12, lg: 6 }} key={i}>
                  <Link href="#" className="flex gap-6 group no-underline">
                     <Box className="w-[180px] md:w-[240px] h-[120px] md:h-[160px] shrink-0 rounded-2xl overflow-hidden border border-slate-100 shadow-sm transition-transform duration-500 group-hover:scale-95">
                        <img 
                          src={article.img} 
                          alt={article.title} 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                        />
                     </Box>
                     <Box className="flex flex-col justify-center gap-1.5 overflow-hidden">
                        <Typography className="text-emerald-600 text-[11px] font-black uppercase tracking-[0.2em] leading-none mb-1">
                           {article.category}
                        </Typography>
                        <Typography 
                          className="text-slate-900 text-lg md:text-xl font-bold leading-tight tracking-tight group-hover:text-emerald-500 transition-colors line-clamp-2"
                          sx={{ fontFamily: "'Syne', sans-serif" }}
                        >
                           {article.title}
                        </Typography>
                     </Box>
                  </Link>
               </Grid>
             ))}
          </Grid>

          <Box className="mt-20 text-center">
             <Link 
               href="/insights" 
               className="inline-flex items-center gap-2 text-slate-800 font-black text-lg hover:gap-4 transition-all uppercase tracking-[0.2em] border-b-2 border-emerald-500 pb-1"
             >
               View all expert articles <ArrowForwardRounded sx={{ fontSize: 20 }} />
             </Link>
          </Box>
        </Container>
      </section>

      {/* ── 10. Product Ecosystem ─────────────────────────────────── */}
      {/* <section className="py-24 md:py-32 bg-[#fcfdfe]">
        <Container maxWidth="xl">
          <Box className="mb-16 text-center">
            <Typography
              variant="h3"
              className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight"
            >
              Financial <span className="text-emerald-500 italic font-serif">Ecosystem.</span>
            </Typography>
            <Typography className="text-slate-500 text-base md:text-lg font-medium max-w-xl mx-auto italic">
              Scale your footprint through our verified institutional hubs.
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {[
              { title: 'SME Credit Hub', desc: "Institutional liquidity built for the continent's high-scale enterprises.", icon: <AccountBalanceWalletRounded /> },
              { title: 'Global Health', desc: 'Corporate-grade protection for teams and individuals.', icon: <SecurityRounded /> },
              { title: 'Retail BNPL', desc: "The engine for Africa's retail and merchant expansion.", icon: <ZapRounded /> },
              { title: 'Vehicle Finance', desc: 'Professional financing for logistics, transit and personal fleets.', icon: <CarIcon /> },
            ].map((p, i) => (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={i}>
                <Link
                  href="/solutions"
                  className="block h-full border-b-2 border-transparent hover:border-emerald-500 transition-all duration-300"
                >
                  <Card className="rounded-[28px] h-full p-8 group shadow-none border border-slate-100 bg-white hover:shadow-lg hover:shadow-slate-100 transition-all duration-300">
                    <Box className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all duration-400 mb-8">
                      {p.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      className="text-lg font-black text-slate-900 mb-3 uppercase tracking-tight group-hover:text-emerald-600 transition-colors leading-none"
                    >
                      {p.title}
                    </Typography>
                    <Typography className="text-slate-400 text-sm font-medium leading-relaxed group-hover:text-slate-600 transition-colors">
                      {p.desc}
                    </Typography>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section> */}

      {/* AI Assistant Modal Overlay */}
      <AiSearchModal 
        open={isAiModalOpen} 
        onClose={() => setIsAiModalOpen(false)} 
        initialSearch={heroSearchText} 
      />

    </main>
  );
}