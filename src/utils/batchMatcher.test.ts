import test from 'node:test';
import assert from 'node:assert/strict';
import { findSmartBatchMatches } from './batchMatcher';
import { WasteListing } from '../types';

const mockListings: WasteListing[] = [
  {
    id: 'listing-1',
    sellerId: 'user-1',
    sellerOrg: 'Alpha Polymers Ltd',
    sellerCity: 'Pune',
    sellerState: 'Maharashtra',
    sellerPhone: '+91 9876543210',
    plasticType: 'PET',
    quantityKg: 2000,
    grade: 'Grade A - Clean / Post-Industrial',
    condition: 'Baled, clear bottles, caps removed',
    city: 'Pune',
    state: 'Maharashtra',
    expectedPricePerKg: 32,
    createdAt: '2026-10-20',
    status: 'Available',
  },
  {
    id: 'listing-2',
    sellerId: 'user-2',
    sellerOrg: 'Beta Packaging',
    sellerCity: 'Mumbai',
    sellerState: 'Maharashtra',
    sellerPhone: '+91 9876543210',
    plasticType: 'PET',
    quantityKg: 3000,
    grade: 'Grade A - Clean / Post-Industrial',
    condition: 'Washed flakes',
    city: 'Mumbai',
    state: 'Maharashtra',
    expectedPricePerKg: 35,
    createdAt: '2026-10-21',
    status: 'Available',
  },
  {
    id: 'listing-3',
    sellerId: 'user-3',
    sellerOrg: 'Gujarat Auto Comp',
    sellerCity: 'Ahmedabad',
    sellerState: 'Gujarat',
    sellerPhone: '+91 9876543210',
    plasticType: 'HDPE',
    quantityKg: 5000,
    grade: 'Grade B - Washed / Minor Contamination',
    condition: 'Blow-molded drums crushed',
    city: 'Ahmedabad',
    state: 'Gujarat',
    expectedPricePerKg: 45,
    createdAt: '2026-10-19',
    status: 'Available',
  },
  {
    id: 'listing-4',
    sellerId: 'user-4',
    sellerOrg: 'Delhi Techno plastics',
    sellerCity: 'Delhi',
    sellerState: 'Delhi',
    sellerPhone: '+91 9876543210',
    plasticType: 'PET',
    quantityKg: 1500,
    grade: 'Grade C - Mixed / Post-Consumer',
    condition: 'Unsorted baled',
    city: 'Delhi',
    state: 'Delhi',
    expectedPricePerKg: null,
    createdAt: '2026-10-18',
    status: 'Collected', // Not available!
  },
];

test('findSmartBatchMatches filters strictly by plastic type and available status', () => {
  const matches = findSmartBatchMatches(mockListings, {
    plasticType: 'PET',
    requiredQuantityKg: 2000,
  });

  // Should find PET listings 1 and 2, but NOT HDPE (listing-3) or Collected (listing-4)
  assert.ok(matches.length > 0);
  for (const match of matches) {
    for (const item of match.listings) {
      assert.equal(item.plasticType, 'PET');
      assert.equal(item.status, 'Available');
    }
  }
});

test('findSmartBatchMatches prioritizes exact single supplier matches', () => {
  const matches = findSmartBatchMatches(mockListings, {
    plasticType: 'PET',
    requiredQuantityKg: 2000,
    preferredLocation: 'Pune',
  });

  assert.ok(matches.length > 0);
  const topMatch = matches[0];
  assert.equal(topMatch.isCombinedBatch, false);
  assert.equal(topMatch.listings[0].id, 'listing-1');
  assert.equal(topMatch.totalQuantityKg, 2000);
});

test('findSmartBatchMatches combines compatible listings to reach high volume targets', () => {
  const matches = findSmartBatchMatches(mockListings, {
    plasticType: 'PET',
    requiredQuantityKg: 4800,
    preferredLocation: 'Maharashtra',
  });

  const combinedMatch = matches.find((m) => m.isCombinedBatch);
  assert.ok(combinedMatch, 'Expected a combined batch suggestion');
  assert.equal(combinedMatch.listings.length, 2);
  assert.equal(combinedMatch.totalQuantityKg, 5000); // 2000 + 3000
  // Verify distinct listings (no duplication)
  assert.notEqual(combinedMatch.listings[0].id, combinedMatch.listings[1].id);
});

test('findSmartBatchMatches returns empty array when no listings match plastic type', () => {
  const matches = findSmartBatchMatches(mockListings, {
    plasticType: 'ABS',
    requiredQuantityKg: 1000,
  });
  assert.equal(matches.length, 0);
});
