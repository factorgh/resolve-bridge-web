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
  IconButton
} from '@mui/material';
import { 
  ArrowForwardRounded, 
  EmailRounded, 
  LockRounded, 
  ShieldRounded,
  PublicRounded,
  ChevronLeftRounded,
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  VerifiedUserRounded
} from '@mui/icons-material';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center py-20 bg-slate-50 selection:bg-blue-100 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.05)_0%,_transparent_100%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <Container maxWidth="sm" className="relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Paper className="p-8 md:p-16 rounded-[48px] bg-white border border-slate-100 shadow-2xl relative overflow-hidden">
             {/* Link back top right */}
             <Box className="absolute top-8 left-8">
                <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black uppercase tracking-widest text-[8px] transition-colors">
                   <ChevronLeftRounded sx={{ fontSize: 12 }} /> Back
                </Link>
             </Box>

            <Box className="text-center mb-12 mt-4">
              <Link href="/" className="inline-flex items-center gap-3 mb-12 hover:opacity-80 transition-opacity">
                 <img src="/resolve_icon.png" alt="Resolve" className="h-8 w-auto" />
                 <Typography variant="h5" className="font-black tracking-tighter text-slate-900">Resolve<span className="text-blue-500 italic">Bridge</span></Typography>
              </Link>
              <Typography variant="h2" className="text-4xl font-black tracking-tighter mb-4 text-slate-900 leading-none">Welcome <span className="text-blue-600 italic">Back.</span></Typography>
              <Typography className="text-slate-400 font-medium text-lg">Sign in to manage your financial portfolio.</Typography>
            </Box>

            <form className="flex flex-col gap-8">
               <Stack spacing={1}>
                  <Typography variant="caption" className="font-black uppercase tracking-widest text-slate-400 text-[10px] px-1">Email Address</Typography>
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
                  <Box className="flex justify-between items-center px-1">
                    <Typography variant="caption" className="font-black uppercase tracking-widest text-slate-400 text-[10px]">Secret Password</Typography>
                    <Link href="/forgot-password" className="font-black text-[10px] uppercase tracking-widest text-blue-600 hover:text-blue-700">Forgot Identity?</Link>
                  </Box>
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

               <Button 
                  variant="contained" 
                  fullWidth
                  className="bg-slate-900 hover:bg-blue-600 py-5 rounded-2xl text-xl font-black lowercase transition-all shadow-xl shadow-blue-600/10 mt-2"
                  sx={{ textTransform: 'none' }}
                  endIcon={<ArrowForwardRounded />}
               >
                  Secure Sign In
               </Button>

               <Box className="relative flex items-center gap-4 my-2">
                  <Box className="flex-grow h-px bg-slate-100" />
                  <Typography variant="caption" className="font-black uppercase tracking-[0.2em] text-slate-300 text-[8px] whitespace-nowrap">OR CONTINUE WITH</Typography>
                  <Box className="flex-grow h-px bg-slate-100" />
               </Box>

               <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Button 
                      fullWidth
                      variant="outlined"
                      startIcon={<GoogleIcon fontSize="small" />}
                      className="rounded-xl border-slate-100 text-slate-900 font-bold py-3 hover:bg-slate-50 transition-all lowercase text-xs"
                      sx={{ textTransform: 'none' }}
                    >
                      Google
                    </Button>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Button 
                      fullWidth
                      variant="outlined"
                      startIcon={<GitHubIcon fontSize="small" />}
                      className="rounded-xl border-slate-100 text-slate-900 font-bold py-3 hover:bg-slate-50 transition-all lowercase text-xs"
                      sx={{ textTransform: 'none' }}
                    >
                      Github
                    </Button>
                  </Grid>
               </Grid>

               <Box className="text-center mt-6">
                  <Typography variant="body2" className="text-slate-500 font-medium">
                    New to the Bridge? <Link href="/get-started" className="font-black text-blue-600 hover:text-blue-700">Initialize Account</Link>
                  </Typography>
               </Box>
            </form>
            
            <Box className="mt-16 pt-8 border-t border-slate-50 flex items-center justify-center gap-3 opacity-30">
               <VerifiedUserRounded fontSize="small" className="text-emerald-500" />
               <Typography variant="caption" className="font-black uppercase tracking-widest text-[8px] text-slate-900">Persistent Encryption Profile Active</Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </main>
  );
}
