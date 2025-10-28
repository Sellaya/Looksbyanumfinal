import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { calculateBookingPrice } from '../lib/pricing';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://looksbyanum-saqib.vercel.app/api'
});

// Login Component 
function AdminLogin({ onLogin }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/admin/login', credentials);
      const { token, admin } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(admin));
      
      // Set auth header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      onLogin(admin);
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Panel Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Booking Details Component
function BookingDetails({ booking, onApprove, loading }) {
  if (!booking) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-CA');
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    
    // Parse time string (assuming HH:MM format)
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Helper function to format complete address
  const formatAddress = (booking) => {
    const addressParts = [];
    
    // First try to build a complete venue address
    const venueParts = [];
    
    // Add venue name if it's different from venue_address
    if (booking.venue_name && booking.venue_name.trim() && 
        booking.venue_name.trim() !== (booking.venue_address || '').trim()) {
      venueParts.push(booking.venue_name.trim());
    }
    
    // Add street address
    if (booking.venue_address && booking.venue_address.trim()) {
      venueParts.push(booking.venue_address.trim());
    }
    
    // Add city, province, postal
    const cityParts = [];
    if (booking.venue_city && booking.venue_city.trim()) cityParts.push(booking.venue_city.trim());
    if (booking.venue_province && booking.venue_province.trim()) cityParts.push(booking.venue_province.trim());
    if (booking.venue_postal && booking.venue_postal.trim()) cityParts.push(booking.venue_postal.trim());
    
    if (cityParts.length > 0) {
      venueParts.push(cityParts.join(', '));
    }
    
    // If we have venue parts, use them
    if (venueParts.length > 0) {
      addressParts.push(venueParts.join(', '));
    } else {
      // If no venue address components, try region/subRegion
      if (booking.region && booking.region.trim()) addressParts.push(booking.region.trim());
      if (booking.subRegion && booking.subRegion.trim()) addressParts.push(booking.subRegion.trim());
    }
    
    return addressParts.length > 0 ? addressParts.join(', ') : 'N/A';
  };

  // Helper function to safely extract decimal values
  const getDecimalValue = (value) => {
    if (!value) return 0;
    if (typeof value === 'number') return value;
    if (value.$numberDecimal) return parseFloat(value.$numberDecimal);
    if (typeof value === 'string') return parseFloat(value) || 0;
    if (value.toString) {
      const strValue = value.toString();
      return parseFloat(strValue) || 0;
    }
    return 0;
  };

  // Helper function to check if specific payment type screenshot exists
  const hasScreenshotForPaymentType = (paymentType) => {
    if (!booking.interac_payment_screenshots || booking.interac_payment_screenshots.length === 0) {
      return false;
    }
    return booking.interac_payment_screenshots.some(screenshot => 
      screenshot.payment_type === paymentType && !screenshot.admin_verified
    );
  };

  const getServices = () => {
    // Use the same pricing calculation as the quote page to get detailed breakdown
    const artist = booking.artist === 'Lead' ? 'Lead' : 'Team';
    const pricing = calculateBookingPrice(booking, artist);
    
    if (pricing && pricing.services) {
      // Filter out pricing summary lines (Subtotal, HST, Total, Deposit)
      return pricing.services.filter(service => 
        !service.includes('Subtotal:') && 
        !service.includes('HST (13%):') && 
        !service.includes('Total:') && 
        !service.includes('Deposit required')
      );
    }
    
    // Fallback to old method if pricing calculation fails
    const services = [];
    
    // Bride services
    if (booking.bride_service) {
      services.push(`Bride: ${booking.bride_service}`);
    }
    
    // Trial services
    if (booking.needs_trial === 'Yes' && booking.trial_service) {
      services.push(`Trial: ${booking.trial_service}`);
    }
    
    // Add-ons
    if (booking.needs_jewelry === 'Yes') {
      services.push('Jewelry');
    }
    
    if (booking.needs_extensions === 'Yes') {
      services.push('Extensions');
    }

    // Party members
    if (booking.has_party_members === 'Yes') {
      if (booking.party_both_count > 0) {
        services.push(`Party Both Services: ${booking.party_both_count} people`);
      }
      if (booking.party_makeup_count > 0) {
        services.push(`Party Makeup Only: ${booking.party_makeup_count} people`);
      }
      if (booking.party_hair_count > 0) {
        services.push(`Party Hair Only: ${booking.party_hair_count} people`);
      }
      if (booking.party_dupatta_count > 0) {
        services.push(`Party Dupatta Setting: ${booking.party_dupatta_count} people`);
      }
      if (booking.party_extensions_count > 0) {
        services.push(`Party Extensions: ${booking.party_extensions_count} people`);
      }
    }

    // Airbrush
    if (booking.has_airbrush === 'Yes' && booking.airbrush_count > 0) {
      services.push(`Airbrush: ${booking.airbrush_count} people`);
    }

    // Non-bridal services
    if (booking.service_type === 'Non-Bridal') {
      if (booking.non_bridal_count > 0) {
        services.push(`Non-Bridal: ${booking.non_bridal_count} people`);
      }
      if (booking.non_bridal_both_count > 0) {
        services.push(`Non-Bridal Both Services: ${booking.non_bridal_both_count} people`);
      }
      if (booking.non_bridal_makeup_count > 0) {
        services.push(`Non-Bridal Makeup: ${booking.non_bridal_makeup_count} people`);
      }
      if (booking.non_bridal_hair_count > 0) {
        services.push(`Non-Bridal Hair: ${booking.non_bridal_hair_count} people`);
      }
      if (booking.non_bridal_extensions_count > 0) {
        services.push(`Non-Bridal Extensions: ${booking.non_bridal_extensions_count} people`);
      }
      if (booking.non_bridal_jewelry_count > 0) {
        services.push(`Non-Bridal Jewelry: ${booking.non_bridal_jewelry_count} people`);
      }
      if (booking.non_bridal_has_airbrush === 'Yes' && booking.non_bridal_airbrush_count > 0) {
        services.push(`Non-Bridal Airbrush: ${booking.non_bridal_airbrush_count} people`);
      }
    }

    // Artist selection
    if (booking.artist) {
      services.push(`Artist: ${booking.artist}`);
    }

    // If no specific services found, show service type
    if (services.length === 0) {
      services.push(`${booking.service_type} Package (Details not available)`);
    }

    return services;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h3>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Name:</span> {booking.name}</div>
            <div><span className="font-medium">Email:</span> {booking.email}</div>
            <div><span className="font-medium">Phone:</span> {booking.phone || 'N/A'}</div>
            <div><span className="font-medium">Address:</span> {booking.address || booking.region || 'N/A'}</div>
            <div><span className="font-medium">Service Type:</span> {booking.service_type}</div>
          </div>
        </div>

        {/* Event Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Event Date:</span> {formatDate(booking.event_date)}</div>
            <div><span className="font-medium">Ready Time:</span> {formatTime(booking.ready_time)}</div>
            <div><span className="font-medium">Address:</span> {booking.venue_address || booking.venue_name || 'N/A'}</div>
            {booking.venue_city && <div><span className="font-medium">City:</span> {booking.venue_city}</div>}
            {booking.venue_province && <div><span className="font-medium">Province:</span> {booking.venue_province}</div>}
            {booking.venue_postal && <div><span className="font-medium">Postal Code:</span> {booking.venue_postal}</div>}
          </div>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Services</h3>
          <div className="text-sm">
            <ul className="list-disc list-inside space-y-1">
              {getServices().map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Total Amount:</span>
              <span>${getDecimalValue(booking.pricing?.quote_total).toFixed(2)} CAD</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Deposit Amount:</span>
              <span>${getDecimalValue(booking.pricing?.deposit_amount).toFixed(2)} CAD</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Amount Paid:</span>
              <span>${getDecimalValue(booking.pricing?.amount_paid).toFixed(2)} CAD</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Remaining Balance:</span>
              <span>${getDecimalValue(booking.pricing?.remaining_amount).toFixed(2)} CAD</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Payment Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                booking.payment_status === 'fully_paid' 
                  ? 'bg-green-100 text-green-800'
                  : booking.payment_status === 'deposit_paid'
                  ? 'bg-yellow-100 text-gray-500'
                  : 'bg-red-100 text-red-800'
              }`}>
                {booking.payment_status?.replace('_', ' ').toUpperCase() || 'PENDING'}
              </span>
            </div>
            {/* Show base price if available */}
            {booking.price && (
              <div className="mt-2 p-2 bg-blue-50 rounded">
                <span className="text-xs text-blue-600">Base Price: ${getDecimalValue(booking.price).toFixed(2)} CAD</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interac Screenshots - Only show if screenshots exist */}
      {booking.interac_payment_screenshots && booking.interac_payment_screenshots.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Screenshots</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {booking.interac_payment_screenshots.map((screenshot, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  screenshot.admin_verified ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`font-medium text-sm ${screenshot.admin_verified ? 'text-black' : 'text-white'}`}>
                    {screenshot.payment_type === 'deposit' ? 'Deposit' : 'Final'} Payment
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      screenshot.admin_verified
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-gray-500'
                    }`}
                  >
                    {screenshot.admin_verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <p className={`text-xs mb-3 ${screenshot.admin_verified ? 'text-black' : 'text-white'}`}>
                  Uploaded: {new Date(screenshot.uploaded_at).toLocaleString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </p>
                <img
                  src={screenshot.screenshot_url}
                  alt="Payment screenshot"
                  className="w-full h-40 object-cover rounded border cursor-pointer hover:opacity-90"
                  onClick={() => window.open(screenshot.screenshot_url, '_blank')}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons - Only show when corresponding screenshots exist */}
      <div className="mt-6 space-y-4">
        {booking.payment_status === 'pending' && hasScreenshotForPaymentType('deposit') && (
          <div className="flex flex-col space-y-2">
            <p className="text-sm text-gray-600">
              ⚠️ Deposit payment screenshot has been uploaded and is pending verification.
            </p>
            <button
              onClick={() => onApprove('deposit')}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Approve Deposit Payment'}
            </button>
          </div>
        )}

        {booking.payment_status === 'pending' && !hasScreenshotForPaymentType('deposit') && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              📄 Waiting for user to upload deposit payment screenshot.
            </p>
          </div>
        )}
        
        {booking.payment_status === 'deposit_paid' && hasScreenshotForPaymentType('final') && (
          <div className="flex flex-col space-y-2">
            <p className="text-sm text-gray-600">
              ⚠️ Final payment screenshot has been uploaded and is pending verification.
            </p>
            <button
              onClick={() => onApprove('final')}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Approve Final Payment'}
            </button>
          </div>
        )}

        {booking.payment_status === 'deposit_paid' && !hasScreenshotForPaymentType('final') && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-600 text-sm">
              📄 Waiting for user to upload final payment screenshot.
            </p>
          </div>
        )}

        {booking.payment_status === 'fully_paid' && (
          <div className="text-green-600 font-medium">
            ✅ Payment completed
          </div>
        )}
      </div>
    </div>
  );
}

// Main Admin Panel Component
export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [bookingId, setBookingId] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [showBookingDetails, setShowBookingDetails] = useState(false);

  // Check for existing auth on component mount
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const adminUser = localStorage.getItem('admin_user');
    
    if (token && adminUser) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Verify token is still valid
      api.get('/admin/verify')
        .then(response => {
          setAdmin(JSON.parse(adminUser));
          setIsAuthenticated(true);
          // Fetch pending bookings after successful auth
          fetchPendingBookings();
        })
        .catch(() => {
          // Token invalid, clear storage
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          delete api.defaults.headers.common['Authorization'];
        });
    }
  }, []);

  const fetchPendingBookings = async () => {
    setLoadingPending(true);
    try {
      const response = await api.get('/admin/pending-verifications');
      setPendingBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch pending bookings:', error);
    } finally {
      setLoadingPending(false);
    }
  };

  const handleLogin = (adminUser) => {
    setAdmin(adminUser);
    setIsAuthenticated(true);
    // Fetch pending bookings after login
    fetchPendingBookings();
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    delete api.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setAdmin(null);
    setBooking(null);
    setBookingId('');
    setPendingBookings([]);
    setShowBookingDetails(false);
  };

  const loadBooking = async (id) => {
    setLoading(true);
    setError('');
    setBooking(null);

    try {
      const response = await api.get(`/admin/booking/${id}`);
      setBooking(response.data);
      setShowBookingDetails(true);
    } catch (error) {
      setError(error.response?.data?.error || 'Booking not found');
    } finally {
      setLoading(false);
    }
  };

  const backToList = () => {
    setShowBookingDetails(false);
    setBooking(null);
    setError('');
    setSuccess('');
  };

  const handleApproval = async (paymentType) => {
    const confirmMessage = `Are you sure you want to approve the ${paymentType} payment for booking ${booking.unique_id}?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = paymentType === 'deposit' ? 'approve-deposit' : 'approve-final';
      const response = await api.post(`/admin/booking/${booking.unique_id}/${endpoint}`);
      
      setSuccess(response.data.message);
      
      // Refresh booking data
      const updatedBooking = await api.get(`/admin/booking/${booking.unique_id}`);
      setBooking(updatedBooking.data);
      
      // Refresh pending bookings list
      fetchPendingBookings();
      
      // Go back to list after successful approval
      setTimeout(() => {
        backToList();
      }, 2000); // Give user time to see success message
      
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to approve payment');
    } finally {
      setActionLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {admin.username}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showBookingDetails ? (
          /* Booking Details View */
          <div>
            {/* Back Button */}
            <div className="mb-6">
              <button
                onClick={backToList}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                ← Back to Pending Verifications
              </button>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-md">
                {success}
              </div>
            )}

            {/* Booking Details */}
            {booking && (
              <BookingDetails 
                booking={booking} 
                onApprove={handleApproval}
                loading={actionLoading}
              />
            )}
          </div>
        ) : (
          /* Pending Bookings List View */
          <>
            {/* Pending Bookings Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Verifications</h2>
              
              {loadingPending ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                  <p className="mt-2 text-gray-600">Loading pending bookings...</p>
                </div>
              ) : pendingBookings.length === 0 ? (
                <p className="text-gray-600">No pending verifications at this time.</p>
              ) : (
                <div className="space-y-2">
                  {pendingBookings.map((pendingBooking) => (
                    <div
                      key={pendingBooking.unique_id}
                      onClick={() => loadBooking(pendingBooking.unique_id)}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div>
                        <div className="font-medium text-gray-900">{pendingBooking.unique_id}</div>
                        <div className="text-sm text-gray-600">{pendingBooking.name} - {pendingBooking.email}</div>
                        <div className="text-xs text-gray-500">
                          Submitted: {pendingBooking.submission_date ? new Date(pendingBooking.submission_date).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          ${(pendingBooking.pricing && pendingBooking.pricing.quote_total ? Number(pendingBooking.pricing.quote_total).toFixed(2) : '0.00')}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {pendingBooking.payment_status?.replace('_', ' ') || 'Unknown'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}