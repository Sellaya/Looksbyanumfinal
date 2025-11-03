import React from "react"

// Custom Multi-Date Picker
const CustomMultiDatePicker = ({
  label,
  name,
  register,
  error,
  required,
  maxDate,
  propMinDate,
  value,
  onChange: parentOnChange,
}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedDates, setSelectedDates] = React.useState(value || [])
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  const dropdownRef = React.useRef(null)

  const getMinimumDate = () => {
    const now = new Date()
    const offset = now.getTimezoneOffset()
    const localMidnight = new Date(now.getTime() - offset * 60 * 1000)
    localMidnight.setHours(0, 0, 0, 0)
    return propMinDate ? new Date(propMinDate) : localMidnight
  }

  const minDate = getMinimumDate()
  minDate.setHours(0, 0, 0, 0)

  const formatDisplayDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString + "T00:00:00")
    return date.toLocaleDateString("en-US", {
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

  const handleDateSelect = (day) => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const selectedDateObj = new Date(year, month, day)
    if (isDateDisabled(selectedDateObj)) return

    const formatted = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    
    let newDates
    if (selectedDates.includes(formatted)) {
      newDates = selectedDates.filter(d => d !== formatted)
    } else {
      newDates = [...selectedDates, formatted].sort()
    }
    
    setSelectedDates(newDates)
    if (parentOnChange) {
      parentOnChange(newDates)
    }
  }

  const handleRemoveDate = (dateToRemove) => {
    const newDates = selectedDates.filter(d => d !== dateToRemove)
    setSelectedDates(newDates)
    if (parentOnChange) {
      parentOnChange(newDates)
    }
  }

  const handlePrevMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  const handleNextMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  React.useEffect(() => {
    if (value && Array.isArray(value)) {
      setSelectedDates(value)
    }
  }, [value])

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth)
  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const calendarDays = []
  for (let i = 0; i < startingDayOfWeek; i++)
    calendarDays.push(<div key={`empty-${i}`} className="p-2" />)

  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day)
    const isDisabled = isDateDisabled(dateObj)
    const formatted = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const isSelected = selectedDates.includes(formatted)

    calendarDays.push(
      <button
        key={day}
        type="button"
        onClick={() => !isDisabled && handleDateSelect(day)}
        disabled={isDisabled}
        className={`p-2.5 rounded-md text-sm font-light transition-all duration-200
          ${
            isSelected
              ? "bg-gray-800 text-white border border-gray-600 shadow-sm"
              : isDisabled
              ? "bg-gray-50 text-gray-400 border border-transparent cursor-not-allowed"
              : "bg-gray-200 text-gray-800 hover:bg-gray-600 hover:text-gray-50 border border-transparent"
          }`}
      >
        {day}
      </button>
    )
  }

  return (
    <div>
      <label className="block text-sm sm:text-base font-light text-gray-800 mb-2">
        {label} {required && <span className="text-gray-700">*</span>}
      </label>

      {/* Selected dates display */}
      {selectedDates.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto whitespace-nowrap pb-1 no-scrollbar">
          {selectedDates.map((date) => (
            <div
              key={date}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-white rounded-lg text-sm"
            >
              <span>{formatDisplayDate(date)}</span>
              <button
                type="button"
                onClick={() => handleRemoveDate(date)}
                className="hover:bg-gray-700 rounded-full p-0.5 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group relative w-full p-3.5 sm:p-4 rounded-lg border border-gray-300 bg-white 
          hover:border-gray-500 hover:bg-gray-50 text-left flex items-center justify-between transition-all duration-300"
        >
          <span className={selectedDates.length > 0 ? "text-gray-800" : "text-gray-400"}>
            {selectedDates.length > 0 ? `${selectedDates.length} date(s) selected` : "Select dates..."}
          </span>
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
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
                className="p-2.5 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200"
              >
                <svg
                  className="w-4 h-4 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <h3 className="text-gray-800 font-medium text-sm sm:text-base">{monthName}</h3>

              <button
                onClick={handleNextMonth}
                type="button"
                className="p-2.5 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-700 transition-all duration-200"
              >
                <svg
                  className="w-4 h-4 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d} className="text-center text-xs text-gray-500 p-1.5">
                  {d}
                </div>
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

// Custom Time Picker
const CustomTimePicker = ({ label, name, value, onChange, error, required }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedTime, setSelectedTime] = React.useState("")
  const dropdownRef = React.useRef(null)

  const generateTimeOptions = () => {
    const times = []
    const periods = ["AM", "PM"]
    periods.forEach((period) => {
      for (let hour = 12; hour <= 12; hour++) {
        times.push({
          label: `${hour}:00 ${period}`,
          value: period === "AM" ? "00:00" : "12:00",
        })
        times.push({
          label: `${hour}:30 ${period}`,
          value: period === "AM" ? "00:30" : "12:30",
        })
      }
      for (let hour = 1; hour <= 11; hour++) {
        const value24 = period === "AM" ? hour : hour + 12
        times.push({
          label: `${hour}:00 ${period}`,
          value: `${String(value24).padStart(2, "0")}:00`,
        })
        times.push({
          label: `${hour}:30 ${period}`,
          value: `${String(value24).padStart(2, "0")}:30`,
        })
      }
    })
    return times
  }

  const timeOptions = generateTimeOptions()

  const formatTimeLabel = (timeValue) => {
    if (!timeValue) return ""
    const [hourStr, minute] = timeValue.split(":")
    let hour = parseInt(hourStr, 10)
    const period = hour >= 12 ? "PM" : "AM"
    hour = hour % 12 || 12
    return `${hour}:${minute} ${period}`
  }

  React.useEffect(() => {
    if (value) {
      setSelectedTime(formatTimeLabel(value))
    }
  }, [value])

  const handleTimeSelect = (time) => {
    setSelectedTime(time.label)
    if (onChange) {
      onChange(time.value)
    }
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
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group relative w-full p-3.5 sm:p-4 rounded-lg border border-gray-300 bg-white 
          hover:border-gray-500 hover:bg-gray-50 hover:shadow-sm text-left flex items-center justify-between transition-all duration-300"
        >
          <span className={selectedTime ? "text-gray-800" : "text-gray-400"}>
            {selectedTime || "Select time..."}
          </span>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
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
                  onClick={() => handleTimeSelect(t)}
                  className="w-full px-4 py-2 text-left text-gray-800 bg-gray-50 hover:bg-gray-400 hover:text-gray-50 border-b border-gray-100 text-sm font-light transition-all"
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

export default function EventDetails({ onNext, onBack, register, errors, handleSubmit, watch, selectedDates, setSelectedDates }) {
  const [dateTimes, setDateTimes] = React.useState({})
  const [activeDate, setActiveDate] = React.useState(null)

  React.useEffect(() => {
    // Load saved state when component mounts
    const savedDates = JSON.parse(localStorage.getItem("event_selected_dates") || "[]")
    const savedDateTimes = JSON.parse(localStorage.getItem("event_date_times") || "{}")
    const savedActiveDate = localStorage.getItem("event_active_date")

    if (savedDates.length > 0) setSelectedDates(savedDates)
    if (Object.keys(savedDateTimes).length > 0) setDateTimes(savedDateTimes)
    if (savedActiveDate) setActiveDate(savedActiveDate)
  }, [])

  React.useEffect(() => {
    // Save state whenever it changes
    localStorage.setItem("event_selected_dates", JSON.stringify(selectedDates))
    localStorage.setItem("event_date_times", JSON.stringify(dateTimes))
    localStorage.setItem("event_active_date", activeDate || "")
  }, [selectedDates, dateTimes, activeDate])


  React.useEffect(() => {
    if (selectedDates.length > 0 && !activeDate) {
      setActiveDate(selectedDates[0])
    } else if (selectedDates.length === 0) {
      setActiveDate(null)
    } else if (activeDate && !selectedDates.includes(activeDate)) {
      setActiveDate(selectedDates[0] || null)
    }
  }, [selectedDates, activeDate])

  const handleDatesChange = (dates) => {
    setSelectedDates(dates)
    
    const newDateTimes = { ...dateTimes }
    Object.keys(newDateTimes).forEach(date => {
      if (!dates.includes(date)) {
        delete newDateTimes[date]
      }
    })
    setDateTimes(newDateTimes)
  }

  const handleTimeChange = (date, time) => {
    setDateTimes(prev => ({
      ...prev,
      [date]: time
    }))
    
    const currentIndex = selectedDates.indexOf(date)
    if (currentIndex < selectedDates.length - 1) {
      setActiveDate(selectedDates[currentIndex + 1])
    }
  }

  const formatDisplayDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString + "T00:00:00")
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  }

  const onSubmit = () => {
    if (selectedDates.length === 0) {
      return window.showToast?.("Please select at least one event date.", "error")
    }
    
    for (const date of selectedDates) {
      if (!dateTimes[date]) {
        return window.showToast?.(`Please select a ready time for ${formatDisplayDate(date)}.`, "error")
      }
    }
    
    onNext()
  }

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
      <div className="sm:p-8 text-left">
        <h2 className="text-2xl sm:text-3xl font-normal text-gray-900 mb-1 sm:mb-3 tracking-wide">
          Event Details<span className="text-gray-400 ml-2">*</span>
        </h2>
        <p
          className="text-gray-700 text-sm sm:text-base font-light max-w-2xl mx-auto"
          style={{ letterSpacing: "0.01em" }}
        >
          Tell us when and where you need us.
        </p>
      </div>

      <div className="max-w-2xl mx-auto py-6 sm:py-0">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit()
          }}
        >
          <div className="space-y-6 sm:space-y-6">
            <CustomMultiDatePicker
              name="event_dates"
              label="What are your event date(s)?"
              required={true}
              value={selectedDates}
              onChange={handleDatesChange}
            />

            {selectedDates.length > 0 && (
              <div>
                <label className="block text-sm sm:text-base font-light text-gray-800 mb-3">
                  What is your get ready time? <span className="text-gray-900">*</span>
                </label>
                
                {/* Horizontal date chips */}
                <div className="flex gap-2 mb-4 overflow-x-auto whitespace-nowrap pb-1 no-scrollbar">
                  {selectedDates.map((date) => (
                    <button
                      key={date}
                      type="button"
                      onClick={() => setActiveDate(date)}
                      className={`px-4 py-2 rounded-lg text-sm font-light transition-all duration-200 ${
                        activeDate === date
                          ? "bg-gray-800 text-white border-2 border-gray-600"
                          : "bg-gray-200 text-gray-800 border-2 border-gray-300 hover:bg-gray-300"
                      }`}
                    >
                      {formatDisplayDate(date)}
                      {dateTimes[date] && (
                        <span className="ml-2 opacity-75">✓</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Time picker for active date */}
                {activeDate && (
                  <div className="mt-4">
                    <CustomTimePicker
                      name={`time_${activeDate}`}
                      required={true}
                      value={dateTimes[activeDate] || ""}
                      onChange={(time) => handleTimeChange(activeDate, time)}
                    />
                  </div>
                )}

                <p className="text-xs sm:text-sm text-gray-600 mt-4">
                  This is the{" "}
                  <span className="font-semibold text-gray-800">time you need to be ready by</span>. It is NOT the start time.
                </p>
              </div>
            )}
          </div>

          {/* Buttons */}
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


// =====================================================================================

// import React from 'react';
// import DatePicker from './DatePicker';

// // Define the elegant color palette (Indigo theme)
// const PRIMARY_COLOR_CLASS = 'indigo-600';
// const PRIMARY_HOVER_CLASS = 'indigo-700';

// export default function EventDetails({ onNext, onBack, register, errors, handleSubmit, watch }) {
//   const watchedValues = watch();

//   const onSubmit = (data) => {
//     console.log('EventDetails form submitted with data:', data);

//     // Manual validation for required fields
//     const eventDate = watchedValues.event_date;
//     const readyTime = watchedValues.ready_time;

//     if (!eventDate || eventDate.trim() === '') {
//       window.showToast('Please select an event date.', 'error');
//       return;
//     }

//     if (!readyTime || readyTime.trim() === '') {
//       window.showToast('Please select a ready time.', 'error');
//       return;
//     }

//     // Form validation passed
//     onNext();
//   };

//   return (
//     // Applied elegant container styling (max-w-6xl, shadow-2xl, increased padding)
//     <div className="max-w-sm md:max-w-2xl lg:max-w-6xl mx-auto px-4 py-4 md:py-8 lg:py-12">
//       <div className="bg-white rounded-xl shadow-2xl p-4 md:p-8 lg:p-14 border border-gray-50">

//         {/* Header Section: Applied elegant typography (font-light, larger size) */}
//         <div className="mb-6 md:mb-10 lg:mb-14">
//           <h2 className="text-lg md:text-2xl lg:text-4xl font-light text-gray-900 mb-2 md:mb-3 tracking-tight text-left">
//             Service Details
//             <span className="text-red-500 ml-1 font-normal">*</span>
//           </h2>
//           {/* Added consistent descriptive text below header for flow */}
//           <p className="text-gray-500 text-sm md:text-base lg:text-lg">Tell us when and where you need us.</p>
//         </div>

//         <form onSubmit={(e) => { e.preventDefault(); onSubmit(watchedValues); }}>
//           <div className="space-y-6 md:space-y-8 mb-8 md:mb-12"> {/* Increased vertical spacing for cleanliness */}

//             {/* Event Date Input */}
//             <DatePicker
//               register={register}
//               name="event_date"
//               label="What's your event date?"
//               required={true}
//               error={errors.event_date?.message}
//             />

//             {/* Get Ready Time Input */}
//             <div>
//               <label className="block text-sm md:text-base font-semibold text-gray-800 mb-2">
//                 What is your get ready time? <span className="text-red-500">*</span>
//               </label>
//               <p className="text-xs md:text-sm text-gray-500 mb-3">
//                 This is the **time you need to be ready by**. It is NOT the start time.
//               </p>
//               <input
//                 type="time"
//                 {...register('ready_time')}
//                 // Applied elegant input styling: increased padding, Indigo focus ring/border.
//                 // Added cursor-pointer for explicit clickable feedback.
//                 className={`
//                   w-full px-4 py-2 md:px-5 md:py-3 border border-gray-300 rounded-xl transition-all duration-200
//                   focus:outline-none focus:ring-2 focus:ring-${PRIMARY_COLOR_CLASS} focus:border-${PRIMARY_COLOR_CLASS}
//                   cursor-pointer // Improvement: Change cursor on hover
//                 `}
//               />
//               {errors.ready_time && (
//                 <p className="mt-2 text-sm text-red-600 font-medium">{errors.ready_time.message}</p>
//               )}
//             </div>
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
//               type="submit"
//               // Continue button style retained (solid Indigo fill)
//               className={`
//                 px-4 py-2 md:px-6 md:py-3 lg:px-10 lg:py-3.5 rounded-xl font-bold text-sm md:text-base lg:text-lg shadow-lg transition-all duration-300
//                 bg-${PRIMARY_COLOR_CLASS} text-white
//                 hover:bg-${PRIMARY_HOVER_CLASS} hover:shadow-xl transform hover:scale-[1.01] cursor-pointer
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

// import React from 'react';

// export default function EventDetails({ onNext, onBack, register, errors }) {
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Form validation is handled by react-hook-form
//     onNext();
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-8 glass-card">
//       <h2 className="text-2xl font-bold text-gray-900 mb-8 text-left">
//         Service Details
//         <span className="text-red-500 ml-1">*</span>
//       </h2>

//       <form onSubmit={handleSubmit}>
//         <div className="space-y-6 mb-8">
//           <div>
//             <label className="block text-sm font-semibold text-gray-800 mb-2">
//               What's your event date? <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="date"
//               {...register('event_date', { required: true })}
//               min={new Date().toISOString().split('T')[0]}
//               className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
//             />
//             {errors.event_date && (
//               <p className="mt-1 text-sm text-red-600">Event date is required</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-800 mb-2">
//               What is your get ready time? <span className="text-red-500">*</span>
//             </label>
//             <p className="text-xs text-gray-600 mb-2 italic">
//               This is the time you need to be ready by. It is NOT the start time.
//             </p>
//             <input
//               type="time"
//               {...register('ready_time', { required: true })}
//               className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
//             />
//             {errors.ready_time && (
//               <p className="mt-1 text-sm text-red-600">Ready time is required</p>
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
//             className="px-8 py-3 rounded-lg font-semibold transition-all duration-200 bg-pink-600 text-white hover:bg-pink-700 focus:ring-4 focus:ring-pink-200"
//           >
//             Continue
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
