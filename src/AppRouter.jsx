import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import RemainingPayment from './components/RemainingPayment';
import QuotePage from './components/QuotePage';
import PaymentSuccess from './components/PaymentSuccess';
import QuotePayment from './components/QuotePayment';
import InteracCallback from './components/InteracCallback';
import AdminPanel from './components/AdminPanel';
import InteracUpload from './components/InteracUpload';
import EditBookingPage from './components/EditBookingPage';
import './App.css';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/quote/:bookingId" element={<QuotePage />} />
      <Route path="/payment" element={<QuotePayment />} />
      <Route path="/remaining-payment" element={<RemainingPayment />} />
      <Route path="/success" element={<PaymentSuccess />} />
      <Route path="/interac-callback" element={<InteracCallback />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/interac-upload" element={<InteracUpload />} />
      <Route path="/edit-booking" element={<EditBookingPage />} />
    </Routes>
  );
} 