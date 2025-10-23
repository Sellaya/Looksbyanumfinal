"use client"

import { useState } from "react"

// Styled input field as mini-card
const InputCard = ({ name, type, placeholder, error, register, maxLength, prefix }) => (
  <div className={`group relative w-full p-3 sm:p-4 rounded-lg border transition-all duration-300 cursor-pointer overflow-hidden flex items-center gap-3 ${
      error
        ? "border-red-400 bg-red-50 shadow-sm shadow-red-200"
        : "border-gray-300 bg-white hover:border-gray-500 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-400/10"
    }`}
  >
    {prefix && <span className="text-gray-600 font-light text-sm md:text-base">{prefix}</span>}
    <input
      type={type}
      {...register(name)}
      maxLength={maxLength}
      placeholder={placeholder}
      className={`flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 font-light text-sm md:text-base lg:text-lg`}
    />
    {error && <p className="absolute bottom-[-22px] left-0 text-red-600 text-sm font-light">{error.message}</p>}
  </div>
)

export default function ClientDetails({
  onNext,
  onBack,
  register,
  errors,
  setValue,
  handleSubmit,
  watch,
  getValues,
  isGlobalLoading = false,
}) {
  const watchedValues = watch()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = (data) => {
    try {
      console.log("ClientDetails onSubmit called with data:", data)

      if (Object.keys(errors).length > 0) {
        console.error("Form has validation errors, cannot submit:", errors)
        return
      }

      setIsSubmitting(true)

      if (data.phone && !data.phone.startsWith("+1")) {
        data.phone = "+1" + data.phone
      }

      if (window.fbq) {
        window.fbq("track", "Lead")
        console.log("✅ Meta Pixel 'Lead' event fired")
      }

      onNext()
    } catch (error) {
      console.error("Error in ClientDetails onSubmit:", error)
      setIsSubmitting(false)
    }
  }

  const isNextEnabled =
    watchedValues.first_name?.trim() &&
    watchedValues.last_name?.trim() &&
    watchedValues.email?.trim() &&
    watchedValues.phone?.trim() &&
    !errors.first_name &&
    !errors.last_name &&
    !errors.email &&
    !errors.phone

  const isDisabled = !isNextEnabled || isSubmitting || isGlobalLoading
  const showLoaderVisual = isSubmitting || isGlobalLoading

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
      <div className="sm:p-8">
        {/* Header */}
        <div className="text-left mb-4 sm:mb-5">
          <h2 className="text-2xl sm:text-3xl font-normal text-gray-900 mb-2 tracking-wide">
            Contact Information
            <span className="text-gray-400 ml-2">*</span>
          </h2>
          <p className="text-gray-700 text-sm sm:text-base font-light max-w-2xl mx-auto">
            Please enter your contact details to finalize the booking.
          </p>
        </div>

        {/* Form Card */}
        <div className="space-y-3 sm:space-y-4">
          <InputCard name="first_name" type="text" placeholder="First Name *" error={errors.first_name} register={register} />
          <InputCard name="last_name" type="text" placeholder="Last Name *" error={errors.last_name} register={register} />
          <InputCard name="email" type="email" placeholder="Email Address *" error={errors.email} register={register} />
          <InputCard
            name="phone"
            type="tel"
            placeholder="Phone Number * (e.g., 6045555555)"
            error={errors.phone}
            register={register}
            maxLength={10}
            prefix="+1"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center pt-6 sm:pt-8 border-t border-gray-200 mt-6">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting || isGlobalLoading}
            className="px-5 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-light rounded-lg bg-gray-200 text-gray-900 hover:bg-gray-300 border border-gray-400 transition-all duration-300"
          >
            Back
          </button>

          <button
            type="button"
            disabled={isDisabled}
            onClick={() =>
              handleSubmit(
                (data) => onSubmit(data),
                (validationErrors) => setIsSubmitting(false)
              )()
            }
            className={`relative px-8 sm:px-10 py-2.5 sm:py-3 text-sm sm:text-base font-light rounded-lg transition-all duration-300 overflow-hidden ${
              isNextEnabled && !showLoaderVisual
                ? "bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-100 cursor-pointer border border-gray-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-400"
            }`}
          >
            {showLoaderVisual ? (
              <span className="relative flex items-center justify-center gap-2.5">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </span>
            ) : (
              <span className="relative flex items-center justify-center gap-2.5">Continue</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}



// import React from "react";

// // Define the elegant color palette (Rose Glow Dark Mode theme)
// // REMOVED: Indigo theme consts

// // Helper component for consistent input styling - CONVERTED TO ROSE GLOW STANDARD
// const InputField = ({
//   name,
//   type,
//   placeholder,
//   error,
//   register,
//   maxLength,
//   prefix,
// }) => (
//   <div>
//     <div className="relative">
//       {prefix && (
//         <div className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-light text-sm md:text-base lg:text-lg pointer-events-none">
//           {prefix}
//         </div>
//       )}
//       <input
//         type={type}
//         {...register(name)}
//         maxLength={maxLength}
//         // Applied elegant Dark Mode input styling
//         className={`
//      w-full px-4 py-2 md:px-5 md:py-3 lg:py-3.5 rounded-xl transition-all duration-200 text-neutral-200
//      bg-neutral-900 border border-neutral-700
//      focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500
//      placeholder-gray-500 text-sm md:text-base lg:text-lg font-light
//      ${prefix ? "pl-10 md:pl-12" : ""}
//      ${error ? "border-red-700 focus:border-red-700 focus:ring-red-500/50" : ""}
//     `}
//         placeholder={placeholder}
//       />
//     </div>
//     {error && (
//       <p className="mt-2 text-sm text-red-300 font-light">{error.message}</p>
//     )}
//   </div>
// );

// export default function ClientDetails({
//   onNext,
//   onBack,
//   register,
//   errors,
//   setValue,
//   handleSubmit,
//   watch,
//   getValues,
// }) {
//   const watchedValues = watch();

//   const onSubmit = (data) => {
//     try {
//       console.log("ClientDetails onSubmit called with data:", data);
//       console.log("Form errors:", errors);
//       console.log("All form values:", watchedValues);
//       console.log(
//         "Form is valid for submission:",
//         Object.keys(errors).length === 0
//       );

//       // Check if there are any errors that would prevent submission
//       if (Object.keys(errors).length > 0) {
//         console.error("Form has validation errors, cannot submit:", errors);
//         return;
//       }

//       // Prepend +1 to phone number if not already present (Logic retained)
//       if (data.phone && !data.phone.startsWith("+1")) {
//         data.phone = "+1" + data.phone;
//       }
//       // Form validation is handled by react-hook-form
//       console.log("Calling onNext() from ClientDetails");
//       onNext();
//     } catch (error) {
//       console.error("Error in ClientDetails onSubmit:", error);
//     }
//   };

//   // Check if all required fields have values and no errors (Logic retained)
//   const isNextEnabled =
//     watchedValues.first_name?.trim() &&
//     watchedValues.last_name?.trim() &&
//     watchedValues.email?.trim() &&
//     watchedValues.phone?.trim() &&
//     !errors.first_name &&
//     !errors.last_name &&
//     !errors.email &&
//     !errors.phone;

//   console.log("ClientDetails validation:", {
//     first_name: watchedValues.first_name,
//     last_name: watchedValues.last_name,
//     email: watchedValues.email,
//     phone: watchedValues.phone,
//     errors: {
//       first_name: errors.first_name,
//       last_name: errors.last_name,
//       email: errors.email,
//       phone: errors.phone,
//     },
//     isNextEnabled,
//     allFormErrors: errors,
//     formIsValid: Object.keys(errors).length === 0,
//   });

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
//       {/* Inner Card Container: Dark, blurred, bordered standard */}
//       <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-7 sm:p-10 lg:p-14 border border-gray-700/50 shadow-2xl shadow-gray-900/50">
//         {/* Header Section: Applied elegant typography standard */}
//         <div className="mb-10 sm:mb-14 text-center">
//           <h2
//             className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-4 tracking-wide leading-tight"
//             style={{
//               fontFamily: "system-ui, -apple-system, sans-serif",
//               letterSpacing: "0.02em",
//             }}
//           >
//             Contact Information
//             <span className="text-rose-400 ml-2 font-normal">*</span>
//           </h2>
//           {/* Divider line matching standard */}
//           <div className="h-0.5 w-20 bg-gradient-to-r from-rose-400 via-pink-400 to-fuchsia-400 rounded-full mx-auto mb-5 opacity-80"></div>
//           <p
//             className="text-gray-300 text-base sm:text-lg font-light max-w-2xl mx-auto leading-relaxed"
//             style={{ letterSpacing: "0.01em" }}
//           >
//             Please enter your contact details to finalize the booking.
//           </p>
//         </div>

//         <form>
//           <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
//             {/* First Name */}
//             <InputField
//               name="first_name"
//               type="text"
//               placeholder="First Name *"
//               error={errors.first_name}
//               register={register}
//             />

//             {/* Last Name */}
//             <InputField
//               name="last_name"
//               type="text"
//               placeholder="Last Name *"
//               error={errors.last_name}
//               register={register}
//             />

//             {/* Email Address */}
//             <InputField
//               name="email"
//               type="email"
//               placeholder="Email Address *"
//               error={errors.email}
//               register={register}
//             />

//             {/* Phone Number */}
//             <InputField
//               name="phone"
//               type="tel"
//               placeholder="Phone Number * (e.g., 6045555555)"
//               error={errors.phone}
//               register={register}
//               maxLength={10}
//               prefix="+1"
//             />
//           </div>

//           {/* Action Buttons: Applied the two-button standard */}
//           <div className="flex justify-between items-center pt-6 sm:pt-8 border-t border-gray-700/50 mt-4 md:mt-6">
//             {/* Back Button (Secondary Style) */}
//             <button
//               type="button"
//               onClick={onBack}
//               className="group relative px-6 py-3.5 sm:px-10 sm:py-4 text-base sm:text-lg font-light rounded-xl transition-all duration-300 overflow-hidden bg-gray-700/50 text-gray-200 shadow-lg shadow-gray-900/50 hover:bg-gray-700/80 hover:scale-[1.03] active:scale-100 cursor-pointer border border-gray-600/30"
//               style={{ letterSpacing: "0.05em" }}
//             >
//               <span className="relative">Back</span>
//             </button>

//             {/* Continue Button (Primary Style - Rose Glow Gradient) */}
//             <button
//               type="button"
//               disabled={!isNextEnabled}
//               onClick={() => {
//                 handleSubmit(
//                   (data) => onSubmit(data),
//                   (validationErrors) => {
//                     console.error(
//                       "Validation failed with errors:",
//                       Object.keys(validationErrors)
//                     );
//                   }
//                 )();
//               }}
//               className={`
//         relative px-10 sm:px-12 py-3.5 sm:py-4 text-base sm:text-lg font-light rounded-xl transition-all duration-300 overflow-hidden
//         ${
//           isNextEnabled
//             ? "bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 text-white shadow-lg shadow-rose-500/30 hover:shadow-2xl hover:shadow-rose-500/40 hover:scale-105 active:scale-100 cursor-pointer border border-rose-400/30"
//             : "bg-gray-700/50 text-gray-500 cursor-not-allowed border border-gray-600/30"
//         }
//        `}
//               style={{ letterSpacing: "0.05em" }}
//             >
//               {/* Animated shimmer effect (Only on enabled state) */}
//               {isNextEnabled && (
//                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-out"></div>
//               )}
//               <span className="relative flex items-center justify-center gap-2.5">
//                 Continue
//                 <svg
//                   className="w-5 h-5 transition-transform group-hover:translate-x-1"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   strokeWidth="2"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M13 7l5 5m0 0l-5 5m5-5H6"
//                   />
//                 </svg>
//               </span>
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// ==========================================================================

// import React from 'react';

// // Define the elegant color palette (Indigo theme)
// const PRIMARY_COLOR_CLASS = 'indigo-600';
// const PRIMARY_HOVER_CLASS = 'indigo-700';

// // Helper component for consistent input styling - moved outside to prevent recreation
// const InputField = ({ name, type, placeholder, error, register, maxLength, prefix }) => (
//   <div>
//     <div className="relative">
//       {prefix && (
//         <div className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium text-sm md:text-base lg:text-lg pointer-events-none">
//           {prefix}
//         </div>
//       )}
//       <input
//         type={type}
//         {...register(name)}
//         maxLength={maxLength}
//         // Applied elegant input styling: increased padding (px-5 py-3.5), Indigo focus ring/border, rounded-xl
//         className={`
//           w-full px-4 py-2 md:px-5 md:py-3 lg:py-3.5 border rounded-xl transition-all duration-200
//           focus:outline-none focus:ring-2 focus:ring-${PRIMARY_COLOR_CLASS}/30 focus:border-${PRIMARY_COLOR_CLASS}
//           placeholder-gray-500 text-sm md:text-base lg:text-lg
//           ${prefix ? 'pl-10 md:pl-12' : ''}
//           ${error ? 'border-red-400' : 'border-gray-300'}
//         `}
//         placeholder={placeholder}
//       />
//     </div>
//     {error && (
//       <p className="mt-2 text-sm text-red-600 font-medium">{error.message}</p>
//     )}
//   </div>
// );

// export default function ClientDetails({ onNext, onBack, register, errors, setValue, handleSubmit, watch, getValues }) {
//   const watchedValues = watch();

//   const onSubmit = (data) => {
//     try {
//       console.log('ClientDetails onSubmit called with data:', data);
//       console.log('Form errors:', errors);
//       console.log('All form values:', watchedValues);
//       console.log('Form is valid for submission:', Object.keys(errors).length === 0);

//       // Check if there are any errors that would prevent submission
//       if (Object.keys(errors).length > 0) {
//         console.error('Form has validation errors, cannot submit:', errors);
//         return;
//       }

//       // Prepend +1 to phone number if not already present
//       if (data.phone && !data.phone.startsWith('+1')) {
//         data.phone = '+1' + data.phone;
//       }
//       // Form validation is handled by react-hook-form
//       // If we get here, the form is valid
//       console.log('Calling onNext() from ClientDetails');
//       onNext();
//     } catch (error) {
//       console.error('Error in ClientDetails onSubmit:', error);
//     }
//   };

//   // Check if all required fields have values and no errors
//   const isNextEnabled =
//     watchedValues.first_name?.trim() &&
//     watchedValues.last_name?.trim() &&
//     watchedValues.email?.trim() &&
//     watchedValues.phone?.trim() &&
//     !errors.first_name &&
//     !errors.last_name &&
//     !errors.email &&
//     !errors.phone;

//   console.log('ClientDetails validation:', {
//     first_name: watchedValues.first_name,
//     last_name: watchedValues.last_name,
//     email: watchedValues.email,
//     phone: watchedValues.phone,
//     errors: {
//       first_name: errors.first_name,
//       last_name: errors.last_name,
//       email: errors.email,
//       phone: errors.phone
//     },
//     isNextEnabled,
//     allFormErrors: errors,
//     formIsValid: Object.keys(errors).length === 0
//   });

//   return (
//     // Applied elegant container styling (max-w-6xl, shadow-2xl, increased padding)
//     <div className="max-w-sm md:max-w-2xl lg:max-w-6xl mx-auto px-4 py-4 md:py-8 lg:py-12">
//       <div className="bg-white rounded-xl shadow-2xl p-4 md:p-8 lg:p-14 border border-gray-50">

//         {/* Header Section: Applied elegant typography (font-light, larger size) */}
//         <div className="mb-6 md:mb-10 lg:mb-14">
//           <h2 className="text-lg md:text-2xl lg:text-4xl font-light text-gray-900 mb-2 md:mb-3 tracking-tight text-left">
//             Contact Information
//             <span className="text-red-500 ml-1 font-normal">*</span>
//           </h2>
//           <p className="text-gray-500 text-sm md:text-base lg:text-lg">Please enter your contact details to finalize the booking.</p>
//         </div>

//         <form>
//           <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">

//             {/* First Name */}
//             <InputField
//               name="first_name"
//               type="text"
//               placeholder="First Name *"
//               error={errors.first_name}
//               register={register}
//             />

//             {/* Last Name */}
//             <InputField
//               name="last_name"
//               type="text"
//               placeholder="Last Name *"
//               error={errors.last_name}
//               register={register}
//             />

//             {/* Email Address */}
//             <InputField
//               name="email"
//               type="email"
//               placeholder="Email Address *"
//               error={errors.email}
//               register={register}
//             />

//             {/* Phone Number */}
//             <InputField
//               name="phone"
//               type="tel"
//               placeholder="Phone Number * (e.g., 6045555555)"
//               error={errors.phone}
//               register={register}
//               maxLength={10}
//               prefix="+1"
//             />
//           </div>

//           {/* Action Buttons: Applied consistent, solid-fill styling */}
//           <div className="flex justify-between pt-6 md:pt-8 border-t border-gray-100 mt-4 md:mt-6">
//             <button
//               type="button"
//               onClick={onBack}
//               // Back button MATCHED to primary style (solid Indigo fill)
//               className={`
//                 px-4 py-2 md:px-6 md:py-3 lg:px-10 lg:py-3.5 rounded-xl font-bold text-sm md:text-base lg:text-lg shadow-lg transition-all duration-300
//                 bg-${PRIMARY_COLOR_CLASS} text-white
//                 hover:bg-${PRIMARY_HOVER_CLASS} hover:shadow-xl transform hover:scale-[1.01] cursor-pointer
//               `}
//             >
//               Back
//             </button>
//             <button
//               type="button"
//               disabled={!isNextEnabled}
//               onClick={() => {
//                 console.log('Continue button clicked, calling handleSubmit');
//                 console.log('Current form values before validation:', getValues());
//                 console.log('Current errors before validation:', errors);
//                 handleSubmit(
//                   (data) => {
//                     console.log('Validation passed, calling onSubmit with:', data);
//                     onSubmit(data);
//                   },
//                   (validationErrors) => {
//                     console.error('Validation failed with errors:', Object.keys(validationErrors));
//                     console.error('All form values at validation failure:', getValues());
//                     // Log specific field values that are failing
//                     console.error('party_both_count value:', getValues('party_both_count'), 'type:', typeof getValues('party_both_count'));
//                     console.error('party_makeup_count value:', getValues('party_makeup_count'), 'type:', typeof getValues('party_makeup_count'));
//                     console.error('party_hair_count value:', getValues('party_hair_count'), 'type:', typeof getValues('party_hair_count'));
//                   }
//                 )();
//               }}
//               className={`
//                 px-4 py-2 md:px-6 md:py-3 lg:px-10 lg:py-3.5 rounded-xl font-bold text-sm md:text-base lg:text-lg shadow-lg transition-all duration-300
//                 ${isNextEnabled
//                   ? `bg-${PRIMARY_COLOR_CLASS} text-white hover:bg-${PRIMARY_HOVER_CLASS} hover:shadow-xl transform hover:scale-[1.01] cursor-pointer`
//                   : 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
//                 }
//               `}
//             >
//               Continue
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
