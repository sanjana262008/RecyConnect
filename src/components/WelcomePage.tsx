import React from 'react';
import { Recycle, ArrowRight, ShieldCheck, Factory, RefreshCw, Cpu, CheckCircle } from 'lucide-react';

interface WelcomePageProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onQuickDemoStart: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onOpenLogin,
  onOpenRegister,
  onQuickDemoStart,
}) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-800 text-emerald-100 flex items-center justify-center">
              <Recycle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-slate-900">RecyConnect</span>
                <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                  Demo Mode
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Connect. Recycle. Create Value.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenLogin}
              className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-emerald-800 px-2 sm:px-3 py-1.5 cursor-pointer"
            >
              Login
            </button>
            <button
              type="button"
              onClick={onOpenRegister}
              className="hidden sm:inline-flex text-sm font-semibold bg-emerald-800 text-white hover:bg-emerald-900 px-3.5 py-1.5 rounded transition-colors cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center">
          {/* Logo badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-6">
            <Recycle className="w-3.5 h-3.5" />
            <span>Industrial Plastic Circularity Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            RecyConnect
          </h1>

          <p className="mt-3 text-lg sm:text-xl font-medium text-emerald-800">
            Connect. Recycle. Create Value.
          </p>

          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A simpler way to connect plastic waste suppliers with recyclers.
          </p>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            <button
              type="button"
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <span>Login with Demo OTP</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenRegister}
              className="w-full sm:w-auto px-6 py-3 border border-slate-300 hover:border-slate-400 bg-white text-slate-800 rounded font-semibold text-sm transition-colors cursor-pointer"
            >
              Create Account
            </button>
          </div>

          {/* Quick Demo Helper */}
          <div className="mt-4">
            <button
              type="button"
              onClick={onQuickDemoStart}
              className="text-xs text-emerald-800 hover:text-emerald-950 font-medium underline underline-offset-4 cursor-pointer"
            >
              Quick Test: Enter preloaded demo session (+91 9876543210)
            </button>
          </div>

          {/* Core Feature Cards */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-5 rounded-lg border border-slate-200 bg-slate-50/50">
              <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <Factory className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">For Industries (Suppliers)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                List post-industrial plastics (PET, HDPE, LDPE, PP, PVC, ABS). Track listings, field direct buyer enquiries, and manage scheduled collections.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-slate-200 bg-slate-50/50">
              <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <RefreshCw className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">For Recyclers (Buyers)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Search verified available waste streams with explicit grades and quantities. Direct negotiations with transparent material subtotals.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-slate-200 bg-slate-50/50">
              <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Smart Batch Matching</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rule-based algorithm aggregates compatible quantities across regional suppliers to satisfy high-volume requirements without mixing incompatible polymers.
              </p>
            </div>
          </div>

          {/* Transparency statement */}
          <div className="mt-12 p-4 rounded border border-slate-200 bg-white text-xs text-slate-500 max-w-xl mx-auto flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              Zero mock AI claims • Deterministic rule-based batching • Fully functional localStorage demo
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 bg-slate-50 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Recycle className="w-4 h-4 text-emerald-800" />
            <span className="font-semibold text-slate-700">RecyConnect</span>
            <span>— Connect. Recycle. Create Value.</span>
          </div>
          <div>
            Demo Mode Prototype — No real SMS verification required.
          </div>
        </div>
      </footer>
    </div>
  );
};
