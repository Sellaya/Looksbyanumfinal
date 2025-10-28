  import React from 'react';

  const QuoteReview = ({ onNext, onBack, getValues }) => {
    return (
      <div className="max-w-sm md:max-w-2xl mx-auto p-4 md:p-8 glass-card">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-left">
          Quote Review
        </h2>

        <div className="bg-gray-50 p-6 rounded-lg mb-8 border-2 border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Service Quote</h3>
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
              <span className="font-semibold">Event Date:</span>
              <span>{getValues('event_date')}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Ready Time:</span>
              <span>{getValues('ready_time')}</span>
            </div>

            {/* Service-specific pricing breakdown */}
            {getValues('service_type') === 'Bridal' && (
              <>
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold mb-2">Bridal Services:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Bridal Makeup & Hair:</span>
                      <span>${getValues('bridal_base_price') || '0.00'}</span>
                    </div>
                    {getValues('bridal_trial') && (
                      <div className="flex justify-between">
                        <span>Trial Session:</span>
                        <span>${getValues('bridal_trial_price') || '0.00'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-between pt-4 border-t-2 border-gray-300 text-lg font-bold">
              <span>Total Service Fee:</span>
              <span>${getValues('price') || '0.00'} CAD</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Deposit Required (50%):</span>
              <span>${((getValues('price') || 0) * 0.5).toFixed(2)} CAD</span>
            </div>
            <p className="text-center text-sm text-gray-600 mt-4">
              (Includes 13% HST)
            </p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Next Steps:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Select your preferred artist</li>
            <li>• Choose your service date and time</li>
            <li>• Provide service address details</li>
            <li>• Review and sign the service contract</li>
            <li>• Complete deposit payment</li>
          </ul>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
          >
            ← Back to Summary
          </button>
          <button
            type="button"
            onClick={onNext}
            className="px-8 py-3 rounded-lg font-semibold transition-all duration-200 bg-pink-600 text-white hover:bg-pink-700 focus:ring-4 focus:ring-pink-200"
          >
            Continue to Artist Selection →
          </button>
        </div>
      </div>
    );
  };
 
  export default QuoteReview;