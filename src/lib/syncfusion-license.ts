import { registerLicense } from '@syncfusion/ej2-base';

export const initializeSyncfusionLicense = () => {
  const apiKey = process.env.TRADING_CHART_API_KEY;

  if (apiKey) {
    registerLicense(apiKey);
  }
};
