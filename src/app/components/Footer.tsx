'use client';

import Link from 'next/link';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Stack, 
  IconButton, 
  Divider 
} from '@mui/material';
import { 
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  MailRounded,
  PhoneRounded,
  RoomRounded
} from '@mui/icons-material';

export default function Footer() {
  return (
    <Box component="footer" className="bg-slate-50 border-t border-slate-100 pt-20 pb-12">
      <Container maxWidth="lg">
        <Grid container spacing={8}>
          {/* Brand Column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={4}>
              <Link href="/" className="flex items-center gap-3">
                <Box className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <img src="/resolve_icon.png" alt="Resolve" className="w-6 h-6" />
                </Box>
                <Typography variant="h5" className="font-black text-slate-900 tracking-tight">
                  Resolve<span className="text-blue-600 italic">Bridge</span>
                </Typography>
              </Link>
              <Typography className="text-slate-400 font-medium leading-relaxed max-w-sm">
                The most comprehensive institutional financial engine across the African continent. Bridging the credit gap through technology and direct-to-bank transparency.
              </Typography>
              <Stack direction="row" spacing={2}>
                {[LinkedInIcon, TwitterIcon, FacebookIcon, InstagramIcon].map((Icon, i) => (
                  <IconButton key={i} className="bg-white border border-slate-100 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm">
                    <Icon fontSize="small" />
                  </IconButton>
                ))}
              </Stack>
            </Stack>
          </Grid>

          {/* Links Columns */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="subtitle2" className="font-black text-slate-900 uppercase tracking-widest mb-6">Marketplace</Typography>
                <Stack spacing={2}>
                  <FooterLink href="/loans">Credit & Loans</FooterLink>
                  <FooterLink href="/bnpl">BNPL Plans</FooterLink>
                  <FooterLink href="/insurance">Insurance Hub</FooterLink>
                  <FooterLink href="/resolve-vehicles">Resolve Vehicles</FooterLink>
                </Stack>
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography variant="subtitle2" className="font-black text-slate-900 uppercase tracking-widest mb-6">Organization</Typography>
                <Stack spacing={2}>
                  <FooterLink href="/about">Our Mission</FooterLink>
                  <FooterLink href="/features">Integrations</FooterLink>
                  <FooterLink href="/contact">Join Network</FooterLink>
                  <FooterLink href="/privacy">Legal Policy</FooterLink>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="subtitle2" className="font-black text-slate-900 uppercase tracking-widest mb-6">Contact Hub</Typography>
                <Stack spacing={3}>
                  <Box className="flex items-start gap-4 text-slate-400">
                    <MailRounded fontSize="small" className="mt-1" />
                    <Box>
                      <Typography variant="caption" className="font-black uppercase text-slate-300 block">General Inquiry</Typography>
                      <Typography className="font-bold text-slate-900 text-sm">support@resolvebridge.com</Typography>
                    </Box>
                  </Box>
                  <Box className="flex items-start gap-4 text-slate-400">
                    <RoomRounded fontSize="small" className="mt-1" />
                    <Box>
                      <Typography variant="caption" className="font-black uppercase text-slate-300 block">Regional Office</Typography>
                      <Typography className="font-bold text-slate-900 text-sm">Airport City Business Park,<br />Accra, Ghana</Typography>
                    </Box>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider className="my-12 border-slate-200" />

        <Box className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Typography variant="caption" className="text-slate-400 font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} ResolveBridge Global Financial Engine. All Institutional Rights Reserved.
          </Typography>
          <Stack direction="row" spacing={4}>
            <Link href="/privacy" className="text-[10px] font-black uppercase text-slate-300 hover:text-blue-600 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-[10px] font-black uppercase text-slate-300 hover:text-blue-600 transition-colors">Terms of Service</Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="text-slate-400 hover:text-blue-600 font-medium text-sm transition-all hover:translate-x-1 inline-block"
    >
      {children}
    </Link>
  );
}
