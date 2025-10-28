import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Logo from '../assets/Black.png';

// Create API client with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://looksbyanum-saqib.vercel.app/api'
});

// Loading Spinner Component
const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// Upload Icon
const UploadIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

// Star Icon
const StarIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

// Interac Payment Section Component
function InteracPaymentSection({ bookingId, remainingAmount, processing, setProcessing, setError, setSuccess }) {
  const [interacInfo, setInteracInfo] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadInteracInfo();
  }, [bookingId]);

  const loadInteracInfo = async () => {
    try {
      const response = await api.get(`/interac/payment-info/${bookingId}`);
      setInteracInfo(response.data);
    } catch (error) {
      console.error('Failed to load Interac info:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setScreenshot(file);
      setError('');
    }
  };

  const uploadScreenshot = async () => {
    if (!screenshot) {
      setError('Please select a screenshot to upload');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('screenshot', screenshot);
      formData.append('bookingId', bookingId);
      formData.append('paymentType', 'final');

      await api.post('/interac/upload-screenshot', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Screenshot uploaded successfully! Your payment is being reviewed by our team.');
      setScreenshot(null);
      loadInteracInfo();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to upload screenshot');
    } finally {
      setUploading(false);
    }
  };

  if (!interacInfo) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Interac Payment Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm">
        <h4 className="font-medium text-gray-800 mb-4 uppercase tracking-wide text-sm">
          Interac E-Transfer Payment
        </h4>
        <div className="space-y-3 text-sm text-gray-700 font-light">
          <div className="flex justify-between">
            <span>Send payment to:</span>
            <span className="text-gray-900 font-medium">{interacInfo.interacEmail}</span>
          </div>
          <div className="flex justify-between">
            <span>Amount:</span>
            <span className="text-gray-900 font-semibold">${remainingAmount?.toFixed(2) || '0.00'} CAD</span>
          </div>
        </div>
        <div className="mt-4 p-3 bg-gray-100 border border-gray-300 rounded-lg">
          <p className="text-xs text-gray-700 font-light leading-relaxed">
            <strong className="text-gray-900 font-medium">Instructions:</strong> Send the remaining balance via Interac e-transfer to the email above, 
            <span className="text-red-500 font-medium">include your booking ID ({bookingId}) in the message</span>, then upload a screenshot of the payment confirmation below.
          </p>
        </div>
      </div>

      {/* Screenshot Upload */}
      {remainingAmount > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-800 uppercase tracking-wide">
            Upload Payment Screenshot
          </label>
          <label className="relative group block w-full cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
            />
            <div className="w-full px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-500 transition-all duration-300 text-center group-hover:bg-gray-50">
              <div className="flex items-center justify-center gap-2 text-sm font-light text-gray-700 group-hover:text-gray-900">
                <UploadIcon className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                <span>Click to upload screenshot</span>
              </div>
            </div>
          </label>
          {screenshot && (
            <p className="text-xs text-gray-600 font-light">Selected: {screenshot.name}</p>
          )}

          <button
            onClick={uploadScreenshot}
            disabled={uploading || !screenshot}
            className={`relative w-full py-3.5 rounded-xl font-light shadow-md transition-all duration-300 border overflow-hidden ${
              uploading || !screenshot
                ? "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300"
                : "bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white hover:shadow-lg hover:scale-[1.02] active:scale-100 cursor-pointer border-gray-600"
            }`}
            style={{ letterSpacing: "0.05em" }}
          >
            {!uploading && !(uploading || !screenshot) && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-out"></div>
            )}
            <span className="relative flex items-center justify-center gap-2.5">
              {uploading ? (
                <>
                  <LoadingSpinner />
                  Uploading...
                </>
              ) : (
                'Upload Payment Screenshot'
              )}
            </span>
          </button>
        </div>
      )}

      {/* Uploaded Screenshots */}
      {interacInfo.screenshots && interacInfo.screenshots.length > 0 && (
        <div className="mt-6">
          <h5 className="text-sm font-medium text-gray-800 mb-3 uppercase tracking-wide">
            Uploaded Screenshots
          </h5>
          <div className="space-y-3">
            {interacInfo.screenshots
              .filter(screenshot => screenshot.payment_type === 'final')
              .map((screenshot, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl text-sm border font-light ${
                    screenshot.admin_verified
                      ? "bg-green-50 border-green-200"
                      : "bg-yellow-50 border-yellow-200"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-medium ${screenshot.admin_verified ? "text-green-800" : "text-yellow-800"}`}>
                      {screenshot.payment_type === "final" ? "Final" : "Deposit"} Payment
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      screenshot.admin_verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {screenshot.admin_verified ? "Verified ✓" : "Pending Review"}
                    </span>
                  </div>
                  <p className={`text-xs ${screenshot.admin_verified ? "text-green-700" : "text-yellow-700"}`}>
                    Uploaded: {new Date(screenshot.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RemainingPayment() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [step, setStep] = useState('lookup');
  const [lookupMethod, setLookupMethod] = useState('booking-id');
  const [bookingId, setBookingId] = useState('');
  const [email, setEmail] = useState('');
  const [booking, setBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  useEffect(() => {
    const bookingIdFromUrl = searchParams.get('booking_id');
    const bookingFromState = location.state?.booking;
    const bookingIdFromState = location.state?.bookingId;

    if (bookingFromState) {
      setBooking(bookingFromState);
      setStep('confirm');
    } else if (bookingIdFromUrl || bookingIdFromState) {
      const bid = bookingIdFromUrl || bookingIdFromState;
      setBookingId(bid);
      setLookupMethod('booking-id');
      setLoading(true);
      handleAutoLookup(bid);
    }
  }, [searchParams, location.state]);

  const handleAutoLookup = async (autoBookingId) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await api.get(`/bookings/lookup/${autoBookingId}`);
      setBooking(response.data);
      setStep('confirm');
    } catch (error) {
      setError('Invalid or expired payment link. Please enter your booking ID manually.');
      setStep('lookup');
    } finally {
      setLoading(false);
    }
  };

  const handleLookupBooking = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (lookupMethod === 'booking-id') {
        if (!bookingId.trim()) {
          setError('Please enter your booking ID');
          return;
        }
        
        const response = await api.get(`/bookings/lookup/${bookingId.trim()}`);
        setBooking(response.data);
        setStep('confirm');
      } else {
        if (!email.trim()) {
          setError('Please enter your email address');
          return;
        }
        
        const response = await api.post('/bookings/lookup-by-email', { email: email.trim() });
        setBookings(response.data.bookings);
        setStep('select');
      }
    } catch (error) {
      setError(error.response?.data?.details || 'Failed to find booking. Please check your information and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBooking = (selectedBooking) => {
    setBooking(selectedBooking);
    setStep('confirm');
  };

  const handleProcessPayment = async () => {
    if (paymentMethod === 'stripe') {
      setLoading(true);
      setError('');
      
      try {
        const response = await api.post('/stripe/create-remaining-payment-session', {
          booking_id: booking.booking_id
        });
        
        window.location.href = response.data.url;
      } catch (error) {
        setError(error.response?.data?.details || 'Failed to process payment. Please try again.');
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-CA');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <img src={Logo} alt="Logo" className="w-[180px] sm:w-[220px] lg:w-[260px] mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl font-normal text-gray-900 mb-2" style={{ letterSpacing: "0.02em" }}>
            Complete Your Payment
          </h1>
          <div className="h-0.5 w-20 bg-gray-800 rounded-full mx-auto mb-3"></div>
          <p className="text-gray-600 font-light" style={{ letterSpacing: "0.01em" }}>
            Pay the remaining balance for your booking
          </p>
        </div>

        {/* Loading State */}
        {loading && step === 'lookup' && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-gray-700 animate-spin"></div>
            </div>
            <h2 className="text-xl font-normal text-gray-900 mb-2" style={{ letterSpacing: "0.02em" }}>
              Loading Your Booking
            </h2>
            <p className="text-gray-600 font-light">Please wait...</p>
          </div>
        )}

        {/* Lookup Step */}
        {step === 'lookup' && !loading && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-normal text-gray-900 mb-6" style={{ letterSpacing: "0.02em" }}>
              Find Your Booking
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex space-x-4">
                <label className="flex items-center font-light">
                  <input
                    type="radio"
                    value="booking-id"
                    checked={lookupMethod === 'booking-id'}
                    onChange={(e) => setLookupMethod(e.target.value)}
                    className="mr-2 text-gray-800 focus:ring-gray-500"
                  />
                  <span>I have my Booking ID</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              {lookupMethod === 'booking-id' && (
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2 uppercase tracking-wide">
                    Booking ID
                  </label>
                  <input
                    type="text"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    placeholder="Enter your booking ID (e.g., BB123abc)"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-700/40 focus:border-gray-700 transition-all text-gray-900 placeholder-gray-500 font-light"
                    style={{ letterSpacing: "0.01em" }}
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm font-light">{error}</p>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={handleLookupBooking}
                disabled={loading}
                className="relative w-full py-3.5 rounded-xl font-light shadow-md transition-all duration-300 border overflow-hidden bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white hover:shadow-lg hover:scale-[1.02] active:scale-100 cursor-pointer border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ letterSpacing: "0.05em" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-out"></div>
                <span className="relative flex items-center justify-center gap-2.5">
                  {loading && <LoadingSpinner />}
                  {loading ? 'Searching...' : 'Find My Booking'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Confirm Payment Step */}
        {step === 'confirm' && booking && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-normal text-gray-900 mb-6" style={{ letterSpacing: "0.02em" }}>
              Confirm Payment
            </h2>
            
            <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-4 uppercase tracking-wide text-sm">
                Booking Details
              </h3>
              <div className="space-y-2.5 text-sm font-light">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="text-gray-900 font-medium">{booking.booking_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="text-gray-900 font-medium">{booking.service_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Event Date:</span>
                  <span className="text-gray-900 font-medium">{formatDate(booking.event_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="text-gray-900 font-medium">${booking.pricing?.quote_total?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="text-gray-900 font-medium">${booking.pricing?.amount_paid?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between font-medium text-base border-t border-gray-300 pt-3 mt-3">
                  <span className="text-gray-900">Remaining Balance:</span>
                  <span className="text-gray-900 font-semibold">${booking.pricing?.remaining_amount?.toFixed(2) || '0.00'} CAD</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-4 uppercase tracking-wide text-sm">
                Choose Payment Method
              </h3>
              
              {/* Coupon Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <StarIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-900 text-base">
                      Coupon Discounts Available!
                    </p>
                    <p className="text-blue-800 font-light text-sm">
                      Apply coupon codes only through Credit/Debit Card (Stripe) payments
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 mb-6">
                {/* Stripe Option */}
                <div 
                  className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 ${
                    paymentMethod === 'stripe' 
                      ? 'border-gray-600 bg-gray-50 shadow-md' 
                      : 'border-gray-200 bg-white hover:border-gray-400'
                  }`}
                  onClick={() => setPaymentMethod('stripe')}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={() => setPaymentMethod('stripe')}
                      className="text-gray-800 focus:ring-gray-500 focus:ring-2"
                    />
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      paymentMethod === 'stripe' ? "bg-gray-800 border border-gray-600" : "bg-gray-100 border border-gray-300"
                    }`}>
                      <svg className={`w-6 h-6 ${paymentMethod === 'stripe' ? "text-white" : "text-gray-600"}`} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v2h16V6H4zm0 4v8h16v-8H4z"/>
                      </svg>
                    </div>
                    <div>
                      <p className={`font-medium ${paymentMethod === 'stripe' ? "text-gray-900" : "text-gray-700"}`}>
                        Credit/Debit Card
                      </p>
                      <p className={`text-sm font-light ${paymentMethod === 'stripe' ? "text-gray-700" : "text-gray-500"}`}>
                        Powered by Stripe
                      </p>
                    </div>
                  </div>
                </div>

                {/* Interac Option */}
                <div 
                  className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 ${
                    paymentMethod === 'interac' 
                      ? 'border-gray-600 bg-gray-50 shadow-md' 
                      : 'border-gray-200 bg-white hover:border-gray-400'
                  }`}
                  onClick={() => setPaymentMethod('interac')}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="interac"
                      checked={paymentMethod === 'interac'}
                      onChange={() => setPaymentMethod('interac')}
                      className="text-gray-800 focus:ring-gray-500 focus:ring-2"
                    />
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      paymentMethod === 'interac' ? "bg-gray-800 border border-gray-600" : "bg-gray-100 border border-gray-300"
                    }`}>
                      <svg className={`w-6 h-6 ${paymentMethod === 'interac' ? "text-white" : "text-gray-600"}`} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <div>
                      <p className={`font-medium ${paymentMethod === 'interac' ? "text-gray-900" : "text-gray-700"}`}>
                        Interac E-Transfer
                      </p>
                      <p className={`text-sm font-light ${paymentMethod === 'interac' ? "text-gray-700" : "text-gray-500"}`}>
                        Send payment via Interac
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm font-light">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-600 text-sm font-light">{success}</p>
              </div>
            )}

            <div className="space-y-4">
              {paymentMethod === 'stripe' ? (
                <button
                  onClick={handleProcessPayment}
                  disabled={loading}
                  className="relative w-full py-3.5 rounded-xl font-light shadow-md transition-all duration-300 border overflow-hidden bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white hover:shadow-lg hover:scale-[1.02] active:scale-100 cursor-pointer border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ letterSpacing: "0.05em" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-out"></div>
                  <span className="relative flex items-center justify-center gap-2.5">
                    {loading && <LoadingSpinner />}
                    {loading ? 'Processing...' : `Pay $${booking.pricing?.remaining_amount?.toFixed(2) || '0.00'}`}
                  </span>
                </button>
              ) : paymentMethod === 'interac' ? (
                <InteracPaymentSection 
                  bookingId={booking.booking_id}
                  remainingAmount={booking.pricing?.remaining_amount}
                  processing={loading}
                  setProcessing={setLoading}
                  setError={setError}
                  setSuccess={setSuccess}
                />
              ) : null}

              <div className="text-center mt-6">
                <button
                  onClick={() => setStep('lookup')}
                  className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all text-sm"
                >
                  Back to Search
                </button>
              </div>
            </div>
          </div> 
        )}
      </div>
    </div>
  );
}