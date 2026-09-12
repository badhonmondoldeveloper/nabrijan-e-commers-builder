'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Search,
  User,
  Phone,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Session {
  id: string;
  sessionId: string;
  visitorName: string;
  visitorPhone?: string;
  visitorEmail?: string;
  status: string;
  unreadAdmin: boolean;
  lastMessage?: string;
  updatedAt: string;
  createdAt: string;
}

interface Message {
  id: string;
  senderType: 'VISITOR' | 'ADMIN' | 'SYSTEM';
  senderName: string;
  message: string;
  createdAt: string;
}

export default function AdminLiveChatPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch all chat sessions
  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/admin/chat/sessions');
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
        if (data.sessions && data.sessions.length > 0 && !activeSessionId) {
          setActiveSessionId(data.sessions[0].sessionId);
          setActiveSession(data.sessions[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  };

  // Poll sessions list every 4 seconds
  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 4000);
    return () => clearInterval(interval);
  }, []);

  // Fetch active session messages
  const fetchMessages = async (sid: string) => {
    try {
      const res = await fetch(`/api/chat/messages?sessionId=${sid}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  useEffect(() => {
    if (activeSessionId) {
      fetchMessages(activeSessionId);
      const interval = setInterval(() => fetchMessages(activeSessionId), 3000);
      return () => clearInterval(interval);
    }
  }, [activeSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectSession = (s: Session) => {
    setActiveSessionId(s.sessionId);
    setActiveSession(s);
    fetchMessages(s.sessionId);
  };

  const handleSendReply = async (presetText?: string) => {
    const text = presetText || replyText;
    if (!text.trim() || !activeSessionId) return;

    setReplyText('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/chat/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: activeSessionId,
          message: text,
          status: 'ACTIVE',
        }),
      });

      if (res.ok) {
        fetchMessages(activeSessionId);
        fetchSessions();
      }
    } catch (err) {
      console.error('Failed to send reply:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!activeSessionId) return;
    try {
      const res = await fetch('/api/admin/chat/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: activeSessionId,
          status: newStatus,
        }),
      });

      if (res.ok) {
        if (activeSession) setActiveSession({ ...activeSession, status: newStatus });
        fetchSessions();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.visitorPhone && s.visitorPhone.includes(searchQuery)) ||
      (s.lastMessage && s.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()));

    if (filterStatus === 'UNREAD') return matchesSearch && s.unreadAdmin;
    if (filterStatus === 'ACTIVE') return matchesSearch && s.status === 'ACTIVE';
    if (filterStatus === 'RESOLVED') return matchesSearch && s.status === 'RESOLVED';
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                Live Support Chat Inbox <Sparkles className="w-4 h-4 text-amber-400" />
              </h1>
              <p className="text-xs text-slate-400">
                সরাসরি ভিজিটর ও মার্চেন্টদের মেসেজের রিয়েল-টাইম উত্তর দিন।
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={fetchSessions}
            variant="outline"
            size="sm"
            className="border-slate-800 bg-slate-900 text-slate-300 hover:text-white text-xs font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin-slow" /> রিফ্রেশ করুন
          </Button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 h-[720px]">
        {/* Left Sidebar: Session List */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-4 flex flex-col shadow-xl">
          {/* Search & Filter */}
          <div className="space-y-3 mb-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="ভিজিটর বা মেসেজ খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center space-x-1.5 overflow-x-auto text-[11px] font-bold">
              {['ALL', 'UNREAD', 'ACTIVE', 'RESOLVED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                    filterStatus === st
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {st === 'ALL' && 'সবগুলো'}
                  {st === 'UNREAD' && 'অপঠিত'}
                  {st === 'ACTIVE' && 'সক্রিয়'}
                  {st === 'RESOLVED' && 'সমাধানকৃত'}
                </button>
              ))}
            </div>
          </div>

          {/* Session Cards */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {filteredSessions.length === 0 ? (
              <div className="text-center text-slate-500 text-xs py-16 space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-600 mx-auto" />
                <p>কোনো সাপোর্ট মেসেজ পাওয়া যায়নি</p>
              </div>
            ) : (
              filteredSessions.map((s) => {
                const isActive = s.sessionId === activeSessionId;
                return (
                  <div
                    key={s.id}
                    onClick={() => handleSelectSession(s)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition border relative ${
                      isActive
                        ? 'bg-blue-600/10 border-blue-500/50 text-white shadow-lg'
                        : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {s.unreadAdmin && (
                      <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
                    )}
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-extrabold text-xs flex items-center gap-1.5 text-white">
                        <User className="w-3.5 h-3.5 text-blue-400" /> {s.visitorName}
                      </h4>
                      <span className="text-[10px] text-slate-500">
                        {new Date(s.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {s.visitorPhone && (
                      <p className="text-[11px] text-slate-400 mb-1 flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-emerald-400" /> {s.visitorPhone}
                      </p>
                    )}

                    <p className="text-[11px] text-slate-400 truncate leading-snug">
                      {s.lastMessage || 'কোনো মেসেজ নেই'}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[10px] font-bold">
                      <span
                        className={`px-2 py-0.5 rounded-md ${
                          s.status === 'RESOLVED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        {s.status}
                      </span>
                      {s.unreadAdmin && (
                        <span className="text-rose-400 font-extrabold">● নতুন মেসেজ</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Area: Active Chat Window */}
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-3xl flex flex-col overflow-hidden shadow-xl">
          {activeSession ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black">
                    {activeSession.visitorName[0] || 'V'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                      {activeSession.visitorName}
                      {activeSession.visitorPhone && (
                        <span className="text-xs text-emerald-400 font-mono font-normal">
                          ({activeSession.visitorPhone})
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-slate-400">Session ID: {activeSession.sessionId}</p>
                  </div>
                </div>

                {/* Status Action Buttons */}
                <div className="flex items-center space-x-2">
                  {activeSession.status !== 'RESOLVED' ? (
                    <Button
                      onClick={() => handleStatusChange('RESOLVED')}
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-xl"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> সমাধানকৃত
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleStatusChange('ACTIVE')}
                      size="sm"
                      variant="outline"
                      className="border-slate-800 bg-slate-900 text-slate-300 hover:text-white text-xs font-bold px-3 py-1 rounded-xl"
                    >
                      পুনরায় খুলুন
                    </Button>
                  )}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-950/60">
                {messages.length === 0 ? (
                  <div className="text-center text-slate-500 text-xs py-20">
                    মেসেজ লোড হচ্ছে...
                  </div>
                ) : (
                  messages.map((m) => {
                    const isAdmin = m.senderType === 'ADMIN';
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                      >
                        <span className="text-[10px] text-slate-500 mb-1 px-1 font-bold">
                          {isAdmin ? 'Nabrijan Super Admin' : m.senderName} •{' '}
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div
                          className={`max-w-[75%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                            isAdmin
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none shadow-lg'
                              : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-bl-none shadow-md'
                          }`}
                        >
                          {m.message}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Presets */}
              <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center space-x-2 overflow-x-auto text-[11px]">
                <span className="text-slate-500 font-bold shrink-0">দ্রুত রিপ্লাই:</span>
                <button
                  onClick={() => handleSendReply('হ্যালো! Nabrijan সাপোর্টে আপনাকে স্বাগতম। কীভাবে সাহায্য করতে পারি?')}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-3 py-1 rounded-xl shrink-0 transition"
                >
                  👋 স্বাগতম জানান
                </button>
                <button
                  onClick={() => handleSendReply('আমাদের ৩ দিনের ফ্রি ট্রায়াল সম্পূর্ণ ফ্রিতে ব্যবহার করতে পারেন। কোনো ক্রেডিট কার্ড লাগবে না।')}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-3 py-1 rounded-xl shrink-0 transition"
                >
                  🎁 ফ্রি ট্রায়াল তথ্য
                </button>
                <button
                  onClick={() => handleSendReply('আপনি মার্চেন্ট প্যানেল থেকে পাঠাও ও স্টিডফাস্ট কুরিয়ারের API Key বসিয়ে ১-ক্লিকে শিপিং ইন্টিগ্রেশন করতে পারবেন।')}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-3 py-1 rounded-xl shrink-0 transition"
                >
                  🚚 কুরিয়ার গাইড
                </button>
              </div>

              {/* Reply Input Bar */}
              <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="উত্তর লিখুন..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <Button
                  disabled={loading || !replyText.trim()}
                  onClick={() => handleSendReply()}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg"
                >
                  পাঠান <Send className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs space-y-3">
              <MessageSquare className="w-12 h-12 text-slate-700 animate-pulse" />
              <p>বামপাশের লিস্ট থেকে যেকোনো একটি চ্যাট সিলেক্ট করুন</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
