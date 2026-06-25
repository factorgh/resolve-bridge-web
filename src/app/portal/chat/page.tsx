'use client';

import { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SendRounded, 
  ChatBubbleOutlineRounded, 
  AccountCircleRounded,
  ArrowBackIosNewRounded
} from '@mui/icons-material';
import PortalShell, { C, F } from '../components/PortalShell';
import { 
  useGetChatHistoryQuery, 
  useSendMessageMutation 
} from '@/lib/redux/api/chatApi';
import { useGetApplicationsQuery } from '@/lib/redux/api/applicationApi';

const EMPTY_ARRAY: any[] = [];

const formatMessageTime = (dateStr: string) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (isToday) {
      return timeStr;
    }
    
    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    if (isYesterday) {
      return `Yesterday, ${timeStr}`;
    }
    
    // Other days
    const dateStrFormatted = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    return `${dateStrFormatted}, ${timeStr}`;
  } catch (e) {
    return '';
  }
};

function ChatContent() {
  const [mounted, setMounted] = useState(false);
  const [selectedInstId, setSelectedInstId] = useState<string | null>(null);
  const [selectedInstName, setSelectedInstName] = useState<string>('');
  const [selectedInstLogo, setSelectedInstLogo] = useState<string>('');
  const [msgText, setMsgText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const searchParams = useSearchParams();
  const queryInstId = searchParams.get('institutionId');
  const queryInstName = searchParams.get('institutionName');
  const queryInstLogo = searchParams.get('institutionLogo');

  // Load customer's applications to extract applied institutions (partners)
  const { data: appsResponse, isLoading: appsLoading } = useGetApplicationsQuery();
  const applications = appsResponse?.data || EMPTY_ARRAY;

  // Extract unique institutions from applications, including the query parameter institution if new
  const institutions = useMemo(() => {
    const seen = new Set<string>();
    const list: Array<{ id: string; name: string; logo: string }> = [];

    // Add query institution first if it's specified
    if (queryInstId) {
      seen.add(queryInstId);
      list.push({
        id: queryInstId,
        name: queryInstName ? decodeURIComponent(queryInstName) : 'Partner',
        logo: queryInstLogo ? decodeURIComponent(queryInstLogo) : '/resolve_icon.png'
      });
    }

    applications.forEach((app: any) => {
      if (app.providerId) {
        if (!seen.has(app.providerId)) {
          seen.add(app.providerId);
          list.push({
            id: app.providerId,
            name: app.provider,
            logo: app.logo || '/resolve_icon.png'
          });
        } else if (app.providerId === queryInstId) {
          // Update details from real application data if it exists
          const idx = list.findIndex(i => i.id === queryInstId);
          if (idx !== -1) {
            list[idx].name = app.provider;
            list[idx].logo = app.logo || list[idx].logo;
          }
        }
      }
    });
    return list;
  }, [applications, queryInstId, queryInstName, queryInstLogo]);

  // Set initial selected institution from query parameters if present
  useEffect(() => {
    const instId = searchParams.get('institutionId');
    const instName = searchParams.get('institutionName');
    const prefill = searchParams.get('prefill');
    if (instId) {
      setSelectedInstId(instId);
      if (instName) {
        setSelectedInstName(decodeURIComponent(instName));
      }
      if (prefill) {
        setMsgText(decodeURIComponent(prefill));
      }
      // Look up logo in list if possible
      const match = institutions.find(i => i.id === instId);
      if (match) {
        setSelectedInstLogo(match.logo);
      } else if (queryInstLogo) {
        setSelectedInstLogo(decodeURIComponent(queryInstLogo));
      }
    } else if (institutions.length > 0 && !selectedInstId) {
      // Default to first institution
      setSelectedInstId(institutions[0].id);
      setSelectedInstName(institutions[0].name);
      setSelectedInstLogo(institutions[0].logo);
    }
  }, [searchParams, institutions, selectedInstId, queryInstLogo]);

  // Sync selected logo when institutions list loads/updates
  useEffect(() => {
    if (selectedInstId && !selectedInstLogo) {
      const match = institutions.find(i => i.id === selectedInstId);
      if (match) {
        setSelectedInstLogo(match.logo);
      }
    }
  }, [institutions, selectedInstId, selectedInstLogo]);

  // Fetch chat history for the selected institution (polling every 3s)
  const { data: historyResponse, refetch: refetchHistory } = useGetChatHistoryQuery(
    { institutionId: selectedInstId || undefined },
    {
      pollingInterval: 3000,
      skip: !selectedInstId
    }
  );

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const messages = historyResponse?.data || EMPTY_ARRAY;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedInstId) {
      scrollToBottom();
    }
  }, [messages, selectedInstId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgText.trim() || !selectedInstId || isSending) return;

    const currentText = msgText.trim();
    setMsgText(''); // Clear input instantly for zero latency feel

    try {
      await sendMessage({ 
        text: currentText, 
        institutionId: selectedInstId 
      }).unwrap();
      
      refetchHistory();
      scrollToBottom();
    } catch (err) {
      console.error('Failed to send direct message to partner', err);
    }
  };

  if (!mounted) return null;

  return (
    <PortalShell title="Direct Messages" subtitle="Chat directly with your facility providers">
      <div style={{
        height: 'calc(100vh - 180px)',
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: 24,
        background: '#fff',
        border: `1px solid ${C.border}`,
        borderRadius: 24,
        overflow: 'hidden'
      }}
      >
        {/* Left Pane: Partner Queue */}
        <div style={{
          borderRight: `1px solid ${C.border}`,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: 'rgba(240, 242, 248, 0.15)'
        }}
        >
          {/* Header */}
          <div style={{ padding: '24px 20px', borderBottom: `1px solid ${C.border}` }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: C.text, display: 'flex', alignItems: 'center', gap: 8, fontFamily: F.heading }}>
              <ChatBubbleOutlineRounded sx={{ fontSize: 18, color: C.blue }} />
              Partner Channels
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 11, color: C.textSub }}>Direct interactions with lenders & insurers</p>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {appsLoading ? (
              <p style={{ margin: 0, padding: 20, fontSize: 12, color: C.textSub, textAlign: 'center' }}>Syncing channels...</p>
            ) : institutions.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', opacity: 0.6 }}>
                <ChatBubbleOutlineRounded sx={{ fontSize: 24, color: C.textMuted, marginBottom: 1 }} />
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: C.text }}>No partner channels</p>
                <p style={{ margin: '2px 0 0', fontSize: 10, color: C.textSub }}>Channels open automatically when you apply for products.</p>
              </div>
            ) : (
              institutions.map((inst) => {
                const isActive = selectedInstId === inst.id;
                return (
                  <button
                    key={inst.id}
                    onClick={() => {
                      setSelectedInstId(inst.id);
                      setSelectedInstName(inst.name);
                      setSelectedInstLogo(inst.logo);
                    }}
                    style={{
                      width: '100%',
                      padding: '16px 12px',
                      borderRadius: 16,
                      border: 'none',
                      background: isActive ? C.bluePale : 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      transition: '0.2s',
                      outline: 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'rgba(0,0,0,0.02)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: 12, 
                      background: '#fff',
                      border: `1.5px solid ${C.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 6,
                      flexShrink: 0
                    }}>
                      <img src={inst.logo} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {inst.name}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: 10.5, color: C.textSub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        Secure direct channel
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Conversation Workspace */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {selectedInstId ? (
            <>
              {/* Workspace Header */}
              <div style={{
                padding: '20px 24px',
                borderBottom: `1px solid ${C.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.01)'
              }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ 
                    width: 42, 
                    height: 42, 
                    borderRadius: 12, 
                    background: '#fff', 
                    border: `1.5px solid ${C.border}`, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    padding: 6
                  }}>
                    <img src={selectedInstLogo} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: C.text }}>{selectedInstName}</h4>
                    <p style={{ margin: 0, fontSize: 10.5, color: C.emerald, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.emerald, display: 'inline-block' }} />
                      Direct Connection Active
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Timeline */}
              <div style={{ flex: 1, padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, background: '#f8fafc' }}>
                {messages.length === 0 ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: 0.6, padding: '0 20px' }}>
                    <ChatBubbleOutlineRounded sx={{ fontSize: 32, color: C.textMuted, marginBottom: 1 }} />
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: C.text }}>No messages yet</p>
                    <p style={{ margin: '4px 0 0', fontSize: 10.5, color: C.textSub }}>Send a message below to start chatting directly with {selectedInstName}.</p>
                  </div>
                ) : (
                  messages.map((msg: any) => {
                    const isMe = msg.senderRole === 'Customer';
                    return (
                      <div 
                        key={msg._id}
                        style={{
                          alignSelf: isMe ? 'flex-end' : 'flex-start',
                          maxWidth: '70%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isMe ? 'flex-end' : 'flex-start'
                        }}
                      >
                        <span style={{ fontSize: 9.5, fontWeight: 700, color: C.textMuted, marginBottom: 4, padding: '0 6px' }}>
                          {isMe ? 'You' : msg.senderName}
                        </span>
                        <div style={{
                          padding: '12px 16px',
                          borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                          background: isMe ? C.blue : '#fff',
                          color: isMe ? '#fff' : C.text,
                          boxShadow: '0 2px 8px rgba(13,27,62,0.02)',
                          border: isMe ? 'none' : `1px solid ${C.border}`,
                          fontSize: 13,
                          lineHeight: 1.5,
                          wordBreak: 'break-word'
                        }}>
                          {msg.text}
                        </div>
                        <span style={{ fontSize: 9, color: C.textSub, marginTop: 4, padding: '0 6px' }}>
                          {formatMessageTime(msg.createdAt)}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Composer */}
              <form 
                onSubmit={handleSend}
                style={{
                  padding: '20px 24px',
                  borderTop: `1px solid ${C.border}`,
                  background: '#fff',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'center'
                }}
              >
                <input
                  type="text"
                  value={msgText}
                  onChange={(e) => setMsgText(e.target.value)}
                  placeholder={`Ask ${selectedInstName} a question...`}
                  style={{
                    flex: 1,
                    padding: '14px 20px',
                    borderRadius: 16,
                    border: `1px solid ${C.border}`,
                    fontSize: 13,
                    outline: 'none',
                    background: '#f8fafc',
                    color: C.text
                  }}
                />
                <button
                  type="submit"
                  disabled={!msgText.trim() || isSending}
                  style={{
                    padding: '14px 24px',
                    borderRadius: 16,
                    background: msgText.trim() ? C.blue : C.bluePale,
                    color: msgText.trim() ? '#fff' : C.textMuted,
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontWeight: 800,
                    fontSize: 13,
                    cursor: msgText.trim() ? 'pointer' : 'default',
                    transition: '0.2s'
                  }}
                >
                  Send
                  <SendRounded sx={{ fontSize: 14 }} />
                </button>
              </form>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center', opacity: 0.8 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: C.bluePale, color: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <ChatBubbleOutlineRounded sx={{ fontSize: 36 }} />
              </div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: C.text, fontFamily: F.heading }}>Select a Partner Channel</h3>
              <p style={{ margin: '8px 0 0', fontSize: 12.5, color: C.textSub, maxWidth: 380, lineHeight: 1.6 }}>
                Choose an active lender or insurer channel from the left panel to begin discussing terms or asking questions directly with their agents.
              </p>
            </div>
          )}
        </div>
      </div>
    </PortalShell>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: '#9aa5bf' }}>Loading workspace...</div>}>
       <ChatContent />
    </Suspense>
  );
}
