'use client';

import { useState, FormEvent } from 'react';
import { Input } from './input';
import { Button } from './button';
import { loginApi } from '../services/api';
import { saveAuthData } from '../utils/auth';

export const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await loginApi({ email, password });

      if (data.success && data.data) {
        saveAuthData(email, password, data.data.token, data.data.user);
        window.location.href = '/';
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err: any) {

      console.log(err.message)
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="space-y-4">
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

        <div className="flex justify-end">
          <a
            href="/forgot-password"
            className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
          >
            Forgot password?
          </a>
        </div>
      </div>

      <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
};
