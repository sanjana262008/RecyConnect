import React, { useState } from 'react';
import { 
  User, 
  Building, 
  Phone, 
  MapPin, 
  RotateCcw, 
  LogOut, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Repeat
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onLogout: () => void;
  onResetDemo: () => void;
  onToggleRole: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateProfile,
  onLogout,
  onResetDemo,
  onToggleRole,
}) => {
  const [fullName, setFullName] = useState(user.fullName);
  const [orgName, setOrgName] = useState(user.organizationName);
  const [role, setRole] = useState<UserRole>(user.role);
  const [city, setCity] = useState(user.city);
  const [state, setState] = useState(user.state);
  const [isSaved, setIsSaved] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !orgName.trim() || !city.trim() || !state.trim()) {
      setError('All fields are required.');
      return;
    }

    const updated: UserProfile = {
      ...user,
      fullName: fullName.trim(),
      organizationName: orgName.trim(),
      role,
      city: city.trim(),
      state: state.trim(),
    };

    onUpdateProfile(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
              {role === 'Industry' ? 'Industry Account' : 'Recycler Account'}
            </span>
            <span className="text-xs text-slate-500 font-mono">{user.phone}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{user.fullName}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {user.organizationName} • {user.city}, {user.state}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={onToggleRole}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-200 cursor-pointer transition-colors"
          >
            <Repeat className="w-3.5 h-3.5 text-emerald-800" />
            <span>Switch Role ({role === 'Industry' ? 'to Recycler' : 'to Industry'})</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="px-3.5 py-2 border border-red-200 text-red-700 hover:bg-red-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          Account Profile & Organization Information
        </h2>

        {isSaved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Profile successfully updated.</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registered Mobile Number
              </label>
              <input
                type="text"
                disabled
                value={user.phone}
                className="w-full px-3 py-2 border border-slate-200 bg-slate-100 rounded-lg text-xs text-slate-500 font-mono cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Organization / Company Name *
              </label>
              <input
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Type *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 bg-white font-medium"
              >
                <option value="Industry">Industry (Plastic Waste Seller)</option>
                <option value="Recycler">Recycler (Plastic Waste Buyer)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900"
              />
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
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Account registered: {new Date(user.registeredAt).toLocaleDateString()}
            </span>

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Storage and Development Reset (Unobtrusive) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Reset Application Data</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Restore default listings and starter enquiries for demonstration purposes.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 border border-red-300 text-red-700 hover:bg-red-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full border border-slate-200 p-6 text-slate-800">
            <h3 className="text-base font-bold text-slate-900 mb-2">Reset Application Data?</h3>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              This will restore all default starter listings, inquiries, and reset test account values.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetConfirm(false);
                  onResetDemo();
                }}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
