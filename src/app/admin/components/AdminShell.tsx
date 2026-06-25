"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Drawer, Box, Typography, IconButton } from "@mui/material";
import {
  CloseRounded,
  NotificationsRounded,
  HistoryRounded,
  BoltRounded,
  AssignmentLateRounded,
  AccountCircleRounded,
  SecurityRounded,
  ExitToAppRounded,
  SupervisorAccountRounded,
  SettingsSuggestRounded,
  StorefrontRounded,
  VerifiedUserRounded,
  AccountBalanceWalletRounded,
  AccountBalanceRounded,
  InsightsRounded,
  LightModeRounded,
  DarkModeRounded,
  SupportAgentRounded,
  AssignmentTurnedInRounded,
  AdminPanelSettingsRounded,
  NotificationsActiveRounded,
  DoneAllRounded
} from "@mui/icons-material";
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
} from "../../../lib/redux/api/notificationApi";

/* ─── Premium Admin Design Tokens ────────────────────────────────────────── */
export const C = {
  bg: "var(--rb-bg, #0a0f1d)", // Premium deep slate-dark background
  surface: "var(--rb-surface, #111827)", // Slate surface
  border: "var(--rb-border, rgba(255,255,255,0.06))",
  borderStrong: "var(--rb-border-strong, rgba(255,255,255,0.12))",
  text: "var(--rb-text, #f3f4f6)", // White-grey primary text
  textSub: "var(--rb-text-sub, #9ca3af)", // Light muted text
  textMuted: "var(--rb-text-muted, #6b7280)", // Darker grey muted text
  blue: "var(--rb-blue, #3b82f6)", // Neon blue
  blueLight: "var(--rb-blue-light, #60a5fa)",
  bluePale: "var(--rb-blue-pale, rgba(59, 130, 246, 0.1))",
  emerald: "var(--rb-emerald, #10b981)", // Neon emerald
  emeraldLight: "var(--rb-emerald-light, #34d399)",
  emeraldPale: "var(--rb-emerald-pale, rgba(16,185,129,0.1))",
  red: "var(--rb-red, #ef4444)",
  redPale: "var(--rb-red-pale, rgba(239,68,68,0.1))",
  purple: "var(--rb-purple, #8b5cf6)",
  purplePale: "var(--rb-purple-pale, rgba(139,92,246,0.1))",
  amber: "var(--rb-amber, #f59e0b)",
  amberPale: "var(--rb-amber-pale, rgba(245,158,11,0.1))",
  sidebar: "var(--rb-sidebar, #070b16)",
  sidebarActive: "var(--rb-sidebar-active, rgba(59,130,246,0.16))",
  sidebarText: "var(--rb-sidebar-text, rgba(255,255,255,0.6))",
  sidebarHover: "var(--rb-sidebar-hover, rgba(255,255,255,0.04))",
};

export const F = {
  heading: "'Plus Jakarta Sans', system-ui, sans-serif",
  body: "'Inter', system-ui, sans-serif",
  serif: "'Lora', serif",
};

export const FONT_LINK = `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,700&family=Inter:wght@400;500;600;700&family=Lora:wght@400;700&display=swap`;

/* ─── Admin Navigation definitions ────────────────────────────────────────── */
export const NAV = [
  {
    id: "overview",
    label: "Console Home",
    href: "/admin",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: "applications",
    label: "Underwriting",
    href: "/admin/applications",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    id: "kyc",
    label: "KYC & Vaults",
    href: "/admin/kyc",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    id: "users",
    label: "User Directory",
    href: "/admin/users",
    icon: <SupervisorAccountRounded sx={{ fontSize: 20 }} />,
  },
  {
    id: "partners",
    label: "B2B Partners",
    href: "/admin/partners",
    icon: <AccountBalanceRounded sx={{ fontSize: 20 }} />,
  },
  {
    id: "products",
    label: "Products",
    href: "/admin/products",
    icon: <StorefrontRounded sx={{ fontSize: 20 }} />,
  },
  {
    id: "billing",
    label: "Partner Billing",
    href: "/admin/billing",
    icon: <AccountBalanceWalletRounded sx={{ fontSize: 20 }} />,
  },
  {
    id: "audit",
    label: "Compliance Logs",
    href: "/admin/audit",
    icon: <HistoryRounded sx={{ fontSize: 20 }} />,
  },
  {
    id: "analytics",
    label: "Analytics",
    href: "/admin/analytics",
    icon: <InsightsRounded sx={{ fontSize: 20 }} />,
  },
  {
    id: "bank-integration",
    label: "Bank Activities",
    href: "/admin/bank-integration",
    icon: <AccountBalanceRounded sx={{ fontSize: 20 }} />,
  },
  {
    id: "insurance-integration",
    label: "Insurance Desk",
    href: "/admin/insurance-integration",
    icon: <VerifiedUserRounded sx={{ fontSize: 20 }} />,
  },
  {
    id: "merchant-console",
    label: "Merchant Console",
    href: "/admin/merchant-console",
    icon: <StorefrontRounded sx={{ fontSize: 20 }} />,
  },
  {
    id: "settings",
    label: "Settings",
    href: "/admin/settings",
    icon: <SettingsSuggestRounded sx={{ fontSize: 20 }} />,
  },
  {
    id: "chat",
    label: "Client Chats",
    href: "/admin/chat",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: "support",
    label: "Support Desk",
    href: "/admin/support",
    icon: <SupportAgentRounded sx={{ fontSize: 20 }} />,
  },
];

