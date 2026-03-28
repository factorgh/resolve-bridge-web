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
  IconButton
} from '@mui/material';
import { 
  GroupsRounded, 
  PublicRounded, 
  AdsClickRounded as TargetRounded, 
  AutoGraphRounded, 
  SecurityRounded, 
  BoltRounded as ZapRounded, 
  FavoriteRounded,
  ShowChartRounded,
  CorporateFareRounded,
  LocationCityRounded,
  LanguageRounded
} from '@mui/icons-material';
import Link from 'next/link';
import PageTemplate from '../components/PageTemplate';

const principles = [
  {
    icon: <TargetRounded fontSize="large" />,
    title: "Institutional Mission",
    desc: "To democratize financial access across the African continent by providing a single, verified, and transparent search engine for all capital products.",
    color: "blue"
  },
  {
    icon: <FavoriteRounded fontSize="large" />,
    title: "Consumer Empowerment",
    desc: "Every line of code we write is focused on reducing the real-world financial friction experienced by millions of Africans on a daily basis.",
    color: "rose"
  },
  {
    icon: <SecurityRounded fontSize="large" />,
    title: "Unwavering Trust",
    desc: "Operating with bank-grade security and absolute institutional transparency, ensuring our users' data and trust are never compromised.",
    color: "slate"
  }
];

