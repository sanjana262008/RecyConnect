import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Building, 
  ArrowRight, 
  Send,
  Info,
  Weight
} from 'lucide-react';
import { WasteListing, PlasticType, BatchSuggestion, UserProfile } from '../types';
import { findSmartBatchMatches } from '../utils/batchMatcher';

interface SmartMatchingViewProps {
  listings: WasteListing[];
  currentUser: UserProfile;
  onSendBatchEnquiry: (listings: WasteListing[], requestedQty: number, message: string) => void;
  onViewSingleListing: (listing: WasteListing) => void;
}

const PLASTIC_OPTIONS: PlasticType[] = ['PET', 'HDPE', 'LDPE', 'PP', 'PVC', 'ABS'];

const GRADE_OPTIONS = [
  'Any Grade / Compatible',
  'Grade A - Clean / Post-Industrial',
  'Grade B - Washed / Minor Contamination',
  'Grade C - Mixed / Post-Consumer',
  'Regrind / Flakes',
  'Industrial Purge / Off-spec',
];

export const SmartMatchingView: React.FC<SmartMatchingViewProps> = ({
  listings,
  currentUser,
  onSendBatchEnquiry,
  onViewSingleListing,
}) => {
  const [plasticType, setPlasticType] = useState<PlasticType>('PET');
  const [selectedGrade, setSelectedGrade] = useState<string>('Any Grade / Compatible');
  const [requiredQty, setRequiredQty] = useState<string>('4500');
  const [preferredLocation, setPreferredLocation] = useState<string>('Maharashtra');
  const [suggestions, setSuggestions] = useState<BatchSuggestion[] | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Batch Enquiry modal state
  const [activeSuggestionForEnquiry, setActiveSuggestionForEnquiry] = useState<BatchSuggestion | null>(null);
  const [enquiryMessage, setEnquiryMessage] = useState<string>('');
  const [enquirySentNotice, setEnquirySentNotice] = useState<boolean>(false);

  const handleRunMatch = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(requiredQty);
    if (isNaN(qty) || qty <= 0) return;

    const results = findSmartBatchMatches(listings, {
      plasticType,
      grade: selectedGrade === 'Any Grade / Compatible' ? undefined : selectedGrade,
      requiredQuantityKg: qty,
      preferredLocation: preferredLocation.trim() || undefined,
    });

    setSuggestions(results);
    setHasSearched(true);
  };

  const handleOpenBatchEnquiry = (suggestion: BatchSuggestion) => {
    setActiveSuggestionForEnquiry(suggestion);
    setEnquiryMessage(
      `Interested in acquiring ${suggestion.totalQuantityKg.toLocaleString()} kg of compatible ${plasticType} across this suggested lot.`
    );
    setEnquirySentNotice(false);
  };

  const handleSubmitBatchEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSuggestionForEnquiry) return;

    const qty = parseFloat(requiredQty) || activeSuggestionForEnquiry.totalQuantityKg;
    onSendBatchEnquiry(activeSuggestionForEnquiry.listings, qty, enquiryMessage.trim());

    setEnquirySentNotice(true);
    setTimeout(() => {
      setEnquirySentNotice(false);
      setActiveSuggestionForEnquiry(null);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-lg border border-slate-200">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Rule-Based Material Aggregation</span>
          </span>
          <span className="text-xs text-slate-500 font-mono">Smart Batch Matching</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900">Batch Matcher for Recyclers</h1>
        <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Need large commercial volumes? Our transparent rule-based algorithm finds individual high-volume suppliers or pools multiple compatible regional lots of the exact same polymer type into consolidated batches. Incompatible materials are never combined.
        </p>
      </div>

      {/* Input Formulation Form */}
      <div className="bg-white p-5 rounded-lg border border-slate-200">
        <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <span>Define Your Procurement Criteria</span>
        </h2>

        <form onSubmit={handleRunMatch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Plastic Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Required Plastic Type *
              </label>
              <select
                value={plasticType}
                onChange={(e) => setPlasticType(e.target.value as PlasticType)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-semibold text-slate-900 bg-white"
              >
                {PLASTIC_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Quantity */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Quantity (kg) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="100"
                  step="50"
                  required
                  value={requiredQty}
                  onChange={(e) => setRequiredQty(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-900"
                />
                <Weight className="w-4 h-4 text-slate-400 absolute right-3 top-2" />
              </div>
            </div>

            {/* Required Grade */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Grade / Quality Compatibility
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-900 bg-white"
              >
                {GRADE_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Location (City/State)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={preferredLocation}
                  onChange={(e) => setPreferredLocation(e.target.value)}
                  placeholder="e.g. Maharashtra, Gujarat"
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-900"
                />
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Logic checks polymer compatibility, regional proximity, and lot availability.</span>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Find Matching Batches</span>
            </button>
          </div>
        </form>
      </div>

      {/* Rule Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs text-slate-600 flex items-start gap-2">
        <Info className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-800">Rule-based Match Disclosure:</span> Suggestions require buyer and seller confirmation. No incompatible materials are combined. Prices shown represent published asking rates or "Not provided" where unavailable.
        </div>
      </div>

      {/* Results Section */}
      {hasSearched && suggestions && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Suggested Match Options ({suggestions.length})
            </h2>
            <span className="text-xs text-slate-500">
              Target: {parseFloat(requiredQty).toLocaleString()} kg of {plasticType}
            </span>
          </div>

          {suggestions.length === 0 ? (
            <div className="bg-white p-8 rounded-lg border border-slate-200 text-center">
              <p className="text-sm font-semibold text-slate-700">No compatible batches found for {plasticType}.</p>
              <p className="text-xs text-slate-500 mt-1">
                Try reducing the target volume, choosing "Any Grade", or clearing location preferences.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {suggestions.map((suggestion, idx) => (
                <div
                  key={suggestion.id}
                  className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-800 text-white">
                        {suggestion.isCombinedBatch ? 'Multi-Source Batch' : 'Single Supplier Match'}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                        {suggestion.listings.length} Source{suggestion.listings.length > 1 ? 's' : ''}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-900">
                        Total: {suggestion.totalQuantityKg.toLocaleString()} kg
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 flex items-center gap-4">
                      {suggestion.averagePricePerKg ? (
                        <span>
                          Avg. Price: <span className="font-semibold text-slate-900">₹{suggestion.averagePricePerKg}/kg</span>
                          {suggestion.calculableSubtotal && (
                            <span className="text-emerald-800 ml-1 font-bold">
                              (Subtotal: ₹{suggestion.calculableSubtotal.toLocaleString()})
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Asking price not provided</span>
                      )}
                    </div>
                  </div>

                  {/* Matching Reason (Transparent rule explanation) */}
                  <div className="my-3 p-3 bg-emerald-50/60 border border-emerald-200 rounded text-xs text-emerald-900">
                    <span className="font-bold">Match Rationale: </span>
                    <span>{suggestion.reason}</span>
                  </div>

                  {/* Component Listings breakdown */}
                  <div className="space-y-2 mt-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Component Lots Included in this Batch:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {suggestion.listings.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 rounded border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              <span>{item.quantityKg.toLocaleString()} kg</span>
                              <span className="text-[11px] text-slate-500">• {item.grade}</span>
                            </div>
                            <div className="text-[11px] text-slate-600 flex items-center gap-2 mt-0.5">
                              <span>{item.sellerOrg}</span>
                              <span>•</span>
                              <span>{item.city}, {item.state}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-medium text-slate-700">
                              {item.expectedPricePerKg ? `₹${item.expectedPricePerKg}/kg` : 'No price'}
                            </span>
                            <button
                              type="button"
                              onClick={() => onViewSingleListing(item)}
                              className="text-[11px] text-emerald-800 hover:text-emerald-950 font-semibold underline cursor-pointer"
                            >
                              Inspect
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Send a coordinated enquiry for all lots in this batch simultaneously.
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenBatchEnquiry(suggestion)}
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Enquire on this Batch</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Batch Enquiry Modal */}
      {activeSuggestionForEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full border border-slate-200 p-6 relative">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Submit Batch Enquiry
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enquiring for {activeSuggestionForEnquiry.totalQuantityKg.toLocaleString()} kg across {activeSuggestionForEnquiry.listings.length} suppliers.
            </p>

            {enquirySentNotice ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Enquiries sent to suppliers successfully! Track them in "My Enquiries".</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitBatchEnquiry} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Suppliers to contact
                  </label>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs space-y-1 text-slate-700">
                    {activeSuggestionForEnquiry.listings.map((l) => (
                      <div key={l.id} className="flex justify-between">
                        <span>• {l.sellerOrg} ({l.city})</span>
                        <span className="font-semibold">{l.quantityKg.toLocaleString()} kg</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Organization (Buyer)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.organizationName}
                    className="w-full px-3 py-1.5 border border-slate-200 bg-slate-100 rounded text-xs text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Message to Suppliers
                  </label>
                  <textarea
                    rows={3}
                    value={enquiryMessage}
                    onChange={(e) => setEnquiryMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-900"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveSuggestionForEnquiry(null)}
                    className="px-3.5 py-1.5 border border-slate-300 text-slate-700 rounded text-xs font-medium hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Batch Enquiry</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
