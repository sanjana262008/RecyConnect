import React from 'react';
import { Recycle, LogOut, Repeat, User } from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface NavbarProps {
  user: UserProfile;
  activeRole: UserRole;
  onToggleRole: () => void;
  onLogout: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeRole,
  onToggleRole,
  onLogout,
  onOpenProfile,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-800 text-white flex items-center justify-center shadow-xs">
            <Recycle className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">RecyConnect</span>
            <p className="text-[11px] text-slate-500 hidden sm:block">Connect. Recycle. Create Value.</p>
          </div>
        </div>

        {/* Right side: Role Switcher & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Role Toggle */}
          <button
            type="button"
            onClick={onToggleRole}
            title="Switch account perspective between Industry and Recycler"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
          >
            <Repeat className="w-3.5 h-3.5 text-emerald-800" />
            <span className="hidden sm:inline">Role:</span>
            <span className="text-emerald-800">
              {activeRole === 'Industry' ? 'Industry (Seller)' : 'Recycler (Buyer)'}
            </span>
          </button>

          {/* User Profile Info */}
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-slate-50 text-slate-700 rounded-md text-xs border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="text-left hidden sm:block">
              <div className="font-semibold text-slate-900 leading-tight truncate max-w-[140px]">
                {user.fullName}
              </div>
              <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
                {user.organizationName}
              </div>
            </div>
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={onLogout}
            title="Logout"
            className="p-2 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
