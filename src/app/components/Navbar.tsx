'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MenuRounded as MenuIcon, 
  CloseRounded as XIcon, 
  KeyboardArrowDownRounded as ChevronDownIcon, 
  DirectionsCarRounded as CarIcon, 
  CreditCardRounded as CreditCardIcon, 
  BoltRounded as BoltIcon, 
  ShieldRounded as ShieldIcon, 
  PublicRounded as PublicIcon, 
  CalculateRounded as CalculatorIcon, 
  TrendingUpRounded as TrendingUpIcon, 
  BusinessRounded as BusinessIcon,
  SearchRounded,
  NorthEastRounded
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Button,
  Collapse,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Paper,
  Grid,
  Stack,
  Avatar
} from '@mui/material';

interface NavChild {
  href: string;
  icon: any;
  title: string;
  desc: string;
  color: string;
}

interface NavItem {
  label: string;
  href?: string;
  children?: NavChild[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Features', href: '/features' },
  {
    label: 'Solutions',
    children: [
      { href: '/loans',       icon: <CreditCardIcon />,  title: 'Credit & Loans',   desc: 'Scale with tailored financing',     color: '#2563eb' },
      { href: '/calculator',  icon: <CalculatorIcon />,  title: 'Loan Calculator',  desc: 'Calculate your repayment profile',  color: '#7c3aed' },
      { href: '/bnpl',        icon: <BoltIcon />,         title: 'BNPL Plans',       desc: 'Buy now pay later for retail',      color: '#f59e0b' },
      { href: '/insurance',   icon: <ShieldIcon />,      title: 'Insurance Hub',    desc: 'Covering auto, health & life',      color: '#ec4899' },
      { href: '/solutions',   icon: <PublicIcon />,       title: 'Payments Hub',     desc: 'Global merchant settlements',       color: '#10b981' },
      { href: '/get-started', icon: <TrendingUpIcon />,  title: 'Merchant Hub',     desc: 'Scale your retail footprint',       color: '#06b6d4' },
    ],
  },
  {
    label: 'Resolve Group',
    children: [
      { href: '/resolve-vehicles', icon: <CarIcon />,       title: 'Resolve Vehicles', desc: 'Browse our vehicle marketplace', color: '#3b82f6' },
      { href: '/about',            icon: <BusinessIcon />, title: 'About Us',         desc: 'Our story, mission & team',      color: '#8b5cf6' },
    ],
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${scrolled ? 'py-2' : 'py-4 md:py-6'}`}>
      <Container maxWidth="lg">
        <Box 
          className={`flex items-center justify-between px-4 md:px-6 py-3 rounded-[32px] transition-all duration-500 ${
            scrolled ? 'bg-white/80 backdrop-blur-2xl shadow-xl shadow-blue-900/5' : 'bg-white/40 backdrop-blur-md border border-white/20'
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
            <Box className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:rotate-6 transition-transform">
              <img src="/resolve_icon.png" alt="Resolve" className="w-5 h-5 md:w-6 md:h-6 object-contain" />
            </Box>
            <Typography variant="h6" className="font-black tracking-tighter text-slate-900 text-lg md:text-xl">
              Resolve<span className="text-blue-600 italic">Bridge</span>
            </Typography>
          </Link>

          {/* Desktop Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }} className="items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Box key={item.label} className="relative group">
                {item.children ? (
                  <>
                    <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-600 hover:text-blue-600 rounded-xl transition-colors">
                      {item.label}
                      <ChevronDownIcon sx={{ fontSize: 16, transition: 'transform 0.2s' }} className="group-hover:rotate-180" />
                    </button>
                    {/* Megamenu */}
                    <Box className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <Paper className="w-[600px] p-6 rounded-[32px] border border-slate-100 shadow-2xl backdrop-blur-xl bg-white/95">
                        <Grid container spacing={2}>
                          {item.children.map((child) => (
                            <Grid size={{ xs: 6 }} key={child.href}>
                              <Link href={child.href} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group/item">
                                <Box 
                                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover/item:scale-110"
                                  style={{ backgroundColor: `${child.color}15`, color: child.color }}
                                >
                                  {child.icon}
                                </Box>
                                <Box>
                                  <Typography className="font-black text-sm text-slate-900 mb-0.5">{child.title}</Typography>
                                  <Typography className="text-[11px] font-medium text-slate-400 leading-tight">{child.desc}</Typography>
                                </Box>
                              </Link>
                            </Grid>
                          ))}
                        </Grid>
                      </Paper>
                    </Box>
                  </>
                ) : (
                  <Link href={item.href!} className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-blue-600 rounded-xl transition-colors">
                    {item.label}
                  </Link>
                )}
              </Box>
            ))}
          </Box>

          {/* Actions */}
          <Box className="flex items-center gap-2">
            <Box sx={{ display: { xs: 'none', sm: 'flex' } }} className="items-center gap-3">
              <Link href="/login" className="text-sm font-black text-slate-900 hover:text-blue-600 px-4 py-2 transition-colors">
                Sign In
              </Link>
              <Button 
                component={Link}
                href="/get-started"
                variant="contained" 
                disableElevation
                className="rounded-2xl px-6 py-2.5 bg-slate-900 hover:bg-blue-600 text-white font-black text-sm lowercase transition-all"
                sx={{ textTransform: 'none' }}
              >
                Get Started
              </Button>
            </Box>
            
            <IconButton 
              sx={{ display: { xs: 'flex', md: 'none' } }}
              className="text-slate-900 p-2" 
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          className: "w-full max-w-[340px] rounded-l-[48px] p-8 bg-white border-l border-slate-100"
        }}
      >
        <Box className="flex items-center justify-between mb-12">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Box className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <img src="/resolve_icon.png" alt="Resolve" className="w-6 h-6 object-contain" />
            </Box>
            <Typography variant="h6" className="font-black tracking-tighter text-slate-900">
              Resolve<span className="text-blue-600 italic">Bridge</span>
            </Typography>
          </Link>
          <IconButton onClick={() => setMobileOpen(false)} className="bg-slate-50 text-slate-900">
            <XIcon />
          </IconButton>
        </Box>

        <Box className="flex-grow overflow-y-auto pb-8">
          <List disablePadding>
            {NAV_ITEMS.map((item) => (
              <Box key={item.label} className="mb-2">
                {item.children ? (
                  <>
                    <ListItem disablePadding>
                      <ListItemButton 
                        onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                        className="rounded-2xl py-4 bg-slate-50/50"
                      >
                        <ListItemText 
                          primary={item.label} 
                          primaryTypographyProps={{ className: "font-black text-slate-900 text-lg" }} 
                        />
                        <ChevronDownIcon sx={{ fontSize: 20, transition: 'transform 0.3s' }} className={openDropdown === item.label ? 'rotate-180 text-blue-600' : 'text-slate-400'} />
                      </ListItemButton>
                    </ListItem>
                    <AnimatePresence>
                      {openDropdown === item.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <List disablePadding className="pl-2 pt-2">
                            {item.children.map((child) => (
                              <ListItem key={child.href} disablePadding className="mb-1">
                                <ListItemButton 
                                  component={Link} 
                                  href={child.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="rounded-2xl py-4 group"
                                >
                                  <ListItemIcon className="min-w-[48px]">
                                    <Avatar 
                                      className="w-10 h-10 rounded-xl transition-all group-hover:bg-blue-600 group-hover:text-white"
                                      style={{ backgroundColor: `${child.color}15`, color: child.color }}
                                    >
                                      {child.icon}
                                    </Avatar>
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary={child.title} 
                                    secondary={child.desc}
                                    primaryTypographyProps={{ className: "font-black text-slate-900" }}
                                    secondaryTypographyProps={{ className: "text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-0.5" }}
                                  />
                                </ListItemButton>
                              </ListItem>
                            ))}
                          </List>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <ListItem disablePadding>
                    <ListItemButton 
                      component={Link} 
                      href={item.href!}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-2xl py-4 bg-slate-50/50"
                    >
                      <ListItemText 
                        primary={item.label} 
                        primaryTypographyProps={{ className: "font-black text-slate-900 text-lg" }} 
                      />
                      <NorthEastRounded sx={{ fontSize: 16 }} className="text-slate-300" />
                    </ListItemButton>
                  </ListItem>
                )}
              </Box>
            ))}
          </List>
        </Box>

        <Box className="mt-auto pt-8">
          <Divider className="mb-8" />
          <Stack spacing={2}>
            <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center justify-between px-6 py-5 font-black text-slate-900 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
              Sign In <NorthEastRounded sx={{ fontSize: 16 }} className="text-slate-400" />
            </Link>
            <Button 
              component={Link}
              href="/get-started"
              onClick={() => setMobileOpen(false)}
              variant="contained" 
              fullWidth
              className="py-5 rounded-2xl bg-[#020617] text-white font-black lowercase text-xl shadow-xl shadow-blue-600/10"
              sx={{ textTransform: 'none' }}
              endIcon={<TrendingUpIcon />}
            >
              Get Started
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </nav>
  );
}