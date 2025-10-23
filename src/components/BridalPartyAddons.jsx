import React from "react";

export default function BridalPartyAddons({
  register,
  watch,
  errors,
  onNext,
  onBack,
  setValue,
}) {
  const watchedFields = watch();
  const dupattas = watchedFields.party_dupatta_count
    ? parseInt(watchedFields.party_dupatta_count)
    : "";
  const extensions = watchedFields.party_extensions_count
    ? parseInt(watchedFields.party_extensions_count)
    : "";
  const airbrush = watchedFields.airbrush_count
    ? parseInt(watchedFields.airbrush_count)
    : "";

  const bothCount = watchedFields.party_both_count
    ? parseInt(watchedFields.party_both_count)
    : 0;
  const makeupCount = watchedFields.party_makeup_count
    ? parseInt(watchedFields.party_makeup_count)
    : 0;
  const hairCount = watchedFields.party_hair_count
    ? parseInt(watchedFields.party_hair_count)
    : 0;

  const totalPartyMembers = bothCount + makeupCount + hairCount;
  const hasHairServices = bothCount > 0 || hairCount > 0;
  const hasMakeupServices = bothCount > 0 || makeupCount > 0;

  const handleCountChange = (field, value) => {
    const newValue = value === "" ? "" : parseInt(value) || "";
    setValue(`party_${field}_count`, newValue);
  };

  const isNextEnabled = true;

  const StyledSelect = ({ name, onChange, count, max }) => (
    <select
      {...register(name)}
      onChange={onChange}
      value={count}
      className="px-4 py-2 md:px-5 md:py-3 border border-gray-300 rounded-xl 
                 transition-all duration-200 focus:ring-2 focus:ring-gray-500/40 
                 focus:border-gray-500 bg-gray-100 text-gray-800 
                 text-sm md:text-base lg:text-lg font-medium cursor-pointer"
    >
      {Array.from({ length: Math.max(max + 1, 11) }, (_, i) => (
        <option key={i} value={i}>
          {i}
        </option>
      ))}
    </select>
  );

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
      <div className="bg-white rounded-2xl p-5 sm:p-8 border border-gray-200 shadow-2xl shadow-gray-400/20">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2
            className="text-2xl sm:text-3xl font-normal text-gray-900 mb-3 tracking-wide"
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "0.02em",
            }}
          >
            Bridal Party Add-ons
          </h2>
          <p className="text-gray-600 text-sm sm:text-base font-light max-w-2xl mx-auto">
            Additional services for your bridal party members.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6 sm:space-y-8 mb-10">
          {/* Dupatta Section */}
          <div className="border border-gray-300 rounded-xl p-5 bg-gray-50 shadow-inner">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Dupatta/Veil Setting
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Professional assistance with dupatta or veil arrangement.
            </p>
            <div className="flex items-center space-x-4">
              <label className="text-sm md:text-base font-medium text-gray-800 min-w-[90px]">
                Quantity:
              </label>
              <StyledSelect
                name="party_dupatta_count"
                onChange={(e) => handleCountChange("dupatta", e.target.value)}
                count={dupattas}
                max={totalPartyMembers}
              />
              {totalPartyMembers > 0 && (
                <span className="text-xs text-gray-600">
                  (Max: {totalPartyMembers})
                </span>
              )}
            </div>
          </div>

          {/* Extensions */}
          {hasHairServices && (
            <div className="border border-gray-300 rounded-xl p-5 bg-gray-50 shadow-inner">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Hair Extensions Installation
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Professional installation of hair extensions.
              </p>
              <p className="text-sm text-gray-700 bg-gray-100 p-2 rounded-lg border border-gray-300 mb-3">
                *Note: Each person must bring their own extensions.
              </p>
              <div className="flex items-center space-x-4">
                <label className="text-sm md:text-base font-medium text-gray-800 min-w-[90px]">
                  Quantity:
                </label>
                <StyledSelect
                  name="party_extensions_count"
                  onChange={(e) =>
                    handleCountChange("extensions", e.target.value)
                  }
                  count={extensions}
                  max={bothCount + hairCount}
                />
                <span className="text-xs text-gray-600">
                  (Max: {bothCount + hairCount})
                </span>
              </div>
            </div>
          )}

          {/* Airbrush */}
          {hasMakeupServices && (
            <div className="border border-gray-300 rounded-xl p-5 bg-gray-50 shadow-inner">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Airbrush Makeup Application
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Professional airbrush makeup application for a flawless finish.
              </p>
              <div className="flex items-center space-x-4">
                <label className="text-sm md:text-base font-medium text-gray-800 min-w-[90px]">
                  Quantity:
                </label>
                <StyledSelect
                  name="airbrush_count"
                  onChange={(e) =>
                    setValue(
                      "airbrush_count",
                      e.target.value === ""
                        ? ""
                        : parseInt(e.target.value) || ""
                    )
                  }
                  count={airbrush}
                  max={bothCount + makeupCount}
                />
                <span className="text-xs text-gray-600">
                  (Max: {bothCount + makeupCount})
                </span>
              </div>
            </div>
          )}

          {/* Empty State */}
          {totalPartyMembers === 0 && (
            <div className="text-center py-6 border border-gray-300 rounded-xl bg-gray-50">
              <p className="text-base text-gray-600 font-medium">
                No bridal party members selected.
              </p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-300 mt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-light rounded-lg 
                       bg-gray-200 text-gray-900 hover:bg-gray-300 border border-gray-400 
                       transition-all duration-300"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!isNextEnabled}
            className={`px-8 sm:px-10 py-2.5 sm:py-3 text-sm sm:text-base font-light rounded-lg 
                        bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white shadow-md 
                        hover:scale-[1.02] border border-gray-600 transition-all duration-300
                        ${
                          !isNextEnabled
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
