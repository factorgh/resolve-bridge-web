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
  ShieldRounded, 
  LockRounded, 
  VisibilityRounded, 
  ArrowBackRounded, 
  PublicRounded, 
  BoltRounded, 
  CheckCircleRounded,
  VerifiedUserRounded,
  SecurityRounded,
  PolicyRounded,
  HistoryEduRounded
} from '@mui/icons-material';
import Link from 'next/link';
import PageTemplate from '../components/PageTemplate';

const sections = [
  { icon: <LockRounded fontSize="large" />, title: "Data Architecture", content: "We use 256-bit AES encryption to protect your financial and personal data at all times. Our systems are audited by third-party security firms regularly." },
  { icon: <VisibilityRounded fontSize="large" />, title: "Radical Transparency", content: "We only collect data that is strictly necessary for matching you with financial products. We never sell your data to third parties without explicit consent." },
  { icon: <PublicRounded fontSize="large" />, title: "Global Compliance", content: "We comply with GDPR and local data protection regulations in Ghana, Nigeria, Kenya, and South Africa to ensure cross-border security." }
];

export default function PrivacyPage() {
  return (
    <PageTemplate 
      title="Privacy" 
      gradientTitle="Architecture"
      subtitle="Your data is your most valuable asset. Our commitment is to protect it with institutional-grade security protocols."
      noCard={true}
    >
      <Box className="pb-32 flex flex-col gap-12 md:gap-24 px-4 md:px-0">
        
        <Box className="max-w-4xl mx-auto w-full">
           <Stack spacing={4}>
              {sections.map((s, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.8 }}
                >
                  <Paper className="p-8 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-100 bg-white hover:bg-slate-50 transition-all group shadow-sm flex flex-col md:flex-row gap-8 md:gap-10 items-center md:items-start text-center md:text-left">
                     <Avatar className="w-16 h-16 md:w-20 md:h-20 rounded-[20px] md:rounded-[28px] bg-blue-50 text-blue-600 flex-shrink-0 shadow-sm transition-transform group-hover:scale-110">
                        {s.icon}
                     </Avatar>
                     <Box>
                        <Typography variant="h4" className="font-black text-slate-900 mb-4 tracking-tighter leading-[1.1] md:leading-none text-2xl md:text-3xl lg:text-4xl">{s.title}</Typography>
                        <Typography className="text-slate-500 font-medium text-base md:text-lg leading-relaxed">{s.content}</Typography>
                     </Box>
                  </Paper>
                </motion.div>
              ))}
           </Stack>

           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="mt-16 md:mt-20"
           >
              <Paper className="p-10 md:p-20 rounded-[40px] md:rounded-[56px] bg-[#020617] text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <Box className="relative z-10 text-center md:text-left">
                   <Stack direction="row" spacing={3} alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }} className="mb-8 md:mb-10">
                      <Avatar className="w-12 h-12 bg-white/5 border border-white/10 text-blue-500">
                         <BoltRounded />
                      </Avatar>
                      <Typography variant="h5" className="font-black text-white text-xl md:text-2xl">Resolution & Updates</Typography>
                   </Stack>
                   <Typography className="text-slate-400 text-base md:text-lg font-medium leading-relaxed mb-8 md:mb-10 max-w-2xl mx-auto md:mx-0">
                      This policy was last updated on March 25, 2026. We may update this policy as our services evolve and to comply with new regulations. Continued use of ResolveBridge after an update constitutes acceptance of the modified policy.
                   </Typography>
                   <Divider className="border-white/5 mb-8 md:mb-10" />
                   <Box>
                      <Typography variant="caption" className="font-black uppercase tracking-widest text-slate-500 block mb-2 text-[10px] md:text-xs">Data Protection Officer</Typography>
                      <Typography variant="h4" className="text-blue-500 font-black italic tracking-tighter text-xl md:text-3xl">privacy@resolvebridge.com</Typography>
                   </Box>
                </Box>
              </Paper>
           </motion.div>
        </Box>

        {/* Closing Action */}
        <Box className="text-center py-8">
           <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center" className="text-slate-400 font-black uppercase tracking-widest text-[9px] md:text-[10px] opacity-60">
              <VerifiedUserRounded fontSize="small" className="text-emerald-500" />
              <Typography variant="inherit">ISO/IEC 27001 Certified Environment</Typography>
           </Stack>
        </Box>
      </Box>
    </PageTemplate>
  );
}
