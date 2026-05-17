'use client';

import { useState, useEffect } from 'react';
import { Drawer, IconButton, Dialog } from '@mui/material';
import { toast } from 'react-hot-toast';
import AdminShell, { C, F } from '../components/AdminShell';
import { 
  useGetAdminProductsQuery, 
  useCreateProductMutation, 
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetInstitutionsQuery, 
  useCreateInstitutionMutation 
} from '@/lib/redux/api/productApi';
import { 
  StorefrontRounded, 
  AutoAwesomeRounded, 
  PercentRounded, 
  AddRounded, 
  CloseRounded, 
  BusinessRounded, 
  GavelRounded, 
  InfoOutlined,
  HelpOutlineRounded,
  StorefrontOutlined
} from '@mui/icons-material';

export default function AdminProductsPage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showProductDrawer, setShowProductDrawer] = useState(false);
  const [showProviderDrawer, setShowProviderDrawer] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [confirmDeleteProduct, setConfirmDeleteProduct] = useState<any>(null);

  // Product Form State
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodType, setProdType] = useState('Loan');
  const [selectedInstId, setSelectedInstId] = useState('');
  const [minAmount, setMinAmount] = useState<number>(100);
  const [maxAmount, setMaxAmount] = useState<number>(10000);
  const [interestRate, setInterestRate] = useState<number>(12);
  const [minTenure, setMinTenure] = useState<number>(3);
  const [maxTenure, setMaxTenure] = useState<number>(12);
  const [requirements, setRequirements] = useState('');
  const [benefits, setBenefits] = useState('');
  const [terms, setTerms] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Institution Form State
  const [provName, setProvName] = useState('');
  const [provLegal, setProvLegal] = useState('');
  const [provType, setProvType] = useState('Merchant');
  const [provReg, setProvReg] = useState('');
  const [provTax, setProvTax] = useState('');
  const [provEmail, setProvEmail] = useState('');
  const [provPhone, setProvPhone] = useState('');
  const [provStreet, setProvStreet] = useState('');
  const [provCity, setProvCity] = useState('');
  const [provDesc, setProvDesc] = useState('');

  // Redux hooks
  const { data: productResponse, isLoading: productsLoading, refetch: refetchProducts } = useGetAdminProductsQuery();
  const { data: instsResponse, refetch: refetchInsts } = useGetInstitutionsQuery();
  
  const [createProduct, { isLoading: isPublishing }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [createInstitution, { isLoading: isSavingProvider }] = useCreateInstitutionMutation();

  useEffect(() => {
    setMounted(true);
    const stored = sessionStorage.getItem('rb_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setProdName(editingProduct.name || '');
      setProdDesc(editingProduct.description || '');
      setProdType(editingProduct.productType || 'Loan');
      setSelectedInstId(editingProduct.institutionId?._id || editingProduct.institutionId || '');
      setMinAmount(editingProduct.minAmount || 100);
      setMaxAmount(editingProduct.maxAmount || 10000);
      setInterestRate(editingProduct.interestRate || 12);
      setMinTenure(editingProduct.minTenureMonths || 3);
      setMaxTenure(editingProduct.maxTenureMonths || 12);
      setRequirements(editingProduct.requirements || '');
      setBenefits(editingProduct.benefits || '');
      setTerms(editingProduct.termsAndConditions || '');
      setImageUrl(editingProduct.imageUrl || '');
    } else {
      setProdName('');
      setProdDesc('');
      setProdType('Loan');
      setSelectedInstId('');
      setMinAmount(100);
      setMaxAmount(10000);
      setInterestRate(12);
      setMinTenure(3);
      setMaxTenure(12);
      setRequirements('');
      setBenefits('');
      setTerms('');
      setImageUrl('');
    }
  }, [editingProduct]);

  if (!mounted) return null;

  const products = productResponse?.data || [];
  const institutions = instsResponse?.data || [];

  const myInstitutionId = user?.institutionId;
  const isSuperAdmin = user?.role === 'SuperAdmin' || user?.role === 'Admin';

  const filteredProducts = products.filter((p: any) => {
    if (isSuperAdmin) return true;
    return p.institutionId && p.institutionId._id === myInstitutionId;
  });

  const handlePublishProduct = async () => {
    const instId = isSuperAdmin ? selectedInstId : myInstitutionId;
    if (!prodName || !instId || !prodDesc || !requirements || !benefits || !terms) {
      toast.error('Please fill in all required product fields');
      return;
    }

    try {
      if (editingProduct) {
        const res = await updateProduct({
          id: editingProduct._id,
          body: {
            name: prodName,
            description: prodDesc,
            productType: prodType,
            institutionId: instId,
            minAmount,
            maxAmount,
            interestRate,
            minTenureMonths: minTenure,
            maxTenureMonths: maxTenure,
            requirements,
            benefits,
            termsAndConditions: terms,
            imageUrl
          }
        }).unwrap();

        if (res.success) {
          toast.success('Financial product updated successfully!');
          setShowProductDrawer(false);
          setEditingProduct(null);
          refetchProducts();
        }
      } else {
        const res = await createProduct({
          name: prodName,
          description: prodDesc,
          productType: prodType,
          institutionId: instId,
          minAmount,
          maxAmount,
          interestRate,
          minTenureMonths: minTenure,
          maxTenureMonths: maxTenure,
          requirements,
          benefits,
          termsAndConditions: terms,
          imageUrl,
          isActive: true
        }).unwrap();

        if (res.success) {
          toast.success('Financial product published successfully!');
          setShowProductDrawer(false);
          refetchProducts();
        }
      }
    } catch (err: any) {
      toast.error(err.data?.message || 'Error saving financial product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await deleteProduct(id).unwrap();
      if (res.success) {
        toast.success('Financial product deleted successfully!');
        setConfirmDeleteProduct(null);
        refetchProducts();
      }
    } catch (err: any) {
      toast.error(err.data?.message || 'Error deleting financial product');
    }
  };

  const handleRegisterProvider = async () => {
    if (!provName || !provLegal || !provReg || !provTax || !provEmail || !provPhone || !provStreet || !provCity) {
      toast.error('Please fill in all provider details');
      return;
    }

    try {
      const res = await createInstitution({
        name: provName,
        legalName: provLegal,
        type: provType,
        registrationNumber: provReg,
        taxId: provTax,
        email: provEmail,
        phoneNumber: provPhone,
        streetAddress: provStreet,
        city: provCity,
        state: 'Greater Accra',
        country: 'Ghana',
        description: provDesc || `${provName} - Registered Micro-Provider`,
        isActive: true,
        isVerified: true
      }).unwrap();

      if (res.success) {
        toast.success(`Registered ${provName} successfully!`);
        setShowProviderDrawer(false);
        // Reset state
        setProvName('');
        setProvLegal('');
        setProvType('Microfinance');
        setProvReg('');
        setProvTax('');
        setProvEmail('');
        setProvPhone('');
        setProvStreet('');
        setProvCity('');
        setProvDesc('');
        
        // Refetch and select the newly created institution
        const refetched = await refetchInsts().unwrap();
        const newlyAdded = refetched?.data?.find((i: any) => i.name === res.data?.name);
        if (newlyAdded) {
          setSelectedInstId(newlyAdded._id);
        }
      }
    } catch (err: any) {
      toast.error(err.data?.message || 'Error registering provider');
    }
  };

  return (
    <AdminShell>
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        
        {/* Title & Launch Button */}
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row', 
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'flex-start' : 'center', 
          gap: isMobile ? 16 : 24,
          marginBottom: 36 
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: isMobile ? 26 : 32, fontWeight: 300, color: C.text, fontFamily: F.serif }}>
              Financial Products Console
            </h1>
            <p style={{ margin: '8px 0 0', fontSize: 13, color: C.textSub }}>
              Configure credit interest rates, launch premium insurance packages, and publish small lender lending limits.
            </p>
          </div>
          <button 
            onClick={() => {
              setEditingProduct(null);
              setShowProductDrawer(true);
            }}
            style={{ 
              background: C.blue, color: '#fff', border: 'none', borderRadius: 10,
              padding: '12px 20px', fontSize: 12.5, fontWeight: 800, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 8, transition: '0.2s',
              width: isMobile ? '100%' : 'auto', justifyContent: 'center'
            }}
          >
            <AddRounded sx={{ fontSize: 18 }} /> Launch Product
          </button>
        </div>

        {productsLoading ? (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <p style={{ color: C.textSub, fontSize: 14 }}>Synchronizing catalog listings...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ padding: '80px 0', textAlign: 'center', background: C.surface, borderRadius: 24, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📦</div>
            <p style={{ color: C.textSub, fontSize: 14, fontWeight: 600 }}>No products defined inside the ecosystem.</p>
            <p style={{ color: C.textMuted, fontSize: 12, marginTop: 4 }}>Publish products directly using the launch widget above.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {filteredProducts.map((p: any) => (
              <div 
                key={p._id}
                style={{ 
                  background: C.surface, borderRadius: 24, border: `1px solid ${C.border}`, padding: 28,
                  display: 'flex', flexDirection: 'column', gap: 20, position: 'relative', overflow: 'hidden'
                }}
              >
                {/* Glowing subtle border */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.blue}, ${C.purple})` }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ 
                      fontSize: 9.5, fontWeight: 900, background: 'rgba(59,130,246,0.1)', color: C.blueLight,
                      padding: '4px 10px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.04em'
                    }}>
                      {p.productType || 'Loan'}
                    </span>
                    <h3 style={{ margin: '12px 0 4px', fontSize: 18, fontWeight: 700, color: C.text }}>{p.name}</h3>
                    <p style={{ margin: 0, fontSize: 12.5, color: C.textSub }}>{p.institutionId?.name || 'Institution partner'}</p>
                  </div>
                  <div style={{ 
                    width: 44, height: 44, borderRadius: 12, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', border: `1px solid ${C.border}`
                  }}>
                    {p.imageUrl ? (
                      <img src={p.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : p.institutionId?.logoUrl ? (
                      <img src={p.institutionId.logoUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <StorefrontRounded sx={{ fontSize: 20, color: C.textSub }} />
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                  <div>
                    <span style={{ fontSize: 9.5, color: C.textMuted, fontWeight: 800, textTransform: 'uppercase' }}>Interest Rate</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <PercentRounded sx={{ fontSize: 14, color: C.emerald }} />
                      <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{p.interestRate}% {p.productType === 'Insurance' ? 'premium' : 'p.a.'}</span>
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: 9.5, color: C.textMuted, fontWeight: 800, textTransform: 'uppercase' }}>Tenure Terms</span>
                    <p style={{ margin: '4px 0 0', fontSize: 14, color: C.textSub }}>
                      {p.minTenureMonths || 3} - {p.maxTenureMonths || 24} mos
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${C.border}`, paddingTop: 16, alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 9.5, color: C.textMuted, fontWeight: 800, textTransform: 'uppercase' }}>Underwriting limits</span>
                    <p style={{ margin: '4px 0 0', fontSize: 13.5, fontWeight: 600, color: C.textSub }}>
                      GH₵ {p.minAmount?.toLocaleString()} - GH₵ {p.maxAmount?.toLocaleString()}
                    </p>
                  </div>
                  <span style={{ fontSize: 10.5, color: C.emerald, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <AutoAwesomeRounded sx={{ fontSize: 12 }} /> ACTIVE
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 10, borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                  <button
                    onClick={() => {
                      setEditingProduct(p);
                      setShowProductDrawer(true);
                    }}
                    style={{
                      flex: 1, padding: '10px', borderRadius: 10, background: 'rgba(59,130,246,0.06)',
                      color: C.blueLight, border: `1px solid ${C.blue}20`, cursor: 'pointer',
                      fontSize: 12.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      transition: '0.2s'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setConfirmDeleteProduct(p)}
                    style={{
                      flex: 1, padding: '10px', borderRadius: 10, background: 'rgba(239,68,68,0.06)',
                      color: C.red, border: `1px solid rgba(239,68,68,0.20)`, cursor: 'pointer',
                      fontSize: 12.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      transition: '0.2s'
                    }}
                  >
                    Delete
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Launch Product Drawer */}
      <Drawer
        anchor="right"
        open={showProductDrawer}
        onClose={() => setShowProductDrawer(false)}
        PaperProps={{
          sx: {
            width: '100%', maxWidth: 500,
            background: C.surface, borderLeft: `1px solid ${C.border}`,
            boxShadow: '-20px 0 60px rgba(0,0,0,0.7)', color: C.text, p: 0
          }
        }}
      >
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ padding: 24, borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 9.5, fontWeight: 900, color: C.blueLight, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Financial Product Management</span>
              <h3 style={{ margin: '4px 0 0', fontSize: 18, color: C.text, fontFamily: F.heading }}>
                {editingProduct ? 'Modify Product Parameters' : 'Launch New Product'}
              </h3>
            </div>
            <IconButton onClick={() => setShowProductDrawer(false)} sx={{ color: C.textSub }}>
              <CloseRounded sx={{ fontSize: 18 }} />
            </IconButton>
          </div>

          <div style={{ flex: 1, padding: '24px 32px 40px', display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto' }}>
            
            {/* Provider selector with quick-add (Only for SuperAdmins) */}
            {isSuperAdmin && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: C.textSub }}>Providing Partner Desk</span>
                  <button
                    onClick={() => setShowProviderDrawer(true)}
                    style={{
                      background: 'none', border: 'none', color: C.blueLight, fontSize: 11, fontWeight: 800,
                      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4
                    }}
                  >
                    <AddRounded sx={{ fontSize: 12 }} /> Add Small Lender / Individual
                  </button>
                </div>
                <select
                  value={selectedInstId}
                  onChange={(e) => setSelectedInstId(e.target.value)}
                  style={{
                    width: '100%', padding: 12, borderRadius: 10, border: `1px solid ${C.borderStrong}`,
                    background: C.bg, color: C.text, fontSize: 13, outline: 'none'
                  }}
                >
                  <option value="">-- Choose Providing Entity --</option>
                  {institutions.map((inst: any) => (
                    <option key={inst._id} value={inst._id}>
                      {inst.name} ({inst.type === 'Merchant' ? 'BNPL Owner' : inst.type})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Product Type */}
            <div>
              <span style={{ fontSize: 12, color: C.textSub }}>Product Offering Category</span>
              <select
                value={prodType}
                onChange={(e) => setProdType(e.target.value)}
                style={{
                  width: '100%', marginTop: 8, padding: 12, borderRadius: 10, border: `1px solid ${C.borderStrong}`,
                  background: C.bg, color: C.text, fontSize: 13, outline: 'none'
                }}
              >
                <option value="Loan">Loan (Small Institutions or Individuals)</option>
                <option value="BNPL">BNPL (Electronic installments / Retailer grids)</option>
                <option value="Insurance">Insurance premium financing</option>
              </select>
            </div>

            {/* BNPL Product Image Upload & Template Picker */}
            {prodType === 'BNPL' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16, borderRadius: 16, background: 'rgba(255,255,255,0.01)', border: `1px solid ${C.border}` }}>
                <div>
                  <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: C.textSub }}>Product Image (BNPL Only)</p>
                  <p style={{ margin: '2px 0 0', fontSize: 10, color: C.textMuted }}>Upload a custom product image or select a high-fidelity preset.</p>
                </div>

                {/* Upload Drag & Drop Area */}
                <label style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  height: 120, border: `2px dashed ${imageUrl ? C.emeraldLight + '44' : C.borderStrong}`,
                  borderRadius: 12, cursor: 'pointer', background: 'rgba(0,0,0,0.2)', transition: '0.2s', position: 'relative', overflow: 'hidden'
                }}>
                  {imageUrl ? (
                    <>
                      <img src={imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{
                        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.2s',
                        zIndex: 5
                      }} className="upload-overlay">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ margin: '0 auto' }}>
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                        </svg>
                        <span style={{ fontSize: 11, fontWeight: 700, marginTop: 4, display: 'block', textAlign: 'center' }}>Replace Image</span>
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '0 20px' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.blueLight} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 6 }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                      <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: C.textSub }}>Drag image here or click to browse</p>
                      <p style={{ margin: '2px 0 0', fontSize: 9.5, color: C.textMuted }}>Supports JPG, PNG, WebP up to 5MB</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImageUrl(reader.result as string);
                          toast.success('Product image uploaded successfully!');
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>

                {/* Pre-configured templates */}
                <div>
                  <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 800, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Quick Presets</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[
                      { 
                        name: 'Sleek Air Conditioner', 
                        desc: 'Smart inverter split air conditioner with silent turbo cooling and eco-mode integration.',
                        img: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=400&q=80',
                        label: '❄️ Inverter AC' 
                      },
                      { 
                        name: 'iPhone 15 Pro Max', 
                        desc: 'Titanium design with A17 Pro chip, customizable Action button, and 5x Telephoto camera.',
                        img: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&q=80',
                        label: '📱 iPhone 15 Pro' 
                      },
                      { 
                        name: 'Ultra Slim Smart OLED TV', 
                        desc: 'OLED evo gallery edition with immersive 4K cinematic AI processor and surround sound scaling.',
                        img: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&q=80',
                        label: '🖥️ 4K OLED TV' 
                      },
                      { 
                        name: 'French Door Refrigerator', 
                        desc: 'Smart double-door frost-free refrigerator with multi-air flow climate stabilizer controls.',
                        img: 'https://images.unsplash.com/photo-1571175432267-27b3706d2a88?w=400&q=80',
                        label: '❄️ Refrigerator' 
                      }
                    ].map(t => (
                      <button
                        key={t.name}
                        type="button"
                        onClick={() => {
                          setProdName(t.name);
                          setProdDesc(t.desc);
                          setImageUrl(t.img);
                          toast.success(`Preset "${t.label}" loaded successfully!`);
                        }}
                        style={{
                          padding: '8px 10px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`,
                          borderRadius: 8, color: C.textSub, fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
                          textAlign: 'left', display: 'flex', alignItems: 'center', gap: 6, transition: '0.2s'
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Product Name */}
            <div>
              <span style={{ fontSize: 12, color: C.textSub }}>Financial Product Name</span>
              <input 
                placeholder="e.g. Enterprise Auto Shield, public service salary loans..."
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
                style={{
                  width: '100%', marginTop: 8, padding: 12, borderRadius: 10, border: `1px solid ${C.borderStrong}`,
                  background: C.bg, color: C.text, fontSize: 13, outline: 'none'
                }}
              />
            </div>

            {/* Description */}
            <div>
              <span style={{ fontSize: 12, color: C.textSub }}>Product Overview</span>
              <textarea 
                placeholder="Describe product highlights and consumer target scopes..."
                value={prodDesc}
                onChange={(e) => setProdDesc(e.target.value)}
                style={{
                  width: '100%', marginTop: 8, padding: 12, borderRadius: 10, border: `1px solid ${C.borderStrong}`,
                  background: C.bg, color: C.text, fontSize: 13, outline: 'none', height: 70, resize: 'none'
                }}
              />
            </div>

            {/* Grid for parameters */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <span style={{ fontSize: 12, color: C.textSub }}>Minimum Amount (GH₵)</span>
                <input 
                  type="number"
                  value={minAmount}
                  onChange={(e) => setMinAmount(Number(e.target.value))}
                  style={{
                    width: '100%', marginTop: 8, padding: 12, borderRadius: 10, border: `1px solid ${C.borderStrong}`,
                    background: C.bg, color: C.text, fontSize: 13, outline: 'none'
                  }}
                />
              </div>
              <div>
                <span style={{ fontSize: 12, color: C.textSub }}>Maximum Amount (GH₵)</span>
                <input 
                  type="number"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(Number(e.target.value))}
                  style={{
                    width: '100%', marginTop: 8, padding: 12, borderRadius: 10, border: `1px solid ${C.borderStrong}`,
                    background: C.bg, color: C.text, fontSize: 13, outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <span style={{ fontSize: 12, color: C.textSub }}>Interest Rate ({prodType === 'Insurance' ? 'monthly fee' : '% p.a.'})</span>
                <input 
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  style={{
                    width: '100%', marginTop: 8, padding: 12, borderRadius: 10, border: `1px solid ${C.borderStrong}`,
                    background: C.bg, color: C.text, fontSize: 13, outline: 'none'
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <span style={{ fontSize: 11, color: C.textSub }}>Min Tenure (Mo)</span>
                  <input 
                    type="number"
                    value={minTenure}
                    onChange={(e) => setMinTenure(Number(e.target.value))}
                    style={{
                      width: '100%', marginTop: 8, padding: 12, borderRadius: 10, border: `1px solid ${C.borderStrong}`,
                      background: C.bg, color: C.text, fontSize: 13, outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: 11, color: C.textSub }}>Max Tenure (Mo)</span>
                  <input 
                    type="number"
                    value={maxTenure}
                    onChange={(e) => setMaxTenure(Number(e.target.value))}
                    style={{
                      width: '100%', marginTop: 8, padding: 12, borderRadius: 10, border: `1px solid ${C.borderStrong}`,
                      background: C.bg, color: C.text, fontSize: 13, outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div>
              <span style={{ fontSize: 12, color: C.textSub }}>Client Underwriting Requirements</span>
              <textarea 
                placeholder="e.g. Ghana Card, 3 Months Payslip, active MoMo wallet..."
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                style={{
                  width: '100%', marginTop: 8, padding: 12, borderRadius: 10, border: `1px solid ${C.borderStrong}`,
                  background: C.bg, color: C.text, fontSize: 13, outline: 'none', height: 60, resize: 'none'
                }}
              />
            </div>

            {/* Benefits */}
            <div>
              <span style={{ fontSize: 12, color: C.textSub }}>Product Benefits & Perks</span>
              <textarea 
                placeholder="e.g. Zero deposit required, instant delivery, flexible premium structures..."
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                style={{
                  width: '100%', marginTop: 8, padding: 12, borderRadius: 10, border: `1px solid ${C.borderStrong}`,
                  background: C.bg, color: C.text, fontSize: 13, outline: 'none', height: 60, resize: 'none'
                }}
              />
            </div>

            {/* Terms and Conditions */}
            <div>
              <span style={{ fontSize: 12, color: C.textSub }}>Terms & Conditions</span>
              <textarea 
                placeholder="Underwriting limits or default penalty calculations..."
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                style={{
                  width: '100%', marginTop: 8, padding: 12, borderRadius: 10, border: `1px solid ${C.borderStrong}`,
                  background: C.bg, color: C.text, fontSize: 13, outline: 'none', height: 60, resize: 'none'
                }}
              />
            </div>

            <button
              onClick={handlePublishProduct}
              disabled={isPublishing || isUpdating}
              style={{
                width: '100%', padding: 14, marginTop: 12, borderRadius: 12, border: 'none', background: C.blue,
                color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer'
              }}
            >
              {isPublishing || isUpdating ? 'Processing Offerings...' : editingProduct ? 'Save Modifications' : 'Publish Product Offerings'}
            </button>

          </div>
        </div>
      </Drawer>

      {/* Quick Register Provider Drawer */}
      <Drawer
        anchor="right"
        open={showProviderDrawer}
        onClose={() => setShowProviderDrawer(false)}
        PaperProps={{
          sx: {
            width: '100%', maxWidth: 450,
            background: C.surface, borderLeft: `1px solid ${C.border}`,
            boxShadow: '-20px 0 60px rgba(0,0,0,0.7)', color: C.text, p: 0,
            zIndex: 1400 // Renders over the product drawer
          }
        }}
      >
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ padding: 24, borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 9.5, fontWeight: 900, color: C.blueLight, letterSpacing: '0.06em', textTransform: 'uppercase' }}>CREATIVE PROVISIONING</span>
              <h3 style={{ margin: '4px 0 0', fontSize: 18, color: C.text, fontFamily: F.heading }}>Register Provider</h3>
            </div>
            <IconButton onClick={() => setShowProviderDrawer(false)} sx={{ color: C.textSub }}>
              <CloseRounded sx={{ fontSize: 18 }} />
            </IconButton>
          </div>

          <div style={{ flex: 1, padding: '24px 32px 40px', display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto' }}>
            
            {/* Provider Type */}
            <div>
              <span style={{ fontSize: 12, color: C.textSub }}>Provider Entity Type</span>
              <select
                value={provType}
                onChange={(e) => setProvType(e.target.value)}
                style={{
                  width: '100%', marginTop: 8, padding: 12, borderRadius: 10, border: `1px solid ${C.borderStrong}`,
                  background: C.bg, color: C.text, fontSize: 13, outline: 'none'
                }}
              >
                <option value="Microfinance">Small Microfinance Institution</option>
                <option value="Individual">Individual Lender</option>
                <option value="Fintech">Alternative Fintech Provider</option>
                <option value="Merchant">BNPL Merchant Store</option>
                <option value="Insurance">Bespoke Insurance Partner</option>
              </select>
            </div>

            {/* Provider Name */}
            <div>
              <span style={{ fontSize: 12, color: C.textSub }}>
                {provType === 'Individual' ? 'Lender\'s Full Name' : 'Institution Public Name'}
              </span>
              <input 
                placeholder={provType === 'Individual' ? 'e.g. Samuel Anim (Lender)' : 'e.g. Ebenezer Credit Co.'}
                value={provName}
                onChange={(e) => {
                  setProvName(e.target.value);
                  if (!provLegal) setProvLegal(e.target.value);
                }}
                style={{
                  width: '100%', marginTop: 8, padding: 12, borderRadius: 10, border: `1px solid ${C.borderStrong}`,
                  background: C.bg, color: C.text, fontSize: 13, outline: 'none'
                }}
              />
            </div>

            {/* Legal Name */}
            <div>
              <span style={{ fontSize: 12, color: C.textSub }}>Legal Corporate Name</span>
              <input 
                placeholder="e.g. Ebenezer Credit Company Limited"
                value={provLegal}
                onChange={(e) => setProvLegal(e.target.value)}
                style={{
                  width: '100%', marginTop: 8, padding: 12, borderRadius: 10, border: `1px solid ${C.borderStrong}`,
                  background: C.bg, color: C.text, fontSize: 13, outline: 'none'
                }}
              />
            </div>

            {/* Grid for credentials */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <span style={{ fontSize: 12, color: C.textSub }}>
                  {provType === 'Individual' ? 'Ghana Card ID' : 'Registration Number'}
                </span>
                <input 
                  placeholder={provType === 'Individual' ? 'GHA-722998811-1' : 'REG-2026-GH'}
                  value={provReg}
                  onChange={(e) => setProvReg(e.target.value)}
                  style={{
                    width: '100%', marginTop: 8, padding: 12, borderRadius: 10, border: `1px solid ${C.borderStrong}`,
                    background: C.bg, color: C.text, fontSize: 13, outline: 'none'
                  }}
                />
              </div>
              <div>
                <span style={{ fontSize: 12, color: C.textSub }}>Tax Identification (TIN)</span>
                <input 
                  placeholder="G00098273889"
                  value={provTax}
                  onChange={(e) => setProvTax(e.target.value)}
                  style={{
                    width: '100%', marginTop: 8, padding: 12, borderRadius: 10, border: `1px solid ${C.borderStrong}`,
                    background: C.bg, color: C.text, fontSize: 13, outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <span style={{ fontSize: 12, color: C.textSub }}>Primary Support Email</span>
                <input 
                  placeholder="lending@provider.com"
                  value={provEmail}
                  onChange={(e) => setProvEmail(e.target.value)}
                  style={{
                    width: '100%', marginTop: 8, padding: 12, borderRadius: 10, border: `1px solid ${C.borderStrong}`,
                    background: C.bg, color: C.text, fontSize: 13, outline: 'none'
                  }}
                />
              </div>
              <div>
                <span style={{ fontSize: 12, color: C.textSub }}>Hotline Number</span>
                <input 
                  placeholder="+233244112233"
                  value={provPhone}
                  onChange={(e) => setProvPhone(e.target.value)}
                  style={{
                    width: '100%', marginTop: 8, padding: 12, borderRadius: 10, border: `1px solid ${C.borderStrong}`,
                    background: C.bg, color: C.text, fontSize: 13, outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* City & Address */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <span style={{ fontSize: 12, color: C.textSub }}>Street Address</span>
                <input 
                  placeholder="12 Ring Road Central"
                  value={provStreet}
                  onChange={(e) => setProvStreet(e.target.value)}
                  style={{
                    width: '100%', marginTop: 8, padding: 12, borderRadius: 10, border: `1px solid ${C.borderStrong}`,
                    background: C.bg, color: C.text, fontSize: 13, outline: 'none'
                  }}
                />
              </div>
              <div>
                <span style={{ fontSize: 12, color: C.textSub }}>City</span>
                <input 
                  placeholder="Accra"
                  value={provCity}
                  onChange={(e) => setProvCity(e.target.value)}
                  style={{
                    width: '100%', marginTop: 8, padding: 12, borderRadius: 10, border: `1px solid ${C.borderStrong}`,
                    background: C.bg, color: C.text, fontSize: 13, outline: 'none'
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleRegisterProvider}
              disabled={isSavingProvider}
              style={{
                width: '100%', padding: 14, marginTop: 12, borderRadius: 12, border: 'none', background: C.emerald,
                color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer'
              }}
            >
              {isSavingProvider ? 'Registering Provider...' : 'Register Provider Profile'}
            </button>

          </div>
        </div>
      </Drawer>

      {/* Confirm Delete Product Dialog */}
      <Dialog
        open={!!confirmDeleteProduct}
        onClose={() => setConfirmDeleteProduct(null)}
        PaperProps={{
          style: {
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 24,
            padding: 24,
            maxWidth: 400,
            color: C.text
          }
        }}
      >
        <h3 style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 700, fontFamily: F.heading }}>Delete Financial Product?</h3>
        <p style={{ margin: '0 0 20px', fontSize: 13.5, color: C.textSub, lineHeight: 1.5 }}>
          Are you sure you want to permanently delete the financial product <strong style={{ color: C.text }}>"{confirmDeleteProduct?.name}"</strong>? This action is irreversible.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            onClick={() => setConfirmDeleteProduct(null)}
            style={{
              background: 'none', border: `1px solid ${C.border}`, borderRadius: 10,
              padding: '10px 18px', fontSize: 12.5, fontWeight: 700, color: C.textSub, cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => handleDeleteProduct(confirmDeleteProduct?._id)}
            disabled={isDeleting}
            style={{
              background: C.red, border: 'none', borderRadius: 10,
              padding: '10px 18px', fontSize: 12.5, fontWeight: 800, color: '#fff', cursor: 'pointer'
            }}
          >
            {isDeleting ? 'Deleting...' : 'Delete Product'}
          </button>
        </div>
      </Dialog>

    </AdminShell>
  );
}
