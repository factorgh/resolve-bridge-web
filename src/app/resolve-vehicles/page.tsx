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
  StarRounded
} from '@mui/icons-material';
import PageTemplate from '../components/PageTemplate';
import { useGetPublicVehiclesQuery } from '@/lib/redux/api/vehicleApi';

const segments = ["All", "SUV", "Sedan", "4x4", "Pick-up"];

function VehicleCard({ vehicle, idx }: { vehicle: any; idx: number }) {
  const photo = vehicle.photos?.[0]?.url || '/cars/car-1.jpg';
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.05, duration: 0.6 }}
      className="h-full"
    >
      <Card className="group relative h-full transition-all duration-500 hover:-translate-y-2 overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-sm">
        <Box className="relative overflow-hidden aspect-[4/3]">
          <CardMedia
            component="img"
            image={photo}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {vehicle.condition && (
            <Chip
              label={vehicle.condition}
              className="absolute top-4 left-4 bg-blue-600 font-black text-[9px] md:text-[10px] tracking-widest text-white rounded-xl"
              size="small"
            />
          )}
        </Box>

        <CardContent className="p-5 md:p-6 h-full flex flex-col">
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" className="mb-4">
            <Box>
              <Typography variant="body2" className="text-blue-600 font-bold uppercase tracking-widest text-[9px] md:text-[10px] mb-1">
                {vehicle.make}
              </Typography>
              <Typography variant="h6" className="font-black tracking-tight text-slate-900 line-clamp-1 text-base md:text-lg">
                {vehicle.model}
              </Typography>
            </Box>
            <Typography className="text-emerald-500 font-black text-[10px] md:text-xs whitespace-nowrap pt-1 uppercase tracking-widest">
              GH₵ {Number(vehicle.customerPrice || 0).toLocaleString()}
            </Typography>
          </Stack>

          <Grid container spacing={1} className="mb-4">
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

          <Typography className="text-[11px] font-bold text-slate-500 mb-4">
            Lender: {vehicle.recommendedBank?.name || 'Assigned at listing'}
          </Typography>

          <Box className="mt-auto">
            <Button
              fullWidth
              component={Link}
              href={`/portal/apply-vehicle/${vehicle.id}`}
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
  const { data } = useGetPublicVehiclesQuery();

  useEffect(() => {
    setMounted(true);
  }, []);

  const liveVehicles = data?.data || [];

  const filteredVehicles = useMemo(() => {
    return liveVehicles.filter((v: any) => {
      const matchSegment = activeSegment === 'All' || v.bodyType === activeSegment;
      const hay = `${v.make} ${v.model}`.toLowerCase();
      return matchSegment && hay.includes(searchQuery.toLowerCase());
    });
  }, [activeSegment, searchQuery, liveVehicles]);

  if (!mounted) return null;

  return (
    <PageTemplate
      title="Luxury & Commercial"
      gradientTitle="Marketplace"
      subtitle="Verified vehicles at the ResolveBridge price, each with one recommended Ghana lender already attached."
      noCard={true}
    >
      <Box className="pb-32 flex flex-col gap-12 md:gap-24 px-4 md:px-0">
        <Paper
          elevation={0}
          className="relative -mt-16 z-10 p-5 md:p-8 rounded-[32px] md:rounded-[40px] border border-slate-100 bg-white/80 backdrop-blur-xl"
        >
          <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography variant="caption" className="font-black uppercase tracking-[0.2em] text-slate-400 block mb-3 text-[10px] md:text-xs">
                Search listed vehicles
              </Typography>
              <TextField
                fullWidth
                placeholder="Search models or brands..."
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
                        ? 'bg-blue-600 text-white'
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

        <Box>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'center', md: 'flex-end' }} className="mb-12 gap-6 text-center md:text-left">
            <Box>
              <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                <StarRounded className="text-blue-600" fontSize="small" />
                <Typography variant="caption" className="font-black uppercase tracking-widest text-blue-600 text-[10px] md:text-xs">
                  Live verified inventory
                </Typography>
              </div>
              <Typography variant="h3" className="font-black tracking-tighter mb-2 text-2xl md:text-4xl">
                Cars available <span className="text-blue-600 italic">for loans.</span>
              </Typography>
              <Typography variant="body1" className="text-slate-500 font-medium text-sm md:text-base">
                {filteredVehicles.length} vehicles listed after ResolveBridge verification.
              </Typography>
            </Box>
            <Button
              component={Link}
              href="/portal/marketplace"
              variant="outlined"
              startIcon={<FilterListRounded />}
              className="rounded-xl border-slate-200 text-slate-900 font-bold px-6 py-3 hover:bg-slate-50 w-full md:w-auto"
              sx={{ textTransform: 'none' }}
            >
              Also in BNPL shop
            </Button>
          </Stack>

          <Grid container spacing={{ xs: 3, md: 4 }}>
            {filteredVehicles.map((v: any, i: number) => (
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
              <Typography variant="h5" className="font-black text-slate-900 mb-2 text-lg md:text-xl">No listed vehicles yet</Typography>
              <Typography className="text-slate-500 font-medium max-w-sm mx-auto text-sm md:text-base px-6">
                Dealers send stock through a ResolveBridge upload link. After verification and markup, cars appear here with one recommended lender.
              </Typography>
            </motion.div>
          )}
        </Box>
      </Box>
    </PageTemplate>
  );
}
