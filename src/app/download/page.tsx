'use client';

import { Container, Box, Typography, Button, Stack, Paper } from '@mui/material';
import { 
  Apple as AppleIcon, 
  Android as AndroidIcon, 
  Computer as DesktopIcon,
  ArrowBackRounded as BackIcon,
  InstallMobileRounded as InstallIcon
} from '@mui/icons-material';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { usePWAInstall } from '../hooks/usePWAInstall';

export default function DownloadPage() {
  const { deferredPrompt, handleInstall } = usePWAInstall();
  
  return (
    <Box sx={{ backgroundColor: '#04080f', minHeight: '100vh', pt: '100px', pb: 10 }}>
      <Navbar />
      <Container maxWidth="md">
        <Link href="/" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
          <BackIcon sx={{ fontSize: 20 }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>Back to home</Typography>
        </Link>
        
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" sx={{ 
            color: '#fff', 
            fontWeight: 800, 
            fontSize: { xs: '32px', md: '48px' },
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            mb: 2
          }}>
            Download <span style={{ color: '#10b981' }}>ResolveBridge</span>
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', maxWidth: '600px', mx: 'auto' }}>
            Get Africa's most powerful financial search engine on all your devices.
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          {/* PWA / Web App */}
          <Paper sx={{ 
            flex: 1, 
            p: 4, 
            backgroundColor: 'rgba(255,255,255,0.03)', 
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '24px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <Box sx={{ 
              width: 64, 
              height: 64, 
              borderRadius: '20px', 
              backgroundColor: 'rgba(16, 185, 129, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mx: 'auto',
              mb: 3
            }}>
              <InstallIcon sx={{ color: '#10b981', fontSize: 32 }} />
            </Box>
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>Web App (PWA)</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', mb: 3 }}>
              Fast, light, and always up to date. Works on any smartphone or computer.
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2, textAlign: 'left', fontSize: '13px' }}>
              <strong>How to install:</strong><br />
              1. Open this site in Chrome, Safari, or Edge.<br />
              2. Look for the "Install" button in the menu or browser bar.<br />
              3. On iOS: Tap Share → Add to Home Screen.
            </Typography>
            <Button 
              onClick={handleInstall}
              variant="contained" 
              fullWidth
              sx={{ 
                textTransform: 'none', 
                borderRadius: '12px',
                py: 1.5,
                fontWeight: 700,
                backgroundColor: '#10b981',
                color: '#fff',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                '&:hover': {
                  backgroundColor: '#059669',
                }
              }}
            >
              Install Now Button
            </Button>
          </Paper>

          {/* Android */}
          <Paper sx={{ 
            flex: 1, 
            p: 4, 
            backgroundColor: 'rgba(255,255,255,0.03)', 
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '24px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <Box sx={{ 
              width: 64, 
              height: 64, 
              borderRadius: '20px', 
              backgroundColor: 'rgba(255,255,255,0.05)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mx: 'auto',
              mb: 3
            }}>
              <AndroidIcon sx={{ color: '#fff', fontSize: 32 }} />
            </Box>
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>Android</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', mb: 3 }}>
              Full experience with push notifications and offline support.
            </Typography>
            <Button 
              disabled
              variant="contained" 
              fullWidth
              sx={{ 
                textTransform: 'none', 
                borderRadius: '12px',
                py: 1.5,
                fontWeight: 700,
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.4)'
              }}
            >
              Coming Soon to Play Store
            </Button>
          </Paper>

          {/* iOS */}
          <Paper sx={{ 
            flex: 1, 
            p: 4, 
            backgroundColor: 'rgba(255,255,255,0.03)', 
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '24px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <Box sx={{ 
              width: 64, 
              height: 64, 
              borderRadius: '20px', 
              backgroundColor: 'rgba(255,255,255,0.05)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mx: 'auto',
              mb: 3
            }}>
              <AppleIcon sx={{ color: '#fff', fontSize: 32 }} />
            </Box>
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>iOS</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', mb: 3 }}>
              Native iOS application for iPhone and iPad.
            </Typography>
            <Button 
              disabled
              variant="contained" 
              fullWidth
              sx={{ 
                textTransform: 'none', 
                borderRadius: '12px',
                py: 1.5,
                fontWeight: 700,
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.4)'
              }}
            >
              Coming Soon to App Store
            </Button>
          </Paper>
        </Stack>

        <Box sx={{ mt: 8, textAlign: 'center', p: 4, borderRadius: '24px', backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
          <Typography sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>Need help?</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>Our support team is available 24/7 to help you get started.</Typography>
          <Button component={Link} href="/contact" sx={{ color: '#10b981', textTransform: 'none', fontWeight: 700 }}>Contact Support</Button>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}
