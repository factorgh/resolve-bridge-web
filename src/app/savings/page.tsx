'use client';

import { Box, Container, Typography } from '@mui/material';
import PortalShell from '../portal/components/PortalShell';

export default function SavingsPage() {
  return (
    <PortalShell title="Savings & Investments" backHref="/">
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Box sx={{ fontSize: 64, mb: 2 }}>💰</Box>
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>Savings & Investments</Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: 18, mb: 4 }}>
          Compare high-yield savings and fixed deposit accounts across 15+ banks. Our investment marketplace is launching shortly.
        </Typography>
      </Container>
    </PortalShell>
  );
}
