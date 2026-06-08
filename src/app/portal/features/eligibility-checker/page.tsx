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
  Slider,
  TextField,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import {
  CheckCircleRounded,
  TrendingUpRounded,
  CalculateRounded,
  LightbulbRounded,
  VerifiedUserRounded,
} from '@mui/icons-material';
import { useGetPremiumFeaturesQuery, useGetUserSubscriptionQuery } from '@/lib/redux/api/subscriptionApi';
import { useGetDashboardMetricsQuery } from '@/lib/redux/api/userApi';
import { toast } from 'react-hot-toast';
import PortalShell, { C, F } from '../../components/PortalShell';

export default function EligibilityCheckerPage() {
  const { data: featuresData } = useGetPremiumFeaturesQuery();
  const { data: subscriptionData } = useGetUserSubscriptionQuery();
  const { data: metricsData } = useGetDashboardMetricsQuery();
  
  const features = featuresData?.data;
  const subscription = subscriptionData?.data;
  const metrics = metricsData?.data;
  const isFeatureEnabled = features?.eligibilityChecker;

  const [loanAmount, setLoanAmount] = useState(5000);
  const [loanTenure, setLoanTenure] = useState(12);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  // Mock eligibility assessment
  const assessEligibility = () => {
    const creditScore = metrics?.creditScore || 705;
    const cashFlow = metrics?.cashFlow || 5000;
    
    // Calculate approval likelihood
    let approvalScore = 0;
    if (creditScore >= 700) approvalScore += 35;
    else if (creditScore >= 650) approvalScore += 25;
    else if (creditScore >= 600) approvalScore += 15;

    if (cashFlow >= loanAmount / 12) approvalScore += 30;
    else approvalScore += 15;

    approvalScore += 15; // KYC bonus
    approvalScore += 5;  // Account age bonus

    const matchedLenders = Math.floor(Math.random() * 15) + 8;
    
    setResults({
      approvalScore: Math.min(100, approvalScore),
      matchedLenders,
      estimatedRate: (16 + (100 - approvalScore) / 10).toFixed(2),
      processTime: '24-48 hours',
      recommendations: [
        'Your credit score is excellent - focus on maintaining current payment patterns',
        'Consider requesting for a longer tenure to reduce monthly installments',
        'You pre-qualify for priority processing - expected approval in 24 hours',
      ],
    });
    setShowResults(true);
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
              Loan Eligibility Checker is a premium feature. Upgrade to {subscription?.name} or higher to access this tool.
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
              Loan Eligibility Checker
            </Typography>
            <Typography sx={{ color: C.textSub, fontSize: '16px', mb: 4 }}>
              Instantly estimate your loan approval chances across 50+ verified institutional lenders.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Input Panel */}
            <Grid size={{ xs: 12, md: 5 }}>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Card sx={{ border: `1px solid ${C.border}`, borderRadius: '20px', p: 4 }}>
                  <Typography sx={{ fontSize: '18px', fontWeight: 900, color: C.text, mb: 3 }}>
                    Loan Assessment
                  </Typography>

                  {/* Loan Amount */}
                  <Box sx={{ mb: 4 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <Typography sx={{ fontWeight: 800, color: C.text }}>Loan Amount</Typography>
                      <Typography sx={{ fontSize: '18px', fontWeight: 900, color: C.blue }}>
                        GH₵{loanAmount.toLocaleString()}
                      </Typography>
                    </Stack>
                    <Slider
                      value={loanAmount}
                      onChange={(e, newValue) => setLoanAmount(newValue as number)}
                      min={1000}
                      max={50000}
                      step={1000}
                      sx={{
                        '& .MuiSlider-thumb': {
                          background: C.blue,
                        },
                        '& .MuiSlider-track': {
                          background: C.blue,
                        },
                      }}
                    />
                    <Stack direction="row" justifyContent="space-between" sx={{ mt: 1, fontSize: '11px', color: C.textMuted }}>
                      <span>GH₵1,000</span>
                      <span>GH₵50,000</span>
                    </Stack>
                  </Box>

                  {/* Loan Tenure */}
                  <Box sx={{ mb: 4 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <Typography sx={{ fontWeight: 800, color: C.text }}>Loan Tenure</Typography>
                      <Typography sx={{ fontSize: '18px', fontWeight: 900, color: C.blue }}>
                        {loanTenure} months
                      </Typography>
                    </Stack>
                    <Slider
                      value={loanTenure}
                      onChange={(e, newValue) => setLoanTenure(newValue as number)}
                      min={3}
                      max={60}
                      step={1}
                      marks={[
                        { value: 3, label: '3mo' },
                        { value: 12, label: '12mo' },
                        { value: 24, label: '24mo' },
                        { value: 36, label: '36mo' },
                        { value: 60, label: '60mo' },
                      ]}
                      sx={{
                        '& .MuiSlider-thumb': {
                          background: C.blue,
                        },
                        '& .MuiSlider-track': {
                          background: C.blue,
                        },
                      }}
                    />
                  </Box>

                  {/* Key Metrics */}
                  <Box sx={{ mb: 4, p: 3, background: `${C.blue}08`, borderRadius: '12px' }}>
                    <Typography sx={{ fontSize: '11px', fontWeight: 800, color: C.textMuted, mb: 2, textTransform: 'uppercase' }}>
                      Your Profile
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}>
                        <Typography sx={{ fontSize: '11px', color: C.textMuted, mb: 0.5 }}>CREDIT SCORE</Typography>
                        <Typography sx={{ fontSize: '18px', fontWeight: 900, color: C.blue }}>
                          {metrics?.creditScore || 705}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography sx={{ fontSize: '11px', color: C.textMuted, mb: 0.5 }}>MONTHLY INCOME</Typography>
                        <Typography sx={{ fontSize: '18px', fontWeight: 900, color: C.blue }}>
                          GH₵{(metrics?.cashFlow || 5000).toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  <Button
                    fullWidth
                    onClick={assessEligibility}
                    variant="contained"
                    sx={{
                      background: C.blue,
                      color: '#fff',
                      borderRadius: '12px',
                      py: 1.8,
                      fontWeight: 800,
                      fontSize: '16px',
                      textTransform: 'none',
                    }}
                    startIcon={<CalculateRounded />}
                  >
                    Check Eligibility
                  </Button>
                </Card>
              </motion.div>
            </Grid>

            {/* Results Panel */}
            {showResults && results && (
              <Grid size={{ xs: 12, md: 7 }}>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <Stack spacing={3}>
                    {/* Approval Score */}
                    <Card sx={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(32, 81, 229, 0.08) 100%)', border: `1px solid ${C.border}`, borderRadius: '20px', p: 4 }}>
                      <Typography sx={{ fontSize: '14px', fontWeight: 800, color: C.textMuted, mb: 3, textTransform: 'uppercase' }}>
                        Approval Likelihood
                      </Typography>
                      <Box sx={{ mb: 3 }}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                          <Typography sx={{ fontSize: '24px', fontWeight: 900, color: C.text }}>
                            {results.approvalScore}%
                          </Typography>
                          <Chip
                            icon={<VerifiedUserRounded />}
                            label={results.approvalScore >= 80 ? 'Excellent' : results.approvalScore >= 60 ? 'Good' : 'Fair'}
                            sx={{
                              background:
                                results.approvalScore >= 80
                                  ? '#10b98120'
                                  : results.approvalScore >= 60
                                    ? '#3b82f620'
                                    : '#f59e0b20',
                              color:
                                results.approvalScore >= 80
                                  ? '#10b981'
                                  : results.approvalScore >= 60
                                    ? '#3b82f6'
                                    : '#f59e0b',
                              fontWeight: 800,
                              fontSize: '12px',
                            }}
                          />
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={results.approvalScore}
                          sx={{
                            height: 12,
                            borderRadius: '8px',
                            background: `${C.border}`,
                            '& .MuiLinearProgress-bar': {
                              background:
                                results.approvalScore >= 80
                                  ? '#10b981'
                                  : results.approvalScore >= 60
                                    ? '#3b82f6'
                                    : '#f59e0b',
                            },
                          }}
                        />
                      </Box>
                    </Card>

                    {/* Quick Stats */}
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}>
                        <Card sx={{ border: `1px solid ${C.border}`, borderRadius: '16px', p: 2.5 }}>
                          <Typography sx={{ fontSize: '11px', color: C.textMuted, fontWeight: 800, mb: 1, textTransform: 'uppercase' }}>
                            MATCHED LENDERS
                          </Typography>
                          <Typography sx={{ fontSize: '24px', fontWeight: 900, color: C.blue }}>
                            {results.matchedLenders}
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Card sx={{ border: `1px solid ${C.border}`, borderRadius: '16px', p: 2.5 }}>
                          <Typography sx={{ fontSize: '11px', color: C.textMuted, fontWeight: 800, mb: 1, textTransform: 'uppercase' }}>
                            ESTIMATED RATE
                          </Typography>
                          <Typography sx={{ fontSize: '24px', fontWeight: 900, color: C.blue }}>
                            {results.estimatedRate}%
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>

                    {/* Recommendations */}
                    <Card sx={{ background: `${C.blue}08`, border: `1px solid ${C.border}`, borderRadius: '16px', p: 3 }}>
                      <Typography sx={{ fontWeight: 800, color: C.text, mb: 2 }}>
                        <LightbulbRounded sx={{ verticalAlign: 'middle', mr: 1, color: C.blue }} />
                        Recommendations
                      </Typography>
                      <Stack spacing={1.5}>
                        {results.recommendations.map((rec: string, i: number) => (
                          <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                            <CheckCircleRounded sx={{ fontSize: 16, color: '#10b981', mt: 0.5 }} />
                            <Typography sx={{ fontSize: '13px', color: C.text, lineHeight: 1.5 }}>
                              {rec}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Card>

                    <Button
                      fullWidth
                      variant="contained"
                      href="/portal/marketplace"
                      sx={{
                        background: C.blue,
                        color: '#fff',
                        borderRadius: '12px',
                        py: 1.8,
                        fontWeight: 800,
                        fontSize: '16px',
                        textTransform: 'none',
                      }}
                    >
                      View Matched Lenders
                    </Button>
                  </Stack>
                </motion.div>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>
    </PortalShell>
  );
}
