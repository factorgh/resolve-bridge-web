'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { toast } from 'react-hot-toast';
import { Drawer, IconButton } from '@mui/material';
import { CloseRounded, DirectionsCarRounded, LinkRounded } from '@mui/icons-material';
import AdminShell, { C, F } from '../components/AdminShell';
import {
  useAdminCreateVehicleLinkMutation,
  useAdminGetVehicleLinksQuery,
  useAdminGetVehiclesQuery,
  useAdminReleaseVehicleMutation,
  useAdminVerifyVehicleMutation,
} from '@/lib/redux/api/vehicleApi';
import { useGetInstitutionsQuery } from '@/lib/redux/api/productApi';

export default function AdminVehiclesPage() {
  const [mounted, setMounted] = useState(false);
  const [statusFilter, setStatusFilter] = useState('PendingReview');
  const [selected, setSelected] = useState<any>(null);
  const [markup, setMarkup] = useState('');
  const [institutionId, setInstitutionId] = useState('');
  const [minDown, setMinDown] = useState('10');
  const [linkForm, setLinkForm] = useState({ dealerName: '', dealerCompany: '', dealerPhone: '', dealerEmail: '', daysValid: '14' });
  const [createdPath, setCreatedPath] = useState('');

  const { data: vehiclesRes, refetch } = useAdminGetVehiclesQuery({ status: statusFilter === 'all' ? undefined : statusFilter });
  const { data: linksRes, refetch: refetchLinks } = useAdminGetVehicleLinksQuery();
  const { data: instsRes } = useGetInstitutionsQuery();
  const [createLink, { isLoading: creatingLink }] = useAdminCreateVehicleLinkMutation();
  const [verifyVehicle, { isLoading: verifying }] = useAdminVerifyVehicleMutation();
  const [releaseVehicle, { isLoading: releasing }] = useAdminReleaseVehicleMutation();

  const customerPrice = useMemo(() => {
    if (!selected) return 0;
    return Number(selected.dealerPrice || 0) + Number(markup || 0);
  }, [selected, markup]);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const vehicles = vehiclesRes?.data || [];
  const links = linksRes?.data || [];
  const lenders = (instsRes?.data || []).filter((i: any) =>
    ['Bank', 'Microfinance', 'Fintech'].includes(i.type) && i.isActive && i.isVerified
  );

  const openVehicle = (v: any) => {
    setSelected(v);
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

  return (
    <AdminShell>
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 300, color: C.text, fontFamily: F.serif }}>Vehicle desk</h1>
        <p style={{ margin: '8px 0 28px', fontSize: 13, color: C.textSub }}>
          Dealers upload via a link. You add markup, attach one recommended lender, then list on BNPL and the cars page.
        </p>

        <form onSubmit={handleCreateLink} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24, marginBottom: 28, display: 'grid', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.blueLight }}>
            <LinkRounded sx={{ fontSize: 18 }} />
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Issue dealer upload link</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
            <input required placeholder="Contact name" value={linkForm.dealerName} onChange={(e) => setLinkForm({ ...linkForm, dealerName: e.target.value })} style={field} />
            <input required placeholder="Dealership" value={linkForm.dealerCompany} onChange={(e) => setLinkForm({ ...linkForm, dealerCompany: e.target.value })} style={field} />
            <input placeholder="Phone" value={linkForm.dealerPhone} onChange={(e) => setLinkForm({ ...linkForm, dealerPhone: e.target.value })} style={field} />
            <input placeholder="Email" value={linkForm.dealerEmail} onChange={(e) => setLinkForm({ ...linkForm, dealerEmail: e.target.value })} style={field} />
            <input type="number" min={1} max={90} value={linkForm.daysValid} onChange={(e) => setLinkForm({ ...linkForm, daysValid: e.target.value })} style={field} />
          </div>
          <button type="submit" disabled={creatingLink} style={primaryBtn}>
            {creatingLink ? 'Creating…' : 'Create and copy link'}
          </button>
          {createdPath && (
            <div style={{ display: 'grid', gap: 8 }}>
              <p style={{ margin: 0, fontSize: 12, color: C.emerald, wordBreak: 'break-all' }}>{createdPath}</p>
              <a href={createdPath} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 800, color: C.blueLight }}>
                Open dealer upload page
              </a>
            </div>
          )}
          {links[0] && (
            <p style={{ margin: 0, fontSize: 11, color: C.textMuted }}>
              Latest issued: {links[0].dealerCompany} · {links[0].usedCount}/{links[0].maxUploads} used · expires {new Date(links[0].expiresAt).toLocaleDateString()}
            </p>
          )}
        </form>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {['PendingReview', 'Listed', 'Reserved', 'Sold', 'Rejected', 'all'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              background: statusFilter === s ? C.bluePale : C.surface,
              color: statusFilter === s ? C.blueLight : C.textSub,
              border: `1px solid ${statusFilter === s ? C.blue + '30' : C.border}`,
              borderRadius: 10, padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
            }}>{s}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          {vehicles.length === 0 && (
            <p style={{ color: C.textMuted, fontSize: 13 }}>No vehicles in this queue.</p>
          )}
          {vehicles.map((v: any) => (
            <button key={v._id} onClick={() => openVehicle(v)} style={{
              textAlign: 'left', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18, cursor: 'pointer', color: C.text,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontSize: 11, color: C.textMuted, textTransform: 'uppercase' }}>{v.dealerCompany}</p>
                  <h3 style={{ margin: '4px 0', fontSize: 18, fontWeight: 600 }}>{v.year} {v.make} {v.model}</h3>
                  <p style={{ margin: 0, fontSize: 12, color: C.textSub }}>
                    Dealer GH₵ {Number(v.dealerPrice).toLocaleString()} · Listed GH₵ {Number(v.customerPrice).toLocaleString()} · {v.status}
                    {v.recommendedInstitutionId?.name ? ` · ${v.recommendedInstitutionId.name}` : ''}
                  </p>
                </div>
                <DirectionsCarRounded sx={{ color: C.textMuted }} />
              </div>
            </button>
          ))}
        </div>
      </div>

      <Drawer anchor="right" open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div style={{ width: 420, maxWidth: '100vw', background: C.bg, minHeight: '100%', padding: 24, color: C.text }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 20 }}>{selected.year} {selected.make} {selected.model}</h2>
              <IconButton onClick={() => setSelected(null)} sx={{ color: C.text }}><CloseRounded /></IconButton>
            </div>
            <p style={{ fontSize: 12, color: C.textSub }}>From {selected.dealerCompany} · {selected.location} · {selected.condition}</p>
            <p style={{ fontSize: 13 }}>Dealer settlement (private): GH₵ {Number(selected.dealerPrice).toLocaleString()}</p>

            {(selected.photos || []).length > 0 && (
              <img src={selected.photos[0].url} alt="" style={{ width: '100%', borderRadius: 12, margin: '12px 0', maxHeight: 180, objectFit: 'cover' }} />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16, fontSize: 12 }}>
              {(selected.documents || []).map((d: any, i: number) => (
                <a key={i} href={d.url} target="_blank" rel="noreferrer" style={{ color: C.blueLight }}>{d.name || `Document ${i + 1}`}</a>
              ))}
            </div>

            {selected.status !== 'Sold' && (
              <>
                <label style={label}>Markup (GH₵)
                  <input type="number" min={0} value={markup} onChange={(e) => setMarkup(e.target.value)} style={field} />
                </label>
                <p style={{ fontSize: 13, color: C.emerald }}>Customer / loan price: GH₵ {customerPrice.toLocaleString()}</p>
                <label style={label}>Recommended institution
                  <select value={institutionId} onChange={(e) => setInstitutionId(e.target.value)} style={field}>
                    <option value="">Select…</option>
                    {lenders.map((i: any) => <option key={i._id} value={i._id}>{i.name}</option>)}
                  </select>
                </label>
                <label style={label}>Minimum down payment %
                  <input type="number" min={10} value={minDown} onChange={(e) => setMinDown(e.target.value)} style={field} />
                </label>
                <button onClick={handleList} disabled={verifying || !institutionId} style={{ ...primaryBtn, marginTop: 12 }}>
                  {verifying ? 'Listing…' : 'Verify and list'}
                </button>
                {selected.status === 'Reserved' && (
                  <button onClick={handleRelease} disabled={releasing} style={{ ...ghostBtn, marginTop: 8 }}>Release reservation</button>
                )}
                {selected.status === 'PendingReview' && (
                  <button onClick={handleReject} disabled={verifying} style={{ ...ghostBtn, marginTop: 8, color: C.red, borderColor: C.red }}>Reject</button>
                )}
              </>
            )}
          </div>
        )}
      </Drawer>
    </AdminShell>
  );
}

const field: CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.04)',
  color: '#f3f4f6',
  fontSize: 13,
  boxSizing: 'border-box',
};

const label: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, fontWeight: 700, marginBottom: 10 };

const primaryBtn: CSSProperties = {
  background: '#3b82f6',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  padding: '12px 16px',
  fontWeight: 700,
  cursor: 'pointer',
};

const ghostBtn: CSSProperties = {
  width: '100%',
  background: 'transparent',
  color: '#9ca3af',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 10,
  padding: '12px 16px',
  fontWeight: 700,
  cursor: 'pointer',
};
