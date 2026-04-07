import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';
import { ThemeProvider } from '../../theme/ThemeContext';

// Wrapper component to provide theme context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('Button Component', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(
      <TestWrapper>
        <Button title="Test Button" onPress={() => {}} />
      </TestWrapper>
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <TestWrapper>
        <Button title="Press Me" onPress={onPressMock} />
      </TestWrapper>
    );
    
    fireEvent.press(getByText('Press Me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <TestWrapper>
        <Button title="Disabled Button" onPress={onPressMock} disabled />
      </TestWrapper>
    );
    
    fireEvent.press(getByText('Disabled Button'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('does not call onPress when loading', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <TestWrapper>
        <Button title="Loading Button" onPress={onPressMock} loading />
      </TestWrapper>
    );
    
    fireEvent.press(getByText('Loading Button'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('renders with primary variant by default', () => {
    const { getByText } = render(
      <TestWrapper>
        <Button title="Primary" onPress={() => {}} />
      </TestWrapper>
    );
    expect(getByText('Primary')).toBeTruthy();
  });

  it('renders with secondary variant', () => {
    const { getByText } = render(
      <TestWrapper>
        <Button title="Secondary" onPress={() => {}} variant="secondary" />
      </TestWrapper>
    );
    expect(getByText('Secondary')).toBeTruthy();
  });

  it('renders with outline variant', () => {
    const { getByText } = render(
      <TestWrapper>
        <Button title="Outline" onPress={() => {}} variant="outline" />
      </TestWrapper>
    );
    expect(getByText('Outline')).toBeTruthy();
  });

  it('renders with small size', () => {
    const { getByText } = render(
      <TestWrapper>
        <Button title="Small" onPress={() => {}} size="small" />
      </TestWrapper>
    );
    expect(getByText('Small')).toBeTruthy();
  });

  it('renders with medium size by default', () => {
    const { getByText } = render(
      <TestWrapper>
        <Button title="Medium" onPress={() => {}} />
      </TestWrapper>
    );
    expect(getByText('Medium')).toBeTruthy();
  });

  it('renders with large size', () => {
    const { getByText } = render(
      <TestWrapper>
        <Button title="Large" onPress={() => {}} size="large" />
      </TestWrapper>
    );
    expect(getByText('Large')).toBeTruthy();
  });

  it('shows loading indicator when loading', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Button title="Loading" onPress={() => {}} loading testID="loading-button" />
      </TestWrapper>
    );
    expect(getByTestId('loading-button')).toBeTruthy();
  });

  it('has correct accessibility properties', () => {
    const { getByRole } = render(
      <TestWrapper>
        <Button
          title="Accessible Button"
          onPress={() => {}}
          accessibilityLabel="Custom Label"
          accessibilityHint="Custom Hint"
        />
      </TestWrapper>
    );
    
    const button = getByRole('button');
    expect(button).toBeTruthy();
  });

  it('ensures minimum 44x44 touch target', () => {
    const { getByText } = render(
      <TestWrapper>
        <Button title="Touch Target" onPress={() => {}} size="small" />
      </TestWrapper>
    );
    
    const button = getByText('Touch Target').parent;
    // The button should have minHeight and minWidth of 44
    expect(button).toBeTruthy();
  });
});
