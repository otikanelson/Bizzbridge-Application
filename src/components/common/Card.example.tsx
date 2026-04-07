/**
 * Card Component Usage Examples
 * 
 * This file demonstrates how to use the Card component with different elevation
 * levels, padding options, and content types.
 */

import React from 'react';
import { View, StyleSheet, ScrollView, Text, Image } from 'react-native';
import { Card } from './Card';
import { Button } from './Button';
import { ThemeProvider } from '../../theme/ThemeContext';

export const CardExamples: React.FC = () => {
  const handlePress = () => {
    console.log('Button pressed!');
  };

  return (
    <ThemeProvider>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Elevation Levels</Text>
          
          <Card elevation="none" style={styles.card}>
            <Text style={styles.cardText}>No Elevation</Text>
          </Card>
          
          <Card elevation="sm" style={styles.card}>
            <Text style={styles.cardText}>Small Elevation (Default)</Text>
          </Card>
          
          <Card elevation="md" style={styles.card}>
            <Text style={styles.cardText}>Medium Elevation</Text>
          </Card>
          
          <Card elevation="lg" style={styles.card}>
            <Text style={styles.cardText}>Large Elevation</Text>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Padding Options</Text>
          
          <Card padding="none" style={styles.card}>
            <Text style={styles.cardText}>No Padding</Text>
          </Card>
          
          <Card padding="xs" style={styles.card}>
            <Text style={styles.cardText}>XS Padding (4px)</Text>
          </Card>
          
          <Card padding="sm" style={styles.card}>
            <Text style={styles.cardText}>Small Padding (8px)</Text>
          </Card>
          
          <Card padding="md" style={styles.card}>
            <Text style={styles.cardText}>Medium Padding (16px - Default)</Text>
          </Card>
          
          <Card padding="lg" style={styles.card}>
            <Text style={styles.cardText}>Large Padding (24px)</Text>
          </Card>
          
          <Card padding="xl" style={styles.card}>
            <Text style={styles.cardText}>XL Padding (32px)</Text>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Card Example</Text>
          
          <Card elevation="md" padding="none">
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>Service Image</Text>
            </View>
            <View style={styles.serviceContent}>
              <Text style={styles.serviceTitle}>Custom Woodworking</Text>
              <Text style={styles.serviceCategory}>Woodworking</Text>
              <Text style={styles.serviceLocation}>Ikeja, Lagos</Text>
              <Text style={styles.servicePrice}>₦50,000</Text>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Card Example</Text>
          
          <Card elevation="sm" padding="lg">
            <Text style={styles.bookingTitle}>Kitchen Cabinet Installation</Text>
            <Text style={styles.bookingArtisan}>Artisan: John Doe</Text>
            <Text style={styles.bookingDate}>Date: Jan 15, 2024</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>In Progress</Text>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dashboard Stat Cards</Text>
          
          <View style={styles.statsRow}>
            <Card elevation="md" padding="lg" style={styles.statCard}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Active Bookings</Text>
            </Card>
            
            <Card elevation="md" padding="lg" style={styles.statCard}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Pending Requests</Text>
            </Card>
          </View>
          
          <View style={styles.statsRow}>
            <Card elevation="md" padding="lg" style={styles.statCard}>
              <Text style={styles.statValue}>48</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </Card>
            
            <Card elevation="md" padding="lg" style={styles.statCard}>
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </Card>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Form Container</Text>
          
          <Card elevation="sm" padding="xl">
            <Text style={styles.formTitle}>Login</Text>
            <View style={styles.inputPlaceholder}>
              <Text>Email Input</Text>
            </View>
            <View style={styles.inputPlaceholder}>
              <Text>Password Input</Text>
            </View>
            <Button title="Login" onPress={handlePress} fullWidth />
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Complex Content Card</Text>
          
          <Card elevation="md" padding="lg">
            <Text style={styles.complexTitle}>Service Request</Text>
            <Text style={styles.complexSubtitle}>Custom Furniture Design</Text>
            <Text style={styles.complexDescription}>
              I need a custom dining table for 8 people with matching chairs.
              The design should be modern with a natural wood finish.
            </Text>
            <View style={styles.complexMeta}>
              <Text style={styles.complexMetaText}>Status: Pending</Text>
              <Text style={styles.complexMetaText}>Date: Jan 10, 2024</Text>
            </View>
            <View style={styles.buttonRow}>
              <Button
                title="Accept"
                onPress={handlePress}
                variant="primary"
                size="small"
                style={styles.actionButton}
              />
              <Button
                title="Decline"
                onPress={handlePress}
                variant="outline"
                size="small"
                style={styles.actionButton}
              />
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Custom Styling</Text>
          
          <Card
            elevation="md"
            padding="lg"
            style={{
              borderWidth: 2,
              borderColor: '#DC143C',
              marginBottom: 16,
            }}
          >
            <Text style={styles.cardText}>Card with Custom Border</Text>
          </Card>
        </View>
      </ScrollView>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1A1A1A',
  },
  card: {
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  
  // Service Card Styles
  imagePlaceholder: {
    height: 150,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  imagePlaceholderText: {
    color: '#757575',
    fontSize: 14,
  },
  serviceContent: {
    padding: 16,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  serviceCategory: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  serviceLocation: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC143C',
  },
  
  // Booking Card Styles
  bookingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  bookingArtisan: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  bookingDate: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 12,
  },
  statusBadge: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Stats Card Styles
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#DC143C',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
  
  // Form Styles
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputPlaceholder: {
    height: 48,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  
  // Complex Card Styles
  complexTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  complexSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC143C',
    marginBottom: 12,
  },
  complexDescription: {
    fontSize: 14,
    color: '#616161',
    lineHeight: 20,
    marginBottom: 16,
  },
  complexMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  complexMetaText: {
    fontSize: 12,
    color: '#757575',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});
