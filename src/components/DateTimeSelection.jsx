import React from 'react';
import DatePicker from './DatePicker';

const DateTimeSelection = ({ onNext, onBack, register, setValue, getValues, errors }) => {
  return (
    <div className="max-w-sm md:max-w-2xl mx-auto p-4 md:p-8 glass-card bg-white/60 backdrop-blur-md border border-gray-200 shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-left">
        Choose Date & Time
      </h2>

      <div className="space-y-6 mb-8">
        {/* Service Date Selection */}
        <DatePicker
          register={register}
          name="service_date"
          label="Service Date"
          required={true}
          error={errors.service_date?.message}
        />

        {/* Service Time Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Service Time <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
              '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
              '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
            ].map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setValue('service_time', time)}
                className={`p-3 text-center border rounded-lg transition-all duration-200 ${
                  getValues('service_time') === time
                    ? 'border-gray-800 bg-gray-900 text-gray-100 font-medium shadow-sm'
                    : 'border-gray-300 hover:border-gray-700 text-gray-800 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
          {errors.service_time && (
            <p className="mt-1 text-sm text-red-600">{errors.service_time.message}</p>
          )}
        </div>

        {/* Travel Time Notice */}
        <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
          <h4 className="font-semibold text-gray-900 mb-2">Important Notes:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Service duration: Approximately 2–3 hours</li>
            <li>• Please arrive 15 minutes early for your appointment</li>
            <li>• Travel time may be required for locations outside downtown</li>
            <li>• Time slots are subject to artist availability confirmation</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-8 py-3 border border-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
        >
          ← Back to Artist Selection
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!getValues('service_date') || !getValues('service_time')}
          className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
            getValues('service_date') && getValues('service_time')
              ? 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-4 focus:ring-gray-300'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue to Address →
        </button>
      </div>
    </div>
  );
};

export default DateTimeSelection;
