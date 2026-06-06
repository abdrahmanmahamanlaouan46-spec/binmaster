import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.binmaster.app',
  appName: 'BinMaster',
  webDir: 'out',
  server: {
    // In production, remove this — it's for dev only
    // url: 'http://localhost:3000',
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0a0a0a',
      showSpinner: true,
      spinnerColor: '#22c55e',
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0a0a0a',
    },
  },
};

export default config;
