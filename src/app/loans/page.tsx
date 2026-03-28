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
  CreditCardRounded, 
  CheckCircleRounded, 
  ArrowForwardRounded, 
  ShieldRounded, 
  BoltRounded, 
  TrendingUpRounded,
  VerifiedUserRounded,
  MonetizationOnRounded,
  SecurityRounded,
  AutoGraphRounded
} from '@mui/icons-material';
import Link from 'next/link';
import PageTemplate from '../components/PageTemplate';

const benefits = [
  "Competitive Interest Rates",
  "Flexible 12-36 Month Terms",
  "No Collateral for Small Business",
  "Instant Digital Disbursement",
  "Automated Repayments",
  "Credit Limit Re-evaluation"
];

export default function LoansPage() {
  return (
    <PageTemplate 
      title="Institutional" 
      gradientTitle="Capital"
      subtitle="Access world-class credit solutions for SMEs and individuals, powered by Africa's most transparent search engine."
      noCard={true}
    >
      <Box className="pb-32 flex flex-col gap-16 md:gap-32">
        
        {/* Main Content Split */}
        <Grid container spacing={{ xs: 8, lg: 12 }} alignItems="center">
          <Grid size={{ xs: 12, lg: 6 }}>
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <Paper className="p-8 md:p-16 rounded-[40px] md:rounded-[64px] bg-[#020617] text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <Box className="relative z-10 text-center md:text-left">
                   <Box className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 mb-8 md:mb-10 mx-auto md:mx-0">
                      <CreditCardRounded fontSize="large" />
                   </Box>
                   <Typography variant="h2" className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[1] md:leading-[0.9]">
                     Business & <br/> Personal <span className="text-blue-500 italic">Credit</span>
                   </Typography>
                   <Typography className="text-slate-400 text-base md:text-lg font-medium leading-relaxed mb-10 md:mb-12 max-w-lg mx-auto md:mx-0">
                     Whether you're scaling an SME or managing personal finances, our integrated lender network ensures you get the most competitive rates in West and East Africa.
                   </Typography>
                   
                   <Grid container spacing={2.5} className="mb-10 md:mb-12">
                      {benefits.map((item, idx) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                          <Stack direction="row" spacing={2} alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }}>
                            <Box className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 flex-shrink-0">
                               <CheckCircleRounded sx={{ fontSize: 14 }} className="text-blue-500" />
                            </Box>
                            <Typography variant="caption" className="font-black uppercase tracking-widest text-slate-500 text-[9px] md:text-[10px]">{item}</Typography>
                          </Stack>
                        </Grid>
                      ))}
                   </Grid>

                   <Button 
                      fullWidth
                      component={Link}
                      href="/get-started"
                      variant="contained"
                      className="bg-white hover:bg-blue-600 hover:text-white text-slate-900 py-4 md:py-5 rounded-2xl font-black lowercase text-lg md:text-xl transition-all shadow-xl shadow-blue-600/10"
                      sx={{ textTransform: 'none' }}
                      endIcon={<ArrowForwardRounded />}
                   >
                      Apply for Funding
                   </Button>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
               <Box className="mb-12 text-center md:text-left px-4">
                  <Typography variant="caption" className="text-blue-600 font-black uppercase tracking-[0.3em] block mb-4 text-[10px] md:text-xs">Lender Hub</Typography>
                  <Typography variant="h2" className="font-black tracking-tighter leading-[1] md:leading-[0.95] mb-6 text-slate-900 text-3xl sm:text-4xl md:text-5xl lg:text-7xl">
                    Bridging the Capital <br/> Gap Across <span className="text-blue-600 italic">Africa.</span>
                  </Typography>
                  <Typography className="text-slate-500 text-base md:text-lg font-medium leading-relaxed max-w-xl mx-auto md:mx-0">
                    ResolveBridge leverages advanced matching algorithms to connect you with lenders that actually understand your risk profile. No more endless paperwork or generic loan offers.
                  </Typography>
               </Box>

               <Stack spacing={3} md-spacing={4}>
                  {[
                    { icon: <TrendingUpRounded fontSize="large" />, value: "2.5%", unit: "Avg. Monthly", label: "Lowest Market Interest Rate" },
                    { icon: <BoltRounded fontSize="large" />, value: "24hr", unit: "Disbursement", label: "Standard Payout Time" },
                    { icon: <SecurityRounded fontSize="large" />, value: "Secure", unit: "Search", label: "Bank-Grade Data Protection" }
                  ].map((item, i) => (
                    <Paper key={i} className="p-6 md:p-8 rounded-[32px] border border-slate-100 bg-white hover:bg-slate-50 transition-all group shadow-sm flex-shrink-0">
                       <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} md-spacing={4} alignItems="center" className="text-center sm:text-left">
                          <Box className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                             {item.icon}
                          </Box>
                          <Box>
                             <Typography variant="h4" className="font-black text-slate-900 leading-none mb-1 text-xl md:text-2xl lg:text-3xl">
                               {item.value} <span className="text-sm md:text-lg opacity-40 font-bold ml-1">{item.unit}</span>
                             </Typography>
                             <Typography variant="caption" className="font-black uppercase tracking-widest text-slate-400 text-[10px] md:text-xs">{item.label}</Typography>
                          </Box>
                       </Stack>
                    </Paper>
                  ))}
               </Stack>
            </motion.div>
          </Grid>
        </Grid>

        {/* Final CTA Action */}
        <Box className="text-center py-12 md:py-20 px-4">
           <Paper className="p-8 md:p-24 rounded-[40px] md:rounded-[64px] border border-slate-100 bg-slate-50/50 shadow-inner relative overflow-hidden h-full">
              <Box className="relative z-10">
                <Typography variant="h2" className="font-black tracking-tighter mb-6 leading-[1.1] md:leading-none text-3xl sm:text-5xl md:text-7xl">
                  Ready to <span className="text-blue-600 italic">Fund Your Growth?</span>
                </Typography>
                <Typography className="text-slate-500 font-medium text-lg md:text-xl max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed">
                  Join thousands of African businesses scaling their dreams with ResolveBridge institutional capital solutions.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" alignItems="center" className="w-full sm:w-auto">
                   <Button 
                      href="/get-started"
                      component={Link}
                      variant="contained"
                      className="bg-slate-900 hover:bg-blue-600 w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 rounded-2xl text-lg md:text-xl font-black lowercase shadow-lg shadow-blue-600/10 transition-all"
                      sx={{ textTransform: 'none' }}
                      endIcon={<BoltRounded />}
                   >
                      Launch Capital Search
                   </Button>
                   <Button 
                      href="/contact"
                      component={Link}
                      variant="outlined"
                      className="border-slate-200 text-slate-900 hover:bg-slate-50 w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 rounded-2xl text-lg md:text-xl font-black lowercase transition-all"
                      sx={{ textTransform: 'none' }}
                   >
                      Consult Expert
                   </Button>
                </Stack>
              </Box>
           </Paper>
        </Box>
      </Box>
    </PageTemplate>
  );
}
