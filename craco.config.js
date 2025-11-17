const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/features': path.resolve(__dirname, 'src/features'),
      '@/shared': path.resolve(__dirname, 'src/shared'),
      '@/services': path.resolve(__dirname, 'src/services'),
      '@/app': path.resolve(__dirname, 'src/app'),
    },
  },
};

