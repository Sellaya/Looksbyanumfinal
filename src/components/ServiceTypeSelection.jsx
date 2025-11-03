"use client";
import { useState, useEffect } from "react";
import BridalMakeupIcon from "../assets/Bridal-Makeup (2).png";
import SemiBridalMakeupIcon from "../assets/Semi-Bridal-Makeup.png";

// Icons
const RingIcon = ({ className }) => <img src={BridalMakeupIcon}></img>;

const MakeupIcon = ({ className }) => (
  <img src={SemiBridalMakeupIcon} classname=""></img>
);

const CameraIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 9a2 2 0 012-2h.93a2 2 0 001.66-.9l.72-1.44A2 2 0 0110.3 3h3.4a2 2 0 011.66.9l.72 1.44a2 2 0 001.66.9H19a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
    />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

export default function ServiceTypeSelection({
  onNext,
  onBack,
  register,
  setValue,
  getValues,
  watch,
  errors,
}) {
  const [selectedService, setSelectedService] = useState("");

  const serviceTypes = [
    {
      id: "bridal",
      name: "Bridal",
      value: "Bridal",
      description: "Full bridal makeup and hair styling",
      icon: RingIcon,
    },
    {
      id: "semi-bridal",
      name: "Semi Bridal",
      value: "Semi-Bridal",
      description: "Elegant styling for special occasions",
      icon: MakeupIcon,
    },
    {
      id: "non-bridal",
      name: "Non-Bridal / Photoshoot",
      value: "Non-Bridal",
      description: "Makeup and styling for photoshoots or events",
      icon: CameraIcon,
    },
  ];

  const watchedServiceType = watch("service_type");

  useEffect(() => {
    if (watchedServiceType) {
      const service = serviceTypes.find((s) => s.value === watchedServiceType);
      if (service) setSelectedService(service.name);
    } else {
      setSelectedService("");
    }
  }, [watchedServiceType]);

  const handleServiceSelect = (service) => {
    setSelectedService(service.name);
    setValue("service_type", service.value);
  };

  const handleNext = () => {
    if (selectedService) onNext();
  };

  const isNextEnabled = !!selectedService;

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="sm:p-8 text-left">
        {/* Header Section */}
        <div className="text-left mb-4 sm:mb-5">
          <h2 className="text-2xl sm:text-3xl font-normal text-gray-900 mb-1 sm:mb-3 tracking-wide">
            Select Your Service Type
            <span className="text-gray-400 ml-2">*</span>
          </h2>
          <p
            className="text-gray-700 text-sm sm:text-base font-light max-w-2xl mx-auto"
            style={{ letterSpacing: "0.01em" }}
          >
            Choose the service that best suits your occasion.
          </p>
        </div>

        {/* Service Type Cards */}
        <div className="space-y-2 mb-6 sm:mb-5">
          {serviceTypes.map((service) => {
            const isSelected = selectedService === service.name;
            const IconComponent = service.icon;
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => handleServiceSelect(service)}
                className={`group relative w-full p-3 sm:p-4 rounded-lg border transition-all duration-300 text-left overflow-hidden cursor-pointer flex items-center gap-3 sm:gap-4 ${
                  isSelected
                    ? "border-gray-700 bg-gray-100 shadow-md shadow-gray-400/20"
                    : "border-gray-300 bg-white hover:border-gray-500 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-400/10"
                }`}
              >
                {/* Selection Indicator */}
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center transition-all duration-300">
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-gray-400 group-hover:border-gray-600 transition-all duration-300" />
                  )}
                </div>

                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-md transition-all duration-300 ${
                    isSelected
                      ? "bg-gray-300/50 shadow-sm shadow-gray-500/20"
                      : "bg-gray-200/50 group-hover:bg-gray-300/50 group-hover:scale-105"
                  }`}
                >
                  <IconComponent
                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                      isSelected
                        ? "text-gray-700"
                        : "text-gray-600 group-hover:text-gray-700"
                    }`}
                  />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-sm sm:text-base font-light transition-colors leading-tight ${
                      isSelected
                        ? "text-gray-900"
                        : "text-gray-800 group-hover:text-gray-900"
                    }`}
                    style={{ letterSpacing: "0.01em" }}
                  >
                    {service.name}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm font-light transition-colors leading-relaxed ${
                      isSelected
                        ? "text-gray-700"
                        : "text-gray-600 group-hover:text-gray-700"
                    }`}
                    style={{ letterSpacing: "0.01em" }}
                  >
                    {service.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-5 pt-6 sm:pt-8 border-t border-gray-200">
          <button
            onClick={onBack}
            className="group relative px-5 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-light rounded-lg transition-all duration-300 overflow-hidden bg-gray-200 text-gray-900 shadow-md shadow-gray-400/20 hover:bg-gray-300 hover:scale-[1.02] active:scale-100 cursor-pointer border border-gray-400"
          >
            Back
          </button>

          <div>
            <button
              type="button"
              onClick={handleNext}
              disabled={!isNextEnabled}
              className={`relative px-8 sm:px-10 py-2.5 sm:py-3 text-sm sm:text-base font-light rounded-lg transition-all duration-300 overflow-hidden ${
                isNextEnabled
                  ? "bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white shadow-md shadow-gray-700/20 hover:shadow-lg hover:shadow-gray-700/30 hover:scale-[1.02] active:scale-100 cursor-pointer border border-gray-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-400"
              }`}
              style={{ letterSpacing: "0.05em" }}
            >
              {isNextEnabled && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-out"></div>
              )}
              <span className="relative flex items-center justify-center gap-2">
                Continue
              </span>
            </button>
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <div>
            <p className="inline-block">Want to start Over?</p>
            <a href="/" className="pl-2 text-blue-700">
              Go to First Step
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// import { useState, useEffect } from 'react';
// import React from 'react';

