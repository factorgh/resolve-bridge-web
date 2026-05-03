'use client';

import { Box, Container, Typography, Grid, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { SecurityRounded, ArrowBackRounded, CheckCircleRounded, SpeedRounded, TimelineRounded } from '@mui/icons-material';
import Link from 'next/link';

export default function CreditScorePage() {
  return (
    <main style={{ minHeight: '100vh', background: '#04080f', overflowX: 'hidden' }}>
      {/* Navbar / Back Button */}
      <Box sx={{ p: 4, position: 'absolute', top: 0, left: 0, zIndex: 50 }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Button startIcon={<ArrowBackRounded />} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' } }}>
            Back to Home
          </Button>
        </Link>
      </Box>

      {/* Hero Section */}
      <Box sx={{ pt: 20, pb: 15, position: 'relative' }}>
        {/* Glow Effects */}
        <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(16,185,129,0.15),_transparent_70%)] blur-[60px] pointer-events-none" />
        <div className="absolute top-[40%] right-[15%] w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(59,130,246,0.1),_transparent_70%)] blur-[80px] pointer-events-none" />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 10 }}>
          <Grid container spacing={8} alignItems="center">
            
            {/* Left Content */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, background: 'rgba(16,185,129,0.1)', width: 'fit-content', px: 2, py: 1, borderRadius: '12px', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <SecurityRounded sx={{ color: '#10b981', fontSize: 18 }} />
                  <Typography sx={{ color: '#10b981', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Institutional-Grade Check
                  </Typography>
                </Box>
                
                <Typography variant="h1" sx={{ fontSize: { xs: '3rem', md: '5rem' }, fontWeight: 900, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#fff', lineHeight: 1.05, letterSpacing: '-0.04em', mb: 4 }}>
                  Know your worth.<br/>
                  <span style={{ background: 'linear-gradient(130deg, #10b981 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Own your power.
                  </span>
                </Typography>
                
                <Typography sx={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 500, mb: 6 }}>
                  Access your free institutional credit score in seconds. No impact on your credit rating, just pure, verified financial power at your fingertips.
                </Typography>

                <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  <Button variant="contained" sx={{ background: '#10b981', color: '#fff', borderRadius: '16px', py: 2, px: 5, fontSize: '16px', fontWeight: 800, textTransform: 'none', boxShadow: '0 8px 32px rgba(16,185,129,0.3)', '&:hover': { background: '#059669' } }}>
                    Get My Free Score
                  </Button>
                  <Typography sx={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                    Takes &lt; 60 seconds
                  </Typography>
                </Box>
              </motion.div>
            </Grid>

            {/* Right Visuals */}
            <Grid size={{ xs: 12, lg: 6 }} sx={{ position: 'relative' }}>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}>
                <Box sx={{ position: 'relative', width: '100%', maxWidth: 500, margin: '0 auto', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  
                  {/* Outer Ring */}
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', inset: 0, border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '50%' }} />
                  
                  {/* Inner Glowing Dial */}
                  <Box sx={{ width: '80%', height: '80%', borderRadius: '50%', background: 'conic-gradient(from 180deg at 50% 50%, #10b981 0deg, #3b82f6 180deg, #10b981 360deg)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', boxShadow: '0 0 80px rgba(16,185,129,0.2)' }}>
                    <Box sx={{ width: '100%', height: '100%', background: '#04080f', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography sx={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', mb: 1 }}>
                        Excellent
                      </Typography>
                      <Typography sx={{ fontSize: '84px', fontWeight: 900, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#fff', lineHeight: 1 }}>
                        785
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, background: 'rgba(16,185,129,0.1)', px: 2, py: 0.5, borderRadius: '20px' }}>
                        <Typography sx={{ color: '#10b981', fontSize: '14px', fontWeight: 800 }}>+15 pts</Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>this month</Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Floating Stats */}
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} style={{ position: 'absolute', top: '10%', right: '-5%', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '16px' }}>
                    <Typography sx={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', mb: 0.5 }}>Credit Utilization</Typography>
                    <Typography sx={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>12%</Typography>
                  </motion.div>

                  <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity }} style={{ position: 'absolute', bottom: '15%', left: '-10%', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '16px' }}>
                    <Typography sx={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', mb: 0.5 }}>Payment History</Typography>
                    <Typography sx={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>100%</Typography>
                  </motion.div>

                </Box>
              </motion.div>
            </Grid>

          </Grid>
        </Container>
      </Box>

      {/* Features Grid */}
      <Container maxWidth="lg" sx={{ pb: 20 }}>
        <Grid container spacing={4}>
          {[
            { icon: <CheckCircleRounded sx={{ fontSize: 32, color: '#10b981' }}/>, title: "Zero Impact Check", desc: "Checking your score through ResolveBridge counts as a 'soft inquiry', which means it will never harm your credit rating." },
            { icon: <TimelineRounded sx={{ fontSize: 32, color: '#3b82f6' }}/>, title: "Smart Monitoring", desc: "Get instantly notified when your score changes, and receive personalized tips to maximize your institutional borrowing power." },
            { icon: <SpeedRounded sx={{ fontSize: 32, color: '#f59e0b' }}/>, title: "Instant Access", desc: "No more waiting for weeks or paying hidden fees. Your credit profile is aggregated instantly using bank-grade security." }
          ].map((f, i) => (
            <Grid size={{ xs: 12, md: 4 }} key={i}>
              <Box sx={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', p: 5, height: '100%', transition: 'all 0.3s', '&:hover': { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' } }}>
                <Box sx={{ width: 64, height: 64, borderRadius: '16px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
                  {f.icon}
                </Box>
                <Typography sx={{ fontSize: '20px', fontWeight: 800, color: '#fff', mb: 2 }}>{f.title}</Typography>
                <Typography sx={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{f.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </main>
  );
}
