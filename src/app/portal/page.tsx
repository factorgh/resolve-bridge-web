'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import PortalShell from './components/PortalShell';
import { useGetDashboardMetricsQuery, useGetNewsArticlesQuery, useGetMeQuery } from '@/lib/redux/api/userApi';
import { useGetApplicationsQuery } from '@/lib/redux/api/applicationApi';
import { useGetTransactionsQuery, useCreateTransactionMutation } from '@/lib/redux/api/transactionApi';
import { useGetInstitutionsQuery } from '@/lib/redux/api/productApi';
import { toast } from 'react-hot-toast';
import { Drawer, IconButton } from '@mui/material';
import { 
  CloseRounded,
  ShieldRounded,
} from '@mui/icons-material';

/* ─── Dashboard Overview Component ─────────────────────────────────────── */

function Dashboard({ onCardClick }: { onCardClick: (action: string) => void }) {
  const router = useRouter();
  const { data: userData } = useGetMeQuery();
  const user = userData?.data;
  const firstName = user?.firstName || 'Thethrees';

  const { data: metricsResponse, isLoading: metricsLoading } = useGetDashboardMetricsQuery();
  const { data: newsResponse } = useGetNewsArticlesQuery();
  const metrics = metricsResponse?.data;
  const articles = newsResponse?.data || [];

  const { data: appsResponse } = useGetApplicationsQuery();
  const { data: txResponse } = useGetTransactionsQuery();
  const { data: instsResponse } = useGetInstitutionsQuery();

  const [selectedBlog, setSelectedBlog] = useState<any>(null);

  // Health score calculation
  const rawScore = metrics?.healthIndex ?? 0;
  const score = Math.max(0, Math.min(100, rawScore));
  
  // Semicircle gauge calculation
  // Total arc length for radius 45 is ~141.37
  const strokeDashoffset = 141.37 - (141.37 * (score / 100));

  return (
    <div className="portal-overview-container">
      {/* 1. Greeting Row */}
      <div className="portal-greeting-row">
        <div>
          <h1 className="portal-greeting-title">
            Good afternoon, {firstName}
          </h1>
          <p className="portal-greeting-subtitle">
            Here is where your money stands today.
          </p>
        </div>

        <button
          onClick={() => router.push('/portal/apply-loan')}
          className="portal-apply-btn"
        >
          Apply for a loan
        </button>
      </div>

      {/* 2. Three Stat Cards */}
      <div className="portal-stats-grid">
        {/* Cash flow Card */}
        <div 
          className="portal-stat-card clickable"
          onClick={() => onCardClick('cashflow')}
        >
          <div className="portal-stat-header">
            <span className="portal-stat-label">Cash flow</span>
            <div className="portal-stat-icon-tile">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2f5bea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
          </div>
          <div className="portal-stat-value">
            GH₵ {metrics?.cashFlow ? Number(metrics.cashFlow).toFixed(2) : '0.00'}
          </div>
          <div className="portal-stat-sub green">
            Available now
          </div>
        </div>

        {/* Net worth Card */}
        <div className="portal-stat-card">
          <div className="portal-stat-header">
            <span className="portal-stat-label">Net worth</span>
            <div className="portal-stat-icon-tile">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2f5bea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
          </div>
          <div className="portal-stat-value">
            GH₵ {metrics?.netWorth ? metrics.netWorth.toLocaleString() : '0'}
          </div>
          <div className="portal-stat-sub mute">
            Add assets to track
          </div>
        </div>

        {/* Loan offers Card */}
        <div 
          className="portal-stat-card clickable"
          onClick={() => router.push('/portal/marketplace')}
        >
          <div className="portal-stat-header">
            <span className="portal-stat-label">Loan offers</span>
            <div className="portal-stat-icon-tile">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2f5bea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </div>
          <div className="portal-stat-value">
            Searching
          </div>
          <div className="portal-stat-sub mute">
            Checking institutions
          </div>
        </div>
      </div>

      {/* 3. Two-Column Row (1fr / 1.5fr) */}
      <div className="portal-two-col-grid">
        {/* Left Card: Financial Health Index */}
        <div className="portal-card portal-health-card">
          <h2 className="portal-card-header-title">Financial health index</h2>
          
          <div className="portal-health-content">
            {/* Semicircle Gauge (120px wide) */}
            <div className="portal-gauge-wrapper">
              <svg width="120" height="65" viewBox="0 0 100 55" className="portal-gauge-svg">
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#e4e8f1"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#1f8a5b"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="125.66"
                  strokeDashoffset={125.66 - (125.66 * (score / 100))}
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
              </svg>
            </div>

            {/* Score */}
            <div className="portal-health-score-block">
              <span className="portal-health-score-num">{score}</span>
              <span className="portal-health-score-max">/ 100</span>
            </div>
          </div>

          <p className="portal-health-helper">
            Add income and verify your employer to build your score.
          </p>

          <button
            onClick={() => router.push('/portal/marketplace')}
            className="portal-health-action-btn"
          >
            Compare real offers
          </button>
        </div>

        {/* Right Card: Instant Health Quote */}
        <div className="portal-card portal-quote-card">
          <div className="portal-quote-badge">New</div>
          <h2 className="portal-quote-title">Instant health quote</h2>
          <p className="portal-quote-desc">
            Get covered in 60 seconds with Enterprise Resolve Health premiums.
          </p>
          <button
            onClick={() => router.push('/portal/insurance-quote')}
            className="portal-quote-btn"
          >
            Get a quote
          </button>
        </div>
      </div>

      {/* 4. Advisory Row (Three Equal Cards) */}
      <div className="portal-advisory-grid">
        {/* Advisory 1: Rate */}
        <div className="portal-card portal-advisory-card">
          <div>
            <h3 className="portal-advisory-title">Unlock a 5.2% better rate</h3>
            <p className="portal-advisory-desc">
              Complete employment verification to see specialist rates.
            </p>
          </div>
          <button
            onClick={() => router.push('/portal/documents')}
            className="portal-advisory-btn dark"
          >
            Go to Vault
          </button>
        </div>

        {/* Advisory 2: Calculator */}
        <div className="portal-card portal-advisory-card">
          <div>
            <h3 className="portal-advisory-title">Loan calculator</h3>
            <p className="portal-advisory-desc">
              Estimate your monthly payments before you apply.
            </p>
          </div>
          <button
            onClick={() => router.push('/portal/calculator')}
            className="portal-advisory-btn soft"
          >
            Calculate now
          </button>
        </div>

        {/* Advisory 3: Insurance Savings */}
        <div className="portal-card portal-advisory-card">
          <div>
            <h3 className="portal-advisory-title">Insurance savings</h3>
            <p className="portal-advisory-desc">
              Save <strong className="portal-highlight-green">GH₵ 120/mo</strong> by switching to Resolve Health cover.
            </p>
          </div>
          <button
            onClick={() => router.push('/portal/marketplace?type=insurance')}
            className="portal-advisory-btn soft"
          >
            Explore protection
          </button>
        </div>
      </div>

      {/* Article / News Blog Modal if triggered */}
      {selectedBlog && (
        <div 
          onClick={() => setSelectedBlog(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(16,26,51,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: 16,
              maxWidth: 520,
              width: '100%',
              padding: 28,
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              border: '1px solid #e4e8f1'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#2f5bea', background: '#e8eefd', padding: '4px 10px', borderRadius: 9999 }}>
                {selectedBlog.tag || 'Insight'}
              </span>
              <IconButton onClick={() => setSelectedBlog(null)} size="small">
                <CloseRounded sx={{ fontSize: 18 }} />
              </IconButton>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#101a33', margin: '0 0 12px', fontFamily: "'Fraunces', Georgia, serif" }}>
              {selectedBlog.title}
            </h2>
            <p style={{ fontSize: 14, color: '#6b7690', lineHeight: 1.6, margin: '0 0 24px' }}>
              {selectedBlog.content}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setSelectedBlog(null)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: 9,
                  background: '#2f5bea',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .portal-overview-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 32px 36px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 24px;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* 1. Greeting Row */
        .portal-greeting-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .portal-greeting-title {
          margin: 0;
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(30px, 4vw, 42px);
          font-weight: 600;
          color: #101a33;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }

        .portal-greeting-subtitle {
          margin: 6px 0 0;
          font-size: 14px;
          color: #6b7690;
          font-weight: 400;
        }

        .portal-apply-btn {
          background-color: #2f5bea;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          padding: 11px 20px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 150ms ease;
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .portal-apply-btn:hover {
          background-color: #2449c4;
        }
        .portal-apply-btn:focus-visible {
          outline: 2px solid #2f5bea;
          outline-offset: 2px;
        }

        /* 2. Three Stat Cards */
        .portal-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .portal-stat-card {
          background-color: #ffffff;
          border: 1px solid #e4e8f1;
          border-radius: 16px;
          padding: 22px 24px;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          transition: border-color 150ms ease;
        }
        .portal-stat-card.clickable {
          cursor: pointer;
        }
        .portal-stat-card.clickable:hover {
          border-color: #cbd5e1;
        }

        .portal-stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .portal-stat-label {
          font-size: 13px;
          font-weight: 500;
          color: #6b7690;
        }

        .portal-stat-icon-tile {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background-color: #e8eefd;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .portal-stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #101a33;
          letter-spacing: -0.02em;
          margin-bottom: 6px;
          line-height: 1.2;
        }

        .portal-stat-sub {
          font-size: 12px;
          font-weight: 500;
        }
        .portal-stat-sub.green {
          color: #1f8a5b;
          font-weight: 600;
        }
        .portal-stat-sub.mute {
          color: #6b7690;
        }

        /* 3. Two-Column Row */
        .portal-two-col-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 16px;
        }

        .portal-card {
          background-color: #ffffff;
          border: 1px solid #e4e8f1;
          border-radius: 16px;
          padding: 24px 28px;
          box-sizing: border-box;
        }

        .portal-card-header-title {
          margin: 0 0 16px;
          font-size: 14.5px;
          font-weight: 700;
          color: #101a33;
        }

        .portal-health-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .portal-health-content {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: 12px;
        }

        .portal-gauge-wrapper {
          width: 120px;
          height: 65px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .portal-gauge-svg {
          width: 120px;
          height: 65px;
          overflow: visible;
        }

        .portal-health-score-block {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .portal-health-score-num {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 44px;
          font-weight: 600;
          color: #101a33;
          line-height: 1;
        }

        .portal-health-score-max {
          font-size: 15px;
          font-weight: 500;
          color: #6b7690;
        }

        .portal-health-helper {
          margin: 0 0 20px;
          font-size: 12.5px;
          color: #6b7690;
          line-height: 1.45;
        }

        .portal-health-action-btn {
          width: 100%;
          background-color: #2f5bea;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 150ms ease;
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .portal-health-action-btn:hover {
          background-color: #2449c4;
        }
        .portal-health-action-btn:focus-visible {
          outline: 2px solid #2f5bea;
          outline-offset: 2px;
        }

        /* Right Card: Instant Health Quote */
        .portal-quote-card {
          background: linear-gradient(120deg, #1f7a54 0%, #2a5fb0 50%, #2f4fe0 100%);
          color: #ffffff;
          border: none;
          padding: 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
          min-height: 220px;
        }

        .portal-quote-badge {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 9999px;
          margin-bottom: 12px;
          display: inline-block;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        .portal-quote-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 30px;
          font-weight: 600;
          color: #ffffff;
          line-height: 1.2;
          margin: 0 0 8px;
        }

        .portal-quote-desc {
          font-size: 13.5px;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.5;
          margin: 0 0 24px;
          max-width: 85%;
        }

        .portal-quote-btn {
          background-color: #ffffff;
          color: #101a33;
          border: none;
          border-radius: 10px;
          padding: 10px 20px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 150ms ease, opacity 150ms ease;
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .portal-quote-btn:hover {
          background-color: #f8fafc;
        }
        .portal-quote-btn:focus-visible {
          outline: 2px solid #ffffff;
          outline-offset: 2px;
        }

        /* 4. Advisory Row */
        .portal-advisory-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .portal-advisory-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 170px;
        }

        .portal-advisory-title {
          margin: 0 0 8px;
          font-size: 14px;
          font-weight: 700;
          color: #101a33;
        }

        .portal-advisory-desc {
          margin: 0 0 18px;
          font-size: 12.5px;
          color: #6b7690;
          line-height: 1.45;
        }

        .portal-highlight-green {
          color: #1f8a5b;
          font-weight: 700;
        }

        .portal-advisory-btn {
          align-self: flex-start;
          border-radius: 9px;
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: 150ms ease;
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .portal-advisory-btn.dark {
          background-color: #101a33;
          color: #ffffff;
          border: none;
        }
        .portal-advisory-btn.dark:hover {
          background-color: #1e2a48;
        }
        .portal-advisory-btn.soft {
          background-color: #e8eefd;
          color: #2f5bea;
          border: none;
        }
        .portal-advisory-btn.soft:hover {
          background-color: #dbe4fc;
        }
        .portal-advisory-btn:focus-visible {
          outline: 2px solid #2f5bea;
          outline-offset: 2px;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1000px) {
          .portal-stats-grid {
            grid-template-columns: 1fr;
          }
          .portal-two-col-grid {
            grid-template-columns: 1fr;
          }
          .portal-advisory-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 800px) {
          .portal-overview-container {
            padding: 20px 18px;
          }
          .portal-greeting-title {
            font-size: 28px;
          }
          .portal-apply-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

/* ─── Main Portal Controller ───────────────────────────────────────────── */

export default function PortalPage() {
  const router = useRouter();
  const [cashFlowOpen, setCashFlowOpen] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('rb_token') : null;
    if (!token && typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('rb_user');
      if (!storedUser) {
        router.replace('/login');
      }
    }
  }, [router]);

  return (
    <PortalShell title="Overview">
      <Dashboard onCardClick={(action) => {
        if (action === 'cashflow') setCashFlowOpen(true);
      }} />

      {/* Cash Flow Details Modal */}
      {cashFlowOpen && (
        <div 
          onClick={() => setCashFlowOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(16,26,51,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: 16,
              maxWidth: 700,
              width: '100%',
              padding: 32,
              border: '1px solid #e4e8f1',
              boxShadow: '0 20px 50px rgba(16,26,51,0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#101a33', fontFamily: "'Fraunces', Georgia, serif" }}>
                Cash flow statement
              </h2>
              <button
                onClick={() => setCashFlowOpen(false)}
                style={{
                  background: '#f3f5fa',
                  border: 'none',
                  borderRadius: 8,
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: '#6b7690'
                }}
              >
                Close
              </button>
            </div>
            <p style={{ fontSize: 13.5, color: '#6b7690', lineHeight: 1.5, margin: '0 0 20px' }}>
              Your verified income transactions, scheduled loan repayments, and recurring subscriptions are synchronized daily.
            </p>
            <div style={{ background: '#f8fafc', border: '1px solid #e4e8f1', borderRadius: 12, padding: 24, textAlign: 'center', color: '#6b7690', fontSize: 13 }}>
              Full cash flow ledger analysis is up to date.
            </div>
          </div>
        </div>
      )}
    </PortalShell>
  );
}
