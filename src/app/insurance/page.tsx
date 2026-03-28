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
  CheckCircleRounded, 
  ArrowForwardRounded, 
  FavoriteRounded, 
  DirectionsCarRounded, 
  PublicRounded, 
  LocalShippingRounded, 
  BoltRounded, 
  VerifiedUserRounded, 
  SecurityRounded, 
  HealthAndSafetyRounded 
} from '@mui/icons-material';
import Link from 'next/link';
import PageTemplate from '../components/PageTemplate';

const insuranceTypes = [
  { icon: <DirectionsCarRounded fontSize="large" />, title: "Automotive & Fleet", description: "Comprehensive coverage for your vehicles and commercial fleets across 4 markets.", color: "#2563eb" },
  { icon: <HealthAndSafetyRounded fontSize="large" />, title: "Health & Life", description: "Secure your future with affordable family and team health coverage options.", color: "#7c3aed" },
  { icon: <LocalShippingRounded fontSize="large" />, title: "Transport & Logistics", description: "Specialized coverage for high-value assets and goods in transit internationally.", color: "#10b981" },
  { icon: <PublicRounded fontSize="large" />, title: "Travel Protection", description: "Global travel insurance with direct payouts and local emergency support.", color: "#f59e0b" }
];

export default function InsurancePage() {
  return (
    <PageTemplate 
      title="Uncompromising" 
      gradientTitle="Protection"
      subtitle="One search engine. Infinite insurance possibilities. Secure your assets and health with Africa's most trusted partners."
      noCard={true}
    >
      <Box className="pb-32 flex flex-col gap-16 md:gap-32">
        
        {/* Insurance Grid */}
        <Box>
          <Box className="text-center max-w-3xl mx-auto mb-16 md:mb-20 px-4">
             <Typography variant="caption" className="text-blue-600 font-black uppercase tracking-[0.3em] block mb-4 text-[10px] md:text-xs">Coverage Modules</Typography>
             <Typography variant="h2" className="font-black tracking-tighter mb-4 text-3xl md:text-5xl lg:text-6xl leading-[1]">Asset & Health <span className="text-blue-600 italic">Protection</span></Typography>
             <Typography className="text-slate-400 font-medium text-base md:text-lg leading-relaxed">Comprehensive coverage options tailored for the African continent's unique business and personal environments.</Typography>
          </Box>

          <Grid container spacing={{ xs: 3, md: 4 }}>
            {insuranceTypes.map((t, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="h-full"
                >
                  <Card className="rounded-[40px] border border-slate-100 bg-white p-8 md:p-10 h-full shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 group flex flex-col items-center text-center">
                    <Box 
                      className="w-16 h-16 md:w-20 md:h-20 rounded-[24px] md:rounded-[28px] bg-slate-50 flex items-center justify-center mb-8 md:mb-10 transition-transform group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white"
                      style={{ color: t.color }}
                    >
                      {t.icon}
                    </Box>
                    <Box className="flex-grow mb-8">
                       <Typography variant="h5" className="font-black text-slate-900 mb-4 tracking-tight text-xl md:text-2xl">{t.title}</Typography>
                       <Typography className="text-slate-400 font-medium leading-relaxed text-sm">{t.description}</Typography>
                    </Box>
                    <Button 
                      fullWidth
                      component={Link}
                      href="/get-started"
                      variant="outlined"
                      className="rounded-2xl border-slate-200 text-slate-900 font-bold hover:bg-slate-50 lowercase text-sm py-3"
                      sx={{ textTransform: 'none' }}
                      endIcon={<ArrowForwardRounded />}
                    >
                      Get Quote
                    </Button>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Strategic CTA Section */}
        <Paper className="p-8 md:p-24 rounded-[40px] md:rounded-[64px] bg-[#020617] text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-600/10 blur-[200px] rounded-full -translate-y-1/2 -translate-x-1/2" />
          
          <Grid container spacing={{ xs: 8, lg: 12 }} alignItems="center" className="relative z-10">
            <Grid size={{ xs: 12, lg: 7 }}>
              <Stack spacing={4} className="text-center lg:text-left">
                <Typography variant="h1" className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-[1] md:leading-[0.9]">
                  Secure Your <br/> <span className="text-blue-500 italic">Dreams</span> Today.
                </Typography>
                <Typography className="text-slate-400 text-base md:text-xl font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Don't wait for the unexpected. Our integrated marketplace allows you to compare and procure the best insurance products in under 5 minutes.
                </Typography>
                
                <Grid container spacing={3} md-spacing={4} className="pt-8">
                   {[
                     "Verified Insurers Only",
                     "Instant Quote Generation",
                     "Direct Digitized Claims",
                     "Regulatory Compliance"
                   ].map((item, i) => (
                     <Grid size={{ xs: 12, sm: 6 }} key={i}>
                       <Stack direction="row" spacing={2} alignItems="center" justifyContent={{ xs: 'center', lg: 'flex-start' }}>
                         <VerifiedUserRounded className="text-blue-500" fontSize="small" />
                         <Typography variant="caption" className="font-black uppercase tracking-widest text-slate-500 text-[10px] md:text-xs">{item}</Typography>
                       </Stack>
                     </Grid>
                   ))}
                </Grid>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, lg: 5 }}>
              <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
              >
                <Paper className="p-10 md:p-16 rounded-[40px] md:rounded-[48px] bg-white text-center shadow-2xl">
                  <Avatar className="w-20 h-20 md:w-24 md:h-24 bg-blue-50 text-blue-600 mx-auto mb-8 shadow-sm">
                    <ShieldRounded sx={{ fontSize: { xs: 32, md: 40 } }} />
                  </Avatar>
                  <Typography variant="h4" className="font-black text-slate-900 mb-4 tracking-tighter leading-[1] text-2xl md:text-3xl lg:text-4xl">Institutional <br/> Security Profile.</Typography>
                  <Typography className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest mb-10 px-4">Access 50+ partners instantly.</Typography>
                  <Button 
                    fullWidth
                    component={Link}
                    href="/get-started"
                    variant="contained"
                    className="py-4 md:py-5 rounded-2xl bg-blue-600 font-black lowercase text-base md:text-lg shadow-xl shadow-blue-600/20"
                    sx={{ textTransform: 'none' }}
                  >
                    Start Quote Application
                  </Button>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Paper>

        {/* Final Closing Action */}
        <Box className="text-center py-12 md:py-20 px-4">
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
           >
              <Box className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-50 text-blue-600 flex items-center justify-center mx-auto mb-8 md:mb-10 shadow-sm">
                 <BoltRounded fontSize="large" />
              </Box>
              <Typography variant="h2" className="font-black tracking-tighter mb-6 leading-[1] text-3xl md:text-6xl">
                Protect What <span className="text-blue-600 italic">Matters.</span>
              </Typography>
              <Typography className="text-slate-500 font-medium text-lg md:text-xl max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed">
                Join thousands of Africans scaling their financial future with complete institutional insurance security.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" alignItems="center">
                 <Button 
                    href="/get-started"
                    component={Link}
                    variant="contained"
                    className="bg-slate-900 hover:bg-blue-600 w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 rounded-2xl text-lg md:text-xl font-black lowercase shadow-lg shadow-blue-600/10 transition-all"
                    sx={{ textTransform: 'none' }}
                 >
                    Search Coverage
                 </Button>
                 <Button 
                    href="/contact"
                    component={Link}
                    variant="outlined"
                    className="border-slate-200 text-slate-900 hover:bg-slate-50 w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 rounded-2xl text-lg md:text-xl font-black lowercase transition-all"
                    sx={{ textTransform: 'none' }}
                 >
                    Speak with Agent
                 </Button>
              </Stack>
           </motion.div>
        </Box>
      </Box>
    </PageTemplate>
  );
}
