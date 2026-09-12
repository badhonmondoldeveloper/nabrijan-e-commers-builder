'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User, Phone, Sparkles, CheckCircle2, Bot, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  senderType: 'VISITOR' | 'ADMIN' | 'SYSTEM';
  senderName: string;
  message: string;
  createdAt: string;
}

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [visitorName, setVisitorName] = useState<string>('');
  const [visitorPhone, setVisitorPhone] = useState<string>('');
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [inputMsg, setInputMsg] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasUnread, setHasUnread] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session ID from localStorage
  useEffect(() => {
    let sid = localStorage.getItem('nabrijan_chat_sid');
    let name = localStorage.getItem('nabrijan_chat_name') || '';
    let phone = localStorage.getItem('nabrijan_chat_phone') || '';

    if (!sid) {
      sid = 'sid_' + Math.random().toString(36).substring(2, 11) + Date.now();
      localStorage.setItem('nabrijan_chat_sid', sid);
    }
    setSessionId(sid);
    if (name) {
      setVisitorName(name);
      setVisitorPhone(phone);
      setIsRegistered(true);
    }
  }, []);

  // Poll messages every 3 seconds when session exists
  useEffect(() => {
    if (!sessionId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat/messages?sessionId=${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
          if (data.session?.unreadUser) {
            setHasUnread(true);
          }
        }
      } catch (err) {
        console.error('Error fetching chat messages:', err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [sessionId]);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) return;

    localStorage.setItem('nabrijan_chat_name', visitorName);
    localStorage.setItem('nabrijan_chat_phone', visitorPhone);
    setIsRegistered(true);

    // Send initial greeting message automatically
    sendMessage(`হ্যালো, আমি ${visitorName}। সাহায্য প্রয়োজন।`);
  };

  const sendMessage = async (msgText?: string) => {
    const textToSend = msgText || inputMsg;
    if (!textToSend.trim() || !sessionId) return;

    setInputMsg('');
    setLoading(true);

    // Optimistic UI update
    const tempMsg: Message = {
      id: 'temp_' + Date.now(),
      senderType: 'VISITOR',
      senderName: visitorName || 'আপনি',
      message: textToSend,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          visitorName: visitorName || 'Guest User',
          visitorPhone,
          message: textToSend,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        // Refresh full message list
        const mRes = await fetch(`/api/chat/messages?sessionId=${sessionId}`);
        if (mRes.ok) {
          const mData = await mRes.json();
          setMessages(mData.messages || []);
        }
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (qText: string) => {
    if (!isRegistered) {
      setVisitorName('সম্মানিত ভিজিটর');
      setIsRegistered(true);
    }
    sendMessage(qText);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Floating Widget Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white p-4 rounded-full shadow-2xl shadow-blue-600/40 flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95"
          aria-label="Live Chat"
        >
          <MessageSquare className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900"></span>
          </span>
          {hasUnread && (
            <span className="absolute -top-2 -left-2 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce shadow-md">
              নতুন মেসেজ
            </span>
          )}
          <span className="hidden group-hover:block absolute right-16 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xl border border-slate-800">
            💬 লাইভ সাপোর্টে চ্যাট করুন
          </span>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-slate-950/95 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 p-4 text-white flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <Bot className="w-6 h-6 text-amber-300" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>
              </div>
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                  Nabrijan Live Support <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </h3>
                <p className="text-[11px] text-blue-100 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> সরাসরি অ্যাডমিনের সাথে সংযুক্ত
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-full transition text-slate-200 hover:text-white"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          {!isRegistered ? (
            <div className="flex-1 p-6 flex flex-col justify-between bg-slate-950">
              <div className="space-y-4 text-center">
                <div className="w-14 h-14 bg-blue-600/10 rounded-3xl border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
                  <User className="w-7 h-7" />
                </div>
                <h4 className="font-extrabold text-lg text-white">স্বাগতম Nabrijan সাপোর্টে!</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  আপনার নাম ও ফোন নম্বর দিয়ে সরাসরি আমাদের কাস্টমার সাপোর্ট টিমের সাথে চ্যাট শুরু করুন।
                </p>
              </div>

              <form onSubmit={handleStartChat} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">আপনার নাম *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: তানভীর আহমেদ"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">মোবাইল নম্বর (ঐচ্ছিক)</label>
                  <input
                    type="tel"
                    placeholder="01712XXXXXX"
                    value={visitorPhone}
                    onChange={(e) => setVisitorPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg shadow-blue-600/30"
                >
                  চ্যাট শুরু করুন <Send className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </form>

              {/* Quick Questions */}
              <div className="pt-2 border-t border-slate-900">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2 text-center">দ্রুত প্রশ্নাবলী</span>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  <button
                    onClick={() => handleQuickQuestion('প্যাকেজের দাম কত এবং কি কি সুবিধা আছে?')}
                    className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800 transition"
                  >
                    💡 প্যাকেজের মূল্য?
                  </button>
                  <button
                    onClick={() => handleQuickQuestion('কীভাবে নিজের ই-কমার্স শপ ডোমেইন কানেক্ট করব?')}
                    className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800 transition"
                  >
                    🌐 কাস্টম ডোমেইন?
                  </button>
                  <button
                    onClick={() => handleQuickQuestion('পাঠাও বা স্টিডফাস্ট কুরিয়ার কীভাবে যুক্ত করব?')}
                    className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800 transition"
                  >
                    🚚 কুরিয়ার সেটআপ?
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between bg-slate-950 overflow-hidden">
              {/* Message List */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
                {messages.length === 0 ? (
                  <div className="text-center text-slate-500 text-xs py-8 space-y-2">
                    <Bot className="w-8 h-8 text-slate-600 mx-auto animate-bounce" />
                    <p>আপনার কোনো প্রশ্ন থাকলে নিচে লিখুন। অ্যাডমিন খুব দ্রুত উত্তর দিবে!</p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isVisitor = m.senderType === 'VISITOR';
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isVisitor ? 'items-end' : 'items-start'}`}
                      >
                        <span className="text-[10px] text-slate-500 mb-1 px-1 font-bold">
                          {isVisitor ? 'আপনি' : 'Nabrijan Support'} • {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div
                          className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                            isVisitor
                              ? 'bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-600/20'
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

              {/* Input Bar */}
              <div className="p-3 bg-slate-900/90 border-t border-slate-800/80 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="আপনার মেসেজ লিখুন..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <Button
                  disabled={loading || !inputMsg.trim()}
                  onClick={() => sendMessage()}
                  size="icon"
                  className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-9 w-9 shrink-0 shadow-md"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
