'use client';

import { 
  HomeRounded, 
  MapsHomeWorkRounded, 
  HandshakeRounded, 
  HistoryEduRounded,
  SpeedRounded,
  VerifiedRounded
} from '@mui/icons-material';
import ProductLayout from '../../components/ProductLayout';

export default function HomeLoansPage() {
  const benefits = [
    { 
      title: "Lowest Market Rates", 
      desc: "Access competitive interest rates from top-tier mortgage lenders, tailored to your financial profile.",
      icon: <HomeRounded />
    },
    { 
      title: "Buy or Build", 
      desc: "Flexible financing for purchasing completed homes or funding your construction project from the ground up.",
      icon: <MapsHomeWorkRounded />
    },
    { 
      title: "Up to 20-Year Terms", 
      desc: "Long-term mortgage options that make home ownership affordable with manageable monthly repayments.",
      icon: <HistoryEduRounded />
    },
    { 
      title: "Pre-Approval in 48h", 
      desc: "Get a clear idea of your budget with our rapid pre-approval process, helping you shop with confidence.",
      icon: <SpeedRounded />
    },
    { 
      title: "Legal & Title Support", 
      desc: "Integrated legal services to ensure your property titles are verified and the transaction is secure.",
      icon: <VerifiedRounded />
    },
    { 
      title: "Joint Application", 
      desc: "Apply with a spouse or partner to increase your borrowing capacity and reach your dream home faster.",
      icon: <HandshakeRounded />
    }
  ];

  const stats = [
    { value: "20 Yrs", label: "Max Loan Tenure" },
    { value: "15%", label: "Min. Down Payment" },
    { value: "48hrs", label: "Pre-Approval Time" }
  ];

  return (
    <ProductLayout
      category="Mortgages"
      title="Secure the home"
      highlightText="you deserve."
      description="ResolveBridge streamlines the mortgage process, connecting you with reputable lenders to turn your home ownership dreams into reality."
      benefits={benefits}
      stats={stats}
      heroImage="/images/home_loans.png"
      ctaText="Check My Mortgage Limit"
    />
  );
}
