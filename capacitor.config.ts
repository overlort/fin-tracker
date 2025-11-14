import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.fintracker',
  appName: 'fin-tracker',
  webDir: 'build',
  server: {
    iosScheme: 'https'
  }
};

export default config;
