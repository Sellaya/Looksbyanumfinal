"use client"
import { useEffect } from "react"

export default function ServiceDetails({ register, watch, errors, onNext, onBack }) {
  const watchedFields = watch()
  const serviceType = watchedFields.service?.type

  const PartyMemberSelector = ({ name, label, price }) => (
    <div
      className="group relative w-full p-3 sm:p-4 rounded-lg border transition-all duration-300 text-left overflow-hidden flex flex-col gap-2 sm:gap-3 
      border-gray-300 bg-white hover:border-gray-500 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-400/10"
    >
      <div className="flex justify-between items-center">
        <h4 className="text-sm sm:text-base font-light text-gray-900">{label}</h4>
        <span className="text-sm sm:text-base text-gray-700 font-light">${price}</span>
      </div>
      <div className="flex items-center gap-3">
        <label className="text-sm font-light text-gray-700">Quantity:</label>
        <select
          {...register(`service.${name}`)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-500 transition-all duration-200 bg-gray-50 hover:bg-gray-100"
        >
          {Array.from({ length: 11 }, (_, i) => (
            <option key={i} value={i}>
              {i} 
            </option>
          ))}
        </select>
      </div>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="text-left mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-normal text-gray-900 mb-1 tracking-wide">
          Service Details<span className="text-gray-400 ml-2">*</span>
        </h2>
        <p className="text-gray-700 text-sm sm:text-base font-light" style={{ letterSpacing: "0.01em" }}>
          Select the services you’d like for your special day.
        </p>
      </div>

      {/* Bridal Services */}
      {serviceType === "bridal" && (
        <div className="space-y-3 sm:space-y-4 mb-6">
          <h3 className="text-lg sm:text-xl font-normal text-gray-900 border-b border-gray-200 pb-2">Bridal Services</h3>
          <PartyMemberSelector name="bride_makeup" label="Bride – Makeup Only" price="250" />
          <PartyMemberSelector name="bride_hair_makeup" label="Bride – Hair + Makeup" price="350" />
          <PartyMemberSelector name="bridesmaid_makeup" label="Bridesmaid – Makeup Only" price="100" />
          <PartyMemberSelector name="bridesmaid_hair_makeup" label="Bridesmaid – Hair + Makeup" price="150" />
          <PartyMemberSelector name="mother_makeup" label="Mother – Makeup Only" price="120" />
          <PartyMemberSelector name="mother_hair_makeup" label="Mother – Hair + Makeup" price="180" />
          <PartyMemberSelector name="flower_girl_makeup" label="Flower Girl – Makeup Only" price="75" />
          <PartyMemberSelector name="flower_girl_hair_makeup" label="Flower Girl – Hair + Makeup" price="125" />
        </div>
      )}

      {/* Semi Bridal */}
      {serviceType === "semi_bridal" && (
        <div className="space-y-3 sm:space-y-4 mb-6">
          <h3 className="text-lg sm:text-xl font-normal text-gray-900 border-b border-gray-200 pb-2">Semi Bridal Services</h3>
          <PartyMemberSelector name="semi_bridal_makeup" label="Semi Bridal – Makeup Only" price="200" />
          <PartyMemberSelector name="semi_bridal_hair_makeup" label="Semi Bridal – Hair + Makeup" price="280" />
          <PartyMemberSelector name="party_member_makeup" label="Party Member – Makeup Only" price="100" />
          <PartyMemberSelector name="party_member_hair_makeup" label="Party Member – Hair + Makeup" price="150" />
        </div>
      )}

      {/* Non-Bridal */}
      {serviceType === "non_bridal" && (
        <div className="space-y-3 sm:space-y-4 mb-6">
          <h3 className="text-lg sm:text-xl font-normal text-gray-900 border-b border-gray-200 pb-2">
            Non-Bridal / Photoshoot Services
          </h3>
          <PartyMemberSelector name="photoshoot_makeup" label="Photoshoot – Makeup Only" price="150" />
          <PartyMemberSelector name="photoshoot_hair_makeup" label="Photoshoot – Hair + Makeup" price="220" />
          <PartyMemberSelector name="event_makeup" label="Event – Makeup Only" price="120" />
          <PartyMemberSelector name="event_hair_makeup" label="Event – Hair + Makeup" price="180" />
        </div>
      )}

      {/* Add-ons */}
      <div className="space-y-3 sm:space-y-4 mb-6">
        <h3 className="text-lg sm:text-xl font-normal text-gray-900 border-b border-gray-200 pb-2">Add-ons</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {[
            { id: "airbrush", label: "Airbrush" },
            { id: "extensions", label: "Extensions" },
            { id: "jewelry_setting", label: "Jewelry Setting" },
          ].map((addon) => (
            <div
              key={addon.id}
              className="group relative w-full p-3 sm:p-4 rounded-lg border transition-all duration-300 bg-white 
              border-gray-300 hover:border-gray-500 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-400/10 flex items-center space-x-3"
            >
              <input
                type="checkbox"
                {...register(`service.${addon.id}`)}
                className="w-4 h-4 text-gray-700 border-gray-400 rounded focus:ring-gray-500"
              />
              <label className="text-sm sm:text-base font-light text-gray-800">{addon.label}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Trial Services */}
      <div className="space-y-3 sm:space-y-4 mb-8">
        <h3 className="text-lg sm:text-xl font-normal text-gray-900 border-b border-gray-200 pb-2">Trial Services</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {[
            { id: "trial_makeup", label: "Trial – Makeup Only" },
            { id: "trial_hair_makeup", label: "Trial – Hair + Makeup" },
          ].map((trial) => (
            <div
              key={trial.id}
              className="group relative w-full p-3 sm:p-4 rounded-lg border transition-all duration-300 bg-white 
              border-gray-300 hover:border-gray-500 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-400/10 flex items-center space-x-3"
            >
              <input
                type="checkbox"
                {...register(`service.${trial.id}`)}
                className="w-4 h-4 text-gray-700 border-gray-400 rounded focus:ring-gray-500"
              />
              <label className="text-sm sm:text-base font-light text-gray-800">{trial.label}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-8 sm:px-10 py-2.5 sm:py-3 text-sm sm:text-base font-light rounded-lg transition-all duration-300 border border-gray-400 text-gray-700 hover:bg-gray-100 hover:shadow-sm hover:shadow-gray-400/10"
          style={{ letterSpacing: "0.03em" }}
        >
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-8 sm:px-10 py-2.5 sm:py-3 text-sm sm:text-base font-light rounded-lg transition-all duration-300 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white border border-gray-600 shadow-md shadow-gray-700/20 hover:shadow-lg hover:shadow-gray-700/30 hover:scale-[1.02] active:scale-100"
          style={{ letterSpacing: "0.05em" }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
