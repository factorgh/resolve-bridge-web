'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SupportAgentRounded, 
  CloseRounded, 
  SendRounded, 
  KeyboardArrowDownRounded,
  ChatBubbleOutlineRounded
} from '@mui/icons-material';
import { 
  useGetChatHistoryQuery, 
  useSendMessageMutation 
} from '@/lib/redux/api/chatApi';

const C = {
  blue: '#2051e5',
  blueLight: '#4f78ff',
  bluePale: 'rgba(32,81,229,0.08)',
  surface: '#ffffff',
  bg: '#f8fafc',
  border: 'rgba(20,30,70,0.08)',
  text: '#0d1b3e',
  textSub: '#5c6b8a',
  textMuted: '#9aa5bf',
  emerald: '#10b981'
};

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [msgText, setMsgText] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Real-time REST Query with 3-second cache auto-polling!
  const { data: historyResponse, refetch } = useGetChatHistoryQuery(undefined, {
    pollingInterval: 3000,
    skip: false
  });
  
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  const messages = historyResponse?.data || [];

  // Manage unread badges and scroll mechanics
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollToBottom();
    } else {
      // Find messages sent by Support (senderRole === 'SuperAdmin' or 'Admin') that arrived recently
      const newSupportMessages = messages.filter(
        (m: any) => m.senderRole !== 'Customer' && !m.isRead
      ).length;
      setUnreadCount(newSupportMessages);
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgText.trim() || isSending) return;

    const currentText = msgText.trim();
    setMsgText(''); // Clear instantly for zero latency input UX

    try {
      await sendMessage({ text: currentText }).unwrap();
      refetch();
      scrollToBottom();
    } catch (err) {
      console.error('Failed to submit support request', err);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: 30, right: 30, zIndex: 9999, fontFamily: 'sans-serif' }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            style={{
              position: 'absolute',
              bottom: 80,
              right: 0,
              width: 380,
              height: 520,
              background: C.surface,
              borderRadius: 24,
              boxShadow: '0 20px 50px rgba(13,27,62,0.18)',
              border: `1px solid ${C.border}`,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              background: `linear-gradient(135deg, ${C.blue}, #1e3a8a)`,
              padding: '20px 24px',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ position: 'relative', width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <SupportAgentRounded sx={{ fontSize: 22, color: '#fff' }} />
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, background: C.emerald, borderRadius: '50%', border: '2px solid #1e3a8a' }} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>Resolve Support Desk</h4>
                  <p style={{ margin: 0, fontSize: 10.5, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>We typically reply in 3 seconds</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
              >
                <KeyboardArrowDownRounded />
              </button>
            </div>

            {/* Message History */}
            <div style={{ flex: 1, padding: 20, overflowY: 'auto', background: C.bg, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {messages.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: 0.6, padding: '0 20px' }}>
                  <ChatBubbleOutlineRounded sx={{ fontSize: 32, color: C.textMuted, marginBottom: 1 }} />
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: C.text }}>No support thread initiated</p>
                  <p style={{ margin: '4px 0 0', fontSize: 10.5, color: C.textSub }}>Type a message below to instantly connect with a SuperAdmin representative.</p>
                </div>
              ) : (
                messages.map((msg: any) => {
                  const isMe = msg.senderRole === 'Customer';
                  return (
                    <div 
                      key={msg._id} 
                      style={{ 
                        alignSelf: isMe ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isMe ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <span style={{ fontSize: 9, fontWeight: 700, color: C.textMuted, marginBottom: 2, padding: '0 4px' }}>
                        {isMe ? 'You' : msg.senderName}
                      </span>
                      <div style={{
                        padding: '10px 14px',
                        borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        background: isMe ? C.blue : '#ffffff',
                        color: isMe ? '#fff' : C.text,
                        boxShadow: '0 2px 6px rgba(13,27,62,0.03)',
                        border: isMe ? 'none' : `1px solid ${C.border}`,
                        fontSize: 12.5,
                        lineHeight: 1.4,
                        wordBreak: 'break-word'
                      }}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Form */}
            <form 
              onSubmit={handleSend}
              style={{
                padding: '16px 20px',
                background: C.surface,
                borderTop: `1px solid ${C.border}`,
                display: 'flex',
                gap: 10,
                alignItems: 'center'
              }}
            >
              <input
                type="text"
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                placeholder="Ask us anything about your application..."
                style={{
                  flex: 1,
                  padding: '11px 16px',
                  borderRadius: 12,
                  border: `1px solid ${C.border}`,
                  fontSize: 12.5,
                  outline: 'none',
                  background: '#fcfdfe',
                  color: C.text
                }}
              />
              <button
                type="submit"
                disabled={!msgText.trim() || isSending}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: msgText.trim() ? C.blue : C.bluePale,
                  color: msgText.trim() ? '#fff' : C.textMuted,
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: msgText.trim() ? 'pointer' : 'default',
                  transition: '0.2s'
                }}
              >
                <SendRounded sx={{ fontSize: 16 }} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Agent Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${C.blue}, #1e3a8a)`,
          color: '#fff',
          border: 'none',
          boxShadow: '0 8px 30px rgba(32,81,229,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative'
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <CloseRounded sx={{ fontSize: 24 }} />
            </motion.div>
          ) : (
            <motion.div key="agent" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <SupportAgentRounded sx={{ fontSize: 26 }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread Alert Indicator Badge */}
        {unreadCount > 0 && !isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              background: '#ef4444',
              color: '#fff',
              fontSize: 10,
              fontWeight: 900,
              minWidth: 20,
              height: 20,
              borderRadius: 10,
              padding: '0 5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #fff',
              boxShadow: '0 4px 10px rgba(239,68,68,0.3)'
            }}
          >
            {unreadCount}
          </motion.div>
        )}
      </motion.button>
    </div>
  );
}
