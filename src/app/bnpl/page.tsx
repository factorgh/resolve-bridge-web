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
  Chip
} from '@mui/material';
import { 
  BoltRounded, 
  ShoppingCartRounded, 
  ArrowForwardRounded, 
  ShieldRounded, 
  PublicRounded, 
  SettingsSuggestRounded, 
  GroupsRounded,
  AddShoppingCartRounded,
  LocalMallRounded,
  StorefrontRounded,
  VerifiedUserRounded
} from '@mui/icons-material';
import Link from 'next/link';
import PageTemplate from '../components/PageTemplate';

const vendors = ["iStore Africa", "Samsung Store", "Shoprite Mall", "Jumia Ghana", "Konga Nigeria", "Decathlon Africa"];

export default function BnplPage() {
  return (
    <PageTemplate 
      title="Split Your" 
      gradientTitle="Payments"
      subtitle="Experience financial freedom with our integrated Buy Now Pay Later partners. Split your bill, not your dreams."
      noCard={true}
    >
      <Box className="pb-32 flex flex-col gap-16 md:gap-32">
        
        {/* Story Section */}
        <Grid container spacing={{ xs: 8, lg: 12 }} alignItems="center">
          <Grid size={{ xs: 12, lg: 6 }}>
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="flex flex-col gap-10 text-center lg:text-left items-center lg:items-start"
            >
              <Box>
                <Typography variant="caption" className="text-blue-600 font-black uppercase tracking-[0.3em] block mb-4 text-[10px] md:text-xs">Retail Expansion</Typography>
                <Typography variant="h2" className="font-black tracking-tighter leading-[1] md:leading-[0.95] mb-8 text-slate-900 text-3xl sm:text-4xl md:text-5xl lg:text-7xl">
                  Experience <br/> <span className="text-blue-600 italic">Financial Freedom</span> <br/> At Every Store.
                </Typography>
                <Typography className="text-slate-500 text-base md:text-lg lg:text-xl font-medium leading-relaxed max-w-xl">
                  Boost your purchasing power with our integrated BNPL partners across major retail categories. No hidden fees. Just seamless split payments across 4 major African markets.
                </Typography>
              </Box>
              
              <Grid container spacing={2.5} className="w-full">
                {[
                  { icon: <BoltRounded className="text-amber-500" />, label: "Instant POS Approval" },
                  { icon: <ShieldRounded className="text-blue-500" />, label: "Zero Interest Cycles" }
                ].map((item, i) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={i}>
                    <Paper className="p-5 md:p-6 rounded-[32px] bg-slate-50 border border-slate-100 flex items-center gap-4 h-full">
                      <Box className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                        {item.icon}
                      </Box>
                      <Typography variant="caption" className="font-black uppercase tracking-widest text-slate-400 text-[9px] md:text-xs">{item.label}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Box className="w-full">
                 <Typography variant="caption" className="font-black uppercase tracking-widest text-slate-300 block mb-6 px-1 text-[9px] md:text-xs">Integrated Retail Partners</Typography>
                 <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent={{ xs: 'center', lg: 'flex-start' }}>
                    {vendors.map((v, idx) => (
                      <Chip 
                        key={idx} 
                        label={v} 
                        className="rounded-xl font-black text-[9px] md:text-[10px] tracking-widest bg-white border border-slate-100 py-5 md:py-6 px-3 md:px-4 hover:border-blue-400 transition-colors shadow-sm"
                      />
                    ))}
                 </Stack>
              </Box>
            </motion.div>
          </Grid>

          {/* Visual UI Mock */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="relative"
            >
               <Paper className="p-2 md:p-3 rounded-[40px] md:rounded-[64px] bg-white border border-slate-100 shadow-2xl relative z-10 overflow-hidden">
                  <Box className="bg-[#020617] h-[450px] md:h-[600px] rounded-[32px] md:rounded-[56px] overflow-hidden p-8 md:p-12 flex flex-col items-center justify-center text-center relative">
                     <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.15)_0%,_transparent_100%)]" />
                     
                     <Avatar className="w-20 h-20 md:w-32 md:h-32 bg-blue-600/10 text-blue-500 mb-8 md:mb-10 shadow-lg shadow-blue-600/5">
                       <ShoppingCartRounded sx={{ fontSize: { xs: 40, md: 60 } }} />
                     </Avatar>
                     
                     <Typography variant="h2" className="text-white font-black tracking-tighter mb-6 leading-[1.1] md:leading-none text-3xl md:text-5xl lg:text-6xl">
                       Your Next <br/> Purchase Is <br/> <span className="text-blue-500 italic">Ready.</span>
                     </Typography>
                     <Typography className="text-slate-500 text-sm md:text-lg font-medium max-w-sm mb-10 md:mb-12">
                       Split your bill into 3, 6 or 12 easy monthly installments at zero risk to the merchant.
                     </Typography>
                     
                     <Button 
                        fullWidth
                        component={Link}
                        href="/get-started"
                        variant="contained"
                        className="bg-white hover:bg-blue-600 hover:text-white text-slate-900 py-4 md:py-5 rounded-2xl font-black lowercase text-base md:text-xl transition-all shadow-xl shadow-blue-600/10"
                        sx={{ textTransform: 'none' }}
                        endIcon={<ArrowForwardRounded />}
                     >
                        Deploy BNPL Credit
                     </Button>
                  </Box>
               </Paper>
               
               {/* Decorative floating stats */}
               <motion.div 
                 animate={{ y: [0, -10, 0] }} 
                 transition={{ duration: 3, repeat: Infinity }}
                 className="absolute -bottom-5 -right-5 md:-right-10 z-20 hidden md:block"
               >
                 <Paper className="p-8 rounded-[32px] border border-slate-100 bg-white shadow-2xl flex items-center gap-6">
                    <Box className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                       <StorefrontRounded />
                    </Box>
                    <Box>
                       <Typography variant="caption" className="font-black uppercase tracking-widest text-slate-400 block opacity-60">Market Adoption</Typography>
                       <Typography className="text-slate-900 font-black text-xl">40% ⬆ <span className="text-xs opacity-50 ml-1">YoY</span></Typography>
                    </Box>
                 </Paper>
               </motion.div>
            </motion.div>
          </Grid>
        </Grid>

        {/* Closing Merchant Box */}
        <Box className="px-4 md:px-0">
           <Paper className="p-8 md:p-24 rounded-[40px] md:rounded-[64px] border border-slate-100 bg-slate-50/50 text-center flex flex-col items-center">
              <Avatar className="w-16 h-16 md:w-20 md:h-20 bg-white text-blue-600 mb-8 md:mb-10 shadow-sm border border-slate-100">
                 <GroupsRounded fontSize="large" />
              </Avatar>
              <Typography variant="h2" className="font-black tracking-tighter mb-6 leading-[1.1] md:leading-none text-slate-900 text-3xl sm:text-4xl md:text-6xl">
                Ready to Scale With <br/> Institutional <span className="text-blue-600 italic">BNPL?</span>
              </Typography>
              <Typography className="text-slate-500 font-medium text-lg md:text-xl max-w-2xl mx-auto mb-12 md:mb-16 leading-relaxed">
                Join the thousands of African consumers and merchants scaling their commerce with our unified split-payment search engine.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" alignItems="center" className="w-full sm:w-auto">
                 <Button 
                    href="/get-started"
                    component={Link}
                    variant="contained"
                    className="bg-slate-900 hover:bg-blue-600 w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 rounded-2xl text-lg md:text-xl font-black lowercase shadow-lg shadow-blue-600/10 transition-all"
                    sx={{ textTransform: 'none' }}
                 >
                    Apply for Checkout Credit
                 </Button>
                 <Button 
                    href="/contact"
                    component={Link}
                    variant="outlined"
                    className="border-slate-200 text-slate-900 hover:bg-slate-50 w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 rounded-2xl text-lg md:text-xl font-black lowercase transition-all"
                    sx={{ textTransform: 'none' }}
                 >
                    Merchant Partnership
                 </Button>
              </Stack>
           </Paper>
        </Box>
      </Box>
    </PageTemplate>
  );
}
