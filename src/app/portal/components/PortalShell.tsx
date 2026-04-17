'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

/* ─── Design tokens (shared across all portal pages) ─────────────────────── */
export const C = {
  bg: '#f0f2f8',
  surface: '#ffffff',
  border: 'rgba(20,30,70,0.07)',
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

export const F = {
  heading: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
  body: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif",
};

export const FONT_LINK = `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,700&family=Inter:wght@400;500;600;700&display=swap`;

/* ─── Nav definition ─────────────────────────────────────────────────────── */
export const NAV = [
  {
    id: 'dashboard', label: 'Overview', href: '/portal',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  },
  {
    id: 'loans', label: 'My Loans', href: '/portal',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  },
  {
    id: 'insurance', label: 'Insurance', href: '/portal',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  },
  {
    id: 'bnpl', label: 'BNPL', href: '/portal',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  },
  {
    id: 'documents', label: 'Documents', href: '/portal',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  },
  {
    id: 'settings', label: 'Settings', href: '/portal',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>,
  },
];

/* ─── Quick action routes ────────────────────────────────────────────────── */
export const QUICK_ACTIONS = [
  { label: 'Apply for Loan', href: '/portal/apply-loan', color: C.blue, pale: C.bluePale, icon: '→' },
  { label: 'Make a Payment', href: '/portal/make-payment', color: C.green, pale: C.greenPale, icon: '↑' },
  { label: 'Get Insurance Quote', href: '/portal/insurance-quote', color: C.purple, pale: C.purplePale, icon: '⊕' },
  { label: 'Download Statement', href: '/portal/statement', color: C.amber, pale: C.amberPale, icon: '↓' },
];

/* ─── User type ──────────────────────────────────────────────────────────── */
export interface PortalUser { name: string; email: string }

/* ─── Hook: usePortalAuth ────────────────────────────────────────────────── */
export function usePortalAuth() {
  const router = useRouter();
  const [user, setUser] = useState<PortalUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('rb_user');
    if (!stored) { router.replace('/login'); return; }
    setUser(JSON.parse(stored));
    setReady(true);
  }, [router]);

  const logout = useCallback(() => {
    sessionStorage.removeItem('rb_user');
    router.push('/login');
  }, [router]);

  return { user, ready, logout };
}

