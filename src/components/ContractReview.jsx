import React, { useState } from 'react';
import SignatureCanvas from './SignatureCanvas';

export default function ContractReview({ register, watch, errors, onNext, onBack, setValue }) {
  const [signatureData, setSignatureData] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const watchedFields = watch();
  const today = new Date().toISOString().split('T')[0];

  // Calculate total pricing
  const calculatePricing = () => {
    let subtotal = 0;
    const serviceType = watchedFields.service_type;
    const packageType = watchedFields.package?.type || 'senior';
    
    // Package pricing multipliers
    const packageMultipliers = {
      senior: { both: 500, hair: 250, makeup: 300 },
      junior: { both: 360, hair: 130, makeup: 220 },
      lead: { both: 450, hair: 300, makeup: 399 }
    };

    if (serviceType === 'Bridal') {
      const brideService = watchedFields.bride?.service;
      if (brideService === 'Both Hair & Makeup') subtotal += packageMultipliers[packageType].both;
      else if (brideService === 'Hair Only') subtotal += packageMultipliers[packageType].hair;
      else if (brideService === 'Makeup Only') subtotal += packageMultipliers[packageType].makeup;

      // Bridal add-ons
      if (watchedFields.bride?.veil_or_jewelry_setting === 'true') subtotal += 50;
      if (watchedFields.bride?.extensions === 'true') subtotal += 20; // PHP shows different pricing
      
      // Party members
      const bothCount = parseInt(watchedFields.party?.both) || 0;
      const makeupCount = parseInt(watchedFields.party?.makeup) || 0;
      const hairCount = parseInt(watchedFields.party?.hair) || 0;
      
      subtotal += bothCount * 200; // PHP pricing
      subtotal += makeupCount * 115; // PHP pricing
      subtotal += hairCount * 115; // PHP pricing
      
      // Party add-ons
      const partyExtensions = parseInt(watchedFields.party?.hair_extensions) || 0;
      const partyDupattas = parseInt(watchedFields.party?.dupattas_or_setting) || 0;
      
      subtotal += partyExtensions * 20; // PHP pricing
      subtotal += partyDupattas * 20; // PHP pricing
    }

    // Travel fee
    const city = watchedFields.address?.city;
    let travelFee = 0;
    if (city === 'Calgary') travelFee = 30;
    else if (city === 'Edmonton') travelFee = 40;
    else if (city && city !== 'Other') travelFee = 35; // Default for other cities

    // Early fee
    const isEarly = watchedFields.event?.is_early;
    const earlyFee = isEarly ? 50 : 0;

    const beforeGST = subtotal + travelFee + earlyFee;
    const gst = Math.round(beforeGST * 0.05 * 100) / 100;
    const total = beforeGST + gst;

    return {
      subtotal,
      travelFee,
      earlyFee,
      beforeGST,
      gst,
      total
    };
  };

  const pricing = calculatePricing();
  const client = watchedFields.client || {};
  const address = watchedFields.address || {};
  const event = watchedFields.event || {};
  const serviceType = watchedFields.service_type;
  const packageType = watchedFields.package?.type || 'senior';

  const formatAddress = () => {
    return `${address.street || ''}, ${address.city || ''}, ${address.province || ''}, ${address.postal_code || ''}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  };

  const handleSignature = (signature) => {
    setSignatureData(signature);
    setValue('contract.signature', signature);
    setValue('signature_date', new Date().toISOString());
  };

  const handleTermsChange = (e) => {
    const agreed = e.target.checked;
    setAgreedToTerms(agreed);
    setValue('contract.agreed_to_terms', agreed);
  };

  const handleNext = () => {
    if (signatureData && agreedToTerms) {
      setValue('contract.signed_date', today);
      onNext();
    }
  };

  return (
    <div className="max-w-sm md:max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-sm">
      <div className="text-center mb-4 md:mb-8">
        <h2 className="text-sm md:text-3xl font-bold text-gray-800 mb-2">Service Contract</h2>
        <p className="text-gray-600">Please review the details below and sign to proceed</p>
        <p className="text-sm text-gray-500 mt-2">
          Once signed and submitted, a PDF copy will be emailed to {client.email}
        </p>
      </div>

      <div className="space-y-8">
        {/* Client & Service Details */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Service Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Client:</strong> {client.name || 'Not provided'}
            </div>
            <div>
              <strong>Email:</strong> {client.email || 'Not provided'} 
            </div>
            <div>
              <strong>Service Type:</strong> {serviceType}
            </div>
            <div>
              <strong>Package:</strong> {packageType?.charAt(0).toUpperCase() + packageType?.slice(1)} Artist
            </div>
            <div>
              <strong>Date:</strong> {formatDate(event.date)}
            </div>
            <div>
              <strong>Ready By:</strong> {event.ready_time || 'Not set'}
            </div>
            <div className="md:col-span-2">
              <strong>Address:</strong> {formatAddress()}
            </div>
          </div>
        </div>

        {/* Service Breakdown */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Services & Pricing</h3>
          <div className="space-y-2 text-sm">
            {serviceType === 'Bridal' && (
              <>
                <div className="flex justify-between">
                  <span>Bridal {watchedFields.bride?.service}:</span>
                  <span>${packageType === 'senior' ? 
                    (watchedFields.bride?.service === 'Both Hair & Makeup' ? 500 :
                     watchedFields.bride?.service === 'Hair Only' ? 250 : 300) :
                    packageType === 'junior' ?
                    (watchedFields.bride?.service === 'Both Hair & Makeup' ? 360 :
                     watchedFields.bride?.service === 'Hair Only' ? 130 : 220) :
                    (watchedFields.bride?.service === 'Both Hair & Makeup' ? 450 :
                     watchedFields.bride?.service === 'Hair Only' ? 300 : 399)
                  }</span>
                </div>
                
                {watchedFields.bride?.veil_or_jewelry_setting === 'true' && (
                  <div className="flex justify-between">
                    <span>Bridal jewelry & dupatta/veil setting:</span>
                    <span>$50</span>
                  </div>
                )}
                
                {watchedFields.bride?.extensions === 'true' ? (
                  <div className="flex justify-between">
                    <span>Bridal hair extensions installation:</span>
                    <span>$20</span>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <span>Bridal hair extensions installation:</span>
                    <span>NOT CHOSEN</span>
                  </div>
                )}

                {/* Party members */}
                {['both', 'makeup', 'hair'].map((type) => {
                  const count = parseInt(watchedFields.party?.[type]) || 0;
                  const price = type === 'both' ? 200 : 115;
                  const label = type === 'both' ? 'hair and makeup' : 
                              type === 'makeup' ? 'makeup only' : 'hair only';
                  
                  return (
                    <div key={type} className="flex justify-between">
                      <span>Bridal party {label} x {count} (${price} x {count}):</span>
                      <span>${count * price}</span>
                    </div>
                  );
                })}

                {/* Party add-ons */}
                <div className="flex justify-between">
                  <span>Bridal party hair extensions installation x {parseInt(watchedFields.party?.hair_extensions) || 0} ($20 x {parseInt(watchedFields.party?.hair_extensions) || 0}):</span>
                  <span>${(parseInt(watchedFields.party?.hair_extensions) || 0) * 20}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Bridal party dupatta/veil setting x {parseInt(watchedFields.party?.dupattas_or_setting) || 0} ($20 x {parseInt(watchedFields.party?.dupattas_or_setting) || 0}):</span>
                  <span>${(parseInt(watchedFields.party?.dupattas_or_setting) || 0) * 20}</span>
                </div>
              </>
            )}

            <div className="flex justify-between">
              <span>Travel fee ({address.city}):</span>
              <span>${pricing.travelFee}</span>
            </div>

            {pricing.earlyFee > 0 && (
              <div className="flex justify-between">
                <span>Early fee (start 6AM or before):</span>
                <span>${pricing.earlyFee}</span>
              </div>
            )}

            <div className="border-t pt-2 mt-4">
              <div className="flex justify-between font-medium">
                <span>Subtotal:</span>
                <span>${pricing.beforeGST}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%):</span>
                <span>${pricing.gst}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>TOTAL:</span>
                <span>${pricing.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Terms & Conditions</h3>
          <div className="text-sm text-gray-700 space-y-2 max-h-64 overflow-y-auto">
            <p>• For cancellations within 7 days of service, the deposit is non-refundable and non-transferable to a future date.</p>
            <p>• For cancellations or postponements with at least 7 days notice, the deposit is non-refundable but is transferable to a future date.</p>
            <p>• No changes to services booked will be made 3 days prior to the appointment, as all artist schedules will already be made.</p>
            <p>• For groups of more than 2 people, we will provide a schedule in advance with set times for each client. Clients will have to follow the schedule to get the party ready on time.</p>
            <p>• If client is delayed and the team has to wait beyond agreed upon start time, a charge $15 per 15 minutes will be added to the final invoice. This will compensate for the artist's time.</p>
            <p>• If client is delayed and the appointment starts late, our team reserves the right to still leave at agreed upon end time in this contract.</p>
            <p>• Any clients added last minute who are not on the contract are subject to the team's availability. We will invoice at the regular hair and makeup charges.</p>
            <p>• PARKING - Makeup by Nida and Team Inc. bills parking to the client at the end of the appointment when applicable. We try our best to find the cheapest option for the client. If free parking is available, please provide us details.</p>
            <p>• If a scheduled team member falls sick before the appointment, Makeup by Nida & Team Inc. will find a replacement team member.</p>
            <p>• The client will not solicit and/or hire any artist servicing this appointment without dealing with Makeup by Nida & Team Inc.</p>
            <p>• The client may tip the artist(s) in cash, but the remaining balance must be cleared via e-transfer, credit card, or PayPal.</p>
          </div>
        </div>

        {/* Agreement & Signature */}
        <div className="border-2 border-gray-200 rounded-lg p-6">
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={handleTermsChange}
                className="w-4 h-4 text-pink-600 border-gray-300 focus:ring-pink-500 mr-3"
              />
              <span className="text-sm text-gray-700">
                I have read all the terms and conditions, and I agree to them.
              </span>
            </label>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Digital Signature *
            </label>
            <SignatureCanvas
              onSignatureChange={handleSignature}
              width={400}
              height={150}
            />
          </div>

          <div className="text-sm text-gray-600">
            <strong>Date:</strong> {today}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1.5 md:px-6 md:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!signatureData || !agreedToTerms}
          className={`px-3 py-1.5 md:px-6 md:py-3 rounded-lg transition-colors ${
            signatureData && agreedToTerms
              ? 'bg-pink-600 text-white hover:bg-pink-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Proceed to Payment →
        </button>
      </div>
    </div>
  );
}