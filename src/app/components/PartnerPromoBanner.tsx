'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftRounded, ChevronRightRounded, CloseRounded } from '@mui/icons-material';
import Link from 'next/link';

interface PromoAd {
  id: number;
  tag: string;
  title: string;
  highlight: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  image: string;
  stats: { label: string; value: string }[];
  gradient: string;
}

const PROMO_ADS: PromoAd[] = [
  {
    id: 1,
    tag: 'SPONSORED INVESTMENT',
    title: 'Lekki Heights Real Estate Fund',
    highlight: 'Historical 11.4% Annualized Yield',
    description: 'The Lekki Heights Real Estate Fund is built for investors seeking steady USD-hedged cash flow and capital growth. This fund invests in a diversified portfolio of premium commercial and residential properties across Lagos\'s high-brow Lekki peninsula.',
    buttonText: 'EXPLORE FUND',
    buttonHref: '/savings',
    image: '/images/home_loans.png',
    stats: [
      { label: 'Total Net Assets', value: '$45.2M' },
      { label: 'Projected IRR', value: '14.2%' },
      { label: 'Minimum Ticket', value: '$5,000' },
      { label: 'Active Investors', value: '3,800+' }
    ],
    gradient: 'linear-gradient(135deg, #020617 0%, #0f172a 40%, #0d9488 100%)' // Slate to teal
  },
  {
    id: 2,
    tag: 'PARTNER OFFER',
    title: 'Stanbic IBTC SME Growth Bond',
    highlight: 'Up to ₦50M Collateral-Free Credit',
    description: 'Empower your agribusiness or retail enterprise with quick expansion capital. Stanbic IBTC Bank offers pre-approved credit lines to verified business users on the Resolve Bridge platform with flexible 12-month repayments.',
    buttonText: 'APPLY NOW',
    buttonHref: '/loans/business',
    image: '/images/business_loans.png',
    stats: [
      { label: 'Max Loan Amount', value: '₦50,000,000' },
      { label: 'Interest Rate', value: '16.5% p.a.' },
      { label: 'Approval Speed', value: '24 Hours' },
      { label: 'Repayment Term', value: '12 Months' }
    ],
    gradient: 'linear-gradient(135deg, #020617 0%, #0f172a 40%, #1d4ed8 100%)' // Slate to blue
  },
  {
    id: 3,
    tag: 'PARTNER SPOTLIGHT',
    title: 'Leadway Agriculture Shield Plan',
    highlight: '100% Crop & Equipment Insurance',
    description: 'Protect your farming investments from unpredictable weather and climate disruption. Get comprehensive agricultural insurance with instant claims payout on the Resolve Bridge network.',
    buttonText: 'GET A QUOTE',
    buttonHref: '/insurance',
    image: '/images/resolve_insurance_group.png',
    stats: [
      { label: 'Premium Rate', value: '1.8% of Asset' },
      { label: 'Coverage Limit', value: '₦100M+' },
      { label: 'Claims Payout', value: 'Within 7 Days' },
      { label: 'Farmers Shielded', value: '12K+' }
    ],
    gradient: 'linear-gradient(135deg, #020617 0%, #0f172a 40%, #15803d 100%)' // Slate to green
  }
];

