module.exports = {
  apps: [
    {
      name: 'inels-payload',
      script: 'npm',
      args: 'start -- -p 3000',
      cwd: '/home/pruvious/sites/inels-content-studio',
      exec_mode: 'fork', // Next.js handles its own clustering
      instances: 1,      
      autorestart: true,
      env: {
        NODE_ENV: 'production',
        NODE_OPTIONS: '--max-old-space-size=4096',
        PORT: 3000,
      },
    },
  ],
}
