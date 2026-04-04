'use client';

import { motion, AnimatePresence } from 'framer-motion';
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
import { useEffect, useState } from 'react';

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
    href: '/loans/vehicle',
  },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const isMobile = useMediaQuery('(max-width:900px)');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTab = HERO_TABS[activeTab];

  return (
    <main className="min-h-screen bg-[#fcfdfe] overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Spacer for sticky navbar */}
      <Box className="h-[72px]" />

      {/* ── 1. Hero Headline ─────────────────────────────────────── */}
      <section className="bg-white pt-16 pb-14">
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <Typography
              variant="h1"
              className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.05] mb-0"
            >
              Find the best loan,{' '}
              <span className="text-emerald-500 italic font-serif">not just a loan.</span>
            </Typography>
          </motion.div>
        </Container>
      </section>

      {/* ── 2. Category Tab Bar ───────────────────────────────────── */}
      <section className="relative z-50 bg-white border-y border-slate-100">
        <Container maxWidth="xl" className="px-0">
          <Tabs
            value={activeTab}
            onChange={(_, val) => { if (val < HERO_TABS.length) setActiveTab(val); }}
            centered={!isMobile}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={isMobile ? "auto" : false}
            className="min-h-0"
            TabIndicatorProps={{ sx: { display: 'none' } }}
            sx={{ 
              '& .MuiTabs-flexContainer': { 
                gap: 0,
                justifyContent: isMobile ? 'flex-start' : 'center'
              } 
            }}
          >
            {HERO_TABS.map((tab, i) => (
              <Tab
                key={tab.id}
                icon={tab.icon}
                iconPosition="top"
                label={tab.label}
                sx={{
                  minHeight: isMobile ? 72 : 88,
                  px: isMobile ? 3 : 5,
                  textTransform: 'none',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  opacity: 1,
                  letterSpacing: '0.01em',
                  borderRight: '1px solid',
                  borderColor: 'rgba(0,0,0,0.05)',
                  transition: 'all 0.3s',
                  backgroundColor: activeTab === i ? '#0a1e2b' : 'transparent',
                  color: activeTab === i ? '#fff !important' : undefined,
                  '&:hover': {
                    backgroundColor: activeTab === i ? '#0a1e2b' : 'rgba(0,0,0,0.02)',
                  },
                  '& .MuiTab-iconWrapper': {
                    marginBottom: '5px',
                    color: activeTab === i ? '#10b981' : alpha('#10b981', 0.35),
                    transition: 'color 0.3s',
                  },
                  '&:hover .MuiTab-iconWrapper': {
                    color: '#10b981',
                  },
                }}
              />
            ))}
            <Tab
              icon={<ArrowForwardRounded sx={{ fontSize: 18 }} />}
              iconPosition="top"
              label="More Hubs"
              sx={{
                minHeight: isMobile ? 72 : 88,
                px: isMobile ? 3 : 5,
                textTransform: 'none',
                fontSize: '12.5px',
                fontWeight: 700,
                opacity: 1,
                color: '#10b981',
                '&:hover': { backgroundColor: 'rgba(16,185,129,0.04)' },
                '& .MuiTab-iconWrapper': {
                  marginBottom: '5px',
                  backgroundColor: alpha('#10b981', 0.08),
                  borderRadius: '10px',
                  padding: '8px',
                },
              }}
            />
          </Tabs>
        </Container>
 
        {/* Active caret indicator */}
        {!isMobile && (
          <motion.div
            layoutId="triangle-indicator"
            className="absolute bottom-[-7px] w-3.5 h-3.5 bg-[#0a1e2b] rotate-45 z-10"
            style={{
              left: `calc(50% - (${(HERO_TABS.length + 1) * 0.5} * 100% / ${(HERO_TABS.length + 1)}) + (${activeTab} * 100% / ${(HERO_TABS.length + 1)}) + (100% / ${(HERO_TABS.length + 1) * 2}) - 7px)`,
              // Simplified calculation for centered tabs of equal width:
              // Total width of all tabs (approx) = (HERO_TABS.length + 1) * tabWidth
              // The tabs are centered, so they start at 50% - (totalWidth / 2)
            }}
            animate={{
              left: `calc(50% - (770px / 2) + (${activeTab} * (770px / 6)) + (770px / 12) - 7px)`
              // This is a fixed estimate based on px: 5 and content.
              // For a more robust solution, we use the MUI centered behavior.
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          />
        )}
      </section>
      {/* ── 3. Hero Content ──────────────────────────────────────── */}
      <section className="relative py-20 md:py-32 bg-[#fcfdfe] overflow-hidden">
        <div className="absolute top-1/2 right-[8%] w-[360px] h-[360px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none -translate-y-1/2" />

        <Container maxWidth="xl">
          <Grid container spacing={8} alignItems="center">
            {/* Left */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Stack spacing={3} className="text-center md:text-left items-center md:items-start px-4 md:px-0">
                    <Box className="flex items-center gap-3">
                      <Box className="w-6 h-px bg-emerald-500" />
                      <Typography className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-600">
                        Verification Engine Active
                      </Typography>
                    </Box>

                    <Typography
                      variant="h1"
                      className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.0] tracking-tight"
                    >
                      {currentTab.title}
                      <br />
                      <span className="text-emerald-500">{currentTab.highlight}</span>
                    </Typography>

                    <Typography className="text-slate-500 text-base md:text-lg font-medium max-w-md leading-relaxed">
                      {currentTab.desc}
                    </Typography>

                    <Box className="pt-3">
                  <Button
                      variant="contained"
                      disableElevation
                      fullWidth
                      endIcon={<ArrowForwardRounded sx={{ fontSize: '14px !important' }} />}
                      className="mt-6 w-full p-20"
                      sx={{
                        textTransform: 'none',
                        padding:"20px",
                        fontWeight: 700,
                        fontSize: '13px',
                        backgroundColor: '#0a1e2b',
                        color: '#fff',
                        borderRadius: '10px',
                        py: 1.25,
                        boxShadow: 'none',
                        '&:hover': {
                         
                          boxShadow: 'none',
                        },
                        transition: 'background-color 0.2s',
                      }}
                    >
                      {currentTab.cta}
                    </Button>
                    </Box>

                    <Stack direction="row" spacing={2.5} alignItems="center" className="opacity-40 pt-6">
                      <VerifiedUserRounded sx={{ fontSize: 15 }} />
                      <Typography className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Privacy Secured
                      </Typography>
                      <Divider orientation="vertical" flexItem sx={{ height: 12, alignSelf: 'center' }} />
                      <Typography className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Institutional Transparency
                      </Typography>
                    </Stack>
                  </Stack>
                </motion.div>
              </AnimatePresence>
            </Grid>

            {/* Right */}
            <Grid size={{ xs: 12, lg: 6 }} className="relative flex justify-center lg:justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.97, x: 16 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative max-w-[580px] w-full"
              >
                <img
                  src="/images/hero_lendingtree.png"
                  alt="Institutional Specialist"
                  className="w-full h-auto relative z-10"
                />

                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute bottom-[10%] right-[8%] bg-white/95 backdrop-blur-sm border border-slate-100 p-6 rounded-3xl z-20 flex flex-col gap-3 min-w-[240px] shadow-xl shadow-slate-200/40"
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar className="w-10 h-10 bg-emerald-500">
                      <ChartIcon sx={{ fontSize: 20 }} />
                    </Avatar>
                    <Box>
                      <Typography className="text-base font-black text-slate-900 leading-tight">50+ Lenders</Typography>
                      <Typography className="text-[9px] font-black uppercase text-emerald-600 tracking-wider">
                        Live liquidity matching
                      </Typography>
                    </Box>
                  </Stack>
                  <Divider />
                  <Typography className="text-[10.5px] font-medium text-slate-400">
                    Institutional rates verified every 60 seconds.
                  </Typography>
                </motion.div>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </section>

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
                           link: 'Compare Rates' 
                         },
                         { 
                           title: 'Ratings & Reviews', 
                           desc: 'Read real verified audits about the lenders on our network.', 
                           icon: <StarRounded className="text-emerald-500" />, 
                           link: 'Read lender audits' 
                         },
                         { 
                           title: 'Liquidity Calculator', 
                           desc: 'Calculate your borrowing power across African markets.', 
                           icon: <CalculateRounded className="text-emerald-500" />, 
                           link: 'Use Calculator' 
                         },
                         { 
                           title: 'Credit Discovery', 
                           desc: 'Instant access to your institutional credit score and profile.', 
                           icon: <ScoreIcon className="text-emerald-500" />, 
                           link: 'Explore credit score' 
                         },
                       ].map((tool, i) => (
                         <Grid size={{ xs: 12, sm: 6 }} key={i}>
                            <Card className="rounded-3xl p-8 h-full shadow-none border-none flex flex-col gap-4 group">
                               <Box className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-2">
                                  {tool.icon}
                               </Box>
                               <Typography className="text-[18px] font-black text-slate-900 tracking-tight leading-none uppercase">{tool.title}</Typography>
                               <Typography className="text-slate-500 text-[13px] font-medium leading-relaxed leading-snug">
                                  {tool.desc}
                               </Typography>
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
                          
                          boxShadow: 'none',
                        },
                        transition: 'background-color 0.2s',
                      }}
                    >
                      {tool.link}
                    </Button>
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
                        href="/vault"
                        variant="contained"
                        disableElevation
                        className="bg-[#0a1e2b] hover:bg-emerald-500 px-12 py-4 rounded-xl text-base font-bold transition-all"
                        sx={{ textTransform: 'none', borderRadius: '12px' }}
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
 <section className="py-24 md:py-32 bg-white">
        <Container maxWidth="lg">

          {/* Header */}
          <Box className="text-center mb-16">
            <Box className="inline-flex items-center gap-3 mb-4">
              <Box className="w-6 h-px bg-emerald-500" />
              <Typography className="text-[11px] font-black uppercase tracking-[0.22em] text-emerald-500">
                Verification Protocol
              </Typography>
              <Box className="w-6 h-px bg-emerald-500" />
            </Box>
            <Typography
              variant="h2"
              className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight"
              sx={{ fontFamily: "'Syne', sans-serif", letterSpacing: '-0.04em' }}
            >
              The ResolveBridge{' '}
              <em className="italic text-emerald-500">Engine.</em>
            </Typography>
            <Typography className="text-slate-500 text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed">
              Connecting businesses and individuals to institutional liquidity with absolute transparency.
            </Typography>
          </Box>

          {/* Two-col layout */}
          <Grid container spacing={8} alignItems="center">

            {/* Steps */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <Stack spacing={0}>
                {[
                  {
                    num: '01',
                    tag: 'Search',
                    title: 'Liquidity Search',
                    desc: 'Direct-to-bank API connection for real-time rate discovery across the region.',
                  },
                  {
                    num: '02',
                    tag: 'Verify',
                    title: 'Institutional Audit',
                    desc: 'AI-driven verification to ensure fees and terms match the mandate.',
                  },
                  {
                    num: '03',
                    tag: 'Deploy',
                    title: 'Rapid Settlement',
                    desc: 'Secure capital deployment directly to your verified institutional account.',
                  },
                ].map((step, i, arr) => (
                  <Box key={i} className="flex gap-0">
                    {/* Left: number + connector line */}
                    <Box className="flex flex-col items-center w-12 flex-shrink-0">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center z-10 group-hover:bg-[#0a1e2b] group-hover:border-[#0a1e2b] transition-all"
                      >
                        <Typography
                          className="text-[11px] font-black text-slate-400 leading-none"
                          sx={{ fontFamily: "'Syne', sans-serif" }}
                        >
                          {step.num}
                        </Typography>
                      </motion.div>
                      {i < arr.length - 1 && (
                        <Box className="w-px flex-1 bg-slate-100 my-1" />
                      )}
                    </Box>

                    {/* Right: content */}
                    <motion.div
                      whileHover={{ x: 4 }}
                      className={`pl-5 pb-10 group ${i === arr.length - 1 ? 'pb-0' : ''}`}
                    >
                      {/* Mini tag */}
                      <Box className="flex items-center gap-1.5 mb-2">
                        <Box className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <Typography className="text-[10.5px] font-black uppercase tracking-widest text-emerald-500">
                          {step.tag}
                        </Typography>
                      </Box>

                      <Typography
                        className="text-lg font-black text-slate-900 mb-2 tracking-tight group-hover:text-emerald-600 transition-colors"
                        sx={{ fontFamily: "'Syne', sans-serif" }}
                      >
                        {step.title}
                      </Typography>
                      <Typography className="text-slate-400 text-sm font-medium leading-relaxed group-hover:text-slate-600 transition-colors max-w-sm">
                        {step.desc}
                      </Typography>
                    </motion.div>
                  </Box>
                ))}
              </Stack>
            </Grid>

            {/* Image */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <motion.div
                whileHover={{ scale: 0.985 }}
                transition={{ duration: 0.3 }}
                className="relative bg-slate-50 border border-slate-100 rounded-3xl overflow-hidden"
              >
                <img
                  src="/images/process_network.png"
                  alt="ResolveBridge Engine"
                  className="w-full h-auto block grayscale hover:grayscale-0 transition-all duration-[2s]"
                />

                {/* Live badge */}
                <Box className="absolute bottom-5 left-5 bg-white border border-slate-100 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
                  <Box className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                  <Box>
                    <Typography className="text-[12.5px] font-bold text-slate-900 leading-tight">
                      Engine live
                    </Typography>
                    <Typography className="text-[11px] text-slate-400 leading-tight mt-0.5">
                      Rates verified every 60s
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </section>      {/* ── 9. What does ResolveBridge do? (matching screenshot) ─── */}
      <section className="py-24 md:py-32 bg-slate-50/50 border-t border-slate-100 overflow-hidden">
        <Container maxWidth="xl">
          <Grid container spacing={8} alignItems="center">
             {/* Left: Explanation & Links */}
             <Grid size={{ xs: 12, lg: 7 }}>
                <Box className="max-w-xl">
                   <Typography 
                      variant="h2" 
                      className="text-3xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight"
                      sx={{ fontFamily: "'Syne', sans-serif" }}
                   >
                      What does ResolveBridge do?
                   </Typography>
                   <Typography className="text-slate-500 text-lg font-medium mb-20 leading-relaxed">
                      ResolveBridge is Africa's premier financial marketplace, built to save you time and maximize your capital efficiency. <strong>We don't make loans; we find them.</strong> In fact, we've been verifying and matching businesses with institutional liquidity for years. Our network is the most trusted in the region, filled with lenders that meet our rigorous transparency standards.
                   </Typography>

                   {/* Icon Grid */}
                   <Grid container spacing={4}>
                      {[
                        { label: 'SME Capital', icon: <BusinessIcon className="text-emerald-500" /> },
                        { label: 'Personal Loans', icon: <MoneyIcon className="text-emerald-500" /> },
                        { label: 'Home Equity', icon: <HomeIcon className="text-emerald-500" /> },
                        { label: 'Auto Finance', icon: <CarIcon className="text-emerald-500" /> },
                        { label: 'Payroll Solutions', icon: <AccountBalanceWalletRounded className="text-emerald-500" /> },
                        { label: 'Liquidity Calculator', icon: <CalculateRounded className="text-emerald-500" /> },
                      ].map((item, i) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={i}>
                           <Link href="#" className="flex items-center gap-4 group no-underline">
                              <Box className="w-8 h-8 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                                 {item.icon}
                              </Box>
                              <Typography className="text-slate-600 font-bold text-lg group-hover:text-emerald-600 transition-colors">
                                 {item.label}
                              </Typography>
                           </Link>
                        </Grid>
                      ))}
                   </Grid>
                </Box>
             </Grid>

             {/* Right: Thinking Persona */}
             <Grid size={{ xs: 12, lg: 5 }} className="relative flex justify-center lg:justify-end mt-12 lg:mt-0">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="relative group"
                >
                   <img 
                      src="/images/what_we_do.png" 
                      alt="Thinking about Resolve" 
                      className="w-full h-auto max-w-[450px] drop-shadow-2xl" 
                   />
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


    </main>
  );
}