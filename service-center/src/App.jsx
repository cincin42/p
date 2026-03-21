import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Services from "./pages/Services";
import Appointment from "./pages/Appointment";
import Account from "./pages/Account";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Confirmation from "./pages/Confirmation";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import NotAuthorized from "./pages/NotAuthorized";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/appointment" element={<Appointment />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/account"
                 element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
          }
          />
          <Route path="/admin"
                 element={
                  <AdminRoute>
                    <AdminDashboard  />
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