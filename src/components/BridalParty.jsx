"use client"
import React, { useState, useEffect } from "react"

const WARNING_COLOR_CLASS = "amber-300"

export default function BridalParty({
  register,
  watch,
  errors,
  onNext,
  onBack,
  setValue,
  selectedDates,
  bridalPartySelections,
  setBridalPartySelections,
}) {
  const [activeDate, setActiveDate] = useState(selectedDates?.[0] || null)

  // Load the previously saved selections when switching dates
  useEffect(() => {
    if (activeDate && bridalPartySelections[activeDate]) {
      const stored = bridalPartySelections[activeDate]
      Object.entries(stored).forEach(([key, value]) => setValue(key, value))
    }
  }, [activeDate])

  const watchedFields = watch()

  // Helper: update current date's selections into global state
  const saveCurrentSelections = () => {
    setBridalPartySelections((prev) => ({
      ...prev,
      [activeDate]: { ...watchedFields },
    }))
  }

  const handleCountChange = (field, value) => {
    const numValue = value === "" ? "" : Number.parseInt(value) || ""
    setValue(`party_${field}_count`, numValue)
    saveCurrentSelections()
  }

  const RadioOption = ({ label, value, fieldName, isSelected }) => (
    <button
      type="button"
      onClick={() => {
        setValue(fieldName, value)
        saveCurrentSelections()
      }}
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

  // Handle navigation between steps
  const handleNext = () => {
    saveCurrentSelections()
    onNext()
  }

  const handleBack = () => {
    saveCurrentSelections()
    onBack()
  }

  // --- Main Render ---
  const bothCount = Number(watchedFields.party_both_count || 0)
  const makeupCount = Number(watchedFields.party_makeup_count || 0)
  const hairCount = Number(watchedFields.party_hair_count || 0)
  const dupattaCount = Number(watchedFields.party_dupatta_count || 0)
  const extensionsCount = Number(watchedFields.party_extensions_count || 0)
  const sareeDrapingCount = Number(watchedFields.party_saree_draping_count || 0)
  const hijabSettingCount = Number(watchedFields.party_hijab_setting_count || 0)
  const party_airbrush_count = Number(watchedFields.party_airbrush_count || 0)
  const totalPartyMembers = bothCount + makeupCount + hairCount
  const hasAirbrush = watchedFields.has_party_airbrush === "Yes"

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="sm:p-8 text-left">
        <div className="text-left mb-4 sm:mb-5">
          <h2 className="text-2xl sm:text-3xl font-normal text-gray-900 mb-1 sm:mb-3 tracking-wide">
            Bridal Party Services
          </h2>
          <p className="text-gray-700 text-sm sm:text-base font-light max-w-2xl mx-auto">
            Select bridal party services for each day.
          </p>
        </div>

        {/* Date Chips */}
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
              {new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })}
              {bridalPartySelections[date] && <span className="ml-2 opacity-75">✓</span>}
            </button>
          ))}
        </div>

        {/* Radio + Service Cards */}
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

        {watchedFields.has_party_members === "Yes" && (
          <div className="space-y-2">
            <SectionCard
              title="Both Hair & Makeup"
              subtitle="Complete styling package (excluding bride)."
              field="both"
              value={bothCount}
            />
            <SectionCard title="Makeup Only" field="makeup" value={makeupCount} />
            <SectionCard title="Hair Only" field="hair" value={hairCount} />
            <SectionCard title="Dupatta/Veil Setting" field="dupatta" value={dupattaCount} max={totalPartyMembers} />
            <SectionCard
              title="Hair Extensions Installation"
              field="extensions"
              value={extensionsCount}
              max={bothCount + hairCount}
              warning="*Note: Each person must have their own extensions."
            />
            <SectionCard title="Saree Draping" field="saree_draping" value={sareeDrapingCount} max={totalPartyMembers} />
            <SectionCard title="Hijab Setting" field="hijab_setting" value={hijabSettingCount} max={totalPartyMembers} />

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
                field="airbrush"
                value={party_airbrush_count}
                max={bothCount + makeupCount}
              />
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between gap-5 pt-6 sm:pt-8 border-t border-gray-200">
          <button
            onClick={handleBack}
            className="group relative px-5 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-light rounded-lg bg-gray-200 text-gray-900 hover:bg-gray-300 border border-gray-400 transition-all duration-300"
          >
            Back
          </button>

          <button
            onClick={handleNext}
            className="relative px-8 sm:px-10 py-2.5 sm:py-3 text-sm sm:text-base font-light rounded-lg bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white shadow-md hover:scale-[1.02] border border-gray-600 transition-all duration-300"
          >
            Continue
          </button>
        </div>

        <div className="mt-8 flex justify-center">
          <p className="inline-block">Want to start Over?</p>
          <a href="/" className="pl-2 text-blue-700">Go to First Step</a>
        </div>
      </div>
    </div>
  )
}
