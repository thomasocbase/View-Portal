import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'Micro Portal',
  webDir: 'dist',
  server: {
    cleartext: true,
    androidScheme: 'https',
  }
};

export default config;
