import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ToastResult } from '../models/toast-helper.models';

interface ToastResultCardProps {
  result: ToastResult;
}

/**
 * ToastResultCard Component
 * 
 * A card component that displays the results of toast operations.
 * Shows detailed information about each toast example including:
 * - Operation name and type
 * - Input parameters used
 * - Expected output description
 * - Detailed description of the operation
 * 
 * Features:
 * - Clean, organized layout
 * - Theme-aware styling
 * - Monospace font for code-like content
 * - Responsive design
 * - Accessibility support
 */
export function ToastResultCard({ result }: ToastResultCardProps) {
  // Get theme colors for consistent styling
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <ThemedView style={[toastResultCardStyles.card, { borderColor: colors.surfaceBorder }]}>
      {/* Card Header with Operation Name */}
      <View style={toastResultCardStyles.header}>
        <ThemedText 
          type="subtitle" 
          style={[toastResultCardStyles.operationName, { color: colors.sectionTitle }]}
        >
          {result.operationName}
        </ThemedText>
      </View>

      {/* Card Content with Detailed Information */}
      <View style={toastResultCardStyles.content}>
        {/* Input Parameters Section */}
        <View style={toastResultCardStyles.section}>
          <ThemedText 
            type="default" 
            style={[toastResultCardStyles.label, { color: colors.labelText }]}
          >
            Input:
          </ThemedText>
          <ThemedText 
            type="default" 
            style={[toastResultCardStyles.value, { color: colors.bodyText }]}
          >
            {result.input}
          </ThemedText>
        </View>

        {/* Output Description Section */}
        <View style={toastResultCardStyles.section}>
          <ThemedText 
            type="default" 
            style={[toastResultCardStyles.label, { color: colors.labelText }]}
          >
            Output:
          </ThemedText>
          <ThemedText 
            type="default" 
            style={[toastResultCardStyles.value, { color: colors.bodyText }]}
          >
            {result.output}
          </ThemedText>
        </View>

        {/* Description Section */}
        <View style={toastResultCardStyles.section}>
          <ThemedText 
            type="default" 
            style={[toastResultCardStyles.label, { color: colors.labelText }]}
          >
            Description:
          </ThemedText>
          <ThemedText 
            type="default" 
            style={[toastResultCardStyles.description, { color: colors.bodyText }]}
          >
            {result.description}
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

/**
 * Styles for ToastResultCard component
 * 
 * Provides consistent styling for the result card including:
 * - Card container with rounded corners and border
 * - Header section with operation name
 * - Content sections with proper spacing
 * - Code-like styling for input/output values
 * - Responsive typography
 */
const toastResultCardStyles = StyleSheet.create({
  // Main card container
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  // Header section containing operation name
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  // Operation name styling
  operationName: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Main content area
  content: {
    padding: 16,
  },
  // Individual section container
  section: {
    marginBottom: 12,
  },
  // Label text styling
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  // Code-like value styling for input/output
  value: {
    fontSize: 14,
    fontFamily: 'monospace',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  // Description text styling
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});