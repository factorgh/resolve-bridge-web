'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, Car, CreditCard, Zap, Shield, Globe, Calculator, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [solutionsDropdown, setSolutionsDropdown] = useState(false);
  const [resolveDropdown, setResolveDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className={`fixed-nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className={`nav-container ${scrolled ? 'nav-container-scrolled' : 'glass-card'}`} style={{ borderRadius: scrolled ? '0' : '32px' }}>
        <Link href="/" className="logo">
          <img src="/resolve_icon.png" alt="Resolve" className="logo-img" />
          <span className="logo-text" style={{ fontSize: '1.25rem', fontWeight: '900', letterSpacing: '-0.03em' }}>
            Resolve<span className="gradient-text italic">Bridge</span>
          </span>
        </Link>
        
        <div className="nav-links">
          <Link href="/features" style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--muted)' }}>Features</Link>
          
          <div 
            className="nav-dropdown-wrapper"
            onMouseEnter={() => setSolutionsDropdown(true)}
            onMouseLeave={() => setSolutionsDropdown(false)}
          >
            <button className="nav-link-dropdown" style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Solutions <ChevronDown size={14} className={`chevron ${solutionsDropdown ? 'rotate' : ''}`} />
            </button>
            <AnimatePresence>
              {solutionsDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 15, x: '-50%' }}
                  animate={{ opacity: 1, y: 0, x: '-50%' }}
                  exit={{ opacity: 0, y: 15, x: '-50%' }}
                  className="nav-dropdown glass-card mega-dropdown shadow-2xl"
                  style={{ borderRadius: '28px', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-lg), var(--shadow-glow)', left: '50%' }}
                >
                  <div className="dropdown-grid">
                    {[
                      { href: "/loans", icon: <CreditCard />, title: "Credit & Loans", desc: "Scale with tailored financing", color: "blue" },
                      { href: "/calculator", icon: <Calculator />, title: "Loan Calculator", desc: "Calculate your repayment profile", color: "purple" },
                      { href: "/bnpl", icon: <Zap />, title: "BNPL Plans", desc: "Buy now pay later for retail", color: "orange" },
                      { href: "/insurance", icon: <Shield />, title: "Insurance Hub", desc: "Covering auto, health & life", color: "purple" },
                      { href: "/solutions", icon: <Globe />, title: "Payments Hub", desc: "Global merchant settlements", color: "green" },
                      { href: "/get-started", icon: <TrendingUp />, title: "Merchant Hub", desc: "Scale your retail footprint", color: "green" }
                    ].map((item, idx) => (
                      <Link key={idx} href={item.href} className="dropdown-item">
                        <div className={`dropdown-icon ${item.color}`} style={{ width: '48px', height: '48px', borderRadius: '14px', marginBottom: '0.25rem' }}>{item.icon}</div>
                        <div>
                          <p className="item-title">{item.title}</p>
                          <p className="item-desc">{item.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div 
            className="nav-dropdown-wrapper"
            onMouseEnter={() => setResolveDropdown(true)}
            onMouseLeave={() => setResolveDropdown(false)}
          >
            <button className="nav-link-dropdown" style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Resolve <ChevronDown size={14} className={`chevron ${resolveDropdown ? 'rotate' : ''}`} />
            </button>
            <AnimatePresence>
              {resolveDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 15, x: '-50%' }}
                  animate={{ opacity: 1, y: 0, x: '-50%' }}
                  exit={{ opacity: 0, y: 15, x: '-50%' }}
                  className="nav-dropdown glass-card shadow-2xl"
                  style={{ borderRadius: '24px', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-lg), var(--shadow-glow)', left: '50%' }}
                >
                  <Link href="/resolve-vehicles" className="dropdown-item" style={{ padding: '1.25rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="dropdown-icon car" style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Car size={18} /></div>
                    <div>
                      <p className="item-title" style={{ fontSize: '0.95rem', fontWeight: '800', margin: 0 }}>Resolve Vehicles</p>
                      <p className="item-desc" style={{ fontSize: '0.7rem', opacity: 0.7, margin: 0 }}>Premium quality automotive solutions</p>
                    </div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/about">About Us</Link>
        </div>

        <div className="nav-actions">
          <Link href="/login" className="btn btn-secondary nav-btn hidden-mobile">Sign In</Link>
          <Link href="/get-started" className="btn btn-primary nav-btn get-started hidden-mobile">Get Started</Link>
          <button className="mobile-menu-toggle" onClick={toggleMenu}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mobile-menu glass-card"
          >
            <div className="mobile-links">
               <Link href="/features" onClick={toggleMenu}>Features</Link>
               
               <div className="mobile-dropdown-section">
                  <p className="mobile-section-label">Solutions</p>
                  <Link href="/loans" onClick={toggleMenu} className="mobile-dropdown-item"><CreditCard size={18} className="mr-3" /> Loans & Credit</Link>
                  <Link href="/bnpl" onClick={toggleMenu} className="mobile-dropdown-item"><Zap size={18} className="mr-3" /> BNPL Plans</Link>
                  <Link href="/insurance" onClick={toggleMenu} className="mobile-dropdown-item"><Shield size={18} className="mr-3" /> Insurance Coverage</Link>
                  <Link href="/solutions" onClick={toggleMenu} className="mobile-dropdown-item"><Globe size={18} className="mr-3" /> Merchant Payments</Link>
               </div>

               <Link href="/resolve-vehicles" onClick={toggleMenu} className="mobile-dropdown-item">
                 <Car size={20} className="mr-3 text-primary" /> Resolve Vehicles
               </Link>

               <Link href="/about" onClick={toggleMenu}>About Us</Link>
               <hr className="mobile-divider" />
               <Link href="/login" className="btn btn-secondary w-full" onClick={toggleMenu}>Sign In</Link>
               <Link href="/get-started" className="btn btn-primary w-full" onClick={toggleMenu}>Get Started</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .mega-dropdown {
          width: 780px !important;
          padding: 3rem !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
        }
        .dropdown-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .dropdown-item {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding: 1.5rem;
          border-radius: 20px;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          border: 1px solid transparent;
        }
        .dropdown-item:hover {
          background: rgba(0,0,0,0.02);
          border-color: var(--card-border);
          transform: translateY(-5px);
        }
        .nav-scrolled {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          padding: 1rem;
        }
        .nav-container-scrolled {
          max-width: 1200px;
          border-bottom: 1px solid var(--card-border);
          border-radius: 0;
          background: transparent;
        }
        .dropdown-icon.blue { background: rgba(37, 99, 235, 0.1); color: var(--primary); }
        .dropdown-icon.orange { background: rgba(245, 158, 11, 0.1); color: var(--accent); }
        .dropdown-icon.purple { background: rgba(124, 58, 237, 0.1); color: var(--secondary); }
        .dropdown-icon.green { background: rgba(16, 185, 129, 0.1); color: #10b981; }
      `}</style>
    </nav>
  );
}
