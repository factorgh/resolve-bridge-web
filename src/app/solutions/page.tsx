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
  BoltRounded, 
  ShieldRounded, 
  PublicRounded, 
  ArrowForwardRounded,
  CheckCircleRounded,
  GroupsRounded,
  AdsClickRounded,
  BarChartRounded,
  MemoryRounded
} from '@mui/icons-material';
import Link from 'next/link';
import PageTemplate from '../components/PageTemplate';

const solutions = [
  {
    title: "Credit & Loans",
    subtitle: "Flexible SME and Individual Financing",
    icon: <CreditCardRounded className="text-blue-500" />,
    description: "Access tailored credit solutions for small businesses and individuals. Whether you're scaling operations or managing everyday expenses, we bridge the funding gap.",
    features: ["Business Expansion Loans", "Personal Working Capital", "Flexible Repayments", "Institutional Rates"],
    highlight: "+150% growth for SME partners",
    gradient: "from-blue-500/10 to-transparent"
  },
  {
    title: "Buy Now Pay Later",
    subtitle: "Revolutionizing Retail Payments",
    icon: <BoltRounded className="text-orange-500" />,
    description: "Integrate flexible payment options into your business or shop with ease. Give your customers the power to pay over time while you get paid upfront.",
    features: ["Instant POS Integrations", "12-month installment plans", "No hidden fee structure", "Zero risk for merchants"],
    highlight: "2.4x higher conversion rate",
    gradient: "from-orange-500/10 to-transparent"
  },
  {
    title: "Insurance Coverage",
    subtitle: "Protecting What Matters Most",
    icon: <ShieldRounded className="text-purple-500" />,
    description: "From auto to health, get comprehensive coverage through our network of top-tier insurance partners across 4 African markets.",
    features: ["Vehicle & Asset protection", "Health and Life plans", "Seamless claim processing", "Multiple provider matching"],
    highlight: "98% customer satisfaction score",
    gradient: "from-purple-500/10 to-transparent"
  },
  {
    title: "Merchant Payments",
    subtitle: "Secure & Frictionless Transactions",
    icon: <PublicRounded className="text-emerald-500" />,
    description: "Empower your business with our robust payment solutions, including integrated escrow services to ensure trust between buyers and sellers.",
    features: ["International settlement", "Secure Escrow service", "Fraud detection & prevention", "Real-time payout dashboard"],
    highlight: "Zero-fraud transaction record",
    gradient: "from-emerald-500/10 to-transparent"
  }
];

