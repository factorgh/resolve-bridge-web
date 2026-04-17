'use client';

import { 
  CreditCardRounded, 
  BoltRounded, 
  ShieldRounded, 
  HistoryRounded,
  SpeedRounded,
  AccountBalanceWalletRounded
} from '@mui/icons-material';
import ProductLayout from '../../components/ProductLayout';

export default function PersonalLoansPage() {
  const benefits = [
    { 
      title: "Rates from 14% p.a.", 
      desc: "Access the most competitive interest rates in the market through our deep lender network.",
      icon: <CreditCardRounded />
    },
    { 
      title: "60-Second Approval", 
      desc: "Our AI engine analyzes your profile instantly to provide real-time conditional offers.",
      icon: <BoltRounded />
    },
    { 
      title: "No Hidden Fees", 
      desc: "Total transparency on all charges, with no processing surprises or early repayment penalties.",
      icon: <ShieldRounded />
    },
    { 
      title: "Flexible Repayment", 
      desc: "Choose terms from 3 to 60 months that perfectly fit your monthly cash flow requirements.",
      icon: <HistoryRounded />
    },
    { 
      title: "Instant Disbursement", 
      desc: "Once approved, funds are transferred to your verified bank account in under 24 hours.",
      icon: <SpeedRounded />
    },
    { 
      title: "Build Your Credit", 
      desc: "Timely repayments are reported to credit bureaus, helping you unlock better future rates.",
      icon: <AccountBalanceWalletRounded />
    }
  ];

  const stats = [
    { value: "50+", label: "Participating Lenders" },
    { value: "GH₵100k", label: "Max Loan Amount" },
    { value: "24hrs", label: "Avg. Disbursement" }
  ];

  return (
    <ProductLayout
      category="Loans"
      title="Personal Loans that work"
      highlightText="for you."
      description="Whether it's for school fees, home improvements, or unexpected life moments, ResolveBridge matches you with the perfect personal credit line in minutes."
      benefits={benefits}
      stats={stats}
      heroImage="/images/hero_advisor.png"
      ctaText="Check My Eligibility"
    />
  );
}
