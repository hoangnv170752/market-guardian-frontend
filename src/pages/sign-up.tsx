import { SignUpForm } from '../components/sign-up-form';

export default async function SignUpPage() {
  const data = await getData();

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <title>{data.title}</title>
      
      <div className="grid w-full max-w-6xl grid-cols-1 gap-12 px-6 lg:grid-cols-2 lg:gap-24">
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Start with Market Guardian
            </h1>
            <p className="mt-2 text-gray-600">
              Create new account and start managing your workflow.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center">
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
    title: 'Sign Up - Kangaroo Portal',
  };

  return data;
};

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
