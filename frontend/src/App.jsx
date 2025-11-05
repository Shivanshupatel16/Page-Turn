import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "./login/Login";
import NotFound from "./pages/NotFound";
import Layout from "./pages/Sidebar";
import SellPage from "./sellPages/SellPage";
import MyListingsBooks from "./sellPages/ListBooks";
import AboutPage from "./pages/About";
import { AdminDashboard, UserDashboard } from "./pages/Dashboard";
import { useSelector } from "react-redux";
import AuthPage from "./pages/AuthPage";
import {BookStoreFrontpage,CategoryPage} from "./buyPages/buyDashboard";
import AdminApprovalPage from "./adminPages/adminApprovel";
import ProfilePage from "./pages/profilePage";
import ComingSoon from "./pages/Message";
import BookDetails from "./buyPages/BuyBooks";
import PaymentSuccess from "./buyPages/PaymentSuccessfull";
import axios from "axios";
import { Toaster } from "sonner";

// axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
// axios.defaults.withCredentials = true;

const ProtectedRoute = ({ children, requiredRole }) => {
  const { token, role } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/not-found" replace />;
  }

  return children;
};



function App() {
  return (
    <>
    <Toaster richColors position="bottom-right" />
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/about" element={<Layout><AboutPage /></Layout>} />
      <Route path="/buyDashboard" element={<Layout><BookStoreFrontpage /></Layout>} />
      <Route path="/forgot-password" element={<AuthPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/message" element={<ComingSoon />} /> 
      <Route path="/books/:id" element={<BookDetails />} /> 
      <Route path="/paymentSuccess" element={<PaymentSuccess />} />
      <Route path="/category/:categoryName" element={<CategoryPage />} /> 
      <Route
        path="/sell"
        element={
          <ProtectedRoute>
            <Layout><SellPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mybooks"
        element={
          <ProtectedRoute>
            <Layout><MyListingsBooks /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute requiredRole="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/approvalPage"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminApprovalPage />
          </ProtectedRoute>
        }
      />

      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    
    </>
  );
}

export default App;