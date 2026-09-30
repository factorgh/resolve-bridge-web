'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export interface NavItemConfig {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export interface NavGroupConfig {
  group: string;
  items: NavItemConfig[];
}

export const SIDEBAR_NAV_GROUPS: NavGroupConfig[] = [
  {
    group: 'MAIN',
    items: [
      {
        label: 'Overview',
        href: '/portal',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
          </svg>
        ),
      },
      {
        label: 'Marketplace',
        href: '/portal/marketplace',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        ),
      },
      {
        label: 'Portfolio',
        href: '/portal/statement',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        ),
      },
    ],
  },
  {
    group: 'TOOLS',
    items: [
      {
        label: 'Calculators',
        href: '/portal/calculator',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="8" y1="10" x2="16" y2="10" />
            <line x1="8" y1="14" x2="16" y2="14" />
            <line x1="8" y1="18" x2="16" y2="18" />
          </svg>
        ),
      },
      {
        label: 'Messages',
        href: '/portal/chat',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        ),
      },
      {
        label: 'Vault',
        href: '/portal/documents',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        ),
      },
    ],
  },
  {
    group: 'ACCOUNT',
    items: [
      {
        label: 'Billing plan',
        href: '/portal/billing',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M12 10v4" />
            <path d="M10 12h4" />
          </svg>
        ),
      },
      {
        label: 'Settings',
        href: '/portal/settings',
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        ),
      },
    ],
  },
];

