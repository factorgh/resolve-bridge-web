'use client';

import { 
  HealthAndSafetyRounded, 
  MedicalServicesRounded, 
  HubRounded, 
  AssessmentRounded,
  SpeedRounded,
  SecurityRounded
} from '@mui/icons-material';
import ProductLayout from '../../components/ProductLayout';

export default function ResolveHealthGroupPage() {
  const benefits = [
    { 
      title: "Group Health Mandates", 
      desc: "Custom-built health coverage solutions for large-scale corporate and institutional workforce pools.",
      icon: <HubRounded />
    },
    { 
      title: "Global Care Standards", 
      desc: "Ensuring all health plans meet international standards of care and provider quality across the continent.",
      icon: <MedicalServicesRounded />
    },
    { 
      title: "Workforce Analytics", 
      desc: "Real-time data on workforce wellness, utilization patterns, and preventative care performance.",
      icon: <AssessmentRounded />
    },
    { 
      title: "Seamless Provider Network", 
      desc: "Direct access to a verified network of the region's most reputable private and public medical facilities.",
      icon: <HealthAndSafetyRounded />
    },
    { 
      title: "Rapid Health Logistics", 
      desc: "Our engine optimizes provider matching and claims processing for high-velocity institutional needs.",
      icon: <SpeedRounded />
    },
    { 
      title: "Verified Audit Trails", 
      desc: "Ensuring all healthcare spending and plan performance documentation is fully auditable and transparent.",
      icon: <SecurityRounded />
    }
  ];

  const stats = [
    { value: "Institutional", label: "Grade Care" },
    { value: "Verified", label: "Provider Hub" },
    { value: "100%", label: "Digital Audited" }
  ];

  return (
    <ProductLayout
      category="Resolve Group"
      title="Global health coverage"
      highlightText="for institutions."
      description="Resolve Health provides the structural and financial framework needed to deliver world-class medical coverage to high-impact workforces."
      benefits={benefits}
      stats={stats}
      heroImage="/images/health_insurance.png"
      ctaText="Audit My Health Mandate"
    />
  );
}
