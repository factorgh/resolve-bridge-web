'use client';

import { motion } from 'framer-motion';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Button, 
  Stack, 
  Paper,
  IconButton,
  Avatar,
  AvatarGroup,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import { 
  ArrowForwardRounded, 
  SearchRounded, 
  BoltRounded as ZapRounded, 
  VerifiedUserRounded,
  GroupsRounded,
  ShieldRounded,
  AutoGraphRounded,
  KeyboardArrowRightRounded,
  PublicRounded,
  ShowChartRounded
} from '@mui/icons-material';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-white overflow-hidden">
      {/* Background Orbs */}
      <Box className="fixed inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-blue-600/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] bg-emerald-600/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </Box>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 overflow-hidden">
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 8, lg: 12 }} alignItems="center">
            <Grid size={{ xs: 12, lg: 7 }}>
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
              >
                <Stack spacing={{ xs: 3, md: 4 }}>
                  <Box className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 w-fit shadow-sm">
                    <VerifiedUserRounded className="text-blue-600 text-[10px] md:text-sm" />
                    <Typography variant="caption" className="font-black tracking-widest text-slate-400 uppercase text-[9px] md:text-xs">Africa's Premiere Financial Hub</Typography>
                  </Box>
                  
                  <Typography variant="h1" className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-slate-900 leading-[0.9] md:leading-[0.85]">
                    The New Era of <br />
                    <span className="text-blue-600 italic">Financial Search.</span>
                  </Typography>

                  <Typography className="text-slate-500 font-medium max-w-xl leading-relaxed text-base md:text-xl lg:text-2xl">
                    Bridging the gap between 400M+ consumers and top-tier institutions. Search, compare, and secure Capital with institutional transparency.
                  </Typography>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} className="pt-4">
                    <Button 
                      component={Link}
                      href="/get-started"
                      variant="contained" 
                      disableElevation
                      className="bg-slate-900 hover:bg-blue-600 px-8 md:px-10 py-4 md:py-5 rounded-2xl text-base md:text-lg font-black lowercase transition-all"
                      sx={{ textTransform: 'none' }}
                      endIcon={<ArrowForwardRounded />}
                    >
                      Start Free Application
                    </Button>
                    <Button 
                      component={Link}
                      href="/solutions"
                      variant="outlined" 
                      className="border-slate-200 text-slate-900 px-8 md:px-10 py-4 md:py-5 rounded-2xl text-base md:text-lg font-black lowercase hover:bg-slate-50 transition-all"
                      sx={{ textTransform: 'none' }}
                    >
                      Explore Solutions
                    </Button>
                  </Stack>

                  <Stack direction="row" spacing={3} alignItems="center" className="pt-8">
                    <AvatarGroup max={4}>
                      {[1,2,3,4].map(i => <Avatar key={i} src={`/avatars/${i}.jpg`} sx={{ width: { xs: 32, md: 40 }, height: { xs: 32, md: 40 } }} />)}
                    </AvatarGroup>
                    <Box>
                      <Typography className="font-black text-slate-900 tracking-tight text-sm md:text-lg">400k+ Active Users</Typography>
                      <Typography variant="caption" className="text-slate-400 font-bold text-[10px] md:text-xs">Trusted across Ghana, Nigeria & Kenya</Typography>
                    </Box>
                  </Stack>
                </Stack>
              </motion.div>
            </Grid>

            {/* Visual Dashboard Mockup */}
            <Grid size={{ xs: 12, lg: 5 }} className="hidden lg:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                animate={{ opacity: 1, scale: 1, rotate: -2 }}
                transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
              >
                <Paper className="p-4 rounded-[40px] bg-slate-900/10 backdrop-blur-3xl border border-white/50 shadow-2xl relative overflow-hidden">
                  <Box className="bg-white rounded-[32px] p-8 shadow-2xl">
                    <Stack direction="row" justifyContent="space-between" className="mb-12">
                      <Box className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                        <AutoGraphRounded />
                      </Box>
                      <Box className="text-right">
                        <Typography variant="caption" className="font-black text-slate-400 block">Total Facilitated</Typography>
                        <Typography className="font-black text-2xl text-slate-900">$15,480,000</Typography>
                      </Box>
                    </Stack>
                    
                    <Stack spacing={4}>
                      {[
                        { label: 'SME Loan Match', value: '82%', icon: <ZapRounded className="text-blue-500" />, color: 'blue' },
                        { label: 'Approval Speed', value: '4.2s', icon: <ShowChartRounded className="text-purple-500" />, color: 'purple' },
                        { label: 'Network Reach', value: '50+', icon: <PublicRounded className="text-emerald-500" />, color: 'emerald' }
                      ].map((stat, i) => (
                        <Box key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Box className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                              {stat.icon}
                            </Box>
                            <Typography className="font-black text-slate-900 text-sm">{stat.label}</Typography>
                          </Stack>
                          <Typography className="font-black text-slate-900">{stat.value}</Typography>
                        </Box>
                      ))}
                    </Stack>
                    
                    <Divider className="my-8" />
                    <Button fullWidth className="rounded-xl py-3 bg-blue-600 text-white font-black lowercase" variant="contained">
                      View Real-time Data
                    </Button>
                  </Box>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600 blur-[80px] rounded-full opacity-20" />
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Partners Ticker */}
      <section className="py-20 bg-slate-50/50 border-y border-slate-100 overflow-hidden">
        <Container maxWidth="lg">
          <Stack spacing={6}>
            <Typography variant="caption" className="text-center block font-black text-slate-400 tracking-[0.3em] uppercase text-[10px] md:text-sm">Trusted by Global Institutions</Typography>
            <Grid container spacing={{ xs: 4, md: 8 }} justifyContent="center" alignItems="center" className="opacity-40 grayscale hover:grayscale-0 transition-all cursor-crosshair">
              {['Absa', 'Standard Chartered', 'MTN Mobile Money', 'Flutterwave', 'Ecobank', 'Kuda'].map((brand) => (
                <Grid key={brand} size={{ xs: 6, sm: 4, md: 2 }}>
                  <Typography className="text-center font-black text-xl md:text-2xl tracking-tighter text-slate-900 underline decoration-blue-600 decoration-4 underline-offset-8 italic">{brand}</Typography>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Container>
      </section>

      {/* Core Features */}
      <section className="py-24 md:py-48">
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 8, lg: 12 }}>
            <Grid size={{ xs: 12, lg: 4 }}>
              <Stack spacing={4}>
                <Box className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                  <ShieldRounded />
                </Box>
                <Typography variant="h2" className="font-black tracking-tight leading-[1] text-3xl md:text-5xl lg:text-7xl">
                  Engineered for <br/> <span className="text-blue-600 italic">Institutional</span> <br/> Transparency.
                </Typography>
                <Typography className="text-slate-500 font-medium text-lg lg:text-xl leading-relaxed max-w-xl">
                  We don't just aggregate data; we audit every financial product in our network to ensure zero hidden fees and direct-to-institutional rates.
                </Typography>
                <Link href="/features" className="group flex items-center gap-2 font-black text-blue-600 hover:text-slate-900 transition-colors uppercase tracking-widest text-xs">
                  Full Feature Set <KeyboardArrowRightRounded className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, lg: 8 }}>
              <Grid container spacing={{ xs: 3, md: 4 }}>
                {[
                  { title: 'Hyper-Personalized Search', icon: <SearchRounded />, desc: 'Proprietary matching algorithms that align your credit profile with institutional risk appetites for 90%+ approval rates.' },
                  { title: 'Rapid KYC Engine', icon: <VerifiedUserRounded />, desc: 'Instant verification across ECOWAS and EAC zones, reducing loan processing time from weeks to minutes.' },
                  { title: 'Merchant API Ecosystem', icon: <ZapRounded />, desc: 'Embed our marketplace directly into your retail or fintech application with our developer-first SDK.' },
                  { title: 'Global Liquidity Pools', icon: <PublicRounded />, desc: 'Bridging local African demand with global institutional capital pools for lower interest rates.' }
                ].map((item, i) => (
                  <Grid size={{ xs: 12, md: 6 }} key={i}>
                    <Card className="rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 overflow-hidden group h-full">
                      <CardContent className="p-8 md:p-12">
                        <Box className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 md:mb-10 transition-transform group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white text-slate-400`}>
                          {item.icon}
                        </Box>
                        <Typography variant="h5" className="font-black text-slate-900 mb-4 text-xl md:text-2xl">{item.title}</Typography>
                        <Typography className="text-slate-400 font-medium leading-relaxed text-sm md:text-base">{item.desc}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Integrated Dashboard CTA */}
      <section className="pb-32 px-4 md:px-0">
        <Container maxWidth="lg">
          <Paper className="rounded-[40px] md:rounded-[64px] bg-[#020617] overflow-hidden relative p-8 md:p-24 text-center text-white">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.15)_0%,_transparent_100%)]" />
            
            <Box className="relative z-10">
              <Stack spacing={4} alignItems="center">
                <AvatarGroup max={6} className="mb-4">
                  {[1, 2, 3, 4, 5, 6].map(i => <Avatar key={i} sx={{ width: { xs: 32, md: 48 }, height: { xs: 32, md: 48 } }} />)}
                </AvatarGroup>
                <Typography variant="h2" className="font-black tracking-tighter max-w-5xl mx-auto leading-[1] md:leading-[0.9] text-3xl sm:text-5xl md:text-7xl lg:text-8xl">
                  Stop searching. <br/> Start <span className="text-blue-500 italic">Capitalizing</span> on the Future.
                </Typography>
                <Typography className="text-slate-400 font-medium max-w-2xl mx-auto text-base md:text-xl lg:text-2xl leading-relaxed">
                  ResolveBridge is more than a platform—it's your private gateway to the institutional financial landscape of the continent.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} className="pt-8 w-full sm:w-auto">
                  <Button 
                    href="/get-started"
                    component={Link}
                    variant="contained" 
                    className="bg-blue-600 hover:bg-white hover:text-slate-900 px-12 py-5 rounded-2xl text-xl font-black lowercase transition-all w-full sm:w-auto"
                    sx={{ textTransform: 'none' }}
                    endIcon={<ArrowForwardRounded />}
                  >
                    Open Account
                  </Button>
                  <Button 
                    href="/contact"
                    component={Link}
                    variant="outlined" 
                    className="border-white/20 text-white hover:bg-white/10 px-12 py-5 rounded-2xl text-xl font-black lowercase transition-all w-full sm:w-auto"
                    sx={{ textTransform: 'none' }}
                  >
                    Consult Advisor
                  </Button>
                </Stack>
              </Stack>
            </Box>

            {/* Glowing lines decorative */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 shadow-[0_0_20px_blue]" />
          </Paper>
        </Container>
      </section>
    </main>
  );
}
