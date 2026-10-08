const { themes } = require('./src/theme/theme.ts');

// Every theme colour becomes a class backed by a CSS variable that ThemeProvider sets.
const colors = Object.fromEntries(
  Object.keys(themes.dark).map(name => [name, `var(--color-${name})`]),
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.js', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: { colors },
  },
};
