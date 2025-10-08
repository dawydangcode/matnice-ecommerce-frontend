import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../stores/auth.store';
import { loginSchema, LoginFormData } from '../../utils/validation.schemas';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onSubmit'
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError();
      await login(data.username, data.password);
      
      toast.success('Login successful!');
      reset();
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Get user info after login to determine redirect
        const { user } = useAuthStore.getState();
        
        // Redirect based on user role
        if (user?.role?.name === 'admin' || user?.role?.type === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');  // Redirect users to HomePage instead of dashboard
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    }
  };

  return (
    <div className="w-full pt-8 pb-16 md:pt-8 md:pb-16">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-8 p-6">
        {/* Header */}
        <div className="text-center mb-8">  
          <h2 className="text-3xl md:text-3xl text-2xl font-thin text-gray-900 mb-2">Welcome to MatNice</h2>
          <p className="text-gray-600 text-sm md:text-base">Log in with your email address or user name.</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username Field */}
          <div className="relative">
            <input
              {...register('username')}
              type="text"
              id="username"
              className={`w-full px-4 py-4 border-2 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 text-lg peer placeholder-transparent ${
                errors.username ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
              }`}
              placeholder="Username"
              disabled={isLoading}
            />
            <label
              htmlFor="username"
              className={`absolute left-4 -top-2.5 bg-white px-2 text-sm transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm ${
                errors.username 
                  ? 'text-red-600 peer-focus:text-red-600' 
                  : 'text-gray-600 peer-focus:text-blue-600'
              }`}
            >
              Email/Username
            </label>
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={`w-full px-4 py-4 border-2 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 pr-12 text-lg peer placeholder-transparent ${
                  errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'
                }`}
                placeholder="Password"
                disabled={isLoading}
              />
              <label
                htmlFor="password"
                className={`absolute left-4 -top-2.5 bg-white px-2 text-sm transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm ${
                  errors.password 
                    ? 'text-red-600 peer-focus:text-red-600' 
                    : 'text-gray-600 peer-focus:text-blue-600'
                }`}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-black focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
