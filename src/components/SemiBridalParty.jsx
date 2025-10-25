"use client"
import React from "react"

const WARNING_COLOR_CLASS = "amber-300"

export default function SemiBridalParty({ register, watch, errors, onNext, onBack, setValue }) {
  const watchedFields = watch()

  const hairCount = Number(watchedFields.party_hair_count || 0)
  const makeupCount = Number(watchedFields.party_makeup_count || 0)
  const bothCount = Number(watchedFields.party_both_count || 0)
  const dupattaCount = Number(watchedFields.party_dupatta_count || 0)
  const extensionsCount = Number(watchedFields.party_extensions_count || 0)
  const sareeDrapingCount = Number(watchedFields.party_saree_draping_count || 0)
  const hijabSettingCount = Number(watchedFields.party_hijab_setting_count || 0)
  const airbrushCount = Number(watchedFields.airbrush_count || 0)
  const hasAirbrush = watchedFields.has_airbrush === "Yes"

  const totalPartyMembers = hairCount + makeupCount + bothCount
  const totalHairCount = hairCount + bothCount
  const maxExtensions = totalHairCount

  const handleCountChange = (field, value) => {
    const numValue = value === "" ? "" : Number.parseInt(value) || ""
    setValue(`party_${field}_count`, numValue)

    const total =
      (field === "both" ? numValue : bothCount) +
      (field === "makeup" ? numValue : makeupCount) +
      (field === "hair" ? numValue : hairCount)
    if (total > 0) setValue("has_party_members", "Yes")
  }

  const RadioOption = ({ label, value, fieldName, isSelected }) => (
    <button
      type="button"
      onClick={() => setValue(fieldName, value)}
      className={`group relative w-full flex items-center justify-between p-3 sm:p-3.5 rounded-lg border transition-all duration-300 cursor-pointer overflow-hidden ${
        isSelected
          ? "border-gray-700 bg-gray-100 shadow-md shadow-gray-400/20"
          : "border-gray-300 bg-white hover:border-gray-500 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-400/10"
      }`}
    >
      <span className="font-light text-gray-800 text-sm sm:text-base">{label}</span>
      <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center transition-all duration-300">
        {isSelected && <div className="w-3 h-3 rounded-full bg-gray-700"></div>}
      </div>
    </button>
  )

  const SectionCard = ({ title, subtitle, field, value, max, warning }) => (
    <div className="group relative w-full flex items-center justify-between p-3 sm:p-3.5 rounded-lg border transition-all duration-300 cursor-pointer overflow-hidden border-gray-300 bg-white hover:border-gray-500 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-400/10">
      <div className="flex-1 pr-3">
        <h3 className="text-base font-light text-gray-800">{title}</h3>
        {subtitle && <p className="text-xs sm:text-sm font-light text-gray-600 leading-snug">{subtitle}</p>}
        {warning && (
          <p
            className={`text-xs text-gray-400 font-light mt-1 rounded border border-${WARNING_COLOR_CLASS}/50 bg-${WARNING_COLOR_CLASS}/20 px-2 py-1`}
          >
            {warning}
          </p>
        )}
      </div>
      <div className="ml-2 w-20 sm:w-24">
        <input
          type="number"
          value={value === 0 ? "" : value}
          min="0"
          max={max}
          onChange={(e) => handleCountChange(field, e.target.value)}
          className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-gray-800 font-light text-sm"
        />
      </div>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="sm:p-8 text-left">
        {/* Header Section */}
        <div className="text-left mb-4 sm:mb-5">
          <h2 className="text-2xl sm:text-3xl font-normal text-gray-900 mb-1 sm:mb-3 tracking-wide">
            Semi Bridal Party Services
          </h2>
          <p className="text-gray-700 text-sm sm:text-base font-light max-w-2xl mx-auto">
            Aside from the semi bride, are there other members requiring hair and/or makeup services?
          </p>
        </div>

        {/* Radio Question */}
        <div className="flex flex-row space-x-3 mb-4">
          <RadioOption
            label="Yes"
            value="Yes"
            fieldName="has_party_members"
            isSelected={watchedFields.has_party_members === "Yes"}
          />
          <RadioOption
            label="No"
            value="No"
            fieldName="has_party_members"
            isSelected={watchedFields.has_party_members === "No"}
          />
        </div>

        {/* Service List */}
        {watchedFields.has_party_members === "Yes" && (
          <div className="space-y-2">
            <div className="mb-3 text-left">
              <p className="text-gray-700 text-sm sm:text-base font-light">
                Select quantity for each service
              </p>
            </div>

            <SectionCard
              title="Both Hair & Makeup"
              subtitle="Complete semi-bridal styling package. This does not include the bride."
              field="both"
              value={bothCount}
              max={20}
            />
            <SectionCard
              title="Makeup Only"
              subtitle="Professional makeup application for party members. This does not include the bride."
              field="makeup"
              value={makeupCount}
              max={20}
            />
            <SectionCard
              title="Hair Only"
              subtitle="Professional hair styling for party members. This does not include the bride."
              field="hair"
              value={hairCount}
              max={20}
            />
            <SectionCard
              title="Dupatta/Veil Setting"
              subtitle="Assistance with dupatta or veil styling."
              field="dupatta"
              value={dupattaCount}
              max={totalPartyMembers}
            />
            <SectionCard
              title="Hair Extensions Installation"
              subtitle="Professional installation for those with their own extensions."
              field="extensions"
              value={extensionsCount}
              max={maxExtensions}
              warning="*Note: Extensions must be provided by each member."
            />
            <SectionCard
              title="Saree Draping"
              subtitle="Elegant draping for dupatta or veil."
              field="saree_draping"
              value={sareeDrapingCount}
              max={totalPartyMembers}
            />
            <SectionCard
              title="Hijab Setting"
              subtitle="Professional hijab styling and arrangement."
              field="hijab_setting"
              value={hijabSettingCount}
              max={totalPartyMembers}
            />

            {/* Airbrush Radio */}
            <div className="flex flex-row justify-around space-x-4 mt-4 mb-5">
              <RadioOption
                label="Airbrush: Yes"
                value="Yes"
                fieldName="has_airbrush"
                isSelected={hasAirbrush}
              />
              <RadioOption
                label="Airbrush: No"
                value="No"
                fieldName="has_airbrush"
                isSelected={!hasAirbrush}
              />
            </div>

            {hasAirbrush && (
              <SectionCard
                title="Airbrush Makeup"
                subtitle="Professional airbrush makeup for a flawless finish."
                field="airbrush"
                value={airbrushCount}
                max={bothCount + makeupCount}
              />
            )}
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
            onClick={onNext}
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



// import React from "react";

// export default function SemiBridalParty({
//   register,
//   watch,
//   errors,
//   onNext,
//   onBack,
//   setValue,
// }) {
//   const watchedFields = watch();
//   const hairCount = watchedFields.party_hair_count
//     ? parseInt(watchedFields.party_hair_count)
//     : "";
//   const makeupCount = watchedFields.party_makeup_count
//     ? parseInt(watchedFields.party_makeup_count)
//     : "";
//   const bothCount = watchedFields.party_both_count
//     ? parseInt(watchedFields.party_both_count)
//     : "";

//   const dupattaCount = watchedFields.party_dupatta_count
//     ? parseInt(watchedFields.party_dupatta_count)
//     : "";
//   const extensionsCount = watchedFields.party_extensions_count
//     ? parseInt(watchedFields.party_extensions_count)
//     : "";
//   const airbrushCount = watchedFields.airbrush_count
//     ? parseInt(watchedFields.airbrush_count)
//     : "";

//   const totalHairCount = (hairCount || 0) + (bothCount || 0);
//   const totalPartyMembers =
//     (hairCount || 0) + (makeupCount || 0) + (bothCount || 0);
//   const maxExtensions = totalHairCount;

//   const handleCountChange = (field, value) => {
//     const newValue = value === "" ? "" : parseInt(value) || "";
//     setValue(`party_${field}_count`, newValue);

//     const currentBoth =
//       field === "both"
//         ? newValue
//         : watchedFields.party_both_count
//         ? parseInt(watchedFields.party_both_count)
//         : 0;
//     const currentMakeup =
//       field === "makeup"
//         ? newValue
//         : watchedFields.party_makeup_count
//         ? parseInt(watchedFields.party_makeup_count)
//         : 0;
//     const currentHair =
//       field === "hair"
//         ? newValue
//         : watchedFields.party_hair_count
//         ? parseInt(watchedFields.party_hair_count)
//         : 0;

//     const totalParty = currentBoth + currentMakeup + currentHair;
//     if (totalParty > 0) {
//       setValue("has_party_members", "Yes");
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
//       <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-7 sm:p-10 lg:p-14 border border-gray-700/50 shadow-2xl shadow-gray-900/50">
//         <div className="mb-10 sm:mb-14 text-left">
//           <h2
//             className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-4 tracking-wide leading-tight"
//             style={{
//               fontFamily: "system-ui, -apple-system, sans-serif",
//               letterSpacing: "0.02em",
//             }}
//           >
//             Semi Bridal Party Services
//           </h2>
//           <p
//             className="text-gray-300 text-base sm:text-lg font-light max-w-2xl leading-relaxed"
//             style={{ letterSpacing: "0.01em" }}
//           >
//             Aside from the bride, are there other bridal party members also
//             requiring hair and/or makeup services?
//           </p>
//         </div>

//         <div className="mb-10 sm:mb-14">
//           <p
//             className="text-base sm:text-lg font-light text-white mb-4"
//             style={{ letterSpacing: "0.01em" }}
//           >
//             Aside from the bride, are there other bridal party members also
//             requiring hair and/or makeup services?
//           </p>
//           <div className="flex space-x-6">
//             <label className="flex items-center cursor-pointer text-gray-300 hover:text-rose-400 transition-colors duration-300">
//               <input
//                 type="radio"
//                 value="Yes"
//                 {...register("has_party_members")}
//                 className="mr-3 w-5 h-5 rounded border-gray-600 bg-gray-700 focus:ring-rose-400 cursor-pointer"
//               />
//               Yes
//             </label>
//             <label className="flex items-center cursor-pointer text-gray-300 hover:text-rose-400 transition-colors duration-300">
//               <input
//                 type="radio"
//                 value="No"
//                 {...register("has_party_members")}
//                 className="mr-3 w-5 h-5 rounded border-gray-600 bg-gray-700 focus:ring-rose-400 cursor-pointer"
//               />
//               No
//             </label>
//           </div>
//         </div>

//         {watchedFields.has_party_members === "Yes" && (
//           <div className="space-y-8 mb-14">
//             {[
//               {
//                 title: "Need Both Hair & Makeup",
//                 desc: "Complete styling package. This does not include the bride.",
//                 value: bothCount,
//                 field: "both",
//               },
//               {
//                 title: "Need Makeup Only",
//                 desc: "These people do not need hair done. This does not include the bride.",
//                 value: makeupCount,
//                 field: "makeup",
//               },
//               {
//                 title: "Need Hair Only",
//                 desc: "These people do not need makeup done. This does not include the bride.",
//                 value: hairCount,
//                 field: "hair",
//               },
//               {
//                 title: "Dupatta/Veil Setting",
//                 desc: "Professional assistance with dupatta or veil arrangement.",
//                 value: dupattaCount,
//                 field: "dupatta",
//                 maxVal: totalPartyMembers,
//                 isManualSetValue: true,
//               },
//               {
//                 title: "Hair Extensions Installation",
//                 desc: "Professional installation of hair extensions.",
//                 note: "Note: We do not provide the hair extensions. Each person must have their own.",
//                 value: extensionsCount,
//                 field: "extensions",
//                 maxVal: maxExtensions,
//                 isManualSetValue: true,
//                 warning: true,
//               },
//             ].map(
//               ({
//                 title,
//                 desc,
//                 value,
//                 field,
//                 maxVal,
//                 isManualSetValue,
//                 note,
//               }) => (
//                 <div
//                   key={field}
//                   className="border border-gray-700/50 rounded-2xl p-7 sm:p-8 bg-gradient-to-br from-rose-500/10 via-pink-500/10 to-fuchsia-500/10 shadow-inner"
//                 >
//                   <h3 className="text-xl sm:text-2xl font-light text-white mb-2">
//                     {title}
//                   </h3>
//                   <p className="text-gray-300 text-base font-light mb-4">
//                     {desc}
//                   </p>
//                   {note && (
//                     <p className="text-rose-300 font-medium p-3 bg-rose-900/10 rounded-lg border border-rose-700 mb-4">
//                       {note}
//                     </p>
//                   )}
//                   <div className="flex items-center space-x-6 max-w-[320px]">
//                     <label className="min-w-[100px] text-gray-300 font-light text-base">
//                       Quantity:
//                     </label>
//                     <input
//                       type="number"
//                       value={value}
//                       onChange={(e) => {
//                         const val =
//                           e.target.value === ""
//                             ? ""
//                             : parseInt(e.target.value) || "";
//                         if (isManualSetValue) {
//                           setValue(`party_${field}_count`, val);
//                         } else {
//                           handleCountChange(field, e.target.value);
//                         }
//                       }}
//                       min="0"
//                       max={maxVal}
//                       className="w-full max-w-[100px] px-5 py-3 rounded-2xl bg-transparent border border-gray-600 text-white placeholder-gray-500 font-light text-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition"
//                       placeholder="0"
//                     />
//                   </div>
//                 </div>
//               )
//             )}

//             <div className="border border-gray-700/50 rounded-2xl p-7 sm:p-8 bg-gradient-to-br from-rose-500/10 via-pink-500/10 to-fuchsia-500/10 shadow-inner">
//               <p className="text-white text-lg font-light mb-6">
//                 Do any bridal party members need airbrush makeup?
//               </p>
//               <div className="flex space-x-6">
//                 {["Yes", "No"].map((val) => (
//                   <label
//                     key={val}
//                     className="flex items-center cursor-pointer text-gray-300 hover:text-rose-400 transition-colors duration-300"
//                   >
//                     <input
//                       type="radio"
//                       value={val}
//                       {...register("has_airbrush")}
//                       className="mr-3 w-5 h-5 rounded border-gray-600 bg-gray-700 focus:ring-rose-400 cursor-pointer"
//                     />
//                     {val}
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {watchedFields.has_airbrush === "Yes" && (
//               <div className="border border-gray-700/50 rounded-2xl p-7 sm:p-8 bg-gradient-to-br from-rose-500/10 via-pink-500/10 to-fuchsia-500/10 shadow-inner">
//                 <h3 className="text-xl sm:text-2xl font-light text-white mb-2">
//                   Airbrush Makeup Application
//                 </h3>
//                 <p className="text-gray-300 text-base font-light mb-4">
//                   Professional airbrush makeup application for a flawless
//                   finish.
//                 </p>
//                 <div className="flex items-center space-x-6 max-w-[320px]">
//                   <label className="min-w-[100px] text-gray-300 font-light text-base">
//                     Quantity:
//                   </label>
//                   <input
//                     type="number"
//                     value={airbrushCount}
//                     onChange={(e) =>
//                       setValue(
//                         "airbrush_count",
//                         e.target.value === ""
//                           ? ""
//                           : parseInt(e.target.value) || ""
//                       )
//                     }
//                     min="0"
//                     max={bothCount + makeupCount}
//                     className="w-full max-w-[100px] px-5 py-3 rounded-2xl bg-transparent border border-gray-600 text-white placeholder-gray-500 font-light text-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition"
//                     placeholder="0"
//                   />
//                 </div>
//               </div>
//             )}

//             {totalPartyMembers > 0 && (
//               <div className="pt-6 border-t border-gray-700/50">
//                 <h4 className="text-lg font-light text-white mb-4">
//                   Bridal Party Summary:
//                 </h4>
//                 <p className="text-white font-light text-base mb-4">
//                   Total Members:{" "}
//                   <span className="text-rose-400 font-semibold">
//                     {totalPartyMembers}
//                   </span>
//                 </p>
//                 <ul className="text-gray-400 list-disc ml-6 space-y-1 mb-6">
//                   {bothCount > 0 && (
//                     <li>{bothCount} member(s) - Both Hair & Makeup</li>
//                   )}
//                   {makeupCount > 0 && (
//                     <li>{makeupCount} member(s) - Makeup Only</li>
//                   )}
//                   {hairCount > 0 && <li>{hairCount} member(s) - Hair Only</li>}
//                 </ul>
//                 {(dupattaCount > 0 ||
//                   extensionsCount > 0 ||
//                   airbrushCount > 0) && (
//                   <>
//                     <h4 className="text-lg font-light text-white mb-4">
//                       Add-ons Summary:
//                     </h4>
//                     <ul className="text-gray-400 list-disc ml-6 space-y-1">
//                       {dupattaCount > 0 && (
//                         <li>{dupattaCount} dupatta/veil setting(s)</li>
//                       )}
//                       {extensionsCount > 0 && (
//                         <li>
//                           {extensionsCount} hair extension installation(s)
//                         </li>
//                       )}
//                       {airbrushCount > 0 && (
//                         <li>{airbrushCount} airbrush makeup application(s)</li>
//                       )}
//                     </ul>
//                   </>
//                 )}
//               </div>
//             )}
//           </div>
//         )}

//         <div className="flex justify-between items-center pt-6 border-t border-gray-700/50 mt-6">
//           <button
//             type="button"
//             onClick={onBack}
//             className="relative px-10 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 text-white font-light text-lg shadow-lg shadow-rose-500/30 hover:shadow-2xl hover:shadow-rose-500/40 hover:scale-[1.05] transition-transform duration-300 cursor-pointer border border-rose-400/30 overflow-hidden"
//             style={{ letterSpacing: "0.05em" }}
//           >
//             Back
//           </button>
//           <button
//             type="button"
//             onClick={onNext}
//             className="relative px-10 py-4 rounded-2xl font-light text-lg shadow-lg transition-transform duration-300 overflow-hidden border bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 text-white shadow-rose-500/30 hover:shadow-2xl hover:shadow-rose-500/40 hover:scale-[1.05] cursor-pointer border-rose-400/30"
//             style={{ letterSpacing: "0.05em" }}
//           >
//             Continue
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
