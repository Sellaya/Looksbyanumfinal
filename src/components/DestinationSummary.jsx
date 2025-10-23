import React, { useState } from 'react';

export default function DestinationSummary({ onNext, onBack, getValues }) {
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleConfirmBooking = () => {
    // For destination weddings, just show confirmation since consultation is already scheduled
    setBookingConfirmed(true);
  };

  if (bookingConfirmed) {
    return (
      <div className="max-w-sm md:max-w-2xl mx-auto p-4 md:p-8 glass-card text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Booking Confirmed! 🎉
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Thank you for scheduling your destination wedding consultation.
          </p>
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <p className="text-green-800 text-sm leading-relaxed">
              Your consultation has been scheduled successfully. Our team will review your destination wedding details and contact you within 24-48 hours with a custom quote tailored to your special day.
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 rounded-lg font-semibold transition-all duration-200 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-sm md:max-w-2xl mx-auto p-4 md:p-8 glass-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-left">
        Booking Summary
      </h2>

      <div className="bg-gray-50 p-6 rounded-lg mb-8 border-2 border-gray-200">
        <div className="space-y-4 text-gray-800">
          <div className="flex justify-between">
            <span className="font-semibold">Service Type:</span>
            <span>{getValues('service_type')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Region:</span>
            <span>{getValues('region')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Event Start Date:</span>
            <span>{getValues('event_start_date')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Event End Date:</span>
            <span>{getValues('event_end_date')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Destination Details:</span>
            <span className="text-right max-w-xs">{getValues('destination_details')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Client:</span>
            <span>{getValues('first_name')} {getValues('last_name')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Email:</span>
            <span>{getValues('email')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Phone:</span>
            <span>{getValues('phone')}</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-8 border border-blue-200">
        <p className="text-blue-800 text-sm">
          We'll contact you with a custom quote for destination wedding services.
        </p>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleConfirmBooking}
          className="px-8 py-3 rounded-lg font-semibold transition-all duration-200 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200"
        >
          Confirm Booking ✓
        </button>
      </div>
    </div>
  );
}