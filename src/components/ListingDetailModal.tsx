import React, { useState } from 'react';
import { X, MapPin, Building, Calendar, Shield, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { WasteListing, UserProfile } from '../types';
import { calculatePriceBreakdown } from '../utils/pricing';

interface ListingDetailModalProps {
  listing: WasteListing | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSendEnquiry?: (listing: WasteListing, requestedQty: number, message: string) => void;
  isOwner?: boolean;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  isOpen,
  onClose,
  currentUser,
  onSendEnquiry,
  isOwner = false,
}) => {
  if (!isOpen || !listing) return null;

  const [requestedQty, setRequestedQty] = useState<string>(listing.quantityKg.toString());
  const [message, setMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const numRequestedQty = parseFloat(requestedQty) || 0;
  const priceBreakdown = calculatePriceBreakdown({
    askingPricePerKg: listing.expectedPricePerKg,
    requestedQuantityKg: numRequestedQty,
  });

  const handleSubmitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (numRequestedQty <= 0) {
      setError('Please specify a positive quantity in kg.');
      return;
    }

    if (numRequestedQty > listing.quantityKg * 1.5) {
      setError(`Requested quantity significantly exceeds available lot (${listing.quantityKg.toLocaleString()} kg). Please adjust.`);
      return;
    }

    if (onSendEnquiry) {
      onSendEnquiry(listing, numRequestedQty, message.trim());
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full border border-slate-200 my-8 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2.5 py-1 text-xs font-bold rounded bg-emerald-800 text-white">
            {listing.plasticType}
          </span>
          <span className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-100 text-slate-800 border border-slate-200">
            {listing.grade}
          </span>
          <span className={`px-2 py-0.5 text-xs font-medium rounded border ${
            listing.status === 'Available'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            {listing.status}
          </span>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-2">
          {listing.quantityKg.toLocaleString()} kg of {listing.plasticType} Plastic Scrap
        </h2>

        {/* Image if provided */}
        {listing.imageUrl && (
          <div className="mb-4 rounded-lg overflow-hidden border border-slate-200 max-h-56 bg-slate-100">
            <img
              src={listing.imageUrl}
              alt={listing.plasticType}
              className="w-full h-56 object-cover"
            />
          </div>
        )}

        {/* Seller & Location meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-800 shrink-0" />
            <div>
              <span className="font-semibold text-slate-800">Supplier:</span> {listing.sellerOrg}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-800 shrink-0" />
            <div>
              <span className="font-semibold text-slate-800">Location:</span> {listing.city}, {listing.state}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-800 shrink-0" />
            <div>
              <span className="font-semibold text-slate-800">Listed on:</span>{' '}
              {new Date(listing.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-800 shrink-0" />
            <div>
              <span className="font-semibold text-slate-800">Lot Volume:</span>{' '}
              {listing.quantityKg.toLocaleString()} kg
            </div>
          </div>
        </div>

        {/* Condition and Contamination */}
        <div className="mb-4">
          <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider mb-1">
            Material Condition & Contamination
          </h4>
          <p className="text-sm text-slate-800 bg-white border border-slate-200 p-2.5 rounded">
            {listing.condition}
          </p>
        </div>

        {/* Optional Description */}
        {listing.description && (
          <div className="mb-4">
            <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider mb-1">
              Description
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {listing.description}
            </p>
          </div>
        )}

        {/* Price Breakdown Section (Requirement 8) */}
        <div className="border border-slate-200 rounded-lg p-3.5 mb-5 bg-slate-50/70">
          <h4 className="text-xs font-bold uppercase text-slate-800 tracking-wider mb-2 flex items-center justify-between">
            <span>Price Comparison & Financial Breakdown</span>
            <span className="text-[10px] lowercase font-normal text-slate-500">
              (No invented charges)
            </span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="bg-white p-2 border border-slate-200 rounded">
              <span className="text-slate-500 block text-[11px]">Asking Price per kg:</span>
              <span className="font-semibold text-slate-900">{priceBreakdown.askingPricePerKgText}</span>
            </div>

            <div className="bg-white p-2 border border-slate-200 rounded">
              <span className="text-slate-500 block text-[11px]">Target Quantity:</span>
              <span className="font-semibold text-slate-900">{priceBreakdown.requestedQuantityKg.toLocaleString()} kg</span>
            </div>

            <div className="bg-white p-2 border border-slate-200 rounded">
              <span className="text-slate-500 block text-[11px]">Material Subtotal:</span>
              <span className="font-semibold text-emerald-800">{priceBreakdown.materialSubtotalText}</span>
            </div>

            <div className="bg-white p-2 border border-slate-200 rounded">
              <span className="text-slate-500 block text-[11px]">Transport Cost:</span>
              <span className="font-medium text-slate-700">{priceBreakdown.transportCostText}</span>
            </div>

            <div className="bg-white p-2 border border-slate-200 rounded">
              <span className="text-slate-500 block text-[11px]">Other Charges:</span>
              <span className="font-medium text-slate-700">{priceBreakdown.otherChargesText}</span>
            </div>

            <div className="bg-white p-2 border border-slate-200 rounded">
              <span className="text-slate-500 block text-[11px]">Final Negotiated Price:</span>
              <span className="font-medium text-slate-700">{priceBreakdown.finalNegotiatedPriceText}</span>
            </div>
          </div>
        </div>

        {/* Recycler Enquiry Action */}
        {!isOwner && listing.status === 'Available' && (
          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Send Enquiry to Supplier</h3>

            {submitted ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Enquiry submitted successfully! Visible in your Enquiries tab.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitEnquiry} className="space-y-3">
                {error && (
                  <div className="p-2 bg-red-50 border border-red-200 text-red-800 rounded text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Requested Quantity (kg) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={requestedQty}
                      onChange={(e) => setRequestedQty(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Buyer Organization
                    </label>
                    <input
                      type="text"
                      disabled
                      value={currentUser.organizationName}
                      className="w-full px-3 py-1.5 border border-slate-200 bg-slate-100 rounded text-xs text-slate-600 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Message / Logistics Notes <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. Can arrange our self-loading transport by Friday."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-900"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3.5 py-1.5 border border-slate-300 text-slate-700 rounded text-xs font-medium hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Enquiry</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {isOwner && (
          <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-xs text-slate-500">
            <span>You are viewing your own industry listing.</span>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded text-xs hover:bg-slate-50 cursor-pointer font-medium"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
