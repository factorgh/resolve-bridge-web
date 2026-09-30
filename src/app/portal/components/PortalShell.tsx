'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Drawer, IconButton, CircularProgress as MUICircularProgress } from '@mui/material';
import { 
  CloseRounded, 
  NotificationsRounded, 
  HistoryRounded, 
  BoltRounded, 
  AssignmentLateRounded, 
  VerifiedRounded,
} from '@mui/icons-material';
import Sidebar, { SIDEBAR_NAV_GROUPS } from './Sidebar';
import FloatingChat from './FloatingChat';
import { useGetNotificationsQuery, useMarkNotificationReadMutation } from '@/lib/redux/api/notificationApi';

/* ─── Design Tokens ──────────────────────────────────────────────────────── */
export const C = {
  bg: '#f3f5fa',
  surface: '#ffffff',
  card: '#ffffff',
  ink: '#101a33',
  text: '#101a33',
  textSub: '#6b7690',
  mute: '#6b7690',
  textMuted: '#9aa5bf',
  line: '#e4e8f1',
  border: '#e4e8f1',
  borderStrong: '#cbd5e1',
  accent: '#2f5bea',
  accentSoft: '#e8eefd',
  blue: '#2f5bea',
  blueLight: '#4f78ff',
  bluePale: '#e8eefd',
  green: '#1f8a5b',
  greenSoft: '#e3f4ec',
  greenPale: '#e3f4ec',
  emerald: '#1f8a5b',
  emeraldLight: '#e3f4ec',
  emeraldPale: '#e3f4ec',
  gold: '#c9a24b',
  red: '#ef4444',
  redPale: 'rgba(239,68,68,0.08)',
  purple: '#7c3aed',
  purplePale: 'rgba(124,58,237,0.08)',
  amber: '#c9a24b',
  amberPale: 'rgba(201,162,75,0.08)',
  sidebar: '#0f1a33',
  sidebarText: '#aeb8d0',
  sidebarDivider: '#1e2a48',
  sidebarActive: '#1a2a55',
  sidebarActiveText: '#8fb0ff',
  sidebarGroupLabel: '#6f7b98',
};

export const F = {
  heading: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  body: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  display: "'Fraunces', Georgia, serif",
  serif: "'Fraunces', Georgia, serif",
};

export const FONT_LINK = `https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..700;1,9..40,400..700&family=Fraunces:ital,opsz,wght@0,9..144,500..600;1,9..144,500..600&display=swap`;

/* ─── Page Title Mapping ─────────────────────────────────────────────────── */
const getPageTitle = (pathname: string, customTitle?: string) => {
  if (customTitle) return customTitle;
  if (pathname === '/portal') return 'Overview';
  if (pathname.startsWith('/portal/marketplace')) return 'Marketplace';
  if (pathname.startsWith('/portal/statement')) return 'Portfolio';
  if (pathname.startsWith('/portal/calculator')) return 'Calculators';
  if (pathname.startsWith('/portal/chat')) return 'Messages';
  if (pathname.startsWith('/portal/documents')) return 'Vault';
  if (pathname.startsWith('/portal/billing')) return 'Billing plan';
  if (pathname.startsWith('/portal/settings')) return 'Settings';
  if (pathname.startsWith('/portal/apply-loan')) return 'Apply for a loan';
  if (pathname.startsWith('/portal/apply-insurance')) return 'Insurance application';
  if (pathname.startsWith('/portal/apply-bnpl')) return 'BNPL application';
  return 'Overview';
};

/* ─── Shell Core ─────────────────────────────────────────────────────────── */

