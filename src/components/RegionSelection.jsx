"use client"
import { useState } from "react"
import TorontoGTAIcon from "../assets/Torronto-GTA.png"

const CheckIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

// Toronto icon (e.g., a city skyline)
const TorontoIcon = ({ className }) => (
  <img src={TorontoGTAIcon} alt="Toronto Icon" className="w-10" />
)

// Outside GTA icon (e.g., a road or map pin)
const OutsideIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M2 16l20-5-20-5v5h15H2v5z" />
    <rect x="2" y="20" width="20" height="1.8" rx="0.5" />
  </svg>
)

const DestinationIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Filled pin shape */}
    <path d="M12 2C8 2 5 5 5 9c0 4 7 13 7 13s7-9 7-13c0-4-3-7-7-7z" />
    
    {/* Hollow circle (center dot) */}
    <circle
      cx="12"
      cy="9"
      r="2.3"
      fill="white"         // makes it hollow
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
)




const RegionIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M3 10l9-7 9 7v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 22V12h6v10" />
  </svg>
)

const DriveIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M3 13l2-5a2 2 0 011.89-1.33h10.22A2 2 0 0118 8l3 5M5 13h14m-1 4a2 2 0 11-4 0m-6 0a2 2 0 11-4 0"
    />
  </svg>
)

