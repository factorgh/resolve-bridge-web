'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  MenuRounded as MenuIcon,
  CloseRounded as XIcon,
  KeyboardArrowDownRounded as ChevronDownIcon,
  ArrowForwardRounded,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  IconButton,
  Typography,
  Stack,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  {
    label: 'Loans',
    children: [
      { label: 'Personal Loans', desc: 'Rates from 50+ lenders', href: '/loans/personal' },
      { label: 'Business Loans', desc: 'Capital for African SMEs', href: '/loans/business' },
      { label: 'Auto Loans', desc: 'Fleet & personal financing', href: '/loans/auto' },
    ],
  },
  {
    label: 'Business',
    children: [
      { label: 'SME Credit', desc: 'Revolving credit lines', href: '/business/sme-credit' },
      { label: 'Payroll Finance', desc: 'Staff payment solutions', href: '/business/payroll' },
    ],
  },
  {
    label: 'Mortgages',
    children: [
      { label: 'Home Loans', desc: 'Buy or build your home', href: '/mortgages/home' },
      { label: 'Home Equity', desc: 'Unlock your property value', href: '/mortgages/equity' },
    ],
  },
  {
    label: 'Insurance',
    children: [
      { label: 'Health Cover', desc: 'Individual & team plans', href: '/insurance/health' },
      { label: 'Life Insurance', desc: 'Protect what matters', href: '/insurance/life' },
      { label: 'Auto Insurance', desc: 'Comprehensive vehicle cover', href: '/insurance/auto' },
    ],
  },
  {
    label: 'Resolve Group',
    children: [
      { label: 'Resolve Capital', desc: 'Institutional liquidity solutions', href: '/resolve-group/capital' },
      { label: 'Resolve Insurance', desc: 'Comprehensive risk management', href: '/resolve-group/insurance' },
      { label: 'Resolve Vehicles', desc: 'Asset financing & logistics', href: '/resolve-group/vehicles' },
      { label: 'Resolve Health', desc: 'Global medical coverage', href: '/resolve-group/health' },
    ],
  },
];

