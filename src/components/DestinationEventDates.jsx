import React from "react";

const CustomDatePicker = ({ label, name, register, error, required }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState("");
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const dropdownRef = React.useRef(null);

  const getMinimumDate = (minDaysAdvance = 2) => {
    const today = new Date();
    const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const minimumDate = new Date(localToday);
    minimumDate.setDate(minimumDate.getDate() + minDaysAdvance);
    return minimumDate;
  };

  const minDate = getMinimumDate(2);
  minDate.setHours(0, 0, 0, 0);

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { daysInMonth: lastDay.getDate(), startingDayOfWeek: firstDay.getDay(), year, month };
  };

  const isDateDisabled = (date) => date < minDate;

  const handleDateSelect = (day, onChange) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const selectedDateObj = new Date(year, month, day);
    if (isDateDisabled(selectedDateObj)) return;

    const formatted = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(formatted);
    onChange({ target: { name, value: formatted } });
    setIsOpen(false);
  };

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const { onChange, ...registerProps } = register(name);

  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) calendarDays.push(<div key={`empty-${i}`} className="p-2"></div>);
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day);
    const isDisabled = isDateDisabled(dateObj);
    const isSelected = selectedDate === `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    calendarDays.push(
      <button
        key={day}
        type="button"
        onClick={() => !isDisabled && handleDateSelect(day, onChange)}
        disabled={isDisabled}
        className={`p-2 rounded-lg text-sm font-light transition-all duration-150
          ${isSelected
            ? "bg-gradient-to-r from-gray-100 to-gray-200 text-white shadow-md shadow-gray-700/40"
            : isDisabled
            ? " bg-gray-200 text-gray-400 cursor-not-allowed"
            : " bg-gray-200 text-gray-900 hover:bg-gray-800 hover:text-gray-200"
          }`}
      >
        {day}
      </button>
    );
  }

  return (
    <div>
      <label htmlFor={name} className="block text-sm md:text-base font-light text-gray-800 mb-2">
        {label} {required && <span className="text-gray-900">*</span>}
      </label>

      <div className="relative" ref={dropdownRef}>
        <input type="hidden" {...registerProps} onChange={onChange} />

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group relative w-full p-4 sm:p-5 rounded-lg border border-gray-300 bg-white 
          hover:border-gray-500 hover:bg-gray-50 hover:shadow-md text-left flex items-center justify-between transition-all duration-300"
        >
          <span className={selectedDate ? "text-gray-800" : "text-gray-400"}>
            {selectedDate ? formatDisplayDate(selectedDate) : "Select date..."}
          </span>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-xl shadow-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <button onClick={handlePrevMonth} type="button" className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h3 className="text-gray-800 font-medium text-base">{monthName}</h3>
              <button onClick={handleNextMonth} type="button" className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d} className="text-center text-xs text-gray-500 p-2">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">{calendarDays}</div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-gray-100 border border-gray-300 rounded-lg">
          <p className="text-sm text-gray-800 font-light">{error}</p>
        </div>
      )}
    </div>
  );
};


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

export default function DestinationEventDates({
  onNext,
  onBack,
  register,
  errors,
  watch,
}) {
  const watchedValues = watch();

  const handleSubmit = (e) => {
    e.preventDefault();

    const startDate = watchedValues.event_start_date;
    const endDate = watchedValues.event_end_date;

    if (!startDate) {
      window.showToast?.("Please select an event start date.", "error");
      return;
    }

    if (!endDate) {
      window.showToast?.("Please select an event end date.", "error");
      return;
    }

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (endDateObj <= startDateObj) {
      window.showToast?.(
        "Event end date must be after the start date.",
        "error"
      );
      return;
    }

    onNext();
  };

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
      <div className="bg-white rounded-2xl p-5 sm:p-8 border border-gray-200 shadow-2xl shadow-gray-400/20">
        {/* Header */}
        <div className="mb-5 sm:mb-6 text-center">
          <h2
            className="text-2xl sm:text-3xl font-light text-gray-900 mb-3 tracking-wide"
          >
            Event Dates
            <span className="text-gray-500 ml-2 font-normal">*</span>
          </h2>
          <p
            className="text-gray-600 text-sm sm:text-base font-light max-w-2xl mx-auto"
          >
            Tell us when your destination event takes place.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-10 mb-12 sm:mb-16">
            {/* Start Date */}
            <CustomDatePicker
              register={register}
              name="event_start_date"
              label="Event Starting Date"
              required={true}
              error={errors.event_start_date?.message}
            />

            {/* End Date */}
            <CustomDatePicker
              register={register}
              name="event_end_date"
              label="Event Ending Date"
              required={true}
              error={errors.event_end_date?.message}
              minDate={
                watchedValues.event_start_date
                  ? new Date(
                      new Date(watchedValues.event_start_date).setDate(
                        new Date(watchedValues.event_start_date).getDate() + 1
                      )
                    )
                      .toISOString()
                      .split("T")[0]
                  : undefined
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 sm:pt-8 border-t border-gray-200 mt-4 md:mt-6">
            {/* Back Button */}
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-light rounded-lg bg-gray-200 text-gray-900 
              hover:bg-gray-300 border border-gray-400 transition-all duration-300"
              style={{ letterSpacing: "0.05em" }}
            >
              Back
            </button>

            {/* Continue Button (Charcoal Gradient) */}
            <button
              type="submit"
              className="relative px-8 sm:px-10 py-2.5 sm:py-3 text-sm sm:text-base font-light rounded-lg transition-all duration-300 overflow-hidden
       bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white shadow-md shadow-gray-700/20 hover:shadow-lg hover:shadow-gray-700/30 hover:scale-[1.02] active:scale-100 cursor-pointer border border-gray-600"
              style={{ letterSpacing: "0.05em" }}
            >
              <span className="relative flex items-center justify-center gap-2.5">
                Continue
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


// import React from 'react';
// import DatePicker from './DatePicker';

// // Define the elegant color palette (Indigo theme)
// const PRIMARY_COLOR_CLASS = 'indigo-600';
// const PRIMARY_HOVER_CLASS = 'indigo-700';

// export default function DestinationEventDates({ onNext, onBack, register, errors, watch }) {
//   const watchedValues = watch();

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Manual validation for required fields
//     const startDate = watchedValues.event_start_date;
//     const endDate = watchedValues.event_end_date;

//     if (!startDate || startDate.trim() === '') {
//       window.showToast('Please select an event start date.', 'error');
//       return;
//     }

//     if (!endDate || endDate.trim() === '') {
//       window.showToast('Please select an event end date.', 'error');
//       return;
//     }

//     // Validate that end date is after start date
//     const startDateObj = new Date(startDate);
//     const endDateObj = new Date(endDate);

//     if (endDateObj <= startDateObj) {
//       window.showToast('Event end date must be after the start date.', 'error');
//       return;
//     }

//     // Form validation passed
//     onNext();
//   };

//   return (
//     // Applied elegant container styling (max-w-6xl, shadow-2xl, increased padding)
//     <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
//       <div className="bg-white rounded-xl shadow-2xl p-6 md:p-14 border border-gray-50">

//         {/* Header Section: Applied elegant typography (font-light, larger size) */}
//         <div className="mb-6 md:mb-10 lg:mb-14">
//           <h2 className="text-sm md:text-2xl lg:text-4xl font-light text-gray-900 mb-3 tracking-tight text-left">
//             Event Dates
//             <span className="text-red-500 ml-1 font-normal">*</span>
//           </h2>
//           {/* Added consistent descriptive text below header for flow */}
//           <p className="text-gray-500 text-sm md:text-lg">Tell us when your destination event takes place.</p>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="space-y-8 mb-12"> {/* Increased vertical spacing for cleanliness */}

//             {/* Event Start Date Input */}
//             <DatePicker
//               register={register}
//               name="event_start_date"
//               label="Event Starting Date"
//               required={true}
//               error={errors.event_start_date && "Event start date is required"}
//             />

//             {/* Event End Date Input */}
//             <DatePicker
//               register={register}
//               name="event_end_date"
//               label="Event Ending Date"
//               required={true}
//               error={errors.event_end_date && "Event end date is required"}
//             />
//           </div>

//           {/* Action Buttons: Applied consistent, solid-fill styling */}
//           <div className="flex justify-between pt-8 border-t border-gray-100 mt-6">
//             <button
//               type="button"
//               onClick={onBack}
//               // Back button MATCHED to primary style (solid Indigo fill)
//               className={`
//                 px-8 py-3 rounded-lg font-semibold transition-all duration-200
//                 border border-gray-300 text-gray-700 hover:bg-gray-50
//               `}
//             >
//               ← Back
//             </button>
//             <button
//               type="submit"
//               // Applied Indigo primary button style
//               className={`
//                 px-8 py-3 rounded-lg font-semibold transition-all duration-200
//                 bg-${PRIMARY_COLOR_CLASS} text-white hover:bg-${PRIMARY_HOVER_CLASS}
//                 focus:ring-4 focus:ring-${PRIMARY_COLOR_CLASS}/30 cursor-pointer
//               `}
//             >
//               Continue →
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
