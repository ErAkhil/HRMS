/**
 * PM2 process config — use for VPS / bare-metal deployments.
 *
 * Start:   pm2 start ecosystem.config.js --env production
 * Reload:  pm2 reload ecosystem.config.js --env production
 * Save:    pm2 save  (persist across reboots via `pm2 startup`)
 * Logs:    pm2 logs  /  pm2 monit
 */

module.exports = {
  apps: [
    /* ─── NestJS API ───────────────────────────────────────────── */
    {
      name: "unikove-api",
      cwd: "./backend",
      script: "dist/src/main.js",

      // Single instance — WebSocket rooms live in process memory.
      // Scale horizontally only after adding a Redis Socket.io adapter.
      instances: 1,
      exec_mode: "fork",

      // Restart if RSS exceeds 512 MB
      max_memory_restart: "512M",

      // Graceful shutdown: wait up to 10 s for in-flight requests
      kill_timeout: 10000,
      wait_ready: true,
      listen_timeout: 8000,

      // Logging
      out_file: "./logs/api-out.log",
      error_file: "./logs/api-err.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",

      env_production: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },

    /* ─── Next.js Web ───────────────────────────────────────────── */
    {
      name: "unikove-web",
      cwd: "./frontend",
      script: "node_modules/.bin/next",
      args: "start --port 3000",

      // Cluster mode: one worker per CPU core (Next.js is stateless)
      instances: "max",
      exec_mode: "cluster",

      max_memory_restart: "1G",
      kill_timeout: 10000,
      wait_ready: true,
      listen_timeout: 12000,

      out_file: "../logs/web-out.log",
      error_file: "../logs/web-err.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",

      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
