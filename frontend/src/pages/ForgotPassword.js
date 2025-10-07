import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async ({ email }) => {
    try {
      setIsLoading(true);
      const res = await authAPI.forgotPassword(email);
      toast.success('Password reset link sent to your email');
      // Dev flow: if backend returns a mock resetToken, navigate with it
      const token = res.data?.resetToken;
      if (token) navigate(`/reset-password?token=${encodeURIComponent(token)}`);
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md card"
      >
        <h1 className="text-2xl font-bold text-white mb-2">Forgot Password</h1>
        <p className="text-dark-300 mb-6">Enter your email to receive a password reset link.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-dark-400" />
            </div>
            <input
              type="email"
              className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Email address"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary flex items-center justify-center"
          >
            {isLoading ? <div className="loading-spinner h-5 w-5" /> : <><Send className="w-4 h-4 mr-2" />Send Reset Link</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;