export default function RegionSelection({ onNext, onBack, register, setValue, getValues, errors }) {
  const [selectedRegion, setSelectedRegion] = useState(getValues("region") || "")
  const [selectedSubRegion, setSelectedSubRegion] = useState(getValues("subRegion") || "")

  const regions = [
    {
      id: "toronto",
      name: "Toronto/GTA",
      description: "Available for studio and on-location services",
      icon: TorontoIcon,
    },
    {
      id: "outside",
      name: "Outside GTA",
      description: "We travel to nearby areas for mobile services",
      icon: OutsideIcon,
    },
    {
      id: "destination",
      name: "Destination Wedding",
      description: "We provide travel-based bookings",
      icon: DestinationIcon,
    },
  ]

  const subRegions = [
    { id: "immediate", name: "Immediate Neighbors (15-30 Minutes)" },
    { id: "moderate", name: "Moderate Distance (30 Minutes to 1 Hour Drive)" },
    { id: "further", name: "Further Out But Still Reachable (1 Hour Plus)" },
  ]

  const handleRegionSelect = (regionName) => {
    setSelectedRegion(regionName)
    setValue("region", regionName)
    if (regionName !== "Outside GTA") {
      setSelectedSubRegion("")
      setValue("subRegion", "")
    }
  }

  const handleSubRegionSelect = (subRegionName) => {
    setSelectedSubRegion(subRegionName)
    setValue("subRegion", subRegionName)
  }

  const isNextEnabled =
    selectedRegion && (selectedRegion !== "Outside GTA" || selectedSubRegion)

  const handleNext = () => {
    if (!isNextEnabled) return
    onNext()
  }

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
      <div className="sm:p-8">
        {/* Header */}
        <div className="text-left mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-normal text-gray-900 mb-1 sm:mb-3 tracking-wide">
            Choose Your Region
            <span className="text-gray-400 ml-1">*</span>
          </h2>
          <p className="text-gray-700 text-sm sm:text-base font-light">
            Select your service area so we can tailor availability.
          </p>
        </div>

        {/* Region Options */}
        <div className="space-y-2 mb-6 sm:mb-5">
          {regions.map((region) => {
            const isSelected = selectedRegion === region.name
            return (
              <button
                key={region.id}
                type="button"
                onClick={() => handleRegionSelect(region.name)}
                className={`group relative w-full p-3 sm:p-4 rounded-lg border transition-all duration-300 flex items-center gap-3 sm:gap-4 ${
                  isSelected
                    ? "border-gray-700 bg-gray-100 shadow-md shadow-gray-400/20"
                    : "border-gray-300 bg-white hover:border-gray-500 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-400/10"
                }`}
              >
                {/* Left Radio Indicator */}
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center transition-all duration-300 mt-0.5">
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center">
                      <CheckIcon className="w-3 h-3 text-white" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-gray-400 group-hover:border-gray-600 transition-all duration-300" />
                  )}
                </div>

                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-md ${
                    isSelected
                      ? "bg-gray-300/50 shadow-sm shadow-gray-500/20"
                      : "bg-gray-200/50 group-hover:bg-gray-300/50"
                  }`}
                >
                  <region.icon
                    className={`w-4 h-4 sm:w-6 sm:h-6 ${
                      isSelected ? "text-gray-900" : "text-gray-900 group-hover:text-black"
                    }`}
                  />
                </div>


                {/* Text */}
                <div className="flex-1 min-w-0 text-left">
                  <h3
                    className={`text-sm sm:text-base font-light ${
                      isSelected ? "text-gray-900" : "text-gray-800 group-hover:text-gray-900"
                    }`}
                  >
                    {region.name}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm font-light ${
                      isSelected ? "text-gray-700" : "text-gray-600 group-hover:text-gray-700"
                    }`}
                  >
                    {region.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Subregions */}
        {selectedRegion === "Outside GTA" && (
          <div className="mt-8 sm:mt-10">
            <h3 className="text-lg sm:text-xl font-light text-gray-900 mb-3 flex items-center gap-2">
              <DriveIcon className="w-5 h-5 text-gray-700" />
              Approximate Drive Distance
              <span className="text-gray-400">*</span>
            </h3>

            <div className="space-y-2">
              {subRegions.map((sub) => {
                const isSelected = selectedSubRegion === sub.name
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => handleSubRegionSelect(sub.name)}
                    className={`group relative w-full p-3 sm:p-4 rounded-lg border transition-all duration-300 flex items-start gap-3 sm:gap-4 ${
                      isSelected
                        ? "border-gray-700 bg-gray-100 shadow-md shadow-gray-400/20"
                        : "border-gray-300 bg-white hover:border-gray-500 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-400/10"
                    }`}
                  >
                    {/* Left Indicator */}
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center transition-all duration-300 mt-0.5">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center">
                          <CheckIcon className="w-3 h-3 text-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-gray-400 group-hover:border-gray-600 transition-all duration-300" />
                      )}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0 text-left">
                      <h4
                        className={`text-sm sm:text-base font-light ${
                          isSelected ? "text-gray-900" : "text-gray-800 group-hover:text-gray-900"
                        }`}
                      >
                        {sub.name}
                      </h4>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}


        {/* Continue Button */}
        <div className="flex justify-between items-center mt-8 pt-6 sm:pt-8 border-t border-gray-200">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-light rounded-lg bg-gray-200 text-gray-900 border border-gray-400 shadow-md hover:bg-gray-300 hover:scale-[1.02] transition-all duration-300"
          >
            Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!isNextEnabled}
            className={`relative px-8 sm:px-10 py-2.5 sm:py-3 text-sm sm:text-base font-light rounded-lg transition-all duration-300 overflow-hidden ${
              isNextEnabled
                ? "bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white shadow-md shadow-gray-700/20 hover:shadow-lg hover:shadow-gray-700/30 hover:scale-[1.02] active:scale-100 border border-gray-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-400"
            }`}
          >
            {isNextEnabled && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-out"></div>
            )}
            <span className="relative">Continue</span>
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
  )
}


// import { useState } from 'react';
// import React from 'react';

// // Reusing the modern Icons from the latest design
// const CheckCircleIcon = ({ className }) => (
//   <svg className={className} fill="currentColor" viewBox="0 0 20 20">
//     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//   </svg>
// );
// const TimeIcon = ({ className }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//   </svg>
// );

// // Define the elegant color palette
// const PRIMARY_COLOR_CLASS = 'indigo-600';
// const PRIMARY_HOVER_CLASS = 'indigo-700';
// const LIGHT_ACCENT_CLASS = 'indigo-50';

// export default function RegionSelection({ onNext, onBack, register, setValue, getValues, errors }) {
//   const [selectedRegion, setSelectedRegion] = useState(getValues('region') || '');
//   const [selectedSubRegion, setSelectedSubRegion] = useState(getValues('subRegion') || '');

