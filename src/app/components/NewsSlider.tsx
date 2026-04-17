'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, IconButton, Avatar } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftRounded, ChevronRightRounded, ArrowForwardRounded } from '@mui/icons-material';
import Link from 'next/link';

const NEWS_ITEMS = [
  {
    id: 1,
    category: 'Market Intelligence',
    title: 'Regional Market Rates: 2026 Q2 Outlook for West African Hubs',
    image: '/images/news_market.png',
    author: { name: 'Dr. Mensah K.', avatar: '/images/author_1.png' },
    date: 'Apr 16, 2026',
    href: '/news/market-outlook-2026'
  },
  {
    id: 2,
    category: 'Financial Literacy',
    title: 'Quiz: Test Your Knowledge on Institutional Debt Consolidation',
    image: '/images/news_literacy.png',
    author: { name: 'Sarah Amina', avatar: '/images/author_2.png' },
    date: 'Apr 14, 2026',
    href: '/news/literacy-quiz'
  },
  {
    id: 3,
    category: 'Economic News',
    title: 'Consumer Sentiment Reaches All-Time High in Retail Sector',
    image: '/images/news_sentiment.png',
    author: { name: 'Dr. Mensah K.', avatar: '/images/author_1.png' },
    date: 'Apr 12, 2026',
    href: '/news/consumer-sentiment-2026'
  },
  {
    id: 4,
    category: 'SME Growth',
    title: 'How Liquidity Bridges are Scaling Tech Startups in Lagos',
    image: '/images/news_market.png',
    author: { name: 'Sarah Amina', avatar: '/images/author_2.png' },
    date: 'Apr 10, 2026',
    href: '/news/sme-growth-lagos'
  },
  {
    id: 5,
    category: 'Real Estate',
    title: 'Mortgage Reform: What New Regulations Mean for Homeowners',
    image: '/images/news_sentiment.png', // Reusing high quality for variety
    author: { name: 'Dr. Mensah K.', avatar: '/images/author_1.png' },
    date: 'Apr 08, 2026',
    href: '/news/mortgage-reform'
  }
];

