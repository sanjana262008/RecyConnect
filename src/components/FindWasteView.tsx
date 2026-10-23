import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, MapPin, Building, Eye, Send, Sparkles } from 'lucide-react';
import { WasteListing, PlasticType, UserProfile } from '../types';

interface FindWasteViewProps {
  listings: WasteListing[];
  currentUser: UserProfile;
  onViewListing: (listing: WasteListing) => void;
  onNavigateToSmartMatches: () => void;
}

export const FindWasteView: React.FC<FindWasteViewProps> = ({
  listings,
  currentUser,
  onViewListing,
  onNavigateToSmartMatches,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPlastic, setSelectedPlastic] = useState<string>('All');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [minQuantity, setMinQuantity] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'qty-desc' | 'qty-asc' | 'price-asc' | 'price-desc'>('newest');

  // Marketplace only shows Available listings!
  const availableListings = listings.filter((item) => item.status === 'Available');

  const filteredListings = availableListings.filter((item) => {
    // Plastic filter
    if (selectedPlastic !== 'All' && item.plasticType !== selectedPlastic) return false;

    // Grade filter
    if (selectedGrade !== 'All' && !item.grade.toLowerCase().includes(selectedGrade.toLowerCase())) return false;

    // Min Quantity filter
    if (minQuantity) {
      const minQtyNum = parseFloat(minQuantity);
      if (!isNaN(minQtyNum) && item.quantityKg < minQtyNum) return false;
    }

    // Location filter
    if (locationFilter.trim()) {
      const loc = locationFilter.trim().toLowerCase();
      const inCity = item.city.toLowerCase().includes(loc);
      const inState = item.state.toLowerCase().includes(loc);
      if (!inCity && !inState) return false;
    }

    // General search term
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      const matches =
        item.plasticType.toLowerCase().includes(term) ||
        item.city.toLowerCase().includes(term) ||
        item.state.toLowerCase().includes(term) ||
        item.sellerOrg.toLowerCase().includes(term) ||
        item.grade.toLowerCase().includes(term) ||
        item.condition.toLowerCase().includes(term);
      if (!matches) return false;
    }

    return true;
  });

  // Sorting
  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'qty-desc') {
      return b.quantityKg - a.quantityKg;
    }
    if (sortBy === 'qty-asc') {
      return a.quantityKg - b.quantityKg;
    }
    if (sortBy === 'price-asc') {
      // items with null price sorted to the end
      if (a.expectedPricePerKg === null) return 1;
      if (b.expectedPricePerKg === null) return -1;
      return a.expectedPricePerKg - b.expectedPricePerKg;
    }
    if (sortBy === 'price-desc') {
      if (a.expectedPricePerKg === null) return 1;
      if (b.expectedPricePerKg === null) return -1;
      return b.expectedPricePerKg - a.expectedPricePerKg;
    }
    return 0;
  });

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedPlastic('All');
    setSelectedGrade('All');
    setMinQuantity('');
    setLocationFilter('');
    setSortBy('newest');
  };

  return (
    <div className="space-y-5">
      {/* Top Banner with Smart Matches Callout */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
              Recycler Marketplace
            </span>
            <span className="text-xs text-slate-500">
              {availableListings.length} verified available scrap lots
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Find Waste</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover verified industrial polymer streams ready for recycling and compounding.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToSmartMatches}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-emerald-700" />
          <span>Try Smart Batch Matching</span>
        </button>
      </div>

      {/* Search and Advanced Filters */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search plastic type, city, seller..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded text-xs text-slate-900"
            />
          </div>

          <div className="relative w-full sm:w-48">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="Filter City or State"
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded text-xs text-slate-900"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          {/* Plastic type filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Plastic:</span>
            <select
              value={selectedPlastic}
              onChange={(e) => setSelectedPlastic(e.target.value)}
              className="px-2 py-1 border border-slate-300 rounded text-xs text-slate-800 bg-white"
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
          </div>

          {/* Grade filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Grade:</span>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-2 py-1 border border-slate-300 rounded text-xs text-slate-800 bg-white"
            >
              <option value="All">All Grades</option>
              <option value="Grade A">Grade A (Clean / Post-Ind)</option>
              <option value="Grade B">Grade B (Washed)</option>
              <option value="Grade C">Grade C (Mixed)</option>
              <option value="Regrind">Regrind / Flakes</option>
              <option value="Purge">Industrial Purge</option>
            </select>
          </div>

          {/* Min Quantity filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Min kg:</span>
            <input
              type="number"
              placeholder="e.g. 1000"
              value={minQuantity}
              onChange={(e) => setMinQuantity(e.target.value)}
              className="w-24 px-2 py-1 border border-slate-300 rounded text-xs text-slate-800"
            />
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 sm:ml-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2 py-1 border border-slate-300 rounded text-xs text-slate-800 bg-white font-medium"
            >
              <option value="newest">Newest First</option>
              <option value="qty-desc">Quantity: High to Low</option>
              <option value="qty-asc">Quantity: Low to High</option>
              <option value="price-asc">Price: Lowest First</option>
              <option value="price-desc">Price: Highest First</option>
            </select>
          </div>

          {(selectedPlastic !== 'All' || selectedGrade !== 'All' || minQuantity || locationFilter || searchTerm) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-emerald-800 hover:text-emerald-950 underline underline-offset-2 ml-2 cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Listings Grid */}
      {sortedListings.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-lg border border-slate-200">
          <p className="text-sm font-semibold text-slate-700">No available plastic listings match your criteria.</p>
          <p className="text-xs text-slate-500 mt-1">Try relaxing filters or check back later.</p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-3 px-3.5 py-1.5 bg-emerald-800 text-white rounded text-xs font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-slate-300 transition-shadow flex flex-col justify-between"
            >
              {/* Card Thumbnail / Header */}
              <div>
                {listing.imageUrl ? (
                  <div className="h-40 w-full bg-slate-100 overflow-hidden relative">
                    <img
                      src={listing.imageUrl}
                      alt={listing.plasticType}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-800 text-white shadow-xs">
                        {listing.plasticType}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-800 text-white">
                      {listing.plasticType}
                    </span>
                  </div>
                )}

                {/* Card Content */}
                <div className="p-4 space-y-2.5">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {listing.quantityKg.toLocaleString()} kg Available
                    </h3>
                    <p className="text-xs font-medium text-slate-700 mt-0.5">
                      {listing.grade}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {listing.condition}
                  </p>

                  <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 truncate">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{listing.sellerOrg}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{listing.city}, {listing.state}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 pt-2 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] text-slate-500">Asking Price</span>
                  <span className="text-xs font-bold text-slate-900">
                    {listing.expectedPricePerKg ? `₹${listing.expectedPricePerKg}/kg` : 'Not provided'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onViewListing(listing)}
                    className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View & Enquire</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
