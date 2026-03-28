'use client';

import { motion } from 'framer-motion';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Stack, 
  Button, 
  Paper,
  Divider,
  Avatar
} from '@mui/material';
import { 
  SearchRounded, 
  SecurityRounded, 
  PublicRounded, 
  BoltRounded as ZapRounded, 
  SettingsRounded, 
  StorageRounded, 
  LayersRounded, 
  SmartphoneRounded, 
  TaskAltRounded,
  SpeedRounded,
  GroupsRounded,
  DeveloperModeRounded,
  TrendingUpRounded,
  MemoryRounded as MemoryIcon,
  BarChartRounded as BarChartIcon,
  ShowChartRounded
} from '@mui/icons-material';
import Link from 'next/link';
import PageTemplate from '../components/PageTemplate';

const mainFeatures = [
  {
    icon: <SearchRounded fontSize="large" />,
    title: "AI Risk Profiling",
    description: "Our proprietary matching engine analyzes borrower profiles against real-time institutional risk appetites, ensuring a 92% approval rate on qualified applications.",
    color: "blue"
  },
  {
    icon: <SecurityRounded fontSize="large" />,
    title: "Instant KYC V2",
    description: "Direct biometric and national database integrations across West and East Africa's regulatory zones for zero-latency identity verification.",
    color: "purple"
  },
  {
    icon: <PublicRounded fontSize="large" />,
    title: "Cross-Border Settlement",
    description: "One dashboard to manage multi-currency flows and regulatory compliance across Ghana, Nigeria, Kenya and South Africa from a single hub.",
    color: "emerald"
  }
];

const techGrid = [
  { icon: <MemoryIcon />, title: "Modular SDKs", desc: "Embed the entire marketplace into your legacy application in under 2 hours with our robust developer-first API." },
  { icon: <SecurityRounded />, title: "Bank-Grade Escrow", desc: "Funds are held in secure, non-custodial audited environments until all institutional conditions are settled." },
  { icon: <BarChartIcon />, title: "Merchant Analytics", desc: "Deep visibility into conversion funnels, market trends, and regional liquidity demand through our reporting suite." },
  { icon: <StorageRounded />, title: "Data Integrity", desc: "Immutable transaction logging and multi-layer encryption ensuring platform-wide institutional security." },
  { icon: <SmartphoneRounded />, title: "Universal Optimized", desc: "Fluid experience across high-end smartphones and low-bandwidth feature phones for maximum inclusion." },
  { icon: <TaskAltRounded />, title: "Global Standards", desc: "PCI-DSS and GDPR alignment are native to our infrastructure, ensuring your business stays compliant globally." }
];

