import React, { useState } from 'react';
import { Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/auth.service';

interface ResendVerificationProps {
  email?: string;
  onSuccess?: () => void;
}

const ResendVerificationEmail: React.FC<ResendVerificationProps> = ({ 
  email: initialEmail,
  onSuccess 
}) => {
  const [email, setEmail] = useState(initialEmail || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      await authService.resendVerificationEmail(email);
      
      setIsSuccess(true);
      toast.success('Verification email has been resent! Please check your inbox.');
      
      if (onSuccess) {
        onSuccess();
      }

      // Reset success state after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend verification email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-900 mb-2">
            Email Not Verified
          </h3>
          <p className="text-sm text-yellow-700 mb-4">
            You need to verify your email address before you can log in. 
            Didn't receive the email?
          </p>

          {isSuccess ? (
            <div className="flex items-center text-green-700 bg-green-50 p-3 rounded-lg">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">
                Verification email sent! Check your inbox.
              </span>
            </div>
          ) : (
            <form onSubmit={handleResend} className="space-y-3">
              <div>
                <label htmlFor="resend-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="resend-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  disabled={isLoading}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Resend Verification Email
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResendVerificationEmail;
