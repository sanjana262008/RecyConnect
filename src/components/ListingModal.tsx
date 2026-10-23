import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { WasteListing, PlasticType, ListingStatus } from '../types';

interface ListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (listingData: Omit<WasteListing, 'id' | 'createdAt'>, existingId?: string) => void;
  editingListing?: WasteListing | null;
  defaultSellerOrg: string;
  defaultCity: string;
  defaultState: string;
  defaultPhone: string;
}

const PLASTIC_TYPES: PlasticType[] = ['PET', 'HDPE', 'LDPE', 'PP', 'PVC', 'ABS', 'Other'];

const GRADE_OPTIONS = [
  'Grade A - Clean / Post-Industrial',
  'Grade B - Washed / Minor Contamination',
  'Grade C - Mixed / Post-Consumer',
  'Regrind / Flakes',
  'Industrial Purge / Off-spec',
];

const PRESET_IMAGES = [
  { label: 'Clear Bales', url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80' },
  { label: 'Blue Drums', url: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80' },
  { label: 'White Film', url: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=600&q=80' },
  { label: 'Granulated Scrap', url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80' },
];

export const ListingModal: React.FC<ListingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingListing,
  defaultSellerOrg,
  defaultCity,
  defaultState,
  defaultPhone,
}) => {
  const [plasticType, setPlasticType] = useState<PlasticType>('PET');
  const [quantityKg, setQuantityKg] = useState<string>('');
  const [grade, setGrade] = useState<string>(GRADE_OPTIONS[0]);
  const [condition, setCondition] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [expectedPricePerKg, setExpectedPricePerKg] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [status, setStatus] = useState<ListingStatus>('Available');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingListing) {
      setPlasticType(editingListing.plasticType);
      setQuantityKg(editingListing.quantityKg.toString());
      setGrade(editingListing.grade);
      setCondition(editingListing.condition);
      setCity(editingListing.city);
      setState(editingListing.state);
      setExpectedPricePerKg(editingListing.expectedPricePerKg !== null ? editingListing.expectedPricePerKg.toString() : '');
      setDescription(editingListing.description || '');
      setImageUrl(editingListing.imageUrl || '');
      setStatus(editingListing.status);
    } else {
      setPlasticType('PET');
      setQuantityKg('');
      setGrade(GRADE_OPTIONS[0]);
      setCondition('');
      setCity(defaultCity || 'Pune');
      setState(defaultState || 'Maharashtra');
      setExpectedPricePerKg('');
      setDescription('');
      setImageUrl(PRESET_IMAGES[0].url);
      setStatus('Available');
    }
    setError(null);
  }, [editingListing, isOpen, defaultCity, defaultState]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const qty = parseFloat(quantityKg);
    if (isNaN(qty) || qty <= 0) {
      setError('Please enter a valid positive quantity in kilograms.');
      return;
    }

    if (!condition.trim()) {
      setError('Please provide condition and contamination details.');
      return;
    }

    if (!city.trim() || !state.trim()) {
      setError('City and State are required.');
      return;
    }

    let parsedPrice: number | null = null;
    if (expectedPricePerKg.trim() !== '') {
      parsedPrice = parseFloat(expectedPricePerKg);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        setError('Expected price per kg must be a positive number if provided.');
        return;
      }
    }

    onSave(
      {
        sellerId: editingListing?.sellerId || 'demo-user-1',
        sellerOrg: editingListing?.sellerOrg || defaultSellerOrg,
        sellerCity: defaultCity,
        sellerState: defaultState,
        sellerPhone: defaultPhone,
        plasticType,
        quantityKg: qty,
        grade,
        condition: condition.trim(),
        city: city.trim(),
        state: state.trim(),
        expectedPricePerKg: parsedPrice,
        description: description.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        status,
        isDemoSample: editingListing ? editingListing.isDemoSample : false,
      },
      editingListing?.id
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full border border-slate-200 my-8 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5 pb-3 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            {editingListing ? 'Edit Waste Listing' : 'Add New Waste Listing'}
          </h2>
          <p className="text-xs text-slate-500">
            Enter specifications of recyclable plastic materials generated by your facility.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Plastic Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Plastic Type *
              </label>
              <select
                value={plasticType}
                onChange={(e) => setPlasticType(e.target.value as PlasticType)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 bg-white"
              >
                {PLASTIC_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity in KG */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Available Quantity (kg) *
              </label>
              <input
                type="number"
                min="1"
                step="any"
                required
                value={quantityKg}
                onChange={(e) => setQuantityKg(e.target.value)}
                placeholder="e.g. 2500"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Grade / Quality */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Grade / Quality *
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 bg-white"
              >
                {GRADE_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Expected Price per kg (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expected Price (₹/kg) <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={expectedPricePerKg}
                onChange={(e) => setExpectedPricePerKg(e.target.value)}
                placeholder="e.g. 32 (Leave empty if unpriced)"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900"
              />
            </div>
          </div>

          {/* Condition and Contamination */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Condition & Contamination Details *
            </label>
            <textarea
              required
              rows={2}
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="e.g. Baled, washed, preforms with labels stripped; zero oil contamination."
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City / Location *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Pune"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                State *
              </label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Maharashtra"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Short Description <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Generated monthly from beverage bottling facility."
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900"
            />
          </div>

          {/* Preset Images or URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Material Photo Preset
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {PRESET_IMAGES.map((preset) => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => setImageUrl(preset.url)}
                  className={`border rounded p-1 text-center cursor-pointer ${
                    imageUrl === preset.url
                      ? 'border-emerald-800 bg-emerald-50 text-emerald-900 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-full h-12 object-cover rounded mb-1"
                  />
                  <span className="text-[10px] block truncate">{preset.label}</span>
                </button>
              ))}
            </div>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Or paste custom image URL"
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-700"
            />
          </div>

          {/* Status selector (available / request received / collection scheduled / collected) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Listing Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ListingStatus)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-900 bg-white"
            >
              <option value="Available">Available (Visible in Marketplace)</option>
              <option value="Request Received">Request Received</option>
              <option value="Collection Scheduled">Collection Scheduled</option>
              <option value="Collected">Collected</option>
            </select>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-sm font-semibold transition-colors cursor-pointer"
            >
              {editingListing ? 'Save Changes' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
