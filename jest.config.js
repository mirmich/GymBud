module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@rneui/.*|@tanstack/.*|date-fns|ramda|react-native-calendars|react-native-chart-kit|react-native-svg|react-native-swipe-list-view|react-native-select-dropdown|react-native-uuid|lottie-react-native|@dotlottie/react-player|@lottiefiles/react-lottie-player)',
  ],
  setupFiles: ['./jest.setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/web-build/'],
  collectCoverageFrom: [
    'util/**/*.{ts,tsx}',
    'services/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'screens/**/*.{ts,tsx}',
    '!**/*.d.ts',
  ],
};
