import React from 'react';
import RegisterForm from '../../components/auth/RegisterForm';
import '../../styles/auth.css';
import LoginFooter from '../../components/auth/LoginFooter';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with Logo */}
      <header className="bg-white shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <div className="bg-black text-white px-6 py-3 font-bold text-2xl md:text-2xl text-xl">
            MATNICE EYEWEAR
          </div>
        </div>
      </header>

      {/* Main Content with Background */}
      <div className="flex-1 auth-background">
        <div className="w-full h-full auth-container py-8 min-h-full">
          <div className="auth-form-wrapper">
            <RegisterForm />
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

export default RegisterPage;