export default function PartnerPromoBanner({ onDismiss }: { onDismiss?: () => void } = {}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const prevStep = () => {
    setDirection(-1);
    setIndex((prev) => (prev === 0 ? PROMO_ADS.length - 1 : prev - 1));
  };

  const nextStep = () => {
    setDirection(1);
    setIndex((prev) => (prev === PROMO_ADS.length - 1 ? 0 : prev + 1));
  };

  // Auto-play timer
  useEffect(() => {
    if (!isVisible || isHovered) return;
    const timer = setInterval(nextStep, 8000);
    return () => clearInterval(timer);
  }, [isVisible, isHovered]);

  // Load dismissed state from sessionStorage on mount
  useEffect(() => {
    const dismissed = sessionStorage.getItem('rb_partner_banner_dismissed');
    if (dismissed === 'true') {
      const timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('rb_partner_banner_dismissed', 'true');
    if (onDismiss) {
      onDismiss();
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 100 : -100,
      opacity: 0
    })
  };

  if (!isVisible) return null;

  const currentAd = PROMO_ADS[index];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0, y: 20 }}
        animate={{ opacity: 1, height: 'auto', y: 0 }}
        exit={{ opacity: 0, height: 0, y: 20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <Box
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          sx={{
            position: 'relative',
            width: '100%',
            borderRadius: '20px',
            background: currentAd.gradient,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
            p: { xs: 2.5, md: 3 },
            pb: { xs: 3, md: 3 },
            transition: 'background 0.5s ease-in-out',
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 2, md: 2.5 }
          }}
        >
          {/* Header row: SPONSORED Badge and Dismiss Button */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
            <Box
              sx={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                px: 1.5,
                py: 0.5,
              }}
            >
              <Typography
                sx={{
                  color: '#10b981',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800,
                  fontSize: '10.5px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}
              >
                {currentAd.tag}
              </Typography>
            </Box>

            <IconButton
              onClick={handleDismiss}
              size="small"
              sx={{
                color: 'rgba(255, 255, 255, 0.4)',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                '&:hover': {
                  color: '#fff',
                  background: 'rgba(255, 255, 255, 0.12)',
                },
                transition: 'all 0.2s'
              }}
            >
              <CloseRounded sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          {/* Main content slider row */}
          <Box sx={{ position: 'relative', minHeight: { xs: 'auto', md: '160px' }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "tween", duration: 0.35, ease: "easeInOut" },
                  opacity: { duration: 0.25 }
                }}
                style={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: 'center',
                  gap: '32px',
                  width: '100%'
                }}
              >
                {/* Left side: Content text */}
                <Box sx={{ flex: 1.3, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography
                    variant="h3"
                    sx={{
                      color: '#fff',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 800,
                      fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.65rem' },
                      lineHeight: 1.2,
                      letterSpacing: '-0.02em',
                      mb: 1
                    }}
                  >
                    {currentAd.title}
                  </Typography>
                  <Typography
                    sx={{
                      background: 'linear-gradient(90deg, #34d399 0%, #059669 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 800,
                      fontSize: { xs: '0.95rem', sm: '1.05rem', md: '1.15rem' },
                      mb: 1.5,
                    }}
                  >
                    {currentAd.highlight}
                  </Typography>
                  <Typography
                    sx={{
                      color: '#94a3b8',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: { xs: '0.8rem', md: '0.875rem' },
                      lineHeight: 1.5,
                      mb: 2,
                      maxWidth: '650px',
                      minHeight: { xs: 'auto', md: '64px' }
                    }}
                  >
                    {currentAd.description}
                  </Typography>
                  <Button
                    component={Link}
                    href={currentAd.buttonHref}
                    variant="outlined"
                    sx={{
                      borderColor: 'rgba(16, 185, 129, 0.4)',
                      color: '#10b981',
                      borderRadius: '10px',
                      px: 3,
                      py: 1,
                      fontSize: '12px',
                      fontWeight: 800,
                      textTransform: 'none',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      '&:hover': {
                        borderColor: '#10b981',
                        background: 'rgba(16, 185, 129, 0.08)',
                        color: '#34d399'
                      },
                      transition: 'all 0.3s'
                    }}
                  >
                    {currentAd.buttonText}
                  </Button>
                </Box>

                {/* Right side: Mock image visual */}
                {!isMobile && (
                  <Box
                    sx={{
                      flex: 0.7,
                      display: 'flex',
                      justifyContent: 'center',
                      position: 'relative',
                      width: '100%'
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '210px',
                        aspectRatio: '16/10',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        transform: 'perspective(1000px) rotateY(-8deg) rotateX(4deg)',
                        transition: 'transform 0.4s ease',
                        '&:hover': {
                          transform: 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1.03)',
                        }
                      }}
                    >
                      <Box
                        component="img"
                        src={currentAd.image}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      {/* Gradient overlay on image */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)'
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </motion.div>
            </AnimatePresence>
          </Box>

          {/* Footer row: Metrics and Navigation */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: isXs ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: isXs ? 'flex-start' : 'center',
              gap: 2,
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              pt: 2,
              zIndex: 2
            }}
          >
            {/* Metrics List */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: { xs: 2, sm: 3 },
                alignItems: 'center'
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: isXs ? '14px' : '24px'
                  }}
                >
                  {currentAd.stats.map((stat, i) => (
                    <Box key={i} sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography
                        sx={{
                          color: '#fff',
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontWeight: 800,
                          fontSize: { xs: '12px', md: '13.5px' },
                          lineHeight: 1.2
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        sx={{
                          color: '#64748b',
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 600,
                          fontSize: '9.5px',
                          letterSpacing: '0.02em',
                          mt: 0.25
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Box>
                  ))}
                </motion.div>
              </AnimatePresence>
            </Box>

            {/* Slider Navigation arrows */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
              <IconButton
                onClick={(e) => { e.stopPropagation(); prevStep(); }}
                size="small"
                sx={{
                  color: 'rgba(255,255,255,0.6)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  '&:hover': {
                    color: '#fff',
                    background: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                <ChevronLeftRounded />
              </IconButton>
              <IconButton
                onClick={(e) => { e.stopPropagation(); nextStep(); }}
                size="small"
                sx={{
                  color: 'rgba(255,255,255,0.6)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  '&:hover': {
                    color: '#fff',
                    background: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                <ChevronRightRounded />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
}
