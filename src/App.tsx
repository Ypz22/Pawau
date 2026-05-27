import { lazy, Suspense, type ReactNode } from 'react';
import { AnimatePresence } from 'motion/react';
import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout';
import PageTransition from './components/PageTransition';
import ScrollToTop from './components/ScrollToTop';

const Home = lazy(() => import('./pages/Home'));
const Booking = lazy(() => import('./pages/Booking'));
const Contact = lazy(() => import('./pages/Contact'));
const Services = lazy(() => import('./pages/Services'));
const AdminAppointments = lazy(() => import('./pages/admin/Appointments'));
const AdminCalendar = lazy(() => import('./pages/admin/Calendar'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminLogin = lazy(() => import('./pages/admin/Login'));

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center px-6">
      <div className="rounded-full bg-surface-container px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] text-on-surface-variant">
        Cargando...
      </div>
    </div>
  );
}

function renderPage(page: ReactNode) {
  return (
    <Suspense fallback={<RouteFallback />}>
      <PageTransition>{page}</PageTransition>
    </Suspense>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={renderPage(<Home />)} />
        <Route path="/servicios" element={renderPage(<Services />)} />
        <Route path="/agendar" element={renderPage(<Booking />)} />
        <Route path="/contacto" element={renderPage(<Contact />)} />
        <Route path="/admin/login" element={renderPage(<AdminLogin />)} />
        <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              {renderPage(<AdminDashboard />)}
            </AdminRoute>
          }
        />
        <Route
          path="/admin/citas"
          element={
            <AdminRoute>
              {renderPage(<AdminAppointments />)}
            </AdminRoute>
          }
        />
        <Route
          path="/admin/calendario"
          element={
            <AdminRoute>
              {renderPage(<AdminCalendar />)}
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
