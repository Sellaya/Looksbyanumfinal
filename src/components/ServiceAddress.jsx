import React from 'react';

const ServiceAddress = ({ onNext, onBack, register, getValues, errors }) => {
  return (
    <div className="max-w-sm md:max-w-2xl mx-auto p-4 md:p-8 glass-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-left">
        Service Address & Details
      </h2>

      <div className="space-y-6 mb-8">
        {/* Venue Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Venue Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('venue_name', { required: 'Venue name is required' })}
            placeholder="e.g., Fairmont Pacific Rim, Private Residence"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
          />
          {errors.venue_name && (
            <p className="mt-1 text-sm text-red-600">{errors.venue_name.message}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('venue_address', { required: 'Street address is required' })}
            placeholder="123 Main Street"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
          />
          {errors.venue_address && (
            <p className="mt-1 text-sm text-red-600">{errors.venue_address.message}</p>
          )}
        </div>

        {/* City, Province, Postal Code */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('venue_city', { required: 'City is required' })}
              placeholder="Vancouver"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
            />
            {errors.venue_city && (
              <p className="mt-1 text-sm text-red-600">{errors.venue_city.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Province <span className="text-red-500">*</span>
            </label>
            <select
              {...register('venue_province', { required: 'Province is required' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
            >
              <option value="">Select Province</option>
              <option value="BC">British Columbia</option>
              <option value="AB">Alberta</option>
              <option value="ON">Ontario</option>
              <option value="QC">Quebec</option>
            </select>
            {errors.venue_province && (
              <p className="mt-1 text-sm text-red-600">{errors.venue_province.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Postal Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            maxLength="7"
            {...register('venue_postal', { required: 'Postal code is required', pattern: { value: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/, message: 'Invalid postal code format. Must be A1A 1A1' } })}
            placeholder="V6Z 1A1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
            onChange={(e) => {
              let value = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
              if (value.length === 6) {
                value = value.slice(0, 3) + ' ' + value.slice(3);
              }
              setValue('venue_postal', value);
            }}
          />
          {errors.venue_postal && (
            <p className="mt-1 text-sm text-red-600">{errors.venue_postal.message}</p>
          )}
        </div>

        {/* On-site Contact */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            On-site Contact Person <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('onsite_contact', { required: 'On-site contact is required' })}
            placeholder="Name of person we'll meet at venue"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
          />
          {errors.onsite_contact && (
            <p className="mt-1 text-sm text-red-600">{errors.onsite_contact.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Contact Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            {...register('onsite_phone', { required: 'Contact phone number is required' })}
            placeholder="(604) 123-4567"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
          />
          {errors.onsite_phone && (
            <p className="mt-1 text-sm text-red-600">{errors.onsite_phone.message}</p>
          )}
        </div>

        {/* Special Instructions */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Special Instructions or Notes
          </label>
          <textarea
            {...register('special_instructions')}
            placeholder="Any special parking instructions, access codes, or other important details..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
        >
          ← Back to Date & Time
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!getValues('venue_name') || !getValues('venue_address') || !getValues('venue_city') || !getValues('venue_province') || !getValues('venue_postal') || !getValues('onsite_contact') || !getValues('onsite_phone')}
          className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${
            getValues('venue_name') && getValues('venue_address') && getValues('venue_city') && getValues('venue_province') && getValues('venue_postal') && getValues('onsite_contact') && getValues('onsite_phone')
              ? 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-4 focus:ring-purple-200'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue to Contract →
        </button>
      </div>
    </div>
  );
};

export default ServiceAddress;