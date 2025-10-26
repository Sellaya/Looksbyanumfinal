import React from "react";

// Icon for Error Messages
const ErrorIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
      clipRule="evenodd"
    />
  </svg>
);

export default function DestinationDetails({ onNext, onBack, register, errors }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="sm:p-8 text-left">
        {/* Header */}
        <div className="mb-5 sm:mb-5 text-left">
          <h2 className="text-2xl sm:text-3xl font-normal text-gray-900 mb-1 sm:mb-3 tracking-wide">
            Destination Wedding Details
            <span className="text-gray-400 ml-2 font-normal">*</span>
          </h2>
          <p className="text-gray-700 text-sm sm:text-base font-light max-w-2xl mx-auto">
            Additional details about your destination wedding:
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 mb-5 sm:mb-5">
            <div>
              <textarea
                {...register("destination_details", { required: true })}
                rows={6}
                placeholder="Please share any additional details about your destination wedding, such as location, venue, special requirements, or any other information that would help us serve you better..."
                className={`group relative w-full p-3.5 sm:p-4 rounded-lg border border-gray-300 bg-white 
          hover:border-gray-500 hover:bg-gray-50 text-left flex items-center justify-between transition-all duration-300 resize-none
                  ${errors.destination_details ? "border-red-500 focus:border-red-500 focus:ring-red-400/40" : ""}`}
              />
              {errors.destination_details && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 rounded-lg shadow-md flex items-center">
                  <ErrorIcon className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                  <p className="text-red-700 text-sm font-light">
                    Destination details are required
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between gap-5 pt-6 sm:pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              className="group relative px-5 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-light rounded-lg transition-all duration-300 overflow-hidden bg-gray-200 text-gray-900 shadow-md shadow-gray-400/20 hover:bg-gray-300 hover:scale-[1.02] active:scale-100 cursor-pointer border border-gray-400"
            >
              Back
            </button>

            <button
              type="submit"
              className="relative px-8 sm:px-10 py-2.5 sm:py-3 text-sm sm:text-base font-light rounded-lg transition-all duration-300 overflow-hidden
              bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white
              shadow-md shadow-gray-700/20 hover:shadow-lg hover:shadow-gray-700/30
              hover:scale-[1.02] active:scale-100 cursor-pointer border border-gray-600"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


// import React from 'react';

// export default function DestinationDetails({ onNext, onBack, register, errors }) {
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onNext();
//   };

//   return (
//     <div className="max-w-sm md:max-w-2xl mx-auto p-4 md:p-8 glass-card">
//       <h2 className="text-2xl font-bold text-gray-900 mb-8 text-left">
//         Destination Wedding Details
//         <span className="text-red-500 ml-1">*</span>
//       </h2>

//       <form onSubmit={handleSubmit}>
//         <div className="space-y-6 mb-8">
//           <div>
//             <label className="block text-sm font-semibold text-gray-800 mb-2">
//               Additional details about your destination wedding:
//             </label>
//             <textarea
//               {...register('destination_details', { required: true })}
//               rows={6}
//               placeholder="Please share any additional details about your destination wedding, such as location, venue, special requirements, or any other information that would help us serve you better..."
//               className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
//             />
//             {errors.destination_details && (
//               <p className="mt-1 text-sm text-red-600">Destination details are required</p>
//             )}
//           </div>
//         </div>

//         <div className="flex justify-between">
//           <button
//             type="button"
//             onClick={onBack}
//             className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
//           >
//             Back
//           </button>
//           <button
//             type="submit"
//             className="px-8 py-3 rounded-lg font-semibold transition-all duration-200 bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200"
//           >
//             Continue
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
