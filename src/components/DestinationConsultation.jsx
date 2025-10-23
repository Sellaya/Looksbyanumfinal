import React from 'react';

export default function DestinationConsultation({ onNext, onBack }) {
  return (
    <div className="max-w-sm md:max-w-2xl mx-auto p-4 md:p-8 glass-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-left">
        Schedule Your Consultation
      </h2>

      <div className="mb-8">
        <iframe
          src="https://calendly.com/looksbyanum-info/30min?embed_domain=localhost&embed_type=Inline&hide_landing_page_details=1"
          width="100%"
          height="700"
          frameBorder="0"
          allow="microphone; camera; payment; fullscreen; geolocation"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
          className="rounded-lg"
        />
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
          onClick={onNext}
          className="px-8 py-3 rounded-lg font-semibold transition-all duration-200 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 cursor-pointer"
        >
          Continue to Summary
        </button>
      </div>
    </div>
  );
}