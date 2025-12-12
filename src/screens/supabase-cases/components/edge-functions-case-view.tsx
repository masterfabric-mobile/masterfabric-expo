import { ThemedText } from '@/src/shared/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { useEdgeFunctionsViewModel } from '../hooks/use-edge-functions-view-model';
import { edgeFunctionsStyles } from '../styles/edge-functions.styles';
import { supabaseCasesScreenStyles } from '../styles/supabase-cases-screen.styles';

const supabaseGreen = '#3ECF8E';
const edgeFunctionColor = '#F59E0B';

interface EdgeFunctionsCaseViewProps {
  user: any | null;
  isConnected: boolean;
  onBack: () => void;
}

export function EdgeFunctionsCaseView({
  user,
  isConnected,
  onBack,
}: EdgeFunctionsCaseViewProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { state, actions } = useEdgeFunctionsViewModel(isConnected);
  const [nameInput, setNameInput] = useState('');
  const [dataInput, setDataInput] = useState('1,2,3,4,5');

  const handleProcessData = (operation: 'sum' | 'average' | 'max' | 'min') => {
    try {
      const numbers = dataInput.split(',').map((s) => parseFloat(s.trim())).filter((n) => !isNaN(n));
      if (numbers.length === 0) {
        return;
      }
      actions.callProcessFunction(numbers, operation);
    } catch (error) {
      // Handle error
    }
  };

  if (!isConnected) {
    return (
      <ScrollView
        style={supabaseCasesScreenStyles.scrollView}
        contentContainerStyle={supabaseCasesScreenStyles.scrollContent}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity onPress={onBack} style={{ marginRight: 12, padding: 8 }}>
            <Ionicons name="arrow-back" size={24} color={colors.bodyText} />
          </TouchableOpacity>
          <ThemedText
            type="subtitle"
            style={{ fontSize: 20, fontWeight: '700', color: colors.sectionTitle }}
          >
            Edge Functions
          </ThemedText>
        </View>
        <View
          style={[
            supabaseCasesScreenStyles.card,
            {
              borderColor: colors.surfaceBorder,
              backgroundColor: colors.surfaceBackground,
            },
          ]}
        >
          <ThemedText style={{ color: colors.bodyText }}>
            Supabase is not connected. Please connect to Supabase to use Edge Functions.
          </ThemedText>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 8,
        }}
      >
        <TouchableOpacity onPress={onBack} style={{ marginRight: 12, padding: 8 }}>
          <Ionicons name="arrow-back" size={24} color={colors.bodyText} />
        </TouchableOpacity>
        <ThemedText
          type="subtitle"
          style={{ fontSize: 20, fontWeight: '700', color: colors.sectionTitle }}
        >
          Edge Functions
        </ThemedText>
      </View>

      <ScrollView
        style={supabaseCasesScreenStyles.scrollView}
        contentContainerStyle={edgeFunctionsStyles.scrollContent}
      >
        {/* Function 1: Hello World */}
        <View
          style={[
            edgeFunctionsStyles.functionCard,
            {
              backgroundColor: colors.surfaceBackground,
              borderColor: edgeFunctionColor + '30',
            },
          ]}
        >
          <View style={edgeFunctionsStyles.functionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="flash" size={24} color={edgeFunctionColor} />
              <ThemedText
                style={[
                  edgeFunctionsStyles.functionTitle,
                  { color: colors.bodyText },
                ]}
              >
                hello-world
              </ThemedText>
            </View>
          </View>
          <ThemedText
            style={[
              edgeFunctionsStyles.functionDescription,
              { color: colors.actionDescription },
            ]}
          >
            A simple Edge Function that returns a greeting message with timestamp and request details.
          </ThemedText>
          <TextInput
            style={[
              edgeFunctionsStyles.input,
              {
                backgroundColor: colors.inputBackground || colors.surfaceBackground,
                color: colors.bodyText,
                borderColor: colors.surfaceBorder,
              },
            ]}
            value={nameInput}
            onChangeText={setNameInput}
            placeholder="Enter your name (optional)"
            placeholderTextColor={colors.actionDescription}
          />
          <TouchableOpacity
            onPress={() => actions.callHelloFunction(nameInput || undefined)}
            disabled={state.isLoading}
            style={[
              edgeFunctionsStyles.button,
              {
                backgroundColor: state.isLoading ? colors.surfaceBorder : edgeFunctionColor,
              },
            ]}
          >
            {state.isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <ThemedText style={[edgeFunctionsStyles.buttonText, { color: '#FFFFFF' }]}>
                Invoke Function
              </ThemedText>
            )}
          </TouchableOpacity>
          {state.helloResult && (
            <View
              style={[
                edgeFunctionsStyles.resultContainer,
                {
                  backgroundColor: edgeFunctionColor + '10',
                  borderWidth: 1,
                  borderColor: edgeFunctionColor + '30',
                },
              ]}
            >
              <ThemedText
                style={[
                  edgeFunctionsStyles.resultValue,
                  { color: edgeFunctionColor, fontSize: 16, marginBottom: 8 },
                ]}
              >
                {state.helloResult.message}
              </ThemedText>
              <View style={edgeFunctionsStyles.resultRow}>
                <ThemedText style={[edgeFunctionsStyles.resultLabel, { color: colors.labelText }]}>
                  Timestamp:
                </ThemedText>
                <ThemedText style={[edgeFunctionsStyles.resultValue, { color: edgeFunctionColor }]}>
                  {new Date(state.helloResult.timestamp).toLocaleString()}
                </ThemedText>
              </View>
            </View>
          )}
        </View>

        {/* Function 2: Process Data */}
        <View
          style={[
            edgeFunctionsStyles.functionCard,
            {
              backgroundColor: colors.surfaceBackground,
              borderColor: edgeFunctionColor + '30',
            },
          ]}
        >
          <View style={edgeFunctionsStyles.functionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="calculator" size={24} color={edgeFunctionColor} />
              <ThemedText
                style={[
                  edgeFunctionsStyles.functionTitle,
                  { color: colors.bodyText },
                ]}
              >
                process-data
              </ThemedText>
            </View>
          </View>
          <ThemedText
            style={[
              edgeFunctionsStyles.functionDescription,
              { color: colors.actionDescription },
            ]}
          >
            Processes an array of numbers and performs operations like sum, average, max, or min.
          </ThemedText>
          <View style={edgeFunctionsStyles.inputContainer}>
            <TextInput
              style={[
                edgeFunctionsStyles.input,
                {
                  backgroundColor: colors.inputBackground || colors.surfaceBackground,
                  color: colors.bodyText,
                  borderColor: colors.surfaceBorder,
                },
              ]}
              value={dataInput}
              onChangeText={setDataInput}
              placeholder="Enter numbers separated by commas (e.g., 1,2,3,4,5)"
              placeholderTextColor={colors.actionDescription}
            />
            <View style={edgeFunctionsStyles.operationButtons}>
              {(['sum', 'average', 'max', 'min'] as const).map((op) => (
                <TouchableOpacity
                  key={op}
                  onPress={() => handleProcessData(op)}
                  disabled={state.isLoading}
                  style={[
                    edgeFunctionsStyles.operationButton,
                    {
                      backgroundColor: state.isLoading
                        ? colors.surfaceBorder
                        : edgeFunctionColor + '15',
                      borderColor: edgeFunctionColor + '30',
                    },
                  ]}
                >
                  <ThemedText
                    style={[
                      edgeFunctionsStyles.operationButtonText,
                      {
                        color: state.isLoading ? colors.actionDescription : edgeFunctionColor,
                        textTransform: 'capitalize',
                      },
                    ]}
                  >
                    {op}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {state.processResult && (
            <View
              style={[
                edgeFunctionsStyles.resultContainer,
                {
                  backgroundColor: edgeFunctionColor + '10',
                  borderWidth: 1,
                  borderColor: edgeFunctionColor + '30',
                },
              ]}
            >
              <View style={edgeFunctionsStyles.resultRow}>
                <ThemedText style={[edgeFunctionsStyles.resultLabel, { color: colors.labelText }]}>
                  Operation:
                </ThemedText>
                <ThemedText style={[edgeFunctionsStyles.resultValue, { color: edgeFunctionColor, textTransform: 'capitalize' }]}>
                  {state.processResult.operation}
                </ThemedText>
              </View>
              <View style={edgeFunctionsStyles.resultRow}>
                <ThemedText style={[edgeFunctionsStyles.resultLabel, { color: colors.labelText }]}>
                  Result:
                </ThemedText>
                <ThemedText style={[edgeFunctionsStyles.resultValue, { color: edgeFunctionColor, fontSize: 18 }]}>
                  {state.processResult.result.toFixed(2)}
                </ThemedText>
              </View>
              <View style={edgeFunctionsStyles.resultRow}>
                <ThemedText style={[edgeFunctionsStyles.resultLabel, { color: colors.labelText }]}>
                  Count:
                </ThemedText>
                <ThemedText style={[edgeFunctionsStyles.resultValue, { color: edgeFunctionColor }]}>
                  {state.processResult.count}
                </ThemedText>
              </View>
            </View>
          )}
        </View>

        {/* Note about deployment */}
        <View
          style={[
            supabaseCasesScreenStyles.card,
            {
              borderColor: edgeFunctionColor + '30',
              backgroundColor: edgeFunctionColor + '10',
            },
          ]}
        >
          <Ionicons name="information-circle" size={24} color={edgeFunctionColor} />
          <ThemedText
            style={{
              color: colors.bodyText,
              fontWeight: '600',
              marginTop: 8,
            }}
          >
            Note
          </ThemedText>
          <ThemedText
            style={{
              color: colors.actionDescription,
              fontSize: 14,
              marginTop: 4,
              lineHeight: 20,
            }}
          >
            Edge Functions need to be deployed to your Supabase project before they can be invoked. Use the Supabase CLI to deploy: `supabase functions deploy hello-world` and `supabase functions deploy process-data`.
          </ThemedText>
        </View>

        {/* Error Display */}
        {state.error && (
          <View
            style={[
              supabaseCasesScreenStyles.card,
              {
                borderColor: '#ef4444',
                backgroundColor: '#ef444410',
              },
            ]}
          >
            <Ionicons name="alert-circle" size={24} color="#ef4444" />
            <ThemedText
              style={{
                color: '#ef4444',
                fontWeight: '600',
                marginTop: 8,
              }}
            >
              Error
            </ThemedText>
            <ThemedText
              style={{
                color: '#ef4444',
                fontSize: 14,
                marginTop: 4,
              }}
            >
              {state.error}
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

