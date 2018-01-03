var concat = require('concat-files');
concat([
  './dist/inline.bundle.js',
  './dist/polyfills.bundle.js',
  './dist/main.bundle.js'
], './dist/airship-checkout.min.js', function(err) {
  if (err) throw err
  console.log('done');
});
concat([
  './dist/styles.bundle.css',
], './dist/airship-checkout.min.css', function(err) {
  if (err) throw err
  console.log('done');
});