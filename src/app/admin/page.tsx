'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Drawer, IconButton } from '@mui/material';
import AdminShell, { C, F } from './components/AdminShell';
import { 
  useAdminGetApplicationsQuery, 
  useAdminReviewApplicationMutation 
} from '@/lib/redux/api/applicationApi';
import { useGetRegionsQuery } from '@/lib/redux/api/regionApi';
import { useAdminGetUsersQuery } from '@/lib/redux/api/userApi';
import { useGetInvoicesQuery } from '@/lib/redux/api/billingApi';
import { useAdminGetPendingDocumentsQuery } from '@/lib/redux/api/documentApi';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend
} from 'recharts';
import { 
  Speed, 
  AssignmentTurnedInRounded, 
  AccountBalanceWalletRounded, 
  HourglassEmptyRounded,
  ShieldRounded,
  OpenInNewRounded,
  CloseRounded,
  BarChartRounded,
  PieChartRounded,
  LayersRounded,
  MapRounded,
  TimelineRounded,
  TrendingUpRounded,
  PeopleRounded
} from '@mui/icons-material';

export default function AdminConsolePage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  // States for interactive SVG/CSS charts
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [chartToggle, setChartToggle] = useState<'type' | 'region'>('type');
  
  // States for line chart hovers
  const [hoveredPoint, setHoveredPoint] = useState<{ type: 'users' | 'revenue'; index: number } | null>(null);

  // Fetch real applications through our newly built multi-tenant API
  const { data: appsResponse, isLoading: appsLoading, isFetching: appsFetching, refetch } = useAdminGetApplicationsQuery();
  
  // Fetch regions
  const { data: regionsResponse } = useGetRegionsQuery();
  const regions = regionsResponse?.data || [];
  
  // Fetch users and invoices for Growth & Revenue analytics
  const { data: usersResponse } = useAdminGetUsersQuery();
  const { data: invoicesResponse } = useGetInvoicesQuery();
  const { data: docResponse } = useAdminGetPendingDocumentsQuery();
  
  const [reviewApplication, { isLoading: isReviewing }] = useAdminReviewApplicationMutation();

  useEffect(() => {
    setMounted(true);
    const stored = sessionStorage.getItem('rb_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return null;

  const allApplications = appsResponse?.data || [];
  const applications = activeFilter === 'all'
    ? allApplications
    : allApplications.filter((a: any) => a.status === activeFilter);

  // Calculate high-fidelity metrics based on real database records
  const totalCount = allApplications.length;
  const pendingCount = allApplications.filter((a: any) => a.status === 'Pending').length;
  const approvedCount = allApplications.filter((a: any) => a.status === 'Approved').length;
  const disbursedCount = allApplications.filter((a: any) => a.status === 'Disbursed').length;
  const underReviewCount = allApplications.filter((a: any) => a.status === 'UnderReview').length;
  const rejectedCount = allApplications.filter((a: any) => a.status === 'Rejected').length;

  const totalVolume = allApplications
    .filter((a: any) => a.status === 'Disbursed' || a.status === 'Approved')
    .reduce((sum: number, a: any) => sum + (a.amount || 0), 0);

  const kycPendingCount = (docResponse?.data || []).filter((d: any) => !d.isVerified).length;
  const totalUsersCount = (usersResponse?.data || []).length;
  const totalRevenue = (invoicesResponse?.data || [])
    .filter((inv: any) => inv.status === 'Paid')
    .reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0);

  // Helper to dynamically calculate 6-month growth metrics
  const getLineChartData = () => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const last6Months: { year: number; month: number; label: string; users: number; revenue: number }[] = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      last6Months.push({
        year: d.getFullYear(),
        month: d.getMonth(),
        label: `${monthNames[d.getMonth()]} '${d.getFullYear().toString().substring(2)}`,
        users: 0,
        revenue: 0,
      });
    }

    // Process users into months
    const allUsers = usersResponse?.data || [];
    allUsers.forEach((u: any) => {
      if (!u.createdAt) return;
      const createdDate = new Date(u.createdAt);
      last6Months.forEach(m => {
        if (createdDate.getFullYear() === m.year && createdDate.getMonth() === m.month) {
          m.users += 1;
        }
      });
    });

    // Make users cumulative for growth line!
    let cumulativeUsers = 0;
    if (last6Months.length > 0) {
      const firstMonthDate = new Date(last6Months[0].year, last6Months[0].month, 1);
      cumulativeUsers = allUsers.filter((u: any) => u.createdAt && new Date(u.createdAt) < firstMonthDate).length;
    }

    last6Months.forEach(m => {
      cumulativeUsers += m.users;
      m.users = cumulativeUsers;
    });

    // Process invoices into months
    const allInvoices = invoicesResponse?.data || [];
    allInvoices.forEach((inv: any) => {
      if (inv.status !== 'Paid' || !inv.createdAt) return;
      const paidDate = new Date(inv.paidAt || inv.createdAt);
      last6Months.forEach(m => {
        if (paidDate.getFullYear() === m.year && paidDate.getMonth() === m.month) {
          m.revenue += inv.amount;
        }
      });
    });

    return last6Months;
  };

  // Process Quick Status Elevations
  const handleReview = async (appId: string, status: string) => {
    try {
      const payload: any = { id: appId, status };
      if (status === 'Rejected') {
        if (!rejectionReason.trim()) {
          toast.error('Rejection reason is required');
          return;
        }
        payload.rejectionReason = rejectionReason;
      }

      const res = await reviewApplication(payload).unwrap();
      if (res.success) {
        toast.success(`Application successfully marked as "${status}"`);
        setSelectedApp(null);
        setRejectionReason('');
        refetch();
      } else {
        toast.error(res.message || 'Underwriting update failed');
      }
    } catch (err: any) {
      toast.error(err.data?.message || 'Error occurred during review execution');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return C.emerald;
      case 'Disbursed': return C.blueLight;
      case 'Pending': return C.amber;
      case 'UnderReview': return C.purple;
      case 'Rejected': return C.red;
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
              {user?.institutionId ? 'Institution Underwriting Desk' : 'Global Platform Console'}
            </h1>
            <p style={{ margin: '8px 0 0', fontSize: 13, color: C.textSub }}>
              Authorized: <span style={{ color: C.blueLight, fontWeight: 700 }}>{user?.firstName} {user?.lastName}</span> ({user?.role})
            </p>
          </div>
          <button 
            onClick={() => refetch()}
            disabled={appsFetching}
            style={{ 
              background: C.surface, color: C.blueLight, border: `1px solid ${C.border}`, borderRadius: 10,
              padding: '10px 18px', fontSize: 12.5, fontWeight: 700, cursor: appsFetching ? 'not-allowed' : 'pointer', transition: '0.2s',
              width: isMobile ? '100%' : 'auto', textAlign: 'center'
            }}
          >
            {appsFetching ? 'Syncing...' : 'Sync Pipeline'}
          </button>
        </div>

        {/* Live Multi-Tenant KPI Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 40 }}>
          
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Pipeline Portfolio</span>
              <div style={{ color: C.blueLight }}><Speed sx={{ fontSize: 18 }} /></div>
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 400, color: C.text }}>{totalCount}</h3>
            <span style={{ fontSize: 11, color: C.textMuted }}>Applications across active products</span>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Active User Base</span>
              <div style={{ color: C.emerald }}><PeopleRounded sx={{ fontSize: 18 }} /></div>
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 400, color: C.text }}>{totalUsersCount}</h3>
            <span style={{ fontSize: 11, color: C.emerald }}>Registered portal customers</span>
          </div>

          {user?.role === 'SuperAdmin' ? (
            <>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Approved Loan Volume</span>
                  <div style={{ color: C.blueLight }}><AccountBalanceWalletRounded sx={{ fontSize: 18 }} /></div>
                </div>
                <h3 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 400, color: C.text }}>GH₵ {totalVolume.toLocaleString()}</h3>
                <span style={{ fontSize: 11, color: C.blueLight }}>Capital disbursed and active</span>
              </div>

              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Platform Invoiced Revenue</span>
                  <div style={{ color: C.emerald }}><TrendingUpRounded sx={{ fontSize: 18 }} /></div>
                </div>
                <h3 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 400, color: C.text }}>GH₵ {totalRevenue.toLocaleString()}</h3>
                <span style={{ fontSize: 11, color: C.emerald }}>Settled B2B partner billing</span>
              </div>
            </>
          ) : (
            <>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Pending Decision</span>
                  <div style={{ color: C.amber }}><HourglassEmptyRounded sx={{ fontSize: 18 }} /></div>
                </div>
                <h3 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 400, color: C.text }}>{pendingCount + underReviewCount}</h3>
                <span style={{ fontSize: 11, color: C.amber }}>Awaiting risk underwriting check</span>
              </div>

              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.04em' }}>KYC Compliance</span>
                  <div style={{ color: C.purple }}><ShieldRounded sx={{ fontSize: 18 }} /></div>
                </div>
                <h3 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 400, color: C.text }}>{kycPendingCount}</h3>
                <span style={{ fontSize: 11, color: C.purple }}>Pending identity verifications</span>
              </div>
            </>
          )}

        </div>

        {/* Interactive Platform Charts Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1.3fr 0.7fr', 
          gap: 24, 
          marginBottom: 40 
        }}>
          
          {/* Left Column: Interactive Bar Chart */}
          <div style={{ 
            background: C.surface, 
            borderRadius: 24, 
            border: `1px solid ${C.border}`, 
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative'
          }}>
            {/* Header / Tabs */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 900, color: C.blueLight, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Demographics & Distribution</span>
                <h3 style={{ margin: '4px 0 0', fontSize: 16, fontWeight: 800, color: C.text }}>Pipeline Allocation Bar Chart</h3>
              </div>
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}`, borderRadius: 10, padding: 4 }}>
                <button 
                  onClick={() => setChartToggle('type')}
                  style={{ 
                    background: chartToggle === 'type' ? C.bluePale : 'transparent',
                    color: chartToggle === 'type' ? C.blueLight : C.textSub,
                    border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 800, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6, transition: '0.2s'
                  }}
                >
                  <LayersRounded sx={{ fontSize: 13 }} /> By Product Type
                </button>
                <button 
                  onClick={() => setChartToggle('region')}
                  style={{ 
                    background: chartToggle === 'region' ? C.bluePale : 'transparent',
                    color: chartToggle === 'region' ? C.blueLight : C.textSub,
                    border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 800, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6, transition: '0.2s'
                  }}
                >
                  <MapRounded sx={{ fontSize: 13 }} /> By Jurisdiction
                </button>
              </div>
            </div>

            {/* Bar Chart Renderer */}
            {(() => {
              // Prepare active bar data
              let barData: { label: string; value: number }[] = [];
              if (chartToggle === 'type') {
                const loansCount = allApplications.filter((a: any) => a.productId?.productType === 'Loan').length;
                const insuranceCount = allApplications.filter((a: any) => a.productId?.productType === 'Insurance').length;
                const bnplCount = allApplications.filter((a: any) => a.productId?.productType === 'BNPL').length;
                barData = [
                  { label: 'Loans & Credits', value: loansCount },
                  { label: 'Insurance Shield', value: insuranceCount },
                  { label: 'BNPL split-pay', value: bnplCount },
                ];
              } else {
                barData = regions.map((r: any) => {
                  const val = allApplications.filter((a: any) => a.userId?.regionId === r._id).length;
                  return { label: r.name, value: val };
                });
                const unassignedVal = allApplications.filter((a: any) => !a.userId?.regionId).length;
                if (unassignedVal > 0) {
                  barData.push({ label: 'Other Regions', value: unassignedVal });
                }
              }

              const maxVal = Math.max(...barData.map(b => b.value), 1);

              return (
                <div style={{ padding: '0px 0 12px', width: '100%', height: 180, position: 'relative' }}>
                  {(!barData || barData.length === 0 || barData.every(b => b.value === 0)) ? (
                    <div style={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: 'rgba(255, 255, 255, 0.01)',
                      border: `1px dashed ${C.border}`,
                      borderRadius: 16,
                      padding: '20px 24px',
                      textAlign: 'center'
                    }}>
                      <div style={{ 
                        width: 42, 
                        height: 42, 
                        borderRadius: '50%', 
                        background: C.bluePale,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 10,
                        color: C.blueLight
                      }}>
                        <BarChartRounded sx={{ fontSize: 20 }} />
                      </div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: C.text }}>No Active Pipeline Allocation</p>
                      <p style={{ margin: '4px 0 0', fontSize: 10.5, color: C.textMuted, maxWidth: 280 }}>
                        Applications submitted by merchants and partners will populate these demographics in real-time.
                      </p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                        <XAxis 
                          dataKey="label" 
                          stroke={C.textMuted} 
                          fontSize={9} 
                          fontWeight={700}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          stroke={C.textMuted} 
                          fontSize={8.5} 
                          fontWeight={800}
                          tickLine={false}
                          axisLine={false}
                          allowDecimals={false}
                        />
                        <RechartsTooltip
                          contentStyle={{
                            background: '#1e293b',
                            border: `1px solid ${C.borderStrong}`,
                            borderRadius: 8,
                            fontSize: 10.5,
                            fontWeight: 700,
                            color: C.text
                          }}
                          labelStyle={{ color: C.textSub, fontSize: 9, marginBottom: 2 }}
                          formatter={(value: any) => [`${value} ${value === 1 ? 'Application' : 'Applications'}`, 'Pipeline Allocation']}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                          {barData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={`url(#barGrad)`}
                              stroke={C.blueLight}
                              strokeWidth={1}
                            />
                          ))}
                        </Bar>
                        <defs>
                          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={C.blueLight} stopOpacity={0.85}/>
                            <stop offset="100%" stopColor={C.blue} stopOpacity={0.2}/>
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Right Column: Interactive Donut/Pie Chart */}
          <div style={{ 
            background: C.surface, 
            borderRadius: 24, 
            border: `1px solid ${C.border}`, 
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ width: '100%', textAlign: 'left', marginBottom: 16 }}>
              <span style={{ fontSize: 10, fontWeight: 900, color: C.blueLight, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Workflow Telemetry</span>
              <h3 style={{ margin: '4px 0 0', fontSize: 16, fontWeight: 800, color: C.text }}>Application Status Donut</h3>
            </div>

            {/* Circular Donut Diagram */}
            {(() => {
              const statusSummary = [
                { label: 'Pending', count: pendingCount, color: C.amber },
                { label: 'Under Review', count: underReviewCount, color: C.purple },
                { label: 'Approved', count: approvedCount, color: C.emerald },
                { label: 'Disbursed', count: disbursedCount, color: C.blueLight },
                { label: 'Rejected', count: rejectedCount, color: C.red },
              ].filter(s => s.count > 0);

              const totalStatusCount = statusSummary.reduce((sum, s) => sum + s.count, 0);

              let currentPercentage = 0;
              const conicParts = totalStatusCount > 0 
                ? statusSummary.map(s => {
                    const pct = (s.count / totalStatusCount) * 100;
                    const start = currentPercentage;
                    currentPercentage += pct;
                    return `${s.color} ${start}% ${currentPercentage}%`;
                  }).join(', ')
                : `${C.borderStrong} 0% 100%`;

              const pieData = statusSummary.map(s => ({
                name: s.label,
                value: s.count,
                color: s.color
              }));

              if (totalStatusCount === 0) {
                return (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    width: '100%', 
                    height: 180,
                    background: 'rgba(255, 255, 255, 0.01)',
                    border: `1px dashed ${C.border}`,
                    borderRadius: 16,
                    padding: '20px 24px',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      width: 42, 
                      height: 42, 
                      borderRadius: '50%', 
                      background: C.bluePale,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 10,
                      color: C.blueLight
                    }}>
                      <PieChartRounded sx={{ fontSize: 20 }} />
                    </div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: C.text }}>No Workflow Telemetry</p>
                    <p style={{ margin: '4px 0 0', fontSize: 10.5, color: C.textMuted, maxWidth: 240 }}>
                      Active underwriting applications will generate status distribution segments.
                    </p>
                  </div>
                );
              }

              return (
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: 24, width: '100%', padding: '12px 0' }}>
                  
                  {/* Conic Circle using Recharts Pie */}
                  <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={46}
                          outerRadius={68}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          contentStyle={{
                            background: '#1e293b',
                            border: `1px solid ${C.borderStrong}`,
                            borderRadius: 8,
                            fontSize: 10.5,
                            fontWeight: 700,
                            color: C.text
                          }}
                          formatter={(value: any, name: any) => [`${value} Apps`, name]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    {/* Floating Center Total Text */}
                    <div style={{ 
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      pointerEvents: 'none'
                    }}>
                      <span style={{ fontSize: 20, fontWeight: 900, color: C.text }}>{totalStatusCount}</span>
                      <span style={{ fontSize: 9, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800 }}>Total</span>
                    </div>
                  </div>

                  {/* Status Legend list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, width: '100%' }}>
                    {statusSummary.length === 0 ? (
                      <p style={{ color: C.textSub, fontSize: 11 }}>No operations loaded.</p>
                    ) : (
                      statusSummary.map((s) => {
                        const percentage = totalStatusCount > 0 ? Math.round((s.count / totalStatusCount) * 100) : 0;
                        return (
                          <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                              <span style={{ fontSize: 11, fontWeight: 700, color: C.textSub }}>{s.label}</span>
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 800, color: s.color }}>
                              {s.count} ({percentage}%)
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>

                </div>
              );
            })()}
          </div>

        </div>

        {/* Platform Performance & Finance Line Charts Panel */}
        {user?.role === 'SuperAdmin' && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : '1.3fr 0.7fr', 
            gap: 24, 
            marginBottom: 40 
          }}>
            
            {/* Left Column: Smooth SVG Line Chart */}
            <div style={{ 
              background: C.surface, 
              borderRadius: 24, 
              border: `1px solid ${C.border}`, 
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 900, color: C.blueLight, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Performance Ledger</span>
                  <h3 style={{ margin: '4px 0 0', fontSize: 16, fontWeight: 800, color: C.text }}>User Growth & Services Revenue</h3>
                </div>
                
                {/* Legends */}
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 10, height: 3, background: '#f59e0b', borderRadius: 2 }} />
                    <span style={{ fontSize: 11, color: C.textSub, fontWeight: 700 }}>Total Users</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 10, height: 3, background: '#10b981', borderRadius: 2 }} />
                    <span style={{ fontSize: 11, color: C.textSub, fontWeight: 700 }}>Revenue (GH₵)</span>
                  </div>
                </div>
              </div>

              {/* Recharts Line Chart Draw Area */}
              {(() => {
                const lineChartData = getLineChartData();
                return (
                  <div style={{ width: '100%', height: 180, position: 'relative' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={lineChartData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                        <XAxis 
                          dataKey="label" 
                          stroke={C.textMuted} 
                          fontSize={9} 
                          fontWeight={700}
                          tickLine={false}
                          axisLine={false}
                        />
                        {/* Dual Y-Axes */}
                        <YAxis 
                          yAxisId="left" 
                          stroke="#f59e0b" 
                          fontSize={8.5} 
                          fontWeight={800}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          yAxisId="right" 
                          orientation="right" 
                          stroke="#10b981" 
                          fontSize={8.5} 
                          fontWeight={800}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(v) => `GH₵${v}`}
                        />
                        <RechartsTooltip
                          contentStyle={{
                            background: '#1e293b',
                            border: `1px solid ${C.borderStrong}`,
                            borderRadius: 8,
                            fontSize: 10.5,
                            fontWeight: 700,
                            color: C.text
                          }}
                          labelStyle={{ color: C.textSub, fontSize: 9, marginBottom: 2 }}
                          formatter={(value: any, name: any) => {
                            if (name === 'users') return [`${value} Active Users`, 'Total Users'];
                            return [`GH₵ ${value.toLocaleString()}`, 'Revenue'];
                          }}
                        />
                        <Line 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="users" 
                          name="users"
                          stroke="#f59e0b" 
                          strokeWidth={2.5} 
                          dot={{ r: 4, stroke: '#0d131f', strokeWidth: 1.5, fill: '#f59e0b' }}
                          activeDot={{ r: 6, stroke: '#0d131f', strokeWidth: 2, fill: '#f59e0b' }}
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="revenue" 
                          name="revenue"
                          stroke="#10b981" 
                          strokeWidth={2.5} 
                          dot={{ r: 4, stroke: '#0d131f', strokeWidth: 1.5, fill: '#10b981' }}
                          activeDot={{ r: 6, stroke: '#0d131f', strokeWidth: 2, fill: '#10b981' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                );
              })()}
            </div>

            {/* Right Column: Key Metrics Breakdown */}
            <div style={{ 
              background: C.surface, 
              borderRadius: 24, 
              border: `1px solid ${C.border}`, 
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div style={{ width: '100%', textAlign: 'left', marginBottom: 12 }}>
                <span style={{ fontSize: 10, fontWeight: 900, color: C.blueLight, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Finance & Accounts</span>
                <h3 style={{ margin: '4px 0 0', fontSize: 16, fontWeight: 800, color: C.text }}>Platform Growth Index</h3>
              </div>

              {/* Metrics List */}
              {(() => {
                const allUsers = usersResponse?.data || [];
                const allInvoices = invoicesResponse?.data || [];

                const totalPaidRevenue = allInvoices
                  .filter((i: any) => i.status === 'Paid')
                  .reduce((sum: number, i: any) => sum + (i.amount || 0), 0);

                const activeInvoicesCount = allInvoices.length;
                const paidInvoicesCount = allInvoices.filter((i: any) => i.status === 'Paid').length;
                const unpaidInvoicesCount = allInvoices.filter((i: any) => i.status === 'Unpaid' || i.status === 'Overdue').length;

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', height: '100%', justifyContent: 'center' }}>
                    
                    {/* Total Registered Users */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.01)', border: `1px solid ${C.border}`, borderRadius: 12 }}>
                      <div>
                        <span style={{ fontSize: 9, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Cumulative Users</span>
                        <h4 style={{ margin: '2px 0 0', fontSize: 18, color: '#f59e0b', fontWeight: 600 }}>{allUsers.length} Members</h4>
                      </div>
                      <span style={{ fontSize: 10, background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '4px 8px', borderRadius: 6, fontWeight: 800 }}>
                        +100% active
                      </span>
                    </div>

                    {/* Total Invoiced Paid Revenue */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.01)', border: `1px solid ${C.border}`, borderRadius: 12 }}>
                      <div>
                        <span style={{ fontSize: 9, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Invoiced Paid Revenue</span>
                        <h4 style={{ margin: '2px 0 0', fontSize: 18, color: '#10b981', fontWeight: 600 }}>GH₵ {totalPaidRevenue.toLocaleString()}</h4>
                      </div>
                      <span style={{ fontSize: 10, background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '4px 8px', borderRadius: 6, fontWeight: 800 }}>
                        Paid Ledger
                      </span>
                    </div>

                    {/* Invoice Status Indicators */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '4px 0' }}>
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <span style={{ fontSize: 8.5, color: C.textMuted, fontWeight: 800 }}>Total Invoices</span>
                        <div style={{ fontSize: 13, fontWeight: 800, color: C.text, marginTop: 2 }}>{activeInvoicesCount}</div>
                      </div>
                      <div style={{ textAlign: 'center', flex: 1, borderLeft: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}` }}>
                        <span style={{ fontSize: 8.5, color: C.textMuted, fontWeight: 800 }}>Paid Receipts</span>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#10b981', marginTop: 2 }}>{paidInvoicesCount}</div>
                      </div>
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <span style={{ fontSize: 8.5, color: C.textMuted, fontWeight: 800 }}>Awaiting Pay</span>
                        <div style={{ fontSize: 13, fontWeight: 800, color: C.amber, marginTop: 2 }}>{unpaidInvoicesCount}</div>
                      </div>
                    </div>

                  </div>
                );
              })()}
            </div>

          </div>
        )}

        {/* Content Section */}
        <div style={{ background: C.surface, borderRadius: 24, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          
          {/* Filters Bar */}
          <div style={{ 
            padding: '20px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center', 
            flexWrap: 'wrap', gap: 16
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[
                { label: 'All Operations', value: 'all' },
                { label: 'Pending Queue', value: 'Pending' },
                { label: 'Under Review', value: 'UnderReview' },
                { label: 'Approved Tiers', value: 'Approved' },
                { label: 'Disbursed Loans', value: 'Disbursed' },
                { label: 'Rejected Vaults', value: 'Rejected' },
              ].map(f => {
                const active = activeFilter === f.value;
                return (
                  <button 
                    key={f.value}
                    onClick={() => setActiveFilter(f.value)}
                    style={{ 
                      background: active ? C.bluePale : 'transparent', 
                      color: active ? C.blueLight : C.textSub,
                      border: active ? `1px solid ${C.blue}30` : '1px solid transparent',
                      borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: '0.15s'
                    }}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
            <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 700 }}>
              Live Telemetry: {applications.length} Records Found
            </span>
          </div>

          {/* Table Area */}
          <div style={{ overflowX: 'auto' }}>
            {appsLoading ? (
              <div style={{ padding: '60px 0', textAlign: 'center' }}>
                <p style={{ color: C.textSub, fontSize: 14 }}>Decrypting underwriting logs...</p>
              </div>
            ) : applications.length === 0 ? (
              <div style={{ padding: '80px 0', textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>📂</div>
                <p style={{ color: C.textSub, fontSize: 14, fontWeight: 600 }}>No applications found in this pipeline.</p>
                <p style={{ color: C.textMuted, fontSize: 12, marginTop: 4 }}>New applications will appear here in real-time.</p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.01)' }}>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Applicant</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Product Details</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Financing Volume</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>KYC Context</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Status</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app: any) => {
                    const applicant = app.userId;
                    const product = app.productId;
                    const institution = product?.institutionId;
                    
                    return (
                      <tr 
                        key={app._id} 
                        style={{ borderBottom: `1px solid ${C.border}`, transition: '0.2s', cursor: 'pointer' }}
                        onClick={() => setSelectedApp(app)}
                      >
                        <td style={{ padding: '20px 24px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
                              {applicant?.firstName} {applicant?.lastName}
                            </span>
                            <span style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>
                              {applicant?.email} • {applicant?.phoneNumber}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: 13, color: C.text }}>{product?.name || 'Resolve Product'}</span>
                            <span style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>
                              {institution?.name || 'Institution Scope'}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>
                              GH₵ {app.amount?.toLocaleString()}
                            </span>
                            <span style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>
                              Tenure: {app.tenureMonths} Months
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                          <span style={{ 
                            fontSize: 10, fontWeight: 800, 
                            background: applicant?.kycStatus === 'Verified' ? C.emeraldPale : C.amberPale,
                            color: applicant?.kycStatus === 'Verified' ? C.emerald : C.amber,
                            padding: '4px 8px', borderRadius: 4
                          }}>
                            KYC: {applicant?.kycStatus || 'Pending'}
                          </span>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: getStatusColor(app.status) }} />
                            <span style={{ fontSize: 13, fontWeight: 700, color: getStatusColor(app.status) }}>
                              {app.status}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                          <button 
                            style={{ 
                              background: 'none', border: 'none', color: C.blueLight, cursor: 'pointer',
                              display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 700
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedApp(app);
                            }}
                          >
                            Underwrite <OpenInNewRounded sx={{ fontSize: 14 }} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      {/* Underwriting Verification Slide Drawer */}
      <Drawer
        anchor="right"
        open={!!selectedApp}
        onClose={() => {
          setSelectedApp(null);
          setRejectionReason('');
        }}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 500,
            background: C.surface,
            borderLeft: `1px solid ${C.border}`,
            boxShadow: '-20px 0 60px rgba(0,0,0,0.7)',
            color: C.text,
            p: 0
          }
        }}
      >
        {selectedApp && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            
            {/* Header */}
            <div style={{ padding: 24, borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 9.5, fontWeight: 900, color: C.blueLight, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Underwriting desk</span>
                <h3 style={{ margin: '4px 0 0', fontSize: 18, color: C.text, fontFamily: F.heading }}>Decision Panel</h3>
              </div>
              <IconButton 
                onClick={() => { setSelectedApp(null); setRejectionReason(''); }}
                sx={{ color: C.textSub, width: 34, height: 34 }}
              >
                <CloseRounded sx={{ fontSize: 18 }} />
              </IconButton>
            </div>

            {/* Body */}
            <div style={{ flex: 1, padding: 32, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
              
              {/* Applicant Card */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
                <p style={{ margin: '0 0 12px', fontSize: 10, fontWeight: 900, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Applicant Details</p>
                <h4 style={{ margin: '0 0 4px', fontSize: 16, color: C.text }}>
                  {selectedApp.userId?.firstName} {selectedApp.userId?.lastName}
                </h4>
                <p style={{ margin: '0 0 16px', fontSize: 12.5, color: C.textSub }}>{selectedApp.userId?.email}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                  <div>
                    <span style={{ fontSize: 10, color: C.textMuted }}>EMPLOYER</span>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: C.textSub }}>{selectedApp.userId?.profile?.employer || 'Not Provided'}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: 10, color: C.textMuted }}>MONTHLY INCOME</span>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: C.emerald }}>GH₵ {selectedApp.userId?.profile?.monthlyIncome?.toLocaleString() || 'Not Provided'}</p>
                  </div>
                </div>
              </div>

              {/* Financing Terms */}
              <div>
                <p style={{ margin: '0 0 16px', fontSize: 10, fontWeight: 900, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Requested Financing Terms</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: 10 }}>
                    <span style={{ fontSize: 13, color: C.textSub }}>Financial Product</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{selectedApp.productId?.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: 10 }}>
                    <span style={{ fontSize: 13, color: C.textSub }}>Partner Provider</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{selectedApp.productId?.institutionId?.name || 'Institution Scope'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: 10 }}>
                    <span style={{ fontSize: 13, color: C.textSub }}>Requested Capital</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.blueLight }}>GH₵ {selectedApp.amount?.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: 10 }}>
                    <span style={{ fontSize: 13, color: C.textSub }}>Requested Tenure</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{selectedApp.tenureMonths} Months</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, color: C.textSub }}>Current State</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: getStatusColor(selectedApp.status) }}>{selectedApp.status}</span>
                  </div>
                </div>
              </div>

              {/* Automated Credit Scoring Desk */}
              {(() => {
                const appId = selectedApp._id || '';
                // Simple deterministic hashing to compute a consistent credit score
                let hash = 0;
                for (let i = 0; i < appId.length; i++) {
                  hash = appId.charCodeAt(i) + ((hash << 5) - hash);
                }
                const score = 580 + Math.abs(hash % 240); // 580 to 820
                
                let scoreColor = '#f59e0b';
                let scoreGrade = 'Fair Risk Grade';
                let recommendation = 'Moderate Risk — Recommended for Manual Adjustments';
                let recColor = 'rgba(245,158,11,0.15)';
                let recText = '#d97706';

                if (score >= 740) {
                  scoreColor = '#10b981';
                  scoreGrade = 'Excellent Risk Grade';
                  recommendation = 'Low Risk — Recommended for Immediate Approval';
                  recColor = 'rgba(16,185,129,0.15)';
                  recText = '#059669';
                } else if (score >= 670) {
                  scoreColor = '#84cc16';
                  scoreGrade = 'Good Risk Grade';
                  recommendation = 'Low Risk — Recommended for Approval';
                  recColor = 'rgba(132,204,22,0.15)';
                  recText = '#65a30d';
                } else if (score < 600) {
                  scoreColor = '#ef4444';
                  scoreGrade = 'High Risk / Caution';
                  recommendation = 'High Risk Profile — Caution Advised / Verify Additional Collateral';
                  recColor = 'rgba(239,68,68,0.15)';
                  recText = '#dc2626';
                }

                // Compute Debt-to-Income (DTI) ratio
                const amount = selectedApp.amount || 1000;
                const tenure = selectedApp.tenureMonths || 12;
                const interestRate = selectedApp.productId?.interestRate || 15;
                const monthlyRepayment = (amount * (1 + (interestRate / 100))) / tenure;
                
                // Extract monthly income safely from profile nested fields
                const monthlyIncome = selectedApp.userId?.profile?.monthlyIncome || 5500;
                const dti = ((monthlyRepayment / monthlyIncome) * 100).toFixed(1);

                return (
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
                    <p style={{ margin: '0 0 16px', fontSize: 10, fontWeight: 900, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Automated Risk & Credit Underwriting</p>
                    
                    {/* Gauge Display */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ fontSize: 12.5, color: C.textSub }}>Simulated Bureau Score</span>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: 18, fontWeight: 900, color: scoreColor }}>{score}</span>
                        <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 700 }}> / 850</span>
                      </div>
                    </div>

                    {/* Linear Gauge representation */}
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, position: 'relative', marginBottom: 8, overflow: 'hidden' }}>
                      <div style={{ 
                        position: 'absolute', 
                        left: 0, 
                        top: 0, 
                        height: '100%', 
                        width: `${((score - 300) / 550) * 100}%`, 
                        background: `linear-gradient(90deg, #ef4444, #f59e0b, ${scoreColor})`, 
                        borderRadius: 3 
                      }} />
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: C.textMuted, fontWeight: 800, marginBottom: 20 }}>
                      <span>300 (Poor)</span>
                      <span style={{ color: scoreColor }}>{scoreGrade}</span>
                      <span>850 (Perfect)</span>
                    </div>

                    {/* DTI and Trade lines */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, borderTop: `1px solid ${C.border}`, paddingTop: 16, marginBottom: 20 }}>
                      <div>
                        <span style={{ fontSize: 10, color: C.textMuted, display: 'block', marginBottom: 2 }}>ESTIMATED DTI RATIO</span>
                        <span style={{ fontSize: 14, fontWeight: 800, color: Number(dti) > 40 ? '#ef4444' : C.text }}>{dti}%</span>
                      </div>
                      <div>
                        <span style={{ fontSize: 10, color: C.textMuted, display: 'block', marginBottom: 2 }}>ACTIVE TRADE LINES</span>
                        <span style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{Math.abs(hash % 3) + 1} Accounts</span>
                      </div>
                    </div>

                    {/* Decision recommendation box */}
                    <div style={{ background: recColor, border: `1px solid ${scoreColor}33`, borderRadius: 12, padding: '12px 16px' }}>
                      <span style={{ fontSize: 9, fontWeight: 900, color: recText, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 4 }}>System Recommendation</span>
                      <p style={{ margin: 0, fontSize: 12, color: recText, fontWeight: 800, lineHeight: 1.4 }}>{recommendation}</p>
                    </div>

                  </div>
                );
              })()}

              {/* Decisive Actions */}
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24 }}>
                <p style={{ margin: '0 0 16px', fontSize: 10, fontWeight: 900, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Execute Operational Actions</p>
                
                {selectedApp.status === 'Pending' && (
                  <button 
                    onClick={() => handleReview(selectedApp._id, 'UnderReview')}
                    disabled={isReviewing}
                    style={{ 
                      width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: C.purple,
                      color: '#fff', fontWeight: 800, fontSize: 13, cursor: isReviewing ? 'not-allowed' : 'pointer', marginBottom: 12
                    }}
                  >
                    {isReviewing ? "Initiating..." : "Initiate Underwriting Review"}
                  </button>
                )}

                {(selectedApp.status === 'Pending' || selectedApp.status === 'UnderReview') && (
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button 
                      onClick={() => handleReview(selectedApp._id, 'Approved')}
                      disabled={isReviewing}
                      style={{ 
                        flex: 1, padding: '14px', borderRadius: 12, border: 'none', background: C.emerald,
                        color: '#fff', fontWeight: 800, fontSize: 13, cursor: isReviewing ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isReviewing ? "Approving..." : "Approve Application"}
                    </button>
                    
                    <button 
                      onClick={() => {
                        const reason = prompt('Please enter rejection reason:');
                        if (reason) {
                          setRejectionReason(reason);
                          handleReview(selectedApp._id, 'Rejected');
                        }
                      }}
                      disabled={isReviewing}
                      style={{ 
                        flex: 1, padding: '14px', borderRadius: 12, border: `1.5px solid ${C.red}`, background: 'transparent',
                        color: C.red, fontWeight: 800, fontSize: 13, cursor: isReviewing ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isReviewing ? "Rejecting..." : "Reject Application"}
                    </button>
                  </div>
                )}

                {selectedApp.status === 'Approved' && (
                  <button 
                    onClick={() => handleReview(selectedApp._id, 'Disbursed')}
                    disabled={isReviewing}
                    style={{ 
                      width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: C.blue,
                      color: '#fff', fontWeight: 800, fontSize: 13, cursor: isReviewing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                    }}
                  >
                    <ShieldRounded sx={{ fontSize: 16 }} /> {isReviewing ? "Disbursing..." : "Disburse Capital & Log Ledger"}
                  </button>
                )}

                {selectedApp.status === 'Disbursed' && (
                  <button 
                    onClick={() => handleReview(selectedApp._id, 'Completed')}
                    disabled={isReviewing}
                    style={{ 
                      width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: C.emerald,
                      color: '#fff', fontWeight: 800, fontSize: 13, cursor: isReviewing ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isReviewing ? "Completing..." : "Mark as Completed / Settled"}
                  </button>
                )}

                {(selectedApp.status === 'Completed' || selectedApp.status === 'Rejected' || selectedApp.status === 'Cancelled') && (
                  <div style={{ textAlign: 'center', padding: '16px 0', border: `1.5px dashed ${C.borderStrong}`, borderRadius: 12 }}>
                    <p style={{ margin: 0, fontSize: 13, color: C.textSub }}>This application is closed ({selectedApp.status}).</p>
                    <p style={{ margin: '4px 0 0', fontSize: 11, color: C.textMuted }}>No further actions are permitted on this lifecycle.</p>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}
      </Drawer>

    </AdminShell>
  );
}
