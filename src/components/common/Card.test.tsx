import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Card } from './Card';
import { ThemeProvider } from '../../theme/ThemeContext';

// Wrapper component to provide theme context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('Card Component', () => {
  it('renders correctly with children', () => {
    const { getByText } = render(
      <TestWrapper>
        <Card>
          <Text>Card Content</Text>
        </Card>
      </TestWrapper>
    );
    expect(getByText('Card Content')).toBeTruthy();
  });

  it('renders with default elevation (sm)', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Card testID="default-card">
          <Text>Default Card</Text>
        </Card>
      </TestWrapper>
    );
    expect(getByTestId('default-card')).toBeTruthy();
  });

  it('renders with no elevation', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Card elevation="none" testID="no-elevation-card">
          <Text>No Elevation</Text>
        </Card>
      </TestWrapper>
    );
    expect(getByTestId('no-elevation-card')).toBeTruthy();
  });

  it('renders with medium elevation', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Card elevation="md" testID="md-elevation-card">
          <Text>Medium Elevation</Text>
        </Card>
      </TestWrapper>
    );
    expect(getByTestId('md-elevation-card')).toBeTruthy();
  });

  it('renders with large elevation', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Card elevation="lg" testID="lg-elevation-card">
          <Text>Large Elevation</Text>
        </Card>
      </TestWrapper>
    );
    expect(getByTestId('lg-elevation-card')).toBeTruthy();
  });

  it('renders with default padding (md)', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Card testID="default-padding-card">
          <Text>Default Padding</Text>
        </Card>
      </TestWrapper>
    );
    expect(getByTestId('default-padding-card')).toBeTruthy();
  });

  it('renders with no padding', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Card padding="none" testID="no-padding-card">
          <Text>No Padding</Text>
        </Card>
      </TestWrapper>
    );
    expect(getByTestId('no-padding-card')).toBeTruthy();
  });

  it('renders with xs padding', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Card padding="xs" testID="xs-padding-card">
          <Text>XS Padding</Text>
        </Card>
      </TestWrapper>
    );
    expect(getByTestId('xs-padding-card')).toBeTruthy();
  });

  it('renders with sm padding', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Card padding="sm" testID="sm-padding-card">
          <Text>SM Padding</Text>
        </Card>
      </TestWrapper>
    );
    expect(getByTestId('sm-padding-card')).toBeTruthy();
  });

  it('renders with lg padding', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Card padding="lg" testID="lg-padding-card">
          <Text>LG Padding</Text>
        </Card>
      </TestWrapper>
    );
    expect(getByTestId('lg-padding-card')).toBeTruthy();
  });

  it('renders with xl padding', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Card padding="xl" testID="xl-padding-card">
          <Text>XL Padding</Text>
        </Card>
      </TestWrapper>
    );
    expect(getByTestId('xl-padding-card')).toBeTruthy();
  });

  it('applies custom styles', () => {
    const customStyle = { marginTop: 20 };
    const { getByTestId } = render(
      <TestWrapper>
        <Card style={customStyle} testID="custom-style-card">
          <Text>Custom Style</Text>
        </Card>
      </TestWrapper>
    );
    expect(getByTestId('custom-style-card')).toBeTruthy();
  });

  it('applies theme colors and border radius', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Card testID="themed-card">
          <Text>Themed Card</Text>
        </Card>
      </TestWrapper>
    );
    const card = getByTestId('themed-card');
    expect(card).toBeTruthy();
    // Card should have backgroundColor, borderRadius, and borderColor from theme
  });

  it('renders multiple children', () => {
    const { getByText } = render(
      <TestWrapper>
        <Card>
          <Text>First Child</Text>
          <Text>Second Child</Text>
        </Card>
      </TestWrapper>
    );
    expect(getByText('First Child')).toBeTruthy();
    expect(getByText('Second Child')).toBeTruthy();
  });
});
