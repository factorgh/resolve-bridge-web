"use client";

import { useState, useEffect } from "react";
import AdminShell, { C, F } from "../components/AdminShell";
import {
  useGetAdminAnalyticsOverviewQuery,
  useGetAdminAnalyticsEventsQuery,
} from "@/lib/redux/api/analyticsApi";
import {
  RefreshRounded,
  BarChartRounded,
  TimelineRounded,
  InsightsRounded,
} from "@mui/icons-material";

const chartLabelColor = "#d1d5db";

export default function AdminAnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const {
    data: overviewResponse,
    isLoading: overviewLoading,
    refetch: refetchOverview,
  } = useGetAdminAnalyticsOverviewQuery();
  const {
    data: eventsResponse,
    isLoading: eventsLoading,
    refetch: refetchEvents,
  } = useGetAdminAnalyticsEventsQuery();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const overview = overviewResponse?.data;
  const events = eventsResponse?.data || [];

  const statusCounts = overview?.statusCounts || {};
  const monthlyData = overview?.monthlyDisbursements || [];
  const categoryData = overview?.transactionByCategory || [];

  const totalEvents = events.length;
  const statusTotal = Object.values(statusCounts).reduce(
    (sum: number, value: number) => sum + value,
    0,
  );
  const maxMonthly = Math.max(...monthlyData.map((m) => m.total), 1);
  const maxCategory = Math.max(...categoryData.map((c) => c.volume), 1);

  return (
    <AdminShell>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
          paddingBottom: 48,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            marginBottom: 30,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 32,
                  fontWeight: 300,
                  color: C.text,
                  fontFamily: F.serif,
                }}
              >
                Analytics & Reporting
              </h1>
              <p style={{ margin: "8px 0 0", fontSize: 13, color: C.textSub }}>
                Live trends, reporting dashboards, and system analytics for
                platform operations.
              </p>
            </div>
            <button
              onClick={() => {
                refetchOverview();
                refetchEvents();
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "12px 18px",
                background: C.surface,
                color: C.text,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              <RefreshRounded sx={{ fontSize: 18 }} /> Refresh Analytics
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 20,
                padding: 22,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 18,
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 10,
                      color: C.textMuted,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    Total Funding Pipeline
                  </p>
                  <h2
                    style={{ margin: "8px 0 0", fontSize: 28, color: C.text }}
                  >
                    {overview?.statusCounts ? statusTotal : "––"}
                  </h2>
                </div>
                <BarChartRounded sx={{ fontSize: 26, color: C.blueLight }} />
              </div>
              <p style={{ fontSize: 11, color: C.textSub }}>
                Active applications and pipeline records returned by your
                reporting engine.
              </p>
            </div>

            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 20,
                padding: 22,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 18,
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 10,
                      color: C.textMuted,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    Disbursed Capital
                  </p>
                  <h2
                    style={{
                      margin: "8px 0 0",
                      fontSize: 28,
                      color: C.emerald,
                    }}
                  >
                    GH₵{" "}
                    {overview?.totalApplicationVolume?.toLocaleString() || "0"}
                  </h2>
                </div>
                <TimelineRounded sx={{ fontSize: 26, color: C.emerald }} />
              </div>
              <p style={{ fontSize: 11, color: C.textSub }}>
                Completed finance approvals and disbursemements over the
                reporting period.
              </p>
            </div>

            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 20,
                padding: 22,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 18,
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 10,
                      color: C.textMuted,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    Recent Event Volume
                  </p>
                  <h2
                    style={{ margin: "8px 0 0", fontSize: 28, color: C.purple }}
                  >
                    {totalEvents}
                  </h2>
                </div>
                <InsightsRounded sx={{ fontSize: 26, color: C.purple }} />
              </div>
              <p style={{ fontSize: 11, color: C.textSub }}>
                Most recent administrative audit and analytics events.
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            marginBottom: 20,
          }}
        >
          <section
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 24,
              padding: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 800,
                  color: C.text,
                }}
              >
                Application Status Breakdown
              </h3>
              <span style={{ fontSize: 11, color: C.textMuted }}>
                {statusTotal} records
              </span>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {[
                "Pending",
                "UnderReview",
                "Approved",
                "Disbursed",
                "Rejected",
                "Completed",
                "Cancelled",
              ].map((item) => {
                const count = statusCounts[item] || 0;
                const width = statusTotal
                  ? Math.max(8, (count / statusTotal) * 100)
                  : 0;
                return (
                  <div
                    key={item}
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: 12, color: C.text }}>
                        {item}
                      </span>
                      <span style={{ fontSize: 11, color: C.textMuted }}>
                        {count}
                      </span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: 10,
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.06)",
                      }}
                    >
                      <div
                        style={{
                          width: `${width}%`,
                          height: "100%",
                          borderRadius: 999,
                          background:
                            item === "Rejected"
                              ? C.red
                              : item === "Approved"
                                ? C.emerald
                                : item === "Disbursed"
                                  ? C.blue
                                  : item === "UnderReview"
                                    ? C.purple
                                    : C.amber,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 24,
              padding: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 800,
                  color: C.text,
                }}
              >
                Monthly Disbursement Trend
              </h3>
              <span style={{ fontSize: 11, color: C.textMuted }}>
                Last 6 months
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 14,
                minHeight: 220,
              }}
            >
              {monthlyData.map((item) => {
                const height = maxMonthly
                  ? Math.max(28, (item.total / maxMonthly) * 180)
                  : 0;
                return (
                  <div
                    key={item.label}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height,
                        background: C.blue,
                        borderRadius: 16,
                        transition: "height 0.25s ease",
                      }}
                    />
                    <span
                      style={{
                        marginTop: 12,
                        fontSize: 10,
                        color: C.textMuted,
                        textAlign: "center",
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: 20,
          }}
        >
          <section
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 24,
              padding: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 800,
                  color: C.text,
                }}
              >
                Transaction Volume by Category
              </h3>
              <span style={{ fontSize: 11, color: C.textMuted }}>
                {categoryData.length} categories
              </span>
            </div>
            <div style={{ display: "grid", gap: 16 }}>
              {categoryData.map((category) => {
                const width = maxCategory
                  ? Math.max(12, (category.volume / maxCategory) * 100)
                  : 0;
                return (
                  <div
                    key={category._id}
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{ fontSize: 13, fontWeight: 700, color: C.text }}
                      >
                        {category._id}
                      </span>
                      <span style={{ fontSize: 12, color: C.textMuted }}>
                        GH₵ {category.volume.toLocaleString()}
                      </span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: 12,
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.06)",
                      }}
                    >
                      <div
                        style={{
                          width: `${width}%`,
                          height: "100%",
                          borderRadius: 999,
                          background: C.emerald,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 24,
              padding: 24,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 800,
                  color: C.text,
                }}
              >
                Recent Audit Events
              </h3>
              <span style={{ fontSize: 11, color: C.textMuted }}>
                {totalEvents} entries
              </span>
            </div>
            <div
              style={{
                overflowY: "auto",
                maxHeight: 420,
                display: "grid",
                gap: 14,
              }}
            >
              {eventsLoading ? (
                <p style={{ color: C.textSub, fontSize: 12 }}>
                  Loading event history…
                </p>
              ) : events.length === 0 ? (
                <p style={{ color: C.textSub, fontSize: 12 }}>
                  No analytics events captured yet.
                </p>
              ) : (
                events.map((event, index) => (
                  <div
                    key={index}
                    style={{
                      border: `1px solid ${C.border}`,
                      borderRadius: 16,
                      padding: 14,
                      background: "rgba(255,255,255,0.02)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{ fontSize: 12, fontWeight: 700, color: C.text }}
                      >
                        {event.action}
                      </span>
                      <span style={{ fontSize: 10, color: C.textMuted }}>
                        {new Date(event.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: "8px 0 0",
                        fontSize: 11,
                        color: C.textSub,
                        lineHeight: 1.5,
                      }}
                    >
                      {event.details}
                    </p>
                    <p
                      style={{
                        margin: "8px 0 0",
                        fontSize: 10,
                        color: C.textMuted,
                      }}
                    >
                      {event.adminId?.firstName} {event.adminId?.lastName} ·{" "}
                      {event.adminId?.role}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
