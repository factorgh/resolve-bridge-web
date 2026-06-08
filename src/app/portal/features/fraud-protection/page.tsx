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
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  SecurityRounded,
  NotificationsActiveRounded,
  CheckCircleRounded,
  WarningRounded,
  InfoRounded,
  ShieldRounded,
} from '@mui/icons-material';
import { useGetPremiumFeaturesQuery, useGetUserSubscriptionQuery } from '@/lib/redux/api/subscriptionApi';
import PortalShell, { C, F } from '../../components/PortalShell';

export default function FraudProtectionPage() {
  const { data: featuresData } = useGetPremiumFeaturesQuery();
  const { data: subscriptionData } = useGetUserSubscriptionQuery();

  const features = featuresData?.data;
  const subscription = subscriptionData?.data;
  const isFeatureEnabled = features?.fraudProtection;

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'unusual_activity',
      title: 'Unusual Activity Detected',
      description: 'Login attempt from unknown device in Lagos, Nigeria',
      timestamp: 'Today, 2:45 PM',
      severity: 'medium',
      action: 'Review',
      resolved: false,
    },
    {
      id: 2,
      type: 'new_account',
      title: 'New Account Application',
      description: 'A new financial account was linked to your profile',
      timestamp: 'Yesterday, 10:30 AM',
      severity: 'low',
      action: 'Confirm',
      resolved: true,
    },
  ]);

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: true,
    pushAlerts: true,
    unusualActivity: true,
    newApplications: true,
    largeTransactions: true,
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  const securityTips = [
    {
      icon: <ShieldRounded />,
      title: 'Strong Passwords',
      description: 'Use 12+ characters with mixed case, numbers, and symbols',
    },
    {
      icon: <NotificationsActiveRounded />,
      title: 'Enable 2FA',
      description: 'Add an extra security layer with two-factor authentication',
    },
    {
      icon: <CheckCircleRounded />,
      title: 'Monitor Activity',
      description: 'Review login activity regularly for unauthorized access',
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
              Fraud Protection Alerts is a premium feature. Upgrade to {subscription?.name} or higher for real-time fraud monitoring.
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
              Fraud Protection Alerts
            </Typography>
            <Typography sx={{ color: C.textSub, fontSize: '16px', mb: 4 }}>
              Real-time monitoring and alerts to protect your account from fraudulent activities and unauthorized access.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Alerts Section */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Box sx={{ mb: 6 }}>
                <Typography sx={{ fontSize: '18px', fontWeight: 900, color: C.text, mb: 3 }}>
                  Recent Security Events
                </Typography>
                <Stack spacing={2}>
                  {alerts.map((alert, i) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card
                        sx={{
                          border: `1px solid ${alert.severity === 'medium' ? '#f59e0b30' : '#10b98130'}`,
                          background: alert.severity === 'medium' ? '#f59e0b08' : '#10b98108',
                          borderRadius: '16px',
                          p: 3,
                        }}
                      >
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          justifyContent="space-between"
                          alignItems={{ xs: 'flex-start', sm: 'center' }}
                          spacing={2}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 1 }}>
                              <Box
                                sx={{
                                  background:
                                    alert.severity === 'medium'
                                      ? '#f59e0b20'
                                      : '#10b98120',
                                  color:
                                    alert.severity === 'medium'
                                      ? '#f59e0b'
                                      : '#10b981',
                                  p: 1,
                                  borderRadius: '8px',
                                }}
                              >
                                <WarningRounded sx={{ fontSize: 18 }} />
                              </Box>
                              <Box>
                                <Typography sx={{ fontWeight: 800, color: C.text, mb: 0.5 }}>
                                  {alert.title}
                                </Typography>
                                <Typography sx={{ fontSize: '13px', color: C.textSub }}>
                                  {alert.description}
                                </Typography>
                                <Typography sx={{ fontSize: '11px', color: C.textMuted, mt: 1 }}>
                                  {alert.timestamp}
                                </Typography>
                              </Box>
                            </Stack>
                          </Box>
                          <Chip
                            label={alert.action}
                            sx={{
                              background: C.blue,
                              color: '#fff',
                              fontWeight: 800,
                              cursor: 'pointer',
                            }}
                          />
                        </Stack>
                      </Card>
                    </motion.div>
                  ))}
                </Stack>
              </Box>

              {/* Security Tips */}
              <Box>
                <Typography sx={{ fontSize: '18px', fontWeight: 900, color: C.text, mb: 3 }}>
                  Security Best Practices
                </Typography>
                <Grid container spacing={2}>
                  {securityTips.map((tip, i) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card sx={{ border: `1px solid ${C.border}`, borderRadius: '16px', p: 3, height: '100%' }}>
                          <Box sx={{ color: C.blue, mb: 2, fontSize: 24 }}>
                            {tip.icon}
                          </Box>
                          <Typography sx={{ fontWeight: 800, color: C.text, mb: 1 }}>
                            {tip.title}
                          </Typography>
                          <Typography sx={{ fontSize: '13px', color: C.textSub, lineHeight: 1.5 }}>
                            {tip.description}
                          </Typography>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>

            {/* Settings Panel */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ border: `1px solid ${C.border}`, borderRadius: '16px', p: 3, position: 'sticky', top: 20 }}>
                <Typography sx={{ fontSize: '18px', fontWeight: 900, color: C.text, mb: 3 }}>
                  Alert Settings
                </Typography>

                <Stack spacing={0.5} sx={{ mb: 4 }}>
                  <Typography sx={{ fontSize: '12px', fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', mb: 2 }}>
                    Notification Channels
                  </Typography>
                  <FormControlLabel
                    control={<Switch checked={notifications.emailAlerts} onChange={() => handleToggle('emailAlerts')} />}
                    label={
                      <Typography sx={{ fontSize: '14px', color: C.text, fontWeight: 600 }}>
                        Email Alerts
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    control={<Switch checked={notifications.smsAlerts} onChange={() => handleToggle('smsAlerts')} />}
                    label={
                      <Typography sx={{ fontSize: '14px', color: C.text, fontWeight: 600 }}>
                        SMS Alerts
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    control={<Switch checked={notifications.pushAlerts} onChange={() => handleToggle('pushAlerts')} />}
                    label={
                      <Typography sx={{ fontSize: '14px', color: C.text, fontWeight: 600 }}>
                        Push Notifications
                      </Typography>
                    }
                  />
                </Stack>

                <Box sx={{ borderTop: `1px solid ${C.border}`, pt: 3 }}>
                  <Typography sx={{ fontSize: '12px', fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', mb: 2 }}>
                    Alert Types
                  </Typography>
                  <FormControlLabel
                    control={<Switch checked={notifications.unusualActivity} onChange={() => handleToggle('unusualActivity')} />}
                    label={
                      <Typography sx={{ fontSize: '13px', color: C.text, fontWeight: 600 }}>
                        Unusual Activity
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    control={<Switch checked={notifications.newApplications} onChange={() => handleToggle('newApplications')} />}
                    label={
                      <Typography sx={{ fontSize: '13px', color: C.text, fontWeight: 600 }}>
                        New Applications
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    control={<Switch checked={notifications.largeTransactions} onChange={() => handleToggle('largeTransactions')} />}
                    label={
                      <Typography sx={{ fontSize: '13px', color: C.text, fontWeight: 600 }}>
                        Large Transactions
                      </Typography>
                    }
                  />
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    background: C.blue,
                    color: '#fff',
                    borderRadius: '12px',
                    mt: 3,
                    py: 1.5,
                    fontWeight: 800,
                    textTransform: 'none',
                  }}
                >
                  Save Settings
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </PortalShell>
  );
}
