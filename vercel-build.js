const { execSync } = require('child_process');

try {
  // Attempt to install missing native dependencies that Vercel might need
  execSync('npm install @rollup/rollup-linux-x64-gnu --no-save || true', { stdio: 'inherit' });
} catch (error) {
  console.warn('Warning: Optional dependency installation failed, continuing build...');
}

// Run the actual build
execSync('vite build', { stdio: 'inherit' });