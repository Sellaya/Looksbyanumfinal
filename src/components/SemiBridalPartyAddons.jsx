import React from 'react';

export default function SemiBridalPartyAddons({ register, watch, errors, onNext, onBack }) {
  const watchedFields = watch();
  const hairCount = watchedFields.party_hair_count ? parseInt(watchedFields.party_hair_count) : 0;
  const makeupCount = watchedFields.party_makeup_count ? parseInt(watchedFields.party_makeup_count) : 0;
  const bothCount = watchedFields.party_both_count ? parseInt(watchedFields.party_both_count) : 0;
  
  // Calculate total people who will have hair done (hair only + both)
  const totalHairCount = hairCount + bothCount;
  
  // Calculate maximum extension count (limited to people getting hair)
  const maxExtensions = totalHairCount;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Party Add-ons</h2>
        <p className="text-gray-600">Select any additional services for your party members</p>
      </div>

      <div className="space-y-6 mb-8">
        {/* Party Summary */}
        <div className="border rounded-lg p-4 bg-blue-50">
          <h4 className="font-semibold text-gray-800 mb-2">Your Party:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Hair only: {hairCount} people</p>
            <p>Makeup only: {makeupCount} people</p>
            <p>Both hair & makeup: {bothCount} people</p>
            <p className="font-medium text-blue-600">Total getting hair: {totalHairCount} people</p>
          </div>
        </div>

        {/* Dupatta Setting for Party */}
        <div className="border rounded-lg p-6 bg-gray-50">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              How many party members need dupatta setting?
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Professional dupatta arrangement for party members
            </p>
            <p className="text-xs text-blue-600">
              Maximum: {hairCount + makeupCount + bothCount} (total party members)
            </p>
          </div>
          
          <input
            type="number"
            {...register('party_dupatta_count', { 
              valueAsNumber: true,
              min: 0,
              max: hairCount + makeupCount + bothCount
            })}
            min="0"
            max={hairCount + makeupCount + bothCount}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter number"
          />
          {errors.party_dupatta_count && (
            <p className="mt-2 text-sm text-red-600">{errors.party_dupatta_count.message}</p>
          )}
        </div>

        {/* Hair Extensions for Party - Only show if people are getting hair */}
        {totalHairCount > 0 && (
          <div className="border rounded-lg p-6 bg-gray-50">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                How many party members need hair extensions installed?
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Professional installation of hair extensions for party members
              </p>
              <p className="text-xs text-blue-600 mb-2">
                Maximum: {maxExtensions} (people getting hair done)
              </p>
              <p className="text-xs text-orange-600 font-medium">
                We do not provide the hair extensions. Party members must have their own.
              </p>
            </div>
            
            <input
              type="number"
              {...register('party_extensions_count', { 
                valueAsNumber: true,
                min: 0,
                max: maxExtensions
              })}
              min="0"
              max={maxExtensions}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter number"
            />
            {errors.party_extensions_count && (
              <p className="mt-2 text-sm text-red-600">{errors.party_extensions_count.message}</p>
            )}
          </div>
        )}

        {/* Summary */}
        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-800 mb-2">Selected Add-ons:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            {watchedFields.party_dupatta_count > 0 && (
              <p>• Dupatta Setting: {watchedFields.party_dupatta_count} people (+${watchedFields.party_dupatta_count * 25})</p>
            )}
            {watchedFields.party_extensions_count > 0 && (
              <p>• Hair Extensions: {watchedFields.party_extensions_count} people (+${watchedFields.party_extensions_count * 20})</p>
            )}
            {(!watchedFields.party_dupatta_count || watchedFields.party_dupatta_count === 0) && 
             (!watchedFields.party_extensions_count || watchedFields.party_extensions_count === 0) && (
              <p className="text-gray-500">No add-ons selected</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}