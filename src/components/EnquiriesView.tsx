import React, { useState } from 'react';
import { 
  Inbox, 
  CheckCircle2, 
  Clock, 
  Truck, 
  CheckCheck, 
  Calendar, 
  MapPin, 
  Building, 
  Filter,
  Check,
  Circle
} from 'lucide-react';
import { Enquiry, EnquiryStatus, UserProfile } from '../types';
import { calculatePriceBreakdown } from '../utils/pricing';

interface EnquiriesViewProps {
  enquiries: Enquiry[];
  currentUser: UserProfile;
  onUpdateEnquiryStatus: (
    enquiryId: string, 
    newStatus: EnquiryStatus, 
    note?: string,
    extraData?: {
      agreedPricePerKg?: number | null;
      transportCost?: number | null;
      scheduledCollectionDate?: string;
    }
  ) => void;
}

const STATUS_STEPS: EnquiryStatus[] = [
  'Enquiry Sent',
  'Confirmed',
  'Collection Scheduled',
  'Collected',
];

export const EnquiriesView: React.FC<EnquiriesViewProps> = ({
  enquiries,
  currentUser,
  onUpdateEnquiryStatus,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  // Status update modal state
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [targetStatus, setTargetStatus] = useState<EnquiryStatus>('Confirmed');
  const [updateNote, setUpdateNote] = useState<string>('');
  const [agreedPrice, setAgreedPrice] = useState<string>('');
  const [transportCost, setTransportCost] = useState<string>('');
  const [scheduleDate, setScheduleDate] = useState<string>('');

  const relevantEnquiries = enquiries.filter((e) => {
    if (currentUser.role === 'Industry') {
      return (
        e.listingSnapshot.sellerOrg === currentUser.organizationName ||
        e.listingSnapshot.sellerOrg.includes('EcoApex') ||
        e.listingSnapshot.sellerOrg.includes('Industry') ||
        true
      );
    } else {
      return true;
    }
  });

  const filteredEnquiries = relevantEnquiries.filter((e) => {
    if (statusFilter === 'All') return true;
    return e.currentStatus === statusFilter;
  });

  const handleOpenStatusModal = (enquiry: Enquiry, nextStatus: EnquiryStatus) => {
    setSelectedEnquiry(enquiry);
    setTargetStatus(nextStatus);
    setUpdateNote('');
    setAgreedPrice(
      enquiry.agreedPricePerKg
        ? enquiry.agreedPricePerKg.toString()
        : enquiry.listingSnapshot.expectedPricePerKg?.toString() || ''
    );
    setTransportCost(enquiry.transportCost ? enquiry.transportCost.toString() : '');
    setScheduleDate(
      enquiry.scheduledCollectionDate ||
        new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
    );
    setShowUpdateModal(true);
  };

  const handleConfirmStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    onUpdateEnquiryStatus(
      selectedEnquiry.id,
      targetStatus,
      updateNote.trim() || undefined,
      {
        agreedPricePerKg: agreedPrice ? parseFloat(agreedPrice) : null,
        transportCost: transportCost ? parseFloat(transportCost) : null,
        scheduledCollectionDate: scheduleDate || undefined,
      }
    );

    setShowUpdateModal(false);
    setSelectedEnquiry(null);
  };

  const getStepIndex = (status: EnquiryStatus) => {
    return STATUS_STEPS.indexOf(status);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {currentUser.role === 'Industry' ? 'Incoming Enquiries' : 'My Enquiries'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track material requests, price agreements, logistics scheduling, and collection progress.
          </p>
        </div>

        {/* Status filter dropdown */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-800 bg-white font-medium"
          >
            <option value="All">All Statuses ({relevantEnquiries.length})</option>
            <option value="Enquiry Sent">Enquiry Sent</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Collection Scheduled">Collection Scheduled</option>
            <option value="Collected">Collected</option>
          </select>
        </div>
      </div>

      {/* Enquiries List */}
      {filteredEnquiries.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
          <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No enquiries found under this filter.</p>
          <p className="text-xs text-slate-500 mt-1">
            {currentUser.role === 'Industry'
              ? 'New enquiries submitted by recyclers will appear here.'
              : 'Browse "Find Waste" or use "Smart Matches" to submit an enquiry.'}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredEnquiries.map((enquiry) => {
            const currentStepIdx = getStepIndex(enquiry.currentStatus);
            const priceBreakdown = calculatePriceBreakdown({
              askingPricePerKg: enquiry.listingSnapshot.expectedPricePerKg,
              requestedQuantityKg: enquiry.requestedQuantityKg,
              finalNegotiatedPricePerKg: enquiry.agreedPricePerKg,
              transportCost: enquiry.transportCost,
              otherCharges: enquiry.otherCharges,
            });

            return (
              <div
                key={enquiry.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5"
              >
                {/* Header bar of enquiry card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-800 text-white">
                      {enquiry.listingSnapshot.plasticType}
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {enquiry.requestedQuantityKg.toLocaleString()} kg Requested
                    </span>
                    <span className="text-xs text-slate-500">
                      • {enquiry.listingSnapshot.grade}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Requested: {new Date(enquiry.requestDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Main 2-column layout: Info on left, Clean Vertical Progress Tracker on right */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Parties & Financial Breakdown */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* Parties info */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center gap-2">
                        <Building className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                        <span className="text-slate-500">Supplier:</span>
                        <span className="font-semibold text-slate-900">{enquiry.listingSnapshot.sellerOrg}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Inbox className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                        <span className="text-slate-500">Buyer (Recycler):</span>
                        <span className="font-semibold text-slate-900">
                          {enquiry.recycler.organizationName} ({enquiry.recycler.fullName})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                        <span className="text-slate-500">Location:</span>
                        <span className="font-semibold text-slate-900">
                          {enquiry.listingSnapshot.city}, {enquiry.listingSnapshot.state}
                        </span>
                      </div>
                      {enquiry.scheduledCollectionDate && (
                        <div className="flex items-center gap-2 text-emerald-900 font-semibold bg-emerald-100/70 p-2 rounded-lg">
                          <Truck className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                          <span>Scheduled Pickup Date: {enquiry.scheduledCollectionDate}</span>
                        </div>
                      )}
                    </div>

                    {/* Price Breakdown */}
                    <div className="border border-slate-200 rounded-xl p-4 bg-white text-xs space-y-1.5">
                      <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                        Financial Summary
                      </h4>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Asking Price:</span>
                        <span className="font-medium text-slate-900">{priceBreakdown.askingPricePerKgText}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Agreed Price:</span>
                        <span className="font-semibold text-emerald-800">{priceBreakdown.finalNegotiatedPriceText}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Transport Logistics:</span>
                        <span className="text-slate-700">{priceBreakdown.transportCostText}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-slate-100 font-bold text-sm">
                        <span className="text-slate-800">Estimated Total:</span>
                        <span className="text-slate-900">{priceBreakdown.estimatedTotalText}</span>
                      </div>
                    </div>

                    {/* Recycler message */}
                    {enquiry.message && (
                      <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-700">
                        <span className="font-semibold text-slate-900">Buyer Message: </span>
                        <span className="italic">"{enquiry.message}"</span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Clean Vertical Progress Tracker with dates and status */}
                  <div className="lg:col-span-5 bg-slate-50 p-5 rounded-xl border border-slate-200">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center justify-between">
                      <span>Collection Workflow</span>
                      <span className="text-[10px] lowercase font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        {enquiry.currentStatus}
                      </span>
                    </h3>

                    {/* Vertical Step Tracker */}
                    <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                      {STATUS_STEPS.map((stepName, sIdx) => {
                        const isCompleted = sIdx <= currentStepIdx;
                        const isCurrent = sIdx === currentStepIdx;
                        const historyMatch = enquiry.history.find((h) => h.status === stepName);

                        return (
                          <div key={stepName} className="relative">
                            {/* Step Node Icon */}
                            <div
                              className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                                isCompleted
                                  ? 'bg-emerald-800 text-white ring-4 ring-emerald-100'
                                  : 'bg-white text-slate-400 border-2 border-slate-300'
                              }`}
                            >
                              {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : sIdx + 1}
                            </div>

                            {/* Step Details */}
                            <div>
                              <div className="flex items-center justify-between gap-1">
                                <span
                                  className={`text-xs font-bold leading-tight ${
                                    isCurrent
                                      ? 'text-emerald-900'
                                      : isCompleted
                                      ? 'text-slate-800'
                                      : 'text-slate-400'
                                  }`}
                                >
                                  {stepName}
                                </span>
                                {historyMatch && (
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {new Date(historyMatch.timestamp).toLocaleDateString()}
                                  </span>
                                )}
                              </div>

                              {historyMatch?.note ? (
                                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                  {historyMatch.note}
                                </p>
                              ) : (
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  {isCompleted ? 'Completed' : 'Pending next workflow step'}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Action button inside tracker */}
                    <div className="mt-6 pt-4 border-t border-slate-200">
                      {enquiry.currentStatus === 'Enquiry Sent' && (
                        <button
                          type="button"
                          onClick={() => handleOpenStatusModal(enquiry, 'Confirmed')}
                          className="w-full py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors"
                        >
                          Confirm Deal Terms
                        </button>
                      )}

                      {enquiry.currentStatus === 'Confirmed' && (
                        <button
                          type="button"
                          onClick={() => handleOpenStatusModal(enquiry, 'Collection Scheduled')}
                          className="w-full py-2 px-3 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Schedule Collection</span>
                        </button>
                      )}

                      {enquiry.currentStatus === 'Collection Scheduled' && (
                        <button
                          type="button"
                          onClick={() => handleOpenStatusModal(enquiry, 'Collected')}
                          className="w-full py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Mark as Collected</span>
                        </button>
                      )}

                      {enquiry.currentStatus === 'Collected' && (
                        <div className="p-2 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-semibold text-center flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                          <span>Collection Fully Completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Status Update Modal */}
      {showUpdateModal && selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 p-6 relative">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Advance Status to "{targetStatus}"
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Lot: {selectedEnquiry.requestedQuantityKg.toLocaleString()} kg of {selectedEnquiry.listingSnapshot.plasticType}
            </p>

            <form onSubmit={handleConfirmStatusUpdate} className="space-y-4">
              {targetStatus === 'Confirmed' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Agreed Price per kg (₹)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={agreedPrice}
                    onChange={(e) => setAgreedPrice(e.target.value)}
                    placeholder="e.g. 34"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              )}

              {targetStatus === 'Collection Scheduled' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Scheduled Pickup Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Transport / Logistics Cost (₹) <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={transportCost}
                      onChange={(e) => setTransportCost(e.target.value)}
                      placeholder="e.g. 4500 (Leave empty if not provided)"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900"
                    />
                  </div>
                </>
              )}

              {targetStatus === 'Collected' && (
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-xs text-emerald-900">
                  <p className="font-semibold">Confirm Material Handover</p>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Confirm that vehicle collection has completed, material has cleared weighbridge, and transfer receipt is acknowledged.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status Note / Log Message
                </label>
                <input
                  type="text"
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  placeholder="e.g. Terms confirmed and pickup logistics arranged."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="px-3.5 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Save & Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
