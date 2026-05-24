'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Stack, 
  Avatar
} from '@mui/material';
import { 
  SupportAgentRounded, 
  SendRounded, 
  VerifiedUserRounded,
  ExpandMoreRounded,
  ChatBubbleOutlineRounded,
  LocalPhoneRounded,
  CheckCircleOutlineRounded,
  BusinessRounded,
  OfflineBoltRounded
} from '@mui/icons-material';
import PageTemplate from '../components/PageTemplate';

const FAQS = [
  {
    q: "How do I secure an interest rate reduction on a loan?",
    a: "ResolveBridge uses smart credit profiling. Consistently resolving BNPL and auto-loan repayments ahead of schedule increases your credit score and unlocks tier-1 interest rates from GCB Bank and other lending partners."
  },
  {
    q: "How do vehicle inspectors check my digital insurance cover?",
    a: "Every active insurance policy displays a secure 'QR Cover Badge' in your Customer Portal. Inspectors can scan this code with any mobile device to load your real-time verified coverage parameters from our cryptographic verification hub."
  },
  {
    q: "Can I pre-settle my BNPL balance early?",
    a: "Yes. Early settlements are 100% free of charge and carry no prepayment penalties. Navigate to the repayments tab inside your customer portal to authorize direct MoMo or bank transfers."
  },
  {
    q: "What measures protect my financial and personal data?",
    a: "We deploy bank-grade AES-256 encryption across all data pathways. Transaction authorizations are securely settled via MTN MoMo, Telecel, and AT SWIFT channels with multi-factor authentication (MFA)."
  }
];

