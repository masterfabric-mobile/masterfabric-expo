import { ThemedText } from '@/src/shared/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { useDatabaseFunctionsViewModel } from '../hooks/use-database-functions-view-model';
import { databaseFunctionsStyles } from '../styles/database-functions.styles';
import { supabaseCasesScreenStyles } from '../styles/supabase-cases-screen.styles';

const supabaseGreen = '#3ECF8E';
const functionColor = '#8B5CF6';

interface DatabaseFunctionsCaseViewProps {
  user: any | null;
  isConnected: boolean;
  onBack: () => void;
}

export function DatabaseFunctionsCaseView({
  user,
  isConnected,
  onBack,
}: DatabaseFunctionsCaseViewProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { state, actions } = useDatabaseFunctionsViewModel(user, isConnected);

  const handleCalculateOrderTotal = async () => {
    // Example items for calculation
    const exampleItems = [
      { quantity: 2, price: 29.99 },
      { quantity: 1, price: 49.99 },
      { quantity: 3, price: 9.99 },
    ];
    await actions.calculateOrderTotal(exampleItems);
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
            Database Functions
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
            Supabase is not connected. Please connect to Supabase to use database functions.
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
          Database Functions
        </ThemedText>
      </View>

      <ScrollView
        style={supabaseCasesScreenStyles.scrollView}
        contentContainerStyle={databaseFunctionsStyles.scrollContent}
      >
        {/* Function 1: Product Statistics */}
        <View
          style={[
            databaseFunctionsStyles.functionCard,
            {
              backgroundColor: colors.surfaceBackground,
              borderColor: functionColor + '30',
            },
          ]}
        >
          <View style={databaseFunctionsStyles.functionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="stats-chart" size={24} color={functionColor} />
              <ThemedText
                style={[
                  databaseFunctionsStyles.functionTitle,
                  { color: colors.bodyText },
                ]}
              >
                get_product_statistics()
              </ThemedText>
            </View>
          </View>
          <ThemedText
            style={[
              databaseFunctionsStyles.functionDescription,
              { color: colors.actionDescription },
            ]}
          >
            Returns aggregate statistics about products including total count, average price, stock levels, and category distribution.
          </ThemedText>
          <TouchableOpacity
            onPress={actions.fetchProductStatistics}
            disabled={state.isLoading}
            style={[
              databaseFunctionsStyles.button,
              {
                backgroundColor: state.isLoading ? colors.surfaceBorder : functionColor,
              },
            ]}
          >
            {state.isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <ThemedText style={[databaseFunctionsStyles.buttonText, { color: '#FFFFFF' }]}>
                Execute Function
              </ThemedText>
            )}
          </TouchableOpacity>
          {state.productStats && (
            <View
              style={[
                databaseFunctionsStyles.resultContainer,
                {
                  backgroundColor: functionColor + '10',
                  borderWidth: 1,
                  borderColor: functionColor + '30',
                },
              ]}
            >
              <View style={databaseFunctionsStyles.resultRow}>
                <ThemedText style={[databaseFunctionsStyles.resultLabel, { color: colors.labelText }]}>
                  Total Products:
                </ThemedText>
                <ThemedText style={[databaseFunctionsStyles.resultValue, { color: functionColor }]}>
                  {state.productStats.total_products}
                </ThemedText>
              </View>
              <View style={databaseFunctionsStyles.resultRow}>
                <ThemedText style={[databaseFunctionsStyles.resultLabel, { color: colors.labelText }]}>
                  Average Price:
                </ThemedText>
                <ThemedText style={[databaseFunctionsStyles.resultValue, { color: functionColor }]}>
                  ${state.productStats.average_price}
                </ThemedText>
              </View>
              <View style={databaseFunctionsStyles.resultRow}>
                <ThemedText style={[databaseFunctionsStyles.resultLabel, { color: colors.labelText }]}>
                  Price Range:
                </ThemedText>
                <ThemedText style={[databaseFunctionsStyles.resultValue, { color: functionColor }]}>
                  ${state.productStats.min_price} - ${state.productStats.max_price}
                </ThemedText>
              </View>
              <View style={databaseFunctionsStyles.resultRow}>
                <ThemedText style={[databaseFunctionsStyles.resultLabel, { color: colors.labelText }]}>
                  Total Stock:
                </ThemedText>
                <ThemedText style={[databaseFunctionsStyles.resultValue, { color: functionColor }]}>
                  {state.productStats.total_stock}
                </ThemedText>
              </View>
              <View style={databaseFunctionsStyles.resultRow}>
                <ThemedText style={[databaseFunctionsStyles.resultLabel, { color: colors.labelText }]}>
                  Low Stock Items:
                </ThemedText>
                <ThemedText style={[databaseFunctionsStyles.resultValue, { color: functionColor }]}>
                  {state.productStats.low_stock_count}
                </ThemedText>
              </View>
              <View style={databaseFunctionsStyles.resultRow}>
                <ThemedText style={[databaseFunctionsStyles.resultLabel, { color: colors.labelText }]}>
                  Categories:
                </ThemedText>
                <ThemedText style={[databaseFunctionsStyles.resultValue, { color: functionColor }]}>
                  {state.productStats.categories_count}
                </ThemedText>
              </View>
            </View>
          )}
        </View>

        {/* Function 2: User Order Summary */}
        {user && (
          <View
            style={[
              databaseFunctionsStyles.functionCard,
              {
                backgroundColor: colors.surfaceBackground,
                borderColor: functionColor + '30',
              },
            ]}
          >
            <View style={databaseFunctionsStyles.functionHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="receipt" size={24} color={functionColor} />
                <ThemedText
                  style={[
                    databaseFunctionsStyles.functionTitle,
                    { color: colors.bodyText },
                  ]}
                >
                  get_user_order_summary(user_id)
                </ThemedText>
              </View>
            </View>
            <ThemedText
              style={[
                databaseFunctionsStyles.functionDescription,
                { color: colors.actionDescription },
              ]}
            >
              Returns order statistics for a specific user including total orders, spending, and order status breakdown.
            </ThemedText>
            <TouchableOpacity
              onPress={() => actions.fetchUserOrderSummary(user.id)}
              disabled={state.isLoading}
              style={[
                databaseFunctionsStyles.button,
                {
                  backgroundColor: state.isLoading ? colors.surfaceBorder : functionColor,
                },
              ]}
            >
              {state.isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <ThemedText style={[databaseFunctionsStyles.buttonText, { color: '#FFFFFF' }]}>
                  Execute Function
                </ThemedText>
              )}
            </TouchableOpacity>
            {state.orderSummary && (
              <View
                style={[
                  databaseFunctionsStyles.resultContainer,
                  {
                    backgroundColor: functionColor + '10',
                    borderWidth: 1,
                    borderColor: functionColor + '30',
                  },
                ]}
              >
                <View style={databaseFunctionsStyles.resultRow}>
                  <ThemedText style={[databaseFunctionsStyles.resultLabel, { color: colors.labelText }]}>
                    Total Orders:
                  </ThemedText>
                  <ThemedText style={[databaseFunctionsStyles.resultValue, { color: functionColor }]}>
                    {state.orderSummary.total_orders}
                  </ThemedText>
                </View>
                <View style={databaseFunctionsStyles.resultRow}>
                  <ThemedText style={[databaseFunctionsStyles.resultLabel, { color: colors.labelText }]}>
                    Total Spent:
                  </ThemedText>
                  <ThemedText style={[databaseFunctionsStyles.resultValue, { color: functionColor }]}>
                    ${state.orderSummary.total_spent.toFixed(2)}
                  </ThemedText>
                </View>
                <View style={databaseFunctionsStyles.resultRow}>
                  <ThemedText style={[databaseFunctionsStyles.resultLabel, { color: colors.labelText }]}>
                    Avg Order Value:
                  </ThemedText>
                  <ThemedText style={[databaseFunctionsStyles.resultValue, { color: functionColor }]}>
                    ${state.orderSummary.average_order_value}
                  </ThemedText>
                </View>
                <View style={databaseFunctionsStyles.resultRow}>
                  <ThemedText style={[databaseFunctionsStyles.resultLabel, { color: colors.labelText }]}>
                    Pending Orders:
                  </ThemedText>
                  <ThemedText style={[databaseFunctionsStyles.resultValue, { color: functionColor }]}>
                    {state.orderSummary.pending_orders}
                  </ThemedText>
                </View>
                <View style={databaseFunctionsStyles.resultRow}>
                  <ThemedText style={[databaseFunctionsStyles.resultLabel, { color: colors.labelText }]}>
                    Completed Orders:
                  </ThemedText>
                  <ThemedText style={[databaseFunctionsStyles.resultValue, { color: functionColor }]}>
                    {state.orderSummary.completed_orders}
                  </ThemedText>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Function 3: Calculate Order Total */}
        <View
          style={[
            databaseFunctionsStyles.functionCard,
            {
              backgroundColor: colors.surfaceBackground,
              borderColor: functionColor + '30',
            },
          ]}
        >
          <View style={databaseFunctionsStyles.functionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="calculator" size={24} color={functionColor} />
              <ThemedText
                style={[
                  databaseFunctionsStyles.functionTitle,
                  { color: colors.bodyText },
                ]}
              >
                calculate_order_total(items)
              </ThemedText>
            </View>
          </View>
          <ThemedText
            style={[
              databaseFunctionsStyles.functionDescription,
              { color: colors.actionDescription },
            ]}
          >
            Calculates the total price from an array of order items (quantity × price for each item).
          </ThemedText>
          <View
            style={[
              databaseFunctionsStyles.codeBlock,
              {
                backgroundColor: colors.inputBackground || colors.surfaceBackground,
                borderWidth: 1,
                borderColor: colors.surfaceBorder,
              },
            ]}
          >
            <ThemedText style={{ color: colors.bodyText, fontFamily: 'monospace', fontSize: 12 }}>
              Example: [2×$29.99, 1×$49.99, 3×$9.99]
            </ThemedText>
          </View>
          <TouchableOpacity
            onPress={handleCalculateOrderTotal}
            disabled={state.isLoading}
            style={[
              databaseFunctionsStyles.button,
              {
                backgroundColor: state.isLoading ? colors.surfaceBorder : functionColor,
              },
            ]}
          >
            {state.isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <ThemedText style={[databaseFunctionsStyles.buttonText, { color: '#FFFFFF' }]}>
                Execute Function
              </ThemedText>
            )}
          </TouchableOpacity>
          {state.calculationResult !== null && (
            <View
              style={[
                databaseFunctionsStyles.resultContainer,
                {
                  backgroundColor: functionColor + '10',
                  borderWidth: 1,
                  borderColor: functionColor + '30',
                },
              ]}
            >
              <View style={databaseFunctionsStyles.resultRow}>
                <ThemedText style={[databaseFunctionsStyles.resultLabel, { color: colors.labelText }]}>
                  Calculated Total:
                </ThemedText>
                <ThemedText style={[databaseFunctionsStyles.resultValue, { color: functionColor, fontSize: 18 }]}>
                  ${state.calculationResult.toFixed(2)}
                </ThemedText>
              </View>
            </View>
          )}
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

