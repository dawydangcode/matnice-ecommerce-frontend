import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import LoginFooter from '../../components/auth/LoginFooter';
import '../../styles/auth.css';

const LoginPage: React.FC = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header with Logo */}
      <header className="bg-white shadow-sm py-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <Link to="/" className="bg-black text-white px-6 py-3 font-bold text-2xl md:text-2xl text-xl hover:bg-gray-800 transition-colors">
            MATNICE EYEWEAR
          </Link>
        </div>
      </header>

      {/* Main Content with Background */}
      <div className="flex-1 auth-background overflow-auto">
        <div className="w-full h-full auth-container flex items-center justify-center">
          <div className="auth-form-wrapper">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0">
        <LoginFooter />
      </div>
    </div>
  );
};

export default LoginPage;
