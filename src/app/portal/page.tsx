'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/* ─── Font injection ─────────────────────────────────────────────────────── */
const FONT_LINK = `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,700&family=Inter:wght@400;500;600;700&display=swap`;

/* ─── Design tokens ──────────────────────────────────────────────────────── */
const C = {
  bg: '#f0f2f8',
  surface: '#ffffff',
  surfaceHover: '#f8faff',
  border: 'rgba(20,30,70,0.07)',
  borderStrong: 'rgba(20,30,70,0.12)',
  text: '#0d1b3e',
  textSub: '#5c6b8a',
  textMuted: '#9aa5bf',
  blue: '#2051e5',
  blueLight: '#4f78ff',
  bluePale: 'rgba(32,81,229,0.08)',
  green: '#00b67a',
  greenPale: 'rgba(0,182,122,0.08)',
  amber: '#f59e0b',
  amberPale: 'rgba(245,158,11,0.08)',
  red: '#ef4444',
  redPale: 'rgba(239,68,68,0.08)',
  purple: '#7c3aed',
  purplePale: 'rgba(124,58,237,0.08)',
  sidebar: '#0b1630',
  sidebarActive: 'rgba(64,100,255,0.18)',
  sidebarText: 'rgba(255,255,255,0.55)',
  sidebarHover: 'rgba(255,255,255,0.06)',
};

const F = {
  heading: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
  body: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif",
};

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface User { name: string; email: string }

