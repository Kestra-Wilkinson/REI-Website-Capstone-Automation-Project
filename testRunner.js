const { execSync } = require('child_process');

try {
  execSync('mocha tests/*.test.js --timeout 20000 --reporter mochawesome', { stdio: 'inherit' });
} catch (e) {
  process.exit(1);
}