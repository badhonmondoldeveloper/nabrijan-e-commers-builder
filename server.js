const { spawn } = require('child_process');

const port = Number(process.env.PORT || 3000);

const child = spawn('npx', ['next', 'start', '-p', String(port)], {
  stdio: 'inherit',
  env: process.env,
  shell: false,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code || 0);
});

child.on('error', (error) => {
  console.error('Failed to start Next.js server:', error);
  process.exit(1);
});
