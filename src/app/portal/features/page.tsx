'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Button,
  Chip,
} from '@mui/material';
import {
  CreditCardRounded,
  SecurityRounded,
  SmartToyRounded,
  ShieldRounded,
  TrendingUpRounded,
  AssignmentRounded,
  SchoolRounded,
  TrendingDownRounded,
  EmojiEventsRounded,
  LockRounded,
  CheckCircleRounded,
  ArrowForwardRounded,
  TimelineRounded,
} from '@mui/icons-material';
import { useGetPremiumFeaturesQuery, useGetUserSubscriptionQuery } from '@/lib/redux/api/subscriptionApi';
import PortalShell, { C, F } from '../components/PortalShell';

const allFeatures = [
  {
    id: 'credit-monitoring',
    name: 'Credit Score Monitoring',
    description: 'Track your institutional credit score in real-time with detailed analytics and personalized improvement tips.',
    icon: <CreditCardRounded fontSize="large" />,
    href: '/portal/features/credit-monitoring',
    color: '#10b981',
    features: ['Real-time monitoring', 'Score history', 'Factor analysis', 'Alerts'],
  },
  {
    id: 'priority-loan-matching',
    name: 'Priority Loan Matching',
    description: 'Enjoy fast-track loan application routing and rapid decisions with priority lender matching.',
    icon: <TimelineRounded fontSize="large" />,
    href: '/portal/features/priority-loan-matching',
    color: '#14b8a6',
    features: ['Fast-track routing', 'Accelerated decisions', 'Pre-approval matching', 'Priority support'],
  },
  {
    id: 'advisor',
    name: 'AI Financial Advisor',
    description: 'Get personalized financial guidance powered by advanced AI analysis of your profile and market data.',
    icon: <SmartToyRounded fontSize="large" />,
    href: '/portal/features/advisor',
    color: '#f59e0b',
    features: ['24/7 chat support', 'Custom recommendations', 'Market insights', 'Strategy planning'],
  },
  {
    id: 'eligibility-checker',
    name: 'Loan Eligibility Checker',
    description: 'Instantly estimate your approval chances across 50+ verified institutional lenders.',
    icon: <SecurityRounded fontSize="large" />,
    href: '/portal/features/eligibility-checker',
    color: '#3b82f6',
    features: ['Instant assessment', 'Lender matching', 'Rate estimates', 'Pre-qualification'],
  },
  {
    id: 'investment-insights',
    name: 'Investment Insights',
    description: 'Explore treasury bills, mutual funds, and market updates tailored to your financial profile.',
    icon: <TrendingUpRounded fontSize="large" />,
    href: '/portal/features/investment-insights',
    color: '#8b5cf6',
    features: ['Treasury bills', 'Fund matching', 'Yield analysis', 'Portfolio allocation'],
  },
  {
    id: 'business-tools',
    name: 'Business Finance Tools',
    description: 'Comprehensive tools for SME business finance management and growth strategies.',
    icon: <AssignmentRounded fontSize="large" />,
    href: '/portal/features/business-tools',
    color: '#06b6d4',
    features: ['Cash flow tracking', 'Loan readiness', 'Growth strategies', 'Financial reports'],
  },
  {
    id: 'fraud-protection',
    name: 'Fraud Protection Alerts',
    description: 'Real-time monitoring and alerts to protect your account from fraudulent activities and unauthorized access.',
    icon: <ShieldRounded fontSize="large" />,
    href: '/portal/features/fraud-protection',
    color: '#ef4444',
    features: ['Real-time monitoring', 'Threat alerts', 'Device tracking', 'Custom notifications'],
  },
  {
    id: 'education',
    name: 'Premium Financial Education',
    description: 'Access expert-led courses, webinars, and financial literacy resources.',
    icon: <SchoolRounded fontSize="large" />,
    href: '/portal/features/education',
    color: '#ec4899',
    features: ['Online courses', 'Live webinars', 'Expert Q&A', 'Certifications'],
  },
  {
    id: 'debt-dashboard',
    name: 'Debt Management Dashboard',
    description: 'Track all your loans and debts in one place with optimization strategies.',
    icon: <TrendingDownRounded fontSize="large" />,
    href: '/portal/features/debt-dashboard',
    color: '#f97316',
    features: ['Debt tracking', 'Payment calendar', 'Optimization', 'Refinancing advice'],
  },
  {
    id: 'vip-concierge',
    name: 'VIP Concierge Support',
    description: 'Dedicated personal support from financial experts available 24/7.',
    icon: <EmojiEventsRounded fontSize="large" />,
    href: '/portal/features/vip-concierge',
    color: '#d946ef',
    features: ['Dedicated account manager', 'Priority support', 'Custom solutions', 'Executive access'],
  },
];

