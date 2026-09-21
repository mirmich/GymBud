import React from 'react';
import { render } from '@testing-library/react-native';
import Header from '../../components/Header';

describe('Header', () => {
  it('renders the GymLog title', () => {
    const { getByText } = render(<Header />);
    expect(getByText('GymLog')).toBeTruthy();
  });

  it('renders without crashing', () => {
    const { toJSON } = render(<Header />);
    expect(toJSON()).toBeTruthy();
  });
});
