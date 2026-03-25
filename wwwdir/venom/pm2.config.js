/**
 * PM2 Ecosystem Configuration
 * 
 * Development: pm2 start pm2.config.js --only backend-dev,frontend-dev
 * Production:  pm2 start pm2.config.js --only backend-prod
 * 
 * Frontend production is served via nginx static files or vite preview
 * 
 * NOTE: Update WHMCS_IDENTIFIER and WHMCS_SECRET with actual API credentials
 * from WHMCS Admin → Apps & Integrations → API Credentials
 */

const path = require('path');

// Base environment for all apps
const baseEnv = {
  JWT_SECRET: '33278c82eef730bc2d1e75ac3872ced4bd009d59',
  JWT_EXPIRES_IN: '7d',
  WHMCS_URL: 'https://venom-codes.test',
  // WHMCS API Credentials (from Admin → Apps & Integrations)
  WHMCS_IDENTIFIER: 'AlfIbfhXgDQ2blrcn6HFEKqCJ1t4ZKng',
  WHMCS_SECRET: 'TH4qpxKH5w39LVLf1a2dS09KcttywTDR',
};

module.exports = {
  apps: [
    // Development apps
    {
      name: 'backend-dev',
      cwd: './backend',
      script: 'pnpm',
      args: 'run dev',
      env: {
        ...baseEnv,
        NODE_ENV: 'development',
        NODE_TLS_REJECT_UNAUTHORIZED: '0', // Allow self-signed certs (Laravel Valet)
        PORT: 3000,
        FRONTEND_ORIGIN: 'http://localhost:5173',
        LOG_LEVEL: 'debug',
      },
      watch: false,
      autorestart: true,
      max_memory_restart: '512M',
      log_file: '/home/venom/logs/pm2/backend-dev.log',
      error_file: '/home/venom/logs/pm2/backend-dev-error.log',
      out_file: '/home/venom/logs/pm2/backend-dev-out.log',
      merge_logs: true,
      time: true,
    },
    {
      name: 'frontend-dev',
      cwd: './',
      script: 'pnpm',
      args: '--filter frontend run dev',
      env: {
        NODE_ENV: 'development',
        PORT: 5173,
      },
      watch: false,
      autorestart: true,
      max_memory_restart: '512M',
      log_file: '/home/venom/logs/pm2/frontend-dev.log',
      error_file: '/home/venom/logs/pm2/frontend-dev-error.log',
      out_file: '/home/venom/logs/pm2/frontend-dev-out.log',
      merge_logs: true,
      time: true,
    },
    // Production apps
    {
      name: 'backend-prod',
      cwd: './backend',
      script: 'node',
      args: '--enable-source-maps ./dist/index.mjs',
      env: {
        ...baseEnv,
        NODE_ENV: 'production',
        PORT: 8080,
        FRONTEND_ORIGIN: 'https://venom-codes.test',
        LOG_LEVEL: 'info',
      },
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '512M',
      log_file: '/home/venom/logs/pm2/backend-prod.log',
      error_file: '/home/venom/logs/pm2/backend-prod-error.log',
      out_file: '/home/venom/logs/pm2/backend-prod-out.log',
      merge_logs: true,
      time: true,
    },
    // Alternative: Frontend production using vite preview (port 8081)
    // Not needed if serving static files via nginx
    {
      name: 'frontend-prod-preview',
      cwd: './frontend',
      script: 'pnpm',
      args: 'run serve',
      env: {
        NODE_ENV: 'production',
        PORT: 8081,
      },
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '512M',
      log_file: '/home/venom/logs/pm2/frontend-prod.log',
      error_file: '/home/venom/logs/pm2/frontend-prod-error.log',
      out_file: '/home/venom/logs/pm2/frontend-prod-out.log',
      merge_logs: true,
      time: true,
      // Disabled by default - use nginx static serve instead
      // To enable: pm2 start pm2.config.js --only frontend-prod-preview
      autostart: false,
    },
  ],
};
