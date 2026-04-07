/**
 * Button Component Usage Examples
 * 
 * This file demonstrates how to use the Button component with different variants,
 * sizes, and states.
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Button } from './Button';
import { ThemeProvider } from '../../theme/ThemeContext';

export const ButtonExamples: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handlePress = () => {
    console.log('Button pressed!');
  };

  const handleLoadingPress = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <ThemeProvider>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Variants</Text>
          
          <Button
            title="Primary Button"
            onPress={handlePress}
            variant="primary"
            style={styles.button}
          />
          
          <Button
            title="Secondary Button"
            onPress={handlePress}
            variant="secondary"
            style={styles.button}
          />
          
          <Button
            title="Outline Button"
            onPress={handlePress}
            variant="outline"
            style={styles.button}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sizes</Text>
          
          <Button
            title="Small Button"
            onPress={handlePress}
            size="small"
            style={styles.button}
          />
          
          <Button
            title="Medium Button"
            onPress={handlePress}
            size="medium"
            style={styles.button}
          />
          
          <Button
            title="Large Button"
            onPress={handlePress}
            size="large"
            style={styles.button}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>States</Text>
          
          <Button
            title="Disabled Button"
            onPress={handlePress}
            disabled
            style={styles.button}
          />
          
          <Button
            title={loading ? 'Loading...' : 'Click to Load'}
            onPress={handleLoadingPress}
            loading={loading}
            style={styles.button}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Full Width</Text>
          
          <Button
            title="Full Width Button"
            onPress={handlePress}
            fullWidth
            style={styles.button}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Combinations</Text>
          
          <Button
            title="Small Primary"
            onPress={handlePress}
            variant="primary"
            size="small"
            style={styles.button}
          />
          
          <Button
            title="Large Secondary"
            onPress={handlePress}
            variant="secondary"
            size="large"
            style={styles.button}
          />
          
          <Button
            title="Medium Outline Full Width"
            onPress={handlePress}
            variant="outline"
            size="medium"
            fullWidth
            style={styles.button}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accessibility</Text>
          
          <Button
            title="Submit Form"
            onPress={handlePress}
            accessibilityLabel="Submit registration form"
            accessibilityHint="Double tap to submit your registration"
            style={styles.button}
          />
        </View>
      </ScrollView>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  button: {
    marginBottom: 12,
  },
});
