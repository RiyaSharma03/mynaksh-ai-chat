const { colors } = require('./src/constants/colors.ts');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.js', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: { colors },
  },
};
