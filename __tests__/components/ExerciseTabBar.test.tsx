import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ExerciseTabBar from '../../components/ExerciseTabBar';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('ExerciseTabBar', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const defaultProps = {
    activeTab: 'Track' as const,
    exerciseName: 'Bench Press',
    date: '2024-01-15',
  };

  it('renders all three tab labels', () => {
    const { getByText } = render(<ExerciseTabBar {...defaultProps} />);
    expect(getByText('Track')).toBeTruthy();
    expect(getByText('History')).toBeTruthy();
    expect(getByText('Chart')).toBeTruthy();
  });

  it('renders back button', () => {
    const { toJSON } = render(<ExerciseTabBar {...defaultProps} />);
    expect(toJSON()).toBeTruthy();
  });

  it('navigates to Home when back button pressed', () => {
    const { getByText } = render(<ExerciseTabBar {...defaultProps} />);
    // The back button renders an icon; find the pressable by looking at structure
    // The AntDesign mock renders the icon name as text
    const backIcon = getByText('left');
    fireEvent.press(backIcon);
    expect(mockNavigate).toHaveBeenCalledWith('Home');
  });

  it('navigates to History when History tab pressed', () => {
    const { getByText } = render(
      <ExerciseTabBar {...defaultProps} activeTab="Track" />
    );
    fireEvent.press(getByText('History'));
    expect(mockNavigate).toHaveBeenCalledWith('History', {
      exerciseName: 'Bench Press',
      date: '2024-01-15',
    });
  });

  it('navigates to Chart when Chart tab pressed', () => {
    const { getByText } = render(
      <ExerciseTabBar {...defaultProps} activeTab="Track" />
    );
    fireEvent.press(getByText('Chart'));
    expect(mockNavigate).toHaveBeenCalledWith('Chart', {
      exerciseName: 'Bench Press',
      date: '2024-01-15',
    });
  });

  it('navigates to Exercise when Track tab pressed (from History)', () => {
    const { getByText } = render(
      <ExerciseTabBar {...defaultProps} activeTab="History" />
    );
    fireEvent.press(getByText('Track'));
    expect(mockNavigate).toHaveBeenCalledWith('Exercise', {
      exerciseName: 'Bench Press',
      date: '2024-01-15',
    });
  });

  it('does not navigate when pressing active tab', () => {
    const { getByText } = render(
      <ExerciseTabBar {...defaultProps} activeTab="Track" />
    );
    // Active tab is rendered as plain Text, not Pressable, so pressing it shouldn't navigate
    fireEvent.press(getByText('Track'));
    expect(mockNavigate).not.toHaveBeenCalledWith('Exercise', expect.anything());
  });
});
