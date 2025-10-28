import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://looksbyanum-saqib.vercel.app/api'
});

export default function InteracCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing Interac verification...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const verified = searchParams.get('verified');
        const bookingId = searchParams.get('bookingId');
        const userInfoParam = searchParams.get('userInfo');

        if (error) {
          console.error('Interac verification error:', error);
          setStatus('Verification failed. Please try again.');
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        // Handle direct redirect from GET callback with verification status
        if (verified === 'true' && bookingId) {
          setStatus('Identity verified successfully! Redirecting...');

          // Parse user info from URL parameter
          let userInfo = null;
          try {
            userInfo = userInfoParam ? JSON.parse(decodeURIComponent(userInfoParam)) : null;
          } catch (e) {
            console.warn('Could not parse user info from URL parameter:', e);
          }

          // Store verification status
          localStorage.setItem('interac_verified', 'true');
          if (userInfo) {
            localStorage.setItem('interac_user_info', JSON.stringify(userInfo));
          }

          // Redirect to payment page with verification status
          navigate('/payment', {
            state: {
              bookingId: bookingId,
              interacVerified: true,
              userInfo: userInfo
            }
          });
          return;
        }

        // Handle OAuth callback - exchange code for verification
        if (code && state) {
          setStatus('Verifying your identity...');

          // Exchange the authorization code for user information
          const response = await api.post('/interac/callback', {
            code,
            state
          });

          const { verified: responseVerified, userInfo, bookingId: responseBookingId } = response.data;

          if (responseVerified) {
            setStatus('Identity verified successfully! Redirecting...');

            // Store verification status
            localStorage.setItem('interac_verified', 'true');
            localStorage.setItem('interac_user_info', JSON.stringify(userInfo));

            // Redirect back to the payment page with verification status
            if (responseBookingId) {
              navigate('/payment', {
                state: {
                  bookingId: responseBookingId,
                  interacVerified: true,
                  userInfo: userInfo
                }
              });
            } else {
              navigate('/');
            }
          } else {
            setStatus('Verification could not be completed. Please try again.');
            setTimeout(() => navigate('/'), 3000);
          }
        } else {
          console.error('Missing required parameters');
          setStatus('Invalid callback parameters. Please try again.');
          setTimeout(() => navigate('/'), 3000);
        }

      } catch (error) {
        console.error('Interac callback error:', error);
        setStatus('An error occurred during verification. Please try again.');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Interac Identity Verification</h2>
        <p className="text-gray-600">{status}</p>
        <div className="mt-4 text-sm text-gray-500">
          Please do not close this window while we process your verification.
        </div>
      </div>
    </div>
  );
}