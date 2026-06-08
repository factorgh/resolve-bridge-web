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
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  TrendingUpRounded,
  TimelineRounded,
  NotificationsActiveRounded,
  CheckCircleRounded,
  ArrowUpwardRounded,
  ArrowDownwardRounded,
} from '@mui/icons-material';
import { useGetPremiumFeaturesQuery, useGetUserSubscriptionQuery } from '@/lib/redux/api/subscriptionApi';
import { useGetDashboardMetricsQuery } from '@/lib/redux/api/userApi';
import { toast } from 'react-hot-toast';
import PortalShell, { C, F } from '../../components/PortalShell';

export default function CreditMonitoringPage() {
  const { data: featuresData } = useGetPremiumFeaturesQuery();
  const { data: subscriptionData } = useGetUserSubscriptionQuery();
  const { data: metricsData } = useGetDashboardMetricsQuery();
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y'>('30d');

  const features = featuresData?.data;
  const metrics = metricsData?.data;
  const subscription = subscriptionData?.data;
  const isFeatureEnabled = features?.creditMonitoring;

  // Mock credit score history data
  const scoreHistory = [
    { date: 'May 1', score: 680 },
    { date: 'May 8', score: 685 },
    { date: 'May 15', score: 690 },
    { date: 'May 22', score: 695 },
    { date: 'May 28', score: 705 },
  ];

  const creditFactors = [
    {
      name: 'Payment History',
      weight: 35,
      status: 'Excellent',
      color: '#10b981',
      icon: <CheckCircleRounded />,
    },
    {
      name: 'Credit Utilization',
      weight: 30,
      status: 'Good',
      color: '#3b82f6',
      icon: <TimelineRounded />,
    },
    {
      name: 'Length of History',
      weight: 15,
      status: 'Fair',
      color: '#f59e0b',
      icon: <TrendingUpRounded />,
    },
    {
      name: 'Credit Inquiries',
      weight: 10,
      status: 'Excellent',
      color: '#10b981',
      icon: <CheckCircleRounded />,
    },
  ];

  if (!isFeatureEnabled) {
    return (
      <PortalShell>
        <Box sx={{ py: 8, px: { xs: 2, md: 4 }, textAlign: 'center' }}>
          <Container maxWidth="sm">
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 2, color: C.text }}>
              Feature Locked
            </Typography>
            <Typography sx={{ color: C.textSub, mb: 4 }}>
              Credit Score Monitoring is included with {subscription?.name} and above. Upgrade your plan to access this feature.
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
              Credit Score Monitoring
            </Typography>
            <Typography sx={{ color: C.textSub, fontSize: '16px', mb: 4 }}>
              Track your institutional credit score in real-time and get personalized recommendations to improve your financial health.
            </Typography>
          </Box>

          {/* Score Card */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${C.blue}15, #10b98115)`,
                  border: `1px solid ${C.border}`,
                  borderRadius: '20px',
                  p: 4,
                }}
              >
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
                  {/* Score Circle */}
                  <Box
                    sx={{
                      width: 180,
                      height: 180,
                      borderRadius: '50%',
                      background: `conic-gradient(from 180deg at 50% 50%, ${C.blue} 0deg, #10b981 180deg, ${C.blue} 360deg)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      padding: '4px',
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        background: C.surface,
                        borderRadius: '50%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography sx={{ fontSize: '48px', fontWeight: 900, color: C.blue }}>
                        705
                      </Typography>
                      <Typography sx={{ fontSize: '12px', color: C.textMuted, textTransform: 'uppercase', fontWeight: 800 }}>
                        Excellent
                      </Typography>
                    </Box>
                  </Box>

                  {/* Score Details */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ mb: 4 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Typography sx={{ fontWeight: 800, color: C.text }}>Score Trend</Typography>
                        <Chip
                          icon={<ArrowUpwardRounded />}
                          label="+25 pts this month"
                          sx={{
                            background: '#10b98120',
                            color: '#10b981',
                            fontWeight: 800,
                            fontSize: '12px',
                          }}
                        />
                      </Stack>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                        {scoreHistory.map((item, i) => (
                          <Box
                            key={i}
                            sx={{
                              flex: 1,
                              height: Math.max(20, (item.score / 750) * 80),
                              background: C.blue,
                              borderRadius: '4px 4px 0 0',
                              opacity: 0.5 + i * 0.1,
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                    <Typography sx={{ color: C.textSub, fontSize: '14px', mb: 2 }}>
                      Your credit score has improved by 25 points in the last 30 days. Keep maintaining your excellent payment history!
                    </Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Box>
                        <Typography sx={{ fontSize: '12px', color: C.textMuted, fontWeight: 800 }}>LAST CHECKED</Typography>
                        <Typography sx={{ fontSize: '14px', fontWeight: 800, color: C.text }}>May 28, 2026</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '12px', color: C.textMuted, fontWeight: 800 }}>NEXT CHECK</Typography>
                        <Typography sx={{ fontSize: '14px', fontWeight: 800, color: C.text }}>June 4, 2026</Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </Card>
            </Grid>

            {/* Quick Stats */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={2}>
                <Card sx={{ border: `1px solid ${C.border}`, borderRadius: '16px', p: 2.5 }}>
                  <Typography sx={{ fontSize: '11px', color: C.textMuted, fontWeight: 800, mb: 1, textTransform: 'uppercase' }}>
                    Score Range
                  </Typography>
                  <Typography sx={{ fontSize: '20px', fontWeight: 900, color: C.text }}>
                    650 - 850
                  </Typography>
                </Card>
                <Card sx={{ border: `1px solid ${C.border}`, borderRadius: '16px', p: 2.5 }}>
                  <Typography sx={{ fontSize: '11px', color: C.textMuted, fontWeight: 800, mb: 1, textTransform: 'uppercase' }}>
                    Percentile Rank
                  </Typography>
                  <Typography sx={{ fontSize: '20px', fontWeight: 900, color: '#10b981' }}>
                    Top 8%
                  </Typography>
                </Card>
                <Card sx={{ border: `1px solid ${C.border}`, borderRadius: '16px', p: 2.5 }}>
                  <Typography sx={{ fontSize: '11px', color: C.textMuted, fontWeight: 800, mb: 1, textTransform: 'uppercase' }}>
                    Alerts
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <NotificationsActiveRounded sx={{ color: C.blue, fontSize: 18 }} />
                    <Typography sx={{ fontSize: '14px', fontWeight: 800, color: C.text }}>0 New</Typography>
                  </Stack>
                </Card>
              </Stack>
            </Grid>
          </Grid>

          {/* Credit Factors */}
          <Box sx={{ mb: 6 }}>
            <Typography sx={{ fontSize: '20px', fontWeight: 900, color: C.text, mb: 3 }}>
              Factors Affecting Your Score
            </Typography>
            <Grid container spacing={2}>
              {creditFactors.map((factor, i) => (
                <Grid size={{ xs: 12, sm: 6 }} key={i}>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card sx={{ border: `1px solid ${C.border}`, borderRadius: '16px', p: 3 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                        <Box>
                          <Typography sx={{ fontWeight: 800, color: C.text, mb: 0.5 }}>
                            {factor.name}
                          </Typography>
                          <Typography sx={{ fontSize: '13px', fontWeight: 800, color: factor.color }}>
                            {factor.status}
                          </Typography>
                        </Box>
                        <Box sx={{ color: factor.color }}>{factor.icon}</Box>
                      </Stack>
                      <Typography sx={{ fontSize: '11px', color: C.textMuted, mb: 1.5 }}>
                        Weight: {factor.weight}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={factor.weight * 2.5}
                        sx={{
                          height: 8,
                          borderRadius: '4px',
                          background: `${factor.color}20`,
                          '& .MuiLinearProgress-bar': {
                            background: factor.color,
                          },
                        }}
                      />
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Recommendations */}
          <Card sx={{ background: `${C.blue}08`, border: `1px solid ${C.border}`, borderRadius: '20px', p: 4 }}>
            <Typography sx={{ fontSize: '20px', fontWeight: 900, color: C.text, mb: 3 }}>
              Personalized Recommendations
            </Typography>
            <Stack spacing={2}>
              {[
                { icon: <CheckCircleRounded />, text: 'Keep your credit utilization below 30% to maximize your score' },
                { icon: <CheckCircleRounded />, text: 'Your payment history is excellent - maintain these habits' },
                { icon: <CheckCircleRounded />, text: 'Consider applying for new credit to diversify your credit mix' },
              ].map((rec, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ color: '#10b981', pt: 0.5 }}>{rec.icon}</Box>
                  <Typography sx={{ color: C.text, fontSize: '14px', lineHeight: 1.6 }}>
                    {rec.text}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        </Container>
      </Box>
    </PortalShell>
  );
}
