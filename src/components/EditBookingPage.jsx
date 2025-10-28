import React, { useState } from "react"
import EditBookingLookup from "../components/EditBookingLookup"

export default function EditBookingPage() {
  const [bookingLoaded, setBookingLoaded] = useState(false)
  const [bookingData, setBookingData] = useState(null)

  const handleBookingLoaded = (data) => {
    setBookingLoaded(true)
    setBookingData(data)
  }

  const handleBack = () => {
    window.history.back()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {!bookingLoaded ? (
          <EditBookingLookup
            onBookingLoaded={handleBookingLoaded}
            onBack={handleBack}
          />
        ) : (
          <div className="text-center text-gray-800 mt-20">
            <h2 className="text-2xl font-light mb-4">
              Booking Found & Loaded
            </h2>
            <p className="text-gray-600 mb-6">
              Here you can show booking details or a form to edit them.
            </p>
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-all"
            >
              Go Back
            </button>
          </div>
        )} 
      </div>
    </div>
  )
}
