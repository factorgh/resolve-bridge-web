'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CheckCircleRounded,
  CreditCardRounded,
  TrendingUpRounded,
  VolumeUpRounded,
  SecurityRounded,
  BookRounded,
  TrendingDownRounded,
  ShieldRounded,
  SchoolRounded,
  PriorityHighRounded,
  AssignmentRounded,
  EmojiEventsRounded,
  VerifiedUserRounded,
  ArrowForwardRounded,
} from '@mui/icons-material';
import { useGetSubscriptionPlansQuery, useGetUserSubscriptionQuery, useUpgradeSubscriptionMutation } from '@/lib/redux/api/subscriptionApi';
import { useGetMeQuery } from '@/lib/redux/api/userApi';
import { toast } from 'react-hot-toast';
import PortalShell, { C, F } from '../components/PortalShell';

const featureIcons: Record<string, any> = {
  creditMonitoring: <CreditCardRounded />,
  eligibilityChecker: <SecurityRounded />,
  advisorAccess: <VolumeUpRounded />,
  fraudProtection: <ShieldRounded />,
  investmentInsights: <TrendingUpRounded />,
  businessTools: <AssignmentRounded />,
  educationCourses: <SchoolRounded />,
  debtDashboard: <TrendingDownRounded />,
  vipConcierge: <EmojiEventsRounded />,
  prioritySupport: <PriorityHighRounded />,
};

