import { AnimatePresence } from 'motion/react';
import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout';
import PageTransition from './components/PageTransition';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import Services from './pages/Services';
import AdminAppointments from './pages/admin/Appointments';
import AdminCalendar from './pages/admin/Calendar';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLogin from './pages/admin/Login';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/servicios" element={<PageTransition><Services /></PageTransition>} />
        <Route path="/agendar" element={<PageTransition><Booking /></PageTransition>} />
        <Route path="/contacto" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/admin/login" element={<PageTransition><AdminLogin /></PageTransition>} />
        <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <PageTransition><AdminDashboard /></PageTransition>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/citas"
          element={
            <AdminRoute>
              <PageTransition><AdminAppointments /></PageTransition>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/calendario"
          element={
            <AdminRoute>
              <PageTransition><AdminCalendar /></PageTransition>
            </AdminRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </BrowserRouter>
  );
}

export default App;
