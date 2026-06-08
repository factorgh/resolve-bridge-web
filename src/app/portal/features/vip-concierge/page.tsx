'use client';

import { useState } from 'react';
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
  TextField,
  Avatar,
  Paper,
} from '@mui/material';
import {
  EmojiEventsRounded,
  SupportAgentRounded,
  ChatRounded,
  PhoneInTalkRounded,
  SendRounded,
} from '@mui/icons-material';
import { useGetPremiumFeaturesQuery, useGetUserSubscriptionQuery } from '@/lib/redux/api/subscriptionApi';
import { toast } from 'react-hot-toast';
import PortalShell, { C, F } from '../../components/PortalShell';

export default function VIPConciergeSupportPage() {
  const { data: featuresData } = useGetPremiumFeaturesQuery();
  const { data: subscriptionData } = useGetUserSubscriptionQuery();

  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'concierge', text: 'Hello! I am your dedicated Concierge Manager. How can I assist you with your premium services today?' },
  ]);

  const features = featuresData?.data;
  const subscription = subscriptionData?.data;
  const isFeatureEnabled = features?.vipConcierge;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { sender: 'user', text: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'concierge', text: 'Thank you for your message. I am actively looking into this and will update you shortly, or we can jump on a phone call if you prefer!' },
      ]);
    }, 1000);
  };

  const handleCallbackRequest = () => {
    toast.success('Callback requested! Your VIP Concierge Manager will call you within 15 minutes.');
  };

  if (!isFeatureEnabled) {
    return (
      <PortalShell>
        <Box sx={{ py: 8, px: { xs: 2, md: 4 }, textAlign: 'center' }}>
          <Container maxWidth="sm">
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 2, color: C.text }}>
              Feature Locked
            </Typography>
            <Typography sx={{ color: C.textSub, mb: 4 }}>
              VIP Concierge Support is included with the Elite subscription plan. Upgrade your plan to access this premium feature.
            </Typography>
            <Button
              href="/portal/subscriptions"
              variant="contained"
              sx={{
                background: C.blue,
                color: '#fff',
                borderRadius: '12px',
                px: 6,
                py: 1.5,
                fontWeight: 800,
                textTransform: 'none',
              }}
            >
              View Plans
            </Button>
          </Container>
        </Box>
      </PortalShell>
    );
  }

  return (
    <PortalShell>
      <Box sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, md: 4 } }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '28px', md: '48px' },
                fontWeight: 900,
                color: C.text,
                mb: 2,
                fontFamily: F.serif,
              }}
            >
              VIP Concierge Support
            </Typography>
            <Typography sx={{ color: C.textSub, fontSize: '16px', mb: 4 }}>
              Experience high-touch, executive-level priority assistance. Connect directly to your dedicated financial coordinator and underwriting team.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Dedicated Manager Info */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ border: `1px solid ${C.border}`, borderRadius: '20px', p: 4, textAlign: 'center', background: C.surface }}>
                <Typography sx={{ fontSize: '12px', color: '#d946ef', fontWeight: 800, mb: 3, textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <EmojiEventsRounded /> Dedicated Concierge
                </Typography>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    mx: 'auto',
                    mb: 3,
                    border: '3px solid #d946ef',
                    boxShadow: '0 8px 24px rgba(217, 70, 239, 0.25)',
                    background: '#d946ef10',
                    color: '#d946ef',
                    fontSize: '36px',
                    fontWeight: 900,
                  }}
                >
                  MS
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 900, color: C.text, mb: 0.5 }}>
                  Marcus Sterling
                </Typography>
                <Typography sx={{ fontSize: '13px', color: C.textSub, mb: 4 }}>
                  Executive Account Director
                </Typography>

                <Stack spacing={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleCallbackRequest}
                    startIcon={<PhoneInTalkRounded />}
                    sx={{
                      background: `linear-gradient(135deg, ${C.blue} 0%, #d946ef 100%)`,
                      color: '#fff',
                      borderRadius: '12px',
                      py: 1.5,
                      fontWeight: 800,
                      textTransform: 'none',
                      boxShadow: 'none',
                    }}
                  >
                    Request 15-Min Callback
                  </Button>
                </Stack>
              </Card>
            </Grid>

            {/* Live Chat Console */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Card sx={{ border: `1px solid ${C.border}`, borderRadius: '20px', p: 4, height: '500px', display: 'flex', flexDirection: 'column', background: C.surface }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ pb: 3, borderBottom: `1px solid ${C.border}`, mb: 3 }}>
                  <Box sx={{ p: 1, background: '#d946ef15', color: '#d946ef', borderRadius: '10px' }}>
                    <ChatRounded />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 800, color: C.text }}>Live VIP Chat</Typography>
                    <Typography sx={{ fontSize: '12px', color: '#10b981', fontWeight: 800 }}>● Online & Ready</Typography>
                  </Box>
                </Stack>

                {/* Messages Panel */}
                <Box sx={{ flex: 1, overflowY: 'auto', mb: 3, pr: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {chatMessages.map((msg, i) => (
                    <Box
                      key={i}
                      sx={{
                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '70%',
                      }}
                    >
                      <Paper
                        sx={{
                          p: 2,
                          borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                          background: msg.sender === 'user' ? '#d946ef10' : `${C.blue}08`,
                          border: `1px solid ${msg.sender === 'user' ? '#d946ef20' : C.border}`,
                          boxShadow: 'none',
                        }}
                      >
                        <Typography sx={{ fontSize: '14px', color: C.text, lineHeight: 1.5 }}>{msg.text}</Typography>
                      </Paper>
                    </Box>
                  ))}
                </Box>

                {/* Chat Form */}
                <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    placeholder="Type your premium inquiry here..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      background: '#d946ef',
                      color: '#fff',
                      borderRadius: '12px',
                      px: 4,
                      fontWeight: 800,
                      boxShadow: 'none',
                      '&:hover': { background: '#c026d3' },
                    }}
                  >
                    <SendRounded />
                  </Button>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </PortalShell>
  );
}