// // Reusing the modern Icons from the established design
// const CheckCircleIcon = ({ className }) => (
//   <svg className={className} fill="currentColor" viewBox="0 0 20 20">
//     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//   </svg>
// );
// // TimeIcon is not used here but kept for consistency if needed later
// // const TimeIcon = ({ className }) => (
// //   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
// //   </svg>
// // );

// // Define the elegant color palette (Indigo theme)
// const PRIMARY_COLOR_CLASS = 'indigo-600';
// const PRIMARY_HOVER_CLASS = 'indigo-700';
// const LIGHT_ACCENT_CLASS = 'indigo-50'; // Used for lighter text color on selected state

// export default function ServiceTypeSelection({ onNext, onBack, register, setValue, getValues, watch, errors }) {
//   const [selectedService, setSelectedService] = useState('');

//   const serviceTypes = [
//     {
//       id: 'bridal',
//       name: 'Bridal',
//       value: 'Bridal',
//       description: 'Full bridal makeup and hair styling',
//       icon: '👰'
//     },
//     {
//       id: 'semi-bridal',
//       name: 'Semi Bridal',
//       value: 'Semi-Bridal',
//       description: 'Elegant styling for special occasions',
//       icon: '💄'
//     },
//     {
//       id: 'non-bridal',
//       name: 'Non-Bridal / Photoshoot',
//       value: 'Non-Bridal',
//       description: 'Makeup and styling for photoshoots or events',
//       icon: '✨'
//     }
//   ];

//   // Watch the service_type field and update selectedService accordingly
//   const watchedServiceType = watch('service_type');
//   useEffect(() => {
//     if (watchedServiceType) {
//       const service = serviceTypes.find(s => s.value === watchedServiceType);
//       if (service) {
//         setSelectedService(service.name);
//       }
//     } else {
//       setSelectedService('');
//     }
//   }, [watchedServiceType]);

//   const handleServiceSelect = (service) => {
//     setSelectedService(service.name);
//     setValue('service_type', service.value);
//   };

//   const handleNext = () => {
//     if (selectedService) {
//       onNext();
//     }
//   };

//   // Logic for enabling the continue button remains unchanged
//   const isNextEnabled = !!selectedService;

