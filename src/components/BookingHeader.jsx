import Logo from "../assets/Black.png";

export default function BookingHeader({ step, getTotalSteps, getStepTitle, isEditMode }) {
  // Logic remains strictly unchanged.
  const percentageComplete = Math.round((step / getTotalSteps()) * 100)

  return (
    <div className="text-center px-2 sm:px-4 max-w-3xl mx-auto mb-5 lg:mb-0">
      <div className="flex justify-center mb-4">
        <img
          src={Logo}
          alt="Logo"
          className="w-56 sm:w-44 md:w-52 lg:w-72 -mt-5 sm:-mt-2 md:-mt-3 lg:-mt-5"
        />
      </div>

      {/* Subheading - reduced from h1 to smaller text */}
      {/* <p
        className="text-lg sm:text-xl text-gray-700 font-light max-w-2xl mx-auto mb-2"
        style={{ letterSpacing: "0.01em" }}
      >
        {isEditMode ? "Edit Your Booking" : ""}
      </p> */}

      <p
        className="text-sm sm:text-base text-gray-600 font-light max-w-2xl mx-auto lg:mb-4 mb-8"
        style={{ letterSpacing: "0.01em" }}
      >
        {isEditMode ? "Update your booking details" : "Professional makeup and hair services for you"}
      </p>

      {/* PROGRESS BAR CONTAINER - Light theme with charcoal accents */}
      
      <div className="flex justify-between text-xs sm:text-sm mb-2">
        {/* Step Counter */}
        <span className="font-light text-gray-700 tracking-wide">
          Step <span className="font-medium text-gray-900">{step}</span> of{" "}
          <span className="font-medium text-gray-900">{getTotalSteps()}</span>
        </span>

        {/* Percentage Complete - Changed from rose-400 to gray-700 */}
        <span className="text-gray-700 font-medium tracking-wide">{percentageComplete}% Complete</span>
      </div>

      {/* Progress Track - Updated colors to charcoal gradient */}
      <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`
            absolute top-0 left-0 h-full 
            bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900
            rounded-full transition-all duration-500 ease-out 
            shadow-lg shadow-gray-700/50 
          `}
          style={{ width: `${percentageComplete}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-pulse opacity-50"></div>
        </div>
      </div>      
    </div>
  )
}



// import React from 'react';
// import { formatCurrency } from "../../lib/currencyFormat"; // Added currency formatter import

// // Define the elegant color palette mapping
// const COLOR_MAP = {
//   // ELEGANT PALETTE: ROSE GOLD / BLUSH ACCENT
//   blush: "from-rose-400 to-pink-600", // Soft, premium gradient for bridal services
//   scarlet: "from-amber-400 to-red-700",
//   indigo: "from-violet-400 to-indigo-600",
//   rose: "from-pink-400 to-rose-600",
//   emerald: "from-teal-400 to-emerald-600",
//   sky: "from-sky-400 to-blue-600",
// };

// const BookingHeader = ({ step, getTotalSteps, getStepTitle, isEditMode }) => {
//   const PRIMARY_COLOR = "indigo";   // Setting the new unique, elegant color
//   const gradientClasses = COLOR_MAP[PRIMARY_COLOR] || COLOR_MAP.blush;
//   // Dynamic class for text color (using purple-600 for contrast)
//   const textColorClass = `text-purple-600`;

//   return (
//     // Increased bottom margin for better separation from form content
//     <div className="text-center mb-16">

//       {/* Main Title: Applied font-light for sophistication, kept large for impact */}
//       <h1 className="text-5xl font-light text-gray-900 mb-3 tracking-tight">
//         {isEditMode ? 'Edit Your Booking' : 'Makeup & Hair Services'}
//       </h1>

//       {/* Subheading: Increased text size and reduced contrast for elegance */}
//       <p className="text-xl text-gray-500 font-light">
//         {isEditMode ? 'Update your booking details' : 'Professional makeup and hair services for your special day'}
//       </p>

//       {/* Progress Bar Container */}
//       <div className="mt-10 max-w-xl mx-auto">
//         <div className="flex justify-between text-base font-medium text-gray-600 mb-2">
//           <span className="tracking-wide">Step {step} of {getTotalSteps()}</span>
//           {/* Applying the new blush/pink text color */}
//           <span className={`${textColorClass} font-semibold`}>
//             {Math.round((step / getTotalSteps()) * 100)}% Complete
//           </span>
//         </div>

//         {/* Progress Track: Refined background and height */}
//         <div className="relative w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
//           <div
//             className={`
//               absolute top-0 left-0 h-full
//               bg-gradient-to-r ${gradientClasses}
//               rounded-full transition-all duration-500 ease-out shadow-md
//             `}
//             // Applied shadow for premium glow effect, using a soft purple/indigo color for the glow
//             style={{
//                 width: `${(step / getTotalSteps()) * 100}%`,
//                 boxShadow: `0 2px 8px -2px rgba(139, 92, 246, 0.6)` // Purple/Indigo glow effect
//             }}
//           >
//             {/* Keeping subtle light animation for premium feel */}
//             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50 animate-pulse"></div>
//           </div>
//         </div>

//         {/* Step Title: Increased size and weight for focus */}
//         <div className="text-center mt-4">
//           <p className="text-lg font-semibold text-gray-800 tracking-wide">
//             {getStepTitle()}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingHeader;
