import React, { useState } from 'react';
import { PlusCircle, Search, Edit2, Trash2, Eye, Filter, CheckCircle2, AlertCircle } from 'lucide-react';
import { WasteListing, PlasticType, ListingStatus, UserProfile } from '../types';

interface MyListingsViewProps {
  user: UserProfile;
  listings: WasteListing[];
  onOpenCreate: () => void;
  onEditListing: (listing: WasteListing) => void;
  onDeleteListing: (listingId: string) => void;
  onViewListing: (listing: WasteListing) => void;
}

export const MyListingsView: React.FC<MyListingsViewProps> = ({
  user,
  listings,
  onOpenCreate,
  onEditListing,
  onDeleteListing,
  onViewListing,
}) => {
  const [selectedPlastic, setSelectedPlastic] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter listings belonging to this seller/organization
  const myListings = listings.filter(
    (item) => item.sellerId === 'demo-user-1' || item.sellerOrg === user.organizationName
  );

  const filteredListings = myListings.filter((item) => {
    const matchesPlastic = selectedPlastic === 'All' || item.plasticType === selectedPlastic;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      item.plasticType.toLowerCase().includes(searchLower) ||
      item.grade.toLowerCase().includes(searchLower) ||
      item.condition.toLowerCase().includes(searchLower) ||
      item.city.toLowerCase().includes(searchLower);

    return matchesPlastic && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-lg border border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Waste Listings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your industrial plastic scrap inventory, adjust pricing, or update availability.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Waste Listing</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by plastic, grade, condition..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs text-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Type:</span>
          </div>
          <select
            value={selectedPlastic}
            onChange={(e) => setSelectedPlastic(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-300 rounded text-xs text-slate-800 bg-white"
          >
            <option value="All">All Types</option>
            <option value="PET">PET</option>
            <option value="HDPE">HDPE</option>
            <option value="LDPE">LDPE</option>
            <option value="PP">PP</option>
            <option value="PVC">PVC</option>
            <option value="ABS">ABS</option>
            <option value="Other">Other</option>
          </select>

          <div className="flex items-center gap-1 text-xs text-slate-500 ml-1">
            <span>Status:</span>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-300 rounded text-xs text-slate-800 bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Request Received">Request Received</option>
            <option value="Collection Scheduled">Collection Scheduled</option>
            <option value="Collected">Collected</option>
          </select>
        </div>
      </div>

      {/* Listings Table / Grid */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {filteredListings.length === 0 ? (
          <div className="text-center py-12 px-4">
            <p className="text-sm font-medium text-slate-700">No matching waste listings found.</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting your filters or create a new listing.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Plastic & Grade</th>
                  <th className="py-3 px-4">Quantity (kg)</th>
                  <th className="py-3 px-4">Asking Price</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-800 text-white shrink-0">
                          {listing.plasticType}
                        </span>
                        <div>
                          <div className="font-semibold text-slate-900">{listing.grade}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">{listing.condition}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {listing.quantityKg.toLocaleString()} kg
                    </td>
                    <td className="py-3 px-4">
                      {listing.expectedPricePerKg ? (
                        <span className="font-semibold text-emerald-800">
                          ₹{listing.expectedPricePerKg}/kg
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Not provided</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {listing.city}, {listing.state}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                        listing.status === 'Available'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : listing.status === 'Collected'
                          ? 'bg-slate-100 text-slate-700 border-slate-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onViewListing(listing)}
                        className="p-1.5 text-slate-600 hover:text-emerald-800 hover:bg-slate-100 rounded cursor-pointer"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditListing(listing)}
                        className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded cursor-pointer"
                        title="Edit listing"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(listing.id)}
                        className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full border border-slate-200 p-5 text-slate-800">
            <h3 className="text-base font-bold text-slate-900 mb-2">Delete Waste Listing?</h3>
            <p className="text-xs text-slate-600 mb-4">
              Are you sure you want to delete this listing? This action removes it permanently from your inventory and the marketplace.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded text-xs font-medium hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteListing(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-medium cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
