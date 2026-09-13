'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Smartphone,
  Download,
  X,
  CheckCircle2,
  Bell,
  Truck,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  PlusCircle,
  Share,
} from 'lucide-react';

interface ApkDownloadModalProps {
  autoShow?: boolean;
}

export default function ApkDownloadModal({ autoShow = true }: ApkDownloadModalProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isIos, setIsIos] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setIsIos(true);
    }

    // Capture beforeinstallprompt event for 1-click home screen install
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (autoShow) {
      const dismissed = localStorage.getItem('nabrijan_app_shortcut_dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, [autoShow]);

  const handleDismiss = () => {
    localStorage.setItem('nabrijan_app_shortcut_dismissed', 'true');
    setIsOpen(false);
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
          setIsOpen(false);
        }
        setDeferredPrompt(null);
      } catch (err) {
        setShowGuide(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      {/* Floating Quick Install Shortcut Button on Dashboard */}
      <button
        onClick={() => {
          setShowGuide(false);
          setIsOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 flex items-center space-x-2 bg-[#55B510] hover:bg-[#489d0d] text-white font-extrabold text-xs px-4 py-3 rounded-full shadow-xl shadow-[#55B510]/40 transition transform hover:scale-105 border border-white/20"
      >
        <Smartphone className="w-4 h-4 text-white animate-bounce" />
        <span>📲 অ্যাপ ইনস্টল করুন</span>
      </button>

      {/* Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#063B2A]/80 backdrop-blur-md animate-in fade-in duration-200">
          <Card className="w-full max-w-lg bg-white border-2 border-[#55B510] text-[#17221D] shadow-2xl rounded-3xl overflow-hidden relative">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#DCE7DF] flex items-start justify-between relative bg-gradient-to-r from-[#EAF7DF] to-white">
              <div className="flex items-center space-x-4">
                <img src="/images/logo.png" alt="Nabrijan App" className="h-12 w-auto object-contain shrink-0" />
                <div>
                  <Badge className="bg-[#55B510] text-white border-0 mb-1 text-[10px] uppercase tracking-wider font-extrabold">
                    Official Web App Shortcut
                  </Badge>
                  <h3 className="text-xl font-black text-[#063B2A] leading-tight">
                    নাব্রিজান অ্যাপ ইনস্টল করুন
                  </h3>
                  <p className="text-xs text-[#66736C] mt-0.5">
                    ১-ক্লিকে মোবাইলের হোমস্ক্রিনে শর্টকাট অ্যাপ হিসেবে যুক্ত করুন
                  </p>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="text-[#66736C] hover:text-[#063B2A] bg-white border border-[#DCE7DF] hover:bg-[#EAF7DF] p-2 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F6FAF4] p-3.5 rounded-2xl border border-[#DCE7DF] space-y-1.5">
                  <Bell className="w-5 h-5 text-[#55B510]" />
                  <div className="font-bold text-[#063B2A] text-xs">ইনস্ট্যান্ট নোটিফিকেশন</div>
                  <div className="text-[11px] text-[#66736C]">নতুন অর্ডার আসা মাত্র মোবাইলে সাউন্ড অ্যালার্ট।</div>
                </div>

                <div className="bg-[#F6FAF4] p-3.5 rounded-2xl border border-[#DCE7DF] space-y-1.5">
                  <Truck className="w-5 h-5 text-[#55B510]" />
                  <div className="font-bold text-[#063B2A] text-xs">১-ক্লিক কুরিয়ার বুকিং</div>
                  <div className="text-[11px] text-[#66736C]">ড্যাশবোর্ড থেকে পাঠাও ও স্টিডফাস্ট কুরিয়ার বুক করুন।</div>
                </div>

                <div className="bg-[#F6FAF4] p-3.5 rounded-2xl border border-[#DCE7DF] space-y-1.5">
                  <TrendingUp className="w-5 h-5 text-[#55B510]" />
                  <div className="font-bold text-[#063B2A] text-xs">নিট প্রফিট ট্র্যাকার</div>
                  <div className="text-[11px] text-[#66736C]">প্রতিদিনের আসল বিক্রয় ও লাভ লাইভ দেখুন।</div>
                </div>

                <div className="bg-[#F6FAF4] p-3.5 rounded-2xl border border-[#DCE7DF] space-y-1.5">
                  <ShieldCheck className="w-5 h-5 text-[#55B510]" />
                  <div className="font-bold text-[#063B2A] text-xs">হোমস্ক্রিন অ্যাপ আইকন</div>
                  <div className="text-[11px] text-[#66736C]">প্লেস্টোর ছাড়াই অ্যাপের মত ১-ক্লিকে ওপেন করার সুবিধা।</div>
                </div>
              </div>

              {showGuide && (
                <div className="bg-[#EAF7DF] border-2 border-[#55B510] p-4 rounded-2xl space-y-2 text-xs text-[#063B2A] animate-in fade-in">
                  <div className="font-extrabold text-sm flex items-center gap-1.5 text-[#063B2A]">
                    <CheckCircle2 className="w-4 h-4 text-[#55B510]" /> ইনস্টল করার সহজ ২ ধাপ:
                  </div>
                  {isIos ? (
                    <ol className="list-decimal list-inside space-y-1 text-xs text-[#17221D]">
                      <li>ব্রাউজারের <strong>Share (􀈂)</strong> আইকনে চাপ দিন।</li>
                      <li><strong>Add to Home Screen (হোম স্ক্রিনে যোগ করুন)</strong> নির্বাচন করুন।</li>
                    </ol>
                  ) : (
                    <ol className="list-decimal list-inside space-y-1 text-xs text-[#17221D]">
                      <li>ব্রাউজারের উপরে ডানে <strong>৩-ডট (⋮)</strong> মেনুতে চাপ দিন।</li>
                      <li><strong>Add to Home Screen (হোম স্ক্রিনে যোগ করুন)</strong> বা <strong>Install App</strong> এ চাপ দিন।</li>
                    </ol>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-[#DCE7DF] bg-[#F6FAF4] flex flex-col sm:flex-row items-center gap-3">
              <Button
                onClick={handleInstallClick}
                className="w-full sm:flex-1 h-12 bg-[#55B510] hover:bg-[#489d0d] text-white font-black text-sm rounded-2xl shadow-lg shadow-[#55B510]/30 transition transform hover:scale-[1.02]"
              >
                <PlusCircle className="w-5 h-5 mr-2" /> 📲 হোমস্ক্রিনে অ্যাপ ইনস্টল করুন
              </Button>
              <Button
                variant="outline"
                onClick={handleDismiss}
                className="w-full sm:w-auto h-12 border-[#DCE7DF] bg-white hover:bg-[#EAF7DF] text-[#063B2A] font-bold text-xs rounded-2xl px-5"
              >
                পরে করবো
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
