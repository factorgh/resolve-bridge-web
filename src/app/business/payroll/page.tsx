'use client';

import { 
  GroupsRounded, 
  CalendarMonthRounded, 
  HistoryToggleOffRounded, 
  PriceCheckRounded,
  SpeedRounded,
  SecurityRounded
} from '@mui/icons-material';
import ProductLayout from '../../components/ProductLayout';

export default function PayrollFinancePage() {
  const benefits = [
    { 
      title: "Salary Advance Support", 
      desc: "Empower your employees with the ability to access a portion of their earned salary before payday for urgent needs.",
      icon: <PriceCheckRounded />
    },
    { 
      title: "Payroll Smoothing", 
      desc: "Manage your company's cash flow by spreading payroll costs over a longer period, ensuring everyone is paid on time.",
      icon: <CalendarMonthRounded />
    },
    { 
      title: "Automated Disbursement", 
      desc: "Integrate with your HR system to automate payments and deductions, reducing manual overhead and errors.",
      icon: <SpeedRounded />
    },
    { 
      title: "Employee Retention", 
      desc: "Improve staff morale and retention by offering competitive financial wellness benefits and emergency support.",
      icon: <GroupsRounded />
    },
    { 
      title: "Zero Risk to Employer", 
      desc: "Our model ensures that salary advances are settled directly through payroll, with no financial liability for the business.",
      icon: <SecurityRounded />
    },
    { 
      title: "Quick Setup", 
      desc: "Onboard your entire team in minutes with our streamlined digital integration process.",
      icon: <HistoryToggleOffRounded />
    }
  ];

  const stats = [
    { value: "0%", label: "Employer Liability" },
    { value: "Instant", label: "Employee Access" },
    { value: "100%", label: "Digital Integration" }
  ];

  return (
    <ProductLayout
      category="Business"
      title="Empower your team with"
      highlightText="flexible payroll."
      description="ResolveBridge's payroll solutions ensure your employees are financially secure while giving your business the cash flow flexibility it needs."
      benefits={benefits}
      stats={stats}
      heroImage="/images/payroll_finance.png"
      ctaText="Enable Payroll Support"
    />
  );
}
