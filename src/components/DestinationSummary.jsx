import React, { useState } from 'react';
import axios from 'axios';

// Create API client with base URL
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "https://looksbyanum-saqib.vercel.app/api/",
});

export default function DestinationSummary({ onNext, onBack, getValues }) {
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmBooking = async () => {
    setIsProcessing(true);
    
    try {
      const data = getValues();
      
      // Create booking with destination wedding details
      const bookingData = {
        // Basic contact info
        name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
        email: data.email,
        phone: data.phone,

        // Region and service type
        region: data.region,
        subRegion: data.subRegion,
        service_type: data.service_type,
        service_mode: data.service_mode,

        // Destination wedding specific fields
        event_start_date: data.event_start_date,
        event_end_date: data.event_end_date,
        destination_details: data.destination_details,

        // Pricing set to 0 for destination weddings (custom quote to be sent later)
        pricing: {
          quote_total: 0,
          deposit_amount: 0,
          deposit_percentage: 0,
          remaining_amount: 0,
          amount_paid: 0,
        },

        // Status
        status: "lead",
        payment_status: "pending",

        // Inspiration
        inspiration_link: data.inspiration_link || "",
        inspiration_images: Array.isArray(data.inspiration_images)
          ? data.inspiration_images
          : [],
      };

      console.log("Creating destination wedding booking with data:", bookingData);
      
      const response = await api.post("/bookings", bookingData);
      console.log("Destination wedding booking created:", response.data);

      // Show success message
      setBookingConfirmed(true);
      
      // Show toast notification
      if (window.showToast) {
        window.showToast(
          "Thank you! Your destination wedding consultation has been scheduled. We'll contact you soon with a custom quote.",
          "success"
        );
      }
      
    } catch (error) {
      console.error("Failed to create destination wedding booking:", error);
      console.error("Error details:", error.response?.data || error.message);
      
      if (window.showToast) {
        window.showToast(
          "Failed to confirm booking. Please try again or contact support.",
          "error"
        );
      }
      
      setIsProcessing(false);
    }
  };

  if (bookingConfirmed) {
    return (
      <div className="max-w-sm md:max-w-2xl mx-auto p-4 md:p-8 glass-card text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Booking Confirmed! 🎉
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Thank you for scheduling your destination wedding consultation.
          </p>
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <p className="text-green-800 text-sm leading-relaxed">
              Your consultation has been scheduled successfully. Our team will review your destination wedding details and contact you within 24-48 hours with a custom quote tailored to your special day.
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 rounded-lg font-semibold transition-all duration-200 bg-gray-900 text-white hover:bg-gray-700 focus:ring-4 focus:ring-indigo-200"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-sm md:max-w-2xl mx-auto p-4 md:p-8 glass-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-left">
        Booking Summary
      </h2>

      <div className="bg-gray-50 p-6 rounded-lg mb-8 border-2 border-gray-200">
        <div className="space-y-4 text-gray-800">
          <div className="flex justify-between">
            <span className="font-semibold">Service Type:</span>
            <span>{getValues('service_type')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Region:</span>
            <span>{getValues('region')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Event Start Date:</span>
            <span>{getValues('event_start_date')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Event End Date:</span>
            <span>{getValues('event_end_date')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Destination Details:</span>
            <span className="text-right max-w-xs">{getValues('destination_details')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Client:</span>
            <span>{getValues('first_name')} {getValues('last_name')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Email:</span>
            <span>{getValues('email')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Phone:</span>
            <span>{getValues('phone')}</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-8 border border-blue-200">
        <p className="text-blue-800 text-sm">
          We'll contact you with a custom quote for destination wedding services.
        </p>
      </div>

      <div className="flex justify-between gap-5 pt-6 sm:pt-8 border-t border-gray-200 max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="group relative px-5 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-light rounded-lg transition-all duration-300 overflow-hidden bg-gray-200 text-gray-900 shadow-md shadow-gray-400/20 hover:bg-gray-300 hover:scale-[1.02] active:scale-100 cursor-pointer border border-gray-400"
          >
            Back
          </button>

          <button
            type="submit"
            onClick={handleConfirmBooking}
            className="relative px-8 sm:px-10 py-2.5 sm:py-3 text-sm sm:text-base font-light rounded-lg transition-all duration-300 overflow-hidden
            bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white
            shadow-md shadow-gray-700/20 hover:shadow-lg hover:shadow-gray-700/30
            hover:scale-[1.02] active:scale-100 cursor-pointer border border-gray-600"
          >
            Continue
          </button> 
        </div> 
        <div className="mt-8 flex justify-center">
            <div>
            <p className="inline-block">
                Want to start Over?
            </p>
            <a href="/" className="pl-2 text-blue-700">Go to First Step</a>
            </div>
        </div>
    </div>
  );
}