export default function SubscriptionsPage() {
  const router = useRouter();
  const { data: userData } = useGetMeQuery();
  const { data: plansData } = useGetSubscriptionPlansQuery();
  const { data: subscriptionData } = useGetUserSubscriptionQuery();
  const [upgradeSubscription] = useUpgradeSubscriptionMutation();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const plans = plansData?.data || [];
  const currentSubscription = subscriptionData?.data;

  const handleUpgradeClick = (plan: any) => {
    if (!userData?.data?.id) {
      toast.error('Please log in first');
      return;
    }
    setSelectedPlan(plan);
    setShowUpgradeDialog(true);
  };

  const handleConfirmUpgrade = async () => {
    if (!selectedPlan) return;
    
    setIsUpgrading(true);
    try {
      const result = await upgradeSubscription({ planId: selectedPlan._id }).unwrap();
      if (result.success) {
        toast.success(`Upgraded to ${selectedPlan.name} plan!`);
        setShowUpgradeDialog(false);
        setSelectedPlan(null);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to upgrade subscription');
    } finally {
      setIsUpgrading(false);
    }
  };

  const sortedPlans = [...plans].sort((a, b) => {
    const tierOrder = { basic: 0, standard: 1, premium: 2, elite: 3 };
    return (tierOrder[a.tier as keyof typeof tierOrder] || 0) - (tierOrder[b.tier as keyof typeof tierOrder] || 0);
  });

  const getPrice = (plan: any) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : Math.floor(plan.yearlyPrice);
  };

  return (
    <PortalShell>
      <Box sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, md: 4 } }}>
        <Container maxWidth="xl">
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
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
              Premium Subscription Plans
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '14px', md: '18px' },
                color: C.textSub,
                mb: 6,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Unlock powerful financial tools and get exclusive features designed to accelerate your financial growth.
            </Typography>

            {/* Billing Cycle Toggle */}
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              alignItems="center"
              sx={{ mb: 8 }}
            >
              <Button
                onClick={() => setBillingCycle('monthly')}
                variant={billingCycle === 'monthly' ? 'contained' : 'outlined'}
                sx={{
                  background: billingCycle === 'monthly' ? C.blue : 'transparent',
                  color: billingCycle === 'monthly' ? '#fff' : C.text,
                  border: `2px solid ${billingCycle === 'monthly' ? C.blue : C.border}`,
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  fontWeight: 800,
                  textTransform: 'none',
                }}
              >
                Monthly Billing
              </Button>
              <Button
                onClick={() => setBillingCycle('yearly')}
                variant={billingCycle === 'yearly' ? 'contained' : 'outlined'}
                sx={{
                  background: billingCycle === 'yearly' ? C.blue : 'transparent',
                  color: billingCycle === 'yearly' ? '#fff' : C.text,
                  border: `2px solid ${billingCycle === 'yearly' ? C.blue : C.border}`,
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  fontWeight: 800,
                  textTransform: 'none',
                }}
              >
                Annual Billing
              </Button>
              {billingCycle === 'yearly' && (
                <Chip
                  label="Save 20%"
                  icon={<TrendingUpRounded />}
                  sx={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '12px',
                  }}
                />
              )}
            </Stack>
          </Box>

          {/* Plans Grid */}
          <Grid container spacing={3} sx={{ mb: 8 }}>
            {sortedPlans.map((plan: any, index: number) => {
              const isCurrentPlan = currentSubscription?._id === plan._id;
              const isPremium = plan.tier === 'premium' || plan.tier === 'elite';

              return (
                <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={plan._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{ height: '100%' }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        background: isPremium
                          ? 'linear-gradient(135deg, rgba(32, 81, 229, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)'
                          : C.surface,
                        border: isCurrentPlan ? `2px solid ${C.blue}` : `1px solid ${C.border}`,
                        borderRadius: '20px',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: isPremium ? `0 20px 60px ${C.blue}20` : `0 10px 30px ${C.border}`,
                          transform: 'translateY(-4px)',
                        },
                      }}
                    >
                      {isPremium && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: `linear-gradient(90deg, ${C.blue}, #10b981)`,
                          }}
                        />
                      )}

                      {isCurrentPlan && (
                        <Chip
                          label="Current Plan"
                          icon={<VerifiedUserRounded />}
                          sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            background: C.blue,
                            color: '#fff',
                            fontWeight: 800,
                            fontSize: '11px',
                            zIndex: 10,
                          }}
                        />
                      )}

                      <CardContent sx={{ p: 3, pb: 2, flex: 1 }}>
                        {/* Plan Name and Tier */}
                        <Box sx={{ mb: 3 }}>
                          <Typography
                            sx={{
                              fontSize: '12px',
                              fontWeight: 800,
                              color: C.blue,
                              textTransform: 'uppercase',
                              letterSpacing: '0.1em',
                              mb: 1,
                            }}
                          >
                            {plan.tier}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '24px',
                              fontWeight: 900,
                              color: C.text,
                              mb: 1,
                            }}
                          >
                            {plan.name}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '13px',
                              color: C.textSub,
                              lineHeight: 1.5,
                            }}
                          >
                            {plan.description}
                          </Typography>
                        </Box>

                        {/* Price */}
                        <Box
                          sx={{
                            mb: 4,
                            p: 2,
                            background: isPremium ? `${C.blue}10` : `${C.border}30`,
                            borderRadius: '12px',
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '36px',
                              fontWeight: 900,
                              color: C.text,
                            }}
                          >
                            GH₵{getPrice(plan)}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '12px',
                              color: C.textSub,
                            }}
                          >
                            per {billingCycle === 'monthly' ? 'month' : 'year'}
                          </Typography>
                        </Box>

                        {/* Features List */}
                        <Stack spacing={1.5} sx={{ mb: 4 }}>
                          {[
                            'creditMonitoring',
                            'eligibilityChecker',
                            'advisorAccess',
                            'fraudProtection',
                            'investmentInsights',
                            'businessTools',
                            'educationCourses',
                            'debtDashboard',
                            'vipConcierge',
                            'prioritySupport',
                          ].map((feature: string) => {
                            const isEnabled = (plan as any)[feature];
                            return (
                              <Box
                                key={feature}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1.5,
                                  opacity: isEnabled ? 1 : 0.4,
                                }}
                              >
                                <CheckCircleRounded
                                  sx={{
                                    fontSize: 18,
                                    color: isEnabled ? '#10b981' : C.textMuted,
                                  }}
                                />
                                <Typography
                                  sx={{
                                    fontSize: '12px',
                                    color: isEnabled ? C.text : C.textMuted,
                                    textTransform: 'capitalize',
                                  }}
                                >
                                  {feature.replace(/([A-Z])/g, ' $1').trim()}
                                </Typography>
                              </Box>
                            );
                          })}
                        </Stack>
                      </CardContent>

                      {/* CTA Button */}
                      <Box sx={{ p: 3, pt: 2 }}>
                        <Button
                          fullWidth
                          onClick={() => handleUpgradeClick(plan)}
                          disabled={isCurrentPlan}
                          variant={isCurrentPlan ? 'outlined' : 'contained'}
                          sx={{
                            background: isCurrentPlan
                              ? 'transparent'
                              : isPremium
                                ? `linear-gradient(135deg, ${C.blue}, #10b981)`
                                : C.blue,
                            color: isCurrentPlan ? C.blue : '#fff',
                            border: isCurrentPlan ? `2px solid ${C.blue}` : 'none',
                            borderRadius: '12px',
                            py: 1.5,
                            fontWeight: 800,
                            textTransform: 'none',
                            fontSize: '14px',
                            '&:hover': {
                              opacity: isCurrentPlan ? 1 : 0.9,
                            },
                          }}
                          endIcon={!isCurrentPlan && <ArrowForwardRounded />}
                        >
                          {isCurrentPlan ? 'Current Plan' : 'Upgrade Now'}
                        </Button>
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>

          {/* FAQ Section */}
          <Box
            sx={{
              background: `${C.blue}08`,
              border: `1px solid ${C.border}`,
              borderRadius: '20px',
              p: { xs: 3, md: 6 },
              textAlign: 'center',
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
              Have Questions?
            </Typography>
            <Typography sx={{ color: C.textSub, mb: 4 }}>
              All plans include institutional-grade credit monitoring at no extra cost. Upgrade anytime to unlock premium features.
            </Typography>
            <Button
              component={Link}
              href="/contact"
              variant="contained"
              sx={{
                background: C.blue,
                color: '#fff',
                borderRadius: '12px',
                px: 6,
                py: 1.5,
                fontWeight: 800,
                textTransform: 'none',
                fontSize: '14px',
              }}
            >
              Contact Support
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onClose={() => setShowUpgradeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 900, fontSize: '20px', color: C.text }}>
          Confirm Upgrade
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ color: C.textSub, mb: 2 }}>
              You're about to upgrade to the <strong>{selectedPlan?.name}</strong> plan.
            </Typography>
            <Typography sx={{ color: C.textSub, mb: 4 }}>
              <strong>GH₵{selectedPlan && getPrice(selectedPlan)}</strong> will be charged {billingCycle === 'monthly' ? 'monthly' : 'annually'}.
            </Typography>
            <Typography sx={{ color: C.textMuted, fontSize: '12px' }}>
              You can change your plan anytime. Unused credits will be prorated.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowUpgradeDialog(false)} sx={{ color: C.textSub }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmUpgrade}
            variant="contained"
            disabled={isUpgrading}
            sx={{
              background: C.blue,
              color: '#fff',
            }}
          >
            {isUpgrading ? 'Upgrading...' : 'Confirm Upgrade'}
          </Button>
        </DialogActions>
      </Dialog>
    </PortalShell>
  );
}
