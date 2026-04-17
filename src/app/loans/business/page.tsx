'use client';

import { 
  BusinessRounded, 
  TrendingUpRounded, 
  AssuredWorkloadRounded, 
  AccountTreeRounded,
  SpeedRounded,
  GroupsRounded
} from '@mui/icons-material';
import ProductLayout from '../../components/ProductLayout';

export default function BusinessLoansPage() {
  const benefits = [
    { 
      title: "Scale Your Operations", 
      desc: "Get the working capital you need to purchase inventory, upgrade equipment, or expand to new locations.",
      icon: <TrendingUpRounded />
    },
    { 
      title: "No Collateral Required", 
      desc: "Many of our lenders offer unsecured options for SMEs based on verified cash flow and transaction history.",
      icon: <BusinessRounded />
    },
    { 
      title: "Flexible SME Terms", 
      desc: "Repayment schedules designed around your business cycle, whether you're seasonal or high-velocity.",
      icon: <AccountTreeRounded />
    },
    { 
      title: "Transparent Reporting", 
      desc: "Track your loan performance and repayment milestones through our integrated business portal.",
      icon: <AssuredWorkloadRounded />
    },
    { 
      title: "Rapid Payout", 
      desc: "Don't miss a beat. Once verified, capital is disbursed into your business account within 48 hours.",
      icon: <SpeedRounded />
    },
    { 
      title: "Expert Support", 
      desc: "Access dedicated financial advisors who understand the unique challenges of the African business landscape.",
      icon: <GroupsRounded />
    }
  ];

  const stats = [
    { value: "GH₵5M", label: "Max Credit Line" },
    { value: "12-36mo", label: "Repayment Terms" },
    { value: "48hrs", label: "Avg. Disbursement" }
  ];

  return (
    <ProductLayout
      category="Loans"
      title="Scale your business with"
      highlightText="smart capital."
      description="ResolveBridge connects African SMEs with institutional lenders that actually understand your growth trajectory. No more generic loan offers."
      benefits={benefits}
      stats={stats}
      heroImage="/images/business_loans.png"
      ctaText="Apply for Business Capital"
    />
  );
}
