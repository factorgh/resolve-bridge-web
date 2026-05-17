'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminShell, { C, F } from '../components/AdminShell';
import { useGetAuditLogsQuery } from '@/lib/redux/api/auditApi';
import { 
  SearchRounded, 
  HistoryRounded, 
  ComputerRounded, 
  GavelRounded, 
  InfoOutlined 
} from '@mui/icons-material';

export default function AdminAuditPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(false);

  const { data: auditResponse, isLoading, refetch } = useGetAuditLogsQuery();

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return null;

  const rawLogs = auditResponse?.data || [];

  // Filtration logic
  const logs = rawLogs.filter((log: any) => {
    const adminName = `${log.adminId?.firstName || ''} ${log.adminId?.lastName || ''}`.toLowerCase();
    const details = (log.details || '').toLowerCase();
    const action = (log.action || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = adminName.includes(query) || details.includes(query) || action.includes(query);

    if (actionFilter === 'all') return matchesSearch;
    return matchesSearch && log.action === actionFilter;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'ReviewApplication': return C.blueLight;
      case 'VerifyDocument': return C.emerald;
      case 'UpdateUser': return C.purple;
      default: return C.textMuted;
    }
  };

  return (
    <AdminShell>
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        
        {/* Welcome Section */}
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row', 
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'flex-start' : 'center', 
          gap: isMobile ? 16 : 24,
          marginBottom: 36 
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: isMobile ? 26 : 32, fontWeight: 300, color: C.text, fontFamily: F.serif }}>
              Compliance & Security Logs
            </h1>
            <p style={{ margin: '8px 0 0', fontSize: 13, color: C.textSub }}>
              Ecosystem audit trails tracking risk reviews, KYC card assessments, and profile deactivations.
            </p>
          </div>
          <button 
            onClick={() => refetch()}
            style={{ 
              background: C.surface, color: C.blueLight, border: `1px solid ${C.border}`, borderRadius: 10,
              padding: '10px 18px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', transition: '0.2s',
              width: isMobile ? '100%' : 'auto', textAlign: 'center'
            }}
          >
            Sync Logs
          </button>
        </div>

        {/* Console Interface */}
        <div style={{ background: C.surface, borderRadius: 24, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          
          {/* Filters Bar */}
          <div style={{ 
            padding: 24, borderBottom: `1px solid ${C.border}`, display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            gap: 20, alignItems: isMobile ? 'stretch' : 'center', flexWrap: 'wrap' 
          }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
              <input 
                placeholder="Search audit actions, operators or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  width: '100%', padding: '12px 16px 12px 42px', borderRadius: 12, border: `1px solid ${C.border}`, 
                  background: C.bg, fontSize: 13.5, outline: 'none', color: C.text 
                }}
              />
              <SearchRounded sx={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: C.textMuted }} />
            </div>

            {/* Filter buttons */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[
                { label: 'All Trails', value: 'all' },
                { label: 'Underwriting Reviews', value: 'ReviewApplication' },
                { label: 'KYC Checks', value: 'VerifyDocument' },
                { label: 'Access Updates', value: 'UpdateUser' },
              ].map(f => {
                const active = actionFilter === f.value;
                return (
                  <button 
                    key={f.value}
                    onClick={() => setActionFilter(f.value)}
                    style={{ 
                      background: active ? C.bluePale : 'transparent', 
                      color: active ? C.blueLight : C.textSub,
                      border: active ? `1px solid ${C.blue}30` : '1px solid transparent',
                      borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Audit Logs Register */}
          <div style={{ overflowX: 'auto' }}>
            {isLoading ? (
              <div style={{ padding: '60px 0', textAlign: 'center' }}>
                <p style={{ color: C.textSub, fontSize: 14 }}>Decrypting cryptographic compliance records...</p>
              </div>
            ) : logs.length === 0 ? (
              <div style={{ padding: '80px 0', textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}><HistoryRounded sx={{ fontSize: 40, color: C.textMuted }} /></div>
                <p style={{ color: C.textSub, fontSize: 14, fontWeight: 600 }}>No audit trails logged yet.</p>
                <p style={{ color: C.textMuted, fontSize: 12, marginTop: 4 }}>System operations performed by desk underwriters will reflect here.</p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.01)' }}>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', width: 220 }}>Operator</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', width: 180 }}>Operation Category</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Action Details</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', width: 140 }}>Compliance Context</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', textAlign: 'right', width: 180 }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log: any) => (
                    <tr 
                      key={log._id} 
                      style={{ borderBottom: `1px solid ${C.border}`, transition: '0.2s' }}
                    >
                      <td style={{ padding: '20px 24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: 13.5, fontWeight: 700, color: C.text }}>
                            {log.adminId?.firstName} {log.adminId?.lastName}
                          </span>
                          <span style={{ fontSize: 11, color: C.textMuted, marginTop: 3 }}>
                            {log.adminId?.role} • {log.institutionId?.name || 'Global Platform'}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <span style={{ 
                          fontSize: 10, fontWeight: 850, 
                          color: getActionColor(log.action),
                          background: `${getActionColor(log.action)}15`,
                          padding: '4px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.02em'
                        }}>
                          {log.action}
                        </span>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <span style={{ fontSize: 13, color: C.textSub, lineHeight: 1.4 }}>{log.details}</span>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <ComputerRounded sx={{ fontSize: 14, color: C.textMuted }} />
                          <span style={{ fontSize: 11.5, fontFamily: 'monospace', color: C.textMuted }}>{log.ipAddress}</span>
                        </div>
                      </td>
                      <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <span style={{ fontSize: 12.5, color: C.textSub }}>
                            {new Date(log.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span style={{ fontSize: 11, color: C.textMuted, marginTop: 3 }}>
                            {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </AdminShell>
  );
}