export default function AboutPage() {
  return (
    <PageTemplate 
      title="Our Global" 
      gradientTitle="Mission"
      subtitle="The premier financial search engine bridging the gap between individuals, businesses, and institutional capital across the African continent."
      noCard={true}
    >
      <Box className="pb-32 flex flex-col gap-16 md:gap-32">
        
        {/* Story Section */}
        <Grid container spacing={{ xs: 8, md: 12 }} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <Stack spacing={4} className="text-center md:text-left items-center md:items-start">
                <Box className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/10">
                  <CorporateFareRounded />
                </Box>
                <Typography variant="h2" className="font-black tracking-tighter leading-[1] md:leading-[0.95] text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                  Driving Economic <span className="text-blue-600 italic">Expansion</span> Through Institutional Technology.
                </Typography>
                <Typography className="text-slate-500 font-medium text-base md:text-lg leading-relaxed max-w-xl">
                  Founded with a vision to eliminate the silos in the African financial landscape, ResolveBridge has grown into a powerful ecosystem that empowers 400M+ consumers and thousands of merchants.
                </Typography>
                
                <Grid container spacing={3} className="pt-8 w-full">
                  <Grid size={{ xs: 6 }}>
                    <Box className="p-6 md:p-8 rounded-[32px] bg-slate-50 border border-slate-100 h-full">
                      <Typography variant="h3" className="font-black text-slate-900 mb-1 text-2xl md:text-3xl lg:text-4xl">50+</Typography>
                      <Typography variant="caption" className="font-black uppercase tracking-widest text-slate-400 text-[10px] md:text-xs">Bank Partners</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box className="p-6 md:p-8 rounded-[32px] bg-slate-50 border border-slate-100 h-full">
                      <Typography variant="h3" className="font-black text-slate-900 mb-1 text-2xl md:text-3xl lg:text-4xl">4+</Typography>
                      <Typography variant="caption" className="font-black uppercase tracking-widest text-slate-400 text-[10px] md:text-xs">Primary Markets</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Stack>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} className="hidden md:block">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
            >
              <Paper className="p-2 rounded-[64px] bg-slate-900 overflow-hidden relative shadow-2xl shadow-blue-900/10">
                <Box className="bg-slate-800 rounded-[56px] h-[500px] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.2)_0%,_transparent_100%)] opacity-50" />
                  <LanguageRounded className="text-white/5 text-[400px] absolute" />
                  
                  <Stack direction="row" spacing={3} className="relative z-10">
                    <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                      <Box className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl text-center w-40">
                        <AutoGraphRounded className="text-blue-500 mb-4" />
                        <Typography className="text-white font-black text-sm">Growth</Typography>
                      </Box>
                    </motion.div>
                    <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 2 }}>
                      <Box className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl text-center w-40">
                        <ShowChartRounded className="text-emerald-500 mb-4" />
                        <Typography className="text-white font-black text-sm">Analytics</Typography>
                      </Box>
                    </motion.div>
                  </Stack>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Principles Section */}
        <Box>
           <Box className="text-center mb-16 md:mb-20 px-4">
              <Typography variant="caption" className="text-blue-600 font-black uppercase tracking-[0.3em] block mb-4 text-[10px] md:text-xs">Our Cultural DNA</Typography>
              <Typography variant="h2" className="font-black tracking-tighter mb-4 text-3xl md:text-5xl">Fundamental <span className="text-blue-600 italic">Principles.</span></Typography>
              <Typography className="text-slate-400 font-medium text-base md:text-lg max-w-2xl mx-auto">The underlying institutional values that guide our architecture and every partner relationship we build.</Typography>
           </Box>

           <Grid container spacing={{ xs: 3, md: 4 }}>
             {principles.map((p, idx) => (
               <Grid size={{ xs: 12, md: 4 }} key={idx}>
                 <Card className="rounded-[40px] md:rounded-[48px] border border-slate-100 bg-white p-8 md:p-12 h-full shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 group">
                   <Box className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-10 transition-transform group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white text-slate-400`}>
                     {p.icon}
                   </Box>
                   <Typography variant="h5" className="font-black text-slate-900 mb-6 text-xl md:text-2xl">{p.title}</Typography>
                   <Typography className="text-slate-400 font-medium leading-relaxed text-sm md:text-base">{p.desc}</Typography>
                 </Card>
               </Grid>
             ))}
           </Grid>
        </Box>

        {/* Regional Hubs Section */}
        <Paper className="p-8 md:p-24 rounded-[40px] md:rounded-[64px] bg-[#020617] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 blur-[200px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <Box className="relative z-10">
            <Box className="text-center mb-16 md:mb-20">
              <Typography variant="h3" className="font-black tracking-tighter mb-4 text-2xl md:text-4xl">Pan-African Digital Presence.</Typography>
              <Typography className="text-slate-500 text-base md:text-lg font-medium max-w-xl mx-auto px-4">Operating across the continent's most dynamic economies to drive financial inclusion through institutional scale.</Typography>
            </Box>

            <Grid container spacing={{ xs: 3, md: 6 }}>
              {[
                { name: "Ghana", city: "Accra Regional HQ", icon: <LocationCityRounded fontSize="large" color="primary" /> },
                { name: "Nigeria", city: "Lagos Growth Hub", icon: <ZapRounded fontSize="large" color="primary" /> },
                { name: "Kenya", city: "Nairobi Tech Unit", icon: <AutoGraphRounded fontSize="large" color="primary" /> },
                { name: "South Africa", city: "JHB Financial Hub", icon: <SecurityRounded fontSize="large" color="primary" /> }
              ].map((hub, i) => (
                <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={i}>
                  <Box className="text-center p-8 rounded-[32px] md:rounded-[40px] bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-crosshair">
                    <Box className="mb-6">{hub.icon}</Box>
                    <Typography variant="h5" className="font-black text-white mb-1 text-xl">{hub.name}</Typography>
                    <Typography variant="caption" className="font-black uppercase tracking-widest text-slate-500 text-[10px]">{hub.city}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>

        {/* Final CTA */}
        <Box className="text-center py-12 md:py-20 px-4">
          <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
          >
            <Avatar className="w-20 h-20 md:w-24 md:h-24 bg-blue-600 mx-auto mb-10 shadow-xl shadow-blue-600/30">
               <GroupsRounded fontSize="large" />
            </Avatar>
            <Typography variant="h2" className="font-black tracking-tighter mb-6 leading-[1.1] md:leading-none text-3xl sm:text-5xl md:text-7xl">
              Join the Financial <br/> <span className="text-blue-600 italic">Revolution.</span>
            </Typography>
            <Typography className="text-slate-500 font-medium text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
              Whether you're a potential institutional partner, a growth-focused customer, or talent looking to make a continental impact, we want to hear from you.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" alignItems="center">
              <Button 
                href="/get-started"
                component={Link}
                variant="contained" 
                className="bg-slate-900 hover:bg-blue-600 w-full sm:w-auto px-12 py-5 rounded-2xl text-xl font-black lowercase transition-all shadow-xl shadow-blue-600/10"
                sx={{ textTransform: 'none' }}
              >
                Start Journey
              </Button>
              <Button 
                href="/contact"
                component={Link}
                variant="outlined" 
                className="border-slate-200 text-slate-900 hover:bg-slate-50 w-full sm:w-auto px-12 py-5 rounded-2xl text-xl font-black lowercase transition-all"
                sx={{ textTransform: 'none' }}
              >
                Talk to Sales
              </Button>
            </Stack>
          </motion.div>
        </Box>

      </Box>
    </PageTemplate>
  );
}
