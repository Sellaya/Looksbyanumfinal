import React from 'react';

export default function AddressDetails({ register, watch, errors, onNext, onBack, setValue }) {
  const watchedFields = watch();
  const address = watchedFields.address || {};

  const cities = [
    'Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Medicine Hat',
    'Grande Prairie', 'Airdrie', 'Spruce Grove', 'Leduc', 'Lloydminster',
    'Camrose', 'Brooks', 'Cold Lake', 'Wetaskiwin', 'Lacombe',
    'Stony Plain', 'Fort Saskatchewan', 'Canmore', 'Cochrane', 'Okotoks',
    'High River', 'Strathmore', 'Chestermere', 'Beaumont', 'Devon',
    'Sylvan Lake', 'Didsbury', 'Olds', 'Innisfail', 'Penhold', 'Blackfalds',
    'Other'
  ];

  const provinces = [
    'Alberta', 'British Columbia', 'Saskatchewan', 'Manitoba', 'Ontario',
    'Quebec', 'New Brunswick', 'Nova Scotia', 'Prince Edward Island',
    'Newfoundland and Labrador', 'Northwest Territories', 'Nunavut', 'Yukon'
  ];

  const handleNext = () => {
    if (address.street && address.city && address.postal_code && address.province) {
      onNext();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-8 bg-white/70 backdrop-blur-md border border-gray-200 shadow-lg rounded-2xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Address</h2>
        <p className="text-gray-600 text-sm">
          Where should our team come to provide the services?
        </p>
      </div>

      <div className="space-y-6 mb-8">
        {/* Street Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('address.street', { required: true })}
            placeholder="Put TBD if not finalized yet"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 bg-gray-50 text-gray-900"
          />
          {errors.address?.street && (
            <p className="text-red-500 text-sm mt-1">Street address is required.</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <select
            {...register('address.city', { required: true })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 bg-gray-50 text-gray-900"
          >
            <option value="">Select your city</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          {errors.address?.city && (
            <p className="text-red-500 text-sm mt-1">City is required.</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            If you can't find your city listed here, we may still be able to offer services for a custom travel fee. 
            Please contact us or email <span className="font-medium text-gray-700">info@makeupbynida.com</span> to confirm availability.
          </p>
        </div>

        {/* Postal Code */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Postal Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('address.postal_code', {
              required: true,
              pattern: {
                value: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
                message: 'Please enter a valid postal code (e.g., T2P 1J9)',
              },
            })}
            placeholder="T2P 1J9"
            maxLength="7"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 bg-gray-50 text-gray-900"
            onChange={(e) => {
              let value = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
              if (value.length === 6) {
                value = value.slice(0, 3) + ' ' + value.slice(3);
              }
              setValue('address.postal_code', value);
            }}
          />
          {errors.address?.postal_code && (
            <p className="text-red-500 text-sm mt-1">
              {errors.address.postal_code.message || 'Postal code is required.'}
            </p>
          )}
        </div>

        {/* Province */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Province <span className="text-red-500">*</span>
          </label>
          <select
            {...register('address.province', { required: true })}
            defaultValue="Alberta"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 bg-gray-50 text-gray-900"
          >
            <option value="">Select province</option>
            {provinces.map((province) => (
              <option key={province} value={province}>{province}</option>
            ))}
          </select>
          {errors.address?.province && (
            <p className="text-red-500 text-sm mt-1">Province is required.</p>
          )}
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Additional Address Notes (Optional)
          </label>
          <textarea
            {...register('address.notes')}
            rows={3}
            placeholder="Any special instructions for finding the location, parking information, etc."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 bg-gray-50 text-gray-900"
          />
        </div>

        {/* Travel Fee Info */}
        {address.city && (
          <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
            <h4 className="font-semibold text-gray-900 mb-2">Travel Information</h4>
            <div className="text-sm text-gray-700">
              {address.city === 'Calgary' ? (
                <p>✓ Calgary location - Standard travel fee applies</p>
              ) : address.city === 'Edmonton' ? (
                <p>✓ Edmonton location - Standard travel fee applies</p>
              ) : address.city === 'Other' ? (
                <p>⚠️ Custom location - Travel fee will be calculated based on distance</p>
              ) : (
                <p>✓ {address.city} location - Travel fee will be calculated</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!address.street || !address.city || !address.postal_code || !address.province}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
            address.street && address.city && address.postal_code && address.province
              ? 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-4 focus:ring-gray-300'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue →
        </button>
      </div>
    </div>
  ); 
}
