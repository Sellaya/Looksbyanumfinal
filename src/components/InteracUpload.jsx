import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://looksbyanum-saqib.vercel.app/api",
});

const ErrorIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
      clipRule="evenodd"
    />
  </svg>
);

const SuccessIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

export default function InteracUpload() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [bookingId, setBookingId] = useState("");
  const [booking, setBooking] = useState(null);
  const [interacInfo, setInteracInfo] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState("lookup");

  useEffect(() => {
    const bookingIdFromUrl = searchParams.get("booking_id");
    if (bookingIdFromUrl) {
      setBookingId(bookingIdFromUrl);
      handleBookingLookup(bookingIdFromUrl);
    }
  }, [searchParams]);

  const handleBookingLookup = async (bid = bookingId) => {
    if (!bid.trim()) {
      setError("Please enter a booking ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const remainingResponse = await api.get(`/interac/check-remaining/${bid}`);
      if (!remainingResponse.data.hasRemainingPayment) {
        setError("This booking has no remaining payment or is already fully paid.");
        return;
      }

      const bookingResponse = await api.get(`/quote/${bid}`);
      setBooking(bookingResponse.data);

      const interacResponse = await api.get(`/interac/payment-info/${bid}`);
      setInteracInfo(interacResponse.data);

      setStep("upload");
    } catch (error) {
      setError(error.response?.data?.error || "Booking not found or invalid");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Please select an image file");
    if (file.size > 5 * 1024 * 1024) return setError("File must be less than 5MB");
    setScreenshot(file);
    setError("");
  };

  const uploadScreenshot = async () => {
    if (!screenshot) return setError("Please select a screenshot to upload");

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("screenshot", screenshot);
      formData.append("bookingId", bookingId);
      formData.append("paymentType", determinePaymentType());

      await api.post("/interac/upload-screenshot", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Screenshot uploaded successfully! Admin will verify shortly.");
      setScreenshot(null);

      const interacResponse = await api.get(`/interac/payment-info/${bookingId}`);
      setInteracInfo(interacResponse.data);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to upload screenshot");
    } finally {
      setUploading(false);
    }
  };

  const determinePaymentType = () => {
    if (!interacInfo || !booking) return "deposit";
    const s = booking.payment_status;
    if (s === "pending") return "deposit";
    if (s === "deposit_paid") return "final";
    return "final";
  };

  const getPaymentTypeLabel = () =>
    determinePaymentType() === "deposit" ? "Deposit Payment" : "Final Payment";

  const getPaymentAmount = () => {
    if (!interacInfo) return 0;
    return determinePaymentType() === "deposit"
      ? interacInfo.depositAmount
      : interacInfo.remainingAmount;
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-CA") : "N/A");

  const buttonBase =
    "relative px-8 sm:px-10 py-2.5 sm:py-3 text-sm sm:text-base font-light rounded-lg transition-all duration-300 overflow-hidden text-center";
  const activeButton =
    "bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white shadow-md shadow-gray-700/20 hover:shadow-lg hover:shadow-gray-700/30 hover:scale-[1.02] active:scale-100 cursor-pointer border border-gray-600";
  const disabledButton =
    "bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300";

  if (step === "lookup") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h1 className="text-3xl font-light text-gray-900 mb-6 tracking-wide">
            Upload Payment Screenshot
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            Enter your booking ID to view payment details.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <ErrorIcon className="w-5 h-5 text-red-500 mr-3" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking ID
              </label>
              <input
                type="text"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                placeholder="Enter your booking ID"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-600 focus:border-gray-600 text-gray-900 placeholder-gray-400 font-light"
              />
            </div>

            <button
              onClick={() => handleBookingLookup()}
              disabled={loading || !bookingId.trim()}
              className={`${buttonBase} ${
                loading || !bookingId.trim() ? disabledButton : activeButton
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block align-middle"></div>
                  Looking up booking...
                </>
              ) : (
                <>
                  {!(loading || !bookingId.trim()) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-out"></div>
                  )}
                  <span className="relative">Load Booking</span>
                </>
              )}
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full px-8 py-2.5 text-gray-900 bg-gray-100 border border-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm font-light text-center"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 px-4 py-12 flex justify-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-light text-gray-900 mb-6 text-center">
          Upload Payment Screenshot
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-center">
            <ErrorIcon className="w-5 h-5 text-red-500 mr-3" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center text-center">
            <SuccessIcon className="w-5 h-5 text-green-500 mr-3" />
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        {booking && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 mb-6 text-center">
            <h2 className="text-lg font-light text-gray-900 mb-4">
              Booking Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <p>
                <span className="font-medium">Booking ID:</span> {bookingId}
              </p>
              <p>
                <span className="font-medium">Client:</span> {booking.name}
              </p>
              <p>
                <span className="font-medium">Event Date:</span>{" "}
                {formatDate(booking.event_date)}
              </p>
              <p>
                <span className="font-medium">Service Type:</span>{" "}
                {booking.service_type}
              </p>
            </div>
          </div>
        )}

        {interacInfo && booking?.payment_status !== "fully_paid" && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 text-center">
            <h3 className="text-lg font-light text-gray-900 mb-3">
              {getPaymentTypeLabel()} - Interac E-Transfer
            </h3>
            <p className="text-gray-700 mb-3">
              Send your payment to:{" "}
              <span className="font-mono font-medium text-gray-900">
                {interacInfo.interacEmail}
              </span>
            </p>
            <p className="text-gray-700 mb-3">
              Amount:{" "}
              <span className="text-gray-900 font-medium">
                ${getPaymentAmount().toFixed(2)} CAD
              </span>
            </p>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Screenshot (Max 5MB)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm border border-gray-300 rounded-lg p-2 text-gray-700 file:mr-3 file:px-4 file:py-2 file:rounded-md file:border-0 file:text-sm file:font-light file:bg-gray-700 file:text-white hover:file:bg-gray-800 transition-all"
              />
              {screenshot && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {screenshot.name}
                </p>
              )}
            </div>

            <div className="mt-5">
              <button
                onClick={uploadScreenshot}
                disabled={uploading || !screenshot}
                className={`${buttonBase} ${
                  uploading || !screenshot ? disabledButton : activeButton
                }`}
              >
                {!uploading && !(!screenshot) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-out"></div>
                )}
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block align-middle"></div>
                    Uploading Screenshot...
                  </>
                ) : (
                  "Upload Payment Screenshot"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// import React, { useState, useEffect } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
// });

// export default function InteracUpload() {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [bookingId, setBookingId] = useState('');
//   const [booking, setBooking] = useState(null);
//   const [interacInfo, setInteracInfo] = useState(null);
//   const [screenshot, setScreenshot] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [step, setStep] = useState('lookup'); // 'lookup', 'upload'

//   // Check if booking ID is provided in URL
//   useEffect(() => {
//     const bookingIdFromUrl = searchParams.get('booking_id');
//     if (bookingIdFromUrl) {
//       setBookingId(bookingIdFromUrl);
//       handleBookingLookup(bookingIdFromUrl);
//     }
//   }, [searchParams]);

//   const handleBookingLookup = async (bid = bookingId) => {
//     if (!bid.trim()) {
//       setError('Please enter a booking ID');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       // Check if booking has remaining payment
//       const remainingResponse = await api.get(`/interac/check-remaining/${bid}`);

//       if (!remainingResponse.data.hasRemainingPayment) {
//         setError('This booking has no remaining payment or is already fully paid.');
//         return;
//       }

//       // Get booking details
//       const bookingResponse = await api.get(`/quote/${bid}`);
//       setBooking(bookingResponse.data);

//       // Get Interac payment info
//       const interacResponse = await api.get(`/interac/payment-info/${bid}`);
//       setInteracInfo(interacResponse.data);

//       setStep('upload');
//     } catch (error) {
//       setError(error.response?.data?.error || 'Booking not found or invalid');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (!file.type.startsWith('image/')) {
//         setError('Please select an image file');
//         return;
//       }

//       if (file.size > 5 * 1024 * 1024) {
//         setError('File size must be less than 5MB');
//         return;
//       }

//       setScreenshot(file);
//       setError('');
//     }
//   };

//   const uploadScreenshot = async () => {
//     if (!screenshot) {
//       setError('Please select a screenshot to upload');
//       return;
//     }

//     setUploading(true);
//     setError('');
//     setSuccess('');

//     try {
//       const formData = new FormData();
//       formData.append('screenshot', screenshot);
//       formData.append('bookingId', bookingId);
//       formData.append('paymentType', determinePaymentType());

//       await api.post('/interac/upload-screenshot', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setSuccess('Screenshot uploaded successfully! The admin will verify your payment shortly.');
//       setScreenshot(null);

//       // Refresh Interac info
//       const interacResponse = await api.get(`/interac/payment-info/${bookingId}`);
//       setInteracInfo(interacResponse.data);
//     } catch (error) {
//       setError(error.response?.data?.error || 'Failed to upload screenshot');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const determinePaymentType = () => {
//     if (!interacInfo || !booking) return 'deposit';

//     // Check actual payment status from booking
//     const paymentStatus = booking.payment_status;

//     // If payment status is pending, user needs to pay deposit
//     if (paymentStatus === 'pending') return 'deposit';

//     // If deposit is paid, user needs to pay final amount
//     if (paymentStatus === 'deposit_paid') return 'final';

//     // If fully paid, shouldn't reach here but default to final
//     if (paymentStatus === 'fully_paid') return 'final';

//     // Fallback logic based on amounts
//     if (interacInfo.amountPaid === 0) return 'deposit';
//     if (interacInfo.remainingAmount > 0) return 'final';

//     return 'deposit';
//   };

//   const getPaymentTypeLabel = () => {
//     const type = determinePaymentType();
//     return type === 'deposit' ? 'Deposit Payment' : 'Final Payment';
//   };

//   const getPaymentAmount = () => {
//     if (!interacInfo) return 0;

//     const type = determinePaymentType();
//     return type === 'deposit' ? interacInfo.depositAmount : interacInfo.remainingAmount;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-CA');
//   };

//   if (step === 'lookup') {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="max-w-md mx-auto px-4">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Payment Screenshot</h1>
//             <p className="text-gray-600">Upload your Interac e-transfer payment screenshot</p>
//           </div>

//           {/* Back Button */}
//           <div className="mb-6">
//             <button
//               onClick={() => navigate('/')}
//               className="px-4 py-2 md:px-6 md:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer text-sm md:text-base"
//             >
//               ← Back to Home
//             </button>
//           </div>

//           {/* Lookup Form */}
//           <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Enter Your Booking ID</h2>

//             {error && (
//               <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
//                 <p className="text-red-800 text-sm">{error}</p>
//               </div>
//             )}

//             <div className="space-y-4">
//               <div>
//                 <label htmlFor="booking-id" className="block text-sm font-medium text-gray-700 mb-2">
//                   Booking ID
//                 </label>
//                 <input
//                   id="booking-id"
//                   type="text"
//                   value={bookingId}
//                   onChange={(e) => setBookingId(e.target.value)}
//                   placeholder="Enter your booking ID"
//                   className="w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                 />
//               </div>

//               <button
//                 onClick={() => handleBookingLookup()}
//                 disabled={loading || !bookingId.trim()}
//                 className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//               >
//                 {loading ? (
//                   <>
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                     Looking up booking...
//                   </>
//                 ) : (
//                   'Continue'
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-2xl mx-auto px-4">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Payment Screenshot</h1>
//           <p className="text-gray-600">Upload your Interac e-transfer payment screenshot</p>
//         </div>

//         {/* Back Button */}
//         <div className="mb-6">
//           <button
//             onClick={() => navigate('/')}
//             className="px-4 py-2 md:px-6 md:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer text-sm md:text-base"
//           >
//             ← Back to Search
//           </button>
//         </div>

//         {/* Success/Error Messages */}
//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//             <p className="text-red-800 text-sm">{error}</p>
//           </div>
//         )}

//         {success && (
//           <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
//             <p className="text-green-800 text-sm">{success}</p>
//           </div>
//         )}

//         <div className="space-y-6">
//           {/* Booking Summary */}
//           {booking && (
//             <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <span className="font-medium text-gray-700">Booking ID:</span>
//                   <span className="ml-2 text-gray-900">{bookingId || booking?.booking_id || booking?.unique_id || 'N/A'}</span>
//                 </div>
//                 <div>
//                   <span className="font-medium text-gray-700">Client:</span>
//                   <span className="ml-2 text-gray-900">{booking.name}</span>
//                 </div>
//                 <div>
//                   <span className="font-medium text-gray-700">Event Date:</span>
//                   <span className="ml-2 text-gray-900">{formatDate(booking.event_date)}</span>
//                 </div>
//                 <div>
//                   <span className="font-medium text-gray-700">Service Type:</span>
//                   <span className="ml-2 text-gray-900">{booking.service_type}</span>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Payment Information */}
//           {interacInfo && booking && (
//             <>
//               {booking.payment_status === 'fully_paid' ? (
//                 <div className="bg-green-50 border border-green-200 rounded-lg p-6">
//                   <div className="flex items-center">
//                     <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                     </svg>
//                     <h3 className="text-lg font-semibold text-green-800">
//                       Payment Completed
//                     </h3>
//                   </div>
//                   <p className="text-green-700 mt-2">
//                     All payments for this booking have been completed. No additional payment is required.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
//                   <h3 className="text-lg font-semibold text-blue-400 mb-4">
//                     {getPaymentTypeLabel()} - Interac E-Transfer
//                   </h3>
//                   <div className="space-y-3">
//                     <div className="flex justify-between items-center">
//                       <span className="font-medium text-blue-600">Send payment to:</span>
//                       <span className="text-blue-900 font-mono bg-blue-100 px-2 py-1 rounded">
//                         {interacInfo.interacEmail}
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="font-medium text-blue-600">Amount to pay:</span>
//                       <span className="text-xl font-bold text-blue-600">
//                         ${getPaymentAmount().toFixed(2)} CAD
//                       </span>
//                     </div>
//                   </div>
//                   <div className="mt-4 p-3 bg-blue-100 rounded-md">
//                     <p className="text-sm text-black">
//                       <strong>Instructions:</strong> Send the {getPaymentTypeLabel().toLowerCase()} via Interac e-transfer to the email above,
//                       then upload a screenshot of the payment confirmation below.
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}

//           {/* Screenshot Upload - Only show if not fully paid */}
//           {booking && booking.payment_status !== 'fully_paid' && (
//             <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Payment Screenshot</h3>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Payment Screenshot
//                 </label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-900 hover:file:bg-gray-200 transition-colors"
//                 />
//                 {screenshot && (
//                   <p className="mt-2 text-sm text-gray-600">
//                     Selected: {screenshot.name}
//                   </p>
//                 )}
//                 <p className="mt-2 text-xs text-gray-500">
//                   Accepted formats: JPG, PNG, GIF. Maximum size: 5MB
//                 </p>
//               </div>

//               <button
//                 onClick={uploadScreenshot}
//                 disabled={uploading || !screenshot}
//                 className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//               >
//                 {uploading ? (
//                   <>
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                     Uploading Screenshot...
//                   </>
//                 ) : (
//                   'Upload Payment Screenshot'
//                 )}
//               </button>
//             </div>
//           </div>
//           )}

//           {/* Previously Uploaded Screenshots */}
//           {interacInfo?.screenshots && interacInfo.screenshots.length > 0 && (
//             <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 Uploaded Screenshots
//               </h3>
//               <div className="space-y-3">
//                 {interacInfo.screenshots.map((screenshot, index) => (
//                   <div
//                     key={index}
//                     className={`p-4 rounded-lg border ${
//                       screenshot.admin_verified
//                         ? 'bg-green-50 border-green-200'
//                         : 'bg-yellow-50 border-yellow-200'
//                     }`}
//                   >
//                     <div className="flex justify-between items-center mb-2">
//                       <span className={`font-medium text-sm ${
//                         screenshot.admin_verified ? 'text-green-800' : 'text-gray-800'
//                       }`}>
//                         {screenshot.payment_type === 'deposit' ? 'Deposit' : 'Final'} Payment
//                       </span>
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium ${
//                           screenshot.admin_verified
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-yellow-100 text-gray-500'
//                         }`}
//                       >
//                         {screenshot.admin_verified ? 'Verified ✓' : 'Pending Review'}
//                       </span>
//                     </div>
//                     <p className={`text-sm ${
//                       screenshot.admin_verified ? 'text-green-700' : 'text-yellow-700'
//                     }`}>
//                       Uploaded: {new Date(screenshot.uploaded_at).toLocaleString('en-US', {
//                         year: 'numeric',
//                         month: 'short',
//                         day: 'numeric',
//                         hour: 'numeric',
//                         minute: '2-digit',
//                         hour12: true
//                       })}
//                     </p>
//                     {screenshot.admin_verified && (
//                       <p className="text-sm text-green-700 mt-1">
//                         Verified by admin on {new Date(screenshot.verified_at).toLocaleString('en-US', {
//                           year: 'numeric',
//                           month: 'short',
//                           day: 'numeric',
//                           hour: 'numeric',
//                           minute: '2-digit',
//                           hour12: true
//                         })}
//                       </p>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
