"use client";
import React from "react";

const ErrorIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
      clipRule="evenodd"
    />
  </svg>
);

export default function NonBridalServiceSelection({
  register,
  watch,
  errors,
  onNext,
  onBack,
}) {
  const watchedFields = watch();
  const personCount = watchedFields.nonBridal?.personCount || "";

  const handleNext = () => {
    if (personCount && personCount > 0) onNext();
  };

  const isNextEnabled = personCount && personCount > 0;

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="sm:p-8 text-left">
        {/* Header Section */}
        <div className="text-left mb-4 sm:mb-5">
          <h2 className="text-2xl sm:text-3xl font-normal text-gray-900 mb-1 sm:mb-3 tracking-wide">
            Non-Bridal Service Count
          </h2>
          <p className="text-gray-700 text-sm sm:text-base font-light">
            Please specify the number of people requiring services for your
            event or photoshoot.
          </p>
        </div>

        {/* Input Field */}
        <div className="border border-gray-300 rounded-xl p-5 sm:p-6 bg-white hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-gray-300/30">
          <label className="block text-base sm:text-lg font-light text-gray-800 mb-2">
            Number of people requiring hair & makeup services
          </label>

          <input
            type="number"
            min={1}
            placeholder="Enter number of people"
            {...register("nonBridal.personCount", { required: true, min: 1 })}
            className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border text-gray-800 font-light transition-all duration-300 
              ${
                errors?.nonBridal?.personCount
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/40"
                  : "border-gray-300 focus:border-gray-500 focus:ring-gray-400/30"
              } focus:ring-1 bg-white`}
          />

          {errors?.nonBridal?.personCount && (
            <div className="mt-3 flex items-center p-2.5 bg-red-50 border border-red-300 rounded-lg text-sm text-red-700 font-light">
              <ErrorIcon className="w-4 h-4 mr-2 flex-shrink-0" />
              Please enter how many people need service (minimum 1).
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-5 pt-6 sm:pt-8 border-t border-gray-200 mt-6">
          <button
            onClick={onBack}
            className="px-5 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-light rounded-lg transition-all duration-300 bg-gray-200 text-gray-900 border border-gray-400 shadow-md hover:bg-gray-300 hover:scale-[1.02]"
          >
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!isNextEnabled}
            className={`px-8 sm:px-10 py-2.5 sm:py-3 text-sm sm:text-base font-light rounded-lg transition-all duration-300 border shadow-md ${
              isNextEnabled
                ? "bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white border-gray-600 hover:shadow-lg hover:scale-[1.02]"
                : "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed"
            }`} 
          >
            Continue
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
    </div>
  );
}

// import React from 'react';

// export default function NonBridalServiceSelection({ register, watch, errors, onNext, onBack, setValue }) {
//   const watchedFields = watch();
//   const personCount = watchedFields.nonBridal?.personCount || '';

//   const handleNext = () => {
//     if (personCount && personCount > 0) {
//       onNext();
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
//       <div className="text-center mb-8">
//         <h2 className="text-2xl font-bold text-gray-800 mb-2">How many people need our service?</h2>
//       </div>

//       <div className="space-y-6 mb-8">
//         {/* Person Count */}
//         <div className="border rounded-lg p-6 bg-gray-50">
//           <label className="block text-lg font-semibold text-gray-800 mb-2">
//             Number of people requiring hair & makeup services
//           </label>
//           <input
//             type="number"
//             min={1}
//             placeholder="Enter number of people"
//             {...register('nonBridal.personCount', { required: true, min: 1 })}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           {errors?.nonBridal?.personCount && (
//             <p className="text-red-500 text-sm mt-2">Please enter how many people need service (minimum 1).</p>
//           )}
//         </div>
//       </div>

//       <div className="flex justify-between">
//         <button
//           type="button"
//           onClick={onBack}
//           className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
//         >
//           ← Back
//         </button>
//         <button
//           type="button"
//           onClick={handleNext}
//           disabled={!personCount || personCount <= 0}
//           className={`px-6 py-3 rounded-lg transition-colors ${
//             personCount && personCount > 0
//               ? 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'
//               : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//           }`}
//         >
//           Continue →
//         </button>
//       </div>
//     </div>
//   );
// }
