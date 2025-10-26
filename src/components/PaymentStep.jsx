import { loadStripe } from '@stripe/stripe-js';
import React, { useState } from 'react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE);

export default function PaymentStep({ onBack, booking, quote, onPaymentSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedBooking, setSavedBooking] = useState(null);

  // Get consistent API base URL
  const apiBase = import.meta.env.VITE_API_URL || 'https://looksbyanum-saqib.vercel.app/api';

  const handlePayment = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      console.log('Creating/updating booking...');
      
      // 1) Persist the booking first so we have a booking_id
      const saveRes = await fetch(`${apiBase}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });
      
      if (!saveRes.ok) {
        const err = await saveRes.json().catch(() => ({}));
        const message = err?.error || err?.details?.formErrors?.join?.(', ') || 'Failed to save booking';
        throw new Error(message);
      }
      
      const saved = await saveRes.json();
      const bookingToUse = saved.booking || booking;
      setSavedBooking(bookingToUse);
      
      console.log('Booking saved:', bookingToUse);
      console.log('Creating Stripe checkout session...');

      // 2) Create checkout session using saved booking (includes booking_id)
      const response = await fetch(`${apiBase}/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ booking: bookingToUse })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Payment session creation failed');
      }

      const session = await response.json();
      
      console.log('Stripe session created:', session.id);

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id
      });

      if (error) {
        throw new Error(error.message);
      }

    } catch (error) {
      console.error('Payment error:', error);
      window.showToast(`Payment failed: ${error.message}`, 'error');
      setIsProcessing(false);
    }
  };

  const handleInteracVerification = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Use the saved booking or original booking
      const bookingToUse = savedBooking || booking;
      const bookingId = bookingToUse?.unique_id || bookingToUse?.booking_id;
      
      if (!bookingId) {
        throw new Error('Booking ID not found');
      }
      
      const response = await fetch(`${apiBase}/interac/auth-url?bookingId=${bookingId}`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to get Interac auth URL');
      }

      const data = await response.json();
      window.location.href = data.authUrl;
    } catch (error) {
      console.error('Interac verification error:', error);
      window.showToast(`Verification failed: ${error.message}`, 'error');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-sm md:max-w-2xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-sm md:text-2xl font-bold text-gray-900 mb-2 md:mb-8 text-left">
        Payment & Booking Confirmation
      </h2>
      
      {/* Quote Summary */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">Quote Summary</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Service Type:</span>
            <span className="font-medium">{booking.service_type}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Region:</span>
            <span className="font-medium">{booking.region}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Event Date:</span>
            <span className="font-medium">{booking.event_date}</span>
          </div>
          
          <hr className="my-4" />
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Quote:</span>
            <span className="font-medium">${quote.quote_total?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold text-indigo-600">
            <span>Deposit Required:</span>
            <span>${quote.deposit_amount?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Remaining Balance:</span>
            <span>${quote.remaining_amount?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-8">
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
        
        {/* Payment Method Selection */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Stripe Option */}
          <div 
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              paymentMethod === 'stripe' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => setPaymentMethod('stripe')}
          >
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
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v2h16V6H4zm0 4v8h16v-8H4z"/>
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Credit/Debit Card</p>
                <p className="text-sm text-gray-600">Powered by Stripe</p>
              </div>
            </div>
          </div>

          {/* Interac Option */}
          <div 
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              paymentMethod === 'interac' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => setPaymentMethod('interac')}
          >
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
                <p className="font-medium text-gray-900">Interac Verification</p>
                <p className="text-sm text-gray-600">Identity verification</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Details */}
        {paymentMethod === 'stripe' && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-4">
            <div className="flex items-center gap-3">
              <div className="text-blue-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v2h16V6H4zm0 4v8h16v-8H4z"/>
                </svg>
              </div>
              <div>
                <p className="text-lg font-bold text-indigo-700">Secure Card Payment</p>
                <p className="text-sm text-gray-600">Your payment information is secure and encrypted</p>
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'interac' && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-4">
            <div className="flex items-center gap-3">
              <div className="text-blue-600">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div>
                <p className="font-medium text-blue-900">Interac Identity Verification</p>
                <p className="text-sm text-blue-700">Verify your identity using Interac Hub for enhanced security</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Terms and Conditions */}
      <div className="mb-8">
        <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <input
            type="checkbox"
            id="terms"
            required
            className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <div>
            <label htmlFor="terms" className="text-sm text-gray-900">
              I agree to the{' '}
              <a href="#" className="text-indigo-600 hover:text-indigo-700 underline">
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a href="#" className="text-indigo-600 hover:text-indigo-700 underline">
                Cancellation Policy
              </a>
            </label>
            <p className="text-xs text-gray-600 mt-1">
              By proceeding, you confirm the booking details and agree to pay the deposit amount.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="px-3 py-1.5 md:px-8 md:py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        
        {paymentMethod === 'stripe' ? (
          <button
            type="button"
            onClick={handlePayment}
            disabled={isProcessing}
            className="px-3 py-1.5 md:px-8 md:py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 text-sm md:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : `Pay Deposit $${quote.deposit_amount?.toFixed(2) || '0.00'}`}
          </button>
        ) : paymentMethod === 'interac' ? (
          <button
            type="button"
            onClick={handleInteracVerification}
            disabled={isProcessing}
            className="px-3 py-1.5 md:px-8 md:py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 text-sm md:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Start Identity Verification'}
          </button>
        ) : null}
      </div>
    </div>
  );
}