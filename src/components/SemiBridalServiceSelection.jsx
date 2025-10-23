import React from "react"

const CheckCircleIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

export default function SemiBridalServiceSelection({ register, watch, errors, onNext, onBack, setValue }) {
  const watchedFields = watch()
  const selectedService = watchedFields.bride_service

  const handleServiceSelect = (service) => setValue("bride_service", service)
  const handleNext = () => {
    if (selectedService) onNext()
  }

  const isNextEnabled = !!selectedService

  const SelectCard = ({ value, label, subtext, priceText, onClick, isSelected, registerProps }) => (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full text-left flex items-center justify-between p-4 sm:p-5 rounded-lg border transition-all duration-300
        ${
          isSelected
            ? "border-gray-700 bg-gray-100 shadow-md shadow-gray-400/20"
            : "border-gray-300 bg-white hover:border-gray-500 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-400/10"
        }
      `}
    >
      <div className="flex items-start space-x-3 sm:space-x-4">
        <input
          type="radio"
          {...registerProps}
          value={value}
          checked={isSelected}
          readOnly
          className="sr-only"
        />
        <div>
          <h3
            className={`text-base sm:text-lg font-light transition-colors ${
              isSelected ? "text-gray-900" : "text-gray-800 group-hover:text-gray-900"
            }`}
            style={{ letterSpacing: "0.01em" }}
          >
            {label}
          </h3>
          <p
            className={`text-sm font-light transition-colors ${
              isSelected ? "text-gray-700" : "text-gray-600 group-hover:text-gray-700"
            }`}
          >
            {subtext}
          </p>
        </div>
      </div>

      <div className="text-right flex items-center space-x-3">
        <span
          className={`text-sm sm:text-base font-light ${
            isSelected ? "text-gray-900" : "text-gray-600"
          }`}
        >
          {priceText}
        </span>
        {isSelected ? (
          <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center">
            <CheckCircleIcon className="w-3 h-3 text-white" />
          </div>
        ) : (
          <div className="w-5 h-5 rounded-full border border-gray-400 group-hover:border-gray-600 transition-all" />
        )}
      </div>
    </button>
  )

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
      <div className="sm:p-8">
        {/* Header */}
        <div className="text-left mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-normal text-gray-900 tracking-wide mb-2">
            Semi Bridal Service Details <span className="text-gray-400">*</span>
          </h2>
          <p className="text-gray-700 text-sm sm:text-base font-light max-w-2xl">
            What service do you need?
          </p>
        </div>

        {/* Service Options */}
        <div className="space-y-3 mb-8">
          <SelectCard
            value="Both Hair & Makeup"
            label="Both Hair & Makeup"
            subtext="Complete semi bridal styling package"
            onClick={() => handleServiceSelect("Both Hair & Makeup")}
            isSelected={selectedService === "Both Hair & Makeup"}
            registerProps={register("bride_service")}
          />

          <SelectCard
            value="Hair Only"
            label="Hair Only"
            subtext="Professional hair styling"
            onClick={() => handleServiceSelect("Hair Only")}
            isSelected={selectedService === "Hair Only"}
            registerProps={register("bride_service")}
          />

          <SelectCard
            value="Makeup Only"
            label="Makeup Only"
            subtext="Professional makeup application"
            onClick={() => handleServiceSelect("Makeup Only")}
            isSelected={selectedService === "Makeup Only"}
            registerProps={register("bride_service")}
          />
        </div>
        
        <div className="text-left mb-6 sm:mb-8">
          <p className="text-gray-900 italic text-sm sm:text-base font-light max-w-2xl">
            *Price varies by package
          </p>
        </div>
        

        {/* Validation Message */}
        {errors.bride_service && (
          <div className="mb-6 p-3 bg-gray-50 border border-gray-300 rounded-md text-center">
            <p className="text-sm text-gray-700 font-light">{errors.bride_service.message}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-5 border-t border-gray-200">
          <button
            type="button"
            onClick={onBack}
            className="px-6 sm:px-8 py-3 rounded-lg bg-gray-100 text-gray-800 font-light border border-gray-300 hover:bg-gray-200 hover:shadow-sm transition-all duration-300"
            style={{ letterSpacing: "0.03em" }}
          >
            Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!isNextEnabled}
            className={`px-8 sm:px-10 py-3 rounded-lg font-light transition-all duration-300 border ${
              isNextEnabled
                ? "bg-gray-900 text-white border-gray-900 hover:bg-gray-800 hover:shadow-md shadow-gray-500/30"
                : "bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed"
            }`}
            style={{ letterSpacing: "0.03em" }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}


// import React from 'react';

// // Define the elegant color palette (Indigo theme)
// const PRIMARY_COLOR_CLASS = 'indigo-600';
// const PRIMARY_HOVER_CLASS = 'indigo-700';
// const LIGHT_ACCENT_CLASS = 'indigo-50'; // For lighter text on selection background

// // Icon for Checkmarks
// const CheckCircleIcon = ({ className = "w-6 h-6" }) => (
//     <svg className={className} fill="currentColor" viewBox="0 0 20 20">
//       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//     </svg>
// );

// export default function SemiBridalServiceSelection({ register, watch, errors, onNext, onBack, setValue }) {
//   const watchedFields = watch();
//   const selectedService = watchedFields.bride_service;

//   const handleServiceSelect = (service) => {
//     setValue('bride_service', service);
//   };

//   const handleNext = () => {
//     if (selectedService) {
//       onNext();
//     }
//   };

//   const isNextEnabled = selectedService;

//   // Helper component for consistent card styling
//   const SelectCard = ({ value, label, subtext, priceText, onClick, isSelected, registerProps }) => (
//     <div
//       onClick={onClick}
//       className={`
//         border border-gray-200 rounded-xl p-4 md:p-6 cursor-pointer transition-all duration-300 shadow-lg
//         ${isSelected
//           ? `bg-${PRIMARY_COLOR_CLASS} border-${PRIMARY_COLOR_CLASS} text-white transform scale-[1.01] shadow-xl`
//           : `bg-white hover:border-${PRIMARY_COLOR_CLASS} hover:shadow-xl hover:scale-[1.005]`
//         }
//       `}
//     >
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-3 md:space-x-4">
//             {/* The hidden radio input is necessary to pass the value to react-hook-form */}
//             <input
//                 type="radio"
//                 {...registerProps}
//                 value={value}
//                 checked={isSelected}
//                 readOnly
//                 className="sr-only"
//             />
//           <div>
//             <h3 className={`font-bold text-lg md:text-xl mb-1 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
//               {label}
//             </h3>
//             <p className={`text-sm md:text-base ${isSelected ? `text-${LIGHT_ACCENT_CLASS}` : 'text-gray-600'}`}>
//               {subtext}
//             </p>
//           </div>
//         </div>

//         <div className="text-right flex items-center space-x-2 md:space-x-3">
//             <span className={`text-sm md:text-base ${isSelected ? 'text-white' : 'text-gray-500'}`}>
//               {priceText}
//             </span>
//             {isSelected ? (
//                 <CheckCircleIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
//             ) : (
//                 <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-gray-300"></div>
//             )}
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     // Applied elegant container styling (max-w-6xl, shadow-2xl, increased padding)
//     <div className="max-w-sm md:max-w-2xl lg:max-w-6xl mx-auto px-4 py-8 md:py-12">
//       <div className="bg-white rounded-xl shadow-2xl p-6 md:p-14 border border-gray-50">

//         {/* Header Section: Applied elegant typography (font-light, larger size) */}
//         <div className="mb-10 md:mb-14">
//           <h2 className="text-base md:text-2xl lg:text-4xl font-light text-gray-900 mb-3 tracking-tight text-left">
//             Semi Bridal Service Details
//           </h2>
//           <p className="text-gray-500 text-sm md:text-base lg:text-lg">What service do you need?</p>
//         </div>

//         <div className="space-y-6 mb-12">
//           {/* Both Hair & Makeup */}
//           <SelectCard
//             value="Both Hair & Makeup"
//             label="Both Hair & Makeup"
//             subtext="Complete semi bridal styling package"
//             priceText="Price varies by package"
//             onClick={() => handleServiceSelect('Both Hair & Makeup')}
//             isSelected={selectedService === 'Both Hair & Makeup'}
//             registerProps={register('bride_service')}
//           />

//           {/* Hair Only */}
//           <SelectCard
//             value="Hair Only"
//             label="Hair Only"
//             subtext="Professional hair styling"
//             priceText="Price varies by package"
//             onClick={() => handleServiceSelect('Hair Only')}
//             isSelected={selectedService === 'Hair Only'}
//             registerProps={register('bride_service')}
//           />

//           {/* Makeup Only */}
//           <SelectCard
//             value="Makeup Only"
//             label="Makeup Only"
//             subtext="Professional makeup application"
//             priceText="Price varies by package"
//             onClick={() => handleServiceSelect('Makeup Only')}
//             isSelected={selectedService === 'Makeup Only'}
//             registerProps={register('bride_service')}
//           />
//         </div>

//         {errors.bride_service && (
//           <p className="mt-2 text-sm text-red-600 text-center mb-8">{errors.bride_service.message}</p>
//         )}

//         {/* Navigation Buttons */}
//         <div className="flex justify-between items-center pt-6 md:pt-8 border-t border-gray-100 mt-4 md:mt-6">
//           <button
//             type="button"
//             onClick={onBack}
//             // Back button MATCHED to primary style (solid Indigo fill)
//             className={`
//               px-4 py-2 md:px-6 md:py-3 lg:px-10 lg:py-3.5 rounded-xl font-bold text-sm md:text-base lg:text-lg shadow-lg transition-all duration-300
//               bg-${PRIMARY_COLOR_CLASS} text-white
//               hover:bg-${PRIMARY_HOVER_CLASS} hover:shadow-xl transform hover:scale-[1.01] cursor-pointer
//             `}
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
