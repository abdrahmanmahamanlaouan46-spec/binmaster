import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.binmaster.app',
  appName: 'BinMaster',
  webDir: 'out',
  server: {
    // IMPORTANT: After deploying to Vercel, replace with your Vercel URL:
    // url: 'https://binmaster-xxxx.vercel.app',
    // Then uncomment the line above for the Capacitor build.
    // For local dev, keep it commented out.
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
