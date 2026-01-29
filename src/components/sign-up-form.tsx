'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Input } from './input';
import { Button } from './button';
import { signUpApi, verifyEmailApi } from '../services/api';

export const SignUpForm = () => {
  const [step, setStep] = useState<'signup' | 'otp'>('signup');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    if (step === 'otp' && timeLeft > 0) {
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

  const handleSignUpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await signUpApi({
        name,
        email,
        password,
        confirmPassword,
      });

      if (response.success) {
        setStep('otp');
        setTimeLeft(120);
      } else {
        setError(response.message || 'Sign up failed. Please try again.');
      }
    } catch (err: any) {
      console.log(err.message);
      setError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await verifyEmailApi({ code: otp });
      
      if (response.success) {
        window.location.href = '/sign-in';
      } else {
        setError(response.message || 'OTP verification failed. Please try again.');
      }
    } catch (err: any) {
      console.log(err.message);
      setError(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setTimeLeft(120);
    console.log('Resending OTP to:', email);
  };

  if (step === 'otp') {
    return (
      <div className="w-full space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Enter OTP Code</h3>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a verification code to <strong>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleOtpSubmit} className="space-y-6">
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
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            disabled={isLoading || otp.length !== 6 || timeLeft === 0}
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </Button>

          <button
            type="button"
            onClick={() => setStep('signup')}
            className="w-full text-sm text-gray-600 hover:text-gray-900 hover:underline"
          >
            Back to sign up
          </button>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={handleSignUpSubmit} className="w-full space-y-6">
      <div className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <Input
          type="text"
          label="Full name"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          type="email"
          label="Email address"
          placeholder="demo@minimals.cc"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            label="Confirm Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
      </div>

      <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
};
