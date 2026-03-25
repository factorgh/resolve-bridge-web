'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, 
  Fuel, 
  Zap, 
  Settings, 
  ArrowLeft, 
  Phone, 
  ChevronRight, 
  Shield, 
  Award, 
  TrendingUp, 
  Star,
  Cpu,
  ArrowRight,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import PageTemplate from '../components/PageTemplate';

const vehicles = [
  {
    id: 1,
    name: "Atlas Luxury SUV",
    price: "GH₵ 450,000",
    priceOld: "GH₵ 495,000",
    specs: { type: "SUV", fuel: "Petrol", drive: "AWD", year: "2024", seats: "7", power: "380hp" },
    gallery: [
      "https://images.unsplash.com/photo-1617469767011-2a12e23d3e78?w=1200&q=80",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80",
    ],
    tag: "Premium",
    tagColor: "var(--primary)",
    description: "Commanding presence meets uncompromising comfort. The Atlas redefines what it means to arrive in style.",
    rating: 4.9,
    reviews: 124,
  },
  {
    id: 2,
    name: "Nebula Electric Sedan",
    price: "GH₵ 380,000",
    priceOld: "GH₵ 418,000",
    specs: { type: "Sedan", fuel: "Electric", drive: "RWD", year: "2024", seats: "5", power: "310hp" },
    gallery: [
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1200&q=80",
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&q=80",
      "https://images.unsplash.com/photo-1593941707882-a5bba53b0998?w=600&q=80",
    ],
    tag: "Eco-Friendly",
    tagColor: "#16a34a",
    description: "Zero emissions, infinite possibilities. Built for those who demand performance without compromise.",
    rating: 4.8,
    reviews: 89,
  },
  {
    id: 3,
    name: "Titan 4x4 Off-Roader",
    price: "GH₵ 520,000",
    priceOld: "GH₵ 572,000",
    specs: { type: "4x4", fuel: "Diesel", drive: "4WD", year: "2024", seats: "5", power: "450hp" },
    gallery: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80",
      "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=600&q=80",
      "https://images.unsplash.com/photo-1566008757892-c42de3cb5a0f?w=600&q=80",
    ],
    tag: "Adventure",
    tagColor: "var(--secondary)",
    description: "Built for the road less travelled. The Titan conquers every terrain while keeping you in complete control.",
    rating: 4.9,
    reviews: 201,
  }
];

const stats = [
  { icon: Shield, label: "Verified Listings", value: "500+" },
  { icon: Award, label: "Years in Market", value: "12+" },
  { icon: TrendingUp, label: "Financing Approved", value: "98%" },
  { icon: Car, label: "Happy Clients", value: "3,200+" },
];