function DropdownMenu({ item }: { item: (typeof NAV_ITEMS)[0] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <Box ref={ref} className="relative">
      <button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-[13.5px] font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-all"
      >
        {item.label}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDownIcon sx={{ fontSize: 15, display: 'block' }} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            className="absolute top-[calc(100%+8px)] left-0 z-50 bg-[#0b121f] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-2 min-w-[240px] backdrop-blur-xl"
          >
            {item.children.map((child) => (
              <Link
                key={child.label}
                href={child.href}
                className="flex flex-col gap-0.5 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                onClick={() => setOpen(false)}
              >
                <span className="text-[13.5px] font-semibold text-white/90 group-hover:text-emerald-400 transition-colors">
                  {child.label}
                </span>
                <span className="text-[11.5px] text-white/40 font-medium">{child.desc}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileItem, setOpenMobileItem] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[1000] h-[72px] flex items-center transition-all duration-300 ${
        scrolled
          ? 'bg-[#04080f]/90 backdrop-blur-lg border-b border-white/10 shadow-lg'
          : 'bg-[#04080f] border-b border-white/5'
      }`}
    >
      <Container maxWidth="xl">
        <Box className="flex items-center justify-between">

          {/* Left: Logo + Nav links */}
          <Stack direction="row" alignItems="center" spacing={1}>
            {/* Logo */}
            {/* Logo */}
            <Link href="/" className="flex items-center mr-8 no-underline" onClick={() => setMobileOpen(false)}>
                <img
                  src="/images/resolve_logo.png"
                  alt="ResolveBridge"
                  className="h-9 w-auto object-contain"
                  style={{ 
                    filter: 'invert(1) contrast(150%) brightness(1.2)', 
                    mixBlendMode: 'screen' 
                  }}
                />
            </Link>

            {/* Desktop Nav */}
            <Box sx={{ display: { xs: 'none', lg: 'flex' } }} className="items-center gap-0.5">
              {NAV_ITEMS.map((item) => (
                <DropdownMenu key={item.label} item={item} />
              ))}
            </Box>
          </Stack>

          {/* Right: Actions */}
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }} className="items-center gap-2">
              <Button
                component={Link}
                href="/login"
                sx={{
                  textTransform: 'none',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.7)',
                  px: 2.5,
                  py: 1,
                  borderRadius: '10px',
                  fontFamily: "'Inter', sans-serif",
                  transition: 'all 0.2s',
                  '&:hover': { color: '#fff', backgroundColor: 'rgba(255,255,255,0.05)' },
                }}
              >
                Log in
              </Button>
              <Button
                component={Link}
                href="/get-started"
                variant="contained"
                disableElevation
                endIcon={<ArrowForwardRounded sx={{ fontSize: '14px !important' }} />}
                sx={{
                  textTransform: 'none',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  backgroundColor: '#10b981',
                  color: '#fff',
                  px: 3,
                  py: 1.1,
                  borderRadius: '10px',
                 
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)',
                  '&:hover': { backgroundColor: '#059669', boxShadow: 'none' },
                  transition: 'all 0.2s',
                }}
              >
                Get Started
              </Button>
            </Box>

            {/* Mobile hamburger */}
            <IconButton
              sx={{ display: { xs: 'flex', lg: 'none' }, color: '#fff' }}
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Stack>
        </Box>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 320,
            backgroundColor: '#04080f',
            boxShadow: '-4px 0 40px rgba(0,0,0,0.5)',
            borderLeft: '1px solid rgba(255,255,255,0.05)'
          },
        }}
      >
        <Box className="flex flex-col h-full">
          {/* Drawer header */}
          <Box className="flex items-center justify-between px-5 py-5 border-b border-white/5 bg-[#04080f]">
            <Link href="/" className="no-underline" onClick={() => setMobileOpen(false)}>
                <img 
                  src="/images/resolve_logo_full.png" 
                  alt="ResolveBridge" 
                  className="h-7 w-auto object-contain" 
                  style={{ 
                    filter: 'invert(1) contrast(150%) brightness(1.2)', 
                    mixBlendMode: 'screen' 
                  }}
                />
            </Link>
            <IconButton onClick={() => setMobileOpen(false)} sx={{ color: 'rgba(255,255,255,0.6)' }}>
              <XIcon />
            </IconButton>
          </Box>

          {/* Drawer nav items */}
          <Box className="flex-1 overflow-y-auto px-3 py-4">
            <List disablePadding>
              {NAV_ITEMS.map((item) => (
                <Box key={item.label}>
                  <ListItemButton
                    onClick={() =>
                      setOpenMobileItem(openMobileItem === item.label ? null : item.label)
                    }
                    sx={{
                      borderRadius: '12px',
                      mb: 0.5,
                      px: 2,
                      py: 1.25,
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' },
                    }}
                  >
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.9)',
                      }}
                    />
                    <motion.span
                      animate={{ rotate: openMobileItem === item.label ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDownIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.4)' }} />
                    </motion.span>
                  </ListItemButton>

                  <Collapse in={openMobileItem === item.label}>
                    <Box className="ml-3 mb-2 pl-3 border-l-2 border-white/10">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex flex-col gap-0.5 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
                        >
                          <span className="text-[13px] font-semibold text-white/90">
                            {child.label}
                          </span>
                          <span className="text-[11.5px] text-white/40">{child.desc}</span>
                        </Link>
                      ))}
                    </Box>
                  </Collapse>
                </Box>
              ))}
            </List>
          </Box>

          {/* Drawer footer actions */}
          <Box className="px-4 py-6 border-t border-white/5 flex flex-col gap-3 bg-[#04080f]">
            <Button
              component={Link}
              href="/login"
              fullWidth
              variant="outlined"
              onClick={() => setMobileOpen(false)}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '14px',
                borderRadius: '12px',
                borderColor: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.8)',
                py: 1.2,
                '&:hover': { borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff' }
              }}
            >
              Log in
            </Button>
            <Button
              component={Link}
              href="/portal"
              fullWidth
              variant="contained"
              onClick={() => setMobileOpen(false)}
              sx={{
                textTransform: 'none',
                fontWeight: 800,
                fontSize: '14px',
                borderRadius: '12px',
                backgroundColor: '#10b981',
                color: '#fff',
                py: 1.5,
                '&:hover': { backgroundColor: '#059669' },
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
              }}
            >
              Get Started
            </Button>
          </Box>
        </Box>
      </Drawer>
    </nav>
  );
}