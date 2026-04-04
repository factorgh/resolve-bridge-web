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
      { label: 'Personal Loans', desc: 'Rates from 50+ lenders' },
      { label: 'Business Loans', desc: 'Capital for African SMEs' },
      { label: 'Auto Loans', desc: 'Fleet & personal financing' },
    ],
  },
  {
    label: 'Business',
    children: [
      { label: 'SME Credit', desc: 'Revolving credit lines' },
      { label: 'Payroll Finance', desc: 'Staff payment solutions' },
    ],
  },
  {
    label: 'Mortgages',
    children: [
      { label: 'Home Loans', desc: 'Buy or build your home' },
      { label: 'Home Equity', desc: 'Unlock your property value' },
    ],
  },
  {
    label: 'Credit Cards',
    children: [
      { label: 'Retail Cards', desc: 'Everyday spending rewards' },
      { label: 'Corporate Cards', desc: 'Business expense management' },
    ],
  },
  {
    label: 'Insurance',
    children: [
      { label: 'Health Cover', desc: 'Individual & team plans' },
      { label: 'Life Insurance', desc: 'Protect what matters' },
      { label: 'Auto Insurance', desc: 'Comprehensive vehicle cover' },
    ],
  },
  {
    label: 'Resolve Group',
    children: [
      { label: 'Resolve Capital', desc: 'Institutional liquidity solutions' },
      { label: 'Resolve Insurance', desc: 'Comprehensive risk management' },
      { label: 'Resolve Vehicles', desc: 'Asset financing & logistics' },
      { label: 'Resolve Health', desc: 'Global medical coverage' },
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
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-[13.5px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
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
            className="absolute top-[calc(100%+8px)] left-0 z-50 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/60 p-2 min-w-[220px]"
          >
            {item.children.map((child) => (
              <Link
                key={child.label}
                href="#"
                className="flex flex-col gap-0.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <span className="text-[13.5px] font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">
                  {child.label}
                </span>
                <span className="text-[11.5px] text-slate-400 font-medium">{child.desc}</span>
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
      className={`fixed top-0 left-0 right-0 z-[1000] h-[68px] flex items-center transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm shadow-slate-100'
          : 'bg-white border-b border-slate-100'
      }`}
    >
      <Container maxWidth="xl">
        <Box className="flex items-center justify-between">

          {/* Left: Logo + Nav links */}
          <Stack direction="row" alignItems="center" spacing={1}>
            {/* Logo */}
            <Link href="/" className="flex items-center mr-6">
                <img
                  src="/images/resolve_logo.png"
                  alt="ResolveBridge"
                  className="h-8 w-auto object-contain"
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
                  color: '#475569',
                  px: 2,
                  py: 1,
                  borderRadius: '10px',
                  '&:hover': { backgroundColor: '#f8fafc', color: '#0f172a' },
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
                  backgroundColor: '#0a1e2b',
                  color: '#fff',
                  px: 2.5,
                  py: 1,
                  borderRadius: '10px',
                  boxShadow: 'none',
                  '&:hover': { backgroundColor: '#10b981', boxShadow: 'none' },
                  transition: 'background-color 0.2s',
                }}
              >
                Get Started
              </Button>
            </Box>

            {/* Mobile hamburger */}
            <IconButton
              sx={{ display: { xs: 'flex', lg: 'none' }, color: '#0a1e2b' }}
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
            backgroundColor: '#fff',
            boxShadow: '-4px 0 40px rgba(0,0,0,0.08)',
          },
        }}
      >
        <Box className="flex flex-col h-full">
          {/* Drawer header */}
          <Box className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <Link href="/" className="" onClick={() => setMobileOpen(false)}>
              <img src="/images/resolve_logo.png" alt="ResolveBridge" className="h-7 w-auto object-contain" />
            </Link>
            <IconButton onClick={() => setMobileOpen(false)} sx={{ color: '#64748b' }}>
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
                      '&:hover': { backgroundColor: '#f8fafc' },
                    }}
                  >
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#0f172a',
                      }}
                    />
                    <motion.span
                      animate={{ rotate: openMobileItem === item.label ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDownIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                    </motion.span>
                  </ListItemButton>

                  <Collapse in={openMobileItem === item.label}>
                    <Box className="ml-3 mb-2 pl-3 border-l-2 border-slate-100">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href="#"
                          onClick={() => setMobileOpen(false)}
                          className="flex flex-col gap-0.5 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                          <span className="text-[13px] font-semibold text-slate-700">
                            {child.label}
                          </span>
                          <span className="text-[11.5px] text-slate-400">{child.desc}</span>
                        </Link>
                      ))}
                    </Box>
                  </Collapse>
                </Box>
              ))}
            </List>
          </Box>

          {/* Drawer footer actions */}
          <Box className="px-4 py-5 border-t border-slate-100 flex flex-col gap-2.5">
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
                borderColor: '#e2e8f0',
                color: '#0f172a',
                py: 1.25,
                '&:hover': { borderColor: '#10b981', color: '#10b981', backgroundColor: 'transparent' },
              }}
            >
              Log in
            </Button>
            <Button
              component={Link}
              href="/get-started"
              fullWidth
              variant="contained"
              disableElevation
              onClick={() => setMobileOpen(false)}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '14px',
                borderRadius: '12px',
                backgroundColor: '#0a1e2b',
                color: '#fff',
                py: 1.25,
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#10b981', boxShadow: 'none' },
              }}
            >
              Get Started →
            </Button>
          </Box>
        </Box>
      </Drawer>
    </nav>
  );
}