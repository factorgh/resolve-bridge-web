'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Slider, 
  Button, 
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Divider
} from '@mui/material';
import { 
  CalculateRounded as CalculatorIcon, 
  TrendingUp as TrendingUpIcon, 
  ArrowRight as ArrowRightIcon,
  Info as InfoIcon,
  PieChart as PieChartIcon,
  CheckCircle as CheckCircleIcon,
  MonetizationOnRounded,
  ShowChartRounded,
  AvTimerRounded
} from '@mui/icons-material';
import PageTemplate from '../components/PageTemplate';

export default function LoanCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(211000); 
  const [interestRate, setInterestRate] = useState(18.5); 
  const [loanTerm, setLoanTerm] = useState(33); 
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { monthlyPayment, weeklyPayment, dailyPayment, totalPayment, totalInterest } = useMemo(() => {
    const r = interestRate / 100 / 12;
    const n = loanTerm;
    const p = loanAmount;
    
    if (n === 0) return { monthlyPayment: 0, weeklyPayment: 0, dailyPayment: 0, totalPayment: 0, totalInterest: 0 };
    
    let monthly = 0;
    if (r === 0) {
      monthly = p / n;
    } else {
      const x = Math.pow(1 + r, n);
      monthly = (p * x * r) / (x - 1);
    }
    
    const annual = monthly * 12;
    
    return {
      monthlyPayment: monthly,
      weeklyPayment: annual / 52,
      dailyPayment: annual / 365,
      totalPayment: monthly * n,
      totalInterest: (monthly * n) - p
    };
  }, [loanAmount, interestRate, loanTerm]);

  if (!mounted) return null;

  return (
    <PageTemplate 
      title="Financial" 
      gradientTitle="Intelligence"
      subtitle="Calculate your repayment profile with precision. Africa's most transparent loan planning engine."
      noCard={true}
    >
      <Box className="pb-32 flex flex-col gap-12 md:gap-24">
        
        <Grid container spacing={{ xs: 6, md: 8 }} alignItems="stretch">
          
          {/* Controls Panel */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="h-full"
            >
              <Paper 
                elevation={0}
                className="p-8 md:p-12 rounded-[40px] md:rounded-[48px] border border-slate-100 bg-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] h-full flex flex-col"
              >
                <Stack direction="row" spacing={3} alignItems="center" className="mb-12">
                  <Box className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <MonetizationOnRounded fontSize="large" />
                  </Box>
                  <Box>
                    <Typography variant="h5" className="font-black tracking-tight text-slate-900 text-xl md:text-2xl">Loan Parameters</Typography>
                    <Typography variant="body2" className="text-slate-400 font-medium tracking-wide text-xs md:text-sm">Adjust sliders for real-time estimates</Typography>
                  </Box>
                </Stack>

                <Stack spacing={6} md-spacing={8} className="flex-grow">
                  {/* Amount Slider */}
                  <Box>
                    <Stack direction="row" justifyContent="space-between" className="mb-4">
                      <Typography variant="caption" className="font-black uppercase tracking-widest text-slate-400">Principal Amount</Typography>
                      <Typography className="font-black text-lg md:text-xl text-blue-600">${loanAmount.toLocaleString()}</Typography>
                    </Stack>
                    <Slider 
                      value={loanAmount}
                      min={1000}
                      max={500000}
                      step={1000}
                      onChange={(_, v) => setLoanAmount(v as number)}
                      className="text-blue-600"
                      sx={{ '& .MuiSlider-thumb': { width: { xs: 20, md: 28 }, height: { xs: 20, md: 28 }, backgroundColor: '#fff', border: '6px solid currentColor' } }}
                    />
                  </Box>

                  {/* Interest Slider */}
                  <Box>
                    <Stack direction="row" justifyContent="space-between" className="mb-4">
                      <Typography variant="caption" className="font-black uppercase tracking-widest text-slate-400">Annual Interest Rate</Typography>
                      <Typography className="font-black text-lg md:text-xl text-blue-600">{interestRate}%</Typography>
                    </Stack>
                    <Slider 
                      value={interestRate}
                      min={1}
                      max={45}
                      step={0.5}
                      onChange={(_, v) => setInterestRate(v as number)}
                      className="text-blue-600"
                      sx={{ '& .MuiSlider-thumb': { width: { xs: 20, md: 28 }, height: { xs: 20, md: 28 }, backgroundColor: '#fff', border: '6px solid currentColor' } }}
                    />
                  </Box>

                  {/* Term Slider */}
                  <Box>
                    <Stack direction="row" justifyContent="space-between" className="mb-4">
                      <Typography variant="caption" className="font-black uppercase tracking-widest text-slate-400">Repayment Period</Typography>
                      <Typography className="font-black text-lg md:text-xl text-blue-600">{loanTerm} Months</Typography>
                    </Stack>
                    <Slider 
                      value={loanTerm}
                      min={3}
                      max={60}
                      step={3}
                      onChange={(_, v) => setLoanTerm(v as number)}
                      className="text-blue-600"
                      sx={{ '& .MuiSlider-thumb': { width: { xs: 20, md: 28 }, height: { xs: 20, md: 28 }, backgroundColor: '#fff', border: '6px solid currentColor' } }}
                    />
                  </Box>
                </Stack>

                <Box className="mt-12 p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                  <InfoIcon className="text-blue-400" sx={{ fontSize: 20 }} />
                  <Typography variant="body2" className="text-slate-500 font-medium leading-relaxed text-xs md:text-sm">
                    Estimates provided are for informational purposes. Actual rates vary by institutional lender and credit profile.
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Results Area */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-6 md:gap-8 h-full"
            >
              <Paper 
                elevation={0}
                sx={{ 
                  backgroundColor: '#020617', 
                  color: '#ffffff',
                  p: { xs: 6, md: 8, lg: 12 },
                  borderRadius: { xs: '40px', md: '64px' },
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  minHeight: { xs: '380px', md: '450px' },
                  boxShadow: '0 30px 60px -15px rgba(2, 6, 23, 0.3)'
                }}
              >
                <Box className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-blue-600/10 blur-[80px] md:blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <Box className="relative z-10 text-center">
                  <Typography variant="caption" className="font-black uppercase tracking-widest text-blue-500 block mb-6 px-4">Estimated Monthly Payment</Typography>
                  <Typography variant="h1" sx={{ color: 'white' }} className="font-black tracking-tighter mb-10 flex items-baseline justify-center text-5xl md:text-6xl lg:text-8xl">
                    <span style={{ fontSize: '0.45em', opacity: 0.5, marginRight: '8px' }}>$</span>
                    {monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    <span style={{ fontSize: '0.25em', opacity: 0.3, marginLeft: '8px' }}>/mo</span>
                  </Typography>
                  
                  <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mb: { xs: 4, md: 6 } }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <Typography variant="caption" className="text-slate-500 font-bold uppercase tracking-widest block mb-1">Weekly Payment</Typography>
                        <Typography variant="h6" className="text-white font-black text-xl md:text-2xl">${weeklyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <Typography variant="caption" className="text-slate-500 font-bold uppercase tracking-widest block mb-1">Daily Breakdown</Typography>
                        <Typography variant="h6" className="text-white font-black text-xl md:text-2xl">${dailyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid container spacing={{ xs: 2, md: 4 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <Typography variant="caption" className="text-slate-500 font-bold uppercase tracking-widest block mb-1">Total Principal</Typography>
                        <Typography variant="h6" className="text-white font-black text-xl md:text-2xl">${loanAmount.toLocaleString()}</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <Typography variant="caption" className="text-slate-500 font-bold uppercase tracking-widest block mb-1">Cost of Borrowing</Typography>
                        <Typography variant="h6" className="text-white font-black text-xl md:text-2xl">${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', my: { xs: 6, md: 10 } }} />

                  <Typography className="text-slate-400 font-bold text-sm md:text-lg">
                    Total Estimated Repayment: <span className="text-white font-black ml-2">${totalPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </Typography>
                </Box>
              </Paper>

              <Box className="p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-slate-100 bg-white flex flex-col sm:flex-row items-center gap-6 justify-between shadow-sm">
                <Box className="flex items-center gap-4 text-center sm:text-left">
                  <Box className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircleIcon />
                  </Box>
                  <Box>
                    <Typography className="font-black text-slate-900 text-sm md:text-base">Pre-Approval Ready</Typography>
                    <Typography variant="caption" className="text-slate-400 font-bold block">Lock in these rates within 15 minutes</Typography>
                  </Box>
                </Box>
                <Button 
                  component={Link}
                  href="/get-started"
                  variant="contained" 
                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-sm lowercase transition-all"
                  sx={{ textTransform: 'none' }}
                  endIcon={<ArrowRightIcon />}
                >
                  Start Full Application
                </Button>
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        {/* Insight Section */}
        <Paper className="p-10 md:p-24 rounded-[40px] md:rounded-[64px] border border-slate-100 bg-slate-50/50 shadow-inner">
          <Grid container spacing={8} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="caption" className="text-blue-600 font-black uppercase tracking-[0.2em] block mb-4">Lending Transparency</Typography>
              <Typography variant="h2" className="font-black tracking-tight mb-8 text-3xl md:text-5xl lg:text-6xl leading-[1.1]">
                Why Precision <span className="text-blue-600 italic">Matters.</span>
              </Typography>
              <Typography className="text-slate-500 text-base md:text-lg font-medium leading-relaxed max-w-xl">
                Hidden processing fees and compound interest traps are prevalent in fragmented markets. ResolveBridge utilizes institutional-grade algorithms to ensure you see the full cost of capital before committing.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={{ xs: 4, md: 4 }}>
                {[
                  { icon: ShowChartRounded, title: "Risk-Based Rates", desc: "Our engine optimizes APR based on your real-time debt-to-income profile." },
                  { icon: AvTimerRounded, title: "Early Scalability", desc: "Calculate the impact of accelerated repayments on your total cost of capital." },
                  { icon: PieChartIcon, title: "Zero Origination Bias", desc: "View pure institutional rates without additional intermediary brokerage margins." }
                ].map((item, idx) => (
                  <Box key={idx} className="flex gap-4 md:gap-6">
                    <Box className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 flex-shrink-0">
                      <item.icon fontSize="medium" />
                    </Box>
                    <Box>
                      <Typography className="font-black text-slate-900 mb-1 text-sm md:text-base">{item.title}</Typography>
                      <Typography variant="body2" className="text-slate-400 md:text-slate-500 font-medium text-xs md:text-sm">{item.desc}</Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Paper>

      </Box>
    </PageTemplate>
  );
}