export default function FeaturesPage() {
  return (
    <PageTemplate 
      title="Platform" 
      gradientTitle="Intelligence"
      subtitle="Discover the advanced institutional technology driving the future of financial liquidity across the African continent."
      noCard={true}
    >
      <Box className="pb-32 flex flex-col gap-16 md:gap-32">
        
        {/* Main Features */}
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {mainFeatures.map((feature, idx) => (
            <Grid size={{ xs: 12, md: 4 }} key={idx}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="h-full"
              >
                <Card className="rounded-[40px] md:rounded-[48px] border border-slate-100 bg-white p-8 md:p-10 h-full shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 group">
                  <Box className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-8 md:mb-10 transition-transform group-hover:scale-110">
                    {feature.icon}
                  </Box>
                  <Typography variant="h4" className="font-black text-slate-900 mb-6 text-xl md:text-2xl lg:text-3xl tracking-tight">{feature.title}</Typography>
                  <Typography className="text-slate-500 font-medium leading-relaxed text-sm md:text-base">{feature.description}</Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Technical Grid Section */}
        <Box>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'flex-end' }} className="mb-12 md:mb-16 gap-8 px-4 md:px-0">
            <Box>
              <Typography variant="caption" className="text-blue-600 font-black uppercase tracking-[0.3em] block mb-4 text-[10px] md:text-xs">Engineering Excellence</Typography>
              <Typography variant="h2" className="font-black tracking-tighter leading-[1] mb-6 text-3xl md:text-5xl lg:text-6xl">Designed for <br/> <span className="text-blue-600 italic">Global Scale.</span></Typography>
              <Typography className="text-slate-400 font-medium text-base md:text-lg max-w-xl">Our infrastructure is built to handle institutional transaction volumes with zero-latency synchronization.</Typography>
            </Box>
            <Button 
              component={Link}
              href="/get-started"
              variant="contained" 
              className="bg-slate-900 hover:bg-blue-600 w-full md:w-auto px-10 py-4 rounded-2xl font-black lowercase text-lg shadow-xl shadow-blue-600/10"
              sx={{ textTransform: 'none' }}
              endIcon={<ZapRounded />}
            >
              Start Building
            </Button>
          </Stack>

          <Paper className="rounded-[40px] md:rounded-[48px] border border-slate-100 bg-slate-50/30 overflow-hidden shadow-inner">
            <Grid container spacing={0.5}>
              {techGrid.map((tech, i) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
                  <Box className="p-8 md:p-12 hover:bg-white transition-all group h-full">
                    <Box className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:shadow-md transition-all mb-8">
                      {tech.icon}
                    </Box>
                    <Typography variant="h6" className="font-black text-slate-900 mb-3 text-lg md:text-xl tracking-tight">{tech.title}</Typography>
                    <Typography variant="body2" className="text-slate-500 font-medium leading-relaxed text-xs md:text-sm">{tech.desc}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>

        {/* Global Network Section */}
        <Paper className="p-8 md:p-24 rounded-[40px] md:rounded-[64px] bg-slate-900 text-white relative overflow-hidden text-center mx-4 md:mx-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <Box className="relative z-10 px-4">
            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" className="mb-8">
              <Box className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
              <Typography variant="caption" className="font-black uppercase tracking-widest text-emerald-500 text-[9px] md:text-xs">Platform Infrastructure Live</Typography>
            </Stack>

            <Typography variant="h2" className="font-black tracking-tighter mb-10 max-w-4xl mx-auto leading-[1] text-3xl sm:text-4xl md:text-6xl lg:text-7xl">
              A Global Marketplace <br/> That <span className="text-blue-500 italic">Never Sleeps.</span>
            </Typography>

            <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center" className="max-w-5xl mx-auto mb-16">
              {[
                { label: 'Uptime SLA', value: '99.9%' },
                { label: 'Active Lenders', value: '50+' },
                { label: 'Avg Match Speed', value: '0.8s' },
                { label: 'KYC Decision', value: 'Instant' }
              ].map((stat, i) => (
                <Grid size={{ xs: 6, md: 3 }} key={i}>
                  <Box className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md h-full flex flex-col justify-center">
                    <Typography variant="h3" className="font-black mb-1 text-xl md:text-2xl lg:text-3xl">{stat.value}</Typography>
                    <Typography variant="caption" className="font-black uppercase tracking-widest text-slate-500 text-[8px] md:text-[10px]">{stat.label}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
              <Button 
                href="/get-started"
                component={Link}
                variant="contained" 
                className="bg-blue-600 hover:bg-white hover:text-slate-900 w-full sm:w-auto px-12 py-4 rounded-2xl font-black lowercase text-lg shadow-xl shadow-blue-600/20"
                sx={{ textTransform: 'none' }}
              >
                Launch Marketplace
              </Button>
              <Button 
                href="/contact"
                component={Link}
                variant="outlined" 
                className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto px-12 py-4 rounded-2xl font-black lowercase text-lg"
                sx={{ textTransform: 'none' }}
              >
                Architectural Audit
              </Button>
            </Stack>
          </Box>
        </Paper>

      </Box>
    </PageTemplate>
  );
}
