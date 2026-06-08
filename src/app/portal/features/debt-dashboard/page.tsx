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
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  TrendingDownRounded,
  CheckCircleRounded,
  WarningRounded,
  CalendarTodayRounded,
} from '@mui/icons-material';
import { useGetPremiumFeaturesQuery, useGetUserSubscriptionQuery } from '@/lib/redux/api/subscriptionApi';
import PortalShell, { C, F } from '../../components/PortalShell';

export default function DebtManagementPage() {
  const { data: featuresData } = useGetPremiumFeaturesQuery();
  const { data: subscriptionData } = useGetUserSubscriptionQuery();

  const features = featuresData?.data;
  const subscription = subscriptionData?.data;
  const isFeatureEnabled = features?.debtDashboard;

  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paid'>('all');

  // Mock debt data
  const debts = [
    {
      id: 1,
      type: 'Personal Loan',
      lender: 'Absa Bank Ghana',
      originalAmount: 10000,
      remaining: 6450,
      monthlyPayment: 850,
      interestRate: 18.5,
      dueDate: 'May 30, 2026',
      daysUntilDue: 2,
      status: 'active',
    },
    {
      id: 2,
      type: 'Business Loan',
      lender: 'Fidelity Bank',
      originalAmount: 25000,
      remaining: 11800,
      monthlyPayment: 1240,
      interestRate: 15.2,
      dueDate: 'June 15, 2026',
      daysUntilDue: 18,
      status: 'active',
    },
    {
      id: 3,
      type: 'Credit Card',
      lender: 'Ghana Commercial Bank',
      originalAmount: 5000,
      remaining: 2345,
      monthlyPayment: 300,
      interestRate: 22.0,
      dueDate: 'June 5, 2026',
      daysUntilDue: 8,
      status: 'active',
    },
  ];

  const totalDebt = debts.reduce((sum, d) => sum + d.remaining, 0);
  const totalMonthlyPayment = debts.reduce((sum, d) => sum + d.monthlyPayment, 0);
  const averageInterestRate = (debts.reduce((sum, d) => sum + d.interestRate, 0) / debts.length).toFixed(2);

  if (!isFeatureEnabled) {
    return (
      <PortalShell>
        <Box sx={{ py: 8, px: { xs: 2, md: 4 }, textAlign: 'center' }}>
          <Container maxWidth="sm">
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 2, color: C.text }}>
              Feature Locked
            </Typography>
            <Typography sx={{ color: C.textSub, mb: 4 }}>
              Debt Management Dashboard is a premium feature. Upgrade to {subscription?.name} or higher to track and optimize your loans.
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
              Debt Management Dashboard
            </Typography>
            <Typography sx={{ color: C.textSub, fontSize: '16px', mb: 4 }}>
              Track all your loans and debts in one place. Get insights and optimize your repayment strategy.
            </Typography>
          </Box>

          {/* Key Metrics */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card sx={{ border: `1px solid ${C.border}`, borderRadius: '16px', p: 3 }}>
                  <Typography sx={{ fontSize: '11px', fontWeight: 800, color: C.textMuted, mb: 1, textTransform: 'uppercase' }}>
                    Total Debt
                  </Typography>
                  <Typography sx={{ fontSize: '28px', fontWeight: 900, color: C.text, mb: 2 }}>
                    GH₵{totalDebt.toLocaleString()}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={65}
                    sx={{
                      height: 6,
                      borderRadius: '3px',
                      background: `${C.border}`,
                      '& .MuiLinearProgress-bar': {
                        background: '#f59e0b',
                      },
                    }}
                  />
                </Card>
              </motion.div>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card sx={{ border: `1px solid ${C.border}`, borderRadius: '16px', p: 3 }}>
                  <Typography sx={{ fontSize: '11px', fontWeight: 800, color: C.textMuted, mb: 1, textTransform: 'uppercase' }}>
                    Monthly Payment
                  </Typography>
                  <Typography sx={{ fontSize: '28px', fontWeight: 900, color: C.text, mb: 2 }}>
                    GH₵{totalMonthlyPayment.toLocaleString()}
                  </Typography>
                  <Typography sx={{ fontSize: '12px', color: C.textSub }}>Next payment: May 30</Typography>
                </Card>
              </motion.div>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card sx={{ border: `1px solid ${C.border}`, borderRadius: '16px', p: 3 }}>
                  <Typography sx={{ fontSize: '11px', fontWeight: 800, color: C.textMuted, mb: 1, textTransform: 'uppercase' }}>
                    Avg Interest Rate
                  </Typography>
                  <Typography sx={{ fontSize: '28px', fontWeight: 900, color: C.text, mb: 2 }}>
                    {averageInterestRate}%
                  </Typography>
                  <Chip
                    size="small"
                    label="Fair - Consider refinancing"
                    sx={{
                      background: '#f59e0b20',
                      color: '#f59e0b',
                      fontSize: '11px',
                      fontWeight: 800,
                    }}
                  />
                </Card>
              </motion.div>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card sx={{ border: `1px solid ${C.border}`, borderRadius: '16px', p: 3 }}>
                  <Typography sx={{ fontSize: '11px', fontWeight: 800, color: C.textMuted, mb: 1, textTransform: 'uppercase' }}>
                    Active Loans
                  </Typography>
                  <Typography sx={{ fontSize: '28px', fontWeight: 900, color: C.text, mb: 2 }}>
                    {debts.length}
                  </Typography>
                  <Typography sx={{ fontSize: '12px', color: C.textSub }}>Debt-to-income: 14.2%</Typography>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          {/* Debts Table */}
          <Card sx={{ border: `1px solid ${C.border}`, borderRadius: '16px', overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: `${C.blue}08`, borderBottom: `1px solid ${C.border}` }}>
                    <TableCell sx={{ fontWeight: 900, color: C.text }}>Loan Type</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: C.text }}>Remaining Balance</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: C.text }}>Monthly Payment</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: C.text }}>Interest Rate</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: C.text }}>Due Date</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: C.text }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {debts.map((debt, i) => (
                    <TableRow key={debt.id} sx={{ borderBottom: `1px solid ${C.border}`, '&:hover': { background: `${C.blue}04` } }}>
                      <TableCell>
                        <Box>
                          <Typography sx={{ fontWeight: 800, color: C.text, fontSize: '14px' }}>
                            {debt.type}
                          </Typography>
                          <Typography sx={{ fontSize: '12px', color: C.textSub }}>
                            {debt.lender}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 800, color: C.text }}>
                          GH₵{debt.remaining.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 800, color: C.text }}>
                          GH₵{debt.monthlyPayment.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${debt.interestRate}%`}
                          sx={{
                            background: debt.interestRate > 20 ? '#f59e0b20' : '#3b82f620',
                            color: debt.interestRate > 20 ? '#f59e0b' : '#3b82f6',
                            fontWeight: 800,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Typography sx={{ fontWeight: 800, fontSize: '14px', color: C.text }}>
                            {debt.dueDate}
                          </Typography>
                          <Chip
                            size="small"
                            icon={debt.daysUntilDue <= 7 ? <WarningRounded /> : <CheckCircleRounded />}
                            label={`${debt.daysUntilDue} days left`}
                            sx={{
                              background: debt.daysUntilDue <= 7 ? '#f59e0b20' : '#10b98120',
                              color: debt.daysUntilDue <= 7 ? '#f59e0b' : '#10b981',
                              fontSize: '11px',
                              fontWeight: 800,
                            }}
                          />
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label="Active"
                          sx={{
                            background: '#3b82f620',
                            color: '#3b82f6',
                            fontWeight: 800,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* Repayment Strategy */}
          <Card
            sx={{
              mt: 6,
              background: `linear-gradient(135deg, ${C.blue}08 0%, #10b98108 100%)`,
              border: `1px solid ${C.border}`,
              borderRadius: '16px',
              p: 4,
            }}
          >
            <Typography sx={{ fontSize: '18px', fontWeight: 900, color: C.text, mb: 3 }}>
              Optimal Repayment Strategy
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <CheckCircleRounded sx={{ color: '#10b981', mt: 0.5 }} />
                <Box>
                  <Typography sx={{ fontWeight: 800, color: C.text, mb: 0.5 }}>Pay High-Interest Debt First</Typography>
                  <Typography sx={{ fontSize: '14px', color: C.textSub }}>
                    Your Credit Card has the highest interest rate at 22.0%. Consider prioritizing this to save on interest costs.
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <CheckCircleRounded sx={{ color: '#10b981', mt: 0.5 }} />
                <Box>
                  <Typography sx={{ fontWeight: 800, color: C.text, mb: 0.5 }}>Refinancing Opportunity</Typography>
                  <Typography sx={{ fontSize: '14px', color: C.textSub }}>
                    You may qualify for a consolidation loan at 16% to combine all debts. This could save you GH₵2,400 annually.
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Card>
        </Container>
      </Box>
    </PortalShell>
  );
}
