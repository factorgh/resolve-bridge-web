'use client';

import { 
  HealthAndSafetyRounded, 
  MedicalServicesRounded, 
  LocalHospitalRounded, 
  VaccinesRounded,
  SpeedRounded,
  SecurityRounded
} from '@mui/icons-material';
import ProductLayout from '../../components/ProductLayout';

export default function HealthInsurancePage() {
  const benefits = [
    { 
      title: "Full In-Patient Care", 
      desc: "Comprehensive coverage for hospital stays, surgeries, and specialized treatments at top-tier medical facilities.",
      icon: <LocalHospitalRounded />
    },
    { 
      title: "Out-Patient Benefits", 
      desc: "Covers consultation fees, diagnostic tests, and prescribed medications for your everyday healthcare needs.",
      icon: <MedicalServicesRounded />
    },
    { 
      title: "Emergency Evacuation", 
      desc: "Rapid response and medical evacuation services, ensuring you get the care you need, wherever you are.",
      icon: <SpeedRounded />
    },
    { 
      title: "Maternity & Wellness", 
      desc: "Dedicated support for prenatal care, delivery, and post-natal wellness, plus routine health screenings.",
      icon: <HealthAndSafetyRounded />
    },
    { 
      title: "Global Coverage Options", 
      desc: "Access medical care across borders with plans that cover you during international travel and relocation.",
      icon: <VaccinesRounded />
    },
    { 
      title: "Family Dental & Vision", 
      desc: "Integrated dental and optical benefits to ensure total well-being for you and your loved ones.",
      icon: <SecurityRounded />
    }
  ];

  const stats = [
    { value: "500+", label: "Network Hospitals" },
    { value: "24/7", label: "Medical Helpline" },
    { value: "GH₵1M+", label: "Max Annual Limit" }
  ];

  return (
    <ProductLayout
      category="Insurance"
      title="Priority healthcare for"
      highlightText="you and your family."
      description="ResolveBridge matches you with premium health plans that offer comprehensive coverage and peace of mind when it matters most."
      benefits={benefits}
      stats={stats}
      heroImage="/images/health_insurance.png"
      ctaText="Compare Health Plans"
    />
  );
}
