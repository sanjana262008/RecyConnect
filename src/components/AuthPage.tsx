import React, { useState } from 'react';
import { Recycle, ArrowLeft, AlertCircle, Phone, Lock, Building, MapPin, User, CheckCircle2 } from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface AuthPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  existingUser: UserProfile | null;
}

const DEMO_COUNTRY_CODE = '+91';
const DEMO_PHONE_NUMBER = '9876543210';
const DEMO_OTP = '123456';

export const AuthPage: React.FC<AuthPageProps> = ({
  onLoginSuccess,
  existingUser,
}) => {
  // Mode: 'login' | 'register'
  const [mode, setMode] = useState<'login' | 'register'>('login');
  // Sub-step: 'phone' | 'otp' | 'register-details'
  const [step, setStep] = useState<'phone' | 'otp' | 'register-details'>('phone');

  const [countryCode, setCountryCode] = useState(DEMO_COUNTRY_CODE);
  const [phoneNumber, setPhoneNumber] = useState(DEMO_PHONE_NUMBER);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resendNotice, setResendNotice] = useState<string | null>(null);

  // Registration profile fields
  const [fullName, setFullName] = useState(existingUser?.fullName || '');
  const [orgName, setOrgName] = useState(existingUser?.organizationName || '');
  const [role, setRole] = useState<UserRole>(existingUser?.role || 'Industry');
  const [city, setCity] = useState(existingUser?.city || '');
  const [state, setState] = useState(existingUser?.state || '');

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResendNotice(null);

    const cleanPhone = phoneNumber.trim().replace(/\D/g, '');
    if (!cleanPhone) {
      setError('Please enter your mobile phone number.');
      return;
    }

    if (countryCode !== DEMO_COUNTRY_CODE || cleanPhone !== DEMO_PHONE_NUMBER) {
      setError(`Access limited to demo number: ${DEMO_COUNTRY_CODE} ${DEMO_PHONE_NUMBER}`);
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
      setError('Invalid phone number for verification.');
      return;
    }

    if (cleanOtp !== DEMO_OTP) {
      setError('Invalid verification code. Please enter the demo code: 123456');
      return;
    }

    // Verified successfully
    if (mode === 'register' || !existingUser) {
      setStep('register-details');
    } else {
      onLoginSuccess(existingUser);
    }
  };

  const handleResendOtp = () => {
    setError(null);
    setResendNotice('Demo verification code is 123456. No SMS was sent.');
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
      setError('Please complete all fields to finalize your account.');
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
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900">
      {/* Top minimal header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <Recycle className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-slate-900">RecyConnect</span>
              <p className="text-xs text-slate-500 hidden sm:block">Connect. Recycle. Create Value.</p>
            </div>
          </div>

          <div className="text-xs text-slate-500 hidden sm:block">
            {mode === 'login' ? (
              <span>Don't have an account? <button type="button" onClick={() => { setMode('register'); setStep('phone'); setError(null); }} className="text-emerald-800 font-semibold hover:underline cursor-pointer">Create Account</button></span>
            ) : (
              <span>Already registered? <button type="button" onClick={() => { setMode('login'); setStep('phone'); setError(null); }} className="text-emerald-800 font-semibold hover:underline cursor-pointer">Sign In</button></span>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
          {/* Logo & Headline */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Recycle className="w-6 h-6 text-emerald-100" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">RecyConnect</h1>
            <p className="text-xs font-medium text-emerald-800 mt-0.5">Connect. Recycle. Create Value.</p>
            <p className="text-xs text-slate-500 mt-2">
              Connecting plastic waste suppliers directly with recyclers.
            </p>
          </div>

          {/* Tab switch between Login and Register */}
          {step === 'phone' && (
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg mb-6 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className={`py-2 rounded-md transition-all cursor-pointer ${
                  mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(null); }}
                className={`py-2 rounded-md transition-all cursor-pointer ${
                  mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-5 text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Phone number entry */}
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
                    className="w-24 px-2.5 py-2.5 border border-slate-300 rounded-lg text-sm bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800"
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
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800"
                      autoFocus
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Enter registered phone number to receive verification code.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer shadow-xs"
              >
                Get Verification Code
              </button>
            </form>
          )}

          {/* STEP 2: OTP verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-900">
                <p className="font-semibold">
                  Demo code is 123456. No SMS was sent.
                </p>
                <p className="text-emerald-700 mt-0.5">
                  Verification for: <span className="font-mono font-bold text-slate-900">{countryCode} {phoneNumber}</span>
                </p>
              </div>

              {resendNotice && (
                <div className="bg-slate-50 border border-slate-200 text-slate-700 p-2.5 rounded-lg text-xs">
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
                    placeholder="123456"
                    className="w-full px-3 py-2.5 text-center tracking-widest text-lg font-mono font-semibold border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800"
                    autoFocus
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer shadow-xs"
              >
                Verify & Continue
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
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
                  Change number
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Complete Account Registration */}
          {step === 'register-details' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="border-b border-slate-100 pb-2">
                <h2 className="text-sm font-bold text-slate-900">Account Registration</h2>
                <p className="text-xs text-slate-500">Provide your organization profile to continue.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900"
                    placeholder="e.g. Rajesh Sharma"
                    autoFocus
                  />
                  <User className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Organization / Company Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900"
                    placeholder="e.g. EcoApex Industries Pvt Ltd"
                  />
                  <Building className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Account Type (Role) *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('Industry')}
                    className={`py-2 px-3 border rounded-lg text-xs font-semibold text-left cursor-pointer flex items-center justify-between ${
                      role === 'Industry'
                        ? 'border-emerald-800 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>Industry (Seller)</span>
                    {role === 'Industry' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('Recycler')}
                    className={`py-2 px-3 border rounded-lg text-xs font-semibold text-left cursor-pointer flex items-center justify-between ${
                      role === 'Recycler'
                        ? 'border-emerald-800 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>Recycler (Buyer)</span>
                    {role === 'Recycler' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900"
                      placeholder="e.g. Pune"
                    />
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900"
                    placeholder="e.g. Maharashtra"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                Complete Registration & Enter
              </button>
            </form>
          )}

          {/* Quick link to switch between Login and Register at the bottom */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            {mode === 'login' ? (
              <p>
                New supplier or recycler?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setStep('phone'); setError(null); }}
                  className="text-emerald-800 font-semibold hover:underline cursor-pointer"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setStep('phone'); setError(null); }}
                  className="text-emerald-800 font-semibold hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Clean minimal footer */}
      <footer className="border-t border-slate-200 py-4 bg-white text-xs text-slate-500 text-center">
        <p>RecyConnect — Connect. Recycle. Create Value.</p>
      </footer>
    </div>
  );
};
