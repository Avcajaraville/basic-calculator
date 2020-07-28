// eslint-disable-next-line no-undef
const path = require('path');

// eslint-disable-next-line no-undef
const src = path.join(__dirname, 'src');
// eslint-disable-next-line no-undef
const dist = path.join(__dirname, 'dist');
const js = path.join(src, 'js');
const styles = path.join(src, 'sass');

module.exports = {
  src,
  dist,
  js,
  styles,
};
