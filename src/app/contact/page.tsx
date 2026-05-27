'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Grid, 
  Typography, 
  Stack, 
  Button, 
  Paper,
  Avatar,
  TextField,
  MenuItem
} from '@mui/material';
import { 
  EmailRounded, 
  PhoneRounded, 
  PlaceRounded, 
  CheckCircleRounded,
  VerifiedUserRounded,
  SendRounded,
  PublicRounded
} from '@mui/icons-material';
import PageTemplate from '../components/PageTemplate';

const contactOptions = [
  {
    icon: <EmailRounded fontSize="large" />,
    title: "Email Architecture",
    description: "Direct line to our technical and account teams.",
    value: "leslie.gyamfi@resolvebridge.com",
    href: "mailto:leslie.gyamfi@resolvebridge.com",
    avatarBg: "bg-blue-50 text-blue-600"
  },
  {
    icon: <PhoneRounded fontSize="large" />,
    title: "Voice Support",
    description: "Immediate assistance during market hours.",
    value: "0249709299 / 0246219871",
    href: "tel:0249709299",
    avatarBg: "bg-purple-50 text-purple-600"
  },
  {
    icon: <PlaceRounded fontSize="large" />,
    title: "Regional HQ",
    description: "Accra Digital Center, Ghana.",
    value: "Accra, Ring Road West",
    href: "#global-nodes",
    avatarBg: "bg-emerald-50 text-emerald-600"
  }
];

