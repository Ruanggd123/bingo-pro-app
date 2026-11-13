const fs = require('fs');
// Minimal valid 1x1 PNG as placeholder - PWA will work with this
// User can replace with real icons later
const minPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg==',
  'base64'
);
fs.writeFileSync('icon-192.png', minPng);
fs.writeFileSync('icon-512.png', minPng);
console.log('ICONS_CREATED');
