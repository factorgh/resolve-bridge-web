'use client';

import { 
  CreditCardRounded, 
  ShoppingBagRounded, 
  WalletRounded, 
  StarsRounded,
  SpeedRounded,
  SecurityRounded
} from '@mui/icons-material';
import ProductLayout from '../../components/ProductLayout';

export default function RetailCardsPage() {
  const benefits = [
    { 
      title: "Earn as You Spend", 
      desc: "Get reward points or cash back on every purchase at your favorite retail partners and boutiques.",
      icon: <StarsRounded />
    },
    { 
      title: "Zero Annual Fee", 
      desc: "Enjoy the benefits of premium retail credit without the burden of annual maintenance charges.",
      icon: <WalletRounded />
    },
    { 
      title: "High Approval Rates", 
      desc: "Our matching engine identifies lenders with credit criteria that align with your unique financial profile.",
      icon: <CreditCardRounded />
    },
    { 
      title: "Exclusive Partner Deals", 
      desc: "Access discounts and early-access sales at a wide network of local and international retailers.",
      icon: <ShoppingBagRounded />
    },
    { 
      title: "Contactless Payments", 
      desc: "Sleek, secure cards with NFC technology for fast and safe transactions at any modern point of sale.",
      icon: <SpeedRounded />
    },
    { 
      title: "Real-time Fraud Alerts", 
      desc: "Advanced security monitoring that notifies you instantly of any suspicious activity on your account.",
      icon: <SecurityRounded />
    }
  ];

  const stats = [
    { value: "5%", label: "Max Cashback" },
    { value: "0", label: "Annual Joining Fee" },
    { value: "Instant", label: "Digital Card Access" }
  ];

  return (
    <ProductLayout
      category="Credit Cards"
      title="Shop with confidence,"
      highlightText="pay with ease."
      description="ResolveBridge connects you with premium retail credit cards that offer more than just credit—they offers a lifestyle of rewards."
      benefits={benefits}
      stats={stats}
      heroImage="/images/retail_card.png"
      ctaText="Browse Card Offers"
    />
  );
}
