'use client';

import { 
  AccountBalanceRounded, 
  InsightsRounded, 
  HubRounded, 
  AssessmentRounded,
  SpeedRounded,
  SecurityRounded
} from '@mui/icons-material';
import ProductLayout from '../../components/ProductLayout';

export default function ResolveCapitalPage() {
  const benefits = [
    { 
      title: "Institutional Liquidity", 
      desc: "Direct access to large-scale capital pools for infrastructure, corporate expansion, and development projects.",
      icon: <AccountBalanceRounded />
    },
    { 
      title: "Market Insights", 
      desc: "Advanced data analytics and sector-specific market intelligence to inform your investment and growth strategies.",
      icon: <InsightsRounded />
    },
    { 
      title: "Global Network", 
      desc: "Connect with international institutional investors and developmental finance institutions across the globe.",
      icon: <HubRounded />
    },
    { 
      title: "Mandate Engineering", 
      desc: "Custom-built financial instruments and mandates designed to align with your specific risk and return objectives.",
      icon: <AssessmentRounded />
    },
    { 
      title: "Algorithmic Matching", 
      desc: "Our proprietary engine identifies the most efficient capital sources, significantly reducing search time.",
      icon: <SpeedRounded />
    },
    { 
      title: "Institutional Compliance", 
      desc: "Ensuring all capital movements and transactions meet the highest standards of international regulatory compliance.",
      icon: <SecurityRounded />
    }
  ];

  const stats = [
    { value: "Institutional", label: "Grade Capital" },
    { value: "0.1ms", label: "Matching Latency" },
    { value: "Verified", label: "Network Only" }
  ];

  return (
    <ProductLayout
      category="Resolve Group"
      title="Unlocking institutional"
      highlightText="liquidity globally."
      description="Resolve Capital provides the financial backbone for Africa's most ambitious projects by bridging the gap between global capital and local opportunity."
      benefits={benefits}
      stats={stats}
      heroImage="/images/network_viz.png"
      ctaText="Request Mandate Intake"
    />
  );
}
