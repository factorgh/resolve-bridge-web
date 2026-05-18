'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Drawer, IconButton } from '@mui/material';
import AdminShell, { C, F } from '../components/AdminShell';
import { 
  useAdminGetInstitutionsQuery, 
  useAdminUpdateInstitutionMutation 
} from '@/lib/redux/api/institutionApi';
import { 
  CloseRounded, 
  SearchRounded, 
  VerifiedUserRounded,
  NewReleasesRounded,
  WorkspacePremiumRounded,
  LocalActivityRounded,
  AccountBalanceRounded,
  StorefrontRounded,
  SecurityRounded,
  CheckCircleOutlineRounded,
  RemoveCircleOutlineRounded,
  CardGiftcardRounded
} from '@mui/icons-material';

export default function AdminPartnersPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, verified
  const [selectedInst, setSelectedInst] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Awards & Promotions inputs inside Drawer
  const [newAward, setNewAward] = useState('');
  const [newPromo, setNewPromo] = useState('');

  // Fetch all partners
  const { data: instsResponse, isLoading, refetch } = useAdminGetInstitutionsQuery();
  const [updateInstitution, { isLoading: isUpdating }] = useAdminUpdateInstitutionMutation();

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return null;

  const rawInstitutions = instsResponse?.data || [];

  // Filter and search logic
  const institutions = rawInstitutions.filter((inst: any) => {
    const name = (inst.name || '').toLowerCase();
    const legalName = (inst.legalName || '').toLowerCase();
    const regNum = (inst.registrationNumber || '').toLowerCase();
    const tin = (inst.taxId || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = name.includes(query) || legalName.includes(query) || regNum.includes(query) || tin.includes(query);

    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'pending') return matchesSearch && !inst.isVerified;
    if (statusFilter === 'verified') return matchesSearch && inst.isVerified;
    return matchesSearch && inst.type?.toLowerCase() === statusFilter;
  });

  const handleUpdateField = async (fields: { isVerified?: boolean; isActive?: boolean; awards?: string[]; promotions?: string[] }) => {
    if (!selectedInst) return;
    try {
      const res = await updateInstitution({ id: selectedInst._id, ...fields }).unwrap();
      if (res.success) {
        toast.success('Partner parameters successfully synchronized');
        setSelectedInst(res.data);
        refetch();
      } else {
        toast.error(res.message || 'Operation failed');
      }
    } catch (err: any) {
      toast.error(err.data?.message || 'Error executing administrative update');
    }
  };

  const getInstitutionIcon = (type: string) => {
    switch (type) {
      case 'Bank': return <AccountBalanceRounded sx={{ fontSize: 20 }} />;
      case 'Merchant': return <StorefrontRounded sx={{ fontSize: 20 }} />;
      default: return <SecurityRounded sx={{ fontSize: 20 }} />;
    }
  };

  const handleAddAward = () => {
    if (!newAward.trim() || !selectedInst) return;
    const currentAwards = selectedInst.awards || [];
    if (currentAwards.includes(newAward.trim())) {
      toast.error('Award badge already exists');
      return;
    }
    const updated = [...currentAwards, newAward.trim()];
    handleUpdateField({ awards: updated });
    setNewAward('');
  };

  const handleRemoveAward = (awardToRemove: string) => {
    if (!selectedInst) return;
    const currentAwards = selectedInst.awards || [];
    const updated = currentAwards.filter((a: string) => a !== awardToRemove);
    handleUpdateField({ awards: updated });
  };

  const handleAddPromo = () => {
    if (!newPromo.trim() || !selectedInst) return;
    const currentPromos = selectedInst.promotions || [];
    if (currentPromos.includes(newPromo.trim())) {
      toast.error('Promotion coupon already exists');
      return;
    }
    const updated = [...currentPromos, newPromo.trim()];
    handleUpdateField({ promotions: updated });
    setNewPromo('');
  };

  const handleRemovePromo = (promoToRemove: string) => {
    if (!selectedInst) return;
    const currentPromos = selectedInst.promotions || [];
    const updated = currentPromos.filter((p: string) => p !== promoToRemove);
    handleUpdateField({ promotions: updated });
  };

  return (
    <AdminShell>
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        
        {/* Welcome Header */}
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
              B2B Partner Verification & Desk Manager
            </h1>
            <p style={{ margin: '8px 0 0', fontSize: 13, color: C.textSub }}>
              Evaluate legal entities, lock or unlock portal access permissions, and configure marketing promotions.
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
            Sync Partners
          </button>
        </div>

        {/* Directory Card */}
        <div style={{ background: C.surface, borderRadius: 24, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          
          <div style={{ 
            padding: 24, borderBottom: `1px solid ${C.border}`, display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            gap: 20, alignItems: isMobile ? 'stretch' : 'center', flexWrap: 'wrap' 
          }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
              <input 
                placeholder="Search by corporate name, TIN, registration number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  width: '100%', padding: '12px 16px 12px 42px', borderRadius: 12, border: `1px solid ${C.border}`, 
                  background: C.bg, fontSize: 13.5, outline: 'none', color: C.text 
                }}
              />
              <SearchRounded sx={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: C.textMuted }} />
            </div>

            {/* Filter tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {[
                { label: 'All Partners', value: 'all' },
                { label: 'Pending Verification', value: 'pending' },
                { label: 'Verified Partners', value: 'verified' },
                { label: 'Lending Desks', value: 'bank' },
                { label: 'BNPL Merchants', value: 'merchant' },
                { label: 'Insurers', value: 'insurance' },
              ].map(f => {
                const active = statusFilter === f.value;
                return (
                  <button 
                    key={f.value}
                    onClick={() => setStatusFilter(f.value)}
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

          {/* Table Container */}
          <div style={{ overflowX: 'auto' }}>
            {isLoading ? (
              <div style={{ padding: '60px 0', textAlign: 'center' }}>
                <p style={{ color: C.textSub, fontSize: 14 }}>Deciphering corporate registration files...</p>
              </div>
            ) : institutions.length === 0 ? (
              <div style={{ padding: '80px 0', textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🛡️</div>
                <p style={{ color: C.textSub, fontSize: 14, fontWeight: 600 }}>No corporate institutions found matching this query.</p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.01)' }}>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Corporate Entity</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>TIN & REG Details</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Tenant Scope</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Access Approval</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {institutions.map((inst: any) => (
                    <tr 
                      key={inst._id} 
                      style={{ borderBottom: `1px solid ${C.border}`, transition: '0.2s', cursor: 'pointer' }}
                      onClick={() => setSelectedInst(inst)}
                    >
                      <td style={{ padding: '20px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ 
                            width: 32, height: 32, borderRadius: '50%', 
                            background: inst.isVerified ? C.emeraldPale : C.amberPale,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            color: inst.isVerified ? C.emerald : C.amber
                          }}>
                            {getInstitutionIcon(inst.type)}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
                              {inst.legalName}
                            </span>
                            <span style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
                              {inst.email} • {inst.phoneNumber}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: 13, color: C.textSub }}>Reg: {inst.registrationNumber}</span>
                          <span style={{ fontSize: 11, color: C.textMuted, marginTop: 3 }}>TIN: {inst.taxId}</span>
                        </div>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <span style={{ 
                          fontSize: 10, fontWeight: 800, 
                          background: 'rgba(255,255,255,0.05)',
                          color: C.textSub,
                          padding: '4px 8px', borderRadius: 4, textTransform: 'uppercase'
                        }}>
                          {inst.type}
                        </span>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <span style={{ 
                          fontSize: 11, fontWeight: 700, 
                          color: inst.isVerified ? C.emerald : C.amber
                        }}>
                          {inst.isVerified ? 'Verified & Active' : 'Underwriting Pending'}
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
                            setSelectedInst(inst);
                          }}
                        >
                          Audit Tenant
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

      {/* Corporate Settings Drawer */}
      <Drawer
        anchor="right"
        open={!!selectedInst}
        onClose={() => {
          setSelectedInst(null);
          setNewAward('');
          setNewPromo('');
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
        {selectedInst && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            
            {/* Header */}
            <div style={{ padding: 24, borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 9.5, fontWeight: 900, color: C.blueLight, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Corporate Desk Audit</span>
                <h3 style={{ margin: '4px 0 0', fontSize: 18, color: C.text, fontFamily: F.heading }}>Tenant parameters</h3>
              </div>
              <IconButton 
                onClick={() => { setSelectedInst(null); setNewAward(''); setNewPromo(''); }}
                sx={{ color: C.textSub, width: 34, height: 34 }}
              >
                <CloseRounded sx={{ fontSize: 18 }} />
              </IconButton>
            </div>

            {/* Body */}
            <div style={{ flex: 1, padding: 32, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
              
              {/* Partner Overview */}
              <div style={{ background: 'rgba(255,255,255,0.01)', border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
                <div style={{ 
                  width: 48, height: 48, borderRadius: '50%', 
                  background: selectedInst.isVerified ? C.emeraldPale : C.amberPale, 
                  color: selectedInst.isVerified ? C.emerald : C.amber,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
                }}>
                  {getInstitutionIcon(selectedInst.type)}
                </div>
                <h4 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.text, textAlign: 'center' }}>
                  {selectedInst.legalName}
                </h4>
                <p style={{ margin: '4px 0 0', fontSize: 12.5, color: C.textSub, textAlign: 'center' }}>{selectedInst.email}</p>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }}>
                  <span style={{ fontSize: 9.5, fontWeight: 900, background: 'rgba(255,255,255,0.05)', color: C.textSub, padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase' }}>
                    {selectedInst.type}
                  </span>
                  <span style={{ 
                    fontSize: 9.5, fontWeight: 900, 
                    background: selectedInst.isVerified ? C.emeraldPale : C.amberPale, 
                    color: selectedInst.isVerified ? C.emerald : C.amber, 
                    padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase' 
                  }}>
                    {selectedInst.isVerified ? 'VERIFIED' : 'PENDING REVIEW'}
                  </span>
                </div>
              </div>

              {/* Corporate Compliance Details */}
              <div>
                <p style={{ margin: '0 0 16px', fontSize: 10, fontWeight: 900, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Compliance Records</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: 8 }}>
                    <span style={{ fontSize: 12.5, color: C.textSub }}>Tax ID / TIN</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: C.text }}>{selectedInst.taxId}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: 8 }}>
                    <span style={{ fontSize: 12.5, color: C.textSub }}>Reg Number</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: C.text }}>{selectedInst.registrationNumber}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}`, paddingBottom: 8 }}>
                    <span style={{ fontSize: 12.5, color: C.textSub }}>Official Website</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: C.blueLight }}>{selectedInst.website || 'None'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12.5, color: C.textSub }}>HQ coordinates</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: C.text }}>{selectedInst.streetAddress}, {selectedInst.city}</span>
                  </div>
                </div>
              </div>

              {/* Underwriting Verification Trigger */}
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24 }}>
                <p style={{ margin: '0 0 16px', fontSize: 10, fontWeight: 900, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Operational Access Control</p>
                
                {!selectedInst.isVerified ? (
                  <button 
                    onClick={() => handleUpdateField({ isVerified: true })}
                    disabled={isUpdating}
                    style={{ 
                      width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: C.emerald,
                      color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8
                    }}
                  >
                    <VerifiedUserRounded sx={{ fontSize: 16 }} /> Verify & Activate partner
                  </button>
                ) : (
                  <button 
                    onClick={() => handleUpdateField({ isVerified: false })}
                    disabled={isUpdating}
                    style={{ 
                      width: '100%', padding: '14px', borderRadius: 12, border: `1.5px solid ${C.amber}`, background: 'transparent',
                      color: C.amber, fontWeight: 800, fontSize: 13, cursor: 'pointer',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8
                    }}
                  >
                    <RemoveCircleOutlineRounded sx={{ fontSize: 16 }} /> Revoke Verification Lock
                  </button>
                )}
                <p style={{ margin: '10px 0 0', fontSize: 10.5, color: C.textMuted, textAlign: 'center', lineHeight: 1.4 }}>
                  Verification allows partner admins to log in. Revoking locks them out immediately to protect your consumer network.
                </p>
              </div>

              {/* Awards Management Desk */}
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <WorkspacePremiumRounded style={{ color: C.amber }} />
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 900, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Manage Partner Awards & Badges</p>
                </div>

                {/* Badges list */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                  {(!selectedInst.awards || selectedInst.awards.length === 0) ? (
                    <span style={{ fontSize: 12, color: C.textMuted, fontStyle: 'italic' }}>No active awards issued</span>
                  ) : (
                    selectedInst.awards.map((award: string) => (
                      <span
                        key={award}
                        style={{
                          fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
                          background: C.amberPale, color: C.amber, border: `1px solid ${C.amber}25`,
                          display: 'inline-flex', alignItems: 'center', gap: 6
                        }}
                      >
                        🏆 {award}
                        <button
                          onClick={() => handleRemoveAward(award)}
                          style={{ background: 'none', border: 'none', color: C.amber, cursor: 'pointer', fontSize: 12, padding: 0 }}
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Add Award field */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    placeholder="e.g. Premium Lender, Rapid Settler..."
                    value={newAward}
                    onChange={(e) => setNewAward(e.target.value)}
                    style={{
                      flex: 1, padding: '10px 14px', borderRadius: 10, border: `1px solid ${C.borderStrong}`,
                      background: C.bg, color: C.text, fontSize: 13, outline: 'none'
                    }}
                  />
                  <button
                    onClick={handleAddAward}
                    disabled={isUpdating}
                    style={{
                      background: C.blueLight, color: '#fff', border: 'none', borderRadius: 10,
                      padding: '0 16px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    Award
                  </button>
                </div>
              </div>

              {/* Promotions Management Desk */}
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <CardGiftcardRounded style={{ color: C.blueLight }} />
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 900, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Manage Promotions & Campaigns</p>
                </div>

                {/* Promotions list */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                  {(!selectedInst.promotions || selectedInst.promotions.length === 0) ? (
                    <span style={{ fontSize: 12, color: C.textMuted, fontStyle: 'italic' }}>No active promotions running</span>
                  ) : (
                    selectedInst.promotions.map((promo: string) => (
                      <span
                        key={promo}
                        style={{
                          fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
                          background: C.bluePale, color: C.blueLight, border: `1px solid ${C.blue}25`,
                          display: 'inline-flex', alignItems: 'center', gap: 6
                        }}
                      >
                        🎁 {promo}
                        <button
                          onClick={() => handleRemovePromo(promo)}
                          style={{ background: 'none', border: 'none', color: C.blueLight, cursor: 'pointer', fontSize: 12, padding: 0 }}
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Add Promotion field */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    placeholder="e.g. Zero Signup June, 10% Match Bonus..."
                    value={newPromo}
                    onChange={(e) => setNewPromo(e.target.value)}
                    style={{
                      flex: 1, padding: '10px 14px', borderRadius: 10, border: `1px solid ${C.borderStrong}`,
                      background: C.bg, color: C.text, fontSize: 13, outline: 'none'
                    }}
                  />
                  <button
                    onClick={handleAddPromo}
                    disabled={isUpdating}
                    style={{
                      background: C.blueLight, color: '#fff', border: 'none', borderRadius: 10,
                      padding: '0 16px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    Promote
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}
      </Drawer>

    </AdminShell>
  );
}
