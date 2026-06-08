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
  SchoolRounded,
  PlayCircleOutlineRounded,
  CalendarTodayRounded,
  QuizRounded,
  ArrowForwardRounded,
} from '@mui/icons-material';
import { useGetPremiumFeaturesQuery, useGetUserSubscriptionQuery } from '@/lib/redux/api/subscriptionApi';
import { toast } from 'react-hot-toast';
import PortalShell, { C, F } from '../../components/PortalShell';

export default function PremiumFinancialEducationPage() {
  const { data: featuresData } = useGetPremiumFeaturesQuery();
  const { data: subscriptionData } = useGetUserSubscriptionQuery();
  const [registeredWebinars, setRegisteredWebinars] = useState<number[]>([]);

  const features = featuresData?.data;
  const subscription = subscriptionData?.data;
  const isFeatureEnabled = features?.educationCourses;

  const courses = [
    { title: 'SME Financing & Capital Masterclass', lessons: 12, completed: 8, duration: '4h 15m' },
    { title: 'Debt Restructuring & Consolidation Strategies', lessons: 8, completed: 2, duration: '2h 45m' },
    { title: 'Understanding Credit Underwriting Rules', lessons: 6, completed: 6, duration: '1h 30m' },
  ];

  const webinars = [
    { id: 1, title: 'Navigating High Interest Environments in 2026', speaker: 'Dr. Evelyn Grant (Chief Economist)', date: 'June 12, 2026 at 3:00 PM GMT' },
    { id: 2, title: 'Optimizing Cash Reserves for Rapid Growth', speaker: 'Marcus Sterling (SME Financial Advisor)', date: 'June 18, 2026 at 11:00 AM GMT' },
  ];

  const handleRegister = (id: number, title: string) => {
    if (registeredWebinars.includes(id)) return;
    setRegisteredWebinars([...registeredWebinars, id]);
    toast.success(`Successfully registered for: ${title}`);
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
              Premium Financial Education is included with Premium and above subscription plans. Upgrade your plan to access this feature.
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
              Premium Financial Education
            </Typography>
            <Typography sx={{ color: C.textSub, fontSize: '16px', mb: 4 }}>
              Expand your financial acumen with expert-led courses, live exclusive webinars, and specialized business financing modules.
            </Typography>
          </Box>

          <Grid container spacing={4} sx={{ mb: 6 }}>
            {/* Courses Column */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, color: C.text, mb: 3 }}>
                Your Premium Courses
              </Typography>
              <Stack spacing={3}>
                {courses.map((course, i) => {
                  const percent = Math.round((course.completed / course.lessons) * 100);
                  return (
                    <Card key={i} sx={{ border: `1px solid ${C.border}`, borderRadius: '20px', p: 3, background: C.surface }}>
                      <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                        <Box sx={{ p: 1.5, background: '#ec489915', color: '#ec4899', borderRadius: '12px', flexShrink: 0 }}>
                          <SchoolRounded />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontWeight: 800, color: C.text, mb: 0.5, fontSize: '16px' }}>{course.title}</Typography>
                          <Typography sx={{ fontSize: '12px', color: C.textMuted }}>
                            {course.lessons} lessons • {course.duration}
                          </Typography>
                        </Box>
                        <Chip
                          label={percent === 100 ? 'Completed' : `${percent}% Done`}
                          size="small"
                          sx={{ background: percent === 100 ? '#10b98120' : C.border, color: percent === 100 ? '#10b981' : C.textSub, fontWeight: 800 }}
                        />
                      </Stack>
                      <Box sx={{ width: '100%', mb: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={percent}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            background: C.border,
                            '& .MuiLinearProgress-bar': { background: '#ec4899' },
                          }}
                        />
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        endIcon={<PlayCircleOutlineRounded />}
                        sx={{
                          borderColor: '#ec4899',
                          color: '#ec4899',
                          borderRadius: '8px',
                          fontWeight: 800,
                          textTransform: 'none',
                          '&:hover': { background: '#ec489910', borderColor: '#ec4899' },
                        }}
                      >
                        {percent === 100 ? 'Review Lessons' : 'Resume Course'}
                      </Button>
                    </Card>
                  );
                })}
              </Stack>
            </Grid>

            {/* Webinars Column */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, color: C.text, mb: 3 }}>
                Upcoming Live Webinars
              </Typography>
              <Stack spacing={3}>
                {webinars.map((webinar) => {
                  const isRegistered = registeredWebinars.includes(webinar.id);
                  return (
                    <Card key={webinar.id} sx={{ border: `1px solid ${C.border}`, borderRadius: '20px', p: 3, background: C.surface }}>
                      <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                        <Box sx={{ p: 1.5, background: `${C.blue}15`, color: C.blue, borderRadius: '12px', flexShrink: 0 }}>
                          <CalendarTodayRounded />
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 800, color: C.text, mb: 0.5, fontSize: '15px' }}>{webinar.title}</Typography>
                          <Typography sx={{ fontSize: '12px', color: C.textMuted, mb: 1 }}>{webinar.speaker}</Typography>
                          <Typography sx={{ fontSize: '11px', color: C.blue, fontWeight: 800 }}>{webinar.date}</Typography>
                        </Box>
                      </Stack>
                      <Button
                        fullWidth
                        variant={isRegistered ? 'contained' : 'outlined'}
                        disabled={isRegistered}
                        onClick={() => handleRegister(webinar.id, webinar.title)}
                        sx={{
                          borderRadius: '10px',
                          fontWeight: 800,
                          textTransform: 'none',
                          background: isRegistered ? '#10b981' : 'transparent',
                          color: isRegistered ? '#fff' : C.blue,
                          borderColor: isRegistered ? 'transparent' : C.blue,
                          '&:hover': { background: isRegistered ? '#10b981' : `${C.blue}10` },
                        }}
                      >
                        {isRegistered ? '✓ Registered' : 'Register Now'}
                      </Button>
                    </Card>
                  );
                })}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </PortalShell>
  );
}
