'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Button, 
  Stack, 
  Divider,
  Slider
} from '@mui/material';
import { 
  ShieldRounded, 
  CheckCircleRounded, 
  ArrowForwardRounded, 
  DirectionsCarRounded, 
  LocalShippingRounded, 
  PublicRounded, 
  VerifiedUserRounded, 
  SecurityRounded, 
  HealthAndSafetyRounded,
  AddRounded,
  RemoveRounded,
  BoltRounded,
  ArrowBackIosNewRounded,
  StarRounded
} from '@mui/icons-material';
import Link from 'next/link';

const insuranceTypes = [
  { 
    icon: <DirectionsCarRounded fontSize="large" />, 
    title: "Automotive & Fleet", 
    description: "All-risk auto protection covering collisions, theft, third-party liability, and engine damage for private cars and commercial vehicle fleets.",
    bullets: ["Collision & Accident Cover", "Third-Party Liability Protection", "Instant Mobile Towing Support"],
    color: "#10b981" 
  },
  { 
    icon: <HealthAndSafetyRounded fontSize="large" />, 
    title: "Health & Life Shield", 
    description: "Premium healthcare underwriting for individuals and company teams. Seamless coverage for outpatient, dental, optical, and inpatient services.", 
    bullets: ["Direct Outpatient Access", "Comprehensive Wellness Packages", "24/7 Virtual Consultation Support"],
    color: "#7c3aed" 
  },
  { 
    icon: <LocalShippingRounded fontSize="large" />, 
    title: "Logistics & Cargo", 
    description: "Protect assets in transit against damage, theft, piracy, or transport disruption across international borders and sea lanes.", 
    bullets: ["Cross-Border Cargo Cover", "Real-Time Freight Underwriting", "Comprehensive Port-to-Port Cover"],
    color: "#f59e0b" 
  },
  { 
    icon: <PublicRounded fontSize="large" />, 
    title: "Travel Protection", 
    description: "Reliable travel cover with emergency medical assistance, trip delays, lost baggage protection, and direct payouts on global flights.", 
    bullets: ["Allianz Emergency Network", "Baggage & Trip Cancellation Cover", "Direct Claims Settlement"],
    color: "#2563eb" 
  }
];

const FAQS = [
  { 
    q: "How fast are claims settled?", 
    a: "With ResolveBridge's direct digitized claims network, verified claims under GH₵ 20,000 are settled within 24 hours. Larger claims undergo instant collaborative audit and are typically resolved within 7 business days." 
  },
  { 
    q: "Can I manage multiple policies?", 
    a: "Yes. From your portal dashboard under 'Insurance Portfolio', you can review coverage limits, renew plans, adjust deductibles, and download certificates of cover for all active policies in one place." 
  },
  { 
    q: "What happens if I travel outside my home country?", 
    a: "Our Travel Protection and Premium Health policies offer 100% global emergency coverage, including direct integration with Allianz global emergency response units." 
  },
  { 
    q: "Are there any fleet discounts for corporate clients?", 
    a: "Absolutely. ResolveBridge provides automated fleet rate consolidation. If you operate more than 5 logistics or company vehicles, our system automatically negotiates bulk underwriting terms with standard discounts up to 25%." 
  }
];

const PARTNER_LOGOS = [
  { name: 'Allianz', img: '/resolve_icon.png' },
  { name: 'Leadway', img: '/resolve_icon.png' },
  { name: 'Old Mutual', img: '/resolve_icon.png' },
  { name: 'Sanlam', img: '/resolve_icon.png' },
  { name: 'AXA Mansard', img: '/resolve_icon.png' }
];

