/**
 * Strict pricing helpers that avoid inventing prices, savings, or transport costs.
 * Always returns 'Not provided' when information is unavailable.
 */

export interface PriceBreakdown {
  askingPricePerKgText: string;
  requestedQuantityKg: number;
  materialSubtotalText: string;
  rawMaterialSubtotal: number | null;
  transportCostText: string;
  otherChargesText: string;
  finalNegotiatedPriceText: string;
  estimatedTotalText: string;
}

export function formatCurrencyINR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Not provided';
  }
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function calculatePriceBreakdown(params: {
  askingPricePerKg: number | null | undefined;
  requestedQuantityKg: number;
  transportCost?: number | null;
  otherCharges?: number | null;
  finalNegotiatedPricePerKg?: number | null;
}): PriceBreakdown {
  const {
    askingPricePerKg,
    requestedQuantityKg,
    transportCost,
    otherCharges,
    finalNegotiatedPricePerKg,
  } = params;

  const validQty = Math.max(0, requestedQuantityKg || 0);

  // Asking price text
  const askingPricePerKgText =
    askingPricePerKg !== null && askingPricePerKg !== undefined && askingPricePerKg > 0
      ? `₹${askingPricePerKg.toLocaleString('en-IN')}/kg`
      : 'Not provided';

  // Subtotal calculable only if asking price is provided
  const rawMaterialSubtotal =
    askingPricePerKg !== null && askingPricePerKg !== undefined && askingPricePerKg > 0 && validQty > 0
      ? askingPricePerKg * validQty
      : null;

  const materialSubtotalText = rawMaterialSubtotal !== null
    ? `₹${rawMaterialSubtotal.toLocaleString('en-IN')}`
    : 'Not provided';

  const transportCostText =
    transportCost !== null && transportCost !== undefined && transportCost >= 0
      ? `₹${transportCost.toLocaleString('en-IN')}`
      : 'Not provided';

  const otherChargesText =
    otherCharges !== null && otherCharges !== undefined && otherCharges >= 0
      ? `₹${otherCharges.toLocaleString('en-IN')}`
      : 'Not provided';

  const finalNegotiatedPriceText =
    finalNegotiatedPricePerKg !== null && finalNegotiatedPricePerKg !== undefined && finalNegotiatedPricePerKg > 0
      ? `₹${finalNegotiatedPricePerKg.toLocaleString('en-IN')}/kg (Subtotal: ₹${(finalNegotiatedPricePerKg * validQty).toLocaleString('en-IN')})`
      : 'Not provided';

  // Calculate grand total if we have numbers, otherwise show breakdown note
  let grandTotal: number | null = null;
  const baseSubtotal = finalNegotiatedPricePerKg && finalNegotiatedPricePerKg > 0
    ? finalNegotiatedPricePerKg * validQty
    : rawMaterialSubtotal;

  if (baseSubtotal !== null) {
    grandTotal = baseSubtotal;
    if (transportCost && transportCost > 0) grandTotal += transportCost;
    if (otherCharges && otherCharges > 0) grandTotal += otherCharges;
  }

  const estimatedTotalText = grandTotal !== null
    ? `₹${grandTotal.toLocaleString('en-IN')}`
    : 'Pending negotiation';

  return {
    askingPricePerKgText,
    requestedQuantityKg: validQty,
    materialSubtotalText,
    rawMaterialSubtotal,
    transportCostText,
    otherChargesText,
    finalNegotiatedPriceText,
    estimatedTotalText,
  };
}
