"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { Drawer, IconButton } from "@mui/material";
import AdminShell, { C, F } from "../components/AdminShell";
import {
  useAdminGetApplicationsQuery,
  useAdminReviewApplicationMutation,
  useAdminRestoreApplicationMutation,
  useAdminToggleReminderFlagMutation,
  useAdminTriggerRemindersMutation,
  useAdminAssignApplicationMutation,
} from "@/lib/redux/api/applicationApi";
import { useB2bGetStaffQuery } from "@/lib/redux/api/userApi";
import {
  CloseRounded,
  SearchRounded,
  OpenInNewRounded,
  ShieldRounded,
} from "@mui/icons-material";

function ApplicationsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appIdParam = searchParams.get("appId");
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  const getQueryParams = () => {
    const params: any = {};
    if (activeFilter !== "all") params.status = activeFilter;
    if (assigneeFilter === "unassigned") {
      params.assignedTo = "unassigned";
    } else if (assigneeFilter === "me" && user) {
      params.assignedTo = user._id;
    } else if (assigneeFilter !== "all") {
      params.assignedTo = assigneeFilter;
    }
    return Object.keys(params).length > 0 ? params : undefined;
  };

  const {
    data: appsResponse,
    isLoading: appsLoading,
    isFetching: appsFetching,
    refetch,
  } = useAdminGetApplicationsQuery(getQueryParams());

  const { data: staffResponse } = useB2bGetStaffQuery(undefined, {
    skip: !user || !["InstitutionAdmin", "InsuranceAdmin", "BNPLAdmin"].includes(user.role),
  });

  const [reviewApplication, { isLoading: isReviewing }] =
    useAdminReviewApplicationMutation();
  const [restoreApplication, { isLoading: isRestoring }] =
    useAdminRestoreApplicationMutation();
  const [toggleReminderFlag, { isLoading: isTogglingReminder }] =
    useAdminToggleReminderFlagMutation();
  const [triggerReminders, { isLoading: isTriggeringReminders }] =
    useAdminTriggerRemindersMutation();
  const [assignApplication, { isLoading: isAssigning }] = useAdminAssignApplicationMutation();

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);

    const stored = sessionStorage.getItem("rb_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }

    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const rawApplications = appsResponse?.data || [];

  useEffect(() => {
    if (appIdParam) {
      if (activeFilter !== "all" && !selectedApp) {
        setActiveFilter("all");
      }
    }
  }, [appIdParam, activeFilter, selectedApp]);

  useEffect(() => {
    if (appIdParam && rawApplications.length > 0) {
      const match = rawApplications.find((app: any) => app._id === appIdParam);
      if (match) {
        setSelectedApp(match);
        if (match.status && activeFilter !== match.status) {
          setActiveFilter(match.status);
        }
        router.replace("/admin/applications");
      }
    }
  }, [appIdParam, rawApplications, activeFilter, router]);

  if (!mounted) return null;

  // Client-side search filtration
  const applications = rawApplications.filter((app: any) => {
    const fullName =
      `${app.userId?.firstName || ""} ${app.userId?.lastName || ""}`.toLowerCase();
    const email = (app.userId?.email || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  const handleReview = async (appId: string, status: string) => {
    try {
      const payload: any = { id: appId, status };
      if (status === "Rejected") {
        if (!rejectionReason.trim()) {
          toast.error("Rejection reason is required");
          return;
        }
        payload.rejectionReason = rejectionReason;
      }

      const res = await reviewApplication(payload).unwrap();
      if (res.success) {
        toast.success(`Application state changed to "${status}" successfully`);
        setSelectedApp(null);
        setRejectionReason("");
        refetch();
      } else {
        toast.error(res.message || "Underwriting update failed");
      }
    } catch (err: any) {
      toast.error(
        err.data?.message || "Error occurred during review execution",
      );
    }
  };

  const handleRestore = async (appId: string) => {
    try {
      if (!confirm("Restore this application to pending status?")) return;
      const res = await restoreApplication(appId).unwrap();
      if (res.success) {
        toast.success("Application restored to Pending successfully");
        setSelectedApp(null);
        refetch();
      } else {
        toast.error(res.message || "Restore failed");
      }
    } catch (err: any) {
      toast.error(
        err.data?.message || "Error occurred while restoring application",
      );
    }
  };

  const handleToggleReminder = async (appId: string) => {
    try {
      const res = await toggleReminderFlag(appId).unwrap();
      if (res.success) {
        toast.success(`Application reminder queue status updated!`);
        if (selectedApp && selectedApp._id === appId) {
          setSelectedApp(res.data);
        }
        refetch();
      } else {
        toast.error(res.message || "Failed to update reminder flag");
      }
    } catch (err: any) {
      toast.error(
        err.data?.message || "Error occurred while toggling reminder flag",
      );
    }
  };

  const handleTriggerReminders = async () => {
    try {
      const res = await triggerReminders().unwrap();
      if (res.success) {
        toast.success(`Successfully sent ${res.data?.sentCount || 0} SMS reminders!`);
        refetch();
      } else {
        toast.error(res.message || "Failed to trigger reminders");
      }
    } catch (err: any) {
      toast.error(
        err.data?.message || "Error occurred while triggering reminders",
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return C.emerald;
      case "Disbursed":
        return C.blueLight;
      case "Pending":
        return C.amber;
      case "PaymentPending":
        return C.amber;
      case "UnderReview":
        return C.purple;
      case "Rejected":
        return C.red;
      default:
        return C.textMuted;
    }
  };

  return (
    <AdminShell>
      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        {/* Title Block */}
        {/* Welcome Section */}
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
              Underwriting Operations Queue
            </h1>
            <p style={{ margin: "8px 0 0", fontSize: 13, color: C.textSub }}>
              Audit risk profiles, verify bank details, and execute loan
              disbursements.
            </p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={appsFetching}
            style={{
              background: C.surface,
              color: C.blueLight,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: "10px 18px",
              fontSize: 12.5,
              fontWeight: 700,
              cursor: appsFetching ? "not-allowed" : "pointer",
              transition: "0.2s",
              width: isMobile ? "100%" : "auto",
              textAlign: "center",
            }}
          >
            {appsFetching ? "Refreshing..." : "Refresh Queue"}
          </button>
        </div>

        {/* Search and Filters Console */}
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
              padding: 24,
              borderBottom: `1px solid ${C.border}`,
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 20,
              alignItems: isMobile ? "stretch" : "center",
              flexWrap: "wrap",
            }}
          >
            {/* Custom Search bar */}
            <div style={{ position: "relative", flex: 1, minWidth: 260 }}>
              <input
                placeholder="Search applicant name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px 12px 42px",
                  borderRadius: 12,
                  border: `1px solid ${C.border}`,
                  background: C.bg,
                  fontSize: 13.5,
                  outline: "none",
                  color: C.text,
                }}
              />
              <SearchRounded
                sx={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 18,
                  color: C.textMuted,
                }}
              />
            </div>

            {/* Filter buttons */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[
                  { label: "All", value: "all" },
                  { label: "Unpaid / Draft", value: "PaymentPending" },
                  { label: "Pending", value: "Pending" },
                  { label: "Under Review", value: "UnderReview" },
                  { label: "Approved", value: "Approved" },
                  { label: "Disbursed", value: "Disbursed" },
                  { label: "Rejected", value: "Rejected" },
                ].map((f) => {
                  const active = activeFilter === f.value;
                  return (
                    <button
                      key={f.value}
                      onClick={() => setActiveFilter(f.value)}
                      style={{
                        background: active ? C.bluePale : "transparent",
                        color: active ? C.blueLight : C.textSub,
                        border: active
                          ? `1px solid ${C.blue}30`
                          : "1px solid transparent",
                        borderRadius: 8,
                        padding: "8px 16px",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                {/* Assignee Filter Dropdown */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.textSub }}>Assignee:</span>
                  <select
                    value={assigneeFilter}
                    onChange={(e) => setAssigneeFilter(e.target.value)}
                    style={{
                      background: C.bg,
                      color: C.text,
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      padding: "8px 12px",
                      fontSize: 12,
                      fontWeight: 700,
                      outline: "none",
                      cursor: "pointer",
                      minWidth: 150
                    }}
                  >
                    <option value="all">All</option>
                    <option value="unassigned">Unassigned</option>
                    {user && ["InstitutionStaff", "InsuranceStaff", "BNPLStaff"].includes(user.role) && (
                      <option value="me">Assigned to Me</option>
                    )}
                    {user && ["InstitutionAdmin", "InsuranceAdmin", "BNPLAdmin"].includes(user.role) && (
                      <>
                        <option value="me">Assigned to Me</option>
                        {staffResponse?.data?.map((staff: any) => (
                          <option key={staff._id} value={staff._id}>
                            {staff.firstName} {staff.lastName}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>

                {activeFilter === "PaymentPending" && (
                  <button
                    onClick={handleTriggerReminders}
                    disabled={isTriggeringReminders}
                    style={{
                      background: C.emeraldPale,
                      color: C.emerald,
                      border: `1px solid ${C.emerald}30`,
                      borderRadius: 8,
                      padding: "8px 16px",
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: "pointer",
                      transition: "0.2s"
                    }}
                  >
                    {isTriggeringReminders ? "Sending Reminders..." : "Send SMS Reminders to Flagged"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div style={{ overflowX: "auto" }}>
            {appsLoading ? (
              <div style={{ padding: "60px 0", textAlign: "center" }}>
                <p style={{ color: C.textSub, fontSize: 14 }}>
                  Loading applications log...
                </p>
              </div>
            ) : applications.length === 0 ? (
              <div style={{ padding: "80px 0", textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
                <p style={{ color: C.textSub, fontSize: 14, fontWeight: 600 }}>
                  No matching underwriting entries found.
                </p>
                <p style={{ color: C.textMuted, fontSize: 12, marginTop: 4 }}>
                  Try adjusting your search criteria or filters.
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
                      Applicant
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
                      Product Details
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
                      Capital Size
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
                      KYC Context
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
                  {applications.map((app: any) => {
                    const applicant = app.userId;
                    const product = app.productId;
                    const institution = product?.institutionId;

                    return (
                      <tr
                        key={app._id}
                        style={{
                          borderBottom: `1px solid ${C.border}`,
                          transition: "0.2s",
                          cursor: "pointer",
                        }}
                        onClick={() => setSelectedApp(app)}
                      >
                        <td style={{ padding: "20px 24px" }}>
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span
                              style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: C.text,
                              }}
                            >
                              {applicant?.firstName} {applicant?.lastName}
                            </span>
                            <span
                              style={{
                                fontSize: 11,
                                color: C.textMuted,
                                marginTop: 4,
                              }}
                            >
                              {applicant?.email} • {applicant?.phoneNumber}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "20px 24px" }}>
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span style={{ fontSize: 13, color: C.text }}>
                              {product?.name || "Resolve Product"}
                            </span>
                            <span
                              style={{
                                fontSize: 11,
                                color: C.textMuted,
                                marginTop: 4,
                              }}
                            >
                              {institution?.name || "Institution Scope"}
                            </span>
                            {app.assignedTo && (
                              <span
                                style={{
                                  fontSize: 10.5,
                                  color: C.blueLight,
                                  marginTop: 6,
                                  fontWeight: 600,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 4
                                }}
                              >
                                👤 {app.assignedTo.firstName} {app.assignedTo.lastName}
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: "20px 24px" }}>
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span
                              style={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: C.text,
                              }}
                            >
                              GH₵ {app.amount?.toLocaleString()}
                            </span>
                            <span
                              style={{
                                fontSize: 11,
                                color: C.textMuted,
                                marginTop: 4,
                              }}
                            >
                              Tenure: {app.tenureMonths} Months
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "20px 24px" }}>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 800,
                              background:
                                applicant?.kycStatus === "Verified"
                                  ? C.emeraldPale
                                  : C.amberPale,
                              color:
                                applicant?.kycStatus === "Verified"
                                  ? C.emerald
                                  : C.amber,
                              padding: "4px 8px",
                              borderRadius: 4,
                            }}
                          >
                            KYC: {applicant?.kycStatus || "Pending"}
                          </span>
                        </td>
                        <td style={{ padding: "20px 24px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <div
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: getStatusColor(app.status),
                              }}
                            />
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: getStatusColor(app.status),
                              }}
                            >
                              {app.status}
                            </span>
                          </div>
                        </td>
                        <td
                          style={{ padding: "20px 24px", textAlign: "right" }}
                        >
                          <button
                            style={{
                              background: "none",
                              border: "none",
                              color: C.blueLight,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              fontSize: 12.5,
                              fontWeight: 700,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedApp(app);
                            }}
                          >
                            Underwrite{" "}
                            <OpenInNewRounded sx={{ fontSize: 14 }} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Slide Underwriting Drawer */}
      <Drawer
        anchor="right"
        open={!!selectedApp}
        onClose={() => {
          setSelectedApp(null);
          setRejectionReason("");
        }}
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
        {selectedApp && (
          <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            {/* Header */}
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
                  Underwriting desk
                </span>
                <h3
                  style={{
                    margin: "4px 0 0",
                    fontSize: 18,
                    color: C.text,
                    fontFamily: F.heading,
                  }}
                >
                  Decision Panel
                </h3>
              </div>
              <IconButton
                onClick={() => {
                  setSelectedApp(null);
                  setRejectionReason("");
                }}
                sx={{ color: C.textSub, width: 34, height: 34 }}
              >
                <CloseRounded sx={{ fontSize: 18 }} />
              </IconButton>
            </div>

            {/* Body */}
            <div
              style={{
                flex: 1,
                padding: 32,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 32,
              }}
            >
              {/* Applicant Card */}
              <div
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${C.border}`,
                  borderRadius: 16,
                  padding: 20,
                }}
              >
                <p
                  style={{
                    margin: "0 0 12px",
                    fontSize: 10,
                    fontWeight: 900,
                    color: C.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Applicant Details
                </p>
                <h4 style={{ margin: "0 0 4px", fontSize: 16, color: C.text }}>
                  {selectedApp.userId?.firstName} {selectedApp.userId?.lastName}
                </h4>
                <p
                  style={{
                    margin: "0 0 16px",
                    fontSize: 12.5,
                    color: C.textSub,
                  }}
                >
                  {selectedApp.userId?.email}
                </p>

                <button
                  onClick={() => {
                    const customerId = selectedApp.userId?._id;
                    const customerName = `${selectedApp.userId?.firstName} ${selectedApp.userId?.lastName}`;
                    router.push(
                      `/admin/support?customerId=${customerId}&customerName=${encodeURIComponent(
                        customerName
                      )}`
                    );
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    borderRadius: 12,
                    border: `1.5px solid ${C.border}`,
                    background: "rgba(32,81,229,0.05)",
                    color: C.blueLight,
                    fontSize: 12,
                    fontWeight: 900,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: "all 0.2s",
                    marginBottom: 16,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${C.blueLight}15`;
                    e.currentTarget.style.borderColor = C.blueLight;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(32,81,229,0.05)";
                    e.currentTarget.style.borderColor = C.border;
                  }}
                >
                  💬 Message Client
                </button>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 16,
                    borderTop: `1px solid ${C.border}`,
                    paddingTop: 16,
                  }}
                >
                  <div>
                    <span style={{ fontSize: 10, color: C.textMuted }}>
                      EMPLOYER
                    </span>
                    <p
                      style={{
                        margin: "4px 0 0",
                        fontSize: 13,
                        color: C.textSub,
                      }}
                    >
                      {selectedApp.userId?.profile?.employer || "Not Provided"}
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: 10, color: C.textMuted }}>
                      MONTHLY INCOME
                    </span>
                    <p
                      style={{
                        margin: "4px 0 0",
                        fontSize: 13,
                        color: C.emerald,
                      }}
                    >
                      GH₵{" "}
                      {selectedApp.userId?.profile?.monthlyIncome?.toLocaleString() ||
                        "Not Provided"}
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: 10, color: C.textMuted }}>
                      CREDIT SCORE
                    </span>
                    <p
                      style={{
                        margin: "4px 0 0",
                        fontSize: 13,
                        color: C.blueLight,
                        fontWeight: 900,
                      }}
                    >
                      {selectedApp.userId?.creditScore || "650"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Financing Terms */}
              <div>
                <p
                  style={{
                    margin: "0 0 16px",
                    fontSize: 10,
                    fontWeight: 900,
                    color: C.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Requested Financing Terms
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: `1px solid ${C.border}`,
                      paddingBottom: 10,
                    }}
                  >
                    <span style={{ fontSize: 13, color: C.textSub }}>
                      Financial Product
                    </span>
                    <span
                      style={{ fontSize: 13, fontWeight: 700, color: C.text }}
                    >
                      {selectedApp.productId?.name}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: `1px solid ${C.border}`,
                      paddingBottom: 10,
                    }}
                  >
                    <span style={{ fontSize: 13, color: C.textSub }}>
                      Partner Provider
                    </span>
                    <span
                      style={{ fontSize: 13, fontWeight: 700, color: C.text }}
                    >
                      {selectedApp.productId?.institutionId?.name ||
                        "Institution Scope"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: `1px solid ${C.border}`,
                      paddingBottom: 10,
                    }}
                  >
                    <span style={{ fontSize: 13, color: C.textSub }}>
                      Requested Capital
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: C.blueLight,
                      }}
                    >
                      GH₵ {selectedApp.amount?.toLocaleString()}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: `1px solid ${C.border}`,
                      paddingBottom: 10,
                    }}
                  >
                    <span style={{ fontSize: 13, color: C.textSub }}>
                      Requested Tenure
                    </span>
                    <span
                      style={{ fontSize: 13, fontWeight: 700, color: C.text }}
                    >
                      {selectedApp.tenureMonths} Months
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ fontSize: 13, color: C.textSub }}>
                      Current State
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: getStatusColor(selectedApp.status),
                      }}
                    >
                      {selectedApp.status}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTop: `1px solid ${C.border}`,
                      paddingTop: 12,
                      marginTop: 2,
                    }}
                  >
                    <span style={{ fontSize: 13, color: C.textSub }}>
                      Assigned Underwriter
                    </span>
                    {user && ["InstitutionAdmin", "InsuranceAdmin", "BNPLAdmin"].includes(user.role) ? (
                      <select
                        value={selectedApp.assignedTo?._id || selectedApp.assignedTo || ""}
                        disabled={isAssigning}
                        onChange={async (e) => {
                          const val = e.target.value;
                          try {
                            const res = await assignApplication({
                              id: selectedApp._id,
                              assignedTo: val || null
                            }).unwrap();
                            if (res.success) {
                              toast.success("Assignee updated successfully");
                              setSelectedApp({
                                ...selectedApp,
                                assignedTo: val ? staffResponse?.data?.find((s: any) => s._id === val) : null
                              });
                              refetch();
                            } else {
                              toast.error(res.message || "Failed to update assignee");
                            }
                          } catch (err: any) {
                            toast.error(err.data?.message || "Error assigning case");
                          }
                        }}
                        style={{
                          background: C.bg,
                          color: C.text,
                          border: `1px solid ${C.border}`,
                          borderRadius: 8,
                          padding: "4px 8px",
                          fontSize: 12.5,
                          fontWeight: 700,
                          outline: "none",
                          cursor: "pointer"
                        }}
                      >
                        <option value="">Unassigned</option>
                        {staffResponse?.data?.map((staff: any) => (
                          <option key={staff._id} value={staff._id}>
                            {staff.firstName} {staff.lastName}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        style={{ fontSize: 13, fontWeight: 700, color: C.text }}
                      >
                        {selectedApp.assignedTo
                          ? `${selectedApp.assignedTo.firstName || selectedApp.assignedTo.email || ''} ${selectedApp.assignedTo.lastName || ''}`
                          : "Unassigned"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Decisive Actions */}
              <div
                style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24 }}
              >
                <p
                  style={{
                    margin: "0 0 16px",
                    fontSize: 10,
                    fontWeight: 900,
                    color: C.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Execute Operational Actions
                </p>

                {selectedApp.status === "Pending" && (
                  <button
                    onClick={() => handleReview(selectedApp._id, "UnderReview")}
                    disabled={isReviewing}
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: 12,
                      border: "none",
                      background: C.purple,
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: 13,
                      cursor: isReviewing ? "not-allowed" : "pointer",
                      marginBottom: 12,
                    }}
                  >
                    {isReviewing ? "Initiating..." : "Initiate Underwriting Review"}
                  </button>
                )}

                {(selectedApp.status === "Pending" ||
                  selectedApp.status === "UnderReview") && (
                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      onClick={() => handleReview(selectedApp._id, "Approved")}
                      disabled={isReviewing}
                      style={{
                        flex: 1,
                        padding: "14px",
                        borderRadius: 12,
                        border: "none",
                        background: C.emerald,
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: 13,
                        cursor: isReviewing ? "not-allowed" : "pointer",
                      }}
                    >
                      {isReviewing ? "Approving..." : "Approve Application"}
                    </button>

                    <button
                      onClick={() => {
                        const reason = prompt("Please enter rejection reason:");
                        if (reason) {
                          setRejectionReason(reason);
                          handleReview(selectedApp._id, "Rejected");
                        }
                      }}
                      disabled={isReviewing}
                      style={{
                        flex: 1,
                        padding: "14px",
                        borderRadius: 12,
                        border: `1.5px solid ${C.red}`,
                        background: "transparent",
                        color: C.red,
                        fontWeight: 800,
                        fontSize: 13,
                        cursor: isReviewing ? "not-allowed" : "pointer",
                      }}
                    >
                      {isReviewing ? "Rejecting..." : "Reject Application"}
                    </button>
                  </div>
                )}

                {selectedApp.status === "Approved" && (
                  <button
                    onClick={() => handleReview(selectedApp._id, "Disbursed")}
                    disabled={isReviewing}
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: 12,
                      border: "none",
                      background: C.blue,
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: 13,
                      cursor: isReviewing ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <ShieldRounded sx={{ fontSize: 16 }} /> {isReviewing ? "Disbursing..." : "Disburse Capital & Log Ledger"}
                  </button>
                )}

                {selectedApp.status === "Disbursed" && (
                  <button
                    onClick={() => handleReview(selectedApp._id, "Completed")}
                    disabled={isReviewing}
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: 12,
                      border: "none",
                      background: C.emerald,
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: 13,
                      cursor: isReviewing ? "not-allowed" : "pointer",
                    }}
                  >
                    {isReviewing ? "Completing..." : "Mark as Completed / Settled"}
                  </button>
                )}

                {selectedApp.status === "PaymentPending" && (
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: `1px solid ${C.border}`,
                      borderRadius: 12,
                      padding: 20,
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    <div>
                      <h4 style={{ margin: "0 0 4px", fontSize: 14, color: C.text, fontWeight: 700 }}>
                        Reminders Management
                      </h4>
                      <p style={{ margin: 0, fontSize: 12, color: C.textSub }}>
                        Flag this client to receive automated SMS payment reminders for their connection fee.
                      </p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8, background: "rgba(0,0,0,0.2)", padding: 12, borderRadius: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12.5, color: C.textSub }}>Queue Status</span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            background: selectedApp.flaggedForReminder ? C.emeraldPale : C.redPale,
                            color: selectedApp.flaggedForReminder ? C.emerald : C.red,
                            padding: "3px 8px",
                            borderRadius: 4,
                          }}
                        >
                          {selectedApp.flaggedForReminder ? "FLAGGED / QUEUED" : "NOT FLAGGED"}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12.5, color: C.textSub }}>Reminders Sent</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
                          {selectedApp.reminderSentCount || 0}
                        </span>
                      </div>
                      {selectedApp.lastReminderSentAt && (
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 12.5, color: C.textSub }}>Last Reminded</span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: C.textSub }}>
                            {new Date(selectedApp.lastReminderSentAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleToggleReminder(selectedApp._id)}
                      disabled={isTogglingReminder}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: 10,
                        border: "none",
                        background: selectedApp.flaggedForReminder ? C.red : C.blue,
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: 13,
                        cursor: "pointer",
                        transition: "0.2s",
                      }}
                    >
                      {isTogglingReminder
                        ? "Processing..."
                        : selectedApp.flaggedForReminder
                        ? "Remove from Reminder Queue"
                        : "Flag for SMS Reminders"}
                    </button>
                  </div>
                )}

                {(selectedApp.status === "Completed" ||
                  selectedApp.status === "Rejected" ||
                  selectedApp.status === "Cancelled") && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "16px 0",
                      border: `1.5px dashed ${C.borderStrong}`,
                      borderRadius: 12,
                    }}
                  >
                    <p style={{ margin: 0, fontSize: 13, color: C.textSub }}>
                      This application is closed ({selectedApp.status}).
                    </p>
                    <p
                      style={{
                        margin: "4px 0 16px",
                        fontSize: 11,
                        color: C.textMuted,
                      }}
                    >
                      You can restore rejected or cancelled applications back to
                      pending for a follow-up review.
                    </p>
                    {(selectedApp.status === "Rejected" ||
                      selectedApp.status === "Cancelled") && (
                      <button
                        onClick={() => handleRestore(selectedApp._id)}
                        disabled={isRestoring}
                        style={{
                          width: "100%",
                          padding: "14px",
                          borderRadius: 12,
                          border: "none",
                          background: C.blue,
                          color: "#fff",
                          fontWeight: 800,
                          fontSize: 13,
                          cursor: "pointer",
                        }}
                      >
                        {isRestoring
                          ? "Restoring…"
                          : "Restore Application to Pending"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </AdminShell>
  );
}

export default function AdminApplicationsPage() {
  return (
    <Suspense fallback={null}>
      <ApplicationsPageContent />
    </Suspense>
  );
}
