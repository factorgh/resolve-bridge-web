'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SupportAgentRounded, 
  SendRounded, 
  ChatBubbleOutlineRounded, 
  AlternateEmailRounded,
  MarkChatReadRounded,
  AccountCircleRounded
} from '@mui/icons-material';
import AdminShell, { C, F } from '../components/AdminShell';
import { 
  useGetAdminConversationsQuery, 
  useGetChatHistoryQuery, 
  useSendMessageMutation 
} from '@/lib/redux/api/chatApi';
import { useAdminGetUsersQuery } from '@/lib/redux/api/userApi';

function SupportDeskContent() {
  const [mounted, setMounted] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState<string>('');
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const searchParams = useSearchParams();

  useEffect(() => {
    const customerId = searchParams.get('customerId');
    const customerName = searchParams.get('customerName');
    if (customerId) {
      setSelectedCustomerId(customerId);
      if (customerName) {
        setSelectedCustomerName(decodeURIComponent(customerName));
      }
    }
  }, [searchParams]);

  // User search query for initiating support threads
  const { data: searchResults, isLoading: isSearching } = useAdminGetUsersQuery(searchQuery, {
    skip: !searchQuery.trim()
  });

  // Poll conversation list every 3 seconds to capture incoming chat sessions!
  const { data: conversationsResponse, refetch: refetchConversations } = useGetAdminConversationsQuery(undefined, {
    pollingInterval: 3000
  });
  
  // Poll selected history every 3 seconds to capture live customer replies!
  const { data: historyResponse, refetch: refetchHistory } = useGetChatHistoryQuery(selectedCustomerId || '', {
    pollingInterval: 3000,
    skip: !selectedCustomerId
  });

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  const conversations = conversationsResponse?.data || [];
  const messages = historyResponse?.data || [];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedCustomerId) {
      scrollToBottom();
    }
  }, [messages, selectedCustomerId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedCustomerId || isSending) return;

    const currentText = replyText.trim();
    setReplyText(''); // Clear input instantly to ensure instantaneous responsiveness

    try {
      await sendMessage({ 
        text: currentText, 
        recipientId: selectedCustomerId 
      }).unwrap();
      
      refetchHistory();
      refetchConversations();
      scrollToBottom();
    } catch (err) {
      console.error('Failed to dispatch support reply', err);
    }
  };

  if (!mounted) return null;

  return (
    <AdminShell title="Support Desk" subtitle="Instant multi-tenant customer compliance support">
      <div style={{
        height: 'calc(100vh - 180px)',
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: 24,
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 24,
        overflow: 'hidden'
      }}
      >
        {/* Left Pane: Conversation Queue */}
        <div style={{
          borderRight: `1px solid ${C.border}`,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: 'rgba(255,255,255,0.01)'
        }}
        >
          {/* Header */}
          <div style={{ padding: '24px 20px', borderBottom: `1px solid ${C.border}` }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: C.text, display: 'flex', alignItems: 'center', gap: 8 }}>
              <SupportAgentRounded sx={{ fontSize: 18, color: C.blueLight }} />
              Active Channels
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 11, color: C.textMuted }}>Select a customer thread to reply</p>
          </div>

          {/* Search Bar */}
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}`, position: 'relative' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customers to message..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 12,
                border: `1px solid ${C.border}`,
                background: 'rgba(0,0,0,0.02)',
                color: C.text,
                fontSize: 12,
                outline: 'none',
              }}
            />
            {searchQuery.trim().length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 16,
                right: 16,
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                zIndex: 10,
                maxHeight: 250,
                overflowY: 'auto',
                padding: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}>
                {isSearching ? (
                  <p style={{ margin: 0, padding: 12, fontSize: 11.5, color: C.textMuted, textAlign: 'center' }}>Searching customers...</p>
                ) : searchResults && searchResults.data && searchResults.data.length > 0 ? (
                  searchResults.data.map((usr: any) => (
                    <button
                      key={usr.id}
                      onClick={() => {
                        setSelectedCustomerId(usr.id);
                        setSelectedCustomerName(`${usr.firstName} ${usr.lastName}`);
                        setSearchQuery('');
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: 'none',
                        background: 'transparent',
                        borderRadius: 8,
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: '0.2s',
                        outline: 'none'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = C.bluePale}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>
                        {usr.firstName} {usr.lastName}
                      </span>
                      <span style={{ fontSize: 10, color: C.textMuted }}>
                        {usr.email}
                      </span>
                    </button>
                  ))
                ) : (
                  <p style={{ margin: 0, padding: 12, fontSize: 11.5, color: C.textMuted, textAlign: 'center' }}>No matching applicants found</p>
                )}
              </div>
            )}
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {conversations.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', opacity: 0.6 }}>
                <ChatBubbleOutlineRounded sx={{ fontSize: 24, color: C.textMuted, marginBottom: 1 }} />
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: C.text }}>No support channels active</p>
                <p style={{ margin: '2px 0 0', fontSize: 10, color: C.textMuted }}>Customer sessions will appear here in real-time.</p>
              </div>
            ) : (
              conversations.map((c) => {
                const isActive = selectedCustomerId === c.customerId;
                return (
                  <button
                    key={c.customerId}
                    onClick={() => {
                      setSelectedCustomerId(c.customerId);
                      setSelectedCustomerName(c.customerName);
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
                  >
                    <div style={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: 12, 
                      background: isActive ? C.blueLight : C.border, 
                      color: isActive ? '#fff' : C.textSub,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 14,
                      flexShrink: 0
                    }}>
                      {c.customerName.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.customerName}
                        </p>
                        {c.unreadCount > 0 && (
                          <span style={{ 
                            background: '#ef4444', 
                            color: '#fff', 
                            fontSize: 9, 
                            fontWeight: 900, 
                            padding: '2px 6px', 
                            borderRadius: 10,
                            flexShrink: 0
                          }}>
                            {c.unreadCount} new
                          </span>
                        )}
                      </div>
                      <p style={{ margin: 0, fontSize: 11, color: C.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.latestMessage}
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
          {selectedCustomerId ? (
            <>
              {/* Active Workspace Header */}
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
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: C.bluePale, color: C.blueLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AccountCircleRounded sx={{ fontSize: 22 }} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: C.text }}>{selectedCustomerName}</h4>
                    <p style={{ margin: 0, fontSize: 10.5, color: C.emerald, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.emerald, display: 'inline-block' }} />
                      Direct Support Channel Active
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MarkChatReadRounded sx={{ fontSize: 14, color: C.emerald }} />
                    Auto-synced
                  </span>
                </div>
              </div>

              {/* Message Timeline */}
              <div style={{ flex: 1, padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, background: 'rgba(0,0,0,0.01)' }}>
                {messages.map((msg: any) => {
                  const isMe = msg.senderRole !== 'Customer';
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
                        {isMe ? `${msg.senderName} (You)` : msg.senderName}
                      </span>
                      <div style={{
                        padding: '12px 16px',
                        borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background: isMe ? C.text : C.bluePale,
                        color: isMe ? '#fff' : C.text,
                        boxShadow: '0 2px 8px rgba(13,27,62,0.02)',
                        border: isMe ? 'none' : `1px solid ${C.border}`,
                        fontSize: 13,
                        lineHeight: 1.5,
                        wordBreak: 'break-word'
                      }}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Composer Form */}
              <form 
                onSubmit={handleSendReply}
                style={{
                  padding: '20px 24px',
                  borderTop: `1px solid ${C.border}`,
                  background: C.surface,
                  display: 'flex',
                  gap: 12,
                  alignItems: 'center'
                }}
              >
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Type an instant compliance reply to ${selectedCustomerName}...`}
                  style={{
                    flex: 1,
                    padding: '14px 20px',
                    borderRadius: 16,
                    border: `1px solid ${C.border}`,
                    fontSize: 13,
                    outline: 'none',
                    background: 'rgba(0,0,0,0.01)',
                    color: C.text
                  }}
                />
                <button
                  type="submit"
                  disabled={!replyText.trim() || isSending}
                  style={{
                    padding: '14px 24px',
                    borderRadius: 16,
                    background: replyText.trim() ? C.blue : C.border,
                    color: replyText.trim() ? '#fff' : C.textMuted,
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontWeight: 800,
                    fontSize: 13,
                    cursor: replyText.trim() ? 'pointer' : 'default',
                    transition: '0.2s'
                  }}
                >
                  Send Reply
                  <SendRounded sx={{ fontSize: 14 }} />
                </button>
              </form>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center', opacity: 0.8 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: C.bluePale, color: C.blueLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <SupportAgentRounded sx={{ fontSize: 36 }} />
              </div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: C.text, fontFamily: F.heading }}>Resolve Admin Support Console</h3>
              <p style={{ margin: '8px 0 0', fontSize: 12.5, color: C.textSub, maxWidth: 380, lineHeight: 1.6 }}>
                Select an active customer support channel from the left queue to view historical logs, review compliance signals, and resolve user requests instantly.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

export default function AdminSupportPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: '#9aa5bf' }}>Loading workspace...</div>}>
       <SupportDeskContent />
    </Suspense>
  );
}
