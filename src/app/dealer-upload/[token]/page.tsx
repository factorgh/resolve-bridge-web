'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  Car,
  Plus,
  Trash2,
  Copy,
  Upload,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  useGetIntakeLinkQuery,
  useSubmitIntakeVehicleMutation,
  useUploadIntakeFilesMutation,
} from '@/lib/redux/api/vehicleApi';

const BODY_TYPES = ['SUV', 'Sedan', '4x4', 'Pick-up', 'Hatchback', 'Van', 'Coupe', 'Truck'];
const FUELS = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
const CONDITIONS = ['New', 'Used', 'Foreign Used'];

interface VehicleDraft {
  id: string;
  make: string;
  model: string;
  year: string;
  bodyType: string;
  fuel: string;
  transmission: string;
  mileageKm: string;
  vin: string;
  condition: string;
  color: string;
  location: string;
  description: string;
  dealerPrice: string;
  photos: { url: string; name: string; type: string }[];
  documents: { url: string; name: string; type: string }[];
  isExpanded?: boolean;
}

const createNewVehicle = (index = 1, defaultLocation = 'Accra'): VehicleDraft => ({
  id: `veh-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
  location: defaultLocation,
  description: '',
  dealerPrice: '',
  photos: [],
  documents: [],
  isExpanded: true,
});

export default function DealerUploadPage() {
  const params = useParams();
  const token = String(params.token || '');
  const { data, isLoading, isError, refetch } = useGetIntakeLinkQuery(token, { skip: !token });
  const [uploadFiles] = useUploadIntakeFilesMutation();
  const [submitVehicle, { isLoading: isSubmitting }] = useSubmitIntakeVehicleMutation();

  const [vehicles, setVehicles] = useState<VehicleDraft[]>([createNewVehicle(1)]);
  const [activeVehicleIndex, setActiveVehicleIndex] = useState(0);
  const [uploadingFor, setUploadingFor] = useState<{ id: string; kind: 'photo' | 'document' } | null>(null);
  const [submittedVehicles, setSubmittedVehicles] = useState<any[] | null>(null);

  const link = data?.data;
  const remainingSlots = link?.remaining ?? 20;

  // Validation helpers
  const isVehicleValid = (v: VehicleDraft) => {
    return (
      v.make.trim().length > 0 &&
      v.model.trim().length > 0 &&
      Number(v.year) >= 1970 &&
      Number(v.dealerPrice) > 0
    );
  };

  const allValid = useMemo(() => {
    return vehicles.length > 0 && vehicles.every(isVehicleValid);
  }, [vehicles]);

  const totalValue = useMemo(() => {
    return vehicles.reduce((sum, v) => sum + (Number(v.dealerPrice) || 0), 0);
  }, [vehicles]);

  const updateVehicle = (id: string, key: keyof VehicleDraft, value: any) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [key]: value } : v))
    );
  };

  const handleAddVehicle = () => {
    if (vehicles.length >= remainingSlots) {
      toast.error(`You have reached the limit of ${remainingSlots} vehicle(s) for this link.`);
      return;
    }
    const lastLocation = vehicles[vehicles.length - 1]?.location || 'Accra';
    const newV = createNewVehicle(vehicles.length + 1, lastLocation);
    setVehicles((prev) => [...prev, newV]);
    setActiveVehicleIndex(vehicles.length);
    toast.success(`Vehicle #${vehicles.length + 1} added`);
  };

  const handleDuplicateVehicle = (id: string) => {
    if (vehicles.length >= remainingSlots) {
      toast.error(`You have reached the limit of ${remainingSlots} vehicle(s) for this link.`);
      return;
    }
    const source = vehicles.find((v) => v.id === id);
    if (!source) return;
    const duplicated: VehicleDraft = {
      ...source,
      id: `veh-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      vin: '', // reset VIN
      photos: [...source.photos],
      documents: [...source.documents],
      isExpanded: true,
    };
    setVehicles((prev) => [...prev, duplicated]);
    setActiveVehicleIndex(vehicles.length);
    toast.success('Vehicle entry duplicated');
  };

  const handleRemoveVehicle = (id: string) => {
    if (vehicles.length === 1) {
      toast.error('You must keep at least one vehicle in the intake.');
      return;
    }
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    setActiveVehicleIndex((prev) => Math.max(0, prev - 1));
  };

  const handleFiles = async (
    vehicleId: string,
    files: FileList | null,
    kind: 'photo' | 'document'
  ) => {
    if (!files?.length) return;
    setUploadingFor({ id: vehicleId, kind });
    const fd = new FormData();
    Array.from(files).forEach((file) => fd.append('files', file));
    try {
      const res = await uploadFiles({ token, formData: fd }).unwrap();
      const uploaded = res.data || [];
      setVehicles((prev) =>
        prev.map((v) => {
          if (v.id !== vehicleId) return v;
          return {
            ...v,
            [kind === 'photo' ? 'photos' : 'documents']: [
              ...v[kind === 'photo' ? 'photos' : 'documents'],
              ...uploaded,
            ],
          };
        })
      );
      toast.success(`${uploaded.length} file(s) attached to this vehicle`);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Could not upload files');
    } finally {
      setUploadingFor(null);
    }
  };

  const handleRemoveFile = (vehicleId: string, kind: 'photo' | 'document', index: number) => {
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id !== vehicleId) return v;
        const key = kind === 'photo' ? 'photos' : 'documents';
        const updated = [...v[key]];
        updated.splice(index, 1);
        return { ...v, [key]: updated };
      })
    );
  };

  const handleSubmitAll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allValid) {
      toast.error('Please ensure all vehicle entries have Make, Model, Year, and valid Price.');
      return;
    }

    const payload = vehicles.map((v) => ({
      make: v.make.trim(),
      model: v.model.trim(),
      year: Number(v.year),
      bodyType: v.bodyType,
      fuel: v.fuel,
      transmission: v.transmission,
      mileageKm: Number(v.mileageKm) || 0,
      vin: v.vin.trim(),
      condition: v.condition,
      color: v.color.trim(),
      location: v.location.trim() || 'Accra',
      description: v.description.trim(),
      dealerPrice: Number(v.dealerPrice),
      photos: v.photos,
      documents: v.documents,
    }));

    try {
      const res = await submitVehicle({
        token,
        body: { vehicles: payload },
      }).unwrap();

      setSubmittedVehicles(vehicles);
      refetch();
      toast.success(res?.message || `${vehicles.length} vehicle(s) submitted successfully!`);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Could not submit vehicles');
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
    backgroundColor: '#fff',
    transition: 'border-color 0.2s',
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
        <div style={{ maxWidth: 460, textAlign: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 24, padding: 40, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
          <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 16px' }} />
          <h1 style={{ margin: '0 0 8px', fontSize: 22, color: '#0f172a' }}>Link Unavailable</h1>
          <p style={{ margin: 0, color: '#64748b', lineHeight: 1.6, fontSize: 14 }}>
            This dealer upload link is invalid, used up, or has expired. Please contact ResolveBridge for a fresh link.
          </p>
        </div>
      </main>
    );
  }

  if (submittedVehicles) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: 24 }}>
        <div style={{ maxWidth: 600, width: '100%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 24, padding: 36, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <CheckCircle2 size={52} color="#10b981" style={{ margin: '0 auto 16px' }} />
            <h1 style={{ margin: '0 0 8px', fontSize: 24, color: '#0f172a' }}>
              {submittedVehicles.length} Vehicle{submittedVehicles.length > 1 ? 's' : ''} Received
            </h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
              All vehicles and price submissions have been received by ResolveBridge for verification and listing packaging.
            </p>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: 16, padding: 16, marginBottom: 24, border: '1px solid #e2e8f0' }}>
            <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Submitted Vehicles Summary
            </p>
            <div style={{ display: 'grid', gap: 10 }}>
              {submittedVehicles.map((v, i) => (
                <div
                  key={v.id || i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#fff',
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: 6 }}>
                      #{i + 1}
                    </span>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#0f172a' }}>
                        {v.year} {v.make} {v.model}
                      </p>
                      <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
                        {v.photos.length} photo(s) • {v.documents.length} paper(s) • {v.location}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 800, fontSize: 14, color: '#0d1b3e' }}>
                      GH₵ {Number(v.dealerPrice).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            {remainingSlots > submittedVehicles.length ? (
              <button
                onClick={() => {
                  setSubmittedVehicles(null);
                  setVehicles([createNewVehicle(1)]);
                  setActiveVehicleIndex(0);
                }}
                style={{
                  background: '#0d1b3e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 12,
                  padding: '12px 20px',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Upload more vehicles
              </button>
            ) : (
              <p style={{ margin: 0, color: '#64748b', fontSize: 13, textAlign: 'center' }}>
                All available upload slots on this link have been utilized.
              </p>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: '32px 16px 120px' }}>
      <div style={{ maxWidth: 840, margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', color: '#2563eb', textTransform: 'uppercase' }}>
                ResolveBridge Dealer Intake
              </p>
              <h1 style={{ margin: 0, fontSize: 28, color: '#0f172a', fontWeight: 800 }}>
                Upload Vehicles & Pricing
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#e0f2fe', color: '#0369a1', padding: '8px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
              <span>{remainingSlots} upload slot(s) available</span>
            </div>
          </div>
          <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: 14, lineHeight: 1.5 }}>
            Submit multiple vehicles and prices in one go. ResolveBridge assigns financing partners and sets the buyer listing price before publishing.
          </p>
        </div>

        {/* Multi-vehicle navigation bar */}
        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {vehicles.map((v, idx) => {
              const valid = isVehicleValid(v);
              const isActive = activeVehicleIndex === idx;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setActiveVehicleIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 14px',
                    borderRadius: 12,
                    border: isActive ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    background: isActive ? '#fff' : '#f1f5f9',
                    color: isActive ? '#0f172a' : '#475569',
                    fontWeight: isActive ? 700 : 600,
                    fontSize: 13,
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 2px 8px rgba(37,99,235,0.15)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Car size={16} color={isActive ? '#2563eb' : '#64748b'} />
                  <span>
                    #{idx + 1} {v.make && v.model ? `${v.make} ${v.model}` : `Car ${idx + 1}`}
                  </span>
                  {valid ? (
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} title="Ready" />
                  ) : (
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} title="Details required" />
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleAddVehicle}
            disabled={vehicles.length >= remainingSlots}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#fff',
              border: '1.5px dashed #2563eb',
              color: '#2563eb',
              padding: '8px 14px',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 13,
              cursor: vehicles.length >= remainingSlots ? 'not-allowed' : 'pointer',
              opacity: vehicles.length >= remainingSlots ? 0.5 : 1,
            }}
          >
            <Plus size={16} />
            <span>Add another car</span>
          </button>
        </div>

        {/* Active Vehicle Form Card */}
        <form onSubmit={handleSubmitAll}>
          {vehicles.map((v, idx) => {
            if (idx !== activeVehicleIndex) return null;
            const isCarValid = isVehicleValid(v);

            return (
              <div
                key={v.id}
                style={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 20,
                  padding: 24,
                  boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
                  marginBottom: 24,
                }}
              >
                {/* Vehicle Card Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid #f1f5f9', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, background: '#0d1b3e', color: '#fff', padding: '4px 10px', borderRadius: 8 }}>
                      Car {idx + 1} of {vehicles.length}
                    </span>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
                      {v.year} {v.make || 'New'} {v.model || 'Vehicle'}
                    </h2>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => handleDuplicateVehicle(v.id)}
                      title="Duplicate vehicle info"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '6px 12px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#475569',
                        cursor: 'pointer',
                      }}
                    >
                      <Copy size={14} />
                      <span>Duplicate</span>
                    </button>

                    {vehicles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveVehicle(v.id)}
                        title="Remove vehicle"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '6px 12px',
                          background: '#fef2f2',
                          border: '1px solid #fecaca',
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#dc2626',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={14} />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Form Fields Grid */}
                <div style={{ display: 'grid', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#334155' }}>
                        Make <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        required
                        value={v.make}
                        onChange={(e) => updateVehicle(v.id, 'make', e.target.value)}
                        style={inputStyle}
                        placeholder="e.g. Toyota"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#334155' }}>
                        Model <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        required
                        value={v.model}
                        onChange={(e) => updateVehicle(v.id, 'model', e.target.value)}
                        style={inputStyle}
                        placeholder="e.g. Land Cruiser Prado"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#334155' }}>
                        Year <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        required
                        type="number"
                        value={v.year}
                        onChange={(e) => updateVehicle(v.id, 'year', e.target.value)}
                        style={inputStyle}
                        min={1970}
                        max={new Date().getFullYear() + 2}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#334155' }}>
                        Body Type
                      </label>
                      <select
                        value={v.bodyType}
                        onChange={(e) => updateVehicle(v.id, 'bodyType', e.target.value)}
                        style={inputStyle}
                      >
                        {BODY_TYPES.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#334155' }}>
                        Condition
                      </label>
                      <select
                        value={v.condition}
                        onChange={(e) => updateVehicle(v.id, 'condition', e.target.value)}
                        style={inputStyle}
                      >
                        {CONDITIONS.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#334155' }}>
                        Fuel Type
                      </label>
                      <select
                        value={v.fuel}
                        onChange={(e) => updateVehicle(v.id, 'fuel', e.target.value)}
                        style={inputStyle}
                      >
                        {FUELS.map((f) => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#334155' }}>
                        Transmission
                      </label>
                      <input
                        value={v.transmission}
                        onChange={(e) => updateVehicle(v.id, 'transmission', e.target.value)}
                        style={inputStyle}
                        placeholder="Auto / Manual"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#334155' }}>
                        Mileage (km)
                      </label>
                      <input
                        type="number"
                        value={v.mileageKm}
                        onChange={(e) => updateVehicle(v.id, 'mileageKm', e.target.value)}
                        style={inputStyle}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#334155' }}>
                        VIN / Chassis No.
                      </label>
                      <input
                        value={v.vin}
                        onChange={(e) => updateVehicle(v.id, 'vin', e.target.value)}
                        style={inputStyle}
                        placeholder="Optional chassis number"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#334155' }}>
                        Colour
                      </label>
                      <input
                        value={v.color}
                        onChange={(e) => updateVehicle(v.id, 'color', e.target.value)}
                        style={inputStyle}
                        placeholder="e.g. Pearl White"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#334155' }}>
                        Location
                      </label>
                      <input
                        value={v.location}
                        onChange={(e) => updateVehicle(v.id, 'location', e.target.value)}
                        style={inputStyle}
                        placeholder="Accra / Kumasi / etc."
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#334155' }}>
                        Your Asking Price (GH₵) <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        required
                        type="number"
                        min={1}
                        value={v.dealerPrice}
                        onChange={(e) => updateVehicle(v.id, 'dealerPrice', e.target.value)}
                        style={{ ...inputStyle, borderColor: v.dealerPrice ? '#e2e8f0' : '#cbd5e1', fontWeight: 700 }}
                        placeholder="e.g. 150000"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#334155' }}>
                      Notes & Description
                    </label>
                    <textarea
                      value={v.description}
                      onChange={(e) => updateVehicle(v.id, 'description', e.target.value)}
                      rows={2}
                      style={{ ...inputStyle, resize: 'vertical' }}
                      placeholder="Vehicle features, trim level, options, condition details..."
                    />
                  </div>

                  {/* Photos Section */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ImageIcon size={18} color="#2563eb" />
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                          Vehicle Photos ({v.photos.length})
                        </span>
                      </div>
                      <label
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          background: '#fff',
                          border: '1px solid #cbd5e1',
                          padding: '6px 12px',
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#0f172a',
                          cursor: 'pointer',
                        }}
                      >
                        <Upload size={14} />
                        <span>Add Photos</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          onChange={(e) => handleFiles(v.id, e.target.files, 'photo')}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>

                    {uploadingFor?.id === v.id && uploadingFor.kind === 'photo' && (
                      <p style={{ margin: '0 0 8px', fontSize: 12, color: '#2563eb', fontWeight: 600 }}>
                        Uploading photos…
                      </p>
                    )}

                    {v.photos.length > 0 ? (
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {v.photos.map((p, pIdx) => (
                          <div
                            key={p.url || pIdx}
                            style={{
                              position: 'relative',
                              width: 80,
                              height: 60,
                              borderRadius: 8,
                              overflow: 'hidden',
                              border: '1px solid #cbd5e1',
                              background: '#e2e8f0',
                            }}
                          >
                            <img
                              src={p.url}
                              alt={p.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(v.id, 'photo', pIdx)}
                              style={{
                                position: 'absolute',
                                top: 2,
                                right: 2,
                                background: 'rgba(0,0,0,0.6)',
                                border: 'none',
                                borderRadius: '50%',
                                width: 18,
                                height: 18,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                cursor: 'pointer',
                              }}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>
                        No photos attached yet. You can attach multiple exterior and interior photos.
                      </p>
                    )}
                  </div>

                  {/* Documents Section */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FileText size={18} color="#059669" />
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                          Vehicle Papers & Documents ({v.documents.length})
                        </span>
                      </div>
                      <label
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          background: '#fff',
                          border: '1px solid #cbd5e1',
                          padding: '6px 12px',
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#0f172a',
                          cursor: 'pointer',
                        }}
                      >
                        <Upload size={14} />
                        <span>Add Documents</span>
                        <input
                          type="file"
                          accept="application/pdf,image/jpeg,image/png,image/webp"
                          multiple
                          onChange={(e) => handleFiles(v.id, e.target.files, 'document')}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>

                    {uploadingFor?.id === v.id && uploadingFor.kind === 'document' && (
                      <p style={{ margin: '0 0 8px', fontSize: 12, color: '#059669', fontWeight: 600 }}>
                        Uploading documents…
                      </p>
                    )}

                    {v.documents.length > 0 ? (
                      <div style={{ display: 'grid', gap: 6 }}>
                        {v.documents.map((d, dIdx) => (
                          <div
                            key={d.url || dIdx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              background: '#fff',
                              padding: '6px 10px',
                              borderRadius: 8,
                              border: '1px solid #e2e8f0',
                              fontSize: 12,
                            }}
                          >
                            <span style={{ color: '#334155', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '85%' }}>
                              {d.name || `Document ${dIdx + 1}`}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(v.id, 'document', dIdx)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#ef4444',
                                cursor: 'pointer',
                                padding: 2,
                              }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>
                        Optional: Attach DVLA papers, duty receipts, valuation, or invoices.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Bottom Sticky Submission Bar */}
          <div
            style={{
              position: 'sticky',
              bottom: 16,
              background: '#fff',
              border: '1.5px solid #e2e8f0',
              borderRadius: 20,
              padding: '16px 24px',
              boxShadow: '0 10px 30px -5px rgba(0,0,0,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16,
              zIndex: 30,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 800, fontSize: 16, color: '#0f172a' }}>
                  {vehicles.length} Vehicle{vehicles.length > 1 ? 's' : ''} in Batch
                </span>
                {totalValue > 0 && (
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: 6 }}>
                    Total: GH₵ {totalValue.toLocaleString()}
                  </span>
                )}
              </div>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: allValid ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                {allValid
                  ? 'All vehicles configured and ready for submission'
                  : 'Please complete Make, Model, Year, & Price for all cars'}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                type="button"
                onClick={handleAddVehicle}
                disabled={vehicles.length >= remainingSlots}
                style={{
                  background: '#f1f5f9',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: 12,
                  padding: '12px 16px',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: vehicles.length >= remainingSlots ? 'not-allowed' : 'pointer',
                  opacity: vehicles.length >= remainingSlots ? 0.5 : 1,
                }}
              >
                + Add Car
              </button>

              <button
                type="submit"
                disabled={!allValid || isSubmitting}
                style={{
                  background: '#0d1b3e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 12,
                  padding: '14px 24px',
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: allValid && !isSubmitting ? 'pointer' : 'not-allowed',
                  opacity: allValid && !isSubmitting ? 1 : 0.5,
                  boxShadow: '0 4px 12px rgba(13,27,62,0.25)',
                }}
              >
                {isSubmitting
                  ? 'Submitting vehicles…'
                  : `Submit ${vehicles.length} Vehicle${vehicles.length > 1 ? 's' : ''} for Verification`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
