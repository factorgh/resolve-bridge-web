'use client';

import { 
  DirectionsCarRounded, 
  SecurityRounded, 
  SpeedRounded, 
  GavelRounded,
  LocalCarWashRounded,
  HandshakeRounded
} from '@mui/icons-material';
import ProductLayout from '../../components/ProductLayout';

export default function AutoInsurancePage() {
  const benefits = [
    { 
      title: "Comprehensive Cover", 
      desc: "Full protection against accidental damage, theft, and fire, ensuring your vehicle is always covered.",
      icon: <SecurityRounded />
    },
    { 
      title: "Third-Party Liability", 
      desc: "Mandatory legal protection against damage to other vehicles or property, keeping you compliant and protected.",
      icon: <GavelRounded />
    },
    { 
      title: "Rapid Claims Settlement", 
      desc: "Our digital claims process means less paperwork and faster repairs, getting you back on the road in no time.",
      icon: <SpeedRounded />
    },
    { 
      title: "Free Roadside Assistance", 
      desc: "24/7 support for towing, battery jumps, and minor repairs wherever you are in the country.",
      icon: <DirectionsCarRounded />
    },
    { 
      title: "Authorized Repair Centers", 
      desc: "Access a wide network of certified garages and service centers that use genuine parts and offer quality work.",
      icon: <LocalCarWashRounded />
    },
    { 
      title: "No-Claims Discount", 
      desc: "Enjoy significant savings on your premiums for every year of accident-free driving.",
      icon: <HandshakeRounded />
    }
  ];

  const stats = [
    { value: "24/7", label: "Incident Support" },
    { value: "48hrs", label: "Repair Approval" },
    { value: "98%", label: "Lender Confidence" }
  ];

  return (
    <ProductLayout
      category="Insurance"
      title="Drive protected with"
      highlightText="comprehensive cover."
      description="ResolveBridge offers the most competitive auto insurance rates from top-tier providers, ensuring every journey is a secure one."
      benefits={benefits}
      stats={stats}
      heroImage="/images/auto_insurance.png"
      ctaText="Request Auto Quote"
    />
  );
}
