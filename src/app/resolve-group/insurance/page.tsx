'use client';

import { 
  ShieldRounded, 
  HubRounded, 
  AccountBalanceRounded, 
  PolicyRounded,
  SpeedRounded,
  SecurityRounded
} from '@mui/icons-material';
import ProductLayout from '../../components/ProductLayout';

export default function ResolveInsuranceGroupPage() {
  const benefits = [
    { 
      title: "Consolidated Risk Management", 
      desc: "Manage all your institutional and corporate insurance policies through a single, unified digital dashboard.",
      icon: <HubRounded />
    },
    { 
      title: "Bespoke Reinsurance", 
      desc: "Access global reinsurance markets for high-value assets and complex institutional risk profiles.",
      icon: <AccountBalanceRounded />
    },
    { 
      title: "Mandate-First Coverage", 
      desc: "Insurance solutions specifically engineered to satisfy institutional mandates and regulatory requirements.",
      icon: <PolicyRounded />
    },
    { 
      title: "Real-time Asset Monitoring", 
      desc: "Integrated tracking and monitoring for insured assets, ensuring proactive risk mitigation and management.",
      icon: <SpeedRounded />
    },
    { 
      title: "Automated Claims Logic", 
      desc: "Proprietary algorithms that accelerate claims verification and settlement for institutional-grade policies.",
      icon: <SecurityRounded />
    },
    { 
      title: "Global Underwriting", 
      desc: "Strategic partnerships with the world's leading underwriters to provide unparalleled security and limit capacity.",
      icon: <ShieldRounded />
    }
  ];

  const stats = [
    { value: "Institutional", label: "Capacity Only" },
    { value: "100%", label: "Digital Audited" },
    { value: "Verified", label: "Underwriters" }
  ];

  return (
    <ProductLayout
      category="Resolve Group"
      title="Sophisticated risk"
      highlightText="management for institutions."
      description="Resolve Insurance provides the security and mandate-compliance needed for large-scale operations and institutional assets across Africa."
      benefits={benefits}
      stats={stats}
      heroImage="/images/resolve_insurance_group.png"
      ctaText="Request Underwriting Audit"
    />
  );
}
