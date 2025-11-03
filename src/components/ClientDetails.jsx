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
  watch,
  getValues,
  isGlobalLoading = false,
}) {
  const watchedValues = watch()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleContinue = async () => {
    try {
      console.log("🔍 ClientDetails handleContinue called")
      
      // Check for validation errors
      if (Object.keys(errors).length > 0) {
        console.error("Form has validation errors, cannot submit:", errors)
        return
      }

      // Get current form values
      const formData = getValues()
      console.log("🔍 Current form data:", formData)

      setIsSubmitting(true)

      // Update phone number in the form if needed
      if (formData.phone && !formData.phone.startsWith("+1")) {
        const phoneWithPrefix = "+1" + formData.phone
        setValue("phone", phoneWithPrefix)
        console.log("📞 Updated phone with +1 prefix:", phoneWithPrefix)
      }

      // Fire Meta Pixel event
      if (window.fbq) {
        window.fbq("track", "Lead")
        console.log("✅ Meta Pixel 'Lead' event fired")
      }

      console.log("🔍 ClientDetails calling onNext...")
      await onNext()
      console.log("✅ ClientDetails onNext completed successfully")
      
    } catch (error) {
      console.error("❌ Error in ClientDetails handleContinue:", error)
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
        {/* Header */}
        <div className="sm:p-8 text-left">
        {/* Header Section */}
        <div className="text-left mb-4 sm:mb-5">
          <h2 className="text-2xl sm:text-3xl font-normal text-gray-900 mb-1 sm:mb-3 tracking-wide">
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
            onClick={handleContinue}
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