'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Drawer, IconButton, Select, MenuItem } from '@mui/material';
import AdminShell, { C, F } from '../components/AdminShell';
import { 
  useAdminGetUsersQuery, 
  useAdminUpdateUserMutation 
} from '@/lib/redux/api/userApi';
import { 
  CloseRounded, 
  SearchRounded, 
  AccountCircleRounded,
  ShieldRounded,
  BlockRounded,
  CheckCircleOutlineRounded
} from '@mui/icons-material';

export default function AdminUsersPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Redux hooks for retrieving and updating users
  const { data: usersResponse, isLoading, refetch } = useAdminGetUsersQuery();
  const [updateUser, { isLoading: isUpdating }] = useAdminUpdateUserMutation();

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return null;

  const rawUsers = usersResponse?.data || [];

  // Filter and search logic
  const users = rawUsers.filter((u: any) => {
    const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    const email = (u.email || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = fullName.includes(query) || email.includes(query);
    
    if (roleFilter === 'all') return matchesSearch;
    if (roleFilter === 'admin') return matchesSearch && u.role !== 'Customer';
    return matchesSearch && u.role === 'Customer';
  });

  const handleUpdate = async (fields: { role?: string; isActive?: boolean; kycStatus?: string }) => {
    if (!selectedUser) return;
    try {
      const res = await updateUser({ id: selectedUser._id, ...fields }).unwrap();
      if (res.success) {
        toast.success('Account parameters updated successfully');
        setSelectedUser(null);
        refetch();
      } else {
        toast.error(res.message || 'Failed to update account credentials');
      }
    } catch (err: any) {
      toast.error(err.data?.message || 'Error executing administrative update');
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
              User Directory & Customer Portal
            </h1>
            <p style={{ margin: '8px 0 0', fontSize: 13, color: C.textSub }}>
              Manage customer access controls, update administrative scopes, and toggle active parameters.
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
            Sync Directory
          </button>
        </div>

        {/* Search Console */}
        <div style={{ background: C.surface, borderRadius: 24, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          
          <div style={{ 
            padding: 24, borderBottom: `1px solid ${C.border}`, display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            gap: 20, alignItems: isMobile ? 'stretch' : 'center', flexWrap: 'wrap' 
          }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
              <input 
                placeholder="Search user name or email address..."
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
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                { label: 'All Accounts', value: 'all' },
                { label: 'Standard Customers', value: 'customer' },
                { label: 'Administrative Desks', value: 'admin' },
              ].map(f => {
                const active = roleFilter === f.value;
                return (
                  <button 
                    key={f.value}
                    onClick={() => setRoleFilter(f.value)}
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

          {/* User Table Grid */}
          <div style={{ overflowX: 'auto' }}>
            {isLoading ? (
              <div style={{ padding: '60px 0', textAlign: 'center' }}>
                <p style={{ color: C.textSub, fontSize: 14 }}>Querying database accounts...</p>
              </div>
            ) : users.length === 0 ? (
              <div style={{ padding: '80px 0', textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>👤</div>
                <p style={{ color: C.textSub, fontSize: 14, fontWeight: 600 }}>No users found in this directory.</p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.01)' }}>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Full Name</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Email Credentials</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Scope Role</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Portal Entry</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any) => (
                    <tr 
                      key={u._id} 
                      style={{ borderBottom: `1px solid ${C.border}`, transition: '0.2s', cursor: 'pointer' }}
                      onClick={() => setSelectedUser(u)}
                    >
                      <td style={{ padding: '20px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ 
                            width: 32, height: 32, borderRadius: '50%', background: u.isActive ? C.bluePale : C.redPale,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: u.isActive ? C.blueLight : C.red
                          }}>
                            <AccountCircleRounded sx={{ fontSize: 20 }} />
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
                            {u.firstName} {u.lastName}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <span style={{ fontSize: 13, color: C.textSub }}>{u.email}</span>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <span style={{ 
                          fontSize: 10, fontWeight: 800, 
                          background: u.role === 'Customer' ? 'rgba(255,255,255,0.05)' : C.purplePale,
                          color: u.role === 'Customer' ? C.textSub : C.purple,
                          padding: '4px 8px', borderRadius: 4, textTransform: 'uppercase'
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <span style={{ 
                          fontSize: 11, fontWeight: 700, 
                          color: u.isActive ? C.emerald : C.red
                        }}>
                          {u.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                        <button 
                          style={{ 
                            background: 'none', border: 'none', color: C.blueLight, cursor: 'pointer',
                            fontSize: 12.5, fontWeight: 700
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUser(u);
                          }}
                        >
                          Manage Access
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      {/* Account Settings Drawer */}
      <Drawer
        anchor="right"
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
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
        {selectedUser && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            
            {/* Header */}
            <div style={{ padding: 24, borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 9.5, fontWeight: 900, color: C.blueLight, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Account Security</span>
                <h3 style={{ margin: '4px 0 0', fontSize: 18, color: C.text, fontFamily: F.heading }}>Access Parameters</h3>
              </div>
              <IconButton 
                onClick={() => setSelectedUser(null)}
                sx={{ color: C.textSub, width: 34, height: 34 }}
              >
                <CloseRounded sx={{ fontSize: 18 }} />
              </IconButton>
            </div>

            {/* Body */}
            <div style={{ flex: 1, padding: 32, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
              
              {/* Profile Overview */}
              <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.01)', border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
                <div style={{ 
                  width: 56, height: 56, borderRadius: '50%', background: C.bluePale, color: C.blueLight,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
                }}>
                  <AccountCircleRounded sx={{ fontSize: 32 }} />
                </div>
                <h4 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.text }}>
                  {selectedUser.firstName} {selectedUser.lastName}
                </h4>
                <p style={{ margin: '4px 0 0', fontSize: 12.5, color: C.textSub }}>{selectedUser.email}</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }}>
                  <span style={{ fontSize: 9.5, fontWeight: 900, background: C.purplePale, color: C.purple, padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase' }}>
                    {selectedUser.role}
                  </span>
                  <span style={{ 
                    fontSize: 9.5, fontWeight: 900, 
                    background: selectedUser.isActive ? C.emeraldPale : C.redPale, 
                    color: selectedUser.isActive ? C.emerald : C.red, 
                    padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase' 
                  }}>
                    {selectedUser.isActive ? 'Active' : 'Suspended'}
                  </span>
                </div>
              </div>

              {/* Adjust Parameters Form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 900, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Elevate Role Scopes</p>
                
                <div>
                  <span style={{ fontSize: 12, color: C.textSub, display: 'block', marginBottom: 8 }}>Authorized Security Role</span>
                  <select
                    value={selectedUser.role}
                    onChange={(e) => handleUpdate({ role: e.target.value })}
                    disabled={isUpdating}
                    style={{ 
                      width: '100%', padding: '12px', borderRadius: 10, border: `1px solid ${C.borderStrong}`,
                      background: C.bg, color: C.text, fontSize: 13, outline: 'none'
                    }}
                  >
                    <option value="Customer">Standard Customer Portal</option>
                    <option value="SuperAdmin">Global Platform Super Admin</option>
                    <option value="Admin">Platform System Admin</option>
                    <option value="InstitutionAdmin">Bank Desk Administrator</option>
                    <option value="InsuranceAdmin">Insurance Desk Administrator</option>
                    <option value="BNPLAdmin">BNPL Desk Merchant Manager</option>
                  </select>
                </div>
              </div>

              {/* Toggle Account Suspension */}
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24 }}>
                <p style={{ margin: '0 0 16px', fontSize: 10, fontWeight: 900, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Administrative Operations</p>
                
                {selectedUser.isActive ? (
                  <button 
                    onClick={() => handleUpdate({ isActive: false })}
                    disabled={isUpdating}
                    style={{ 
                      width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: C.red,
                      color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8
                    }}
                  >
                    <BlockRounded sx={{ fontSize: 16 }} /> Suspend Portal Entry
                  </button>
                ) : (
                  <button 
                    onClick={() => handleUpdate({ isActive: true })}
                    disabled={isUpdating}
                    style={{ 
                      width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: C.emerald,
                      color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8
                    }}
                  >
                    <CheckCircleOutlineRounded sx={{ fontSize: 16 }} /> Restore Portal Entry
                  </button>
                )}
                <p style={{ margin: '10px 0 0', fontSize: 10.5, color: C.textMuted, textAlign: 'center', lineHeight: 1.4 }}>
                  Suspending a user blocks their credentials instantly and prevents them from requesting products or executing payouts.
                </p>
              </div>

            </div>

          </div>
        )}
      </Drawer>

    </AdminShell>
  );
}
