'use client';

import { motion } from 'framer-motion';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Stack, 
  Button, 
  Paper,
  Breadcrumbs
} from '@mui/material';
import { 
  ArrowForwardRounded, 
  CheckCircleRounded,
  NavigateNext
} from '@mui/icons-material';
import Link from 'next/link';
import Navbar from './Navbar';

interface ProductBenefit {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

interface ProductLayoutProps {
  category: string;
  title: string;
  highlightText: string;
  description: string;
  benefits: ProductBenefit[];
  stats: { value: string; label: string }[];
  heroImage: string;
  ctaText?: string;
}

export default function ProductLayout({
  category,
  title,
  highlightText,
  description,
  benefits,
  stats,
  heroImage,
  ctaText = "Start Your Application"
}: ProductLayoutProps) {
  return (
    <Box className="min-h-screen bg-white font-['Inter']">
      <Navbar />

      {/* ── HERO SECTION ────────────────────────────────────────────────── */}
      <Box component="section" sx={{
        position: 'relative',
        pt: { xs: 16, md: 24 },
        pb: { xs: 12, md: 20 },
        overflow: 'hidden',
        background: '#04080f',
      }}>
        {/* Ambient glow blobs */}
        {/* <Box sx={{ position:'absolute', top:'-5%', left:'12%', width:560, height:560, borderRadius:'50%', background:'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', pointerEvents:'none', filter:'blur(50px)' }} />
        <Box sx={{ position:'absolute', bottom:'0%', right:'8%', width:420, height:420, borderRadius:'50%', background:'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)', pointerEvents:'none', filter:'blur(50px)' }} /> */}

        <Container maxWidth="xl" sx={{ position:'relative', zIndex:1 }}>
          {/* Breadcrumbs */}
          {/* <Breadcrumbs 
            separator={<NavigateNext fontSize="small" sx={{ color: 'rgba(255,255,255,0.2)' }} />}
            sx={{ mb: 4 }}
          >
            <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>Home</Link>
            <Typography sx={{ color: '#10b981', fontSize: '13px', fontWeight: 700, textTransform: 'capitalize' }}>{category}</Typography>
          </Breadcrumbs> */}

          <Grid container spacing={{ xs: 8, lg: 12 }} alignItems="center">
            <Grid size={{ xs: 12, lg: 6.5 }}>
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, border: '1px solid rgba(16,185,129,0.25)', borderRadius: 999, px: 2, py: 0.6, mb: 3.5, background: 'rgba(16,185,129,0.1)', backdropFilter: 'blur(10px)' }}>
                  <Typography sx={{ fontSize: '10px', fontWeight: 800, color: '#10b981', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Institutional Grade {category}
                  </Typography>
                </Box>

                <Typography variant="h1" sx={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: '-0.04em',
                  color: '#fff',
                  fontSize: { xs: '2.8rem', md: '4.5rem', lg: '5.2rem' },
                  mb: 3
                }}>
                  {title} <br />
                  <span style={{ color: '#10b981', fontStyle: 'italic' }}>{highlightText}</span>
                </Typography>

                <Typography sx={{
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  color: 'rgba(255,255,255,0.5)',
                  fontWeight: 500,
                  lineHeight: 1.7,
                  maxWidth: 580,
                  mb: 6
                }}>
                  {description}
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                  <Button
                    component={Link}
                    href="/get-started"
                    variant="contained"
                    endIcon={<ArrowForwardRounded />}
                    sx={{
                      background: '#10b981',
                      color: '#fff',
                      px: 5,
                      py: 2.2,
                      borderRadius: '16px',
                      fontSize: '15px',
                      fontWeight: 800,
                      textTransform: 'none',
                      boxShadow: '0 12px 24px rgba(16,185,129,0.25)',
                      '&:hover': { background: '#059669', transform: 'translateY(-2px)' },
                      transition: 'all 0.2s'
                    }}
                  >
                    {ctaText}
                  </Button>
                  <Button
                    component={Link}
                    href="/contact"
                    variant="outlined"
                    sx={{
                      borderColor: 'rgba(255,255,255,0.15)',
                      color: '#fff',
                      px: 5,
                      py: 2.2,
                      borderRadius: '16px',
                      fontSize: '15px',
                      fontWeight: 700,
                      textTransform: 'none',
                      '&:hover': { background: 'rgba(255,255,255,0.05)', borderColor: '#fff' }
                    }}
                  >
                    Speak with Expert
                  </Button>
                </Stack>
              </motion.div>
            </Grid>

            <Grid size={{ xs: 12, lg: 5.5 }} sx={{ display: { xs: 'none', lg: 'block' } }}>
               <motion.div
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 1, delay: 0.2 }}
               >
                 <Box sx={{ position: 'relative' }}>
                    <img 
                      src={heroImage} 
                      alt={title}
                      style={{ width: '100%', height: 'auto', borderRadius: '48px', boxShadow: '0 40px 80px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }} 
                    />
                    {/* Floating Info */}
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ position: 'absolute', top: '15%', right: '-30px', background: 'rgba(16,185,129,0.95)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '24px', padding: '16px 24px', boxShadow: '0 24px 48px rgba(0,0,0,0.3)', zIndex: 10 }}
                    >
                      <Typography sx={{ color: '#fff', fontSize: '20px', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em' }}>Live</Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', mt: 0.5 }}>Market Rates</Typography>
                    </motion.div>
                 </Box>
               </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── FEATURES & BENEFITS ────────────────────────────────────────── */}
      <Box className="py-24 md:py-32 bg-white">
        <Container maxWidth="xl">
          <Grid container spacing={{ xs: 8, lg: 12 }}>
            <Grid size={{ xs: 12, lg: 4 }}>
              <Box className="sticky top-32">
                <Typography sx={{ color: '#10b981', fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.15em', mb: 2 }}>Why Choose Us</Typography>
                <Typography variant="h2" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900, fontSize: '2.5rem', lineHeight: 1.1, mb: 4, letterSpacing: '-0.03em' }}>
                  The ResolveBridge Advantage.
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '1.1rem', mb: 6, lineHeight: 1.6 }}>
                  We bridge the gap between traditional finance and modern digital efficiency. Experience transparency at every step.
                </Typography>
                <Stack spacing={3}>
                  {stats.map((s, i) => (
                    <Box key={i} sx={{ borderLeft: '4px solid #10b981', pl: 3 }}>
                      <Typography sx={{ fontSize: '24px', fontWeight: 900, color: '#04080f' }}>{s.value}</Typography>
                      <Typography sx={{ fontSize: '12px', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase' }}>{s.label}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, lg: 8 }}>
              <Grid container spacing={4}>
                {benefits.map((b, i) => (
                  <Grid size={{ xs: 12, md: 6 }} key={i}>
                    <Paper 
                      elevation={0}
                      sx={{
                        p: 4.5,
                        borderRadius: '32px',
                        border: '1px solid #f1f5f9',
                        background: '#fff',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        '&:hover': {
                          borderColor: 'rgba(16,185,129,0.2)',
                          background: 'rgba(16,185,129,0.02)',
                          transform: 'translateY(-6px)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.03)'
                        }
                      }}
                    >
                      <Box sx={{ width: 60, height: 60, borderRadius: '20px', background: 'rgba(16,185,129,0.08)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3.5 }}>
                        {b.icon}
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 800, fontSize: '1.25rem', mb: 1.5, color: '#04080f' }}>{b.title}</Typography>
                      <Typography sx={{ color: 'text.secondary', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>{b.desc}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── FINAL CTA ──────────────────────────────────────────────────── */}
      <Box className="pb-32">
        <Container maxWidth="xl">
          <Paper 
            elevation={0}
            sx={{
              p: { xs: 8, md: 16 },
              borderRadius: '64px',
              background: '#04080f',
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'center'
            }}
          >
            <Box sx={{ position:'absolute', top:'-50%', left:'-20%', width:800, height:800, borderRadius:'50%', background:'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', pointerEvents:'none', filter:'blur(80px)' }} />
            
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h2" sx={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 900,
                color: '#fff',
                fontSize: { xs: '2.5rem', md: '4rem' },
                mb: 4,
                letterSpacing: '-0.04em'
              }}>
                Ready to find the best <br /> <span style={{ color: '#10b981' }}>deal for you?</span>
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem', maxWidth: 600, mx: 'auto', mb: 8, fontWeight: 500 }}>
                Join thousands of individuals and businesses who have already optimized their finances with ResolveBridge.
              </Typography>
              <Button
                component={Link}
                href="/get-started"
                variant="contained"
                sx={{
                  background: '#fff',
                  color: '#04080f',
                  px: 8,
                  py: 2.5,
                  borderRadius: '20px',
                  fontSize: '16px',
                  fontWeight: 900,
                  textTransform: 'none',
                  '&:hover': { background: '#10b981', color: '#fff' },
                  transition: 'all 0.2s'
                }}
              >
                Apply Now in 60s
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
