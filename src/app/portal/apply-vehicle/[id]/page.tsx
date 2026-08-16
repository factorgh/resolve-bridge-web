'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import PortalShell, { C, F } from '../../components/PortalShell';
import { useGetPublicVehicleQuery } from '@/lib/redux/api/vehicleApi';
import { useCreateApplicationMutation } from '@/lib/redux/api/applicationApi';
import { useGetMeQuery } from '@/lib/redux/api/userApi';

export default function ApplyVehiclePage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id || '');
  const { data, isLoading, isError } = useGetPublicVehicleQuery(id, { skip: !id });
  const { data: me } = useGetMeQuery();
  const [createApplication, { isLoading: submitting }] = useCreateApplicationMutation();
  const [tenure, setTenure] = useState(36);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const vehicle = data?.data;
  const price = Number(vehicle?.customerPrice || 0);
  const downPct = Number(vehicle?.minDownPaymentPercent || 10);
  const down = Math.ceil(price * (downPct / 100));
  const financed = Math.max(0, price - down);
  const rate = Number(vehicle?.finance?.interestRate || 16) / 100;
  const monthly = tenure ? Math.round((financed + financed * rate * (tenure / 12)) / tenure) : 0;

  const handleApply = async () => {
    if (!vehicle?.finance?.id) {
      toast.error('This vehicle is not attached to a lender yet');
      return;
    }
    if (vehicle.status !== 'Listed') {
      toast.error('This vehicle is no longer available');
      return;
    }
    try {
      const user = me?.data;
      const result = await createApplication({
        productId: vehicle.finance.id,
        amount: price,
        tenureMonths: tenure,
        applicationData: {
          vehicleId: vehicle.id,
          purpose: 'Vehicle Purchase',
          personal: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            phone: user?.phoneNumber || '',
            email: user?.email || '',
          },
        },
      }).unwrap();
      if (result.data?.authorizationUrl) {
        window.location.href = result.data.authorizationUrl;
        return;
      }
      toast.success('Application sent to the recommended lender');
      router.push('/portal/statement');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Could not submit this application');
    }
  };

  return (
    <PortalShell title="Vehicle finance" backHref="/portal/marketplace">
      <div style={{ maxWidth: 720, margin: '0 auto', padding: isMobile ? '0 16px 80px' : '0 0 80px' }}>
        {isLoading && <p style={{ color: C.textSub }}>Loading vehicle…</p>}
        {(isError || (!isLoading && !vehicle)) && (
          <p style={{ color: C.textSub }}>This listing is not available.</p>
        )}
        {vehicle && (
          <>
            {vehicle.photos?.[0]?.url && (
              <img src={vehicle.photos[0].url} alt="" style={{ width: '100%', borderRadius: 24, maxHeight: 320, objectFit: 'cover', marginBottom: 24 }} />
            )}
            <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: C.blue, textTransform: 'uppercase' }}>{vehicle.make}</p>
            <h1 style={{ margin: '6px 0 8px', fontSize: isMobile ? 26 : 32, fontFamily: F.heading }}>{vehicle.year} {vehicle.model}</h1>
            <p style={{ margin: '0 0 24px', color: C.textSub }}>{vehicle.location} · {vehicle.condition} · {vehicle.fuel} · {vehicle.transmission}</p>

            <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 20, padding: 24, marginBottom: 20 }}>
              <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>ResolveBridge price</p>
              <p style={{ margin: 0, fontSize: 28, fontWeight: 900 }}>GH₵ {price.toLocaleString()}</p>
            </div>

            <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 20, padding: 24, marginBottom: 20 }}>
              <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Recommended lender</p>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{vehicle.recommendedBank?.name || 'Assigned at listing'}</p>
              <p style={{ margin: '8px 0 0', fontSize: 13, color: C.textSub }}>
                This car is sent only to this institution. They review you and the vehicle papers, then proceed, ask for more documents, or cancel.
              </p>
            </div>

            <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 20, padding: 24, marginBottom: 24 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Tenure (months)
                <input type="range" min={vehicle.finance?.minTenureMonths || 12} max={vehicle.finance?.maxTenureMonths || 60} value={tenure} onChange={(e) => setTenure(Number(e.target.value))} style={{ width: '100%', marginTop: 12 }} />
              </label>
              <p style={{ margin: '12px 0 0', fontSize: 14 }}>{tenure} months</p>
              <p style={{ margin: '8px 0 0', fontSize: 14, color: C.textSub }}>Down payment ({downPct}%+): GH₵ {down.toLocaleString()}</p>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: C.textSub }}>Estimated monthly: GH₵ {monthly.toLocaleString()}</p>
            </div>

            <button
              onClick={handleApply}
              disabled={submitting || vehicle.status !== 'Listed'}
              style={{
                width: '100%',
                background: C.sidebar,
                color: '#fff',
                border: 'none',
                borderRadius: 14,
                padding: 16,
                fontWeight: 800,
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: vehicle.status === 'Listed' ? 1 : 0.5,
              }}
            >
              {submitting ? 'Submitting…' : `Apply with ${vehicle.recommendedBank?.name || 'recommended lender'}`}
            </button>
          </>
        )}
      </div>
    </PortalShell>
  );
}
