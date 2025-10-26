import { loadStripe } from '@stripe/stripe-js';
import React, { useState } from 'react';
import { formatCurrency } from '../../lib/currencyFormat';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE);

export default function PaymentStep({ onBack, booking, quote, onPaymentSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  // Load PayPal script
  React.useEffect(() => {
    if (paymentMethod === 'paypal' && !paypalLoaded) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID || 'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R'}&currency=CAD&components=buttons`;
      script.onload = () => {
        setPaypalLoaded(true);
        if (window.paypal) {
          window.paypal.Buttons({
            createOrder: async () => {
              const apiBase = import.meta.env.VITE_API_URL || 'https://looksbyanum-saqib.vercel.app/api';
              const response = await fetch(`${apiBase}/paypal/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ booking, paymentType: 'deposit' })
              });
              const order = await response.json();
              return order.id;
            },
            onApprove: async (data) => {
              const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
              const response = await fetch(`${apiBase}/paypal/capture-order/${data.orderID}`, {
                method: 'POST'
              });
              const result = await response.json();
              if (result.success) {
                onPaymentSuccess && onPaymentSuccess();
              } else {
                window.showToast('Payment failed', 'error');
              }
            }
          }).render('#paypal-button-container');
        }
      };
      document.body.appendChild(script);
    }
  }, [paymentMethod, paypalLoaded, booking, onPaymentSuccess]);
  const handlePayment = async () => {
    try {
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

      // 1) Persist the booking first so we have a booking_id
      const saveRes = await fetch(`${apiBase}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });
      if (!saveRes.ok) {
        const err = await saveRes.json().catch(() => ({}));
        // Show a readable message from zod errors if present
        const message = err?.error || err?.details?.formErrors?.join?.(', ') || 'Failed to save booking';
        throw new Error(message);
      }
      const saved = await saveRes.json();
      const savedBooking = saved.booking || booking;

      // 2) Create checkout session using saved booking (includes booking_id)
      const response = await fetch(`${apiBase}/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ booking: savedBooking })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Payment session creation failed');
      }

      const session = await response.json();

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
    }
  };

  const handleInteracVerification = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'https://looksbyanum-saqib.vercel.app/api';
      const response = await fetch(`${apiBase}/interac/auth-url?bookingId=${savedBooking?.unique_id || booking.unique_id}`, {
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

          {/* PayPal Option */}
          {/* <div 
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              paymentMethod === 'paypal' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => setPaymentMethod('paypal')}
          >
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
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.622 1.566 1.035.974 1.481 2.408 1.34 3.948-.013.104-.023.208-.033.31l.196 1.42c.043.31.068.625.084.94.263 5.224-1.835 8.167-6.704 8.167h-2.128c-.492 0-.889.322-.983.796l-.553 2.628c-.054.257-.226.44-.491.47zm1.425-16.53H6.77c-.813 0-1.428.183-1.865.547-.416.347-.683.895-.683 1.605 0 .406.063.74.187 1.004.122.26.344.438.645.534.302.096.668.143 1.092.143h.75c.875 0 1.591-.221 2.14-.662.545-.441.817-1.028.817-1.756 0-.72-.269-1.314-.807-1.76-.544-.448-1.257-.67-2.125-.67z"/>
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">PayPal</p>
                <p className="text-sm text-gray-600">Pay with PayPal account</p>
              </div>
            </div>
          </div> */}
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

        {/* Payment Method Details */}
        {paymentMethod === 'stripe' && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
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

        {/* {paymentMethod === 'paypal' && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="text-blue-600">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.622 1.566 1.035.974 1.481 2.408 1.34 3.948-.013.104-.023.208-.033.31l.196 1.42c.043.31.068.625.084.94.263 5.224-1.835 8.167-6.704 8.167h-2.128c-.492 0-.889.322-.983.796l-.553 2.628c-.054.257-.226.44-.491.47zm1.425-16.53H6.77c-.813 0-1.428.183-1.865.547-.416.347-.683.895-.683 1.605 0 .406.063.74.187 1.004.122.26.344.438.645.534.302.096.668.143 1.092.143h.75c.875 0 1.591-.221 2.14-.662.545-.441.817-1.028.817-1.756 0-.72-.269-1.314-.807-1.76-.544-.448-1.257-.67-2.125-.67z"/>
                </svg>
              </div>
              <div>
                <p className="font-medium text-blue-900">PayPal Payment</p>
                <p className="text-sm text-blue-700">Pay securely with your PayPal account</p>
              </div>
            </div>
          </div>
        )} */}

        {paymentMethod === 'interac' && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
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
          className="px-3 py-1.5 md:px-8 md:py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
        >
          Back
        </button>
        
        {paymentMethod === 'stripe' ? (
          <button
            type="button"
            onClick={handlePayment}
            className="px-3 py-1.5 md:px-8 md:py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 text-sm md:text-lg"
          >
            Pay Deposit ${quote.deposit_amount?.toFixed(2) || '0.00'}
          </button>
        ) : /* paymentMethod === 'paypal' ? (
          <div id="paypal-button-container" className="paypal-button-container"></div>
        ) : */ paymentMethod === 'interac' ? (
          <button
            type="button"
            onClick={handleInteracVerification}
            className="px-3 py-1.5 md:px-8 md:py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 text-sm md:text-lg"
          >
            Start Identity Verification
          </button>
        ) : null}
      </div>
    </div>
  );
}