export default function InsurancePage() {
  const [mounted, setMounted] = useState(false);
  const [category, setCategory] = useState<'auto' | 'health' | 'logistics' | 'travel'>('auto');
  const [assetValue, setAssetValue] = useState(150000); 
  const [coverageLevel, setCoverageLevel] = useState<'basic' | 'standard' | 'premium'>('standard');
  const [isCalculating, setIsCalculating] = useState(false);
  const calcTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update assetValue limits when category changes to prevent slider issues
  useEffect(() => {
    if (category === 'health') setAssetValue(3);
    else if (category === 'travel') setAssetValue(14);
    else if (category === 'logistics') setAssetValue(500000);
    else setAssetValue(150000);
  }, [category]);

  // Trigger calculation shimmer
  useEffect(() => {
    setIsCalculating(true);
    if (calcTimeoutRef.current) clearTimeout(calcTimeoutRef.current);
    calcTimeoutRef.current = setTimeout(() => {
      setIsCalculating(false);
    }, 250);
    return () => {
      if (calcTimeoutRef.current) clearTimeout(calcTimeoutRef.current);
    };
  }, [category, assetValue, coverageLevel]);

  const sliderConfig = useMemo(() => {
    switch (category) {
      case 'health':
        return { min: 1, max: 10, step: 1, label: 'Insured Members', unit: 'Members' };
      case 'logistics':
        return { min: 50000, max: 5000000, step: 50000, label: 'Cargo Value', unit: 'GH₵' };
      case 'travel':
        return { min: 3, max: 90, step: 1, label: 'Trip Duration', unit: 'Days' };
      case 'auto':
      default:
        return { min: 20000, max: 1000000, step: 10000, label: 'Estimated Vehicle Value', unit: 'GH₵' };
    }
  }, [category]);

  const estimatedPremium = useMemo(() => {
    let base = 0;
    if (category === 'health') {
      const memberCost = coverageLevel === 'basic' ? 80 : coverageLevel === 'standard' ? 180 : 420;
      base = assetValue * memberCost;
    } else if (category === 'travel') {
      const dayCost = coverageLevel === 'basic' ? 6 : coverageLevel === 'standard' ? 12 : 24;
      base = assetValue * dayCost;
    } else if (category === 'logistics') {
      const annualRate = coverageLevel === 'basic' ? 0.007 : coverageLevel === 'standard' ? 0.016 : 0.032;
      base = (assetValue * annualRate) / 12;
    } else {
      const annualRate = coverageLevel === 'basic' ? 0.014 : coverageLevel === 'standard' ? 0.030 : 0.055;
      base = (assetValue * annualRate) / 12;
    }
    return Math.max(10, Math.round(base));
  }, [category, assetValue, coverageLevel]);

  if (!mounted) return null;

  return (
    <main style={{ minHeight: '100vh', background: '#fff', overflowX: 'hidden' }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-bg {
          background: linear-gradient(90deg, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.08) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
          display: inline-block;
          border-radius: 4px;
        }
        .rb-card { transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1) !important; }
        .rb-card:hover { transform: translateY(-6px) !important; box-shadow: 0 24px 48px rgba(0,0,0,0.06) !important; border-color: rgba(16,185,129,0.3) !important; }
      `}</style>

      {/* ══ HERO & ESTIMATOR SECTION ═══════════════════════ */}
      <Box sx={{ 
        position: 'relative', 
        background: '#04080f', 
        pt: { xs: '120px', md: '150px' }, 
        pb: { xs: '80px', md: '120px' },
        overflow: 'hidden' 
      }}>
        {/* Subtle Decorative Atmosphere */}
        <Box sx={{ position: 'absolute', top: '-10%', left: '10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: '-20%', right: '5%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <Container maxWidth="lg">
          {/* Back Nav Link */}
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '32px' }}>
            <Box sx={{ width: 28, height: 28, borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s', '&:hover': { background: 'rgba(255,255,255,0.1)' } }}>
              <ArrowBackIosNewRounded sx={{ fontSize: 12, color: '#fff' }} />
            </Box>
            Back to home
          </Link>

          <Grid container spacing={{ xs: 6, lg: 8 }} alignItems="center">
            {/* Left Column: Hero Text */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <Box sx={{ pr: { lg: 4 } }}>
                <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 900, display: 'block', mb: 2, fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Uncompromising Protection</Typography>
                <Typography variant="h1" sx={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 900,
                  color: '#fff',
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.2rem' },
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  mb: 3
                }}>
                  Africa's Smartest<br />
                  Insurance <Box component="span" sx={{ background: 'linear-gradient(130deg, #10b981 0%, #059669 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Shield</Box>
                </Typography>
                <Typography sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: { xs: '1rem', md: '1.15rem' },
                  color: '#94a3b8',
                  fontWeight: 500,
                  lineHeight: 1.6,
                  mb: 4,
                  maxWidth: 540
                }}>
                  Compare coverage modules, estimate monthly premiums in real time, and lock in underwriting directly with top African insurance brands.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button 
                    href="#modules"
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#fff',
                      borderRadius: '12px',
                      px: 4,
                      py: 1.8,
                      fontSize: '13.5px',
                      fontWeight: 900,
                      textTransform: 'none',
                      '&:hover': { background: '#059669', transform: 'translateY(-2px)' },
                      transition: 'all 0.3s'
                    }}
                  >
                    Browse Coverage Modules
                  </Button>
                  <Button 
                    href="/contact"
                    component={Link}
                    variant="outlined"
                    sx={{
                      borderColor: 'rgba(255,255,255,0.15)',
                      color: '#fff',
                      borderRadius: '12px',
                      px: 3,
                      py: 1.8,
                      fontSize: '13.5px',
                      fontWeight: 800,
                      textTransform: 'none',
                      background: 'rgba(255,255,255,0.03)',
                      '&:hover': { borderColor: '#10b981', background: 'rgba(16,185,129,0.05)', color: '#10b981' },
                      transition: 'all 0.3s'
                    }}
                  >
                    Speak with Underwriter
                  </Button>
                </Stack>
              </Box>
            </Grid>

            {/* Right Column: Dynamic Estimate Premium Widget */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
                <Box sx={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                  borderRadius: '24px',
                  p: { xs: 3, md: 4 },
                  position: 'relative'
                }}>
                  <Typography sx={{ color: '#fff', fontSize: '15px', fontWeight: 900, fontFamily: "'Plus Jakarta Sans', sans-serif", mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ShieldRounded sx={{ color: '#10b981', fontSize: 18 }} />
                    Shield Premium Estimator
                  </Typography>

                  {/* Category Buttons Tabs */}
                  <Typography sx={{ fontSize: '11px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1.5 }}>Select Shield Category</Typography>
                  <Grid container spacing={1} sx={{ mb: 3 }}>
                    {[
                      { id: 'auto', label: 'Auto' },
                      { id: 'health', label: 'Health' },
                      { id: 'logistics', label: 'Cargo' },
                      { id: 'travel', label: 'Travel' }
                    ].map((cat) => {
                      const isActive = category === cat.id;
                      return (
                        <Grid size={{ xs: 3 }} key={cat.id}>
                          <Box 
                            onClick={() => setCategory(cat.id as any)}
                            sx={{
                              py: 1.25,
                              textAlign: 'center',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              background: isActive ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(255,255,255,0.03)',
                              color: isActive ? '#fff' : '#94a3b8',
                              fontWeight: 900,
                              fontSize: '12px',
                              border: isActive ? 'none' : '1px solid rgba(255,255,255,0.05)',
                              transition: 'all 0.2s',
                              '&:hover': { background: isActive ? '' : 'rgba(255,255,255,0.08)', color: '#fff' }
                            }}
                          >
                            {cat.label}
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>

                  {/* Dynamic Slider */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography sx={{ fontSize: '11px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{sliderConfig.label}</Typography>
                    <Typography sx={{ fontSize: '14px', fontWeight: 900, color: '#10b981', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {sliderConfig.unit === 'GH₵' ? `GH₵ ${assetValue.toLocaleString()}` : `${assetValue} ${sliderConfig.unit}`}
                    </Typography>
                  </Stack>
                  <Slider 
                    value={assetValue}
                    min={sliderConfig.min}
                    max={sliderConfig.max}
                    step={sliderConfig.step}
                    onChange={(_, val) => setAssetValue(val as number)}
                    sx={{ color: '#10b981', mb: 3.5, '& .MuiSlider-thumb': { backgroundColor: '#fff', border: '3px solid currentColor' } }}
                  />

                  {/* Coverage Level Pills */}
                  <Typography sx={{ fontSize: '11px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1.5 }}>Coverage Protection Grade</Typography>
                  <Stack direction="row" spacing={1.5} sx={{ mb: 4 }}>
                    {[
                      { id: 'basic', label: 'Basic Grade' },
                      { id: 'standard', label: 'Standard Shield' },
                      { id: 'premium', label: 'Premium Shield' }
                    ].map((lvl) => {
                      const isActive = coverageLevel === lvl.id;
                      return (
                        <Box 
                          key={lvl.id}
                          onClick={() => setCoverageLevel(lvl.id as any)}
                          sx={{
                            flex: 1,
                            py: 1,
                            textAlign: 'center',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            background: isActive ? 'rgba(16,185,129,0.12)' : 'transparent',
                            color: isActive ? '#10b981' : '#94a3b8',
                            border: `1.5px solid ${isActive ? '#10b981' : 'rgba(255,255,255,0.08)'}`,
                            fontWeight: 800,
                            fontSize: '11px',
                            transition: 'all 0.2s',
                            '&:hover': { borderColor: '#10b981', color: '#fff' }
                          }}
                        >
                          {lvl.label}
                        </Box>
                      );
                    })}
                  </Stack>

                  {/* Estimate Display Box */}
                  <Box sx={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', p: 3, mb: 4 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>Estimated Premium</Typography>
                        <Typography sx={{ fontSize: '24px', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', minHeight: 36 }}>
                          {isCalculating ? (
                            <span className="shimmer-bg" style={{ width: 100, height: 24 }} />
                          ) : (
                            <>GH₵ {estimatedPremium.toLocaleString()} <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: 500, marginLeft: 6 }}>/ {category === 'travel' ? 'trip' : 'month'}</span></>
                          )}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>Claim Limit</Typography>
                        <Typography sx={{ fontSize: '14px', fontWeight: 800, color: '#10b981' }}>
                          {category === 'health' ? 'Comprehensive' : `GH₵ ${(assetValue * (coverageLevel === 'premium' ? 1 : 0.8)).toLocaleString()}`}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <Button
                    fullWidth
                    component={Link}
                    href={`/get-started?type=insurance&category=${category}&grade=${coverageLevel}`}
                    variant="contained"
                    sx={{
                      py: 1.8,
                      borderRadius: '14px',
                      background: '#10b981',
                      color: '#fff',
                      fontWeight: 900,
                      fontSize: '13px',
                      textTransform: 'none',
                      '&:hover': { background: '#059669' }
                    }}
                  >
                    Lock in this Quote
                  </Button>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ══ VERIFIED UNDERWRITERS TRUST BOARD ═══════════════════════ */}
      <Box sx={{ py: 6, background: '#f8fafc', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <Container maxWidth="lg">
          <Typography sx={{ fontSize: '10.5px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', mb: 3.5, textAlign: 'center' }}>
            Underwritten by Africa's Trust Anchors
          </Typography>
          <Grid container spacing={4} justifyContent="center" alignItems="center" sx={{ opacity: 0.6 }}>
            {PARTNER_LOGOS.map((p, i) => (
              <Grid size={{ xs: 6, sm: 4, md: 2.4 }} key={i} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ filter: 'grayscale(100%)', '&:hover': { filter: 'grayscale(0%)', opacity: 1 }, transition: 'all 0.3s' }}>
                  <img src={p.img} alt="" style={{ height: 22, objectFit: 'contain' }} />
                  <Typography sx={{ fontSize: '13px', fontWeight: 900, color: '#475569', letterSpacing: '-0.02em' }}>{p.name}</Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ══ COVERAGE MODULES GRID ═══════════════════════ */}
      <Box id="modules" sx={{ py: { xs: 10, md: 16 }, background: '#fff' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: '600px', mx: 'auto', mb: 10 }}>
            <Typography sx={{ fontSize: '11px', fontWeight: 900, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.25em', mb: 2 }}>Protection Modules</Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '28px', md: '42px' }, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', mb: 2.5 }}>
              Asset & Family Protection
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '15px', lineHeight: 1.6 }}>
              Select a specialized module tailored for the African continent's unique business and family environments.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {insuranceTypes.map((module, idx) => (
              <Grid size={{ xs: 12, md: 6 }} key={idx}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: idx * 0.1 }}>
                  <Box className="rb-card" sx={{
                    p: { xs: 4, md: 5 },
                    height: '100%',
                    borderRadius: '24px',
                    border: '1.5px solid rgba(0,0,0,0.06)',
                    background: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <Box>
                      {/* Icon with illuminated circle */}
                      <Box sx={{ 
                        width: 56, 
                        height: 56, 
                        borderRadius: '16px', 
                        background: `${module.color}0c`, 
                        color: module.color, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        mb: 4,
                        border: `1.5px solid ${module.color}1e`
                      }}>
                        {module.icon}
                      </Box>

                      <Typography variant="h4" sx={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', mb: 2, letterSpacing: '-0.02em' }}>
                        {module.title}
                      </Typography>

                      <Typography sx={{ color: '#64748b', fontSize: '13.5px', lineHeight: 1.6, mb: 4 }}>
                        {module.description}
                      </Typography>

                      {/* Highlights list */}
                      <Stack spacing={2} sx={{ mb: 4 }}>
                        {module.bullets.map((b, i) => (
                          <Stack key={i} direction="row" spacing={1.5} alignItems="center">
                            <CheckCircleRounded sx={{ color: '#10b981', fontSize: 16 }} />
                            <Typography sx={{ fontSize: '13px', color: '#334155', fontWeight: 600 }}>{b}</Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Box>

                    <Button
                      component={Link}
                      href={`/get-started?type=insurance&module=${module.title.toLowerCase().replace(/\s/g, '-')}`}
                      variant="outlined"
                      endIcon={<ArrowForwardRounded />}
                      sx={{
                        py: 1.5,
                        borderRadius: '12px',
                        borderColor: 'rgba(0,0,0,0.08)',
                        color: '#0f172a',
                        fontWeight: 800,
                        fontSize: '12.5px',
                        textTransform: 'none',
                        '&:hover': { borderColor: module.color, background: `${module.color}05`, color: module.color }
                      }}
                    >
                      Configure Cover
                    </Button>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ══ FAQ SECTION ═══════════════════════ */}
      <Box sx={{ py: { xs: 10, md: 16 }, background: '#f8fafc', borderTop: '1px solid rgba(0,0,0,0.04)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: '600px', mx: 'auto', mb: 8 }}>
            <Typography sx={{ fontSize: '11px', fontWeight: 900, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.25em', mb: 2 }}>Frequently Asked Queries</Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '28px', md: '42px' }, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>
              Claims & Underwriting FAQs
            </Typography>
          </Box>

          <Box sx={{ maxWidth: '780px', mx: 'auto' }}>
            {FAQS.map((faq, idx) => {
              const isExpanded = expandedFaqIndex === idx;
              return (
                <Box 
                  key={idx} 
                  sx={{ 
                    mb: 2.5, 
                    border: '1.5px solid rgba(0,0,0,0.05)', 
                    borderRadius: '16px', 
                    background: '#fff', 
                    overflow: 'hidden', 
                    transition: 'all 0.3s ease',
                    boxShadow: isExpanded ? '0 12px 24px rgba(0,0,0,0.02)' : 'none',
                    borderColor: isExpanded ? 'rgba(16,185,129,0.3)' : 'rgba(0,0,0,0.05)'
                  }}
                >
                  <Box 
                    onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                    sx={{ 
                      p: 3, 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '14.5px', pr: 2 }}>{faq.q}</Typography>
                    <Box sx={{ color: '#10b981', display: 'flex', alignItems: 'center', transition: 'transform 0.3s', transform: isExpanded ? 'rotate(180deg)' : 'none' }}>
                      {isExpanded ? <RemoveRounded /> : <AddRounded />}
                    </Box>
                  </Box>
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <Box sx={{ px: 3, pb: 3, borderTop: '1px solid rgba(0,0,0,0.03)' }}>
                          <Typography sx={{ color: '#64748b', fontSize: '13.5px', lineHeight: 1.6, pt: 2 }}>{faq.a}</Typography>
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>

      {/* ══ CLOSING CTA SECTION ═══════════════════════ */}
      <Box sx={{ py: { xs: 10, md: 16 }, background: '#fff' }}>
        <Container maxWidth="lg">
          <Box sx={{
            position: 'relative',
            background: '#04080f',
            borderRadius: '40px',
            p: { xs: 6, md: 10 },
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
            textAlign: 'center'
          }}>
            {/* Background atmosphere */}
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 50%, rgba(16,185,129,0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />

            <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 640, mx: 'auto' }}>
              <Box sx={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 4 }}>
                <BoltRounded />
              </Box>
              <Typography variant="h3" sx={{ fontSize: { xs: '26px', md: '44px' }, fontWeight: 900, color: '#fff', mb: 3, letterSpacing: '-0.03em' }}>
                Protect What Matters Today
              </Typography>
              <Typography sx={{ color: '#94a3b8', fontSize: '15px', lineHeight: 1.6, mb: 5 }}>
                Deploy comprehensive cover for your vehicle, cargo, or family health under a single unified billing dashboard.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} justifyContent="center" alignItems="center">
                <Button
                  component={Link}
                  href="/get-started?type=insurance"
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#fff',
                    borderRadius: '12px',
                    px: 5,
                    py: 1.8,
                    fontSize: '14px',
                    fontWeight: 900,
                    textTransform: 'none',
                    width: { xs: '100%', sm: 'auto' },
                    '&:hover': { background: '#059669' }
                  }}
                >
                  Configure My Shield
                </Button>
                <Button
                  component={Link}
                  href="/contact"
                  variant="outlined"
                  sx={{
                    borderColor: 'rgba(255,255,255,0.15)',
                    color: '#fff',
                    borderRadius: '12px',
                    px: 4,
                    py: 1.8,
                    fontSize: '14px',
                    fontWeight: 800,
                    textTransform: 'none',
                    width: { xs: '100%', sm: 'auto' },
                    background: 'rgba(255,255,255,0.03)',
                    '&:hover': { borderColor: '#10b981', background: 'rgba(16,185,129,0.05)', color: '#10b981' }
                  }}
                >
                  Speak with Underwriter
                </Button>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>
    </main>
  );
}
