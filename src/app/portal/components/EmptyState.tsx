'use client';

import { motion } from 'framer-motion';
import { C, F } from './PortalShell';
import { BlurOnRounded } from '@mui/icons-material';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ 
  title, 
  description, 
  icon = <BlurOnRounded sx={{ fontSize: 48, opacity: 0.2 }} />, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ 
        padding: '80px 40px', 
        textAlign: 'center', 
        background: '#fff', 
        borderRadius: 32, 
        border: `1px dashed ${C.border}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        maxWidth: 500,
        margin: '40px auto'
      }}
    >
      <div style={{ 
        width: 100, height: 100, borderRadius: '50%', 
        background: '#f8fafc', 
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: C.text,
        marginBottom: 8
      }}>
        {icon}
      </div>
      
      <div>
        <h3 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 900, fontFamily: F.heading, color: C.text }}>{title}</h3>
        <p style={{ margin: 0, fontSize: 14, color: C.textSub, lineHeight: 1.6 }}>{description}</p>
      </div>

      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          style={{ 
            marginTop: 12,
            padding: '14px 28px', 
            borderRadius: 16, 
            border: 'none', 
            background: C.text, 
            color: '#fff', 
            fontSize: 14, 
            fontWeight: 800, 
            cursor: 'pointer',
            transition: '0.2s',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
