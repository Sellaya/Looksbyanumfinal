import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import Logo from "../assets/Black.png";

// Load Stripe with the publishable key
const stripePromise = loadStripe(import.meta.env.str);

// Create API client with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://looksbyanum-saqib.vercel.app/api",
});

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

// Star Icon
const StarIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

// Interac Payment Section Component
function InteracPaymentSection({
  bookingId,
  depositAmount,
  processing,
  setProcessing,
  setError,
  setSuccess,
}) {
  const [interacInfo, setInteracInfo] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [paymentType] = useState("deposit");

  useEffect(() => {
    if (bookingId) {
      loadInteracInfo();
    }
  }, [bookingId]);

  const loadInteracInfo = async () => {
    try {
      const response = await api.get(`/interac/payment-info/${bookingId}`);
      setInteracInfo(response.data);
    } catch (error) {
      console.error("Failed to load Interac info:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      setScreenshot(file);
      setError("");
    }
  };

  const uploadScreenshot = async () => {
    if (!screenshot) {
      setError("Please select a screenshot to upload");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("screenshot", screenshot);
      formData.append("bookingId", bookingId);
      formData.append("paymentType", paymentType);

      await api.post("/interac/upload-screenshot", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(
        "Screenshot uploaded successfully! The admin will verify your payment shortly."
      );
      setScreenshot(null);
      loadInteracInfo();
    } catch (error) {
      setError(error.response?.data?.error || "Failed to upload screenshot");
    } finally {
      setUploading(false);
    }
  };

  if (!interacInfo) {
    return (
      <div className="flex-1 flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-5">
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
            <span className="text-gray-900 font-semibold">
              ${depositAmount.toFixed(2)} CAD
            </span>
          </div>
        </div>
        <div className="mt-4 p-3 bg-gray-100 border border-gray-300 rounded-lg">
          <p className="text-xs text-blue-800 font-light leading-relaxed">
            <strong className="text-gray-900">Instructions:</strong> Send the
            deposit amount via Interac e-transfer to the email above, then
            upload a screenshot of the payment confirmation below.
          </p>
        </div>
      </div>

      {/* Screenshot Upload */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-800 mb-2 uppercase tracking-wide">
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
          <p className="text-xs text-gray-600 font-light">
            Selected: {screenshot.name}
          </p>
        )}
      </div>

      {/* Upload Button */}
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
              Uploading Screenshot...
            </>
          ) : (
            "Upload Payment Screenshot"
          )}
        </span>
      </button>

      {/* Previously Uploaded Screenshots */}
      {interacInfo.screenshots && interacInfo.screenshots.length > 0 && (
        <div className="mt-6">
          <h5 className="text-sm font-medium text-gray-800 mb-3 uppercase tracking-wide">
            Uploaded Screenshots
          </h5>
          <div className="space-y-3">
            {interacInfo.screenshots.map((screenshot, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl text-sm border font-light ${
                  screenshot.admin_verified
                    ? "bg-green-50 border-green-200"
                    : "bg-yellow-50 border-yellow-200"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span
                    className={`font-medium ${
                      screenshot.admin_verified
                        ? "text-green-800"
                        : "text-yellow-800"
                    }`}
                  >
                    {screenshot.payment_type === "deposit"
                      ? "Deposit"
                      : "Final"}{" "}
                    Payment
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      screenshot.admin_verified
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {screenshot.admin_verified
                      ? "Verified ✓"
                      : "Pending Review"}
                  </span>
                </div>
                <p
                  className={`text-xs ${
                    screenshot.admin_verified
                      ? "text-green-700"
                      : "text-yellow-700"
                  }`}
                >
                  Uploaded:{" "}
                  {new Date(screenshot.uploaded_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuotePayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [depositAmount, setDepositAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [interacVerified, setInteracVerified] = useState(false);
  const [interacUserInfo, setInteracUserInfo] = useState(null);
  const [showInteracModal, setShowInteracModal] = useState(false);

  const {
    bookingId,
    amount: initialDepositAmount,
    interacVerified: verifiedFromCallback,
    userInfo: userInfoFromCallback,
  } = location.state || {};

  const interacVerifiedFromUrl =
    searchParams.get("interac_verified") === "true";
  const bookingIdFromUrl = searchParams.get("booking_id");

  const finalBookingId = bookingId || bookingIdFromUrl;

  console.log("QuotePayment location state:", location.state);
  console.log("QuotePayment search params:", {
    interacVerifiedFromUrl,
    bookingIdFromUrl,
  });
  console.log("QuotePayment final values:", {
    finalBookingId,
    initialDepositAmount,
  });

  const numericDepositAmount =
    typeof initialDepositAmount === "number"
      ? initialDepositAmount
      : parseFloat(initialDepositAmount) || 0;

  useEffect(() => {
    setDepositAmount(numericDepositAmount);
  }, [numericDepositAmount]);

  useEffect(() => {
    if (verifiedFromCallback || interacVerifiedFromUrl) {
      setInteracVerified(true);
      setInteracUserInfo(userInfoFromCallback || { verified: true });
      setPaymentMethod("stripe");
    }
  }, [verifiedFromCallback, userInfoFromCallback, interacVerifiedFromUrl]);

  useEffect(() => {
    if (!finalBookingId) {
      console.error("Missing booking ID");
      setError(
        "Payment information is missing. Please go back to your quote and try again."
      );
      setLoading(false);
      return;
    }

    if (bookingIdFromUrl || numericDepositAmount > 0) {
      loadBooking();
    } else {
      console.error("Missing payment data:", {
        bookingId: finalBookingId,
        depositAmount: numericDepositAmount,
      });
      setError(
        "Payment information is missing. Please go back to your quote and try again."
      );
      setLoading(false);
    }
  }, [finalBookingId, numericDepositAmount, bookingIdFromUrl]);

  const loadBooking = async () => {
    try {
      const response = await api.get(`/quote/${finalBookingId}`);
      const bookingData = response.data;
      setBooking(bookingData);

      const interacVerifiedFromDB = bookingData.ops?.interac_verified || false;
      if (interacVerifiedFromDB && !interacVerified) {
        console.log("User already verified through Interac (from database)");
        setInteracVerified(true);
        setInteracUserInfo({ verified: true, source: "database" });
      }

      const storedDepositAmount = Number(
        bookingData.pricing?.deposit_amount || 0
      );
      if (storedDepositAmount > 0) {
        setDepositAmount(storedDepositAmount);
      } else {
        setDepositAmount(numericDepositAmount);
      }

      const paymentStatus = bookingData.payment_status || "pending";
      const amountPaid = Number(bookingData.pricing?.amount_paid || 0);
      const depositAmount = Number(bookingData.pricing?.deposit_amount || 0);

      if (
        paymentStatus === "deposit_paid" ||
        paymentStatus === "fully_paid" ||
        amountPaid >= depositAmount
      ) {
        console.log("Deposit already paid, redirecting to remaining payment");
        navigate("/remaining-payment", {
          state: {
            bookingId: finalBookingId,
            booking: bookingData,
          },
          replace: true,
        });
        return;
      }
    } catch (error) {
      console.error("Failed to load booking:", error);
      setError("Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  // Replace the handlePayment function (around line 440-490) with this:

  const handlePayment = async () => {
    if (!booking) return;

    setProcessing(true);
    setError("");

    try {
      const paymentStatus = booking.payment_status || "pending";
      const amountPaid = Number(booking.pricing?.amount_paid || 0);
      const depositAmount = Number(booking.pricing?.deposit_amount || 0);

      if (
        paymentStatus === "deposit_paid" ||
        paymentStatus === "fully_paid" ||
        amountPaid >= depositAmount
      ) {
        console.log(
          "Deposit already paid, redirecting to remaining payment from handlePayment"
        );
        navigate("/remaining-payment", {
          state: {
            bookingId: bookingId,
            booking: booking,
          },
          replace: true,
        });
        return;
      }

      console.log("Creating Stripe checkout session...");

      const response = await api.post("/stripe/create-checkout-session", {
        booking: {
          ...booking,
          booking_id: bookingId,
          client: {
            name: booking.name,
            email: booking.email,
          },
          pricing: {
            deposit_amount: depositAmount,
            deposit_percentage: booking.pricing?.deposit_percentage || 30,
            quote_total: booking.pricing?.quote_total || 0,
          },
        },
      });

      if (!response.data.url) {
        throw new Error("Failed to create payment session - no URL received");
      }

      console.log("Redirecting to Stripe Checkout:", response.data.url);

      // Use direct URL redirect instead of redirectToCheckout
      window.location.href = response.data.url;

    } catch (error) {
      console.error("Payment error:", error);
      setError(error.message || "Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-gray-700 animate-spin"></div>
          </div>
          <p className="text-gray-700 font-light">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-8">
            <div className="w-16 h-16 mx-auto mb-6 bg-red-50 rounded-xl flex items-center justify-center border border-red-200">
              <WarningIcon className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-xl font-normal text-gray-900 mb-4">
              Error
            </h1>
            <p className="text-gray-600 mb-6 font-light leading-relaxed">
              {error}
            </p>
            <button
              onClick={() => navigate("/quote/" + finalBookingId)}
              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-out"></div>
              <span className="relative">Back to Quote</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={Logo} alt="Logo" className="w-[180px] sm:w-[220px] lg:w-[260px] mx-auto mb-4" />
        </div>

        {interacVerified && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-800">
                  Identity Verified Successfully!
                </p>
                <p className="text-sm text-green-700 font-light">
                  You can now proceed with your payment.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-6 md:p-8">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-normal text-gray-900 mb-3">
              Secure Payment
            </h1>
            <div className="h-0.5 w-20 bg-gray-800 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 font-light">
              Complete your booking with a secure deposit payment
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
              <p className="text-red-700 text-sm font-light">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl shadow-sm">
              <p className="text-green-700 text-sm font-light">{success}</p>
            </div>
          )}

          {/* Booking Summary */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-medium text-gray-900 mb-5">
              Booking Summary
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between font-light">
                <span className="text-gray-600">Booking ID:</span>
                <span className="text-gray-900">{bookingId}</span>
              </div>
              <div className="flex justify-between font-light">
                <span className="text-gray-600">Service:</span>
                <span className="text-gray-900">{booking.service_type}</span>
              </div>
              <div className="flex justify-between font-light">
                <span className="text-gray-600">Client:</span>
                <span className="text-gray-900">{booking.name}</span>
              </div>
              <div className="flex justify-between font-light">
                <span className="text-gray-600">Event Date:</span>
                <span className="text-gray-900">
                  {booking.event_date
                    ? new Date(booking.event_date).toLocaleDateString("en-CA")
                    : "N/A"}
                </span>
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              <div className="flex justify-between text-lg font-medium">
                <span className="text-gray-900">Deposit Amount:</span>
                <span className="text-gray-900 font-semibold">
                  ${depositAmount.toFixed(2)} CAD
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-5">
              Choose Payment Method
            </h3>

            {/* Coupon Discount Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <StarIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-blue-900 text-lg">
                    Coupon Discounts Available!
                  </p>
                  <p className="text-blue-800 font-light text-sm">
                    Apply coupon codes only through Credit/Debit Card (Stripe)
                    payments
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-6">
              {/* Stripe Option */}
              <div
                className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 ${
                  paymentMethod === "stripe"
                    ? "border-gray-600 bg-gray-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-400"
                }`}
                onClick={() => setPaymentMethod("stripe")}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={paymentMethod === "stripe"}
                    onChange={() => setPaymentMethod("stripe")}
                    className="text-gray-800 focus:ring-gray-500 focus:ring-2 bg-white border-gray-300"
                  />
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      paymentMethod === "stripe"
                        ? "bg-gray-800 border border-gray-600"
                        : "bg-gray-100 border border-gray-300"
                    }`}
                  >
                    <svg
                      className={`w-6 h-6 ${
                        paymentMethod === "stripe"
                          ? "text-white"
                          : "text-gray-600"
                      }`}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v2h16V6H4zm0 4v8h16v-8H4z" />
                    </svg>
                  </div>
                  <div>
                    <p
                      className={`${
                        paymentMethod === "stripe"
                          ? "text-gray-900 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      Credit/Debit Card
                    </p>
                    <p
                      className={`text-sm font-light ${
                        paymentMethod === "stripe"
                          ? "text-gray-700"
                          : "text-gray-500"
                      }`}
                    >
                      Powered by Stripe
                    </p>
                  </div>
                </div>
              </div>

              {/* Interac Option */}
              <div
                className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 ${
                  paymentMethod === "interac"
                    ? "border-gray-600 bg-gray-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-400"
                }`}
                onClick={() => setPaymentMethod("interac")}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="interac"
                    checked={paymentMethod === "interac"}
                    onChange={() => setPaymentMethod("interac")}
                    className="text-gray-800 focus:ring-gray-500 focus:ring-2 bg-white border-gray-300"
                  />
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      paymentMethod === "interac"
                        ? "bg-gray-800 border border-gray-600"
                        : "bg-gray-100 border border-gray-300"
                    }`}
                  >
                    <CheckIcon
                      className={`w-6 h-6 ${
                        paymentMethod === "interac"
                          ? "text-white"
                          : "text-gray-600"
                      }`}
                    />
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        paymentMethod === "interac"
                          ? "text-gray-900"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <p
                      className={`${
                        paymentMethod === "interac"
                          ? "text-gray-900 font-medium"
                          : "text-gray-700"
                      }`}
                      style={{ letterSpacing: "0.02em" }}
                    >
                      Interac E-Transfer
                    </p>
                    <p
                      className={`text-sm font-light ${
                        paymentMethod === "interac"
                          ? "text-gray-700"
                          : "text-gray-500"
                      }`}
                      style={{ letterSpacing: "0.01em" }}
                    >
                      Send payment via Interac
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Details */}
            {paymentMethod === "stripe" && (
              <div className="bg-gradient-to-br from-green-300 to-green-500 backdrop-blur-sm border border-gray-800/30 p-5 rounded-xl shadow-lg shadow-blue-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-gray-800"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v2h16V6H4zm0 4v8h16v-8H4z" />
                    </svg>
                  </div>
                  <div>
                    <p
                      className="text-lg font-medium text-gray-800"
                      style={{ letterSpacing: "0.02em" }}
                    >
                      Secure Card Payment
                    </p>
                    <p
                      className="text-sm text-gray-800 font-light"
                      style={{ letterSpacing: "0.01em" }}
                    >
                      Your payment information is secure and encrypted
                    </p>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "interac" && (
              <div className="bg-gradient-to-br from-green-300 to-green-500 backdrop-blur-sm border border-gray-800/30 p-5 rounded-xl shadow-lg shadow-blue-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-gray-800"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v2h16V6H4zm0 4v8h16v-8H4z" />
                    </svg>
                  </div>
                  <div>
                    <p
                      className="text-lg font-medium text-gray-800"
                      style={{ letterSpacing: "0.02em" }}
                    >
                    Interac Identity Verification
                    </p>
                    <p
                      className="text-sm text-gray-800 font-light"
                      style={{ letterSpacing: "0.01em" }}
                    >
                      Verify your identity using Interac Hub for enhanced security
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Terms Reminder */}
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/20 backdrop-blur-sm border border-yellow-600/30 rounded-xl p-5 mb-8 shadow-lg shadow-yellow-500/10">
            <p
              className="text-sm text-yellow-500 font-light leading-relaxed"
              style={{ letterSpacing: "0.01em" }}
            >
              <strong className="text-yellow-600 font-normal">
                Important:
              </strong>{" "}
              This deposit secures your booking date and is non-refundable. You
              will receive a confirmation email with payment details and
              remaining balance information.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-between">
            <button
              onClick={() => navigate("/quote/" + finalBookingId)}
              disabled={processing}
              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
              style={{ letterSpacing: "0.05em" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-out"></div>
              <span className="relative">← Back to Quote</span>
            </button>

            {paymentMethod === "stripe" ? (
              <button
                onClick={handlePayment}
                disabled={processing || loading || !booking}
                className={`px-5 py-2 rounded-lg bg-gray-900 text-white hover:opacity-90 transition-all"
                }`}
                style={{ letterSpacing: "0.05em" }}
              >
                {!(processing || loading || !booking) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-out"></div>
                )}
                <span className="relative flex items-center justify-center gap-2.5">
                  {processing ? (
                    <>
                      <LoadingSpinner />
                      Processing...
                    </>
                  ) : (
                    `Pay Deposit $${depositAmount.toFixed(2)}`
                  )}
                </span>
              </button>
            ) : paymentMethod === "interac" ? (
              <button
                onClick={() => setShowInteracModal(true)}
                disabled={processing || loading || !booking}
                className={"px-5 py-2 rounded-lg bg-gray-900 text-white hover:opacity-90 transition-all"}
                style={{ letterSpacing: "0.05em" }}
              >
                {!(processing || loading || !booking) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-out"></div>
                )}
                <span className="relative">
                  Proceed with Interac E-Transfer
                </span>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Interac Payment Modal */}
      {showInteracModal && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-50 backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700/50 shadow-2xl shadow-gray-900/50">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2
                  className="text-xl font-medium text-grey-800 mx-auto"
                  style={{ letterSpacing: "0.02em" }}
                >
                  Interac E-Transfer Payment
                </h2>
                <button
                  onClick={() => setShowInteracModal(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <InteracPaymentSection
                bookingId={finalBookingId}
                depositAmount={depositAmount}
                processing={processing}
                setProcessing={setProcessing}
                setError={setError}
                setSuccess={setSuccess}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
// import axios from 'axios';
// import { loadStripe } from '@stripe/stripe-js';
// import { formatCurrency } from '../../lib/currencyFormat'; // Added currency formatter import

// // Load Stripe with the publishable key
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE);

// // Create API client with base URL
// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
// });

// // Interac Payment Section Component
// function InteracPaymentSection({ bookingId, depositAmount, processing, setProcessing, setError, setSuccess }) {
//   const [interacInfo, setInteracInfo] = useState(null);
//   const [screenshot, setScreenshot] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [paymentType] = useState('deposit'); // For quote payment, it's always deposit

//   useEffect(() => {
//     if (bookingId) {
//       loadInteracInfo();
//     }
//   }, [bookingId]);

//   const loadInteracInfo = async () => {
//     try {
//       const response = await api.get(`/interac/payment-info/${bookingId}`);
//       setInteracInfo(response.data);
//     } catch (error) {
//       console.error('Failed to load Interac info:', error);
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

//     try {
//       const formData = new FormData();
//       formData.append('screenshot', screenshot);
//       formData.append('bookingId', bookingId);
//       formData.append('paymentType', paymentType);

//       await api.post('/interac/upload-screenshot', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setSuccess('Screenshot uploaded successfully! The admin will verify your payment shortly.');
//       setScreenshot(null);
//       loadInteracInfo(); // Refresh info
//     } catch (error) {
//       setError(error.response?.data?.error || 'Failed to upload screenshot');
//     } finally {
//       setUploading(false);
//     }
//   };

//   if (!interacInfo) {
//     return (
//       <div className="flex-1 flex items-center justify-center py-8">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 space-y-4">
//       {/* Interac Payment Instructions */}
//       <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
//         <h4 className="font-medium text-white mb-3">Interac E-Transfer Payment</h4>
//         <div className="space-y-2 text-sm text-white">
//           <div className="flex justify-between">
//             <span>Send payment to:</span>
//             <span className="font-medium">{interacInfo.interacEmail}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Amount:</span>
//             <span className="font-medium">${depositAmount.toFixed(2)} CAD</span>
//           </div>
//         </div>
//         <div className="mt-3 p-3 bg-white border border-gray-300 rounded-md">
//           <p className="text-xs text-white">
//             <strong>Instructions:</strong> Send the deposit amount via Interac e-transfer to the email above,
//             then upload a screenshot of the payment confirmation below.
//           </p>
//         </div>
//       </div>

//       {/* Screenshot Upload */}
//       <div className="space-y-3">
//         <label className="block text-sm font-medium text-white">
//           Upload Payment Screenshot
//         </label>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleFileChange}
//           className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//         />
//         {screenshot && (
//           <p className="text-xs text-gray-500">
//             Selected: {screenshot.name}
//           </p>
//         )}
//       </div>

//       {/* Upload Button */}
//       <button
//         onClick={uploadScreenshot}
//         disabled={uploading || !screenshot}
//         className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//       >
//         {uploading ? (
//           <>
//             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//             Uploading Screenshot...
//           </>
//         ) : (
//           'Upload Payment Screenshot'
//         )}
//       </button>

//       {/* Previously Uploaded Screenshots */}
//       {interacInfo.screenshots && interacInfo.screenshots.length > 0 && (
//         <div className="mt-4">
//           <h5 className="text-sm font-medium text-black mb-2">
//             Uploaded Screenshots
//           </h5>
//           <div className="space-y-2">
//             {interacInfo.screenshots.map((screenshot, index) => (
//               <div
//                 key={index}
//                 className={`p-3 rounded-md text-sm border ${
//                   screenshot.admin_verified
//                     ? 'bg-green-50 border-green-200'
//                     : 'bg-yellow-50 border-yellow-200'
//                 }`}
//               >
//                 <div className="flex justify-between items-center">
//                   <span className={`font-medium ${
//                     screenshot.admin_verified ? 'text-green-800' : 'text-yellow-800'
//                   }`}>
//                     {screenshot.payment_type === 'deposit' ? 'Deposit' : 'Final'} Payment
//                   </span>
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       screenshot.admin_verified
//                         ? 'bg-green-100 text-green-800'
//                         : 'bg-yellow-100 text-gray-500'
//                     }`}
//                   >
//                     {screenshot.admin_verified ? 'Verified ✓' : 'Pending Review'}
//                   </span>
//                 </div>
//                 <p className={`mt-1 ${
//                   screenshot.admin_verified ? 'text-green-700' : 'text-yellow-700'
//                 }`}>
//                   Uploaded: {new Date(screenshot.uploaded_at).toLocaleDateString()}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default function QuotePayment() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const [booking, setBooking] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [processing, setProcessing] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [depositAmount, setDepositAmount] = useState(0);
//   const [paymentMethod, setPaymentMethod] = useState('stripe');
//   const [paypalLoaded, setPaypalLoaded] = useState(false);
//   const [interacVerified, setInteracVerified] = useState(false);
//   const [interacUserInfo, setInteracUserInfo] = useState(null);
//   const [showInteracModal, setShowInteracModal] = useState(false);

//   const { bookingId, amount: initialDepositAmount, interacVerified: verifiedFromCallback, userInfo: userInfoFromCallback } = location.state || {};

//   // Also check query parameters for Interac verification
//   const interacVerifiedFromUrl = searchParams.get('interac_verified') === 'true';
//   const bookingIdFromUrl = searchParams.get('booking_id');

//   const finalBookingId = bookingId || bookingIdFromUrl;

//   console.log('QuotePayment location state:', location.state);
//   console.log('QuotePayment search params:', { interacVerifiedFromUrl, bookingIdFromUrl });
//   console.log('QuotePayment final values:', { finalBookingId, initialDepositAmount });

//   // Ensure depositAmount is a number
//   const numericDepositAmount = typeof initialDepositAmount === 'number' ? initialDepositAmount : parseFloat(initialDepositAmount) || 0;

//   // Initialize deposit amount state
//   useEffect(() => {
//     setDepositAmount(numericDepositAmount);
//   }, [numericDepositAmount]);

//   // Handle Interac verification callback
//   useEffect(() => {
//     if (verifiedFromCallback || interacVerifiedFromUrl) {
//       setInteracVerified(true);
//       setInteracUserInfo(userInfoFromCallback || { verified: true });
//       setPaymentMethod('stripe'); // Default to Stripe after verification
//     }
//   }, [verifiedFromCallback, userInfoFromCallback, interacVerifiedFromUrl]);

//   useEffect(() => {
//     // If we don't have a finalBookingId at all, show error
//     if (!finalBookingId) {
//       console.error('Missing booking ID');
//       setError('Payment information is missing. Please go back to your quote and try again.');
//       setLoading(false);
//       return;
//     }

//     // If we have bookingId from URL params (Interac callback) OR deposit amount, load booking
//     if (bookingIdFromUrl || numericDepositAmount > 0) {
//       loadBooking();
//     } else {
//       // Normal flow but missing deposit amount
//       console.error('Missing payment data:', { bookingId: finalBookingId, depositAmount: numericDepositAmount });
//       setError('Payment information is missing. Please go back to your quote and try again.');
//       setLoading(false);
//     }
//   }, [finalBookingId, numericDepositAmount, bookingIdFromUrl]);

//   // Load PayPal script
//   React.useEffect(() => {
//     if (paymentMethod === 'paypal' && !paypalLoaded) {
//       const script = document.createElement('script');
//       script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID || 'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R'}&currency=CAD&components=buttons&disable-funding=paylater`;
//       script.onload = () => {
//         setPaypalLoaded(true);
//         if (window.paypal) {
//           window.paypal.Buttons({
//             createOrder: async () => {
//               const response = await api.post('/paypal/create-order', {
//                 booking: {
//                   unique_id: finalBookingId
//                 },
//                 paymentType: 'deposit'
//               });
//               const order = await response.data;
//               return order.id;
//             },
//             onApprove: async (data) => {
//               const response = await api.post(`/paypal/capture-order/${data.orderID}`);
//               const result = await response.data;
//               if (result.success) {
//                 navigate(`/success?paid=1&session_id=${result.sessionId}&booking_id=${bookingId}`);
//               } else {
//                 setError('Payment failed');
//               }
//             }
//           }).render('#paypal-button-container');
//         }
//       };
//       document.body.appendChild(script);
//     }
//   }, [paymentMethod, paypalLoaded, booking, finalBookingId, navigate]);

//   useEffect(() => {
//     // If we don't have a finalBookingId at all, show error
//     if (!finalBookingId) {
//       console.error('Missing booking ID');
//       setError('Payment information is missing. Please go back to your quote and try again.');
//       setLoading(false);
//       return;
//     }

//     // If we have bookingId from URL params (Interac callback) or we have deposit amount, load booking
//     if (bookingIdFromUrl || numericDepositAmount > 0) {
//       loadBooking();
//     } else {
//       // Normal flow but missing deposit amount
//       console.error('Missing payment data:', { bookingId: finalBookingId, depositAmount: numericDepositAmount });
//       setError('Payment information is missing. Please go back to your quote and try again.');
//       setLoading(false);
//     }
//   }, [finalBookingId, numericDepositAmount, bookingIdFromUrl]);

//   const loadBooking = async () => {
//     try {
//       const response = await api.get(`/quote/${finalBookingId}`);
//       const bookingData = response.data;
//       setBooking(bookingData);

//       // Check Interac verification status from database
//       const interacVerifiedFromDB = bookingData.ops?.interac_verified || false;
//       if (interacVerifiedFromDB && !interacVerified) {
//         console.log('User already verified through Interac (from database)');
//         setInteracVerified(true);
//         setInteracUserInfo({ verified: true, source: 'database' });
//       }

//       // Use stored deposit amount from database
//       const storedDepositAmount = Number(bookingData.pricing?.deposit_amount || 0);
//       if (storedDepositAmount > 0) {
//         setDepositAmount(storedDepositAmount);
//       } else {
//         // Fallback to passed amount if not stored
//         setDepositAmount(numericDepositAmount);
//       }

//       // Check payment status and redirect if deposit already paid
//       const paymentStatus = bookingData.payment_status || 'pending';
//       const amountPaid = Number(bookingData.pricing?.amount_paid || 0);
//       const depositAmount = Number(bookingData.pricing?.deposit_amount || 0);

//       if (paymentStatus === 'deposit_paid' || paymentStatus === 'fully_paid' || amountPaid >= depositAmount) {
//         console.log('Deposit already paid, redirecting to remaining payment');
//         navigate('/remaining-payment', {
//           state: {
//             bookingId: finalBookingId,
//             booking: bookingData
//           },
//           replace: true
//         });
//         return;
//       }

//     } catch (error) {
//       console.error('Failed to load booking:', error);
//       setError('Failed to load booking details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePayment = async () => {
//     if (!booking) return;

//     setProcessing(true);
//     setError('');

//     try {
//       // Double-check payment status before attempting payment
//       const paymentStatus = booking.payment_status || 'pending';
//       const amountPaid = Number(booking.pricing?.amount_paid || 0);
//       const depositAmount = Number(booking.pricing?.deposit_amount || 0);

//       if (paymentStatus === 'deposit_paid' || paymentStatus === 'fully_paid' || amountPaid >= depositAmount) {
//         console.log('Deposit already paid, redirecting to remaining payment from handlePayment');
//         navigate('/remaining-payment', {
//           state: {
//             bookingId: bookingId,
//             booking: booking
//           },
//           replace: true
//         });
//         return;
//       }

//       const stripe = await stripePromise;
//       if (!stripe) {
//         throw new Error('Stripe failed to load');
//       }

//       // Create checkout session for deposit payment
//       const response = await api.post('/stripe/create-checkout-session', {
//         booking: {
//           ...booking,
//           booking_id: bookingId,
//           client: {
//             name: booking.name,
//             email: booking.email
//           },
//           pricing: {
//             deposit_amount: depositAmount,
//             deposit_percentage: booking.pricing?.deposit_percentage || 30,
//             quote_total: booking.pricing?.quote_total || 0
//           }
//         }
//       });

//       if (!response.data.id) {
//         throw new Error('Failed to create payment session');
//       }

//       // Redirect to Stripe Checkout
//       const { error } = await stripe.redirectToCheckout({
//         sessionId: response.data.id
//       });

//       if (error) {
//         throw new Error(error.message);
//       }

//     } catch (error) {
//       console.error('Payment error:', error);
//       setError(error.message || 'Payment failed. Please try again.');
//       setProcessing(false);
//     }
//   };

//   const handleInteracVerification = async () => {
//     if (!booking) return;

//     setProcessing(true);
//     setError('');

//     try {
//       const response = await api.get(`/interac/auth-url?bookingId=${finalBookingId}`);

//       if (!response.data.authUrl) {
//         throw new Error('Failed to get Interac auth URL');
//       }

//       // Redirect to Interac Hub for identity verification
//       window.location.href = response.data.authUrl;
//     } catch (error) {
//       console.error('Interac verification error:', error);
//       setError(error.message || 'Verification failed. Please try again.');
//       setProcessing(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading payment details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error && !booking) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="max-w-md mx-auto text-center">
//           <div className="bg-white rounded-lg shadow-sm p-8">
//             <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
//               <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
//               </svg>
//             </div>
//             <h1 className="text-xl font-bold text-gray-900 mb-2">Error</h1>
//             <p className="text-gray-600 mb-6">{error}</p>
//             <button
//               onClick={() => navigate('/quote/' + finalBookingId)}
//               className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900"
//             >
//               Back to Quote
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
//         <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
//           <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Payment Details</h2>
//           <p className="text-gray-600">Please wait while we verify your booking status...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 md:py-12">
//       <div className="max-w-sm md:max-w-2xl mx-auto px-4">
//         {interacVerified && (
//           <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
//             <div className="flex items-center gap-3">
//               <div className="text-green-600">
//                 <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
//                   <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
//                 </svg>
//               </div>
//               <div>
//                 <p className="font-medium text-green-900">Identity Verified Successfully!</p>
//                 <p className="text-sm text-green-700">You can now proceed with your payment.</p>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="bg-white rounded-lg shadow-sm p-4 md:p-8">
//           <div className="text-center mb-4 md:mb-8">
//             <h1 className="text-sm md:text-3xl font-bold text-gray-900 mb-2">Secure Payment</h1>
//             <p className="text-gray-600">Complete your booking with a secure deposit payment</p>
//           </div>

//           {error && (
//             <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//               <p className="text-red-800 text-sm">{error}</p>
//             </div>
//           )}

//           {success && (
//             <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
//               <p className="text-green-800 text-sm">{success}</p>
//             </div>
//           )}

//           {/* Booking Summary */}
//           <div className="bg-gray-50 rounded-lg p-6 mb-8">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>

//             <div className="space-y-3">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Booking ID:</span>
//                 <span className="font-medium">{bookingId}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Service:</span>
//                 <span className="font-medium">{booking.service_type}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Client:</span>
//                 <span className="font-medium">{booking.name}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Event Date:</span>
//                 <span className="font-medium">
//                   {booking.event_date ? new Date(booking.event_date).toLocaleDateString('en-CA') : 'N/A'}
//                 </span>
//               </div>

//               <hr className="my-4" />

//               <div className="flex justify-between text-lg font-semibold">
//                 <span>Deposit Amount:</span>
//                 <span className="text-purple-600">${depositAmount.toFixed(2)} CAD</span>
//               </div>
//             </div>
//           </div>

//           {/* Payment Method Selection */}
//           <div className="mb-8">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Payment Method</h3>

//             {/* Coupon Discount Notice */}
//             <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4 mb-6">
//               <div className="flex items-center gap-3">
//                 <div className="text-purple-600">
//                   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="font-bold text-purple-800 text-lg">🎟️ Coupon Discounts Available!</p>
//                   <p className="text-purple-700 font-medium">Apply coupon codes only through Credit/Debit Card (Stripe) payments</p>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 mb-6">
//               {/* Stripe Option */}
//               <div
//                 className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
//                   paymentMethod === 'stripe'
//                     ? 'border-blue-500 bg-blue-50'
//                     : 'border-gray-200 hover:border-blue-300'
//                 }`}
//                 onClick={() => setPaymentMethod('stripe')}
//               >
//                 <div className="flex flex-col sm:flex-row sm:items-center gap-3">
//                   <div className="flex items-center gap-3">
//                     <input
//                       type="radio"
//                       name="paymentMethod"
//                       value="stripe"
//                       checked={paymentMethod === 'stripe'}
//                       onChange={() => setPaymentMethod('stripe')}
//                       className="text-blue-600 focus:ring-blue-500"
//                     />
//                     <div className="text-blue-600">
//                       <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
//                         <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v2h16V6H4zm0 4v8h16v-8H4z"/>
//                       </svg>
//                     </div>
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-900">Credit/Debit Card</p>
//                     <p className="text-sm text-gray-600">Powered by Stripe</p>
//                   </div>
//                 </div>
//               </div>

//               {/* PayPal Option */}
//               {/* <div
//                 className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
//                   paymentMethod === 'paypal'
//                     ? 'border-blue-500 bg-blue-50'
//                     : 'border-gray-200 hover:border-blue-300'
//                 }`}
//                 onClick={() => setPaymentMethod('paypal')}
//               >
//                 <div className="flex flex-col sm:flex-row sm:items-center gap-3">
//                   <div className="flex items-center gap-3">
//                     <input
//                       type="radio"
//                       name="paymentMethod"
//                       value="paypal"
//                       checked={paymentMethod === 'paypal'}
//                       onChange={() => setPaymentMethod('paypal')}
//                       className="text-blue-600 focus:ring-blue-500"
//                     />
//                     <div className="text-blue-600">
//                       <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
//                         <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.622 1.566 1.035.974 1.481 2.408 1.34 3.948-.013.104-.023.208-.033.31l.196 1.42c.043.31.068.625.084.94.263 5.224-1.835 8.167-6.704 8.167h-2.128c-.492 0-.889.322-.983.796l-.553 2.628c-.054.257-.226.44-.491.47zm1.425-16.53H6.77c-.813 0-1.428.183-1.865.547-.416.347-.683.895-.683 1.605 0 .406.063.74.187 1.004.122.26.344.438.645.534.302.096.668.143 1.092.143h.75c.875 0 1.591-.221 2.14-.662.545-.441.817-1.028.817-1.756 0-.72-.269-1.314-.807-1.76-.544-.448-1.257-.67-2.125-.67z"/>
//                       </svg>
//                     </div>
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-900">PayPal</p>
//                     <p className="text-sm text-gray-600">Pay with PayPal account</p>
//                   </div>
//                 </div>
//               </div> */}

//               {/* Interac Option */}
//               <div
//                 className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
//                   paymentMethod === 'interac'
//                     ? 'border-blue-500 bg-blue-50'
//                     : 'border-gray-200 hover:border-blue-300'
//                 }`}
//                 onClick={() => setPaymentMethod('interac')}
//               >
//                 <div className="flex flex-col sm:flex-row sm:items-center gap-3">
//                   <div className="flex items-center gap-3">
//                     <input
//                       type="radio"
//                       name="paymentMethod"
//                       value="interac"
//                       checked={paymentMethod === 'interac'}
//                       onChange={() => setPaymentMethod('interac')}
//                       className="text-blue-600 focus:ring-blue-500"
//                     />
//                     <div className="text-blue-600">
//                       <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
//                         <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
//                       </svg>
//                     </div>
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-900">Interac E-Transfer</p>
//                     <p className="text-sm text-gray-600">Send payment via Interac</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Payment Method Details */}
//             {paymentMethod === 'stripe' && (
//               <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
//                 <div className="flex items-center gap-3">
//                   <div className="text-blue-600">
//                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v2h16V6H4zm0 4v8h16v-8H4z"/>
//                     </svg>
//                   </div>
//                   <div>
//                     <p className="text-lg font-bold text-indigo-700">Secure Card Payment</p>
//                     <p className="text-sm text-gray-600">Your payment information is secure and encrypted</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* {paymentMethod === 'paypal' && (
//               <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
//                 <div className="flex items-center gap-3">
//                   <div className="text-blue-600">
//                     <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
//                       <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.622 1.566 1.035.974 1.481 2.408 1.34 3.948-.013.104-.023.208-.033.31l.196 1.42c.043.31.068.625.084.94.263 5.224-1.835 8.167-6.704 8.167h-2.128c-.492 0-.889.322-.983.796l-.553 2.628c-.054.257-.226.44-.491.47zm1.425-16.53H6.77c-.813 0-1.428.183-1.865.547-.416.347-.683.895-.683 1.605 0 .406.063.74.187 1.004.122.26.344.438.645.534.302.096.668.143 1.092.143h.75c.875 0 1.591-.221 2.14-.662.545-.441.817-1.028.817-1.756 0-.72-.269-1.314-.807-1.76-.544-.448-1.257-.67-2.125-.67z"/>
//                     </svg>
//                   </div>
//                   <div>
//                     <p className="font-medium text-blue-900">PayPal Payment</p>
//                     <p className="text-sm text-blue-700">Pay securely with your PayPal account</p>
//                   </div>
//                 </div>
//               </div>
//             )} */}

//             {paymentMethod === 'interac' && (
//               <div className={`border p-4 rounded-lg ${interacVerified ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
//                 <div className="flex items-center gap-3">
//                   <div className={interacVerified ? 'text-green-600' : 'text-blue-600'}>
//                     <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
//                       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
//                     </svg>
//                   </div>
//                   <div>
//                     {interacVerified ? (
//                       <>
//                         <p className="font-medium text-green-900">✓ Identity Verified</p>
//                         <p className="text-sm text-green-700">Proceed with payment using Stripe or PayPal</p>
//                       </>
//                     ) : (
//                       <>
//                         <p className="font-medium text-blue-900">Interac Identity Verification</p>
//                         <p className="text-sm text-blue-700">Verify your identity using Interac Hub for enhanced security</p>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Terms Reminder */}
//           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
//             <p className="text-sm text-yellow-800">
//               <strong>Important:</strong> This deposit secures your booking date and is non-refundable.
//               You will receive a confirmation email with payment details and remaining balance information.
//             </p>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-4">
//             <button
//               onClick={() => navigate('/quote/' + finalBookingId)}
//               disabled={processing}
//               className="flex-1 px-3 py-1.5 md:px-6 md:py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               ← Back to Quote
//             </button>

//             {paymentMethod === 'stripe' ? (
//               <button
//                 onClick={handlePayment}
//                 disabled={processing || loading || !booking}
//                 className="flex-1 px-3 py-1.5 md:px-6 md:py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//               >
//                 {processing ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                     Processing...
//                   </>
//                 ) : (
//                   `Pay Deposit $${depositAmount.toFixed(2)}`
//                 )}
//               </button>
//             ) : /* paymentMethod === 'paypal' ? (
//               <div id="paypal-button-container" className="flex-1"></div>
//             ) : */ paymentMethod === 'interac' ? (
//               <button
//                 onClick={() => setShowInteracModal(true)}
//                 disabled={processing || loading || !booking}
//                 className="flex-1 px-3 py-1.5 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//               >
//                 Proceed with Interac E-Transfer
//               </button>
//             ) : null}
//           </div>
//         </div>
//       </div>

//       {/* Interac Payment Modal */}
//       {showInteracModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-semibold text-white">Interac E-Transfer Payment</h2>
//                 <button
//                   onClick={() => setShowInteracModal(false)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>

//               <InteracPaymentSection
//                 bookingId={finalBookingId}
//                 depositAmount={depositAmount}
//                 processing={processing}
//                 setProcessing={setProcessing}
//                 setError={setError}
//                 setSuccess={setSuccess}
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
