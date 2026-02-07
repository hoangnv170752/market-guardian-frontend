import { SignInForm } from '../components/sign-in-form';

export default async function SignInPage() {
  const data = await getData();

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/stock-image.png)' }}>
      <title>{data.title}</title>
      
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="relative z-10 grid h-screen w-full grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center px-12 lg:px-24">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Welcome back to<br />Market Guardian
            </h1>
            <p className="mt-2 text-gray-200">
              Market Guardian - The best market analysis tool.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-white px-8 py-12 lg:px-16">
          <div className="w-full max-w-md space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/sign-up" className="font-medium text-primary-main hover:underline">
                  Sign up
                </a>
              </p>
            </div>

            <SignInForm />

            {/* Powered by Deriv */}
            <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-500">Powered by</span>
              <img src="/images/deriv.png" alt="Deriv" className="h-10 w-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const getData = async () => {
  const data = {
    title: 'Sign In - Market Guardian',
  };

  return data;
};

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
