'use client';

import { 
  CreditCardRounded, 
  StoreRounded, 
  DonutLargeRounded, 
  GroupWorkRounded,
  SecurityRounded,
  SpeedRounded
} from '@mui/icons-material';
import ProductLayout from '../../components/ProductLayout';

export default function CorporateCardsPage() {
  const benefits = [
    { 
      title: "Control Employee Spending", 
      desc: "Set individual spending limits and categories for each team member to maintain strict budget discipline.",
      icon: <GroupWorkRounded />
    },
    { 
      title: "Automated Expense Tracking", 
      desc: "Eliminate manual reimbursement paperwork. Every transaction is automatically logged and categorized for accounting.",
      icon: <DonutLargeRounded />
    },
    { 
      title: "Direct ERP Integration", 
      desc: "Sync your spending data directly with your company's existing accounting and ERP software for seamless reconciliation.",
      icon: <StoreRounded />
    },
    { 
      title: "Institutional Limits", 
      desc: "Access higher credit lines based on your business's financial health and operational requirements.",
      icon: <CreditCardRounded />
    },
    { 
      title: "Real-time Dashboards", 
      desc: "Monitor company-wide spending in real-time through our integrated business portal and mobile app.",
      icon: <SpeedRounded />
    },
    { 
      title: "Bank-Grade Security", 
      desc: "Advanced encryption and multi-factor authentication to protect your company's sensitive financial data.",
      icon: <SecurityRounded />
    }
  ];

  const stats = [
    { value: "Unlimited", label: "Employee Cards" },
    { value: "0.1%", label: "Cashback on FX" },
    { value: "24/7", label: "Dedicated Support" }
  ];

  return (
    <ProductLayout
      category="Credit Cards"
      title="Streamline your company"
      highlightText="spending."
      description="ResolveBridge corporate cards empower your team with flexible spending power while giving you total control and visibility."
      benefits={benefits}
      stats={stats}
      heroImage="/images/corporate_card.png"
      ctaText="Issue Corporate Cards"
    />
  );
}
