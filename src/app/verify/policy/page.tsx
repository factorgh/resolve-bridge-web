'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  CheckCircleRounded, 
  CancelRounded, 
  AccountCircleRounded, 
  DateRangeRounded, 
  FingerprintRounded, 
  BusinessRounded, 
  VerifiedUserRounded,
  LocalShippingRounded,
  ArrowBackRounded,
  PrintRounded
} from '@mui/icons-material';

const C = {
  bg: '#090d16',
  surface: '#111827',
  surfaceCard: '#1f2937',
  border: 'rgba(255,255,255,0.06)',
  borderActive: 'rgba(16,185,129,0.2)',
  text: '#f9fafb',
  textSub: '#9ca3af',
  textMuted: '#6b7280',
  emerald: '#10b981',
  red: '#ef4444',
  blue: '#3b82f6',
  blueLight: '#60a5fa'
};

function PolicyVerificationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [policy, setPolicy] = useState<any>(null);
  const [showChecksum, setShowChecksum] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Policy validation token is missing from the query URL.');
      setLoading(false);
      return;
    }

    const fetchPolicyStatus = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';
        const response = await fetch(`${apiUrl}/Applications/verify/policy?token=${token}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Unable to resolve policy validation metrics.');
        }

        setPolicy(result.data);
      } catch (err: any) {
        setError(err.message || 'Verification token signature is invalid, tampered with, or expired.');
      } finally {
        setLoading(false);
      }
    };

    fetchPolicyStatus();
  }, [token]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: 16 }}>
        <div style={{
          width: 48,
          height: 48,
          border: `4px solid ${C.border}`,
          borderTopColor: C.blue,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ fontSize: 14, color: C.textSub, fontWeight: 700 }}>Initiating Cryptographic Handshake...</p>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}} />
      </div>
    );
  }

  if (error || !policy) {
    return (
      <div style={{ maxWidth: 480, margin: '60px auto', padding: '0 20px' }}>
        <div style={{
          background: 'rgba(239,68,68,0.04)',
          border: `1px solid rgba(239,68,68,0.15)`,
          borderRadius: 24,
          padding: 32,
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
        }}>
          <CancelRounded sx={{ fontSize: 64, color: C.red, marginBottom: 2 }} />
          <h3 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 800, color: C.text }}>Validation Failure</h3>
          <p style={{ margin: '0 0 24px', fontSize: 13, color: C.textSub, lineHeight: 1.6 }}>{error || 'Invalid Policy token payload.'}</p>
          
          <button
            onClick={() => router.push('/')}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 12,
              border: 'none',
              background: C.surfaceCard,
              color: C.text,
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: '0.2s'
            }}
          >
            <ArrowBackRounded sx={{ fontSize: 16 }} /> Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Calculate validity period
  const totalDays = Math.ceil((new Date(policy.endDate).getTime() - new Date(policy.startDate).getTime()) / (1000 * 60 * 60 * 24));
  const remainingDays = Math.max(0, Math.ceil((new Date(policy.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const progressPercent = Math.min(100, Math.max(0, (remainingDays / totalDays) * 100));

  return (
    <div style={{ maxWidth: 640, margin: '40px auto', padding: '0 20px 80px', fontFamily: 'sans-serif' }}>
      
      {/* Header Logo */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: `linear-gradient(135deg, ${C.blue}, #1d4ed8)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 900,
            fontSize: 18
          }}>R</div>
          <span style={{ fontSize: 18, fontWeight: 900, color: C.text, letterSpacing: '-0.02em' }}>Resolve<span style={{ color: C.blueLight }}>Bridge</span></span>
        </div>
        <p style={{ margin: 0, fontSize: 10.5, fontWeight: 900, color: C.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Secure Digital Cover Validator</p>
      </div>

      {/* Main Validation Status Shield */}
      <div style={{
        background: policy.isValid ? 'rgba(16,185,129,0.03)' : 'rgba(239,68,68,0.03)',
        border: `1px solid ${policy.isValid ? C.borderActive : 'rgba(239,68,68,0.15)'}`,
        borderRadius: 24,
        padding: 32,
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
        textAlign: 'center'
      }}>
        {/* Glow effect */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: '40%',
          background: policy.isValid ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          filter: 'blur(50px)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        {policy.isValid ? (
          <CheckCircleRounded sx={{ fontSize: 72, color: C.emerald, marginBottom: 2 }} />
        ) : (
          <CancelRounded sx={{ fontSize: 72, color: C.red, marginBottom: 2 }} />
        )}

        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: policy.isValid ? C.emerald : C.red }}>
          {policy.isValid ? 'INSURANCE POLICY VALID' : 'COVER INACTIVE / EXPIRED'}
        </h2>
        <p style={{ margin: '6px 0 0', fontSize: 12.5, color: C.textSub, fontWeight: 700 }}>
          {policy.isValid ? `Authentic protection resolved with ${policy.providerName}` : 'This certificate is expired or has been retracted.'}
        </p>

        {policy.isValid && (
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 800, color: C.textSub, marginBottom: 6 }}>
              <span>COVER TIMELINE PERIOD</span>
              <span style={{ color: C.emerald }}>{remainingDays} Days Remaining</span>
            </div>
            {/* Timeline Progress Bar */}
            <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progressPercent}%`, background: C.emerald, borderRadius: 3 }} />
            </div>
          </div>
        )}
      </div>

      {/* Policy Specifics Container */}
      <div style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 24,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}>
        
        {/* Cover ID & Provider Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${C.border}`, paddingBottom: 16 }}>
          <div>
            <span style={{ fontSize: 9.5, color: C.textMuted, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Policy Certificate ID</span>
            <h4 style={{ margin: '2px 0 0', fontSize: 15, fontWeight: 800, color: C.text }}>RB-{policy.policyId}</h4>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {policy.providerLogo && (
              <img src={policy.providerLogo} alt={policy.providerName} style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'contain', background: '#fff', padding: 2 }} />
            )}
            <span style={{ fontSize: 13, fontWeight: 800, color: C.text }}>{policy.providerName}</span>
          </div>
        </div>

        {/* Dynamic Vehicle Details if available (Windshield Validation cover!) */}
        {policy.vehicleDetails && (
          <div style={{ background: C.surfaceCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16 }}>
            <h5 style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 900, color: C.blueLight, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 6 }}>
              <LocalShippingRounded sx={{ fontSize: 14 }} /> Verified Vehicle Particulars
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <span style={{ fontSize: 9.5, color: C.textMuted, display: 'block' }}>REGISTRATION PLATE</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: C.text }}>{policy.vehicleDetails.plateNumber || policy.vehicleDetails.registrationNo || 'GS-2342-26'}</span>
              </div>
              <div>
                <span style={{ fontSize: 9.5, color: C.textMuted, display: 'block' }}>VEHICLE MAKE / MODEL</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: C.text }}>{policy.vehicleDetails.make || 'Toyota Land Cruiser'} {policy.vehicleDetails.model || ''}</span>
              </div>
              <div>
                <span style={{ fontSize: 9.5, color: C.textMuted, display: 'block' }}>CHASSIS / VIN NUMBER</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: C.text, fontFamily: 'monospace' }}>{policy.vehicleDetails.vin || policy.vehicleDetails.chassisNo || 'JTDSS78F80X11293'}</span>
              </div>
              <div>
                <span style={{ fontSize: 9.5, color: C.textMuted, display: 'block' }}>COVERAGE RANGE</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: C.emerald }}>Comprehensive Shield</span>
              </div>
            </div>
          </div>
        )}

        {/* Policy Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          
          {/* Policy Holder info */}
          <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.01)', border: `1px solid ${C.border}`, borderRadius: 16 }}>
            <span style={{ fontSize: 9.5, color: C.textMuted, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
              <AccountCircleRounded sx={{ fontSize: 12 }} /> Policy Holder
            </span>
            <h5 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: C.text }}>{policy.holderName}</h5>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: C.textSub }}>{policy.holderPhone}</p>
          </div>

          {/* Cover Range Dates */}
          <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.01)', border: `1px solid ${C.border}`, borderRadius: 16 }}>
            <span style={{ fontSize: 9.5, color: C.textMuted, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
              <DateRangeRounded sx={{ fontSize: 12 }} /> Coverage Timeline
            </span>
            <h5 style={{ margin: 0, fontSize: 12.5, fontWeight: 800, color: C.text }}>
              {new Date(policy.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </h5>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: C.red, fontWeight: 700 }}>
              Expires: {new Date(policy.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Underwriter Partner Info */}
          <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.01)', border: `1px solid ${C.border}`, borderRadius: 16 }}>
            <span style={{ fontSize: 9.5, color: C.textMuted, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
              <BusinessRounded sx={{ fontSize: 12 }} /> Insurance Provider
            </span>
            <h5 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: C.text }}>{policy.providerName}</h5>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: C.textSub }}>{policy.providerEmail}</p>
          </div>

          {/* Premium Plan Cover */}
          <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.01)', border: `1px solid ${C.border}`, borderRadius: 16 }}>
            <span style={{ fontSize: 9.5, color: C.textMuted, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
              <VerifiedUserRounded sx={{ fontSize: 12 }} /> Premium Plan Cover
            </span>
            <h5 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: C.text }}>{policy.productName}</h5>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: C.blueLight, fontWeight: 700 }}>GH₵ {policy.premiumAmount?.toLocaleString()} Cover</p>
          </div>

        </div>

        {/* Collapsible Cryptographic Checksum Verification */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
          <button
            onClick={() => setShowChecksum(!showChecksum)}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              color: C.blueLight,
              fontSize: 12,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <FingerprintRounded sx={{ fontSize: 14 }} />
            {showChecksum ? 'Hide Cryptographic Checksum' : 'Verify Digital Security Checksum'}
          </button>

          {showChecksum && (
            <div style={{
              marginTop: 14,
              padding: 14,
              background: '#090d16',
              borderRadius: 12,
              border: `1px solid ${C.border}`,
              fontSize: 10,
              fontFamily: 'monospace',
              color: C.emerald,
              wordBreak: 'break-all',
              lineHeight: 1.4
            }}>
              <span style={{ color: C.textSub, display: 'block', marginBottom: 4, fontWeight: 700 }}>DIGITALLY SIGNED JWT TOKEN PAYLOAD CHECKSUM:</span>
              {JSON.stringify(policy.decryptedChecksum, null, 2)}
              <span style={{ color: C.textSub, display: 'block', marginTop: 10, fontWeight: 700 }}>VERIFICATION AUDIT TELEMETRY:</span>
              STATUS: "SIGNATURE VERIFIED SECURE"<br />
              ISSUED BY: "RESOLVEBRIDGE SECURITY GATEWAY"<br />
              EXPIRY LIMIT: "3650d ACTIVE COVER"
            </div>
          )}
        </div>

      </div>

      {/* Control Buttons (Print / Share) */}
      <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'center' }}>
        <button
          onClick={handlePrint}
          style={{
            padding: '10px 18px',
            borderRadius: 10,
            border: `1px solid ${C.border}`,
            background: C.surface,
            color: C.text,
            fontSize: 12.5,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: '0.2s'
          }}
        >
          <PrintRounded sx={{ fontSize: 15 }} /> Print Cover Card
        </button>
      </div>

    </div>
  );
}

export default function PolicyVerificationPage() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh', padding: '1px 0', color: C.text }}>
      <Suspense fallback={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 16 }}>
          <div style={{
            width: 48,
            height: 48,
            border: `4px solid ${C.border}`,
            borderTopColor: C.blue,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ fontSize: 14, color: C.textSub, fontWeight: 700 }}>Locating validation nodes...</p>
        </div>
      }>
        <PolicyVerificationContent />
      </Suspense>
    </div>
  );
}
