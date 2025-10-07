import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Lock, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const tokenFromUrl = useMemo(() => params.get('token') || '', [params]);
  const newPassword = watch('newPassword');

  const onSubmit = async ({ newPassword, confirmPassword }) => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      setIsLoading(true);
      await authAPI.resetPassword(tokenFromUrl, newPassword);
      toast.success('Password reset successful');
      navigate('/login');
    } catch (e) {
      toast.error(e.response?.data?.error || 'Invalid or expired reset link');
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
        <h1 className="text-2xl font-bold text-white mb-2">Create New Password</h1>
        <p className="text-dark-300 mb-6">Enter and confirm your new password.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-dark-400" />
            </div>
            <input
              type="password"
              className={`input-field pl-10 ${errors.newPassword ? 'border-red-500' : ''}`}
              placeholder="New password"
              {...register('newPassword', { required: 'New password is required', minLength: { value: 8, message: 'At least 8 characters' } })}
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Check className="h-5 w-5 text-dark-400" />
            </div>
            <input
              type="password"
              className={`input-field pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
              placeholder="Confirm new password"
              {...register('confirmPassword', { required: 'Confirm your password' })}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary flex items-center justify-center"
          >
            {isLoading ? <div className="loading-spinner h-5 w-5" /> : 'Reset Password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;



