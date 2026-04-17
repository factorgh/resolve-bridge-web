'use client';

import { 
  KeyRounded, 
  AccountBalanceWalletRounded, 
  MonetizationOnRounded, 
  TrendingUpRounded,
  SpeedRounded,
  SecurityRounded
} from '@mui/icons-material';
import ProductLayout from '../../components/ProductLayout';

export default function HomeEquityPage() {
  const benefits = [
    { 
      title: "Unlock Dormant Value", 
      desc: "Convert the equity in your home into liquid cash without having to sell your property.",
      icon: <KeyRounded />
    },
    { 
      title: "Lower Interest Rates", 
      desc: "Benefit from much lower rates than personal loans since the credit is secured by your home's value.",
      icon: <TrendingUpRounded />
    },
    { 
      title: "High Credit Limits", 
      desc: "Access larger sums of money based on the appraised market value and your existing equity.",
      icon: <AccountBalanceWalletRounded />
    },
    { 
      title: "Flexible Use of Funds", 
      desc: "Use the capital for business expansion, debt consolidation, or high-value investments.",
      icon: <MonetizationOnRounded />
    },
    { 
      title: "Simplified Appraisal", 
      desc: "Our digital-first appraisal process gets your home valued accurately and quickly by local experts.",
      icon: <SpeedRounded />
    },
    { 
      title: "Secure & Transparent", 
      desc: "Fixed repayment terms and zero hidden charges, with bank-grade security on all your data.",
      icon: <SecurityRounded />
    }
  ];

  const stats = [
    { value: "80%", label: "Max Loan-to-Value" },
    { value: "12% p.a.", label: "Typical Starting Rate" },
    { value: "10 Days", label: "Avg. Closing Time" }
  ];

  return (
    <ProductLayout
      category="Mortgages"
      title="Unlock the value"
      highlightText="in your home."
      description="Your home is your biggest asset. ResolveBridge helps you leverage its equity to fund your next big milestone with ease and transparency."
      benefits={benefits}
      stats={stats}
      heroImage="/images/home_loans.png"
      ctaText="Appraise My Property"
    />
  );
}
