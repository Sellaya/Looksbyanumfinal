"use client"

const LocationPinIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M12 21c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M12 10a2 2 0 100 4 2 2 0 000-4z"
    />
  </svg>
)

export default function StudioAddress({ onNext, onBack }) {
  const studioAddress = {
    name: "Looks by Anum Studio",
    street: "30 McCormack Rd",
    city: "Caledon",
    province: "ON",
    postalCode: "L7C 4J6",
  }

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
      <div className="sm:p-8">
        {/* Header Section */}
        <div className="text-left mb-4 sm:mb-5">
          <h2 className="text-2xl sm:text-3xl font-normal text-gray-900 lg:mb-3 mb-0 tracking-wide">
            Studio Address <span className="text-gray-400 ml-2">*</span>
          </h2>
        </div>

        {/* Studio Address Card */}
        <div className="space-y-2 mb-6 sm:mb-5">
          <div
            className="
              group relative w-full p-4 sm:p-6 rounded-lg border transition-all duration-300 text-left overflow-hidden flex items-start gap-4 sm:gap-6
              border-gray-300 bg-white hover:border-gray-500 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-400/10
            "
          >
            {/* Icon */}
            <div
              className="
                flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-md
                bg-gray-200/50 group-hover:bg-gray-300/50 transition-all duration-300
              "
            >
              <LocationPinIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-gray-800" />
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              
              <p className="text-sm sm:text-base font-medium text-gray-800">{studioAddress.name}</p>
              <p className="text-xs sm:text-sm font-light text-gray-700">{studioAddress.street}</p>
              <p className="text-xs sm:text-sm font-light text-gray-700">
                {studioAddress.city}, {studioAddress.province} {studioAddress.postalCode}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-5 pt-6 sm:pt-8 border-t border-gray-200">
          <button
            onClick={onBack}
            className="group relative px-5 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-light rounded-lg transition-all duration-300 overflow-hidden bg-gray-200 text-gray-900 shadow-md shadow-gray-400/20 hover:bg-gray-300 hover:scale-[1.02] active:scale-100 cursor-pointer border border-gray-400"
          >
            Back
          </button>

          <button
            onClick={onNext}
            className="relative px-8 sm:px-10 py-2.5 sm:py-3 text-sm sm:text-base font-light rounded-lg transition-all duration-300 overflow-hidden
              bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white
              shadow-md shadow-gray-700/20 hover:shadow-lg hover:shadow-gray-700/30
              hover:scale-[1.02] active:scale-100 cursor-pointer border border-gray-600"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}



// import React from 'react';

// // Define the elegant color palette
// const PRIMARY_COLOR_CLASS = 'indigo-600';
// const PRIMARY_HOVER_CLASS = 'indigo-700';

// export default function StudioAddress({ onNext, onBack }) {
//   const studioAddress = {
//     name: 'Looks by Anum Studio',
//     street: '30 McCormack Rd',
//     city: 'Caledon',
//     province: 'ON',
//     postalCode: 'L7C 4J6'
//   };

//   return (
//     <div className="max-w-sm md:max-w-2xl lg:max-w-6xl mx-auto px-4 py-4 md:py-8 lg:py-12">
//       <div className="bg-white rounded-xl shadow-2xl p-4 md:p-8 lg:p-14 border border-gray-50">

//         {/* Header Section */}
//         <div className="mb-6 md:mb-10 lg:mb-14">
//           <h2 className="text-lg md:text-2xl lg:text-4xl font-light text-gray-900 mb-2 md:mb-3 tracking-tight text-left">
//             Studio Address
//           </h2>
//           <p className="text-gray-500 text-sm md:text-base lg:text-lg">Our professional studio location where your service will take place.</p>
//         </div>

//         {/* Studio Address Display */}
//         <div className="mb-8 md:mb-12">
//           <div className={`bg-gradient-to-br from-${PRIMARY_COLOR_CLASS} to-${PRIMARY_HOVER_CLASS} text-white p-6 md:p-8 lg:p-10 rounded-xl shadow-lg`}>
//             <div className="flex items-start space-x-4">
//               {/* Location Icon */}
//               <div className="text-2xl md:text-3xl lg:text-4xl">
//                 🏢
//               </div>

//               {/* Address Content */}
//               <div className="flex-1">
//                 <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-3 text-white">
//                   Our Studio Location:
//                 </h3>

//                 <div className="space-y-1 text-indigo-50">
//                   <p className="text-base md:text-lg font-medium">{studioAddress.name}</p>
//                   <p className="text-sm md:text-base">{studioAddress.street}</p>
//                   <p className="text-sm md:text-base">
//                     {studioAddress.city}, {studioAddress.province} {studioAddress.postalCode}
//                   </p>
//                 </div>

//                 {/* Additional Info */}
//                 <div className="mt-4 pt-4 border-t border-indigo-400">
//                   <div className="space-y-2">
//                     <div className="flex items-center text-sm md:text-base text-indigo-50">
//                       <span className="w-1 h-1 bg-indigo-200 rounded-full mr-2 flex-shrink-0"></span>
//                       Professional studio environment
//                     </div>
//                     <div className="flex items-center text-sm md:text-base text-indigo-50">
//                       <span className="w-1 h-1 bg-indigo-200 rounded-full mr-2 flex-shrink-0"></span>
//                       Complimentary parking available
//                     </div>
//                     <div className="flex items-center text-sm md:text-base text-indigo-50">
//                       <span className="w-1 h-1 bg-indigo-200 rounded-full mr-2 flex-shrink-0"></span>
//                       State-of-the-art lighting and equipment
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Navigation Buttons */}
//         <div className="flex justify-between items-center pt-6 md:pt-8 border-t border-gray-100 mt-4 md:mt-6">
//           <button
//             type="button"
//             onClick={onBack}
//             className="px-4 py-2 md:px-6 md:py-3 lg:px-10 lg:py-3.5 rounded-xl font-bold text-sm md:text-base lg:text-lg shadow-lg transition-all duration-300 bg-gray-200 text-black hover:bg-gray-300 hover:shadow-xl transform hover:scale-[1.01] cursor-pointer"
//           >
//             Back
//           </button>

//           <button
//             type="button"
//             onClick={onNext}
//             className="px-4 py-2 md:px-6 md:py-3 lg:px-10 lg:py-3.5 rounded-xl font-bold text-sm md:text-base lg:text-lg shadow-lg transition-all duration-300 bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-xl transform hover:scale-[1.01] cursor-pointer"
//           >
//             Continue
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
