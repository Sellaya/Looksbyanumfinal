import React from 'react';

const SemiBridalSummary = ({ onNext, onBack, getValues, onBook }) => {
  return (
    <div className="max-w-sm md:max-w-2xl mx-auto p-4 md:p-8 glass-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-left">
        Booking Summary
      </h2>

      <div className="bg-gray-50 p-6 rounded-lg mb-8 border-2 border-gray-200">
        <div className="space-y-4 text-gray-800">
          <div className="flex justify-between">
            <span className="font-semibold">Client:</span>
            <span>{getValues('first_name') + ' ' + getValues('last_name')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Email:</span>
            <span>{getValues('email')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Phone:</span>
            <span>{getValues('phone')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Service Region:</span>
            <span>{getValues('region')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Event Date:</span>
            <span>{getValues('event_date')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Ready Time:</span>
            <span>{getValues('ready_time')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Service Type:</span>
            <span>{getValues('service_type')}</span>
          </div>
          <div className="flex justify-between pt-4 border-t-2 border-gray-300 text-lg font-bold">
            <span>Total Service Fee:</span>
            <span>${getValues('price') || '0.00'} CAD</span>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            (Includes 13% HST)
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
        >
          ← Edit Details
        </button>
        <button
          type="button"
          onClick={onBook}
          className="px-8 py-3 rounded-lg font-semibold transition-all duration-200 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200"
        >
          Confirm Booking ✓
        </button>
      </div>
    </div>
  );
};

export default SemiBridalSummary;