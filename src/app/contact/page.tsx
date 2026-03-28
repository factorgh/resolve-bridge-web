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
  MenuItem,
  InputAdornment
} from '@mui/material';
import { 
  EmailRounded, 
  PhoneRounded, 
  PlaceRounded, 
  CheckCircleRounded,
  VerifiedUserRounded,
  SendRounded,
  PublicRounded,
  WorkRounded,
  SupportAgentRounded,
  BusinessRounded
} from '@mui/icons-material';
import PageTemplate from '../components/PageTemplate';

const contactOptions = [
  {
    icon: <EmailRounded />,
    title: "Email Architecture",
    description: "Direct line to our technical and account teams.",
    value: "hello@resolvebridge.com"
  },
  {
    icon: <PhoneRounded />,
    title: "Voice Support",
    description: "Immediate assistance during market hours.",
    value: "+233 555 123 456"
  },
  {
    icon: <PlaceRounded />,
    title: "Regional HQ",
    description: "Accra Digital Center, Ghana.",
    value: "Visit Workspace"
  }
];

export default function ContactPage() {
  return (
    <PageTemplate 
      title="Contact Our" 
      gradientTitle="Architects"
      subtitle="Experience the pinnacle of fintech support. Our dedicated team is ready to assist you in scaling your financial footprint across the continent."
      noCard={true}
    >
      <Box className="pb-32 flex flex-col gap-32">
        
        {/* Contact Split */}
        <Grid container spacing={12} alignItems="flex-start">
          
          <Grid size={{ xs: 12, lg: 5 }}>
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-12"
            >
               <Box>
                  <Typography variant="caption" className="text-blue-600 font-black uppercase tracking-[0.3em] block mb-4">Global Relations</Typography>
                  <Typography variant="h2" className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] mb-8 text-slate-900">Talk to the <br/> <span className="text-blue-600 italic">Bridge.</span></Typography>
                  <Typography className="text-slate-500 text-lg font-medium leading-relaxed">Whether you're a merchant looking to integrate our APIs or an individual seeking the best financial products, we're here to facilitate the connection.</Typography>
               </Box>

               <Stack spacing={3}>
                  <Stack direction="row" spacing={2} alignItems="center">
                     <CheckCircleRounded className="text-emerald-500" fontSize="small" />
                     <Typography variant="caption" className="font-black uppercase tracking-widest text-slate-400">Average response time: 2 hours</Typography>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                     <CheckCircleRounded className="text-emerald-500" fontSize="small" />
                     <Typography variant="caption" className="font-black uppercase tracking-widest text-slate-400">24/7 Priority support for SDK partners</Typography>
                  </Stack>
               </Stack>

               <Stack spacing={3}>
                  {contactOptions.map((option, idx) => (
                    <Paper key={idx} className="p-8 rounded-[32px] border border-slate-100 bg-white hover:bg-slate-50 transition-all group shadow-sm flex items-center gap-6">
                      <Box className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                         {option.icon}
                      </Box>
                      <Box>
                         <Typography className="font-black text-slate-900 mb-1">{option.title}</Typography>
                         <Typography variant="caption" className="text-slate-500 font-medium block mb-2">{option.description}</Typography>
                         <Typography variant="caption" className="text-blue-600 font-black uppercase tracking-widest text-[10px]">{option.value}</Typography>
                      </Box>
                    </Paper>
                  ))}
               </Stack>
            </motion.div>
          </Grid>

          {/* Contact Form */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
               <Paper className="p-8 md:p-16 rounded-[48px] bg-white border border-slate-100 shadow-2xl">
                  <Typography variant="h4" className="font-black tracking-tighter mb-12 text-slate-900 leading-none">Send Us a <span className="text-blue-600 italic">Secure</span> Message</Typography>
                  
                  <form className="flex flex-col gap-8">
                     <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                           <Stack spacing={1}>
                             <Typography variant="caption" className="font-black uppercase tracking-widest text-slate-400 text-[10px] px-1">Full Name</Typography>
                             <TextField 
                               fullWidth
                               placeholder="John Doe"
                               variant="outlined"
                               InputProps={{ className: "rounded-2xl bg-slate-50/50" }}
                               sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#f1f5f9' } }}
                             />
                           </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                           <Stack spacing={1}>
                             <Typography variant="caption" className="font-black uppercase tracking-widest text-slate-400 text-[10px] px-1">Email Address</Typography>
                             <TextField 
                               fullWidth
                               placeholder="john@example.com"
                               variant="outlined"
                               InputProps={{ className: "rounded-2xl bg-slate-50/50" }}
                               sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#f1f5f9' } }}
                             />
                           </Stack>
                        </Grid>
                     </Grid>

                     <Stack spacing={1}>
                        <Typography variant="caption" className="font-black uppercase tracking-widest text-slate-400 text-[10px] px-1">Inquiry Type</Typography>
                        <TextField 
                          select
                          fullWidth
                          defaultValue="Merchant Integration (API/SDK)"
                          variant="outlined"
                          InputProps={{ className: "rounded-2xl bg-slate-50/50 font-black text-xs uppercase tracking-widest" }}
                          sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#f1f5f9' } }}
                        >
                           <MenuItem value="Merchant Integration (API/SDK)">Merchant Integration (API/SDK)</MenuItem>
                           <MenuItem value="Automotive Financing">Automotive Financing</MenuItem>
                           <MenuItem value="Insurance Marketplace">Insurance Marketplace</MenuItem>
                           <MenuItem value="Retail BNPL Setup">Retail BNPL Setup</MenuItem>
                           <MenuItem value="General Support">General Support</MenuItem>
                        </TextField>
                     </Stack>

                     <Stack spacing={1}>
                        <Typography variant="caption" className="font-black uppercase tracking-widest text-slate-400 text-[10px] px-1">Your Message</Typography>
                        <TextField 
                          multiline
                          rows={6}
                          fullWidth
                          placeholder="Tell us how we can scale your vision..."
                          variant="outlined"
                          InputProps={{ className: "rounded-3xl bg-slate-50/50" }}
                          sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#f1f5f9' } }}
                        />
                     </Stack>

                     <Button 
                        variant="contained" 
                        fullWidth
                        className="bg-slate-900 hover:bg-blue-600 py-5 rounded-2xl text-xl font-black lowercase transition-all shadow-xl shadow-blue-600/10"
                        sx={{ textTransform: 'none' }}
                        endIcon={<SendRounded />}
                     >
                        Transmit Inquiry
                     </Button>

                     <Box className="text-center mt-2 flex items-center justify-center gap-3 opacity-30">
                        <VerifiedUserRounded fontSize="small" className="text-blue-600" />
                        <Typography variant="caption" className="font-black uppercase tracking-widest text-[8px] text-slate-900">End-to-End Encryption Enabled</Typography>
                     </Box>
                  </form>
               </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Global Presence Hub */}
        <Box>
           <Paper className="p-12 md:p-24 rounded-[64px] border border-slate-100 bg-slate-50/50 text-center flex flex-col items-center">
              <Avatar className="w-20 h-20 bg-white text-blue-600 mb-10 shadow-sm border border-slate-100">
                 <PublicRounded fontSize="large" />
              </Avatar>
              <Typography variant="h2" className="font-black tracking-tighter mb-6 leading-none text-slate-900">
                Market <span className="text-blue-600 italic">Accessibility.</span>
              </Typography>
              <Typography className="text-slate-500 font-medium text-xl max-w-2xl mx-auto mb-16 leading-relaxed">
                Our advisors are stationed across major financial hubs to ensure localized support for enterprise partners.
              </Typography>
              
              <Grid container spacing={4} className="max-w-4xl mx-auto">
                 {["Ghana", "Nigeria", "Kenya", "South Africa"].map((loc, idx) => (
                   <Grid size={{ xs: 6, md: 3 }} key={idx}>
                      <Paper className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-blue-400 transition-colors">
                        <Typography variant="caption" className="font-black uppercase tracking-widest text-[#020617]">{loc}</Typography>
                      </Paper>
                   </Grid>
                 ))}
              </Grid>
           </Paper>
        </Box>
      </Box>
    </PageTemplate>
  );
}
