import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Button } from '../button';

describe('Button Component', () => {
  it('renders correctly with text', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={() => {}} />
    );
    
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={onPressMock} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={onPressMock} disabled />
    );
    
    const button = getByText('Test Button');
    fireEvent.press(button);
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('has correct accessibility props', () => {
    const { getByRole } = render(
      <Button title="Test Button" onPress={() => {}} />
    );
    
    const button = getByRole('button');
    expect(button).toBeTruthy();
  });
});
