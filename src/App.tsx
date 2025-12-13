import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/auth.store';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LensPage from './pages/LensPage';
import LensDetailPage from './pages/LensDetailPage';
import LensSelectionPage from './pages/LensSelectionPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import AdminDashboard from './pages/AdminDashboard';
import AddProduct3DModel from './pages/admin/AddProduct3DModel';
import Configure3DModel from './pages/admin/Configure3DModel';
import AIAnalysisPage from './pages/AIAnalysisPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import MyAccountPage from './pages/MyAccountPage';
import OrderDetailPage from './pages/OrderDetailPage';
import StockManagementPage from './pages/StockManagementPage';
import BoutiquePage from './pages/BoutiquePage';

// Protected Route Component for Admin
interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isLoggedIn, user } = useAuthStore();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has admin role
  if (user?.role?.name !== 'admin' && user?.role?.type !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Protected Route Component for Users
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn } = useAuthStore();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component (redirect if already logged in)
const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn, user } = useAuthStore();
  
  if (isLoggedIn) {
    // Redirect based on user role
    if (user?.role?.name === 'admin' || user?.role?.type === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }
  
  return <>{children}</>;
};

function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    // Initialize auth state from localStorage
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <div className="App">
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#374151',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e5e7eb',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />

        {/* Routes */}
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPasswordPage />
              </PublicRoute>
            }
          />

          {/* Home Page - accessible by everyone */}
          <Route path="/" element={<HomePage />} />

          {/* Products Pages - accessible by everyone */}
          <Route path="/glasses" element={<ProductsPage />} />
          <Route path="/sunglasses" element={<ProductsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />

          {/* Boutique Page - accessible by everyone */}
          <Route path="/boutique" element={<BoutiquePage />} />

          {/* Lens Pages - accessible by everyone */}
          <Route path="/lenses" element={<LensPage />} />
          <Route path="/lenses/category/:category" element={<LensPage />} />
          <Route path="/lenses/brand/:brand" element={<LensPage />} />
          <Route path="/lens/:id" element={<LensDetailPage />} />
          <Route path="/lens-selection" element={<LensSelectionPage />} />

          {/* Cart Page - accessible by everyone (supports both guest and authenticated users) */}
          <Route 
            path="/cart" 
            element={<CartPage />} 
          />

          {/* Wishlist Page - requires login */}
          <Route 
            path="/wishlist" 
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            } 
          />

          {/* Checkout Page - requires login */}
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            } 
          />

          {/* Payment Success Page */}
          <Route 
            path="/checkout/payment-success" 
            element={<PaymentSuccessPage />} 
          />

          {/* Order Success Page - requires login */}
          <Route 
            path="/order-success" 
            element={
              <ProtectedRoute>
                <OrderSuccessPage />
              </ProtectedRoute>
            } 
          />

          {/* My Account Page - requires login */}
          <Route 
            path="/account" 
            element={
              <ProtectedRoute>
                <MyAccountPage />
              </ProtectedRoute>
            } 
          />

          {/* Order Detail Page - requires login */}
          <Route 
            path="/orders/:orderId" 
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            } 
          />

          {/* AI Analysis Page - accessible by everyone */}
          <Route path="/ai" element={<AIAnalysisPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products/:productId/3d-models/add"
            element={
              <AdminRoute>
                <AddProduct3DModel />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products/:productId/3d-models/:modelId/config"
            element={
              <AdminRoute>
                <Configure3DModel />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/stock"
            element={
              <AdminRoute>
                <StockManagementPage />
              </AdminRoute>
            }
          />
          {/* User Dashboard (legacy) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-xl text-gray-600 mb-8">Page not found</p>
                  <a
                    href="/"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Go to Home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