//   const regions = [
//     {
//       id: 'toronto',
//       name: 'Toronto/GTA',
//       description: '' // Kept empty as per base code
//     },
//     {
//       id: 'outside',
//       name: 'Outside GTA',
//       description: '' // Kept empty as per base code
//     },
//     {
//       id: 'destination',
//       name: 'Destination Wedding',
//       description: '' // Kept empty as per base code
//     }
//   ];

//   const subRegions = [
//     {
//       id: 'immediate',
//       name: 'Immediate Neighbors (15-30 Minutes)',
//       description: '' // Kept empty as per base code
//     },
//     {
//       id: 'moderate',
//       name: 'Moderate Distance (30 Minutes to 1 Hour Drive)',
//       description: '' // Kept empty as per base code
//     },
//     {
//       id: 'further',
//       name: 'Further Out But Still Reachable (1 Hour Plus)',
//       description: '' // Kept empty as per base code
//     }
//   ];

//   const handleRegionSelect = (regionName) => {
//     setSelectedRegion(regionName);
//     setValue('region', regionName);

//     // Clear sub-region if not Outside GTA (Logic retained)
//     if (regionName !== 'Outside GTA') {
//       setSelectedSubRegion('');
//       setValue('subRegion', '');
//     }
//   };

//   const handleSubRegionSelect = (subRegionName) => {
//     setSelectedSubRegion(subRegionName);
//     setValue('subRegion', subRegionName);
//   };

//   const handleNext = () => {
//     if (selectedRegion === 'Outside GTA' && !selectedSubRegion) {
//       return; // Logic retained
//     }
//     if (selectedRegion) {
//       onNext();
//     }
//   };

//   const isNextEnabled = selectedRegion && (selectedRegion !== 'Outside GTA' || selectedSubRegion);

//   return (
//     // Applied elegant container styling from the latest design
//     <div className="max-w-sm md:max-w-2xl lg:max-w-6xl mx-auto px-4 py-4 md:py-8 lg:py-12">
//       <div className="bg-white rounded-xl shadow-2xl p-4 md:p-8 lg:p-14 border border-gray-50">

//         {/* Header Section: Applied elegant typography */}
//         <div className="mb-6 md:mb-10 lg:mb-14">
//           <h2 className="text-lg md:text-2xl lg:text-4xl font-light text-gray-900 mb-2 md:mb-3 tracking-tight text-left">
//             What region do you need services in?
//             <span className="text-red-500 ml-1 font-normal">*</span>
//           </h2>
//           <p className="text-gray-500 text-sm md:text-base lg:text-lg">Select your preferred service location to get started.</p>
//         </div>

//         {/* Region Cards Grid: Reverted to 3-column layout, applied elegant card design and hover animation */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
//           {regions.map((region) => {
//             const isSelected = selectedRegion === region.name;
//             return (
//               <button
//                 key={region.id}
//                 type="button"
//                 onClick={() => handleRegionSelect(region.name)}
//                 className={`
//                   p-4 md:p-6 lg:p-8 rounded-xl text-left transition-all duration-300 border shadow-lg
//                   ${isSelected
//                     ? `bg-${PRIMARY_COLOR_CLASS} border-${PRIMARY_COLOR_CLASS} text-white transform scale-[1.02] shadow-xl`
//                     : `bg-white border-gray-200 hover:border-${PRIMARY_COLOR_CLASS} hover:shadow-xl hover:scale-[1.01]`
//                   }
//                   cursor-pointer hover:cursor-pointer
//                 `}
//               >
//                 <div className={`font-bold text-lg md:text-xl mb-2 ${
//                   isSelected ? 'text-white' : 'text-gray-900' // Consistent typography
//                 }`}>
//                   {region.name}
//                 </div>
//                 {/* The description is intentionally left out here as it was empty in the base code's array data */}

