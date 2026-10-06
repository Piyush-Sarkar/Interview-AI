const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Store the browser binary inside the project directory so Render caches and finds it
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