//   return (
//     // Applied elegant container styling (max-w-6xl, shadow-2xl, increased padding)
//     <div className="max-w-sm md:max-w-2xl lg:max-w-6xl mx-auto px-4 py-4 md:py-8 lg:py-12">
//       <div className="bg-white rounded-xl shadow-2xl p-4 md:p-8 lg:p-14 border border-gray-50">

//         {/* Header Section: Applied elegant typography (font-light, larger size) */}
//         <div className="mb-6 md:mb-10 lg:mb-14">
//           <h2 className="text-lg md:text-2xl lg:text-4xl font-light text-gray-900 mb-2 md:mb-3 tracking-tight text-left">
//             What type of service do you need?
//             <span className="text-red-500 ml-1 font-normal">*</span>
//           </h2>
//           {/* Added consistent descriptive text below header for flow */}
//           <p className="text-gray-500 text-sm md:text-base lg:text-lg">Choose the service that best suits your needs.</p>
//         </div>

//         {/* Service Cards Grid: Using grid gap and applying the elegant card design */}
//         <div className="grid gap-4 md:gap-6 mb-8 md:mb-12">
//           {serviceTypes.map((service) => {
//             const isSelected = selectedService === service.name;
//             return (
//               <button
//                 key={service.id}
//                 type="button"
//                 onClick={() => handleServiceSelect(service)}
//                 className={`
//                   w-full p-4 md:p-6 rounded-xl text-left transition-all duration-300 border shadow-lg flex items-center justify-between
//                   ${isSelected
//                     // Applied Indigo selection style and scale animation
//                     ? `bg-${PRIMARY_COLOR_CLASS} border-${PRIMARY_COLOR_CLASS} text-white transform scale-[1.01] shadow-xl`
//                     // Applied Indigo hover style and scale animation
//                     : `bg-white border-gray-200 hover:border-${PRIMARY_COLOR_CLASS} hover:shadow-xl hover:scale-[1.005]`
//                   }
//                   cursor-pointer hover:cursor-pointer
//                 `}
//               >
//                 <div className="flex items-center gap-4 md:gap-6 flex-1">
//                   {/* Icon: Enlarged and styled for prominence */}
//                   <div className={`text-2xl md:text-3xl lg:text-4xl ${isSelected ? 'opacity-90' : 'opacity-70'}`}>{service.icon}</div>
//                   <div className="flex-1">
//                     <div className={`font-bold text-lg md:text-xl mb-1 ${
//                       isSelected ? 'text-white' : 'text-gray-900'
//                     }`}>
//                       {service.name}
//                       {service.subtitle && ( // Kept existing subtitle logic
//                         <span className="text-gray-500 font-normal">{service.subtitle}</span>
//                       )}
//                     </div>
//                     {/* Description: Styled for contrast on selected state */}
//                     <div className={`text-sm md:text-base leading-relaxed ${
//                       isSelected ? `text-${LIGHT_ACCENT_CLASS}` : 'text-gray-600'
//                     }`}>
//                       {service.description}
//                     </div>
//                   </div>
//                 </div>

//                 {isSelected && (
//                   <div className="ml-4">
//                     {/* Check Circle Icon: Used consistent checkmark style */}
//                     <CheckCircleIcon className="w-6 h-6 text-white" />
//                   </div>
//                 )}
//               </button>
//             )
//           })}
//         </div>

//         {/* Error Messages: Applied clean, modern error styling */}
//         {errors.service_type && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg">
//             <div className="flex items-center">
//               <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//               </svg>
//               <p className="text-red-800 text-sm font-medium">Please select a service type to continue</p>
//             </div>
//           </div>
//         )}

//         {/* Action Buttons: Styled to match the elegant button pattern */}
//         <div className="flex justify-between pt-6 md:pt-8 border-t border-gray-100 mt-4 md:mt-6">
//           <button
//             type="button"
//             onClick={onBack}
//             // MATCHED STYLING: Now uses solid fill for same appearance as 'Continue'
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
//                 // Applied Indigo primary button style
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
