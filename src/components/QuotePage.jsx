import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getDynamicPackages, calculateBookingPrice } from "../lib/pricing";
import { formatCurrency } from "../../lib/currencyFormat";
import SignatureCanvas from "./SignatureCanvas";
import Logo from "../assets/Black.png";
import BookingHeader from "./BookingHeader";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "https://looksbyanum-saqib.vercel.app/api/",
});

const CustomDatePicker = ({
  label,
  name,
  register,
  error,
  required,
  maxDate,
  minDate: propMinDate, // 👈 allow passing minDate from parent
  value, // 👈 add this
}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState(value || "")
  
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  const dropdownRef = React.useRef(null)

  // ✅ Use today's date if no minDate prop is provided
  const getMinimumDate = () => {
    const now = new Date()
    const offset = now.getTimezoneOffset()
    // Convert to local midnight by removing offset
    const localMidnight = new Date(now.getTime() - offset * 60 * 1000)
    localMidnight.setHours(0, 0, 0, 0)
    return propMinDate ? new Date(propMinDate) : localMidnight
  }


  const minDate = getMinimumDate()
  minDate.setHours(0, 0, 0, 0)

  const formatDisplayDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString + "T00:00:00")
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    return { daysInMonth: lastDay.getDate(), startingDayOfWeek: firstDay.getDay(), year, month }
  }

  const isDateDisabled = (date) => {
    // ✅ allow current day and onwards
    if (date < minDate) return true
    if (maxDate && date > new Date(maxDate)) return true
    return false
  }

  const handleDateSelect = (day, onChange) => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const selectedDateObj = new Date(year, month, day)
    if (isDateDisabled(selectedDateObj)) return

    const formatted = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    setSelectedDate(formatted)
    onChange({ target: { name, value: formatted } })
    setIsOpen(false)
  }

  const handlePrevMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  const handleNextMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth)
  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  const { onChange, ...registerProps } = register(name)

  const calendarDays = []
  for (let i = 0; i < startingDayOfWeek; i++)
    calendarDays.push(<div key={`empty-${i}`} className="p-2" />)

  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day)
    const isDisabled = isDateDisabled(dateObj)
    const isSelected =
      selectedDate === `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`

    calendarDays.push(
      <button
        key={day}
        type="button"
        onClick={() => !isDisabled && handleDateSelect(day, onChange)}
        disabled={isDisabled}
        className={`p-2.5 rounded-md text-sm font-light transition-all duration-200
          ${
            isSelected
              ? "bg-gray-800 text-white border border-gray-600 shadow-sm"
              : isDisabled
              ? "bg-gray-50 text-gray-400 border border-transparent cursor-not-allowed"
              : "bg-gray-200 text-gray-800 hover:bg-gray-600 hover:text-gray-50 border border-transparent"
          }`}
      >
        {day}
      </button>
    )
  }

  React.useEffect(() => {
    if (value) setSelectedDate(value)
  }, [value])

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm sm:text-base font-light text-gray-800 mb-2"
      >
        {label} {required && <span className="text-gray-700">*</span>}
      </label>

      <div className="relative" ref={dropdownRef}>
        <input type="hidden" {...registerProps} onChange={onChange} />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group relative w-full p-3.5 sm:p-4 rounded-lg border border-gray-300 bg-white 
          hover:border-gray-500 hover:bg-gray-50 text-left flex items-center justify-between transition-all duration-300"
        >
          <span className={selectedDate ? "text-gray-800" : "text-gray-400"}>
            {selectedDate ? formatDisplayDate(selectedDate) : "Select date..."}
          </span>
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handlePrevMonth}
                type="button"
                className="p-2.5 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200"
              >
                <svg
                  className="w-4 h-4 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <h3 className="text-gray-800 font-medium text-sm sm:text-base">{monthName}</h3>

              <button
                onClick={handleNextMonth}
                type="button"
                className="p-2.5 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-700 transition-all duration-200"
              >
                <svg
                  className="w-4 h-4 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d} className="text-center text-xs text-gray-500 p-1.5">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">{calendarDays}</div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 bg-gray-50 border border-gray-300 rounded-md">
          <p className="text-sm text-gray-700 font-light">{error}</p>
        </div>
      )}
    </div>
  )
}




// Custom Time Picker (Light + Charcoalish Theme)
const CustomTimePicker = ({ label, name, register, error, required, value }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedTime, setSelectedTime] = React.useState("")
  const dropdownRef = React.useRef(null)

  // Generate times like before
  const generateTimeOptions = () => {
    const times = []
    const periods = ["AM", "PM"]
    periods.forEach((period) => {
      for (let hour = 12; hour <= 12; hour++) {
        times.push({
          label: `${hour}:00 ${period}`,
          value: period === "AM" ? "00:00" : "12:00",
        })
        times.push({
          label: `${hour}:30 ${period}`,
          value: period === "AM" ? "00:30" : "12:30",
        })
      }
      for (let hour = 1; hour <= 11; hour++) {
        const value24 = period === "AM" ? hour : hour + 12
        times.push({
          label: `${hour}:00 ${period}`,
          value: `${String(value24).padStart(2, "0")}:00`,
        })
        times.push({
          label: `${hour}:30 ${period}`,
          value: `${String(value24).padStart(2, "0")}:30`,
        })
      }
    })
    return times
  }

  const timeOptions = generateTimeOptions()
  const { onChange, ...registerProps } = register(name)

  // Convert "13:30" → "1:30 PM"
  const formatTimeLabel = (timeValue) => {
    if (!timeValue) return ""
    const [hourStr, minute] = timeValue.split(":")
    let hour = parseInt(hourStr, 10)
    const period = hour >= 12 ? "PM" : "AM"
    hour = hour % 12 || 12
    return `${hour}:${minute} ${period}`
  }

  // Sync with external value (so it shows correctly when reloading)
  React.useEffect(() => {
    if (value) {
      setSelectedTime(formatTimeLabel(value))
    }
  }, [value])

  const handleTimeSelect = (time, onChange) => {
    setSelectedTime(time.label)
    onChange({ target: { name, value: time.value } })
    setIsOpen(false)
  }

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm sm:text-base font-light text-gray-800 mb-2"
      >
        {label} {required && <span className="text-gray-900">*</span>}
      </label>

      <div className="relative" ref={dropdownRef}>
        <input type="hidden" {...registerProps} onChange={onChange} />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group relative w-full p-3.5 sm:p-4 rounded-lg border border-gray-300 bg-white 
          hover:border-gray-500 hover:bg-gray-50 hover:shadow-sm text-left flex items-center justify-between transition-all duration-300"
        >
          <span className={selectedTime ? "text-gray-800" : "text-gray-400"}>
            {selectedTime || "Select time..."}
          </span>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden">
            <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              {timeOptions.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleTimeSelect(t, onChange)}
                  className="w-full px-4 py-2 text-left text-gray-800 bg-gray-50 hover:bg-gray-400 hover:text-gray-50 border-b border-gray-100 text-sm font-light transition-all"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 bg-gray-50 border border-gray-300 rounded-md">
          <p className="text-sm text-gray-700 font-light">{error}</p>
        </div>
      )}
    </div>
  )
}

// Loading Spinner Component
const LoadingSpinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-gray-800"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

// Upload Icon
const UploadIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
);

// Link Icon
const LinkIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
    />
  </svg>
);

// Calendar Icon
const CalendarIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

// Warning Icon
const WarningIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

// Clock Icon
const ClockIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 1.5" />
  </svg>
);


// Check Icon
const CheckIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);


export default function QuotePage() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [trialDate, setTrialDate] = useState("")
  const [trialTime, setTrialTime] = useState("")
  const [selectedService, setSelectedService] = useState("");
  const [showModal, setShowModal] = useState(false)
  const [step, setStep] = useState("packages")
  const [pricingReady, setPricingReady] = useState(false)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [isBridal, setIsBridal] = useState(false)
  const [selectedArtist, setSelectedArtist] = useState(null)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [selectedPackage, setSelectedPackage] = useState(null)

  // Also update the handleAddressSelect in QuotePage:
  const handleAddressSelect = async (address) => {
    try {
      console.log("Saving address:", address);
      const response = await api.put(`/bookings/${bookingId}/address`, {
        venue_address: address.street,
        venue_city: address.city,
        venue_province: address.province,
        venue_postal: address.postalCode,
        venue_name: "",
        event_date: selectedDate,
      });
      console.log("Address save response:", response.data);

      setSelectedAddress(address);
      setStep("review");
    } catch (error) {
      console.error("Failed to save address:", error);
      // Re-throw the error so AddressSelection can handle it
      throw new Error("Failed to save address. Please try again.");
    }
  };

  const handleArtistSelect = async (artist) => {
    setSelectedArtist(artist);
    setSelectedService("bridal");

    try {
      const pricingBooking = {
        ...booking,
        artist: artist,
        region: booking.region || "Toronto/GTA",
      };

      const pricing = calculateBookingPrice(pricingBooking, artist);
      const subtotal = pricing.subtotal;
      const hst = pricing.hst;
      const total = pricing.total;
      const deposit = pricing.deposit;
      const remaining = Math.round((total - deposit) * 100) / 100;
      const isNonBridal = pricingBooking.service_type === "Non-Bridal";
      const depositPercentage = isNonBridal ? 50 : 30;

      await api.put(`/bookings/${bookingId}/update-pricing`, {
        artist: artist,
        pricing: {
          quote_total: total,
          deposit_amount: deposit,
          deposit_percentage: depositPercentage,
          remaining_amount: remaining,
          subtotal: subtotal,
          hst: hst,
        },
      });

      console.log("Updated pricing for artist:", artist);
    } catch (error) {
      console.error("Failed to update pricing:", error);
    }

    setStep("address");
  };