export default function PremiumFeaturesPage() {
  const { data: featuresData } = useGetPremiumFeaturesQuery();
  const { data: subscriptionData } = useGetUserSubscriptionQuery();

  const features = featuresData?.data;
  const subscription = subscriptionData?.data;

  const getFeatureEnabled = (featureId: string): boolean => {
    if (!features) return false;
    const featureMap: Record<string, keyof typeof features> = {
      'credit-monitoring': 'creditMonitoring',
      'priority-loan-matching': 'prioritySupport',
      'eligibility-checker': 'eligibilityChecker',
      'advisor': 'advisorAccess',
      'fraud-protection': 'fraudProtection',
      'investment-insights': 'investmentInsights',
      'business-tools': 'businessTools',
      'education': 'educationCourses',
      'debt-dashboard': 'debtDashboard',
      'vip-concierge': 'vipConcierge',
    };
    return features[featureMap[featureId]] || false;
  };

  return (
    <PortalShell>
      <Box sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, md: 4 } }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 8, textAlign: 'center' }}>
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
              Premium Features
            </Typography>
            <Typography sx={{ color: C.textSub, fontSize: '16px', maxWidth: 600, mx: 'auto' }}>
              {subscription
                ? `You're on the ${subscription.name} plan. Explore all available features designed to accelerate your financial growth.`
                : 'Unlock powerful financial tools with a premium subscription.'}
            </Typography>
          </Box>

          {/* Features Grid */}
          <Grid container spacing={3}>
            {allFeatures.map((feature, index) => {
              const isEnabled = getFeatureEnabled(feature.id);
              const isLocked = !isEnabled;

              return (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={feature.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    style={{ height: '100%' }}
                  >
                    <Card
                      component={!isLocked ? Link : 'div'}
                      href={!isLocked ? feature.href : undefined}
                      sx={{
                        height: '100%',
                        border: `2px solid ${isEnabled ? feature.color + '40' : C.border}`,
                        borderRadius: '20px',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.3s ease',
                        textDecoration: 'none',
                        background: isEnabled ? feature.color + '04' : C.surface,
                        cursor: !isLocked ? 'pointer' : 'default',
                        '&:hover': !isLocked
                          ? {
                              boxShadow: `0 20px 60px ${feature.color}20`,
                              transform: 'translateY(-4px)',
                            }
                          : {},
                      }}
                    >
                      {/* Top accent bar */}
                      {isEnabled && (
                        <Box
                          sx={{
                            height: '4px',
                            background: feature.color,
                          }}
                        />
                      )}

                      <CardContent sx={{ p: 3.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {/* Icon and Title */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
                          <Box
                            sx={{
                              p: 1.5,
                              background: feature.color + '15',
                              borderRadius: '12px',
                              color: feature.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {feature.icon}
                          </Box>
                          {isEnabled && (
                            <Chip
                              icon={<CheckCircleRounded />}
                              label="Active"
                              size="small"
                              sx={{
                                background: feature.color + '20',
                                color: feature.color,
                                fontWeight: 800,
                                fontSize: '10px',
                              }}
                            />
                          )}
                          {isLocked && (
                            <Chip
                              icon={<LockRounded />}
                              label="Premium"
                              size="small"
                              sx={{
                                background: C.border,
                                color: C.textMuted,
                                fontWeight: 800,
                                fontSize: '10px',
                              }}
                            />
                          )}
                        </Box>

                        {/* Name and Description */}
                        <Typography
                          sx={{
                            fontSize: '18px',
                            fontWeight: 900,
                            color: C.text,
                            mb: 1.5,
                          }}
                        >
                          {feature.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '13px',
                            color: C.textSub,
                            lineHeight: 1.6,
                            mb: 3,
                          }}
                        >
                          {feature.description}
                        </Typography>

                        {/* Features List */}
                        <Stack spacing={1} sx={{ mb: 4, flex: 1 }}>
                          {feature.features.map((f, i) => (
                            <Box
                              key={i}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                opacity: isEnabled ? 1 : 0.6,
                              }}
                            >
                              <CheckCircleRounded
                                sx={{
                                  fontSize: 16,
                                  color: feature.color,
                                }}
                              />
                              <Typography sx={{ fontSize: '12px', color: C.text }}>
                                {f}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>

                        {/* CTA Button */}
                        {isEnabled && !isLocked && (
                          <Button
                            fullWidth
                            variant="contained"
                            endIcon={<ArrowForwardRounded />}
                            sx={{
                              background: feature.color,
                              color: '#fff',
                              borderRadius: '12px',
                              py: 1.5,
                              fontWeight: 800,
                              textTransform: 'none',
                              fontSize: '14px',
                              '&:hover': {
                                opacity: 0.9,
                              },
                            }}
                          >
                            Access Feature
                          </Button>
                        )}

                        {isLocked && (
                          <Button
                            fullWidth
                            variant="outlined"
                            disabled
                            sx={{
                              borderColor: C.border,
                              color: C.textMuted,
                              borderRadius: '12px',
                              py: 1.5,
                              fontWeight: 800,
                              textTransform: 'none',
                              fontSize: '14px',
                            }}
                          >
                            Upgrade to Unlock
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>

          {/* Upgrade CTA */}
          {!subscription && (
            <Box
              sx={{
                mt: 8,
                p: { xs: 4, md: 6 },
                background: `linear-gradient(135deg, ${C.blue}10 0%, #10b98110 100%)`,
                borderRadius: '20px',
                textAlign: 'center',
                border: `1px solid ${C.border}`,
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: '20px', md: '28px' },
                  fontWeight: 900,
                  color: C.text,
                  mb: 2,
                }}
              >
                Ready to unlock all features?
              </Typography>
              <Typography sx={{ color: C.textSub, mb: 4, maxWidth: 500, mx: 'auto' }}>
                Choose a subscription plan to get instant access to all premium features and accelerate your financial journey.
              </Typography>
              <Button
                component={Link}
                href="/portal/subscriptions"
                variant="contained"
                size="large"
                sx={{
                  background: C.blue,
                  color: '#fff',
                  borderRadius: '12px',
                  px: 8,
                  py: 2,
                  fontWeight: 800,
                  textTransform: 'none',
                  fontSize: '16px',
                }}
                endIcon={<ArrowForwardRounded />}
              >
                View Plans
              </Button>
            </Box>
          )}
        </Container>
      </Box>
    </PortalShell>
  );
}
