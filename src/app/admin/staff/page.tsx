'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Drawer, IconButton } from '@mui/material';
import AdminShell, { C, F } from '../components/AdminShell';
import { 
  useB2bGetStaffQuery,
  useB2bOnboardStaffMutation,
  useB2bDeboardStaffMutation,
  useB2bUpdateStaffPermissionsMutation
} from '@/lib/redux/api/userApi';
import { 
  CloseRounded, 
  SearchRounded, 
  AccountCircleRounded,
  DeleteOutlineRounded,
  AddRounded,
  VpnKeyRounded,
  SettingsSuggestRounded
} from '@mui/icons-material';

export default function B2bStaffPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Onboarding Form State
  const [showOnboardDrawer, setShowOnboardDrawer] = useState(false);
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formFirst, setFormFirst] = useState('');
  const [formLast, setFormLast] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    'dashboard',
    'applications',
    'kyc',
    'products',
    'billing',
    'analytics',
    'audit',
    'integrations',
    'support'
  ]);

  // Edit Permissions State
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [editPermissions, setEditPermissions] = useState<string[]>([]);

  // RTK Query Hooks
  const { data: staffResponse, isLoading, isFetching: isFetchingStaff, refetch } = useB2bGetStaffQuery();
  const [onboardStaff, { isLoading: isOnboarding }] = useB2bOnboardStaffMutation();
  const [deboardStaff, { isLoading: isDeboarding }] = useB2bDeboardStaffMutation();
  const [updateStaffPermissions, { isLoading: isUpdatingPermissions }] = useB2bUpdateStaffPermissionsMutation();

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);

    const stored = sessionStorage.getItem('rb_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return null;

  const rawStaff = staffResponse?.data || [];
  const staffMembers = rawStaff.filter((s: any) => {
    const fullName = `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase();
    const email = (s.email || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  // Map Admin Role to Staff Role
  const getExpectedStaffRole = (adminRole: string) => {
    const map: Record<string, string> = {
      'InstitutionAdmin': 'InstitutionStaff',
      'InsuranceAdmin': 'InsuranceStaff',
      'BNPLAdmin': 'BNPLStaff'
    };
    return map[adminRole] || 'Staff';
  };

  const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmail || !formPhone || !formFirst || !formLast || !formPassword) {
      toast.error('Please fill out all onboarding fields');
      return;
    }

    try {
      const targetRole = getExpectedStaffRole(user?.role);
      const res = await onboardStaff({
        email: formEmail,
        phoneNumber: formPhone,
        firstName: formFirst,
        lastName: formLast,
        password: formPassword,
        role: targetRole,
        permissions: selectedPermissions
      }).unwrap();

      if (res.success) {
        toast.success(`Successfully onboarded ${formFirst} ${formLast}!`);
        setShowOnboardDrawer(false);
        // Reset Form
        setFormEmail('');
        setFormPhone('');
        setFormFirst('');
        setFormLast('');
        setFormPassword('');
        setSelectedPermissions(['dashboard', 'applications', 'kyc', 'products', 'billing', 'analytics', 'audit', 'integrations', 'support']);
        refetch();
      } else {
        toast.error(res.message || 'Onboarding failed');
      }
    } catch (err: any) {
      toast.error(err.data?.message || 'Error onboarding corporate staff');
    }
  };

  const handleDeboard = async (id: string, name: string) => {
    if (!window.confirm(`Are you absolutely sure you want to deboard and delete the staff account for ${name}?`)) {
      return;
    }

    try {
      const res = await deboardStaff(id).unwrap();
      if (res.success) {
        toast.success(`Deboarded staff member ${name} successfully`);
        refetch();
      } else {
        toast.error(res.message || 'Deboarding failed');
      }
    } catch (err: any) {
      toast.error(err.data?.message || 'Error deboarding staff member');
    }
  };

  const handleUpdatePermissions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) return;

    try {
      const res = await updateStaffPermissions({
        id: selectedStaff._id || selectedStaff.id,
        permissions: editPermissions
      }).unwrap();

      if (res.success) {
        toast.success(`Successfully updated permissions for ${selectedStaff.firstName} ${selectedStaff.lastName}!`);
        setShowEditDrawer(false);
        setSelectedStaff(null);
        refetch();
      } else {
        toast.error(res.message || 'Failed to update permissions');
      }
    } catch (err: any) {
      toast.error(err.data?.message || 'Error updating permissions');
    }
  };

  return (
    <AdminShell>
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        
        {/* Header Section */}
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
              Corporate Staff Directory
            </h1>
            <p style={{ margin: '8px 0 0', fontSize: 13, color: C.textSub }}>
              Delegate administrative desks, onboard corporate representatives, and manage access privileges.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, width: isMobile ? '100%' : 'auto' }}>
            <button 
              onClick={() => setShowOnboardDrawer(true)}
              style={{ 
                background: `linear-gradient(135deg, ${C.blue} 0%, ${C.blueLight} 100%)`, 
                color: '#fff', 
                border: 'none', 
                borderRadius: 10,
                padding: '10px 20px', 
                fontSize: 13, 
                fontWeight: 700, 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(32, 81, 229, 0.2)',
                flex: isMobile ? 1 : 'none',
                justifyContent: 'center'
              }}
            >
              <AddRounded sx={{ fontSize: 18 }} /> Onboard Staff
            </button>
            <button 
              onClick={() => refetch()}
              disabled={isFetchingStaff}
              style={{ 
                background: C.surface, 
                color: C.blueLight, 
                border: `1px solid ${C.border}`, 
                borderRadius: 10,
                padding: '10px 18px', 
                fontSize: 13, 
                fontWeight: 700, 
                cursor: isFetchingStaff ? 'not-allowed' : 'pointer',
                textAlign: 'center'
              }}
            >
              {isFetchingStaff ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Directory Console */}
        <div style={{ background: C.surface, borderRadius: 24, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          
          <div style={{ 
            padding: 24, borderBottom: `1px solid ${C.border}`, display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            gap: 20, alignItems: isMobile ? 'stretch' : 'center'
          }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1 }}>
              <input 
                placeholder="Search staff name or email address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  width: '100%', padding: '12px 16px 12px 42px', borderRadius: 12, border: `1px solid ${C.border}`, 
                  background: C.bg, fontSize: 13.5, outline: 'none', color: C.text 
                }}
              />
              <SearchRounded sx={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: C.textMuted }} />
            </div>

          </div>

          {/* Table Grid */}
          <div style={{ overflowX: 'auto' }}>
            {isLoading ? (
              <div style={{ padding: '60px 0', textAlign: 'center' }}>
                <p style={{ color: C.textSub, fontSize: 14 }}>Retrieving staff directory...</p>
              </div>
            ) : staffMembers.length === 0 ? (
              <div style={{ padding: '80px 0', textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>👥</div>
                <p style={{ color: C.textSub, fontSize: 14, fontWeight: 600 }}>No corporate staff members found.</p>
                <p style={{ color: C.textMuted, fontSize: 12, marginTop: 4 }}>Click "Onboard Staff" to add members for delegation.</p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.01)' }}>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Staff Name</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Email Credentials</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Phone Number</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Role Scope</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Status</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staffMembers.map((s: any) => (
                    <tr 
                      key={s._id} 
                      style={{ borderBottom: `1px solid ${C.border}`, transition: '0.2s' }}
                    >
                      <td style={{ padding: '20px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ 
                            width: 32, height: 32, borderRadius: '50%', background: C.bluePale,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.blueLight
                          }}>
                            <AccountCircleRounded sx={{ fontSize: 20 }} />
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
                            {s.firstName} {s.lastName}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <span style={{ fontSize: 13, color: C.textSub }}>{s.email}</span>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <span style={{ fontSize: 13, color: C.textSub }}>{s.phoneNumber}</span>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <span style={{ 
                            fontSize: 10, fontWeight: 800, 
                            background: C.purplePale,
                            color: C.purple,
                            padding: '4px 8px', borderRadius: 4, textTransform: 'uppercase',
                            width: 'max-content'
                          }}>
                            {s.role}
                          </span>
                          {s.permissions && s.permissions.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                              {s.permissions.map((p: string) => (
                                <span 
                                  key={p} 
                                  style={{ 
                                    fontSize: 9, 
                                    fontWeight: 600, 
                                    background: 'rgba(255,255,255,0.04)', 
                                    border: `1px solid ${C.border}`,
                                    color: C.textSub, 
                                    padding: '2px 6px', 
                                    borderRadius: 4,
                                    textTransform: 'capitalize'
                                  }}
                                >
                                  {p === 'applications' ? 'Underwriting' : p === 'kyc' ? 'KYC' : p}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span style={{ fontSize: 9.5, color: C.textMuted, fontStyle: 'italic' }}>
                              Full Access (Default)
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: C.emerald }}>
                            Active
                          </span>
                          {s.mustResetPassword && (
                            <span style={{ 
                              fontSize: 9, 
                              fontWeight: 900, 
                              background: C.amberPale,
                              color: C.amber,
                              padding: '2px 6px',
                              borderRadius: 4,
                              width: 'max-content',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 3
                            }}>
                              <VpnKeyRounded sx={{ fontSize: 9 }} /> Pending Password Reset
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end', alignItems: 'center' }}>
                          <button 
                            style={{ 
                              background: 'none', border: 'none', color: C.blueLight, cursor: 'pointer',
                              fontSize: 12.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4
                            }}
                            onClick={() => {
                              setSelectedStaff(s);
                              setEditPermissions(s.permissions || []);
                              setShowEditDrawer(true);
                            }}
                          >
                            <SettingsSuggestRounded sx={{ fontSize: 16 }} /> Configure
                          </button>
                          <button 
                            style={{ 
                              background: 'none', border: 'none', color: C.red, cursor: 'pointer',
                              fontSize: 12.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4
                            }}
                            disabled={isDeboarding}
                            onClick={() => handleDeboard(s._id, `${s.firstName} ${s.lastName}`)}
                          >
                            <DeleteOutlineRounded sx={{ fontSize: 16 }} /> Deboard
                          </button>
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

      {/* Staff Onboarding Drawer */}
      <Drawer
        anchor="right"
        open={showOnboardDrawer}
        onClose={() => setShowOnboardDrawer(false)}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 460,
            background: C.surface,
            borderLeft: `1px solid ${C.border}`,
            boxShadow: '-20px 0 60px rgba(0,0,0,0.7)',
            color: C.text,
            p: 0
          }
        }}
      >
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          
          {/* Header */}
          <div style={{ padding: 24, borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 9.5, fontWeight: 900, color: C.blueLight, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Corporate Access Delegation</span>
              <h3 style={{ margin: '4px 0 0', fontSize: 18, color: C.text, fontFamily: F.heading }}>Onboard Corporate Staff</h3>
            </div>
            <IconButton 
              onClick={() => setShowOnboardDrawer(false)}
              sx={{ color: C.textSub, width: 34, height: 34 }}
            >
              <CloseRounded sx={{ fontSize: 18 }} />
            </IconButton>
          </div>

          {/* Form Body */}
          <form onSubmit={handleOnboard} style={{ flex: 1, padding: 32, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 12, color: C.textSub }}>First Name</span>
              <input 
                type="text" 
                required
                value={formFirst}
                onChange={(e) => setFormFirst(e.target.value)}
                placeholder="e.g. John"
                style={{ width: '100%', padding: '12px', borderRadius: 10, border: `1px solid ${C.borderStrong}`, background: C.bg, color: C.text, fontSize: 13.5, outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 12, color: C.textSub }}>Last Name</span>
              <input 
                type="text" 
                required
                value={formLast}
                onChange={(e) => setFormLast(e.target.value)}
                placeholder="e.g. Doe"
                style={{ width: '100%', padding: '12px', borderRadius: 10, border: `1px solid ${C.borderStrong}`, background: C.bg, color: C.text, fontSize: 13.5, outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 12, color: C.textSub }}>Email Address</span>
              <input 
                type="email" 
                required
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="e.g. john.doe@bank.com"
                style={{ width: '100%', padding: '12px', borderRadius: 10, border: `1px solid ${C.borderStrong}`, background: C.bg, color: C.text, fontSize: 13.5, outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 12, color: C.textSub }}>Phone Number</span>
              <input 
                type="tel" 
                required
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="e.g. +233 50 123 4567"
                style={{ width: '100%', padding: '12px', borderRadius: 10, border: `1px solid ${C.borderStrong}`, background: C.bg, color: C.text, fontSize: 13.5, outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 12, color: C.textSub }}>Temporary Account Password</span>
              <input 
                type="password" 
                required
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                placeholder="Enter temporary password"
                style={{ width: '100%', padding: '12px', borderRadius: 10, border: `1px solid ${C.borderStrong}`, background: C.bg, color: C.text, fontSize: 13.5, outline: 'none' }}
              />
              <span style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.4, marginTop: 4 }}>
                ⚠️ The onboarded staff member will be strictly prompted to reset this password upon their first portal login.
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
              <span style={{ fontSize: 11, color: C.textMuted }}>DELEGATED ROLE</span>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.purple }}>
                {getExpectedStaffRole(user?.role)}
              </p>
              <span style={{ fontSize: 10.5, color: C.textMuted, lineHeight: 1.3 }}>
                (Automatically delegated based on your corporate administrative scope role)
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Desk & Feature Delegation
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { id: 'dashboard', label: 'Dashboard Overview' },
                  { id: 'applications', label: 'Underwriting' },
                  { id: 'kyc', label: 'KYC & Vaults' },
                  { id: 'products', label: 'Products' },
                  { id: 'billing', label: 'Billing' },
                  { id: 'analytics', label: 'Analytics' },
                  { id: 'audit', label: 'Compliance Audit' },
                  { id: 'integrations', label: 'Integrations Desk' },
                  { id: 'support', label: 'Support Desk' },
                ].map((perm) => (
                  <label 
                    key={perm.id} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 8, 
                      fontSize: 13, 
                      color: C.text, 
                      cursor: 'pointer',
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: `1px solid ${selectedPermissions.includes(perm.id) ? C.blue : C.border}`,
                      background: selectedPermissions.includes(perm.id) ? C.bluePale : 'transparent',
                      transition: 'all 0.2s'
                    }}
                  >
                    <input 
                      type="checkbox"
                      checked={selectedPermissions.includes(perm.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPermissions([...selectedPermissions, perm.id]);
                        } else {
                          setSelectedPermissions(selectedPermissions.filter(p => p !== perm.id));
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                    {perm.label}
                  </label>
                ))}
              </div>
            </div>

            <button 
              type="submit"
              disabled={isOnboarding}
              style={{ 
                width: '100%', 
                padding: '14px', 
                borderRadius: 12, 
                border: 'none', 
                background: `linear-gradient(135deg, ${C.blue} 0%, ${C.blueLight} 100%)`, 
                color: '#fff', 
                fontWeight: 800, 
                fontSize: 13.5, 
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(32, 81, 229, 0.2)',
                transition: 'all 0.2s ease',
                marginTop: 20
              }}
            >
              {isOnboarding ? 'Onboarding Corporate Staff...' : 'Onboard Staff Member'}
            </button>
          </form>

        </div>
      </Drawer>

      {/* Staff Permissions Settings Configuration Drawer */}
      <Drawer
        anchor="right"
        open={showEditDrawer}
        onClose={() => {
          setShowEditDrawer(false);
          setSelectedStaff(null);
        }}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 460,
            background: C.surface,
            borderLeft: `1px solid ${C.border}`,
            boxShadow: '-20px 0 60px rgba(0,0,0,0.7)',
            color: C.text,
            p: 0
          }
        }}
      >
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          
          {/* Header */}
          <div style={{ padding: 24, borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 9.5, fontWeight: 900, color: C.blueLight, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Settings Configuration</span>
              <h3 style={{ margin: '4px 0 0', fontSize: 18, color: C.text, fontFamily: F.heading }}>Configure Staff Permissions</h3>
            </div>
            <IconButton 
              onClick={() => {
                setShowEditDrawer(false);
                setSelectedStaff(null);
              }}
              sx={{ color: C.textSub, width: 34, height: 34 }}
            >
              <CloseRounded sx={{ fontSize: 18 }} />
            </IconButton>
          </div>

          {/* Form Body */}
          {selectedStaff && (
            <form onSubmit={handleUpdatePermissions} style={{ flex: 1, padding: 32, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ 
                  width: 40, height: 40, borderRadius: '50%', background: C.bluePale,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.blueLight
                }}>
                  <AccountCircleRounded sx={{ fontSize: 24 }} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text }}>
                    {selectedStaff.firstName} {selectedStaff.lastName}
                  </h4>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: C.textSub }}>
                    {selectedStaff.email}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 11, color: C.textMuted }}>DELEGATED ROLE</span>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.purple, textTransform: 'uppercase' }}>
                  {selectedStaff.role}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Desk & Feature Toggles
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { id: 'dashboard', label: 'Dashboard Overview' },
                    { id: 'applications', label: 'Underwriting' },
                    { id: 'kyc', label: 'KYC & Vaults' },
                    { id: 'products', label: 'Products' },
                    { id: 'billing', label: 'Billing' },
                    { id: 'analytics', label: 'Analytics' },
                    { id: 'audit', label: 'Compliance Audit' },
                    { id: 'integrations', label: 'Integrations Desk' },
                    { id: 'support', label: 'Support Desk' },
                  ].map((perm) => (
                    <label 
                      key={perm.id} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 8, 
                        fontSize: 13, 
                        color: C.text, 
                        cursor: 'pointer',
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: `1px solid ${editPermissions.includes(perm.id) ? C.blue : C.border}`,
                        background: editPermissions.includes(perm.id) ? C.bluePale : 'transparent',
                        transition: 'all 0.2s'
                      }}
                    >
                      <input 
                        type="checkbox"
                        checked={editPermissions.includes(perm.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditPermissions([...editPermissions, perm.id]);
                          } else {
                            setEditPermissions(editPermissions.filter(p => p !== perm.id));
                          }
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                      {perm.label}
                    </label>
                  ))}
                </div>
                <span style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.4, marginTop: 8 }}>
                  💡 Setting all toggles off defaults the staff member to full access (safeguard behavior to prevent service lockout).
                </span>
              </div>

              <button 
                type="submit"
                disabled={isUpdatingPermissions}
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  borderRadius: 12, 
                  border: 'none', 
                  background: `linear-gradient(135deg, ${C.blue} 0%, ${C.blueLight} 100%)`, 
                  color: '#fff', 
                  fontWeight: 800, 
                  fontSize: 13.5, 
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(32, 81, 229, 0.2)',
                  transition: 'all 0.2s ease',
                  marginTop: 20
                }}
              >
                {isUpdatingPermissions ? 'Updating Settings Configuration...' : 'Save Settings Configuration'}
              </button>
            </form>
          )}

        </div>
      </Drawer>

    </AdminShell>
  );
}
