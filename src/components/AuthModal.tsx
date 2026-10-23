import React, { useState } from 'react';
import { Recycle, ArrowLeft, CheckCircle2, AlertCircle, Phone, Lock, Building, MapPin, User } from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  existingUser: UserProfile | null;
  initialMode?: 'login' | 'register';
}

const DEMO_COUNTRY_CODE = '+91';
const DEMO_PHONE_NUMBER = '9876543210';
const DEMO_OTP = '123456';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  existingUser,
  initialMode = 'login',
}) => {
  // Steps: 'phone' -> 'otp' -> 'register' (if new user)
  const [step, setStep] = useState<'phone' | 'otp' | 'register'>('phone');
  const [countryCode, setCountryCode] = useState(DEMO_COUNTRY_CODE);
  const [phoneNumber, setPhoneNumber] = useState(DEMO_PHONE_NUMBER);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resendNotice, setResendNotice] = useState<string | null>(null);

  // Registration state
  const [fullName, setFullName] = useState(existingUser?.fullName || 'Rajesh Sharma');
  const [orgName, setOrgName] = useState(existingUser?.organizationName || 'EcoApex Industries Pvt Ltd');
  const [role, setRole] = useState<UserRole>(existingUser?.role || 'Industry');
  const [city, setCity] = useState(existingUser?.city || 'Pune');
  const [state, setState] = useState(existingUser?.state || 'Maharashtra');

  if (!isOpen) return null;

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResendNotice(null);

    const cleanPhone = phoneNumber.trim().replace(/\D/g, '');
    if (!cleanPhone) {
      setError('Please enter a valid phone number.');
      return;
    }

    if (countryCode !== DEMO_COUNTRY_CODE || cleanPhone !== DEMO_PHONE_NUMBER) {
      setError(`Access restricted in Demo Mode. Please enter demo phone number: ${DEMO_COUNTRY_CODE} ${DEMO_PHONE_NUMBER}`);
      return;
    }

    setStep('otp');
    setOtp('');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResendNotice(null);

    const cleanPhone = phoneNumber.trim().replace(/\D/g, '');
    const cleanOtp = otp.trim();

    if (cleanPhone !== DEMO_PHONE_NUMBER || countryCode !== DEMO_COUNTRY_CODE) {
      setError('Invalid phone number for demo verification.');
      return;
    }

    if (cleanOtp !== DEMO_OTP) {
      setError('Invalid verification code. Enter the demo OTP: 123456');
      return;
    }

    // Verified!
    if (existingUser) {
      onLoginSuccess(existingUser);
      onClose();
    } else {
      // Prompt registration if no profile exists yet
      setStep('register');
    }
  };

  const handleResendOtp = () => {
    setError(null);
    setResendNotice('Demo OTP: 123456. No SMS was sent.');
    setOtp('');
  };

  const handleChangePhoneNumber = () => {
    setError(null);
    setResendNotice(null);
    setStep('phone');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !orgName.trim() || !city.trim() || !state.trim()) {
      setError('Please fill in all registration fields.');
      return;
    }

    const newUser: UserProfile = {
      fullName: fullName.trim(),
      phone: `${countryCode} ${phoneNumber.trim()}`,
      organizationName: orgName.trim(),
      role,
      city: city.trim(),
      state: state.trim(),
      registeredAt: new Date().toISOString(),
    };

    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-slate-200 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Brand header */}
        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded bg-emerald-800 text-white flex items-center justify-center">
            <Recycle className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">RecyConnect</h2>
            <p className="text-xs text-slate-500">Connect. Recycle. Create Value.</p>
          </div>
        </div>

        {/* Demo Mode Notice */}
        <div className="bg-emerald-50 border border-emerald-200 rounded p-3 mb-5 text-xs text-emerald-900 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Demo Mode — No real SMS verification</p>
            <p className="text-emerald-800 mt-0.5">
              Use <span className="font-mono font-bold">+91 9876543210</span> and OTP <span className="font-mono font-bold">123456</span>.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 text-xs text-red-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {/* Step 1: Phone number entry */}
        {step === 'phone' && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label htmlFor="country-code" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Mobile Number
              </label>
              <div className="flex gap-2">
                <select
                  id="country-code"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-24 px-2.5 py-2 border border-slate-300 rounded text-sm bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800"
                >
                  <option value="+91">+91 (IN)</option>
                  <option value="+1">+1 (US)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+971">+971 (AE)</option>
                </select>
                <div className="relative flex-1">
                  <input
                    id="phone-number"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="9876543210"
                    maxLength={14}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800"
                    autoFocus
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Pre-filled with demo phone number. Click below to continue.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-sm font-semibold transition-colors cursor-pointer"
            >
              Get Verification Code
            </button>
          </form>
        )}

        {/* Step 2: OTP verification */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs text-slate-700">
              <p className="font-semibold text-emerald-800">
                Demo OTP: 123456. No SMS was sent.
              </p>
              <p className="text-slate-500 mt-0.5">
                Target phone: <span className="font-mono text-slate-800 font-semibold">{countryCode} {phoneNumber}</span>
              </p>
            </div>

            {resendNotice && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded text-xs">
                {resendNotice}
              </div>
            )}

            <div>
              <label htmlFor="otp-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                6-Digit Verification Code
              </label>
              <div className="relative">
                <input
                  id="otp-input"
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 123456"
                  className="w-full px-3 py-2.5 text-center tracking-widest text-lg font-mono font-semibold border border-slate-300 rounded text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800"
                  autoFocus
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-sm font-semibold transition-colors cursor-pointer"
            >
              Verify & Enter
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-emerald-800 hover:text-emerald-950 font-semibold cursor-pointer underline underline-offset-2"
              >
                Resend Code
              </button>
              <button
                type="button"
                onClick={handleChangePhoneNumber}
                className="text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Change phone number
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Registration for new profile */}
        {step === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Complete Your Account Profile</h3>
              <p className="text-xs text-slate-500">Provide company details to finish registration.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900"
                  placeholder="e.g. Rajesh Sharma"
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Organization / Company Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900"
                  placeholder="e.g. EcoApex Industries Pvt Ltd"
                />
                <Building className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('Industry')}
                  className={`py-2 px-3 border rounded text-xs font-semibold text-left cursor-pointer flex items-center justify-between ${
                    role === 'Industry'
                      ? 'border-emerald-800 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>Industry (Seller)</span>
                  {role === 'Industry' && <CheckCircle2 className="w-4 h-4 text-emerald-800" />}
                </button>
                <button
                  type="button"
                  onClick={() => setRole('Recycler')}
                  className={`py-2 px-3 border rounded text-xs font-semibold text-left cursor-pointer flex items-center justify-between ${
                    role === 'Recycler'
                      ? 'border-emerald-800 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>Recycler (Buyer)</span>
                  {role === 'Recycler' && <CheckCircle2 className="w-4 h-4 text-emerald-800" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900"
                    placeholder="e.g. Pune"
                  />
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900"
                  placeholder="e.g. Maharashtra"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-sm font-semibold transition-colors cursor-pointer"
            >
              Save Profile & Enter
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
