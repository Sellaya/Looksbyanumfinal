import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { calculateBookingPrice } from "../lib/pricing";
import { formatCurrency } from "../../lib/currencyFormat"; // Added currency formatter import

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://looksbyanum-saqib.vercel.app/api",
});

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 
  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const bookingId = searchParams.get("booking_id");

    async function fetchBookingData(id, attempt = 1, maxAttempts = 10) {
      try {
        const b = await api.get(`/bookings/lookup/${id}`);
        const fetchedBooking = b.data;

        // Check if payment has been processed (webhook completed)
        const paymentStatus =
          fetchedBooking.payment_status || fetchedBooking.ops?.payment_status;
        const amountPaid = Number(fetchedBooking.pricing?.amount_paid || 0);
        const remainingAmount = Number(
          fetchedBooking.pricing?.remaining_amount || 0
        );
        const quoteTotal = Number(
          fetchedBooking.pricing?.quote_total || fetchedBooking.price || 0
        );
        const depositAmount = Number(
          fetchedBooking.pricing?.deposit_amount || 0
        );

        // Intelligent payment phase detection based on remaining amount
        const expectedDepositRemaining = quoteTotal; // Full amount remains for deposit payment
        const expectedFinalRemaining = quoteTotal - depositAmount; // Only remaining balance left for final payment

        let paymentType = "unknown";
        let webhookProcessed = false;

        if (remainingAmount === expectedDepositRemaining) {
          // Full quote total remains - this is a deposit payment
          paymentType = "deposit";
          webhookProcessed =
            fetchedBooking.ops?.deposit_webhook_processed || false;
          console.log(
            `Deposit payment detected: remaining=${remainingAmount}, expected=${expectedDepositRemaining}, webhook=${webhookProcessed}`
          );
        } else if (
          remainingAmount === expectedFinalRemaining &&
          fetchedBooking.ops?.deposit_webhook_processed === true
        ) {
          // Remaining balance left AND deposit already processed - this is a final payment
          paymentType = "final";
          webhookProcessed =
            fetchedBooking.ops?.final_webhook_processed || false;
          console.log(
            `Final payment detected: remaining=${remainingAmount}, expected=${expectedFinalRemaining}, depositProcessed=true, finalWebhook=${webhookProcessed}`
          );
        } else if (
          remainingAmount === 0 &&
          fetchedBooking.ops?.deposit_webhook_processed === true
        ) {
          // No remaining balance AND deposit processed - could be final payment that just completed
          paymentType = "final_completed";
          webhookProcessed =
            (fetchedBooking.ops?.deposit_webhook_processed &&
              fetchedBooking.ops?.final_webhook_processed) ||
            false;
          console.log(
            `Final payment completed: remaining=${remainingAmount}, depositProcessed=true, finalWebhook=${fetchedBooking.ops?.final_webhook_processed}, combined=${webhookProcessed}`
          );
        } else {
          // Unknown scenario - wait for all webhooks to be safe
          paymentType = "unknown";
          const depositProcessed =
            fetchedBooking.ops?.deposit_webhook_processed || false;
          const finalProcessed =
            fetchedBooking.ops?.final_webhook_processed || false;
          webhookProcessed = depositProcessed && finalProcessed;
          console.log(
            `Unknown payment type: remaining=${remainingAmount}, depositProcessed=${depositProcessed}, finalProcessed=${finalProcessed}, combined=${webhookProcessed}`
          );
        } // Always wait for webhook processing to complete on payment success pages
        if (attempt < maxAttempts && !webhookProcessed) {
          const paymentType = isDepositPayment ? "deposit" : "final";
          console.log(
            `${paymentType} webhook not yet processed (attempt ${attempt}/${maxAttempts}), waiting...`
          );
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
          return fetchBookingData(id, attempt + 1, maxAttempts);
        }

        return fetchedBooking;
      } catch (error) {
        if (attempt < maxAttempts) {
          console.log(
            `Failed to fetch booking data (attempt ${attempt}/${maxAttempts}), retrying...`
          );
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
          return fetchBookingData(id, attempt + 1, maxAttempts);
        }
        throw error;
      }
    }

    async function init() {
      try {
        let id = bookingId;
        let fetchedBooking = null;

        // Check if this is a PayPal payment (has paid=1 parameter or payment_method=paypal)
        const paidParam = searchParams.get("paid");
        const paymentMethod = searchParams.get("payment_method");

        if (!id && sessionId && !paidParam && paymentMethod !== "paypal") {
          // Stripe flow: Confirm session and retrieve booking_id
          const r = await api.post("/stripe/confirm-session", {
            session_id: sessionId,
          });
          id = r.data.booking_id;
          if (r.data.booking) {
            fetchedBooking = r.data.booking;
          }
        }

        if (!id) throw new Error("Missing booking ID");

        // For PayPal payments, fetch booking data immediately (no webhook waiting needed)
        if (paidParam === "1" || paymentMethod === "paypal") {
          console.log(
            "PayPal payment detected - fetching booking data immediately"
          );
          const response = await api.get(`/bookings/lookup/${id}`);
          fetchedBooking = response.data;
        } else {
          // Stripe flow: Always fetch booking data with polling logic to ensure we wait for webhook completion
          fetchedBooking = await fetchBookingData(id);
        }

        setBooking(fetchedBooking);

        // Facebook Pixel tracking for Purchase event
        const purchaseAmount = Number(fetchedBooking.pricing?.amount_paid || 0);
        if (window.fbq) {
          window.fbq("track", "Purchase", {
            value: purchaseAmount,
            currency: "CAD",
            content_type: "product",
          });
          console.log("✅ Meta Pixel 'Purchase' event fired");
        }

        // Save inspiration data if it exists in localStorage
        const inspirationKey = `inspiration_${id}`;
        const inspirationData = localStorage.getItem(inspirationKey);
        if (inspirationData) {
          try {
            const parsedData = JSON.parse(inspirationData);
            await api.put(`/bookings/${id}/inspiration`, {
              inspiration_link: parsedData.inspiration_link,
              inspiration_images: parsedData.inspiration_images,
            });
            // Clear the temporary data from localStorage
            localStorage.removeItem(inspirationKey);
          } catch (error) {
            console.error("Failed to save inspiration data:", error);
            // Don't throw error - payment was successful, inspiration is optional
          }
        }
      } catch (e) {
        console.error("Error loading booking details:", e);
        setError(
          "Unable to load booking details. The payment may still be processing. Please refresh the page in a few moments."
        );
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [searchParams]);

  const loadScript = (src) =>
    new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing)
        return existing.onload ? existing.onload() || resolve() : resolve();
      const s = document.createElement("script");
      s.src = src;
      s.onload = () => resolve();
      s.onerror = reject;
      document.body.appendChild(s);
    });

  const handleDownloadContract = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = margin;

    // Helper function to check if we need a new page
    const checkPageBreak = (spaceNeeded = 80) => {
      if (y + spaceNeeded > pageHeight - margin) {
        doc.addPage();
        y = margin;
        return true;
      }
      return false;
    };

    // Header
    doc.setFillColor(0, 0, 0); // black
    doc.rect(0, 0, pageWidth, 80, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("times", "bold");
    doc.text("Contract for Makeup and Hair Services", margin, 50);

    // Client Information Section
    doc.setTextColor(33, 37, 41);
    doc.setFontSize(14);
    doc.setFont("times", "bold");
    y = 110;
    doc.text("Client Information", margin, y);
    y += 25;

    // Format address properly - check multiple possible address sources
    const addressParts = [];

    // First try venue address (event location)
    if (booking.venue_address && booking.venue_address.trim())
      addressParts.push(booking.venue_address.trim());
    if (booking.venue_city && booking.venue_city.trim())
      addressParts.push(booking.venue_city.trim());
    if (booking.venue_province && booking.venue_province.trim())
      addressParts.push(booking.venue_province.trim());
    if (booking.venue_postal && booking.venue_postal.trim())
      addressParts.push(booking.venue_postal.trim());

    // If no venue address, try client address field if it exists
    if (
      addressParts.length === 0 &&
      booking.address &&
      booking.address.trim()
    ) {
      addressParts.push(booking.address.trim());
    }

    // If still no address, try region/subRegion
    if (addressParts.length === 0) {
      if (booking.region && booking.region.trim())
        addressParts.push(booking.region.trim());
      if (booking.subRegion && booking.subRegion.trim())
        addressParts.push(booking.subRegion.trim());
    }

    const formattedAddress =
      addressParts.length > 0 ? addressParts.join(", ") : "N/A";

    const clientData = [
      [
        "Date",
        new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      ],
      ["Client Name", booking.name],
      ["Client Address", formattedAddress],
      ["Phone", booking.phone || ""],
    ];

    // @ts-ignore
    doc.autoTable({
      startY: y,
      head: [["Client Information", ""]],
      body: clientData,
      styles: { fontSize: 10, cellPadding: 6 },
      headStyles: { fillColor: [0, 0, 0] },
      columnStyles: { 0: { cellWidth: 120 } },
    });
    y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : y + 100;

    // Category Details
    doc.setFontSize(14);
    doc.setFont("times", "bold");
    doc.text("Category Details", margin, y);
    y += 25;

    // Calculate start time (2 hours before ready time)
    const calculateStartTime = (readyTime) => {
      if (!readyTime || readyTime === "N/A") return "N/A";

      try {
        // Parse time like "3:00 PM" or "15:00"
        const timeMatch = readyTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
        if (!timeMatch) return readyTime; // Return as-is if can't parse

        let hours = parseInt(timeMatch[1]);
        const minutes = timeMatch[2];
        const ampm = timeMatch[3]?.toUpperCase();

        // Convert to 24-hour format
        if (ampm === "PM" && hours !== 12) hours += 12;
        if (ampm === "AM" && hours === 12) hours = 0;

        // Subtract 2 hours
        hours -= 2;
        if (hours < 0) hours += 24; // Handle wraparound to previous day

        // Convert back to 12-hour format
        const displayAmpm = hours >= 12 ? "PM" : "AM";
        const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

        return `${displayHours}:${minutes} ${displayAmpm}`;
      } catch (error) {
        return readyTime; // Return original if parsing fails
      }
    };

    const categoryData = [
      ["Service", booking.service_type],
      ["Number of Services", "1"],
      [
        "Date of Event",
        booking.event_date
          ? new Date(booking.event_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
          : "N/A",
      ],
      ["Start Time", calculateStartTime(booking.ready_time)],
      ["To Be Ready Time", formatTimeTo12Hour(booking.ready_time) || "N/A"],
    ];

    // @ts-ignore
    doc.autoTable({
      startY: y,
      head: [["Category Details", ""]],
      body: categoryData,
      styles: { fontSize: 10, cellPadding: 6 },
      headStyles: { fillColor: [0, 0, 0] },
      columnStyles: { 0: { cellWidth: 120 } },
    });
    y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : y + 100;

    // Detailed Services Breakdown
    doc.setFontSize(12);
    doc.setFont("times", "normal");
    const detailedServicesList = pricing?.services
      ? pricing.services.filter(
          (s) =>
            !s.startsWith("Subtotal") &&
            !s.startsWith("HST") &&
            !s.startsWith("Total") &&
            !s.startsWith("Deposit")
        )
      : [];

    if (detailedServicesList.length > 0) {
      detailedServicesList.forEach((service) => {
        const parts = service.split(":");
        const serviceName = parts[0]?.trim() || service;
        const servicePrice = parts[1]?.trim() || "";
        doc.text(`${serviceName}: ${servicePrice}`, margin, y);
        y += 18;
      });
    } else {
      doc.text("Service pricing based on stored booking data", margin, y);
      y += 18;
    }
    doc.setFont("times", "bold");
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, margin, y);
    y += 18;
    doc.text(`HST (13%): $${hst.toFixed(2)}`, margin, y);
    y += 18;
    doc.text(`Total: $${total.toFixed(2)} CAD`, margin, y);
    y += 30;

    // Dear Client Message
    doc.setFontSize(12);
    doc.setFont("times", "normal");
    const message = `Dear ${booking.name},

Congratulations on your upcoming event! We are thrilled to have the opportunity to provide our professional makeup and hair services for you. This contract outlines the terms and conditions of our agreement to ensure a successful and enjoyable experience. Please carefully read through the following details and sign at the bottom to indicate your acceptance.`;

    const messageLines = doc.splitTextToSize(message, pageWidth - 2 * margin);
    doc.text(messageLines, margin, y);
    y += messageLines.length * 15 + 20;

    // Force page break before Package Details
    doc.addPage();
    y = margin;

    // Package Details Section
    doc.setFontSize(14);
    doc.setFont("times", "bold");
    doc.text("Package Details", margin, y);
    y += 25;

    // Service Details Table
    doc.setFontSize(12);
    doc.setFont("times", "normal");

    // Payment Details Table
    const paymentStatus =
      remaining === 0
        ? "Fully Paid"
        : "Deposit Paid - Balance Due on Event Day";
    const paymentData = [
      ["Total Amount", `$${total.toFixed(2)} CAD`],
      [`Deposit Paid (${depositPercentage}%)`, `$${paid.toFixed(2)} CAD`],
      ["Remaining Balance", `$${remaining.toFixed(2)} CAD`],
      ["Payment Status", paymentStatus],
    ];

    // @ts-ignore
    doc.autoTable({
      startY: y,
      head: [["Payment Information", ""]],
      body: paymentData,
      styles: { fontSize: 10, cellPadding: 6 },
      headStyles: { fillColor: [0, 0, 0] },
      columnStyles: { 0: { cellWidth: 150 } },
    });
    y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : y + 100;

    // Price & Booking Section
    doc.setFontSize(14);
    doc.setFont("times", "bold");
    doc.text("Price & Booking", margin, y);
    y += 25;

    doc.setFontSize(12);
    doc.setFont("times", "normal");
    const priceText = `The total price for the makeup and hair services is $${total.toFixed(
      2
    )} CAD. A non-refundable deposit of ${depositPercentage}% is required to secure your booking. The remaining balance will be due on the day of the event.

Once we receive the deposit, your booking will be confirmed, and the date will be reserved exclusively for you. Please note that availability cannot be guaranteed until the deposit is received.`;

    const priceLines = doc.splitTextToSize(priceText, pageWidth - 2 * margin);
    doc.text(priceLines, margin, y);
    y += priceLines.length * 15 + 20;

    // Check if we need a page break before Client Responsibilities
    checkPageBreak(200);

    // Client Responsibilities
    doc.setFontSize(14);
    doc.setFont("times", "bold");
    doc.text("Client Responsibilities", margin, y);
    y += 25;

    doc.setFontSize(12);
    doc.setFont("times", "normal");
    const responsibilities = [
      "• Provide accurate and detailed information regarding the desired makeup and hair services.",
      "• Ensure a suitable location with proper lighting and access to an electrical outlet.",
      "• Arrive with clean, dry hair and a clean face, free of makeup or hair products.",
      "• If someone arrives with wet hair, an additional $30 charge will be added to the final invoice.",
      "• Client is responsible for any parking fees incurred at the event location.",
    ];
    responsibilities.forEach((resp) => {
      checkPageBreak(40); // Check before each responsibility item
      const lines = doc.splitTextToSize(resp, pageWidth - 2 * margin);
      doc.text(lines, margin, y);
      y += lines.length * 15;
    });
    y += 20;

    // Check if we need a page break before Travel Charges
    checkPageBreak(80);

    // Travel Charges
    doc.setFontSize(14);
    doc.setFont("times", "bold");
    doc.text("Travel Charges", margin, y);
    y += 25;

    doc.setFontSize(12);
    doc.setFont("times", "normal");
    const travelCharges = [
      "• Travel charges are respective to the client's location and may increase based on distance.",
    ];
    travelCharges.forEach((travel) => {
      checkPageBreak(40); // Check before each travel item
      const lines = doc.splitTextToSize(travel, pageWidth - 2 * margin);
      doc.text(lines, margin, y);
      y += lines.length * 15;
    });
    y += 20;

    // Check if we need a page break before Appointment Confirmation
    checkPageBreak(80);

    // Appointment Confirmation
    doc.setFontSize(14);
    doc.setFont("times", "bold");
    doc.text("Appointment Confirmation", margin, y);
    y += 25;

    doc.setFontSize(12);
    doc.setFont("times", "normal");
    const appointmentConfirmation = [
      "• An appointment day email will be sent to the client with a payment link and service details.",
    ];
    appointmentConfirmation.forEach((appt) => {
      checkPageBreak(40); // Check before each appointment item
      const lines = doc.splitTextToSize(appt, pageWidth - 2 * margin);
      doc.text(lines, margin, y);
      y += lines.length * 15;
    });
    y += 20;

    // Check if we need a page break before Cancellation Policy
    checkPageBreak(120);

    // Cancellation Policy
    doc.setFontSize(14);
    doc.setFont("times", "bold");
    doc.text("Cancellation Policy", margin, y);
    y += 25;

    doc.setFontSize(12);
    doc.setFont("times", "normal");
    const cancellation = [
      "• The deposit is non-refundable if the client cancels.",
      "• If the event is canceled less than 2 weeks before the scheduled date, the full remaining balance will still be due.",
      "• If the event is canceled less than 3 days before the scheduled date, the full remaining balance will still be due.",
    ];
    cancellation.forEach((canc) => {
      checkPageBreak(40); // Check before each cancellation item
      const lines = doc.splitTextToSize(canc, pageWidth - 2 * margin);
      doc.text(lines, margin, y);
      y += lines.length * 15;
    });
    y += 20;

    // Check if we need a page break before Liability
    checkPageBreak(120);

    // Liability
    doc.setFontSize(14);
    doc.setFont("times", "bold");
    doc.text("Liability", margin, y);
    y += 25;

    doc.setFontSize(12);
    doc.setFont("times", "normal");
    const liability = [
      "• Looks By Anum is not responsible for allergic reactions or injuries resulting from the services provided.",
      "• The client must inform the artist of any allergies or sensitivities before the service begins.",
      "• The client agrees to hold Looks By Anum harmless from any claims related to the services rendered.",
    ];
    liability.forEach((liab) => {
      checkPageBreak(40); // Check before each liability item
      const lines = doc.splitTextToSize(liab, pageWidth - 2 * margin);
      doc.text(lines, margin, y);
      y += lines.length * 15;
    });
    y += 20;

    // Check if we need a page break before Agreement
    checkPageBreak(120);

    // Agreement
    doc.setFontSize(14);
    doc.setFont("times", "bold");
    doc.text("Agreement", margin, y);
    y += 25;

    doc.setFontSize(12);
    doc.setFont("times", "normal");
    const agreement = `By signing this contract, the client acknowledges that they have read, understood, and agree to all the terms and conditions outlined above.

Client Signature:`;

    const agreementLines = doc.splitTextToSize(
      agreement,
      pageWidth - 2 * margin
    );
    doc.text(agreementLines, margin, y);
    y += agreementLines.length * 15 + 5;

    // Add signature image if available
    if (booking.client_signature) {
      try {
        // Convert data URL to image for PDF
        const signatureImage = booking.client_signature.replace(
          /^data:image\/[a-z]+;base64,/,
          ""
        );
        const signatureX = margin + 100;
        const signatureWidth = 150;
        const signatureHeight = 60;

        doc.addImage(
          signatureImage,
          "PNG",
          signatureX,
          y - 10,
          signatureWidth,
          signatureHeight
        );
        y += signatureHeight + 10;

        // Add signature date
        doc.setFontSize(10);
        doc.setFont("times", "italic");
        const signatureDate =
          booking.signature_date || booking.ops?.signature_date
            ? new Date(booking.signature_date || booking.ops?.signature_date)
            : new Date();
        doc.text(
          `Digitally signed on ${signatureDate.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })} at ${signatureDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}`,
          signatureX,
          y
        );
        y += 15;
      } catch (error) {
        console.error("Error adding signature to PDF:", error);
        // Fallback to signature line
        const signatureX = margin + 100;
        doc.setLineWidth(1);
        doc.line(signatureX, y, pageWidth - margin, y);
        y += 15;

        doc.setFontSize(10);
        doc.setFont(undefined, "italic");
        doc.text(
          `Digitally signed on ${new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })} at ${new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}`,
          signatureX,
          y
        );
        y += 15;
      }
    } else {
      // Fallback signature line if no signature image
      const signatureX = margin + 100;
      doc.setLineWidth(1);
      doc.line(signatureX, y, pageWidth - margin, y);
      y += 15;

      doc.setFontSize(10);
      doc.setFont("times", "italic");
      doc.text(
        `Digitally signed on ${new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })} at ${new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })}`,
        signatureX,
        y
      );
      y += 15;
    }

    doc.save(`Contract_${booking.booking_id || booking.unique_id}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">
            Processing Payment
          </h2>
          <p className="text-gray-600 text-center">
            Please wait while we confirm your payment and update your booking
            details. This may take a few moments...
          </p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              ✓
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-4">
              {error ||
                "Your payment was successful! Your booking details are being processed. Please check your email for confirmation."}
            </p>
            <p className="text-sm text-gray-500">
              If this page doesn't update automatically after a few minutes,
              please refresh the page or contact support.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Use stored pricing from database as primary source
  const serverTotal = Number(
    booking.pricing?.quote_total || booking.price || 0
  );
  const serverPaid = Number(booking.pricing?.amount_paid || 0);
  const serverRemaining = Number.isFinite(booking.pricing?.remaining_amount)
    ? Number(booking.pricing.remaining_amount)
    : Math.max(serverTotal - serverPaid, 0);

  // Only calculate breakdown if we don't have stored pricing or if it's incomplete
  const pricing =
    serverTotal > 0
      ? null
      : calculateBookingPrice(
          booking,
          booking.artist === "Lead" ? "Lead" : "Team"
        );
  const subtotal =
    serverTotal > 0 ? serverTotal / 1.13 : pricing?.subtotal || 0;
  const hst = serverTotal > 0 ? serverTotal - subtotal : pricing?.hst || 0;
  const total = serverTotal || pricing?.total || 0;
  const paid = serverPaid;
  const remaining = serverRemaining;

  // Format time to 12-hour AM/PM format
  const formatTimeTo12Hour = (timeString) => {
    if (!timeString || timeString === "N/A") return "N/A";

    try {
      // Parse time like "3:00 PM", "15:00", or "20:11"
      const timeMatch = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
      if (!timeMatch) return timeString; // Return as-is if can't parse

      let hours = parseInt(timeMatch[1]);
      const minutes = timeMatch[2];
      const ampm = timeMatch[3]?.toUpperCase();

      // If already in 12-hour format, return as-is
      if (ampm) return timeString;

      // Convert from 24-hour to 12-hour format
      const displayAmpm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

      return `${displayHours}:${minutes} ${displayAmpm}`;
    } catch (error) {
      return timeString; // Return original if parsing fails
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-2xl mr-3">
              🎉
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Booking Confirmed!
            </h1>
          </div>
          <p className="text-gray-700 mb-6">
            Success! Thank you for booking with us, {booking.name}. We will
            contact you within 24 hours to confirm all details.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Booking Details
          </h2>
          <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-800 mb-6">
            <div>
              <span className="font-medium">Booking ID:</span>{" "}
              {booking.booking_id || booking.unique_id}
            </div>
            <div>
              <span className="font-medium">Name:</span> {booking.name}
            </div>
            <div>
              <span className="font-medium">Email:</span> {booking.email}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {booking.phone}
            </div>
            <div>
              <span className="font-medium">Artist:</span>{" "}
              {booking.artist || "team"}
            </div>
            <div>
              <span className="font-medium">Service Type:</span>{" "}
              {booking.service_type}
            </div>
            <div>
              <span className="font-medium">Status:</span> PAID & CONFIRMED
            </div>
            <div>
              <span className="font-medium">Event Date:</span>{" "}
              {booking.event_date?.toString().slice(0, 10)}
            </div>
            <div>
              <span className="font-medium">Ready Time:</span>{" "}
              {formatTimeTo12Hour(booking.ready_time)}
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Services Breakdown
          </h2>
          <div className="text-sm text-gray-800 space-y-1 mb-4">
            {pricing?.services ? (
              pricing.services
                .filter(
                  (s) =>
                    !s.startsWith("Subtotal") &&
                    !s.startsWith("HST") &&
                    !s.startsWith("Total") &&
                    !s.startsWith("Deposit")
                )
                .map((s, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{s.split(":")[0]}:</span>
                    <span>{s.split(":")[1]}</span>
                  </div>
                ))
            ) : (
              <div className="text-gray-600 italic">
                Service details based on stored pricing
              </div>
            )}
          </div>
          <div className="text-sm text-gray-900 space-y-1 mb-8">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>HST (13%):</span>
              <span>${hst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total Amount:</span>
              <span>${total.toFixed(2)} CAD</span>
            </div>
            <div className="flex justify-between text-green-700">
              <span>Amount Paid:</span>
              <span>${paid.toFixed(2)} CAD</span>
            </div>
            <div className="flex justify-between text-blue-700">
              <span>Remaining Balance:</span>
              <span>${remaining.toFixed(2)} CAD</span>
            </div>
          </div>

          <div className="bg-gray-50 border rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <div className="mr-2">📄</div>
              <div className="font-semibold text-gray-900">
                Your Booking Contract (PDF)
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              Your official contract has been generated. Please download and
              keep this for your records.
            </p>
            <button
              onClick={handleDownloadContract}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 cursor-pointer"
            >
              Download Contract
            </button>
          </div>

          <div className="text-sm text-gray-700 space-y-1 mb-6">
            <div>✅ Your booking is confirmed!</div>
            <div>• Payment processed successfully</div>
            <div>• Contract generated and ready for download</div>
            <div>• Confirmation email will be sent</div>
            <div>• We will contact you within 24 hours</div>
          </div>

          <button
            onClick={() => (window.location.href = "/")}
            className="w-full px-4 py-3 bg-gray-100 text-black rounded-lg font-semibold hover:bg-gray-200 cursor-pointer"
          >
            Return to Website
          </button>
        </div>
      </div>
    </div>
  );
}
