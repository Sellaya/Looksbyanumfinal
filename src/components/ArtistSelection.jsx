import React from "react";

const ArtistSelection = ({
  onNext,
  onBack,
  getValues,
  setValue,
  selectedArtist,
  setSelectedArtist, 
  calculatePrice,
}) => {
  return (
    <div className="max-w-sm md:max-w-2xl mx-auto p-4 md:p-8 glass-card bg-gray-50/80 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-left">
        Choose Your Artist
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Lead Artist Card */}
        <div
          className={`border-2 rounded-xl p-6 transition-all cursor-pointer relative group ${
            selectedArtist === "Lead"
              ? "border-gray-900 bg-gray-900 text-gray-50 shadow-xl"
              : "border-gray-300 hover:border-gray-800 hover:shadow-md bg-white"
          }`}
          onClick={() => {
            const formData = getValues();
            const price = calculatePrice(formData, "Lead");
            setSelectedArtist("Lead");
            setValue("artist", "Lead");
            setValue("price", price);
          }}
        >
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900/10 to-gray-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

          <div className="relative z-10">
            <h3
              className={`text-xl font-semibold mb-3 ${
                selectedArtist === "Lead" ? "text-gray-50" : "text-gray-900"
              }`}
            >
              Anum's Quote
            </h3>
            <div
              className={`text-sm mb-4 ${
                selectedArtist === "Lead" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Premium service by Anum herself
            </div>
            <div
              className={`text-lg font-semibold ${
                selectedArtist === "Lead" ? "text-white" : "text-gray-800"
              }`}
            >
              ${calculatePrice(getValues(), "Lead")} CAD
            </div>

            {selectedArtist === "Lead" && (
              <div className="mt-3 text-sm text-green-400 font-medium">
                ✓ Selected
              </div>
            )}
          </div>
        </div>

        {/* Team Artist Card */}
        <div
          className={`border-2 rounded-xl p-6 transition-all cursor-pointer relative group ${
            selectedArtist === "Team"
              ? "border-gray-900 bg-gray-900 text-gray-50 shadow-xl"
              : "border-gray-300 hover:border-gray-800 hover:shadow-md bg-white"
          }`}
          onClick={() => {
            const formData = getValues();
            const price = calculatePrice(formData, "Team");
            setSelectedArtist("Team");
            setValue("artist", "Team");
            setValue("price", price);
          }}
        >
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900/10 to-gray-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

          <div className="relative z-10">
            <h3
              className={`text-xl font-semibold mb-3 ${
                selectedArtist === "Team" ? "text-gray-50" : "text-gray-900"
              }`}
            >
              Team Quote
            </h3>
            <div
              className={`text-sm mb-4 ${
                selectedArtist === "Team" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Professional service by Anum's expert team
            </div>
            <div
              className={`text-lg font-semibold ${
                selectedArtist === "Team" ? "text-white" : "text-gray-800"
              }`}
            >
              ${calculatePrice(getValues(), "Team")} CAD
            </div>

            {selectedArtist === "Team" && (
              <div className="mt-3 text-sm text-green-400 font-medium">
                ✓ Selected
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!selectedArtist}
          className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
            selectedArtist
              ? "bg-gray-900 text-white hover:bg-gray-800 focus:ring-4 focus:ring-gray-300"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ArtistSelection;
