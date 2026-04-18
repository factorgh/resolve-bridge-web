'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/* ─── Types ────────────────────────────────────────────────────────────────── */

type StepId = 'goals' | 'account' | 'phone' | 'kyc' | 'finance' | 'analysis' | 'success';

interface OnboardingData {
  goals: string[];
  email: string;
  password: string;
  phone: string;
  firstName: string;
  lastName: string;
  dob: string;
  idType: string;
  idNumber: string;
  employmentStatus: string;
  monthlyIncome: string;
  loanDuration: string;
}

/* ─── Constants ─────────────────────────────────────────────────────────────── */

const NAV_STEPS: { id: StepId; label: string }[] = [
  { id: 'goals',   label: 'Your goals'     },
  { id: 'account', label: 'Create account' },
  { id: 'phone',   label: 'Verify phone'   },
  { id: 'kyc',     label: 'Identity check' },
  { id: 'finance', label: 'Financials'     },
  { id: 'analysis',label: 'Matching'       },
];

const STEP_PROGRESS: Record<StepId, number> = {
  goals:    15,
  account:  30,
  phone:    45,
  kyc:      60,
  finance:  75,
  analysis: 90,
  success:  100,
};

const STEP_LABEL: Record<StepId, string> = {
  goals:    'Step 1 of 6',
  account:  'Step 2 of 6',
  phone:    'Step 3 of 6',
  kyc:      'Step 4 of 6',
  finance:  'Step 5 of 6',
  analysis: 'Step 6 of 6',
  success:  'Complete',
};

