'use client';

import { ReactNode } from 'react';
import { Link } from 'waku';

interface NavItemProps {
  icon: ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  hasSubmenu?: boolean;
  isExpanded?: boolean;
  onClick?: () => void;
}

export const NavItem = ({
  icon,
  label,
  href,
  active = false,
  hasSubmenu = false,
  isExpanded = false,
  onClick,
}: NavItemProps) => {
  const baseClasses =
    'flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors';
  const activeClasses = active
    ? 'bg-[#4A7C59] text-white rounded-r-xl border-l-4 border-[#2D5F3D]'
    : 'text-gray-700 hover:bg-[#E8F5E9] hover:text-gray-900';

  const content = (
    <>
      <span className="flex h-6 w-6 items-center justify-center text-lg">
        {icon}
      </span>
      <span className="flex-1">{label}</span>
      {hasSubmenu && (
        <span className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 12L10 8L6 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </>
  );

  if (href) {
    const validRoutes = ['/', '/about'];
    const isValidRoute = validRoutes.includes(href);

    if (isValidRoute) {
      return (
        <Link
          to={href as '/' | '/about'}
          className={`${baseClasses} ${activeClasses}`}
        >
          {content}
        </Link>
      );
    }

    return (
      <a href={href} className={`${baseClasses} ${activeClasses}`}>
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${activeClasses} w-full text-left`}
    >
      {content}
    </button>
  );
};
