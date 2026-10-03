'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, IconButton, Tooltip } from '@mui/material';
import {
  CloseRounded,
  DirectionsCarRounded,
  LinkRounded,
  BusinessRounded,
  PersonRounded,
  PhoneRounded,
  EmailRounded,
  ExpandMoreRounded,
  ExpandLessRounded,
  SearchRounded,
  CheckCircleRounded,
  HourglassEmptyRounded,
  CancelRounded,
  LockRounded,
  AttachMoneyRounded,
  DescriptionRounded,
  ImageRounded,
  StorefrontRounded,
  ViewAgendaRounded,
  GridViewRounded,
  SpeedRounded,
  LocalGasStationRounded,
  PinDropRounded,
  CalendarTodayRounded,
  PaletteRounded,
  FingerprintRounded,
  OpenInNewRounded,
  InfoOutlined,
  AccountBalanceRounded,
} from '@mui/icons-material';
import AdminShell, { C, F } from '../components/AdminShell';
import {
  useAdminCreateVehicleLinkMutation,
  useAdminGetVehicleLinksQuery,
  useAdminGetVehiclesQuery,
  useAdminReleaseVehicleMutation,
  useAdminVerifyVehicleMutation,
} from '@/lib/redux/api/vehicleApi';
import { useGetInstitutionsQuery } from '@/lib/redux/api/productApi';

interface GroupedDealer {
  dealerKey: string;
  dealerCompany: string;
  dealerName: string;
  dealerPhone: string;
  dealerEmail: string;
  totalDealerValue: number;
  totalCustomerValue: number;
  pendingCount: number;
  listedCount: number;
  reservedCount: number;
  soldCount: number;
  rejectedCount: number;
  vehicles: any[];
}

