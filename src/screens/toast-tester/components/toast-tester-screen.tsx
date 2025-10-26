import { useThemeColors } from 'masterfabric-expo-core';
import React from 'react';
import { View, Text, TextInput, Button, ScrollView, Switch } from 'react-native';

import { useToastTesterViewModel } from '../hooks/use-toast-tester-view-model';
import { styles } from '../styles/toast-tester.styles';

/**
 * This is the main UI component for the Toast Tester screen.
 * It is a "dumb" component that gets all its data and logic from the
 * `useToastTesterViewModel` hook.
 */
export function ToastTesterScreen() {
  const colors = useThemeColors();
  const {
    title,
    subtitle,
    visibilityTime,
    position,
    isTopPosition,
    setTitle,
    setSubtitle,
    setVisibilityTime,
    togglePosition,
    showCustomToast,
  } = useToastTesterViewModel();

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.header, { color: colors.text }]}>Toast Content</Text>

        <Text style={[styles.label, { color: colors.text }]}>Title</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.surfaceBorder }]}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter toast title"
          placeholderTextColor={colors.inactiveText}
        />

        <Text style={[styles.label, { color: colors.text }]}>Subtitle</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.surfaceBorder }]}
          value={subtitle}
          onChangeText={setSubtitle}
          placeholder="Enter toast subtitle"
          placeholderTextColor={colors.inactiveText}
        />
      </View>

      <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.header, { color: colors.text }]}>Toast Configuration</Text>

        <Text style={[styles.label, { color: colors.text }]}>Visibility Time (ms)</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.surfaceBorder }]}
          value={visibilityTime}
          onChangeText={setVisibilityTime}
          placeholder="e.g., 4000"
          keyboardType="numeric"
          placeholderTextColor={colors.inactiveText}
        />

        <View style={styles.switchContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Position: {position}</Text>
          <Switch
            trackColor={{ false: colors.surfaceBorder, true: colors.successColor }}
            thumbColor={colors.background}
            ios_backgroundColor={colors.surfaceBorder}
            onValueChange={togglePosition}
            value={isTopPosition}
          />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.header, { color: colors.text }]}>Actions</Text>
        <View style={styles.buttonContainer}>
          <Button title="Show Success" onPress={() => showCustomToast('success')} color={colors.successColor} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Show Error" onPress={() => showCustomToast('error')} color={colors.errorColor} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Show Info" onPress={() => showCustomToast('info')} color={colors.projectColor} />
        </View>
      </View>
    </ScrollView>
  );
}
