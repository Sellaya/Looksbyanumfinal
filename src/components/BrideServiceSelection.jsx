"use client"
import React from "react"

// Custom Date Picker (Light + Charcoalish Theme)
const DatePicker = ({ label, name, register, error, required, maxDate }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState("")
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  const dropdownRef = React.useRef(null)

  const getMinimumDate = (minDaysAdvance = 2) => {
    const today = new Date()
    const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const minimumDate = new Date(localToday)
    minimumDate.setDate(minimumDate.getDate() + minDaysAdvance)
    return minimumDate
  }

  const minDate = getMinimumDate(2)
  minDate.setHours(0, 0, 0, 0)

  const formatDisplayDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString + "T00:00:00")
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    return { daysInMonth: lastDay.getDate(), startingDayOfWeek: firstDay.getDay(), year, month }
  }

  const isDateDisabled = (date) => {
    if (date < minDate) return true
    if (maxDate && date > new Date(maxDate)) return true
    return false
  }

  const handleDateSelect = (day, onChange) => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const selectedDateObj = new Date(year, month, day)
    if (isDateDisabled(selectedDateObj)) return

    const formatted = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    setSelectedDate(formatted)
    onChange({ target: { name, value: formatted } })
    setIsOpen(false)
  }

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth)
  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  const { onChange, ...registerProps } = register(name)

  const calendarDays = []
  for (let i = 0; i < startingDayOfWeek; i++) calendarDays.push(<div key={`empty-${i}`} className="p-2" />)
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day)
    const isDisabled = isDateDisabled(dateObj)
    const isSelected = selectedDate === `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    calendarDays.push(
      <button
        key={day}
        type="button"
        onClick={() => !isDisabled && handleDateSelect(day, onChange)}
        disabled={isDisabled}
        className={`p-2.5 rounded-md text-sm font-light transition-all duration-200
          ${
            isSelected
              ? "bg-gray-500 text-gray-50 border border-gray-400 shadow-sm"
              : isDisabled
              ? "bg-gray-50 border border-transparent text-gray-400 cursor-not-allowed"
              : "bg-gray-100 text-gray-800 hover:bg-white hover:text-gray-900 border  hover:border-gray-300"
          }`}
      >
        {day}
      </button>
    )
  }

  return (
    <div>
      <label htmlFor={name} className="block text-sm sm:text-base font-light text-gray-800 mb-2">
        {label} {required && <span className="text-gray-700">*</span>}
      </label>

      <div className="relative" ref={dropdownRef}>
        <input type="hidden" {...registerProps} onChange={onChange} />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group relative w-full p-3.5 sm:p-4 rounded-lg border border-gray-300 bg-gray-50 
          hover:border-gray-400 hover:bg-white text-left flex items-center justify-between transition-all duration-300 shadow-sm"
        >
          <span className={selectedDate ? "text-gray-800" : "text-gray-400"}>
            {selectedDate ? formatDisplayDate(selectedDate) : "Select date..."}
          </span>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handlePrevMonth}
                type="button"
                className="p-2.5 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 shadow-sm"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <h3 className="text-gray-800 font-medium text-sm sm:text-base">{monthName}</h3>

              <button
                onClick={handleNextMonth}
                type="button"
                className="p-2.5 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 shadow-sm"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d} className="text-center text-xs text-gray-500 p-1.5">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">{calendarDays}</div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 bg-gray-50 border border-gray-300 rounded-md">
          <p className="text-sm text-gray-700 font-light">{error}</p>
        </div>
      )}
    </div>
  )
}


// Custom Time Picker (Light + Charcoalish Theme)
const TimePicker = ({ label, name, register, error, required }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedTime, setSelectedTime] = React.useState("")
  const dropdownRef = React.useRef(null)

  const generateTimeOptions = () => {
    const times = []
    const periods = ["AM", "PM"]
    periods.forEach((period) => {
      for (let hour = 12; hour <= 12; hour++) {
        times.push({ label: `${hour}:00 ${period}`, value: period === "AM" ? "00:00" : "12:00" })
        times.push({ label: `${hour}:30 ${period}`, value: period === "AM" ? "00:30" : "12:30" })
      }
      for (let hour = 1; hour <= 11; hour++) {
        const value24 = period === "AM" ? hour : hour + 12
        times.push({ label: `${hour}:00 ${period}`, value: `${String(value24).padStart(2, "0")}:00` })
        times.push({ label: `${hour}:30 ${period}`, value: `${String(value24).padStart(2, "0")}:30` })
      }
    })
    return times
  }

  const timeOptions = generateTimeOptions()
  const { onChange, ...registerProps } = register(name)

  const handleTimeSelect = (time, onChange) => {
    setSelectedTime(time.label)
    onChange({ target: { name, value: time.value } })
    setIsOpen(false)
  }

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div>
      <label htmlFor={name} className="block text-sm sm:text-base font-light text-gray-800 mb-2">
        {label} {required && <span className="text-gray-900">*</span>}
      </label>

      <div className="relative" ref={dropdownRef}>
        <input type="hidden" {...registerProps} onChange={onChange} />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group relative w-full p-3.5 sm:p-4 rounded-lg border border-gray-300 bg-white 
          hover:border-gray-500 hover:bg-gray-50 hover:shadow-sm text-left flex items-center justify-between transition-all duration-300"
        >
          <span className={selectedTime ? "text-gray-800" : "text-gray-400"}>
            {selectedTime || "Select time..."}
          </span>
          <svg className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden">
            <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              {timeOptions.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleTimeSelect(t, onChange)}
                  className="w-full px-4 py-2 text-left text-gray-800 bg-gray-50 hover:bg-gray-800 hover:text-gray-50 border-b border-gray-100 text-sm font-light transition-all"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 bg-gray-50 border border-gray-300 rounded-md">
          <p className="text-sm text-gray-700 font-light">{error}</p>
        </div>
      )}
    </div>
  )
}


// Checkmark icon
const CheckCircleIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

export default function BrideServiceSelection({ register, watch, errors, onNext, onBack, setValue }) {
  const watchedFields = watch()
  const selectedService = watchedFields.bride_service
  const needsTrial = watchedFields.needs_trial
  const trialService = watchedFields.trial_service
  const trialDate = watchedFields.trial_date
  const trialTime = watchedFields.trial_time

  const handleServiceSelect = (service) => setValue("bride_service", service)
  const handleTrialSelect = (trial) => {
    setValue("needs_trial", trial)
    if (trial === "No") {
      setValue("trial_service", "")
      setValue("trial_date", "")
      setValue("trial_time", "")
    }
  }
  const handleTrialServiceSelect = (service) => setValue("trial_service", service)

  const handleNext = () => {
    if (
      selectedService &&
      needsTrial !== undefined &&
      (needsTrial === "No" || (trialService && trialDate && trialTime))
    ) {
      onNext()
    }
  }

  const isNextEnabled =
    selectedService &&
    needsTrial !== undefined &&
    (needsTrial === "No" || (trialService && trialDate && trialTime))

  const SelectCard = ({ value, label, subtext, onClick, isSelected }) => (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full text-left flex items-center gap-3 p-3 sm:p-4 rounded-lg border transition-all duration-300 ${
        isSelected
          ? "border-gray-700 bg-gray-100 shadow-md shadow-gray-400/20"
          : "border-gray-300 bg-white hover:border-gray-500 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-400/10"
      }`}
    >
      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
        {isSelected ? (
          <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center">
            <CheckCircleIcon className="w-3 h-3 text-white" />
          </div>
        ) : (
          <div className="w-5 h-5 rounded-full border border-gray-400 group-hover:border-gray-600 transition-all duration-300" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3
          className={`text-sm sm:text-base font-light transition-colors ${
            isSelected ? "text-gray-900" : "text-gray-800 group-hover:text-gray-900"
          }`}
          style={{ letterSpacing: "0.01em" }}
        >
          {label}
        </h3>
        {subtext && (
          <p
            className={`text-xs sm:text-sm font-light transition-colors ${
              isSelected ? "text-gray-700" : "text-gray-600 group-hover:text-gray-700"
            }`}
            style={{ letterSpacing: "0.01em" }}
          >
            {subtext}
          </p>
        )}
      </div>
    </button>
  )

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="sm:p-8 text-left">
        {/* Header Section */}
        <div className="text-left mb-4 sm:mb-5">
          <h2 className="text-2xl sm:text-3xl font-normal text-gray-900 mb-1 sm:mb-3 tracking-wide">
            Bridal Service Details <span className="text-gray-400">*</span>
          </h2>
          <p className="text-gray-700 text-sm sm:text-base font-light max-w-2xl mx-auto">
            Select the primary service and specify trial requirements.
          </p>
        </div>

        {/* Bride Service Selection */}
        <div className="space-y-2 sm:space-y-3 mb-6">
          {["Both Hair & Makeup", "Hair Only", "Makeup Only"].map((service) => (
            <SelectCard
              key={service}
              value={service}
              label={service}
              subtext={service === "Both Hair & Makeup" ? "Complete bridal styling package" : service === "Hair Only" ? "Professional hair styling only" : "Professional makeup application only"}
              onClick={() => handleServiceSelect(service)}
              isSelected={selectedService === service}
            />
          ))}
        </div>

        {/* Trial Question */}
        {selectedService && (
          <div className="space-y-2 sm:space-y-3 mb-6">
            <h3 className="text-lg sm:text-xl font-normal text-gray-900 mb-2">Do you need a Bridal Trial?</h3>
            <div className="flex gap-3 sm:gap-4">
              {["Yes", "No"].map((trial) => (
                <SelectCard
                  key={trial}
                  value={trial}
                  label={trial}
                  // subtext={trial === "Yes" ? "I would like to add a trial" : "No trial needed"}
                  onClick={() => handleTrialSelect(trial)}
                  isSelected={needsTrial === trial}
                />
              ))}
            </div>
          </div>
        )}

        {/* Trial Service Selection */}
        {needsTrial === "Yes" && (
          <div className="space-y-2 sm:space-y-3 mb-6">
            <h3 className="text-lg sm:text-xl font-normal text-gray-900 mb-2">
              What trials does the bride need?
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {["Both Hair & Makeup", "Hair Only", "Makeup Only"].map((service) => (
                <SelectCard
                  key={service}
                  value={service}
                  label={service}
                  subtext=""
                  onClick={() => handleTrialServiceSelect(service)}
                  isSelected={trialService === service}
                />
              ))}
            </div>
          </div>
        )}

        {/* Trial Date & Time */}
        {needsTrial === "Yes" && trialService && (
          <div className="space-y-4 sm:space-y-6 mb-6">
            <h3 className="text-lg sm:text-xl font-normal text-gray-900 mb-2">
              When would you like to schedule your trial?
            </h3>
            <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <DatePicker
                  label="Preferred Trial Date"
                  name="trial_date"
                  register={register}
                  error={errors.trial_date?.message}
                  required
                  minDaysAdvance={2}
                  maxDate={
                    watchedFields.event_date
                      ? (() => {
                          const d = new Date(watchedFields.event_date)
                          d.setDate(d.getDate() - 1)
                          return d.toISOString().split("T")[0]
                        })()
                      : undefined
                  }
                />
              </div>
              <div>
                <TimePicker
                  label="Preferred Trial Time"
                  name="trial_time"
                  register={register}
                  error={errors.trial_time?.message}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between gap-5 pt-6 sm:pt-8 border-t border-gray-200">
          <button
            onClick={onBack}
            className="group relative px-5 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-light rounded-lg transition-all duration-300 overflow-hidden bg-gray-200 text-gray-900 shadow-md shadow-gray-400/20 hover:bg-gray-300 hover:scale-[1.02] active:scale-100 cursor-pointer border border-gray-400"
          >
            Back
          </button>

          <button
            onClick={() => {
              const isValid =
                selectedService &&
                needsTrial !== undefined &&
                (needsTrial === "No" || (trialService && trialDate && trialTime))

              if (!selectedService) {
                alert("Please select a bridal service before continuing.")
                return
              }

              if (needsTrial === undefined) {
                alert("Please specify if you need a bridal trial.")
                return
              }

              if (needsTrial === "Yes" && !trialService) {
                alert("Please select the type of trial service required.")
                return
              }

              if (needsTrial === "Yes" && !trialDate) {
                alert("Please select a preferred trial date.")
                return
              }

              if (needsTrial === "Yes" && !trialTime) {
                alert("Please select a preferred trial time.")
                return
              }

              if (isValid) {
                onNext()
              }
            }}
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
// import DatePicker from './DatePicker';

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

// export default function BrideServiceSelection({ register, watch, errors, onNext, onBack, setValue }) {
//   const watchedFields = watch();
//   const selectedService = watchedFields.bride_service;
//   const needsTrial = watchedFields.needs_trial;
//   const trialService = watchedFields.trial_service;
//   const trialDate = watchedFields.trial_date;
//   const trialTime = watchedFields.trial_time;

//   const handleServiceSelect = (service) => {
//     setValue('bride_service', service);
//   };

//   const handleTrialSelect = (needsTrial) => {
//     setValue('needs_trial', needsTrial);
//     if (needsTrial === 'No') {
//       setValue('trial_service', ''); // Clear trial service if no trial needed
//       setValue('trial_date', ''); // Clear trial date if no trial needed
//       setValue('trial_time', ''); // Clear trial time if no trial needed
//     }
//   };

//   const handleTrialServiceSelect = (service) => {
//     setValue('trial_service', service);
//   };

//   const handleNext = () => {
//     if (selectedService && needsTrial !== undefined &&
//         (needsTrial === 'No' || (trialService && trialDate && trialTime))) {
//       onNext();
//     }
//   };

//   const isNextEnabled = selectedService && needsTrial !== undefined &&
//                        (needsTrial === 'No' || (trialService && trialDate && trialTime));

//   // Helper component for consistent card styling
//   const SelectCard = ({ value, label, subtext, onClick, isSelected, registerProps, isRadio }) => (
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
//         <div className="flex items-center space-x-4">
//             {/* The hidden radio input is necessary to pass the value to react-hook-form */}
//             <input
//                 type={isRadio ? "radio" : "checkbox"}
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
//             <p className={`text-sm ${isSelected ? `text-${LIGHT_ACCENT_CLASS}` : 'text-gray-600'}`}>
//               {subtext}
//             </p>
//           </div>
//         </div>

//         <div className="text-right">
//             {isSelected ? (
//                 <CheckCircleIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
//             ) : (
//                 <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 ${isSelected ? 'border-white' : 'border-gray-300'}`}></div>
//             )}
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     // Applied elegant container styling (max-w-6xl, shadow-2xl, increased padding)
//     <div className="max-w-sm md:max-w-2xl lg:max-w-6xl mx-auto px-4 py-4 md:py-8 lg:py-12">
//       <div className="bg-white rounded-xl shadow-2xl p-4 md:p-8 lg:p-14 border border-gray-50">

//         {/* Header Section: Applied elegant typography (font-light, larger size) */}
//         <div className="mb-6 md:mb-10 lg:mb-14">
//           <h2 className="text-lg md:text-2xl lg:text-4xl font-light text-gray-900 mb-2 md:mb-3 tracking-tight text-left">
//             Bridal Service Details
//           </h2>
//           <p className="text-gray-500 text-sm md:text-base lg:text-lg">Select the primary service and specify trial requirements.</p>
//         </div>

//         {/* Bride Service Selection */}
//         <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">

//             {/* Both Hair & Makeup */}
//             <SelectCard
//                 value="Both Hair & Makeup"
//                 label="Both Hair & Makeup"
//                 subtext="Complete bridal styling package"
//                 onClick={() => handleServiceSelect('Both Hair & Makeup')}
//                 isSelected={selectedService === 'Both Hair & Makeup'}
//                 registerProps={register('bride_service')}
//                 isRadio={true}
//             />

//             {/* Hair Only */}
//             <SelectCard
//                 value="Hair Only"
//                 label="Hair Only"
//                 subtext="Professional hair styling only"
//                 onClick={() => handleServiceSelect('Hair Only')}
//                 isSelected={selectedService === 'Hair Only'}
//                 registerProps={register('bride_service')}
//                 isRadio={true}
//             />

//             {/* Makeup Only */}
//             <SelectCard
//                 value="Makeup Only"
//                 label="Makeup Only"
//                 subtext="Professional makeup application only"
//                 onClick={() => handleServiceSelect('Makeup Only')}
//                 isSelected={selectedService === 'Makeup Only'}
//                 registerProps={register('bride_service')}
//                 isRadio={true}
//             />
//         </div>

//         {/* Trial Question */}
//         {selectedService && (
//           <div className="mb-8 md:mb-12 p-4 md:p-6 lg:p-8 bg-gray-50 rounded-xl border border-gray-200">
//             <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 mb-4">
//               Do you need a Bridal Trial?
//             </h3>
//             <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
//               *A trial allows you to test your look before the big day*
//             </p>

//             <div className="space-y-4 md:flex md:space-x-4 md:space-y-0"> {/* Styled options horizontally on desktop */}

//               {/* Trial: Yes */}
//               <div
//                 onClick={() => handleTrialSelect('Yes')}
//                 className={`flex-1 border rounded-xl p-4 cursor-pointer transition-all duration-300 shadow-sm
//                   ${needsTrial === 'Yes'
//                       ? `bg-${PRIMARY_COLOR_CLASS} border-${PRIMARY_COLOR_CLASS} text-white shadow-md`
//                       : 'bg-white border-gray-300 hover:border-gray-400'
//                   }`}
//               >
//                 <div className="flex items-center space-x-3">
//                   <input
//                     type="radio"
//                     {...register('needs_trial')}
//                     value="Yes"
//                     className={`w-5 h-5 text-${PRIMARY_COLOR_CLASS} border-gray-300 focus:ring-${PRIMARY_COLOR_CLASS} ${needsTrial === 'Yes' ? 'text-white border-white' : ''}`}
//                     checked={needsTrial === 'Yes'}
//                     readOnly
//                   />
//                   <div>
//                     <h4 className={`font-semibold ${needsTrial === 'Yes' ? 'text-white' : 'text-gray-900'}`}>Yes</h4>
//                     <p className={`text-sm ${needsTrial === 'Yes' ? `text-${LIGHT_ACCENT_CLASS}` : 'text-gray-600'}`}>I would like to add a trial</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Trial: No */}
//               <div
//                 onClick={() => handleTrialSelect('No')}
//                 className={`flex-1 border rounded-xl p-4 cursor-pointer transition-all duration-300 shadow-sm
//                   ${needsTrial === 'No'
//                       ? `bg-${PRIMARY_COLOR_CLASS} border-${PRIMARY_COLOR_CLASS} text-white shadow-md`
//                       : 'bg-white border-gray-300 hover:border-gray-400'
//                   }`}
//               >
//                 <div className="flex items-center space-x-3">
//                   <input
//                     type="radio"
//                     {...register('needs_trial')}
//                     value="No"
//                     className={`w-5 h-5 text-${PRIMARY_COLOR_CLASS} border-gray-300 focus:ring-${PRIMARY_COLOR_CLASS} ${needsTrial === 'No' ? 'text-white border-white' : ''}`}
//                     checked={needsTrial === 'No'}
//                     readOnly
//                   />
//                   <div>
//                     <h4 className={`font-semibold ${needsTrial === 'No' ? 'text-white' : 'text-gray-900'}`}>No</h4>
//                     <p className={`text-sm ${needsTrial === 'No' ? `text-${LIGHT_ACCENT_CLASS}` : 'text-gray-600'}`}>No trial needed</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Trial Service Selection */}
//         {needsTrial === 'Yes' && (
//           <div className="mb-8 md:mb-12 p-4 md:p-6 lg:p-8 bg-white rounded-xl border border-gray-200 shadow-lg"> {/* Highlighted box for important choice */}
//             <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 md:mb-6">
//               What trials does the bride need?
//             </h3>

//             <div className="space-y-4">

//               {/* Trial: Both Hair & Makeup */}
//               <SelectCard
//                   value="Both Hair & Makeup"
//                   label="Both Hair & Makeup"
//                   subtext=""
//                   onClick={() => handleTrialServiceSelect('Both Hair & Makeup')}
//                   isSelected={trialService === 'Both Hair & Makeup'}
//                   registerProps={register('trial_service')}
//                   isRadio={true}
//               />

//               {/* Trial: Hair Only */}
//               <SelectCard
//                   value="Hair Only"
//                   label="Hair Only"
//                   subtext=""
//                   onClick={() => handleTrialServiceSelect('Hair Only')}
//                   isSelected={trialService === 'Hair Only'}
//                   registerProps={register('trial_service')}
//                   isRadio={true}
//               />

//               {/* Trial: Makeup Only */}
//               <SelectCard
//                   value="Makeup Only"
//                   label="Makeup Only"
//                   subtext=""
//                   onClick={() => handleTrialServiceSelect('Makeup Only')}
//                   isSelected={trialService === 'Makeup Only'}
//                   registerProps={register('trial_service')}
//                   isRadio={true}
//               />
//             </div>
//           </div>
//         )}

//         {/* Trial Date and Time Selection */}
//         {needsTrial === 'Yes' && trialService && (
//           <div className="mb-8 md:mb-12 p-4 md:p-6 lg:p-8 bg-white rounded-xl border border-gray-200 shadow-lg">
//             <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 md:mb-6">
//               When would you like to schedule your trial?
//             </h3>
//             <p className="text-gray-600 mb-6">Please select your preferred date and time for the trial session.</p>

//             <div className="grid md:grid-cols-2 gap-6">
//               {/* Trial Date */}
//               <div>
//                 <DatePicker
//                   register={register}
//                   name="trial_date"
//                   label="Preferred Trial Date"
//                   required={true}
//                   error={errors.trial_date?.message}
//                   maxDate={watchedFields.event_date ? (() => {
//                     const eventDate = new Date(watchedFields.event_date);
//                     eventDate.setDate(eventDate.getDate() - 1); // One day before event
//                     return eventDate.toISOString().split('T')[0];
//                   })() : undefined}
//                   validate={{
//                     beforeEventDate: (value) => {
//                       const eventDate = watchedFields.event_date;
//                       if (!eventDate) return true;
//                       const trialDate = new Date(value);
//                       const eventDateObj = new Date(eventDate);
//                       return trialDate < eventDateObj || 'Trial must be scheduled before the event date';
//                     }
//                   }}
//                 />
//               </div>

//               {/* Trial Time */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Preferred Trial Time *
//                 </label>
//                 <input
//                   type="time"
//                   {...register('trial_time', { required: 'Trial time is required' })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//                 {errors.trial_time && (
//                   <p className="text-red-600 text-sm mt-1">{errors.trial_time.message}</p>
//                 )}
//               </div>
//             </div>

//             <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//               <p className="text-blue-800 text-sm">
//                 <strong>Note:</strong> Trial sessions typically take 1-2 hours. We recommend scheduling your trial at least 1-2 weeks before your event date.
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Error Messages: Applied clean, modern error styling */}
//         {(errors.bride?.service || (selectedService && needsTrial === 'Yes' && !trialService) ||
//           (needsTrial === 'Yes' && trialService && (!trialDate || !trialTime))) && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg">
//             <div className="flex items-center">
//               <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//               </svg>
//               {/* Displaying specific error message */}
//               <p className="text-red-800 text-sm font-medium">
//                   {errors.bride?.service?.message ||
//                    (selectedService && needsTrial === 'Yes' && !trialService && "Please select the required trial services to continue.") ||
//                    (needsTrial === 'Yes' && trialService && (!trialDate || !trialTime) && "Please select trial date and time to continue.")}
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Action Buttons: Applied consistent, solid-fill styling */}
//         <div className="flex justify-between pt-6 md:pt-8 border-t border-gray-100 mt-4 md:mt-6">
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