export default function SolutionsPage() {
  return (
    <PageTemplate 
      title="Integrated" 
      gradientTitle="Marketplace"
      subtitle="A suite of tailor-made financial modules designed to solve the most pressing challenges for African businesses and consumers."
      noCard={true}
    >
      <Box className="pb-32 flex flex-col gap-12 md:gap-40">
        <Box>
          {solutions.map((solution, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 md:gap-24 items-center mb-24 md:mb-40 last:mb-0`}
            >
              <Box className="flex-1 flex flex-col gap-8 text-center lg:text-left items-center lg:items-start w-full">
                <Stack direction="row" spacing={3} alignItems="center">
                  <Box className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                    {solution.icon}
                  </Box>
                  <Typography variant="caption" className="font-black uppercase tracking-[0.2em] text-slate-400 text-[10px] md:text-xs">Module 0{idx + 1}</Typography>
                </Stack>
                
                <Box>
                  <Typography variant="h2" className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter mb-4 text-slate-900 leading-[1] md:leading-[0.9]">{solution.title}</Typography>
                  <Typography variant="h5" className="font-black text-blue-600 italic tracking-tight text-xl md:text-2xl">{solution.subtitle}</Typography>
                </Box>

                <Typography className="text-slate-500 text-base md:text-lg font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {solution.description}
                </Typography>

                <Grid container spacing={2} className="my-4 w-full">
                  {solution.features.map((feature, fidx) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={fidx}>
                      <Stack direction="row" spacing={2} alignItems="center" justifyContent={{ xs: 'center', lg: 'flex-start' }}>
                        <Box className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 flex-shrink-0">
                          <CheckCircleRounded sx={{ fontSize: 14 }} className="text-blue-500" />
                        </Box>
                        <Typography variant="body2" className="font-bold text-slate-900 text-sm md:text-base">{feature}</Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} alignItems="center" className="pt-6 w-full sm:w-auto">
                  <Button 
                    component={Link}
                    href="/get-started"
                    variant="contained"
                    className="bg-slate-900 hover:bg-blue-600 w-full sm:w-auto px-10 py-4 rounded-2xl font-black lowercase text-lg shadow-xl shadow-blue-600/10 transition-all"
                    sx={{ textTransform: 'none' }}
                    endIcon={<ArrowForwardRounded />}
                  >
                    Deploy Solution
                  </Button>
                  <Stack direction="row" spacing={1.5} alignItems="center" className="text-blue-600">
                    <AdsClickRounded fontSize="small" />
                    <Typography variant="caption" className="font-black uppercase tracking-widest leading-none text-[10px] md:text-xs">{solution.highlight}</Typography>
                  </Stack>
                </Stack>
              </Box>

              {/* Solution Abstract Visual */}
              <Box className="flex-1 w-full lg:max-w-xl">
                <Paper className="p-6 md:p-12 rounded-[40px] md:rounded-[64px] bg-slate-50 border border-slate-100 shadow-inner relative overflow-hidden aspect-video md:aspect-[4/3] flex items-center justify-center group transition-all duration-700 hover:bg-white hover:shadow-2xl">
                   <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.05)_0%,_transparent_100%)]" />
                   
                   <Stack spacing={4} alignItems="center" className="relative z-10 w-full">
                     <Avatar className="w-16 h-16 md:w-24 md:h-24 bg-white shadow-2xl border border-slate-100 flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110 duration-700">
                        {solution.icon}
                     </Avatar>
                     <Stack spacing={1.5} alignItems="center" className="w-full max-w-[180px] md:max-w-[280px]">
                        <Box className="h-2 w-full bg-slate-200/50 rounded-full" />
                        <Box className="h-2 w-2/3 bg-slate-100/50 rounded-full" />
                     </Stack>
                     <Stack direction="row" spacing={1.5} className="mt-4">
                        <Box className="w-12 h-6 bg-blue-600/10 rounded-lg group-hover:bg-blue-600/20 transition-colors" />
                        <Box className="w-20 h-6 bg-slate-100/50 rounded-lg" />
                     </Stack>
                   </Stack>
                </Paper>
              </Box>
            </motion.div>
          ))}
        </Box>

        {/* Closing Scale Section */}
        <Box className="px-4 md:px-0 mt-20">
          <Paper className="p-10 md:p-24 rounded-[40px] md:rounded-[64px] bg-[#020617] text-white relative overflow-hidden text-center">
             <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 blur-[200px] rounded-full -translate-y-1/2 translate-x-1/2" />
             <Box className="relative z-10">
               <Avatar className="w-16 h-16 md:w-20 md:h-20 bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 mx-auto mb-8 md:mb-10 shadow-lg">
                 <MemoryRounded sx={{ fontSize: { xs: 32, md: 40 } }} />
               </Avatar>
               <Typography variant="h2" className="text-3xl sm:text-4xl md:text-7xl font-black tracking-tighter mb-8 leading-[1] md:leading-[0.9]">
                 Scale Your Deployment <br/> <span className="text-blue-500 italic">Globally.</span>
               </Typography>
               <Typography className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto mb-12 md:mb-16">
                 Join thousands of forward-thinking businesses and individuals scaling their financial future with our enterprise-grade marketplace solutions.
               </Typography>
               <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" alignItems="center" className="w-full sm:w-auto">
                  <Button 
                     href="/get-started"
                     component={Link}
                     variant="contained"
                     className="bg-blue-600 hover:bg-white hover:text-slate-900 w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 rounded-2xl text-lg md:text-xl font-black lowercase transition-all shadow-xl shadow-blue-600/20"
                     sx={{ textTransform: 'none' }}
                  >
                     Start Scaling Now
                  </Button>
                  <Button 
                     href="/contact"
                     component={Link}
                     variant="outlined"
                     className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 rounded-2xl text-lg md:text-xl font-black lowercase transition-all"
                     sx={{ textTransform: 'none' }}
                  >
                     Talk to Sales Expert
                  </Button>
               </Stack>
             </Box>
          </Paper>
        </Box>
      </Box>
    </PageTemplate>
  );
}
