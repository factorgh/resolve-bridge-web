'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  TextField, 
  Button, 
  Chip, 
  InputAdornment, 
  IconButton,
  Paper,
  Stack
} from '@mui/material';
import { 
  SearchRounded as SearchIcon, 
  SettingsRounded, 
  LocalGasStationRounded, 
  SpeedRounded, 
  ChevronRightRounded,
  FilterListRounded,
  FavoriteBorderRounded,
  StarRounded
} from '@mui/icons-material';
import PageTemplate from '../components/PageTemplate';

const initialVehicles = [
  { id: 1, name: "Mercedes G-Wagon", manufacturer: "Mercedes-Benz", type: "SUV", fuel: "Petrol", transmission: "Auto", year: "2024", miles: "0 KM", image: "/cars/car-1.jpg", tag: "NEW" },
  { id: 2, name: "BMW X7 M-Sport", manufacturer: "BMW", type: "SUV", fuel: "Petrol", transmission: "Auto", year: "2023", miles: "1,200 KM", image: "/cars/car-2.jpg", tag: "PREMIUM" },
  { id: 3, name: "Toyota Land Cruiser 300", manufacturer: "Toyota", type: "4x4", fuel: "Diesel", transmission: "Auto", year: "2023", miles: "0 KM", image: "/cars/car-3.jpg", tag: "IN STOCK" },
  { id: 4, name: "Range Rover Velar", manufacturer: "Land Rover", type: "SUV", fuel: "Petrol", transmission: "Auto", year: "2023", miles: "5,400 KM", image: "/cars/car-4.jpg", tag: "FEATURED" },
  { id: 5, name: "Hyundai Tucson Premium", manufacturer: "Hyundai", type: "SUV", fuel: "Petrol", transmission: "Auto", year: "2024", miles: "0 KM", image: "/cars/car-5.jpg", tag: "NEW" },
  { id: 6, name: "Kia Sportage GT-Line", manufacturer: "Kia", type: "SUV", fuel: "Hybrid", transmission: "Auto", year: "2024", miles: "0 KM", image: "/cars/car-6.jpg", tag: "ECO" },
  { id: 7, name: "Audi Q7 S-Line", manufacturer: "Audi", type: "SUV", fuel: "Petrol", transmission: "Auto", year: "2023", miles: "4,500 KM", image: "/cars/car-7.jpg", tag: "" },
  { id: 8, name: "Ford F-150 Raptor", manufacturer: "Ford", type: "Pick-up", fuel: "Petrol", transmission: "Auto", year: "2023", miles: "0 KM", image: "/cars/car-8.jpg", tag: "OFF-ROAD" },
  { id: 9, name: "Tesla Model Y", manufacturer: "Tesla", type: "Sedan", fuel: "Electric", transmission: "Auto", year: "2024", miles: "0 KM", image: "/cars/car-9.jpg", tag: "EV" },
  { id: 10, name: "Lexus LX 600", manufacturer: "Lexus", type: "SUV", fuel: "Petrol", transmission: "Auto", year: "2023", miles: "2,000 KM", image: "/cars/car-10.jpg", tag: "" },
];

const segments = ["All", "SUV", "Sedan", "4x4", "Pick-up"];

