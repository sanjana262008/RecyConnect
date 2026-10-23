import { WasteListing, PlasticType, BatchSuggestion } from '../types';

export interface BatchMatchCriteria {
  plasticType: PlasticType;
  grade?: string; // e.g. specific grade or "Any"
  requiredQuantityKg: number;
  preferredLocation?: string; // City or State
}

/**
 * Normalizes string for fuzzy/case-insensitive location and grade checking
 */
function normalize(str?: string): string {
  return (str || '').trim().toLowerCase();
}

/**
 * Checks location proximity score:
 * 3 = exact city match
 * 2 = exact state match
 * 1 = location mentioned in query or city
 * 0 = different location / not specified
 */
function computeLocationScore(listing: WasteListing, targetLocation?: string): number {
  if (!targetLocation || !targetLocation.trim()) return 1; // neutral if no preference
  const target = normalize(targetLocation);
  const city = normalize(listing.city);
  const state = normalize(listing.state);

  if (city === target || city.includes(target) || target.includes(city)) return 3;
  if (state === target || state.includes(target) || target.includes(state)) return 2;
  return 0;
}

/**
 * Checks grade compatibility:
 * 3 = exact grade match
 * 2 = grade contains key term (e.g., "grade a", "clean", "post-industrial")
 * 1 = acceptable compatible grade
 */
function computeGradeScore(listing: WasteListing, targetGrade?: string): number {
  if (!targetGrade || targetGrade === 'Any' || !targetGrade.trim()) return 2;
  const lGrade = normalize(listing.grade);
  const tGrade = normalize(targetGrade);

  if (lGrade === tGrade) return 3;
  if (lGrade.includes('grade a') && tGrade.includes('grade a')) return 3;
  if (lGrade.includes('regrind') && tGrade.includes('regrind')) return 3;
  if (lGrade.includes(tGrade) || tGrade.includes(lGrade)) return 2;
  return 1;
}

/**
 * Generates rule-based suggestions for plastic waste fulfillment.
 * Strictly guarantees:
 * - Incompatible plastic types are NEVER combined.
 * - Same listing is NEVER duplicated in a single batch.
 * - Provides clear, human-readable reasons for every match.
 */
