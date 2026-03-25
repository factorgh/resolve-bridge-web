'use client';

import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle,
  ShieldCheck,
  Send,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import PageTemplate from '../components/PageTemplate';

export default function ContactPage() {
  const contactOptions = [
    {
      icon: Mail,
      title: "Email Architecture",
      description: "Direct line to our technical and account teams.",
      value: "hello@resolvebridge.com"
    },
    {
      icon: Phone,
      title: "Voice Support",
      description: "Immediate assistance during market hours.",
      value: "+233 555 123 456"
    },
    {
      icon: MapPin,
      title: "Regional HQ",
      description: "Accra Digital Center, Ghana.",
      value: "Visit Workspace"
    }
  ];

  return (
    <PageTemplate 
      title="Contact Our" 
      gradientTitle="Architects"
      subtitle="Experience the pinnacle of fintech support. Our dedicated team is ready to assist you in scaling your financial footprint across the continent."
      noCard={true}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem', paddingBottom: '8rem' }}>
        
        {/* Contact Split */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '8rem', alignItems: 'start' }}>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}
          >
             <div>
                <span className="section-label">Global Relations</span>
                <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '2rem', letterSpacing: '-0.04em', lineHeight: 1.1 }}>Talk to the <br/> <span className="gradient-text italic">Bridge.</span></h2>
                <p style={{ color: 'var(--muted)', fontSize: '1.2rem', lineHeight: 1.8, fontWeight: 500 }}>Whether you're a merchant looking to integrate our APIs or an individual seeking the best financial products, we're here to facilitate the connection.</p>
             </div>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      <CheckCircle size={14} />
                   </div>
                   <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>Average response time: 2 hours</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      <CheckCircle size={14} />
                   </div>
                   <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>24/7 Priority support for SDK partners</span>
                </div>
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                {contactOptions.map((option, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: '2.5rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                       <option.icon size={24} />
                    </div>
                    <div>
                       <h4 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '0.25rem' }}>{option.title}</h4>
                       <p style={{ color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem' }}>{option.description}</p>
                       <p style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{option.value}</p>
                    </div>
                  </div>
                ))}
             </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
             <div className="glass-card" style={{ padding: '4.5rem', borderRadius: '40px', boxShadow: 'var(--shadow-lg)' }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '3rem', letterSpacing: '-0.02em' }}>Send Us a <span className="gradient-text italic">Secure</span> Message</h3>
                
                <form style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                         <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--muted)' }}>Full Name</label>
                         <input 
                           type="text" 
                           placeholder="John Doe"
                           style={{ padding: '1.25rem 1.5rem', borderRadius: '16px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.02)', outline: 'none', fontStyle: 'inherit', fontWeight: 500 }}
                         />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                         <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--muted)' }}>Email Address</label>
                         <input 
                           type="email" 
                           placeholder="john@example.com"
                           style={{ padding: '1.25rem 1.5rem', borderRadius: '16px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.02)', outline: 'none', fontStyle: 'inherit', fontWeight: 500 }}
                         />
                      </div>
                   </div>

                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--muted)' }}>Inquiry Type</label>
                      <select style={{ padding: '1.25rem 1.5rem', borderRadius: '16px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.02)', outline: 'none', appearance: 'none', fontWeight: 600 }}>
                         <option>Merchant Integration (API/SDK)</option>
                         <option>Automotive Financing</option>
                         <option>Insurance Marketplace</option>
                         <option>Retail BNPL Setup</option>
                         <option>General Support</option>
                      </select>
                   </div>

                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <label style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--muted)' }}>Your Message</label>
                      <textarea 
                        placeholder="Tell us how we can scale your vision..."
                        style={{ padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.02)', outline: 'none', minHeight: '180px', fontWeight: 500, lineHeight: 1.6 }}
                      />
                   </div>

                   <button className="btn btn-primary" style={{ padding: '1.5rem', fontSize: '1.1rem', borderRadius: '20px' }}>
                      Transmit Inquiry <Send size={20} style={{ marginLeft: '1rem' }} />
                   </button>

                   <div style={{ textAlign: 'center', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', opacity: 0.6 }}>
                      <ShieldCheck size={14} className="text-primary" /> End-to-End Encryption Enabled
                   </div>
                </form>
             </div>
          </motion.div>
        </div>

        {/* Global Presence Hub */}
        <section>
           <div className="glass-card" style={{ padding: '6rem 4rem', borderRadius: '48px', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--card-border)', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', margin: '0 auto 2.5rem' }}>
                 <Globe size={32} />
              </div>
              <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem' }}>Market <span className="gradient-text italic">Accessibility</span></h2>
              <p style={{ color: 'var(--muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 4.5rem', fontWeight: 500 }}>Our advisors are stationed across major financial hubs to ensure localized support for enterprise partners.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem' }}>
                 {["Ghana", "Nigeria", "Kenya", "South Africa"].map((loc, idx) => (
                   <div key={idx} style={{ padding: '1.5rem', background: 'white', borderRadius: '20px', border: '1px solid var(--card-border)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.9rem' }}>{loc}</div>
                 ))}
              </div>
           </div>
        </section>
      </div>
    </PageTemplate>
  );
}
