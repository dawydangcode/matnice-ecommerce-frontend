import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, CheckCircle, Clock, ArrowRight, RefreshCw } from 'lucide-react';

const RegistrationSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState<string>('');
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    // Get email from navigation state
    const state = location.state as { email?: string };
    if (state?.email) {
      setEmail(state.email);
    } else {
      // If no email, redirect to register
      navigate('/register');
    }
  }, [location, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendEmail = () => {
    // TODO: Call resend verification email API
    console.log('Resending verification email to:', email);
    setCountdown(60); // Reset countdown
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with Icon */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-center">
            <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 animate-bounce">
              <Mail className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Check Your Email! 📧
            </h1>
            <p className="text-blue-100 text-lg">
              We've sent a verification link to your email address
            </p>
          </div>

          {/* Body Content */}
          <div className="px-8 py-10">
            {/* Email Display */}
            <div className="mb-8 text-center">
              <p className="text-gray-600 mb-3">Verification email sent to:</p>
              <div className="inline-flex items-center bg-blue-50 border-2 border-blue-200 rounded-lg px-6 py-3">
                <Mail className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-lg font-semibold text-blue-900">{email}</span>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-6 mb-8">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-6">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-900 mb-2">
                      What's Next?
                    </h3>
                    <ol className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="font-semibold mr-2">1.</span>
                        <span>Open your email inbox and look for an email from <strong>Mat Nice Store</strong></span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-semibold mr-2">2.</span>
                        <span>Click the <strong>"Verify Email Address"</strong> button in the email</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-semibold mr-2">3.</span>
                        <span>You'll be redirected back to login after verification</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6">
                <div className="flex items-start">
                  <Clock className="w-6 h-6 text-yellow-600 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                      Important Notes
                    </h3>
                    <ul className="space-y-2 text-gray-700 list-disc list-inside">
                      <li>The verification link will expire in <strong>15 minutes</strong></li>
                      <li>If you don't see the email, check your <strong>spam folder</strong></li>
                      <li>Make sure to verify your email before trying to log in</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Resend Email Section */}
            <div className="border-t border-gray-200 pt-8 mb-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Didn't receive the email?
                </p>
                {countdown > 0 ? (
                  <div className="text-gray-500">
                    <Clock className="w-5 h-5 inline mr-2" />
                    You can resend in <span className="font-semibold text-blue-600">{formatTime(countdown)}</span>
                  </div>
                ) : (
                  <button
                    onClick={handleResendEmail}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Resend Verification Email
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                <span>Go to Login Page</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Back to Home
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>
                Need help?{' '}
                <a href="mailto:support@matnice.com" className="text-blue-600 hover:text-blue-700 font-medium">
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Tips Card */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">💡</span>
            Quick Tips
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Check spam/junk folder if you don't see the email</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Add our email to your contacts to avoid spam</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>The verification link is only valid for 15 minutes</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>You can request a new link if it expires</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccessPage;