/* ─── Admin Shell Component ─────────────────────────────────────────────── */

export default function AdminShell({
  children,
  title,
  subtitle,
  backHref,
  backLabel,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<any>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const storedTheme = localStorage.getItem('rb_theme') as 'dark' | 'light';
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('rb_theme', nextTheme);
  };

  const { data: notificationPayload } = useGetNotificationsQuery(undefined, {
    pollingInterval: 10000,
  });
  const [markNotificationRead, { isLoading: isMarkingRead }] = useMarkNotificationReadMutation();
  const notifications = notificationPayload?.data || [];
  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n: any) => !n.isRead);
    try {
      await Promise.all(unread.map((n: any) => markNotificationRead(n._id).unwrap()));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const LOADING_STEPS = [
    "Establishing Cryptographic Handshake...",
    "Authorizing Administrative Credentials...",
    "Synchronizing Multi-Tenant Vaults...",
    "Initializing Platform Command Center...",
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);

    const stored = sessionStorage.getItem("rb_user");
    if (!stored) {
      console.warn(
        "[AdminShell] Redirecting to login: Session token not found",
      );
      router.replace("/login");
    } else {
      try {
        const parsedUser = JSON.parse(stored);

        // Secure Role check
        const allowedRoles = [
          "Admin",
          "SuperAdmin",
          "InstitutionAdmin",
          "InsuranceAdmin",
          "BNPLAdmin",
          "Insurance",
          "BNPL",
        ];
        if (!allowedRoles.includes(parsedUser.role)) {
          console.error(
            "[AdminShell] Access Denied: User role is not administrative:",
            parsedUser.role,
          );
          // Redirect standard users back to their portal
          router.replace("/portal");
          return;
        }

        setUser(parsedUser);

        // Administrative scanner animation sequence
        let step = 0;
        const interval = setInterval(() => {
          if (step < LOADING_STEPS.length - 1) {
            step++;
            setLoadingStep(step);
          } else {
            clearInterval(interval);
            setTimeout(() => {
              setIsInitialLoading(false);
              setReady(true);
            }, 400);
          }
        }, 300);
      } catch (e) {
        console.error("Session parsing error", e);
        sessionStorage.removeItem("rb_user");
        router.replace("/login");
      }
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [router]);

  const logout = useCallback(() => {
    sessionStorage.removeItem("rb_user");
    localStorage.removeItem("rb_token");
    router.push("/login");
  }, [router]);

  const sidebarW = isMobile ? 0 : collapsed ? 68 : 240;
  const activeNavItem = NAV.find(
    (n) =>
      pathname === n.href ||
      (n.href !== "/admin" && pathname.startsWith(n.href)),
  );

  const visibleNav = NAV.filter((n) => {
    if (!user) return false;

    // SuperAdmin oversees everything
    if (user.role === "SuperAdmin") {
      return true;
    }

    // Platform Admin handles daily operations (no billing, compliance audit logs, or analytics)
    if (user.role === "Admin") {
      return (
        n.id !== "billing" &&
        n.id !== "audit" &&
        n.id !== "analytics"
      );
    }

    // Role-specific views
    if (user.role === "InstitutionAdmin") {
      // Banks only see their activities
      return (
        n.id !== "audit" &&
        n.id !== "users" &&
        n.id !== "partners" &&
        n.id !== "insurance-integration" &&
        n.id !== "merchant-console"
      );
    }
    if (user.role === "InsuranceAdmin") {
      // Insurance partners only see insurance desk
      return (
        n.id !== "audit" &&
        n.id !== "users" &&
        n.id !== "partners" &&
        n.id !== "bank-integration" &&
        n.id !== "merchant-console"
      );
    }
    if (user.role === "BNPLAdmin") {
      // BNPL merchants only see merchant console
      return (
        n.id !== "audit" &&
        n.id !== "users" &&
        n.id !== "partners" &&
        n.id !== "bank-integration" &&
        n.id !== "insurance-integration"
      );
    }

    // Default fallback
    return n.id === "home" || n.id === "settings";
  });

  if (!user && !isInitialLoading) return null; // Fallback for redirect

  // Custom visual badge mapping based on roles
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SuperAdmin":
        return {
          text: "SUPER ADMIN",
          bg: "linear-gradient(135deg, #4f46e5, #7c3aed)",
          shadow: "rgba(124,58,237,0.3)",
        };
      case "Admin":
        return {
          text: "PLATFORM ADMIN",
          bg: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
          shadow: "rgba(59,130,246,0.3)",
        };
      case "InstitutionAdmin":
      case "Loans":
        return {
          text: "BANK ADMIN",
          bg: "linear-gradient(135deg, #065f46, #10b981)",
          shadow: "rgba(16,185,129,0.3)",
        };
      case "InsuranceAdmin":
      case "Insurance":
        return {
          text: "INSURANCE PARTNER",
          bg: "linear-gradient(135deg, #b45309, #f59e0b)",
          shadow: "rgba(245,158,11,0.3)",
        };
      case "BNPLAdmin":
      case "BNPL":
        return {
          text: "BNPL MERCHANT",
          bg: "linear-gradient(135deg, #701a75, #d946ef)",
          shadow: "rgba(217,70,239,0.3)",
        };
      default:
        return {
          text: "PARTNER ADMIN",
          bg: "#4b5563",
          shadow: "rgba(0,0,0,0.1)",
        };
    }
  };

  const badge = getRoleBadge(user?.role || "Admin");

  const formatTime = (iso: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  const handleNotificationClick = async (notification: any) => {
    setSelectedNotif(notification);
    if (!notification.isRead) {
      await markNotificationRead(notification._id);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        fontFamily: F.body,
        display: "flex",
      }}
    >
      <link href={FONT_LINK} rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: theme === 'light' ? `
        :root {
          --rb-bg: #f8fafc;
          --rb-surface: #ffffff;
          --rb-border: rgba(0,0,0,0.08);
          --rb-border-strong: rgba(0,0,0,0.16);
          --rb-text: #0f172a;
          --rb-text-sub: #475569;
          --rb-text-muted: #94a3b8;
          --rb-blue: #2563eb;
          --rb-blue-light: #3b82f6;
          --rb-blue-pale: rgba(37, 99, 235, 0.08);
          --rb-emerald: #059669;
          --rb-emerald-light: #10b981;
          --rb-emerald-pale: rgba(5, 150, 105, 0.08);
          --rb-red: #dc2626;
          --rb-red-pale: rgba(220, 38, 38, 0.08);
          --rb-purple: #7c3aed;
          --rb-purple-pale: rgba(124, 58, 237, 0.08);
          --rb-amber: #d97706;
          --rb-amber-pale: rgba(217, 119, 6, 0.08);
          --rb-sidebar: #0f172a;
          --rb-sidebar-active: rgba(37, 99, 235, 0.12);
          --rb-sidebar-text: rgba(255, 255, 255, 0.7);
          --rb-sidebar-hover: rgba(255, 255, 255, 0.04);
        }
      ` : `
        :root {
          --rb-bg: #0a0f1d;
          --rb-surface: #111827;
          --rb-border: rgba(255,255,255,0.06);
          --rb-border-strong: rgba(255,255,255,0.12);
          --rb-text: #f3f4f6;
          --rb-text-sub: #9ca3af;
          --rb-text-muted: #6b7280;
          --rb-blue: #3b82f6;
          --rb-blue-light: #60a5fa;
          --rb-blue-pale: rgba(59, 130, 246, 0.1);
          --rb-emerald: #10b981;
          --rb-emerald-light: #34d399;
          --rb-emerald-pale: rgba(16,185,129,0.1);
          --rb-red: #ef4444;
          --rb-red-pale: rgba(239,68,68,0.1);
          --rb-purple: #8b5cf6;
          --rb-purple-pale: rgba(139,92,246,0.1);
          --rb-amber: #f59e0b;
          --rb-amber-pale: rgba(245,158,11,0.1);
          --rb-sidebar: #070b16;
          --rb-sidebar-active: rgba(59,130,246,0.16);
          --rb-sidebar-text: rgba(255,255,255,0.6);
          --rb-sidebar-hover: rgba(255,255,255,0.04);
        }
        @keyframes pulseGlow {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }
      ` }} />

      {/* Dark Mode Scanning Visual Handshake */}
      <AnimatePresence>
        {isInitialLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "#070a13",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {/* Glowing Matrix Background Effects */}
            <motion.div
              animate={{
                x: [0, 80, -80, 0],
                y: [0, -40, 40, 0],
                scale: [1, 1.1, 0.9, 1],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute",
                top: "15%",
                left: "15%",
                width: 280,
                height: 280,
                background:
                  "radial-gradient(circle, rgba(59,130,246,0.12), transparent 70%)",
                filter: "blur(50px)",
              }}
            />
            <motion.div
              animate={{
                x: [0, -100, 100, 0],
                y: [0, 80, -80, 0],
                scale: [1, 0.8, 1.2, 1],
              }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute",
                bottom: "15%",
                right: "15%",
                width: 350,
                height: 350,
                background:
                  "radial-gradient(circle, rgba(16,185,129,0.08), transparent 70%)",
                filter: "blur(70px)",
              }}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ textAlign: "center", position: "relative", zIndex: 10 }}
            >
              {/* Cyber Laser Scanner Container */}
              <div
                style={{
                  position: "relative",
                  width: 140,
                  height: 140,
                  margin: "0 auto 40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Scanning Line */}
                <motion.div
                  animate={{ top: ["10%", "90%", "10%"] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    position: "absolute",
                    left: "10%",
                    right: "10%",
                    height: 2,
                    background: `linear-gradient(90deg, transparent, ${C.blue}, transparent)`,
                    zIndex: 2,
                    boxShadow: `0 0 15px ${C.blue}`,
                    opacity: 0.8,
                  }}
                />

                {/* Outer Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    position: "absolute",
                    width: 130,
                    height: 130,
                    borderRadius: "50%",
                    border: `2px dashed ${C.blue}33`,
                    zIndex: 0,
                  }}
                />

                <motion.div
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{
                    width: 72,
                    height: 72,
                    background: C.surface,
                    borderRadius: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                    border: `1px solid ${C.borderStrong}`,
                    padding: "16px",
                  }}
                >
                  <img
                    src="/resolve_icon.png"
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                    }}
                    alt="Resolve"
                  />
                </motion.div>
              </div>

              {/* Progressive Stepper dots */}
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  justifyContent: "center",
                  marginBottom: 28,
                }}
              >
                {LOADING_STEPS.map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      width: loadingStep === i ? 28 : 6,
                      background:
                        loadingStep >= i ? C.blue : "rgba(255,255,255,0.06)",
                    }}
                    style={{ height: 4, borderRadius: 2 }}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={loadingStep}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: 10,
                      fontWeight: 900,
                      color: C.blue,
                      textTransform: "uppercase",
                      letterSpacing: "0.25em",
                      fontFamily: F.heading,
                    }}
                  >
                    Security Layer Initializing
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: C.textSub,
                    }}
                  >
                    {LOADING_STEPS[loadingStep]}
                  </p>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Administrative Sidebar */}
      {!isMobile && (
        <aside
          style={{
            width: sidebarW,
            height: "100vh",
            background: C.sidebar,
            position: "fixed",
            left: 0,
            top: 0,
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            transition: "0.2s cubic-bezier(0.2, 0, 0, 1)",
            overflow: "hidden",
            borderRight: `1px solid ${C.border}`,
          }}
        >
          <div
            style={{
              padding: "24px 20px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: 5,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
              }}
            >
              <img src="/resolve_icon.png" style={{ height: 22 }} />
            </div>
            {!collapsed && (
              <span
                style={{
                  fontWeight: 800,
                  color: "#fff",
                  fontSize: 16,
                  fontFamily: F.heading,
                  letterSpacing: "-0.02em",
                }}
              >
                ResolveAdmin
              </span>
            )}
          </div>

          <div style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
            {visibleNav.map((n) => {
              const active = activeNavItem?.id === n.id;
              const labelText =
                n.id === "billing" &&
                user?.role !== "SuperAdmin" &&
                user?.role !== "Admin"
                  ? "Billing & Plan"
                  : n.label;
              return (
                <button
                  key={n.id}
                  onClick={() => router.push(n.href)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: 12,
                    border: "none",
                    background: active ? C.sidebarActive : "transparent",
                    color: active ? "#fff" : C.sidebarText,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: "pointer",
                    transition: "0.2s",
                    marginBottom: 4,
                    outline: "none",
                    borderLeft: active
                      ? `3px solid ${C.blue}`
                      : "3px solid transparent",
                  }}
                >
                  <div style={{ color: active ? C.blueLight : C.textMuted }}>
                    {n.icon}
                  </div>
                  {!collapsed && (
                    <span style={{ fontWeight: 600, fontSize: 13.5 }}>
                      {labelText}
                    </span>
                  )}
                </button>
              );
            })}
          </div>



          <div style={{ padding: 16, borderTop: `1px solid ${C.border}` }}>
            <button
              onClick={logout}
              style={{
                width: "100%",
                padding: "11px",
                background: "rgba(239,68,68,0.1)",
                color: "#ef4444",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 10,
                fontWeight: 700,
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              Sign Out
            </button>
          </div>
        </aside>
      )}

      {/* Mobile Bottom Tab Bar */}
      {isMobile && (
        <>
          <nav
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
              height: 76,
              background: C.surface,
              borderTop: `1px solid ${C.border}`,
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              boxShadow: "0 -4px 30px rgba(0,0,0,0.2)",
            }}
          >
            {(visibleNav.length <= 5 ? visibleNav : visibleNav.slice(0, 4)).map(
              (n) => {
                const active = activeNavItem?.id === n.id;
                const labelText =
                  n.id === "billing" &&
                  user?.role !== "SuperAdmin" &&
                  user?.role !== "Admin"
                    ? "Billing"
                    : n.label.split(" ")[0];
                return (
                  <button
                    key={n.id}
                    onClick={() => router.push(n.href)}
                    style={{
                      background: "none",
                      border: "none",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: `${100 / (visibleNav.length <= 5 ? visibleNav.length : 5)}%`,
                      padding: "10px 0",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: 46,
                        height: 30,
                        borderRadius: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: active ? C.bluePale : "transparent",
                        color: active ? C.blueLight : C.textSub,
                        transition: "0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        marginBottom: 4,
                      }}
                    >
                      {n.icon}
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: active ? 800 : 500,
                        color: active ? C.text : C.textMuted,
                      }}
                    >
                      {labelText}
                    </span>
                  </button>
                );
              },
            )}

            {visibleNav.length > 5 && (
              <button
                onClick={() => setMoreMenuOpen(true)}
                style={{
                  background: "none",
                  border: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "20%",
                  padding: "10px 0",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 46,
                    height: 30,
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "transparent",
                    color: C.textSub,
                    transition: "0.2s",
                    marginBottom: 4,
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </div>
                <span
                  style={{ fontSize: 10, fontWeight: 500, color: C.textMuted }}
                >
                  More
                </span>
              </button>
            )}
          </nav>

          {/* Bottom sheet for "More" tabs */}
          <Drawer
            anchor="bottom"
            open={moreMenuOpen}
            onClose={() => setMoreMenuOpen(false)}
            PaperProps={{
              sx: {
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                background: C.surface,
                color: C.text,
                borderTop: `1px solid ${C.border}`,
                padding: "24px 24px 40px",
                boxShadow: "0 -10px 40px rgba(0,0,0,0.5)",
              },
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 800,
                  fontFamily: F.heading,
                  color: C.textSub,
                }}
              >
                More Desks
              </Typography>
              <IconButton
                onClick={() => setMoreMenuOpen(false)}
                sx={{ color: C.textSub, p: 0 }}
              >
                <CloseRounded sx={{ fontSize: 18 }} />
              </IconButton>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {visibleNav.slice(4).map((n) => {
                const active = activeNavItem?.id === n.id;
                const labelText =
                  n.id === "billing" &&
                  user?.role !== "SuperAdmin" &&
                  user?.role !== "Admin"
                    ? "Billing & Plan"
                    : n.label;
                return (
                  <button
                    key={n.id}
                    onClick={() => {
                      router.push(n.href);
                      setMoreMenuOpen(false);
                    }}
                    style={{
                      background: active
                        ? C.sidebarActive
                        : "rgba(255,255,255,0.02)",
                      border: `1px solid ${active ? C.blue + "30" : C.border}`,
                      borderRadius: 12,
                      padding: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      cursor: "pointer",
                      transition: "0.2s",
                      color: active ? "#fff" : C.textSub,
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        color: active ? C.blueLight : C.textMuted,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {n.icon}
                    </div>
                    <span
                      style={{ fontSize: 12.5, fontWeight: active ? 750 : 600 }}
                    >
                      {labelText}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              style={{
                background: C.bg,
                padding: 14,
                borderRadius: 16,
                border: `1px solid ${C.border}`,
                marginTop: 24,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 8.5,
                    fontWeight: 900,
                    color: C.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Access Context
                </p>
                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.text,
                  }}
                >
                  {user?.institutionId ? "Partner Scope" : "Full Platform"}
                </p>
              </div>
              <span
                style={{
                  fontSize: 8.5,
                  fontWeight: 900,
                  background: badge.bg,
                  color: "#fff",
                  padding: "3px 8px",
                  borderRadius: 4,
                  boxShadow: `0 2px 10px ${badge.shadow}`,
                  textTransform: "uppercase",
                }}
              >
                {badge.text}
              </span>
            </div>
          </Drawer>
        </>
      )}

      {/* Main Administrative Display Panel */}
      <main
        style={{
          flex: 1,
          marginLeft: sidebarW,
          minHeight: "100vh",
          transition: "0.2s",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top Headerbar */}
        <header
          style={{
            height: 64,
            position: "sticky",
            top: 0,
            zIndex: 80,
            background: theme === "light" ? "rgba(255,255,255,0.95)" : "rgba(10,15,29,0.95)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: isMobile ? "0 20px" : "0 32px",
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {backHref ? (
              <Link
                href={backHref}
                style={{
                  color: C.blueLight,
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                ← {backLabel || "Back"}
              </Link>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: C.text,
                    fontFamily: F.heading,
                  }}
                >
                  {activeNavItem?.label || "Administrative Console"}
                </span>
                {!isMobile && (
                  <span
                    style={{
                      fontSize: 8.5,
                      background: "rgba(59,130,246,0.15)",
                      color: C.blueLight,
                      padding: "2px 6px",
                      borderRadius: 4,
                      fontWeight: 900,
                      border: `1px solid ${C.blue}30`,
                    }}
                  >
                    SECURE SHELL v1.0
                  </span>
                )}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              position: "relative",
            }}
          >
            {/* Theme Toggle Switch */}
            <button
              onClick={toggleTheme}
              style={{
                position: "relative",
                width: 38,
                height: 38,
                borderRadius: 10,
                border: `1px solid ${C.border}`,
                background: C.surface,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "0.2s",
                padding: 0,
              }}
              title={theme === 'light' ? "Switch to Secure Dark Mode" : "Switch to Light Mode"}
            >
              {theme === 'light' ? (
                <DarkModeRounded sx={{ fontSize: 18, color: C.textSub }} />
              ) : (
                <LightModeRounded sx={{ fontSize: 18, color: C.textSub }} />
              )}
            </button>

            {/* Signals trigger */}
            <button
              onClick={() => {
                setNotifOpen(true);
                setSelectedNotif(null);
                setProfileOpen(false);
              }}
              style={{
                position: "relative",
                width: 38,
                height: 38,
                borderRadius: 10,
                border: `1px solid ${C.border}`,
                background: C.surface,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "0.2s",
                padding: 0,
              }}
            >
              <NotificationsRounded sx={{ fontSize: 18, color: C.textSub }} />
              {unreadCount > 0 ? (
                <span
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 6,
                    minWidth: 14,
                    height: 14,
                    borderRadius: 8,
                    background: C.red,
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 4px",
                    border: `1px solid ${C.surface}`,
                  }}
                >
                  {unreadCount}
                </span>
              ) : (
                <span
                  style={{
                    position: "absolute",
                    top: 11,
                    right: 11,
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: C.blue,
                    border: `2px solid ${C.surface}`,
                  }}
                />
              )}
            </button>

            <div
              style={{
                width: 1,
                height: 20,
                background: C.border,
                margin: "0 4px",
              }}
            />

            {/* Profile menu */}
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotifOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "4px 4px 4px 10px",
                borderRadius: 12,
                border: `1px solid ${profileOpen ? C.blue : C.border}`,
                background: C.surface,
                cursor: "pointer",
                transition: "0.2s",
              }}
            >
              {!isMobile && (
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12.5,
                      fontWeight: 800,
                      color: C.text,
                    }}
                  >
                    {user?.firstName || "Admin"}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 9.5,
                      color: C.emerald,
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    {user?.role}
                  </p>
                </div>
              )}
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: badge.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: 12,
                  position: "relative",
                }}
              >
                {user?.firstName?.charAt(0) || "A"}
                <div
                  style={{
                    position: "absolute",
                    bottom: -2,
                    right: -2,
                    width: 8,
                    height: 8,
                    background: C.emerald,
                    border: `1px solid ${C.surface}`,
                    borderRadius: "50%",
                  }}
                />
              </div>
            </button>

            {/* Dropdown Card */}
            <AnimatePresence>
              {profileOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setProfileOpen(false)}
                    style={{ position: "fixed", inset: 0, zIndex: 90 }}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    style={{
                      position: "absolute",
                      top: "calc(100% + 10px)",
                      right: 0,
                      width: 230,
                      background: C.surface,
                      borderRadius: 16,
                      padding: 6,
                      zIndex: 100,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <div
                      style={{
                        padding: "10px 14px",
                        borderBottom: `1px solid ${C.border}`,
                        marginBottom: 4,
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: 13,
                          fontWeight: 800,
                          color: C.text,
                        }}
                      >
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 11,
                          color: C.textSub,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {user?.email}
                      </p>
                    </div>

                    {[
                      {
                        label: "Security Center",
                        icon: <SecurityRounded sx={{ fontSize: 16 }} />,
                        href: "/admin/settings",
                      },
                      {
                        label: "System Settings",
                        icon: (
                          <SupervisorAccountRounded sx={{ fontSize: 16 }} />
                        ),
                        href: "/admin/settings",
                      },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          router.push(item.href);
                          setProfileOpen(false);
                        }}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          borderRadius: 8,
                          border: "none",
                          background: "transparent",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          cursor: "pointer",
                          transition: "0.2s",
                          color: C.textSub,
                          fontWeight: 600,
                          fontSize: 12.5,
                          outline: "none",
                        }}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    ))}

                    <div
                      style={{
                        height: 1,
                        background: C.border,
                        margin: "4px 0",
                      }}
                    />

                    <button
                      onClick={logout}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        borderRadius: 8,
                        border: "none",
                        background: "transparent",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        cursor: "pointer",
                        transition: "0.2s",
                        color: C.red,
                        fontWeight: 800,
                        fontSize: 12.5,
                      }}
                    >
                      <ExitToAppRounded sx={{ fontSize: 16 }} />
                      Sign Out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Platform Signals Drawer */}
        <Drawer
          anchor="right"
          open={notifOpen}
          onClose={() => setNotifOpen(false)}
          PaperProps={{
            sx: {
              width: "100%",
              maxWidth: 420,
              background: C.surface,
              borderLeft: `1px solid ${C.border}`,
              boxShadow: "-20px 0 60px rgba(0,0,0,0.6)",
              color: C.text,
            },
          }}
        >
          <Box
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <Box
              sx={{
                p: 3,
                borderBottom: `1px solid ${C.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 900,
                    fontFamily: F.heading,
                    color: C.text,
                    lineHeight: 1.2,
                  }}
                >
                  Platform Audit Signals
                </Typography>
                <Typography
                  sx={{
                    fontSize: 9,
                    color: C.textMuted,
                    fontWeight: 800,
                    letterSpacing: "0.05em",
                    mt: 0.5,
                  }}
                >
                  SECURED SYSTEM AUDIT FEED
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {unreadCount > 0 && (
                  <IconButton
                    onClick={handleMarkAllRead}
                    title="Mark all as read"
                    disabled={isMarkingRead}
                    sx={{
                      width: 34,
                      height: 34,
                      color: C.blue,
                      border: `1px solid ${C.border}`,
                      borderRadius: "10px",
                      background: "rgba(59,130,246,0.05)",
                      "&:hover": { background: "rgba(59,130,246,0.15)" },
                    }}
                  >
                    <DoneAllRounded sx={{ fontSize: 16 }} />
                  </IconButton>
                )}
                <IconButton
                  onClick={() => setNotifOpen(false)}
                  sx={{
                    width: 34,
                    height: 34,
                    color: C.textSub,
                    border: `1px solid ${C.border}`,
                    borderRadius: "10px",
                  }}
                >
                  <CloseRounded sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ flex: 1, overflowY: "auto" }}>
              {notifications.length > 0 ? (
                notifications.map((n) => {
                  const expanded = selectedNotif?._id === n._id;
                  const iconColor =
                    n.type === "ApplicationReview"
                      ? C.emerald
                      : n.type === "AdminAction"
                        ? C.blue
                        : C.amber;

                  const getNotifIcon = () => {
                    if (n.type === "ApplicationReview") {
                      return <AssignmentTurnedInRounded sx={{ fontSize: 16 }} />;
                    } else if (n.type === "AdminAction") {
                      return <AdminPanelSettingsRounded sx={{ fontSize: 16 }} />;
                    }
                    return <NotificationsActiveRounded sx={{ fontSize: 16 }} />;
                  };

                  return (
                    <Box
                      key={n._id}
                      onClick={() => handleNotificationClick(n)}
                      sx={{
                        p: "20px 24px",
                        borderBottom: `1px solid ${C.border}`,
                        background: expanded
                          ? C.bluePale
                          : !n.isRead
                            ? "rgba(59,130,246,0.03)"
                            : "transparent",
                        cursor: "pointer",
                        transition: "0.2s",
                        position: "relative",
                        "&:hover": {
                          background: expanded
                            ? C.bluePale
                            : "rgba(255,255,255,0.02)",
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 14 }}>
                        <Box
                          sx={{
                            width: 34,
                            height: 34,
                            borderRadius: 8,
                            background: `${iconColor}15`,
                            color: iconColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {getNotifIcon()}
                        </Box>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "baseline",
                              mb: 0.5,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: 13,
                                fontWeight: 800,
                                color: C.text,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {n.title}
                              {!n.isRead && (
                                <span
                                  style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    background: C.blue,
                                    boxShadow: `0 0 0 0 ${C.blue}80`,
                                    display: "inline-block",
                                    animation: "pulseGlow 1.5s infinite",
                                    marginLeft: 8,
                                  }}
                                />
                              )}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 9.5,
                                color: C.textMuted,
                                fontWeight: 700,
                              }}
                            >
                              {formatTime(n.createdAt)}
                            </Typography>
                          </Box>
                          <Typography
                            sx={{
                              fontSize: 11.5,
                              color: C.textSub,
                              lineHeight: 1.4,
                            }}
                          >
                            {expanded
                              ? n.message
                              : n.message.length > 90
                                ? `${n.message.slice(0, 90)}...`
                                : n.message}
                          </Typography>
                        </Box>
                      </Box>

                      <AnimatePresence initial={false}>
                        {expanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            style={{ overflow: "hidden" }}
                          >
                            <div
                              style={{
                                marginTop: 16,
                                paddingTop: 16,
                                borderTop: `1px dashed ${C.border}`,
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: 12.5,
                                  color: C.textSub,
                                  lineHeight: 1.6,
                                  mb: 2.5,
                                }}
                              >
                                {n.message}
                              </Typography>
                              <Box sx={{ display: "flex", gap: 1.5 }}>
                                {n.type === "ApplicationReview" && n.targetId && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setNotifOpen(false);
                                      router.push(`/admin/applications?appId=${n.targetId}`);
                                    }}
                                    style={{
                                      flex: 2,
                                      padding: "10px 16px",
                                      borderRadius: 10,
                                      border: "none",
                                      background: `linear-gradient(135deg, ${C.blue}, #2563eb)`,
                                      color: "#fff",
                                      fontWeight: 800,
                                      fontSize: 12,
                                      cursor: "pointer",
                                      boxShadow: "0 4px 12px rgba(37,99,235,0.2)",
                                      transition: "all 0.2s",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      gap: 6
                                    }}
                                    onMouseOver={(e) => {
                                      e.currentTarget.style.transform = "translateY(-1px)";
                                      e.currentTarget.style.boxShadow = "0 6px 16px rgba(37,99,235,0.3)";
                                    }}
                                    onMouseOut={(e) => {
                                      e.currentTarget.style.transform = "translateY(0)";
                                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(37,99,235,0.2)";
                                    }}
                                  >
                                    Review Case
                                  </button>
                                )}
                                
                                {!n.isRead && (
                                  <button
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      await markNotificationRead(n._id);
                                    }}
                                    disabled={isMarkingRead}
                                    style={{
                                      flex: 1,
                                      padding: "10px 14px",
                                      borderRadius: 10,
                                      border: `1px solid ${C.border}`,
                                      background: C.surface,
                                      color: C.textSub,
                                      fontWeight: 700,
                                      fontSize: 11.5,
                                      cursor: isMarkingRead ? "not-allowed" : "pointer",
                                      transition: "0.2s",
                                    }}
                                    onMouseOver={(e) => {
                                      if (!isMarkingRead) e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                                    }}
                                    onMouseOut={(e) => {
                                      e.currentTarget.style.background = C.surface;
                                    }}
                                  >
                                    {isMarkingRead ? "Marking..." : "Mark read"}
                                  </button>
                                )}
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedNotif(null);
                                  }}
                                  style={{
                                    flex: n.type === "ApplicationReview" && n.targetId ? 1 : 2,
                                    padding: "10px 14px",
                                    borderRadius: 10,
                                    border: `1px solid ${C.border}`,
                                    background: "transparent",
                                    color: C.textSub,
                                    fontWeight: 700,
                                    fontSize: 11.5,
                                    cursor: "pointer",
                                    transition: "0.2s",
                                  }}
                                  onMouseOver={(e) => {
                                    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                                  }}
                                  onMouseOut={(e) => {
                                    e.currentTarget.style.background = "transparent";
                                  }}
                                >
                                  Close
                                </button>
                              </Box>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Box>
                  );
                })
              ) : (
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Typography
                    sx={{ fontSize: 13, fontWeight: 800, color: C.text }}
                  >
                    No notifications yet
                  </Typography>
                  <Typography sx={{ fontSize: 11.5, color: C.textSub, mt: 1 }}>
                    Your platform activity stream will appear here once new
                    events are generated.
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Drawer>

        {/* Children Viewport Container */}
        <div
          style={{
            padding: isMobile ? "20px 16px 90px" : "32px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
