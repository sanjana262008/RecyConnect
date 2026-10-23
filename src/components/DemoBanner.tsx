import React, { useState } from 'react';
import { Info, X, RotateCcw } from 'lucide-react';

interface DemoBannerProps {
  onResetDemo: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onResetDemo }) => {
  const [showModal, setShowModal] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <>
      <div className="bg-emerald-950 text-emerald-100 px-4 py-1.5 text-xs flex items-center justify-between border-b border-emerald-900">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-800 text-emerald-100 border border-emerald-700">
            Demo Mode
          </span>
          <span className="hidden sm:inline text-emerald-200">
            Local browser prototype — data is stored strictly in your browser's localStorage.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="text-emerald-200 hover:text-white underline underline-offset-2 flex items-center gap-1 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Demo Details</span>
          </button>
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="text-emerald-300 hover:text-white flex items-center gap-1 cursor-pointer bg-emerald-900/60 hover:bg-emerald-900 px-2 py-0.5 rounded border border-emerald-700"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Demo Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-slate-200 p-6 text-slate-800 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-md"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 rounded">
                Prototype Demonstration
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">RecyConnect Demo Architecture</h3>
            <div className="space-y-3 text-sm text-slate-600">
              <p>
                This application is an interactive client-side prototype. It runs entirely inside your browser without external servers or SMS gateways.
              </p>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded text-xs space-y-1.5">
                <p className="font-semibold text-slate-800">Preconfigured Demo Credentials:</p>
                <p>• Country Code: <span className="font-mono text-emerald-700 font-semibold">+91</span></p>
                <p>• Phone Number: <span className="font-mono text-emerald-700 font-semibold">9876543210</span></p>
                <p>• Verification Code (OTP): <span className="font-mono text-emerald-700 font-semibold">123456</span></p>
              </div>
              <p className="text-xs text-slate-500">
                Any modifications (new waste listings, edited prices, submitted enquiries, collection progress) are saved to your browser’s localStorage and remain after refresh.
              </p>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-emerald-800 text-white rounded text-sm font-medium hover:bg-emerald-900 cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {confirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full border border-slate-200 p-6 text-slate-800">
            <h3 className="text-base font-bold text-slate-900 mb-2">Reset Demo Data?</h3>
            <p className="text-sm text-slate-600 mb-5">
              This will restore all preloaded fictional plastic waste listings, sample enquiries, and reset demo user state to defaults.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-3.5 py-1.5 rounded border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmReset(false);
                  onResetDemo();
                }}
                className="px-3.5 py-1.5 rounded bg-red-700 text-white text-sm font-medium hover:bg-red-800 cursor-pointer"
              >
                Yes, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
