import React, { useState, useEffect } from 'react';
import { UserProfile, WasteListing, Enquiry, UserRole, EnquiryStatus } from './types';
import { 
  getStoredUser, 
  saveStoredUser, 
  isSessionActive, 
  setSessionActive, 
  getStoredListings, 
  saveStoredListings, 
  getStoredEnquiries, 
  saveStoredEnquiries, 
  resetDemoData 
} from './utils/storage';
import { AuthPage } from './components/AuthPage';
import { Navbar } from './components/Navbar';
import { Sidebar, PageId } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { IndustryDashboard } from './components/IndustryDashboard';
import { MyListingsView } from './components/MyListingsView';
import { FindWasteView } from './components/FindWasteView';
import { SmartMatchingView } from './components/SmartMatchingView';
import { EnquiriesView } from './components/EnquiriesView';
import { CollectionsView } from './components/CollectionsView';
import { ProfileView } from './components/ProfileView';
import { ListingModal } from './components/ListingModal';
import { ListingDetailModal } from './components/ListingDetailModal';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isSessionActive());
  const [activeRole, setActiveRole] = useState<UserRole>('Industry');
  const [currentPage, setCurrentPage] = useState<PageId>('industry-dashboard');

  // Data collections
  const [listings, setListings] = useState<WasteListing[]>(() => getStoredListings());
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => getStoredEnquiries());

  // Modals
  const [listingModalOpen, setListingModalOpen] = useState<boolean>(false);
  const [editingListing, setEditingListing] = useState<WasteListing | null>(null);
  const [detailListing, setDetailListing] = useState<WasteListing | null>(null);

  // Sync role with logged-in user role initially
  useEffect(() => {
    if (user) {
      setActiveRole(user.role);
      setCurrentPage(user.role === 'Industry' ? 'industry-dashboard' : 'find-waste');
    }
  }, [user?.role]);

  // Persist listings whenever changed
  const updateListingsState = (newListings: WasteListing[]) => {
    setListings(newListings);
    saveStoredListings(newListings);
  };

  // Persist enquiries whenever changed
  const updateEnquiriesState = (newEnquiries: Enquiry[]) => {
    setEnquiries(newEnquiries);
    saveStoredEnquiries(newEnquiries);
  };

  // Auth Handlers
  const handleLoginSuccess = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
    saveStoredUser(authenticatedUser);
    setIsAuthenticated(true);
    setSessionActive(true);
    setActiveRole(authenticatedUser.role);
    setCurrentPage(authenticatedUser.role === 'Industry' ? 'industry-dashboard' : 'find-waste');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSessionActive(false);
    setCurrentPage('industry-dashboard');
  };

  const handleResetDemoData = () => {
    resetDemoData();
    setUser(getStoredUser());
    setListings(getStoredListings());
    setEnquiries(getStoredEnquiries());
    setIsAuthenticated(true);
    setSessionActive(true);
    setActiveRole('Industry');
    setCurrentPage('industry-dashboard');
  };

  const handleToggleRole = () => {
    const nextRole: UserRole = activeRole === 'Industry' ? 'Recycler' : 'Industry';
    setActiveRole(nextRole);
    if (nextRole === 'Industry') {
      setCurrentPage('industry-dashboard');
    } else {
      setCurrentPage('find-waste');
    }
  };

  // Waste Listing CRUD Handlers
  const handleOpenCreateListing = () => {
    setEditingListing(null);
    setListingModalOpen(true);
  };

  const handleEditListing = (listing: WasteListing) => {
    setEditingListing(listing);
    setListingModalOpen(true);
  };

  const handleSaveListing = (
    listingData: Omit<WasteListing, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    if (existingId) {
      // Edit
      const updated = listings.map((item) =>
        item.id === existingId
          ? {
              ...item,
              ...listingData,
            }
          : item
      );
      updateListingsState(updated);
    } else {
      // Create new
      const newListing: WasteListing = {
        ...listingData,
        id: `rec-list-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      updateListingsState([newListing, ...listings]);
    }
  };

  const handleDeleteListing = (listingId: string) => {
    const updated = listings.filter((item) => item.id !== listingId);
    updateListingsState(updated);
  };

  // Enquiry Handlers
  const handleSendSingleEnquiry = (
    listing: WasteListing,
    requestedQty: number,
    message: string
  ) => {
    const newEnquiry: Enquiry = {
      id: `enq-${Date.now()}`,
      listingId: listing.id,
      listingSnapshot: {
        plasticType: listing.plasticType,
        grade: listing.grade,
        condition: listing.condition,
        sellerOrg: listing.sellerOrg,
        city: listing.city,
        state: listing.state,
        expectedPricePerKg: listing.expectedPricePerKg,
        totalAvailableKg: listing.quantityKg,
      },
      recycler: {
        fullName: user?.fullName || 'Vikram Patel',
        organizationName: user?.organizationName || 'GreenCycle Granules Ltd',
        phone: user?.phone || '+91 9876543210',
        city: user?.city || 'Pune',
        state: user?.state || 'Maharashtra',
      },
      requestedQuantityKg: requestedQty,
      message: message || undefined,
      proposedPricePerKg: listing.expectedPricePerKg,
      agreedPricePerKg: null,
      transportCost: null,
      otherCharges: null,
      requestDate: new Date().toISOString(),
      currentStatus: 'Enquiry Sent',
      history: [
        {
          status: 'Enquiry Sent',
          timestamp: new Date().toISOString(),
          updatedBy: `${user?.organizationName || 'Buyer'}`,
          note: message ? `Enquiry sent: "${message}"` : 'Enquiry sent for material procurement.',
        },
      ],
    };

    updateEnquiriesState([newEnquiry, ...enquiries]);

    // Update listing status to 'Request Received' if full quantity was requested
    if (requestedQty >= listing.quantityKg) {
      const updatedListings = listings.map((l) =>
        l.id === listing.id ? { ...l, status: 'Request Received' as const } : l
      );
      updateListingsState(updatedListings);
    }
  };

  const handleSendBatchEnquiry = (
    batchListings: WasteListing[],
    totalRequestedQty: number,
    message: string
  ) => {
    const newBatchEnquiries: Enquiry[] = batchListings.map((item, idx) => ({
      id: `enq-batch-${Date.now()}-${idx}`,
      listingId: item.id,
      listingSnapshot: {
        plasticType: item.plasticType,
        grade: item.grade,
        condition: item.condition,
        sellerOrg: item.sellerOrg,
        city: item.city,
        state: item.state,
        expectedPricePerKg: item.expectedPricePerKg,
        totalAvailableKg: item.quantityKg,
      },
      recycler: {
        fullName: user?.fullName || 'Vikram Patel',
        organizationName: user?.organizationName || 'GreenCycle Granules Ltd',
        phone: user?.phone || '+91 9876543210',
        city: user?.city || 'Pune',
        state: user?.state || 'Maharashtra',
      },
      requestedQuantityKg: item.quantityKg,
      message: message ? `[Batch Coordinated Enquiry] ${message}` : 'Coordinated batch enquiry for lot.',
      proposedPricePerKg: item.expectedPricePerKg,
      agreedPricePerKg: null,
      transportCost: null,
      otherCharges: null,
      requestDate: new Date().toISOString(),
      currentStatus: 'Enquiry Sent',
      history: [
        {
          status: 'Enquiry Sent',
          timestamp: new Date().toISOString(),
          updatedBy: `${user?.organizationName || 'Buyer'}`,
          note: `Batch enquiry initiated for ${item.quantityKg.toLocaleString()} kg.`,
        },
      ],
    }));

    updateEnquiriesState([...newBatchEnquiries, ...enquiries]);
  };

  const handleUpdateEnquiryStatus = (
    enquiryId: string,
    newStatus: EnquiryStatus,
    note?: string,
    extraData?: {
      agreedPricePerKg?: number | null;
      transportCost?: number | null;
      scheduledCollectionDate?: string;
    }
  ) => {
    const updated = enquiries.map((enq) => {
      if (enq.id !== enquiryId) return enq;

      const newHistoryEntry = {
        status: newStatus,
        timestamp: new Date().toISOString(),
        updatedBy: `${user?.organizationName || 'User'}`,
        note: note || `Status advanced to ${newStatus}`,
      };

      return {
        ...enq,
        currentStatus: newStatus,
        agreedPricePerKg:
          extraData?.agreedPricePerKg !== undefined
            ? extraData.agreedPricePerKg
            : enq.agreedPricePerKg,
        transportCost:
          extraData?.transportCost !== undefined
            ? extraData.transportCost
            : enq.transportCost,
        scheduledCollectionDate:
          extraData?.scheduledCollectionDate !== undefined
            ? extraData.scheduledCollectionDate
            : enq.scheduledCollectionDate,
        history: [...enq.history, newHistoryEntry],
      };
    });

    updateEnquiriesState(updated);

    // If advanced to 'Collection Scheduled' or 'Collected', sync listing status as well
    const targetEnq = enquiries.find((e) => e.id === enquiryId);
    if (targetEnq && (newStatus === 'Collection Scheduled' || newStatus === 'Collected')) {
      const updatedListings = listings.map((l) =>
        l.id === targetEnq.listingId ? { ...l, status: newStatus } : l
      );
      updateListingsState(updatedListings);
    }
  };

  // FIRST SCREEN: If not logged in, render the clean AuthPage directly
  if (!isAuthenticated || !user) {
    return (
      <AuthPage
        onLoginSuccess={handleLoginSuccess}
        existingUser={user}
      />
    );
  }

  // Active metrics for badges
  const myListings = listings.filter(
    (l) => l.sellerId === 'demo-user-1' || l.sellerOrg === user.organizationName
  );
  const activeListingsCount = myListings.filter((l) => l.status === 'Available').length;
  const pendingEnquiriesCount = enquiries.filter((e) => e.currentStatus === 'Enquiry Sent').length;
  const scheduledCollectionsCount = enquiries.filter(
    (e) => e.currentStatus === 'Collection Scheduled'
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 pb-16 md:pb-0">
      {/* Main Navbar */}
      <Navbar
        user={user}
        activeRole={activeRole}
        onToggleRole={handleToggleRole}
        onLogout={handleLogout}
        onOpenProfile={() => setCurrentPage('profile')}
      />

      {/* App Body with Sidebar + Main Content Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          role={activeRole}
          currentPage={currentPage}
          onNavigate={(page) => setCurrentPage(page)}
          onOpenCreateListing={handleOpenCreateListing}
          activeListingCount={activeListingsCount}
          pendingEnquiryCount={pendingEnquiriesCount}
          scheduledCollectionCount={scheduledCollectionsCount}
        />

        {/* Page Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Industry Views */}
          {activeRole === 'Industry' && currentPage === 'industry-dashboard' && (
            <IndustryDashboard
              user={user}
              listings={listings}
              enquiries={enquiries}
              onNavigate={(page) => setCurrentPage(page)}
              onOpenCreateListing={handleOpenCreateListing}
              onViewListing={(item) => setDetailListing(item)}
            />
          )}

          {activeRole === 'Industry' && currentPage === 'my-listings' && (
            <MyListingsView
              user={user}
              listings={listings}
              onOpenCreate={handleOpenCreateListing}
              onEditListing={handleEditListing}
              onDeleteListing={handleDeleteListing}
              onViewListing={(item) => setDetailListing(item)}
            />
          )}

          {/* Recycler Views */}
          {activeRole === 'Recycler' && currentPage === 'find-waste' && (
            <FindWasteView
              listings={listings}
              currentUser={user}
              onViewListing={(item) => setDetailListing(item)}
              onNavigateToSmartMatches={() => setCurrentPage('smart-matches')}
            />
          )}

          {activeRole === 'Recycler' && currentPage === 'smart-matches' && (
            <SmartMatchingView
              listings={listings}
              currentUser={user}
              onSendBatchEnquiry={handleSendBatchEnquiry}
              onViewSingleListing={(item) => setDetailListing(item)}
            />
          )}

          {/* Shared Views (Role sensitive) */}
          {currentPage === 'enquiries' && (
            <EnquiriesView
              enquiries={enquiries}
              currentUser={{ ...user, role: activeRole }}
              onUpdateEnquiryStatus={handleUpdateEnquiryStatus}
            />
          )}

          {currentPage === 'collections' && (
            <CollectionsView
              enquiries={enquiries}
              currentUser={{ ...user, role: activeRole }}
              onUpdateStatus={handleUpdateEnquiryStatus}
            />
          )}

          {currentPage === 'profile' && (
            <ProfileView
              user={{ ...user, role: activeRole }}
              onUpdateProfile={(updated) => {
                setUser(updated);
                saveStoredUser(updated);
              }}
              onLogout={handleLogout}
              onResetDemo={handleResetDemoData}
              onToggleRole={handleToggleRole}
            />
          )}
        </main>
      </div>

      {/* Mobile Compact Bottom Navigation */}
      <MobileBottomNav
        role={activeRole}
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        pendingEnquiryCount={pendingEnquiriesCount}
        scheduledCollectionCount={scheduledCollectionsCount}
      />

      {/* Listing Creation & Editing Modal */}
      <ListingModal
        isOpen={listingModalOpen}
        onClose={() => {
          setListingModalOpen(false);
          setEditingListing(null);
        }}
        onSave={handleSaveListing}
        editingListing={editingListing}
        defaultSellerOrg={user.organizationName}
        defaultCity={user.city}
        defaultState={user.state}
        defaultPhone={user.phone}
      />

      {/* Detailed Listing View with Price Calculation and Enquiry Action */}
      <ListingDetailModal
        listing={detailListing}
        isOpen={!!detailListing}
        onClose={() => setDetailListing(null)}
        currentUser={user}
        onSendEnquiry={handleSendSingleEnquiry}
        isOwner={
          activeRole === 'Industry' &&
          (detailListing?.sellerId === 'demo-user-1' ||
            detailListing?.sellerOrg === user.organizationName)
        }
      />
    </div>
  );
}
