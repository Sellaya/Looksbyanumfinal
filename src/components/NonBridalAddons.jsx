import React from 'react';

export default function NonBridalAddons({ register, watch, errors, onNext, onBack }) {
  const watchedFields = watch();
  const serviceType = watchedFields.nonBridal?.serviceType;
  const extensions = watchedFields.nonBridal?.extensions;
  const jewelrySetting = watchedFields.nonBridal?.veil_or_jewelry_setting;
  const airbrush = watchedFields.nonBridal?.airbrush;

  // Show extensions option only if Hair or Both is selected
  const showExtensions = serviceType === 'Hair Only' || serviceType === 'Both Hair & Makeup';

  return ( 
    <div className="max-w-sm md:max-w-2xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-sm">
      <div className="text-center mb-4 md:mb-8">
        <h2 className="text-sm md:text-2xl font-bold text-gray-800 mb-2">Add-ons for Non-Bridal</h2>
        <p className="text-gray-600">Select any additional services needed</p>
      </div>

      <div className="space-y-6 mb-8">
        {/* Hair Extensions - Only show if service includes hair */}
        {showExtensions && (
          <div className="border rounded-lg p-6 bg-gray-50">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Do any clients need hair extensions installed?
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Professional installation of hair extensions
              </p>
              <p className="text-xs text-orange-600 font-medium">
                We do not provide the hair extensions. Clients must have their own.
              </p>
            </div>
            
            <div className="flex space-x-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  {...register('nonBridal.extensions')}
                  value="true"
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <span className="ml-2 text-gray-700">Yes</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  {...register('nonBridal.extensions')}
                  value="false"
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <span className="ml-2 text-gray-700">No</span>
              </label>
            </div>
          </div>
        )}

        {/* Jewelry Setting */}
        <div className="border rounded-lg p-6 bg-gray-50">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Do any clients need jewelry setting?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Professional assistance with jewelry placement
            </p>
          </div>
          
          <div className="flex space-x-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                {...register('nonBridal.veil_or_jewelry_setting')}
                value="true"
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="ml-2 text-gray-700">Yes</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                {...register('nonBridal.veil_or_jewelry_setting')}
                value="false"
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="ml-2 text-gray-700">No</span>
            </label>
          </div>
        </div>

        {/* Airbrush Makeup */}
        <div className="border rounded-lg p-6 bg-gray-50">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Do any clients need airbrush makeup?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Professional airbrush makeup application for a flawless finish
            </p>
          </div>
          
          <div className="flex space-x-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                {...register('nonBridal.airbrush')}
                value="true"
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="ml-2 text-gray-700">Yes</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                {...register('nonBridal.airbrush')}
                value="false"
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="ml-2 text-gray-700">No</span>
            </label>
          </div>
        </div>

        {/* Summary */}
        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-800 mb-2">Selected Service:</h4>
          <p className="text-indigo-600 font-medium">
            {serviceType || 'None selected'}
          </p>
          
          {(extensions === 'true' || jewelrySetting === 'true' || airbrush === 'true') && (
            <div className="mt-3">
              <h4 className="font-semibold text-gray-800 mb-2">Add-ons:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {extensions === 'true' && <li>• Hair Extensions Installation</li>}
                {jewelrySetting === 'true' && <li>• Jewelry Setting</li>}
                {airbrush === 'true' && <li>• Airbrush Makeup</li>}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 md:pt-8 border-t border-gray-100 mt-4 md:mt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 md:px-6 md:py-3 lg:px-10 lg:py-3.5 rounded-xl font-bold text-sm md:text-base lg:text-lg shadow-lg transition-all duration-300 bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-xl transform hover:scale-[1.01] cursor-pointer"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-4 py-2 md:px-6 md:py-3 lg:px-10 lg:py-3.5 rounded-xl font-bold text-sm md:text-base lg:text-lg shadow-lg transition-all duration-300 bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-xl transform hover:scale-[1.01] cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  );
}