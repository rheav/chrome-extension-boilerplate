// @ts-check
import { exec } from 'child_process';
import chokidar from 'chokidar';
import { WebSocketServer, WebSocket } from 'ws';
import { promisify } from 'util';

const execAsync = promisify(exec);

// WebSocket server for extension reloading
const wss = new WebSocketServer({ port: 3001 });

// Build the extension
async function build() {
  try {
    console.log('Building extension...');
    await execAsync('npm run build');
    console.log('Build complete!');
    
    // Notify all connected clients to reload
    if (wss.clients && wss.clients.size > 0) {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send('reload');
        }
      });
    }
  } catch (error) {
    console.error('Build failed:', error);
  }
}

// Watch for file changes
const watcher = chokidar.watch(['src/**/*', 'public/**/*'], {
  ignored: ['**/dist/**', '**/node_modules/**'],
  persistent: true
});

// Debounce function to prevent multiple builds
let timeout;
function debounce(func, wait) {
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const debouncedBuild = debounce(build, 1000);

watcher
  .on('ready', () => {
    console.log('Initial scan complete. Ready for changes...');
    build(); // Initial build
  })
  .on('change', (path) => {
    console.log(`File ${path} has been changed`);
    debouncedBuild();
  });

console.log('Watching for file changes...');
