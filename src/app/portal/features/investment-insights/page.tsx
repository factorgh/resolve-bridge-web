'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Stack,
  Button,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  TrendingUpRounded,
  ShowChartRounded,
  PieChartRounded,
  MoreTimeRounded,
  CheckCircleRounded,
  ArrowUpwardRounded,
  ArrowDownwardRounded,
} from '@mui/icons-material';
import { useGetPremiumFeaturesQuery, useGetUserSubscriptionQuery } from '@/lib/redux/api/subscriptionApi';
import PortalShell, { C, F } from '../../components/PortalShell';

export default function InvestmentInsightsPage() {
  const { data: featuresData } = useGetPremiumFeaturesQuery();
  const { data: subscriptionData } = useGetUserSubscriptionQuery();

  const features = featuresData?.data;
  const subscription = subscriptionData?.data;
  const isFeatureEnabled = features?.investmentInsights;

  const [selectedInstrument, setSelectedInstrument] = useState(null);

  // Mock investment opportunities
  const opportunities = [
    {
      name: 'Government Treasury Bills (91-day)',
      type: 'Fixed Income',
      yield: 24.5,
      riskLevel: 'Very Low',
      minInvestment: 100,
      status: 'Recommended',
      change: 0.5,
    },
    {
      name: 'Ghana Stock Exchange Index Fund',
      type: 'Equity',
      yield: 18.2,
      riskLevel: 'Moderate',
      minInvestment: 500,
      status: 'Good Potential',
      change: -2.3,
    },
    {
      name: 'Mutual Fund - Balanced Portfolio',
      type: 'Mixed',
      yield: 16.8,
      riskLevel: 'Low-Moderate',
      minInvestment: 250,
      status: 'Suitable',
      change: 1.2,
    },
    {
      name: 'Fixed Deposit (12-month)',
      type: 'Savings',
      yield: 12.0,
      riskLevel: 'Very Low',
      minInvestment: 1000,
      status: 'Safe Option',
      change: 0.0,
    },
  ];

  const investmentAllocation = [
    { name: 'Fixed Income', percentage: 45, color: '#10b981' },
    { name: 'Equity', percentage: 30, color: '#3b82f6' },
    { name: 'Savings', percentage: 20, color: '#f59e0b' },
    { name: 'Cash Reserve', percentage: 5, color: '#6366f1' },
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
              Investment Insights is a premium feature. Upgrade to {subscription?.name} or higher to access investment opportunities.
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
              Investment Insights
            </Typography>
            <Typography sx={{ color: C.textSub, fontSize: '16px', mb: 4 }}>
              Explore treasury bills, mutual funds, and market updates tailored to your financial profile.
            </Typography>
          </Box>

          {/* Portfolio Allocation */}
          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Card sx={{ border: `1px solid ${C.border}`, borderRadius: '20px', p: 4 }}>
                  <Typography sx={{ fontSize: '18px', fontWeight: 900, color: C.text, mb: 4 }}>
                    Recommended Portfolio Allocation
                  </Typography>

                  {/* Pie representation */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                    <Box
                      sx={{
                        width: 160,
                        height: 160,
                        borderRadius: '50%',
                        background: `conic-gradient(
                          from 0deg,
                          ${investmentAllocation[0].color} 0deg 162deg,
                          ${investmentAllocation[1].color} 162deg 270deg,
                          ${investmentAllocation[2].color} 270deg 342deg,
                          ${investmentAllocation[3].color} 342deg 360deg
                        )`,
                        position: 'relative',
                        padding: '4px',
                      }}
                    >
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          background: C.surface,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography sx={{ fontSize: '24px', fontWeight: 900, color: C.blue }}>
                            100%
                          </Typography>
                          <Typography sx={{ fontSize: '11px', color: C.textMuted, fontWeight: 800 }}>
                            Distributed
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* Legend */}
                  <Stack spacing={1.5}>
                    {investmentAllocation.map((item, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '3px',
                            background: item.color,
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontSize: '13px', fontWeight: 800, color: C.text }}>
                            {item.name}
                          </Typography>
                        </Box>
                        <Typography sx={{ fontSize: '13px', fontWeight: 900, color: C.blue }}>
                          {item.percentage}%
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Card>
              </motion.div>
            </Grid>

            {/* Key Metrics */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                  <Card sx={{ border: `1px solid ${C.border}`, borderRadius: '16px', p: 3 }}>
                    <Typography sx={{ fontSize: '11px', fontWeight: 800, color: C.textMuted, mb: 1, textTransform: 'uppercase' }}>
                      Expected Annual Return
                    </Typography>
                    <Typography sx={{ fontSize: '28px', fontWeight: 900, color: C.blue, mb: 2 }}>
                      18.6%
                    </Typography>
                    <Chip
                      icon={<ArrowUpwardRounded />}
                      label="Market beating return"
                      sx={{
                        background: '#10b98120',
                        color: '#10b981',
                        fontWeight: 800,
                        fontSize: '11px',
                      }}
                    />
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <Card sx={{ border: `1px solid ${C.border}`, borderRadius: '16px', p: 3 }}>
                    <Typography sx={{ fontSize: '11px', fontWeight: 800, color: C.textMuted, mb: 1, textTransform: 'uppercase' }}>
                      Risk Level
                    </Typography>
                    <Typography sx={{ fontSize: '18px', fontWeight: 900, color: C.text, mb: 2 }}>
                      Moderate
                    </Typography>
                    <Box>
                      <LinearProgress
                        variant="determinate"
                        value={45}
                        sx={{
                          height: 6,
                          borderRadius: '3px',
                          background: '#f59e0b40',
                          '& .MuiLinearProgress-bar': {
                            background: '#f59e0b',
                          },
                        }}
                      />
                      <Typography sx={{ fontSize: '11px', color: C.textMuted, mt: 1 }}>
                        Well-balanced for your profile
                      </Typography>
                    </Box>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                  <Card sx={{ border: `1px solid ${C.border}`, borderRadius: '16px', p: 3 }}>
                    <Typography sx={{ fontSize: '11px', fontWeight: 800, color: C.textMuted, mb: 1, textTransform: 'uppercase' }}>
                      Investment Horizon
                    </Typography>
                    <Typography sx={{ fontSize: '18px', fontWeight: 900, color: C.text, mb: 2 }}>
                      3-5 Years
                    </Typography>
                    <Chip
                      icon={<MoreTimeRounded />}
                      label="Medium-term focus"
                      sx={{
                        background: '#3b82f620',
                        color: '#3b82f6',
                        fontWeight: 800,
                        fontSize: '11px',
                      }}
                    />
                  </Card>
                </motion.div>
              </Stack>
            </Grid>
          </Grid>

          {/* Investment Opportunities */}
          <Box sx={{ mb: 6 }}>
            <Typography sx={{ fontSize: '20px', fontWeight: 900, color: C.text, mb: 3 }}>
              Available Investment Instruments
            </Typography>
            <TableContainer component={Card} sx={{ border: `1px solid ${C.border}`, borderRadius: '16px', overflow: 'hidden' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: `${C.blue}08`, borderBottom: `1px solid ${C.border}` }}>
                    <TableCell sx={{ fontWeight: 900, color: C.text }}>Instrument</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: C.text }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: C.text }}>Yield</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: C.text }}>Risk</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: C.text }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: C.text }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {opportunities.map((opp, i) => (
                    <TableRow key={i} sx={{ borderBottom: `1px solid ${C.border}`, '&:hover': { background: `${C.blue}04` } }}>
                      <TableCell>
                        <Box>
                          <Typography sx={{ fontWeight: 800, color: C.text, fontSize: '14px' }}>
                            {opp.name}
                          </Typography>
                          <Typography sx={{ fontSize: '12px', color: C.textSub }}>
                            Min: GH₵{opp.minInvestment}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={opp.type}
                          size="small"
                          sx={{
                            background: `${C.blue}20`,
                            color: C.blue,
                            fontWeight: 800,
                            fontSize: '11px',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography sx={{ fontWeight: 900, color: C.text, fontSize: '14px' }}>
                            {opp.yield}%
                          </Typography>
                          <Box
                            sx={{
                              color: opp.change >= 0 ? '#10b981' : '#f59e0b',
                            }}
                          >
                            {opp.change >= 0 ? <ArrowUpwardRounded sx={{ fontSize: 14 }} /> : <ArrowDownwardRounded sx={{ fontSize: 14 }} />}
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={opp.riskLevel}
                          size="small"
                          sx={{
                            background: opp.riskLevel === 'Very Low' ? '#10b98120' : '#f59e0b20',
                            color: opp.riskLevel === 'Very Low' ? '#10b981' : '#f59e0b',
                            fontWeight: 800,
                            fontSize: '11px',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={opp.status}
                          size="small"
                          sx={{
                            background: '#3b82f620',
                            color: '#3b82f6',
                            fontWeight: 800,
                            fontSize: '11px',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: C.blue,
                            color: C.blue,
                            fontWeight: 800,
                            textTransform: 'none',
                            fontSize: '12px',
                          }}
                        >
                          Invest
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Disclaimer */}
          <Card sx={{ background: '#6366f108', border: `1px solid #6366f130`, borderRadius: '16px', p: 3 }}>
            <Typography sx={{ fontSize: '12px', color: '#4f46e5', lineHeight: 1.6 }}>
              ⓘ Investment recommendations are based on your financial profile, risk tolerance, and market analysis. Past performance does not guarantee future results. Please consult with a licensed financial advisor before making investment decisions.
            </Typography>
          </Card>
        </Container>
      </Box>
    </PortalShell>
  );
}