/* ─── Sidebar ─────────────────────────────────────────────────────────────── */
function Sidebar({ user, onLogout, collapsed, onToggle }: {
  user: PortalUser; onLogout: () => void; collapsed: boolean; onToggle: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string, id: string) => {
    if (href === '/portal' && id === 'dashboard') return pathname === '/portal';
    return pathname.startsWith(href) && href !== '/portal';
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 232 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      style={{
        height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 100,
        background: C.sidebar, display: 'flex', flexDirection: 'column',
        overflow: 'hidden', fontFamily: F.heading,
        boxShadow: '4px 0 24px rgba(0,0,0,0.18)',
      }}
    >
      {/* Logo */}
      <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: collapsed ? '0 18px' : '0 20px', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.06)', justifyContent: collapsed ? 'center' : 'space-between', flexShrink: 0 }}>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <img src="/images/resolve_logo.png" alt="RB" style={{ height: 24, filter: 'brightness(0) invert(1)', objectFit: 'contain' }} />
            <span style={{ fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>ResolveBridge</span>
          </motion.div>
        )}
        <button onClick={onToggle} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', flexShrink: 0, transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>

      {/* Balance pill */}
      {!collapsed && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          style={{ margin: '16px 14px 4px', background: 'linear-gradient(135deg, rgba(64,100,255,0.25), rgba(124,58,237,0.20))', border: '1px solid rgba(100,140,255,0.18)', borderRadius: 14, padding: '14px 16px' }}
        >
          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Net Credit Available</p>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', fontFamily: F.heading }}>GH₵ 26,750</p>
          <div style={{ marginTop: 8, height: 4, background: 'rgba(255,255,255,0.12)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ width: '59%', height: '100%', background: 'linear-gradient(90deg, #4f78ff, #7c3aed)', borderRadius: 99 }} />
          </div>
          <p style={{ margin: '5px 0 0', fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>59% utilised of GH₵ 45,000</p>
        </motion.div>
      )}

      {!collapsed && <p style={{ margin: '18px 20px 6px', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Main Menu</p>}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '4px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {NAV.map((item) => {
          const active = isActive(item.href, item.id);
          return (
            <button key={item.id} onClick={() => router.push(item.href)} title={collapsed ? item.label : undefined}
              style={{ width: '100%', border: 'none', cursor: 'pointer', fontFamily: F.heading, padding: collapsed ? '11px' : '10px 13px', display: 'flex', alignItems: 'center', gap: 11, borderRadius: 11, background: active ? C.sidebarActive : 'transparent', color: active ? '#fff' : C.sidebarText, fontSize: 13.5, fontWeight: active ? 700 : 500, transition: 'all 0.18s', justifyContent: collapsed ? 'center' : 'flex-start', position: 'relative' }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = C.sidebarHover; e.currentTarget.style.color = '#fff'; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.sidebarText; } }}
            >
              {active && <div style={{ position: 'absolute', left: 0, top: '18%', bottom: '18%', width: 3, borderRadius: '0 3px 3px 0', background: 'linear-gradient(180deg, #4f78ff, #7c3aed)' }} />}
              <span style={{ flexShrink: 0, opacity: active ? 1 : 0.6 }}>{item.icon}</span>
              {!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ whiteSpace: 'nowrap' }}>{item.label}</motion.span>}
              {!collapsed && active && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#4f78ff', flexShrink: 0 }} />}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: collapsed ? '12px 8px' : '12px 12px', flexShrink: 0 }}>
        {!collapsed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px 10px' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: 'linear-gradient(135deg, #2051e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff' }}>{user.name.charAt(0)}</div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</p>
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</p>
            </div>
          </div>
        ) : (
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #2051e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', margin: '0 auto 10px' }}>{user.name.charAt(0)}</div>
        )}
        <button onClick={onLogout} title={collapsed ? 'Sign Out' : undefined}
          style={{ width: '100%', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '9px', background: 'rgba(239,68,68,0.08)', color: '#f87171', fontSize: 12.5, fontWeight: 700, fontFamily: F.heading, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'all 0.18s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </motion.aside>
  );
}

/* ─── Portal Shell (wraps all portal pages) ──────────────────────────────── */
export default function PortalShell({
  children, title, subtitle, backHref, backLabel,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
}) {
  const { user, ready, logout } = usePortalAuth();
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const sidebarW = collapsed ? 68 : 232;

  const breadcrumb = NAV.find(n => n.href !== '/portal' && pathname.startsWith(n.href))?.label
    ?? NAV.find(n => n.id === 'dashboard')?.label;

  if (!ready || !user) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }}
          style={{ width: 32, height: 32, border: `3px solid ${C.bluePale}`, borderTopColor: C.blue, borderRadius: '50%' }} />
      </div>
    );
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href={FONT_LINK} rel="stylesheet" />
      <style>{`
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(0.85)}}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(13,27,62,0.1);border-radius:99px}
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: F.body }}>
        <Sidebar user={user} onLogout={logout} collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />

        <main style={{ flex: 1, marginLeft: sidebarW, minHeight: '100vh', transition: 'margin-left 0.28s cubic-bezier(0.22,1,0.36,1)', display: 'flex', flexDirection: 'column' }}>
          {/* Topbar */}
          <div style={{ position: 'sticky', top: 0, zIndex: 50, height: 64, background: 'rgba(240,242,248,0.9)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', padding: '0 28px', gap: 16, justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {backHref && (
                <>
                  <Link href={backHref} style={{ fontSize: 12.5, color: C.textMuted, fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, transition: 'color 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = C.blue; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = C.textMuted; }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                    {backLabel ?? 'Portal'}
                  </Link>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                </>
              )}
              {!backHref && (
                <>
                  <span style={{ fontSize: 12.5, color: C.textMuted, fontWeight: 500 }}>Portal</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                </>
              )}
              <span style={{ fontSize: 12.5, color: C.text, fontWeight: 700, fontFamily: F.heading }}>{title ?? breadcrumb ?? 'Overview'}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 11, padding: '0 14px', height: 38, width: 240 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input placeholder="Search…" style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: C.text, fontFamily: F.body, width: '100%' }} />
              </div>
              <button style={{ width: 38, height: 38, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', transition: 'border-color 0.18s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textSub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                <div style={{ position: 'absolute', top: 8, right: 8, width: 7, height: 7, background: C.red, borderRadius: '50%', border: `2px solid ${C.bg}` }} />
              </button>
              <Link href="/" style={{ height: 38, display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 11, padding: '0 14px', fontSize: 12.5, fontWeight: 700, color: C.textSub, textDecoration: 'none', transition: 'all 0.18s', fontFamily: F.body }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.color = C.blue; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSub; }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                Main Site
              </Link>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg, #2051e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', cursor: 'pointer', fontFamily: F.heading }}>
                {user.name.charAt(0)}
              </div>
            </div>
          </div>

          {/* Page content */}
          <div style={{ flex: 1, padding: '32px', boxSizing: 'border-box' }}>
            {subtitle && (
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ margin: '0 0 5px', fontSize: 26, fontWeight: 800, color: C.text, letterSpacing: '-0.04em', fontFamily: F.heading, lineHeight: 1.2 }}>{title}</h1>
                <p style={{ margin: 0, fontSize: 14, color: C.textMuted }}>{subtitle}</p>
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
