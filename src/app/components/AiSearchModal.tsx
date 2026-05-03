import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Mock AI Knowledge Base
const aiKnowledgeBase: Record<string, string> = {
  'loan': 'Personal loans are typically fixed-term loans you can use for things like consolidating debt or covering a large expense. With eligibility and costs varying by lender, comparing rates is crucial. ResolveBridge partners with verified lenders to offer rates from 14% p.a.',
  'personal loan': 'Personal loans are typically fixed-term loans you can use for things like consolidating debt or covering a large expense. With eligibility and costs varying by lender, comparing rates is crucial. ResolveBridge partners with verified lenders to offer rates from 14% p.a.',
  'business': 'Business credit options include revolving lines of credit, term loans, and SME capital designed to scale your operations. We offer direct connections to verified regional banks offering up to GH₵ 500K for qualified businesses.',
  'insurance': 'We provide quotes for 6 major insurance categories including Health, Life, Auto, and Property cover. Protect your assets with institutional-grade providers.',
  'mortgage': 'Home equity and mortgages allow you to unlock your property’s value. Typical financing terms are up to 15 years fixed, with values extending up to GH₵ 800K.',
  'auto': 'Vehicle finance options are available for both personal use and commercial fleets. We connect you to regional banks for competitive rates starting around 16% p.a.',
  'score': 'Your institutional credit score is a vital metric that lenders use to evaluate your creditworthiness. Monitoring it is free on ResolveBridge and has no impact on your rating.',
  'default': 'I can help you understand financial products like personal loans, business credit, insurance, or auto finance. Could you provide a bit more detail on what you are looking for?'
};

// Simple debouncer
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

interface AiSearchModalProps {
  open: boolean;
  onClose: () => void;
  initialSearch?: string;
}

export default function AiSearchModal({ open, onClose, initialSearch = '' }: AiSearchModalProps) {
  const [input, setInput] = useState(initialSearch);
  const debouncedInput = useDebounce(input, 500);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Focus effect
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      if (initialSearch) {
        setInput(initialSearch);
        handleUserSubmit(initialSearch);
      } else {
        // Initial greeting
        setMessages([{ id: 'init', sender: 'ai', text: 'Hi! I am Resolve AI. Ask me anything about loans, credit, or insurance...' }]);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    } else {
      // Reset state when closed
      setTimeout(() => {
        setMessages([]);
        setInput('');
      }, 300);
    }
  }, [open, initialSearch]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Debounce handler for auto-search
  useEffect(() => {
    if (debouncedInput && debouncedInput !== initialSearch && debouncedInput.trim().length > 3) {
      // Only auto-submit if it's the last message
      const lastMsg = messages[messages.length - 1];
      if (!lastMsg || lastMsg.sender === 'ai') {
        // Option A: Auto-send the message as if user pressed enter
        // handleUserSubmit(debouncedInput);
        // Option B: Just provide real-time suggestions (not implemented in chat UI perfectly, so we stick to manual submit for chat)
      }
    }
  }, [debouncedInput]);

  const handleUserSubmit = (query: string) => {
    if (!query.trim()) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI network delay
    setTimeout(() => {
      let aiResponseText = aiKnowledgeBase['default'];
      const qLower = query.toLowerCase();
      
      // Basic keyword matching
      for (const key of Object.keys(aiKnowledgeBase)) {
        if (key !== 'default' && qLower.includes(key)) {
          aiResponseText = aiKnowledgeBase[key];
          break;
        }
      }

      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: aiResponseText };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)',
              zIndex: 9999
            }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              right: '2%', top: '15%',
              width: '90%', maxWidth: '400px',
              height: '600px', maxHeight: '80vh',
              background: '#fff',
              borderRadius: '24px',
              boxShadow: '0 24px 60px rgba(0,0,0,0.15)',
              zIndex: 10000,
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <Box sx={{ background: '#0a1e2b', p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '10px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 2 11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </Box>
                <Typography sx={{ color: '#fff', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Resolve AI</Typography>
              </Box>
              <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.1)' } }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Chat Area */}
            <Box sx={{ flex: 1, p: 3, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, background: '#f8fafc' }}>
              {messages.map((msg) => (
                <Box key={msg.id} sx={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: msg.sender === 'user' ? '#f1f5f9' : '#fff',
                  border: msg.sender === 'user' ? '1px solid #e2e8f0' : '1px solid rgba(16,185,129,0.2)',
                  color: '#1e293b',
                  p: 2,
                  borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  boxShadow: msg.sender === 'user' ? 'none' : '0 4px 12px rgba(16,185,129,0.05)',
                }}>
                  {msg.sender === 'user' ? (
                    <Typography sx={{ fontSize: '14px', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>{msg.text}</Typography>
                  ) : (
                    <Box>
                      <Typography sx={{ fontSize: '14px', fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>{msg.text}</Typography>
                      {msg.text.includes('personal loan') && (
                        <Box sx={{ mt: 2, display: 'inline-block', background: '#d1fae5', color: '#065f46', px: 1.5, py: 0.5, borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}>
                          👉 View Personal Loans
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              ))}
              
              {isTyping && (
                <Box sx={{ alignSelf: 'flex-start', background: '#fff', border: '1px solid rgba(16,185,129,0.2)', p: 2, borderRadius: '16px 16px 16px 4px', display: 'flex', gap: 0.5 }}>
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} style={{ width: 6, height: 6, background: '#10b981', borderRadius: '50%' }} />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} style={{ width: 6, height: 6, background: '#10b981', borderRadius: '50%' }} />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} style={{ width: 6, height: 6, background: '#10b981', borderRadius: '50%' }} />
                </Box>
              )}
              <div ref={chatEndRef} />
            </Box>

            {/* Input Area */}
            <Box sx={{ p: 2, background: '#fff', borderTop: '1px solid #f1f5f9' }}>
              <form onSubmit={(e) => { e.preventDefault(); handleUserSubmit(input); }} style={{ display: 'flex', gap: 8 }}>
                <Box sx={{ flex: 1, position: 'relative' }}>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything about money..."
                    style={{
                      width: '100%',
                      padding: '14px 40px 14px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid #e2e8f0',
                      outline: 'none',
                      fontSize: '14px',
                      fontFamily: "'Inter', sans-serif"
                    }}
                  />
                  <IconButton 
                    type="submit"
                    disabled={!input.trim()}
                    sx={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', color: input.trim() ? '#10b981' : '#cbd5e1' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </IconButton>
                </Box>
              </form>
              <Typography sx={{ textAlign: 'center', fontSize: '10px', color: '#94a3b8', mt: 1.5, fontFamily: "'Inter', sans-serif" }}>
                AI can make mistakes. Please verify important information.
              </Typography>
            </Box>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