export interface SidebarProps {
  user?: any;
  onLogout?: () => void;
}

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('rb_user');
        localStorage.removeItem('rb_token');
      }
      router.push('/login');
    }
  };

  const firstName = user?.firstName || 'Thethrees';
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <>
      {/* Desktop & Tablet Sticky Sidebar */}
      <aside className="portal-sidebar-desktop">
        {/* Brand Block */}
        <div className="portal-sidebar-brand">
          <div className="portal-sidebar-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f1a33" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19V9a8 8 0 0 1 16 0v10" />
              <line x1="2" y1="19" x2="22" y2="19" />
              <line x1="12" y1="9" x2="12" y2="19" />
            </svg>
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="portal-sidebar-brand-name">ResolveBridge</div>
            <div className="portal-sidebar-brand-sub">Personal finance portal</div>
          </div>
        </div>

        {/* Navigation Grouped */}
        <div className="portal-sidebar-nav">
          {SIDEBAR_NAV_GROUPS.map((group) => (
            <div key={group.group} style={{ marginBottom: 20 }}>
              <div className="portal-sidebar-group-label">{group.group}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/portal' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`portal-sidebar-item ${isActive ? 'active' : ''}`}
                    >
                      <span className="portal-sidebar-icon">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Above Footer: Trust Note */}
        <div style={{ padding: '0 16px 12px' }}>
          <div className="portal-sidebar-trust">
            <span className="portal-sidebar-trust-dot" />
            <span>GH Card verified · Secure session</span>
          </div>
        </div>

        {/* Footer: User & Sign out */}
        <div className="portal-sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
            <div className="portal-sidebar-avatar">
              {initial}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="portal-sidebar-user-name">{firstName}</div>
              <div className="portal-sidebar-user-sub">Personal account</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            aria-label="Sign out"
            className="portal-sidebar-logout-btn"
            title="Sign out"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Mobile Horizontal Top Strip (< 800px) */}
      <div className="portal-sidebar-mobile">
        <div className="portal-sidebar-mobile-inner">
          <div className="portal-sidebar-mobile-brand">
            <div className="portal-sidebar-logo" style={{ width: 28, height: 28, borderRadius: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f1a33" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19V9a8 8 0 0 1 16 0v10" />
                <line x1="2" y1="19" x2="22" y2="19" />
              </svg>
            </div>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 13.5 }}>ResolveBridge</span>
          </div>

          <div className="portal-sidebar-mobile-nav">
            {SIDEBAR_NAV_GROUPS.flatMap((g) => g.items).map((item) => {
              const isActive = pathname === item.href || (item.href !== '/portal' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`portal-sidebar-item mobile ${isActive ? 'active' : ''}`}
                >
                  <span className="portal-sidebar-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx global>{`
        :root {
          --bg: #f3f5fa;
          --card: #ffffff;
          --ink: #101a33;
          --mute: #6b7690;
          --line: #e4e8f1;
          --accent: #2f5bea;
          --accent-soft: #e8eefd;
          --green: #1f8a5b;
          --green-soft: #e3f4ec;
          --gold: #c9a24b;
          --sidebar-bg: #0f1a33;
          --sidebar-text: #aeb8d0;
          --sidebar-divider: #1e2a48;
          --sidebar-active-bg: #1a2a55;
          --sidebar-active-text: #8fb0ff;
          --sidebar-group-label: #6f7b98;
        }

        .portal-sidebar-desktop {
          width: 248px;
          min-width: 248px;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          background-color: var(--sidebar-bg);
          display: flex;
          flex-direction: column;
          z-index: 90;
          box-sizing: border-box;
        }

        .portal-sidebar-brand {
          padding: 20px 20px 18px;
          display: flex;
          alignItems: center;
          gap: 12px;
          border-bottom: 1px solid var(--sidebar-divider);
        }

        .portal-sidebar-logo {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: linear-gradient(135deg, #c9a24b, #e8cf8e);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }

        .portal-sidebar-brand-name {
          color: #ffffff;
          font-size: 15px;
          font-weight: 700;
          line-height: 1.2;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        .portal-sidebar-brand-sub {
          color: var(--sidebar-text);
          font-size: 12px;
          margin-top: 2px;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        .portal-sidebar-nav {
          flex: 1;
          padding: 20px 16px 12px;
          overflow-y: auto;
          scrollbar-width: none;
        }
        .portal-sidebar-nav::-webkit-scrollbar {
          display: none;
        }

        .portal-sidebar-group-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          color: var(--sidebar-group-label);
          padding: 0 10px 8px;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        .portal-sidebar-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 9px 10px;
          border-radius: 9px;
          color: var(--sidebar-text);
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 500;
          transition: background-color 150ms ease, color 150ms ease;
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .portal-sidebar-item:hover {
          background-color: var(--sidebar-divider);
          color: #ffffff;
        }
        .portal-sidebar-item.active {
          background-color: var(--sidebar-active-bg);
          color: var(--sidebar-active-text);
          font-weight: 600;
        }
        .portal-sidebar-item:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }

        .portal-sidebar-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        .portal-sidebar-trust {
          font-size: 12px;
          color: var(--sidebar-text);
          border: 1px solid var(--sidebar-divider);
          background: rgba(255, 255, 255, 0.02);
          border-radius: 9px;
          padding: 9px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .portal-sidebar-trust-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--green);
          flex-shrink: 0;
        }

        .portal-sidebar-footer {
          padding: 14px 16px;
          border-top: 1px solid var(--sidebar-divider);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: auto;
        }

        .portal-sidebar-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--accent);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
          flex-shrink: 0;
        }

        .portal-sidebar-user-name {
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        .portal-sidebar-user-sub {
          color: var(--sidebar-text);
          font-size: 11px;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        .portal-sidebar-logout-btn {
          background: transparent;
          border: none;
          color: var(--sidebar-text);
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 150ms ease, background-color 150ms ease;
        }
        .portal-sidebar-logout-btn:hover {
          color: #f28b82;
          background: rgba(242, 139, 130, 0.1);
        }
        .portal-sidebar-logout-btn:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }

        .portal-sidebar-mobile {
          display: none;
          background: var(--sidebar-bg);
          border-bottom: 1px solid var(--sidebar-divider);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .portal-sidebar-mobile-inner {
          display: flex;
          align-items: center;
          padding: 10px 16px;
          gap: 16px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .portal-sidebar-mobile-inner::-webkit-scrollbar {
          display: none;
        }
        .portal-sidebar-mobile-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .portal-sidebar-mobile-nav {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .portal-sidebar-item.mobile {
          white-space: nowrap;
          padding: 6px 10px;
          font-size: 12.5px;
        }

        @media (max-width: 800px) {
          .portal-sidebar-desktop {
            display: none !important;
          }
          .portal-sidebar-mobile {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}
