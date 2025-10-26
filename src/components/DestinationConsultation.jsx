import React from 'react';

export default function DestinationConsultation({ onNext, onBack }) {
  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-6 sm:py-8 max-w-2xl mx-auto">
      <div className="sm:p-8">
        <h2 className="text-left sm:text-3xl font-normal text-gray-900 mb-1 tracking-wide">
          Schedule Your Consultation
        </h2>
      </div>

      <div className="mb-8 max-w-2xl mx-auto">
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

      <div className="flex justify-between max-w-2xl mx-auto">
        <button
          type="button"
          onClick={onBack}
          className="px-8 py-3 border border-gray-700 text-gray-900 rounded-lg hover:bg-gray-300 bg-gray-200 transition-colors duration-200"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="relative px-8 sm:px-10 py-2.5 sm:py-3 text-sm sm:text-base font-light rounded-lg transition-all duration-300 overflow-hidden bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-100 cursor-pointer border border-gray-600"
        >
          Continue to Summary
        </button>
      </div>
      <div className="mt-8 flex justify-center">
            <div>
            <p className="inline-block">
                Want to start Over?
            </p>
            <a href="/" className="pl-2 text-blue-700">Go to First Step</a>
            </div>
        </div>
    </div>
  );
}