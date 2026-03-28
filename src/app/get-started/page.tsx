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
  Avatar,
  TextField,
  InputAdornment,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { 
  ArrowForwardRounded, 
  PersonRounded, 
  EmailRounded, 
  LockRounded, 
  ShieldRounded,
  CheckRounded,
  PublicRounded,
  ChevronLeftRounded,
  VerifiedUserRounded,
  BoltRounded
} from '@mui/icons-material';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function GetStartedPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const steps = [
    { title: "Financial Identity", description: "Seamlessly build your digital profile to unlock Africa's leading financial services." },
    { title: "Algorithmic Matching", description: "Our AI identifies the exact products where you meet institutional risk criteria." },
    { title: "Direct Disbursement", description: "Secure funding, insurance, or elite automotive assets with a single digital handshake." }
  ];

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white selection:bg-blue-100">
      
      {/* Visual Side */}
      <section className="hidden lg:flex flex-col justify-center items-center relative overflow-hidden bg-[#020617] text-white p-24">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.15)_0%,_transparent_100%)]" />
         <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full translate-y-1/2 translate-x-1/2" />
         
         <Box className="relative z-10 max-w-lg">
            <Link href="/" className="inline-flex items-center gap-4 mb-24 hover:opacity-80 transition-opacity">
               <img src="/resolve_icon.png" alt="Resolve" className="h-10 w-auto" />
               <Typography variant="h4" className="font-black tracking-tighter text-white">Resolve<span className="text-blue-500 italic">Bridge</span></Typography>
            </Link>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <Typography variant="h1" className="text-6xl font-black tracking-tighter leading-[0.9] mb-10">
                Start Your Financial Journey with <br/><span className="text-blue-500 italic">Confidence.</span>
              </Typography>
              
              <Typography className="text-xl text-slate-400 font-medium leading-relaxed mb-20">
                 Join thousands of visionaries scaling their financial footprint across the continent with Africa's premier search engine.
              </Typography>
              
              <Stack spacing={8}>
                 {steps.map((s, i) => (
                    <Stack key={i} direction="row" spacing={4} alignItems="flex-start">
                       <Box className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 font-black flex-shrink-0">
                          {i + 1}
                       </Box>
                       <Box>
                          <Typography variant="h6" className="font-black text-white mb-2 leading-none">{s.title}</Typography>
                          <Typography variant="body2" className="text-slate-500 font-medium leading-relaxed">{s.description}</Typography>
                       </Box>
                    </Stack>
                 ))}
              </Stack>
            </motion.div>
         </Box>
         
         <PublicRounded sx={{ fontSize: 400 }} className="absolute -bottom-10 -left-10 opacity-[0.02] text-white pointer-events-none" />
      </section>

      {/* Form Side */}
      <section className="flex flex-col justify-center items-center p-8 md:p-24 relative bg-white">
         <Box className="absolute top-10 left-10 md:top-20 md:left-20">
            <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black uppercase tracking-widest text-[10px] transition-colors">
               <ChevronLeftRounded fontSize="small" /> Back to Search
            </Link>
         </Box>

         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="w-full max-w-md"
         >
            <Box className="mb-16">
               <Typography variant="h2" className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-slate-900 leading-none">Create Free <br/><span className="text-blue-600 italic">Account</span></Typography>
               <Typography className="text-slate-400 font-medium text-lg leading-relaxed">Match with premium financial products in under 2 minutes.</Typography>
            </Box>

            <form className="flex flex-col gap-6">
               <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack spacing={1}>
                       <Typography variant="caption" className="font-black uppercase tracking-widest text-slate-400 text-[10px] px-1">First Name</Typography>
                       <TextField 
                         fullWidth
                         placeholder="John"
                         variant="outlined"
                         InputProps={{
                           startAdornment: <InputAdornment position="start"><PersonRounded className="text-slate-300" fontSize="small" /></InputAdornment>,
                           className: "rounded-2xl bg-slate-50/50"
                         }}
                         sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#f1f5f9' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' } }}
                       />
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack spacing={1}>
                       <Typography variant="caption" className="font-black uppercase tracking-widest text-slate-400 text-[10px] px-1">Last Name</Typography>
                       <TextField 
                         fullWidth
                         placeholder="Doe"
                         variant="outlined"
                         InputProps={{
                           startAdornment: <InputAdornment position="start"><PersonRounded className="text-slate-300" fontSize="small" /></InputAdornment>,
                           className: "rounded-2xl bg-slate-50/50"
                         }}
                         sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#f1f5f9' } }}
                       />
                    </Stack>
                  </Grid>
               </Grid>

               <Stack spacing={1}>
                  <Typography variant="caption" className="font-black uppercase tracking-widest text-slate-400 text-[10px] px-1">Work Email Address</Typography>
                  <TextField 
                    fullWidth
                    placeholder="john@example.com"
                    variant="outlined"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><EmailRounded className="text-slate-300" fontSize="small" /></InputAdornment>,
                      className: "rounded-2xl bg-slate-50/50"
                    }}
                    sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#f1f5f9' } }}
                  />
               </Stack>

               <Stack spacing={1}>
                  <Typography variant="caption" className="font-black uppercase tracking-widest text-slate-400 text-[10px] px-1">Secure Password</Typography>
                  <TextField 
                    fullWidth
                    type="password"
                    placeholder="••••••••"
                    variant="outlined"
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><LockRounded className="text-slate-300" fontSize="small" /></InputAdornment>,
                      className: "rounded-2xl bg-slate-50/50"
                    }}
                    sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#f1f5f9' } }}
                  />
               </Stack>

               <Box className="mt-4 pt-2">
                  <FormControlLabel 
                    control={<Checkbox defaultChecked sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#2563eb' } }} />}
                    label={
                      <Typography variant="body2" className="text-slate-500 font-medium">
                        I agree to the <Link href="/terms" className="font-black text-slate-900 border-b border-slate-200">Terms of Service</Link> and <Link href="/privacy" className="font-black text-slate-900 border-b border-slate-200">Privacy Policy</Link>.
                      </Typography>
                    }
                  />
               </Box>

               <Button 
                  variant="contained" 
                  fullWidth
                  className="bg-slate-900 hover:bg-blue-600 py-5 rounded-2xl text-xl font-black lowercase transition-all shadow-xl shadow-blue-600/10 mt-6"
                  sx={{ textTransform: 'none' }}
                  endIcon={<ArrowForwardRounded />}
               >
                  Initialize Account
               </Button>

               <Box className="text-center mt-12">
                  <Typography variant="body2" className="text-slate-500 font-medium">
                    Already a member? <Link href="/login" className="font-black text-blue-600 hover:text-blue-700">Secure Sign In</Link>
                  </Typography>
               </Box>
            </form>
         </motion.div>
         
         <Box className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-30 whitespace-nowrap">
            <VerifiedUserRounded fontSize="small" className="text-emerald-500" />
            <Typography variant="caption" className="font-black uppercase tracking-widest text-[8px] text-slate-900">Bank-Grade Encryption Protocol V.4.0</Typography>
         </Box>
      </section>
    </main>
  );
}
