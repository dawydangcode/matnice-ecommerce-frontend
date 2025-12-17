import React from 'react';
import VerifyEmailForm from '../../components/auth/VerifyEmailForm';

const VerifyEmailPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full">
        <VerifyEmailForm />
      </div>
    </div>
  );
};

export default VerifyEmailPage;
