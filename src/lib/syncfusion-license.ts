import SyncfusionBase from '@syncfusion/ej2-base';

export const initializeSyncfusionLicense = () => {
  const apiKey = process.env.TRADING_CHART_API_KEY;
  
  if (apiKey && SyncfusionBase && typeof SyncfusionBase.registerLicense === 'function') {
    SyncfusionBase.registerLicense(apiKey);
  } else if (apiKey) {
    console.warn('Syncfusion registerLicense function not available');
  } else {
    console.warn('Syncfusion license key not found in environment variables');
  }
};