export default function AdminVehiclesPage() {
  const [mounted, setMounted] = useState(false);
  const [statusFilter, setStatusFilter] = useState('PendingReview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDealerFilter, setSelectedDealerFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grouped' | 'flat'>('grouped');
  const [collapsedDealers, setCollapsedDealers] = useState<Record<string, boolean>>({});

  const [selected, setSelected] = useState<any>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [markup, setMarkup] = useState('');
  const [institutionId, setInstitutionId] = useState('');
  const [minDown, setMinDown] = useState('10');
  const [linkForm, setLinkForm] = useState({
    dealerName: '',
    dealerCompany: '',
    dealerPhone: '',
    dealerEmail: '',
    daysValid: '14',
  });
  const [createdPath, setCreatedPath] = useState('');

  const { data: vehiclesRes, refetch } = useAdminGetVehiclesQuery({
    status: statusFilter === 'all' ? undefined : statusFilter,
  });
  const { data: linksRes, refetch: refetchLinks } = useAdminGetVehicleLinksQuery();
  const { data: instsRes } = useGetInstitutionsQuery();
  const [createLink, { isLoading: creatingLink }] = useAdminCreateVehicleLinkMutation();
  const [verifyVehicle, { isLoading: verifying }] = useAdminVerifyVehicleMutation();
  const [releaseVehicle, { isLoading: releasing }] = useAdminReleaseVehicleMutation();

  const customerPrice = useMemo(() => {
    if (!selected) return 0;
    return Number(selected.dealerPrice || 0) + Number(markup || 0);
  }, [selected, markup]);

  // Downpayment & monthly calculation estimates
  const downPaymentAmount = useMemo(() => {
    return Math.ceil(customerPrice * (Number(minDown || 10) / 100));
  }, [customerPrice, minDown]);

  const estMonthly36 = useMemo(() => {
    const financed = Math.max(0, customerPrice - downPaymentAmount);
    const rate = 0.16; // 16% standard auto APR
    return Math.round((financed + financed * rate * 3) / 36);
  }, [customerPrice, downPaymentAmount]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const vehicles: any[] = vehiclesRes?.data || [];
  const links = linksRes?.data || [];
  const lenders = (instsRes?.data || []).filter((i: any) =>
    ['Bank', 'Microfinance', 'Fintech'].includes(i.type) && i.isActive && i.isVerified
  );

  // Filter vehicles by search query and dealer dropdown
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v: any) => {
      const matchSearch =
        !searchQuery ||
        v.make?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.vehicleModel?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.dealerCompany?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.dealerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.vin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.location?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDealer =
        selectedDealerFilter === 'all' ||
        (v.dealerCompany || v.dealerName || 'Independent') === selectedDealerFilter;

      return matchSearch && matchDealer;
    });
  }, [vehicles, searchQuery, selectedDealerFilter]);

  // Group vehicles by dealer
  const dealerGroups = useMemo<GroupedDealer[]>(() => {
    const groups: Record<string, GroupedDealer> = {};

    filteredVehicles.forEach((v: any) => {
      const company = v.dealerCompany?.trim() || 'Independent Dealer';
      const name = v.dealerName?.trim() || 'Direct Contact';
      const key = `${company}__${name}`;

      if (!groups[key]) {
        groups[key] = {
          dealerKey: key,
          dealerCompany: company,
          dealerName: name,
          dealerPhone: v.dealerPhone || '',
          dealerEmail: v.dealerEmail || '',
          totalDealerValue: 0,
          totalCustomerValue: 0,
          pendingCount: 0,
          listedCount: 0,
          reservedCount: 0,
          soldCount: 0,
          rejectedCount: 0,
          vehicles: [],
        };
      }

      groups[key].vehicles.push(v);
      groups[key].totalDealerValue += Number(v.dealerPrice) || 0;
      groups[key].totalCustomerValue += Number(v.customerPrice) || 0;

      if (v.status === 'PendingReview') groups[key].pendingCount += 1;
      else if (v.status === 'Listed') groups[key].listedCount += 1;
      else if (v.status === 'Reserved') groups[key].reservedCount += 1;
      else if (v.status === 'Sold') groups[key].soldCount += 1;
      else if (v.status === 'Rejected') groups[key].rejectedCount += 1;
    });

    return Object.values(groups).sort((a, b) => b.vehicles.length - a.vehicles.length);
  }, [filteredVehicles]);

  // Unique dealer list for filter dropdown
  const uniqueDealers = useMemo(() => {
    const set = new Set<string>();
    vehicles.forEach((v) => {
      if (v.dealerCompany) set.add(v.dealerCompany);
      else if (v.dealerName) set.add(v.dealerName);
    });
    return Array.from(set).sort();
  }, [vehicles]);

  // High-level statistics
  const stats = useMemo(() => {
    let pending = 0;
    let listed = 0;
    let totalVal = 0;
    vehicles.forEach((v) => {
      if (v.status === 'PendingReview') pending++;
      if (v.status === 'Listed') listed++;
      totalVal += Number(v.dealerPrice) || 0;
    });
    return {
      totalCars: vehicles.length,
      pending,
      listed,
      totalVal,
      dealersCount: dealerGroups.length,
    };
  }, [vehicles, dealerGroups]);

  const toggleDealerCollapse = (key: string) => {
    setCollapsedDealers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const expandAllDealers = () => setCollapsedDealers({});
  const collapseAllDealers = () => {
    const allCollapsed: Record<string, boolean> = {};
    dealerGroups.forEach((g) => {
      allCollapsed[g.dealerKey] = true;
    });
    setCollapsedDealers(allCollapsed);
  };

  const openVehicle = (v: any) => {
    setSelected(v);
    setActivePhotoIdx(0);
    setMarkup(String(v.markup || ''));
    setInstitutionId(v.recommendedInstitutionId?._id || v.recommendedInstitutionId || '');
    setMinDown(String(v.minDownPaymentPercent || 10));
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createLink(linkForm).unwrap();
      const origin = window.location.origin;
      const full = `${origin}${res.data.path}`;
      setCreatedPath(full);
      await navigator.clipboard.writeText(full);
      toast.success('Link created and copied');
      refetchLinks();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Could not create link');
    }
  };

  const handleList = async () => {
    if (!selected) return;
    try {
      await verifyVehicle({
        id: selected._id,
        body: {
          decision: 'list',
          markup: Number(markup || 0),
          recommendedInstitutionId: institutionId,
          minDownPaymentPercent: Number(minDown || 10),
        },
      }).unwrap();
      toast.success('Vehicle listed at ResolveBridge price');
      setSelected(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Could not list vehicle');
    }
  };

  const handleReject = async () => {
    if (!selected) return;
    const reason = prompt('Rejection reason?') || '';
    try {
      await verifyVehicle({ id: selected._id, body: { decision: 'reject', rejectionReason: reason } }).unwrap();
      toast.success('Vehicle rejected');
      setSelected(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Could not reject');
    }
  };

  const handleRelease = async () => {
    if (!selected) return;
    try {
      await releaseVehicle(selected._id).unwrap();
      toast.success('Returned to public listing');
      setSelected(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Could not release');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PendingReview':
        return { label: 'Pending Review', bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', icon: HourglassEmptyRounded };
      case 'Listed':
        return { label: 'Listed', bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', icon: CheckCircleRounded };
      case 'Reserved':
        return { label: 'Reserved', bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa', icon: LockRounded };
      case 'Sold':
        return { label: 'Sold', bg: 'rgba(139, 92, 246, 0.15)', text: '#a78bfa', icon: CheckCircleRounded };
      case 'Rejected':
        return { label: 'Rejected', bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', icon: CancelRounded };
      default:
        return { label: status, bg: 'rgba(255, 255, 255, 0.1)', text: C.textSub, icon: DirectionsCarRounded };
    }
  };

  if (!mounted) return null;

  return (
    <AdminShell>
      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 300, color: C.text, fontFamily: F.serif }}>
              Vehicle desk
            </h1>
            <p style={{ margin: '8px 0 0', fontSize: 13, color: C.textSub }}>
              Categorized dealer submissions & intake management. Review vehicle paperwork, attach lenders, set markup, and publish to Resolve Vehicles.
            </p>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={metricBox}>
              <span style={metricLabel}>Pending Intake</span>
              <span style={{ ...metricVal, color: '#fbbf24' }}>{stats.pending}</span>
            </div>
            <div style={metricBox}>
              <span style={metricLabel}>Listed Live</span>
              <span style={{ ...metricVal, color: '#34d399' }}>{stats.listed}</span>
            </div>
            <div style={metricBox}>
              <span style={metricLabel}>Active Dealers</span>
              <span style={{ ...metricVal, color: '#60a5fa' }}>{uniqueDealers.length || dealerGroups.length}</span>
            </div>
            <div style={metricBox}>
              <span style={metricLabel}>Total Dealer Value</span>
              <span style={metricVal}>GH₵ {stats.totalVal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Issue Dealer Upload Link Card */}
        <form
          onSubmit={handleCreateLink}
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 20,
            padding: 24,
            marginBottom: 28,
            display: 'grid',
            gap: 14,
            boxShadow: '0 4px 20px -5px rgba(0,0,0,0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.blueLight }}>
              <LinkRounded sx={{ fontSize: 20 }} />
              <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Issue Dealer Upload Link
              </span>
            </div>
            {links[0] && (
              <span style={{ fontSize: 12, color: C.textMuted }}>
                Latest link: <strong style={{ color: C.text }}>{links[0].dealerCompany}</strong> ({links[0].usedCount}/{links[0].maxUploads} used)
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
            <label style={label}>
              Contact name
              <input
                required
                name="dealerName"
                autoComplete="name"
                placeholder="Full name"
                value={linkForm.dealerName}
                onChange={(e) => setLinkForm((f) => ({ ...f, dealerName: e.target.value }))}
                style={field}
              />
            </label>
            <label style={label}>
              Dealership / Company
              <input
                required
                name="dealerCompany"
                autoComplete="organization"
                placeholder="Business name"
                value={linkForm.dealerCompany}
                onChange={(e) => setLinkForm((f) => ({ ...f, dealerCompany: e.target.value }))}
                style={field}
              />
            </label>
            <label style={label}>
              Phone
              <input
                name="dealerPhone"
                autoComplete="tel"
                placeholder="Phone number"
                value={linkForm.dealerPhone}
                onChange={(e) => setLinkForm((f) => ({ ...f, dealerPhone: e.target.value }))}
                style={field}
              />
            </label>
            <label style={label}>
              Email
              <input
                name="dealerEmail"
                type="email"
                autoComplete="email"
                placeholder="Dealer email"
                value={linkForm.dealerEmail}
                onChange={(e) => setLinkForm((f) => ({ ...f, dealerEmail: e.target.value }))}
                style={field}
              />
            </label>
            <label style={label}>
              Days valid
              <input
                name="daysValid"
                type="number"
                min={1}
                max={90}
                value={linkForm.daysValid}
                onChange={(e) => setLinkForm((f) => ({ ...f, daysValid: e.target.value }))}
                style={field}
              />
            </label>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <button type="submit" disabled={creatingLink} style={primaryBtn}>
              {creatingLink ? 'Creating…' : 'Generate & Copy Link'}
            </button>
            {createdPath && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(16, 185, 129, 0.1)', padding: '6px 14px', borderRadius: 10, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <span style={{ fontSize: 12, color: C.emerald, wordBreak: 'break-all' }}>Copied: {createdPath}</span>
                <a href={createdPath} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 800, color: C.blueLight, textDecoration: 'underline' }}>
                  Open Link
                </a>
              </div>
            )}
          </div>
        </form>

        {/* Search, Filter, & View Controls Bar */}
        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {/* Top Row: Search & Dealer Filter */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 10, flex: 1, minWidth: 280, alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <SearchRounded sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.textMuted, fontSize: 18 }} />
                <input
                  type="text"
                  placeholder="Search by make, model, dealer, VIN, or location…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ ...field, paddingLeft: 38 }}
                />
              </div>

              {uniqueDealers.length > 0 && (
                <select
                  value={selectedDealerFilter}
                  onChange={(e) => setSelectedDealerFilter(e.target.value)}
                  style={{ ...field, width: 'auto', minWidth: 180 }}
                >
                  <option value="all">All Dealers ({uniqueDealers.length})</option>
                  {uniqueDealers.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              )}
            </div>

            {/* View Mode Toggle & Expand Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {viewMode === 'grouped' && (
                <>
                  <button
                    onClick={expandAllDealers}
                    style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 8, padding: '6px 10px', color: C.textSub, fontSize: 12, cursor: 'pointer' }}
                  >
                    Expand All
                  </button>
                  <button
                    onClick={collapseAllDealers}
                    style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 8, padding: '6px 10px', color: C.textSub, fontSize: 12, cursor: 'pointer' }}
                  >
                    Collapse All
                  </button>
                </>
              )}

              <div style={{ display: 'flex', background: C.bg, padding: 3, borderRadius: 8, border: `1px solid ${C.border}` }}>
                <Tooltip title="Grouped by Dealer">
                  <button
                    onClick={() => setViewMode('grouped')}
                    style={{
                      background: viewMode === 'grouped' ? C.bluePale : 'transparent',
                      color: viewMode === 'grouped' ? C.blueLight : C.textMuted,
                      border: 'none',
                      borderRadius: 6,
                      padding: '4px 8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <ViewAgendaRounded sx={{ fontSize: 18 }} />
                  </button>
                </Tooltip>
                <Tooltip title="Flat List View">
                  <button
                    onClick={() => setViewMode('flat')}
                    style={{
                      background: viewMode === 'flat' ? C.bluePale : 'transparent',
                      color: viewMode === 'flat' ? C.blueLight : C.textMuted,
                      border: 'none',
                      borderRadius: 6,
                      padding: '4px 8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <GridViewRounded sx={{ fontSize: 18 }} />
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Bottom Row: Status Filter Badges */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { id: 'PendingReview', label: 'Pending Review' },
              { id: 'Listed', label: 'Listed' },
              { id: 'Reserved', label: 'Reserved' },
              { id: 'Sold', label: 'Sold' },
              { id: 'Rejected', label: 'Rejected' },
              { id: 'all', label: 'All Statuses' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id)}
                style={{
                  background: statusFilter === s.id ? C.bluePale : C.bg,
                  color: statusFilter === s.id ? C.blueLight : C.textSub,
                  border: `1px solid ${statusFilter === s.id ? C.blue + '50' : C.border}`,
                  borderRadius: 10,
                  padding: '7px 14px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicles Display Section */}
        {filteredVehicles.length === 0 ? (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 48, textAlign: 'center' }}>
            <DirectionsCarRounded sx={{ fontSize: 48, color: C.textMuted, marginBottom: 1 }} />
            <h3 style={{ margin: '0 0 6px', color: C.text, fontSize: 18 }}>No vehicles match your filter</h3>
            <p style={{ margin: 0, color: C.textSub, fontSize: 13 }}>Try switching the status queue or adjusting your search keyword.</p>
          </div>
        ) : viewMode === 'grouped' ? (
          /* Grouped by Dealer View */
          <div style={{ display: 'grid', gap: 20 }}>
            {dealerGroups.map((group) => {
              const isCollapsed = !!collapsedDealers[group.dealerKey];

              return (
                <div
                  key={group.dealerKey}
                  style={{
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: 20,
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                  }}
                >
                  {/* Dealer Header Bar */}
                  <div
                    onClick={() => toggleDealerCollapse(group.dealerKey)}
                    style={{
                      padding: '16px 20px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderBottom: isCollapsed ? 'none' : `1px solid ${C.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 12,
                      cursor: 'pointer',
                      userSelect: 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                          border: `1px solid ${C.borderStrong}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: C.blueLight,
                        }}
                      >
                        <BusinessRounded sx={{ fontSize: 24 }} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.text }}>
                            {group.dealerCompany}
                          </h2>
                          <span style={{ fontSize: 11, fontWeight: 800, background: C.bluePale, color: C.blueLight, padding: '2px 8px', borderRadius: 6 }}>
                            {group.vehicles.length} vehicle{group.vehicles.length > 1 ? 's' : ''}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, fontSize: 12, color: C.textSub, flexWrap: 'wrap' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <PersonRounded sx={{ fontSize: 14, color: C.textMuted }} />
                            {group.dealerName}
                          </span>
                          {group.dealerPhone && (
                            <a
                              href={`tel:${group.dealerPhone}`}
                              onClick={(e) => e.stopPropagation()}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: C.textSub, textDecoration: 'none' }}
                            >
                              <PhoneRounded sx={{ fontSize: 14, color: C.textMuted }} />
                              {group.dealerPhone}
                            </a>
                          )}
                          {group.dealerEmail && (
                            <a
                              href={`mailto:${group.dealerEmail}`}
                              onClick={(e) => e.stopPropagation()}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: C.textSub, textDecoration: 'none' }}
                            >
                              <EmailRounded sx={{ fontSize: 14, color: C.textMuted }} />
                              {group.dealerEmail}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Dealer Stats & Collapse Arrow */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Total Dealer Asking
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: 15, fontWeight: 800, color: C.emerald }}>
                          GH₵ {group.totalDealerValue.toLocaleString()}
                        </p>
                      </div>

                      <IconButton size="small" sx={{ color: C.textMuted }}>
                        {isCollapsed ? <ExpandMoreRounded /> : <ExpandLessRounded />}
                      </IconButton>
                    </div>
                  </div>

                  {/* Dealer's Vehicle Cards Grid */}
                  {!isCollapsed && (
                    <div style={{ padding: 18, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
                      {group.vehicles.map((v: any) => {
                        const badge = getStatusBadge(v.status);
                        const BadgeIcon = badge.icon;
                        const hasPhotos = (v.photos || []).length > 0;
                        const hasDocs = (v.documents || []).length > 0;

                        return (
                          <div
                            key={v._id}
                            onClick={() => openVehicle(v)}
                            style={{
                              background: C.bg,
                              border: `1px solid ${C.border}`,
                              borderRadius: 14,
                              overflow: 'hidden',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              transition: 'transform 0.15s ease, border-color 0.15s ease',
                            }}
                          >
                            {/* Photo Thumbnail or Header */}
                            {hasPhotos ? (
                              <div style={{ position: 'relative', width: '100%', height: 140, background: '#1e293b' }}>
                                <img
                                  src={v.photos[0].url}
                                  alt=""
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: 10,
                                    right: 10,
                                    background: badge.bg,
                                    color: badge.text,
                                    padding: '4px 8px',
                                    borderRadius: 6,
                                    fontSize: 11,
                                    fontWeight: 800,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    backdropFilter: 'blur(4px)',
                                  }}
                                >
                                  <BadgeIcon sx={{ fontSize: 13 }} />
                                  <span>{badge.label}</span>
                                </div>
                                <div
                                  style={{
                                    position: 'absolute',
                                    bottom: 8,
                                    left: 8,
                                    background: 'rgba(0,0,0,0.65)',
                                    color: '#fff',
                                    padding: '2px 6px',
                                    borderRadius: 4,
                                    fontSize: 11,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                  }}
                                >
                                  <ImageRounded sx={{ fontSize: 13 }} />
                                  <span>{v.photos.length}</span>
                                </div>
                              </div>
                            ) : (
                              <div
                                style={{
                                  height: 80,
                                  background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(16,185,129,0.05) 100%)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '0 16px',
                                }}
                              >
                                <DirectionsCarRounded sx={{ fontSize: 32, color: C.textMuted }} />
                                <div
                                  style={{
                                    background: badge.bg,
                                    color: badge.text,
                                    padding: '4px 8px',
                                    borderRadius: 6,
                                    fontSize: 11,
                                    fontWeight: 800,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                  }}
                                >
                                  <BadgeIcon sx={{ fontSize: 13 }} />
                                  <span>{badge.label}</span>
                                </div>
                              </div>
                            )}

                            {/* Details Content */}
                            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                              <div>
                                <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: C.text }}>
                                  {v.year} {v.make} {v.model || v.vehicleModel}
                                </h3>
                                <p style={{ margin: '0 0 10px', fontSize: 12, color: C.textSub }}>
                                  {v.bodyType || 'SUV'} · {v.fuel || 'Petrol'} · {v.transmission || 'Auto'} · {v.location || 'Accra'}
                                </p>
                              </div>

                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
                                  <div>
                                    <p style={{ margin: 0, fontSize: 10, color: C.textMuted, textTransform: 'uppercase' }}>
                                      Dealer Asking
                                    </p>
                                    <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: C.text }}>
                                      GH₵ {Number(v.dealerPrice).toLocaleString()}
                                    </p>
                                  </div>

                                  {v.status === 'Listed' && (
                                    <div style={{ textAlign: 'right' }}>
                                      <p style={{ margin: 0, fontSize: 10, color: C.textMuted, textTransform: 'uppercase' }}>
                                        Listed Price
                                      </p>
                                      <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: C.emerald }}>
                                        GH₵ {Number(v.customerPrice).toLocaleString()}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {hasDocs && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: 11, color: C.blueLight }}>
                                    <DescriptionRounded sx={{ fontSize: 13 }} />
                                    <span>{v.documents.length} paperwork document(s) attached</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Flat List View */
          <div style={{ display: 'grid', gap: 10 }}>
            {filteredVehicles.map((v: any) => {
              const badge = getStatusBadge(v.status);
              const BadgeIcon = badge.icon;

              return (
                <button
                  key={v._id}
                  onClick={() => openVehicle(v)}
                  style={{
                    textAlign: 'left',
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: 14,
                    padding: 16,
                    cursor: 'pointer',
                    color: C.text,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 10,
                        background: '#1e293b',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {(v.photos || []).length > 0 ? (
                        <img src={v.photos[0].url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <DirectionsCarRounded sx={{ color: C.textMuted }} />
                      )}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: C.blueLight, textTransform: 'uppercase' }}>
                          {v.dealerCompany || 'Independent'}
                        </span>
                        <span style={{ color: C.textMuted }}>·</span>
                        <span style={{ fontSize: 12, color: C.textSub }}>{v.dealerName}</span>
                      </div>
                      <h3 style={{ margin: '2px 0 4px', fontSize: 16, fontWeight: 600 }}>
                        {v.year} {v.make} {v.model || v.vehicleModel}
                      </h3>
                      <p style={{ margin: 0, fontSize: 12, color: C.textSub }}>
                        Dealer GH₵ {Number(v.dealerPrice).toLocaleString()} · Listed GH₵ {Number(v.customerPrice || v.dealerPrice).toLocaleString()} · {v.location}
                        {v.recommendedInstitutionId?.name ? ` · Lender: ${v.recommendedInstitutionId.name}` : ''}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      background: badge.bg,
                      color: badge.text,
                      padding: '4px 10px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <BadgeIcon sx={{ fontSize: 14 }} />
                    <span>{badge.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Comprehensive Vehicle Details & Verification Modal */}
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            background: C.surface,
            border: `1px solid ${C.borderStrong}`,
            borderRadius: '24px',
            color: C.text,
            overflow: 'hidden',
            boxShadow: '0 25px 60px -15px rgba(0,0,0,0.7)',
            m: { xs: 1.5, sm: 3 },
          },
        }}
      >
        {selected && (
          <DialogContent sx={{ p: 0, background: C.surface }}>
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                background: 'rgba(255,255,255,0.03)',
                borderBottom: `1px solid ${C.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: C.bluePale,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: C.blueLight,
                  }}
                >
                  <DirectionsCarRounded sx={{ fontSize: 24 }} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: C.blueLight, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {selected.dealerCompany || 'Dealer Submission'}
                    </span>
                    <span style={{ color: C.textMuted }}>•</span>
                    <span style={{ fontSize: 11, color: C.textSub }}>
                      Intake: {new Date(selected.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: C.text }}>
                    {selected.year} {selected.make} {selected.model || selected.vehicleModel}
                  </h2>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {(() => {
                  const badge = getStatusBadge(selected.status);
                  const BadgeIcon = badge.icon;
                  return (
                    <div
                      style={{
                        background: badge.bg,
                        color: badge.text,
                        padding: '6px 14px',
                        borderRadius: 10,
                        fontSize: 12,
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <BadgeIcon sx={{ fontSize: 15 }} />
                      <span>{badge.label}</span>
                    </div>
                  );
                })()}

                <IconButton
                  onClick={() => setSelected(null)}
                  sx={{
                    background: 'rgba(255,255,255,0.05)',
                    color: C.text,
                    '&:hover': { background: 'rgba(255,255,255,0.1)' },
                  }}
                >
                  <CloseRounded />
                </IconButton>
              </div>
            </div>

            {/* Modal Body - 2 Columns Layout */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: 24,
                padding: 24,
                maxHeight: 'calc(85vh - 80px)',
                overflowY: 'auto',
              }}
            >
              {/* Left Column: Media Gallery, Vehicle Specifications & Documents */}
              <div style={{ display: 'grid', gap: 20 }}>
                {/* Photo Viewer */}
                <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
                  {(selected.photos || []).length > 0 ? (
                    <div>
                      <div style={{ position: 'relative', width: '100%', height: 260, background: '#0a0f1d' }}>
                        <img
                          src={selected.photos[activePhotoIdx]?.url || selected.photos[0]?.url}
                          alt={`${selected.make} ${selected.model}`}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            bottom: 12,
                            right: 12,
                            background: 'rgba(0,0,0,0.7)',
                            color: '#fff',
                            fontSize: 12,
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: 8,
                          }}
                        >
                          {activePhotoIdx + 1} of {selected.photos.length} photos
                        </span>
                      </div>

                      {/* Photo Thumbnail Strip */}
                      {selected.photos.length > 1 && (
                        <div style={{ display: 'flex', gap: 8, padding: 12, overflowX: 'auto', background: 'rgba(0,0,0,0.2)' }}>
                          {selected.photos.map((p: any, idx: number) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setActivePhotoIdx(idx)}
                              style={{
                                width: 72,
                                height: 50,
                                borderRadius: 8,
                                overflow: 'hidden',
                                border: activePhotoIdx === idx ? `2px solid ${C.blue}` : `1px solid ${C.border}`,
                                padding: 0,
                                background: '#1e293b',
                                cursor: 'pointer',
                                flexShrink: 0,
                                opacity: activePhotoIdx === idx ? 1 : 0.6,
                                transition: 'all 0.15s ease',
                              }}
                            >
                              <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: C.textMuted }}>
                      <DirectionsCarRounded sx={{ fontSize: 48, marginBottom: 1 }} />
                      <p style={{ margin: 0, fontSize: 13 }}>No photos uploaded for this vehicle</p>
                    </div>
                  )}
                </div>

                {/* Complete Specifications Grid */}
                <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18 }}>
                  <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 800, color: C.text, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Vehicle Specifications
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                    <div style={specItem}>
                      <span style={specKey}>Make & Model</span>
                      <strong style={specVal}>{selected.make} {selected.model || selected.vehicleModel}</strong>
                    </div>
                    <div style={specItem}>
                      <span style={specKey}>Model Year</span>
                      <strong style={specVal}>{selected.year}</strong>
                    </div>
                    <div style={specItem}>
                      <span style={specKey}>Body Type</span>
                      <strong style={specVal}>{selected.bodyType || 'SUV'}</strong>
                    </div>
                    <div style={specItem}>
                      <span style={specKey}>Condition</span>
                      <strong style={specVal}>{selected.condition || 'Used'}</strong>
                    </div>
                    <div style={specItem}>
                      <span style={specKey}>Fuel Type</span>
                      <strong style={specVal}>{selected.fuel || 'Petrol'}</strong>
                    </div>
                    <div style={specItem}>
                      <span style={specKey}>Transmission</span>
                      <strong style={specVal}>{selected.transmission || 'Auto'}</strong>
                    </div>
                    <div style={specItem}>
                      <span style={specKey}>Mileage</span>
                      <strong style={specVal}>{Number(selected.mileageKm || 0).toLocaleString()} km</strong>
                    </div>
                    <div style={specItem}>
                      <span style={specKey}>Colour</span>
                      <strong style={specVal}>{selected.color || 'Standard'}</strong>
                    </div>
                    <div style={specItem}>
                      <span style={specKey}>Location / Yard</span>
                      <strong style={specVal}>{selected.location || 'Accra'}</strong>
                    </div>
                    <div style={specItem}>
                      <span style={specKey}>VIN / Chassis</span>
                      <strong style={{ ...specVal, fontFamily: 'monospace' }}>{selected.vin || 'Not provided'}</strong>
                    </div>
                  </div>

                  {selected.description && (
                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                      <span style={specKey}>Dealer Notes / Features</span>
                      <p style={{ margin: '4px 0 0', fontSize: 13, color: C.text, lineHeight: 1.5 }}>
                        {selected.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Attached Verification Documents */}
                <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: C.text, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Verification Documents ({(selected.documents || []).length})
                    </h3>
                    <span style={{ fontSize: 11, color: C.textMuted }}>DVLA, duty, valuation & invoices</span>
                  </div>

                  {(selected.documents || []).length > 0 ? (
                    <div style={{ display: 'grid', gap: 8 }}>
                      {selected.documents.map((d: any, i: number) => (
                        <a
                          key={i}
                          href={d.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: C.surface,
                            padding: '10px 14px',
                            borderRadius: 10,
                            border: `1px solid ${C.border}`,
                            color: C.blueLight,
                            fontSize: 13,
                            textDecoration: 'none',
                            transition: 'border-color 0.15s ease',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <DescriptionRounded sx={{ fontSize: 18, color: '#34d399' }} />
                            <span style={{ color: C.text, fontWeight: 600 }}>{d.name || `Document ${i + 1}`}</span>
                          </div>
                          <OpenInNewRounded sx={{ fontSize: 16, color: C.textMuted }} />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p style={{ margin: 0, fontSize: 12, color: C.textMuted }}>
                      No legal/valuation documents attached for this vehicle.
                    </p>
                  )}
                </div>

                {/* Dealer Origin Card */}
                <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18 }}>
                  <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 800, color: C.text, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Originating Dealer
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 13 }}>
                    <div>
                      <span style={specKey}>Dealership / Business</span>
                      <strong style={{ color: C.text, display: 'block', marginTop: 2 }}>{selected.dealerCompany || 'Independent'}</strong>
                    </div>
                    <div>
                      <span style={specKey}>Contact Person</span>
                      <strong style={{ color: C.text, display: 'block', marginTop: 2 }}>{selected.dealerName || 'Direct'}</strong>
                    </div>
                    {selected.dealerPhone && (
                      <div>
                        <span style={specKey}>Phone</span>
                        <a href={`tel:${selected.dealerPhone}`} style={{ color: C.blueLight, display: 'block', marginTop: 2, textDecoration: 'none', fontWeight: 600 }}>
                          {selected.dealerPhone}
                        </a>
                      </div>
                    )}
                    {selected.dealerEmail && (
                      <div>
                        <span style={specKey}>Email</span>
                        <a href={`mailto:${selected.dealerEmail}`} style={{ color: C.blueLight, display: 'block', marginTop: 2, textDecoration: 'none', fontWeight: 600 }}>
                          {selected.dealerEmail}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Pricing, Financing & Marketplace Actions */}
              <div style={{ display: 'grid', gap: 20, alignContent: 'start' }}>
                {/* Financial Overview Card */}
                <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 800, color: C.text, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Financial Settlement & Pricing
                  </h3>

                  {/* Dealer Asking Box */}
                  <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px', marginBottom: 14 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase' }}>
                      Dealer Settlement Asking (Private)
                    </span>
                    <p style={{ margin: '2px 0 0', fontSize: 24, fontWeight: 900, color: C.text }}>
                      GH₵ {Number(selected.dealerPrice || 0).toLocaleString()}
                    </p>
                  </div>

                  {selected.status !== 'Sold' ? (
                    <div style={{ display: 'grid', gap: 14 }}>
                      {/* Markup Input */}
                      <div>
                        <label style={label}>
                          ResolveBridge Markup (GH₵)
                          <input
                            type="number"
                            min={0}
                            value={markup}
                            onChange={(e) => setMarkup(e.target.value)}
                            placeholder="e.g. 15000"
                            style={field}
                          />
                        </label>
                        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                          {[5000, 10000, 15000, 20000].map((quick) => (
                            <button
                              key={quick}
                              type="button"
                              onClick={() => setMarkup(String(quick))}
                              style={{
                                background: markup === String(quick) ? C.bluePale : 'rgba(255,255,255,0.04)',
                                color: markup === String(quick) ? C.blueLight : C.textSub,
                                border: `1px solid ${markup === String(quick) ? C.blue + '50' : C.border}`,
                                borderRadius: 6,
                                padding: '3px 8px',
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              +GH₵ {quick / 1000}k
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Final Listing Price Highlight Box */}
                      <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 12, padding: '14px 16px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>
                          Final ResolveBridge Customer Listing Price
                        </span>
                        <p style={{ margin: '2px 0 0', fontSize: 26, fontWeight: 900, color: '#10b981' }}>
                          GH₵ {customerPrice.toLocaleString()}
                        </p>
                      </div>

                      {/* Lender Selection */}
                      <div>
                        <label style={label}>
                          Recommended Lending Institution <span style={{ color: '#ef4444' }}>*</span>
                          <select
                            value={institutionId}
                            onChange={(e) => setInstitutionId(e.target.value)}
                            style={field}
                          >
                            <option value="">Select financing partner…</option>
                            {lenders.map((i: any) => (
                              <option key={i._id} value={i._id}>
                                {i.name} ({i.type})
                              </option>
                            ))}
                          </select>
                        </label>
                        <p style={{ margin: '4px 0 0', fontSize: 11, color: C.textMuted }}>
                          This lender will be pre-attached to the vehicle on the client marketplace.
                        </p>
                      </div>

                      {/* Minimum Down Payment % */}
                      <div>
                        <label style={label}>
                          Minimum Down Payment %
                          <input
                            type="number"
                            min={10}
                            max={90}
                            value={minDown}
                            onChange={(e) => setMinDown(e.target.value)}
                            style={field}
                          />
                        </label>
                      </div>

                      {/* Auto-BNPL Projection Breakdown */}
                      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, display: 'grid', gap: 6, fontSize: 12 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: C.textSub, textTransform: 'uppercase' }}>
                          Client Auto-BNPL Projection
                        </span>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: C.textSub }}>
                          <span>Down Payment ({minDown}%):</span>
                          <strong style={{ color: C.text }}>GH₵ {downPaymentAmount.toLocaleString()}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: C.textSub }}>
                          <span>Financed Balance:</span>
                          <strong style={{ color: C.text }}>GH₵ {Math.max(0, customerPrice - downPaymentAmount).toLocaleString()}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: C.textSub }}>
                          <span>Est. Monthly (36 mos @ 16% APR):</span>
                          <strong style={{ color: '#34d399' }}>GH₵ {estMonthly36.toLocaleString()}/mo</strong>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'grid', gap: 10, marginTop: 8 }}>
                        <button
                          type="button"
                          onClick={handleList}
                          disabled={verifying || !institutionId}
                          style={{
                            ...primaryBtn,
                            padding: '14px 20px',
                            fontSize: 14,
                            opacity: verifying || !institutionId ? 0.5 : 1,
                            cursor: verifying || !institutionId ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {verifying ? 'Verifying & Listing…' : 'Verify & List on Marketplace'}
                        </button>

                        {selected.status === 'Reserved' && (
                          <button
                            type="button"
                            onClick={handleRelease}
                            disabled={releasing}
                            style={{ ...ghostBtn, borderColor: C.blue }}
                          >
                            {releasing ? 'Releasing…' : 'Release Reservation'}
                          </button>
                        )}

                        {selected.status === 'PendingReview' && (
                          <button
                            type="button"
                            onClick={handleReject}
                            disabled={verifying}
                            style={{
                              ...ghostBtn,
                              color: '#f87171',
                              borderColor: 'rgba(239,68,68,0.3)',
                            }}
                          >
                            Reject Vehicle Submission
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p style={{ margin: 0, color: C.textMuted, fontSize: 13 }}>
                      This vehicle has been marked as <strong>Sold</strong>.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </AdminShell>
  );
}

/* ─── Styles ───────────────────────────────────────────────────────────── */
const field: CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 10,
  border: `1px solid ${C.borderStrong}`,
  background: C.bg,
  color: C.text,
  fontSize: 13,
  boxSizing: 'border-box',
  outline: 'none',
};

const label: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  fontSize: 11,
  fontWeight: 700,
  marginBottom: 0,
  color: C.textSub,
};

const primaryBtn: CSSProperties = {
  background: '#3b82f6',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  padding: '12px 18px',
  fontWeight: 700,
  fontSize: 13,
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
};

const ghostBtn: CSSProperties = {
  width: '100%',
  background: 'transparent',
  color: '#9ca3af',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 10,
  padding: '10px 14px',
  fontWeight: 700,
  fontSize: 13,
  cursor: 'pointer',
};

const metricBox: CSSProperties = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: 12,
  padding: '10px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  minWidth: 120,
};

const metricLabel: CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  color: C.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const metricVal: CSSProperties = {
  fontSize: 16,
  fontWeight: 800,
  color: C.text,
};

const specItem: CSSProperties = {
  background: C.surface,
  padding: '10px 12px',
  borderRadius: 10,
  border: `1px solid ${C.border}`,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

const specKey: CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  color: C.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
};

const specVal: CSSProperties = {
  fontSize: 13,
  color: C.text,
};