const GOAL_OPTIONS = [
  {
    id: 'loans',
    label: 'Loans',
    desc: 'Personal & business funding from 200+ lenders',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" width={18} height={18}>
        <path d="M2 17h16M2 14h16M4 14V8M8 14V8M12 14V8M16 14V8M2 8l8-6 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'insurance',
    label: 'Insurance',
    desc: 'Health, life, and automotive coverage',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" width={18} height={18}>
        <path d="M10 2L4 5v5c0 3.3 2.5 6.2 6 7 3.5-.8 6-3.7 6-7V5l-6-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'mortgage',
    label: 'Mortgages',
    desc: 'Competitive rates to buy or build your home',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" width={18} height={18}>
        <path d="M3 9.5L10 3l7 6.5M5 9v7h4v-4h2v4h4V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'business',
    label: 'SME Credit',
    desc: 'Revolving credit lines for business growth',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" width={18} height={18}>
        <path d="M2 18h16M4 18V8l6-5 6 5v10M8 18v-5h4v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const ID_TYPES = ['Ghana Card', 'NIN (Nigeria)', 'Kenyan ID', 'EcoBank ID', 'Other'];

const ANALYSIS_STEPS = [
  { label: 'Profile validated',      delay: 0    },
  { label: 'Identity confirmed',     delay: 600  },
  { label: 'Matching institutions…', delay: 1200 },
  { label: 'Generating dashboard',   delay: 2200 },
];

/* ─── Icons ──────────────────────────────────────────────────────────────────── */

const ArrowRight = ({ size = 14 }: { size?: number }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowLeft = ({ size = 14 }: { size?: number }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} fill="none">
    <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckSmall = () => (
  <svg viewBox="0 0 10 10" width={10} height={10} fill="none">
    <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckMd = () => (
  <svg viewBox="0 0 10 10" width={10} height={10} fill="none">
    <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 16 16" width={13} height={13} fill="none">
    <path d="M8 2L3 4.5v4c0 2.6 2 4.8 5 5.5 3-.7 5-2.9 5-5.5v-4L8 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

const CheckLg = () => (
  <svg viewBox="0 0 32 32" width={28} height={28} fill="none">
    <path d="M6 16l7 7 13-13" stroke="#0e9f6e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EyeOpen = () => (
  <svg viewBox="0 0 20 20" width={18} height={18} fill="none">
    <path d="M2 10s3-7 8-7 8 7 8 7-3 7-8 7-8-7-8-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EyeClosed = () => (
  <svg viewBox="0 0 20 20" width={18} height={18} fill="none">
    <path d="M17.94 17.94A10.07 10.07 0 0110 20c-5 0-8-7-8-7a10.07 10.07 0 012.18-3.18M10 3c5 0 8 7 8 7a10.07 10.07 0 00-2.18 3.18M3 3l14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.12 12.12a3 3 0 01-4.24-4.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─── Sub-components ─────────────────────────────────────────────────────────── */

function StepDot({ state }: { state: 'done' | 'current' | 'pending' }) {
  const base =
    'w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-medium transition-all duration-300';
  if (state === 'done')
    return (
      <span className={`${base} bg-[#0e9f6e] text-white`}>
        <CheckMd />
      </span>
    );
  if (state === 'current')
    return (
      <span
        className={`${base} bg-[#1a56db] text-white`}
        style={{ boxShadow: '0 0 0 4px rgba(26,86,219,0.25)' }}
      >
        •
      </span>
    );
  return <span className={`${base} bg-white/8 text-white/30`}>·</span>;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-slate-700 mb-1.5 tracking-[0.01em]">
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full h-[42px] border border-slate-200 rounded-lg px-3 text-sm text-slate-900 bg-white outline-none transition-all focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/8 placeholder:text-slate-400"
    />
  );
}

function BtnPrimary({
  children,
  disabled,
  onClick,
  full,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  full?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 h-[42px] px-5 bg-[#1a56db] text-white text-sm font-medium rounded-lg transition-all active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed hover:bg-[#1547c0] ${full ? 'w-full justify-center' : ''}`}
    >
      {children}
    </button>
  );
}

function BtnGhost({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-800 transition-colors bg-transparent border-none"
    >
      {children}
    </button>
  );
}

function BtnRow({
  onBack,
  onNext,
  nextLabel = 'Continue',
  nextDisabled,
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between mt-6">
      {onBack ? (
        <BtnGhost onClick={onBack}>
          <ArrowLeft /> Back
        </BtnGhost>
      ) : (
        <span />
      )}
      <BtnPrimary onClick={onNext} disabled={nextDisabled}>
        {nextLabel} <ArrowRight />
      </BtnPrimary>
    </div>
  );
}

function SecurityBadge({ center }: { center?: boolean }) {
  return (
    <p
      className={`inline-flex items-center gap-1.5 text-[11px] text-slate-400 mt-4 ${center ? 'justify-center w-full' : ''}`}
    >
      <ShieldIcon /> 256-bit SSL · Bank-grade encryption
    </p>
  );
}

function PanelHead({
  eyebrow,
  title,
  italic,
  sub,
}: {
  eyebrow: string;
  title: string;
  italic: string;
  sub: string;
}) {
  return (
    <div className="mb-8">
      <p className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#1a56db] mb-2">
        {eyebrow}
      </p>
      <h1 className="text-[26px] font-medium text-slate-900 leading-tight tracking-[-0.5px] mb-1.5">
        {title}
        <br />
        <em className="not-italic" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#1a56db', fontWeight: 400 }}>
          {italic}
        </em>
      </h1>
      <p className="text-sm text-slate-500 leading-relaxed">{sub}</p>
    </div>
  );
}

/* ─── Step Screens ───────────────────────────────────────────────────────────── */

function GoalsStep({
  goals,
  onToggle,
  onNext,
}: {
  goals: string[];
  onToggle: (id: string) => void;
  onNext: () => void;
}) {
  return (
    <>
      <PanelHead
        eyebrow="Getting started"
        title="What can we help you"
        italic="Resolve?"
        sub="Select the financial products you need. You can add more later."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-7">
        {GOAL_OPTIONS.map((g) => {
          const sel = goals.includes(g.id);
          return (
            <button
              key={g.id}
              onClick={() => onToggle(g.id)}
              className={`relative text-left p-4 rounded-xl border-[1.5px] transition-all cursor-pointer ${
                sel
                  ? 'border-[#1a56db] bg-[#eff4ff]'
                  : 'border-slate-200 hover:border-[#c7d8f8] hover:bg-[#eff4ff]/50 bg-white'
              }`}
            >
              {sel && (
                <span className="absolute top-3 right-3 w-[18px] h-[18px] bg-[#1a56db] rounded-full flex items-center justify-center">
                  <CheckSmall />
                </span>
              )}
              <span
                className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                  sel ? 'bg-[#1a56db] text-white' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {g.icon}
              </span>
              <p className="text-sm font-medium text-slate-900 mb-0.5">{g.label}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{g.desc}</p>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end">
        <BtnPrimary onClick={onNext} disabled={goals.length === 0}>
          Continue <ArrowRight />
        </BtnPrimary>
      </div>
    </>
  );
}

function AccountStep({
  data,
  onChange,
  onBack,
  onNext,
}: {
  data: OnboardingData;
  onChange: (k: keyof OnboardingData, v: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [showPwd, setShowPwd] = useState(false);

  return (
    <>
      <PanelHead
        eyebrow="Account setup"
        title="Create your"
        italic="Resolve ID"
        sub="Your single digital identity across Africa's financial ecosystem."
      />

      <div className="space-y-4">
        <div>
          <FieldLabel>Email address</FieldLabel>
          <Input
            type="email"
            placeholder="you@example.com"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Password</FieldLabel>
          <div className="relative">
            <Input
              type={showPwd ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              value={data.password}
              onChange={(e) => onChange('password', e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none p-1 cursor-pointer"
            >
              {showPwd ? <EyeOpen /> : <EyeClosed />}
            </button>
          </div>
        </div>
        <div>
          <FieldLabel>Confirm password</FieldLabel>
          <div className="relative">
            <Input
              type={showPwd ? 'text' : 'password'}
              placeholder="Repeat password"
            />
          </div>
        </div>
      </div>

      <BtnRow onBack={onBack} onNext={onNext} nextLabel="Continue" />
      <SecurityBadge />
    </>
  );
}

function PhoneStep({
  data,
  onChange,
  onBack,
  onNext,
}: {
  data: OnboardingData;
  onChange: (k: keyof OnboardingData, v: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const refs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  // Validation: Starts with + and has at least 10 more digits
  const isPhoneValid = data.phone.startsWith('+') && data.phone.replace(/[^0-9]/g, '').length >= 10;

  const handlePhoneChange = (val: string) => {
    // Only allow +, and digits. Remove all other characters.
    const filtered = val.replace(/[^0-9+]/g, '');
    // Ensure only one + at the start
    const cleaned = filtered.startsWith('+') ? '+' + filtered.slice(1).replace(/\+/g, '') : filtered.replace(/\+/g, '');
    onChange('phone', cleaned);
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) refs[i + 1].current?.focus();
  };

  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs[i - 1].current?.focus();
  };

  return (
    <>
      <PanelHead
        eyebrow="Verification"
        title="Verify your"
        italic={otpSent ? 'access code' : 'phone number'}
        sub={
          otpSent
            ? 'Enter the 6-digit code we sent to your phone.'
            : "We'll send a one-time code to confirm your device."
        }
      />

      {!otpSent ? (
        <>
          <div className="space-y-4">
            <div>
              <FieldLabel>Mobile number</FieldLabel>
              <div className="relative">
                <Input
                  type="tel"
                  placeholder="+233 24 000 0000"
                  value={data.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                />
                {isPhoneValid && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                    <CheckSmall />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 flex justify-between">
                <span>Include country code (e.g. +233 for Ghana)</span>
                {data.phone.length > 1 && !data.phone.startsWith('+') && (
                  <span className="text-rose-500 font-medium">Must start with +</span>
                )}
              </p>
            </div>
          </div>
          <BtnRow 
            onBack={onBack} 
            onNext={() => setOtpSent(true)} 
            nextLabel="Send code" 
            nextDisabled={!isPhoneValid}
          />
        </>
      ) : (
        <>
          <div className="flex justify-center gap-2.5 mb-10">
            {otp.map((digit, i) => (
              <React.Fragment key={i}>
                <input
                  ref={refs[i]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKey(i, e)}
                  className={`w-12 h-14 border-2 rounded-xl text-center text-xl font-bold transition-all outline-none ${
                    digit 
                      ? 'border-[#1a56db] bg-white text-[#1a56db]' 
                      : 'border-slate-100 bg-slate-50 text-slate-300 focus:border-[#1a56db] focus:bg-white focus:ring-4 focus:ring-[#1a56db]/5'
                  }`}
                />
                {i === 2 && <div className="w-2 h-14 flex items-center justify-center text-slate-200">—</div>}
              </React.Fragment>
            ))}
          </div>
          <div className="text-center mb-8">
            <button
              onClick={() => {
                setOtpSent(false);
                setOtp(['', '', '', '', '', '']);
              }}
              className="text-xs font-medium text-[#1a56db] hover:text-[#1547c0] bg-transparent border-none cursor-pointer transition-colors"
            >
              Resend access code
            </button>
          </div>
          <BtnRow
            onBack={() => setOtpSent(false)}
            onNext={onNext}
            nextLabel="Verify & continue"
            nextDisabled={otp.join('').length < 6}
          />
        </>
      )}
    </>
  );
}

function KycStep({
  data,
  onChange,
  onBack,
  onNext,
}: {
  data: OnboardingData;
  onChange: (k: keyof OnboardingData, v: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <>
      <PanelHead
        eyebrow="Identity verification"
        title="Verify your"
        italic="identity"
        sub="Required for institutional compliance across partner networks."
      />

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <FieldLabel>First name</FieldLabel>
            <Input
              placeholder="Kwame"
              value={data.firstName}
              onChange={(e) => onChange('firstName', e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>Last name</FieldLabel>
            <Input
              placeholder="Asante"
              value={data.lastName}
              onChange={(e) => onChange('lastName', e.target.value)}
            />
          </div>
        </div>

        <div>
          <FieldLabel>Date of birth</FieldLabel>
          <Input
            type="date"
            value={data.dob}
            onChange={(e) => onChange('dob', e.target.value)}
          />
        </div>

        <div>
          <FieldLabel>ID type</FieldLabel>
          <div className="flex flex-wrap gap-2 mt-1">
            {ID_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => onChange('idType', t)}
                className={`px-3.5 h-8 rounded-full text-xs transition-all border ${
                  data.idType === t
                    ? 'border-[#1a56db] bg-[#eff4ff] text-[#1a56db] font-medium'
                    : 'border-slate-200 text-slate-400 bg-white hover:border-[#c7d8f8] hover:text-[#1a56db]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <FieldLabel>Document number</FieldLabel>
          <Input
            placeholder="GHA-123456789-0"
            value={data.idNumber}
            onChange={(e) => onChange('idNumber', e.target.value)}
          />
        </div>
      </div>

      <BtnRow onBack={onBack} onNext={onNext} nextLabel="Finish setup" />
    </>
  );
}

function FinanceStep({
  data,
  onChange,
  onBack,
  onNext,
}: {
  data: OnboardingData;
  onChange: (k: keyof OnboardingData, v: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <>
      <PanelHead
        eyebrow="Financial profile"
        title="Check your"
        italic="eligibility"
        sub="Our engine needs this data to secure accurate institutional rates."
      />

      <div className="space-y-6">
        <div>
          <FieldLabel>Employment status</FieldLabel>
          <div className="flex flex-wrap gap-2 mt-1">
            {['Employed', 'Self-Employed', 'Business Owner', 'Contractor', 'Other'].map(s => (
              <button
                key={s}
                onClick={() => onChange('employmentStatus', s)}
                className={`px-3.5 h-8 rounded-full text-xs transition-all border ${
                  data.employmentStatus === s
                    ? 'border-[#1a56db] bg-[#eff4ff] text-[#1a56db] font-medium'
                    : 'border-slate-200 text-slate-400 bg-white hover:border-[#c7d8f8] hover:text-[#1a56db]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <FieldLabel>Monthly income range</FieldLabel>
          <div className="grid grid-cols-2 gap-2.5">
            {['GHe 0 – 2,500', 'GHe 2,501 – 5,000', 'GHe 5,001 – 15,000', 'GHe 15,001 – 30,000', 'GHe 30,001 – 50,000', 'GHe 50,000+'].map(bracket => {
              const sel = data.monthlyIncome === bracket;
              return (
                <button
                  key={bracket}
                  onClick={() => onChange('monthlyIncome', bracket)}
                  className={`text-left px-3 py-2 rounded-lg border-[1.5px] transition-all text-xs ${
                    sel 
                      ? 'border-[#1a56db] bg-[#eff4ff] text-[#1a56db] font-medium' 
                      : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                  }`}
                >
                  {bracket}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <FieldLabel>Loan duration needed</FieldLabel>
          <div className="flex flex-wrap gap-2 mt-1">
            {['3 mos', '6 mos', '1 yr', '2 yrs', '3 yrs', '5+ yrs'].map(d => (
              <button
                key={d}
                onClick={() => onChange('loanDuration', d)}
                className={`px-3.5 h-8 rounded-full text-xs transition-all border ${
                  data.loanDuration === d
                    ? 'border-[#1a56db] bg-[#eff4ff] text-[#1a56db] font-medium'
                    : 'border-slate-200 text-slate-400 bg-white hover:border-[#c7d8f8] hover:text-[#1a56db]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      <BtnRow 
        onBack={onBack} 
        onNext={onNext} 
        nextLabel="See matches" 
        nextDisabled={!data.employmentStatus || !data.monthlyIncome || !data.loanDuration}
      />
    </>
  );
}

function AnalysisStep() {
  const [doneCount, setDoneCount] = useState(0);

  useEffect(() => {
    ANALYSIS_STEPS.forEach((_, i) => {
      setTimeout(() => setDoneCount(i + 1), ANALYSIS_STEPS[i].delay + 400);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-10">
      <div
        className="w-16 h-16 rounded-full border-2 border-slate-200 border-t-[#1a56db] mb-7"
        style={{ animation: 'spin 0.9s linear infinite' }}
      />
      <p className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#1a56db] mb-2">
        Almost there
      </p>
      <h2 className="text-[26px] font-medium text-slate-900 leading-tight tracking-[-0.5px] mb-2">
        Finding your{' '}
        <em
          style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#1a56db', fontWeight: 400 }}
        >
          best matches
        </em>
      </h2>
      <p className="text-sm text-slate-500 mb-8">
        Scanning 40,000+ data points across 200 partner institutions
      </p>

      <div className="w-full max-w-[320px] text-left">
        {ANALYSIS_STEPS.map((s, i) => {
          const done = i < doneCount;
          const current = i === doneCount - 1 && doneCount <= ANALYSIS_STEPS.length;
          return (
            <div
              key={i}
              className={`flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-b-0 text-sm transition-colors ${
                done ? 'text-slate-700' : 'text-slate-400'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 transition-all ${
                  done
                    ? 'bg-[#0e9f6e]'
                    : current
                    ? 'bg-[#1a56db] animate-pulse'
                    : 'bg-slate-200'
                }`}
              />
              {s.label}
            </div>
          );
        })}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function SuccessStep({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-10">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 100 }}
        className="w-16 h-16 rounded-full bg-[#e8f5ef] flex items-center justify-center mb-6"
      >
        <CheckLg />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#0e9f6e] mb-2">
          You're in
        </p>
        <h2 className="text-[26px] font-medium text-slate-900 leading-tight tracking-[-0.5px] mb-3">
          Bridge{' '}
          <em
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#0e9f6e', fontWeight: 400 }}
          >
            established.
          </em>
        </h2>
        <p className="text-sm text-slate-500 max-w-xs mb-7 leading-relaxed">
          Your Resolve ID is active. You now have access to Africa's largest institutional finance network.
        </p>

        <button
          onClick={onEnter}
          className="inline-flex items-center gap-2 h-[42px] px-6 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-[#1a56db] transition-colors"
        >
          Enter portal <ArrowRight />
        </button>

        <p className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 mt-5 justify-center w-full">
          <ShieldIcon /> ISO 27001 · AES-256 · Protocol V4.0
        </p>
      </motion.div>
    </div>
  );
}

/* ─── Rail ───────────────────────────────────────────────────────────────────── */

function Rail({ current }: { current: StepId }) {
  const currentIdx = NAV_STEPS.findIndex((s) => s.id === current);
  const progress = STEP_PROGRESS[current];
  const progressLabel = STEP_LABEL[current];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[260px] shrink-0 bg-slate-900 flex-col p-8 relative overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#1a56db] opacity-[0.12] rounded-full pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-indigo-500 opacity-[0.08] rounded-full pointer-events-none" />

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 mb-12 no-underline z-10 group">
          <img 
            src="/images/resolve_logo.png" 
            alt="ResolveBridge" 
            className="h-7 w-auto group-hover:scale-105 transition-transform" 
            style={{ filter: 'brightness(1.6)' }}
          />
        </Link>

        {/* Steps */}
        <nav className="flex flex-col gap-1 flex-1 z-10">
          {NAV_STEPS.map((s, i) => {
            const state: 'done' | 'current' | 'pending' =
              i < currentIdx ? 'done' : i === currentIdx ? 'current' : 'pending';
            const isActive = s.id === current;
            return (
              <div
                key={s.id}
                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-white/7' : ''}`}
              >
                <StepDot state={state} />
                <span
                  className={`text-[13px] transition-colors ${isActive ? 'text-white' : 'text-white/35'}`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </nav>

        {/* Progress */}
        <div className="border-t border-white/8 pt-5 z-10">
          <div className="h-[3px] bg-white/10 rounded-full overflow-hidden mb-2">
            <motion.div
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="h-full bg-[#1a56db] rounded-full"
            />
          </div>
          <p className="text-[11px] text-white/30">{progressLabel}</p>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="flex md:hidden w-full bg-slate-900 px-6 py-4 items-center justify-between sticky top-0 z-50">
        <Link href="/">
          <img 
            src="/images/resolve_logo.png" 
            alt="ResolveBridge" 
            className="h-5 w-auto" 
            style={{ filter: 'brightness(1.2)' }}
          />
        </Link>
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex gap-1">
            {NAV_STEPS.map((s, i) => (
               <div 
                 key={s.id} 
                 className={`w-1.5 h-1.5 rounded-full ${i <= currentIdx ? 'bg-[#1a56db]' : 'bg-white/20'}`} 
               />
            ))}
          </div>
          <p className="text-[10px] font-medium text-white/40 uppercase tracking-wider">{progressLabel}</p>
        </div>
      </header>
    </>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────────── */

const PANEL_VARIANTS = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -10 },
};

export default function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState<StepId>('goals');
  const [data, setData] = useState<OnboardingData>({
    goals: [],
    email: '',
    password: '',
    phone: '',
    firstName: '',
    lastName: '',
    dob: '',
    idType: '',
    idNumber: '',
    employmentStatus: '',
    monthlyIncome: '',
    loanDuration: '',
  });

  const set = (k: keyof OnboardingData, v: string) =>
    setData((prev) => ({ ...prev, [k]: v }));

  const toggleGoal = (id: string) =>
    setData((prev) => ({
      ...prev,
      goals: prev.goals.includes(id)
        ? prev.goals.filter((g) => g !== id)
        : [...prev.goals, id],
    }));

  const goTo = (s: StepId) => setStep(s);

  // Auto-advance from analysis
  useEffect(() => {
    if (step === 'analysis') {
      const t = setTimeout(() => setStep('success'), 3500);
      return () => clearTimeout(t);
    }
  }, [step]);

  return (
    <>
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Playfair+Display:ital@1&display=swap');`}</style>

      <div
        className="min-h-screen bg-slate-50 flex items-center justify-center sm:p-4"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="flex flex-col md:flex-row w-full max-w-[1200px] min-h-screen md:min-h-[720px] bg-white md:rounded-2xl overflow-hidden border-0 md:border border-slate-200 shadow-none md:shadow-xl md:shadow-slate-200/60 transition-all">

          <Rail current={step} />

          {/* Panel */}
          <main className="flex-1 overflow-y-auto p-6 md:p-10 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={PANEL_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="h-full"
              >
                {step === 'goals' && (
                  <GoalsStep
                    goals={data.goals}
                    onToggle={toggleGoal}
                    onNext={() => goTo('account')}
                  />
                )}
                {step === 'account' && (
                  <AccountStep
                    data={data}
                    onChange={set}
                    onBack={() => goTo('goals')}
                    onNext={() => goTo('phone')}
                  />
                )}
                {step === 'phone' && (
                  <PhoneStep
                    data={data}
                    onChange={set}
                    onBack={() => goTo('account')}
                    onNext={() => goTo('kyc')}
                  />
                )}
                {step === 'kyc' && (
                  <KycStep
                    data={data}
                    onChange={set}
                    onBack={() => goTo('phone')}
                    onNext={() => goTo('finance')}
                  />
                )}
                {step === 'finance' && (
                   <FinanceStep
                      data={data}
                      onChange={set}
                      onBack={() => goTo('kyc')}
                      onNext={() => goTo('analysis')}
                   />
                )}
                {step === 'analysis' && <AnalysisStep />}
                {step === 'success' && <SuccessStep onEnter={() => router.push('/portal')} />}
              </motion.div>
            </AnimatePresence>
          </main>

        </div>
      </div>
    </>
  );
}