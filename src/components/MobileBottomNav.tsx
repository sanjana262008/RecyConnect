import React from 'react';
import { 
  LayoutDashboard, 
  PackageSearch, 
  Inbox, 
  Truck, 
  User, 
  Search, 
  Sparkles 
} from 'lucide-react';
import { UserRole } from '../types';
import { PageId } from './Sidebar';

interface MobileBottomNavProps {
  role: UserRole;
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  pendingEnquiryCount?: number;
  scheduledCollectionCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  role,
  currentPage,
  onNavigate,
  pendingEnquiryCount = 0,
  scheduledCollectionCount = 0,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1 shadow-lg flex items-center justify-around">
      {role === 'Industry' ? (
        <>
          <button
            type="button"
            onClick={() => onNavigate('industry-dashboard')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded text-[10px] font-medium transition-colors ${
              currentPage === 'industry-dashboard'
                ? 'text-emerald-800 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('my-listings')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded text-[10px] font-medium transition-colors ${
              currentPage === 'my-listings'
                ? 'text-emerald-800 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <PackageSearch className="w-5 h-5 mb-0.5" />
            <span>Listings</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('enquiries')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded text-[10px] font-medium transition-colors relative ${
              currentPage === 'enquiries'
                ? 'text-emerald-800 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <div className="relative">
              <Inbox className="w-5 h-5 mb-0.5" />
              {pendingEnquiryCount > 0 && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-emerald-800 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                  {pendingEnquiryCount}
                </span>
              )}
            </div>
            <span>Enquiries</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('collections')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded text-[10px] font-medium transition-colors relative ${
              currentPage === 'collections'
                ? 'text-emerald-800 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <div className="relative">
              <Truck className="w-5 h-5 mb-0.5" />
              {scheduledCollectionCount > 0 && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-amber-600 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                  {scheduledCollectionCount}
                </span>
              )}
            </div>
            <span>Collections</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded text-[10px] font-medium transition-colors ${
              currentPage === 'profile'
                ? 'text-emerald-800 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span>Profile</span>
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => onNavigate('find-waste')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded text-[10px] font-medium transition-colors ${
              currentPage === 'find-waste'
                ? 'text-emerald-800 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Search className="w-5 h-5 mb-0.5" />
            <span>Find Waste</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('smart-matches')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded text-[10px] font-medium transition-colors ${
              currentPage === 'smart-matches'
                ? 'text-emerald-800 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-5 h-5 mb-0.5" />
            <span>Matches</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('enquiries')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded text-[10px] font-medium transition-colors relative ${
              currentPage === 'enquiries'
                ? 'text-emerald-800 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <div className="relative">
              <Inbox className="w-5 h-5 mb-0.5" />
              {pendingEnquiryCount > 0 && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-emerald-800 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                  {pendingEnquiryCount}
                </span>
              )}
            </div>
            <span>Enquiries</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('collections')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded text-[10px] font-medium transition-colors relative ${
              currentPage === 'collections'
                ? 'text-emerald-800 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <div className="relative">
              <Truck className="w-5 h-5 mb-0.5" />
              {scheduledCollectionCount > 0 && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-amber-600 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                  {scheduledCollectionCount}
                </span>
              )}
            </div>
            <span>Collections</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded text-[10px] font-medium transition-colors ${
              currentPage === 'profile'
                ? 'text-emerald-800 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span>Profile</span>
          </button>
        </>
      )}
    </nav>
  );
};
