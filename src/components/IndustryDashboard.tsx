import React from 'react';
import { 
  Package, 
  Inbox, 
  Truck, 
  PlusCircle, 
  ArrowRight, 
  MapPin
} from 'lucide-react';
import { WasteListing, Enquiry, UserProfile } from '../types';
import { PageId } from './Sidebar';

interface IndustryDashboardProps {
  user: UserProfile;
  listings: WasteListing[];
  enquiries: Enquiry[];
  onNavigate: (page: PageId) => void;
  onOpenCreateListing: () => void;
  onViewListing: (listing: WasteListing) => void;
}

export const IndustryDashboard: React.FC<IndustryDashboardProps> = ({
  user,
  listings,
  enquiries,
  onNavigate,
  onOpenCreateListing,
  onViewListing,
}) => {
  // Only calculate for this seller/organization
  const myListings = listings.filter(
    (item) => item.sellerId === 'demo-user-1' || item.sellerOrg === user.organizationName
  );

  const activeListings = myListings.filter((item) => item.status === 'Available');

  // Enquiries received by this seller
  const myEnquiries = enquiries.filter(
    (e) => e.listingSnapshot.sellerOrg === user.organizationName || e.listingSnapshot.sellerOrg.includes('EcoApex')
  );

  const pendingEnquiries = myEnquiries.filter((e) => e.currentStatus === 'Enquiry Sent');
  const scheduledCollections = myEnquiries.filter((e) => e.currentStatus === 'Collection Scheduled');

  return (
    <div className="space-y-6">
      {/* Greeting Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{user.city}, {user.state}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user.fullName}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {user.organizationName} — Industrial Plastic Waste Management Portal
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreateListing}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Waste Listing</span>
        </button>
      </div>

      {/* 3 Metric Cards: Active Listings, Pending Enquiries, Scheduled Collections */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Active Listings */}
        <div 
          onClick={() => onNavigate('my-listings')}
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Active Listings</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {activeListings.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Available for purchase by recyclers
          </p>
        </div>

        {/* Metric 2: Pending Enquiries */}
        <div 
          onClick={() => onNavigate('enquiries')}
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Pending Enquiries</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {pendingEnquiries.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Awaiting price confirmation or terms
          </p>
        </div>

        {/* Metric 3: Scheduled Collections */}
        <div 
          onClick={() => onNavigate('collections')}
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Scheduled Collections</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {scheduledCollections.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Arranged for vehicle dispatch & pickup
          </p>
        </div>
      </div>

      {/* Short List of Recent Listings */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Listings</h2>
            <p className="text-xs text-slate-500">Your latest registered scrap material lots</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('my-listings')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {myListings.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No listings created yet. Click "Add Waste Listing" above to publish your first lot.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {myListings.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => onViewListing(item)}
                className="p-4 border border-slate-200 rounded-lg hover:border-emerald-700/50 hover:bg-slate-50/50 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-800 text-white">
                      {item.plasticType}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      item.status === 'Available'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">
                    {item.quantityKg.toLocaleString()} kg
                  </h3>
                  <p className="text-xs font-medium text-slate-700 mb-1 line-clamp-1">
                    {item.grade}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mb-2">
                    {item.condition}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-700 pt-2 border-t border-slate-100">
                  <span className="font-semibold">
                    {item.expectedPricePerKg ? `₹${item.expectedPricePerKg}/kg` : 'Price on enquiry'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {item.city}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