export function findSmartBatchMatches(
  listings: WasteListing[],
  criteria: BatchMatchCriteria
): BatchSuggestion[] {
  const { plasticType, grade, requiredQuantityKg, preferredLocation } = criteria;

  if (!plasticType || requiredQuantityKg <= 0) {
    return [];
  }

  // 1. Filter only available listings with EXACT matching plastic type
  const compatibleListings = listings.filter(
    (item) => item.status === 'Available' && item.plasticType === plasticType && item.quantityKg > 0
  );

  if (compatibleListings.length === 0) {
    return [];
  }

  const suggestions: BatchSuggestion[] = [];

  // Sort candidate listings by relevance:
  // grade match first, then location proximity, then largest quantity
  const rankedCandidates = [...compatibleListings].sort((a, b) => {
    const gradeA = computeGradeScore(a, grade);
    const gradeB = computeGradeScore(b, grade);
    if (gradeB !== gradeA) return gradeB - gradeA;

    const locA = computeLocationScore(a, preferredLocation);
    const locB = computeLocationScore(b, preferredLocation);
    if (locB !== locA) return locB - locA;

    return b.quantityKg - a.quantityKg;
  });

  // Strategy A: Individual listings that fulfill or provide significant supply
  for (const item of rankedCandidates) {
    const locScore = computeLocationScore(item, preferredLocation);
    const gradeScore = computeGradeScore(item, grade);
    const meetsExactOrMore = item.quantityKg >= requiredQuantityKg;
    const fulfillmentPct = Math.round((item.quantityKg / requiredQuantityKg) * 100);

    // Consider if meets requirement or provides at least 40% of target
    if (meetsExactOrMore || fulfillmentPct >= 40) {
      let reasonParts: string[] = [];
      if (meetsExactOrMore) {
        reasonParts.push(`Single supplier can fully fulfill requirement (${item.quantityKg.toLocaleString()} kg available vs ${requiredQuantityKg.toLocaleString()} kg requested)`);
      } else {
        reasonParts.push(`Single supplier provides ${item.quantityKg.toLocaleString()} kg (${fulfillmentPct}% of requested target volume)`);
      }

      if (locScore >= 2) {
        reasonParts.push(`Located in preferred area (${item.city}, ${item.state})`);
      }
      if (gradeScore >= 2) {
        reasonParts.push(`Compatible grade: ${item.grade}`);
      }

      const calcSubtotal = item.expectedPricePerKg
        ? item.expectedPricePerKg * Math.min(item.quantityKg, requiredQuantityKg)
        : null;

      suggestions.push({
        id: `single-${item.id}`,
        listings: [item],
        totalQuantityKg: item.quantityKg,
        matchScore: (meetsExactOrMore ? 90 : 60 + Math.min(fulfillmentPct, 100) * 0.25) + locScore * 3 + gradeScore * 2,
        reason: reasonParts.join('. ') + '.',
        averagePricePerKg: item.expectedPricePerKg,
        calculableSubtotal: calcSubtotal,
        isCombinedBatch: false,
      });
    }
  }

  // Strategy B: Combinations of 2 distinct compatible listings
  for (let i = 0; i < rankedCandidates.length; i++) {
    for (let j = i + 1; j < rankedCandidates.length; j++) {
      const item1 = rankedCandidates[i];
      const item2 = rankedCandidates[j];
      const combinedQty = item1.quantityKg + item2.quantityKg;

      // Consider if combination reaches at least 70% of requested quantity or provides meaningful pooled volume
      if (combinedQty >= requiredQuantityKg * 0.7 || combinedQty >= 2000) {
        const loc1 = computeLocationScore(item1, preferredLocation);
        const loc2 = computeLocationScore(item2, preferredLocation);
        const sameState = item1.state.toLowerCase() === item2.state.toLowerCase();

        let reason = `Combined 2 compatible ${plasticType} suppliers to achieve ${combinedQty.toLocaleString()} kg (${item1.sellerOrg}: ${item1.quantityKg.toLocaleString()} kg + ${item2.sellerOrg}: ${item2.quantityKg.toLocaleString()} kg).`;
        if (sameState) {
          reason += ` Both located in ${item1.state} for consolidated logistics.`;
        }

        // Weighted price calculation if prices available
        let totalPriceSum = 0;
        let priceCount = 0;
        if (item1.expectedPricePerKg) {
          totalPriceSum += item1.expectedPricePerKg * item1.quantityKg;
          priceCount += item1.quantityKg;
        }
        if (item2.expectedPricePerKg) {
          totalPriceSum += item2.expectedPricePerKg * item2.quantityKg;
          priceCount += item2.quantityKg;
        }

        const avgPrice = priceCount > 0 ? Math.round((totalPriceSum / priceCount) * 10) / 10 : null;
        const subtotal = avgPrice ? Math.round(avgPrice * Math.min(combinedQty, requiredQuantityKg)) : null;

        suggestions.push({
          id: `batch-2-${item1.id}-${item2.id}`,
          listings: [item1, item2],
          totalQuantityKg: combinedQty,
          matchScore: 70 + (sameState ? 10 : 0) + (loc1 + loc2) * 2 - Math.abs(combinedQty - requiredQuantityKg) * 0.001,
          reason,
          averagePricePerKg: avgPrice,
          calculableSubtotal: subtotal,
          isCombinedBatch: true,
        });
      }
    }
  }

  // Strategy C: If requested volume is high and neither single nor pairs fulfill, try 3 items
  if (suggestions.length < 2 && rankedCandidates.length >= 3) {
    for (let i = 0; i < Math.min(rankedCandidates.length, 4); i++) {
      for (let j = i + 1; j < Math.min(rankedCandidates.length, 5); j++) {
        for (let k = j + 1; k < Math.min(rankedCandidates.length, 6); k++) {
          const item1 = rankedCandidates[i];
          const item2 = rankedCandidates[j];
          const item3 = rankedCandidates[k];
          const combinedQty = item1.quantityKg + item2.quantityKg + item3.quantityKg;

          if (combinedQty >= requiredQuantityKg * 0.85) {
            suggestions.push({
              id: `batch-3-${item1.id}-${item2.id}-${item3.id}`,
              listings: [item1, item2, item3],
              totalQuantityKg: combinedQty,
              matchScore: 60 - Math.abs(combinedQty - requiredQuantityKg) * 0.001,
              reason: `Consolidated 3 suppliers to pool ${combinedQty.toLocaleString()} kg of compatible ${plasticType}.`,
              averagePricePerKg: null,
              calculableSubtotal: null,
              isCombinedBatch: true,
            });
            break;
          }
        }
      }
    }
  }

  // Sort by matchScore descending and return top suggestions
  return suggestions.sort((a, b) => b.matchScore - a.matchScore).slice(0, 6);
}
