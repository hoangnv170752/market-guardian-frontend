'use client';

import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';

interface TopBarProps {
  breadcrumb?: string;
}

export const TopBar = ({ breadcrumb }: TopBarProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('');

  useEffect(() => {
    setCurrentRoute(window.location.pathname);
  }, []);

  const getRouteLabel = (path: string) => {
    const routeMap: Record<string, string> = {
      '/dashboard/dashboard-water': 'Water Map',
      '/dashboard/dashboard-report': 'Report',
      '/dashboard/dashboard-overview': 'Overview',
      '/dashboard/dashboard-device-location': 'Device Location',
      '/report/report-create': 'Create New',
      '/': 'Home',
    };
    return routeMap[path] || 'Dashboard';
  };

  const displayBreadcrumb = breadcrumb || getRouteLabel(currentRoute);

  const handleLogout = () => {
    console.log('Logout clicked');
    window.location.href = '/sign-in';
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
      <div className="flex items-center gap-3">
        <button
          onClick={handleBack}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <Icon icon="mdi:chevron-left" className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-[#5CB85C]">Dashboard</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700">{displayBreadcrumb}</span>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50"
        >
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-900">DUC DAI</div>
            <div className="text-xs text-gray-500">admin</div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
            <Icon icon="mdi:account" className="h-6 w-6 text-gray-600" />
          </div>
          <Icon icon="mdi:chevron-down" className="h-5 w-5 text-gray-600" />
        </button>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              <Icon icon="mdi:logout" className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
