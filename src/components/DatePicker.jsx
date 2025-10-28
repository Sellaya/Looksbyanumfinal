import React from "react";

/**
 * Centralized DatePicker component with consistent styling and business logic
 * Features:
 * - 2-day advance booking requirement (Logic retained)
 * - Consistent styling across all components (NOW ROSE GLOW DARK MODE)
 * - Easy to maintain and update
 * - Supports both register (react-hook-form) and onChange patterns
 */

const DatePicker = ({
  register, 
  name,
  label,
  required = false,
  error,
  className = "",
  onChange,
  value,
  minDaysAdvance = 2,
  maxDate,
  // Added inputId prop to facilitate full-field click from external components
  inputId,
  ...props
}) => {
  // Calculate minimum date based on advance days requirement (LOGIC RETAINED)
  const getMinimumDate = () => {
    // Get today's date in the user's local timezone
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();

    // Create a new date object with just the date parts (no time)
    const localToday = new Date(year, month, day);

    // Add the required advance days
    const minimumDate = new Date(localToday);
    minimumDate.setDate(minimumDate.getDate() + minDaysAdvance);

    // Format as YYYY-MM-DD
    const yyyy = minimumDate.getFullYear();
    const mm = String(minimumDate.getMonth() + 1).padStart(2, "0");
    const dd = String(minimumDate.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  };

  // Base styling that matches the DARK MODE / ROSE GLOW design system
  const baseStyles = `
  w-full px-4 py-2 md:px-5 md:py-3 rounded-xl 
  transition-all duration-200 cursor-pointer text-neutral-200 
  bg-neutral-900 border border-neutral-700
  focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500
  ${error ? "border-red-700 focus:border-red-700 focus:ring-red-500/50" : ""}
  ${className}
 `;

  return (
    <div>
      {label && (
        <label className="block text-sm md:text-base font-light text-white mb-2">
          {label}
          {required && <span className="text-gray-400 ml-1">*</span>}
        </label>
      )}

      <input
        id={inputId}
        type="date"
        min={getMinimumDate()}
        max={maxDate}
        className={baseStyles}
        {...(register ? register(name) : {})}
        {...(onChange ? { onChange } : {})}
        {...(value !== undefined ? { value } : {})}
        {...props}
      />

      {error && <p className="mt-1 text-sm text-gray-300 font-light">{error}</p>}
    </div>
  );
};

export default DatePicker;

// ======================================================================

// import React from 'react';

// /**
//  * Centralized DatePicker component with consistent styling and business logic
//  * Features:
//  * - 2-day advance booking requirement
//  * - Consistent styling across all components
//  * - Easy to maintain and update
//  * - Supports both register (react-hook-form) and onChange patterns
//  */

// const DatePicker = ({
//   register,
//   name,
//   label,
//   required = false,
//   error,
//   className = '',
//   onChange,
//   value,
//   minDaysAdvance = 2,
//   maxDate,
//   ...props
// }) => {
//   // Calculate minimum date based on advance days requirement
//   const getMinimumDate = () => {
//     // Get today's date in the user's local timezone
//     const today = new Date();
//     const year = today.getFullYear();
//     const month = today.getMonth();
//     const day = today.getDate();

//     // Create a new date object with just the date parts (no time)
//     const localToday = new Date(year, month, day);

//     // Add the required advance days
//     const minimumDate = new Date(localToday);
//     minimumDate.setDate(minimumDate.getDate() + minDaysAdvance);

//     // Format as YYYY-MM-DD
//     const yyyy = minimumDate.getFullYear();
//     const mm = String(minimumDate.getMonth() + 1).padStart(2, '0');
//     const dd = String(minimumDate.getDate()).padStart(2, '0');

//     return `${yyyy}-${mm}-${dd}`;
//   };

//   // Base styling that matches the design system
//   const baseStyles = `
//     w-full px-4 py-2 md:px-5 md:py-3 border border-gray-300 rounded-xl
//     transition-all duration-200 cursor-pointer
//     focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600
//     ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
//     ${className}
//   `;

//   return (
//     <div>
//       {label && (
//         <label className="block text-sm md:text-base font-semibold text-gray-800 mb-2">
//           {label}
//           {required && <span className="text-red-500 ml-1">*</span>}
//         </label>
//       )}

//       <input
//         type="date"
//         min={getMinimumDate()}
//         max={maxDate}
//         className={baseStyles}
//         {...(register ? register(name) : {})}
//         {...(onChange ? { onChange } : {})}
//         {...(value !== undefined ? { value } : {})}
//         {...props}
//       />

//       {error && (
//         <p className="mt-1 text-sm text-red-600">{error}</p>
//       )}
//     </div>
//   );
// };

// export default DatePicker;
