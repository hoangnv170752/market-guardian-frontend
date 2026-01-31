'use client';

import { useState, FormEvent } from 'react';
import { Input } from './input';
import { Button } from './button';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('https://market-guardian-be.onrender.com/api/user/contact-us', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          description,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setUsername('');
        setEmail('');
        setDescription('');
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2000);
      } else {
        setError('Failed to send message. Please try again.');
      }
    } catch (err: any) {
      console.log(err.message);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="mb-4 text-2xl font-bold text-gray-900">Contact Us</h2>
        <p className="mb-6 text-sm text-gray-600">
          Send us a message and we'll get back to you as soon as possible.
        </p>

        {success ? (
          <div className="rounded-lg bg-green-50 p-4 text-center">
            <div className="mb-2 text-4xl">✅</div>
            <p className="font-semibold text-green-900">Message sent successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Input
              type="text"
              label="Username"
              placeholder="John Doe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <Input
              type="email"
              label="Email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-main focus:outline-none focus:ring-2 focus:ring-primary-main/20"
                rows={4}
                placeholder="I have a question about your service"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
