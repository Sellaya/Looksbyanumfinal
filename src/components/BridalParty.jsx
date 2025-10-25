"use client"
import React from "react"

const WARNING_COLOR_CLASS = "amber-300"

export default function BridalParty({ register, watch, errors, onNext, onBack, setValue }) {
  const watchedFields = watch()
  const bothCount = Number(watchedFields.party_both_count || 0)
  const makeupCount = Number(watchedFields.party_makeup_count || 0)
  const hairCount = Number(watchedFields.party_hair_count || 0)
  const dupattaCount = Number(watchedFields.party_dupatta_count || 0)
  const extensionsCount = Number(watchedFields.party_extensions_count || 0)
  const sareeDrapingCount = Number(watchedFields.party_saree_draping_count || 0)
  const hijabSettingCount = Number(watchedFields.party_hijab_setting_count || 0)
  const airbrushCount = Number(watchedFields.airbrush_count || 0)
  const hasAirbrush = watchedFields.has_party_airbrush === "Yes"

  const totalPartyMembers = bothCount + makeupCount + hairCount
  const party_airbrush_count = Number(watchedFields.party_airbrush_count || 0)


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
            className={`text-xs sm:text-xs text text-gray-400 font-light mt-1 rounded border border-${WARNING_COLOR_CLASS}/50 bg-${WARNING_COLOR_CLASS}/20 px-2 py-1`}
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
            Bridal Party Services
          </h2>
          <p className="text-gray-700 text-sm sm:text-base font-light max-w-2xl mx-auto">
            Aside from the bride, are there other members requiring hair and/or makeup services?
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
              subtitle="Complete styling package. This does not include the bride."
              field="both"
              value={bothCount}
            />
            <SectionCard
              title="Makeup Only"
              subtitle="These people do not need hair done. This does not include the bride."
              field="makeup"
              value={makeupCount}
            />
            <SectionCard
              title="Hair Only"
              subtitle="These people do not need makeup done. This does not include the bride."
              field="hair"
              value={hairCount}
            />
            <SectionCard
              title="Dupatta/Veil Setting"
              subtitle="Professional assistance with dupatta or veil arrangement."
              field="dupatta"
              value={dupattaCount}
              max={totalPartyMembers}
            />
            <SectionCard
              title="Hair Extensions Installation"
              subtitle="Professional installation of hair extensions."
              field="extensions"
              value={extensionsCount}
              max={bothCount + hairCount}
              warning="*Note: We do not provide the hair extensions. Each person must have their own."
            />
            <SectionCard
              title="Saree Draping"
              subtitle="Traditional technique creating beautiful draping effect for dupatta or veil."
              field="saree_draping" // ✅ fixed
              value={sareeDrapingCount}
              max={totalPartyMembers}
            />
            <SectionCard
              title="Hijab Setting"
              subtitle="Professional assistance with hijab styling and arrangement."
              field="hijab_setting" // ✅ fixed
              value={hijabSettingCount}
              max={totalPartyMembers}
            />

            {/* Airbrush Radio */}
            <div className="flex flex-row justify-around space-x-4 mt-4 mb-5">
              <RadioOption
                label="Airbrush: Yes"
                value="Yes"
                fieldName="has_party_airbrush"
                isSelected={hasAirbrush}
              />
              <RadioOption
                label="Airbrush: No"
                value="No"
                fieldName="has_party_airbrush"
                isSelected={!hasAirbrush}
              />
            </div>

            {hasAirbrush && (
              <SectionCard
                title="Airbrush Makeup Application"
                subtitle="Professional airbrush makeup application for a flawless finish."
                field="airbrush"
                value={party_airbrush_count}
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
