'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  useGetIntakeLinkQuery,
  useSubmitIntakeVehicleMutation,
  useUploadIntakeFilesMutation,
} from '@/lib/redux/api/vehicleApi';

const BODY_TYPES = ['SUV', 'Sedan', '4x4', 'Pick-up', 'Hatchback', 'Van'];
const FUELS = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
const CONDITIONS = ['New', 'Used'];

export default function DealerUploadPage() {
  const params = useParams();
  const token = String(params.token || '');
  const { data, isLoading, isError } = useGetIntakeLinkQuery(token, { skip: !token });
  const [uploadFiles, { isLoading: isUploading }] = useUploadIntakeFilesMutation();
  const [submitVehicle, { isLoading: isSubmitting }] = useSubmitIntakeVehicleMutation();
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    make: '',
    model: '',
    year: String(new Date().getFullYear()),
    bodyType: 'SUV',
    fuel: 'Petrol',
    transmission: 'Auto',
    mileageKm: '0',
    vin: '',
    condition: 'Used',
    color: '',
    location: 'Accra',
    description: '',
    dealerPrice: '',
  });
  const [photos, setPhotos] = useState<{ url: string; name: string; type: string }[]>([]);
  const [documents, setDocuments] = useState<{ url: string; name: string; type: string }[]>([]);

  const link = data?.data;
  const set = (key: string) => (e: any) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const canSubmit = useMemo(() => {
    return form.make && form.model && form.year && Number(form.dealerPrice) > 0;
  }, [form]);

  const handleFiles = async (files: FileList | null, kind: 'photo' | 'document') => {
    if (!files?.length) return;
    const fd = new FormData();
    Array.from(files).forEach((file) => fd.append('files', file));
    try {
      const res = await uploadFiles({ token, formData: fd }).unwrap();
      const uploaded = res.data || [];
      if (kind === 'photo') setPhotos((prev) => [...prev, ...uploaded]);
      else setDocuments((prev) => [...prev, ...uploaded]);
      toast.success(`${uploaded.length} file(s) uploaded`);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Could not upload files');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      await submitVehicle({
        token,
        body: {
          ...form,
          year: Number(form.year),
          mileageKm: Number(form.mileageKm) || 0,
          dealerPrice: Number(form.dealerPrice),
          photos,
          documents,
        },
      }).unwrap();
      setDone(true);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Could not submit this vehicle');
    }
  };

  const inputStyle: CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: 12,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  };

  if (isLoading) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <p style={{ color: '#64748b', fontWeight: 600 }}>Checking your upload link…</p>
      </main>
    );
  }

  if (isError || !link) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: 24 }}>
        <div style={{ maxWidth: 420, textAlign: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 24, padding: 40 }}>
          <h1 style={{ margin: '0 0 8px', fontSize: 22 }}>Link unavailable</h1>
          <p style={{ margin: 0, color: '#64748b', lineHeight: 1.6 }}>
            This dealer upload link is invalid, used up, or has expired. Ask ResolveBridge for a new one.
          </p>
        </div>
      </main>
    );
  }

  if (done) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: 24 }}>
        <div style={{ maxWidth: 480, textAlign: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 24, padding: 40 }}>
          <h1 style={{ margin: '0 0 8px', fontSize: 24 }}>Received</h1>
          <p style={{ margin: '0 0 24px', color: '#64748b', lineHeight: 1.6 }}>
            {form.year} {form.make} {form.model} is with ResolveBridge for verification. It will not appear to customers until our team lists it.
          </p>
          <button
            onClick={() => {
              setDone(false);
              setForm((f) => ({ ...f, make: '', model: '', vin: '', dealerPrice: '', description: '' }));
              setPhotos([]);
              setDocuments([]);
            }}
            style={{ background: '#0d1b3e', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 20px', fontWeight: 700, cursor: 'pointer' }}
          >
            Upload another vehicle
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '32px 16px 80px' }}>
      <form onSubmit={handleSubmit} style={{ maxWidth: 720, margin: '0 auto' }}>
        <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', color: '#2563eb', textTransform: 'uppercase' }}>
          ResolveBridge dealer intake
        </p>
        <h1 style={{ margin: '0 0 8px', fontSize: 28 }}>Upload a vehicle</h1>
        <p style={{ margin: '0 0 28px', color: '#64748b' }}>
          Send the vehicle price and papers. ResolveBridge adds the listing price and a recommended lender before customers see it.
          {link.remaining != null ? ` ${link.remaining} upload(s) left on this link.` : ''}
        </p>

        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: 24, display: 'grid', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label>Make<input required value={form.make} onChange={set('make')} style={inputStyle} placeholder="Toyota" /></label>
            <label>Model<input required value={form.model} onChange={set('model')} style={inputStyle} placeholder="Land Cruiser Prado" /></label>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <label>Year<input required type="number" value={form.year} onChange={set('year')} style={inputStyle} /></label>
            <label>Body
              <select value={form.bodyType} onChange={set('bodyType')} style={inputStyle}>
                {BODY_TYPES.map((b) => <option key={b}>{b}</option>)}
              </select>
            </label>
            <label>Condition
              <select value={form.condition} onChange={set('condition')} style={inputStyle}>
                {CONDITIONS.map((b) => <option key={b}>{b}</option>)}
              </select>
            </label>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <label>Fuel
              <select value={form.fuel} onChange={set('fuel')} style={inputStyle}>
                {FUELS.map((b) => <option key={b}>{b}</option>)}
              </select>
            </label>
            <label>Transmission<input value={form.transmission} onChange={set('transmission')} style={inputStyle} /></label>
            <label>Mileage (km)<input type="number" value={form.mileageKm} onChange={set('mileageKm')} style={inputStyle} /></label>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label>VIN / chassis<input value={form.vin} onChange={set('vin')} style={inputStyle} /></label>
            <label>Colour<input value={form.color} onChange={set('color')} style={inputStyle} /></label>
          </div>
          <label>Location<input value={form.location} onChange={set('location')} style={inputStyle} /></label>
          <label>Your price (GH₵)
            <input required type="number" min={1} value={form.dealerPrice} onChange={set('dealerPrice')} style={inputStyle} placeholder="150000" />
          </label>
          <label>Notes
            <textarea value={form.description} onChange={set('description')} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </label>

          <div>
            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700 }}>Photos</p>
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => handleFiles(e.target.files, 'photo')} />
            <p style={{ margin: '8px 0 0', fontSize: 12, color: '#64748b' }}>{photos.length} photo(s) attached{isUploading ? ' — uploading…' : ''}</p>
          </div>
          <div>
            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700 }}>Papers (DVLA, duty, valuation, invoice)</p>
            <input type="file" accept="application/pdf,image/jpeg,image/png,image/webp" multiple onChange={(e) => handleFiles(e.target.files, 'document')} />
            <p style={{ margin: '8px 0 0', fontSize: 12, color: '#64748b' }}>{documents.length} document(s) attached</p>
          </div>

          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            style={{
              marginTop: 8,
              background: '#0d1b3e',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              padding: '14px 18px',
              fontWeight: 800,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              opacity: canSubmit ? 1 : 0.5,
            }}
          >
            {isSubmitting ? 'Sending…' : 'Submit for verification'}
          </button>
        </div>
      </form>
    </main>
  );
}
