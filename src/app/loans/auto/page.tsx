'use client';

import { 
  DirectionsCarRounded, 
  SpeedRounded, 
  LocalGasStationRounded, 
  SecurityRounded,
  HistoryRounded,
  HandshakeRounded
} from '@mui/icons-material';
import ProductLayout from '../../components/ProductLayout';

export default function AutoLoansPage() {
  const benefits = [
    { 
      title: "Finance New & Used", 
      desc: "Whether it's a zero-km showroom model or a solid pre-owned vehicle, we have specialized lenders for both.",
      icon: <DirectionsCarRounded />
    },
    { 
      title: "Low Down Payments", 
      desc: "Get behind the wheel faster with competitive equity contributions starting as low as 10% for qualified buyers.",
      icon: <HandshakeRounded />
    },
    { 
      title: "Quick Valuation", 
      desc: "Integrated vehicle inspection and valuation services to ensure you're paying the right market price.",
      icon: <SecurityRounded />
    },
    { 
      title: "60-Month Terms", 
      desc: "Spread your payments over up to 5 years to keep your monthly installments manageable and predictable.",
      icon: <HistoryRounded />
    },
    { 
      title: "Fast-Track Approval", 
      desc: "Conditional approval in hours, not days. We speed up the paperwork so you can get on the road.",
      icon: <SpeedRounded />
    },
    { 
      title: "Fleet Financing", 
      desc: "Custom solutions for businesses looking to scale their logistics, delivery, or corporate transport fleets.",
      icon: <LocalGasStationRounded />
    }
  ];

  const stats = [
    { value: "10%", label: "Min. Down Payment" },
    { value: "5 Years", label: "Max Loan Tenure" },
    { value: "24hrs", label: "Pre-Approval Time" }
  ];

  return (
    <ProductLayout
      category="Loans"
      title="Drive your dream"
      highlightText="with ease."
      description="ResolveBridge offers the most flexible vehicle financing options in the market. From personal rides to commercial fleets, we've got you covered."
      benefits={benefits}
      stats={stats}
      heroImage="/images/auto_loans.png"
      ctaText="Calculate My Auto Loan"
    />
  );
}
