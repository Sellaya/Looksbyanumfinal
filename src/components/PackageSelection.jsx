;("use client")

export default function PackageSelection({ register, watch, errors, onNext, onBack, setValue }) {
  const watchedFields = watch()
  const selectedPackage = watchedFields.package?.type
  const serviceType = watchedFields.service_type

  // Get services to determine availability and pricing
  const brideService = watchedFields.bride?.service
  const bothCount = Number.parseInt(watchedFields.party?.both) || 0
  const makeupCount = Number.parseInt(watchedFields.party?.makeup) || 0
  const hairCount = Number.parseInt(watchedFields.party?.hair) || 0
  const totalPartyMembers = bothCount + makeupCount + hairCount

  const handlePackageSelect = (packageType) => {
    setValue("package.type", packageType)
  }

  const packages = [
    {
      id: "senior",
      name: "Senior Artist",
      description: "Experienced senior makeup artist",
      bridal: {
        "Both Hair & Makeup": 500,
        "Hair Only": 250,
        "Makeup Only": 300,
      },
      available: true,
    },
    {
      id: "junior",
      name: "Junior Artist",
      description: "Talented junior makeup artist",
      bridal: {
        "Both Hair & Makeup": 360,
        "Hair Only": 130,
        "Makeup Only": 220,
      },
      available: true,
    },
    {
      id: "lead",
      name: "Lead Package",
      description: "Premium lead artist experience",
      bridal: {
        "Both Hair & Makeup": 450,
        "Hair Only": 300,
        "Makeup Only": 399,
      },
      available: serviceType === "Bridal" && totalPartyMembers === 0,
    },
  ]

  const handleNext = () => {
    if (selectedPackage) {
      onNext()
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <div className="bg-white rounded-2xl p-7 sm:p-10 lg:p-14 border border-gray-200 shadow-2xl shadow-gray-400/20">
        <div className="text-center mb-10 sm:mb-14">
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-4 tracking-wide leading-tight"
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "0.02em",
            }}
          >
            Choose Your Package
            <span className="text-gray-400 ml-2 font-normal">*</span>
          </h2>
          <div className="h-0.5 w-20 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 rounded-full mx-auto mb-5 opacity-80"></div>
          <p
            className="text-gray-600 text-base sm:text-lg font-light max-w-2xl mx-auto leading-relaxed"
            style={{ letterSpacing: "0.01em" }}
          >
            Select the artist package that works best for you
          </p>
        </div>

        <div className="space-y-4 mb-12 sm:mb-16">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => pkg.available && handlePackageSelect(pkg.id)}
              className={`border-2 rounded-xl p-6 sm:p-7 transition-all duration-300 ${
                !pkg.available 
                  ? "border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed"
                  : selectedPackage === pkg.id
                    ? "border-gray-700 bg-gray-50 cursor-pointer shadow-lg shadow-gray-400/20"
                    : "border-gray-300 hover:border-gray-500 hover:bg-gray-50 cursor-pointer"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <input
                    type="radio"
                    {...register("package.type", { required: true })}
                    value={pkg.id}
                    disabled={!pkg.available}
                    className="w-5 h-5 text-gray-700 border-gray-400 focus:ring-gray-600 disabled:opacity-50 cursor-pointer"
                  />
                  <div>
                    <h3 className="text-lg sm:text-xl font-light text-gray-900">{pkg.name}</h3>
                    <p className="text-sm text-gray-600 font-light">{pkg.description}</p>
                    {!pkg.available && pkg.id === "lead" && (
                      <p className="text-xs text-red-600 mt-1 font-light">Only available for bride-only bookings</p>
                    )}
                  </div>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  {pkg.available ? (
                    <>
                      <span className="text-lg sm:text-2xl font-light text-gray-900">
                        ${brideService ? pkg.bridal[brideService] : "---"}
                      </span>
                      <p className="text-xs text-gray-600 font-light">For {brideService || "selected service"}</p>
                    </>
                  ) : (
                    <span className="text-lg font-light text-gray-400">NOT AVAILABLE</span>
                  )}
                </div>
              </div>

              {/* Show pricing breakdown for selected package */}
              {selectedPackage === pkg.id && pkg.available && (
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <h4 className="text-sm font-light text-gray-900 mb-3">Pricing for this package:</h4>
                  <div className="grid grid-cols-1 gap-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span className="font-light">Both Hair & Makeup:</span>
                      <span className="font-light">${pkg.bridal["Both Hair & Makeup"]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-light">Hair Only:</span>
                      <span className="font-light">${pkg.bridal["Hair Only"]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-light">Makeup Only:</span>
                      <span className="font-light">${pkg.bridal["Makeup Only"]}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {errors.package?.type && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg shadow-xl shadow-red-900/20">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-300 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-red-200 text-sm font-light">Please select a package.</p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-6 sm:pt-8 border-t border-gray-300 mt-4 md:mt-6">
          <button
            type="button"
            onClick={onBack}
            className="group relative px-6 py-3.5 sm:px-10 sm:py-4 text-base sm:text-lg font-light rounded-xl transition-all duration-300 overflow-hidden bg-gray-200 text-gray-900 shadow-lg shadow-gray-400/30 hover:bg-gray-300 hover:scale-[1.03] active:scale-100 cursor-pointer border border-gray-400"
            style={{ letterSpacing: "0.05em" }}
          >
            <span className="relative">← Back</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!selectedPackage}
            className={`relative px-10 sm:px-12 py-3.5 sm:py-4 text-base sm:text-lg font-light rounded-xl transition-all duration-300 overflow-hidden ${
              selectedPackage
                ? "bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white shadow-lg shadow-gray-700/30 hover:shadow-2xl hover:shadow-gray-700/40 hover:scale-105 active:scale-100 cursor-pointer border border-gray-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-400"
            }`}
            style={{ letterSpacing: "0.05em" }}
          >
            {selectedPackage && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-out"></div>
            )}
            <span className="relative flex items-center justify-center gap-2.5">Continue →</span>
          </button>
        </div>
      </div>
    </div>
  )
}
