import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Services from "./pages/Services";
import Appointment from "./pages/Appointment";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Confirmation from "./pages/Confirmation";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import NotAuthorized from "./pages/NotAuthorized";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Account from "./pages/account/AccountDashboard";
import ServiceHistory from "./pages/account/ServiceHistory";
import CompleteService from "./pages/admin/CompleteService";
import UpcomingAppointments from "./pages/account/UpcomingAppointments";
import ChangePassword from "./pages/account/ChangePassword";
import PersonalInfo from "./pages/account/PersonalInfo";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/services" element={<Services />} />

  <Route path="/appointment"
         element={
           <ProtectedRoute requireVerified>
             <Appointment />
           </ProtectedRoute>
         }
  />

  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/confirmation" element={<Confirmation />} />

  {/* Account Dashboard Home */}
  <Route path="/account"
         element={
           <ProtectedRoute requireVerified>
             <Account />
           </ProtectedRoute>
         }
  />

  {/* Account Dashboard Sub‑Pages */}
  <Route path="/account/personal-info"
         element={
           <ProtectedRoute requireVerified>
             <PersonalInfo />
           </ProtectedRoute>
         }
  />

  <Route path="/account/service-history"
         element={
           <ProtectedRoute requireVerified>
             <ServiceHistory />
           </ProtectedRoute>
         }
  />

  <Route path="/account/upcoming-appointments"
         element={
           <ProtectedRoute requireVerified>
             <UpcomingAppointments />
           </ProtectedRoute>
         }
  />

  <Route path="/account/password"
         element={
           <ProtectedRoute requireVerified>
             <ChangePassword />
           </ProtectedRoute>
         }
  />

  <Route path="/account/personal-info"
         element={
           <ProtectedRoute requireVerified>
             <PersonalInfo />
           </ProtectedRoute>
         }
  
  />
<Route
  path="/account/history"
  element={
    <ProtectedRoute requireVerified>
      <ServiceHistory />
    </ProtectedRoute>
  }
/>
  <Route path="/admin"
         element={
           <AdminRoute>
             <AdminDashboard />
           </AdminRoute>
         }
  />

  <Route path="/verify-email" element={<VerifyEmail />} />
  <Route path="/reset-password" element={<ResetPassword />} />
  <Route path="/not-authorized" element={<NotAuthorized />} />
</Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;