'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Input } from './input';
import { Button } from './button';
import { forgotPasswordApi, resetPasswordApi } from '../services/api';

export const ForgotPasswordForm = () => {
  const [step, setStep] = useState<'email' | 'reset' | 'success'>('email');
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    if (step === 'reset' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await forgotPasswordApi({ email });

      if (response.success) {
        setStep('reset');
        setTimeLeft(120);
      } else {
        setError(response.message || 'Failed to send reset email. Please try again.');
      }
    } catch (err: any) {
      console.log(err.message);
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await resetPasswordApi({
        code: otp,
        newPassword,
      });

      if (response.success) {
        setStep('success');
      } else {
        setError(response.message || 'Failed to reset password. Please try again.');
      }
    } catch (err: any) {
      console.log(err.message);
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setIsLoading(true);

    try {
      const response = await forgotPasswordApi({ email });
      if (response.success) {
        setTimeLeft(120);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="w-full space-y-6">
        <div className="rounded-lg bg-green-50 p-4 text-center">
          <div className="mb-2 text-4xl">✅</div>
          <h3 className="text-lg font-semibold text-green-900">Password reset successful</h3>
          <p className="mt-2 text-sm text-green-700">
            Your password has been successfully reset. You can now sign in with your new password.
          </p>
          <a
            href="/sign-in"
            className="mt-4 inline-block text-sm font-medium text-primary-main hover:underline"
          >
            Go to sign in
          </a>
        </div>
      </div>
    );
  }

  if (step === 'reset') {
    return (
      <div className="w-full space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Reset your password</h3>
          <p className="mt-2 text-sm text-gray-600">
            Enter the OTP code sent to <strong>{email}</strong> and your new password.
          </p>
        </div>

        <form onSubmit={handleResetSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Input
              type="text"
              label="OTP Code"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              required
              className="text-center text-2xl tracking-widest"
            />
            
            <div className="flex items-center justify-between text-sm">
              <span className={`font-semibold ${timeLeft <= 30 ? 'text-red-600' : 'text-gray-700'}`}>
                Time remaining: {formatTime(timeLeft)}
              </span>
              {timeLeft === 0 && (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-primary-main hover:underline"
                  disabled={isLoading}
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              label="New Password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              label="Confirm New Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            disabled={isLoading || otp.length !== 6 || timeLeft === 0}
          >
            {isLoading ? 'Resetting password...' : 'Reset password'}
          </Button>

          <button
            type="button"
            onClick={() => setStep('email')}
            className="w-full text-sm text-gray-600 hover:text-gray-900 hover:underline"
          >
            Back to email input
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <form onSubmit={handleEmailSubmit} className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Forgot your password?</h3>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a code to reset your password.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <Input
          type="email"
          label="Email address"
          placeholder="demo@minimals.cc"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send reset code'}
        </Button>

        <div className="text-center">
          <a
            href="/sign-in"
            className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
          >
            Back to sign in
          </a>
        </div>
      </form>
    </div>
  );
};
