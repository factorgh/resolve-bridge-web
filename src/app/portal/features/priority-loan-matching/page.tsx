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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  TimelineRounded,
  CheckCircleRounded,
  SpeedRounded,
  OfflineBoltRounded,
  ArrowForwardRounded,
  SupportAgentRounded,
} from '@mui/icons-material';
import { useGetPremiumFeaturesQuery, useGetUserSubscriptionQuery } from '@/lib/redux/api/subscriptionApi';
import PortalShell, { C, F } from '../../components/PortalShell';

export default function PriorityLoanMatchingPage() {
  const { data: featuresData } = useGetPremiumFeaturesQuery();
  const { data: subscriptionData } = useGetUserSubscriptionQuery();

  const features = featuresData?.data;
  const subscription = subscriptionData?.data;
  const isFeatureEnabled = features?.prioritySupport;

  const lenders = [
    { name: 'Apex Capital Trust', stdTime: '48 hrs', priTime: '2 hrs', priorityRate: '98%', status: 'Active' },
    { name: 'BridgeMutual Finance', stdTime: '24 hrs', priTime: '1 hr', priorityRate: '95%', status: 'Active' },
    { name: 'Vanguard Credit Union', stdTime: '72 hrs', priTime: '4 hrs', priorityRate: '92%', status: 'Active' },
    { name: 'Elevate SME Lenders', stdTime: '36 hrs', priTime: '2 hrs', priorityRate: '96%', status: 'Active' },
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
              Priority Loan Matching is included with Standard and above subscription plans. Upgrade your plan to access this feature.
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
              Priority Loan Matching
            </Typography>
            <Typography sx={{ color: C.textSub, fontSize: '16px', mb: 4 }}>
              Unlock accelerated review times and priority routing to top institutional lenders. Skip the general queue and get decisions in hours, not days.
            </Typography>
          </Box>

          {/* Quick Stats Grid */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ border: `1px solid ${C.border}`, borderRadius: '20px', p: 3, background: C.surface }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Box sx={{ p: 1.5, background: '#14b8a615', color: '#14b8a6', borderRadius: '12px' }}>
                    <SpeedRounded fontSize="large" />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '12px', color: C.textMuted, fontWeight: 800 }}>DECISION SPEED</Typography>
                    <Typography sx={{ fontSize: '24px', fontWeight: 900, color: C.text }}>Up to 24x Faster</Typography>
                  </Box>
                </Stack>
                <Typography sx={{ fontSize: '13px', color: C.textSub }}>
                  Your applications are flagged as "Priority VIP" and automatically fast-tracked by underwriter APIs.
                </Typography>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ border: `1px solid ${C.border}`, borderRadius: '20px', p: 3, background: C.surface }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Box sx={{ p: 1.5, background: '#3b82f615', color: '#3b82f6', borderRadius: '12px' }}>
                    <OfflineBoltRounded fontSize="large" />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '12px', color: C.textMuted, fontWeight: 800 }}>QUEUE STATUS</Typography>
                    <Typography sx={{ fontSize: '24px', fontWeight: 900, color: '#3b82f6' }}>Fast-Track Active</Typography>
                  </Box>
                </Stack>
                <Typography sx={{ fontSize: '13px', color: C.textSub }}>
                  All system requests and documents skip processing queues, giving you immediate underwriter attention.
                </Typography>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ border: `1px solid ${C.border}`, borderRadius: '20px', p: 3, background: C.surface }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Box sx={{ p: 1.5, background: '#10b98115', color: '#10b981', borderRadius: '12px' }}>
                    <SupportAgentRounded fontSize="large" />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '12px', color: C.textMuted, fontWeight: 800 }}>VIP INTEGRATION</Typography>
                    <Typography sx={{ fontSize: '24px', fontWeight: 900, color: '#10b981' }}>98% Approval Match</Typography>
                  </Box>
                </Stack>
                <Typography sx={{ fontSize: '13px', color: C.textSub }}>
                  Pre-filtered applications ensure matching only with lenders pre-screened to accept your credit parameters.
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Speed Comparison Table */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, color: C.text, mb: 3 }}>
              Institutional Lender Fast-Track Comparison
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: '20px', border: `1px solid ${C.border}`, boxShadow: 'none', background: C.surface }}>
              <Table>
                <TableHead sx={{ background: `${C.blue}05` }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800, color: C.text }}>Lender Partner</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: C.textMuted }}>Standard Review Time</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#14b8a6' }}>Priority Fast-Track Time</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: C.text }}>VIP Match Success Rate</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: C.text }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lenders.map((lender, i) => (
                    <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ fontWeight: 800, color: C.text }}>{lender.name}</TableCell>
                      <TableCell sx={{ color: C.textSub }}>{lender.stdTime}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#14b8a6' }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <OfflineBoltRounded fontSize="small" />
                          <span>{lender.priTime}</span>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 800, color: C.text }}>{lender.priorityRate}</TableCell>
                      <TableCell>
                        <Chip label={lender.status} size="small" sx={{ background: '#10b98120', color: '#10b981', fontWeight: 800 }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Quick Apply CTA */}
          <Card sx={{ background: `linear-gradient(135deg, ${C.blue}10 0%, #14b8a610 100%)`, border: `1px solid ${C.border}`, borderRadius: '20px', p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, color: C.text, mb: 2 }}>
              Ready to submit a Fast-Track Loan Application?
            </Typography>
            <Typography sx={{ color: C.textSub, mb: 4, maxWidth: 650 }}>
              Apply through our integrated portal features and witness the priority routing in action. We'll automatically package, format, and push your file to top-tier underwriters.
            </Typography>
            <Button
              href="/portal/loans/apply"
              variant="contained"
              endIcon={<ArrowForwardRounded />}
              sx={{
                background: C.blue,
                color: '#fff',
                borderRadius: '12px',
                px: 6,
                py: 2,
                fontWeight: 800,
                textTransform: 'none',
              }}
            >
              Start Priority Application
            </Button>
          </Card>
        </Container>
      </Box>
    </PortalShell>
  );
}
