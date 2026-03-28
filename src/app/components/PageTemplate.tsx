'use client';

import { motion } from 'framer-motion';
import { ArrowLeftRounded } from '@mui/icons-material';
import { 
  Box, 
  Container, 
  Typography, 
  IconButton, 
  Paper, 
  Stack 
} from '@mui/material';
import Link from 'next/link';
import { ReactNode } from 'react';

interface PageTemplateProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  gradientTitle?: string;
  noCard?: boolean;
}

export default function PageTemplate({ title, subtitle, children, gradientTitle, noCard }: PageTemplateProps) {
  return (
    <Box component="main" className="min-h-screen bg-white">
      {/* Background Ambience */}
      <Box className="fixed inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-purple-600/5 blur-[100px] rounded-full" />
      </Box>

      {/* Hero Header */}
      <Box className="relative pt-40 pb-20 border-b border-slate-50">
        <Container maxWidth="lg">
          <Link href="/" className="group inline-flex items-center gap-2 mb-10 text-slate-400 hover:text-blue-600 font-black text-sm uppercase tracking-widest transition-colors">
            <Box className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
              <ArrowLeftRounded />
            </Box>
            Back to Portal
          </Link>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <Typography variant="h1" className="text-4xl md:text-7xl font-black tracking-tighter text-slate-900 mb-6 leading-[1.1] md:leading-none">
              {title} {gradientTitle && <span className="text-blue-600 italic">{gradientTitle}</span>}
            </Typography>
            <Typography className="text-slate-500 font-medium max-w-2xl leading-relaxed text-base md:text-xl">
              {subtitle}
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Content Area */}
      <Box className="relative py-20 min-h-[60vh]">
        <Container maxWidth="lg">
          {noCard ? (
            children
          ) : (
            <Paper 
              elevation={0}
              className="p-8 md:p-16 rounded-[48px] border border-slate-100 bg-white/50 backdrop-blur-xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
              <Box className="relative z-10">
                {children}
              </Box>
            </Paper>
          )}
        </Container>
      </Box>
    </Box>
  );
}
