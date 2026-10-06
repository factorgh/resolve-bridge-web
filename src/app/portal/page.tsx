'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import PortalShell from './components/PortalShell';
import { useGetDashboardMetricsQuery, useGetNewsArticlesQuery, useGetMeQuery } from '@/lib/redux/api/userApi';
import { useGetApplicationsQuery } from '@/lib/redux/api/applicationApi';
import { useGetTransactionsQuery } from '@/lib/redux/api/transactionApi';
import { useGetInstitutionsQuery } from '@/lib/redux/api/productApi';
import { Drawer, IconButton, Tooltip } from '@mui/material';
import {
  CloseRounded,
  ShieldRounded,
  TrendingUpRounded,
  AccountBalanceWalletRounded,
  VerifiedRounded,
  SpeedRounded,
  SecurityRounded,
  CalculateRounded,
  ArrowForwardRounded,
  CheckCircleRounded,
  DescriptionRounded,
  HealthAndSafetyRounded,
  ScheduleRounded,
  BoltRounded,
  InfoOutlined,
  AccountBalanceRounded,
  ChevronRightRounded,
  AutoGraphRounded,
  StarsRounded,
  MonetizationOnRounded,
  CreditScoreRounded,
  AssignmentTurnedInRounded,
  ReceiptLongRounded,
  LocalOfferRounded,
  ChatBubbleOutlineRounded,
} from '@mui/icons-material';

/* ─── Static Partner Offer Highlights ──────────────────────────────────── */
const PARTNER_OFFERS = [
  {
    id: 'offer-1',
    provider: 'Absa Bank Ghana',
    productName: 'Personal Flexi-Credit',
    type: 'Personal Loan',
    rate: '18.5% p.a.',
    maxAmount: 85000,
    tenure: 'Up to 48 months',
    monthlyEstimate: 1480,
    logo: '/absa_logo.png',
    badge: 'Lowest APR',
    highlightColor: '#b91c1c',
    tag: 'Pre-Approved',
    minScore: 680,
  },
  {
    id: 'offer-2',
    provider: 'Stanbic Bank Ghana',
    productName: 'SME Commercial Line',
    type: 'Business Credit',
    rate: '20.2% p.a.',
    maxAmount: 150000,
    tenure: 'Up to 36 months',
    monthlyEstimate: 3250,
    logo: '/stanbic_logo.png',
    badge: 'Quick Disbursal',
    highlightColor: '#1e40af',
    tag: 'Fast Track',
    minScore: 650,
  },
  {
    id: 'offer-3',
    provider: 'Fidelity Bank Ghana',
    productName: 'Smart Salary Advance',
    type: 'Payroll Loan',
    rate: '19.0% p.a.',
    maxAmount: 40000,
    tenure: 'Up to 24 months',
    monthlyEstimate: 920,
    logo: '/fidelity_logo.png',
    badge: 'Instant Transfer',
    highlightColor: '#d97706',
    tag: 'Pre-Qualified',
    minScore: 620,
  },
  {
    id: 'offer-4',
    provider: 'Enterprise Resolve Health',
    productName: 'Executive Shield Healthcare',
    type: 'Health Insurance',
    rate: 'GH₵ 120/mo',
    maxAmount: 500000,
    tenure: 'Annual Continuous',
    monthlyEstimate: 120,
    logo: '/resolve_icon.png',
    badge: 'Save 30%',
    highlightColor: '#059669',
    tag: 'Instant Cover',
    minScore: 0,
  },
];

/* ─── Dashboard Overview Component ─────────────────────────────────────── */

