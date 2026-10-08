module.exports = {
  preset: '@react-native/jest-preset',
  // Also compile packages that ship ES modules or TS source: Redux Toolkit and its
  // dependencies, and NativeWind's JSX runtime (its Babel preset applies to them).
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@reduxjs|immer|reselect|redux|react-redux|nativewind|react-native-css-interop)/)',
  ],
};
