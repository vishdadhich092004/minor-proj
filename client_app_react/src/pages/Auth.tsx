import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import type { User, ApiResponse } from '../types';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Loader2, User as UserIcon, Mail, Lock } from 'lucide-react';

// Validation Schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z
  .object({
    username: z.string().min(2, 'Username is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
    reset: resetLogin
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: signupErrors },
    reset: resetSignup
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    resetLogin();
    resetSignup();
  };

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        email: data.email.toLowerCase(),
        password: data.password,
      };
      const response = await api.post<ApiResponse<User>>('/users/login', payload);
      
      if (response.data.success && response.data.data) {
        login(response.data.data);
        navigate('/');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const onSignupSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(null);
    try {
       const payload = {
        name: data.username.trim(),
        email: data.email.toLowerCase(),
        password: data.password,
      };
      
      const response = await api.post<ApiResponse<null>>('/users/register', payload);

      if (response.data.success) {
        // Auto login after signup or switch to login
         const loginPayload = {
            email: data.email.toLowerCase(),
            password: data.password,
        };
        const loginResponse = await api.post<ApiResponse<User>>('/users/login', loginPayload);
         if (loginResponse.data.success && loginResponse.data.data) {
            login(loginResponse.data.data);
            navigate('/');
         } else {
             // Fallback to login screen if auto-login fails but signup succeeded
             setIsLogin(true);
             setError('Registration successful. Please login.');
         }
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo Placeholder */}
        <div className="flex justify-center mb-8">
           <div className="text-4xl font-bold text-primary tracking-tighter">
             {/* Replace with actual logo image later */}
             LOGO
           </div>
        </div>

        <h2 className="text-3xl font-bold text-secondary text-center mb-2">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-gray-600 text-center mb-8">
          {isLogin ? 'Sign in to your account' : 'Sign up to get started'}
        </p>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {isLogin ? (
            <form onSubmit={handleSubmitLogin(onLoginSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    {...registerLogin('email')}
                    type="email"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50"
                    placeholder="Enter your email"
                  />
                </div>
                {loginErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{loginErrors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    {...registerLogin('password')}
                    type="password"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50"
                    placeholder="Enter your password"
                  />
                </div>
                {loginErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{loginErrors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors mt-6 flex items-center justify-center"
              >
                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'LOGIN'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmitSignup(onSignupSubmit)} className="space-y-4">
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    {...registerSignup('username')}
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50"
                    placeholder="Enter your username"
                  />
                </div>
                {signupErrors.username && (
                  <p className="text-red-500 text-xs mt-1">{signupErrors.username.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    {...registerSignup('email')}
                    type="email"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50"
                    placeholder="Enter your email"
                  />
                </div>
                {signupErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{signupErrors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    {...registerSignup('password')}
                    type="password"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50"
                    placeholder="Enter your password"
                  />
                </div>
                {signupErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{signupErrors.password.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    {...registerSignup('confirmPassword')}
                    type="password"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50"
                    placeholder="Confirm your password"
                  />
                </div>
                {signupErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{signupErrors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors mt-6 flex items-center justify-center"
              >
                 {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'SIGN UP'}
              </button>
            </form>
          )}

          <div className="mt-6 flex items-center justify-center space-x-2 text-sm">
             <span className="text-gray-600">
               {isLogin ? "Don't have an account?" : "Already have an account?"}
             </span>
             <button
               onClick={toggleAuthMode}
               className="text-primary font-bold hover:underline"
              >
                {isLogin ? 'SIGN UP' : 'LOGIN'}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
