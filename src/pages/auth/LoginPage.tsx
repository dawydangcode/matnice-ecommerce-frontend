import React from 'react';
import LoginForm from '../../components/auth/LoginForm';
import '../../styles/auth.css';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with Logo */}
      <header className="bg-white shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <div className="bg-black text-white px-6 py-3 font-bold text-2xl">
            MATNICE EYEWEAR
          </div>
        </div>
      </header>

      {/* Main Content with Background */}
      <div className="flex-1 auth-background">
        <div className="w-full h-full auth-container">
          <div className="auth-form-wrapper">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
