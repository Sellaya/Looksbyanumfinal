"use client";
import React from "react";

export default function NonBridalBreakdown({
  register,
  watch,
  errors,
  onNext,
  onBack,
  setValue,
}) {
  const watchedFields = watch();
  const {
    personCount,
    bothCount,
    makeupOnlyCount,
    hairOnlyCount,
    extensionsCount,
    jewelryCount,
    airbrushCount,
    sareeDrapingCount,
    hijabSettingCount,
  } = watchedFields.nonBridal || {};

  const handleNext = () => {
    onNext();
  };

  const ServiceRow = ({ label, name, countName, register, watch }) => {
    const checked = watch(name);
    return (
      <div
        className={`flex justify-between items-center border border-gray-300 bg-white rounded-xl px-4 py-3 sm:px-6 sm:py-4 hover:shadow-sm transition-all duration-200 ${
          checked ? "border-gray-500" : ""
        }`}
      >
        <label className="flex items-center gap-3 text-gray-900 text-base font-light">
          <input
            type="checkbox"
            {...register(name)}
            className="w-4 h-4 accent-gray-700"
          />
          {label}
        </label>

        {checked && (
          <input
            type="number"
            min={1}
            placeholder="0"
            {...register(countName)}
            className="w-20 sm:w-24 text-center border border-gray-300 rounded-lg px-2 py-1 text-gray-800 font-light focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-all"
          />
        )}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="sm:p-8 text-left">
        {/* Header Section */}
        <div className="text-left mb-4 sm:mb-5">
          <h2 className="text-2xl sm:text-3xl font-normal text-gray-900 mb-1 sm:mb-3 tracking-wide">
            Non-Bridal Service Breakdown
          </h2>
          <p className="text-gray-600 text-sm sm:text-base font-light">
            Select the services required and specify how many people need each.
          </p>
        </div>

        {/* Main Service Options */}
        <div className="space-y-4 sm:space-y-5 mb-8">
          <ServiceRow
            label="Hair & Makeup (Both)"
            name="nonBridal.hasBoth"
            countName="nonBridal.bothCount"
            register={register}
            watch={watch}
          />
          <ServiceRow
            label="Makeup Only"
            name="nonBridal.hasMakeup"
            countName="nonBridal.makeupOnlyCount"
            register={register}
            watch={watch}
          />
          <ServiceRow
            label="Hair Only"
            name="nonBridal.hasHair"
            countName="nonBridal.hairOnlyCount"
            register={register}
            watch={watch}
          />
        </div>

        {/* Add-on Options */}
        <div className="mt-10 mb-8">
          <h3 className="text-lg sm:text-xl text-gray-800 font-normal mb-4">
            Add-ons
          </h3>
          <div className="space-y-4 sm:space-y-5">
            <ServiceRow
              label="Hair Extensions"
              name="nonBridal.hasExtensions"
              countName="nonBridal.extensionsCount"
              register={register}
              watch={watch}
            />
            <ServiceRow
              label="Jewelry / Veil Setting"
              name="nonBridal.hasJewelry"
              countName="nonBridal.jewelryCount"
              register={register}
              watch={watch}
            />
            <ServiceRow
              label="Airbrush Makeup"
              name="nonBridal.hasAirbrush"
              countName="nonBridal.airbrushCount"
              register={register}
              watch={watch}
            />
            <ServiceRow
              label="Saree Draping"
              name="nonBridal.hasSareeDraping"
              countName="nonBridal.sareeDrapingCount"
              register={register}
              watch={watch}
            />
            <ServiceRow
              label="Hijab Setting"
              name="nonBridal.hasHijabSetting"
              countName="nonBridal.hijabSettingCount"
              register={register}
              watch={watch}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center pt-6 sm:pt-8 border-t border-gray-200 mt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-light rounded-lg transition-all duration-300 bg-gray-200 text-gray-900 border border-gray-400 shadow-md hover:bg-gray-300 hover:scale-[1.02]"
          >
            Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="relative px-8 sm:px-10 py-2.5 sm:py-3 text-sm sm:text-base font-light rounded-lg transition-all duration-300 overflow-hidden bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white shadow-md shadow-gray-700/20 hover:shadow-lg hover:shadow-gray-700/30 hover:scale-[1.02] active:scale-100 border border-gray-600"
            style={{ letterSpacing: "0.05em" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-out"></div>
            <span className="relative flex items-center justify-center gap-2">
              Continue
            </span>
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
  );
}


// import React from "react";

// export default function NonBridalBreakdown({
//   register,
//   watch,
//   errors,
//   onNext,
//   onBack,
//   setValue,
// }) {
//   const watchedFields = watch();
//   const personCount = watchedFields.nonBridal?.personCount || "";
//   const everyoneBoth = watchedFields.nonBridal?.everyoneBoth;
//   const bothCount = watchedFields.nonBridal?.bothCount || "";
//   const makeupOnlyCount = watchedFields.nonBridal?.makeupOnlyCount || "";
//   const hairOnlyCount = watchedFields.nonBridal?.hairOnlyCount || "";
//   const extensionsCount = watchedFields.nonBridal?.extensionsCount || "";
//   const jewelryCount = watchedFields.nonBridal?.jewelryCount || "";
//   const hasAirbrush = watchedFields.nonBridal?.hasAirbrush;
//   const airbrushCount = watchedFields.nonBridal?.airbrushCount || "";
//   const hasSarhiDripping = watchedFields.nonBridal?.hasSarhiDripping;
//   const sarhiDrippingCount = watchedFields.nonBridal?.sarhiDrippingCount || "";
//   const hasHijabSetting = watchedFields.nonBridal?.hasHijabSetting;
//   const hijabSettingCount = watchedFields.nonBridal?.hijabSettingCount || "";

//   const handleEveryoneBothSelect = (value) => {
//     setValue("nonBridal.everyoneBoth", value);
//     if (value === "Yes") {
//       // Clear individual counts when everyone needs both
//       setValue("nonBridal.bothCount", "");
//       setValue("nonBridal.makeupOnlyCount", "");
//       setValue("nonBridal.hairOnlyCount", "");
//     }
//   };

//   const handleAirbrushSelect = (value) => {
//     setValue("nonBridal.hasAirbrush", value);
//     if (value === "No") {
//       setValue("nonBridal.airbrushCount", "");
//     }
//   };

//   const handleSarhiDrippingSelect = (value) => {
//     setValue("nonBridal.hasSarhiDripping", value);
//     if (value === "No") {
//       setValue("nonBridal.sarhiDrippingCount", "");
//     }
//   };

//   const handleHijabSettingSelect = (value) => {
//     setValue("nonBridal.hasHijabSetting", value);
//     if (value === "No") {
//       setValue("nonBridal.hijabSettingCount", "");
//     }
//   };

//   const handleNext = () => {
//     // Validate based on everyoneBoth selection
//     if (everyoneBoth === "No") {
//       const totalSelected =
//         (parseInt(bothCount) || 0) +
//         (parseInt(makeupOnlyCount) || 0) +
//         (parseInt(hairOnlyCount) || 0);
//       if (totalSelected === 0) {
//         window.showToast(
//           "Please specify how many people need each service.",
//           "warning"
//         );
//         return;
//       }
//     }

//     if (hasAirbrush === "Yes" && (!airbrushCount || airbrushCount <= 0)) {
//       window.showToast(
//         "Please specify how many members need airbrush makeup.",
//         "warning"
//       );
//       return;
//     }

//     if (
//       hasSarhiDripping === "Yes" &&
//       (!sarhiDrippingCount || sarhiDrippingCount <= 0)
//     ) {
//       window.showToast(
//         "Please specify how many members need Saree Draping.",
//         "warning"
//       );
//       return;
//     }

//     if (
//       hasHijabSetting === "Yes" &&
//       (!hijabSettingCount || hijabSettingCount <= 0)
//     ) {
//       window.showToast(
//         "Please specify how many members need Hijab Setting.",
//         "warning"
//       );
//       return;
//     }

//     // Set serviceType based on selection
//     if (everyoneBoth === "Yes") {
//       setValue("nonBridal.serviceType", "Both Hair & Makeup");
//       setValue("nonBridal.bothCount", personCount);
//     } else {
//       // Determine service type based on counts
//       if ((parseInt(bothCount) || 0) > 0) {
//         setValue("nonBridal.serviceType", "Both Hair & Makeup");
//       } else if ((parseInt(makeupOnlyCount) || 0) > 0) {
//         setValue("nonBridal.serviceType", "Makeup Only");
//       } else if ((parseInt(hairOnlyCount) || 0) > 0) {
//         setValue("nonBridal.serviceType", "Hair Only");
//       }
//     }

//     // Set add-on booleans based on counts
//     setValue(
//       "nonBridal.extensions",
//       (parseInt(extensionsCount) || 0) > 0 ? "true" : "false"
//     );
//     setValue(
//       "nonBridal.veil_or_jewelry_setting",
//       (parseInt(jewelryCount) || 0) > 0 ? "true" : "false"
//     );
//     setValue("nonBridal.airbrush", hasAirbrush === "Yes" ? "true" : "false");
//     setValue(
//       "nonBridal.sarhi_dripping",
//       hasSarhiDripping === "Yes" ? "true" : "false"
//     );
//     setValue(
//       "nonBridal.hijab_setting",
//       hasHijabSetting === "Yes" ? "true" : "false"
//     );

//     onNext();
//   };

//   const showBreakdownSection = everyoneBoth === "No";

//   // Helper component for radio options with dark mode styling
//   const RadioOption = ({ label, value, fieldName, isSelected, onClick }) => (
//     <div
//       onClick={() => onClick(value)}
//       className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 overflow-hidden relative ${
//         isSelected
//           ? "border-rose-400/50 bg-gradient-to-br from-rose-500/20 via-pink-500/20 to-fuchsia-500/20 backdrop-blur-sm shadow-xl shadow-rose-500/20"
//           : "border-gray-700/50 bg-gray-900/60 hover:border-rose-400/40 hover:bg-gray-800/70"
//       }`}
//     >
//       {isSelected && (
//         <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-pink-500/10 to-fuchsia-500/10 blur-md"></div>
//       )}
//       <div className="relative flex items-center space-x-3">
//         <input
//           type="radio"
//           {...register(fieldName)}
//           value={value}
//           className="w-4 h-4 text-rose-600 border-gray-600 focus:ring-rose-500 bg-gray-800"
//         />
//         <span className="font-light text-gray-200">{label}</span>
//       </div>
//     </div>
//   );

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
//       <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-7 sm:p-10 lg:p-14 border border-gray-700/50 shadow-2xl shadow-gray-900/50">
//         {/* Header */}
//         <div className="text-center mb-10 sm:mb-14">
//           <h2
//             className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-4 tracking-wide leading-tight"
//             style={{
//               fontFamily: "system-ui, -apple-system, sans-serif",
//               letterSpacing: "0.02em",
//             }}
//           >
//             Service Details
//           </h2>
//           <div className="h-0.5 w-20 bg-gradient-to-r from-rose-400 via-pink-400 to-fuchsia-400 rounded-full mx-auto mb-5 opacity-80"></div>
//         </div>

//         <div className="space-y-10 md:space-y-12 mb-8 md:mb-12">
//           {/* Everyone Both Question */}
//           <div className="border border-gray-700/50 rounded-xl p-6 md:p-8 bg-gray-800/50 shadow-inner shadow-gray-900/30">
//             <h3 className="text-xl md:text-2xl font-light text-white mb-4">
//               Does everyone need both hair and makeup?
//             </h3>
//             <p className="text-sm text-gray-400 mb-6 font-light italic">
//               *Choose No if some people need makeup ONLY, or hair ONLY.*
//             </p>

//             <div className="space-y-3">
//               <RadioOption
//                 label="Yes"
//                 value="Yes"
//                 fieldName="nonBridal.everyoneBoth"
//                 isSelected={everyoneBoth === "Yes"}
//                 onClick={handleEveryoneBothSelect}
//               />
//               <RadioOption
//                 label="No"
//                 value="No"
//                 fieldName="nonBridal.everyoneBoth"
//                 isSelected={everyoneBoth === "No"}
//                 onClick={handleEveryoneBothSelect}
//               />
//             </div>
//           </div>

//           {/* Breakdown Section */}
//           {showBreakdownSection && (
//             <div className="border border-rose-700/50 rounded-xl p-6 md:p-8 bg-gradient-to-br from-rose-900/20 to-pink-900/20 backdrop-blur-sm shadow-inner shadow-rose-900/20">
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-light text-white mb-2">
//                     How many people need both, Hair AND Makeup?
//                   </label>
//                   <input
//                     type="number"
//                     min={0}
//                     {...register("nonBridal.bothCount")}
//                     className="w-full px-4 py-3 bg-neutral-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all text-gray-200 placeholder-gray-500 font-light"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-light text-white mb-2">
//                     How many people need ONLY makeup?
//                   </label>
//                   <p className="text-xs text-gray-400 mb-2 font-light italic">
//                     *These people don't need hair done.*
//                   </p>
//                   <input
//                     type="number"
//                     min={0}
//                     {...register("nonBridal.makeupOnlyCount")}
//                     className="w-full px-4 py-3 bg-neutral-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all text-gray-200 placeholder-gray-500 font-light"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-light text-white mb-2">
//                     How many people need ONLY hair done?
//                   </label>
//                   <p className="text-xs text-gray-400 mb-2 font-light italic">
//                     *These people don't need makeup done.*
//                   </p>
//                   <input
//                     type="number"
//                     min={0}
//                     {...register("nonBridal.hairOnlyCount")}
//                     className="w-full px-4 py-3 bg-neutral-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all text-gray-200 placeholder-gray-500 font-light"
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Extensions */}
//           <div className="border border-gray-700/50 rounded-xl p-6 md:p-8 bg-gray-800/50 shadow-inner shadow-gray-900/30">
//             <label className="block text-sm font-light text-white mb-4">
//               How many people need hair extensions installed?
//             </label>
//             <input
//               type="number"
//               min={0}
//               {...register("nonBridal.extensionsCount")}
//               className="w-full px-4 py-3 bg-neutral-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all text-gray-200 placeholder-gray-500 font-light"
//             />
//           </div>

//           {/* Jewelry */}
//           <div className="border border-gray-700/50 rounded-xl p-6 md:p-8 bg-gray-800/50 shadow-inner shadow-gray-900/30">
//             <label className="block text-sm font-light text-white mb-4">
//               How many people need Jewelry/Dupatta/Veil Setting?
//             </label>
//             <input
//               type="number"
//               min={0}
//               {...register("nonBridal.jewelryCount")}
//               className="w-full px-4 py-3 bg-neutral-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all text-gray-200 placeholder-gray-500 font-light"
//             />
//           </div>

//           {/* Airbrush Question */}
//           <div className="border border-gray-700/50 rounded-xl p-6 md:p-8 bg-gray-800/50 shadow-inner shadow-gray-900/30">
//             <h3 className="text-xl font-light text-white mb-6">
//               Any member wants airbrush makeup?
//             </h3>

//             <div className="space-y-3">
//               <RadioOption
//                 label="Yes"
//                 value="Yes"
//                 fieldName="nonBridal.hasAirbrush"
//                 isSelected={hasAirbrush === "Yes"}
//                 onClick={handleAirbrushSelect}
//               />
//               <RadioOption
//                 label="No"
//                 value="No"
//                 fieldName="nonBridal.hasAirbrush"
//                 isSelected={hasAirbrush === "No"}
//                 onClick={handleAirbrushSelect}
//               />
//             </div>
//           </div>

//           {/* Airbrush Count */}
//           {hasAirbrush === "Yes" && (
//             <div className="border border-rose-700/50 rounded-xl p-6 md:p-8 bg-gradient-to-br from-rose-900/20 to-pink-900/20 backdrop-blur-sm shadow-inner shadow-rose-900/20">
//               <label className="block text-sm font-light text-white mb-4">
//                 How many members need airbrush makeup?
//               </label>
//               <input
//                 type="number"
//                 min={0}
//                 {...register("nonBridal.airbrushCount")}
//                 className="w-full px-4 py-3 bg-neutral-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all text-gray-200 placeholder-gray-500 font-light"
//               />
//             </div>
//           )}

//           {/* Saree Draping Question */}
//           <div className="border border-gray-700/50 rounded-xl p-6 md:p-8 bg-gray-800/50 shadow-inner shadow-gray-900/30">
//             <h3 className="text-xl font-light text-white mb-3">
//               Any member wants Saree Draping?
//             </h3>
//             <p className="text-sm text-gray-400 mb-6 font-light">
//               Traditional technique creating beautiful draping effect for
//               dupatta or veil ($35 per person)
//             </p>

//             <div className="space-y-3">
//               <RadioOption
//                 label="Yes"
//                 value="Yes"
//                 fieldName="nonBridal.hasSarhiDripping"
//                 isSelected={hasSarhiDripping === "Yes"}
//                 onClick={handleSarhiDrippingSelect}
//               />
//               <RadioOption
//                 label="No"
//                 value="No"
//                 fieldName="nonBridal.hasSarhiDripping"
//                 isSelected={hasSarhiDripping === "No"}
//                 onClick={handleSarhiDrippingSelect}
//               />
//             </div>
//           </div>

//           {/* Saree Draping Count */}
//           {hasSarhiDripping === "Yes" && (
//             <div className="border border-rose-700/50 rounded-xl p-6 md:p-8 bg-gradient-to-br from-rose-900/20 to-pink-900/20 backdrop-blur-sm shadow-inner shadow-rose-900/20">
//               <label className="block text-sm font-light text-white mb-4">
//                 How many members need Saree Draping?
//               </label>
//               <input
//                 type="number"
//                 min={0}
//                 {...register("nonBridal.sarhiDrippingCount")}
//                 className="w-full px-4 py-3 bg-neutral-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all text-gray-200 placeholder-gray-500 font-light"
//               />
//             </div>
//           )}

//           {/* Hijab Setting Question */}
//           <div className="border border-gray-700/50 rounded-xl p-6 md:p-8 bg-gray-800/50 shadow-inner shadow-gray-900/30">
//             <h3 className="text-xl font-light text-white mb-3">
//               Any member wants Hijab Setting?
//             </h3>
//             <p className="text-sm text-gray-400 mb-6 font-light">
//               Professional assistance with hijab styling and arrangement ($15
//               per person)
//             </p>

//             <div className="space-y-3">
//               <RadioOption
//                 label="Yes"
//                 value="Yes"
//                 fieldName="nonBridal.hasHijabSetting"
//                 isSelected={hasHijabSetting === "Yes"}
//                 onClick={handleHijabSettingSelect}
//               />
//               <RadioOption
//                 label="No"
//                 value="No"
//                 fieldName="nonBridal.hasHijabSetting"
//                 isSelected={hasHijabSetting === "No"}
//                 onClick={handleHijabSettingSelect}
//               />
//             </div>
//           </div>

//           {/* Hijab Setting Count */}
//           {hasHijabSetting === "Yes" && (
//             <div className="border border-rose-700/50 rounded-xl p-6 md:p-8 bg-gradient-to-br from-rose-900/20 to-pink-900/20 backdrop-blur-sm shadow-inner shadow-rose-900/20">
//               <label className="block text-sm font-light text-white mb-4">
//                 How many members need Hijab Setting?
//               </label>
//               <input
//                 type="number"
//                 min={0}
//                 {...register("nonBridal.hijabSettingCount")}
//                 className="w-full px-4 py-3 bg-neutral-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all text-gray-200 placeholder-gray-500 font-light"
//               />
//             </div>
//           )}
//         </div>

//         {/* Error Message */}
//         {errors.nonBridal?.everyoneBoth && (
//           <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-xl shadow-lg">
//             <p className="text-sm text-red-200 text-center font-light">
//               {errors.nonBridal.everyoneBoth.message}
//             </p>
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="flex justify-between items-center pt-6 sm:pt-8 border-t border-gray-700/50 mt-4 md:mt-6">
//           <button
//             type="button"
//             onClick={onBack}
//             className="group relative px-6 py-3.5 sm:px-10 sm:py-4 text-base sm:text-lg font-light rounded-xl transition-all duration-300 overflow-hidden bg-gray-700/50 text-gray-200 shadow-lg shadow-gray-900/50 hover:bg-gray-700/80 hover:scale-[1.03] active:scale-100 cursor-pointer border border-gray-600/30"
//             style={{ letterSpacing: "0.05em" }}
//           >
//             <span className="relative">← Back</span>
//           </button>

//           <button
//             type="button"
//             onClick={handleNext}
//             className="relative px-10 sm:px-12 py-3.5 sm:py-4 text-base sm:text-lg font-light rounded-xl transition-all duration-300 overflow-hidden bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 text-white shadow-lg shadow-rose-500/30 hover:shadow-2xl hover:shadow-rose-500/40 hover:scale-105 active:scale-100 cursor-pointer border border-rose-400/30"
//             style={{ letterSpacing: "0.05em" }}
//           >
//             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-out"></div>
//             <span className="relative flex items-center justify-center gap-2.5">
//               Continue →
//             </span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
