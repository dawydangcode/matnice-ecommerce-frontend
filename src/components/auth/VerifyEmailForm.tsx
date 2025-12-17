import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/auth.service';

interface VerifyEmailFormProps {
  onSuccess?: () => void;
}

const VerifyEmailForm: React.FC<VerifyEmailFormProps> = ({ onSuccess }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);

  const verifyEmail = async (verificationToken: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.verifyEmail(verificationToken);
      
      if (response.success) {
        setIsSuccess(true);
        toast.success('Email verified successfully!');
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error(response.message || 'Verification failed');
      }
    } catch (error: any) {
      console.error('Email verification error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to verify email';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setError('Invalid verification link. No token provided.');
      setIsLoading(false);
      return;
    }
    setToken(tokenFromUrl);
    verifyEmail(tokenFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (isSuccess && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isSuccess && countdown === 0) {
      navigate('/login');
    }
  }, [isSuccess, countdown, navigate]);

  const handleRetry = () => {
    if (token) {
      verifyEmail(token);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Verifying Your Email
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your email address...
            </p>
            
            {/* Loading Animation */}
            <div className="mt-8">
              <div className="flex justify-center space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success State
  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            {/* Success Icon with Animation */}
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-scale-in">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Email Verified! 🎉
            </h2>
            
            <p className="text-gray-600 mb-6">
              Your email has been successfully verified. You can now access all features of your account.
            </p>

            {/* Success Message Box */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium text-green-900">
                    Account Activated
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Your account is now fully activated and ready to use. You will be redirected to the login page in {countdown} second{countdown !== 1 ? 's' : ''}.
                  </p>
                </div>
              </div>
            </div>

            {/* Countdown Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-green-600 h-2 transition-all duration-1000 ease-linear"
                  style={{ width: `${(5 - countdown) * 20}%` }}
                ></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
              >
                Go to Login Now
              </button>
              
              <Link
                to="/"
                className="block w-full text-gray-600 py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Verification Failed
          </h2>
          
          <p className="text-gray-600 mb-6">
            {error || 'We were unable to verify your email address. This link may have expired or is invalid.'}
          </p>

          {/* Error Message Box */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-medium text-red-900">
                  Common Reasons:
                </p>
                <ul className="text-sm text-red-700 mt-2 space-y-1 list-disc list-inside">
                  <li>Verification link has expired (15 minutes)</li>
                  <li>Link has already been used</li>
                  <li>Invalid or malformed token</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {token && (
              <button
                onClick={handleRetry}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center shadow-md hover:shadow-lg"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Try Again
              </button>
            )}
            
            <Link
              to="/register"
              className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Register New Account
            </Link>
            
            <Link
              to="/forgot-password"
              className="block w-full text-gray-600 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Reset Password Instead
            </Link>
            
            <Link
              to="/"
              className="block w-full text-gray-500 py-2 px-6 rounded-lg hover:text-gray-700 transition-colors text-sm"
            >
              Back to Home
            </Link>
          </div>

          {/* Support Contact */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help?{' '}
              <a href="mailto:support@matnice.com" className="text-blue-600 hover:text-blue-700 font-medium">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailForm;
