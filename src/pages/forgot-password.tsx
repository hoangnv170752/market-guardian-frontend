import { ForgotPasswordForm } from '../components/forgot-password-form';

export default async function ForgotPasswordPage() {
  const data = await getData();

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <title>{data.title}</title>
      
      <div className="grid w-full max-w-6xl grid-cols-1 gap-12 px-6 lg:grid-cols-2 lg:gap-24">
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Reset your password
            </h1>
            <p className="mt-2 text-gray-600">
              Don't worry, it happens to the best of us.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="w-full max-w-md">
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}

const getData = async () => {
  const data = {
    title: 'Forgot Password - Market Guardian',
  };

  return data;
};

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
