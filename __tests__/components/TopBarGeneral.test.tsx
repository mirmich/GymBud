import React from 'react';
import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import TopBarGeneral from '../../components/TopBarGeneral';

describe('TopBarGeneral', () => {
  it('renders all inner elements', () => {
    const elements = [
      <Text key="a">First</Text>,
      <Text key="b">Second</Text>,
      <Text key="c">Third</Text>,
    ];

    const { getByText } = render(
      <TopBarGeneral innerElements={[elements]} />
    );

    expect(getByText('First')).toBeTruthy();
    expect(getByText('Second')).toBeTruthy();
    expect(getByText('Third')).toBeTruthy();
  });

  it('renders with empty elements array', () => {
    const { toJSON } = render(
      <TopBarGeneral innerElements={[]} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('applies container styles', () => {
    const elements = [<Text key="a">Test</Text>];
    const { toJSON } = render(
      <TopBarGeneral innerElements={[elements]} />
    );

    const tree = toJSON();
    expect(tree.props.style).toBeDefined();
  });
});
