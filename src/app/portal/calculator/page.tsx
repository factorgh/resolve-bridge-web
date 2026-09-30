'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import PortalShell, { C, F } from '../components/PortalShell';

export default function CalculatorPage() {
  const router = useRouter();
  const [amount, setAmount] = useState(10000);
  const [term, setTerm] = useState(24);
  const [rate, setRate] = useState(2);
  const [rateType, setRateType] = useState('monthly'); // 'monthly' or 'yearly'
  
  const [amountStr, setAmountStr] = useState("10000");
  const [termStr, setTermStr] = useState("24");
  const [rateStr, setRateStr] = useState("2");

  const [isCalculating, setIsCalculating] = useState(false);
  const calcTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsCalculating(true);
    if (calcTimeoutRef.current) {
      clearTimeout(calcTimeoutRef.current);
    }
    calcTimeoutRef.current = setTimeout(() => {
      setIsCalculating(false);
    }, 200);

    return () => {
      if (calcTimeoutRef.current) {
        clearTimeout(calcTimeoutRef.current);
      }
    };
  }, [amount, term, rate, rateType]);

  const logMin = 1000;
  const logMax = 1000000000; // 1 Billion limit (slider logarithmic mapping)
  const amountToPos = (amt: number) => {
    if (amt <= logMin) return 0;
    return (Math.log(amt / logMin) / Math.log(logMax / logMin)) * 100;
  };
  const posToAmount = (pos: number) => {
    const val = logMin * Math.pow(logMax / logMin, pos / 100);
    if (val < 10000) return Math.round(val / 1000) * 1000;
    if (val < 100000) return Math.round(val / 5000) * 5000;
    if (val < 1000000) return Math.round(val / 50000) * 50000;
    return Math.round(val / 1000000) * 1000000;
  };

  const handleAmountChange = (valStr: string) => {
    setAmountStr(valStr);
    const parsed = parseFloat(valStr);
    if (!isNaN(parsed)) {
      const clamped = Math.max(0, parsed);
      setAmount(clamped);
    }
  };

  const handleAmountBlur = () => {
    let parsed = parseFloat(amountStr);
    if (isNaN(parsed)) {
      parsed = 1000;
    }
    const clamped = Math.max(1000, parsed);
    setAmount(clamped);
    setAmountStr(clamped.toString());
  };

  const handleTermChange = (valStr: string) => {
    setTermStr(valStr);
    const parsed = parseInt(valStr);
    if (!isNaN(parsed)) {
      const clamped = Math.max(0, Math.min(84, parsed));
      setTerm(clamped);
    }
  };

  const handleTermBlur = () => {
    let parsed = parseInt(termStr);
    if (isNaN(parsed)) {
      parsed = 24;
    }
    const clamped = Math.max(6, Math.min(84, parsed));
    setTerm(clamped);
    setTermStr(clamped.toString());
  };

  const handleRateChange = (valStr: string) => {
    setRateStr(valStr);
    const parsed = parseFloat(valStr);
    if (!isNaN(parsed)) {
      const isYearly = rateType === 'yearly';
      const clamped = Math.max(0, Math.min(isYearly ? 48 : 15, parsed));
      setRate(clamped);
    }
  };

  const handleRateBlur = () => {
    let parsed = parseFloat(rateStr);
    const isYearly = rateType === 'yearly';
    if (isNaN(parsed)) {
      parsed = isYearly ? 18 : 2;
    }
    const clamped = Math.max(isYearly ? 5 : 0.5, Math.min(isYearly ? 48 : 15, parsed));
    setRate(clamped);
    setRateStr(clamped.toString());
  };

  // Flat Rate Calculation
  const monthlyRate = rateType === 'yearly' ? (rate / 100 / 12) : (rate / 100);
  const monthlyPayment = term > 0 ? (amount / term) + (amount * monthlyRate) : 0;
  const totalRepayable = monthlyPayment * term;
  const totalInterest = totalRepayable - amount;

  // Payment breakdowns
  const weeklyPayment = (monthlyPayment * 12) / 52;
  const dailyPayment = (monthlyPayment * 12) / 365;

  return (
    <PortalShell 
      title="Calculators" 
      subtitle="Estimate your monthly payments and explore loan options."
    >
      <div className="calc-container">
        {/* Header Title Row */}
        <div className="calc-header-row">
          <div>
            <h1 className="calc-page-title">Loan calculator</h1>
            <p className="calc-page-subtitle">
              Estimate your monthly payments and discover tailored repayment terms.
            </p>
          </div>
        </div>

        {/* Main Grid: Inputs + Results */}
        <div className="calc-grid">
          
          {/* Left Column: Inputs */}
          <div className="calc-card">
            {/* Loan Amount */}
            <div className="calc-field">
              <label className="calc-label">Loan amount</label>
              <div className="calc-input-box">
                <span className="calc-currency">GH₵</span>
                <input 
                  type="number" 
                  value={amountStr} 
                  onChange={e => handleAmountChange(e.target.value)}
                  onBlur={handleAmountBlur}
                  className="calc-input"
                />
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="0.01" 
                value={amountToPos(amount)} 
                onChange={e => {
                  const amt = posToAmount(parseFloat(e.target.value));
                  setAmount(amt);
                  setAmountStr(amt.toString());
                }}
                className="calc-slider"
              />
              <div className="calc-range-labels">
                <span>GH₵ 1,000</span>
                <span>Infinity</span>
              </div>
            </div>

            {/* Repayment Term */}
            <div className="calc-field">
              <label className="calc-label">Repayment term</label>
              <div className="calc-input-box">
                <input 
                  type="number" 
                  value={termStr} 
                  onChange={e => handleTermChange(e.target.value)}
                  onBlur={handleTermBlur}
                  className="calc-input"
                />
                <span className="calc-unit">Months</span>
              </div>
              <input 
                type="range" 
                min="6" 
                max="84" 
                step="6" 
                value={term} 
                onChange={e => {
                  const val = Number(e.target.value);
                  setTerm(val);
                  setTermStr(val.toString());
                }}
                className="calc-slider"
              />
              <div className="calc-range-labels">
                <span>6 Mo</span>
                <span>84 Mo</span>
              </div>
            </div>

            {/* Expected Interest Rate */}
            <div className="calc-field" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label className="calc-label" style={{ margin: 0 }}>Expected interest rate (flat)</label>
                <span className="calc-badge-green">Market avg</span>
              </div>
              <div className="calc-input-box">
                <input 
                  type="number" 
                  step="0.1"
                  value={rateStr} 
                  onChange={e => handleRateChange(e.target.value)}
                  onBlur={handleRateBlur}
                  className="calc-input"
                />
                <select
                  value={rateType}
                  onChange={e => {
                    const nextType = e.target.value;
                    setRateType(nextType);
                    const nextRate = nextType === 'yearly' 
                      ? Math.min(36, Math.max(10, rate)) 
                      : Math.min(10, Math.max(1, rate));
                    setRate(nextRate);
                    setRateStr(nextRate.toString());
                  }}
                  className="calc-select"
                >
                  <option value="monthly">% / Month</option>
                  <option value="yearly">% p.a. (Yearly)</option>
                </select>
              </div>
              <input 
                type="range" 
                min={rateType === 'yearly' ? 10 : 1} 
                max={rateType === 'yearly' ? 36 : 10} 
                step={rateType === 'yearly' ? 0.5 : 0.1} 
                value={rate} 
                onChange={e => {
                  const val = Number(e.target.value);
                  setRate(val);
                  setRateStr(val.toString());
                }}
                className="calc-slider"
              />
              <div className="calc-range-labels">
                <span>{rateType === 'yearly' ? '10%' : '1%'}</span>
                <span>{rateType === 'yearly' ? '36%' : '10%'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Results Summary */}
          <div className="calc-results-col">
            <div className="calc-gradient-card">
              <p className="calc-gradient-label">Estimated monthly payment</p>
              <div className="calc-gradient-amount">
                GH₵ {Math.round(monthlyPayment).toLocaleString()}
              </div>
              
              <div className="calc-gradient-divider" />

              <div className="calc-gradient-row">
                <div>
                  <div className="calc-gradient-sublabel">Weekly repayment</div>
                  <div className="calc-gradient-subval">GH₵ {Math.round(weeklyPayment).toLocaleString()}</div>
                </div>
                <div>
                  <div className="calc-gradient-sublabel">Daily repayment</div>
                  <div className="calc-gradient-subval">GH₵ {Math.round(dailyPayment).toLocaleString()}</div>
                </div>
              </div>

              <div className="calc-gradient-divider" />

              <div className="calc-gradient-row">
                <div>
                  <div className="calc-gradient-sublabel">Total interest</div>
                  <div className="calc-gradient-subval">GH₵ {Math.round(totalInterest).toLocaleString()}</div>
                </div>
                <div>
                  <div className="calc-gradient-sublabel">Total repayable</div>
                  <div className="calc-gradient-subval">GH₵ {Math.round(totalRepayable).toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Pro Tip Card */}
            {term > 12 && (
              <div className="calc-tip-card">
                <div className="calc-tip-icon">💡</div>
                <div style={{ flex: 1 }}>
                  <div className="calc-tip-title">Pro tip</div>
                  <p className="calc-tip-text">
                    By shortening your term to <strong style={{ color: '#101a33' }}>12 months</strong>, you could save{' '}
                    <strong style={{ color: '#1f8a5b' }}>
                      GH₵ {Math.round(Math.max(0, totalInterest - (12 * amount * monthlyRate))).toLocaleString()}
                    </strong>{' '}
                    in interest.
                  </p>
                </div>
              </div>
            )}

            {/* Action CTA */}
            <button 
              onClick={() => router.push('/portal/marketplace')}
              className="calc-cta-btn"
            >
              View real offers in marketplace →
            </button>
          </div>
        </div>

        {/* Why use our Calculator Section */}
        <div className="calc-benefits-section">
          <div className="calc-benefits-header">
            <h2 className="calc-benefits-title">Why use our calculator?</h2>
            <p className="calc-benefits-subtitle">
              Transparent results with zero hidden fees, built for the Ghanaian market.
            </p>
          </div>

          <div className="calc-benefits-grid">
            <div className="calc-benefit-card">
              <div className="calc-benefit-icon">🎯</div>
              <h3 className="calc-benefit-card-title">Market accuracy</h3>
              <p className="calc-benefit-card-desc">
                Our rates are synced with 15+ local lenders in Ghana for live comparisons.
              </p>
            </div>

            <div className="calc-benefit-card">
              <div className="calc-benefit-icon">🛡️</div>
              <h3 className="calc-benefit-card-title">Zero credit impact</h3>
              <p className="calc-benefit-card-desc">
                Estimate your monthly budget and compare offers without hitting your credit score.
              </p>
            </div>

            <div className="calc-benefit-card">
              <div className="calc-benefit-icon">🔍</div>
              <h3 className="calc-benefit-card-title">Hidden fee detector</h3>
              <p className="calc-benefit-card-desc">
                We show you the complete total repayable amount, not just the base interest rate.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .calc-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 36px 36px 64px;
          box-sizing: border-box;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .calc-header-row {
          margin-bottom: 24px;
        }

        .calc-page-title {
          margin: 0;
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(28px, 3.5vw, 36px);
          font-weight: 600;
          color: #101a33;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }

        .calc-page-subtitle {
          margin: 6px 0 0;
          font-size: 14px;
          color: #6b7690;
          font-weight: 400;
        }

        .calc-grid {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 24px;
          align-items: start;
        }

        .calc-card {
          background-color: #ffffff;
          border: 1px solid #e4e8f1;
          border-radius: 16px;
          padding: 28px;
          box-sizing: border-box;
        }

        .calc-field {
          margin-bottom: 28px;
        }

        .calc-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #101a33;
          margin-bottom: 8px;
        }

        .calc-input-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background-color: #f8fafc;
          border: 1px solid #e4e8f1;
          border-radius: 10px;
          padding: 10px 16px;
          margin-bottom: 12px;
          transition: border-color 150ms ease;
        }
        .calc-input-box:focus-within {
          border-color: #2f5bea;
          background-color: #ffffff;
        }

        .calc-currency {
          font-size: 18px;
          font-weight: 700;
          color: #6b7690;
        }

        .calc-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 22px;
          font-weight: 700;
          color: #2f5bea;
          outline: none;
          font-family: 'DM Sans', system-ui, sans-serif;
          width: 100%;
        }

        .calc-unit {
          font-size: 14px;
          font-weight: 600;
          color: #6b7690;
        }

        .calc-select {
          border: none;
          background: transparent;
          font-size: 14px;
          font-weight: 600;
          color: #6b7690;
          outline: none;
          cursor: pointer;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        .calc-slider {
          width: 100%;
          accent-color: #2f5bea;
          height: 6px;
          border-radius: 3px;
          cursor: pointer;
        }

        .calc-range-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 6px;
          font-size: 11.5px;
          font-weight: 600;
          color: #6b7690;
        }

        .calc-badge-green {
          font-size: 11px;
          font-weight: 700;
          color: #1f8a5b;
          background-color: #e3f4ec;
          padding: 3px 8px;
          border-radius: 6px;
        }

        .calc-results-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .calc-gradient-card {
          background: linear-gradient(135deg, #2f5bea 0%, #4f78ff 100%);
          border-radius: 16px;
          padding: 28px;
          color: #ffffff;
          box-sizing: border-box;
          box-shadow: 0 10px 30px rgba(47, 91, 234, 0.15);
        }

        .calc-gradient-label {
          margin: 0 0 8px;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.85);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .calc-gradient-amount {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 44px;
          font-weight: 600;
          color: #ffffff;
          line-height: 1.1;
          margin-bottom: 20px;
        }

        .calc-gradient-divider {
          height: 1px;
          background-color: rgba(255, 255, 255, 0.15);
          margin: 16px 0;
        }

        .calc-gradient-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .calc-gradient-sublabel {
          font-size: 11px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.75);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 4px;
        }

        .calc-gradient-subval {
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
        }

        .calc-tip-card {
          background-color: #ffffff;
          border: 1px solid #e4e8f1;
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .calc-tip-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background-color: #e3f4ec;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .calc-tip-title {
          font-size: 12.5px;
          font-weight: 700;
          color: #101a33;
          margin-bottom: 2px;
        }

        .calc-tip-text {
          margin: 0;
          font-size: 12px;
          color: #6b7690;
          line-height: 1.4;
        }

        .calc-cta-btn {
          width: 100%;
          background-color: #101a33;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          padding: 14px 20px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 150ms ease;
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .calc-cta-btn:hover {
          background-color: #1e2a48;
        }
        .calc-cta-btn:focus-visible {
          outline: 2px solid #2f5bea;
          outline-offset: 2px;
        }

        .calc-benefits-section {
          margin-top: 56px;
          padding-top: 40px;
          border-top: 1px solid #e4e8f1;
        }

        .calc-benefits-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .calc-benefits-title {
          font-family: 'Fraunces', Georgia, serif;
          font-size: 26px;
          font-weight: 600;
          color: #101a33;
          margin: 0 0 6px;
        }

        .calc-benefits-subtitle {
          font-size: 13.5px;
          color: #6b7690;
          margin: 0;
        }

        .calc-benefits-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .calc-benefit-card {
          background-color: #ffffff;
          border: 1px solid #e4e8f1;
          border-radius: 16px;
          padding: 24px;
          box-sizing: border-box;
        }

        .calc-benefit-icon {
          font-size: 24px;
          margin-bottom: 12px;
        }

        .calc-benefit-card-title {
          font-size: 14.5px;
          font-weight: 700;
          color: #101a33;
          margin: 0 0 6px;
        }

        .calc-benefit-card-desc {
          margin: 0;
          font-size: 12.5px;
          color: #6b7690;
          line-height: 1.5;
        }

        @media (max-width: 1000px) {
          .calc-grid {
            grid-template-columns: 1fr;
          }
          .calc-benefits-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 800px) {
          .calc-container {
            padding: 20px 18px 48px;
          }
        }
      `}</style>
    </PortalShell>
  );
}
