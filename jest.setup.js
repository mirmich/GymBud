// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const createMockIcon = (iconSetName) => {
    const Icon = (props) => React.createElement(Text, props, props.name || iconSetName);
    Icon.displayName = iconSetName;
    return Icon;
  };
  return {
    AntDesign: createMockIcon('AntDesign'),
    FontAwesome: createMockIcon('FontAwesome'),
    FontAwesome5: createMockIcon('FontAwesome5'),
    FontAwesome6: createMockIcon('FontAwesome6'),
    SimpleLineIcons: createMockIcon('SimpleLineIcons'),
    Feather: createMockIcon('Feather'),
    Entypo: createMockIcon('Entypo'),
  };
});

// Mock lottie-react-native
jest.mock('lottie-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');
  return React.forwardRef((props, ref) => React.createElement(View, { ...props, ref, testID: 'lottie-view' }));
});

// Mock react-native-chart-kit
jest.mock('react-native-chart-kit', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    LineChart: (props) => React.createElement(View, { ...props, testID: 'line-chart' }),
  };
});

// Mock react-native-calendars
jest.mock('react-native-calendars', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Calendar: (props) => React.createElement(View, { ...props, testID: 'calendar' }),
  };
});

// Mock react-native-select-dropdown
jest.mock('react-native-select-dropdown', () => {
  const React = require('react');
  const { View } = require('react-native');
  return (props) => React.createElement(View, { ...props, testID: 'select-dropdown' });
});

// Mock react-native-swipe-list-view
jest.mock('react-native-swipe-list-view', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SwipeListView: (props) => React.createElement(View, { ...props, testID: 'swipe-list' }),
    SwipeRow: (props) => React.createElement(View, { ...props, testID: 'swipe-row' }),
  };
});

// Mock WatermelonDB decorators
jest.mock('@nozbe/watermelondb/decorators', () => ({
  field: () => (target, key) => {},
  text: () => (target, key) => {},
  json: () => (target, key) => {},
  children: () => (target, key) => {},
  relation: () => (target, key) => {},
  readonly: () => (target, key) => {},
  date: () => (target, key) => {},
  action: () => (target, key, descriptor) => descriptor,
  writer: () => (target, key, descriptor) => descriptor,
}));

jest.mock('@nozbe/watermelondb', () => {
  class MockModel {
    static table = '';
    static associations = {};
  }
  class MockDatabase {}
  return {
    __esModule: true,
    default: MockDatabase,
    Model: MockModel,
    Database: MockDatabase,
    Q: {
      where: jest.fn(),
      eq: jest.fn(),
      gt: jest.fn(),
      gte: jest.fn(),
      lt: jest.fn(),
      lte: jest.fn(),
      and: jest.fn(),
      or: jest.fn(),
      on: jest.fn(),
    },
    appSchema: jest.fn(() => ({})),
    tableSchema: jest.fn(() => ({})),
  };
});

// Mock expo-font
jest.mock('expo-font', () => ({
  useFonts: () => [true],
  loadAsync: jest.fn(),
}));

// Mock confetti asset
jest.mock('./assets/confetti.json', () => ({}), { virtual: true });

// Silence console.log in tests to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
};
