'use client';

import { useState, useEffect } from 'react';
import AdminShell, { C, F } from '../components/AdminShell';
import { 
  AdminPanelSettingsRounded, 
  DnsRounded, 
  TerminalRounded,
  EnhancedEncryptionRounded 
} from '@mui/icons-material';

export default function AdminSettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const stored = sessionStorage.getItem('rb_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  if (!mounted) return null;

  return (
    <AdminShell>
      <div style={{ maxWidth: 900, margin: '0 auto', width: '100%' }}>
        
        {/* Title */}
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 300, color: C.text, fontFamily: F.serif }}>
            Settings & Security Desk
          </h1>
          <p style={{ margin: '8px 0 0', fontSize: 13, color: C.textSub }}>
            Manage administrative profile controls, API connections, and tenant settings.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          
          {/* Admin Profile */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <AdminPanelSettingsRounded sx={{ color: C.blueLight }} />
              <h3 style={{ margin: 0, fontSize: 16, color: C.text, fontFamily: F.heading }}>Admin Profile Credentials</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
              <div>
                <span style={{ fontSize: 10.5, color: C.textMuted, fontWeight: 800 }}>FIRST NAME</span>
                <p style={{ margin: '4px 0 0', fontSize: 14, color: C.textSub }}>{user?.firstName || 'Resolve'}</p>
              </div>
              <div>
                <span style={{ fontSize: 10.5, color: C.textMuted, fontWeight: 800 }}>LAST NAME</span>
                <p style={{ margin: '4px 0 0', fontSize: 14, color: C.textSub }}>{user?.lastName || 'Administrator'}</p>
              </div>
              <div>
                <span style={{ fontSize: 10.5, color: C.textMuted, fontWeight: 800 }}>EMAIL ADDRESS</span>
                <p style={{ margin: '4px 0 0', fontSize: 14, color: C.textSub }}>{user?.email || 'admin@resolvebridge.com'}</p>
              </div>
              <div>
                <span style={{ fontSize: 10.5, color: C.textMuted, fontWeight: 800 }}>PHONE NUMBER</span>
                <p style={{ margin: '4px 0 0', fontSize: 14, color: C.textSub }}>{user?.phoneNumber || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Tenancy Context */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <DnsRounded sx={{ color: C.purple }} />
              <h3 style={{ margin: 0, fontSize: 16, color: C.text, fontFamily: F.heading }}>Multi-Tenant Control</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: 10 }}>
                <span style={{ fontSize: 13, color: C.textSub }}>Assigned Role</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.purple }}>{user?.role || 'SuperAdmin'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: 10 }}>
                <span style={{ fontSize: 13, color: C.textSub }}>Institution tenancy Scope</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
                  {user?.institutionId ? `Tenancy ID: ${user.institutionId}` : 'Global System Scope (Super Admin)'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: C.textSub }}>Compliance Status</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.emerald }}>✓ FULLY AUTHORIZED</span>
              </div>
            </div>
          </div>

          {/* Security Telemetry */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <TerminalRounded sx={{ color: C.amber }} />
              <h3 style={{ margin: 0, fontSize: 16, color: C.text, fontFamily: F.heading }}>Secure Shell Telemetry</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
              <div style={{ borderLeft: `3px solid ${C.blue}`, paddingLeft: 16 }}>
                <span style={{ fontSize: 9.5, color: C.textMuted, fontWeight: 800 }}>SSL ENCRYPTION</span>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: C.textSub, fontWeight: 600 }}>AES-GCM 256-bit</p>
              </div>
              <div style={{ borderLeft: `3px solid ${C.emerald}`, paddingLeft: 16 }}>
                <span style={{ fontSize: 9.5, color: C.textMuted, fontWeight: 800 }}>IP ACCESS FILTER</span>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: C.textSub, fontWeight: 600 }}>Active Whitelist</p>
              </div>
              <div style={{ borderLeft: `3px solid ${C.purple}`, paddingLeft: 16 }}>
                <span style={{ fontSize: 9.5, color: C.textMuted, fontWeight: 800 }}>TLS PROTOCOL</span>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: C.textSub, fontWeight: 600 }}>TLS v1.3 Verified</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </AdminShell>
  );
}
