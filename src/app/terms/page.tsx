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
  ArrowBackRounded, 
  CheckCircleRounded, 
  VerifiedUserRounded, 
  BoltRounded, 
  PublicRounded, 
  LockRounded,
  SecurityRounded,
  GavelRounded,
  HistoryEduRounded,
  MenuOpenRounded
} from '@mui/icons-material';
import Link from 'next/link';
import PageTemplate from '../components/PageTemplate';

export default function TermsPage() {
  const sections = [
    { title: "Platform Architecture", description: "ResolveBridge is a financial search engine. We match you with lenders and insurers, but the final agreement is between you and the institution." },
    { title: "Identity Protocols", description: "All users must undergo KYC verification. Providing false information will result in immediate termination of access to our services." },
    { title: "Settlement Terms", description: "All payments made through our integrated services (including BNPL installment payments) are governed by the respective partner's terms." },
    { title: "Intellectual Property", description: "All content, including tools, graphics, and algorithms in ResolveBridge is the exclusive property of Resolve Group." }
  ];

  return (
    <PageTemplate 
      title="Terms of" 
      gradientTitle="Service"
      subtitle="The digital agreement that governs the ResolveBridge ecosystem and ensures a transparent financial landscape."
      noCard={true}
    >
      <Box className="pb-32 flex flex-col gap-12 md:gap-32 px-4 md:px-0">
        
        <Grid container spacing={{ xs: 3, md: 4 }}>
           {sections.map((s, idx) => (
             <Grid size={{ xs: 12, md: 6 }} key={idx}>
               <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1, duration: 0.8 }}
                 className="h-full"
               >
                  <Paper className="p-8 md:p-16 rounded-[32px] md:rounded-[48px] border border-slate-100 bg-white hover:bg-slate-50 transition-all group shadow-sm flex flex-col gap-8 h-full">
                     <Stack direction="row" spacing={3} alignItems="center">
                        <Avatar className="w-10 h-10 md:w-12 md:h-12 bg-slate-900 text-white font-black text-xs">0{idx + 1}</Avatar>
                        <Typography variant="h4" className="text-xl md:text-3xl font-black text-slate-900 tracking-tighter leading-[1.1] md:leading-none">{s.title}</Typography>
                     </Stack>
                     <Typography className="text-slate-500 font-medium text-base md:text-lg leading-relaxed">{s.description}</Typography>
                  </Paper>
               </motion.div>
             </Grid>
           ))}
        </Grid>

        {/* Binding Box */}
        <Box>
           <Paper className="p-8 md:p-24 rounded-[40px] md:rounded-[64px] bg-[#020617] text-white relative overflow-hidden text-center flex flex-col items-center">
              <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
              
              <Box className="relative z-10 max-w-4xl px-4">
                 <Avatar className="w-20 h-20 md:w-24 md:h-24 bg-blue-600/10 border border-blue-600/20 text-blue-500 mx-auto mb-8 md:mb-10 shadow-lg">
                    <HistoryEduRounded sx={{ fontSize: { xs: 32, md: 48 } }} />
                 </Avatar>
                 <Typography variant="h2" className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter mb-8 leading-[1.1] md:leading-[0.9]">
                   By continuing, you agree to the <br/> <span className="text-blue-500 italic">Bridge Protocol.</span>
                 </Typography>
                 <Typography className="text-slate-400 text-base md:text-xl font-medium leading-relaxed mb-10 md:mb-16">
                   This agreement is binding and ensures a safe, transparent, and fair environment for all financial operations within the ResolveBridge ecosystem.
                 </Typography>
                 
                 <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" alignItems="center" className="w-full sm:w-auto">
                    <Button 
                       href="/get-started"
                       component={Link}
                       variant="contained"
                       className="bg-white hover:bg-blue-600 hover:text-white text-slate-900 w-full sm:w-auto px-12 md:px-16 py-4 md:py-6 rounded-2xl text-lg md:text-xl font-black lowercase transition-all shadow-xl shadow-blue-600/10"
                       sx={{ textTransform: 'none' }}
                    >
                       Accept & Get Started
                    </Button>
                    <Button 
                       href="/"
                       component={Link}
                       variant="outlined"
                       className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto px-12 py-4 md:py-6 rounded-2xl text-lg md:text-xl font-black lowercase transition-all"
                       sx={{ textTransform: 'none' }}
                    >
                       Cancel
                    </Button>
                 </Stack>

                 <Typography variant="caption" className="mt-12 md:mt-16 block font-black uppercase tracking-[0.2em] text-slate-500 opacity-60 text-[9px] md:text-[10px]">Version Control: RB-2026.03.25</Typography>
              </Box>
           </Paper>
        </Box>

        {/* Legal Footer Links */}
        <Box>
           <Grid container spacing={{ xs: 2.5, sm: 4 }} justifyContent="center" className="text-slate-400 font-black uppercase tracking-widest text-[9px] md:text-[10px] opacity-60">
              {[
                { icon: <LockRounded fontSize="small" />, label: "Encrypted Agreement" },
                { icon: <PublicRounded fontSize="small" />, label: "Multi-Jurisdiction Valid" },
                { icon: <BoltRounded fontSize="small" />, label: "Instant Digital Signature" }
              ].map((item, i) => (
                <Grid size={{ xs: 12, sm: 4 }} key={i}>
                   <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                      <Box className="text-blue-600">{item.icon}</Box>
                      <Typography variant="inherit">{item.label}</Typography>
                   </Stack>
                </Grid>
              ))}
           </Grid>
        </Box>
      </Box>
    </PageTemplate>
  );
}
