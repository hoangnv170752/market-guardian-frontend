import '../styles.css';

import type { ReactNode } from 'react';
import { FloatingContactButton } from '../components/floating-contact-button';
import { initializeSyncfusionLicense } from '../lib/syncfusion-license';

type RootLayoutProps = { children: ReactNode };

export default async function RootLayout({ children }: RootLayoutProps) {
  initializeSyncfusionLicense();
  
  const data = await getData();

  return (
    <div className="font-['Nunito']" suppressHydrationWarning>
      <meta name="description" content={data.description} />
      <link rel="icon" type="image/png" href={data.icon} />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,700;1,400;1,700&display=swap"
        precedence="font"
      />
      {/* <Header /> */}
      <main>
        {children}
      </main>
      {/* <Footer /> */}
      <FloatingContactButton />
    </div>
  );
}

const getData = async () => {
  const data = {
    description: 'Market Guardian',
    icon: '/images/favicon.png',
  };

  return data;
};

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
