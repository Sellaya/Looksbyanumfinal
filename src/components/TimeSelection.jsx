import React from 'react';

export default function TimeSelection({ register, watch, errors, onNext, onBack, setValue }) {
  const watchedFields = watch();
  const endTime = watchedFields.event?.ready_time;
  const serviceType = watchedFields.service_type;

  // Calculate service duration based on services selected
  const calculateServiceDuration = () => {
    let hours = 0;
    
    if (serviceType === 'Bridal') {
      const brideService = watchedFields.bride?.service;
      const bothCount = parseInt(watchedFields.party?.both) || 0; 
      const makeupCount = parseInt(watchedFields.party?.makeup) || 0;
      const hairCount = parseInt(watchedFields.party?.hair) || 0;
      
      // Bride service time
      if (brideService === 'Both Hair & Makeup') hours += 2;
      else if (brideService === 'Hair Only' || brideService === 'Makeup Only') hours += 1;
      
      // Party member times (roughly 1 hour per both, 0.5 hour per single service)
      hours += bothCount * 1;
      hours += (makeupCount + hairCount) * 0.5;
      
    } else if (serviceType === 'Semi Bridal') {
      const semiBridalService = watchedFields.semiBridal?.service;
      if (semiBridalService === 'Both Hair & Makeup') hours += 1.5;
      else hours += 1;
      
    } else if (serviceType === 'Non-Bridal') {
      const personCount = parseInt(watchedFields.nonBridal?.personCount) || 1;
      const serviceTypeNB = watchedFields.nonBridal?.serviceType;
      
      if (serviceTypeNB === 'Both Hair & Makeup') hours += personCount * 1;
      else hours += personCount * 0.5;
    }
    
    return Math.max(hours, 1); // Minimum 1 hour
  };

  const calculateStartTime = (endTime) => {
    if (!endTime) return '';
    
    const [hours, minutes] = endTime.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(hours, minutes, 0, 0);
    
    const serviceDuration = calculateServiceDuration();
    const startDate = new Date(endDate.getTime() - (serviceDuration * 60 * 60 * 1000));
    
    return startDate.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const isEarlyTime = (endTime) => {
    if (!endTime) return false;
    const [hours] = endTime.split(':').map(Number);
    const startHour = hours - calculateServiceDuration();
    return startHour <= 6; // 6 AM or earlier
  };

  const formatTimeRange = (endTime) => {
    if (!endTime) return '';
    const startTime = calculateStartTime(endTime);
    const [hours, minutes] = endTime.split(':').map(Number);
    const endFormatted = new Date().setHours(hours, minutes, 0, 0);
    const endTimeFormatted = new Date(endFormatted).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit', 
      hour12: true
    });
    
    return `${startTime} - ${endTimeFormatted}`;
  };

  const handleNext = () => {
    if (endTime) {
      // Set calculated start time
      const startTime = calculateStartTime(endTime);
      setValue('event.start_time', startTime);
      setValue('event.is_early', isEarlyTime(endTime));
      onNext();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Appointment Time</h2>
        <p className="text-gray-600">What time do you need to be fully ready by?</p>
        <p className="text-sm text-gray-500 mt-1">(This is your end time, NOT the start time)</p>
      </div>

      <div className="space-y-6 mb-8">
        {/* End Time Selection */}
        <div className="border rounded-lg p-6 bg-gray-50">
          <label className="block text-lg font-semibold text-gray-800 mb-4">
            Ready By Time *
          </label>
          
          <input
            type="time"
            {...register('event.ready_time', { required: true })}
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          
          {errors.event?.ready_time && (
            <p className="text-red-500 text-sm mt-2">Please select your ready time.</p>
          )}
        </div>

        {/* Calculated Appointment Time */}
        {endTime && (
          <div className="border rounded-lg p-6 bg-blue-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Your Appointment Time:
            </h3>
            <p className="text-xl font-bold text-blue-600 mb-2">
              {formatTimeRange(endTime)}
            </p>
            <p className="text-sm text-gray-600">
              Based on your selected services (approximately {calculateServiceDuration()} hours needed)
            </p>
            
            {isEarlyTime(endTime) && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 font-medium">⚠️ Early Morning Appointment</p>
                <p className="text-sm text-yellow-700 mt-1">
                  You have selected an early morning time! If this is correct, an early fee will apply.
                </p>
                <p className="text-sm text-yellow-700">
                  If you meant PM instead of AM, please change the time above.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Service Duration Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-2">Estimated Service Duration:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• Service Type: {serviceType}</p>
            <p>• Total Duration: ~{calculateServiceDuration()} hours</p>
            <p className="text-xs text-gray-500 mt-2">
              * Duration may vary based on specific requirements and number of people
            </p>
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
          onClick={handleNext}
          disabled={!endTime}
          className={`px-6 py-3 rounded-lg transition-colors cursor-pointer ${
            endTime
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}