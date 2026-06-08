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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  Chip,
} from '@mui/material';
import {
  SmartToyRounded,
  SendRounded,
  CheckCircleRounded,
  TrendingUpRounded,
  VerifiedUserRounded,
} from '@mui/icons-material';
import { useGetPremiumFeaturesQuery, useGetUserSubscriptionQuery } from '@/lib/redux/api/subscriptionApi';
import { useGetDashboardMetricsQuery } from '@/lib/redux/api/userApi';
import { toast } from 'react-hot-toast';
import PortalShell, { C, F } from '../../components/PortalShell';

export default function AIFinancialAdvisorPage() {
  const { data: featuresData } = useGetPremiumFeaturesQuery();
  const { data: subscriptionData } = useGetUserSubscriptionQuery();
  const { data: metricsData } = useGetDashboardMetricsQuery();

  const features = featuresData?.data;
  const subscription = subscriptionData?.data;
  const metrics = metricsData?.data;
  const isFeatureEnabled = features?.advisorAccess;

  const [messages, setMessages] = useState<Array<{ role: 'user' | 'advisor'; text: string }>>([
    {
      role: 'advisor',
      text: "Hello! I'm your AI Financial Advisor. I can help you make smarter financial decisions, optimize your loan applications, and improve your credit profile. What would you like to know today?",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const advisorInsights = [
    {
      title: 'Optimize Loan Application',
      description: 'Based on your profile, you can qualify for a GH₵15,000 loan at 16.5% interest',
      icon: <TrendingUpRounded />,
    },
    {
      title: 'Improve Credit Score',
      description: 'Reduce credit utilization to 20% to gain +35 points in 3 months',
      icon: <CheckCircleRounded />,
    },
    {
      title: 'Emergency Fund Strategy',
      description: 'Build 6 months of expenses: GH₵18,000 at your current savings rate',
      icon: <VerifiedUserRounded />,
    },
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages([...messages, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'Based on your current financial profile, I recommend focusing on maintaining your excellent payment history while working towards a higher credit score.',
        'Your debt-to-income ratio is excellent at 12%. You could comfortably take on additional credit lines without affecting your score.',
        'Consider diversifying your credit mix by taking on a small personal loan. This would positively impact your credit score.',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [...prev, { role: 'advisor', text: randomResponse }]);
      setIsLoading(false);
    }, 1500);
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
              AI Financial Advisor is a premium feature. Upgrade to {subscription?.name} or higher to get personalized financial guidance.
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
              Upgrade Now
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
              AI Financial Advisor
            </Typography>
            <Typography sx={{ color: C.textSub, fontSize: '16px', mb: 4 }}>
              Get personalized financial guidance powered by advanced AI analysis of your profile and market data.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Chat Panel */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Card
                sx={{
                  border: `1px solid ${C.border}`,
                  borderRadius: '20px',
                  height: '600px',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                {/* Messages */}
                <Box
                  sx={{
                    flex: 1,
                    overflowY: 'auto',
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        display: 'flex',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <Stack
                        direction={msg.role === 'user' ? 'row-reverse' : 'row'}
                        spacing={1.5}
                        sx={{ maxWidth: '80%' }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            background: msg.role === 'user' ? C.blue : `${C.blue}20`,
                            color: msg.role === 'user' ? '#fff' : C.blue,
                            fontSize: '14px',
                            fontWeight: 800,
                          }}
                        >
                          {msg.role === 'user' ? 'Y' : 'AI'}
                        </Avatar>
                        <Box
                          sx={{
                            background:
                              msg.role === 'user'
                                ? C.blue
                                : `${C.border}20`,
                            color:
                              msg.role === 'user'
                                ? '#fff'
                                : C.text,
                            p: 2,
                            borderRadius: '12px',
                            fontSize: '14px',
                            lineHeight: 1.6,
                          }}
                        >
                          {msg.text}
                        </Box>
                      </Stack>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          background: `${C.blue}20`,
                          color: C.blue,
                          fontSize: '14px',
                          fontWeight: 800,
                        }}
                      >
                        AI
                      </Avatar>
                      <Box
                        sx={{
                          background: `${C.border}20`,
                          color: C.text,
                          p: 2,
                          borderRadius: '12px',
                        }}
                      >
                        <Stack direction="row" spacing={0.5}>
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: C.textMuted, animation: 'pulse 1s infinite' }} />
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: C.textMuted, animation: 'pulse 1s infinite 0.2s' }} />
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: C.textMuted, animation: 'pulse 1s infinite 0.4s' }} />
                        </Stack>
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* Input */}
                <Box sx={{ p: 2, borderTop: `1px solid ${C.border}` }}>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      fullWidth
                      placeholder="Ask me anything about your finances..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !isLoading) {
                          handleSendMessage();
                        }
                      }}
                      disabled={isLoading}
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        },
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      variant="contained"
                      sx={{
                        background: C.blue,
                        color: '#fff',
                        borderRadius: '12px',
                        minWidth: '44px',
                        p: 1,
                      }}
                    >
                      <SendRounded />
                    </Button>
                  </Stack>
                </Box>
              </Card>
            </Grid>

            {/* Insights Panel */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={2}>
                <Card sx={{ border: `1px solid ${C.border}`, borderRadius: '16px', p: 2.5 }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <SmartToyRounded sx={{ color: C.blue }} />
                    <Typography sx={{ fontSize: '12px', fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>
                      AI Insights
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontSize: '11px', color: C.textSub, lineHeight: 1.6 }}>
                    Your advisor analyzes market trends, your financial profile, and institutional preferences to provide actionable recommendations.
                  </Typography>
                </Card>

                {advisorInsights.map((insight, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card sx={{ background: `${C.blue}08`, border: `1px solid ${C.border}`, borderRadius: '16px', p: 2.5 }}>
                      <Box sx={{ color: C.blue, mb: 1 }}>{insight.icon}</Box>
                      <Typography sx={{ fontSize: '13px', fontWeight: 800, color: C.text, mb: 0.5 }}>
                        {insight.title}
                      </Typography>
                      <Typography sx={{ fontSize: '12px', color: C.textSub, lineHeight: 1.5 }}>
                        {insight.description}
                      </Typography>
                    </Card>
                  </motion.div>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </PortalShell>
  );
}
