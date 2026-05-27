'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  CreditCardRounded, 
  SmartphoneRounded, 
  HistoryRounded, 
  CheckCircleOutlineRounded,
  CloseRounded
} from '@mui/icons-material';
import PortalShell, { C, F } from '../components/PortalShell';
import { useGetMeQuery, usePaySubscriptionMutation } from '@/lib/redux/api/userApi';
import { useGetTransactionsQuery } from '@/lib/redux/api/transactionApi';

export default function CustomerBillingPage() {
  const [mounted, setMounted] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);

  const { data: userData, refetch: refetchUser } = useGetMeQuery();
  const { data: txData, refetch: refetchTx } = useGetTransactionsQuery();
  const [paySubscription, { isLoading: isPaying }] = usePaySubscriptionMutation();

  const user = userData?.data;
  const transactions = txData?.data || [];

  // Filter subscription-specific transactions
  const subscriptionTxs = transactions.filter((t: any) => 
    t.category === 'Subscription' || t.desc?.toLowerCase().includes('subscription') || t.description?.toLowerCase().includes('subscription')
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handlePaySubscription = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("Initiating subscription payment via Paystack...");
      const res = await paySubscription({} as any).unwrap();
      console.log("PAY SUBSCRIPTION RAW RESPONSE:", res);

      const isSuccess = res.success || res.statusCode === 200 || res.status === 200 || res.status === 'success';
      const url = res.data?.authorizationUrl || res.authorizationUrl || (res.data && res.data.data?.authorizationUrl);

      if (isSuccess && url) {
        toast.success('Redirecting to Paystack secure checkout...');
        setShowPayModal(false);
        // Automatically redirect to Paystack
        setTimeout(() => {
          window.location.href = url;
        }, 1000);
      } else {
        toast.error(res.message || 'Payment initiation failed');
      }
    } catch (err: any) {
      console.error("PAYSTACK SUBSCRIPTION PAYMENT ERROR DETECTED:", err);
      toast.error(err.data?.message || err.message || (err.data && JSON.stringify(err.data)) || JSON.stringify(err) || 'Error executing Paystack subscription payment');
    }
  };

  const nextRenewalDate = user?.nextSubscriptionDate 
    ? new Date(user.nextSubscriptionDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

  return (
    <PortalShell title="Billing & Subscriptions" backHref="/portal">
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 40 }}>
        
        {/* Header Block */}
        <div>
          <h1 style={{ margin: 0, fontSize: 36, fontWeight: 300, color: C.text, fontFamily: F.serif }}>
            Billing Console & Account Shield
          </h1>
          <p style={{ margin: '8px 0 0', fontSize: 13, color: C.textSub }}>
            Settle your platform monthly access dues, manage payment profiles, and audit subscription history ledger logs.
          </p>
        </div>

        {/* Dynamic Billing Dashboard metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'stretch' }}>
          
          {/* Active Plan Card */}
          <motion.div 
            whileHover={{ y: -4 }}
            style={{ 
              background: '#fff', borderRadius: 28, border: `1px solid ${C.border}`,
              boxShadow: '0 4px 25px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', overflow: 'hidden'
            }}
          >
            <div style={{ padding: 32, background: `linear-gradient(135deg, ${C.blue} 0%, ${C.blueLight} 100%)`, color: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: 10, fontWeight: 900, background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: 20, letterSpacing: '0.04em' }}>ACTIVE PROFILE</span>
                <span style={{ fontSize: 16 }}>🛡️</span>
              </div>
              <h3 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 800, fontFamily: F.heading }}>Resolve Platform Access</h3>
              <p style={{ margin: 0, fontSize: 12.5, opacity: 0.8 }}>Automated underwriting and dynamic credit scoring access.</p>
            </div>
            <div style={{ padding: 32, display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'space-between', gap: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: C.textSub }}>Platform Fee:</span>
                  <span style={{ fontWeight: 800, color: C.text }}>GH₵ 20.00 / Month</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: C.textSub }}>Dues Status:</span>
                  <span style={{ fontWeight: 800, color: user?.subscriptionFeePaid !== false ? C.emerald : C.red }}>
                    {user?.subscriptionFeePaid !== false ? '✓ Paid & Secured' : '⚠️ Past Due'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: C.textSub }}>Next Charge Date:</span>
                  <span style={{ fontWeight: 800, color: C.text }}>{nextRenewalDate}</span>
                </div>
              </div>

              {user?.subscriptionFeePaid === false && (
                <button
                  onClick={() => setShowPayModal(true)}
                  style={{
                    width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: C.red,
                    color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 12px rgba(239,68,68,0.2)'
                  }}
                >
                  Pay Outstanding Platform Fee
                </button>
              )}
            </div>
          </motion.div>

          {/* Quick Info & MoMo Payment Console */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* Quick Settle MoMo Card */}
            <div style={{ background: '#fff', borderRadius: 28, border: `1px solid ${C.border}`, padding: 32, flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <SmartphoneRounded sx={{ color: C.blueLight, fontSize: 20 }} />
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: C.text, fontFamily: F.heading }}>Express MoMo Payment</h4>
              </div>
              <p style={{ margin: 0, fontSize: 12.5, color: C.textSub, lineHeight: 1.5 }}>
                Manually dispatch a platform subscription settlement fee directly to lock in another 30 days of seamless institutional financing services.
              </p>
              
              <button
                onClick={() => setShowPayModal(true)}
                style={{
                  marginTop: 'auto', width: '100%', padding: '14px', borderRadius: 12, border: `1.5px solid ${C.borderStrong}`,
                  background: C.bg, color: C.text, fontWeight: 800, fontSize: 13, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                }}
              >
                Settle Monthly Access dues (GH₵ 20)
              </button>
            </div>
          </div>
        </div>

        {/* Subscription Transaction Ledger History */}
        <div style={{ background: '#fff', borderRadius: 28, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          <div style={{ padding: 32, borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <HistoryRounded sx={{ color: C.textSub, fontSize: 20 }} />
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: C.text, fontFamily: F.heading }}>Billing & Subscription Ledger</h3>
            </div>
            <p style={{ margin: 0, fontSize: 12.5, color: C.textSub }}>Detailed log history of all platform subscription access disbursements.</p>
          </div>

          {subscriptionTxs.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center' }}>
              <CheckCircleOutlineRounded sx={{ fontSize: 44, color: C.textMuted, marginBottom: 2 }} />
              <h4 style={{ margin: 0, fontSize: 14, color: C.text, fontWeight: 700 }}>No Platform Invoices Paid</h4>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: C.textMuted }}>Settle your first platform subscription payment above to log ledger audits.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}`, background: 'rgba(0,0,0,0.01)' }}>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Reference</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Invoice details</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Paid Amount</th>
                    <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', textAlign: 'right' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptionTxs.map((tx: any) => (
                    <tr key={tx._id || tx.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ padding: '18px 24px' }}>
                        <span style={{ fontSize: 12.5, fontFamily: 'monospace', fontWeight: 700, color: C.blue }}>
                          {tx.reference || tx._id?.substring(0, 8).toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '18px 24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{tx.desc || tx.description}</span>
                          <span style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>
                            Paid date: {new Date(tx.date || tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '18px 24px' }}>
                        <span style={{ fontSize: 13.5, fontWeight: 800, color: C.text }}>
                          GH₵ {Math.abs(tx.amount || 20).toLocaleString()}.00
                        </span>
                      </td>
                      <td style={{ padding: '18px 24px', textAlign: 'right' }}>
                        <span style={{ fontSize: 9.5, fontWeight: 900, background: C.emeraldPale, color: C.emerald, padding: '4px 8px', borderRadius: 4, textTransform: 'uppercase' }}>
                          {tx.status || 'Completed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Paystack Payment Confirmation Dialog Modal */}
      <AnimatePresence>
        {showPayModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isPaying && setShowPayModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(13,27,62,0.4)', backdropFilter: 'blur(8px)' }} />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 16 }}
              style={{ position: 'relative', width: '100%', maxWidth: 420, background: '#fff', borderRadius: 28, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.15)', border: `1.5px solid ${C.border}` }}
            >
              <div style={{ padding: 36 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h3 style={{ margin: 0, fontSize: 18, color: C.text, fontWeight: 900, fontFamily: F.heading }}>Paystack Secure Payment</h3>
                  <button onClick={() => !isPaying && setShowPayModal(false)} style={{ background: '#f1f5f9', border: 'none', width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', fontWeight: 900 }}>✕</button>
                </div>

                <form onSubmit={handlePaySubscription} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(32,81,229,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 24 }}>💳</span>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 800, color: C.text }}>Platform Monthly Access Dues</span>
                    <p style={{ margin: 0, fontSize: 12.5, color: C.textSub, lineHeight: 1.5 }}>
                      You are subscribing to Resolve Platform Access. This will open Paystack's secure portal where you can pay with **Mobile Money** or **Bank Cards**.
                    </p>
                  </div>

                  <div style={{ background: '#f8fafc', padding: 16, borderRadius: 16, border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: C.textSub }}>Platform Fee:</span>
                      <span style={{ fontWeight: 800, color: C.text }}>GH₵ 20.00 / month</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
                      <span style={{ color: C.textSub }}>Due Immediately:</span>
                      <span style={{ fontWeight: 900, color: C.blue }}>GH₵ 20.00</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPaying}
                    style={{
                      width: '100%', padding: '16px', borderRadius: 16, border: 'none', 
                      background: `linear-gradient(135deg, ${C.blue} 0%, ${C.blueLight} 100%)`, 
                      color: '#fff', fontWeight: 900, fontSize: 13.5, cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(32,81,229,0.2)', transition: '0.2s', marginTop: 8
                    }}
                  >
                    {isPaying ? 'Connecting to Paystack...' : 'Proceed to Paystack Checkout'}
                  </button>

                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </PortalShell>
  );
}