function VehicleCard({ vehicle, idx }: { vehicle: typeof initialVehicles[0]; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.05, duration: 0.6 }}
      className="h-full"
    >
      <Card className="group relative h-full transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(37,99,235,0.2)] overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-sm">
        <Box className="relative overflow-hidden aspect-[4/3]">
          <CardMedia
            component="img"
            image={vehicle.image}
            alt={vehicle.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <Box className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {vehicle.tag && (
            <Chip 
              label={vehicle.tag} 
              className="absolute top-4 left-4 bg-blue-600 font-black text-[9px] md:text-[10px] tracking-widest text-white rounded-xl"
              size="small"
            />
          )}
          
          <IconButton className="absolute top-4 right-4 bg-white/70 backdrop-blur-md hover:bg-white text-slate-800 transition-all scale-0 group-hover:scale-100 duration-300">
            <FavoriteBorderRounded fontSize="small" />
          </IconButton>
        </Box>

        <CardContent className="p-5 md:p-6 h-full flex flex-col">
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" className="mb-4">
            <Box>
              <Typography variant="body2" className="text-blue-600 font-bold uppercase tracking-widest text-[9px] md:text-[10px] mb-1">
                {vehicle.manufacturer}
              </Typography>
              <Typography variant="h6" className="font-black tracking-tight text-slate-900 line-clamp-1 text-base md:text-lg">
                {vehicle.name}
              </Typography>
            </Box>
            <Typography className="text-emerald-500 font-black text-[10px] md:text-xs whitespace-nowrap pt-1 uppercase tracking-widest">
              Available
            </Typography>
          </Stack>

          <Grid container spacing={1} className="mb-6">
            <Grid size={{ xs: 4 }}>
              <Box className="bg-slate-50 p-2 rounded-2xl text-center border border-slate-100 h-full flex flex-col items-center justify-center">
                <LocalGasStationRounded sx={{ fontSize: 16 }} className="text-slate-400 mb-1" />
                <Typography className="text-[9px] md:text-[10px] font-bold text-slate-600 block leading-tight">{vehicle.fuel}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Box className="bg-slate-50 p-2 rounded-2xl text-center border border-slate-100 h-full flex flex-col items-center justify-center">
                <SettingsRounded sx={{ fontSize: 16 }} className="text-slate-400 mb-1" />
                <Typography className="text-[9px] md:text-[10px] font-bold text-slate-600 block leading-tight">{vehicle.transmission}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Box className="bg-slate-50 p-2 rounded-2xl text-center border border-slate-100 h-full flex flex-col items-center justify-center">
                <SpeedRounded sx={{ fontSize: 16 }} className="text-slate-400 mb-1" />
                <Typography className="text-[9px] md:text-[10px] font-bold text-slate-600 block leading-tight">{vehicle.year}</Typography>
              </Box>
            </Grid>
          </Grid>

          <Box className="mt-auto">
            <Button 
              fullWidth 
              component={Link}
              href={`/get-started?vehicle=${encodeURIComponent(vehicle.name)}`}
              variant="contained" 
              disableElevation
              endIcon={<ChevronRightRounded />}
              className="rounded-2xl py-3 bg-slate-900 hover:bg-blue-600 text-white font-bold transition-all text-sm md:text-base"
              sx={{ textTransform: 'none' }}
            >
              Get Financed
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ResolveVehiclesPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSegment, setActiveSegment] = useState('All');

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredVehicles = useMemo(() => {
    return initialVehicles.filter(v => {
      const matchSegment = activeSegment === 'All' || v.type === activeSegment;
      const matchSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSegment && matchSearch;
    });
  }, [activeSegment, searchQuery]);

  if (!mounted) return null;

  return (
    <PageTemplate 
      title="Luxury & Commercial" 
      gradientTitle="Marketplace"
      subtitle="Experience the next generation of automotive procurement. Transparent, verified inventory with immediate ResolveBridge institutional financing."
      noCard={true}
    >
      <Box className="pb-32 flex flex-col gap-12 md:gap-24 px-4 md:px-0">
        
        {/* Modern Filter Hub */}
        <Paper 
          elevation={0}
          className="relative -mt-16 z-10 p-5 md:p-8 rounded-[32px] md:rounded-[40px] border border-slate-100 bg-white/80 backdrop-blur-xl shadow-[0_30px_100px_-20px_rgba(0,0,0,0.12)]"
        >
          <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography variant="caption" className="font-black uppercase tracking-[0.2em] text-slate-400 block mb-3 text-[10px] md:text-xs">
                Quick Marketplace Search
              </Typography>
              <TextField 
                fullWidth
                placeholder="Search models, brands, or types..."
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon className="text-slate-400" />
                    </InputAdornment>
                  ),
                  className: "rounded-2xl bg-slate-50/50 font-medium h-14"
                }}
                sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="caption" className="font-black uppercase tracking-[0.2em] text-slate-400 block mb-3 text-[10px] md:text-xs text-center md:text-left">
                Vehicle Categories
              </Typography>
              <Stack direction="row" spacing={1} className="overflow-x-auto pb-2 noscrollbar w-full justify-center md:justify-start">
                {segments.map((seg) => (
                  <Button
                    key={seg}
                    onClick={() => setActiveSegment(seg)}
                    className={`rounded-2xl px-5 md:px-6 py-2.5 md:py-3 font-bold transition-all whitespace-nowrap text-sm ${
                      activeSegment === seg 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                    sx={{ textTransform: 'none' }}
                  >
                    {seg}
                  </Button>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Inventory Body */}
        <Box>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'center', md: 'flex-end' }} className="mb-12 gap-6 text-center md:text-left">
            <Box>
              <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                <StarRounded className="text-blue-600" fontSize="small" />
                <Typography variant="caption" className="font-black uppercase tracking-widest text-blue-600 text-[10px] md:text-xs">
                  Live Global Inventory
                </Typography>
              </div>
              <Typography variant="h3" className="font-black tracking-tighter mb-2 text-2xl md:text-4xl">
                Our Curated <span className="text-blue-600 italic">Selection.</span>
              </Typography>
              <Typography variant="body1" className="text-slate-500 font-medium text-sm md:text-base">
                {filteredVehicles.length} vehicles available for immediate pickup or delivery.
              </Typography>
            </Box>
            
            <Button 
              variant="outlined" 
              startIcon={<FilterListRounded />}
              className="rounded-xl border-slate-200 text-slate-900 font-bold px-6 py-3 hover:bg-slate-50 w-full md:w-auto"
              sx={{ textTransform: 'none' }}
            >
              Custom Sourcing
            </Button>
          </Stack>

          <Grid container spacing={{ xs: 3, md: 4 }}>
            {filteredVehicles.map((v, i) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={v.id}>
                <VehicleCard vehicle={v} idx={i} />
              </Grid>
            ))}
          </Grid>

          {filteredVehicles.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-center py-20 md:py-32 bg-slate-50 rounded-[32px] md:rounded-[48px] border-2 border-dashed border-slate-200 mx-4 md:mx-0"
            >
              <Box className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <SearchIcon sx={{ fontSize: { xs: 32, md: 40 } }} className="text-slate-300" />
              </Box>
              <Typography variant="h5" className="font-black text-slate-900 mb-2 text-lg md:text-xl">No matches found</Typography>
              <Typography className="text-slate-500 font-medium max-w-sm mx-auto text-sm md:text-base px-6">
                We couldn&apos;t find any vehicles matching your current selection. Global sourcing is available upon request.
              </Typography>
            </motion.div>
          )}
        </Box>

        {/* Sourcing CTA */}
        <Box className="relative rounded-[40px] md:rounded-[64px] bg-[#020617] p-8 md:p-20 overflow-hidden text-center text-white mx-4 md:mx-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <Typography variant="h3" className="font-black tracking-tight mb-6 max-w-2xl mx-auto text-xl md:text-3xl lg:text-4xl leading-[1.2]">
              Can&apos;t find your specific <span className="text-blue-500 italic">dream configuration?</span>
            </Typography>
            <Typography variant="body1" className="text-slate-400 mb-10 max-w-lg mx-auto font-medium text-sm md:text-lg">
              ResolveBridge maintains a private sourcing network across Europe and North America. We can procure, ship, and finance any vehicle within 21 days.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" alignItems="center">
              <Button 
                component={Link}
                href="/contact"
                variant="contained" 
                className="bg-blue-600 hover:bg-blue-700 rounded-2xl px-10 py-4 font-bold text-lg w-full sm:w-auto"
                sx={{ textTransform: 'none' }}
              >
                Start Sourcing Request
              </Button>
              <Typography className="text-slate-500 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">
                or call an advisor
              </Typography>
            </Stack>
          </div>
        </Box>

      </Box>
    </PageTemplate>
  );
}