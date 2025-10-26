import React from "react";

const ServiceAddress = ({ onNext, onBack, register, getValues, errors, setValue }) => {
  const isFormComplete =
    getValues("venue_name") &&
    getValues("venue_address") &&
    getValues("venue_city") &&
    getValues("venue_province") &&
    getValues("venue_postal") &&
    getValues("onsite_contact") &&
    getValues("onsite_phone");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 p-8 md:p-10 relative overflow-hidden">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 pointer-events-none rounded-2xl"></div>

        {/* Header */}
        <h2 className="text-3xl font-semibold text-white mb-8 text-center tracking-wide">
          Service Address & Details
        </h2>

        {/* Form */}
        <div className="space-y-6 relative z-10">
          {/* Venue Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Venue Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              {...register("venue_name", { required: "Venue name is required" })}
              placeholder="e.g., Fairmont Pacific Rim, Private Residence"
              className="w-full bg-gray-900/50 text-gray-100 px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400 transition-colors"
            />
            {errors.venue_name && (
              <p className="mt-1 text-sm text-red-400">{errors.venue_name.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Street Address <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              {...register("venue_address", { required: "Street address is required" })}
              placeholder="123 Main Street"
              className="w-full bg-gray-900/50 text-gray-100 px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400 transition-colors"
            />
            {errors.venue_address && (
              <p className="mt-1 text-sm text-red-400">{errors.venue_address.message}</p>
            )}
          </div>

          {/* City + Province */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                City <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                {...register("venue_city", { required: "City is required" })}
                placeholder="Vancouver"
                className="w-full bg-gray-900/50 text-gray-100 px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400 transition-colors"
              />
              {errors.venue_city && (
                <p className="mt-1 text-sm text-red-400">{errors.venue_city.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Province <span className="text-red-400">*</span>
              </label>
              <select
                {...register("venue_province", { required: "Province is required" })}
                className="w-full bg-gray-900/50 text-gray-100 px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              >
                <option value="">Select Province</option>
                <option value="BC">British Columbia</option>
                <option value="AB">Alberta</option>
                <option value="ON">Ontario</option>
                <option value="QC">Quebec</option>
              </select>
              {errors.venue_province && (
                <p className="mt-1 text-sm text-red-400">{errors.venue_province.message}</p>
              )}
            </div>
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Postal Code <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              maxLength="7"
              {...register("venue_postal", {
                required: "Postal code is required",
                pattern: {
                  value: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
                  message: "Invalid postal code format. Must be A1A 1A1",
                },
              })}
              placeholder="V6Z 1A1"
              onChange={(e) => {
                let value = e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
                if (value.length === 6) value = value.slice(0, 3) + " " + value.slice(3);
                setValue("venue_postal", value);
              }}
              className="w-full bg-gray-900/50 text-gray-100 px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400 transition-colors"
            />
            {errors.venue_postal && (
              <p className="mt-1 text-sm text-red-400">{errors.venue_postal.message}</p>
            )}
          </div>

          {/* On-site Contact */}
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              On-site Contact Person <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              {...register("onsite_contact", { required: "On-site contact is required" })}
              placeholder="Name of person we'll meet at venue"
              className="w-full bg-gray-900/50 text-gray-100 px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400 transition-colors"
            />
            {errors.onsite_contact && (
              <p className="mt-1 text-sm text-red-400">{errors.onsite_contact.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Contact Phone Number <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              {...register("onsite_phone", { required: "Contact phone number is required" })}
              placeholder="(604) 123-4567"
              className="w-full bg-gray-900/50 text-gray-100 px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400 transition-colors"
            />
            {errors.onsite_phone && (
              <p className="mt-1 text-sm text-red-400">{errors.onsite_phone.message}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Special Instructions or Notes
            </label>
            <textarea
              {...register("special_instructions")}
              placeholder="Any special parking instructions, access codes, or other details..."
              rows={4}
              className="w-full bg-gray-900/50 text-gray-100 px-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-400 transition-colors"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center mt-10 relative z-10">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-600 text-gray-200 rounded-lg font-medium hover:bg-gray-800 transition-all duration-300"
          >
            ← Back to Date & Time
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={!isFormComplete}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              isFormComplete
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02]"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            Continue to Contract →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceAddress;
