import DashboardClient from './dashboard.client';

export default function DashboardPage() {
  return <DashboardClient />;
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
