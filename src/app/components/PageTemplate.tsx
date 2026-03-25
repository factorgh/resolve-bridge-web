'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
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
    <main className="internal-page">
      <section className="internal-hero">
        <div className="container">
          <Link href="/" className="back-link hover:text-primary transition-colors mb-6 inline-flex items-center">
            <ArrowLeft size={18} className="mr-2" /> Back home
          </Link>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title mb-4 animate-fade-in">
              {title} {gradientTitle && <span className="gradient-text">{gradientTitle}</span>}
            </h1>
            <p className="section-subtitle max-w-2xl text-lg opacity-80 leading-relaxed">
              {subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="internal-content py-16">
        <div className="container">
          {noCard ? (
            children
          ) : (
            <div className="glass-card p-8 md:p-12 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
              {children}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
