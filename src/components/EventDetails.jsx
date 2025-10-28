import React from 'react';
import DatePicker from './DatePicker';

export default function EventDetails({ onNext, onBack, register, errors }) {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-left">
        Event Information
        <span className="text-gray-500 ml-1">*</span>
      </h2>
      
      <div className="space-y-6 mb-8">
        <DatePicker 
          register={register}
          name="event.date"
          label="Event Date"
          required={true}
          error={errors.event?.date?.message}
        />

        <div>
          <label htmlFor="event.ready_time" className="block text-sm font-medium text-gray-700 mb-2">
            Ready Time <span className="text-gray-500">*</span>
          </label>
          <input
            type="time"
            {...register('event.ready_time')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-4 focus:ring-pink-200 focus:border-pink-500 transition-colors ${
              errors.event?.ready_time ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.event?.ready_time && (
            <p className="mt-1 text-sm text-red-600">{errors.event.ready_time.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-600">
            What time do you need to be ready by?
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4">Trial Service (Optional)</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('event.trial.needs_trial')}
                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                I would like a trial session
              </label>
            </div>

            <div>
              <label htmlFor="event.trial.trial_service" className="block text-sm font-medium text-gray-700 mb-2">
                Trial Service Type
              </label>
              <select
                {...register('event.trial.trial_service')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-pink-200 focus:border-pink-500 transition-colors"
              >
                <option value="">Select trial service</option>
                <option value="Hair">Hair Only</option>
                <option value="Makeup">Makeup Only</option>
                <option value="Both">Both Hair & Makeup</option>
              </select>
            </div>

            <DatePicker
              register={register}
              name="event.trial.trial_date"
              label="Preferred Trial Date"
              required={false}
            />
          </div>
        </div>
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
          className="px-8 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 focus:ring-4 focus:ring-pink-200 transition-all duration-200"
        >
          Continue
        </button>
      </div>
    </div>
  );
}