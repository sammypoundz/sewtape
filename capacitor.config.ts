import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pit.sewtape',
  appName: 'SewTape',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 300,          // milliseconds – adjust as needed
      launchAutoHide: true,
      backgroundColor: "#111827",        // your dark background color (gray-900)
      androidSplashResourceName: "splash", // we'll create a simple solid color drawable
      androidScaleType: "CENTER_CROP",
      showSpinner: false,                 // no spinner
      splashFullScreen: true,
      splashImmersive: false
    }
  }
};

export default config;