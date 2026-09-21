import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ChartScreen from '../../screens/ChartScreen';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock ExerciseUnitQueries
const mockExerciseData = [
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
    date: '2024-01-15',
    weightAndReps: [
      { weight: 82.5, reps: 5 },
      { weight: 90, reps: 2 },
    ],
  },
  {
    exerciseName: 'Bench Press',
    date: '2024-01-20',
    weightAndReps: [
      { weight: 85, reps: 5 },
    ],
  },
];

jest.mock('../../services/queries/ExerciseUnitQueries', () => ({
  __esModule: true,
  default: {
    listAllExerciseUnitsByName: jest.fn(() => ({
      data: mockExerciseData,
    })),
  },
}));

const mockRoute = {
  params: {
    exerciseName: 'Bench Press',
    date: '2024-01-20',
  },
};

describe('ChartScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders without crashing', () => {
    const { toJSON } = render(<ChartScreen route={mockRoute as any} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders all three filter buttons', () => {
    const { getByText } = render(<ChartScreen route={mockRoute as any} />);
    expect(getByText('Last 15')).toBeTruthy();
    expect(getByText('3 Months')).toBeTruthy();
    expect(getByText('All Time')).toBeTruthy();
  });

  it('renders the ExerciseTabBar tabs', () => {
    const { getByText } = render(<ChartScreen route={mockRoute as any} />);
    expect(getByText('Track')).toBeTruthy();
    expect(getByText('History')).toBeTruthy();
    expect(getByText('Chart')).toBeTruthy();
  });

  it('renders the LineChart component', () => {
    const { getByTestId } = render(<ChartScreen route={mockRoute as any} />);
    expect(getByTestId('line-chart')).toBeTruthy();
  });

  it('can switch to 3 Months filter', () => {
    const { getByText } = render(<ChartScreen route={mockRoute as any} />);
    fireEvent.press(getByText('3 Months'));
    // Should still render without error
    expect(getByText('3 Months')).toBeTruthy();
  });

  it('can switch to All Time filter', () => {
    const { getByText } = render(<ChartScreen route={mockRoute as any} />);
    fireEvent.press(getByText('All Time'));
    expect(getByText('All Time')).toBeTruthy();
  });

  it('renders with empty data', () => {
    const ExerciseUnitQueries = require('../../services/queries/ExerciseUnitQueries').default;
    ExerciseUnitQueries.listAllExerciseUnitsByName.mockReturnValueOnce({ data: [] });

    const { getByText, getByTestId } = render(<ChartScreen route={mockRoute as any} />);
    expect(getByText('Last 15')).toBeTruthy();
    expect(getByTestId('line-chart')).toBeTruthy();
  });
});
