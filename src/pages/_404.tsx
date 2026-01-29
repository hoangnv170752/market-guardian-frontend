import { Sidebar } from '../components/sidebar';
import { TopBar } from '../components/top-bar';

export default async function NotFoundPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50" suppressHydrationWarning>
      <title>404 - Page Not Found</title>

      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar breadcrumb="404" />

        <main className="flex flex-1 items-center justify-center overflow-y-auto p-8">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900">404</h1>
            <p className="mt-4 text-xl text-gray-600">Page not found</p>
            <p className="mt-2 text-sm text-gray-500">
              The page you are looking for does not exist or has been removed.
            </p>
            <a
              href="/"
              className="mt-6 inline-block rounded-lg bg-[#5CB85C] px-6 py-3 text-sm font-medium text-white hover:bg-[#4CAF50]"
            >
              Go to homepage
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