/* ─── Dummy data ─────────────────────────────────────────────────────────── */
const STATS = [
  {
    label: 'Total Credit Line',
    value: 'GH₵ 45,000',
    change: '+12.5%',
    up: true,
    sub: 'vs last quarter',
    color: C.blue,
    pale: C.bluePale,
    gradient: 'linear-gradient(135deg, #2051e5, #4f78ff)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
  {
    label: 'Outstanding Balance',
    value: 'GH₵ 18,250',
    change: '−3.2%',
    up: false,
    sub: 'being paid down',
    color: C.amber,
    pale: C.amberPale,
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    label: 'Insurance Coverage',
    value: 'GH₵ 200K',
    change: 'Active',
    up: true,
    sub: 'Prudential Life plan',
    color: C.green,
    pale: C.greenPale,
    gradient: 'linear-gradient(135deg, #00b67a, #34d399)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    label: 'Credit Score',
    value: '742',
    change: '+18 pts',
    up: true,
    sub: 'Excellent rating',
    color: C.purple,
    pale: C.purplePale,
    gradient: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
];

const LOANS = [
  {
    id: 'LN-2024-0891', type: 'Personal Loan', lender: 'Absa Bank Ghana',
    amount: 'GH₵ 10,000', remaining: 'GH₵ 6,450', rate: '18.5%', term: '36 mo',
    status: 'Active', progress: 64, nextPayment: '30 Apr 2026',
    color: C.blue, pale: C.bluePale,
  },
  {
    id: 'LN-2024-0342', type: 'Business Loan', lender: 'Fidelity Bank',
    amount: 'GH₵ 25,000', remaining: 'GH₵ 11,800', rate: '21%', term: '60 mo',
    status: 'Active', progress: 53, nextPayment: '15 May 2026',
    color: C.green, pale: C.greenPale,
  },
  {
    id: 'LN-2023-1120', type: 'Auto Loan', lender: 'CAL Bank',
    amount: 'GH₵ 35,000', remaining: 'GH₵ 0', rate: '16%', term: '48 mo',
    status: 'Paid Off', progress: 100, nextPayment: '—',
    color: C.textMuted, pale: 'rgba(154,165,191,0.08)',
  },
];

const TRANSACTIONS = [
  { id: 1, desc: 'Loan Repayment', sub: 'Absa Bank · Personal', amount: '−GH₵ 850', date: 'Today', type: 'debit', category: 'loan' },
  { id: 2, desc: 'Insurance Premium', sub: 'Prudential Life', amount: '−GH₵ 320', date: 'Apr 10', type: 'debit', category: 'insurance' },
  { id: 3, desc: 'Salary Credit', sub: 'OAj Software Ltd', amount: '+GH₵ 5,200', date: 'Apr 1', type: 'credit', category: 'income' },
  { id: 4, desc: 'BNPL Installment', sub: 'Resolve BNPL', amount: '−GH₵ 450', date: 'Mar 28', type: 'debit', category: 'bnpl' },
  { id: 5, desc: 'Interest Rebate', sub: 'Fidelity Bank', amount: '+GH₵ 85', date: 'Mar 25', type: 'credit', category: 'income' },
];

const TX_ICONS: Record<string, { bg: string; icon: React.ReactNode }> = {
  loan: {
    bg: C.bluePale,
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  },
  insurance: {
    bg: C.greenPale,
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  },
  income: {
    bg: C.purplePale,
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.purple} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  },
  bnpl: {
    bg: C.amberPale,
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  },
};

const NAV = [
  { id: 'dashboard', label: 'Overview', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { id: 'loans', label: 'My Loans', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
  { id: 'insurance', label: 'Insurance', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { id: 'bnpl', label: 'BNPL', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> },
  { id: 'documents', label: 'Documents', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  { id: 'settings', label: 'Settings', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg> },
];

/* ─── Sidebar ─────────────────────────────────────────────────────────────── */
function Sidebar({ active, onNav, user, onLogout, collapsed, onToggle }: {
  active: string; onNav: (id: string) => void; user: User;
  onLogout: () => void; collapsed: boolean; onToggle: () => void;
}) {
  const w = collapsed ? 68 : 232;
  return (
    <motion.aside
      animate={{ width: w }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      style={{
        height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 100,
        background: C.sidebar,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        fontFamily: F.heading,
        boxShadow: '4px 0 24px rgba(0,0,0,0.18)',
      }}
    >
      {/* Logo row */}
      <div style={{
        height: 64, display: 'flex', alignItems: 'center',
        padding: collapsed ? '0 18px' : '0 20px',
        gap: 10, borderBottom: `1px solid rgba(255,255,255,0.06)`,
        justifyContent: collapsed ? 'center' : 'space-between', flexShrink: 0,
      }}>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <img src="/images/resolve_logo.png" alt="RB" style={{ height: 24, filter: 'brightness(0) invert(1)', objectFit: 'contain' }} />
            <span style={{ fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>ResolveBridge</span>
          </motion.div>
        )}
        <button onClick={onToggle} style={{
          background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8,
          width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'rgba(255,255,255,0.5)', flexShrink: 0,
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            {collapsed
              ? <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              : <><line x1="19" y1="6" x2="5" y2="6"/><line x1="19" y1="12" x2="5" y2="12"/><line x1="19" y1="18" x2="5" y2="18"/></>
            }
          </svg>
        </button>
      </div>

      {/* Balance pill */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{
            margin: '16px 14px 4px',
            background: 'linear-gradient(135deg, rgba(64,100,255,0.25), rgba(124,58,237,0.20))',
            border: '1px solid rgba(100,140,255,0.18)',
            borderRadius: 14, padding: '14px 16px',
          }}
        >
          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Net Credit Available</p>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', fontFamily: F.heading }}>GH₵ 26,750</p>
          <div style={{ marginTop: 8, height: 4, background: 'rgba(255,255,255,0.12)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ width: '59%', height: '100%', background: 'linear-gradient(90deg, #4f78ff, #7c3aed)', borderRadius: 99 }} />
          </div>
          <p style={{ margin: '5px 0 0', fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>59% utilised of GH₵ 45,000</p>
        </motion.div>
      )}

      {/* Nav label */}
      {!collapsed && (
        <p style={{ margin: '18px 20px 6px', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Main Menu</p>
      )}

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '4px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {NAV.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              title={collapsed ? item.label : undefined}
              style={{
                width: '100%', border: 'none', cursor: 'pointer', fontFamily: F.heading,
                padding: collapsed ? '11px' : '10px 13px',
                display: 'flex', alignItems: 'center', gap: 11,
                borderRadius: 11,
                background: isActive ? C.sidebarActive : 'transparent',
                color: isActive ? '#fff' : C.sidebarText,
                fontSize: 13.5, fontWeight: isActive ? 700 : 500,
                transition: 'all 0.18s',
                justifyContent: collapsed ? 'center' : 'flex-start',
                position: 'relative',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = C.sidebarHover; e.currentTarget.style.color = '#fff'; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.sidebarText; } }}
            >
              {isActive && (
                <div style={{ position: 'absolute', left: 0, top: '18%', bottom: '18%', width: 3, borderRadius: '0 3px 3px 0', background: 'linear-gradient(180deg, #4f78ff, #7c3aed)' }} />
              )}
              <span style={{ flexShrink: 0, opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
              {!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ whiteSpace: 'nowrap' }}>{item.label}</motion.span>}
              {!collapsed && isActive && (
                <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#4f78ff', flexShrink: 0 }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: collapsed ? '12px 8px' : '12px 12px', flexShrink: 0 }}>
        {!collapsed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px 10px' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: 'linear-gradient(135deg, #2051e5, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: F.heading,
            }}>{user.name.charAt(0)}</div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</p>
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
            </div>
          </div>
        ) : (
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #2051e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', margin: '0 auto 10px', fontFamily: F.heading }}>{user.name.charAt(0)}</div>
        )}
        <button
          onClick={onLogout}
          title={collapsed ? 'Log out' : undefined}
          style={{
            width: '100%', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 10, padding: '9px',
            background: 'rgba(239,68,68,0.08)', color: '#f87171',
            fontSize: 12.5, fontWeight: 700, fontFamily: F.heading,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            transition: 'all 0.18s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; e.currentTarget.style.color = '#fca5a5'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#f87171'; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </motion.aside>
  );
}

/* ─── Stat Card ──────────────────────────────────────────────────────────── */
function StatCard({ stat, idx }: { stat: typeof STATS[0]; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: C.surface, borderRadius: 20, padding: '22px 24px',
        border: `1px solid ${C.border}`,
        boxShadow: '0 1px 3px rgba(13,27,62,0.04), 0 4px 16px rgba(13,27,62,0.04)',
        transition: 'transform 0.22s, box-shadow 0.22s',
        cursor: 'default',
      }}
      whileHover={{ y: -3, boxShadow: '0 8px 32px rgba(13,27,62,0.1)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.09em', fontFamily: F.body }}>{stat.label}</p>
        <div style={{
          width: 38, height: 38, borderRadius: 11, background: stat.pale,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color,
        }}>{stat.icon}</div>
      </div>

      <p style={{ margin: '0 0 10px', fontSize: 26, fontWeight: 800, color: C.text, letterSpacing: '-0.05em', fontFamily: F.heading, lineHeight: 1 }}>
        {stat.value}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 3,
          background: stat.up ? C.greenPale : C.redPale,
          padding: '3px 8px', borderRadius: 6,
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={stat.up ? C.green : C.red} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            {stat.up ? <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></> : <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>}
          </svg>
          <span style={{ fontSize: 11, fontWeight: 700, color: stat.up ? C.green : C.red, fontFamily: F.body }}>{stat.change}</span>
        </div>
        <span style={{ fontSize: 11, color: C.textMuted, fontFamily: F.body }}>{stat.sub}</span>
      </div>
    </motion.div>
  );
}

/* ─── Dashboard ──────────────────────────────────────────────────────────── */
function Dashboard({ user }: { user: User }) {
  const router = useRouter();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user.name.split(' ')[0];

  return (
    <div style={{ fontFamily: F.body }}>

      {/* Page header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.green, boxShadow: `0 0 0 3px ${C.greenPale}` }} />
          <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: C.textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: F.body }}>{greeting}, {firstName}</p>
        </div>
        <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 800, color: C.text, letterSpacing: '-0.04em', fontFamily: F.heading, lineHeight: 1.15 }}>
          Portfolio{' '}
          <span style={{ background: 'linear-gradient(135deg, #2051e5, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Overview
          </span>
        </h1>
        <p style={{ margin: 0, fontSize: 13.5, color: C.textMuted, fontFamily: F.body }}>
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          {'  ·  '}Last synced just now
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {STATS.map((s, i) => <StatCard key={s.label} stat={s} idx={i} />)}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 20, marginBottom: 20 }}>

        {/* Loans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: C.surface, borderRadius: 22, padding: '24px 26px', border: `1px solid ${C.border}`, boxShadow: '0 1px 3px rgba(13,27,62,0.04)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: 16, fontWeight: 800, color: C.text, fontFamily: F.heading, letterSpacing: '-0.03em' }}>Active Loans</p>
              <p style={{ margin: 0, fontSize: 12, color: C.textMuted }}>3 facilities tracked</p>
            </div>
            <button style={{
              background: C.bluePale, border: `1px solid rgba(32,81,229,0.15)`,
              borderRadius: 10, padding: '6px 14px', fontSize: 12, fontWeight: 700,
              color: C.blue, cursor: 'pointer', fontFamily: F.body, transition: 'all 0.18s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = C.blue; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.bluePale; e.currentTarget.style.color = C.blue; }}
            >View All</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {LOANS.map((loan, i) => (
              <motion.div
                key={loan.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                style={{
                  padding: '16px 18px', background: C.bg, borderRadius: 16,
                  border: `1px solid ${C.border}`, transition: 'border-color 0.2s, box-shadow 0.2s',
                  cursor: 'default',
                }}
                whileHover={{ boxShadow: `0 4px 20px rgba(13,27,62,0.08)`, borderColor: loan.status === 'Active' ? loan.color + '44' : C.border }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 800, letterSpacing: '0.07em',
                        textTransform: 'uppercase', color: loan.color,
                        background: loan.pale, padding: '2px 8px', borderRadius: 5,
                        fontFamily: F.body,
                      }}>{loan.status}</span>
                      <span style={{ fontSize: 11, color: C.textMuted, fontFamily: F.body }}>{loan.id}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: C.text, fontFamily: F.heading, letterSpacing: '-0.02em' }}>{loan.type}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: C.textMuted }}>{loan.lender}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: C.text, fontFamily: F.heading, letterSpacing: '-0.03em' }}>{loan.remaining}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: C.textMuted }}>remaining</p>
                  </div>
                </div>

                {/* Progress */}
                <div style={{ height: 5, background: C.border, borderRadius: 99, overflow: 'hidden', marginBottom: 10 }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${loan.progress}%` }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${loan.color}, ${loan.color}bb)` }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11.5, color: C.textMuted }}>
                    <span style={{ fontWeight: 600, color: C.textSub }}>{loan.progress}%</span> repaid · {loan.rate} p.a.
                  </span>
                  {loan.nextPayment !== '—' && (
                    <span style={{ fontSize: 11.5, color: C.textMuted }}>
                      Next: <span style={{ fontWeight: 600, color: C.textSub }}>{loan.nextPayment}</span>
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: C.surface, borderRadius: 22, padding: '24px 26px', border: `1px solid ${C.border}`, boxShadow: '0 1px 3px rgba(13,27,62,0.04)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: 16, fontWeight: 800, color: C.text, fontFamily: F.heading, letterSpacing: '-0.03em' }}>Recent Activity</p>
              <p style={{ margin: 0, fontSize: 12, color: C.textMuted }}>Last 30 days</p>
            </div>
            <button style={{
              background: 'transparent', border: `1px solid ${C.border}`,
              borderRadius: 10, padding: '6px 14px', fontSize: 12, fontWeight: 700,
              color: C.textSub, cursor: 'pointer', fontFamily: F.body, transition: 'all 0.18s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.color = C.blue; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSub; }}
            >See All</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {TRANSACTIONS.map((tx, i) => {
              const meta = TX_ICONS[tx.category] || TX_ICONS.loan;
              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.07 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 13,
                    padding: '11px 10px', borderRadius: 13,
                    transition: 'background 0.15s', cursor: 'default',
                  }}
                  whileHover={{ background: C.surfaceHover }}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                    background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{meta.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: '0 0 2px', fontSize: 13.5, fontWeight: 700, color: C.text, fontFamily: F.heading, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.01em' }}>{tx.desc}</p>
                    <p style={{ margin: 0, fontSize: 11.5, color: C.textMuted }}>{tx.sub}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ margin: '0 0 2px', fontSize: 13.5, fontWeight: 800, color: tx.type === 'credit' ? C.green : C.text, fontFamily: F.heading, letterSpacing: '-0.02em' }}>{tx.amount}</p>
                    <p style={{ margin: 0, fontSize: 11, color: C.textMuted }}>{tx.date}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Mini spend chart bars */}
          <div style={{ marginTop: 20, padding: '16px', background: C.bg, borderRadius: 14 }}>
            <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Weekly Spend</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 48 }}>
              {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.7 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    flex: 1, borderRadius: 4,
                    background: i === 5 ? `linear-gradient(180deg, ${C.blue}, ${C.blueLight})` : C.border,
                  }}
                />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <span key={i} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: i === 5 ? C.blue : C.textMuted, fontWeight: i === 5 ? 700 : 500 }}>{d}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{ background: C.surface, borderRadius: 22, padding: '24px 26px', border: `1px solid ${C.border}`, boxShadow: '0 1px 3px rgba(13,27,62,0.04)' }}
        >
          <p style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 800, color: C.text, fontFamily: F.heading, letterSpacing: '-0.03em' }}>Quick Actions</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Apply for Loan', href: '/portal/apply-loan', icon: '→', color: C.blue, pale: C.bluePale },
              { label: 'Make a Payment', href: '/portal/make-payment', icon: '↑', color: C.green, pale: C.greenPale },
              { label: 'Get Insurance Quote', href: '/portal/insurance-quote', icon: '⊕', color: C.purple, pale: C.purplePale },
              { label: 'Download Statement', href: '/portal/statement', icon: '↓', color: C.amber, pale: C.amberPale },
            ].map(({ label, href, icon, color, pale }) => (
              <button key={label} onClick={() => router.push(href)} style={{
                width: '100%', border: `1px solid ${C.border}`, borderRadius: 12,
                padding: '11px 14px', background: C.bg, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 12, fontFamily: F.body,
                transition: 'all 0.18s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = pale; e.currentTarget.style.borderColor = color + '33'; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.bg; e.currentTarget.style.borderColor = C.border; }}
              >
                <div style={{ width: 30, height: 30, borderRadius: 8, background: pale, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color, fontWeight: 800, flexShrink: 0 }}>{icon}</div>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.textSub }}>{label}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" style={{ marginLeft: 'auto', opacity: 0.6 }}><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Credit health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.56, duration: 0.5 }}
          style={{ background: C.surface, borderRadius: 22, padding: '24px 26px', border: `1px solid ${C.border}`, boxShadow: '0 1px 3px rgba(13,27,62,0.04)' }}
        >
          <p style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 800, color: C.text, fontFamily: F.heading, letterSpacing: '-0.03em' }}>Credit Health</p>
          <p style={{ margin: '0 0 20px', fontSize: 12, color: C.textMuted }}>Updated Apr 15, 2026</p>

          {/* Score arc */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <div style={{ position: 'relative', width: 100, height: 100 }}>
              <svg viewBox="0 0 100 100" width="100" height="100">
                <circle cx="50" cy="50" r="40" fill="none" stroke={C.border} strokeWidth="8"/>
                <motion.circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="url(#scoreGrad)" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="251"
                  initial={{ strokeDashoffset: 251 }}
                  animate={{ strokeDashoffset: 251 - (742 / 850) * 251 }}
                  transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  transform="rotate(-90 50 50)"
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2051e5"/>
                    <stop offset="100%" stopColor="#7c3aed"/>
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: C.text, fontFamily: F.heading, letterSpacing: '-0.04em', lineHeight: 1 }}>742</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: C.green, marginTop: 2 }}>Excellent</span>
              </div>
            </div>
          </div>

          {[
            { label: 'Payment History', score: 98, color: C.green },
            { label: 'Credit Utilisation', score: 59, color: C.amber },
            { label: 'Account Age', score: 72, color: C.blue },
          ].map(({ label, score, color }) => (
            <div key={label} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: C.textSub, fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color }}>{score}%</span>
              </div>
              <div style={{ height: 4, background: C.border, borderRadius: 99, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ delay: 0.9, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${color}cc, ${color})` }}
                />
              </div>
            </div>
          ))}
        </motion.div>

        {/* Pre-approval offer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.62, duration: 0.5 }}
          style={{
            background: 'linear-gradient(145deg, #0b1630 0%, #132045 60%, #1a1250 100%)',
            borderRadius: 22, padding: '26px', border: '1px solid rgba(79,120,255,0.18)',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            boxShadow: '0 8px 32px rgba(11,22,48,0.28)',
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Glow */}
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,120,255,0.25), transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.2), transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(79,120,255,0.2)', border: '1px solid rgba(79,120,255,0.3)', borderRadius: 8, padding: '4px 10px', marginBottom: 14 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4f78ff', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: '#93b4ff', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: F.body }}>Pre-Approved</span>
            </div>

            <p style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 900, color: '#fff', fontFamily: F.heading, letterSpacing: '-0.04em', lineHeight: 1.15 }}>
              GH₵ 50,000<br/>Business Loan
            </p>
            <p style={{ margin: '0 0 20px', fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
              Based on your Excellent credit profile. Rates from <strong style={{ color: 'rgba(255,255,255,0.7)' }}>18% p.a.</strong> Funds disbursed within 48 hrs.
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            {[{ label: 'Max Amount', value: 'GH₵ 50,000' }, { label: 'Interest Rate', value: 'from 18%' }, { label: 'Disbursal', value: '48 hours' }].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '7px 0' }}>
                <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.35)', fontFamily: F.body }}>{label}</span>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: 'rgba(255,255,255,0.8)', fontFamily: F.body }}>{value}</span>
              </div>
            ))}

            <button style={{
              width: '100%', marginTop: 18,
              background: 'linear-gradient(135deg, #2051e5, #4f78ff)',
              border: 'none', borderRadius: 12, padding: '12px',
              color: '#fff', fontSize: 13.5, fontWeight: 800, fontFamily: F.heading,
              cursor: 'pointer', letterSpacing: '-0.01em',
              boxShadow: '0 4px 16px rgba(32,81,229,0.4)',
              transition: 'all 0.22s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(32,81,229,0.55)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(32,81,229,0.4)'; }}
            >
              Apply Now →
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Placeholder ─────────────────────────────────────────────────────────── */
function Placeholder({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: 16, fontFamily: F.body }}>
      <div style={{ width: 72, height: 72, background: C.bluePale, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.blue }}>{icon}</div>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.text, fontFamily: F.heading, letterSpacing: '-0.03em' }}>{label}</h2>
      <p style={{ margin: 0, fontSize: 14, color: C.textMuted, textAlign: 'center', maxWidth: 320, lineHeight: 1.6 }}>This section is actively being built out. Check back soon.</p>
      <div style={{ padding: '6px 16px', background: C.bluePale, borderRadius: 8, border: `1px solid rgba(32,81,229,0.15)`, fontSize: 11.5, fontWeight: 700, color: C.blue, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Coming Soon</div>
    </div>
  );
}

/* ─── Main page ───────────────────────────────────────────────────────────── */
export default function PortalPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('rb_user');
    if (!stored) { router.replace('/login'); return; }
    setUser(JSON.parse(stored));
    setLoaded(true);
  }, [router]);

  const handleLogout = () => { sessionStorage.removeItem('rb_user'); router.push('/login'); };
  const sidebarW = collapsed ? 68 : 232;

  const sections: Record<string, React.ReactNode> = {
    dashboard: user ? <Dashboard user={user} /> : null,
    loans: <Placeholder label="My Loans" icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>} />,
    insurance: <Placeholder label="Insurance" icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>} />,
    bnpl: <Placeholder label="Buy Now, Pay Later" icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>} />,
    documents: <Placeholder label="Documents" icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>} />,
    settings: <Placeholder label="Settings" icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>} />,
  };

  if (!loaded || !user) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }}
          style={{ width: 32, height: 32, border: `3px solid ${C.bluePale}`, borderTopColor: C.blue, borderRadius: '50%' }} />
      </div>
    );
  }

  return (
    <>
      {/* Font injection */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href={FONT_LINK} rel="stylesheet" />

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(0.85)} }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(13,27,62,0.1); border-radius: 99px; }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: F.body }}>

        <Sidebar
          active={activeSection} onNav={setActiveSection}
          user={user} onLogout={handleLogout}
          collapsed={collapsed} onToggle={() => setCollapsed(v => !v)}
        />

        <main style={{
          flex: 1, marginLeft: sidebarW, minHeight: '100vh',
          transition: 'margin-left 0.28s cubic-bezier(0.22,1,0.36,1)',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Topbar */}
          <div style={{
            position: 'sticky', top: 0, zIndex: 50, height: 64,
            background: 'rgba(240,242,248,0.85)', backdropFilter: 'blur(16px)',
            borderBottom: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center',
            padding: '0 28px', gap: 16, justifyContent: 'space-between', flexShrink: 0,
          }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12.5, color: C.textMuted, fontWeight: 500 }}>Portal</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              <span style={{ fontSize: 12.5, color: C.text, fontWeight: 700, fontFamily: F.heading }}>
                {NAV.find(n => n.id === activeSection)?.label ?? 'Overview'}
              </span>
            </div>

            {/* Search + actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 11, padding: '0 14px', height: 38, width: 260,
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
                onFocus={() => {}}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  placeholder="Search loans, documents…"
                  style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: C.text, fontFamily: F.body, width: '100%' }}
                />
              </div>

              {/* Notification bell */}
              <button
                onClick={() => setNotifOpen(v => !v)}
                style={{ width: 38, height: 38, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', transition: 'all 0.18s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textSub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                <div style={{ position: 'absolute', top: 8, right: 8, width: 7, height: 7, background: C.red, borderRadius: '50%', border: `2px solid ${C.bg}` }} />
              </button>

              {/* Back to site */}
              <Link href="/" style={{
                height: 38, display: 'flex', alignItems: 'center', gap: 6,
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 11, padding: '0 14px',
                fontSize: 12.5, fontWeight: 700, color: C.textSub,
                textDecoration: 'none', transition: 'all 0.18s', fontFamily: F.body,
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.color = C.blue; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSub; }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                Main Site
              </Link>

              {/* Avatar */}
              <div style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg, #2051e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', cursor: 'pointer', fontFamily: F.heading }}>
                {user.name.charAt(0)}
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, padding: '28px 32px', maxWidth: 1400, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22 }}
              >
                {sections[activeSection]}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </>
  );
}
