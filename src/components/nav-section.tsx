import { ReactNode } from 'react';

interface NavSectionProps {
  title?: string;
  children: ReactNode;
}

export const NavSection = ({ title, children }: NavSectionProps) => {
  return (
    <div className="space-y-1">
      {title && (
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          {title}
        </div>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
};
