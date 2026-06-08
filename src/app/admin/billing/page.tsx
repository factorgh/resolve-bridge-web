"use client";

import { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { Drawer, IconButton } from "@mui/material";
import AdminShell, { C, F } from "../components/AdminShell";
import {
  useGetInvoicesQuery,
  useGetInstitutionsBillingQuery,
  useGetFeePlansQuery,
  useCreateFeePlanMutation,
  useUpdateFeePlanMutation,
  useDeleteFeePlanMutation,
  useApplyFeePlanToInstitutionMutation,
  useUpdateSubscriptionFeeMutation,
  useCreateInvoiceMutation,
  usePayInvoiceMutation,
  useInitializeInvoicePaymentMutation,
  useTriggerBillingRunMutation,
} from "@/lib/redux/api/billingApi";
import { useGetInstitutionsQuery } from "@/lib/redux/api/productApi";
import {
  CloseRounded,
  AccountBalanceRounded,
  MonetizationOnRounded,
  TrendingUpRounded,
  ReceiptLongRounded,
  BoltRounded,
  EditRounded,
  CheckCircleOutlineRounded,
  AddCardRounded,
  CreditCardRounded,
  VpnKeyRounded,
  HourglassEmptyRounded,
  LocalAtmRounded,
  SecurityRounded,
  SwapHorizRounded,
  WarningRounded,
} from "@mui/icons-material";

export default function AdminBillingPage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"tenants" | "invoices" | "plans">(
    "tenants",
  );
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState<any>(null); // For manual invoices
  const [showPlanDrawer, setShowPlanDrawer] = useState(false);
  const [showApplyPlanDrawer, setShowApplyPlanDrawer] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedPlanToApply, setSelectedPlanToApply] = useState<any>(null);
  const [applyPlanTenantId, setApplyPlanTenantId] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);

  // Form states for edits
  const [newFee, setNewFee] = useState<number>(0);
  const [newCycle, setNewCycle] = useState<"monthly" | "annually">("monthly");
  const [newStatus, setNewStatus] = useState<string>("Active");

  // Fee plan form state
  const [planName, setPlanName] = useState("");
  const [planDescription, setPlanDescription] = useState("");
  const [planAmount, setPlanAmount] = useState<number>(0);
  const [planCurrency, setPlanCurrency] = useState("GHS");
  const [planBillingCycle, setPlanBillingCycle] = useState<
    "monthly" | "annually"
  >("monthly");
  const [planIsActive, setPlanIsActive] = useState(true);

  // Form states for manual invoice
  const [invoiceAmount, setInvoiceAmount] = useState<number>(0);
  const [invoiceDesc, setInvoiceDesc] = useState<string>("");


  // Redux triggers
  const {
    data: tenantsResponse,
    isLoading: tenantsLoading,
    refetch: refetchTenants,
  } = useGetInstitutionsBillingQuery(undefined, {
    skip: !user || (user.role !== "SuperAdmin" && user.role !== "Admin"),
  });
  const {
    data: invoicesResponse,
    isLoading: invoicesLoading,
    refetch: refetchInvoices,
  } = useGetInvoicesQuery();
  const {
    data: feePlansResponse,
    isLoading: feePlansLoading,
    refetch: refetchFeePlans,
  } = useGetFeePlansQuery(undefined, {
    skip: !user || (user.role !== "SuperAdmin" && user.role !== "Admin"),
  });
  const { data: instsResponse, refetch: refetchInsts } =
    useGetInstitutionsQuery();

  const [updateSubscription, { isLoading: isUpdatingSub }] =
    useUpdateSubscriptionFeeMutation();
  const [createInvoice, { isLoading: isCreatingInvoice }] =
    useCreateInvoiceMutation();
  const [payInvoice, { isLoading: isPaying }] = usePayInvoiceMutation();
  const [initializeInvoicePayment, { isLoading: isInitializingPayment }] =
    useInitializeInvoicePaymentMutation();
  const [triggerBillingRun, { isLoading: isRunningBilling }] =
    useTriggerBillingRunMutation();
  const [createFeePlan, { isLoading: isCreatingPlan }] =
    useCreateFeePlanMutation();
  const [updateFeePlan, { isLoading: isUpdatingPlan }] =
    useUpdateFeePlanMutation();
  const [deleteFeePlan, { isLoading: isDeletingPlan }] =
    useDeleteFeePlanMutation();
  const [applyFeePlan, { isLoading: isApplyingPlan }] =
    useApplyFeePlanToInstitutionMutation();

  useEffect(() => {
    setMounted(true);
    const stored = sessionStorage.getItem("rb_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);

    // Check payment callback status
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const payment = params.get("payment");
      if (payment === "success") {
        toast.success("Platform subscription invoice paid successfully!");
        window.history.replaceState({}, document.title, window.location.pathname);
        refetchInvoices();
        refetchInsts();
        refetchTenants();
      } else if (payment === "failed") {
        toast.error("Invoice payment failed or was cancelled.");
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!mounted) return null;

  const isPlatformAdmin = user?.role === "SuperAdmin" || user?.role === "Admin";
  const tenants = tenantsResponse?.data || [];
  const invoices = invoicesResponse?.data || [];
  const feePlans = feePlansResponse?.data || [];

  // Find partner's specific institution details
  const myInstitution = instsResponse?.data?.find(
    (i: any) => i._id === user?.institutionId,
  );

  // Metrics calculations (Dynamic based on role)
  let totalMRR = 0;
  let totalUnpaid = 0;
  let paidCount = 0;
  let totalInvoicesCount = 0;
  let settlementRatio = 100;

  if (isPlatformAdmin) {
    totalMRR = tenants
      .filter((t: any) => t.isActive && t.billingCycle === "monthly")
      .reduce((sum: number, t: any) => sum + (t.subscriptionFee || 0), 0);

    totalUnpaid = invoices
      .filter((i: any) => i.status === "Unpaid" || i.status === "Overdue")
      .reduce((sum: number, i: any) => sum + (i.amount || 0), 0);

    paidCount = invoices.filter((i: any) => i.status === "Paid").length;
    totalInvoicesCount = invoices.length;
    settlementRatio =
      totalInvoicesCount > 0
        ? Math.round((paidCount / totalInvoicesCount) * 100)
        : 100;
  } else {
    // Partner specific metrics
    totalMRR = myInstitution?.subscriptionFee || 0;
    totalUnpaid = invoices
      .filter((i: any) => i.status === "Unpaid" || i.status === "Overdue")
      .reduce((sum: number, i: any) => sum + (i.amount || 0), 0);

    paidCount = invoices.filter((i: any) => i.status === "Paid").length;
    totalInvoicesCount = invoices.length;
    settlementRatio =
      totalInvoicesCount > 0
        ? Math.round((paidCount / totalInvoicesCount) * 100)
        : 100;
  }

  const handleUpdateSubscription = async () => {
    if (!selectedTenant) return;
    try {
      const res = await updateSubscription({
        id: selectedTenant._id,
        subscriptionFee: newFee,
        billingCycle: newCycle,
        billingStatus: newStatus,
      }).unwrap();

      if (res.success) {
        toast.success("Tenant subscription settings updated");
        setSelectedTenant(null);
        refetchTenants();
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Error updating settings");
    }
  };

  const handleCreateManualInvoice = async () => {
    if (!showInvoiceModal) return;
    if (invoiceAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    try {
      const res = await createInvoice({
        institutionId: showInvoiceModal._id,
        amount: invoiceAmount,
        description: invoiceDesc || "Manual Platform Assessment Fee",
      }).unwrap();

      if (res.success) {
        toast.success("Custom invoice issued successfully");
        setShowInvoiceModal(null);
        setInvoiceAmount(0);
        setInvoiceDesc("");
        refetchInvoices();
        if (isPlatformAdmin) refetchTenants();
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Error creating invoice");
    }
  };

  const handlePayInvoice = async (invoiceId: string) => {
    try {
      const res = await payInvoice(invoiceId).unwrap();
      if (res.success) {
        toast.success("Invoice settled and logged on ledger");
        refetchInvoices();
        if (isPlatformAdmin) refetchTenants();
        refetchInsts();
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Payment log failed");
    }
  };

  const handleSaveFeePlan = async () => {
    try {
      if (selectedPlan) {
        const res = await updateFeePlan({
          id: selectedPlan._id,
          name: planName,
          description: planDescription,
          amount: planAmount,
          currency: planCurrency,
          billingCycle: planBillingCycle,
          isActive: planIsActive,
        }).unwrap();
        if (res.success) {
          toast.success("Fee plan updated successfully");
          setShowPlanDrawer(false);
          setSelectedPlan(null);
          setPlanName("");
          setPlanDescription("");
          setPlanAmount(0);
          setPlanCurrency("GHS");
          setPlanBillingCycle("monthly");
          setPlanIsActive(true);
          refetchFeePlans();
        }
      } else {
        const res = await createFeePlan({
          name: planName,
          description: planDescription,
          amount: planAmount,
          currency: planCurrency,
          billingCycle: planBillingCycle,
          isActive: planIsActive,
        }).unwrap();
        if (res.success) {
          toast.success("Fee plan created successfully");
          setShowPlanDrawer(false);
          setPlanName("");
          setPlanDescription("");
          setPlanAmount(0);
          setPlanCurrency("GHS");
          setPlanBillingCycle("monthly");
          setPlanIsActive(true);
          refetchFeePlans();
        }
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Error saving fee plan");
    }
  };

  const handleDeleteFeePlan = async (planId: string) => {
    try {
      const res = await deleteFeePlan(planId).unwrap();
      if (res.success) {
        toast.success("Fee plan deleted");
        if (selectedPlan?._id === planId) setSelectedPlan(null);
        refetchFeePlans();
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Error deleting fee plan");
    }
  };

  const handleOpenPlan = (plan: any) => {
    setSelectedPlan(plan);
    setPlanName(plan.name || "");
    setPlanDescription(plan.description || "");
    setPlanAmount(plan.amount || 0);
    setPlanCurrency(plan.currency || "GHS");
    setPlanBillingCycle(plan.billingCycle || "monthly");
    setPlanIsActive(plan.isActive ?? true);
    setShowPlanDrawer(true);
  };

  const handleCreatePlan = () => {
    setSelectedPlan(null);
    setPlanName("");
    setPlanDescription("");
    setPlanAmount(0);
    setPlanCurrency("GHS");
    setPlanBillingCycle("monthly");
    setPlanIsActive(true);
    setShowPlanDrawer(true);
  };

  const handleApplyPlan = async () => {
    if (!selectedPlanToApply || !applyPlanTenantId) {
      toast.error("Select a plan and tenant to apply");
      return;
    }
    try {
      const res = await applyFeePlan({
        planId: selectedPlanToApply._id,
        institutionId: applyPlanTenantId,
      }).unwrap();
      if (res.success) {
        toast.success("Fee plan applied successfully");
        setShowApplyPlanDrawer(false);
        setSelectedPlanToApply(null);
        setApplyPlanTenantId("");
        refetchTenants();
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Error applying fee plan");
    }
  };

  const handleSettleInvoice = async (invoiceId: string) => {
    try {
      toast.loading("Initializing payment transaction...", {
        id: "invoice-pay",
      });
      const res = await initializeInvoicePayment(invoiceId).unwrap();
      if (res.success && res.data?.authorizationUrl) {
        toast.success("Redirecting to Paystack checkout...", {
          id: "invoice-pay",
        });
        window.location.href = res.data.authorizationUrl;
      } else {
        toast.error(res.message || "Failed to initialize payment", {
          id: "invoice-pay",
        });
      }
    } catch (err: any) {
      toast.error(
        err.data?.message || "Error starting payment session with Paystack",
        { id: "invoice-pay" }
      );
    }
  };

  const handleTriggerRun = async () => {
    try {
      const res = await triggerBillingRun().unwrap();
      if (res.success) {
        toast.success(
          `Billing renewal run completed. ${res.data?.count} invoices processed!`,
        );
        refetchInvoices();
        refetchTenants();
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to trigger cycle renewals");
    }
  };

  return (
    <AdminShell>
      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        {/* Dynamic Title and actions */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            gap: isMobile ? 16 : 24,
            marginBottom: 36,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: isMobile ? 26 : 32,
                fontWeight: 300,
                color: C.text,
                fontFamily: F.serif,
              }}
            >
              {isPlatformAdmin
                ? "Ecosystem Revenue & Billing Console"
                : "Platform Subscription & Plan"}
            </h1>
            <p style={{ margin: "8px 0 0", fontSize: 13, color: C.textSub }}>
              {isPlatformAdmin
                ? "Track monthly platform subscription fees, issue direct invoices, and audit outstanding partner ledgers."
                : "View subscription levels, monitor upcoming billings, and securely settle monthly platform invoices."}
            </p>
          </div>

          {isPlatformAdmin && (
            <button
              onClick={handleTriggerRun}
              disabled={isRunningBilling}
              style={{
                background: C.blue,
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "12px 20px",
                fontSize: 12.5,
                fontWeight: 800,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "0.2s",
                width: isMobile ? "100%" : "auto",
                justifyContent: "center",
              }}
            >
              <BoltRounded sx={{ fontSize: 16 }} />{" "}
              {isRunningBilling ? "Billing..." : "Trigger Cycle Run"}
            </button>
          )}
        </div>

        {/* Dynamic Premium Metrics Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 20,
              padding: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  color: C.textSub,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {isPlatformAdmin
                  ? "Monthly Recurring (MRR)"
                  : "Subscription Plan Fee"}
              </span>
              <div style={{ color: C.emerald }}>
                <TrendingUpRounded sx={{ fontSize: 18 }} />
              </div>
            </div>
            <h3
              style={{
                margin: "0 0 4px",
                fontSize: 28,
                fontWeight: 400,
                color: C.text,
              }}
            >
              GH₵ {totalMRR.toLocaleString()}
            </h3>
            <span style={{ fontSize: 11, color: C.textMuted }}>
              {isPlatformAdmin
                ? "Contracted monthly ecosystem fees"
                : `Billed ${myInstitution?.billingCycle || "monthly"}`}
            </span>
          </div>

          <div
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 20,
              padding: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  color: C.textSub,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {isPlatformAdmin
                  ? "Total Outstanding Balance"
                  : "My Outstanding Platform Dues"}
              </span>
              <div style={{ color: totalUnpaid > 0 ? C.red : C.emerald }}>
                <ReceiptLongRounded sx={{ fontSize: 18 }} />
              </div>
            </div>
            <h3
              style={{
                margin: "0 0 4px",
                fontSize: 28,
                fontWeight: 400,
                color: totalUnpaid > 0 ? C.red : C.text,
              }}
            >
              GH₵ {totalUnpaid.toLocaleString()}
            </h3>
            <span
              style={{
                fontSize: 11,
                color: totalUnpaid > 0 ? C.red : C.textMuted,
              }}
            >
              {totalUnpaid > 0
                ? "Unpaid platform invoices due"
                : "Plan is in good standing ✓"}
            </span>
          </div>

          <div
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 20,
              padding: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  color: C.textSub,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {isPlatformAdmin
                  ? "Settlement Ratio"
                  : "Invoice Payment History"}
              </span>
              <div style={{ color: C.blueLight }}>
                <MonetizationOnRounded sx={{ fontSize: 18 }} />
              </div>
            </div>
            <h3
              style={{
                margin: "0 0 4px",
                fontSize: 28,
                fontWeight: 400,
                color: C.text,
              }}
            >
              {isPlatformAdmin
                ? `${settlementRatio}%`
                : `${paidCount}/${totalInvoicesCount}`}
            </h3>
            <span style={{ fontSize: 11, color: C.textMuted }}>
              {isPlatformAdmin
                ? "Paid invoices vs total issued"
                : "Settled platform billing tokens"}
            </span>
          </div>
        </div>

        {/* ─── PLATFORM ADMIN DASHBOARD ────────────────────────────────────────── */}
        {isPlatformAdmin ? (
          <div
            style={{
              background: C.surface,
              borderRadius: 24,
              border: `1px solid ${C.border}`,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "8px 24px",
                borderBottom: `1px solid ${C.border}`,
                display: "flex",
                gap: 16,
              }}
            >
              <button
                onClick={() => setActiveTab("tenants")}
                style={{
                  background: "none",
                  border: "none",
                  color: activeTab === "tenants" ? C.blueLight : C.textSub,
                  borderBottom:
                    activeTab === "tenants"
                      ? `2px solid ${C.blueLight}`
                      : "2px solid transparent",
                  padding: "16px 8px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Active Tenants Desk
              </button>
              <button
                onClick={() => setActiveTab("invoices")}
                style={{
                  background: "none",
                  border: "none",
                  color: activeTab === "invoices" ? C.blueLight : C.textSub,
                  borderBottom:
                    activeTab === "invoices"
                      ? `2px solid ${C.blueLight}`
                      : "2px solid transparent",
                  padding: "16px 8px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Invoices Register
              </button>
              <button
                onClick={() => setActiveTab("plans")}
                style={{
                  background: "none",
                  border: "none",
                  color: activeTab === "plans" ? C.blueLight : C.textSub,
                  borderBottom:
                    activeTab === "plans"
                      ? `2px solid ${C.blueLight}`
                      : "2px solid transparent",
                  padding: "16px 8px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Billing Plans
              </button>
            </div>

            {/* Tenants desk Tab */}
            {activeTab === "tenants" && (
              <div style={{ overflowX: "auto" }}>
                {tenantsLoading ? (
                  <div style={{ padding: "60px 0", textAlign: "center" }}>
                    <p style={{ color: C.textSub, fontSize: 14 }}>
                      Auditing database tenants...
                    </p>
                  </div>
                ) : tenants.length === 0 ? (
                  <div style={{ padding: "80px 0", textAlign: "center" }}>
                    <p style={{ color: C.textSub, fontSize: 14 }}>
                      No institutions recorded.
                    </p>
                  </div>
                ) : (
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      textAlign: "left",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          borderBottom: `1px solid ${C.border}`,
                          background: "rgba(255,255,255,0.01)",
                        }}
                      >
                        <th
                          style={{
                            padding: "16px 24px",
                            fontSize: 11,
                            fontWeight: 800,
                            color: C.textMuted,
                            textTransform: "uppercase",
                          }}
                        >
                          Tenant Name
                        </th>
                        <th
                          style={{
                            padding: "16px 24px",
                            fontSize: 11,
                            fontWeight: 800,
                            color: C.textMuted,
                            textTransform: "uppercase",
                          }}
                        >
                          Tenant Type
                        </th>
                        <th
                          style={{
                            padding: "16px 24px",
                            fontSize: 11,
                            fontWeight: 800,
                            color: C.textMuted,
                            textTransform: "uppercase",
                          }}
                        >
                          Monthly Fee
                        </th>
                        <th
                          style={{
                            padding: "16px 24px",
                            fontSize: 11,
                            fontWeight: 800,
                            color: C.textMuted,
                            textTransform: "uppercase",
                          }}
                        >
                          Unpaid Ledger
                        </th>
                        <th
                          style={{
                            padding: "16px 24px",
                            fontSize: 11,
                            fontWeight: 800,
                            color: C.textMuted,
                            textTransform: "uppercase",
                          }}
                        >
                          Next Renewal
                        </th>
                        <th
                          style={{
                            padding: "16px 24px",
                            fontSize: 11,
                            fontWeight: 800,
                            color: C.textMuted,
                            textTransform: "uppercase",
                            textAlign: "right",
                          }}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tenants.map((t: any) => (
                        <tr
                          key={t._id}
                          style={{ borderBottom: `1px solid ${C.border}` }}
                        >
                          <td style={{ padding: "20px 24px" }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                              }}
                            >
                              <div
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: 8,
                                  background: C.bluePale,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: C.blueLight,
                                }}
                              >
                                <AccountBalanceRounded sx={{ fontSize: 18 }} />
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: C.text,
                                  }}
                                >
                                  {t.name}
                                </span>
                                <span
                                  style={{
                                    fontSize: 11,
                                    color: C.textMuted,
                                    marginTop: 2,
                                  }}
                                >
                                  {t.email}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "20px 24px" }}>
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 800,
                                background: "rgba(255,255,255,0.05)",
                                color: C.textSub,
                                padding: "4px 8px",
                                borderRadius: 4,
                                textTransform: "uppercase",
                              }}
                            >
                              {t.type === "Merchant" ? "BNPL Owner" : t.type}
                            </span>
                          </td>
                          <td style={{ padding: "20px 24px" }}>
                            <span
                              style={{
                                fontSize: 14,
                                fontWeight: 650,
                                color: C.text,
                              }}
                            >
                              GH₵ {t.subscriptionFee?.toLocaleString() || "0"}
                            </span>
                            <span
                              style={{
                                fontSize: 10,
                                color: C.textMuted,
                                marginLeft: 4,
                              }}
                            >
                              /{t.billingCycle}
                            </span>
                          </td>
                          <td style={{ padding: "20px 24px" }}>
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: t.unpaidBalance > 0 ? C.red : C.emerald,
                              }}
                            >
                              {t.unpaidBalance > 0
                                ? `GH₵ ${t.unpaidBalance.toLocaleString()}`
                                : "Settled ✓"}
                            </span>
                          </td>
                          <td style={{ padding: "20px 24px" }}>
                            <span style={{ fontSize: 12.5, color: C.textSub }}>
                              {t.nextBillingDate
                                ? new Date(
                                    t.nextBillingDate,
                                  ).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </td>
                          <td
                            style={{ padding: "20px 24px", textAlign: "right" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                gap: 12,
                                justifyContent: "flex-end",
                              }}
                            >
                              <button
                                onClick={() => {
                                  setSelectedTenant(t);
                                  setNewFee(t.subscriptionFee);
                                  setNewCycle(t.billingCycle);
                                  setNewStatus(t.billingStatus);
                                }}
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: C.blueLight,
                                  cursor: "pointer",
                                  fontSize: 12.5,
                                  fontWeight: 700,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                              >
                                <EditRounded sx={{ fontSize: 14 }} />{" "}
                                Subscription
                              </button>
                              <button
                                onClick={() => setShowInvoiceModal(t)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: C.textSub,
                                  cursor: "pointer",
                                  fontSize: 12.5,
                                  fontWeight: 700,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                              >
                                <AddCardRounded sx={{ fontSize: 14 }} /> Charge
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Invoices Tab */}
            {activeTab === "invoices" && (
              <div style={{ overflowX: "auto" }}>
                {invoicesLoading ? (
                  <div style={{ padding: "60px 0", textAlign: "center" }}>
                    <p style={{ color: C.textSub, fontSize: 14 }}>
                      Fetching invoices register...
                    </p>
                  </div>
                ) : invoices.length === 0 ? (
                  <div style={{ padding: "80px 0", textAlign: "center" }}>
                    <p style={{ color: C.textSub, fontSize: 14 }}>
                      No invoices issued yet.
                    </p>
                  </div>
                ) : (
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      textAlign: "left",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          borderBottom: `1px solid ${C.border}`,
                          background: "rgba(255,255,255,0.01)",
                        }}
                      >
                        <th
                          style={{
                            padding: "16px 24px",
                            fontSize: 11,
                            fontWeight: 800,
                            color: C.textMuted,
                            textTransform: "uppercase",
                          }}
                        >
                          Reference
                        </th>
                        <th
                          style={{
                            padding: "16px 24px",
                            fontSize: 11,
                            fontWeight: 800,
                            color: C.textMuted,
                            textTransform: "uppercase",
                          }}
                        >
                          Institution
                        </th>
                        <th
                          style={{
                            padding: "16px 24px",
                            fontSize: 11,
                            fontWeight: 800,
                            color: C.textMuted,
                            textTransform: "uppercase",
                          }}
                        >
                          Amount
                        </th>
                        <th
                          style={{
                            padding: "16px 24px",
                            fontSize: 11,
                            fontWeight: 800,
                            color: C.textMuted,
                            textTransform: "uppercase",
                          }}
                        >
                          Billing Item
                        </th>
                        <th
                          style={{
                            padding: "16px 24px",
                            fontSize: 11,
                            fontWeight: 800,
                            color: C.textMuted,
                            textTransform: "uppercase",
                          }}
                        >
                          Due Date
                        </th>
                        <th
                          style={{
                            padding: "16px 24px",
                            fontSize: 11,
                            fontWeight: 800,
                            color: C.textMuted,
                            textTransform: "uppercase",
                          }}
                        >
                          Status
                        </th>
                        <th
                          style={{
                            padding: "16px 24px",
                            fontSize: 11,
                            fontWeight: 800,
                            color: C.textMuted,
                            textTransform: "uppercase",
                            textAlign: "right",
                          }}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((inv: any) => (
                        <tr
                          key={inv._id}
                          style={{ borderBottom: `1px solid ${C.border}` }}
                        >
                          <td style={{ padding: "20px 24px" }}>
                            <span
                              style={{
                                fontSize: 13,
                                fontFamily: "monospace",
                                fontWeight: 700,
                                color: C.blueLight,
                              }}
                            >
                              {inv.reference}
                            </span>
                          </td>
                          <td style={{ padding: "20px 24px" }}>
                            <span
                              style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: C.text,
                              }}
                            >
                              {inv.institutionId?.name || "Deleted Partner"}
                            </span>
                          </td>
                          <td style={{ padding: "20px 24px" }}>
                            <span
                              style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: C.text,
                              }}
                            >
                              GH₵ {inv.amount?.toLocaleString()}
                            </span>
                          </td>
                          <td style={{ padding: "20px 24px" }}>
                            <span style={{ fontSize: 13, color: C.textSub }}>
                              {inv.description}
                            </span>
                          </td>
                          <td style={{ padding: "20px 24px" }}>
                            <span style={{ fontSize: 12.5, color: C.textSub }}>
                              {new Date(inv.dueDate).toLocaleDateString()}
                            </span>
                          </td>
                          <td style={{ padding: "20px 24px" }}>
                            <span
                              style={{
                                fontSize: 10.5,
                                fontWeight: 800,
                                color:
                                  inv.status === "Paid" ? C.emerald : C.amber,
                                background:
                                  inv.status === "Paid"
                                    ? C.emeraldPale
                                    : C.amberPale,
                                padding: "4px 8px",
                                borderRadius: 4,
                              }}
                            >
                              {inv.status}
                            </span>
                          </td>
                          <td
                            style={{ padding: "20px 24px", textAlign: "right" }}
                          >
                            {inv.status !== "Paid" && (
                              <button
                                onClick={() => handlePayInvoice(inv._id)}
                                disabled={isPaying}
                                style={{
                                  background: C.emeraldPale,
                                  color: C.emerald,
                                  border: "none",
                                  borderRadius: 6,
                                  padding: "6px 12px",
                                  fontSize: 11.5,
                                  fontWeight: 800,
                                  cursor: isPaying ? "not-allowed" : "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                              >
                                <MonetizationOnRounded sx={{ fontSize: 14 }} />{" "}
                                {isPaying ? "Paying..." : "Mark Paid"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === "plans" && (
              <div style={{ padding: 24 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 16,
                        color: C.text,
                        fontFamily: F.heading,
                      }}
                    >
                      Billing Fee Plans
                    </h3>
                    <p
                      style={{
                        margin: "6px 0 0",
                        fontSize: 12,
                        color: C.textSub,
                      }}
                    >
                      Create, update, and apply fee plans across tenant
                      institutions.
                    </p>
                  </div>
                  <button
                    onClick={handleCreatePlan}
                    style={{
                      background: C.blue,
                      color: "#fff",
                      border: "none",
                      borderRadius: 10,
                      padding: "12px 18px",
                      fontSize: 12.5,
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    Create Billing Plan
                  </button>
                </div>

                {feePlansLoading ? (
                  <div style={{ padding: "60px 0", textAlign: "center" }}>
                    <p style={{ color: C.textSub, fontSize: 14 }}>
                      Loading billing fee plans...
                    </p>
                  </div>
                ) : feePlans.length === 0 ? (
                  <div style={{ padding: "80px 0", textAlign: "center" }}>
                    <p style={{ color: C.textSub, fontSize: 14 }}>
                      No billing plans configured yet.
                    </p>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        textAlign: "left",
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            borderBottom: `1px solid ${C.border}`,
                            background: "rgba(255,255,255,0.01)",
                          }}
                        >
                          <th
                            style={{
                              padding: "16px 24px",
                              fontSize: 11,
                              fontWeight: 800,
                              color: C.textMuted,
                              textTransform: "uppercase",
                            }}
                          >
                            Plan Name
                          </th>
                          <th
                            style={{
                              padding: "16px 24px",
                              fontSize: 11,
                              fontWeight: 800,
                              color: C.textMuted,
                              textTransform: "uppercase",
                            }}
                          >
                            Amount
                          </th>
                          <th
                            style={{
                              padding: "16px 24px",
                              fontSize: 11,
                              fontWeight: 800,
                              color: C.textMuted,
                              textTransform: "uppercase",
                            }}
                          >
                            Billing Cycle
                          </th>
                          <th
                            style={{
                              padding: "16px 24px",
                              fontSize: 11,
                              fontWeight: 800,
                              color: C.textMuted,
                              textTransform: "uppercase",
                            }}
                          >
                            Status
                          </th>
                          <th
                            style={{
                              padding: "16px 24px",
                              fontSize: 11,
                              fontWeight: 800,
                              color: C.textMuted,
                              textTransform: "uppercase",
                              textAlign: "right",
                            }}
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {feePlans.map((plan: any) => (
                          <tr
                            key={plan._id}
                            style={{ borderBottom: `1px solid ${C.border}` }}
                          >
                            <td style={{ padding: "20px 24px" }}>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 6,
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: C.text,
                                  }}
                                >
                                  {plan.name}
                                </span>
                                <span
                                  style={{ fontSize: 12, color: C.textSub }}
                                >
                                  {plan.description}
                                </span>
                              </div>
                            </td>
                            <td style={{ padding: "20px 24px" }}>
                              <span
                                style={{
                                  fontSize: 14,
                                  fontWeight: 700,
                                  color: C.text,
                                }}
                              >
                                GH₵ {plan.amount?.toLocaleString()}{" "}
                                {plan.currency}
                              </span>
                            </td>
                            <td style={{ padding: "20px 24px" }}>
                              <span style={{ fontSize: 13, color: C.text }}>
                                {plan.billingCycle}
                              </span>
                            </td>
                            <td style={{ padding: "20px 24px" }}>
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 800,
                                  color: plan.isActive ? C.emerald : C.textSub,
                                  background: plan.isActive
                                    ? C.emeraldPale
                                    : C.surface,
                                  padding: "4px 8px",
                                  borderRadius: 6,
                                }}
                              >
                                {plan.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td
                              style={{
                                padding: "20px 24px",
                                textAlign: "right",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  gap: 10,
                                  flexWrap: "wrap",
                                }}
                              >
                                <button
                                  onClick={() => handleOpenPlan(plan)}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    color: C.blueLight,
                                    cursor: "pointer",
                                    fontSize: 12.5,
                                    fontWeight: 700,
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedPlanToApply(plan);
                                    setApplyPlanTenantId(tenants[0]?._id || "");
                                    setShowApplyPlanDrawer(true);
                                  }}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    color: C.textSub,
                                    cursor: "pointer",
                                    fontSize: 12.5,
                                    fontWeight: 700,
                                  }}
                                >
                                  Apply
                                </button>
                                <button
                                  onClick={() => {
                                    if (
                                      window.confirm("Delete this fee plan?")
                                    ) {
                                      handleDeleteFeePlan(plan._id);
                                    }
                                  }}
                                  disabled={isDeletingPlan}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    color: C.red,
                                    cursor: isDeletingPlan ? "not-allowed" : "pointer",
                                    fontSize: 12.5,
                                    fontWeight: 700,
                                  }}
                                >
                                  {isDeletingPlan ? "Deleting..." : "Delete"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          // ─── PARTNER BILLING & PLAN DESK ───────────────────────────────────────
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 32 }}
          >
            {/* Institution Subscription Plan Details Card */}
            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 24,
                padding: 32,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 24,
                  }}
                >
                  <AccountBalanceRounded sx={{ color: C.blueLight }} />
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 17,
                      color: C.text,
                      fontFamily: F.heading,
                    }}
                  >
                    My Subscription Level
                  </h3>
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  <div
                    style={{
                      borderBottom: `1px solid ${C.border}`,
                      paddingBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        color: C.textMuted,
                        display: "block",
                      }}
                    >
                      ASSOCIATED TENANT
                    </span>
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: C.text,
                        display: "block",
                        marginTop: 4,
                      }}
                    >
                      {myInstitution?.name || "Loading profile..."}
                    </span>
                    <span style={{ fontSize: 11, color: C.textSub }}>
                      {myInstitution?.email}
                    </span>
                  </div>

                  <div
                    style={{
                      borderBottom: `1px solid ${C.border}`,
                      paddingBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        color: C.textMuted,
                        display: "block",
                      }}
                    >
                      SUBSCRIPTION STATUS
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 900,
                        background:
                          myInstitution?.billingStatus === "Active"
                            ? C.emeraldPale
                            : C.redPale,
                        color:
                          myInstitution?.billingStatus === "Active"
                            ? C.emerald
                            : C.red,
                        padding: "3px 8px",
                        borderRadius: 4,
                        marginTop: 4,
                        display: "inline-block",
                      }}
                    >
                      {myInstitution?.billingStatus === "Active"
                        ? "ACTIVE & GOOD STANDING"
                        : "DELINQUENT / LAPSED"}
                    </span>
                  </div>

                  <div
                    style={{
                      borderBottom: `1px solid ${C.border}`,
                      paddingBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        color: C.textMuted,
                        display: "block",
                      }}
                    >
                      RENEWAL FREQUENCY
                    </span>
                    <span
                      style={{
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: C.text,
                        display: "block",
                        marginTop: 4,
                      }}
                    >
                      Billed{" "}
                      {myInstitution?.billingCycle === "annually"
                        ? "Annually"
                        : "Monthly"}
                    </span>
                  </div>

                  <div>
                    <span
                      style={{
                        fontSize: 11,
                        color: C.textMuted,
                        display: "block",
                      }}
                    >
                      NEXT CYCLE BILLING DATE
                    </span>
                    <span
                      style={{
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: C.blueLight,
                        display: "block",
                        marginTop: 4,
                      }}
                    >
                      {myInstitution?.nextBillingDate
                        ? new Date(
                            myInstitution.nextBillingDate,
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  borderTop: `1px solid ${C.border}`,
                  paddingTop: 20,
                  marginTop: 24,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 11.5,
                  color: C.textMuted,
                }}
              >
                <SecurityRounded sx={{ fontSize: 14, color: C.emerald }} />{" "}
                Billed by ResolveBridge automated run.
              </div>
            </div>

            {/* Invoices register card specifically for this partner */}
            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 24,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: 24,
                  borderBottom: `1px solid ${C.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 16,
                      color: C.text,
                      fontFamily: F.heading,
                    }}
                  >
                    My Platform Invoices
                  </h3>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: 12,
                      color: C.textMuted,
                    }}
                  >
                    Audit logs of platform subscription charges and execute momo
                    settlements.
                  </p>
                </div>
                <button
                  onClick={() => {
                    refetchInvoices();
                    refetchInsts();
                  }}
                  style={{
                    background: "transparent",
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: "6px 12px",
                    fontSize: 11,
                    color: C.textSub,
                    cursor: "pointer",
                  }}
                >
                  Sync Ledger
                </button>
              </div>

              {invoicesLoading ? (
                <div
                  style={{ padding: 60, textAlign: "center", color: C.textSub }}
                >
                  Syncing invoice registers...
                </div>
              ) : invoices.length === 0 ? (
                <div style={{ padding: 80, textAlign: "center" }}>
                  <ReceiptLongRounded
                    sx={{ fontSize: 48, color: C.textMuted, marginBottom: 2 }}
                  />
                  <h4
                    style={{
                      margin: 0,
                      fontSize: 15,
                      color: C.text,
                      fontWeight: 700,
                    }}
                  >
                    Invoices Registry Clear
                  </h4>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: 12,
                      color: C.textMuted,
                    }}
                  >
                    No platform billing invoices are currently logged under your
                    account.
                  </p>
                </div>
              ) : (
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    textAlign: "left",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: `1px solid ${C.border}`,
                        background: "rgba(255,255,255,0.01)",
                      }}
                    >
                      <th
                        style={{
                          padding: "16px 24px",
                          fontSize: 11,
                          fontWeight: 800,
                          color: C.textMuted,
                          textTransform: "uppercase",
                        }}
                      >
                        Reference
                      </th>
                      <th
                        style={{
                          padding: "16px 24px",
                          fontSize: 11,
                          fontWeight: 800,
                          color: C.textMuted,
                          textTransform: "uppercase",
                        }}
                      >
                        Billing Item
                      </th>
                      <th
                        style={{
                          padding: "16px 24px",
                          fontSize: 11,
                          fontWeight: 800,
                          color: C.textMuted,
                          textTransform: "uppercase",
                        }}
                      >
                        Amount
                      </th>
                      <th
                        style={{
                          padding: "16px 24px",
                          fontSize: 11,
                          fontWeight: 800,
                          color: C.textMuted,
                          textTransform: "uppercase",
                        }}
                      >
                        Due Date
                      </th>
                      <th
                        style={{
                          padding: "16px 24px",
                          fontSize: 11,
                          fontWeight: 800,
                          color: C.textMuted,
                          textTransform: "uppercase",
                        }}
                      >
                        Status
                      </th>
                      <th
                        style={{
                          padding: "16px 24px",
                          fontSize: 11,
                          fontWeight: 800,
                          color: C.textMuted,
                          textTransform: "uppercase",
                          textAlign: "right",
                        }}
                      >
                        Checkout
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv: any) => (
                      <tr
                        key={inv._id}
                        style={{ borderBottom: `1px solid ${C.border}` }}
                      >
                        <td style={{ padding: "18px 24px" }}>
                          <span
                            style={{
                              fontSize: 13,
                              fontFamily: "monospace",
                              fontWeight: 700,
                              color: C.blueLight,
                            }}
                          >
                            {inv.reference}
                          </span>
                        </td>
                        <td style={{ padding: "18px 24px" }}>
                          <span style={{ fontSize: 13, color: C.text }}>
                            {inv.description}
                          </span>
                        </td>
                        <td style={{ padding: "18px 24px" }}>
                          <span
                            style={{
                              fontSize: 13.5,
                              fontWeight: 700,
                              color: C.text,
                            }}
                          >
                            GH₵ {inv.amount?.toLocaleString()}
                          </span>
                        </td>
                        <td style={{ padding: "18px 24px" }}>
                          <span style={{ fontSize: 12, color: C.textMuted }}>
                            {new Date(inv.dueDate).toLocaleDateString()}
                          </span>
                        </td>
                        <td style={{ padding: "18px 24px" }}>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 800,
                              color:
                                inv.status === "Paid" ? C.emerald : C.amber,
                              background:
                                inv.status === "Paid"
                                  ? C.emeraldPale
                                  : C.amberPale,
                              padding: "4px 8px",
                              borderRadius: 4,
                            }}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td
                          style={{ padding: "18px 24px", textAlign: "right" }}
                        >
                          {inv.status !== "Paid" ? (
                            <button
                              onClick={() => handleSettleInvoice(inv._id)}
                              disabled={isInitializingPayment}
                              style={{
                                background: C.emeraldPale,
                                color: C.emerald,
                                border: "none",
                                borderRadius: 8,
                                padding: "6px 12px",
                                fontSize: 11.5,
                                fontWeight: 800,
                                cursor: isInitializingPayment ? "not-allowed" : "pointer",
                                transition: "0.2s",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                opacity: isInitializingPayment ? 0.6 : 1,
                              }}
                              onMouseEnter={(e) => {
                                if (!isInitializingPayment) e.currentTarget.style.opacity = "0.9";
                              }}
                              onMouseLeave={(e) => {
                                if (!isInitializingPayment) e.currentTarget.style.opacity = "1";
                              }}
                            >
                              {isInitializingPayment ? "Loading..." : "Settle Invoice"}
                            </button>
                          ) : (
                            <span
                              style={{
                                fontSize: 12,
                                color: C.textMuted,
                                fontWeight: 600,
                              }}
                            >
                              Settled ✓
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Subscription Editor Drawer (Admin Only) */}
      <Drawer
        anchor="right"
        open={!!selectedTenant}
        onClose={() => setSelectedTenant(null)}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 450,
            background: C.surface,
            borderLeft: `1px solid ${C.border}`,
            boxShadow: "-20px 0 60px rgba(0,0,0,0.7)",
            color: C.text,
            p: 0,
          },
        }}
      >
        {selectedTenant && (
          <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <div
              style={{
                padding: 24,
                borderBottom: `1px solid ${C.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: 9.5,
                    fontWeight: 900,
                    color: C.blueLight,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  BILLING MODEL
                </span>
                <h3
                  style={{
                    margin: "4px 0 0",
                    fontSize: 18,
                    color: C.text,
                    fontFamily: F.heading,
                  }}
                >
                  Configure Subscription
                </h3>
              </div>
              <IconButton
                onClick={() => setSelectedTenant(null)}
                sx={{ color: C.textSub }}
              >
                <CloseRounded sx={{ fontSize: 18 }} />
              </IconButton>
            </div>

            <div
              style={{
                flex: 1,
                padding: 32,
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              <div>
                <span style={{ fontSize: 12, color: C.textSub }}>
                  Monthly Platform Fee (GH₵)
                </span>
                <input
                  type="number"
                  value={newFee}
                  onChange={(e) => setNewFee(Number(e.target.value))}
                  style={{
                    width: "100%",
                    marginTop: 8,
                    padding: 12,
                    borderRadius: 10,
                    border: `1px solid ${C.borderStrong}`,
                    background: C.bg,
                    color: C.text,
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <span style={{ fontSize: 12, color: C.textSub }}>
                  Billing Frequency
                </span>
                <select
                  value={newCycle}
                  onChange={(e: any) => setNewCycle(e.target.value)}
                  style={{
                    width: "100%",
                    marginTop: 8,
                    padding: 12,
                    borderRadius: 10,
                    border: `1px solid ${C.borderStrong}`,
                    background: C.bg,
                    color: C.text,
                    fontSize: 13,
                    outline: "none",
                  }}
                >
                  <option value="monthly">Monthly Cycle Run</option>
                  <option value="annually">Annual Billing Run</option>
                </select>
              </div>

              <div>
                <span style={{ fontSize: 12, color: C.textSub }}>
                  Billing Status
                </span>
                <select
                  value={newStatus}
                  onChange={(e: any) => setNewStatus(e.target.value)}
                  style={{
                    width: "100%",
                    marginTop: 8,
                    padding: 12,
                    borderRadius: 10,
                    border: `1px solid ${C.borderStrong}`,
                    background: C.bg,
                    color: C.text,
                    fontSize: 13,
                    outline: "none",
                  }}
                >
                  <option value="Active">
                    Active Account (In Good Standing)
                  </option>
                  <option value="Delinquent">
                    Delinquent Account (Lapsed Payment)
                  </option>
                  <option value="Unpaid">Unpaid Account</option>
                </select>
              </div>

              <button
                onClick={handleUpdateSubscription}
                disabled={isUpdatingSub}
                style={{
                  width: "100%",
                  padding: 14,
                  marginTop: 12,
                  borderRadius: 12,
                  border: "none",
                  background: C.blue,
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {isUpdatingSub
                  ? "Saving Settings..."
                  : "Save Subscription settings"}
              </button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Manual Invoicing Drawer (Admin Only) */}
      <Drawer
        anchor="right"
        open={!!showInvoiceModal}
        onClose={() => setShowInvoiceModal(null)}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 450,
            background: C.surface,
            borderLeft: `1px solid ${C.border}`,
            boxShadow: "-20px 0 60px rgba(0,0,0,0.7)",
            color: C.text,
            p: 0,
          },
        }}
      >
        {showInvoiceModal && (
          <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <div
              style={{
                padding: 24,
                borderBottom: `1px solid ${C.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: 9.5,
                    fontWeight: 900,
                    color: C.blueLight,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  CUSTOM ASSESSMENTS
                </span>
                <h3
                  style={{
                    margin: "4px 0 0",
                    fontSize: 18,
                    color: C.text,
                    fontFamily: F.heading,
                  }}
                >
                  Issue Custom Charge
                </h3>
              </div>
              <IconButton
                onClick={() => setShowInvoiceModal(null)}
                sx={{ color: C.textSub }}
              >
                <CloseRounded sx={{ fontSize: 18 }} />
              </IconButton>
            </div>

            <div
              style={{
                flex: 1,
                padding: 32,
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              <div
                style={{
                  padding: "16px",
                  background: "rgba(255,255,255,0.01)",
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                }}
              >
                <p style={{ margin: 0, fontSize: 11, color: C.textMuted }}>
                  RECIPIENT TENANT
                </p>
                <h4 style={{ margin: "4px 0 0", fontSize: 15, color: C.text }}>
                  {showInvoiceModal.name}
                </h4>
                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: 11.5,
                    color: C.textSub,
                  }}
                >
                  {showInvoiceModal.email}
                </p>
              </div>

              <div>
                <span style={{ fontSize: 12, color: C.textSub }}>
                  Invoice Amount (GH₵)
                </span>
                <input
                  type="number"
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(Number(e.target.value))}
                  placeholder="0.00"
                  style={{
                    width: "100%",
                    marginTop: 8,
                    padding: 12,
                    borderRadius: 10,
                    border: `1px solid ${C.borderStrong}`,
                    background: C.bg,
                    color: C.text,
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <span style={{ fontSize: 12, color: C.textSub }}>
                  Charge Description
                </span>
                <textarea
                  value={invoiceDesc}
                  onChange={(e) => setInvoiceDesc(e.target.value)}
                  placeholder="e.g. Platform setup integration fees, excess transactions adjustments..."
                  style={{
                    width: "100%",
                    marginTop: 8,
                    padding: 12,
                    borderRadius: 10,
                    border: `1px solid ${C.borderStrong}`,
                    background: C.bg,
                    color: C.text,
                    fontSize: 13,
                    outline: "none",
                    height: 100,
                    resize: "none",
                  }}
                />
              </div>

              <button
                onClick={handleCreateManualInvoice}
                disabled={isCreatingInvoice}
                style={{
                  width: "100%",
                  padding: 14,
                  marginTop: 12,
                  borderRadius: 12,
                  border: "none",
                  background: C.emerald,
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {isCreatingInvoice
                  ? "Generating Invoice..."
                  : "Generate and Issue Charge"}
              </button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Fee Plan Editor Drawer (Admin Only) */}
      <Drawer
        anchor="right"
        open={showPlanDrawer}
        onClose={() => setShowPlanDrawer(false)}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 500,
            background: C.surface,
            borderLeft: `1px solid ${C.border}`,
            boxShadow: "-20px 0 60px rgba(0,0,0,0.7)",
            color: C.text,
            p: 0,
          },
        }}
      >
        <div
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              padding: 24,
              borderBottom: `1px solid ${C.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: 9.5,
                  fontWeight: 900,
                  color: C.blueLight,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                FEE PLAN MANAGEMENT
              </span>
              <h3
                style={{
                  margin: "4px 0 0",
                  fontSize: 18,
                  color: C.text,
                  fontFamily: F.heading,
                }}
              >
                {selectedPlan
                  ? "Edit Billing Fee Plan"
                  : "Create New Billing Plan"}
              </h3>
            </div>
            <IconButton
              onClick={() => setShowPlanDrawer(false)}
              sx={{ color: C.textSub }}
            >
              <CloseRounded sx={{ fontSize: 18 }} />
            </IconButton>
          </div>

          <div
            style={{
              flex: 1,
              padding: 32,
              display: "flex",
              flexDirection: "column",
              gap: 20,
              overflowY: "auto",
            }}
          >
            <div>
              <span style={{ fontSize: 12, color: C.textSub }}>Plan Name</span>
              <input
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder="e.g. Growth Partner Plan"
                style={{
                  width: "100%",
                  marginTop: 8,
                  padding: 12,
                  borderRadius: 10,
                  border: `1px solid ${C.borderStrong}`,
                  background: C.bg,
                  color: C.text,
                  fontSize: 13,
                  outline: "none",
                }}
              />
            </div>
            <div>
              <span style={{ fontSize: 12, color: C.textSub }}>
                Description
              </span>
              <textarea
                value={planDescription}
                onChange={(e) => setPlanDescription(e.target.value)}
                placeholder="Describe the billing plan benefits and coverage"
                style={{
                  width: "100%",
                  marginTop: 8,
                  padding: 12,
                  minHeight: 100,
                  borderRadius: 10,
                  border: `1px solid ${C.borderStrong}`,
                  background: C.bg,
                  color: C.text,
                  fontSize: 13,
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div>
                <span style={{ fontSize: 12, color: C.textSub }}>
                  Amount (GH₵)
                </span>
                <input
                  type="number"
                  value={planAmount}
                  onChange={(e) => setPlanAmount(Number(e.target.value))}
                  style={{
                    width: "100%",
                    marginTop: 8,
                    padding: 12,
                    borderRadius: 10,
                    border: `1px solid ${C.borderStrong}`,
                    background: C.bg,
                    color: C.text,
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <span style={{ fontSize: 12, color: C.textSub }}>Currency</span>
                <select
                  value={planCurrency}
                  onChange={(e) => setPlanCurrency(e.target.value)}
                  style={{
                    width: "100%",
                    marginTop: 8,
                    padding: 12,
                    borderRadius: 10,
                    border: `1px solid ${C.borderStrong}`,
                    background: C.bg,
                    color: C.text,
                    fontSize: 13,
                    outline: "none",
                  }}
                >
                  <option value="GHS">GHS</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div>
                <span style={{ fontSize: 12, color: C.textSub }}>
                  Billing Cycle
                </span>
                <select
                  value={planBillingCycle}
                  onChange={(e: any) => setPlanBillingCycle(e.target.value)}
                  style={{
                    width: "100%",
                    marginTop: 8,
                    padding: 12,
                    borderRadius: 10,
                    border: `1px solid ${C.borderStrong}`,
                    background: C.bg,
                    color: C.text,
                    fontSize: 13,
                    outline: "none",
                  }}
                >
                  <option value="monthly">Monthly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>
              <div>
                <span style={{ fontSize: 12, color: C.textSub }}>Status</span>
                <select
                  value={planIsActive ? "active" : "inactive"}
                  onChange={(e: any) =>
                    setPlanIsActive(e.target.value === "active")
                  }
                  style={{
                    width: "100%",
                    marginTop: 8,
                    padding: 12,
                    borderRadius: 10,
                    border: `1px solid ${C.borderStrong}`,
                    background: C.bg,
                    color: C.text,
                    fontSize: 13,
                    outline: "none",
                  }}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSaveFeePlan}
              disabled={isCreatingPlan || isUpdatingPlan}
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 12,
                border: "none",
                background: C.blue,
                color: "#fff",
                fontWeight: 800,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {selectedPlan
                ? isUpdatingPlan
                  ? "Updating Plan..."
                  : "Update Fee Plan"
                : isCreatingPlan
                  ? "Creating Plan..."
                  : "Create Fee Plan"}
            </button>
          </div>
        </div>
      </Drawer>

      <Drawer
        anchor="right"
        open={showApplyPlanDrawer}
        onClose={() => {
          setShowApplyPlanDrawer(false);
          setSelectedPlanToApply(null);
          setApplyPlanTenantId("");
        }}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 450,
            background: C.surface,
            borderLeft: `1px solid ${C.border}`,
            boxShadow: "-20px 0 60px rgba(0,0,0,0.7)",
            color: C.text,
            p: 0,
          },
        }}
      >
        <div
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              padding: 24,
              borderBottom: `1px solid ${C.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: 9.5,
                  fontWeight: 900,
                  color: C.blueLight,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                APPLY FEE PLAN
              </span>
              <h3
                style={{
                  margin: "4px 0 0",
                  fontSize: 18,
                  color: C.text,
                  fontFamily: F.heading,
                }}
              >
                Assign Plan to Institution
              </h3>
            </div>
            <IconButton
              onClick={() => setShowApplyPlanDrawer(false)}
              sx={{ color: C.textSub }}
            >
              <CloseRounded sx={{ fontSize: 18 }} />
            </IconButton>
          </div>

          <div
            style={{
              flex: 1,
              padding: 32,
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            <div
              style={{
                padding: "16px",
                background: "rgba(255,255,255,0.01)",
                border: `1px solid ${C.border}`,
                borderRadius: 12,
              }}
            >
              <p style={{ margin: 0, fontSize: 11, color: C.textMuted }}>
                SELECTED PLAN
              </p>
              <h4 style={{ margin: "6px 0 0", fontSize: 15, color: C.text }}>
                {selectedPlanToApply?.name || "No plan selected"}
              </h4>
              <p
                style={{ margin: "2px 0 0", fontSize: 11.5, color: C.textSub }}
              >
                {selectedPlanToApply?.description}
              </p>
            </div>

            <div>
              <span style={{ fontSize: 12, color: C.textSub }}>
                Target Institution
              </span>
              <select
                value={applyPlanTenantId}
                onChange={(e) => setApplyPlanTenantId(e.target.value)}
                style={{
                  width: "100%",
                  marginTop: 8,
                  padding: 12,
                  borderRadius: 10,
                  border: `1px solid ${C.borderStrong}`,
                  background: C.bg,
                  color: C.text,
                  fontSize: 13,
                  outline: "none",
                }}
              >
                {tenants.map((tenant: any) => (
                  <option key={tenant._id} value={tenant._id}>
                    {tenant.name} — GH₵{" "}
                    {tenant.subscriptionFee?.toLocaleString()} /{" "}
                    {tenant.billingCycle}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleApplyPlan}
              disabled={
                isApplyingPlan || !selectedPlanToApply || !applyPlanTenantId
              }
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 12,
                border: "none",
                background: C.blue,
                color: "#fff",
                fontWeight: 800,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {isApplyingPlan ? "Applying Plan..." : "Apply Fee Plan"}
            </button>
          </div>
        </div>
      </Drawer>


    </AdminShell>
  );
}
