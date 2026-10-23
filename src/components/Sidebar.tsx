import React from 'react';
import { 
  LayoutDashboard, 
  PackageSearch, 
  Inbox, 
  Truck, 
  User, 
  Search, 
  Sparkles,
  PlusCircle,
  Building
} from 'lucide-react';
import { UserRole } from '../types';

export type PageId = 
  | 'industry-dashboard'
  | 'my-listings'
  | 'enquiries'
  | 'collections'
  | 'find-waste'
  | 'smart-matches'
  | 'profile';

interface SidebarProps {
  role: UserRole;
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenCreateListing: () => void;
  activeListingCount?: number;
  pendingEnquiryCount?: number;
  scheduledCollectionCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  currentPage,
  onNavigate,
  onOpenCreateListing,
  activeListingCount = 0,
  pendingEnquiryCount = 0,
  scheduledCollectionCount = 0,
}) => {
  return (
    <aside className="hidden md:flex w-56 shrink-0 border-r border-slate-200 bg-white flex-col h-[calc(100vh-4rem)] sticky top-16 justify-between p-3">
      <div className="space-y-4">
        {/* Industry Primary Action */}
        {role === 'Industry' && (
          <button
            type="button"
            onClick={onOpenCreateListing}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Waste Listing</span>
          </button>
        )}

        {/* Navigation Links */}
        <nav className="space-y-1">
          {role === 'Industry' ? (
            <>
              <button
                type="button"
                onClick={() => onNavigate('industry-dashboard')}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                  currentPage === 'industry-dashboard'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4 text-emerald-800" />
                  <span>Dashboard</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('my-listings')}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                  currentPage === 'my-listings'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <PackageSearch className="w-4 h-4 text-emerald-800" />
                  <span>My Listings</span>
                </div>
                {activeListingCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-semibold bg-slate-100 text-slate-700 rounded">
                    {activeListingCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => onNavigate('enquiries')}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                  currentPage === 'enquiries'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Inbox className="w-4 h-4 text-emerald-800" />
                  <span>Enquiries</span>
                </div>
                {pendingEnquiryCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-semibold bg-emerald-800 text-white rounded">
                    {pendingEnquiryCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => onNavigate('collections')}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                  currentPage === 'collections'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-emerald-800" />
                  <span>Collections</span>
                </div>
                {scheduledCollectionCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-semibold bg-amber-100 text-amber-800 rounded">
                    {scheduledCollectionCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => onNavigate('profile')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                  currentPage === 'profile'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4 text-emerald-800" />
                <span>Profile</span>
              </button>
            </>
          ) : (
            <>
              {/* Recycler Navigation */}
              <button
                type="button"
                onClick={() => onNavigate('find-waste')}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                  currentPage === 'find-waste'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-emerald-800" />
                  <span>Find Waste</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('smart-matches')}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                  currentPage === 'smart-matches'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-800" />
                  <span>Smart Matches</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('enquiries')}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                  currentPage === 'enquiries'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Inbox className="w-4 h-4 text-emerald-800" />
                  <span>My Enquiries</span>
                </div>
                {pendingEnquiryCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-semibold bg-emerald-800 text-white rounded">
                    {pendingEnquiryCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => onNavigate('collections')}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                  currentPage === 'collections'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-emerald-800" />
                  <span>Collections</span>
                </div>
                {scheduledCollectionCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-semibold bg-amber-100 text-amber-800 rounded">
                    {scheduledCollectionCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => onNavigate('profile')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                  currentPage === 'profile'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4 text-emerald-800" />
                <span>Profile</span>
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Role tag at bottom */}
      <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <Building className="w-3.5 h-3.5 text-emerald-800" />
          <span>{role === 'Industry' ? 'Supplier Portal' : 'Recycler Portal'}</span>
        </div>
      </div>
    </aside>
  );
};
