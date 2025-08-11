import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/auth.store';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Component
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

// Role-based redirect component
const RoleBasedRedirect: React.FC = () => {
  const { user, isLoggedIn } = useAuthStore();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect based on user role
  if (user?.role?.name === 'admin' || user?.role?.type === 'admin') {
    return <Navigate to="/admin" replace />;
  } else {
    return <Navigate to="/" replace />;
  }
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

          {/* Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Public/User Routes */}
          <Route
            path="/"
            element={<HomePage />}
          />

          {/* Default Routes - Redirect based on role */}
          <Route 
            path="/home" 
            element={
              <Navigate to="/" replace />
            } 
          />
          
          {/* Role-based redirect route */}
          <Route 
            path="/redirect" 
            element={<RoleBasedRedirect />} 
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
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
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
