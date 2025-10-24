import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import axios from 'axios';

// Create API client with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://looksbyanum-saqib.vercel.app/api'
});

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
      formData.append('paymentType', 'final'); // Always final for remaining payments

      await api.post('/interac/upload-screenshot', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Screenshot uploaded successfully! Your payment is being reviewed by our team.');
      setScreenshot(null);
      loadInteracInfo(); // Refresh info
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to upload screenshot');
    } finally {
      setUploading(false);
    }
  };

  if (!interacInfo) {
    return (
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-blue-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-blue-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
      {/* Interac Payment Instructions */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-3">Interac E-Transfer Payment Instructions</h4>
        <div className="bg-white p-3 rounded border mb-3">
          <p className="text-sm text-gray-600 mb-2">
            Send <strong>${remainingAmount?.toFixed(2) || '0.00'}</strong> via Interac e-transfer to:
          </p>
          <p className="font-mono text-sm bg-gray-100 p-2 rounded text-black">
            {interacInfo.interacEmail}
          </p>
        </div>
        <div className="text-sm text-gray-600">
          <strong>Instructions:</strong> Send the remaining balance via Interac e-transfer to the email above, 
          include your booking ID ({bookingId}) in the message. After sending, upload a screenshot below for verification.
        </div>
      </div>

      {/* Screenshot Upload - Only show if there is remaining balance */}
      {remainingAmount > 0 && (
        <div className="border-t border-blue-200 pt-4">
          <h5 className="font-medium text-gray-900 mb-3">Upload Payment Screenshot</h5>
          
          <div className="space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            
            {screenshot && (
              <div className="flex items-center gap-3">
                <img 
                  src={URL.createObjectURL(screenshot)} 
                  alt="Screenshot preview" 
                  className="w-16 h-16 object-cover rounded border"
                />
                <span className="text-sm text-gray-600">{screenshot.name}</span>
              </div>
            )}
            
            <button
              onClick={uploadScreenshot}
              disabled={!screenshot || uploading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? 'Uploading...' : 'Upload Screenshot'}
            </button>
          </div>
        </div>
      )}

      {/* Uploaded Screenshots */}
      {interacInfo.screenshots && interacInfo.screenshots.length > 0 && (
        <div className="border-t border-blue-200 pt-4 mt-4">
          <h5 className="font-medium text-gray-900 mb-3">Uploaded Screenshots</h5>
          <div className="space-y-2">
            {interacInfo.screenshots
              .filter(screenshot => screenshot.payment_type === 'final')
              .map((screenshot, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                <div className="flex items-center gap-3">
                  <img 
                    src={screenshot.screenshot_url} 
                    alt={`Screenshot ${index + 1}`} 
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="text-sm font-medium">Screenshot {index + 1}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(screenshot.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  screenshot.admin_verified 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-gray-500'
                }`}>
                  {screenshot.admin_verified ? 'Verified' : 'Pending Review'}
                </div>
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
  const [step, setStep] = useState('lookup'); // 'lookup', 'confirm', 'processing'
  const [lookupMethod, setLookupMethod] = useState('booking-id'); // 'booking-id' or 'email'
  const [bookingId, setBookingId] = useState('');
  const [email, setEmail] = useState('');
  const [booking, setBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  // Check for booking_id in URL parameters or state
  useEffect(() => {
    const bookingIdFromUrl = searchParams.get('booking_id');
    const bookingFromState = location.state?.booking;
    const bookingIdFromState = location.state?.bookingId;

    if (bookingFromState) {
      // Booking data passed in state
      setBooking(bookingFromState);
      setStep('confirm');
    } else if (bookingIdFromUrl || bookingIdFromState) {
      // Booking ID passed in URL or state
      const bid = bookingIdFromUrl || bookingIdFromState;
      setBookingId(bid);
      setLookupMethod('booking-id');
      setLoading(true);
      // Auto-lookup the booking
      handleAutoLookup(bid);
    }
  }, [searchParams, location.state]);

  // Load PayPal script when payment method changes
  React.useEffect(() => {
    if (paymentMethod === 'paypal' && !paypalLoaded && booking) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID || 'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R'}&currency=CAD&components=buttons`;
      script.onload = () => {
        setPaypalLoaded(true);
        if (window.paypal) {
          window.paypal.Buttons({
            createOrder: async () => {
              const response = await api.post('/paypal/create-order', {
                booking: { unique_id: booking.booking_id },
                paymentType: 'remaining_balance'
              });
              const order = response.data;
              return order.id;
            },
            onApprove: async (data) => {
              const response = await api.post(`/paypal/capture-order/${data.orderID}`);
              const result = response.data;
              if (result.success) {
                window.location.href = `/success?payment_method=paypal&session_id=${data.orderID}&booking_id=${bookingId}`;
              } else {
                setError('Payment failed');
              }
            }
          }).render('#paypal-button-container-remaining');
        }
      };
      document.body.appendChild(script);
    }
  }, [paymentMethod, paypalLoaded, booking]);

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
        
        // Redirect to Stripe Checkout
        window.location.href = response.data.url;
      } catch (error) {
        setError(error.response?.data?.details || 'Failed to process payment. Please try again.');
        setLoading(false);
      }
    }
    // PayPal payment is handled by the PayPal buttons
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-CA');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
          <p className="text-gray-600">Pay the remaining balance for your booking</p>
        </div>

        {/* Loading State for Auto-lookup */}
        {loading && step === 'lookup' && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Your Booking</h2>
            <p className="text-gray-600">Please wait while we retrieve your booking information...</p>
          </div>
        )}

        {/* Lookup Step */}
        {step === 'lookup' && !loading && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Find Your Booking</h2>
            
            {/* Lookup Method Selection */}
            <div className="space-y-4 mb-6">
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="booking-id"
                    checked={lookupMethod === 'booking-id'}
                    onChange={(e) => setLookupMethod(e.target.value)}
                    className="mr-2"
                  />
                  <span>I have my Booking ID</span>
                </label>
                {/* <label className="flex items-center">
                  <input
                    type="radio"
                    value="email"
                    checked={lookupMethod === 'email'}
                    onChange={(e) => setLookupMethod(e.target.value)}
                    className="mr-2"
                  />
                  <span>Lookup by Email</span>
                </label> */}
              </div>
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
              {lookupMethod === 'booking-id' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Booking ID
                  </label>
                  <input
                    type="text"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    placeholder="Enter your booking ID (e.g., BB123abc)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={handleLookupBooking}
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {loading ? 'Searching...' : 'Find My Booking'}
              </button>
            </div>
          </div>
        )}

        {/* Select Booking Step */}
        {step === 'select' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Your Booking</h2>
            
            {bookings.length === 0 ? (
              <p className="text-gray-600">No bookings found for this email address.</p>
            ) : (
              <div className="space-y-4">
                {bookings.map((bookingOption) => (
                  <div key={bookingOption.booking_id} className="border border-gray-200 rounded-lg p-4 hover:border-pink-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">Booking #{bookingOption.booking_id}</h3>
                        <p className="text-sm text-gray-600">Event: {formatDate(bookingOption.event_date)}</p>
                        <p className="text-sm text-gray-600">Service: {bookingOption.service_type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-pink-600">${bookingOption.pricing?.remaining_amount?.toFixed(2) || '0.00'}</p>
                        <p className="text-sm text-gray-600">Remaining</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelectBooking(bookingOption)}
                      className="w-full bg-purple-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-purple-700 transition-colors cursor-pointer"
                    >
                      Select This Booking
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={() => setStep('lookup')}
                className="px-4 py-2 md:px-6 md:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer text-sm md:text-base"
              >
                ← Back to Search
              </button>
            </div>
          </div>
        )}

        {/* Confirm Payment Step */}
        {step === 'confirm' && booking && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Confirm Payment</h2>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Booking Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-medium">{booking.booking_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium">{booking.service_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Event Date:</span>
                  <span className="font-medium">{formatDate(booking.event_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium">${booking.pricing?.quote_total?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-medium">${booking.pricing?.amount_paid?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t border-gray-300 pt-2 mt-2">
                  <span className="text-gray-900">Remaining Balance:</span>
                  <span className="text-pink-600">${booking.pricing?.remaining_amount?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Choose Payment Method</h3>
              
              {/* Coupon Discount Notice */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="text-purple-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-purple-800 text-lg">🎟️ Coupon Discounts Available!</p>
                    <p className="text-purple-700 font-medium">Apply coupon codes only through Credit/Debit Card (Stripe) payments</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-4 mb-4">
                {/* Stripe Option */}
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === 'stripe' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setPaymentMethod('stripe')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="stripe"
                        checked={paymentMethod === 'stripe'}
                        onChange={() => setPaymentMethod('stripe')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div className="text-blue-600">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v2h16V6H4zm0 4v8h16v-8H4z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Credit/Debit Card</p>
                        <p className="text-sm text-gray-600">Powered by Stripe</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PayPal Option */}
                {/* <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === 'paypal' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={() => setPaymentMethod('paypal')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div className="text-blue-600">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.622 1.566 1.035.974 1.481 2.408 1.34 3.948-.013.104-.023.208-.033.31l.196 1.42c.043.31.068.625.084.94.263 5.224-1.835 8.167-6.704 8.167h-2.128c-.492 0-.889.322-.983.796l-.553 2.628c-.054.257-.226.44-.491.47zm1.425-16.53H6.77c-.813 0-1.428.183-1.865.547-.416.347-.683.895-.683 1.605 0 .406.063.74.187 1.004.122.26.344.438.645.534.302.096.668.143 1.092.143h.75c.875 0 1.591-.221 2.14-.662.545-.441.817-1.028.817-1.756 0-.72-.269-1.314-.807-1.76-.544-.448-1.257-.67-2.125-.67z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">PayPal</p>
                        <p className="text-sm text-gray-600">Pay with PayPal account</p>
                      </div>
                    </div>
                  </div>
                </div> */}

                {/* Interac Option */}
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === 'interac' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setPaymentMethod('interac')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="interac"
                        checked={paymentMethod === 'interac'}
                        onChange={() => setPaymentMethod('interac')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div className="text-blue-600">
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Interac E-Transfer</p>
                        <p className="text-sm text-gray-600">Send payment via Interac</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}

            <div className="space-y-4">
              {paymentMethod === 'stripe' ? (
                <button
                  onClick={handleProcessPayment}
                  disabled={loading}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Processing...
                    </>
                  ) : (
                    `Pay Remaining Balance $${booking.pricing?.remaining_amount?.toFixed(2) || '0.00'}`
                  )}
                </button>
              ) : /* paymentMethod === 'paypal' ? (
                <div id="paypal-button-container-remaining" className="paypal-button-container"></div>
              ) : */ paymentMethod === 'interac' ? (
                <InteracPaymentSection 
                  bookingId={booking.booking_id}
                  remainingAmount={booking.pricing?.remaining_amount}
                  processing={loading}
                  setProcessing={setLoading}
                  setError={setError}
                  setSuccess={setSuccess}
                />
              ) : null}

              <div className="text-center">
                <button
                  onClick={() => setStep('lookup')}
                  className="px-4 py-2 md:px-6 md:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer text-sm md:text-base"
                >
                  ← Back to Search
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
