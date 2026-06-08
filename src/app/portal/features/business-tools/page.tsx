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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  AssignmentRounded,
  CheckCircleRounded,
  TrendingUpRounded,
  TrendingDownRounded,
  AccountBalanceWalletRounded,
  StorefrontRounded,
  AnalyticsRounded,
} from '@mui/icons-material';
import { useGetPremiumFeaturesQuery, useGetUserSubscriptionQuery } from '@/lib/redux/api/subscriptionApi';
import PortalShell, { C, F } from '../../components/PortalShell';

export default function BusinessFinanceToolsPage() {
  const { data: featuresData } = useGetPremiumFeaturesQuery();
  const { data: subscriptionData } = useGetUserSubscriptionQuery();
  const [readinessScore, setReadinessScore] = useState(78);

  const features = featuresData?.data;
  const subscription = subscriptionData?.data;
  const isFeatureEnabled = features?.businessTools;

  const cashFlowData = [
    { month: 'Jan', inflow: 12000, outflow: 8500 },
    { month: 'Feb', inflow: 15000, outflow: 9000 },
    { month: 'Mar', inflow: 14000, outflow: 9500 },
    { month: 'Apr', inflow: 18000, outflow: 11000 },
    { month: 'May', inflow: 22000, outflow: 12500 },
  ];

  const SMEFactors = [
    { name: 'Debt-to-Equity Ratio', status: 'Optimal', value: '1.2:1', score: 90, color: '#10b981' },
    { name: 'Monthly Cash Reserves', status: 'Good', value: '2.5 Months', score: 75, color: '#3b82f6' },
    { name: 'Business Credit History', status: 'Excellent', value: '82/100', score: 85, color: '#10b981' },
    { name: 'Annual Revenue Trend', status: 'Fair', value: '+8% YoY', score: 60, color: '#f59e0b' },
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
              Business Finance Tools are included with Premium and above subscription plans. Upgrade your plan to access this feature.
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
              Business Finance Tools
            </Typography>
            <Typography sx={{ color: C.textSub, fontSize: '16px', mb: 4 }}>
              Empower your enterprise with SME loan readiness indicators, detailed cash flow analysis, and capital allocation tools.
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ mb: 6 }}>
            {/* SME Loan Readiness Score */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Card sx={{ border: `1px solid ${C.border}`, borderRadius: '20px', p: 4, height: '100%' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: C.text }}>
                    SME Loan Readiness Score
                  </Typography>
                  <Chip
                    icon={<CheckCircleRounded />}
                    label="Highly Fundable"
                    sx={{ background: '#10b98120', color: '#10b981', fontWeight: 800 }}
                  />
                </Stack>

                <Grid container spacing={4} alignItems="center">
                  <Grid size={{ xs: 12, sm: 5 }} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box
                      sx={{
                        width: 160,
                        height: 160,
                        borderRadius: '50%',
                        background: `conic-gradient(from 180deg at 50% 50%, ${C.blue} 0deg, #10b981 280deg, ${C.border} 300deg)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px',
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
                        <Typography sx={{ fontSize: '42px', fontWeight: 900, color: C.blue }}>
                          {readinessScore}
                        </Typography>
                        <Typography sx={{ fontSize: '11px', color: C.textMuted, fontWeight: 800, textTransform: 'uppercase' }}>
                          Ready (Good)
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 7 }}>
                    <Typography sx={{ color: C.textSub, mb: 3 }}>
                      Your fundability is in the top 15% for similar sized SMEs. Institutional lenders are highly likely to approve fast-track capital matching.
                    </Typography>
                    <Stack spacing={1}>
                      <Typography sx={{ fontSize: '12px', fontWeight: 800, color: C.textMuted }}>RECOMMENDED NEXT STEPS</Typography>
                      <Typography sx={{ fontSize: '13px', color: C.text, display: 'flex', gap: 1 }}>
                        ✅ Keep monthly cash reserves above 2.0x expenses
                      </Typography>
                      <Typography sx={{ fontSize: '13px', color: C.text, display: 'flex', gap: 1 }}>
                        ✅ Link business tax records to boost score to 85+
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Card>
            </Grid>

            {/* Cash Flow Summary */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Card sx={{ border: `1px solid ${C.border}`, borderRadius: '20px', p: 4, height: '100%' }}>
                <Typography variant="h5" sx={{ fontWeight: 900, color: C.text, mb: 3 }}>
                  Monthly Cash Flow Trends
                </Typography>
                <Stack spacing={3}>
                  {cashFlowData.map((item, i) => {
                    const ratio = item.inflow / (item.inflow + item.outflow);
                    return (
                      <Box key={i}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                          <Typography sx={{ fontWeight: 800, color: C.text, fontSize: '13px' }}>{item.month}</Typography>
                          <Stack direction="row" spacing={2}>
                            <Typography sx={{ fontSize: '12px', color: '#10b981', fontWeight: 800 }}>+{item.inflow.toLocaleString()}</Typography>
                            <Typography sx={{ fontSize: '12px', color: '#ef4444', fontWeight: 800 }}>-{item.outflow.toLocaleString()}</Typography>
                          </Stack>
                        </Stack>
                        <Box sx={{ height: 6, background: '#ef444420', borderRadius: 3, overflow: 'hidden', display: 'flex' }}>
                          <Box sx={{ width: `${ratio * 100}%`, background: '#10b981', height: '100%' }} />
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              </Card>
            </Grid>
          </Grid>

          {/* SME Readiness Factors */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, color: C.text, mb: 3 }}>
              SME Loan Readiness Factors
            </Typography>
            <Grid container spacing={3}>
              {SMEFactors.map((factor, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                  <Card sx={{ border: `1px solid ${C.border}`, borderRadius: '16px', p: 3, background: C.surface }}>
                    <Typography sx={{ fontSize: '12px', color: C.textMuted, fontWeight: 800, mb: 1 }}>{factor.name}</Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 2 }}>
                      <Typography sx={{ fontSize: '20px', fontWeight: 900, color: C.text }}>{factor.value}</Typography>
                      <Typography sx={{ fontSize: '12px', fontWeight: 800, color: factor.color }}>{factor.status}</Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={factor.score}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        background: `${factor.color}15`,
                        '& .MuiLinearProgress-bar': { background: factor.color },
                      }}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </PortalShell>
  );
}
