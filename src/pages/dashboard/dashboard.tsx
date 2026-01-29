export default async function DashboardPage() {
  return (
    <div>
      <meta httpEquiv="refresh" content="0; url=/dashboard-water" />
      <a href="/dashboard-water">Go to dashboard</a>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
