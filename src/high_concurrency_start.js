#!/usr/bin/env node

/**
 * Module dependencies.
 */
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

cluster.setupMaster({
  exec: './src/server.js',
  // args: ['--use', 'https'],
  // silent: true
});

for (let i = 0; i < numCPUs; i += 1) {
  process.stdout.write(`start worker${i}\r\n`);
  cluster.fork();
}
// Listen for dying processes
cluster.on('exit', (worker, code, signal) => {
  process.stderr.write(`A process(pid=${worker.process.pid}) died (${signal || code}). Restarting...\r\n`);
  cluster.fork();
});

cluster.on('disconnect', () => {
  cluster.fork();
});