//                 {isSelected && (
//                   <div className={`mt-4 flex items-center text-white text-sm font-semibold`}>
//                     <CheckCircleIcon className="w-5 h-5 mr-2" />
//                     Selected
//                   </div>
//                 )}
//               </button>
//             )
//           })}
//         </div>

//         {/* Sub-region Selection: Applied elegant conditional styling */}
//         {selectedRegion === 'Outside GTA' && (
//           <div className="mb-8 md:mb-12 p-4 md:p-6 lg:p-8 bg-gray-50 rounded-xl border border-gray-200">
//             <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center">
//               <TimeIcon className={`w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-${PRIMARY_COLOR_CLASS}`} />
//               Roughly how long does it take you to drive to the GTA?
//               <span className="text-red-500 ml-1 font-normal">*</span>
//             </h3>

//             <div className="space-y-3 md:space-y-4">
//               {subRegions.map((subRegion) => {
//                 const isSubSelected = selectedSubRegion === subRegion.name;
//                 return (
//                   <button
//                     key={subRegion.id}
//                     type="button"
//                     onClick={() => handleSubRegionSelect(subRegion.name)} // Retained logic: selecting by subRegion.name
//                     className={`
//                       cursor-pointer w-full p-3 md:p-4 lg:p-5 rounded-lg text-left transition-all duration-300 border flex items-center justify-between
//                       ${isSubSelected
//                         ? `bg-${PRIMARY_COLOR_CLASS} border-${PRIMARY_COLOR_CLASS} shadow-lg transform scale-[1.01]`
//                         : `bg-white border-gray-300 hover:border-${PRIMARY_COLOR_CLASS} hover:shadow-md hover:scale-[1.005]`
//                       }
//                       hover:cursor-pointer
//                     `}
//                   >
//                     <div className="flex-1">
//                       <div className={`font-semibold text-base md:text-lg ${ // Styled name prominently
//                         isSubSelected ? 'text-white' : 'text-gray-900'
//                       }`}>
//                         {subRegion.name}
//                       </div>
//                     </div>
//                     {isSubSelected && (
//                       <div className="ml-4">
//                         <CheckCircleIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
//                       </div>
//                     )}
//                   </button>
//                 )
//               })}
//             </div>
//           </div>
//         )}

//         {/* Error Messages: Applied clean, modern error styling */}
//         {errors.region && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg">
//             <div className="flex items-center">
//               <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//               </svg>
//               <p className="text-red-800 text-sm font-medium">Please select a region to continue</p>
//             </div>
//           </div>
//         )}

//         {selectedRegion === 'Outside GTA' && !selectedSubRegion && (
//           <div className="mb-6 p-4 bg-amber-50 border border-amber-300 rounded-lg">
//             <div className="flex items-center">
//               <svg className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//               </svg>
//               <p className="text-amber-800 text-sm font-medium">Please select how long it takes to drive to the GTA</p>
//             </div>
//           </div>
//         )}

//         {/* Navigation Buttons: Back and Continue */}
//         <div className="flex justify-between items-center pt-6 md:pt-8 border-t border-gray-100 mt-4 md:mt-6">
//           <button
//             type="button"
//             onClick={onBack}
//             className="px-4 py-2 md:px-6 md:py-3 lg:px-10 lg:py-3.5 rounded-xl font-bold text-sm md:text-base lg:text-lg shadow-lg transition-all duration-300 bg-gray-100 text-black hover:bg-gray-200 hover:shadow-xl transform hover:scale-[1.01] cursor-pointer"
//           >
//             Back
//           </button>

//           <button
//             type="button"
//             onClick={handleNext}
//             disabled={!isNextEnabled}
//             className={`
//               px-4 py-2 md:px-6 md:py-3 lg:px-10 lg:py-3.5 rounded-xl font-bold text-sm md:text-base lg:text-lg shadow-lg transition-all duration-300
//               ${isNextEnabled
//                 ? `bg-${PRIMARY_COLOR_CLASS} text-white hover:bg-${PRIMARY_HOVER_CLASS} hover:shadow-xl transform hover:scale-[1.01] cursor-pointer`
//                 : 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
//               }
//             `}
//           >
//             Continue
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
