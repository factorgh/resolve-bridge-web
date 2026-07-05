'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Drawer, IconButton } from '@mui/material';
import { 
  useAdminGetApplicationsQuery, 
  useAdminReviewApplicationMutation 
} from '@/lib/redux/api/applicationApi';
import { 
  useGetTransactionsQuery, 
  useCreateTransactionMutation 
} from '@/lib/redux/api/transactionApi';
import AdminShell, { C, F } from '../components/AdminShell';
import { 
  StorefrontRounded,
  CloseRounded,
  SecurityRounded,
  LocalShippingRounded,
  AddShoppingCartRounded,
  InventoryRounded,
  CheckCircleRounded,
  HourglassEmptyRounded,
  ReceiptLongRounded,
  BoltRounded,
  LocalAtmRounded,
  AssessmentRounded
} from '@mui/icons-material';

export default function MerchantConsolePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'payouts'>('orders');

  // Manual shipment registration drawer
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [carrierName, setCarrierName] = useState('FedEx Ghana / MoMo Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isShipmentLoading, setIsShipmentLoading] = useState(false);

  // RTK Queries & Mutations
  const { data: appsResponse, isLoading: appsLoading, refetch: refetchApps } = useAdminGetApplicationsQuery(undefined);
  const { data: txResponse, isLoading: txLoading, refetch: refetchTx } = useGetTransactionsQuery(undefined);
  
  const [reviewApplication] = useAdminReviewApplicationMutation();
  const [createTransaction] = useCreateTransactionMutation();

  useEffect(() => {
    setMounted(true);
    const stored = sessionStorage.getItem('rb_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  if (!mounted) return null;

  const rawApplications = appsResponse?.data || [];
  const rawTransactions = txResponse?.data?.items || [];

  // Scoped Tenant filter
  const myInstitutionId = user?.institutionId;
  const isSuperAdmin = user?.role === 'SuperAdmin' || user?.role === 'Admin';

  const myApplications = rawApplications.filter((app: any) => {
    if (isSuperAdmin) return true;
    const prod = app.productId;
    return prod && prod.institutionId && prod.institutionId._id === myInstitutionId;
  });

  // Filter ONLY BNPL products/applications
  const myBNPLApps = myApplications.filter((a: any) => {
    const prod = a.productId;
    return prod && (prod.productType === 'BNPL' || prod.name?.toLowerCase().includes('bnpl') || prod.name?.toLowerCase().includes('install'));
  });

  // Approved Awaiting Shipping vs Active Flipped Orders
  const approvedOrders = myBNPLApps.filter((a: any) => a.status === 'Approved');
  const activeOrders = myBNPLApps.filter((a: any) => a.status === 'Disbursed' || a.status === 'Completed');

  // Fulfill and Ship Order
  const handleFulfillOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsShipmentLoading(true);

    try {
      // Step 1: Transition status to "Disbursed" (shipped and flipped to active installment)
      const res = await reviewApplication({ id: selectedOrder._id, status: 'Disbursed' }).unwrap();
      
      if (res.success) {
        // Step 2: Log merchant payout on the double-entry ledger (+amount minus 10% downpayment)
        const payoutVal = selectedOrder.amount * 0.9;
        
        await createTransaction({
          userId: selectedOrder.userId?._id || 'SYSTEM',
          applicationId: selectedOrder._id,
          institutionId: selectedOrder.productId.institutionId?._id || myInstitutionId,
          description: `BNPL Merchant Settlement: ${selectedOrder.productId?.name} Fulfill`,
          amount: payoutVal,
          type: 'credit', // Credit transfer to merchant
          category: 'BNPL',
          status: 'Completed'
        }).unwrap();

        toast.success(`Order fulfilled! Shipment whitelisted. GHS ${payoutVal.toLocaleString()} payout logged on the double-entry ledger!`);
        setSelectedOrder(null);
        setTrackingNumber('');
        refetchApps();
        refetchTx();
      } else {
        toast.error(res.message || 'Fulfillment request failed');
      }
    } catch (err: any) {
      toast.error(err.data?.message || 'Error executing order shipment');
    } finally {
      setIsShipmentLoading(false);
    }
  };

  // Metrics calculations
  const totalVolume = activeOrders.reduce((sum: number, a: any) => sum + (a.amount || 0), 0);
  const totalMerchantPayouts = rawTransactions
    .filter((tx: any) => tx.category === 'BNPL' && tx.type === 'credit')
    .reduce((sum: number, tx: any) => sum + Math.abs(tx.amount || 0), 0);

  return (
    <AdminShell>
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        
        {/* Upper Dashboard Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 300, color: C.text, fontFamily: F.serif }}>
              BNPL Merchant & Fulfillment Center
            </h1>
            <p style={{ margin: '8px 0 0', fontSize: 13, color: C.textSub }}>
              Fulfill approved customer orders, dispatch carrier shipments, and audit merchant payout settlements.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {['orders', 'payouts'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                style={{
                  background: activeTab === tab ? C.bluePale : C.surface,
                  color: activeTab === tab ? C.blueLight : C.textSub,
                  border: `1px solid ${activeTab === tab ? C.blue + '30' : C.border}`,
                  borderRadius: 10, padding: '10px 18px', fontSize: 12.5, fontWeight: 700,
                  cursor: 'pointer', transition: '0.2s'
                }}
              >
                {tab === 'orders' ? 'BNPL Orders' : 'Merchant Payouts'}
              </button>
            ))}
          </div>
        </div>

        {/* Live Merchant Telemetry */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 40 }}>
          
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Gross Flipped Volume</span>
              <div style={{ color: C.blueLight }}><StorefrontRounded sx={{ fontSize: 18 }} /></div>
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 400, color: C.text }}>GH₵ {totalVolume.toLocaleString()}</h3>
            <span style={{ fontSize: 11, color: C.textMuted }}>Total checkout finance sizes</span>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Fulfillments Awaiting Ship</span>
              <div style={{ color: C.amber }}><HourglassEmptyRounded sx={{ fontSize: 18 }} /></div>
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 400, color: C.text }}>{approvedOrders.length} Orders</h3>
            <span style={{ fontSize: 11, color: C.textMuted }}>Approved checkout loans ready to fly</span>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Settled Merchant Payouts</span>
              <div style={{ color: C.emerald }}><LocalAtmRounded sx={{ fontSize: 18 }} /></div>
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 400, color: C.text }}>GH₵ {totalMerchantPayouts.toLocaleString()}</h3>
            <span style={{ fontSize: 11, color: C.textMuted }}>Received capital from partner banks</span>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Shipment Dispatch Index</span>
              <div style={{ color: C.purple }}><AssessmentRounded sx={{ fontSize: 18 }} /></div>
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 400, color: C.text }}>
              {activeOrders.length + approvedOrders.length > 0 ? ((activeOrders.length / (activeOrders.length + approvedOrders.length)) * 100).toFixed(0) : 100}%
            </h3>
            <span style={{ fontSize: 11, color: C.textMuted }}>Fulfillment conversion metric</span>
          </div>

        </div>

        {/* Tab 1: BNPL Orders and Shipment pipelines */}
        <AnimatePresence mode="wait">
          {activeTab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              
              {/* Order pipeline awaiting fulfillment */}
              {approvedOrders.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ background: 'rgba(59, 130, 246, 0.02)', border: `1px dashed ${C.blue}40`, borderRadius: 24, overflow: 'hidden' }}
                >
                  <div style={{ padding: '20px 24px', borderBottom: `1px dashed ${C.blue}40`, background: `${C.bluePale}40` }}>
                    <h3 style={{ margin: 0, fontSize: 15, color: C.blueLight, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <AddShoppingCartRounded /> Approved Checkout Orders - Awaiting Shipping
                    </h3>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <tbody>
                      {approvedOrders.map((ord: any) => (
                        <tr key={ord._id} style={{ borderBottom: `1px solid ${C.border}` }}>
                          <td style={{ padding: '16px 24px' }}>
                            <span style={{ fontSize: 13.5, fontWeight: 700, color: C.text }}>{ord.userId?.firstName} {ord.userId?.lastName}</span>
                            <span style={{ fontSize: 11, color: C.textMuted, marginLeft: 12 }}>{ord.productId?.name}</span>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                            <span style={{ fontSize: 13, color: C.textSub }}>Price: GHS {ord.amount?.toLocaleString()}</span>
                          </td>
                          <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                            <button
                              onClick={() => {
                                setSelectedOrder(ord);
                                setTrackingNumber(`TRK-${Math.floor(100000 + Math.random() * 900000)}`);
                              }}
                              style={{
                                background: C.blue, color: '#fff', border: 'none', borderRadius: 8,
                                padding: '6px 12px', fontSize: 11.5, fontWeight: 800, cursor: 'pointer'
                              }}
                            >
                              Dispatch Carrier & Ship
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}

              {/* Flipped active order schedules */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, overflow: 'hidden' }}
              >
                <div style={{ padding: 24, borderBottom: `1px solid ${C.border}` }}>
                  <h3 style={{ margin: 0, fontSize: 16, color: C.text, fontFamily: F.heading }}>Flipped Installment Orders</h3>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: C.textMuted }}>Shipped goods currently generating monthly installment portfolios.</p>
                </div>

                {appsLoading ? (
                  <div style={{ padding: 60, textAlign: 'center', color: C.textSub }}>Querying fulfillments...</div>
                ) : activeOrders.length === 0 ? (
                  <div style={{ padding: 80, textAlign: 'center' }}>
                    <InventoryRounded sx={{ fontSize: 48, color: C.textMuted, marginBottom: 2 }} />
                    <h4 style={{ margin: 0, fontSize: 15, color: C.text, fontWeight: 700 }}>Orders Register Clear</h4>
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: C.textMuted }}>No BNPL products are dispatched or flipped under your merchant profile.</p>
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.01)' }}>
                        <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Insured Customer</th>
                        <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Flipped Goods</th>
                        <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Finance Limit</th>
                        <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Order Status</th>
                        <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', textAlign: 'right' }}>Fulfill Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeOrders.map((ord: any) => (
                        <tr key={ord._id} style={{ borderBottom: `1px solid ${C.border}` }}>
                          <td style={{ padding: '20px 24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{ord.userId?.firstName} {ord.userId?.lastName}</span>
                              <span style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{ord.userId?.email}</span>
                            </div>
                          </td>
                          <td style={{ padding: '20px 24px' }}>
                            <span style={{ fontSize: 13, color: C.textSub }}>{ord.productId?.name}</span>
                          </td>
                          <td style={{ padding: '20px 24px' }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>GH₵ {ord.amount?.toLocaleString()}</span>
                            <span style={{ fontSize: 10, color: C.textMuted, marginLeft: 4 }}>({ord.tenureMonths}m)</span>
                          </td>
                          <td style={{ padding: '20px 24px' }}>
                            <span style={{
                              fontSize: 10, fontWeight: 800,
                              background: ord.status === 'Completed' ? C.emeraldPale : C.bluePale,
                              color: ord.status === 'Completed' ? C.emerald : C.blueLight,
                              padding: '4px 8px', borderRadius: 4
                            }}>
                              {ord.status === 'Completed' ? '✓ SETTLED' : 'DISPATCHED'}
                            </span>
                          </td>
                          <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                            <span style={{ fontSize: 12.5, color: C.textSub }}>{new Date(ord.submittedAt).toLocaleDateString()}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </motion.div>
            </div>
          )}

          {/* Tab 2: Merchant Payout Ledger */}
          {activeTab === 'payouts' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, overflow: 'hidden' }}
            >
              <div style={{ padding: 24, borderBottom: `1px solid ${C.border}` }}>
                <h3 style={{ margin: 0, fontSize: 16, color: C.text, fontFamily: F.heading }}>Merchant Payout Settlement Registry</h3>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: C.textMuted }}>Audit incoming credit settlements transferred to your bank accounts for BNPL fulfillment.</p>
              </div>

              {txLoading ? (
                <div style={{ padding: 60, textAlign: 'center', color: C.textSub }}>Syncing payouts...</div>
              ) : rawTransactions.filter((t: any) => t.category === 'BNPL' && t.type === 'credit').length === 0 ? (
                <div style={{ padding: 80, textAlign: 'center' }}>
                  <ReceiptLongRounded sx={{ fontSize: 48, color: C.textMuted, marginBottom: 2 }} />
                  <h4 style={{ margin: 0, fontSize: 15, color: C.text, fontWeight: 700 }}>Payout Ledger Empty</h4>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: C.textMuted }}>No merchant payout bank logs have been initiated yet.</p>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${C.border}`, background: 'rgba(255,255,255,0.01)' }}>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Payout Reference</th>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Flipped Item</th>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Payout Settled</th>
                      <th style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase' }}>Ledger Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rawTransactions
                      .filter((t: any) => t.category === 'BNPL' && t.type === 'credit')
                      .map((tx: any) => (
                        <tr key={tx.id || tx._id} style={{ borderBottom: `1px solid ${C.border}` }}>
                          <td style={{ padding: '20px 24px' }}>
                            <span style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 700, color: C.blueLight }}>
                              {tx.reference || tx._id?.substring(0, 8).toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '20px 24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: 13.5, color: C.text }}>{tx.desc || tx.description}</span>
                              <span style={{ fontSize: 10, color: C.textMuted, marginTop: 4 }}>Logged date: {tx.date || new Date(tx.createdAt).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td style={{ padding: '20px 24px' }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: C.emerald }}>
                              +GHS {Math.abs(tx.amount || 0).toLocaleString()}
                            </span>
                          </td>
                          <td style={{ padding: '20px 24px' }}>
                            <span style={{
                              fontSize: 10.5, fontWeight: 800,
                              background: C.emeraldPale, color: C.emerald,
                              padding: '4px 8px', borderRadius: 4
                            }}>
                              {tx.status || 'Completed'}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Drawer: Process Order Shipment */}
        <Drawer
          anchor="right"
          open={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          PaperProps={{
            style: { width: '100%', maxWidth: 440, background: '#0a0d17', borderLeft: `1px solid ${C.border}`, padding: 32, boxSizing: 'border-box' }
          }}
        >
          {selectedOrder && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', color: '#fff' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                  <h3 style={{ margin: 0, fontSize: 18, color: C.text, fontFamily: F.heading, fontWeight: 700 }}>Dispatch Order</h3>
                  <IconButton onClick={() => setSelectedOrder(null)} style={{ color: C.textMuted }}><CloseRounded /></IconButton>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, marginBottom: 28, background: 'rgba(255,255,255,0.01)' }}>
                  <div>
                    <span style={{ fontSize: 10, color: C.textMuted, fontWeight: 800, textTransform: 'uppercase' }}>Recipient Customer</span>
                    <h4 style={{ margin: '4px 0 0', fontSize: 14.5, color: C.text }}>{selectedOrder.userId?.firstName} {selectedOrder.userId?.lastName}</h4>
                  </div>
                  <div>
                    <span style={{ fontSize: 10, color: C.textMuted, fontWeight: 800, textTransform: 'uppercase' }}>BNPL Product checkout</span>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: C.textSub }}>{selectedOrder.productId?.name}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: 10, color: C.textMuted, fontWeight: 800, textTransform: 'uppercase' }}>Down-payment Registered</span>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: C.emerald }}>GHS {(selectedOrder.amount * 0.1).toLocaleString()} (10% standard down-payment settled)</p>
                  </div>
                </div>

                <form onSubmit={handleFulfillOrder} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: C.textSub }}>LOG SHIPPING CARRIER</label>
                    <input
                      type="text"
                      value={carrierName}
                      onChange={(e) => setCarrierName(e.target.value)}
                      required
                      style={{ padding: '12px 14px', borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, color: C.text, outline: 'none', fontSize: 13 }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: C.textSub }}>TRACKING ID NUMBER</label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      required
                      style={{ padding: '12px 14px', borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, color: C.text, outline: 'none', fontSize: 13 }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isShipmentLoading}
                    style={{
                      width: '100%', padding: '14px', borderRadius: 10, background: C.blue, color: '#fff',
                      border: 'none', cursor: isShipmentLoading ? 'not-allowed' : 'pointer', fontSize: 13.5,
                      fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      marginTop: 12, transition: '0.2s'
                    }}
                  >
                    <LocalShippingRounded sx={{ fontSize: 18 }} /> {isShipmentLoading ? 'Shipping order...' : 'Dispatch and Settle Merchant'}
                  </button>
                </form>
              </div>

              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20, fontSize: 11.5, color: C.textMuted, display: 'flex', alignItems: 'center', gap: 8 }}>
                <SecurityRounded sx={{ fontSize: 14, color: C.emerald }} /> Shipments automatically register bank payouts under the double-entry bookkeeping ledgers.
              </div>
            </div>
          )}
        </Drawer>

      </div>
    </AdminShell>
  );
}
