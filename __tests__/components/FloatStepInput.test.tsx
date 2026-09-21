import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FloatStepInput from '../../components/FloatStepInput';

describe('FloatStepInput', () => {
  const defaultProps = {
    text: 'Weight',
    step: 2.5,
    value: 80,
    onChangeValue: jest.fn(),
  };

  beforeEach(() => {
    defaultProps.onChangeValue.mockClear();
  });

  it('renders the label text', () => {
    const { getByText } = render(<FloatStepInput {...defaultProps} />);
    expect(getByText('Weight')).toBeTruthy();
  });

  it('renders + and - buttons', () => {
    const { getByText } = render(<FloatStepInput {...defaultProps} />);
    expect(getByText('+')).toBeTruthy();
    expect(getByText('-')).toBeTruthy();
  });

  it('displays the initial value', () => {
    const { getByDisplayValue } = render(<FloatStepInput {...defaultProps} />);
    expect(getByDisplayValue('80.0')).toBeTruthy();
  });

  it('increments value when + is pressed', () => {
    const { getByText } = render(<FloatStepInput {...defaultProps} />);
    fireEvent.press(getByText('+'));
    expect(defaultProps.onChangeValue).toHaveBeenCalledWith(82.5);
  });

  it('decrements value when - is pressed', () => {
    const { getByText } = render(<FloatStepInput {...defaultProps} />);
    fireEvent.press(getByText('-'));
    expect(defaultProps.onChangeValue).toHaveBeenCalledWith(77.5);
  });

  it('does not go below 1', () => {
    const { getByText } = render(
      <FloatStepInput {...defaultProps} value={1} step={5} />
    );
    fireEvent.press(getByText('-'));
    expect(defaultProps.onChangeValue).toHaveBeenCalledWith(1);
  });

  it('calls onChangeValue when text input changes', () => {
    const { getByDisplayValue } = render(<FloatStepInput {...defaultProps} />);
    fireEvent.changeText(getByDisplayValue('80.0'), '100');
    expect(defaultProps.onChangeValue).toHaveBeenCalledWith(100);
  });

  it('respects custom decimals prop', () => {
    const { getByDisplayValue } = render(
      <FloatStepInput {...defaultProps} value={80} decimals={0} />
    );
    expect(getByDisplayValue('80')).toBeTruthy();
  });
});
