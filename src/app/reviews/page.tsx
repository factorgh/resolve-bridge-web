'use client';

import { Box, Container, Typography, Grid, Card, Avatar, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { StarRounded, VerifiedUserRounded, ArrowBackRounded } from '@mui/icons-material';
import Link from 'next/link';

const REVIEWS = [
  {
    name: "Kwame Mensah",
    role: "Small Business Owner",
    rating: 5,
    text: "ResolveBridge completely changed how I secure funding. I compared 5 banks in 10 minutes and saved thousands on my new business loan.",
    date: "2 days ago",
    bank: "Ecobank",
    avatar: "/images/avatars/1.jpg" // placeholder
  },
  {
    name: "Sarah Osei",
    role: "Homeowner",
    rating: 5,
    text: "The institutional reach is unmatched. I got a mortgage rate that my own primary bank refused to offer me directly. Incredible platform.",
    date: "1 week ago",
    bank: "Absa Bank",
    avatar: "/images/avatars/2.jpg" // placeholder
  },
  {
    name: "Emmanuel Addo",
    role: "Freelance Consultant",
    rating: 4,
    text: "Very transparent process. The liquidity calculator showed me exactly what I could afford before I even applied. Highly recommended.",
    date: "2 weeks ago",
    bank: "Stanbic Bank",
    avatar: "/images/avatars/3.jpg" // placeholder
  },
  {
    name: "Grace Appiah",
    role: "Logistics Manager",
    rating: 5,
    text: "Securing vehicle finance used to take weeks. With ResolveBridge, I had three pre-approved offers within 48 hours.",
    date: "1 month ago",
    bank: "Fidelity Bank",
    avatar: "/images/avatars/4.jpg" // placeholder
  }
];

export default function ReviewsPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', overflowX: 'hidden' }}>
      {/* Header */}
      <Box sx={{ background: '#0a1e2b', color: '#fff', py: 12, position: 'relative', overflow: 'hidden' }}>
        <div className="absolute top-0 right-0 w-[600px] h-full bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.15),_transparent)] pointer-events-none" />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Button startIcon={<ArrowBackRounded />} sx={{ color: 'rgba(255,255,255,0.7)', mb: 4, '&:hover': { color: '#fff' } }}>
              Back to Home
            </Button>
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.15em', mb: 2 }}>
              Verified Audits
            </Typography>
            <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '4rem' }, fontWeight: 900, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.04em', lineHeight: 1.1, mb: 3 }}>
              Don't just take our <br/>
              <span style={{ color: '#10b981' }}>word for it.</span>
            </Typography>
            <Typography sx={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', maxWidth: '600px', lineHeight: 1.6, mb: 6 }}>
              Read verified audits and reviews from thousands of Africans who have used ResolveBridge to secure the best institutional rates on the market.
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StarRounded sx={{ color: '#fbbf24', fontSize: 32 }} />
                <Typography sx={{ fontSize: '28px', fontWeight: 900, ml: 1, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>4.9</Typography>
              </Box>
              <Box sx={{ height: 32, width: '1px', background: 'rgba(255,255,255,0.2)' }} />
              <Typography sx={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                Based on <span style={{ color: '#fff', fontWeight: 800 }}>12,450+</span> reviews
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Reviews Grid */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Grid container spacing={4}>
          {REVIEWS.map((review, i) => (
            <Grid size={{ xs: 12, md: 6 }} key={i}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ height: '100%' }}
              >
                <Card sx={{ p: 5, borderRadius: '24px', boxShadow: '0 12px 40px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {[...Array(review.rating)].map((_, j) => <StarRounded key={j} sx={{ color: '#10b981', fontSize: 20 }} />)}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, background: '#f1f5f9', px: 1.5, py: 0.5, borderRadius: '8px' }}>
                      <VerifiedUserRounded sx={{ color: '#3b82f6', fontSize: 14 }} />
                      <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verified User</Typography>
                    </Box>
                  </Box>
                  
                  <Typography sx={{ fontSize: '16px', color: '#334155', lineHeight: 1.7, flex: 1, mb: 4, fontWeight: 500 }}>
                    "{review.text}"
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', pt: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 48, height: 48, background: '#e2e8f0', color: '#64748b', fontWeight: 800 }}>
                        {review.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{review.name}</Typography>
                        <Typography sx={{ fontSize: '12px', color: '#64748b' }}>{review.role}</Typography>
                      </Box>
                    </Box>
                    <Typography sx={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>{review.date}</Typography>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Button variant="outlined" sx={{ borderRadius: '16px', py: 1.5, px: 4, textTransform: 'none', fontWeight: 700, borderColor: '#cbd5e1', color: '#475569', '&:hover': { background: '#f1f5f9', borderColor: '#94a3b8' } }}>
            Load More Reviews
          </Button>
        </Box>
      </Container>
    </main>
  );
}
