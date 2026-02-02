'use client';

import { useState, useEffect } from 'react';
import { Link } from 'waku';

export default function LandingPage() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      setIsDark(saved === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 ${isDark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      <title>Market Guardian - Understand Markets. Stay Calm.</title>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b transition-colors duration-300 ${isDark ? 'bg-gray-950/80 border-gray-800' : 'bg-white/80 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/images/logo-mg.png"
              alt="Market Guardian"
              className="h-10 w-auto"
            />
            <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Market Guardian</span>
          </Link>
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <Link
              to="/sign-in"
              className={`transition-colors ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Sign In
            </Link>
            <Link
              to="/sign-up"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Understand Markets.{' '}
            <span className="text-green-500">Stay Calm.</span>
          </h1>
          <p className={`text-xl mb-10 max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Market Guardian translates complex market conditions into clear, human language.
            No predictions. No advice. Just clarity.
          </p>
          <Link
            to="/sign-in"
            className="inline-block bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-4 rounded-lg font-semibold transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-16 px-6 transition-colors duration-300 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
        <div className="max-w-5xl mx-auto">
          <h2 className={`text-2xl font-bold text-center mb-12 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Why This Matters
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-green-500 mb-2">73%</div>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>of retail investors make emotional decisions</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-green-500 mb-2">45%</div>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>leave platforms after their first loss</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-green-500 mb-2">2.3x</div>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>longer retention with clear communication</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className={`text-center mb-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Three simple steps to market clarity</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className={`rounded-xl p-8 border transition-colors duration-300 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-Time Data</h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Monitors market movements, volatility, and trends continuously.</p>
            </div>
            <div className={`rounded-xl p-8 border transition-colors duration-300 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Analysis</h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Interprets data without hype, fear, or bias.</p>
            </div>
            <div className={`rounded-xl p-8 border transition-colors duration-300 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Clear Explanation</h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Provides calm, structured insights to help you understand – not act impulsively.</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Platforms & Users */}
      <section className={`py-20 px-6 transition-colors duration-300 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className={`rounded-xl p-8 border transition-colors duration-300 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">For Platforms</h3>
              <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Stop losing users to confusion. When markets move fast, your users panic and leave.
                Market Guardian keeps them informed and engaged.
              </p>
            </div>
            <div className={`rounded-xl p-8 border transition-colors duration-300 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">For Users</h3>
              <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                No more anxiety watching charts you don't understand. Get calm, clear explanations
                of what's happening and why.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to understand the markets?
          </h2>
          <p className={`mb-8 text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Join Market Guardian and experience clarity in market movements.
          </p>
          <Link
            to="/sign-in"
            className="inline-block bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-4 rounded-lg font-semibold transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 px-6 border-t transition-colors duration-300 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo-mg.png"
              alt="Market Guardian"
              className="h-8 w-auto"
            />
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Market Guardian</span>
          </div>
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            © 2026 Market Guardian. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
