'use client';

import { 
  FamilyRestroomRounded, 
  VolunteerActivismRounded, 
  SavingsRounded, 
  AutoGraphRounded,
  HistoryEduRounded,
  SecurityRounded
} from '@mui/icons-material';
import ProductLayout from '../../components/ProductLayout';

export default function LifeInsurancePage() {
  const benefits = [
    { 
      title: "Family Financial Security", 
      desc: "Ensure your loved ones are financially protected and can maintain their lifestyle in the event of your absence.",
      icon: <FamilyRestroomRounded />
    },
    { 
      title: "Investment-Linked Plans", 
      desc: "Combine protection with wealth creation, allowing your premiums to grow over time through managed funds.",
      icon: <SavingsRounded />
    },
    { 
      title: "Funeral & Final Expenses", 
      desc: "Dedicated payout to cover immediate costs, providing peace of mind and dignity during difficult times.",
      icon: <VolunteerActivismRounded />
    },
    { 
      title: "Critical Illness Rider", 
      desc: "Optional coverage that provides a lump sum payment if you are diagnosed with a major medical condition.",
      icon: <AutoGraphRounded />
    },
    { 
      title: "Flexible Premium Options", 
      desc: "Choose from monthly, quarterly, or annual payment schedules that fit your budgeting preferences.",
      icon: <HistoryEduRounded />
    },
    { 
      title: "Tax Benefits", 
      desc: "Benefit from tax-exempt payouts and premium deductions allowed under local financial regulations.",
      icon: <SecurityRounded />
    }
  ];

  const stats = [
    { value: "GH₵500k+", label: "Avg. Payout" },
    { value: "99%", label: "Claims Settled" },
    { value: "Instant", label: "Cover Activation" }
  ];

  return (
    <ProductLayout
      category="Insurance"
      title="Protect the future"
      highlightText="of your family."
      description="ResolveBridge helps you secure your legacy with tailored life insurance policies that provide financial continuity for those who matter most."
      benefits={benefits}
      stats={stats}
      heroImage="/images/life_insurance.png"
      ctaText="Calculate My Coverage"
    />
  );
}
