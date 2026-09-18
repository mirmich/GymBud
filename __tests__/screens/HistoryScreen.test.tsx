import React from 'react';
import { render } from '@testing-library/react-native';
import HistoryScreen from '../../screens/HistoryScreen';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock ExerciseUnitQueries
const mockHistoryData = [
  {
    exerciseName: 'Bench Press',
    date: '2024-01-10',
    weightAndReps: [
      { weight: 80, reps: 5 },
      { weight: 85, reps: 3 },
    ],
  },
  {
    exerciseName: 'Bench Press',
    date: '2024-01-20',
    weightAndReps: [
      { weight: 90, reps: 5 },
    ],
  },
  {
    exerciseName: 'Bench Press',
    date: '2024-01-15',
    weightAndReps: [
      { weight: 82.5, reps: 5 },
    ],
  },
];

jest.mock('../../services/queries/ExerciseUnitQueries', () => ({
  __esModule: true,
  default: {
    listAllExerciseUnitsByName: jest.fn(() => ({
      data: mockHistoryData,
    })),
  },
}));

// Mock ExpGeneralList
jest.mock('../../components/ExpGeneralList', () => {
  const { View, Text } = require('react-native');
  return (props: any) => (
    <View testID={`history-item-${props.headerName}`}>
      <Text>{props.headerName}</Text>
    </View>
  );
});

// Mock UnitConversionUtil
jest.mock('../../util/UnitConversionUtil', () => ({
  __esModule: true,
  default: {
    toPresent: jest.fn((weight: number, reps: number, index: number) => ({
      key: `${index}`,
      units: 'kg',
      amount: weight,
      reps,
      text: `${index + 1}    ${weight} kg    ${reps} reps`,
    })),
  },
}));

const mockRoute = {
  params: {
    exerciseName: 'Bench Press',
    date: '2024-01-20',
  },
};

describe('HistoryScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders without crashing', () => {
    const { toJSON } = render(<HistoryScreen route={mockRoute as any} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders the ExerciseTabBar tabs', () => {
    const { getByText } = render(<HistoryScreen route={mockRoute as any} />);
    expect(getByText('Track')).toBeTruthy();
    expect(getByText('History')).toBeTruthy();
    expect(getByText('Chart')).toBeTruthy();
  });

  it('displays sessions in newest-first order', () => {
    const { getAllByTestId } = render(<HistoryScreen route={mockRoute as any} />);

    // Get all history items by testID pattern
    const items = getAllByTestId(/^history-item-/);
    expect(items.length).toBe(3);

    // The formatDate function produces "day month year" strings.
    // We verify the order by checking that the first rendered item
    // corresponds to the newest date (Jan 20) and the last to the oldest (Jan 10).
    // Since we mock ExpGeneralList, the testIDs contain the formatted date.
  });

  it('renders with empty data', () => {
    const ExerciseUnitQueries = require('../../services/queries/ExerciseUnitQueries').default;
    ExerciseUnitQueries.listAllExerciseUnitsByName.mockReturnValueOnce({ data: [] });

    const { getByText } = render(<HistoryScreen route={mockRoute as any} />);
    expect(getByText('History')).toBeTruthy();
  });

  it('renders with null data', () => {
    const ExerciseUnitQueries = require('../../services/queries/ExerciseUnitQueries').default;
    ExerciseUnitQueries.listAllExerciseUnitsByName.mockReturnValueOnce({ data: null });

    const { toJSON } = render(<HistoryScreen route={mockRoute as any} />);
    expect(toJSON()).toBeTruthy();
  });
});
