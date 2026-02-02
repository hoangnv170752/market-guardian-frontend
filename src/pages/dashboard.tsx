'use client';

import { useEffect, useState } from 'react';
import { getAuthUser, clearAuthData, isAuthenticated } from '../utils/auth';
import { User } from '../services/api';
import { TradingChart } from '../components/trading-chart';
import { AIRiskModal } from '../components/ai-risk-modal';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVolatile, setIsVolatile] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [showExtraInfo, setShowExtraInfo] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/sign-in';
      return;
    }

    const userData = getAuthUser();
    setUser(userData);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Auto-trigger risk modal when volatility is high
    if (isVolatile) {
      const timer = setTimeout(() => {
        setShowRiskModal(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVolatile]);

  const handleSignOut = () => {
    clearAuthData();
    window.location.href = '/sign-in';
  };

  const handleSimulateVolatility = () => {
    setIsVolatile(true);
  };

  const handleBuy = () => {
    alert('Buy order simulated');
  };

  const handleSell = () => {
    alert('Sell order simulated');
  };

  const handleCancel = () => {
    setIsVolatile(false);
    setShowRiskModal(false);
    setShowExtraInfo(false);
  };

  const handleExplainMore = () => {
    setShowExtraInfo(true);
  };

  const handleCloseModal = () => {
    setShowRiskModal(false);
    setShowExtraInfo(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      <title>Market Guardian - Trading Dashboard</title>
      
      {/* Sidebar - Hidden on mobile */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-8 flex items-center gap-3">
          <img src="/images/logo-mg.png" alt="Market Guardian" className="h-10 w-10" />
          <span className="text-xl font-bold text-gray-900">Market Guardian</span>
        </div>

        <nav className="flex-1 space-y-2">
          <button className="flex w-full items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-left text-blue-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </button>
        </nav>

        <div className="space-y-4 border-t border-gray-200 pt-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="truncate text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-gray-600 hover:bg-gray-50 hover:text-red-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 sm:px-8 py-4 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Trading Dashboard</h1>
            <p className="text-xs sm:text-sm text-gray-600">Real-time market analysis with AI protection</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-50 px-3 sm:px-4 py-2">
              <span className="text-xs text-gray-600">Balance</span>
              <p className="text-base sm:text-lg font-bold text-gray-900">$10,000.00</p>
            </div>
            <button
              onClick={handleSignOut}
              className="lg:hidden flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-red-600"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </header>

        {/* Trading Area */}
        <div className="flex flex-1 flex-col lg:flex-row gap-4 lg:gap-6 overflow-y-auto lg:overflow-hidden p-4 sm:p-6 lg:p-8">
          {/* Chart Section */}
          <div className="flex flex-1 flex-col rounded-xl bg-white p-4 sm:p-6 shadow-sm border border-gray-200 min-h-[400px]">
            <TradingChart isVolatile={isVolatile} />
          </div>

          {/* Action Panel */}
          <div className="w-full lg:w-80 space-y-4 lg:space-y-6">
            {/* Trading Actions */}
            <div className="rounded-xl bg-white p-4 sm:p-6 shadow-sm border border-gray-200">
              <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-bold text-gray-900">Quick Actions</h3>
              <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 sm:gap-3">
                <button
                  onClick={handleBuy}
                  className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition-colors hover:bg-green-700"
                >
                  Buy
                </button>
                <button
                  onClick={handleSell}
                  className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white transition-colors hover:bg-red-700"
                >
                  Sell
                </button>
                <button
                  onClick={handleCancel}
                  className="w-full rounded-lg border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Simulate Volatility */}
            <div className="rounded-xl bg-white p-4 sm:p-6 shadow-sm border border-gray-200">
              <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-bold text-gray-900">Demo Controls</h3>
              <button
                onClick={handleSimulateVolatility}
                disabled={isVolatile}
                className="w-full rounded-lg bg-yellow-500 py-3 font-semibold text-white transition-colors hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVolatile ? 'Volatility Active' : 'Simulate Volatility'}
              </button>
              <p className="mt-2 text-xs text-gray-600 hidden sm:block">
                Trigger market volatility to see AI risk detection in action
              </p>
            </div>

            {/* Market Info */}
            <div className="rounded-xl bg-white p-4 sm:p-6 shadow-sm border border-gray-200">
              <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-bold text-gray-900">Market Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Volatility</span>
                  <span className={`text-sm font-semibold ${isVolatile ? 'text-red-600' : 'text-green-600'}`}>
                    {isVolatile ? 'High' : 'Normal'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Trend</span>
                  <span className="text-sm font-semibold text-gray-900">Bearish</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">AI Protection</span>
                  <span className="text-sm font-semibold text-blue-600">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* AI Risk Modal */}
      <AIRiskModal
        isOpen={showRiskModal}
        onClose={handleCloseModal}
        onExplainMore={handleExplainMore}
        showExtraInfo={showExtraInfo}
      />
    </div>
  );
}