function VehicleCard({ vehicle, idx }: { vehicle: typeof vehicles[0]; idx: number }) {
  const [activeImg, setActiveImg] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      className="glass-card"
      style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        borderRadius: '32px', 
        overflow: 'hidden', 
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--card-border)',
        marginBottom: '4rem'
      }}
    >
      {/* Image Side */}
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: '400px' }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImg}
            src={vehicle.gallery[activeImg]}
            alt={vehicle.name}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AnimatePresence>
        <span style={{ position: 'absolute', top: '24px', left: '24px', background: vehicle.tagColor, color: 'white', padding: '0.5rem 1rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{vehicle.tag}</span>
        <div style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', padding: '0.5rem 1rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: 'var(--shadow-md)' }}>
          <Star size={14} fill="#facc15" stroke="none" />
          <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{vehicle.rating}</span>
        </div>
        <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem' }}>
          {vehicle.gallery.map((img, i) => (
            <button key={i} onClick={() => setActiveImg(i)} style={{ width: '60px', height: '40px', borderRadius: '8px', overflow: 'hidden', border: i === activeImg ? '2px solid white' : '2px solid transparent', cursor: 'pointer', padding: 0 }}>
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      </div>

      {/* Content Side */}
      <div style={{ padding: '3.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2rem' }}>
        <div>
           <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem' }}>Inventory #RB-00{vehicle.id} · {vehicle.specs.year}</p>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem' }}>
              <h3 style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1.1 }}>{vehicle.name}</h3>
              <div style={{ textAlign: 'right' }}>
                 <p style={{ fontSize: '0.85rem', color: 'var(--muted)', textDecoration: 'line-through', marginBottom: '0.25rem' }}>{vehicle.priceOld}</p>
                 <p style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary)' }}>{vehicle.price}</p>
              </div>
           </div>
        </div>
        
        <p style={{ color: 'var(--muted)', lineHeight: 1.7, fontSize: '1.05rem', fontWeight: 500 }}>{vehicle.description}</p>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
           {[
             { icon: <Settings size={14} />, val: vehicle.specs.type },
             { icon: vehicle.specs.fuel === 'Electric' ? <Zap size={14} /> : <Fuel size={14} />, val: vehicle.specs.fuel },
             { icon: <Car size={14} />, val: vehicle.specs.drive },
             { icon: <Cpu size={14} />, val: vehicle.specs.power },
           ].map((s, i) => (
             <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.03)', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--muted)' }}>
               {s.icon} <span>{s.val}</span>
             </div>
           ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem' }}>
           <Link href={`/get-started?product=vehicle&id=${vehicle.id}`} className="btn btn-primary" style={{ flex: 1, padding: '1.25rem' }}>
              Secure Financing <ArrowRight size={18} style={{ marginLeft: '0.75rem' }} />
           </Link>
           <a href="tel:0249709299" className="btn btn-secondary" style={{ padding: '1.25rem' }}>
              <Phone size={18} />
           </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function ResolveVehiclesPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <PageTemplate 
      title="Drive Your" 
      gradientTitle="Best Life"
      subtitle="Institutional-grade financing for world-class vehicles. Curated inventory, tailored to your financial profile."
      noCard={true}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem', paddingBottom: '8rem' }}>
        
        {/* Stats Strip */}
        <section className="glass-card" style={{ padding: '3.5rem', borderRadius: '40px', background: 'rgba(0,0,0,0.02)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
           {stats.map((s, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, y: 20 }} 
               whileInView={{ opacity: 1, y: 0 }} 
               viewport={{ once: true }} 
               transition={{ delay: 0.1 * i }}
               style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', textAlign: 'left' }}
             >
                <div style={{ padding: '1rem', borderRadius: '20px', background: 'white', color: 'var(--primary)', boxShadow: 'var(--shadow-md)' }}>
                   <s.icon size={28} />
                </div>
                <div>
                   <p style={{ fontSize: '1.85rem', fontWeight: 900, lineHeight: 1 }}>{s.value}</p>
                   <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>{s.label}</p>
                </div>
             </motion.div>
           ))}
        </section>

        {/* Inventory Header */}
        <section>
           <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 6rem' }}>
              <span className="section-label">Curated Selection</span>
              <h2 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>Featured Vehicles</h2>
              <p style={{ color: 'var(--muted)', fontSize: '1.25rem', fontWeight: 500 }}>{vehicles.length} high-performance vehicles available today — all with ResolveBridge instant funding.</p>
           </div>

           <div style={{ display: 'flex', flexDirection: 'column' }}>
             {vehicles.map((v, i) => (
               <VehicleCard key={v.id} vehicle={v} idx={i} />
             ))}
           </div>
        </section>

        {/* Procurement CTA */}
        <section className="glass-card" style={{ padding: '7rem 4rem', borderRadius: '48px', background: 'linear-gradient(135deg, var(--foreground), #1e293b)', color: 'white', position: 'relative', overflow: 'hidden' }}>
           <div className="ambient-glow" style={{ top: '-30%', left: '-10%', opacity: 0.2 }}></div>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '6rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
              <div>
                 <span className="section-label" style={{ color: 'var(--primary)' }}>Specialist Sourcing</span>
                 <h2 style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '2.5rem', letterSpacing: '-0.04em', lineHeight: 1 }}>Can't find your <br/> <span className="gradient-text italic">Dream Vehicle?</span></h2>
                 <p style={{ opacity: 0.7, fontSize: '1.25rem', lineHeight: 1.8, marginBottom: '4rem', fontWeight: 500 }}>Our global procurement team scours the market daily. Tell us what you want and we'll source it with ResolveBridge financing built right in.</p>
                 <Link href="/contact" className="btn btn-primary" style={{ background: 'white', color: 'black', padding: '1.5rem 3.5rem', fontSize: '1.1rem' }}>Contact Procurement Team <ArrowRight size={20} style={{ marginLeft: '1rem' }} /></Link>
              </div>
              
              <div style={{ position: 'relative' }}>
                 <div className="glass-card" style={{ padding: '0.75rem', borderRadius: '40px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <img 
                      src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80" 
                      alt="Global Sourcing" 
                      style={{ width: '100%', borderRadius: '34px', filter: 'brightness(1.1) contrast(1.1)' }} 
                    />
                 </div>
                 {/* Floating Badge */}
                 <div className="glass-card" style={{ position: 'absolute', top: '10%', right: '-10%', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--primary)', color: 'white', border: 'none', boxShadow: 'var(--shadow-lg)' }}>
                    <Globe size={24} />
                    <span style={{ fontWeight: 900, fontSize: '0.9rem' }}>Global Sourcing Unit</span>
                 </div>
              </div>
           </div>
        </section>

        {/* Floating Call Action moved into the page better */}
        <div style={{ position: 'fixed', bottom: '3rem', right: '3rem', zIndex: 100 }}>
           <a href="tel:0249709299" className="btn btn-primary" style={{ height: '70px', width: '70px', borderRadius: '50%', padding: 0, boxShadow: '0 15px 40px var(--primary-glow)' }}>
              <Phone size={32} />
           </a>
        </div>
      </div>
    </PageTemplate>
  );
}