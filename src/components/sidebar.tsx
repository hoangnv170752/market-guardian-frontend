'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { NavItem } from './nav-item';
import { NavSection } from './nav-section';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentPath, setCurrentPath] = useState('');
  const [isDashboardExpanded, setIsDashboardExpanded] = useState(false);
  const [isAccountExpanded, setIsAccountExpanded] = useState(false);
  const [isDeviceExpanded, setIsDeviceExpanded] = useState(false);
  const [isCustomerExpanded, setIsCustomerExpanded] = useState(false);
  const [isNotificationExpanded, setIsNotificationExpanded] = useState(false);
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    setCurrentPath(path);

    // Auto-expand parent menus based on current path
    if (path.startsWith('/dashboard/')) {
      setIsDashboardExpanded(true);
    }
    if (path.startsWith('/device-')) {
      setIsDeviceExpanded(true);
    }
    if (path.startsWith('/customer-')) {
      setIsCustomerExpanded(true);
    }
    if (path.startsWith('/notification-')) {
      setIsNotificationExpanded(true);
    }
    if (path.startsWith('/settings/')) {
      setIsInfoExpanded(true);
    }

    const handleRouteChange = () => {
      const newPath = window.location.pathname;
      setCurrentPath(newPath);

      // Auto-expand on route change
      if (newPath.startsWith('/dashboard/')) {
        setIsDashboardExpanded(true);
      }
      if (newPath.startsWith('/device-')) {
        setIsDeviceExpanded(true);
      }
      if (newPath.startsWith('/customer-')) {
        setIsCustomerExpanded(true);
      }
      if (newPath.startsWith('/notification-')) {
        setIsNotificationExpanded(true);
      }
      if (newPath.startsWith('/settings/')) {
        setIsInfoExpanded(true);
      }
    };

    window.addEventListener('popstate', handleRouteChange);

    const handleClick = () => {
      setTimeout(() => {
        handleRouteChange();
      }, 100);
    };

    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-4 top-4 z-50 rounded-lg bg-white p-2 shadow-md hover:bg-gray-50 lg:hidden"
        >
          <Icon icon="mdi:menu" className="h-6 w-6" />
        </button>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-gray-200 bg-white transition-transform lg:static lg:z-auto lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
          <a href="/" className="cursor-pointer">
            <img
              src="/images/kangaroo.jpg"
              alt="Kangaroo"
              className="h-8 w-auto max-w-[180px] object-contain"
            />
          </a>
          <button
            onClick={() => setIsOpen(false)}
            className="ml-2 rounded-lg p-1 hover:bg-gray-100 lg:hidden"
          >
            <Icon icon="mdi:close" className="h-5 w-5" />
          </button>
        </div>

      <nav className="flex-1 space-y-6 overflow-y-auto p-4">
        <NavSection>
          <NavItem
            icon={<Icon icon="mdi:view-dashboard-outline" />}
            label="Dashboard"
            hasSubmenu
            isExpanded={isDashboardExpanded}
            active={currentPath.startsWith('/dashboard/')}
            onClick={() => setIsDashboardExpanded(!isDashboardExpanded)}
          />

          {isDashboardExpanded && (
            <div className="space-y-0.5">
              <NavItem
                icon={<span className="text-[10px] font-semibold">OV</span>}
                label="Overview"
                href="/dashboard/dashboard-overview"
                active={currentPath === '/dashboard/dashboard-overview'}
              />
              <NavItem
                icon={<span className="text-[10px] font-semibold">WM</span>}
                label="Water Map"
                href="/dashboard/dashboard-water"
                active={currentPath === '/dashboard/dashboard-water'}
              />
              <NavItem
                icon={<span className="text-[10px] font-semibold">DL</span>}
                label="Device Location"
                href="/dashboard/dashboard-device-location"
                active={currentPath === '/dashboard/dashboard-device-location'}
              />
              <NavItem
                icon={<span className="text-[10px] font-semibold">RP</span>}
                label="Report"
                href="/dashboard/dashboard-report"
                active={currentPath === '/dashboard/dashboard-report'}
              />
            </div>
          )}

          <NavItem
            icon={<Icon icon="mdi:account-circle-outline" />}
            label="Account Management"
            hasSubmenu
            isExpanded={isAccountExpanded}
            onClick={() => setIsAccountExpanded(!isAccountExpanded)}
          />

          <NavItem
            icon={<Icon icon="mdi:devices" />}
            label="Device Management"
            hasSubmenu
            isExpanded={isDeviceExpanded}
            onClick={() => setIsDeviceExpanded(!isDeviceExpanded)}
          />

          {isDeviceExpanded && (
            <div className="space-y-0.5">
              <NavItem
                icon={<span className="text-[10px] font-semibold">CT</span>}
                label="Category"
                href="/device-category"
                active={currentPath === '/device-category'}
              />
              <NavItem
                icon={<span className="text-[10px] font-semibold">DV</span>}
                label="Device List"
                href="/device-list"
                active={currentPath === '/device-list'}
              />
              <NavItem
                icon={<span className="text-[10px] font-semibold">CR</span>}
                label="Core List"
                href="/device-core"
                active={currentPath === '/device-core'}
              />
              <NavItem
                icon={<span className="text-[10px] font-semibold">FW</span>}
                label="Firmware Version"
                href="/device-firmware"
                active={currentPath === '/device-firmware'}
              />
              <NavItem
                icon={<span className="text-[10px] font-semibold">PR</span>}
                label="Product List"
                href="/device-product"
                active={currentPath === '/device-product'}
              />
            </div>
          )}

          <NavItem
            icon={<Icon icon="mdi:account-multiple-outline" />}
            label="Customer Management"
            hasSubmenu
            isExpanded={isCustomerExpanded}
            active={currentPath.startsWith('/customer')}
            onClick={() => setIsCustomerExpanded(!isCustomerExpanded)}
          />

          {isCustomerExpanded && (
            <div className="space-y-0.5">
              <NavItem
                icon={<span className="text-[10px] font-semibold">CL</span>}
                label="Customer List"
                href="/customer-list"
                active={currentPath === '/customer-list'}
              />
              <NavItem
                icon={<span className="text-[10px] font-semibold">OR</span>}
                label="Order Requests"
                href="/customer-orders"
                active={currentPath === '/customer-orders'}
              />
              <NavItem
                icon={<span className="text-[10px] font-semibold">FB</span>}
                label="Customer Feedback"
                href="/customer-feedback"
                active={currentPath === '/customer-feedback'}
              />
            </div>
          )}

          <NavItem
            icon={<Icon icon="mdi:bell-outline" />}
            label="Notification Management"
            hasSubmenu
            isExpanded={isNotificationExpanded}
            onClick={() => setIsNotificationExpanded(!isNotificationExpanded)}
          />

          {isNotificationExpanded && (
            <div className="space-y-0.5">
              <NavItem
                icon={<span className="text-[10px] font-semibold">PU</span>}
                label="Pop-Up Notifications"
                href="/notification-popup"
                active={currentPath === '/notification-popup'}
              />
              <NavItem
                icon={<span className="text-[10px] font-semibold">PN</span>}
                label="Push Notifications"
                href="/notification-push"
                active={currentPath === '/notification-push'}
              />
            </div>
          )}

          <NavItem
            icon={<Icon icon="mdi:folder-outline" />}
            label="General Settings"
            hasSubmenu
            isExpanded={isInfoExpanded}
            onClick={() => setIsInfoExpanded(!isInfoExpanded)}
          />

          {isInfoExpanded && (
            <div className="space-y-0.5">
              <NavItem
                icon={<span className="text-[10px] font-semibold">CF</span>}
                label="Configuration"
                href="/settings/config"
                active={currentPath === '/settings/config'}
              />
              <NavItem
                icon={<span className="text-[10px] font-semibold">TU</span>}
                label="Terms of Use"
                href="/settings/terms"
                active={currentPath === '/settings/terms'}
              />
              <NavItem
                icon={<span className="text-[10px] font-semibold">PV</span>}
                label="Province / City List"
                href="/settings/province-list"
                active={currentPath === '/settings/province-list'}
              />
              <NavItem
                icon={<span className="text-[10px] font-semibold">WD</span>}
                label="Ward / Commune List"
                href="/settings/ward-list"
                active={currentPath === '/settings/ward-list'}
              />
              <NavItem
                icon={<span className="text-[10px] font-semibold">SC</span>}
                label="Support Center"
                href="/settings/support"
                active={currentPath === '/settings/support'}
              />
            </div>
          )}
        </NavSection>
      </nav>

      <div className="mt-auto">
        <img
          src="/images/furniture.png"
          alt=""
          className="block w-full select-none object-contain opacity-80"
          draggable={false}
        />
      </div>
    </aside>
    </>
  );
};
