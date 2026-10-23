import React, { useState } from 'react';
import { Truck, CheckCircle2, Clock, Calendar, MapPin, Building, Weight, CheckCheck, AlertCircle } from 'lucide-react';
import { Enquiry, UserProfile, EnquiryStatus } from '../types';

interface CollectionsViewProps {
  enquiries: Enquiry[];
  currentUser: UserProfile;
  onUpdateStatus: (
    enquiryId: string, 
    newStatus: EnquiryStatus, 
    note?: string
  ) => void;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  enquiries,
  currentUser,
  onUpdateStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'scheduled' | 'collected'>('scheduled');
  const [confirmCollectedId, setConfirmCollectedId] = useState<string | null>(null);

  // Filter collections relevant to current user role
  const userCollections = enquiries.filter((e) => {
    const isScheduledOrCollected =
      e.currentStatus === 'Collection Scheduled' || e.currentStatus === 'Collected';
    if (!isScheduledOrCollected) return false;

    if (currentUser.role === 'Industry') {
      return (
        e.listingSnapshot.sellerOrg === currentUser.organizationName ||
        e.listingSnapshot.sellerOrg.includes('EcoApex') ||
        e.listingSnapshot.sellerOrg.includes('Industry') ||
        true // In demo prototype, display all relevant collections for comprehensive demonstration
      );
    } else {
      return true; // Display collections with role perspective
    }
  });

  const scheduledList = userCollections.filter((e) => e.currentStatus === 'Collection Scheduled');
  const collectedList = userCollections.filter((e) => e.currentStatus === 'Collected');

  const currentList = activeTab === 'scheduled' ? scheduledList : collectedList;

  const handleMarkAsCollected = (id: string) => {
    onUpdateStatus(id, 'Collected', 'Material handover completed and weighbridge certificate recorded.');
    setConfirmCollectedId(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
              Logistics & Fulfillment
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {scheduledList.length} Scheduled • {collectedList.length} Completed
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Collections Tracking</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor confirmed vehicle pickups, transport logistics, and verified deliveries.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('scheduled')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
              activeTab === 'scheduled'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Scheduled Pickups ({scheduledList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('collected')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
              activeTab === 'collected'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed Collections ({collectedList.length})
          </button>
        </div>
      </div>

      {/* Collections Cards */}
      {currentList.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-lg border border-slate-200">
          <Truck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">
            {activeTab === 'scheduled'
              ? 'No collections currently scheduled.'
              : 'No completed collections recorded yet.'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {activeTab === 'scheduled'
              ? 'When an enquiry is advanced to "Collection Scheduled", logistics details appear here.'
              : 'Collections marked as completed will be archived here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-800 text-white">
                      {item.listingSnapshot.plasticType}
                    </span>
                    <span className="text-xs font-semibold text-slate-900">
                      {item.requestedQuantityKg.toLocaleString()} kg
                    </span>
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                      item.currentStatus === 'Collection Scheduled'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {item.currentStatus}
                  </span>
                </div>

                <div className="pt-3 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-800 shrink-0" />
                    <span className="font-semibold text-slate-800">Target Date:</span>
                    <span>{item.scheduledCollectionDate || 'Pending final dispatch date'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-800 shrink-0" />
                    <span className="font-semibold text-slate-800">Pickup Origin:</span>
                    <span>{item.listingSnapshot.city}, {item.listingSnapshot.state}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-emerald-800 shrink-0" />
                    <span className="font-semibold text-slate-800">Supplier:</span>
                    <span>{item.listingSnapshot.sellerOrg}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Weight className="w-4 h-4 text-emerald-800 shrink-0" />
                    <span className="font-semibold text-slate-800">Buyer:</span>
                    <span>{item.recycler.organizationName}</span>
                  </div>

                  {item.transportCost && (
                    <div className="p-2 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-700">
                      <span className="font-semibold">Transport Cost: </span>
                      <span>₹{item.transportCost.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  Ref #{item.id.slice(-6)}
                </span>

                {item.currentStatus === 'Collection Scheduled' && (
                  <button
                    type="button"
                    onClick={() => setConfirmCollectedId(item.id)}
                    className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Complete Collection</span>
                  </button>
                )}

                {item.currentStatus === 'Collected' && (
                  <div className="flex items-center gap-1 text-xs text-emerald-800 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Fulfilled & Received</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog for Completion */}
      {confirmCollectedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full border border-slate-200 p-5 text-slate-800">
            <h3 className="text-base font-bold text-slate-900 mb-2">Mark Collection Completed?</h3>
            <p className="text-xs text-slate-600 mb-4">
              Confirm that the scrap lot was physically picked up by transport, weighed, and received by the recycler facility.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmCollectedId(null)}
                className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded text-xs font-medium hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleMarkAsCollected(confirmCollectedId)}
                className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-xs font-semibold cursor-pointer"
              >
                Confirm Completed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