export default function PortalShell({
  children, title, subtitle, backHref, backLabel,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Initialize user synchronously if in browser to prevent unmount flash
  const [user, setUser] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('rb_user');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        // ignore
      }
    }
    return { firstName: 'Thethrees', email: 'user@resolvebridge.com' };
  });

  const [notifOpen, setNotifOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<any>(null);
  const [notifSearch, setNotifSearch] = useState('');

  const { data: notifData } = useGetNotificationsQuery(undefined, {
    pollingInterval: 15000,
  });
  const [markNotificationRead] = useMarkNotificationReadMutation();
  const notifications = notifData?.data || [];
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  useEffect(() => {
    const stored = sessionStorage.getItem('rb_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error('Session error', e);
      }
    }
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('rb_user');
      localStorage.removeItem('rb_token');
    }
    router.push('/login');
  }, [router]);

  const getNotificationConfig = (item: any) => {
    if (item.type === 'ApplicationReview') {
      if (item.title?.toLowerCase().includes('approve') || item.message?.toLowerCase().includes('approve')) {
        return { icon: <VerifiedRounded sx={{ fontSize: 18 }} />, color: C.green };
      }
      if (item.title?.toLowerCase().includes('reject') || item.message?.toLowerCase().includes('reject')) {
        return { icon: <AssignmentLateRounded sx={{ fontSize: 18 }} />, color: C.red };
      }
      if (item.title?.toLowerCase().includes('disburse') || item.message?.toLowerCase().includes('disburse')) {
        return { icon: <BoltRounded sx={{ fontSize: 18 }} />, color: C.purple };
      }
      return { icon: <HistoryRounded sx={{ fontSize: 18 }} />, color: C.accent };
    }
    return { icon: <NotificationsRounded sx={{ fontSize: 18 }} />, color: C.accent };
  };

  const formatNotifTime = (createdAtStr: string) => {
    if (!createdAtStr) return 'Just now';
    const diffMs = Date.now() - new Date(createdAtStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const mappedNotifs = useMemo(() => {
    return notifications.map((n: any) => {
      const config = getNotificationConfig(n);
      return {
        id: n._id,
        title: n.title,
        desc: n.message,
        time: formatNotifTime(n.createdAt),
        icon: config.icon,
        color: config.color,
        unread: !n.isRead,
        raw: n
      };
    });
  }, [notifications]);

  const filteredNotifs = useMemo(() => {
    return mappedNotifs.filter((n: any) => 
      (n.title || '').toLowerCase().includes(notifSearch.toLowerCase()) ||
      (n.desc || '').toLowerCase().includes(notifSearch.toLowerCase())
    );
  }, [mappedNotifs, notifSearch]);

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n: any) => !n.isRead);
    try {
      await Promise.all(unread.map((n: any) => markNotificationRead(n._id).unwrap()));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const handleSelectNotification = async (n: any) => {
    setSelectedNotif(n);
    if (n.unread) {
      try {
        await markNotificationRead(n.id).unwrap();
      } catch (err) {
        console.error("Failed to mark notification read:", err);
      }
    }
  };

  const pageTitle = getPageTitle(pathname, title);

  return (
    <div className="portal-root-layout">
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href={FONT_LINK} rel="stylesheet" />

      {/* Sidebar Component */}
      <Sidebar user={user} onLogout={logout} />

      {/* Main Content Area */}
      <div className="portal-main-wrapper">
        {/* Top Header */}
        <header className="portal-topbar">
          <div className="portal-topbar-left">
            {backHref ? (
              <Link href={backHref} className="portal-back-link">
                ← {backLabel || 'Back'}
              </Link>
            ) : (
              <h1 className="portal-page-title">{pageTitle}</h1>
            )}
          </div>

          <div className="portal-topbar-right">
            {/* Zero borrower fees pill */}
            <div className="portal-zero-fees-pill">
              <span className="portal-zero-fees-dot" />
              <span>Zero borrower fees</span>
            </div>

            {/* Notification button */}
            <button
              onClick={() => { setNotifOpen(true); setSelectedNotif(null); }}
              className="portal-notif-btn"
              aria-label="Notifications"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#101a33" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              {unreadCount > 0 && <span className="portal-notif-unread-dot" />}
            </button>
          </div>
        </header>

        {/* Page Content View */}
        <main className="portal-content-body">
          {children}
        </main>
      </div>

      {/* Floating Chat Support Widget */}
      <FloatingChat />

      {/* Notifications Drawer */}
      <Drawer
        anchor="right"
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 400 },
            background: '#ffffff',
            boxShadow: '-8px 0 32px rgba(16,26,51,0.08)',
            borderLeft: '1px solid #e4e8f1',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'DM Sans', sans-serif"
          }
        }}
      >
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #e4e8f1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#101a33' }}>Notifications</h3>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#6b7690' }}>
              {unreadCount > 0 ? `You have ${unreadCount} unread update${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2f5bea',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: 6
                }}
              >
                Mark all read
              </button>
            )}
            <IconButton onClick={() => setNotifOpen(false)} size="small" aria-label="Close notifications">
              <CloseRounded sx={{ fontSize: 20, color: '#6b7690' }} />
            </IconButton>
          </div>
        </div>

        {/* Search */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid #e4e8f1' }}>
          <input
            type="text"
            placeholder="Search updates..."
            value={notifSearch}
            onChange={(e) => setNotifSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #e4e8f1',
              fontSize: 12.5,
              color: '#101a33',
              outline: 'none',
              fontFamily: "'DM Sans', sans-serif"
            }}
          />
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          {filteredNotifs.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#6b7690', fontSize: 13 }}>
              No notifications found
            </div>
          ) : (
            filteredNotifs.map((n: any) => (
              <div
                key={n.id}
                onClick={() => handleSelectNotification(n)}
                style={{
                  padding: '14px',
                  borderRadius: 12,
                  border: `1px solid ${n.unread ? '#e8eefd' : '#e4e8f1'}`,
                  background: n.unread ? '#f8fafc' : '#ffffff',
                  marginBottom: 10,
                  cursor: 'pointer',
                  transition: 'background 150ms ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ color: n.color, marginTop: 2 }}>{n.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <h4 style={{ margin: 0, fontSize: 13, fontWeight: n.unread ? 700 : 600, color: '#101a33' }}>
                        {n.title}
                      </h4>
                      <span style={{ fontSize: 11, color: '#6b7690', whiteSpace: 'nowrap' }}>{n.time}</span>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: '#6b7690', lineHeight: 1.4 }}>
                      {n.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Drawer>

      <style jsx global>{`
        body {
          background-color: var(--bg);
          color: var(--ink);
          margin: 0;
          padding: 0;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .portal-root-layout {
          min-height: 100vh;
          background-color: #f3f5fa;
          display: flex;
          box-sizing: border-box;
        }

        .portal-main-wrapper {
          flex: 1;
          margin-left: 248px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          min-width: 0;
          background-color: #f3f5fa;
        }

        .portal-topbar {
          height: 64px;
          background-color: #ffffff;
          border-bottom: 1px solid #e4e8f1;
          position: sticky;
          top: 0;
          z-index: 80;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 36px;
          box-sizing: border-box;
        }

        .portal-topbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .portal-page-title {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #101a33;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        .portal-back-link {
          color: #6b7690;
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: color 150ms ease;
        }
        .portal-back-link:hover {
          color: #101a33;
        }

        .portal-topbar-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .portal-zero-fees-pill {
          background-color: #e3f4ec;
          color: #1f8a5b;
          font-size: 12px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 7px;
          user-select: none;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        .portal-zero-fees-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #1f8a5b;
        }

        .portal-notif-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: 1px solid #e4e8f1;
          background-color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: border-color 150ms ease, background-color 150ms ease;
          padding: 0;
        }
        .portal-notif-btn:hover {
          border-color: #cbd5e1;
          background-color: #f8fafc;
        }
        .portal-notif-btn:focus-visible {
          outline: 2px solid #2f5bea;
          outline-offset: 2px;
        }

        .portal-notif-unread-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: #ef4444;
          border: 1.5px solid #ffffff;
        }

        .portal-content-body {
          flex: 1;
          width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 800px) {
          .portal-main-wrapper {
            margin-left: 0;
          }
          .portal-topbar {
            padding: 14px 18px;
          }
        }
      `}</style>
    </div>
  );
}