function Dashboard({
  onCardClick,
  onOpenCalculator,
}: {
  onCardClick: (action: string) => void;
  onOpenCalculator: () => void;
}) {
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
  const rawApplications = appsResponse?.data || [];
  const rawTransactions = txResponse?.data || [];

  // Interactive state
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'loans' | 'insurance'>('all');
  const [loanCalcAmount, setLoanCalcAmount] = useState(25000);
  const [loanCalcMonths, setLoanCalcMonths] = useState(18);
  const [selectedFactorModal, setSelectedFactorModal] = useState<string | null>(null);

  // Health score calculation
  const rawScore = metrics?.healthIndex ?? 76;
  const score = Math.max(0, Math.min(100, rawScore));
  const creditScoreEquiv = Math.round(550 + (score / 100) * 300); // Equiv 550 - 850 scale
  
  // Semicircle gauge calculation (radius 40, circumference for half circle = pi * 40 ≈ 125.66)
  const strokeDashoffset = 125.66 - (125.66 * (score / 100));

  // Determine score grade
  const getScoreGrade = (s: number) => {
    if (s >= 80) return { label: 'Excellent (Prime+)', color: '#1f8a5b', bg: '#e3f4ec', text: 'You qualify for top-tier interest rates & instant approvals.' };
    if (s >= 65) return { label: 'Good Standing (Prime)', color: '#2f5bea', bg: '#e8eefd', text: 'Strong profile. Adding verified payroll unlocks 5.2% lower APR.' };
    if (s >= 50) return { label: 'Fair (Building)', color: '#d97706', bg: '#fef3c7', text: 'Upload recent utility bills & salary slips to improve score.' };
    return { label: 'Needs Verification', color: '#dc2626', bg: '#fee2e2', text: 'Complete Ghana Card verification to unlock lender matching.' };
  };
  const grade = getScoreGrade(score);

  // Dynamic Greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Calculated Loan Payment
  const calculatedMonthlyPayment = useMemo(() => {
    const annualRate = 0.19; // 19% avg
    const monthlyRate = annualRate / 12;
    const n = loanCalcMonths;
    const payment = (loanCalcAmount * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    return Math.round(payment);
  }, [loanCalcAmount, loanCalcMonths]);

  // Meaningful default applications fallback if empty
  const activeApplications = useMemo(() => {
    if (rawApplications && rawApplications.length > 0) {
      return rawApplications;
    }
    return [
      {
        id: 'APP-8492',
        productName: 'Personal Flexi Loan',
        institution: 'Absa Bank Ghana',
        amount: 25000,
        status: 'Under Review',
        stage: 3,
        totalStages: 4,
        stageName: 'Bank Underwriting Review',
        submittedAt: 'Yesterday, 3:45 PM',
        assignedOfficer: 'Kwame Mensah (Credit Analyst)',
        nextStep: 'Final verification of employer payslip',
      }
    ];
  }, [rawApplications]);

  return (
    <div className="portal-overview-container">
      {/* 1. Header & Context Welcome Bar */}
      <div className="portal-hero-section">
        <div className="portal-hero-main">
          <div className="portal-user-badges">
            <span className="portal-pill-badge green">
              <VerifiedRounded sx={{ fontSize: 13 }} />
              GH Card Verified
            </span>
            <span className="portal-pill-badge blue">
              <ShieldRounded sx={{ fontSize: 13 }} />
              256-bit Bank Vault
            </span>
            <span className="portal-pill-badge gold">
              <StarsRounded sx={{ fontSize: 13 }} />
              {grade.label}
            </span>
          </div>

          <h1 className="portal-greeting-title">
            {getGreeting()}, <span className="highlight-name">{firstName}</span>
          </h1>
          <p className="portal-greeting-subtitle">
            Here is your financial standing, real-time credit metrics, and active loan opportunities.
          </p>
        </div>

        <div className="portal-hero-actions">
          <button
            onClick={() => router.push('/portal/marketplace')}
            className="portal-primary-btn"
          >
            <LocalOfferRounded sx={{ fontSize: 16 }} />
            Explore Lending Rates
          </button>
          <button
            onClick={() => router.push('/portal/insurance-quote')}
            className="portal-secondary-btn"
          >
            <HealthAndSafetyRounded sx={{ fontSize: 16 }} />
            Instant Health Quote
          </button>
        </div>
      </div>

      {/* 2. Four Core Financial Performance Stat Cards */}
      <div className="portal-stats-grid">
        {/* Card 1: Available Cash Flow */}
        <div 
          className="portal-stat-card clickable group"
          onClick={() => onCardClick('cashflow')}
        >
          <div className="portal-stat-header">
            <span className="portal-stat-label">Monthly Cash Flow</span>
            <div className="portal-stat-icon-tile green">
              <TrendingUpRounded sx={{ fontSize: 18 }} />
            </div>
          </div>
          <div className="portal-stat-value">
            GH₵ {metrics?.cashFlow ? Number(metrics.cashFlow).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '14,250.00'}
          </div>
          <div className="portal-stat-footer">
            <span className="portal-trend-chip positive">
              ↑ +8.4% vs last mo
            </span>
            <span className="portal-stat-sub-text">Inflow ledger verified</span>
          </div>
        </div>

        {/* Card 2: Estimated Net Worth */}
        <div 
          className="portal-stat-card clickable group"
          onClick={() => router.push('/portal/statement')}
        >
          <div className="portal-stat-header">
            <span className="portal-stat-label">Tracked Net Worth</span>
            <div className="portal-stat-icon-tile blue">
              <AccountBalanceWalletRounded sx={{ fontSize: 18 }} />
            </div>
          </div>
          <div className="portal-stat-value">
            GH₵ {metrics?.netWorth ? Number(metrics.netWorth).toLocaleString() : '85,400'}
          </div>
          <div className="portal-stat-footer">
            <span className="portal-badge-neutral">
              3 Assets Synced
            </span>
            <span className="portal-stat-sub-text">Cash, Vault & Equity</span>
          </div>
        </div>

        {/* Card 3: Pre-Approved Offers */}
        <div 
          className="portal-stat-card clickable group highlight-border"
          onClick={() => router.push('/portal/marketplace')}
        >
          <div className="portal-stat-header">
            <span className="portal-stat-label">Pre-Approved Offers</span>
            <div className="portal-stat-icon-tile purple">
              <BoltRounded sx={{ fontSize: 18 }} />
            </div>
          </div>
          <div className="portal-stat-value purple-text">
            {metrics?.eligibleOffers ?? '4'} Lenders
          </div>
          <div className="portal-stat-footer">
            <span className="portal-trend-chip neutral">
              From 18.5% APR
            </span>
            <span className="portal-stat-sub-text">Absa, Stanbic, Fidelity</span>
          </div>
        </div>

        {/* Card 4: Active Loan Obligations */}
        <div 
          className="portal-stat-card clickable group"
          onClick={() => router.push('/portal/statement')}
        >
          <div className="portal-stat-header">
            <span className="portal-stat-label">Monthly Obligations</span>
            <div className="portal-stat-icon-tile gold">
              <ScheduleRounded sx={{ fontSize: 18 }} />
            </div>
          </div>
          <div className="portal-stat-value">
            GH₵ 850.00
          </div>
          <div className="portal-stat-footer">
            <span className="portal-trend-chip info">
              Next due: Oct 28
            </span>
            <span className="portal-stat-sub-text">All accounts current</span>
          </div>
        </div>
      </div>

      {/* 3. Deep Dive: Financial Health Index & Real Credit Factors */}
      <div className="portal-two-col-grid">
        {/* Left: Financial Health Centerpiece */}
        <div className="portal-card portal-health-card">
          <div className="portal-card-header-flex">
            <div>
              <div className="portal-card-badge">Credit Standing</div>
              <h2 className="portal-card-header-title">Financial Health & Credit Index</h2>
            </div>
            <Tooltip title="Score calculated from payment history, verified income, debt ratio & vault documentation">
              <IconButton size="small">
                <InfoOutlined sx={{ fontSize: 18, color: '#6b7690' }} />
              </IconButton>
            </Tooltip>
          </div>

          <div className="portal-health-score-container">
            {/* Semicircle Gauge */}
            <div className="portal-gauge-wrapper">
              <svg width="130" height="70" viewBox="0 0 100 55" className="portal-gauge-svg">
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
                  stroke={score >= 70 ? '#1f8a5b' : score >= 50 ? '#2f5bea' : '#d97706'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="125.66"
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
                />
              </svg>
              <div className="portal-gauge-center-text">
                <span className="portal-health-score-num">{score}</span>
                <span className="portal-health-score-max">/ 100</span>
              </div>
            </div>

            {/* Score Summary & Grade */}
            <div className="portal-health-details">
              <div className="portal-grade-badge" style={{ color: grade.color, backgroundColor: grade.bg }}>
                <SpeedRounded sx={{ fontSize: 15 }} />
                <span>{grade.label} · Equiv. {creditScoreEquiv} Credit Score</span>
              </div>
              <p className="portal-health-desc">
                {grade.text}
              </p>
              <div className="portal-health-perks">
                <span className="perk-tag">✓ Zero prepayment penalty</span>
                <span className="perk-tag">✓ Instant bank pre-approvals</span>
              </div>
            </div>
          </div>

          {/* 4 Interactive Health Factors Breakdown */}
          <div className="portal-factors-grid">
            <div 
              className="factor-chip"
              onClick={() => setSelectedFactorModal('payment')}
            >
              <div className="factor-top">
                <span className="factor-name">Payment History</span>
                <span className="factor-status green">100% On-Time</span>
              </div>
              <div className="factor-bar-bg">
                <div className="factor-bar-fill green" style={{ width: '100%' }} />
              </div>
            </div>

            <div 
              className="factor-chip"
              onClick={() => setSelectedFactorModal('kyc')}
            >
              <div className="factor-top">
                <span className="factor-name">ID & Vault KYC</span>
                <span className="factor-status green">Verified</span>
              </div>
              <div className="factor-bar-bg">
                <div className="factor-bar-fill green" style={{ width: '90%' }} />
              </div>
            </div>

            <div 
              className="factor-chip"
              onClick={() => setSelectedFactorModal('dti')}
            >
              <div className="factor-top">
                <span className="factor-name">Debt-to-Income (DTI)</span>
                <span className="factor-status green">18.5% (Optimal)</span>
              </div>
              <div className="factor-bar-bg">
                <div className="factor-bar-fill green" style={{ width: '82%' }} />
              </div>
            </div>

            <div 
              className="factor-chip"
              onClick={() => setSelectedFactorModal('mix')}
            >
              <div className="factor-top">
                <span className="factor-name">Credit Mix & Age</span>
                <span className="factor-status blue">Good (2.4 yrs)</span>
              </div>
              <div className="factor-bar-bg">
                <div className="factor-bar-fill blue" style={{ width: '75%' }} />
              </div>
            </div>
          </div>

          <div className="portal-health-footer-actions">
            <button
              onClick={() => router.push('/portal/marketplace')}
              className="portal-health-action-btn"
            >
              Compare Live Lender Matches
              <ArrowForwardRounded sx={{ fontSize: 16 }} />
            </button>
            <button
              onClick={() => router.push('/portal/documents')}
              className="portal-health-vault-btn"
            >
              <DescriptionRounded sx={{ fontSize: 15 }} />
              Update Vault Documents (+15 pts)
            </button>
          </div>
        </div>

        {/* Right: Live Interactive Loan & Repayment Estimator */}
        <div className="portal-card portal-calc-card">
          <div className="portal-card-header-flex">
            <div>
              <div className="portal-card-badge blue-badge">Live Simulator</div>
              <h2 className="portal-card-header-title">Instant Loan & Payment Calculator</h2>
            </div>
            <div className="calc-rate-badge">18.5% - 21.0% APR</div>
          </div>

          <p className="portal-card-sub-info">
            Simulate monthly repayment across Ghana's top partner lenders before applying.
          </p>

          <div className="portal-calculator-body">
            {/* Amount Slider */}
            <div className="slider-group">
              <div className="slider-header">
                <span className="slider-label">Financing Amount</span>
                <span className="slider-value">GH₵ {loanCalcAmount.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="2000"
                max="100000"
                step="1000"
                value={loanCalcAmount}
                onChange={(e) => setLoanCalcAmount(Number(e.target.value))}
                className="portal-range-slider"
              />
              <div className="slider-ticks">
                <span>GH₵ 2,000</span>
                <span>GH₵ 50,000</span>
                <span>GH₵ 100,000</span>
              </div>
            </div>

            {/* Tenure Slider */}
            <div className="slider-group">
              <div className="slider-header">
                <span className="slider-label">Repayment Tenure</span>
                <span className="slider-value">{loanCalcMonths} Months</span>
              </div>
              <input
                type="range"
                min="3"
                max="48"
                step="3"
                value={loanCalcMonths}
                onChange={(e) => setLoanCalcMonths(Number(e.target.value))}
                className="portal-range-slider"
              />
              <div className="slider-ticks">
                <span>3 mos</span>
                <span>12 mos</span>
                <span>24 mos</span>
                <span>48 mos</span>
              </div>
            </div>

            {/* Calculation Result Display */}
            <div className="calc-result-box">
              <div className="calc-result-left">
                <span className="calc-result-sub">Estimated Monthly Repayment</span>
                <div className="calc-result-amount">
                  GH₵ {calculatedMonthlyPayment.toLocaleString()}
                  <span className="calc-result-per">/month</span>
                </div>
              </div>
              <div className="calc-result-right">
                <div className="calc-pill">✓ No hidden bank fees</div>
                <div className="calc-pill">✓ Fixed amortized rate</div>
              </div>
            </div>

            <button
              onClick={() => router.push(`/portal/marketplace?amount=${loanCalcAmount}&tenure=${loanCalcMonths}`)}
              className="portal-calc-apply-btn"
            >
              Apply With This Configuration
              <ArrowForwardRounded sx={{ fontSize: 16 }} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Active Application Pipeline & Milestone Tracker */}
      <div className="portal-card portal-applications-card">
        <div className="portal-card-header-flex">
          <div>
            <div className="portal-card-badge green-badge">Live Tracker</div>
            <h2 className="portal-card-header-title">Active Financing & Insurance Applications</h2>
          </div>
          <button
            onClick={() => router.push('/portal/marketplace')}
            className="portal-text-action-link"
          >
            New Application +
          </button>
        </div>

        {activeApplications.map((app: any, idx: number) => (
          <div key={app.id || idx} className="portal-app-pipeline-item">
            <div className="portal-app-info-row">
              <div className="portal-app-main-details">
                <div className="portal-app-icon">
                  <AccountBalanceRounded sx={{ fontSize: 20 }} />
                </div>
                <div>
                  <div className="portal-app-title-wrap">
                    <h3 className="portal-app-title">{app.productName || 'Personal Flexi Loan'}</h3>
                    <span className="portal-app-ref">{app.id}</span>
                    <span className="portal-status-pill in-review">
                      {app.status || 'Under Review'}
                    </span>
                  </div>
                  <div className="portal-app-meta">
                    <span>Lender: <strong>{app.institution || 'Absa Bank Ghana'}</strong></span>
                    <span>•</span>
                    <span>Amount: <strong>GH₵ {(app.amount || 25000).toLocaleString()}</strong></span>
                    <span>•</span>
                    <span>Submitted: {app.submittedAt || 'Yesterday'}</span>
                  </div>
                </div>
              </div>

              <div className="portal-app-actions">
                <button
                  onClick={() => router.push('/portal/statement')}
                  className="portal-app-view-btn"
                >
                  View Details
                </button>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="portal-app-stepper">
              <div className="stepper-step completed">
                <div className="step-circle">✓</div>
                <span className="step-text">Submitted</span>
              </div>
              <div className="stepper-line completed" />
              
              <div className="stepper-step completed">
                <div className="step-circle">✓</div>
                <span className="step-text">ID & KYC Checked</span>
              </div>
              <div className="stepper-line active" />

              <div className="stepper-step active">
                <div className="step-circle pulse">3</div>
                <span className="step-text">Bank Underwriting</span>
              </div>
              <div className="stepper-line" />

              <div className="stepper-step">
                <div className="step-circle">4</div>
                <span className="step-text">Disbursal</span>
              </div>
            </div>

            <div className="portal-app-note">
              <BoltRounded sx={{ fontSize: 16, color: '#2f5bea' }} />
              <span>
                <strong>Next Step:</strong> {app.nextStep || 'Bank underwriter Kwame Mensah is finalizing income verification. Expected decision today.'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 5. Pre-Approved Partner Lending & Protection Offers Grid */}
      <div className="portal-offers-section">
        <div className="portal-section-header">
          <div>
            <h2 className="portal-section-title">Pre-Approved Opportunities & Partner Rates</h2>
            <p className="portal-section-subtitle">
              Verified lenders matched specifically to your credit score and monthly cash flow.
            </p>
          </div>
          <div className="portal-filter-tabs">
            <button
              onClick={() => setActiveTab('all')}
              className={`filter-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            >
              All Matches (4)
            </button>
            <button
              onClick={() => setActiveTab('loans')}
              className={`filter-tab-btn ${activeTab === 'loans' ? 'active' : ''}`}
            >
              Loans & Credit (3)
            </button>
            <button
              onClick={() => setActiveTab('insurance')}
              className={`filter-tab-btn ${activeTab === 'insurance' ? 'active' : ''}`}
            >
              Insurance (1)
            </button>
          </div>
        </div>

        <div className="portal-offers-grid">
          {PARTNER_OFFERS
            .filter((o) => {
              if (activeTab === 'loans') return o.type.includes('Loan') || o.type.includes('Credit');
              if (activeTab === 'insurance') return o.type.includes('Insurance');
              return true;
            })
            .map((offer) => (
              <div key={offer.id} className="portal-offer-card group">
                <div className="offer-card-top">
                  <div className="offer-provider-block">
                    <div className="offer-provider-logo-frame">
                      <img
                        src={offer.logo}
                        alt={offer.provider}
                        className="offer-provider-logo"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <span className="offer-provider-name">{offer.provider}</span>
                      <h4 className="offer-product-name">{offer.productName}</h4>
                    </div>
                  </div>
                  <span className="offer-badge" style={{ backgroundColor: `${offer.highlightColor}15`, color: offer.highlightColor }}>
                    {offer.badge}
                  </span>
                </div>

                <div className="offer-metrics-row">
                  <div className="offer-metric">
                    <span className="offer-metric-label">Annual Rate (APR)</span>
                    <span className="offer-metric-value highlight">{offer.rate}</span>
                  </div>
                  <div className="offer-metric">
                    <span className="offer-metric-label">Max Pre-Approval</span>
                    <span className="offer-metric-value">GH₵ {offer.maxAmount.toLocaleString()}</span>
                  </div>
                  <div className="offer-metric">
                    <span className="offer-metric-label">Est. Monthly</span>
                    <span className="offer-metric-value">GH₵ {offer.monthlyEstimate.toLocaleString()}</span>
                  </div>
                </div>

                <div className="offer-footer">
                  <span className="offer-tenure-tag">
                    <ScheduleRounded sx={{ fontSize: 13 }} />
                    {offer.tenure}
                  </span>
                  <button
                    onClick={() => router.push(`/portal/marketplace?product=${encodeURIComponent(offer.productName)}`)}
                    className="offer-claim-btn"
                  >
                    Claim Offer
                    <ArrowForwardRounded sx={{ fontSize: 14 }} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 6. Advisory & Quick Vault Tools (Three High Impact Cards) */}
      <div className="portal-advisory-grid">
        {/* Card 1: Document Vault */}
        <div className="portal-card portal-advisory-card">
          <div className="advisory-card-header">
            <div className="advisory-icon-frame blue">
              <DescriptionRounded sx={{ fontSize: 20 }} />
            </div>
            <div>
              <h3 className="portal-advisory-title">Document Vault Lock</h3>
              <p className="portal-advisory-desc">
                Your <strong>Ghana Card</strong> & <strong>Payslips</strong> are encrypted. 3/3 essential documents verified.
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push('/portal/documents')}
            className="portal-advisory-btn dark"
          >
            Manage Vault Files
          </button>
        </div>

        {/* Card 2: Health Quote Banner */}
        <div className="portal-card portal-advisory-card highlight-bg">
          <div className="advisory-card-header">
            <div className="advisory-icon-frame green">
              <HealthAndSafetyRounded sx={{ fontSize: 20 }} />
            </div>
            <div>
              <h3 className="portal-advisory-title">Enterprise Health Cover</h3>
              <p className="portal-advisory-desc">
                Save up to <strong className="portal-highlight-green">GH₵ 120/mo</strong> with instant outpatient & inpatient protection.
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push('/portal/insurance-quote')}
            className="portal-advisory-btn green-btn"
          >
            Get 60s Quote
          </button>
        </div>

        {/* Card 3: Dedicated Support & Messages */}
        <div className="portal-card portal-advisory-card">
          <div className="advisory-card-header">
            <div className="advisory-icon-frame gold">
              <ChatBubbleOutlineRounded sx={{ fontSize: 20 }} />
            </div>
            <div>
              <h3 className="portal-advisory-title">Dedicated Advisor Support</h3>
              <p className="portal-advisory-desc">
                Connect with loan officers and dispute underwriters with guaranteed 1-hour resolution.
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push('/portal/chat')}
            className="portal-advisory-btn soft"
          >
            Open Concierge Chat
          </button>
        </div>
      </div>

      {/* Factor Breakdown Details Modal */}
      {selectedFactorModal && (
        <div
          onClick={() => setSelectedFactorModal(null)}
          className="portal-modal-backdrop"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="portal-modal-content"
          >
            <div className="portal-modal-header">
              <h3 className="portal-modal-title">
                {selectedFactorModal === 'payment' && 'Payment History Breakdown'}
                {selectedFactorModal === 'kyc' && 'Identity & Vault Verification'}
                {selectedFactorModal === 'dti' && 'Debt-to-Income (DTI) Analysis'}
                {selectedFactorModal === 'mix' && 'Credit Mix & Account Age'}
              </h3>
              <IconButton onClick={() => setSelectedFactorModal(null)} size="small">
                <CloseRounded sx={{ fontSize: 18 }} />
              </IconButton>
            </div>

            <div className="portal-modal-body">
              {selectedFactorModal === 'payment' && (
                <div>
                  <p className="modal-lead-text">
                    Your on-time repayment rate is currently <strong>100%</strong> across all active and historical credit lines.
                  </p>
                  <div className="modal-stat-box green-box">
                    <span>Zero default entries recorded in Bank of Ghana credit bureau database.</span>
                  </div>
                  <div className="modal-checklist">
                    <div className="modal-checklist-item">✓ 24 consecutive on-time monthly installments</div>
                    <div className="modal-checklist-item">✓ Automated debit mandate active</div>
                    <div className="modal-checklist-item">✓ Zero late fees or bounce penalties</div>
                  </div>
                </div>
              )}

              {selectedFactorModal === 'kyc' && (
                <div>
                  <p className="modal-lead-text">
                    Your account is fully verified with Level 2 Clearance under Bank of Ghana financial regulations.
                  </p>
                  <div className="modal-stat-box blue-box">
                    <span>Verified: Ghana Card (NIA), Proof of Residence, 3-Month Bank Statement.</span>
                  </div>
                  <div className="modal-checklist">
                    <div className="modal-checklist-item">✓ National Identification Authority (NIA) live match</div>
                    <div className="modal-checklist-item">✓ Biometric selfie validation confirmed</div>
                    <div className="modal-checklist-item">✓ Employment & employer payroll verified</div>
                  </div>
                </div>
              )}

              {selectedFactorModal === 'dti' && (
                <div>
                  <p className="modal-lead-text">
                    Your Debt-to-Income (DTI) ratio is <strong>18.5%</strong>, well below the maximum lender threshold of 35%.
                  </p>
                  <div className="modal-stat-box green-box">
                    <span>You have high disposable capacity for additional financing up to GH₵ 100,000.</span>
                  </div>
                  <div className="modal-dti-breakdown">
                    <div className="dti-row">
                      <span>Monthly Verified Income:</span>
                      <strong>GH₵ 4,600.00</strong>
                    </div>
                    <div className="dti-row">
                      <span>Total Monthly Debt Servicing:</span>
                      <strong>GH₵ 850.00</strong>
                    </div>
                    <div className="dti-row net">
                      <span>Net Remaining Free Cash Flow:</span>
                      <strong className="green-text">GH₵ 3,750.00 / mo</strong>
                    </div>
                  </div>
                </div>
              )}

              {selectedFactorModal === 'mix' && (
                <div>
                  <p className="modal-lead-text">
                    You have an established portfolio of personal finance lines and protection coverage spanning 2.4 years.
                  </p>
                  <div className="modal-stat-box blue-box">
                    <span>Diversified mix across Retail Banking, Insurance, and Micro-Credit.</span>
                  </div>
                </div>
              )}
            </div>

            <div className="portal-modal-footer">
              <button
                onClick={() => setSelectedFactorModal(null)}
                className="portal-modal-btn primary"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Article / News Blog Modal */}
      {selectedBlog && (
        <div 
          onClick={() => setSelectedBlog(null)}
          className="portal-modal-backdrop"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="portal-modal-content"
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
            <button
              onClick={() => setSelectedBlog(null)}
              className="portal-modal-btn primary"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .portal-overview-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 28px 36px 48px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 24px;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* 1. Hero & Greeting */
        .portal-hero-section {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 18px;
          background: #ffffff;
          border: 1px solid #e4e8f1;
          border-radius: 20px;
          padding: 28px 32px;
          box-shadow: 0 4px 20px rgba(16, 26, 51, 0.03);
        }

        .portal-user-badges {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .portal-pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 9999px;
        }
        .portal-pill-badge.green {
          background-color: #e3f4ec;
          color: #1f8a5b;
        }
        .portal-pill-badge.blue {
          background-color: #e8eefd;
          color: #2f5bea;
        }
        .portal-pill-badge.gold {
          background-color: #fef3c7;
          color: #b45309;
        }

        .portal-greeting-title {
          margin: 0;
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(26px, 3.5vw, 36px);
          font-weight: 600;
          color: #101a33;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }
        .highlight-name {
          color: #2f5bea;
        }

        .portal-greeting-subtitle {
          margin: 6px 0 0;
          font-size: 13.5px;
          color: #6b7690;
          max-width: 650px;
          line-height: 1.5;
        }

        .portal-hero-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .portal-primary-btn {
          background-color: #2f5bea;
          color: #ffffff;
          border: none;
          border-radius: 11px;
          padding: 11px 20px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 150ms ease;
          box-shadow: 0 4px 12px rgba(47, 91, 234, 0.25);
        }
        .portal-primary-btn:hover {
          background-color: #2449c4;
          transform: translateY(-1px);
        }

        .portal-secondary-btn {
          background-color: #f3f5fa;
          color: #101a33;
          border: 1px solid #e4e8f1;
          border-radius: 11px;
          padding: 11px 18px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 150ms ease;
        }
        .portal-secondary-btn:hover {
          background-color: #e8eefd;
          color: #2f5bea;
          border-color: #cbd5e1;
        }

        /* 2. Four Stat Cards Grid */
        .portal-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .portal-stat-card {
          background-color: #ffffff;
          border: 1px solid #e4e8f1;
          border-radius: 16px;
          padding: 20px 22px;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          transition: all 150ms ease;
          box-shadow: 0 2px 10px rgba(16, 26, 51, 0.02);
        }
        .portal-stat-card.clickable {
          cursor: pointer;
        }
        .portal-stat-card.clickable:hover {
          border-color: #2f5bea;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(47, 91, 234, 0.08);
        }
        .portal-stat-card.highlight-border {
          border-color: rgba(47, 91, 234, 0.35);
          background: linear-gradient(180deg, #ffffff 0%, #f8faff 100%);
        }

        .portal-stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .portal-stat-label {
          font-size: 12.5px;
          font-weight: 600;
          color: #6b7690;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .portal-stat-icon-tile {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .portal-stat-icon-tile.green { background-color: #e3f4ec; color: #1f8a5b; }
        .portal-stat-icon-tile.blue { background-color: #e8eefd; color: #2f5bea; }
        .portal-stat-icon-tile.purple { background-color: #f3e8ff; color: #7e22ce; }
        .portal-stat-icon-tile.gold { background-color: #fef3c7; color: #b45309; }

        .portal-stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #101a33;
          letter-spacing: -0.02em;
          margin-bottom: 10px;
          line-height: 1.15;
          font-family: 'Fraunces', Georgia, serif;
        }
        .portal-stat-value.purple-text {
          color: #7e22ce;
        }

        .portal-stat-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
          font-size: 11.5px;
        }

        .portal-trend-chip {
          padding: 2px 7px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 11px;
        }
        .portal-trend-chip.positive { background-color: #e3f4ec; color: #1f8a5b; }
        .portal-trend-chip.neutral { background-color: #f3e8ff; color: #7e22ce; }
        .portal-trend-chip.info { background-color: #e8eefd; color: #2f5bea; }

        .portal-badge-neutral {
          background-color: #f3f5fa;
          color: #101a33;
          padding: 2px 7px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 11px;
        }

        .portal-stat-sub-text {
          color: #8c97ad;
          font-size: 11px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* 3. Two-Column Grid */
        .portal-two-col-grid {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 20px;
        }

        .portal-card {
          background-color: #ffffff;
          border: 1px solid #e4e8f1;
          border-radius: 18px;
          padding: 26px 28px;
          box-sizing: border-box;
          box-shadow: 0 4px 18px rgba(16, 26, 51, 0.025);
        }

        .portal-card-header-flex {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .portal-card-badge {
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #1f8a5b;
          margin-bottom: 4px;
        }
        .portal-card-badge.blue-badge {
          color: #2f5bea;
        }
        .portal-card-badge.green-badge {
          color: #1f8a5b;
        }

        .portal-card-header-title {
          margin: 0;
          font-size: 17px;
          font-weight: 700;
          color: #101a33;
          letter-spacing: -0.01em;
        }

        .portal-card-sub-info {
          font-size: 12.5px;
          color: #6b7690;
          margin: -8px 0 18px;
          line-height: 1.45;
        }

        /* Health Centerpiece Layout */
        .portal-health-score-container {
          display: flex;
          align-items: center;
          gap: 24px;
          background: #f8fafc;
          border: 1px solid #e8eefd;
          border-radius: 14px;
          padding: 18px 20px;
          margin-bottom: 18px;
        }

        .portal-gauge-wrapper {
          position: relative;
          width: 130px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .portal-gauge-svg {
          width: 130px;
          height: 70px;
          overflow: visible;
        }

        .portal-gauge-center-text {
          position: absolute;
          bottom: 2px;
          display: flex;
          align-items: baseline;
          gap: 2px;
        }

        .portal-health-score-num {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 34px;
          font-weight: 700;
          color: #101a33;
          line-height: 1;
        }

        .portal-health-score-max {
          font-size: 12px;
          font-weight: 600;
          color: #6b7690;
        }

        .portal-health-details {
          flex: 1;
        }

        .portal-grade-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 8px;
          margin-bottom: 6px;
        }

        .portal-health-desc {
          margin: 0 0 8px;
          font-size: 12px;
          color: #6b7690;
          line-height: 1.4;
        }

        .portal-health-perks {
          display: flex;
          gap: 12px;
          font-size: 11px;
          font-weight: 600;
          color: #1f8a5b;
          flex-wrap: wrap;
        }

        /* 4 Factors Grid */
        .portal-factors-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 18px;
        }

        .factor-chip {
          background: #ffffff;
          border: 1px solid #e4e8f1;
          border-radius: 10px;
          padding: 10px 12px;
          cursor: pointer;
          transition: all 150ms ease;
        }
        .factor-chip:hover {
          border-color: #2f5bea;
          background-color: #f8fafc;
        }

        .factor-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
          font-size: 11.5px;
        }

        .factor-name {
          font-weight: 600;
          color: #101a33;
        }

        .factor-status {
          font-size: 11px;
          font-weight: 700;
        }
        .factor-status.green { color: #1f8a5b; }
        .factor-status.blue { color: #2f5bea; }

        .factor-bar-bg {
          height: 5px;
          background: #eef2f7;
          border-radius: 999px;
          overflow: hidden;
        }

        .factor-bar-fill {
          height: 100%;
          border-radius: 999px;
        }
        .factor-bar-fill.green { background: #1f8a5b; }
        .factor-bar-fill.blue { background: #2f5bea; }

        .portal-health-footer-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .portal-health-action-btn {
          flex: 1;
          background-color: #2f5bea;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          padding: 11px 16px;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: background 150ms ease;
        }
        .portal-health-action-btn:hover {
          background-color: #2449c4;
        }

        .portal-health-vault-btn {
          background-color: #f3f5fa;
          color: #101a33;
          border: 1px solid #e4e8f1;
          border-radius: 10px;
          padding: 11px 14px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 150ms ease;
        }
        .portal-health-vault-btn:hover {
          background-color: #e8eefd;
          color: #2f5bea;
        }

        /* Calculator Card */
        .calc-rate-badge {
          background: #e8eefd;
          color: #2f5bea;
          font-size: 11.5px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 8px;
        }

        .portal-calculator-body {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .slider-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .slider-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }

        .slider-label {
          font-weight: 600;
          color: #6b7690;
        }

        .slider-value {
          font-weight: 700;
          color: #101a33;
          font-family: 'Fraunces', Georgia, serif;
          font-size: 16px;
        }

        .portal-range-slider {
          width: 100%;
          height: 6px;
          -webkit-appearance: none;
          background: #e4e8f1;
          border-radius: 999px;
          outline: none;
          accent-color: #2f5bea;
          cursor: pointer;
        }

        .slider-ticks {
          display: flex;
          justify-content: space-between;
          font-size: 10.5px;
          color: #8c97ad;
        }

        .calc-result-box {
          background: linear-gradient(135deg, #0f1a33 0%, #1e2a48 100%);
          color: #ffffff;
          border-radius: 14px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .calc-result-sub {
          font-size: 11px;
          color: #aeb8d0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 4px;
        }

        .calc-result-amount {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 26px;
          font-weight: 700;
          color: #ffffff;
          line-height: 1;
        }

        .calc-result-per {
          font-size: 12px;
          font-family: 'DM Sans', sans-serif;
          color: #8fb0ff;
          margin-left: 4px;
        }

        .calc-result-right {
          display: flex;
          flex-direction: column;
          gap: 4px;
          text-align: right;
        }

        .calc-pill {
          font-size: 10.5px;
          color: #e3f4ec;
          font-weight: 500;
        }

        .portal-calc-apply-btn {
          width: 100%;
          background: #2f5bea;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          padding: 12px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 150ms ease;
        }
        .portal-calc-apply-btn:hover {
          background: #2449c4;
        }

        /* 4. Applications Tracker Card */
        .portal-applications-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .portal-text-action-link {
          background: none;
          border: none;
          color: #2f5bea;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          padding: 4px 8px;
        }

        .portal-app-pipeline-item {
          background: #f8fafc;
          border: 1px solid #e4e8f1;
          border-radius: 14px;
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .portal-app-info-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .portal-app-main-details {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .portal-app-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: #e8eefd;
          color: #2f5bea;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .portal-app-title-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .portal-app-title {
          margin: 0;
          font-size: 15.5px;
          font-weight: 700;
          color: #101a33;
        }

        .portal-app-ref {
          font-size: 11px;
          font-family: monospace;
          background: #e4e8f1;
          color: #4b5563;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 600;
        }

        .portal-status-pill {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 999px;
        }
        .portal-status-pill.in-review {
          background: #fef3c7;
          color: #b45309;
        }

        .portal-app-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #6b7690;
          margin-top: 4px;
        }

        .portal-app-view-btn {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 7px 14px;
          font-size: 12px;
          font-weight: 600;
          color: #101a33;
          cursor: pointer;
          transition: all 150ms ease;
        }
        .portal-app-view-btn:hover {
          border-color: #2f5bea;
          color: #2f5bea;
          background: #f8fafc;
        }

        /* Stepper */
        .portal-app-stepper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          padding: 6px 12px;
          background: #ffffff;
          border: 1px solid #eef2f7;
          border-radius: 10px;
        }

        .stepper-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          z-index: 2;
        }

        .step-circle {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #e4e8f1;
          color: #6b7690;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
        }
        .stepper-step.completed .step-circle {
          background: #1f8a5b;
          color: #ffffff;
        }
        .stepper-step.active .step-circle {
          background: #2f5bea;
          color: #ffffff;
          box-shadow: 0 0 0 3px rgba(47, 91, 234, 0.2);
        }

        .step-text {
          font-size: 11px;
          font-weight: 600;
          color: #6b7690;
        }
        .stepper-step.active .step-text {
          color: #2f5bea;
          font-weight: 700;
        }

        .stepper-line {
          flex: 1;
          height: 2px;
          background: #e4e8f1;
          margin: 0 8px 16px;
        }
        .stepper-line.completed {
          background: #1f8a5b;
        }
        .stepper-line.active {
          background: linear-gradient(90deg, #1f8a5b, #2f5bea);
        }

        .portal-app-note {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #e8eefd;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 12px;
          color: #1e3a8a;
        }

        /* 5. Offers Section */
        .portal-offers-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .portal-section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .portal-section-title {
          margin: 0;
          font-size: 19px;
          font-weight: 700;
          color: #101a33;
          letter-spacing: -0.01em;
          font-family: 'Fraunces', Georgia, serif;
        }

        .portal-section-subtitle {
          margin: 4px 0 0;
          font-size: 13px;
          color: #6b7690;
        }

        .portal-filter-tabs {
          display: flex;
          gap: 6px;
          background: #eef2f7;
          padding: 3px;
          border-radius: 10px;
        }

        .filter-tab-btn {
          background: transparent;
          border: none;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #6b7690;
          cursor: pointer;
          transition: all 150ms ease;
        }
        .filter-tab-btn.active {
          background: #ffffff;
          color: #101a33;
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
        }

        .portal-offers-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .portal-offer-card {
          background: #ffffff;
          border: 1px solid #e4e8f1;
          border-radius: 16px;
          padding: 22px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: all 150ms ease;
        }
        .portal-offer-card:hover {
          border-color: #2f5bea;
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(16, 26, 51, 0.05);
        }

        .offer-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .offer-provider-block {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .offer-provider-logo-frame {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #f8fafc;
          border: 1px solid #e4e8f1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .offer-provider-logo {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .offer-provider-name {
          font-size: 11px;
          color: #6b7690;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          display: block;
        }

        .offer-product-name {
          margin: 2px 0 0;
          font-size: 15px;
          font-weight: 700;
          color: #101a33;
        }

        .offer-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
          white-space: nowrap;
        }

        .offer-metrics-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          background: #f8fafc;
          border: 1px solid #eef2f7;
          border-radius: 10px;
          padding: 10px 12px;
          gap: 8px;
        }

        .offer-metric {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .offer-metric-label {
          font-size: 10px;
          color: #6b7690;
          font-weight: 600;
          text-transform: uppercase;
        }

        .offer-metric-value {
          font-size: 13.5px;
          font-weight: 700;
          color: #101a33;
        }
        .offer-metric-value.highlight {
          color: #1f8a5b;
        }

        .offer-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .offer-tenure-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11.5px;
          color: #6b7690;
          font-weight: 500;
        }

        .offer-claim-btn {
          background: #101a33;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 150ms ease;
        }
        .offer-claim-btn:hover {
          background: #2f5bea;
        }

        /* 6. Advisory Row */
        .portal-advisory-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .portal-advisory-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 180px;
          padding: 22px 24px;
        }
        .portal-advisory-card.highlight-bg {
          background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
          border-color: #bbf7d0;
        }

        .advisory-card-header {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 16px;
        }

        .advisory-icon-frame {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .advisory-icon-frame.blue { background: #e8eefd; color: #2f5bea; }
        .advisory-icon-frame.green { background: #e3f4ec; color: #1f8a5b; }
        .advisory-icon-frame.gold { background: #fef3c7; color: #b45309; }

        .portal-advisory-title {
          margin: 0 0 4px;
          font-size: 14px;
          font-weight: 700;
          color: #101a33;
        }

        .portal-advisory-desc {
          margin: 0;
          font-size: 12px;
          color: #6b7690;
          line-height: 1.45;
        }

        .portal-highlight-green {
          color: #1f8a5b;
          font-weight: 700;
        }

        .portal-advisory-btn {
          align-self: flex-start;
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: 150ms ease;
        }
        .portal-advisory-btn.dark {
          background-color: #101a33;
          color: #ffffff;
          border: none;
        }
        .portal-advisory-btn.dark:hover {
          background-color: #1e2a48;
        }
        .portal-advisory-btn.green-btn {
          background-color: #1f8a5b;
          color: #ffffff;
          border: none;
        }
        .portal-advisory-btn.green-btn:hover {
          background-color: #176f49;
        }
        .portal-advisory-btn.soft {
          background-color: #fef3c7;
          color: #b45309;
          border: none;
        }
        .portal-advisory-btn.soft:hover {
          background-color: #fde68a;
        }

        /* Modals & Backdrop */
        .portal-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(16, 26, 51, 0.5);
          backdrop-filter: blur(5px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .portal-modal-content {
          background: #ffffff;
          border-radius: 18px;
          max-width: 520px;
          width: 100%;
          padding: 28px;
          box-shadow: 0 24px 60px rgba(16, 26, 51, 0.15);
          border: 1px solid #e4e8f1;
        }

        .portal-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .portal-modal-title {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #101a33;
          font-family: 'Fraunces', Georgia, serif;
        }

        .portal-modal-body {
          margin-bottom: 20px;
        }

        .modal-lead-text {
          font-size: 13.5px;
          color: #4b5563;
          line-height: 1.5;
          margin: 0 0 14px;
        }

        .modal-stat-box {
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 12.5px;
          margin-bottom: 14px;
          line-height: 1.45;
        }
        .modal-stat-box.green-box {
          background: #e3f4ec;
          color: #1f8a5b;
          font-weight: 600;
        }
        .modal-stat-box.blue-box {
          background: #e8eefd;
          color: #2f5bea;
          font-weight: 600;
        }

        .modal-checklist {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 12.5px;
          color: #374151;
        }

        .modal-dti-breakdown {
          background: #f8fafc;
          border: 1px solid #e4e8f1;
          border-radius: 10px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 12.5px;
        }

        .dti-row {
          display: flex;
          justify-content: space-between;
          color: #6b7690;
        }
        .dti-row.net {
          border-top: 1px solid #e4e8f1;
          padding-top: 8px;
          margin-top: 4px;
          color: #101a33;
          font-weight: 700;
        }
        .green-text {
          color: #1f8a5b;
        }

        .portal-modal-footer {
          display: flex;
          justify-content: flex-end;
        }

        .portal-modal-btn.primary {
          background: #2f5bea;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1100px) {
          .portal-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .portal-two-col-grid {
            grid-template-columns: 1fr;
          }
          .portal-offers-grid {
            grid-template-columns: 1fr;
          }
          .portal-advisory-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 800px) {
          .portal-overview-container {
            padding: 16px 14px 36px;
          }
          .portal-hero-section {
            padding: 20px 18px;
          }
          .portal-greeting-title {
            font-size: 24px;
          }
          .portal-stats-grid {
            grid-template-columns: 1fr;
          }
          .portal-health-score-container {
            flex-direction: column;
            text-align: center;
          }
          .portal-factors-grid {
            grid-template-columns: 1fr;
          }
          .portal-app-stepper {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
          .stepper-line {
            display: none;
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
      <Dashboard 
        onCardClick={(action) => {
          if (action === 'cashflow') setCashFlowOpen(true);
        }}
        onOpenCalculator={() => router.push('/portal/calculator')}
      />

      {/* Cash Flow Ledger Modal */}
      {cashFlowOpen && (
        <div 
          onClick={() => setCashFlowOpen(false)}
          className="portal-modal-backdrop"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="portal-modal-content"
            style={{ maxWidth: 650 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#101a33', fontFamily: "'Fraunces', Georgia, serif" }}>
                  Verified Cash Flow & Liquidity
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#6b7690' }}>
                  Synchronized with linked bank accounts and automated salary deductions.
                </p>
              </div>
              <IconButton onClick={() => setCashFlowOpen(false)} size="small">
                <CloseRounded sx={{ fontSize: 18 }} />
              </IconButton>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
              <div style={{ background: '#e3f4ec', padding: 14, borderRadius: 12, border: '1px solid #bbf7d0' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#1f8a5b', textTransform: 'uppercase' }}>Verified Monthly Inflow</span>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#101a33', marginTop: 4, fontFamily: "'Fraunces', Georgia, serif" }}>
                  GH₵ 4,600.00
                </div>
                <span style={{ fontSize: 11, color: '#1f8a5b' }}>Salary Deposit (Absa Bank)</span>
              </div>
              <div style={{ background: '#f8fafc', padding: 14, borderRadius: 12, border: '1px solid #e4e8f1' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7690', textTransform: 'uppercase' }}>Committed Obligations</span>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#101a33', marginTop: 4, fontFamily: "'Fraunces', Georgia, serif" }}>
                  GH₵ 850.00
                </div>
                <span style={{ fontSize: 11, color: '#6b7690' }}>Loan Repayment + Health Premium</span>
              </div>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e4e8f1', borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12.5, color: '#4b5563' }}>
                <span>Net Disposable Surplus</span>
                <strong style={{ color: '#1f8a5b' }}>GH₵ 3,750.00 / month</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#4b5563' }}>
                <span>Recommended Max Borrowing Cap</span>
                <strong style={{ color: '#2f5bea' }}>GH₵ 85,000.00</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => {
                  setCashFlowOpen(false);
                  router.push('/portal/statement');
                }}
                style={{
                  background: '#f3f5fa',
                  border: '1px solid #e4e8f1',
                  borderRadius: 8,
                  padding: '9px 16px',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: '#101a33'
                }}
              >
                View Full Statement
              </button>
              <button
                onClick={() => setCashFlowOpen(false)}
                style={{
                  background: '#2f5bea',
                  border: 'none',
                  borderRadius: 8,
                  padding: '9px 18px',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: '#ffffff'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </PortalShell>
  );
}
