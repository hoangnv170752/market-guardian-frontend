'use client';

import { useEffect, useState } from 'react';
import { getAuthUser, clearAuthData, isAuthenticated } from '../utils/auth';
import { User } from '../services/api';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/sign-in';
      return;
    }

    const userData = getAuthUser();
    setUser(userData);
    setLoading(false);
  }, []);

  const handleSignOut = () => {
    clearAuthData();
    window.location.href = '/sign-in';
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100">
      <title>Market Guardian</title>
      
      <main className="flex flex-1 items-center justify-center overflow-y-auto px-12">
        <div className="flex flex-col items-center justify-center gap-6 rounded-lg bg-white p-8 shadow-lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">User Information</h1>
            <div className="mt-4 space-y-2 text-left">
              <p className="text-gray-700"><span className="font-semibold">Name:</span> {user?.name || 'N/A'}</p>
              <p className="text-gray-700"><span className="font-semibold">Email:</span> {user?.email || 'N/A'}</p>
              <p className="text-gray-700"><span className="font-semibold">Role:</span> {user?.role || 'N/A'}</p>
              <p className="text-gray-700"><span className="font-semibold">Status:</span> {user?.status || 'N/A'}</p>
              <p className="text-gray-700"><span className="font-semibold">Verified:</span> {user?.isVerified ? 'Yes' : 'No'}</p>
            </div>
          </div>
          
          <button
            onClick={handleSignOut}
            className="rounded-md bg-red-600 px-6 py-2 text-white font-semibold hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}
