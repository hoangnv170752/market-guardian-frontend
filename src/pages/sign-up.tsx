import { SignUpForm } from '../components/sign-up-form';

export default async function SignUpPage() {
  const data = await getData();

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/stock-image.png)' }}>
      <title>{data.title}</title>
      
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="relative z-10 grid h-screen w-full grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center px-12 lg:px-24">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Start with Market Guardian
            </h1>
            <p className="mt-2 text-gray-200">
              Create new account and start managing your workflow.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-white px-8 py-12 lg:px-16">
          <div className="w-full max-w-md space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/sign-in" className="font-medium text-primary-main hover:underline">
                  Sign in
                </a>
              </p>
            </div>

            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
}

const getData = async () => {
  const data = {
    title: 'Sign Up - Market Guardian',
  };

  return data;
};

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
