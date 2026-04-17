'use client';

import { 
  DirectionsCarRounded, 
  LocalShippingRounded, 
  BuildCircleRounded, 
  AssessmentRounded,
  SpeedRounded,
  SecurityRounded
} from '@mui/icons-material';
import ProductLayout from '../../components/ProductLayout';

export default function ResolveVehiclesPage() {
  const benefits = [
    { 
      title: "Fleet Mandate Financing", 
      desc: "Custom-built financing mandates for large-scale corporate and logistics fleet acquisitions.",
      icon: <LocalShippingRounded />
    },
    { 
      title: "Asset Performance Data", 
      desc: "Real-time analytics on fleet utilization, maintenance costs, and residual value performance.",
      icon: <AssessmentRounded />
    },
    { 
      title: "Consolidated Leasing", 
      desc: "Seamless operational and financial leasing solutions for institutional vehicle requirements.",
      icon: <DirectionsCarRounded />
    },
    { 
      title: "Maintenance Integration", 
      desc: "Automated maintenance scheduling and cost management across your entire vehicle portfolio.",
      icon: <BuildCircleRounded />
    },
    { 
      title: "Rapid Fleet Scaling", 
      desc: "Our engine identifies and secures the most efficient capital for rapid fleet expansion mandates.",
      icon: <SpeedRounded />
    },
    { 
      title: "Auditable Compliance", 
      desc: "Ensuring all vehicle assets and financing documentation meet institutional audit requirements.",
      icon: <SecurityRounded />
    }
  ];

  const stats = [
    { value: "Institutional", label: "Fleet Grade" },
    { value: "Verified", label: "Asset Network" },
    { value: "0.1ms", label: "Matching Latency" }
  ];

  return (
    <ProductLayout
      category="Resolve Group"
      title="Institutional fleet"
      highlightText="and asset financing."
      description="Resolve Vehicles provides the structural and financial framework needed to scale corporate and logistics fleets across the continent."
      benefits={benefits}
      stats={stats}
      heroImage="/images/auto_loans.png"
      ctaText="Scale My Fleet Mandate"
    />
  );
}
