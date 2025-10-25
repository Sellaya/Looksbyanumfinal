import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookingSchema } from "./lib/schema";
import "./App.css";
import RegionSelection from "./components/RegionSelection.jsx";
import ServiceModeSelection from "./components/ServiceModeSelection.jsx";
import StudioAddress from "./components/StudioAddress.jsx";
import ServiceTypeSelection from "./components/ServiceTypeSelection.jsx";
import BrideServiceSelection from "./components/BrideServiceSelection.jsx";
import BrideAddons from "./components/BrideAddons.jsx";
import BridalParty from "./components/BridalParty.jsx";
import BridalPartyAddons from "./components/BridalPartyAddons.jsx";
import SemiBridalServiceSelection from "./components/SemiBridalServiceSelection.jsx";
import SemiBridalAddons from "./components/SemiBridalAddons.jsx";
import SemiBridalParty from "./components/SemiBridalParty.jsx"; 
import SemiBridalPartyAddons from "./components/SemiBridalPartyAddons.jsx";
import NonBridalServiceSelection from "./components/NonBridalServiceSelection.jsx";
import NonBridalBreakdown from "./components/NonBridalBreakdown.jsx";
import ClientDetails from "./components/ClientDetails.jsx";
import EventDetailsStep from "./components/EventDetailsStep.jsx";
import ContractReview from "./components/ContractReview.jsx";
import PaymentStep from "./components/PaymentStep.jsx";
import DestinationEventDates from "./components/DestinationEventDates.jsx";
import DestinationDetails from "./components/DestinationDetails.jsx";
import DestinationConsultation from "./components/DestinationConsultation.jsx";
import DestinationSummary from "./components/DestinationSummary.jsx";
import ArtistSelection from "./components/ArtistSelection.jsx";
import SemiBridalSummary from "./components/SemiBridalSummary.jsx";
import QuoteReview from "./components/QuoteReview.jsx";
import PostBookingArtistSelection from "./components/PostBookingArtistSelection.jsx";
import ToastManager from "./components/ToastManager.jsx";
import DateTimeSelection from "./components/DateTimeSelection.jsx";
import ServiceAddress from "./components/ServiceAddress.jsx";
import BookingHeader from "./components/BookingHeader.jsx";
import EditBookingLookup from "./components/EditBookingLookup.jsx";
import PaymentScreenshotUpload from "./components/PaymentScreenshotUpload.jsx";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
// Load Stripe with the publishable key 
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE);

// Create API client with base URL
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "https://looksbyanum-saqib.vercel.app/api/",
});

console.log("baseURL test", api)