export default function ContactSupportPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <PageTemplate 
      title="Resolution" 
      gradientTitle="Support Hub"
      subtitle="Connect with our global operations center. Submit inquiries, check system status, or browse active technical FAQs."
      noCard={true}
    >
      <Box className="pb-32 flex flex-col gap-16 font-sans">
        
        {/* Split Grid Hub: Left (Channels/Telemetry) - Right (Ticket Form) */}
        <Grid container spacing={8} alignItems="stretch">
          
          {/* Left Column: Premium Channels Info Card */}
          <Grid size={{ xs: 12, lg: 5 }} className="flex flex-col gap-6">
            <Paper className="p-8 rounded-[40px] border border-slate-100 bg-white shadow-lg flex-1 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <Box className="relative z-10 flex flex-col gap-8">
                
                {/* SLA Status Indicator */}
                <Box className="inline-flex self-start items-center gap-3 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <Typography className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
                    SLA ACTIVE: ~2m CHAT RESPONSE
                  </Typography>
                </Box>

                <div>
                  <Typography variant="caption" className="text-blue-600 font-black uppercase tracking-[0.25em] block mb-2">Direct Communication</Typography>
                  <Typography variant="h3" className="text-3xl font-black tracking-tight text-slate-900 leading-tight">
                    Instant <span className="text-blue-600 italic">Resolution</span> Gateways.
                  </Typography>
                  <Typography className="text-slate-500 text-sm font-medium mt-3 leading-relaxed">
                    Skip the ticketing queue entirely by using our high-speed communication lines directly.
                  </Typography>
                </div>

                {/* Left Telemetry List */}
                <Stack spacing={4} className="mt-2">
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Avatar className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl">
                      <ChatBubbleOutlineRounded />
                    </Avatar>
                    <Box>
                      <Typography className="font-extrabold text-slate-900 text-sm">Technical Support Email</Typography>
                      <Typography className="text-blue-600 text-xs font-black uppercase tracking-wider mt-0.5">hello@resolvebridge.com</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={3} alignItems="center">
                    <Avatar className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl">
                      <LocalPhoneRounded />
                    </Avatar>
                    <Box>
                      <Typography className="font-extrabold text-slate-900 text-sm">Emergency Support Hotlines</Typography>
                      <Typography className="text-slate-500 text-xs font-semibold mt-0.5">0249709299 / 0246219871</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={3} alignItems="center">
                    <Avatar className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl">
                      <BusinessRounded />
                    </Avatar>
                    <Box>
                      <Typography className="font-extrabold text-slate-900 text-sm">Ghana Regional Headquarters</Typography>
                      <Typography className="text-slate-500 text-xs font-semibold mt-0.5">Accra Digital Center, Ring Road West</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={3} alignItems="center">
                    <Avatar className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl">
                      <OfflineBoltRounded />
                    </Avatar>
                    <Box>
                      <Typography className="font-extrabold text-slate-900 text-sm">System Status Indicators</Typography>
                      <Typography className="text-emerald-500 text-xs font-black uppercase tracking-wider mt-0.5">🟢 All SWIFT Core Nodes Online</Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Box>

              <div className="border-t border-slate-100 pt-6 mt-8 flex items-center gap-3 text-slate-400">
                <VerifiedUserRounded fontSize="small" className="text-blue-600" />
                <Typography variant="caption" className="font-bold uppercase tracking-widest text-[9px] text-slate-400">
                  Fully Encrypted Support Channels
                </Typography>
              </div>
            </Paper>
          </Grid>

          {/* Right Column: Secure Support Ticket Form */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <Paper className="p-8 md:p-12 rounded-[40px] bg-white border border-slate-100 shadow-lg relative overflow-hidden h-full flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
              
              {submitted ? (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12 flex flex-col items-center gap-4 relative z-10"
                >
                  <CheckCircleOutlineRounded sx={{ fontSize: 64, color: '#10b981' }} />
                  <Typography variant="h5" className="font-extrabold text-slate-900">Ticket Submitted Successfully</Typography>
                  <Typography className="text-slate-500 text-sm max-w-sm leading-relaxed mx-auto font-medium">
                    We've routed your inquiry to our central operations desk. A support representative will respond shortly at <b>{formData.email}</b>.
                  </Typography>
                  <Button 
                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}
                    className="mt-6 border border-slate-200 text-slate-700 rounded-xl px-6 py-2.5 font-bold hover:bg-slate-50 lowercase"
                    sx={{ textTransform: 'none' }}
                  >
                    Submit Another Inquiry
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
                  <div>
                    <Typography variant="h4" className="font-black text-slate-900 leading-none mb-3">Submit a Support Ticket</Typography>
                    <Typography className="text-slate-500 text-[12.5px] font-medium">Our team is standing by to resolve any operational roadblocks.</Typography>
                  </div>

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Stack spacing={1}>
                        <Typography className="font-bold text-[9px] uppercase tracking-widest text-slate-400 px-1">Your Name</Typography>
                        <TextField 
                          required
                          fullWidth
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. John Doe"
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
                        <Typography className="font-bold text-[9px] uppercase tracking-widest text-slate-400 px-1">Email Address</Typography>
                        <TextField 
                          required
                          type="email"
                          fullWidth
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. john@example.com"
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
                    <Typography className="font-bold text-[9px] uppercase tracking-widest text-slate-400 px-1">Subject Topic</Typography>
                    <TextField 
                      required
                      fullWidth
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Help verifying DVLA auto cover"
                      variant="outlined"
                      InputProps={{ 
                        className: "rounded-xl text-slate-900",
                        style: { backgroundColor: '#f8fafc' }
                      }}
                      sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#f1f5f9' } }}
                    />
                  </Stack>

                  <Stack spacing={1}>
                    <Typography className="font-bold text-[9px] uppercase tracking-widest text-slate-400 px-1">Detailed Message</Typography>
                    <TextField 
                      required
                      multiline
                      rows={4}
                      fullWidth
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Detail your question or issue here..."
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
                    className="bg-blue-600 hover:bg-blue-700 py-4 rounded-xl text-[14px] font-black tracking-wide text-white transition-all shadow-xl shadow-blue-500/10"
                    sx={{ textTransform: 'none' }}
                    endIcon={<SendRounded />}
                  >
                    Submit Secure Ticket
                  </Button>
                </form>
              )}
            </Paper>
          </Grid>

        </Grid>

        {/* FAQs Accordion Segment - Dedicated Section Below Split Dashboard */}
        <Box className="mt-12">
          <Box className="text-center mb-12">
            <Typography variant="caption" className="text-blue-600 font-black uppercase tracking-[0.3em] block mb-2 text-[10px] md:text-xs">
              Knowledge Base
            </Typography>
            <Typography variant="h2" className="font-black tracking-tighter mb-4 text-3xl md:text-5xl text-slate-900">
              Frequently Asked <span className="text-blue-600 italic">Questions.</span>
            </Typography>
            <Typography className="text-slate-500 font-medium text-base max-w-xl mx-auto px-4">
              Browse immediate structural answers regarding digital insurance tokens, interest rates, and double-entry ledger settlements.
            </Typography>
          </Box>

          <Grid container spacing={3} className="max-w-4xl mx-auto">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <Grid size={{ xs: 12 }} key={idx}>
                  <Paper 
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className={`p-6 rounded-3xl border transition-all cursor-pointer overflow-hidden ${
                      isOpen ? 'border-blue-200 bg-blue-50/20 shadow-md' : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-center gap-4">
                      <Typography className={`font-bold text-[14.5px] ${isOpen ? 'text-blue-600' : 'text-slate-900'}`}>{faq.q}</Typography>
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className={isOpen ? 'text-blue-600' : 'text-slate-400'}>
                        <ExpandMoreRounded />
                      </motion.div>
                    </div>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <Typography className="text-slate-600 text-[13px] leading-relaxed border-t border-slate-100 pt-3 font-medium">
                            {faq.a}
                          </Typography>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>

      </Box>
    </PageTemplate>
  );
}