const globalNodes = [
  {
    city: "Accra",
    country: "Ghana",
    role: "Global Headquarters",
    status: "Primary Core Active",
    latency: "8ms",
    sla: "99.99%",
    timezone: "GMT +0"
  },
  {
    city: "Lagos",
    country: "Nigeria",
    role: "West Africa Hub",
    status: "Edge Node Active",
    latency: "14ms",
    sla: "99.98%",
    timezone: "GMT +1"
  },
  {
    city: "Nairobi",
    country: "Kenya",
    role: "East Africa Sync",
    status: "Routing Active",
    latency: "22ms",
    sla: "99.95%",
    timezone: "GMT +3"
  },
  {
    city: "Johannesburg",
    country: "South Africa",
    role: "Southern Hub",
    status: "Secondary Core",
    latency: "28ms",
    sla: "99.97%",
    timezone: "GMT +2"
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', type: 'Merchant Integration (API/SDK)', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    const subjectLine = `Inquiry: ${formData.type}`;
    const emailBody = `Hi Leslie,\n\n${formData.message}\n\n---\nSender Details:\nName: ${formData.name}\nEmail: ${formData.email}`;
    const mailtoUrl = `mailto:leslie.gyamfi@resolvebridge.com?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(emailBody)}`;

    window.location.href = mailtoUrl;
    setSubmitted(true);
  };

  return (
    <PageTemplate 
      title="Contact Our" 
      gradientTitle="Architects"
      subtitle="Experience the pinnacle of fintech support. Connect directly with our core engineering and operations desk to scale your financial footprint."
      noCard={true}
    >
      <Box className="pb-24 flex flex-col gap-12 md:gap-20 px-4 md:px-0">
        
        {/* Balanced Split Grid Section */}
        <Grid container spacing={6} alignItems="stretch">
          
          {/* Left Column: Channels List */}
          <Grid size={{ xs: 12, lg: 5 }} className="flex flex-col gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-8 flex-1"
            >
               <Box>
                  <Typography variant="caption" className="text-blue-600 font-black uppercase tracking-[0.25em] block mb-2 text-xs">Global Relations</Typography>
                  <Typography variant="h2" className="text-4xl md:text-5xl font-black tracking-tighter leading-tight mb-6 text-slate-900">
                    Talk to the <br/> <span className="text-blue-600 italic">Ecosystem Architects.</span>
                  </Typography>
                  <Typography className="text-slate-500 text-sm font-medium leading-relaxed">
                    Whether you are an enterprise partner scaling API pipelines or an individual navigating credit approvals, our dedicated pathways guarantee instant high-fidelity feedback.
                  </Typography>
               </Box>

               <Stack spacing={3.5}>
                  {contactOptions.map((option, idx) => (
                    <motion.a 
                      href={option.href}
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="p-8 rounded-[32px] md:rounded-[40px] border border-slate-100 bg-white shadow-sm flex items-center gap-6 group hover:no-underline"
                    >
                      <Avatar className={`w-16 h-16 rounded-[20px] md:rounded-[28px] flex-shrink-0 shadow-sm transition-transform group-hover:scale-110 ${option.avatarBg}`}>
                         {option.icon}
                      </Avatar>
                      <Box>
                         <Typography className="font-black text-slate-900 mb-1">{option.title}</Typography>
                         <Typography variant="caption" className="text-slate-500 font-medium block mb-2 leading-relaxed">{option.description}</Typography>
                         <Typography variant="caption" className="text-blue-600 font-black uppercase tracking-widest text-[10px]">{option.value}</Typography>
                      </Box>
                    </motion.a>
                  ))}
               </Stack>

               <Stack spacing={3} className="p-6 rounded-[28px] bg-slate-50 border border-slate-100 flex flex-col gap-1">
                  <Stack direction="row" spacing={2} alignItems="center">
                     <CheckCircleRounded className="text-emerald-500 w-5 h-5" />
                     <Typography className="text-slate-700 font-bold text-xs uppercase tracking-wider">Average response time: 2 hours</Typography>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                     <CheckCircleRounded className="text-emerald-500 w-5 h-5" />
                     <Typography className="text-slate-700 font-bold text-xs uppercase tracking-wider">24/7 Priority support for SDK partners</Typography>
                  </Stack>
               </Stack>
            </motion.div>
          </Grid>

          {/* Right Column: Stateful Contact Form */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="h-full"
            >
               <Paper className="p-8 md:p-10 rounded-[32px] md:rounded-[40px] bg-white border border-slate-100 shadow-sm relative overflow-hidden h-full flex flex-col justify-center">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                  
                  {submitted ? (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center py-10 flex flex-col items-center gap-4 relative z-10"
                    >
                      <Avatar className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[20px] shadow-sm flex items-center justify-center">
                        <CheckCircleRounded sx={{ fontSize: 36 }} />
                      </Avatar>
                      <Typography variant="h4" className="font-black text-slate-900 tracking-tighter text-2xl">Email Client Launched</Typography>
                      <Typography className="text-slate-500 text-sm max-w-sm leading-relaxed mx-auto font-medium">
                        Your email client has been launched to send your inquiry directly to Leslie Gyamfi at <b>leslie.gyamfi@resolvebridge.com</b>.
                      </Typography>
                      <Button 
                        onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', type: 'Merchant Integration (API/SDK)', message: '' }); }}
                        variant="outlined"
                        className="mt-4 border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-slate-55 rounded-xl px-6 py-2.5 font-bold text-xs normal-case"
                        sx={{ textTransform: 'none' }}
                      >
                        Send Another Inquiry
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
                       <Typography variant="h4" className="font-black tracking-tighter mb-4 text-slate-900 leading-none text-2xl md:text-3xl">Send Us a <span className="text-blue-600 italic">Secure</span> Message</Typography>
                       
                       <Grid container spacing={3}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                             <Stack spacing={1}>
                               <Typography variant="caption" className="font-black uppercase tracking-widest text-slate-400 text-[10px] px-1">Full Name</Typography>
                               <TextField 
                                 required
                                 fullWidth
                                 value={formData.name}
                                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                 placeholder="John Doe"
                                 variant="outlined"
                                 InputProps={{ 
                                   className: "rounded-xl text-slate-900",
                                   style: { backgroundColor: '#f8fafc' }
                                 }}
                                 sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#f1f5f9' } }}
                               />
                             </Stack>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                             <Stack spacing={1}>
                               <Typography variant="caption" className="font-black uppercase tracking-widest text-slate-400 text-[10px] px-1">Email Address</Typography>
                               <TextField 
                                 required
                                 type="email"
                                 fullWidth
                                 value={formData.email}
                                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                 placeholder="john@example.com"
                                 variant="outlined"
                                 InputProps={{ 
                                   className: "rounded-xl text-slate-900",
                                   style: { backgroundColor: '#f8fafc' }
                                 }}
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
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            variant="outlined"
                            InputProps={{ 
                              className: "rounded-xl text-slate-900 font-extrabold text-xs uppercase tracking-wider",
                              style: { backgroundColor: '#f8fafc' }
                            }}
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
                            required
                            multiline
                            rows={6}
                            fullWidth
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Tell us how we can scale your vision..."
                            variant="outlined"
                            InputProps={{ 
                              className: "rounded-xl text-slate-900",
                              style: { backgroundColor: '#f8fafc' }
                            }}
                            sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#f1f5f9' } }}
                          />
                       </Stack>

                       <Button 
                          type="submit"
                          variant="contained" 
                          fullWidth
                          className="bg-slate-900 hover:bg-blue-600 py-4.5 rounded-2xl text-[16px] font-black lowercase transition-all shadow-xl shadow-blue-600/10 text-white"
                          sx={{ textTransform: 'none' }}
                          endIcon={<SendRounded />}
                       >
                          Transmit Inquiry
                       </Button>

                       <Box className="text-center mt-2 flex items-center justify-center gap-3 opacity-30">
                          <VerifiedUserRounded fontSize="small" className="text-blue-600" />
                          <Typography variant="caption" className="font-black uppercase tracking-widest text-[8px] text-slate-900">Direct Email Pathway Enabled</Typography>
                       </Box>
                    </form>
                  )}
               </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Global Presence Telemetry Console */}
        <Box id="global-nodes" className="mt-16 md:mt-20">
           <Paper className="p-12 md:p-20 border border-slate-100 bg-slate-50/50 rounded-[48px] md:rounded-[64px] text-center flex flex-col items-center">
              <Avatar className="w-16 h-16 bg-white text-blue-600 mb-8 border border-slate-100 shadow-sm">
                 <PublicRounded fontSize="large" />
              </Avatar>
              
              <Typography variant="caption" className="text-blue-600 font-black uppercase tracking-[0.3em] block mb-2 text-xs">
                Ecosystem Infrastructure
              </Typography>
              <Typography variant="h2" className="font-black tracking-tighter mb-4 leading-none text-slate-900 text-3xl md:text-5xl">
                Global Telemetry <span className="text-blue-600 italic">Nodes.</span>
              </Typography>
              <Typography className="text-slate-500 font-medium text-lg max-w-xl mx-auto mb-16 text-center leading-relaxed">
                Our operations nodes scale across key regional gateways to ensure reliable API routing and localized institutional support.
              </Typography>
              
              <Grid container spacing={4} className="max-w-5xl mx-auto w-full">
                 {globalNodes.map((node, idx) => (
                   <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                      <motion.div 
                        whileHover={{ y: -8 }}
                        className="p-6 bg-white rounded-3xl border border-slate-100/80 shadow-sm transition-all duration-300 flex flex-col gap-4 relative overflow-hidden text-left"
                      >
                        <Box className="flex justify-between items-start">
                          <Box>
                            <Typography className="font-black text-slate-950 text-base leading-tight">{node.city}</Typography>
                            <Typography variant="caption" className="text-slate-400 font-extrabold uppercase tracking-widest text-[8px]">{node.country}</Typography>
                          </Box>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mt-1" />
                        </Box>

                        <hr className="border-slate-100" />

                        <Box className="flex flex-col gap-1.5">
                          <Box className="flex justify-between items-center text-[10.5px]">
                            <span className="text-slate-400 font-bold uppercase tracking-wider text-[8px]">Role:</span>
                            <span className="text-slate-700 font-extrabold">{node.role}</span>
                          </Box>
                          <Box className="flex justify-between items-center text-[10.5px]">
                            <span className="text-slate-400 font-bold uppercase tracking-wider text-[8px]">Uptime:</span>
                            <span className="text-slate-700 font-extrabold">{node.sla}</span>
                          </Box>
                          <Box className="flex justify-between items-center text-[10.5px]">
                            <span className="text-slate-400 font-bold uppercase tracking-wider text-[8px]">Latency:</span>
                            <span className="text-emerald-600 font-black">{node.latency}</span>
                          </Box>
                          <Box className="flex justify-between items-center text-[10.5px]">
                            <span className="text-slate-400 font-bold uppercase tracking-wider text-[8px]">Zone:</span>
                            <span className="text-slate-500 font-extrabold">{node.timezone}</span>
                          </Box>
                        </Box>
                      </motion.div>
                   </Grid>
                 ))}
              </Grid>
           </Paper>
        </Box>
      </Box>
    </PageTemplate>
  );
}