export default function App() {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState(null);
  const [quote, setQuote] = useState({
    quote_total: 0,
    deposit_amount: 0,
    remaining_amount: 0,
  });
  const [confirmationEmailSent, setConfirmationEmailSent] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState("");
  const [remainingPaymentBooking, setRemainingPaymentBooking] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState("");
  const [editBookingData, setEditBookingData] = useState(null);
  const [showEditLookup, setShowEditLookup] = useState(false);

  // Handle URL parameters for remaining payment links
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("paid") === "1" || urlParams.get("fully_paid") === "1") {
      // Redirect to success page carrying session_id for lookup
      const sessionId = urlParams.get("session_id");
      const bookingId = urlParams.get("booking_id");
      const qs = new URLSearchParams({
        ...(sessionId ? { session_id: sessionId } : {}),
        ...(bookingId ? { booking_id: bookingId } : {}),
      });
      window.location.replace(`/success?${qs.toString()}`);
      return;
    }
    const bookingId = urlParams.get("booking_id");
    const isRemainingPayment =
      window.location.pathname.includes("remaining-payment") ||
      urlParams.has("booking_id");

    if (bookingId && isRemainingPayment) {
      console.log(
        "Remaining payment link detected, loading booking:",
        bookingId
      );

      // Load booking data for remaining payment
      api
        .get(`/bookings/lookup/${bookingId}`)
        .then((response) => {
          const booking = response.data;
          console.log("Loaded booking for remaining payment:", booking);

          // Populate form with booking data
          Object.keys(booking).forEach((key) => {
            if (key !== "pricing" && key !== "client" && key !== "event") {
              setValue(key, booking[key]);
            }
          });

          // Set client details (already flattened in response)
          setValue("name", booking.name);
          setValue("email", booking.email);
          // Strip +1 prefix from phone number for form input (since +1 is shown as prefix)
          const phoneNumber = booking.phone || "";
          setValue(
            "phone",
            phoneNumber.startsWith("+1")
              ? phoneNumber.substring(2)
              : phoneNumber
          );

          // Set event details (already flattened in response)
          setValue("event_date", booking.event_date);
          setValue("service_date", booking.event_date);
          setValue("ready_time", booking.ready_time);
          setValue("service_time", booking.ready_time);
          if (booking.pricing) {
            setQuote({
              quote_total: booking.pricing.quote_total || 0,
              deposit_amount: booking.pricing.deposit_amount || 0,
              remaining_amount: booking.pricing.remaining_amount || 0,
            });
          }

          // Store booking data for payment
          setRemainingPaymentBooking(booking);

          // Go directly to payment step (step 17 for most services)
          setStep(17);

          console.log("Navigated to payment step for remaining payment");
        })
        .catch((error) => {
          console.error("Failed to load booking for remaining payment:", error);
          window.showToast(
            "Unable to load booking details. Please check your link or contact support.",
            "error"
          );
        });
    }
  }, []);

  const handleEditBookingLoaded = (booking) => {
    console.log("Loading booking for editing:", booking);

    // Check if booking is fully paid - redirect to success page
    if (
      booking.payment_status === "fully_paid" ||
      booking.pricing?.remaining_amount === 0
    ) {
      console.log("Booking is fully paid, redirecting to success page");
      const qs = new URLSearchParams({
        booking_id: booking.unique_id,
        fully_paid: "1",
      });
      window.location.replace(`/success?${qs.toString()}`);
      return;
    }

    // Set edit mode
    setIsEditMode(true);
    setEditBookingData(booking);
    setEditingBookingId(booking.unique_id);

    // Build form data object
    const formData = {};

    // Populate form with booking data
    Object.keys(booking).forEach((key) => {
      if (
        key !== "pricing" &&
        key !== "client" &&
        key !== "event" &&
        key !== "_id" &&
        key !== "createdAt" &&
        key !== "updatedAt"
      ) {
        let value = booking[key];

        // Format dates for HTML date inputs
        if (
          key === "event_date" ||
          key === "trial_date" ||
          key === "event_start_date" ||
          key === "event_end_date"
        ) {
          if (value) {
            // Convert Date object or ISO string to yyyy-mm-dd format
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              value = date.toISOString().split("T")[0];
            }
          }
        }

        formData[key] = value;
      }
    });

    // Set client details
    formData.name = booking.name;
    formData.email = booking.email;
    // Strip +1 prefix from phone number for form input (since +1 is shown as prefix)
    const phoneNumber = booking.phone || "";
    formData.phone = phoneNumber.startsWith("+1")
      ? phoneNumber.substring(2)
      : phoneNumber;

    // Split name into first_name and last_name
    if (booking.name) {
      const nameParts = booking.name.trim().split(" ");
      formData.first_name = nameParts[0] || "";
      formData.last_name = nameParts.slice(1).join(" ") || "";
    }

    // Handle Non-Bridal specific fields
    if (booking.service_type === "Non-Bridal") {
      formData.nonBridal = {
        personCount: booking.non_bridal_count || 0,
        everyoneBoth: booking.non_bridal_everyone_both,
        bothCount: booking.non_bridal_both_count || 0,
        makeupOnlyCount: booking.non_bridal_makeup_count || 0,
        hairOnlyCount: booking.non_bridal_hair_count || 0,
        extensionsCount: booking.non_bridal_extensions_count || 0,
        jewelryCount: booking.non_bridal_jewelry_count || 0,
        hasAirbrush: booking.non_bridal_has_airbrush,
        airbrushCount: booking.non_bridal_airbrush_count || 0,
      };
    }

    // Reset form with the populated data
    reset(formData);

    // Set pricing
    if (booking.pricing) {
      setQuote({
        quote_total: booking.pricing.quote_total || booking.price || 0,
        deposit_amount: booking.pricing.deposit_amount || 0,
        remaining_amount: booking.pricing.remaining_amount || 0,
      });
    }

    // Start from step 1
    setStep(1);
    setShowEditLookup(false);
  };

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(BookingSchema),
    mode: "onChange", // Change validation mode to onChange for better UX
    defaultValues: {
      unique_id: "",
      name: "",
      email: "",
      phone: "",
      region: "",
      subRegion: "",
      service_type: "Bridal",
      service_mode: "Mobile Makeup Artist",
      price: 0,
      event_date: "",
      ready_time: "",
      artist: "",
      event_start_date: "",
      event_end_date: "",
      destination_details: "",
      bride_service: "",
      needs_trial: "No",
      trial_service: "",
      trial_date: "",
      needs_jewelry: "No",
      needs_extensions: "No",
      needs_saree_draping: "No",
      needs_hijab_setting: "No",
      has_party_members: "No",
      party_both_count: "",
      party_makeup_count: "",
      party_hair_count: "",
      party_dupatta_count: "",
      party_extensions_count: "",
      has_airbrush: "No",
      airbrush_count: "",
      nonBridal: {
        personCount: "",
        everyoneBoth: "No",
        bothCount: "",
        makeupOnlyCount: "",
        hairOnlyCount: "",
        extensionsCount: "",
        jewelryCount: "",
        hasAirbrush: "No",
        airbrushCount: "",
        hasSareeDraping: "No",
        sareeDrapingCount: "",
        hasHijabSetting: "No",
        hijabSettingCount: "",
        serviceType: "",
        extensions: "false",
        veil_or_jewelry_setting: "false",
        airbrush: "false",
      },
      non_bridal_count: 0,
      non_bridal_everyone_both: "No",
      non_bridal_both_count: 0,
      non_bridal_makeup_count: 0,
      non_bridal_hair_count: 0,
      non_bridal_extensions_count: 0,
      non_bridal_jewelry_count: 0,
      non_bridal_has_airbrush: "No",
      non_bridal_airbrush_count: 0,
      status: "lead",
      payment_status: "pending",
      stripe_session_id: "",
      quote_url: "",
      contract_pdf_url: "",
      remaining_invoice_url: "",
      inspiration_link: "",
      inspiration_images: [],
      submission_date: new Date(),
    },
  });

  useEffect(() => {
    api
      .get("/config")
      .then((r) => setConfig(r.data))
      .catch(() => setConfig({}));
  }, []);

  // Construct full name from first_name and last_name
  useEffect(() => {
    const firstName = watch("first_name");
    const lastName = watch("last_name");
    if (firstName && lastName) {
      setValue("name", `${firstName.trim()} ${lastName.trim()}`);
    }
  }, [watch("first_name"), watch("last_name"), setValue]);

  // Send booking confirmation email when reaching contract review step
  useEffect(() => {
    console.log(
      "🔄 useEffect triggered - Current step:",
      step,
      "confirmationEmailSent:",
      confirmationEmailSent
    );

    const serviceType = getValues("service_type");
    console.log("Service type from form:", serviceType);

    const isContractReviewStep =
      (serviceType === "Bridal" && step === 13) ||
      (serviceType === "Semi-Bridal" && step === 11);

    console.log("Email check:", {
      step,
      serviceType,
      isContractReviewStep,
      confirmationEmailSent,
      expectedStep: serviceType === "Bridal" ? 12 : 10,
    });

    if (isContractReviewStep && !confirmationEmailSent) {
      const bookingData = getValues();

      console.log("Contract review step reached, checking data:", {
        hasEmail: !!bookingData.client?.email,
        hasName: !!bookingData.client?.name?.trim(),
        hasFirstName: !!bookingData.client?.first_name?.trim(),
        hasLastName: !!bookingData.client?.last_name?.trim(),
        email: bookingData.client?.email,
        name: bookingData.client?.name,
        firstName: bookingData.client?.first_name,
        lastName: bookingData.client?.last_name,
      });

      // Check if we have minimum required data for email
      const hasEmail = !!bookingData.client?.email;
      const hasName = !!bookingData.client?.name?.trim();
      const hasFirstLast = !!(
        bookingData.client?.first_name?.trim() &&
        bookingData.client?.last_name?.trim()
      );

      if (hasEmail && (hasName || hasFirstLast)) {
        console.log("Sending booking confirmation email...", bookingData);

        // Send confirmation email
        api
          .post("/bookings/send-confirmation", bookingData)
          .then((response) => {
            console.log(
              "Booking confirmation email sent successfully:",
              response.data
            );
            // Store the booking_id for later use when creating the booking
            if (response.data.booking_id) {
              setValue("booking_id", response.data.booking_id);
              console.log(
                "Stored booking_id from confirmation email:",
                response.data.booking_id
              );
            }
            setConfirmationEmailSent(true);
            window.showToast(
              "Booking confirmation email sent! Please check your email.",
              "success"
            );
          })
          .catch((error) => {
            console.error("Failed to send confirmation email:", error);
            window.showToast(
              "Failed to send confirmation email. Please try again.",
              "error"
            );
            // Don't set confirmationEmailSent to true on error, so it can retry
          });
      } else {
        console.log(
          "Missing required data for email - will retry when data is available"
        );
      }
    }
  }, [step, confirmationEmailSent]);

  const getStepTitle = () => {
    const serviceType = getValues("service_type");
    const region = getValues("region");
    const serviceMode = getValues("service_mode");

    if (step === 1) return "Service Mode";
    if (step === 2) {
      // For Studio Service, show studio address instead of region selection
      if (serviceMode === "Studio Service") {
        return "Studio Address";
      }
      return "Region";
    }
    if (step === 3) return "Service Type";
    if (step === 4) return "Service Details";

    // Service-specific steps
    if (serviceType === "Bridal") {
      if (step === 5) return "Bridal Service Details";
      if (step === 6) return "Additional Services";
      if (step === 7) return "Bridal Party";
      if (step === 8) return "Contact Information";
      // Steps 9-11 hidden for Bridal
    } else if (serviceType === "Semi-Bridal") {
      if (step === 5) return "Semi Bridal Service Details";
      if (step === 6) return "Additional Services";
      if (step === 7) return "Bridal Party Services";
      if (step === 8) return "Contact Information";
      // Steps 9-11 hidden for Semi-Bridal
    } else if (serviceType === "Non-Bridal") {
      if (step === 5) return "How many people need my service?";
      if (step === 6) return "Service Details";
      if (step === 7) return "Contact Information";
    }

    // Post-booking flow steps (applies to all service types)
    if (step === 12) return "Quote Review";
    if (step === 13) return "Select Your Artist";
    if (step === 14) return "Choose Date & Time";
    if (step === 15) return "Service Address";
    if (step === 16) return "Review Contract";
    if (step === 17) return "Payment";

    // Destination Wedding flow
    if (region === "Destination Wedding") {
      if (step === 3) return "Event Dates";
      if (step === 4) return "Destination Details";
      if (step === 5) return "Contact Information";
      if (step === 6) return "Schedule Consultation";
      if (step === 7) return "Booking Summary";
    }

    return "Step";
  };

  const getTotalSteps = () => {
    const serviceType = getValues("service_type");
    const region = getValues("region");

    // Destination weddings have their own flow
    if (region === "Destination Wedding") {
      return 7; // Destination wedding flow: steps 1-7 (service mode + 6 existing steps)
    }

    if (serviceType === "Non-Bridal") {
      return 8; // Non-Bridal flow: steps 1-8 (service mode + 7 existing steps including payment)
    } else if (serviceType === "Bridal") {
      return 8; // Bridal flow: steps 1-8 (service mode + 7 existing steps, stops at contact info)
    } else if (serviceType === "Semi-Bridal") {
      return 8; // Semi-Bridal flow: steps 1-8 (service mode + 7 existing steps, stops at contact info)
    }

    return 8; // Default fallback
  };

  const onNext = async () => {
    console.log("onNext called, current step:", step);
    const serviceType = getValues("service_type");
    const totalSteps = getTotalSteps();
    console.log("Service type:", serviceType, "Total steps:", totalSteps);

    // Special handling for contact information step
    const region = getValues("region");
    const isContactStep =
      (serviceType === "Non-Bridal" && step === 7) ||
      (serviceType === "Bridal" && step === 8) ||
      (serviceType === "Semi-Bridal" && step === 8) ||
      (region === "Destination Wedding" && step === 5);

    console.log("Is contact step:", isContactStep, "Region:", region);

    if (isContactStep) {
      console.log("Contact step detected, making API call...");
      try {
        const data = getValues();
        console.log("Form data:", data);
        console.log("🔍 Contact step - Full form data:", data);
        console.log(
          "🔍 Contact step - data.needs_hijab_setting:",
          data.needs_hijab_setting
        );

        // Create or update booking with ALL form data
        const bookingData = {
          // Include unique_id for updates
          ...(isEditMode &&
            editingBookingId && { unique_id: editingBookingId }),

          // Basic contact info
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          email: data.email,
          phone: data.phone,

          // Region and service type
          region: data.region,
          subRegion: data.subRegion,
          service_type: data.service_type,
          service_mode: data.service_mode,

          // Event details
          event_date: data.event_date,
          ready_time: data.ready_time,

          // Destination wedding fields
          event_start_date: data.event_start_date,
          event_end_date: data.event_end_date,
          destination_details: data.destination_details,

          // Artist selection
          artist: data.artist,

          // Bridal service fields
          bride_service: data.bride_service,
          needs_trial: data.needs_trial,
          trial_service: data.trial_service,
          needs_jewelry: data.needs_jewelry,
          needs_extensions: data.needs_extensions,
          needs_saree_draping: data.needs_saree_draping,
          needs_hijab_setting: data.needs_hijab_setting,

          // Party member fields
          has_party_members: data.has_party_members,
          party_both_count: data.party_both_count || 0,
          party_makeup_count: data.party_makeup_count || 0,
          party_hair_count: data.party_hair_count || 0,
          party_dupatta_count: data.party_dupatta_count || 0,
          party_extensions_count: data.party_extensions_count || 0,
          party_saree_draping_count: data.party_saree_draping_count || 0,
          party_hijab_setting_count: data.party_hijab_setting_count || 0,

          // Airbrush fields
          has_airbrush: data.has_airbrush,
          airbrush_count: data.airbrush_count || 0,

          // Non-bridal fields
          non_bridal_count: data.nonBridal?.personCount || 0,
          non_bridal_everyone_both: data.nonBridal?.everyoneBoth,
          non_bridal_both_count: data.nonBridal?.bothCount || 0,
          non_bridal_makeup_count: data.nonBridal?.makeupOnlyCount || 0,
          non_bridal_hair_count: data.nonBridal?.hairOnlyCount || 0,
          non_bridal_extensions_count: data.nonBridal?.extensionsCount || 0,
          non_bridal_jewelry_count: data.nonBridal?.jewelryCount || 0,
          non_bridal_has_airbrush: data.nonBridal?.hasAirbrush,
          non_bridal_airbrush_count: data.nonBridal?.airbrushCount || 0,
          non_bridal_has_saree_draping: data.nonBridal?.hasSareeDraping,
          non_bridal_saree_draping_count:
            data.nonBridal?.sareeDrapingCount || 0,
          non_bridal_has_hijab_setting: data.nonBridal?.hasHijabSetting,
          non_bridal_hijab_setting_count:
            data.nonBridal?.hijabSettingCount || 0,

          // Trial date and time
          trial_date: data.trial_date,
          trial_time: data.trial_time,

          // Status
          status: "lead",

          // Inspiration
          inspiration_link: data.inspiration_link || "",
          inspiration_images: Array.isArray(data.inspiration_images)
            ? data.inspiration_images
            : [],
        };

        let response;
        if (isEditMode && editingBookingId) {
          console.log("Updating existing booking:", editingBookingId);
          response = await api.put(
            `/bookings/${editingBookingId}`,
            bookingData
          );
          console.log("Booking updated:", response.data);
        } else {
          console.log("Creating new booking with data:", bookingData);
          console.log(
            "🔍 Frontend App.jsx - bookingData.service_mode:",
            bookingData.service_mode
          );
          console.log(
            "🔍 Frontend App.jsx - bookingData.needs_hijab_setting:",
            bookingData.needs_hijab_setting
          );
          response = await api.post("/bookings", bookingData);
          console.log("Booking created for contact info:", response.data);
        }

        // Handle destination weddings differently - save data but continue to next step (Calendly booking)
        if (region === "Destination Wedding") {
          console.log(
            "Destination wedding booking saved, continuing to Calendly step"
          );
          // Continue to next step instead of redirecting
          setStep((s) => Math.min(s + 1, totalSteps));
          return;
        }

        // Show loader message that email sent, then redirect to quote page
        const bookingId = response.data.booking_id;
        if (bookingId) {
          const loader = document.createElement("div");
          // Updated background to dark, transparent overlay for loading screen
          loader.className =
            "fixed inset-0 flex items-center justify-center bg-black/90 z-50";

          // Injected HTML updated to Rose Glow Spinner and dark theme text
          loader.innerHTML =
            '<div class="text-center p-10 bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl shadow-rose-900/50">' +
            // Rose Glow Spinner (Using w-12 h-12 size for prominence)
            '<div class="w-12 h-12 rounded-full border-4 border-rose-500 border-t-transparent animate-spin mx-auto mb-4"></div>' +
            // Loading Message Text (White/Rose Glow text)
            '<div class="text-white font-light text-xl">Email sent! Please check your inbox...</div>' +
            '<div class="text-rose-300 text-base mt-2 font-light">Redirecting to quote page...</div>' +
            "</div>";

          document.body.appendChild(loader);

          // Existing timeout logic remains unchanged
          setTimeout(() => {
            window.location.replace(`${import.meta.env.VITE_FRONTEND_URL || ""}/quote/${bookingId}`);
          }, 1200);
        } else {
          // Standard error toast fallback (functionality remains unchanged)
          window.showToast(
            "Thank you! Please check your email for package options and next steps.",
            "success"
          );
        }

        // Don't continue to next step - user should use the email link
        return;
      } catch (error) {
        console.error("Failed to create/update booking:", error);
        console.error("Error details:", error.response?.data || error.message);
        window.showToast(
          "Failed to save your information. Please try again.",
          "error"
        );
        return;
      }
    }

    // Generate quote before payment step
    const isQuoteStep =
      (serviceType === "Bridal" && step === 8) ||
      (serviceType === "Semi-Bridal" && step === 8);

    if (isQuoteStep) {
      const data = getValues();
      console.log(
        "🔍 Frontend: Quote data being sent:",
        JSON.stringify(data, null, 2)
      );
      console.log(
        "🔍 Frontend: needs_hijab_setting value:",
        data.needs_hijab_setting
      );
      const r = await api.post("/quote", data);
      console.log("🔍 Frontend: Quote response:", r.data);
      setQuote(r.data);
      setValue("pricing.quote_total", r.data.quote_total);
      setValue("pricing.deposit_amount", r.data.deposit_amount);
      setValue("pricing.remaining_amount", r.data.remaining_amount);

      // If booking already exists, update it with pricing information
      if (data.booking_id && data.booking_id !== "temp") {
        try {
          await api.patch(`/bookings/${data.booking_id}/pricing`, {
            pricing: {
              quote_total: r.data.quote_total,
              deposit_amount: r.data.deposit_amount,
              deposit_percentage: 30,
              remaining_amount: r.data.remaining_amount,
              amount_paid: 0,
            },
          });
          console.log("Updated booking with pricing information");
        } catch (error) {
          console.error("Failed to update booking pricing:", error);
        }
      }
    }

    setStep((s) => Math.min(s + 1, totalSteps));
  };

  const onPrev = () => setStep((s) => Math.max(1, s - 1));

  const onBook = async () => {
    const data = getValues();
    console.log("Booking data to send:", data);

    try {
      // Try to serialize the data to find circular references
      const serialized = JSON.stringify(data);
      console.log("Data serialized successfully");

      // Calculate quote first if not already calculated (skip for destination weddings)
      let quoteData = quote;
      const region = getValues("region");
      console.log("Quote Data Test",quoteData)
      if (region === "Destination Wedding") {
        // For destination weddings, always set pricing to 0
        quoteData = {
          quote_total: 0,
          deposit_amount: 0,
          remaining_amount: 0,
        };
        setQuote(quoteData);
        setValue("pricing.quote_total", 0);
        setValue("pricing.deposit_amount", 0);
        setValue("pricing.remaining_amount", 0);
        console.log("Destination wedding - pricing set to 0");
      } else if (!quoteData.quote_total) {
        console.log("Calculating quote before booking creation...");
        const quoteResponse = await api.post("/quote", data);
        quoteData = quoteResponse.data;
        setQuote(quoteData);
        setValue("pricing.quote_total", quoteData.quote_total);
        setValue("pricing.deposit_amount", quoteData.deposit_amount);
        setValue("pricing.remaining_amount", quoteData.remaining_amount);
        console.log("Quote calculated:", quoteData);
      }

      // Include pricing in booking data
      const bookingData = {
        ...data,
        pricing: {
          quote_total: quoteData.quote_total,
          deposit_amount: quoteData.deposit_amount,
          deposit_percentage: data.service_type === "Non-Bridal" ? 50 : 30,
          remaining_amount: quoteData.remaining_amount,
          amount_paid: 0,
        },
      };

      const r = await api.post("/bookings", bookingData);
      window.showToast("Saved booking: " + r.data.booking_id, "success");

      // Store the booking_id in the form data for later use
      setValue("booking_id", r.data.booking_id);

      // For destination weddings, show confirmation and stop the flow
      if (region === "Destination Wedding") {
        window.showToast(
          "Thank you for your booking! Our team will contact you soon with a customized quote for your destination wedding services.",
          "success"
        );
        return;
      }

      // Continue to next step in the booking flow
      setStep(11); // Move to quote review step
    } catch (error) {
      console.error("Serialization error:", error);
      // Try to identify which field is causing the issue
      const problematicFields = [];
      for (const [key, value] of Object.entries(data)) {
        try {
          JSON.stringify(value);
        } catch (e) {
          problematicFields.push(key);
          console.error(`Field "${key}" contains circular reference:`, value);
        }
      }
      window.showToast(
        `Cannot submit booking due to data issues in fields: ${problematicFields.join(
          ", "
        )}`,
        "error"
      );
    }
  };

  const handlePayment = async () => {
    try {
      const bookingData = getValues();

      // Check if this is a remaining payment from the loaded booking
      let isRemainingPayment = !!remainingPaymentBooking;

      if (!isRemainingPayment) {
        // Check if this is an existing booking that needs remaining payment
        if (bookingData.booking_id && bookingData.booking_id !== "temp") {
          try {
            const bookingResponse = await api.get(
              `/bookings/lookup/${bookingData.booking_id}`
            );
            const existingBooking = bookingResponse.data;
            if (existingBooking.pricing?.payment_status === "deposit_paid") {
              isRemainingPayment = true;
            }
          } catch (error) {
            console.log(
              "Could not check existing booking status, proceeding with deposit payment"
            );
          }
        }
      }

      // For remaining payments from links, we don't need to update booking details
      if (!remainingPaymentBooking) {
        // First, update the booking with all collected details
        const updateResponse = await api.patch(
          `/bookings/${bookingData.booking_id || "temp"}/details`,
          {
            selected_artist: bookingData.selected_artist,
            service_date: bookingData.service_date,
            service_time: bookingData.service_time,
            venue_name: bookingData.venue_name,
            venue_address: bookingData.venue_address,
            venue_city: bookingData.venue_city,
            venue_province: bookingData.venue_province,
            venue_postal: bookingData.venue_postal,
            onsite_contact: bookingData.onsite_contact,
            onsite_phone: bookingData.onsite_phone,
            special_instructions: bookingData.special_instructions,
            terms_agreed: bookingData.terms_agreed,
            digital_signature: bookingData.digital_signature,
            // Include pricing information
            pricing: {
              quote_total: bookingData.price || quote.quote_total,
              deposit_amount: (bookingData.price || quote.quote_total) * 0.3,
              deposit_percentage: 30,
              remaining_amount: (bookingData.price || quote.quote_total) * 0.7,
              amount_paid: 0,
            },
          }
        );

        if (!updateResponse.data.success) {
          throw new Error("Failed to update booking details");
        }
      }

      // Create appropriate Stripe checkout session
      let stripeResponse;
      if (isRemainingPayment) {
        // Remaining payment - use the booking_id from the loaded booking or form data
        const bookingId =
          remainingPaymentBooking?.unique_id ||
          remainingPaymentBooking?.booking_id ||
          bookingData.booking_id;
        stripeResponse = await api.post(
          "/stripe/create-remaining-payment-session",
          {
            booking_id: bookingId,
          }
        );
      } else {
        // Deposit payment
        stripeResponse = await api.post("/stripe/create-checkout-session", {
          booking: {
            booking_id: bookingData.booking_id || "temp",
            client: {
              name: `${bookingData.first_name} ${bookingData.last_name}`,
              email: bookingData.email,
            },
            service_type: bookingData.service_type,
            region: bookingData.region,
            subRegion: bookingData.subRegion,
            event: {
              date: bookingData.service_date,
              ready_time: bookingData.service_time,
            },
            pricing: {
              quote_total: bookingData.price,
              deposit_percentage:
                bookingData.service_type === "Non-Bridal" ? 50 : 30,
            },
          },
        });
      }

      // Redirect to Stripe Checkout
      if (stripeResponse.data.url) {
        window.location.href = stripeResponse.data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      window.showToast(
        "Failed to process payment. Please try again or contact support.",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-6xl mx-auto px-2 sm:px-6">
        {/* Edit Booking Lookup */}
        {showEditLookup && (
          <EditBookingLookup
            onBookingLoaded={handleEditBookingLoaded}
            onBack={() => setShowEditLookup(false)}
          />
        )}

        {/* Main Booking Form */}
        {!showEditLookup && (
          <>
            <BookingHeader
              step={step}
              getTotalSteps={getTotalSteps}
              getStepTitle={getStepTitle}
              isEditMode={isEditMode}
            />

            {/* Edit Button */}
            

            {/* Payment Screenshot Upload Section */}
            {/* {step === 1 && !isEditMode && (
              // <div className="mb-6 flex justify-center">
              <div className="mb-6">
                <PaymentScreenshotUpload />
              </div>
            )} */}

            {/* Step Content */}
            {step === 1 && (
              <ServiceModeSelection
                onNext={onNext}
                register={register}
                setValue={setValue}
                getValues={getValues}
                watch={watch}
                errors={errors}
              />
            )}

            {step === 2 &&
              getValues("service_mode") === "Mobile Makeup Artist" && (
                <RegionSelection
                  onNext={onNext}
                  onBack={onPrev}
                  register={register}
                  setValue={setValue}
                  getValues={getValues}
                  errors={errors}
                />
              )}

            {step === 2 && getValues("service_mode") === "Studio Service" && (
              <StudioAddress onNext={onNext} onBack={onPrev} />
            )}

            {/* Destination Wedding Flow */}
            {getValues("region") === "Destination Wedding" && (
              <>
                {step === 3 && (
                  <DestinationEventDates
                    onNext={onNext}
                    onBack={onPrev}
                    register={register}
                    errors={errors}
                    watch={watch}
                  />
                )}

                {step === 4 && (
                  <DestinationDetails
                    onNext={onNext}
                    onBack={onPrev}
                    register={register}
                    errors={errors}
                  />
                )}

                {step === 5 && (
                  <ClientDetails
                    onNext={onNext}
                    onBack={onPrev}
                    register={register}
                    errors={errors}
                    handleSubmit={handleSubmit}
                    watch={watch}
                    setValue={setValue}
                    getValues={getValues}
                  />
                )}

                {step === 6 && (
                  <DestinationConsultation onNext={onNext} onBack={onPrev} />
                )}

                {step === 7 && (
                  <DestinationSummary
                    onNext={onNext}
                    onBack={onPrev}
                    getValues={getValues}
                  />
                )}
              </>
            )}

            {/* Regular Flow (Toronto/GTA & Outside GTA for Mobile, or Studio Service) */}
            {(((getValues("region") === "Toronto/GTA" ||
              getValues("region") === "Outside GTA") &&
              getValues("service_mode") === "Mobile Makeup Artist") ||
              getValues("service_mode") === "Studio Service") && (
              <>
                {step === 3 && (
                  <ServiceTypeSelection
                    onNext={onNext}
                    onBack={onPrev}
                    register={register}
                    setValue={setValue}
                    getValues={getValues}
                    watch={watch}
                    errors={errors}
                  />
                )}

                {step === 4 && (
                  <EventDetailsStep
                    onNext={onNext}
                    onBack={onPrev}
                    register={register}
                    errors={errors}
                    handleSubmit={handleSubmit}
                    watch={watch}
                  />
                )}

                {/* Bridal Flow (Toronto/GTA & Outside GTA regions only) */}
                {getValues("service_type") === "Bridal" &&
                  (((getValues("region") === "Toronto/GTA" ||
                    getValues("region") === "Outside GTA") &&
                    getValues("service_mode") === "Mobile Makeup Artist") ||
                    getValues("service_mode") === "Studio Service") && (
                    <>
                      {step === 5 && (
                        <BrideServiceSelection
                          onNext={onNext}
                          onBack={onPrev}
                          register={register}
                          watch={watch}
                          setValue={setValue}
                          errors={errors}
                        />
                      )}

                      {step === 6 && (
                        <BrideAddons
                          onNext={onNext}
                          onBack={onPrev}
                          register={register}
                          watch={watch}
                          setValue={setValue}
                          errors={errors}
                        />
                      )}

                      {step === 7 && (
                        <BridalParty
                          onNext={onNext}
                          onBack={onPrev}
                          register={register}
                          watch={watch}
                          setValue={setValue}
                          errors={errors}
                        />
                      )}

                      {step === 8 && (
                        <ClientDetails
                          onNext={onNext}
                          onBack={onPrev}
                          register={register}
                          setValue={setValue}
                          errors={errors}
                          handleSubmit={handleSubmit}
                          watch={watch}
                          getValues={getValues}
                        />
                      )}

                      {/* Steps 9-10 hidden for Bridal - flow stops at contact info */}
                    </>
                  )}

                {/* Semi-Bridal Flow */}
                {getValues("service_type") === "Semi-Bridal" &&
                  getValues("region") !== "Destination Wedding" && (
                    <>
                      {step === 5 && (
                        <SemiBridalServiceSelection
                          onNext={onNext}
                          onBack={onPrev}
                          register={register}
                          watch={watch}
                          setValue={setValue}
                          errors={errors}
                        />
                      )}

                      {step === 6 && (
                        <SemiBridalAddons
                          onNext={onNext}
                          onBack={onPrev}
                          register={register}
                          watch={watch}
                          setValue={setValue}
                          errors={errors}
                        />
                      )}

                      {step === 7 && (
                        <SemiBridalParty
                          onNext={onNext}
                          onBack={onPrev}
                          register={register}
                          watch={watch}
                          setValue={setValue}
                          errors={errors}
                        />
                      )}

                      {step === 8 &&
                        getValues("service_type") === "Semi-Bridal" && (
                          <ClientDetails
                            onNext={onNext}
                            onBack={onPrev}
                            register={register}
                            setValue={setValue}
                            errors={errors}
                            handleSubmit={handleSubmit}
                            watch={watch}
                            getValues={getValues}
                          />
                        )}

                      {/* Steps 9-10 hidden for Semi-Bridal - flow stops at contact info */}
                    </>
                  )}

                {/* Post-Booking Flow - Quote Review (Hidden for Bridal/Semi-Bridal) */}
                {step === 12 &&
                  getValues("service_type") !== "Bridal" &&
                  getValues("service_type") !== "Semi-Bridal" && (
                    <QuoteReview
                      onNext={onNext}
                      onBack={onPrev}
                      getValues={getValues}
                    />
                  )}

                {/* Post-Booking Flow - Artist Selection (Hidden for Bridal/Semi-Bridal) */}
                {step === 13 &&
                  getValues("service_type") !== "Bridal" &&
                  getValues("service_type") !== "Semi-Bridal" && (
                    <PostBookingArtistSelection
                      onNext={onNext}
                      onBack={onPrev}
                      getValues={getValues}
                      setValue={setValue}
                    />
                  )}

                {/* Post-Booking Flow - Date & Time Selection (Hidden for Bridal/Semi-Bridal) */}
                {step === 14 &&
                  getValues("service_type") !== "Bridal" &&
                  getValues("service_type") !== "Semi-Bridal" && (
                    <DateTimeSelection
                      onNext={onNext}
                      onBack={onPrev}
                      register={register}
                      setValue={setValue}
                      getValues={getValues}
                      errors={errors}
                    />
                  )}

                {/* Post-Booking Flow - Service Address (Hidden for Bridal/Semi-Bridal) */}
                {step === 15 &&
                  getValues("service_type") !== "Bridal" &&
                  getValues("service_type") !== "Semi-Bridal" && (
                    <ServiceAddress
                      onNext={onNext}
                      onBack={onPrev}
                      register={register}
                      getValues={getValues}
                      errors={errors}
                    />
                  )}

                {/* Post-Booking Flow - Contract Review (Hidden for Bridal/Semi-Bridal) */}
                {step === 16 &&
                  getValues("service_type") !== "Bridal" &&
                  getValues("service_type") !== "Semi-Bridal" && (
                    <div className="max-w-sm md:max-w-2xl lg:max-w-4xl mx-auto p-4 md:p-8 glass-card">
                      <h2 className="text-sm md:text-2xl font-bold text-gray-900 mb-2 md:mb-8 text-left">
                        Review & Sign Contract
                      </h2>

                      <div className="bg-gray-50 p-6 rounded-lg mb-8 border-2 border-gray-200 max-h-96 overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-6 text-gray-900">
                          Service Agreement Contract
                        </h3>

                        <div className="space-y-4 text-sm text-gray-800">
                          <div>
                            <h4 className="font-semibold mb-2">1. Parties</h4>
                            <p>
                              This agreement is between Looks By Anum (Service
                              Provider) and {getValues("first_name")}{" "}
                              {getValues("last_name")} (Client).
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">2. Services</h4>
                            <p>
                              Service Provider agrees to provide{" "}
                              {getValues("service_type")} makeup and hair
                              services on {getValues("service_date")} at{" "}
                              {getValues("service_time")}.
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">
                              3. Payment Terms
                            </h4>
                            <p>
                              Total service fee: ${getValues("price")} CAD
                              (including 13% HST). Deposit of $
                              {((getValues("price") || 0) * 0.5).toFixed(2)} CAD
                              is due upon signing. Balance due on service date.
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">
                              4. Cancellation Policy
                            </h4>
                            <p>
                              Cancellations made 30+ days before service date
                              receive full refund minus $50 admin fee.
                              Cancellations 14-30 days before receive 50%
                              refund. Cancellations less than 14 days receive no
                              refund.
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">5. Liability</h4>
                            <p>
                              Client assumes responsibility for any allergies or
                              skin sensitivities. Service Provider is not liable
                              for unsatisfactory results due to client's skin
                              condition or product reactions.
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">
                              6. Force Majeure
                            </h4>
                            <p>
                              In case of emergency or unforeseen circumstances,
                              Service Provider will make every effort to provide
                              alternative arrangements or full refund.
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">
                              7. Full Agreement
                            </h4>
                            <p>
                              This contract constitutes the entire agreement
                              between the parties and supersedes all prior
                              agreements.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg mb-6 border border-yellow-200">
                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            id="terms_agreed"
                            {...register("terms_agreed", {
                              required:
                                "You must agree to the terms and conditions",
                            })}
                            className="mt-1 mr-3"
                          />
                          <label
                            htmlFor="terms_agreed"
                            className="text-sm text-yellow-800"
                          >
                            I have read and agree to the terms and conditions
                            outlined in this service agreement. I understand the
                            payment terms, cancellation policy, and liability
                            clauses.
                          </label>
                        </div>
                        {errors.terms_agreed && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.terms_agreed.message}
                          </p>
                        )}
                      </div>

                      {/* Digital Signature */}
                      <div className="mb-8">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Digital Signature{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
                          <p className="text-sm text-gray-600 mb-3">
                            Please type your full name below as your digital
                            signature:
                          </p>
                          <input
                            type="text"
                            {...register("digital_signature", {
                              required: "Digital signature is required",
                              validate: (value) =>
                                value ===
                                  `${getValues("first_name")} ${getValues(
                                    "last_name"
                                  )}` || "Signature must match your full name",
                            })}
                            placeholder={`${getValues(
                              "first_name"
                            )} ${getValues("last_name")}`}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-lg font-signature"
                          />
                          {errors.digital_signature && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.digital_signature.message}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            By signing, you agree that this electronic signature
                            is legally binding and equivalent to a handwritten
                            signature.
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={onPrev}
                          className="px-3 py-1.5 md:px-8 md:py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
                        >
                          ← Back to Address
                        </button>
                        <button
                          type="button"
                          onClick={onNext}
                          disabled={
                            !getValues("terms_agreed") ||
                            !getValues("digital_signature")
                          }
                          className={`px-3 py-1.5 md:px-8 md:py-3 rounded-lg font-semibold transition-all duration-200 ${
                            getValues("terms_agreed") &&
                            getValues("digital_signature")
                              ? "bg-purple-600 text-white hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 cursor-pointer"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          Proceed to Payment →
                        </button>
                      </div>
                    </div>
                  )}

                {/* Post-Booking Flow - Payment (Hidden for Bridal/Semi-Bridal) */}
                {step === 17 &&
                  getValues("service_type") !== "Bridal" &&
                  getValues("service_type") !== "Semi-Bridal" && (
                    <div className="max-w-sm md:max-w-2xl mx-auto p-4 md:p-8 glass-card">
                      <h2 className="text-sm md:text-2xl font-bold text-gray-900 mb-2 md:mb-8 text-left">
                        {remainingPaymentBooking
                          ? "Complete Your Remaining Payment"
                          : "Complete Your Booking"}
                      </h2>

                      <div className="bg-gray-50 p-6 rounded-lg mb-8 border-2 border-gray-200">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900">
                          Payment Summary
                        </h3>
                        <div className="space-y-4 text-gray-800">
                          <div className="flex justify-between">
                            <span className="font-semibold">Service Type:</span>
                            <span>{getValues("service_type")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold">
                              Selected Artist:
                            </span>
                            <span>
                              {getValues("selected_artist") === "Lead"
                                ? "Anum Khan"
                                : "Team Artist"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold">
                              Service Date & Time:
                            </span>
                            <span>
                              {getValues("service_date")} at{" "}
                              {getValues("service_time")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold">Venue:</span>
                            <span>{getValues("venue_name")}</span>
                          </div>
                          <div className="border-t-2 border-gray-300 pt-4 mt-4">
                            <div className="flex justify-between text-lg font-bold">
                              <span>Total Service Fee:</span>
                              <span>${getValues("price") || "0.00"} CAD</span>
                            </div>
                            {remainingPaymentBooking ? (
                              <>
                                <div className="flex justify-between text-sm text-green-600 mt-2">
                                  <span>Deposit Paid:</span>
                                  <span>
                                    $
                                    {quote.deposit_amount?.toFixed(2) || "0.00"}{" "}
                                    CAD
                                  </span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-blue-600 mt-2">
                                  <span>Remaining Balance Due:</span>
                                  <span>
                                    $
                                    {quote.remaining_amount?.toFixed(2) ||
                                      "0.00"}{" "}
                                    CAD
                                  </span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex justify-between text-sm text-gray-600 mt-2">
                                  <span>
                                    Deposit Required (
                                    {getValues("service_type") === "Non-Bridal"
                                      ? "50"
                                      : "30"}
                                    %):
                                  </span>
                                  <span>
                                    $
                                    {(
                                      (getValues("price") || 0) *
                                      (getValues("service_type") ===
                                      "Non-Bridal"
                                        ? 0.5
                                        : 0.3)
                                    ).toFixed(2)}{" "}
                                    CAD
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                  <span>Balance Due on Service Date:</span>
                                  <span>
                                    $
                                    {(
                                      (getValues("price") || 0) *
                                      (getValues("service_type") ===
                                      "Non-Bridal"
                                        ? 0.5
                                        : 0.7)
                                    ).toFixed(2)}{" "}
                                    CAD
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`p-4 rounded-lg mb-6 border ${
                          remainingPaymentBooking
                            ? "bg-green-50 border-green-200"
                            : "bg-blue-50 border-blue-200"
                        }`}
                      >
                        <h4
                          className={`font-semibold mb-2 ${
                            remainingPaymentBooking
                              ? "text-green-900"
                              : "text-blue-900"
                          }`}
                        >
                          Payment Information:
                        </h4>
                        <ul
                          className={`text-sm space-y-1 ${
                            remainingPaymentBooking
                              ? "text-green-800"
                              : "text-blue-800"
                          }`}
                        >
                          {remainingPaymentBooking ? (
                            <>
                              <li>• Secure payment processed by Stripe</li>
                              <li>• Complete your remaining balance payment</li>
                              <li>
                                • Your booking will be fully confirmed after
                                payment
                              </li>
                              <li>
                                • All payments are non-refundable per our
                                cancellation policy
                              </li>
                            </>
                          ) : (
                            <>
                              <li>• Secure payment processed by Stripe</li>
                              <li>
                                • Deposit of{" "}
                                {getValues("service_type") === "Non-Bridal"
                                  ? "50"
                                  : "30"}
                                % is required to confirm your booking
                              </li>
                              <li>
                                • Remaining balance due on your service date
                              </li>
                              <li>
                                • All payments are non-refundable per our
                                cancellation policy
                              </li>
                            </>
                          )}
                        </ul>
                      </div>

                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={onPrev}
                          className="px-3 py-1.5 md:px-8 md:py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
                        >
                          ← Back
                        </button>
                        <button
                          type="button"
                          onClick={handlePayment}
                          className={`px-3 py-1.5 md:px-8 md:py-3 rounded-lg font-semibold transition-all duration-200 ${
                            remainingPaymentBooking
                              ? "bg-purple-600 text-white hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 cursor-pointer"
                              : "bg-purple-600 text-white hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 cursor-pointer"
                          }`}
                        >
                          {remainingPaymentBooking
                            ? "Pay Remaining Balance 💳"
                            : "Pay Deposit & Complete Booking 💳"}
                        </button>
                      </div>
                    </div>
                  )}

                {/* Non-Bridal Flow */}
                {getValues("service_type") === "Non-Bridal" &&
                  getValues("region") !== "Destination Wedding" && (
                    <>
                      {step === 5 && (
                        <NonBridalServiceSelection
                          onNext={onNext}
                          onBack={onPrev}
                          register={register}
                          watch={watch}
                          setValue={setValue}
                          errors={errors}
                        />
                      )}

                      {step === 6 && (
                        <NonBridalBreakdown
                          onNext={onNext}
                          onBack={onPrev}
                          register={register}
                          watch={watch}
                          setValue={setValue}
                          errors={errors}
                        />
                      )}

                      {step === 7 && (
                        <ClientDetails
                          onNext={onNext}
                          onBack={onPrev}
                          register={register}
                          setValue={setValue}
                          errors={errors}
                          handleSubmit={handleSubmit}
                          watch={watch}
                          getValues={getValues}
                        />
                      )}
                    </>
                  )}
              </>
            )}
          </>
        )}
      </div>

      {/* Toast Notifications */}
      <ToastManager />
    </div>
  );
}

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { BookingSchema } from "./lib/schema";
// import "./App.css";
// import RegionSelection from "./components/RegionSelection.jsx";
// import ServiceModeSelection from "./components/ServiceModeSelection.jsx";
// import StudioAddress from "./components/StudioAddress.jsx";
// import ServiceTypeSelection from "./components/ServiceTypeSelection.jsx";
// import BrideServiceSelection from "./components/BrideServiceSelection.jsx";
// import BrideAddons from "./components/BrideAddons.jsx";
// import BridalParty from "./components/BridalParty.jsx";
// import BridalPartyAddons from "./components/BridalPartyAddons.jsx";
// import SemiBridalServiceSelection from "./components/SemiBridalServiceSelection.jsx";
// import SemiBridalAddons from "./components/SemiBridalAddons.jsx";
// import SemiBridalParty from "./components/SemiBridalParty.jsx";
// import SemiBridalPartyAddons from "./components/SemiBridalPartyAddons.jsx";
// import NonBridalServiceSelection from "./components/NonBridalServiceSelection.jsx";
// import NonBridalBreakdown from "./components/NonBridalBreakdown.jsx";
// import ClientDetails from "./components/ClientDetails.jsx";
// import EventDetailsStep from "./components/EventDetailsStep.jsx";
// import ContractReview from "./components/ContractReview.jsx";
// import PaymentStep from "./components/PaymentStep.jsx";
// import DestinationEventDates from "./components/DestinationEventDates.jsx";
// import DestinationDetails from "./components/DestinationDetails.jsx";
// import DestinationConsultation from "./components/DestinationConsultation.jsx";
// import DestinationSummary from "./components/DestinationSummary.jsx";
// import ArtistSelection from "./components/ArtistSelection.jsx";
// import SemiBridalSummary from "./components/SemiBridalSummary.jsx";
// import QuoteReview from "./components/QuoteReview.jsx";
// import PostBookingArtistSelection from "./components/PostBookingArtistSelection.jsx";
// import ToastManager from "./components/ToastManager.jsx";
// import DateTimeSelection from "./components/DateTimeSelection.jsx";
// import ServiceAddress from "./components/ServiceAddress.jsx";
// import BookingHeader from "./components/BookingHeader.jsx";
// import EditBookingLookup from "./components/EditBookingLookup.jsx";
// import PaymentScreenshotUpload from "./components/PaymentScreenshotUpload.jsx";
// import { loadStripe } from "@stripe/stripe-js";
// import React from "react";
// // Load Stripe with the publishable key
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE);

// // Create API client with base URL
// const api = axios.create({
//   baseURL:
//     import.meta.env.VITE_API_URL || "https://looksbyanum-saqib.vercel.app/api",
// });

// export default function App() {
//   const [step, setStep] = useState(1);
//   const [config, setConfig] = useState(null);
//   const [quote, setQuote] = useState({
//     quote_total: 0,
//     deposit_amount: 0,
//     remaining_amount: 0,
//   });
//   const [confirmationEmailSent, setConfirmationEmailSent] = useState(false);
//   const [selectedArtist, setSelectedArtist] = useState("");
//   const [remainingPaymentBooking, setRemainingPaymentBooking] = useState(null);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editingBookingId, setEditingBookingId] = useState("");
//   const [editBookingData, setEditBookingData] = useState(null);
//   const [showEditLookup, setShowEditLookup] = useState(false);

//   // Handle URL parameters for remaining payment links
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     if (urlParams.get("paid") === "1" || urlParams.get("fully_paid") === "1") {
//       // Redirect to success page carrying session_id for lookup
//       const sessionId = urlParams.get("session_id");
//       const bookingId = urlParams.get("booking_id");
//       const qs = new URLSearchParams({
//         ...(sessionId ? { session_id: sessionId } : {}),
//         ...(bookingId ? { booking_id: bookingId } : {}),
//       });
//       window.location.replace(`/success?${qs.toString()}`);
//       return;
//     }
//     const bookingId = urlParams.get("booking_id");
//     const isRemainingPayment =
//       window.location.pathname.includes("remaining-payment") ||
//       urlParams.has("booking_id");

//     if (bookingId && isRemainingPayment) {
//       console.log(
//         "Remaining payment link detected, loading booking:",
//         bookingId
//       );

//       // Load booking data for remaining payment
//       api
//         .get(`/bookings/lookup/${bookingId}`)
//         .then((response) => {
//           const booking = response.data;
//           console.log("Loaded booking for remaining payment:", booking);

//           // Populate form with booking data
//           Object.keys(booking).forEach((key) => {
//             if (key !== "pricing" && key !== "client" && key !== "event") {
//               setValue(key, booking[key]);
//             }
//           });

//           // Set client details (already flattened in response)
//           setValue("name", booking.name);
//           setValue("email", booking.email);
//           // Strip +1 prefix from phone number for form input (since +1 is shown as prefix)
//           const phoneNumber = booking.phone || "";
//           setValue(
//             "phone",
//             phoneNumber.startsWith("+1")
//               ? phoneNumber.substring(2)
//               : phoneNumber
//           );

//           // Set event details (already flattened in response)
//           setValue("event_date", booking.event_date);
//           setValue("service_date", booking.event_date);
//           setValue("ready_time", booking.ready_time);
//           setValue("service_time", booking.ready_time);
//           if (booking.pricing) {
//             setQuote({
//               quote_total: booking.pricing.quote_total || 0,
//               deposit_amount: booking.pricing.deposit_amount || 0,
//               remaining_amount: booking.pricing.remaining_amount || 0,
//             });
//           }

//           // Store booking data for payment
//           setRemainingPaymentBooking(booking);

//           // Go directly to payment step (step 17 for most services)
//           setStep(17);

//           console.log("Navigated to payment step for remaining payment");
//         })
//         .catch((error) => {
//           console.error("Failed to load booking for remaining payment:", error);
//           window.showToast(
//             "Unable to load booking details. Please check your link or contact support.",
//             "error"
//           );
//         });
//     }
//   }, []);

//   const handleEditBookingLoaded = (booking) => {
//     console.log("Loading booking for editing:", booking);

//     // Check if booking is fully paid - redirect to success page
//     if (
//       booking.payment_status === "fully_paid" ||
//       booking.pricing?.remaining_amount === 0
//     ) {
//       console.log("Booking is fully paid, redirecting to success page");
//       const qs = new URLSearchParams({
//         booking_id: booking.unique_id,
//         fully_paid: "1",
//       });
//       window.location.replace(`/success?${qs.toString()}`);
//       return;
//     }

//     // Set edit mode
//     setIsEditMode(true);
//     setEditBookingData(booking);
//     setEditingBookingId(booking.unique_id);

//     // Build form data object
//     const formData = {};

//     // Populate form with booking data
//     Object.keys(booking).forEach((key) => {
//       if (
//         key !== "pricing" &&
//         key !== "client" &&
//         key !== "event" &&
//         key !== "_id" &&
//         key !== "createdAt" &&
//         key !== "updatedAt"
//       ) {
//         let value = booking[key];

//         // Format dates for HTML date inputs
//         if (
//           key === "event_date" ||
//           key === "trial_date" ||
//           key === "event_start_date" ||
//           key === "event_end_date"
//         ) {
//           if (value) {
//             // Convert Date object or ISO string to yyyy-mm-dd format
//             const date = new Date(value);
//             if (!isNaN(date.getTime())) {
//               value = date.toISOString().split("T")[0];
//             }
//           }
//         }

//         formData[key] = value;
//       }
//     });

//     // Set client details
//     formData.name = booking.name;
//     formData.email = booking.email;
//     // Strip +1 prefix from phone number for form input (since +1 is shown as prefix)
//     const phoneNumber = booking.phone || "";
//     formData.phone = phoneNumber.startsWith("+1")
//       ? phoneNumber.substring(2)
//       : phoneNumber;

//     // Split name into first_name and last_name
//     if (booking.name) {
//       const nameParts = booking.name.trim().split(" ");
//       formData.first_name = nameParts[0] || "";
//       formData.last_name = nameParts.slice(1).join(" ") || "";
//     }

//     // Handle Non-Bridal specific fields
//     if (booking.service_type === "Non-Bridal") {
//       formData.nonBridal = {
//         personCount: booking.non_bridal_count || 0,
//         everyoneBoth: booking.non_bridal_everyone_both,
//         bothCount: booking.non_bridal_both_count || 0,
//         makeupOnlyCount: booking.non_bridal_makeup_count || 0,
//         hairOnlyCount: booking.non_bridal_hair_count || 0,
//         extensionsCount: booking.non_bridal_extensions_count || 0,
//         jewelryCount: booking.non_bridal_jewelry_count || 0,
//         hasAirbrush: booking.non_bridal_has_airbrush,
//         airbrushCount: booking.non_bridal_airbrush_count || 0,
//       };
//     }

//     // Reset form with the populated data
//     reset(formData);

//     // Set pricing
//     if (booking.pricing) {
//       setQuote({
//         quote_total: booking.pricing.quote_total || booking.price || 0,
//         deposit_amount: booking.pricing.deposit_amount || 0,
//         remaining_amount: booking.pricing.remaining_amount || 0,
//       });
//     }

//     // Start from step 1
//     setStep(1);
//     setShowEditLookup(false);
//   };

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     getValues,
//     watch,
//     reset,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(BookingSchema),
//     mode: "onChange", // Change validation mode to onChange for better UX
//     defaultValues: {
//       unique_id: "",
//       name: "",
//       email: "",
//       phone: "",
//       region: "",
//       subRegion: "",
//       service_type: "Bridal",
//       service_mode: "Mobile Makeup Artist",
//       price: 0,
//       event_date: "",
//       ready_time: "",
//       artist: "",
//       event_start_date: "",
//       event_end_date: "",
//       destination_details: "",
//       bride_service: "",
//       needs_trial: "No",
//       trial_service: "",
//       trial_date: "",
//       needs_jewelry: "No",
//       needs_extensions: "No",
//       needs_sarhi_dripping: "No",
//       has_party_members: "No",
//       party_both_count: "",
//       party_makeup_count: "",
//       party_hair_count: "",
//       party_dupatta_count: "",
//       party_extensions_count: "",
//       has_airbrush: "No",
//       airbrush_count: "",
//       nonBridal: {
//         personCount: "",
//         everyoneBoth: "No",
//         bothCount: "",
//         makeupOnlyCount: "",
//         hairOnlyCount: "",
//         extensionsCount: "",
//         jewelryCount: "",
//         hasAirbrush: "No",
//         airbrushCount: "",
//         serviceType: "",
//         extensions: "false",
//         veil_or_jewelry_setting: "false",
//         airbrush: "false",
//       },
//       non_bridal_count: 0,
//       non_bridal_everyone_both: "No",
//       non_bridal_both_count: 0,
//       non_bridal_makeup_count: 0,
//       non_bridal_hair_count: 0,
//       non_bridal_extensions_count: 0,
//       non_bridal_jewelry_count: 0,
//       non_bridal_has_airbrush: "No",
//       non_bridal_airbrush_count: 0,
//       status: "lead",
//       payment_status: "pending",
//       stripe_session_id: "",
//       quote_url: "",
//       contract_pdf_url: "",
//       remaining_invoice_url: "",
//       inspiration_link: "",
//       inspiration_images: [],
//       submission_date: new Date(),
//     },
//   });

//   useEffect(() => {
//     api
//       .get("/config")
//       .then((r) => setConfig(r.data))
//       .catch(() => setConfig({}));
//   }, []);

//   // Construct full name from first_name and last_name
//   useEffect(() => {
//     const firstName = watch("first_name");
//     const lastName = watch("last_name");
//     if (firstName && lastName) {
//       setValue("name", `${firstName.trim()} ${lastName.trim()}`);
//     }
//   }, [watch("first_name"), watch("last_name"), setValue]);

//   // Send booking confirmation email when reaching contract review step
//   useEffect(() => {
//     console.log(
//       "🔄 useEffect triggered - Current step:",
//       step,
//       "confirmationEmailSent:",
//       confirmationEmailSent
//     );

//     const serviceType = getValues("service_type");
//     console.log("Service type from form:", serviceType);

//     const isContractReviewStep =
//       (serviceType === "Bridal" && step === 13) ||
//       (serviceType === "Semi-Bridal" && step === 11);

//     console.log("Email check:", {
//       step,
//       serviceType,
//       isContractReviewStep,
//       confirmationEmailSent,
//       expectedStep: serviceType === "Bridal" ? 12 : 10,
//     });

//     if (isContractReviewStep && !confirmationEmailSent) {
//       const bookingData = getValues();

//       console.log("Contract review step reached, checking data:", {
//         hasEmail: !!bookingData.client?.email,
//         hasName: !!bookingData.client?.name?.trim(),
//         hasFirstName: !!bookingData.client?.first_name?.trim(),
//         hasLastName: !!bookingData.client?.last_name?.trim(),
//         email: bookingData.client?.email,
//         name: bookingData.client?.name,
//         firstName: bookingData.client?.first_name,
//         lastName: bookingData.client?.last_name,
//       });

//       // Check if we have minimum required data for email
//       const hasEmail = !!bookingData.client?.email;
//       const hasName = !!bookingData.client?.name?.trim();
//       const hasFirstLast = !!(
//         bookingData.client?.first_name?.trim() &&
//         bookingData.client?.last_name?.trim()
//       );

//       if (hasEmail && (hasName || hasFirstLast)) {
//         console.log("Sending booking confirmation email...", bookingData);

//         // Send confirmation email
//         api
//           .post("/bookings/send-confirmation", bookingData)
//           .then((response) => {
//             console.log(
//               "Booking confirmation email sent successfully:",
//               response.data
//             );
//             // Store the booking_id for later use when creating the booking
//             if (response.data.booking_id) {
//               setValue("booking_id", response.data.booking_id);
//               console.log(
//                 "Stored booking_id from confirmation email:",
//                 response.data.booking_id
//               );
//             }
//             setConfirmationEmailSent(true);
//             window.showToast(
//               "Booking confirmation email sent! Please check your email.",
//               "success"
//             );
//           })
//           .catch((error) => {
//             console.error("Failed to send confirmation email:", error);
//             window.showToast(
//               "Failed to send confirmation email. Please try again.",
//               "error"
//             );
//             // Don't set confirmationEmailSent to true on error, so it can retry
//           });
//       } else {
//         console.log(
//           "Missing required data for email - will retry when data is available"
//         );
//       }
//     }
//   }, [step, confirmationEmailSent]);

//   const getStepTitle = () => {
//     const serviceType = getValues("service_type");
//     const region = getValues("region");
//     const serviceMode = getValues("service_mode");

//     if (step === 1) return "Service Mode";
//     if (step === 2) {
//       // For Studio Service, show studio address instead of region selection
//       if (serviceMode === "Studio Service") {
//         return "Studio Address";
//       }
//       return "Region";
//     }
//     if (step === 3) return "Service Type";
//     if (step === 4) return "Service Details";

//     // Service-specific steps
//     if (serviceType === "Bridal") {
//       if (step === 5) return "Bridal Service Details";
//       if (step === 6) return "Additional Services";
//       if (step === 7) return "Bridal Party";
//       if (step === 8) return "Contact Information";
//       // Steps 9-11 hidden for Bridal
//     } else if (serviceType === "Semi-Bridal") {
//       if (step === 5) return "Semi Bridal Service Details";
//       if (step === 6) return "Additional Services";
//       if (step === 7) return "Bridal Party Services";
//       if (step === 8) return "Contact Information";
//       // Steps 9-11 hidden for Semi-Bridal
//     } else if (serviceType === "Non-Bridal") {
//       if (step === 5) return "How many people need my service?";
//       if (step === 6) return "Service Details";
//       if (step === 7) return "Contact Information";
//     }

//     // Post-booking flow steps (applies to all service types)
//     if (step === 12) return "Quote Review";
//     if (step === 13) return "Select Your Artist";
//     if (step === 14) return "Choose Date & Time";
//     if (step === 15) return "Service Address";
//     if (step === 16) return "Review Contract";
//     if (step === 17) return "Payment";

//     // Destination Wedding flow
//     if (region === "Destination Wedding") {
//       if (step === 3) return "Event Dates";
//       if (step === 4) return "Destination Details";
//       if (step === 5) return "Contact Information";
//       if (step === 6) return "Schedule Consultation";
//       if (step === 7) return "Booking Summary";
//     }

//     return "Step";
//   };

//   const getTotalSteps = () => {
//     const serviceType = getValues("service_type");
//     const region = getValues("region");

//     // Destination weddings have their own flow
//     if (region === "Destination Wedding") {
//       return 7; // Destination wedding flow: steps 1-7 (service mode + 6 existing steps)
//     }

//     if (serviceType === "Non-Bridal") {
//       return 8; // Non-Bridal flow: steps 1-8 (service mode + 7 existing steps including payment)
//     } else if (serviceType === "Bridal") {
//       return 8; // Bridal flow: steps 1-8 (service mode + 7 existing steps, stops at contact info)
//     } else if (serviceType === "Semi-Bridal") {
//       return 8; // Semi-Bridal flow: steps 1-8 (service mode + 7 existing steps, stops at contact info)
//     }

//     return 8; // Default fallback
//   };

//   const onNext = async () => {
//     console.log("onNext called, current step:", step);
//     const serviceType = getValues("service_type");
//     const totalSteps = getTotalSteps();
//     console.log("Service type:", serviceType, "Total steps:", totalSteps);

//     // Special handling for contact information step
//     const region = getValues("region");
//     const isContactStep =
//       (serviceType === "Non-Bridal" && step === 7) ||
//       (serviceType === "Bridal" && step === 8) ||
//       (serviceType === "Semi-Bridal" && step === 8) ||
//       (region === "Destination Wedding" && step === 5);

//     console.log("Is contact step:", isContactStep, "Region:", region);

//     if (isContactStep) {
//       console.log("Contact step detected, making API call...");
//       try {
//         const data = getValues();
//         console.log("Form data:", data);

//         // Create or update booking with ALL form data
//         const bookingData = {
//           // Include unique_id for updates
//           ...(isEditMode &&
//             editingBookingId && { unique_id: editingBookingId }),

//           // Basic contact info
//           name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
//           email: data.email,
//           phone: data.phone,

//           // Region and service type
//           region: data.region,
//           subRegion: data.subRegion,
//           service_type: data.service_type,
//           service_mode: data.service_mode,

//           // Event details
//           event_date: data.event_date,
//           ready_time: data.ready_time,

//           // Destination wedding fields
//           event_start_date: data.event_start_date,
//           event_end_date: data.event_end_date,
//           destination_details: data.destination_details,

//           // Artist selection
//           artist: data.artist,

//           // Bridal service fields
//           bride_service: data.bride_service,
//           needs_trial: data.needs_trial,
//           trial_service: data.trial_service,
//           needs_jewelry: data.needs_jewelry,
//           needs_extensions: data.needs_extensions,
//           needs_sarhi_dripping: data.needs_sarhi_dripping,

//           // Party member fields
//           has_party_members: data.has_party_members,
//           party_both_count: data.party_both_count || 0,
//           party_makeup_count: data.party_makeup_count || 0,
//           party_hair_count: data.party_hair_count || 0,
//           party_dupatta_count: data.party_dupatta_count || 0,
//           party_extensions_count: data.party_extensions_count || 0,

//           // Airbrush fields
//           has_airbrush: data.has_airbrush,
//           airbrush_count: data.airbrush_count || 0,

//           // Non-bridal fields
//           non_bridal_count: data.nonBridal?.personCount || 0,
//           non_bridal_everyone_both: data.nonBridal?.everyoneBoth,
//           non_bridal_both_count: data.nonBridal?.bothCount || 0,
//           non_bridal_makeup_count: data.nonBridal?.makeupOnlyCount || 0,
//           non_bridal_hair_count: data.nonBridal?.hairOnlyCount || 0,
//           non_bridal_extensions_count: data.nonBridal?.extensionsCount || 0,
//           non_bridal_jewelry_count: data.nonBridal?.jewelryCount || 0,
//           non_bridal_has_airbrush: data.nonBridal?.hasAirbrush,
//           non_bridal_airbrush_count: data.nonBridal?.airbrushCount || 0,
//           non_bridal_has_sarhi_dripping: data.nonBridal?.hasSarhiDripping,
//           non_bridal_sarhi_dripping_count:
//             data.nonBridal?.sarhiDrippingCount || 0,

//           // Trial date and time
//           trial_date: data.trial_date,
//           trial_time: data.trial_time,

//           // Status
//           status: "lead",

//           // Inspiration
//           inspiration_link: data.inspiration_link || "",
//           inspiration_images: Array.isArray(data.inspiration_images)
//             ? data.inspiration_images
//             : [],
//         };

//         let response;
//         if (isEditMode && editingBookingId) {
//           console.log("Updating existing booking:", editingBookingId);
//           response = await api.put(
//             `/bookings/${editingBookingId}`,
//             bookingData
//           );
//           console.log("Booking updated:", response.data);
//         } else {
//           console.log("Creating new booking with data:", bookingData);
//           console.log(
//             "🔍 Frontend App.jsx - bookingData.service_mode:",
//             bookingData.service_mode
//           );
//           response = await api.post("/bookings", bookingData);
//           console.log("Booking created for contact info:", response.data);
//         }

//         // Handle destination weddings differently - save data but continue to next step (Calendly booking)
//         if (region === "Destination Wedding") {
//           console.log(
//             "Destination wedding booking saved, continuing to Calendly step"
//           );
//           // Continue to next step instead of redirecting
//           setStep((s) => Math.min(s + 1, totalSteps));
//           return;
//         }

//         // // Show loader message that email sent, then redirect to quote page
//         // const bookingId = response.data.booking_id;
//         // if (bookingId) {
//         //   const loader = document.createElement("div");
//         //   loader.className =
//         //     "fixed inset-0 flex items-center justify-center bg-white/80 z-50";
//         //   loader.innerHTML =
//         //     '<div class="animate-pulse text-center"><div class="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin mx-auto mb-4"></div><div class="text-gray-900 font-semibold">Email sent! Please check your inbox...</div></div>';
//         //   document.body.appendChild(loader);
//         //   setTimeout(() => {
//         //     window.location.replace(`/quote/${bookingId}`);
//         //   }, 1200);
//         // } else {
//         //   window.showToast(
//         //     "Thank you! Please check your email for package options and next steps.",
//         //     "success"
//         //   );
//         // }

//         // Show loader message that email sent, then redirect to quote page
//         const bookingId = response.data.booking_id;
//         if (bookingId) {
//           const loader = document.createElement("div");
//           // Updated background to dark, transparent overlay for loading screen
//           loader.className =
//             "fixed inset-0 flex items-center justify-center bg-black/90 z-50";

//           // Injected HTML updated to Rose Glow Spinner and dark theme text
//           loader.innerHTML =
//             '<div class="text-center p-10 bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl shadow-rose-900/50">' +
//             // Rose Glow Spinner (Using w-12 h-12 size for prominence)
//             '<div class="w-12 h-12 rounded-full border-4 border-rose-500 border-t-transparent animate-spin mx-auto mb-4"></div>' +
//             // Loading Message Text (White/Rose Glow text)
//             '<div class="text-white font-light text-xl">Email sent! Please check your inbox...</div>' +
//             '<div class="text-rose-300 text-base mt-2 font-light">Redirecting to quote page...</div>' +
//             "</div>";

//           document.body.appendChild(loader);

//           // Existing timeout logic remains unchanged
//           setTimeout(() => {
//             window.location.replace(`/quote/${bookingId}`);
//           }, 1200);
//         } else {
//           // Standard error toast fallback (functionality remains unchanged)
//           window.showToast(
//             "Thank you! Please check your email for package options and next steps.",
//             "success"
//           );
//         }

//         // Don't continue to next step - user should use the email link
//         return;
//       } catch (error) {
//         console.error("Failed to create/update booking:", error);
//         console.error("Error details:", error.response?.data || error.message);
//         window.showToast(
//           "Failed to save your information. Please try again.",
//           "error"
//         );
//         return;
//       }
//     }

//     // Generate quote before payment step
//     const isQuoteStep =
//       (serviceType === "Bridal" && step === 8) ||
//       (serviceType === "Semi-Bridal" && step === 8);

//     if (isQuoteStep) {
//       const data = getValues();
//       const r = await api.post("/quote", data);
//       setQuote(r.data);
//       setValue("pricing.quote_total", r.data.quote_total);
//       setValue("pricing.deposit_amount", r.data.deposit_amount);
//       setValue("pricing.remaining_amount", r.data.remaining_amount);

//       // If booking already exists, update it with pricing information
//       if (data.booking_id && data.booking_id !== "temp") {
//         try {
//           await api.patch(`/bookings/${data.booking_id}/pricing`, {
//             pricing: {
//               quote_total: r.data.quote_total,
//               deposit_amount: r.data.deposit_amount,
//               deposit_percentage: 30,
//               remaining_amount: r.data.remaining_amount,
//               amount_paid: 0,
//             },
//           });
//           console.log("Updated booking with pricing information");
//         } catch (error) {
//           console.error("Failed to update booking pricing:", error);
//         }
//       }
//     }

//     setStep((s) => Math.min(s + 1, totalSteps));
//   };

//   const onPrev = () => setStep((s) => Math.max(1, s - 1));

//   const onBook = async () => {
//     const data = getValues();
//     console.log("Booking data to send:", data);

//     try {
//       // Try to serialize the data to find circular references
//       const serialized = JSON.stringify(data);
//       console.log("Data serialized successfully");

//       // Calculate quote first if not already calculated (skip for destination weddings)
//       let quoteData = quote;
//       const region = getValues("region");

//       if (region === "Destination Wedding") {
//         // For destination weddings, always set pricing to 0
//         quoteData = {
//           quote_total: 0,
//           deposit_amount: 0,
//           remaining_amount: 0,
//         };
//         setQuote(quoteData);
//         setValue("pricing.quote_total", 0);
//         setValue("pricing.deposit_amount", 0);
//         setValue("pricing.remaining_amount", 0);
//         console.log("Destination wedding - pricing set to 0");
//       } else if (!quoteData.quote_total) {
//         console.log("Calculating quote before booking creation...");
//         const quoteResponse = await api.post("/quote", data);
//         quoteData = quoteResponse.data;
//         setQuote(quoteData);
//         setValue("pricing.quote_total", quoteData.quote_total);
//         setValue("pricing.deposit_amount", quoteData.deposit_amount);
//         setValue("pricing.remaining_amount", quoteData.remaining_amount);
//         console.log("Quote calculated:", quoteData);
//       }

//       // Include pricing in booking data
//       const bookingData = {
//         ...data,
//         pricing: {
//           quote_total: quoteData.quote_total,
//           deposit_amount: quoteData.deposit_amount,
//           deposit_percentage: data.service_type === "Non-Bridal" ? 50 : 30,
//           remaining_amount: quoteData.remaining_amount,
//           amount_paid: 0,
//         },
//       };

//       const r = await api.post("/bookings", bookingData);
//       window.showToast("Saved booking: " + r.data.booking_id, "success");

//       // Store the booking_id in the form data for later use
//       setValue("booking_id", r.data.booking_id);

//       // For destination weddings, show confirmation and stop the flow
//       if (region === "Destination Wedding") {
//         window.showToast(
//           "Thank you for your booking! Our team will contact you soon with a customized quote for your destination wedding services.",
//           "success"
//         );
//         return;
//       }

//       // Continue to next step in the booking flow
//       setStep(11); // Move to quote review step
//     } catch (error) {
//       console.error("Serialization error:", error);
//       // Try to identify which field is causing the issue
//       const problematicFields = [];
//       for (const [key, value] of Object.entries(data)) {
//         try {
//           JSON.stringify(value);
//         } catch (e) {
//           problematicFields.push(key);
//           console.error(`Field "${key}" contains circular reference:`, value);
//         }
//       }
//       window.showToast(
//         `Cannot submit booking due to data issues in fields: ${problematicFields.join(
//           ", "
//         )}`,
//         "error"
//       );
//     }
//   };

//   const handlePayment = async () => {
//     try {
//       const bookingData = getValues();

//       // Check if this is a remaining payment from the loaded booking
//       let isRemainingPayment = !!remainingPaymentBooking;

//       if (!isRemainingPayment) {
//         // Check if this is an existing booking that needs remaining payment
//         if (bookingData.booking_id && bookingData.booking_id !== "temp") {
//           try {
//             const bookingResponse = await api.get(
//               `/bookings/lookup/${bookingData.booking_id}`
//             );
//             const existingBooking = bookingResponse.data;
//             if (existingBooking.pricing?.payment_status === "deposit_paid") {
//               isRemainingPayment = true;
//             }
//           } catch (error) {
//             console.log(
//               "Could not check existing booking status, proceeding with deposit payment"
//             );
//           }
//         }
//       }

//       // For remaining payments from links, we don't need to update booking details
//       if (!remainingPaymentBooking) {
//         // First, update the booking with all collected details
//         const updateResponse = await api.patch(
//           `/bookings/${bookingData.booking_id || "temp"}/details`,
//           {
//             selected_artist: bookingData.selected_artist,
//             service_date: bookingData.service_date,
//             service_time: bookingData.service_time,
//             venue_name: bookingData.venue_name,
//             venue_address: bookingData.venue_address,
//             venue_city: bookingData.venue_city,
//             venue_province: bookingData.venue_province,
//             venue_postal: bookingData.venue_postal,
//             onsite_contact: bookingData.onsite_contact,
//             onsite_phone: bookingData.onsite_phone,
//             special_instructions: bookingData.special_instructions,
//             terms_agreed: bookingData.terms_agreed,
//             digital_signature: bookingData.digital_signature,
//             // Include pricing information
//             pricing: {
//               quote_total: bookingData.price || quote.quote_total,
//               deposit_amount: (bookingData.price || quote.quote_total) * 0.3,
//               deposit_percentage: 30,
//               remaining_amount: (bookingData.price || quote.quote_total) * 0.7,
//               amount_paid: 0,
//             },
//           }
//         );

//         if (!updateResponse.data.success) {
//           throw new Error("Failed to update booking details");
//         }
//       }

//       // Create appropriate Stripe checkout session
//       let stripeResponse;
//       if (isRemainingPayment) {
//         // Remaining payment - use the booking_id from the loaded booking or form data
//         const bookingId =
//           remainingPaymentBooking?.unique_id ||
//           remainingPaymentBooking?.booking_id ||
//           bookingData.booking_id;
//         stripeResponse = await api.post(
//           "/stripe/create-remaining-payment-session",
//           {
//             booking_id: bookingId,
//           }
//         );
//       } else {
//         // Deposit payment
//         stripeResponse = await api.post("/stripe/create-checkout-session", {
//           booking: {
//             booking_id: bookingData.booking_id || "temp",
//             client: {
//               name: `${bookingData.first_name} ${bookingData.last_name}`,
//               email: bookingData.email,
//             },
//             service_type: bookingData.service_type,
//             region: bookingData.region,
//             subRegion: bookingData.subRegion,
//             event: {
//               date: bookingData.service_date,
//               ready_time: bookingData.service_time,
//             },
//             pricing: {
//               quote_total: bookingData.price,
//               deposit_percentage:
//                 bookingData.service_type === "Non-Bridal" ? 50 : 30,
//             },
//           },
//         });
//       }

//       // Redirect to Stripe Checkout
//       if (stripeResponse.data.url) {
//         window.location.href = stripeResponse.data.url;
//       } else {
//         throw new Error("No checkout URL received");
//       }
//     } catch (error) {
//       console.error("Payment processing error:", error);
//       window.showToast(
//         "Failed to process payment. Please try again or contact support.",
//         "error"
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen  py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         {/* Edit Booking Lookup */}
//         {showEditLookup && (
//           <EditBookingLookup
//             onBookingLoaded={handleEditBookingLoaded}
//             onBack={() => setShowEditLookup(false)}
//           />
//         )}

//         {/* Main Booking Form */}
//         {!showEditLookup && (
//           <>
//             <BookingHeader
//               step={step}
//               getTotalSteps={getTotalSteps}
//               getStepTitle={getStepTitle}
//               isEditMode={isEditMode}
//             />

//             {/* Edit Button */}
//             {step === 1 && !isEditMode && (
//               // THIS WRAPPER ALIGNS WITH THE UPDATED PROGRESS BAR

//               // <div className="mb-8 max-w-2xl mx-auto">
//               <div className="mb-8 max-w-2xl mx-auto px-4">
//                 <button
//                   onClick={() => setShowEditLookup(true)}
//                   className="group relative cursor-pointer inline-flex items-center w-full px-5 py-4 sm:py-5 rounded-xl border border-gray-700/50 bg-gray-800/40 backdrop-blur-sm transition-all duration-300 text-left overflow-hidden hover:border-rose-400/40 hover:bg-gray-800/60 hover:shadow-xl hover:shadow-rose-500/10 hover:-translate-y-0.5 justify-center"
//                 >
//                   {/* Subtle gradient overlay on hover (Required by standard) */}

//                   <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-pink-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

//                   <div className="relative flex items-center justify-center w-full">
//                     {/* Icon 1 (Pencil) */}

//                     <svg
//                       className="w-5 h-5 mr-3 flex-shrink-0 text-gray-400 transition-colors duration-300 group-hover:text-rose-400"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={1.5}
//                         d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                       />
//                     </svg>

//                     {/* Text */}

//                     <span className="text-base sm:text-lg font-light text-gray-200 group-hover:text-rose-300 transition-colors">
//                       Already have a booking? Edit existing booking
//                     </span>

//                     {/* Icon 2 (Chevron) */}

//                     <svg
//                       className="w-5 h-5 ml-3 flex-shrink-0 text-gray-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-rose-400"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M9 5l7 7-7 7"
//                       />
//                     </svg>
//                   </div>
//                 </button>
//               </div>
//             )}
//             {/* {step === 1 && !isEditMode && (
//               <div className="mb-8 flex justify-center">
//               <button
//                 onClick={() => setShowEditLookup(true)}
//                 className="group cursor-pointer inline-flex items-center px-3 py-1.5 md:px-8 md:py-4 bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 border-2 border-indigo-200 hover:border-indigo-300 rounded-xl text-indigo-700 hover:text-indigo-800 font-semibold text-xs md:text-base transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105 w-[650px] justify-center"
//               >
//                 <svg className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                 </svg>
//                 <span>Already have a booking? Edit existing booking</span>
//                 <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             </div>
//             )} */}

//             {/* Payment Screenshot Upload Section */}
//             {step === 1 && !isEditMode && (
//               // <div className="mb-6 flex justify-center">
//               <div className="mb-6">
//                 <PaymentScreenshotUpload />
//               </div>
//             )}

//             {/* Step Content */}
//             {step === 1 && (
//               <ServiceModeSelection
//                 onNext={onNext}
//                 register={register}
//                 setValue={setValue}
//                 getValues={getValues}
//                 watch={watch}
//                 errors={errors}
//               />
//             )}

//             {step === 2 &&
//               getValues("service_mode") === "Mobile Makeup Artist" && (
//                 <RegionSelection
//                   onNext={onNext}
//                   onBack={onPrev}
//                   register={register}
//                   setValue={setValue}
//                   getValues={getValues}
//                   errors={errors}
//                 />
//               )}

//             {step === 2 && getValues("service_mode") === "Studio Service" && (
//               <StudioAddress onNext={onNext} onBack={onPrev} />
//             )}

//             {/* Destination Wedding Flow */}
//             {getValues("region") === "Destination Wedding" && (
//               <>
//                 {step === 3 && (
//                   <DestinationEventDates
//                     onNext={onNext}
//                     onBack={onPrev}
//                     register={register}
//                     errors={errors}
//                     watch={watch}
//                   />
//                 )}

//                 {step === 4 && (
//                   <DestinationDetails
//                     onNext={onNext}
//                     onBack={onPrev}
//                     register={register}
//                     errors={errors}
//                   />
//                 )}

//                 {step === 5 && (
//                   <ClientDetails
//                     onNext={onNext}
//                     onBack={onPrev}
//                     register={register}
//                     errors={errors}
//                     handleSubmit={handleSubmit}
//                     watch={watch}
//                     setValue={setValue}
//                     getValues={getValues}
//                   />
//                 )}

//                 {step === 6 && (
//                   <DestinationConsultation onNext={onNext} onBack={onPrev} />
//                 )}

//                 {step === 7 && (
//                   <DestinationSummary
//                     onNext={onNext}
//                     onBack={onPrev}
//                     getValues={getValues}
//                   />
//                 )}
//               </>
//             )}

//             {/* Regular Flow (Toronto/GTA & Outside GTA for Mobile, or Studio Service) */}
//             {(((getValues("region") === "Toronto/GTA" ||
//               getValues("region") === "Outside GTA") &&
//               getValues("service_mode") === "Mobile Makeup Artist") ||
//               getValues("service_mode") === "Studio Service") && (
//               <>
//                 {step === 3 && (
//                   <ServiceTypeSelection
//                     onNext={onNext}
//                     onBack={onPrev}
//                     register={register}
//                     setValue={setValue}
//                     getValues={getValues}
//                     watch={watch}
//                     errors={errors}
//                   />
//                 )}

//                 {step === 4 && (
//                   <EventDetailsStep
//                     onNext={onNext}
//                     onBack={onPrev}
//                     register={register}
//                     errors={errors}
//                     handleSubmit={handleSubmit}
//                     watch={watch}
//                   />
//                 )}

//                 {/* Bridal Flow (Toronto/GTA & Outside GTA regions only) */}
//                 {getValues("service_type") === "Bridal" &&
//                   (((getValues("region") === "Toronto/GTA" ||
//                     getValues("region") === "Outside GTA") &&
//                     getValues("service_mode") === "Mobile Makeup Artist") ||
//                     getValues("service_mode") === "Studio Service") && (
//                     <>
//                       {step === 5 && (
//                         <BrideServiceSelection
//                           onNext={onNext}
//                           onBack={onPrev}
//                           register={register}
//                           watch={watch}
//                           setValue={setValue}
//                           errors={errors}
//                         />
//                       )}

//                       {step === 6 && (
//                         <BrideAddons
//                           onNext={onNext}
//                           onBack={onPrev}
//                           register={register}
//                           watch={watch}
//                           setValue={setValue}
//                           errors={errors}
//                         />
//                       )}

//                       {step === 7 && (
//                         <BridalParty
//                           onNext={onNext}
//                           onBack={onPrev}
//                           register={register}
//                           watch={watch}
//                           setValue={setValue}
//                           errors={errors}
//                         />
//                       )}

//                       {step === 8 && (
//                         <ClientDetails
//                           onNext={onNext}
//                           onBack={onPrev}
//                           register={register}
//                           setValue={setValue}
//                           errors={errors}
//                           handleSubmit={handleSubmit}
//                           watch={watch}
//                           getValues={getValues}
//                         />
//                       )}

//                       {/* Steps 9-10 hidden for Bridal - flow stops at contact info */}
//                     </>
//                   )}

//                 {/* Semi-Bridal Flow */}
//                 {getValues("service_type") === "Semi-Bridal" &&
//                   getValues("region") !== "Destination Wedding" && (
//                     <>
//                       {step === 5 && (
//                         <SemiBridalServiceSelection
//                           onNext={onNext}
//                           onBack={onPrev}
//                           register={register}
//                           watch={watch}
//                           setValue={setValue}
//                           errors={errors}
//                         />
//                       )}

//                       {step === 6 && (
//                         <SemiBridalAddons
//                           onNext={onNext}
//                           onBack={onPrev}
//                           register={register}
//                           watch={watch}
//                           setValue={setValue}
//                           errors={errors}
//                         />
//                       )}

//                       {step === 7 && (
//                         <SemiBridalParty
//                           onNext={onNext}
//                           onBack={onPrev}
//                           register={register}
//                           watch={watch}
//                           setValue={setValue}
//                           errors={errors}
//                         />
//                       )}

//                       {step === 8 &&
//                         getValues("service_type") === "Semi-Bridal" && (
//                           <ClientDetails
//                             onNext={onNext}
//                             onBack={onPrev}
//                             register={register}
//                             setValue={setValue}
//                             errors={errors}
//                             handleSubmit={handleSubmit}
//                             watch={watch}
//                             getValues={getValues}
//                           />
//                         )}

//                       {/* Steps 9-10 hidden for Semi-Bridal - flow stops at contact info */}
//                     </>
//                   )}

//                 {/* Post-Booking Flow - Quote Review (Hidden for Bridal/Semi-Bridal) */}
//                 {step === 12 &&
//                   getValues("service_type") !== "Bridal" &&
//                   getValues("service_type") !== "Semi-Bridal" && (
//                     <QuoteReview
//                       onNext={onNext}
//                       onBack={onPrev}
//                       getValues={getValues}
//                     />
//                   )}

//                 {/* Post-Booking Flow - Artist Selection (Hidden for Bridal/Semi-Bridal) */}
//                 {step === 13 &&
//                   getValues("service_type") !== "Bridal" &&
//                   getValues("service_type") !== "Semi-Bridal" && (
//                     <PostBookingArtistSelection
//                       onNext={onNext}
//                       onBack={onPrev}
//                       getValues={getValues}
//                       setValue={setValue}
//                     />
//                   )}

//                 {/* Post-Booking Flow - Date & Time Selection (Hidden for Bridal/Semi-Bridal) */}
//                 {step === 14 &&
//                   getValues("service_type") !== "Bridal" &&
//                   getValues("service_type") !== "Semi-Bridal" && (
//                     <DateTimeSelection
//                       onNext={onNext}
//                       onBack={onPrev}
//                       register={register}
//                       setValue={setValue}
//                       getValues={getValues}
//                       errors={errors}
//                     />
//                   )}

//                 {/* Post-Booking Flow - Service Address (Hidden for Bridal/Semi-Bridal) */}
//                 {step === 15 &&
//                   getValues("service_type") !== "Bridal" &&
//                   getValues("service_type") !== "Semi-Bridal" && (
//                     <ServiceAddress
//                       onNext={onNext}
//                       onBack={onPrev}
//                       register={register}
//                       getValues={getValues}
//                       errors={errors}
//                     />
//                   )}

//                 {/* Post-Booking Flow - Contract Review (Hidden for Bridal/Semi-Bridal) */}
//                 {step === 16 &&
//                   getValues("service_type") !== "Bridal" &&
//                   getValues("service_type") !== "Semi-Bridal" && (
//                     <div className="max-w-sm md:max-w-2xl lg:max-w-4xl mx-auto p-4 md:p-8 glass-card">
//                       <h2 className="text-sm md:text-2xl font-bold text-gray-900 mb-2 md:mb-8 text-left">
//                         Review & Sign Contract
//                       </h2>

//                       <div className="bg-gray-50 p-6 rounded-lg mb-8 border-2 border-gray-200 max-h-96 overflow-y-auto">
//                         <h3 className="text-lg font-semibold mb-6 text-gray-900">
//                           Service Agreement Contract
//                         </h3>

//                         <div className="space-y-4 text-sm text-gray-800">
//                           <div>
//                             <h4 className="font-semibold mb-2">1. Parties</h4>
//                             <p>
//                               This agreement is between Looks By Anum (Service
//                               Provider) and {getValues("first_name")}{" "}
//                               {getValues("last_name")} (Client).
//                             </p>
//                           </div>

//                           <div>
//                             <h4 className="font-semibold mb-2">2. Services</h4>
//                             <p>
//                               Service Provider agrees to provide{" "}
//                               {getValues("service_type")} makeup and hair
//                               services on {getValues("service_date")} at{" "}
//                               {getValues("service_time")}.
//                             </p>
//                           </div>

//                           <div>
//                             <h4 className="font-semibold mb-2">
//                               3. Payment Terms
//                             </h4>
//                             <p>
//                               Total service fee: ${getValues("price")} CAD
//                               (including 13% HST). Deposit of $
//                               {((getValues("price") || 0) * 0.5).toFixed(2)} CAD
//                               is due upon signing. Balance due on service date.
//                             </p>
//                           </div>

//                           <div>
//                             <h4 className="font-semibold mb-2">
//                               4. Cancellation Policy
//                             </h4>
//                             <p>
//                               Cancellations made 30+ days before service date
//                               receive full refund minus $50 admin fee.
//                               Cancellations 14-30 days before receive 50%
//                               refund. Cancellations less than 14 days receive no
//                               refund.
//                             </p>
//                           </div>

//                           <div>
//                             <h4 className="font-semibold mb-2">5. Liability</h4>
//                             <p>
//                               Client assumes responsibility for any allergies or
//                               skin sensitivities. Service Provider is not liable
//                               for unsatisfactory results due to client's skin
//                               condition or product reactions.
//                             </p>
//                           </div>

//                           <div>
//                             <h4 className="font-semibold mb-2">
//                               6. Force Majeure
//                             </h4>
//                             <p>
//                               In case of emergency or unforeseen circumstances,
//                               Service Provider will make every effort to provide
//                               alternative arrangements or full refund.
//                             </p>
//                           </div>

//                           <div>
//                             <h4 className="font-semibold mb-2">
//                               7. Full Agreement
//                             </h4>
//                             <p>
//                               This contract constitutes the entire agreement
//                               between the parties and supersedes all prior
//                               agreements.
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="bg-yellow-50 p-4 rounded-lg mb-6 border border-yellow-200">
//                         <div className="flex items-start">
//                           <input
//                             type="checkbox"
//                             id="terms_agreed"
//                             {...register("terms_agreed", {
//                               required:
//                                 "You must agree to the terms and conditions",
//                             })}
//                             className="mt-1 mr-3"
//                           />
//                           <label
//                             htmlFor="terms_agreed"
//                             className="text-sm text-yellow-800"
//                           >
//                             I have read and agree to the terms and conditions
//                             outlined in this service agreement. I understand the
//                             payment terms, cancellation policy, and liability
//                             clauses.
//                           </label>
//                         </div>
//                         {errors.terms_agreed && (
//                           <p className="mt-1 text-sm text-red-600">
//                             {errors.terms_agreed.message}
//                           </p>
//                         )}
//                       </div>

//                       {/* Digital Signature */}
//                       <div className="mb-8">
//                         <label className="block text-sm font-semibold text-gray-900 mb-2">
//                           Digital Signature{" "}
//                           <span className="text-red-500">*</span>
//                         </label>
//                         <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
//                           <p className="text-sm text-gray-600 mb-3">
//                             Please type your full name below as your digital
//                             signature:
//                           </p>
//                           <input
//                             type="text"
//                             {...register("digital_signature", {
//                               required: "Digital signature is required",
//                               validate: (value) =>
//                                 value ===
//                                   `${getValues("first_name")} ${getValues(
//                                     "last_name"
//                                   )}` || "Signature must match your full name",
//                             })}
//                             placeholder={`${getValues(
//                               "first_name"
//                             )} ${getValues("last_name")}`}
//                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-lg font-signature"
//                           />
//                           {errors.digital_signature && (
//                             <p className="mt-1 text-sm text-red-600">
//                               {errors.digital_signature.message}
//                             </p>
//                           )}
//                           <p className="text-xs text-gray-500 mt-2">
//                             By signing, you agree that this electronic signature
//                             is legally binding and equivalent to a handwritten
//                             signature.
//                           </p>
//                         </div>
//                       </div>

//                       <div className="flex justify-between">
//                         <button
//                           type="button"
//                           onClick={onPrev}
//                           className="px-3 py-1.5 md:px-8 md:py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
//                         >
//                           ← Back to Address
//                         </button>
//                         <button
//                           type="button"
//                           onClick={onNext}
//                           disabled={
//                             !getValues("terms_agreed") ||
//                             !getValues("digital_signature")
//                           }
//                           className={`px-3 py-1.5 md:px-8 md:py-3 rounded-lg font-semibold transition-all duration-200 ${
//                             getValues("terms_agreed") &&
//                             getValues("digital_signature")
//                               ? "bg-purple-600 text-white hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 cursor-pointer"
//                               : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                           }`}
//                         >
//                           Proceed to Payment →
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                 {/* Post-Booking Flow - Payment (Hidden for Bridal/Semi-Bridal) */}
//                 {step === 17 &&
//                   getValues("service_type") !== "Bridal" &&
//                   getValues("service_type") !== "Semi-Bridal" && (
//                     <div className="max-w-sm md:max-w-2xl mx-auto p-4 md:p-8 glass-card">
//                       <h2 className="text-sm md:text-2xl font-bold text-gray-900 mb-2 md:mb-8 text-left">
//                         {remainingPaymentBooking
//                           ? "Complete Your Remaining Payment"
//                           : "Complete Your Booking"}
//                       </h2>

//                       <div className="bg-gray-50 p-6 rounded-lg mb-8 border-2 border-gray-200">
//                         <h3 className="text-lg font-semibold mb-4 text-gray-900">
//                           Payment Summary
//                         </h3>
//                         <div className="space-y-4 text-gray-800">
//                           <div className="flex justify-between">
//                             <span className="font-semibold">Service Type:</span>
//                             <span>{getValues("service_type")}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="font-semibold">
//                               Selected Artist:
//                             </span>
//                             <span>
//                               {getValues("selected_artist") === "Lead"
//                                 ? "Anum Khan"
//                                 : "Team Artist"}
//                             </span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="font-semibold">
//                               Service Date & Time:
//                             </span>
//                             <span>
//                               {getValues("service_date")} at{" "}
//                               {getValues("service_time")}
//                             </span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span className="font-semibold">Venue:</span>
//                             <span>{getValues("venue_name")}</span>
//                           </div>
//                           <div className="border-t-2 border-gray-300 pt-4 mt-4">
//                             <div className="flex justify-between text-lg font-bold">
//                               <span>Total Service Fee:</span>
//                               <span>${getValues("price") || "0.00"} CAD</span>
//                             </div>
//                             {remainingPaymentBooking ? (
//                               <>
//                                 <div className="flex justify-between text-sm text-green-600 mt-2">
//                                   <span>Deposit Paid:</span>
//                                   <span>
//                                     $
//                                     {quote.deposit_amount?.toFixed(2) || "0.00"}{" "}
//                                     CAD
//                                   </span>
//                                 </div>
//                                 <div className="flex justify-between text-lg font-bold text-blue-600 mt-2">
//                                   <span>Remaining Balance Due:</span>
//                                   <span>
//                                     $
//                                     {quote.remaining_amount?.toFixed(2) ||
//                                       "0.00"}{" "}
//                                     CAD
//                                   </span>
//                                 </div>
//                               </>
//                             ) : (
//                               <>
//                                 <div className="flex justify-between text-sm text-gray-600 mt-2">
//                                   <span>
//                                     Deposit Required (
//                                     {getValues("service_type") === "Non-Bridal"
//                                       ? "50"
//                                       : "30"}
//                                     %):
//                                   </span>
//                                   <span>
//                                     $
//                                     {(
//                                       (getValues("price") || 0) *
//                                       (getValues("service_type") ===
//                                       "Non-Bridal"
//                                         ? 0.5
//                                         : 0.3)
//                                     ).toFixed(2)}{" "}
//                                     CAD
//                                   </span>
//                                 </div>
//                                 <div className="flex justify-between text-sm text-gray-600">
//                                   <span>Balance Due on Service Date:</span>
//                                   <span>
//                                     $
//                                     {(
//                                       (getValues("price") || 0) *
//                                       (getValues("service_type") ===
//                                       "Non-Bridal"
//                                         ? 0.5
//                                         : 0.7)
//                                     ).toFixed(2)}{" "}
//                                     CAD
//                                   </span>
//                                 </div>
//                               </>
//                             )}
//                           </div>
//                         </div>
//                       </div>

//                       <div
//                         className={`p-4 rounded-lg mb-6 border ${
//                           remainingPaymentBooking
//                             ? "bg-green-50 border-green-200"
//                             : "bg-blue-50 border-blue-200"
//                         }`}
//                       >
//                         <h4
//                           className={`font-semibold mb-2 ${
//                             remainingPaymentBooking
//                               ? "text-green-900"
//                               : "text-blue-900"
//                           }`}
//                         >
//                           Payment Information:
//                         </h4>
//                         <ul
//                           className={`text-sm space-y-1 ${
//                             remainingPaymentBooking
//                               ? "text-green-800"
//                               : "text-blue-800"
//                           }`}
//                         >
//                           {remainingPaymentBooking ? (
//                             <>
//                               <li>• Secure payment processed by Stripe</li>
//                               <li>• Complete your remaining balance payment</li>
//                               <li>
//                                 • Your booking will be fully confirmed after
//                                 payment
//                               </li>
//                               <li>
//                                 • All payments are non-refundable per our
//                                 cancellation policy
//                               </li>
//                             </>
//                           ) : (
//                             <>
//                               <li>• Secure payment processed by Stripe</li>
//                               <li>
//                                 • Deposit of{" "}
//                                 {getValues("service_type") === "Non-Bridal"
//                                   ? "50"
//                                   : "30"}
//                                 % is required to confirm your booking
//                               </li>
//                               <li>
//                                 • Remaining balance due on your service date
//                               </li>
//                               <li>
//                                 • All payments are non-refundable per our
//                                 cancellation policy
//                               </li>
//                             </>
//                           )}
//                         </ul>
//                       </div>

//                       <div className="flex justify-between">
//                         <button
//                           type="button"
//                           onClick={onPrev}
//                           className="px-3 py-1.5 md:px-8 md:py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
//                         >
//                           ← Back
//                         </button>
//                         <button
//                           type="button"
//                           onClick={handlePayment}
//                           className={`px-3 py-1.5 md:px-8 md:py-3 rounded-lg font-semibold transition-all duration-200 ${
//                             remainingPaymentBooking
//                               ? "bg-purple-600 text-white hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 cursor-pointer"
//                               : "bg-purple-600 text-white hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 cursor-pointer"
//                           }`}
//                         >
//                           {remainingPaymentBooking
//                             ? "Pay Remaining Balance 💳"
//                             : "Pay Deposit & Complete Booking 💳"}
//                         </button>
//                       </div>
//                     </div>
//                   )}

//                 {/* Non-Bridal Flow */}
//                 {getValues("service_type") === "Non-Bridal" &&
//                   getValues("region") !== "Destination Wedding" && (
//                     <>
//                       {step === 5 && (
//                         <NonBridalServiceSelection
//                           onNext={onNext}
//                           onBack={onPrev}
//                           register={register}
//                           watch={watch}
//                           setValue={setValue}
//                           errors={errors}
//                         />
//                       )}

//                       {step === 6 && (
//                         <NonBridalBreakdown
//                           onNext={onNext}
//                           onBack={onPrev}
//                           register={register}
//                           watch={watch}
//                           setValue={setValue}
//                           errors={errors}
//                         />
//                       )}

//                       {step === 7 && (
//                         <ClientDetails
//                           onNext={onNext}
//                           onBack={onPrev}
//                           register={register}
//                           setValue={setValue}
//                           errors={errors}
//                           handleSubmit={handleSubmit}
//                           watch={watch}
//                           getValues={getValues}
//                         />
//                       )}
//                     </>
//                   )}
//               </>
//             )}
//           </>
//         )}
//       </div>

//       {/* Toast Notifications */}
//       <ToastManager />
//     </div>
//   );
// }