function AddressSelection({ onAddressSelect, onBack, initialAddress }) {
  const [address, setAddress] = useState(
    initialAddress || {
      street: "",
      city: "",
      province: "",
      postalCode: "",
      notes: "",
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialAddress) {
      setAddress(initialAddress);
    }
  }, [initialAddress]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!address.street || !address.city || !address.province || !address.postalCode) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError("");
    
    try {
      console.log("Submitting address:", address);
      await onAddressSelect(address);
    } catch (err) {
      console.error("Error submitting address:", err);
      setError(err.message || "Failed to save address. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user makes changes
  };

  const isFormValid =
    address.street && address.city && address.province && address.postalCode;

  return (
    <div className="p-8 md:p-16">
      <h2 className="text-left text-3xl font-normal text-gray-900 mb-4" style={{ letterSpacing: "0.02em" }}>
        Service Address
      </h2>
      <p className="text-left text-gray-600 mb-8 text-base font-light" style={{ letterSpacing: "0.01em" }}>
        Where should we provide the service?
      </p>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600 font-light">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-800 mb-2 uppercase tracking-wide">
              Street Address *
            </label>
            <input
              type="text"
              value={address.street}
              onChange={(e) => handleChange("street", e.target.value)}
              className="w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-700/40 focus:border-gray-700 transition-all text-gray-900 placeholder-gray-500 font-light"
              placeholder="123 Main Street"
              style={{ letterSpacing: "0.01em" }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2 uppercase tracking-wide">
              City *
            </label>
            <input
              type="text"
              value={address.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className="w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-700/40 focus:border-gray-700 transition-all text-gray-900 placeholder-gray-500 font-light"
              placeholder="Toronto"
              style={{ letterSpacing: "0.01em" }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2 uppercase tracking-wide">
              Province *
            </label>
            <select
              value={address.province}
              onChange={(e) => handleChange("province", e.target.value)}
              className="w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-700/40 focus:border-gray-700 transition-all text-gray-900 font-light"
              style={{ letterSpacing: "0.01em" }}
              required
            >
              <option value="">Select Province</option>
              <option value="ON">Ontario</option>
              <option value="QC">Quebec</option>
              <option value="BC">British Columbia</option>
              <option value="AB">Alberta</option>
              <option value="MB">Manitoba</option>
              <option value="SK">Saskatchewan</option>
              <option value="NS">Nova Scotia</option>
              <option value="NB">New Brunswick</option>
              <option value="NL">Newfoundland and Labrador</option>
              <option value="PE">Prince Edward Island</option>
              <option value="NT">Northwest Territories</option>
              <option value="NU">Nunavut</option>
              <option value="YT">Yukon</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-800 mb-2 uppercase tracking-wide">
              Postal Code *
            </label>
            <input
              type="text"
              maxLength="7"
              pattern="^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$"
              title="Invalid postal code format. Must be A1A 1A1"
              value={address.postalCode}
              onChange={(e) => {
                let value = e.target.value
                  .replace(/[^A-Za-z0-9]/g, "")
                  .toUpperCase();
                if (value.length === 6) {
                  value = value.slice(0, 3) + " " + value.slice(3);
                }
                handleChange("postalCode", value);
              }}
              className="w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-700/40 focus:border-gray-700 transition-all text-gray-900 placeholder-gray-500 font-light"
              placeholder="M5V 3A8"
              style={{ letterSpacing: "0.01em" }}
              required
            />
            <p
              className="text-xs text-gray-600 mt-2 font-light"
              style={{ letterSpacing: "0.01em" }}
            >
              Canadian postal code format: A1A 1A1
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 md:pt-8 border-t border-gray-400/40 mt-8 md:mt-10">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="relative flex-1 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 py-3.5 rounded-xl font-light shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-100 transition-all duration-300 cursor-pointer border border-gray-400/60 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ letterSpacing: "0.05em" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-out"></div>
            <span className="relative"> Back</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className={`relative flex-1 py-3.5 rounded-xl font-light shadow-md transition-all duration-300 border overflow-hidden ${
              isSubmitting || !isFormValid
                ? "bg-gray-300/60 text-gray-500 cursor-not-allowed border border-gray-400/40"
                : "bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white hover:shadow-xl hover:scale-[1.03] active:scale-100 border border-gray-700"
            }`}
            style={{ letterSpacing: "0.05em" }}
          >
            {isSubmitting ? (
              <span className="relative flex items-center justify-center gap-2.5">
                <LoadingSpinner />
                Processing...
              </span>
            ) : (
              <>
                {isFormValid && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                )}
                <span className="relative flex items-center justify-center gap-2.5">
                  Review Booking
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

  const handleBackToArtist = () => {
    setStep("artist");
  };
  

  useEffect(() => {
    if (bookingId) loadBooking()
    else setLoading(false)
  }, [bookingId])

  useEffect(() => {
    if (booking) {
      const paymentStatus = booking.payment_status || booking.ops?.payment_status
      if (paymentStatus === "deposit_paid" || paymentStatus === "fully_paid") {
        setPaymentCompleted(true)
      }
    }
  }, [booking])

const loadBooking = async () => {
  try {
    const res = await api.get(`/quote/${bookingId}`);
    const bk = res.data;
    const paymentStatus = bk.payment_status || bk.ops?.payment_status;

    if (paymentStatus === "deposit_paid" || paymentStatus === "fully_paid") {
      setPaymentCompleted(true);
      setPricingReady(true);
      setLoading(false);
      return;
    }

    const brideService = bk.bride_service || bk.ops?.brideService;
    const needsTrial = bk.needs_trial || bk.ops?.needs_trial;
    const serviceType = bk.service_type || bk.ops?.service_type;

    // ✅ check if it's a bridal booking
    const isBridal =
      serviceType?.toLowerCase() === "bridal" &&
      needsTrial?.toLowerCase() === "yes";

    // set all states
    setBooking(bk);
    setIsBridal(isBridal); // ✅ added bridal state setter

    if (bk.event_date)
      setSelectedDate(new Date(bk.event_date).toISOString().split("T")[0]);
    if (bk.ready_time) setSelectedTime(bk.ready_time);
    if (bk.trial_date)
      setTrialDate(new Date(bk.trial_date).toISOString().split("T")[0]);
    if (bk.trial_time) setTrialTime(bk.trial_time);
    if (bk.bride_service) {
        const s = (bk.bride_service || "").toLowerCase();
        setSelectedService(s.includes("bridal") ? "bridal" : "bridal");
      }

    setPricingReady(true);
  } catch (err) {
    console.error("Failed to load booking:", err);
  } finally {
    setLoading(false);
  }
};


  if (!bookingId)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md text-center bg-whitep-8">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
            <WarningIcon className="w-8 h-8 text-gray-600" />
          </div>
          <h1 className="text-2xl font-normal text-gray-900 mb-3">Invalid Quote Link</h1>
          <p className="text-gray-600 font-light mb-6">
            This quote link is missing a booking ID. Please check your email for the correct link.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white font-light shadow hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    )

  if (loading || !pricingReady)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-gray-700 animate-spin"></div>
          </div>
          <p className="text-gray-700 font-light">Loading your personalized quote...</p>
        </div>
      </div>
    )

  if (paymentCompleted)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md text-center bg-white border border-gray-200 rounded-2xl shadow-md p-8">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
            <CheckIcon className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-normal text-gray-900 mb-3">Payment Already Completed</h1>
          <p className="text-gray-600 font-light mb-6">
            You have already paid the deposit for booking ID:
            <span className="text-gray-900 font-medium ml-1">{bookingId}</span>
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white font-light shadow hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    )

  return (
    <div className="max-w-4xl items-center w-full mx-auto">
      <div className="bg-white p-6 sm:p-8">
        {/* Header */}
        <div className="mb-4 text-center">
          <img src={Logo} alt="Logo" className="w-[180px] sm:w-[220px] lg:w-[260px] mx-auto mb-3" />
          <p className="text-gray-700 font-light text-sm sm:text-base">
            View your personalised quote below and choose your next step.
          </p>
        </div>
        {/* Step Progress */}
        <div className="flex justify-center gap-3 mb-5 sm:mb-0">
          {["1", "2", "3", "4"].map((num, idx) => {
            const stepNames = ["packages", "artist", "address", "review"]
            const currentStepIndex = stepNames.indexOf(step)
            const isActive = idx <= currentStepIndex
            return (
              <div
                key={num}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium border transition-all duration-300 ${
                  isActive
                    ? "bg-gray-900 text-white border-gray-700 shadow-md shadow-gray-500/30"
                    : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                }`}
              >
                {num}
              </div>
            )
          })}
        </div>

        



        {/* Steps */}
        {step === "packages" && (
          <PackageBreakdown
            onBookNow={(pkg) => {
              setSelectedPackage(pkg)
              setStep("artist")
            }}
            onScheduleCall={() => setStep("consultation")}
            booking={booking}
            selectedDate={selectedDate}
            onArtistSelect={handleArtistSelect}
          />
        )}
        
        {/* Event & Trial Dates Section */}
          {step === "packages" && 
          (
            <div className="border border-gray-200 rounded-xl p-4 sm:p-5 mt-5 relative">
              {/* Change Button */}
                <div
                  className="absolute top-3 right-3 cursor-pointer text-gray-600 hover:text-gray-900 transition-all"
                  onClick={() => setShowModal(true)}
                >
                  <button className="flex items-center gap-1 bg-gray-700 hover:bg-gray-900 transition-all text-gray-50 px-2 py-1 rounded-lg border-gray-900">
                    Edit
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-50 transition-colors"
                    >
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                    </svg>
                  </button>
                </div>

                {/* Two-column layout */}
                
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                    {/* Event Details */}
                    <div>
                      <h3 className="text-gray-900 font-medium text-lg mb-2">Event Details</h3>

                      <div className="flex items-center gap-2 text-gray-700">
                        <CalendarIcon className="w-5 h-5 text-gray-700" />
                        <span className="font-light">
                          {selectedDate
                            ? new Date(selectedDate).toLocaleDateString("en-CA", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "No event date selected"}
                        </span>
                      </div>

                      {selectedTime && (
                        <div className="flex items-center gap-2 text-gray-700 mt-1">
                          <ClockIcon className="w-5 h-5 text-gray-700" />
                          <span className="font-light">
                            {selectedTime
                              ? new Date(`1970-01-01T${selectedTime}`).toLocaleTimeString([], {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })
                              : ""}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Trial Details (only show if bridal) */}
                    {isBridal &&  (
                      <div>
                        <h3 className="text-gray-900 font-medium text-lg mb-2">Trial Details</h3>

                        <div className="flex items-center gap-2 text-gray-700">
                          <CalendarIcon className="w-5 h-5 text-gray-700" />
                          <span className="font-light">
                            {trialDate
                              ? new Date(trialDate).toLocaleDateString("en-CA", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "No trial date selected"}
                          </span>
                        </div>

                        {trialTime && (
                          <div className="flex items-center gap-2 text-gray-700 mt-1">
                            <ClockIcon className="w-5 h-5 text-gray-700" />
                            <span className="font-light">
                              {trialTime
                                ? new Date(`1970-01-01T${trialTime}`).toLocaleTimeString([], {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                  })
                                : ""}
                            </span>

                          </div>
                        )}
                      </div>
                    )}
                  </div>
            </div>
          )}


        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-3xl space-y-8 relative overflow-y-auto max-h-[90vh]">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Edit Dates & Times</h3>

              {/* Event Section */}
              <div className="space-y-4">
                <h4 className="text-gray-800 font-medium text-base">Event</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <CustomDatePicker
                    label="Event Date"
                    name="event_date"
                    register={(name) => ({
                      onChange: (e) => 
                      {
                        if (trialDate >= e.target.value) {
                          alert("Trial date must be before the event date.")
                          return
                        }
                        else
                          setSelectedDate(e.target.value)
                      },
                      name,
                    })}
                    value={selectedDate}
                    minDate={new Date().toISOString().split("T")[0]}
                  />
                  <CustomTimePicker
                    label="Event Time"
                    name="event_time"
                    register={(name) => ({
                      onChange: (e) => setSelectedTime(e.target.value),
                      name,
                    })}
                    value={selectedTime}
                  />
                </div>
              </div>

              {/* Trial Section (Bridal only) */}
              {isBridal && (
                <div className="space-y-4">
                  <h4 className="text-gray-800 font-medium text-base">Trial</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <CustomDatePicker
                      label="Trial Date"
                      name="trial_date"
                      register={(name) => ({
                        onChange: (e) => 
                        {
                          if (e.target.value >= selectedDate) {
                            alert("Trial date must be before the event date.")
                            return
                          }
                          else
                            setTrialDate(e.target.value)
                        },
                        name,
                      })}
                      value={trialDate}
                      minDate={new Date().toISOString().split("T")[0]}
                      maxDate={
                        selectedDate
                        ? new Date(new Date(selectedDate).setDate(new Date(selectedDate).getDate() - 1))
                        : null
                      }
                    />
                    <CustomTimePicker
                      label="Trial Time"
                      name="trial_time"
                      register={(name) => ({
                        onChange: (e) => setTrialTime(e.target.value),
                        name,
                      })}
                      value={trialTime}
                    />
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 rounded-lg bg-gray-900 text-white hover:opacity-90 transition-all"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}


        {step === "consultation" && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl font-normal text-gray-900 mb-3">Schedule Your Consultation</h2>
            <p className="text-gray-700 font-light mb-6">Choose a convenient time to discuss your needs.</p>

            <div className="overflow-hidden border border-gray-200 rounded-lg mb-8">
              <iframe
                src="https://calendly.com/looksbyanum-info/30min?embed_type=Inline"
                width="100%"
                height="700"
                frameBorder="0"
                allow="microphone; camera; payment; fullscreen; geolocation"
                className="rounded-lg"
              />
            </div>

            <button
              onClick={() => setStep("packages")}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white font-light shadow-md shadow-gray-700/20 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              Back to Quotes
            </button>
          </div>
        )}

       {step === "artist" && (
          <ArtistSelection
            booking={booking}
            selectedDate={selectedDate}
            selectedPackage={selectedPackage} // ✅ add this line
            onArtistSelect={(artist) => {
              setSelectedArtist(artist)
              setStep("address") // ✅ move to next step
            }}
            onBackToQuotes={() => setStep("packages")}
          />
        )}


        {step === "address" && (
          <AddressSelection
            onAddressSelect={handleAddressSelect}
            onBack={handleBackToArtist}
            initialAddress={selectedAddress}
          />
        )}

        {step === "review" && (
          <Review
            booking={booking}
            selectedDate={selectedDate}
            selectedArtist={selectedArtist}
            selectedService={selectedService}
            selectedTime={selectedTime}
            selectedAddress={selectedAddress}
            bookingId={bookingId}
            onProceedToPayment={(bookingId, depositAmount) =>
              navigate("/payment", { state: { bookingId, amount: depositAmount } })
            }
            onBack={() => setStep("address")}
          />
        )}
      </div>
    </div>
  )
}

function PackageBreakdown({
  onBookNow,
  onScheduleCall,
  booking,
  selectedDate,
  onArtistSelect,
}) {
  const [bookingLoading, setBookingLoading] = useState(false);
  const [callLoading, setCallLoading] = useState(false);
  const [showModal, setShowModal] = useState(false)
  const [trialDate, setTrialDate] = useState("")
  const [trialTime, setTrialTime] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inspirationLinks, setInspirationLinks] = useState(
    booking?.inspiration_link ? [booking.inspiration_link] : [""]
  );


  const base = selectedDate
    ? { ...booking, event_date: selectedDate }
    : booking;
  const pricingAnum = calculateBookingPrice(base, "Lead");
  const pricingTeam = calculateBookingPrice(base, "Team");
  const artists = [
    {
      id: "Lead",
      name: "Book with Anum",
      price: pricingAnum?.total || 0,
      icon: "👑",
    },
    {
      id: "Team",
      name: "Book with Team",
      price: pricingTeam?.total || 0,
      icon: "👥",
    },
  ];

  const handleArtistSelectWithInspiration = async (artist) => {
    setIsSubmitting(true);
    try {
      const validLinks = inspirationLinks.filter((link) => link && link.trim());
      if (validLinks.length > 0) {
        const inspirationData = {
          inspiration_link: validLinks[0],
          inspiration_images: validLinks,
        };
        const inspirationKey = `inspiration_${booking.booking_id}`;
        localStorage.setItem(inspirationKey, JSON.stringify(inspirationData));
      }

      await onArtistSelect(artist);
    } finally {
      setIsSubmitting(false);
    }
  };


  const pricingBooking = selectedDate
    ? { ...booking, event_date: selectedDate }
    : booking;
  const packages = pricingBooking ? getDynamicPackages(pricingBooking) : [];

  const handleBookNow = async () => {
    setBookingLoading(true);
    try {
      await onBookNow();
    } finally {
      setBookingLoading(false);
    }
  };

  const handleScheduleCall = async () => {
    setCallLoading(true);
    try {
      await onScheduleCall();
    } finally {
      setCallLoading(false);
    }
  };

  return (
    <div className="text-gray-800 px-3 sm:px-6 py-4 sm:py-6">
      {/* Header */}
      <h2
        className="text-center text-2xl sm:text-3xl font-normal text-gray-900 mb-2"
        style={{ letterSpacing: "0.02em" }}
      >
        Available Packages
      </h2>

      <p
        className="text-center text-gray-600 mb-5 text-sm sm:text-base font-light"
        style={{ letterSpacing: "0.01em" }}
      >
        Choose a package that fits your occasion.
      </p>

      {/* Package Grid */}
      <div className="flex justify-center">
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 mb-4">


          {packages.map((pkg, index) => (
            <div
              key={pkg.id}
              className={`group relative rounded-2xl p-6 sm:p-7 transition-all duration-500 overflow-hidden hover:scale-[1.02] mb-5 ${
                index === 0
                  ? "border border-gray-300/80 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 text-gray-900 shadow-[0_6px_25px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_35px_rgba(0,0,0,0.18)] absolute inset-0  opacity-100 "
                  : "border border-gray-200 bg-gradient-to-b from-white to-gray-50 shadow-sm hover:shadow-lg hover:from-gray-50 hover:to-white hover:border-gray-400/60"
              }`}
>

              {/* Gradient Accent Bar */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-700 via-gray-900 to-gray-700 rounded-t-2xl opacity-70 "></div>

              {/* Package Content */}
              <div className="relative">
                {/* Title & Description */}
                <div className="flex flex-col h-25">
                  <h3
                    className="text-xl sm:text-2xl font-medium text-gray-900 mb-1.5 tracking-tight"
                  >
                    {pkg.name}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base font-light leading-snug">
                    {pkg.description}
                  </p>
                </div>
                {/* Price */}
                <div className="text-3xl font-semibold text-gray-900 mb-5">
                  ${formatCurrency(pkg.price)}{" "}
                  <span className="text-sm font-normal text-gray-600">CAD</span>
                </div>

                {/* What's Included */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase mb-2 tracking-wide">
                    What's Included
                  </h4>
                  <ul className="space-y-1.5 mb-4">
                    {pkg.services
                      .filter(
                        (service) =>
                          !service.includes("Subtotal:") &&
                          !service.includes("HST (13%):") &&
                          !service.includes("Total:") &&
                          !service.includes("Deposit required")
                      )
                      .map((service, i) => (
                        <li
                          key={i}
                          className="flex items-start text-sm text-gray-700 font-light"
                        >
                          <svg
                            className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-800/70"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="flex-1">{service}</span>
                        </li>
                      ))}
                  </ul>
                </div>

                {/* Pricing Breakdown */}
                <div className="border-t border-gray-300/70 pt-3">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase mb-2 tracking-wide">
                    Pricing Breakdown
                  </h4>
                  <div className="space-y-1.5 text-sm">
                    {pkg.services
                      .filter(
                        (service) =>
                          service.includes("Subtotal:") ||
                          service.includes("HST (13%):") ||
                          service.includes("Total:") ||
                          service.includes("Deposit required")
                      )
                      .map((service, i) => (
                        <div
                          key={i}
                          className="flex justify-between font-light"
                        >
                          <span
                            className={`${
                              service.includes("Total:")
                                ? "text-gray-900 font-medium"
                                : service.includes("Deposit required")
                                ? "text-gray-800"
                                : "text-gray-600"
                            }`}
                          >
                            {service.split(":")[0]}:
                          </span>
                          <span
                            className={`${
                              service.includes("Total:")
                                ? "font-semibold text-gray-900"
                                : service.includes("Deposit required")
                                ? "font-medium text-gray-700"
                                : "text-gray-600"
                            }`}
                          >
                            {service.split(":")[1]}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Select Package Button */}
              <div className="mt-5">
                <button
                  onClick={() =>
                    handleArtistSelectWithInspiration(index === 0 ? "Lead" : "Team")
                  }
                  disabled={isSubmitting}
                  className="relative w-full bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white py-2.5 sm:py-3 px-4 rounded-lg font-light shadow-md hover:shadow-lg active:scale-100 transition-all duration-300 disabled:opacity-50 border border-gray-600 overflow-hidden text-sm sm:text-base"
                  style={{ letterSpacing: '0.05em' }}
                >
                  {!isSubmitting && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-out"></div>
                  )}
                  <span className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner /> Processing...
                      </>
                    ) : index === 0 ? (
                      "Select Package"
                    ) : (
                      "Select Package"
                    )}
                  </span>
                </button>
              </div>


              
            </div>
          ))}

        </div>
      </div>

      {/* Notes */}
      <div className="text-center mb-3 px-2 sm:px-3">
        <p
          className="text-xs text-gray-500 font-light leading-snug"
          style={{ letterSpacing: "0.01em" }}
        >
          For multi-day event bookings, please contact us directly to discuss
          your event details.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="text-center px-3">
        <div className="space-y-3 max-w-md mx-auto">
          {/* Book Now */}
          {/* <button
            onClick={handleBookNow}
            disabled={bookingLoading}
            className="relative w-full bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white py-3 px-5 rounded-lg font-light shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-100 transition-all duration-300 disabled:opacity-50 border border-gray-600 overflow-hidden text-sm sm:text-base"
            style={{ letterSpacing: "0.05em" }}
          >
            {!bookingLoading && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-out"></div>
            )}
            <span className="relative flex items-center justify-center gap-2">
              {bookingLoading ? <LoadingSpinner /> : "📅"} Proceed to Booking
            </span>
          </button> */}

          {/* Schedule Call */}
          <button
            onClick={handleScheduleCall}
            disabled={callLoading}
            className="relative w-full bg-gray-200 text-gray-800 py-3 px-5 rounded-lg font-light shadow-sm hover:shadow-md border border-gray-300 hover:border-gray-400 transition-all duration-300 disabled:opacity-50 text-sm sm:text-base"
            style={{ letterSpacing: "0.05em" }}
          >
            {!callLoading && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-out"></div>
            )}
            <span className="relative flex items-center justify-center gap-2">
              {callLoading ? <LoadingSpinner /> : "📞"} Schedule a Call
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ArtistSelection({
  booking,
  selectedDate,
  onArtistSelect,
  onBackToQuotes,
  selectedPackage,
}) {
  const [inspirationLinks, setInspirationLinks] = useState(
    booking?.inspiration_link ? [booking.inspiration_link] : [""]
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = async (e) => {
    try {
      setUploadError("");
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);

      const fd = new FormData();
      fd.append("image", file);
      if (booking?.email) fd.append("email", booking.email);

      const baseUrl =
        import.meta.env.VITE_API_URL || "https://looksbyanum-saqib.vercel.app/api";
      const res = await fetch(`${baseUrl}/uploads/inspiration`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      setInspirationLinks((prev) => {
        const firstEmptyIndex = prev.findIndex(
          (link) => !link || link.trim() === ""
        );
        if (firstEmptyIndex !== -1) {
          const newLinks = [...prev];
          newLinks[firstEmptyIndex] = data.url;
          return newLinks;
        } else {
          return [...prev, data.url];
        }
      });
    } catch (err) {
      setUploadError("Failed to upload image. Please try another image.");
    } finally {
      setUploading(false);
    }
  };

  const addInspirationField = () => setInspirationLinks((prev) => [...prev, ""]);
  const removeInspirationField = (index) =>
    setInspirationLinks((prev) => prev.filter((_, i) => i !== index));
  const updateInspirationLink = (index, value) =>
    setInspirationLinks((prev) => {
      const newLinks = [...prev];
      newLinks[index] = value;
      return newLinks;
    });

  // ✅ Fixed: Handle continue with a default artist
  const handleContinue = async () => {
    setIsSubmitting(true);
    try {
      const validLinks = inspirationLinks.filter((link) => link && link.trim());
      if (validLinks.length > 0) {
        const inspirationData = {
          inspiration_link: validLinks[0],
          inspiration_images: validLinks,
        };
        const inspirationKey = `inspiration_${booking.booking_id}`;
        localStorage.setItem(inspirationKey, JSON.stringify(inspirationData));
      }
      
      // ✅ Pass "Team" as default artist (or use booking.artist if it exists)
      const defaultArtist = booking?.artist || "Team";
      await onArtistSelect(defaultArtist);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 md:p-16">
      <h2 className="text-left text-3xl font-normal text-gray-900 mb-4" style={{ letterSpacing: "0.02em" }}>
        Add Inspiration
      </h2>
      <p className="text-left text-gray-600 mb-8 text-base font-light" style={{ letterSpacing: "0.01em" }}>
        Share your vision with us (optional)
      </p>

      {/* Inspiration Section */}
      <div className="mb-10 p-6 md:p-7 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-4 uppercase tracking-wide">
          Inspiration (Optional)
        </label>

        {/* Inspiration Links */}
        <div className="space-y-3 mb-5">
          {inspirationLinks.map((link, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-2">
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <LinkIcon className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => updateInspirationLink(index, e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500/50 focus:border-gray-600 transition-all text-sm md:text-base text-gray-900 placeholder-gray-400 font-light"
                  placeholder="Paste inspiration link (Pinterest/Instagram/etc.)"
                />
              </div>
              {inspirationLinks.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInspirationField(index)}
                  className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-300 text-sm md:text-base font-light border border-red-200"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addInspirationField}
          className="mb-5 px-4 py-2.5 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center gap-2 text-sm font-light border border-gray-300 shadow-sm cursor-pointer"
        >
          <span className="text-gray-500 text-lg">+</span>
          <span>Add Another Link</span>
        </button>

        {/* File Upload */}
        <div className="border-t border-gray-200 pt-5">
          <div className="text-sm text-gray-600 mb-3 font-light flex items-center gap-2">
            <UploadIcon className="w-4 h-4 text-gray-500" />
            <span>Or upload an image:</span>
          </div>
          <label className="relative group block w-full cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="sr-only"
            />
            <div className="w-full px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-500 transition-all duration-300 text-center group-hover:bg-gray-50">
              <div className="flex items-center justify-center gap-2 text-sm font-light text-gray-700 group-hover:text-gray-900">
                {uploading ? (
                  <>
                    <LoadingSpinner />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <UploadIcon className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                    <span>Click to upload image</span>
                  </>
                )}
              </div>
            </div>
          </label>
          {uploadError && (
            <div className="mt-2 text-sm text-red-600 font-light p-3 bg-red-50 rounded-lg border border-red-200">
              {uploadError}
            </div>
          )}
          <p className="mt-2 text-xs text-gray-500 font-light">
            Uploaded image URL will auto-fill an inspiration link field.
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onBackToQuotes}
          disabled={isSubmitting}
          className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={isSubmitting}
          className="px-6 py-2 rounded-lg bg-gray-900 text-white hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner />
              <span>Processing...</span>
            </>
          ) : (
            "Continue"
          )}
        </button>
      </div>
    </div>
  );
}


function AddressSelection({ onAddressSelect, onBack, initialAddress }) {
  const [address, setAddress] = useState(
    initialAddress || {
      street: "",
      city: "",
      province: "",
      postalCode: "",
      notes: "",
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialAddress) {
      setAddress(initialAddress);
    }
  }, [initialAddress]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      address.street &&
      address.city &&
      address.province &&
      address.postalCode
    ) {
      setIsSubmitting(true);
      try {
        await onAddressSelect(address);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid =
    address.street && address.city && address.province && address.postalCode;

  return (
    <div className="p-8 md:p-16">
      <h2 className="text-left text-3xl font-normal text-gray-900 mb-4" style={{ letterSpacing: "0.02em" }}>
        Service Address
      </h2>
      <p className="text-left text-gray-600 mb-8 text-base font-light" style={{ letterSpacing: "0.01em" }}>
        Where should we provide the service?
      </p>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-800 mb-2 uppercase tracking-wide">
              Street Address
            </label>
            <input
              type="text"
              value={address.street}
              onChange={(e) => handleChange("street", e.target.value)}
              className="w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-700/40 focus:border-gray-700 transition-all text-gray-900 placeholder-gray-500 font-light"
              placeholder="123 Main Street"
              style={{ letterSpacing: "0.01em" }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2 uppercase tracking-wide">
              City
            </label>
            <input
              type="text"
              value={address.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className="w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-700/40 focus:border-gray-700 transition-all text-gray-900 placeholder-gray-500 font-light"
              placeholder="Toronto"
              style={{ letterSpacing: "0.01em" }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2 uppercase tracking-wide">
              Province
            </label>
            <select
              value={address.province}
              onChange={(e) => handleChange("province", e.target.value)}
              className="w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-700/40 focus:border-gray-700 transition-all text-gray-900 font-light"
              style={{ letterSpacing: "0.01em" }}
              required
            >
              <option value="">Select Province</option>
              <option value="ON">Ontario</option>
              <option value="QC">Quebec</option>
              <option value="BC">British Columbia</option>
              <option value="AB">Alberta</option>
              <option value="MB">Manitoba</option>
              <option value="SK">Saskatchewan</option>
              <option value="NS">Nova Scotia</option>
              <option value="NB">New Brunswick</option>
              <option value="NL">Newfoundland and Labrador</option>
              <option value="PE">Prince Edward Island</option>
              <option value="NT">Northwest Territories</option>
              <option value="NU">Nunavut</option>
              <option value="YT">Yukon</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-800 mb-2 uppercase tracking-wide">
              Postal Code
            </label>
            <input
              type="text"
              maxLength="7"
              pattern="^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$"
              title="Invalid postal code format. Must be A1A 1A1"
              value={address.postalCode}
              onChange={(e) => {
                let value = e.target.value
                  .replace(/[^A-Za-z0-9]/g, "")
                  .toUpperCase();
                if (value.length === 6) {
                  value = value.slice(0, 3) + " " + value.slice(3);
                }
                handleChange("postalCode", value);
              }}
              className="w-full px-4 py-3 bg-white/70 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-700/40 focus:border-gray-700 transition-all text-gray-900 placeholder-gray-500 font-light"
              placeholder="M5V 3A8"
              style={{ letterSpacing: "0.01em" }}
              required
            />
            <p
              className="text-xs text-gray-600 mt-2 font-light"
              style={{ letterSpacing: "0.01em" }}
            >
              Canadian postal code format: A1A 1A1
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 md:pt-8 border-t border-gray-400/40 mt-8 md:mt-10">
          <button
            type="button"
            onClick={onBack}
            className="relative flex-1 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 py-3.5 rounded-xl font-light shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-100 transition-all duration-300 cursor-pointer border border-gray-400/60 overflow-hidden"
            style={{ letterSpacing: "0.05em" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-out"></div>
            <span className="relative"> Back</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className={`relative flex-1 py-3.5 rounded-xl font-light shadow-md transition-all duration-300 border overflow-hidden ${
              isSubmitting || !isFormValid
                ? "bg-gray-300/60 text-gray-500 cursor-not-allowed border border-gray-400/40"
                : "bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white hover:shadow-xl hover:scale-[1.03] active:scale-100 border border-gray-700"
            }`}
            style={{ letterSpacing: "0.05em" }}
          >
            {isSubmitting ? (
              <span className="relative flex items-center justify-center gap-2.5">
                <LoadingSpinner />
                Processing...
              </span>
            ) : (
              <>
                {isFormValid && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                )}
                <span className="relative flex items-center justify-center gap-2.5">
                  Review Booking
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}


function Review({
  booking,
  selectedDate,
  selectedArtist,
  selectedService,
  selectedTime,
  selectedAddress,
  onProceedToPayment,
  onBack,
  bookingId,
}) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [signature, setSignature] = useState("");
  const [signatureDate, setSignatureDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignatureChange = (signatureData) => {
    setSignature(signatureData);
    setSignatureDate(new Date().toISOString());
  };

  const getAppointmentStartTime = (readyTime) => {
    if (!readyTime) return "";
    const [time, period] = readyTime.split(" ");
    const [hours, minutes] = time.split(":");
    let hour24 = parseInt(hours);

    if (period === "PM" && hour24 !== 12) hour24 += 12;
    if (period === "AM" && hour24 === 12) hour24 = 0;

    hour24 -= 2;
    if (hour24 < 0) hour24 += 24;

    const periodNew = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;

    return `${hour12}:${minutes} ${periodNew}`;
  };

  const formatReadyTime = (timeString) => {
    if (!timeString) return "";

    if (timeString.includes("AM") || timeString.includes("PM")) {
      return timeString;
    }

    const [hours, minutes] = timeString.split(":");
    let hour24 = parseInt(hours);
    const period = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;

    return `${hour12}:${minutes} ${period}`;
  };

  const artistName = selectedArtist === "Lead" ? "Anum" : "Team";
  const serviceName = booking.service_type || "Service";

  const pricingBooking = {
    ...booking,
    artist: selectedArtist,
    region: booking.region || "Toronto/GTA",
  };

  console.log(
    "📋 QuotePage - pricingBooking service_mode:",
    pricingBooking.service_mode
  );

  const pricing = calculateBookingPrice(pricingBooking, selectedArtist);
  const subtotal = pricing ? pricing.subtotal : 0;
  const hst = pricing ? pricing.hst : 0;
  const total = pricing ? pricing.total : 0;
  const deposit = pricing ? pricing.deposit : 0;
  const services = pricing ? pricing.services : [];

  const isNonBridal = pricingBooking.service_type === "Non-Bridal";
  const depositPercentage = isNonBridal ? 50 : 30;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (agreedToTerms && signature) {
      if (!booking || !bookingId) {
        if (window.showToast) {
          window.showToast(
            "Booking information is not available. Please refresh the page and try again.",
            "error"
          );
        } else {
          console.error(
            "Booking information is not available. Please refresh the page and try again."
          );
        }
        return;
      }

      setIsSubmitting(true);
      try {
        const bookingData = {
          selectedDate,
          selectedArtist,
          selectedService,
          selectedTime,
          selectedAddress,
          agreedToTerms,
          signature,
          signatureDate,
        };

        console.log("Submitting booking with signature data:", {
          signatureLength: signature ? signature.length : 0,
          signaturePreview: signature
            ? signature.substring(0, 50) + "..."
            : "none",
          signatureDate,
          agreedToTerms,
        });

        const updateResponse = await api.put(
          `/bookings/${bookingId}/quote-selections`,
          bookingData
        );

        if (updateResponse.data.success) {
          console.log(
            "Booking updated successfully:",
            updateResponse.data.booking
          );

          const rawDepositAmount =
            updateResponse.data.booking.pricing.deposit_amount;
          console.log(
            "Raw deposit_amount from backend:",
            typeof rawDepositAmount,
            rawDepositAmount
          );

          let depositAmount;
          if (
            typeof rawDepositAmount === "object" &&
            rawDepositAmount.$numberDecimal
          ) {
            depositAmount = parseFloat(rawDepositAmount.$numberDecimal);
          } else {
            depositAmount = Number(rawDepositAmount);
          }

          console.log(
            "Converted deposit_amount:",
            typeof depositAmount,
            depositAmount
          );

          if (window.fbq) {
            window.fbq("track", "InitiateCheckout", {
              value: depositAmount,
              currency: "CAD",
              content_type: "product",
            });
            console.log("✅ Meta Pixel 'InitiateCheckout' event fired");
          }

          onProceedToPayment(bookingId, depositAmount);
        } else {
          if (window.showToast) {
            window.showToast(
              "Failed to update booking. Please try again.",
              "error"
            );
          } else {
            console.error("Failed to update booking. Please try again.");
          }
        }
      } catch (error) {
        console.error("Failed to update booking:", error);
        if (window.showToast) {
          window.showToast(
            "Failed to save your booking selections. Please try again.",
            "error"
          );
        } else {
          console.error(
            "Failed to save your booking selections. Please try again."
          );
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="bg-white px-6 sm:px-10 md:px-14 py-8 md:py-12 text-gray-800">
      <h2
        className="text-2xl md:text-3xl font-normal text-gray-900 mb-3 md:mb-4 text-center"
        style={{ letterSpacing: "0.02em" }}
      >
        Booking Summary
      </h2>
      <p
        className="text-center text-gray-600 mb-8 text-sm md:text-base font-light"
        style={{ letterSpacing: "0.01em" }}
      >
        Please review your booking details below
      </p>

      <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
        {/* Section Template */}
        <div className="space-y-3 border-b border-gray-200 pb-5">
          <h3 className="text-base md:text-lg font-medium text-gray-800 uppercase tracking-wide">
            Service Details
          </h3>
          <div className="space-y-1.5 text-sm font-light text-gray-700">
            <p>
              <span className="font-medium">Artist:</span> {artistName}
            </p>
            <p>
              <span className="font-medium">Service:</span> {serviceName}
            </p>
            <p>
              <span className="font-medium">Event Date:</span>{" "}
              {new Date(selectedDate).toLocaleDateString("en-CA", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Appointment Schedule */}
        <div className="space-y-3 border-b border-gray-200 pb-5">
          <h3 className="text-base md:text-lg font-medium text-gray-800 uppercase tracking-wide">
            Appointment Schedule
          </h3>
          <div className="space-y-1.5 text-sm font-light text-gray-700">
            <p>
              <span className="font-medium">📅 Appointment Start:</span>{" "}
              {getAppointmentStartTime(selectedTime)}
            </p>
            <p>
              <span className="font-medium">⏰ Ready Time:</span>{" "}
              {formatReadyTime(selectedTime)}
            </p>
            <p>
              <span className="font-medium">📍 Location: </span>{" "} {selectedAddress.street}, {selectedAddress.city},{" "}
              {selectedAddress.province} {selectedAddress.postalCode}
            </p>
          </div>
          
          <p className="text-xs text-gray-500 font-light mt-1.5">
            We’ll start 2 hours before your ready time to ensure you’re ready on schedule.
          </p>
        </div>

        {/* Pricing Summary */}
        <div className="space-y-3 border-b border-gray-200 pb-5">
          <h3 className="text-base md:text-lg font-medium text-gray-800 uppercase tracking-wide">
            Pricing Summary
          </h3>
          <ul className="space-y-1.5 mb-4 text-sm font-light text-gray-700">
            {services
              .filter(
                (s) =>
                  !s.includes("Subtotal:") &&
                  !s.includes("HST (13%):") &&
                  !s.includes("Total:") &&
                  !s.includes("Deposit required")
              )
              .map((service, i) => (
                <li key={i} className="flex justify-between">
                  <span>{service.split(":")[0]}</span>
                  <span>{service.split(":")[1]}</span>
                </li>
              ))}
          </ul>
          <div className="space-y-2 pt-3 border-t border-gray-200 text-sm font-light text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>HST (13%)</span>
              <span>{formatCurrency(hst)}</span>
            </div>
            <div className="flex justify-between font-medium text-gray-900">
              <span>Total (with 13% HST)</span>
              <span>{formatCurrency(total)} CAD</span>
            </div>
            <div className="flex justify-between font-medium text-fuchsia-600">
              <span>Amount to Pay ({depositPercentage}%)</span>
              <span>{formatCurrency(deposit)} CAD</span>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="space-y-3 border-b border-gray-200 pb-5">
          <h3 className="text-base md:text-lg font-medium text-gray-800 uppercase tracking-wide">
            Terms & Conditions
          </h3>
          <div className="space-y-4 text-sm font-light text-gray-700 max-h-60 overflow-y-auto leading-relaxed">
            <div>
              <p className="font-medium">Client Responsibilities:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Provide accurate and detailed information.</li>
                <li>Ensure proper lighting and accessible location.</li>
                <li>Arrive with clean hair and face.</li>
                <li>Client covers parking fees if any.</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Cancellation Policy:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Deposit is non-refundable if canceled.</li>
                <li>If canceled within 3 days, full balance is due.</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Liability:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>We’re not responsible for allergic reactions or injuries.</li>
                <li>Inform artist of any allergies in advance.</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Payment Terms:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>
                  Total: {formatCurrency(total)} CAD. A {depositPercentage}% deposit is required.
                </li>
                <li>Remaining balance due on event day.</li>
                <li>
                  Booking confirmed only after deposit — date will be held exclusively for you.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Agreement + Signature */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-500"
              required
            />
            <span className="text-sm text-gray-700 font-light">
              I have read and agree to the terms and conditions.
            </span>
          </label>

          {/* Signature */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2 uppercase tracking-wide">
              Digital Signature *
            </label>
            <p className="text-xs text-gray-500 mb-2 font-light">
              Please sign below to confirm your agreement:
            </p>
            <div className="w-full max-w-lg mx-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
              <SignatureCanvas
                onSignatureChange={handleSignatureChange}
                width={400}
                height={100}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-5 py-2.5 bg-gray-100 text-gray-800 rounded-lg border border-gray-300 hover:bg-gray-200 transition-all text-sm"
            >
              Edit Details
            </button>
            <button
              type="submit"
              disabled={!agreedToTerms || !signature || isSubmitting}
              className={`flex-1 px-5 py-2.5 rounded-lg text-sm transition-all ${
                agreedToTerms && signature && !isSubmitting
                  ? "bg-gray-900 text-white hover:opacity-90"
                  : "bg-gray-100 border-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? <LoadingSpinner /> : "Proceed to Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

}

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { getDynamicPackages, calculateBookingPrice } from '../lib/pricing';
// import { formatCurrency } from '../../lib/currencyFormat'; // Added currency formatter import
// import SignatureCanvas from './SignatureCanvas';
// import DatePicker from './DatePicker';

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
// });

// export default function QuotePage() {
//   const { bookingId } = useParams();
//   const navigate = useNavigate();
//   const [booking, setBooking] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedDate, setSelectedDate] = useState('');
//   const [selectedPackage, setSelectedPackage] = useState('');
//   const [selectedArtist, setSelectedArtist] = useState('');
//   const [selectedService, setSelectedService] = useState('');
//   const [selectedTime, setSelectedTime] = useState('');
//   const [selectedAddress, setSelectedAddress] = useState('');
//   const [step, setStep] = useState('packages'); // 'packages', 'artist', 'address', 'review', 'consultation'
//   const [pricingReady, setPricingReady] = useState(false);
//   const [paymentCompleted, setPaymentCompleted] = useState(false);

//   useEffect(() => {
//     if (bookingId) {
//       loadBooking();
//     } else {
//       setLoading(false);
//     }
//   }, [bookingId]);

//   // Additional security check on booking data
//   useEffect(() => {
//     if (booking) {
//       const paymentStatus = booking.payment_status || booking.ops?.payment_status;
//       if (paymentStatus === 'deposit_paid' || paymentStatus === 'fully_paid') {
//         console.log('Payment completed detected, showing payment completed message');
//         setPaymentCompleted(true);
//       }
//     }
//   }, [booking, bookingId]);

//   const loadBooking = async () => {
//     if (!bookingId) {
//       console.error('No booking ID provided');
//       return;
//     }

//     try {
//       const response = await api.get(`/quote/${bookingId}`);
//       const bk = response.data;

//       // Security check: If payment is already completed, show payment completed message
//       const paymentStatus = bk.payment_status || bk.ops?.payment_status;
//       console.log('Payment status check:', { paymentStatus, bookingId, hasPayment: paymentStatus === 'deposit_paid' || paymentStatus === 'fully_paid' });

//       if (paymentStatus === 'deposit_paid' || paymentStatus === 'fully_paid') {
//         console.log('Payment already completed, showing payment completed message');
//         setPaymentCompleted(true);
//         setLoading(false);
//         setPricingReady(true); // Allow rendering of the payment completed message
//         return;
//       }

//       setBooking(bk);
//       console.log('🔍 QuotePage - Loaded booking service_mode:', bk.service_mode);
//       // Apply defaults from booking immediately to avoid transient pricing flicker
//       console.log('Loading booking data:', { event_date: bk.event_date, hasEventDate: !!bk.event_date });
//       if (bk.event_date) {
//         console.log('Setting selectedDate from DB:', bk.event_date);
//         // Ensure date is in YYYY-MM-DD format for HTML date input
//         const dateValue = new Date(bk.event_date).toISOString().split('T')[0];
//         console.log('Formatted date for input:', dateValue);
//         setSelectedDate(dateValue);
//       }
//       if (bk.artist) setSelectedArtist(bk.artist === 'Lead' ? 'Lead' : bk.artist === 'Team' ? 'Team' : 'Team');
//       if (bk.bride_service) {
//         // Map stored service to UI id
//         const s = (bk.bride_service || '').toLowerCase();
//         setSelectedService(s.includes('bridal') ? 'bridal' : 'bridal');
//       }
//       if (bk.ready_time) setSelectedTime(bk.ready_time);
//       // Load saved address if it exists
//       if (bk.venue_address || bk.venue_city || bk.venue_province || bk.venue_postal) {
//         setSelectedAddress({
//           street: bk.venue_address || '',
//           city: bk.venue_city || '',
//           province: bk.venue_province || '',
//           postalCode: bk.venue_postal || '',
//           notes: ''
//         });
//       }
//       // Mark ready for initial pricing after defaults applied
//       setPricingReady(true);
//     } catch (error) {
//       console.error('Failed to load booking:', error);
//       // Note: Toast functionality not implemented yet
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBookNow = () => {
//     setStep('artist');
//   };

//   const handleScheduleCall = () => {
//     setStep('consultation');
//   };

//   const handleArtistSelect = async (artist) => {
//     setSelectedArtist(artist);
//     setSelectedService('bridal'); // Default to bridal service

//     // Update database with pricing for selected artist
//     try {
//       const pricingBooking = {
//         ...booking,
//         artist: artist,
//         region: booking.region || 'Toronto/GTA'
//       };

//       const pricing = calculateBookingPrice(pricingBooking, artist);
//       const subtotal = pricing.subtotal;
//       const hst = pricing.hst;
//       const total = pricing.total;
//       const deposit = pricing.deposit;
//       const remaining = Math.round((total - deposit) * 100) / 100;
//       const isNonBridal = pricingBooking.service_type === 'Non-Bridal';
//       const depositPercentage = isNonBridal ? 50 : 30;

//       // Update the booking with the pricing
//       await api.put(`/bookings/${bookingId}/update-pricing`, {
//         artist: artist,
//         pricing: {
//           quote_total: total,
//           deposit_amount: deposit,
//           deposit_percentage: depositPercentage,
//           remaining_amount: remaining,
//           subtotal: subtotal,
//           hst: hst
//         }
//       });

//       console.log('Updated pricing for artist:', artist);
//     } catch (error) {
//       console.error('Failed to update pricing:', error);
//       // Continue anyway
//     }

//     setStep('address');
//   };

//   const handleTimeSelect = (time) => {
//     setSelectedTime(time);
//     setStep('address');
//   };

//   const handleAddressSelect = async (address) => {
//     try {
//       console.log('Saving address:', address);
//       // Save address to database immediately
//       const response = await api.put(`/bookings/${bookingId}/address`, {
//         venue_address: address.street,
//         venue_city: address.city,
//         venue_province: address.province,
//         venue_postal: address.postalCode,
//         venue_name: '', // Venue name not collected
//         event_date: selectedDate
//       });
//       console.log('Address save response:', response.data);

//       setSelectedAddress(address);
//       setStep('review');
//     } catch (error) {
//       console.error('Failed to save address:', error);
//       if (window.showToast) {
//         window.showToast('Failed to save address. Please try again.', 'error');
//       } else {
//         console.error('Failed to save address. Please try again.');
//       }
//     }
//   };

//   const handleBackToArtist = () => {
//     setStep('artist');
//   };

//   const handleBackToTime = () => {
//     setStep('artist');
//   };

//   const handleBackToAddress = () => {
//     setStep('address');
//   };

//   if (!bookingId) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Quote Link</h1>
//           <p className="text-gray-600 mb-6">This quote link is missing a booking ID. Please check your email for the correct link.</p>
//           <button
//             onClick={() => window.location.href = '/'}
//             className="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 cursor-pointer"
//           >
//             Go to Homepage
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (loading || !pricingReady) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading your personalized quote...</p>
//         </div>
//       </div>
//     );
//   }

//   // Check for payment completed before checking if booking exists
//   if (paymentCompleted) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-sm">
//           <div className="mb-6">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//             <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Already Completed</h1>
//             <p className="text-gray-600 mb-4">
//               YOU HAVE ALREADY PAID THE <strong>DEPOSIT PAYMENT</strong> FOR THIS BOOKING ID: <strong>{bookingId}</strong>
//             </p>
//           </div>
//           <div className="space-y-3">
//             <button
//               onClick={() => window.location.href = '/'}
//               className="w-full px-6 py-3 bg-gray-200 text-black rounded-lg font-semibold hover:bg-gray-300 transition-colors cursor-pointer"
//             >
//               Return to Homepage
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!booking) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
//           <p className="text-gray-600">The booking you're looking for doesn't exist or has expired.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen pt-16 pb-8">
//       <div className="max-w-sm md:max-w-2xl lg:max-w-7xl mx-auto px-4">
//         {/* Header */}
//         <div className="text-center mb-6 md:mb-8">
//           <h1 className="text-sm md:text-4xl font-bold text-gray-900 mb-2">Looks By Anum</h1>
//           <p className="text-base md:text-lg text-gray-600 px-4">View your personalised quote below and choose your next step.</p>
//         </div>

//         {/* Progress Indicator */}
//         <div className="mb-8">
//           <div className="flex items-center justify-center space-x-2 md:space-x-4 px-4">
//             <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold ${
//               ['packages', 'artist', 'address', 'review'].includes(step) ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600'
//             }`}>1</div>
//             <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold ${
//               ['artist', 'address', 'review'].includes(step) ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600'
//             }`}>2</div>
//             <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold ${
//               ['address', 'review'].includes(step) ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600'
//             }`}>3</div>
//             <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold ${
//               step === 'review' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600'
//             }`}>4</div>
//           </div>
//           <div className="text-center mt-2 text-lg md:text-xl font-semibold text-gray-800 px-4">
//             {step === 'packages' && 'Package Options'}
//             {step === 'artist' && 'Choose Artist'}
//             {step === 'address' && 'Service Address'}
//             {step === 'review' && 'Review & Confirm'}
//           </div>
//         </div>

//         {/* Selected Date Display */}
//         {step !== 'review' && (
//           <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//             <div className="text-center md:text-left">
//               <span className="text-gray-600 block md:inline mb-2 md:mb-0">Select your event date (optional)</span>
//               <div className="mt-3 md:mt-0 md:flex md:items-center md:justify-end md:space-x-4">
//                 <DatePicker
//                   value={selectedDate || ''}
//                   onChange={(e) => setSelectedDate(e.target.value)}
//                   className="w-full md:w-auto mb-2 md:mb-0"
//                 />
//                 {selectedDate && (
//                   <span className="block md:inline font-semibold text-gray-900 text-center md:text-left">
//                     {new Date(selectedDate).toLocaleDateString('en-CA', {
//                       weekday: 'long',
//                       year: 'numeric',
//                       month: 'long',
//                       day: 'numeric'
//                     })}
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Step Content */}
//         {step === 'packages' && (
//           <PackageBreakdown
//             onBookNow={handleBookNow}
//             onScheduleCall={handleScheduleCall}
//             booking={booking}
//             selectedDate={selectedDate}
//           />
//         )}

//         {step === 'consultation' && (
//           <div className="bg-white rounded-xl shadow-2xl p-8 md:p-16 border border-gray-50">
//             <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
//               Schedule Your Consultation
//             </h2>
//             <p className="text-center text-gray-600 mb-8 text-lg">
//               Choose a convenient time to discuss your needs
//             </p>

//             <div className="mb-8">
//               <iframe
//                 src="https://calendly.com/looksbyanum-info/30min?embed_domain=localhost&embed_type=Inline&hide_landing_page_details=1"
//                 width="100%"
//                 height="700"
//                 frameBorder="0"
//                 allow="microphone; camera; payment; fullscreen; geolocation"
//                 sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
//                 className="rounded-lg"
//               />
//             </div>

//             <div className="text-center">
//               <button
//                 onClick={() => setStep('packages')}
//                 className="px-8 py-3 bg-gray-200 text-black rounded-lg font-semibold hover:bg-gray-300 transition-colors cursor-pointer"
//               >
//                 ← Back to Quotes
//               </button>
//             </div>
//           </div>
//         )}

//         {step === 'artist' && (
//           <ArtistSelection
//             booking={booking}
//             selectedDate={selectedDate}
//             onArtistSelect={handleArtistSelect}
//             onBackToQuotes={() => setStep('packages')}
//           />
//         )}

//         {step === 'address' && (
//           <AddressSelection
//             onAddressSelect={handleAddressSelect}
//             onBack={handleBackToArtist}
//             initialAddress={selectedAddress}
//           />
//         )}

//         {step === 'review' && (
//           <Review
//             booking={booking}
//             selectedDate={selectedDate}
//             selectedArtist={selectedArtist}
//             selectedService={selectedService}
//             selectedTime={selectedTime}
//             selectedAddress={selectedAddress}
//             bookingId={bookingId}
//             onProceedToPayment={(bookingId, depositAmount) => navigate('/payment', {
//               state: { bookingId, amount: depositAmount }
//             })}
//             onBack={handleBackToAddress}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// function PackageBreakdown({ onBookNow, onScheduleCall, booking, selectedDate }) {
//   // Use selected date for pricing if available, otherwise use booking date
//   const pricingBooking = selectedDate ? { ...booking, event_date: selectedDate } : booking;
//   const packages = pricingBooking ? getDynamicPackages(pricingBooking) : [];

//   return (
//     <div className="bg-white rounded-xl shadow-2xl p-4 md:p-8 lg:p-16 border border-gray-50">
//       <h2 className="text-sm md:text-3xl font-bold text-gray-900 mb-2 md:mb-6 text-center">Available Packages</h2>
//       <p className="text-center text-gray-600 mb-6 md:mb-8 text-base md:text-lg px-4">Both packages are shown below — choose how you'd like to proceed.</p>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
//         {packages.map((pkg) => (
//           <div key={pkg.id} className="border-2 border-gray-200 rounded-lg p-4 md:p-6">
//             <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
//             <p className="text-gray-600 mb-4 text-base md:text-lg">{pkg.description}</p>
//             <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{formatCurrency(pkg.price)} CAD</div>

//             <div className="mb-6">
//               <h4 className="text-sm font-semibold text-gray-900 mb-3">What's Included:</h4>
//               <ul className="space-y-2 mb-4">
//                 {pkg.services
//                   .filter(service => !service.includes('Subtotal:') && !service.includes('HST (13%):') && !service.includes('Total:') && !service.includes('Deposit required'))
//                   .map((service, index) => (
//                     <li key={index} className="flex items-start text-sm text-gray-700">
//                       <span className="text-gray-600 mr-2">•</span>
//                       <span>{service}</span>
//                     </li>
//                   ))}
//               </ul>

//               {/* Pricing Breakdown */}
//               <div className="border-t border-gray-200 pt-4">
//                 <h4 className="text-sm font-semibold text-gray-900 mb-3">Pricing Breakdown:</h4>
//                 <div className="space-y-1 text-sm">
//                   {pkg.services
//                     .filter(service => service.includes('Subtotal:') || service.includes('HST (13%):') || service.includes('Total:') || service.includes('Deposit required'))
//                     .map((service, index) => (
//                       <div key={index} className="flex justify-between">
//                         <span className={service.includes('Total:') ? 'font-semibold text-gray-900' : service.includes('Deposit required') ? 'font-medium text-purple-600' : 'text-gray-700'}>
//                           {service.split(':')[0]}:
//                         </span>
//                         <span className={service.includes('Total:') ? 'font-semibold text-gray-900' : service.includes('Deposit required') ? 'font-medium text-purple-600' : 'text-gray-700'}>
//                           {service.split(':')[1]}
//                         </span>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="text-center mb-4 md:mb-6 px-4">
//         <p className="text-xs md:text-sm text-gray-500 mb-4">Note: For multi-day event bookings, please contact us directly to discuss your event details.</p>
//       </div>

//       <div className="text-center px-4">
//         <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Ready to Move Forward?</h3>
//         <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">Choose how you'd like to proceed with your booking</p>

//         <div className="space-y-3 md:space-y-4 max-w-lg mx-auto">
//           <button
//             onClick={onBookNow}
//             className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center text-sm md:text-base cursor-pointer"
//           >
//             📅 Book Now
//           </button>
//           <p className="text-xs md:text-sm text-gray-600">Secure your date and proceed with booking</p>

//           <button className="w-full bg-gray-100 text-black py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center text-sm md:text-base cursor-pointer" onClick={onScheduleCall}>
//             📞 Schedule a Call
//           </button>
//           <p className="text-xs md:text-sm text-gray-600">Let's discuss your needs and answer questions</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// function ArtistSelection({ booking, selectedDate, onArtistSelect, onBackToQuotes }) {
//   const [inspirationLinks, setInspirationLinks] = useState(booking?.inspiration_link ? [booking.inspiration_link] : ['']);
//   const [uploading, setUploading] = useState(false);
//   const [uploadError, setUploadError] = useState('');

//   const handleImageUpload = async (e) => {
//     try {
//       setUploadError('');
//       const file = e.target.files?.[0];
//       if (!file) return;
//       setUploading(true);
//       const fd = new FormData();
//       fd.append('image', file);
//       if (booking?.email) fd.append('email', booking.email);
//       const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/uploads/inspiration`, {
//         method: 'POST',
//         body: fd
//       });
//       if (!res.ok) throw new Error('Upload failed');
//       const data = await res.json();

//       // Add the uploaded image URL to the first empty field or create a new one
//       setInspirationLinks(prev => {
//         const firstEmptyIndex = prev.findIndex(link => !link || link.trim() === '');
//         if (firstEmptyIndex !== -1) {
//           const newLinks = [...prev];
//           newLinks[firstEmptyIndex] = data.url;
//           return newLinks;
//         } else {
//           return [...prev, data.url];
//         }
//       });
//     } catch (err) {
//       setUploadError('Failed to upload image. Please try another image.');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const addInspirationField = () => {
//     setInspirationLinks(prev => [...prev, '']);
//   };

//   const removeInspirationField = (index) => {
//     setInspirationLinks(prev => prev.filter((_, i) => i !== index));
//   };

//   const updateInspirationLink = (index, value) => {
//     setInspirationLinks(prev => {
//       const newLinks = [...prev];
//       newLinks[index] = value;
//       return newLinks;
//     });
//   };

//   const handleArtistSelectWithInspiration = async (artist) => {
//     // Filter out empty links and store inspiration data if there's actually something entered
//     const validLinks = inspirationLinks.filter(link => link && link.trim());
//     if (validLinks.length > 0) {
//       const inspirationData = {
//         inspiration_link: validLinks[0], // Keep first link for backward compatibility
//         inspiration_images: validLinks
//       };
//       const inspirationKey = `inspiration_${booking.booking_id}`;
//       localStorage.setItem(inspirationKey, JSON.stringify(inspirationData));
//     }

//     onArtistSelect(artist);
//   };

//   const base = selectedDate ? { ...booking, event_date: selectedDate } : booking;
//   const pricingAnum = calculateBookingPrice(base, 'Lead');
//   const pricingTeam = calculateBookingPrice(base, 'Team');
//   const artists = [
//     { id: 'Lead', name: 'Book with Anum', price: pricingAnum?.total || 0, emoji: '👑' },
//     { id: 'Team', name: 'Book with Team', price: pricingTeam?.total || 0, emoji: '👥' }
//   ];

//   return (
//     <div className="bg-white rounded-xl shadow-2xl p-8 md:p-16 border border-gray-50">
//       <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Choose Your Artist</h2>
//       <p className="text-center text-gray-600 mb-8 text-lg">Select which artist you'd like to book with for your Bridal</p>

//       {/* Inspiration Section */}
//       <div className="mb-8 p-4 md:p-6 bg-gray-50 rounded-lg">
//         <label className="block text-sm font-semibold text-gray-900 mb-2">
//           Inspiration (optional)
//         </label>
//         {inspirationLinks.map((link, index) => (
//           <div key={index} className="mb-3 md:mb-2">
//             <div className="flex flex-col md:flex-row md:items-center gap-2">
//               <input
//                 type="url"
//                 value={link}
//                 onChange={(e) => updateInspirationLink(index, e.target.value)}
//                 className="flex-1 px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-gray-200 focus:border-gray-500 transition-colors text-sm md:text-base"
//                 placeholder="Paste a link to your inspiration (Pinterest/Instagram/etc.)"
//               />
//               {inspirationLinks.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => removeInspirationField(index)}
//                   className="px-3 py-2 md:py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm md:text-base self-start md:self-auto"
//                   title="Remove this inspiration link"
//                 >
//                   ×
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={addInspirationField}
//           className="mt-2 px-3 md:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm md:text-base"
//         >
//           <span>+</span>
//           <span>Add Another Inspiration Link</span>
//         </button>
//         <div className="mt-4">
//           <div className="text-xs md:text-sm text-gray-600 mb-2">Or upload an image:</div>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageUpload}
//             className="w-full text-sm md:text-base file:mr-3 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-colors"
//           />
//           {uploading && (
//             <div className="mt-2 text-sm text-gray-600">Uploading image...</div>
//           )}
//           {uploadError && (
//             <div className="mt-2 text-sm text-red-600">{uploadError}</div>
//           )}
//           <p className="mt-2 text-xs md:text-sm text-gray-500 leading-relaxed">Uploaded image URL will auto-fill an inspiration link field.</p>
//         </div>
//       </div>

//       <div className="space-y-4 max-w-lg mx-auto">
//         {artists.map((artist) => (
//           <div key={artist.id} className="border-2 border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors">
//             <div className="flex items-center justify-between mb-4">
//               <span className="text-lg font-semibold">
//                 {artist.emoji} {artist.name}
//               </span>
//               <span className="text-lg font-bold text-gray-900">Total: {formatCurrency(artist.price)} CAD</span>
//             </div>

//             <button
//               onClick={() => handleArtistSelectWithInspiration(artist.id)}
//               className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors cursor-pointer"
//             >
//               Select {artist.name}
//             </button>
//           </div>
//         ))}
//       </div>

//       <div className="text-center mt-6">
//         <button
//           onClick={onBackToQuotes}
//           className="px-8 py-3 bg-gray-200 text-black rounded-lg font-semibold hover:bg-gray-300 transition-colors cursor-pointer"
//         >
//           ← Back to Quotes
//         </button>
//       </div>
//     </div>
//   );
// }

// function ServiceTypeSelection({ booking, selectedDate, selectedArtist, onServiceSelect, onBack }) {
//   const services = [
//     {
//       id: 'bridal',
//       name: '👑 Bridal Service',
//       description: 'Complete bridal makeup and hair for your special day',
//       price: selectedArtist === 'Lead' ? 450 : 360
//     },
//     {
//       id: 'bridal_trial',
//       name: '🎉 Bridal + Trial',
//       description: 'Includes trial session + full bridal service',
//       price: selectedArtist === 'Lead' ? 700 : 560
//     }
//   ];

//   return (
//     <div className="bg-white rounded-xl shadow-2xl p-8 md:p-16 border border-gray-50">
//       <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
//         What would you like to book with {selectedArtist === 'Lead' ? 'Anum' : 'Team'}?
//       </h2>
//       <p className="text-center text-gray-600 mb-8 text-lg">Choose the service you'd like to book</p>

//       <div className="space-y-4 max-w-lg mx-auto">
//         {services.map((service) => (
//           <div key={service.id} className="border-2 border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
//                 <p className="text-gray-600 text-sm">{service.description}</p>
//               </div>
//               <span className="text-lg font-bold text-gray-900">{formatCurrency(service.price)} CAD</span>
//             </div>

//             <button
//               onClick={() => onServiceSelect(service.id)}
//               className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors cursor-pointer"
//             >
//               Select {service.name}
//             </button>
//           </div>
//         ))}
//       </div>

//       <div className="text-center mt-6">
//         <button
//           onClick={onBack}
//           className="text-black hover:text-gray-700 cursor-pointer"
//         >
//           ← Back to Artist Selection
//         </button>
//       </div>
//     </div>
//   );
// }

// function TimeSelection({ selectedDate, selectedArtist, onTimeSelect, onBack }) {
//   const [selectedTime, setSelectedTime] = useState('');

//   const getAppointmentStartTime = (readyTime) => {
//     if (!readyTime) return '';
//     const [time, period] = readyTime.split(' ');
//     const [hours, minutes] = time.split(':');
//     let hour24 = parseInt(hours);

//     if (period === 'PM' && hour24 !== 12) hour24 += 12;
//     if (period === 'AM' && hour24 === 12) hour24 = 0;

//     // Subtract 2 hours
//     hour24 -= 2;
//     if (hour24 < 0) hour24 += 24;

//     // Convert back to 12-hour format
//     const periodNew = hour24 >= 12 ? 'PM' : 'AM';
//     const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;

//     return `${hour12}:${minutes} ${periodNew}`;
//   };

//   const formatReadyTime = (timeString) => {
//     if (!timeString) return '';

//     // If already in 12-hour format (contains AM/PM), return as is
//     if (timeString.includes('AM') || timeString.includes('PM')) {
//       return timeString;
//     }

//     // Convert 24-hour format to 12-hour format
//     const [hours, minutes] = timeString.split(':');
//     let hour24 = parseInt(hours);
//     const period = hour24 >= 12 ? 'PM' : 'AM';
//     const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;

//     return `${hour12}:${minutes} ${period}`;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (selectedTime) {
//       onTimeSelect(selectedTime);
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-2xl p-8 md:p-16 border border-gray-50">
//       <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Complete Your Booking</h2>
//       <p className="text-center text-gray-600 mb-8 text-lg">
//         {selectedArtist === 'Lead' ? 'Bridal with Anum' : selectedArtist === 'Team' ? 'Bridal with Team' : 'Complete Your Booking'}
//       </p>

//       <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             What time do you need to be ready?
//           </label>
//           <p className="text-xs text-gray-500 mb-3">
//             This is the time you need to be completely ready by, not the start time.
//           </p>

//           <select
//             value={selectedTime}
//             onChange={(e) => setSelectedTime(e.target.value)}
//             className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
//             required
//           >
//             <option value="">Select ready time</option>
//             <option value="10:00 PM">10:00 PM</option>
//             <option value="9:00 PM">9:00 PM</option>
//             <option value="8:00 PM">8:00 PM</option>
//             <option value="7:00 PM">7:00 PM</option>
//             <option value="6:00 PM">6:00 PM</option>
//             <option value="5:00 PM">5:00 PM</option>
//             <option value="4:00 PM">4:00 PM</option>
//             <option value="3:00 PM">3:00 PM</option>
//             <option value="2:00 PM">2:00 PM</option>
//             <option value="1:00 PM">1:00 PM</option>
//             <option value="12:00 PM">12:00 PM</option>
//             <option value="11:00 AM">11:00 AM</option>
//             <option value="10:00 AM">10:00 AM</option>
//           </select>
//         </div>

//         {selectedTime && (
//           <div className="bg-gray-50 rounded-lg p-4 mb-6">
//             <h3 className="font-semibold text-gray-900 mb-2">Your Appointment Schedule</h3>
//             <div className="space-y-1 text-sm">
//               <div><span className="font-medium">📅 Appointment Start:</span> {getAppointmentStartTime(selectedTime)}</div>
//               <div><span className="font-medium">⏰ Ready Time:</span> {formatReadyTime(selectedTime)}</div>
//             </div>
//             <p className="text-xs text-gray-600 mt-2">
//               We'll start 2 hours before your ready time to ensure you're completely finished on schedule.
//             </p>
//           </div>
//         )}

//         <div className="flex space-x-4">
//           <button
//             type="button"
//             onClick={onBack}
//             className="flex-1 bg-gray-200 text-black py-3 rounded-lg font-semibold hover:bg-gray-300 cursor-pointer"
//           >
//             ← Back
//           </button>
//           <button
//             type="submit"
//             disabled={!selectedTime}
//             className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
//           >
//             Continue to Address
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// function AddressSelection({ onAddressSelect, onBack, initialAddress }) {
//   const [address, setAddress] = useState(initialAddress || {
//     street: '',
//     city: '',
//     province: '',
//     postalCode: '',
//     notes: ''
//   });

//   // Update address when initialAddress changes
//   useEffect(() => {
//     if (initialAddress) {
//       setAddress(initialAddress);
//     }
//   }, [initialAddress]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (address.street && address.city && address.province && address.postalCode) {
//       onAddressSelect(address);
//     }
//   };

//   const handleChange = (field, value) => {
//     setAddress(prev => ({ ...prev, [field]: value }));
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-2xl p-8 md:p-16 border border-gray-50">
//       <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Service Address</h2>
//       <p className="text-center text-gray-600 mb-8 text-lg">Where should we provide the service?</p>

//       <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
//         <div className="grid md:grid-cols-2 gap-4 mb-4">
//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Street Address
//             </label>
//             <input
//               type="text"
//               value={address.street}
//               onChange={(e) => handleChange('street', e.target.value)}
//               className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
//               placeholder="123 Main Street"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               City
//             </label>
//             <input
//               type="text"
//               value={address.city}
//               onChange={(e) => handleChange('city', e.target.value)}
//               className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
//               placeholder="Toronto"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Province
//             </label>
//             <select
//               value={address.province}
//               onChange={(e) => handleChange('province', e.target.value)}
//               className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
//               required
//             >
//               <option value="">Select Province</option>
//               <option value="ON">Ontario</option>
//               <option value="QC">Quebec</option>
//               <option value="BC">British Columbia</option>
//               <option value="AB">Alberta</option>
//               <option value="MB">Manitoba</option>
//               <option value="SK">Saskatchewan</option>
//               <option value="NS">Nova Scotia</option>
//               <option value="NB">New Brunswick</option>
//               <option value="NL">Newfoundland and Labrador</option>
//               <option value="PE">Prince Edward Island</option>
//               <option value="NT">Northwest Territories</option>
//               <option value="NU">Nunavut</option>
//               <option value="YT">Yukon</option>
//             </select>
//           </div>

//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Postal Code
//             </label>
//             <input
//               type="text"
//               maxLength="7"
//               pattern="^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$"
//               title="Invalid postal code format. Must be A1A 1A1"
//               value={address.postalCode}
//               onChange={(e) => {
//                 let value = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
//                 if (value.length === 6) {
//                   value = value.slice(0, 3) + ' ' + value.slice(3);
//                 }
//                 handleChange('postalCode', value);
//               }}
//               className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
//               placeholder="M5V 3A8"
//               required
//             />
//             <p className="text-xs text-gray-500 mt-1">Canadian postal code format: A1A 1A1</p>
//           </div>
//         </div>

//         <div className="flex space-x-4">
//           <button
//             type="button"
//             onClick={onBack}
//             className="flex-1 bg-gray-200 text-black py-3 rounded-lg font-semibold hover:bg-gray-300 cursor-pointer"
//           >
//             ← Back
//           </button>
//           <button
//             type="submit"
//             className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 cursor-pointer"
//           >
//             Review Booking
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// function Review({ booking, selectedDate, selectedArtist, selectedService, selectedTime, selectedAddress, onProceedToPayment, onBack, bookingId }) {
//   const [agreedToTerms, setAgreedToTerms] = useState(false);
//   const [signature, setSignature] = useState('');
//   const [signatureDate, setSignatureDate] = useState('');

//   const handleSignatureChange = (signatureData) => {
//     setSignature(signatureData);
//     setSignatureDate(new Date().toISOString());
//   };

//   const getAppointmentStartTime = (readyTime) => {
//     if (!readyTime) return '';
//     const [time, period] = readyTime.split(' ');
//     const [hours, minutes] = time.split(':');
//     let hour24 = parseInt(hours);

//     if (period === 'PM' && hour24 !== 12) hour24 += 12;
//     if (period === 'AM' && hour24 === 12) hour24 = 0;

//     // Subtract 2 hours
//     hour24 -= 2;
//     if (hour24 < 0) hour24 += 24;

//     // Convert back to 12-hour format
//     const periodNew = hour24 >= 12 ? 'PM' : 'AM';
//     const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;

//     return `${hour12}:${minutes} ${periodNew}`;
//   };

//   const formatReadyTime = (timeString) => {
//     if (!timeString) return '';

//     // If already in 12-hour format (contains AM/PM), return as is
//     if (timeString.includes('AM') || timeString.includes('PM')) {
//       return timeString;
//     }

//     // Convert 24-hour format to 12-hour format
//     const [hours, minutes] = timeString.split(':');
//     let hour24 = parseInt(hours);
//     const period = hour24 >= 12 ? 'PM' : 'AM';
//     const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;

//     return `${hour12}:${minutes} ${period}`;
//   };

//   const artistName = selectedArtist === 'Lead' ? 'Anum' : 'Team';
//   const serviceName = booking.service_type || 'Service';

//   // Create a booking object with the selected options for pricing calculation
//   // Use the original booking's service_type and pricing data, just update the artist
//   const pricingBooking = {
//     ...booking,
//     artist: selectedArtist,
//     // Keep the original service_type from the database instead of overriding it
//     region: booking.region || 'Toronto/GTA'
//   };

//   console.log('🔍 QuotePage - pricingBooking service_mode:', pricingBooking.service_mode);

//   // Calculate pricing dynamically based on selections
//   const pricing = calculateBookingPrice(pricingBooking, selectedArtist);
//   const subtotal = pricing ? pricing.subtotal : 0;
//   const hst = pricing ? pricing.hst : 0;
//   const total = pricing ? pricing.total : 0;
//   const deposit = pricing ? pricing.deposit : 0;
//   const services = pricing ? pricing.services : [];

//   // Get the correct deposit percentage for display
//   const isNonBridal = pricingBooking.service_type === 'Non-Bridal';
//   const depositPercentage = isNonBridal ? 50 : 30;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (agreedToTerms && signature) {
//       if (!booking || !bookingId) {
//         if (window.showToast) {
//           window.showToast('Booking information is not available. Please refresh the page and try again.', 'error');
//         } else {
//           console.error('Booking information is not available. Please refresh the page and try again.');
//         }
//         return;
//       }

//       try {
//         // First update the booking with selections and calculated pricing
//         const bookingData = {
//           selectedDate,
//           selectedArtist,
//           selectedService,
//           selectedTime,
//           selectedAddress,
//           agreedToTerms,
//           signature,
//           signatureDate
//         };

//         console.log('Submitting booking with signature data:', {
//           signatureLength: signature ? signature.length : 0,
//           signaturePreview: signature ? signature.substring(0, 50) + '...' : 'none',
//           signatureDate,
//           agreedToTerms
//         });

//         const updateResponse = await api.put(`/bookings/${bookingId}/quote-selections`, bookingData);

//         if (updateResponse.data.success) {
//           console.log('Booking updated successfully:', updateResponse.data.booking);

//           // Convert deposit_amount to number in case it's a Decimal128 from MongoDB
//           const rawDepositAmount = updateResponse.data.booking.pricing.deposit_amount;
//           console.log('Raw deposit_amount from backend:', typeof rawDepositAmount, rawDepositAmount);

//           // Handle MongoDB Decimal128 objects
//           let depositAmount;
//           if (typeof rawDepositAmount === 'object' && rawDepositAmount.$numberDecimal) {
//             depositAmount = parseFloat(rawDepositAmount.$numberDecimal);
//           } else {
//             depositAmount = Number(rawDepositAmount);
//           }

//           console.log('Converted deposit_amount:', typeof depositAmount, depositAmount);

//           // Facebook Pixel tracking for Lead/InitiateCheckout event
//           if (window.fbq) {
//             window.fbq('track', 'InitiateCheckout', {
//               value: depositAmount,
//               currency: 'CAD',
//               content_type: 'product'
//             });
//           }

//           // Now proceed to payment with the updated booking data
//           onProceedToPayment(bookingId, depositAmount);
//         } else {
//           if (window.showToast) {
//             window.showToast('Failed to update booking. Please try again.', 'error');
//           } else {
//             console.error('Failed to update booking. Please try again.');
//           }
//         }
//       } catch (error) {
//         console.error('Failed to update booking:', error);
//         if (window.showToast) {
//           window.showToast('Failed to save your booking selections. Please try again.', 'error');
//         } else {
//           console.error('Failed to save your booking selections. Please try again.');
//         }
//       }
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-2xl p-8 md:p-16 border border-gray-50">
//       <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6 text-center">Booking Summary</h2>
//       <p className="text-center text-gray-600 mb-6 md:mb-8 text-base md:text-lg">Please review your booking details below</p>

//       <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
//         {/* Service Details */}
//         <div className="border-b pb-4">
//           <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Details</h3>
//           <div className="space-y-2 text-sm">
//             <div><span className="font-medium">Artist:</span> {artistName}</div>
//             <div><span className="font-medium">Service:</span> {serviceName}</div>
//             <div><span className="font-medium">Event Date:</span> {new Date(selectedDate).toLocaleDateString('en-CA', {
//               weekday: 'long',
//               year: 'numeric',
//               month: 'long',
//               day: 'numeric'
//             })}</div>
//           </div>
//         </div>

//         {/* Appointment Schedule */}
//         <div className="border-b pb-4">
//           <h3 className="text-lg font-semibold text-gray-900 mb-3">Appointment Schedule</h3>
//           <div className="space-y-2 text-sm">
//             <div><span className="font-medium">📅 Appointment Start:</span> {getAppointmentStartTime(selectedTime)}</div>
//             <div><span className="font-medium">⏰ Ready Time:</span> {formatReadyTime(selectedTime)}</div>
//           </div>
//           <p className="text-xs text-gray-600 mt-2">
//             📍 Location: {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.province} {selectedAddress.postalCode}
//           </p>
//           <p className="text-xs text-gray-600 mt-1">
//             We'll start 2 hours before your ready time to ensure you're completely finished on schedule.
//           </p>
//         </div>

//         {/* Pricing Summary */}
//         <div className="border-b pb-4">
//           <h3 className="text-lg font-semibold text-gray-900 mb-3">Pricing Summary</h3>
//           <div className="space-y-2">
//             {/* Service Items */}
//             <ul className="space-y-2 mb-4">
//               {services.filter(service =>
//                 !service.includes('Subtotal:') &&
//                 !service.includes('HST (13%):') &&
//                 !service.includes('Total:') &&
//                 !service.includes('Deposit required')
//               ).map((service, index) => (
//                 <li key={index} className="flex items-start text-sm text-gray-700">
//                   <span className="text-gray-600 mr-2">•</span>
//                   <span className="flex-1">{service.split(':')[0]}</span>
//                   <span className="font-medium text-gray-900 ml-2">{service.split(':')[1]}</span>
//                 </li>
//               ))}
//             </ul>

//             {/* Summary Items */}
//             <div className="space-y-2 border-t border-gray-200 pt-3">
//               <div className="flex items-start text-sm text-gray-700">
//                 <span className="text-gray-600 mr-2">•</span>
//                 <span className="flex-1">Subtotal</span>
//                 <span className="font-medium text-gray-900 ml-2">{formatCurrency(subtotal)}</span>
//               </div>
//               <div className="flex items-start text-sm text-gray-700">
//                 <span className="text-gray-600 mr-2">•</span>
//                 <span className="flex-1">HST (13%)</span>
//                 <span className="font-medium text-gray-900 ml-2">{formatCurrency(hst)}</span>
//               </div>
//               <div className="flex items-start text-sm font-semibold text-gray-900">
//                 <span className="text-gray-600 mr-2">•</span>
//                 <span className="flex-1">Total (with 13% HST)</span>
//                 <span className="font-bold text-lg text-gray-900 ml-2">{formatCurrency(total)} CAD</span>
//               </div>
//               <div className="flex items-start text-sm font-medium text-purple-600">
//                 <span className="text-purple-600 mr-2">•</span>
//                 <span className="flex-1">Amount to Pay ({depositPercentage}%)</span>
//                 <span className="font-bold text-purple-600 ml-2">{formatCurrency(deposit)} CAD</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Terms & Conditions */}
//         <div className="border-b pb-4">
//           <h3 className="text-lg font-semibold text-gray-900 mb-3">Terms & Conditions</h3>
//           <div className="space-y-3 text-sm text-gray-700 max-h-64 overflow-y-auto">
//             <div>
//               <strong>Client Responsibilities:</strong>
//               <ul className="list-disc list-inside mt-1 space-y-1">
//                 <li>Provide accurate and detailed information regarding the desired makeup and hair services.</li>
//                 <li>Ensure a suitable location with proper lighting and access to an electrical outlet.</li>
//                 <li>Arrive with clean, dry hair and a clean face, free of makeup or hair products.</li>
//                 <li>Client is responsible for any parking fees incurred at the event location.</li>
//               </ul>
//             </div>

//             <div>
//               <strong>Cancellation Policy:</strong>
//               <ul className="list-disc list-inside mt-1 space-y-1">
//                 <li>The deposit is non-refundable if the client cancels.</li>
//                 <li>If the event is canceled less than 3 days before the scheduled date, the full remaining balance will still be due.</li>
//               </ul>
//             </div>

//             <div>
//               <strong>Liability:</strong>
//               <ul className="list-disc list-inside mt-1 space-y-1">
//                 <li>Looks By Anum is not responsible for allergic reactions or injuries resulting from the services provided.</li>
//                 <li>The client must inform the artist of any allergies or sensitivities before the service begins.</li>
//                 <li>The client agrees to hold Looks By Anum harmless from any claims related to the services rendered.</li>
//               </ul>
//             </div>

//             <div>
//               <strong>Payment Terms:</strong>
//               <ul className="list-disc list-inside mt-1 space-y-1">
//                 <li>The total price for the makeup and hair services is {formatCurrency(total)} CAD. A non-refundable deposit of {depositPercentage}% is required to secure your booking.</li>
//                 <li>The remaining balance will be due on the day of the event.</li>
//                 <li>Once we receive the deposit, your booking will be confirmed, and the date will be reserved exclusively for you.</li>
//                 <li>Please note that availability cannot be guaranteed until the deposit is received.</li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* Terms Agreement */}
//         <form onSubmit={handleSubmit}>
//           <div className="space-y-4">
//             <div>
//               <label className="flex items-start space-x-3">
//                 <input
//                   type="checkbox"
//                   checked={agreedToTerms}
//                   onChange={(e) => setAgreedToTerms(e.target.checked)}
//                   className="mt-1 w-4 h-4 text-gray-600 rounded focus:ring-gray-500"
//                   required
//                 />
//                 <span className="text-xs md:text-sm text-gray-700">
//                   I have read, understood, and agree to the terms and conditions outlined above. I acknowledge that by providing my digital signature below, I am entering into a legally binding contract.
//                 </span>
//               </label>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Digital Signature *
//               </label>
//               <p className="text-xs text-gray-600 mb-2">Please sign below to confirm your agreement to the booking and terms:</p>
//               <div className="w-full max-w-lg mx-auto">
//                 <SignatureCanvas
//                   onSignatureChange={handleSignatureChange}
//                   width={400}
//                   height={120}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-4 mt-6 md:mt-8">
//             <button
//               type="button"
//               onClick={onBack}
//               className="flex-1 bg-gray-200 text-black py-3 rounded-lg font-semibold hover:bg-gray-300 text-sm md:text-base cursor-pointer"
//             >
//               ← Edit Details
//             </button>
//             <button
//               type="submit"
//               disabled={!agreedToTerms || !signature}
//               className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base cursor-pointer"
//             >
//               Proceed to Payment
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
