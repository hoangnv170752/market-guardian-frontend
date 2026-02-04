export const initializeSyncfusionLicense = () => {
  const apiKey = process.env.TRADING_CHART_API_KEY;

  if (apiKey && typeof window !== 'undefined') {
    // Dynamic import to avoid SSR issues
    import('@syncfusion/ej2-base').then((module) => {
      if (module.registerLicense) {
        module.registerLicense(apiKey);
      }
    }).catch((err) => {
      console.warn('Failed to load Syncfusion license:', err);
    });
  }
};
