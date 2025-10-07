import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const SuperAdminConfirm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const [emailInput, setEmailInput] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const initialCode = searchParams.get('code') || '';
    const initialEmail = searchParams.get('email') || '';
    if (initialCode) setCodeInput(initialCode);
    if (initialEmail) setEmailInput(initialEmail);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailInput || !codeInput) {
      toast.error('Please enter your email and the nomination code');
      return;
    }
    try {
      setIsSubmitting(true);
      const { data } = await adminAPI.verifySuperadmin({ email: emailInput, code: codeInput });
      if (data?.user) {
        updateUser({ role: data.user.role });
      }
      toast.success('Role upgraded to Super Admin');
      navigate('/admin');
    } catch (error) {
      const msg = error.response?.data?.error || 'Invalid or expired code';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md card">
        <h1 className="text-2xl font-bold text-white mb-2">Superadmin Nomination Confirmation Form</h1>
        <p className="text-dark-300 mb-6">Enter your email and the 6-digit code sent to you.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value.trim())}
            className="input-field"
          />
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="Enter 6-digit code"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value.trim())}
            className="input-field text-center tracking-widest text-xl"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full flex items-center justify-center"
          >
            {isSubmitting ? <LoadingSpinner size="sm" /> : 'Confirm Promotion'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SuperAdminConfirm;