export default function NewsSlider() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const prevStep = () => {
    setDirection(-1);
    setIndex((prev) => (prev === 0 ? NEWS_ITEMS.length - 1 : prev - 1));
  };

  const nextStep = () => {
    setDirection(1);
    setIndex((prev) => (prev === NEWS_ITEMS.length - 1 ? 0 : prev + 1));
  };

  // Auto-play
  useEffect(() => {
    const timer = setInterval(nextStep, 6000);
    return () => clearInterval(timer);
  }, []);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <Box component="section" sx={{ py: { xs: 10, md: 16 }, background: '#fafafa', overflow: 'hidden' }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: { xs: 6, md: 10 }, textAlign: 'center' }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontFamily: "'Plus Jakarta Sans', sans-serif", 
              fontWeight: 900, 
              fontSize: { xs: '2.4rem', md: '3.6rem' }, 
              color: '#050d1a', 
              letterSpacing: '-0.05em',
              mb: 2
            }}
          >
            News That Impacts Your Wallet
          </Typography>
          <Link href="/news" style={{ textDecoration: 'none' }}>
            <Box sx={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 1, 
              color: '#10b981', 
              fontWeight: 800, 
              fontSize: '14px', 
              textTransform: 'uppercase', 
              letterSpacing: '0.12em',
              borderBottom: '2px solid #10b981',
              pb: 0.5,
              transition: 'all 0.3s',
              '&:hover': { gap: 1.5, opacity: 0.8 }
            }}>
              View All News <ArrowForwardRounded sx={{ fontSize: 18 }} />
            </Box>
          </Link>
        </Box>

        {/* Carousel Container */}
        <Box sx={{ position: 'relative', height: { xs: 450, md: 550 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Peeking Cards (Left/Right) - Purely visual for desktop */}
          <Box sx={{ display: { xs: 'none', lg: 'block' }, position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
             {/* Left Peek */}
             <Box sx={{ 
               position: 'absolute', 
               left: '-15%', 
               width: '35%', 
               height: '85%', 
               borderRadius: '32px', 
               background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${NEWS_ITEMS[(index === 0 ? NEWS_ITEMS.length - 1 : index - 1)].image})`,
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               opacity: 0.3,
               filter: 'blur(2px)',
               transform: 'scale(0.8) perspective(1000px) rotateY(15deg)',
             }} />
             {/* Right Peek */}
             <Box sx={{ 
               position: 'absolute', 
               right: '-15%', 
               width: '35%', 
               height: '85%', 
               borderRadius: '32px', 
               background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${NEWS_ITEMS[(index === NEWS_ITEMS.length - 1 ? 0 : index + 1)].image})`,
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               opacity: 0.3,
               filter: 'blur(2px)',
               transform: 'scale(0.8) perspective(1000px) rotateY(-15deg)',
             }} />
          </Box>

          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.4 }
              }}
              style={{
                position: 'absolute',
                width: '100%',
                maxWidth: '850px',
                height: '100%',
                cursor: 'grab',
              }}
            >
              <Link href={NEWS_ITEMS[index].href} style={{ textDecoration: 'none' }}>
                <Box 
                  sx={{ 
                    width: '100%', 
                    height: '100%', 
                    borderRadius: { xs: '24px', md: '40px' },
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                  }}
                >
                  <Box 
                    component="img"
                    src={NEWS_ITEMS[index].image}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  
                  {/* Overlay */}
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      left: 0, 
                      width: '100%', 
                      p: { xs: 4, md: 6 },
                      background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2
                    }}
                  >
                    <Typography sx={{ 
                      color: '#10b981', 
                      fontWeight: 800, 
                      fontSize: '12px', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.14em',
                      fontFamily: "'Plus Jakarta Sans', sans-serif"
                    }}>
                      {NEWS_ITEMS[index].category}
                    </Typography>
                    
                    <Typography sx={{ 
                      color: '#fff', 
                      fontWeight: 900, 
                      fontSize: { xs: '1.5rem', md: '2.6rem' }, 
                      lineHeight: 1.1,
                      letterSpacing: '-0.04em',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      mb: 2
                    }}>
                      {NEWS_ITEMS[index].title}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        src={NEWS_ITEMS[index].author.avatar} 
                        sx={{ width: 44, height: 44, border: '2px solid rgba(255,255,255,0.2)' }} 
                      />
                      <Box>
                        <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>
                          {NEWS_ITEMS[index].author.name}
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 500 }}>
                          {NEWS_ITEMS[index].date}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <Box sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: { xs: 10, lg: -80 }, 
            right: { xs: 10, lg: -80 }, 
            display: 'flex', 
            justifyContent: 'space-between', 
            zIndex: 10,
            pointerEvents: 'none'
          }}>
            <IconButton 
              onClick={(e) => { e.stopPropagation(); prevStep(); }}
              sx={{ 
                pointerEvents: 'auto',
                background: '#fff', 
                color: '#10b981', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                '&:hover': { background: '#10b981', color: '#fff' }
              }}
            >
              <ChevronLeftRounded fontSize="large" />
            </IconButton>
            <IconButton 
              onClick={(e) => { e.stopPropagation(); nextStep(); }}
              sx={{ 
                pointerEvents: 'auto',
                background: '#fff', 
                color: '#10b981', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                '&:hover': { background: '#10b981', color: '#fff' }
              }}
            >
              <ChevronRightRounded fontSize="large" />
            </IconButton>
          </Box>
        </Box>

        {/* Pagination Dots */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mt: 6 }}>
          {NEWS_ITEMS.map((_, i) => (
            <Box 
              key={i} 
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              sx={{ 
                width: index === i ? 24 : 10, 
                height: 10, 
                borderRadius: 99, 
                background: index === i ? '#10b981' : '#cbd5e1',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }} 
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
