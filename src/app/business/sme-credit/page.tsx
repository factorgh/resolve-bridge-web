'use client';

import { 
  InventoryRounded, 
  AccountBalanceRounded, 
  LocalShippingRounded, 
  StorefrontRounded,
  AssessmentRounded,
  HandshakeRounded
} from '@mui/icons-material';
import ProductLayout from '../../components/ProductLayout';

export default function SMECreditPage() {
  const benefits = [
    { 
      title: "Inventory Financing", 
      desc: "Get the capital needed to stock up for peak seasons or fulfill large purchase orders without draining your reserves.",
      icon: <InventoryRounded />
    },
    { 
      title: "Revolving Credit Line", 
      desc: "Access a flexible limit that you can draw from and repay as needed, only paying interest on what you use.",
      icon: <AccountBalanceRounded />
    },
    { 
      title: "Trade Finance", 
      desc: "Facilitate import/export with specialized trade instruments like Letters of Credit and Bank Guarantees.",
      icon: <LocalShippingRounded />
    },
    { 
      title: "Merchant Cash Advance", 
      desc: "Leverage your POS or digital payment volumes to access upfront capital based on your sales frequency.",
      icon: <StorefrontRounded />
    },
    { 
      title: "Data-Driven Limits", 
      desc: "Our engine uses your real-time business data to automatically re-evaluate and increase your credit line.",
      icon: <AssessmentRounded />
    },
    { 
      title: "Flexible Repayment", 
      desc: "Coordinate your repayments with your business cash flow cycles for seamless financial management.",
      icon: <HandshakeRounded />
    }
  ];

  const stats = [
    { value: "GH₵10M", label: "Max Facility Limit" },
    { value: "1.5%", label: "Starting Monthly Rate" },
    { value: "24hrs", label: "Avg. Review Time" }
  ];

  return (
    <ProductLayout
      category="Business"
      title="Dynamic credit for"
      highlightText="growing SMEs."
      description="Fuel your growth with specialized credit solutions designed for the African market. ResolveBridge provides the liquidity you need to scale."
      benefits={benefits}
      stats={stats}
      heroImage="/images/sme_credit.png"
      ctaText="Request Credit Line"
    />
  );
}
